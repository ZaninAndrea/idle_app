import React from "react"
import { create as jsondifferCreate, formatters } from "jsondiffpatch"
import clonedeep from "lodash.clonedeep"

class PatchDispatcher {
    constructor(serverUrl, token) {
        if (!window.navigator)
            alert(
                "Your browser is not supported, you may have issues with synchronization"
            )
        this.queue = []
        this.emptying = false
        this.token = token
        this.serverUrl = serverUrl
        this.offline = !window.navigator.onLine

        this.unloadListener = window.addEventListener("beforeunload", (e) => {
            if (this.queue.length !== 0) {
                e.preventDefault()
                e.returnValue = ""
            }
        })
        this.onlineListener = window.addEventListener("online", () => {
            this.offline = false

            if (this.queue.length !== 0) this.empty()
        })
        this.offlineListener = window.addEventListener("offline", () => {
            this.offline = true
        })
    }

    extend(arr) {
        this.queue = this.queue.concat(arr)

        if (this.queue.length !== 0 && !this.emptying && !this.offline)
            this.empty()
    }

    async empty() {
        this.emptying = true

        if (this.queue.length === 0) {
            this.emptying = false
            return
        }

        const patch = this.queue.shift()

        await fetch(`${this.serverUrl}/user`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.token,
            },
            body: JSON.stringify([patch]),
        }).catch((e) => {
            if (e.message === "Failed to fetch") this.queue.unshift(patch)
            else throw e
        })

        if (!this.offline) this.empty()
    }
}

export default class CloudComponent extends React.Component {
    constructor(...args) {
        super(...args)

        this.state = { cloud: null }
        this.oldSetState = this.setState
        this.setState = this.newSetState

        this.differ = jsondifferCreate({
            arrays: { detectMove: false },
            textDiff: { minLength: Infinity },
        })

        const token = localStorage.getItem("token")
        const serverUrl = localStorage.getItem("serverUrl")

        if (!serverUrl) throw new Error("You need to pass serverUrl")
        this.serverUrl = serverUrl

        if (token) {
            this.token = token
            this.dispatcher = new PatchDispatcher(this.serverUrl, this.token)

            this.fetchCloud()
        } else {
            throw new Error("You need to pass credentials")
        }
    }

    fetchCloud = () => {
        fetch(`${this.serverUrl}/user`, {
            headers: { Authorization: "Bearer " + this.token },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.error) throw new Error(res.error)

                this.oldSetState({
                    cloud: res,
                })
            })
    }

    newSetState = (update, callback) => {
        const original = clonedeep(this.state.cloud)
        this.oldSetState(update, (...args) => {
            const current = this.state.cloud
            console.log("original", original)
            console.log("current", current)

            const delta = this.differ.diff(original, current)
            const patch = formatters.jsonpatch.format(delta)
            console.log(patch)

            this.dispatcher.extend(patch)

            if (callback) {
                callback(...args)
            }
        })
    }
}
