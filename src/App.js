import "./App.css"
import "./nes.css"
import CloudComponent from "./CloudComponent"
import LoginGuard from "./LoginGuard"
import { Building, buildings } from "./buildings"
import cities from "./cities"
import BuildingDisplay from "./BuildingDisplay"
import { displayNumber } from "./utils"

class App extends CloudComponent {
    constructor(props) {
        super(props)

        this.updateTimer = setInterval(this.updateGameState, 100)
        this.syncTimer = setInterval(this.syncOnline, 15000)
    }

    updateGameState = () => {
        if (!this.gameState) return

        for (let i = 0; i < this.gameState.buildings.length; i++) {
            const moneyDiff = this.gameState.buildings[i].update()

            this.gameState.money +=
                moneyDiff * cities[this.gameState.city].multiplier
        }

        this.setState({
            game: {
                ...this.gameState,
            },
        })
    }

    syncOnline = () => {
        this.setState(({ game }) => ({
            cloud: {
                ...game,
                buildings: game.buildings.map((building) => building.toJSON()),
            },
        }))
    }

    componentWillUnmount = () => {
        clearInterval(this.updateTimer)
        clearInterval(this.syncTimer)
    }

    upgradeBuilding = (idx) => {
        this.gameState.money -= this.gameState.buildings[idx].upgrade()

        this.setState({
            game: {
                ...this.gameState,
            },
            cloud: {
                ...this.gameState,
                buildings: this.gameState.buildings.map((building) =>
                    building.toJSON()
                ),
            },
        })
    }

    unlockPowerUp = (buildingIdx, powerUpIdx) => {
        this.gameState.money -=
            this.gameState.buildings[buildingIdx].unlockPowerUp(powerUpIdx)

        this.setState({
            game: {
                ...this.gameState,
            },
            cloud: {
                ...this.gameState,
                buildings: this.gameState.buildings.map((building) =>
                    building.toJSON()
                ),
            },
        })
    }

    moveToNextCity = () => {
        this.gameState.money = 0
        this.gameState.buildings = buildings
        this.gameState.city++

        this.setState({
            game: {
                ...this.gameState,
            },
            cloud: {
                ...this.gameState,
                buildings: this.gameState.buildings.map((building) =>
                    building.toJSON()
                ),
            },
        })
    }

    render() {
        if (!this.state.cloud) {
            return ""
        }

        const hardReset = false
        if (this.state.cloud.money === undefined || hardReset) {
            console.log("Override cloud state")
            this.setState({
                cloud: {
                    city: 0,
                    money: 0,
                    buildings: buildings.map((building) => building.toJSON()),
                },
            })
            return ""
        }

        if (this.gameState === undefined) {
            console.log("Load cloud save")
            this.gameState = {
                ...this.state.cloud,
                buildings: this.state.cloud.buildings.map(
                    (data) => new Building(data)
                ),
            }
        }
        if (this.state.game === undefined) {
            console.log("Initialize displayed game state")
            this.setState({
                game: {
                    ...this.gameState,
                },
            })
            return ""
        }

        return (
            <div
                className="main"
                style={{ fontSize: "18px", padding: "8px", margin: "auto" }}
            >
                <div className="resources">
                    <div className="resources-money">
                        <span className="nes-text is-warning">
                            Coins: {displayNumber(this.state.game.money)}
                        </span>
                    </div>
                    <div className="resources-city">
                        <span className="nes-text">
                            {cities[this.state.game.city].name}
                        </span>
                    </div>
                </div>
                <div className="buildings">
                    {this.state.game.buildings.map(
                        (building, idx) =>
                            (building.level > 0 ||
                                this.state.game.buildings[idx - 1].level >
                                    0) && (
                                <BuildingDisplay
                                    building={building}
                                    buildingId={idx}
                                    money={this.state.game.money}
                                    upgradeBuilding={() =>
                                        this.upgradeBuilding(idx)
                                    }
                                    unlockPowerUp={(powerUpIdx) =>
                                        this.unlockPowerUp(idx, powerUpIdx)
                                    }
                                />
                            )
                    )}
                </div>
                <div className="prestige">
                    {cities.length > this.state.game.city + 1 &&
                    cities[this.state.game.city + 1].cost <=
                        this.state.game.money ? (
                        <button
                            onClick={this.moveToNextCity}
                            class={
                                "nes-btn is-small is-success prestige-button"
                            }
                        >
                            Sell everything and move to{" "}
                            {cities[this.state.game.city + 1].name}
                        </button>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        )
    }
}

export default () => (
    <LoginGuard server="http://localhost:8080">
        <App />
    </LoginGuard>
)
