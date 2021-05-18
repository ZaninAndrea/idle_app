import "./App.css"
import CloudComponent from "./CloudComponent"
import LoginGuard from "./LoginGuard"
import { Building, buildings } from "./buildings"
import BuildingDisplay from "./BuildingDisplay"

class App extends CloudComponent {
    constructor(props) {
        super(props)

        this.updateTimer = setInterval(this.updateGameState, 100)
        this.syncTimer = setInterval(this.syncOnline, 15000)
    }

    updateGameState = () => {
        if (!this.gameState) return

        for (let i = 0; i < this.gameState.buildings.length; i++) {
            const { moneyDiff, thumbsUpDiff } =
                this.gameState.buildings[i].update()

            this.gameState.money += moneyDiff
            this.gameState.thumbsUp += thumbsUpDiff
        }

        this.setState({
            game: {
                ...this.gameState,
            },
        })
    }

    syncOnline = () => {
        this.setState(({ game }) => ({ cloud: { ...game } }))
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
            cloud: { ...this.gameState },
        })
    }

    render() {
        if (!this.state.cloud) {
            return ""
        }

        if (this.state.cloud.money === undefined) {
            console.log("Override cloud state")
            this.setState({
                cloud: {
                    money: 0,
                    thumbsUp: 0,
                    buildings: buildings,
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
            <div style={{ fontSize: "18px", padding: "8px", margin: "auto" }}>
                <p>Money: {this.state.game.money}</p>
                <p>Thumbs Up: {this.state.game.thumbsUp}</p>
                {this.state.game.buildings.map((building, idx) => (
                    <BuildingDisplay
                        building={building}
                        buildingId={idx}
                        money={this.state.game.money}
                        upgrade={() => this.upgradeBuilding(idx)}
                    />
                ))}
            </div>
        )
    }
}

export default () => (
    <LoginGuard server="http://localhost:8080">
        <App />
    </LoginGuard>
)
