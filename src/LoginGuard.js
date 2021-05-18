import React from "react"
import background from "./background.jpg"

export default class LoginGuard extends React.Component {
    constructor(props) {
        super(props)

        localStorage.setItem("serverUrl", props.server)
        this.state = {
            email: "",
            password: "",
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

                if (res.error)
                    throw new Error("Failed authentication: " + res.error)

                localStorage.setItem("token", res.token)
                this.forceUpdate()
            })
            .catch((err) => {
                throw new Error(err)
            })
    }

    render() {
        if (localStorage.getItem("token")) return <>{this.props.children}</>
        else
            return (
                <div className="login">
                    <img src={background} className="loginBackground" />
                    <div className="loginBox">
                        <div className="loginLogoBox" />
                        <div className="loginDataBox">
                            <input
                                value={this.state.email}
                                onChange={(e) =>
                                    this.setState({ email: e.target.value })
                                }
                            />
                            <br />
                            <input
                                value={this.state.password}
                                type="password"
                                onChange={(e) =>
                                    this.setState({ password: e.target.value })
                                }
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") this.login()
                                }}
                            />
                            <button onClick={this.login}>Login</button>
                        </div>
                    </div>
                </div>
            )
    }
}
