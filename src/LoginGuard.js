import React from "react"
import "./nes.css"
import { buildings } from "./buildings"

export default class LoginGuard extends React.Component {
    constructor(props) {
        super(props)

        localStorage.setItem("serverUrl", props.server)
        this.state = {
            email: "",
            password: "",
            login: true,
        }
    }

    login = () => {
        fetch(
            `${this.props.server}/login?email=${this.state.email}&password=${this.state.password}`,
            {
                method: "POST",
                headers: {},
            }
        )
            .then(async (response) => {
                const res = await response.json()

                if (res.error) alert("Failed authentication: " + res.error)

                localStorage.setItem("token", res.token)
                this.forceUpdate()
            })
            .catch((err) => {
                throw new Error(err)
            })
    }

    signup = () => {
        fetch(
            `${this.props.server}/user?email=${this.state.email}&password=${this.state.password}`,
            {
                method: "POST",
                headers: {},
                body: {
                    city: 0,
                    money: 0,
                    buildings: buildings.map((building) => building.toJSON()),
                },
            }
        )
            .then(async (response) => {
                const res = await response.json()

                if (res.error) alert("Failed authentication: " + res.error)

                localStorage.setItem("token", res.token)
                this.forceUpdate()
            })
            .catch((err) => {
                throw new Error(err)
            })
    }

    render() {
        if (localStorage.getItem("token")) return <>{this.props.children}</>

        if (this.state.login)
            return (
                <div className="nes-container with-title is-centered login">
                    <p className="title">Login</p>
                    <div class="nes-field is-inline">
                        <label for="inline_field">Email</label>
                        <input
                            value={this.state.email}
                            onChange={(e) =>
                                this.setState({ email: e.target.value })
                            }
                            className="nes-input"
                        />
                    </div>
                    <br />
                    <div class="nes-field is-inline">
                        <label for="inline_field">Password</label>
                        <input
                            value={this.state.password}
                            type="password"
                            onChange={(e) =>
                                this.setState({ password: e.target.value })
                            }
                            onKeyPress={(e) => {
                                if (e.key === "Enter") this.login()
                            }}
                            className="nes-input"
                        />
                    </div>
                    <br />
                    <button onClick={this.login} className="nes-btn">
                        Login
                    </button>
                    <br />
                    <br />
                    <a
                        className="signup-link"
                        onClick={() => this.setState({ login: false })}
                    >
                        Sign up instead
                    </a>
                </div>
            )
        else
            return (
                <div className="nes-container with-title is-centered login">
                    <p className="title">Sign Up</p>
                    <div class="nes-field is-inline">
                        <label for="inline_field">Email</label>
                        <input
                            value={this.state.email}
                            onChange={(e) =>
                                this.setState({ email: e.target.value })
                            }
                            className="nes-input"
                        />
                    </div>
                    <br />
                    <div class="nes-field is-inline">
                        <label for="inline_field">Password</label>
                        <input
                            value={this.state.password}
                            type="password"
                            onChange={(e) =>
                                this.setState({ password: e.target.value })
                            }
                            onKeyPress={(e) => {
                                if (e.key === "Enter") this.login()
                            }}
                            className="nes-input"
                        />
                    </div>
                    <br />
                    <button onClick={this.login} className="nes-btn">
                        Sign Up
                    </button>
                    <br />
                    <br />
                    <a
                        className="signup-link"
                        onClick={() => this.setState({ login: true })}
                    >
                        Login instead
                    </a>
                </div>
            )
    }
}
