import React from "react"

export default function BuildingDisplay({
    building,
    money,
    upgradeBuilding,
    unlockPowerUp,
}) {
    const availableLevels = building.availableLevels(money)

    if (building.level > 0) {
        return (
            <div
                key={"building" + building.name}
                className="nes-container with-title is-centered"
            >
                <p className="title">{building.name}</p>
                <div className="level">
                    <p className="level-tag">Level: {building.level} </p>
                    <button
                        onClick={upgradeBuilding}
                        class={
                            availableLevels > 0
                                ? "nes-btn is-small is-warning"
                                : "nes-btn is-disabled is-small"
                        }
                        disabled={availableLevels === 0}
                    >
                        1UP for {building.upgradeCost} coins
                    </button>
                </div>
                <progress
                    class={
                        building.justFilled()
                            ? "nes-progress"
                            : "nes-progress animated"
                    }
                    value={building.fill}
                    max={building.timer}
                ></progress>
                <br />
                {building.powerUps.map((powerUp, powerUpIdx) => (
                    <div className="powerUp">
                        <p className="powerUp-name">
                            <span>{powerUp.name}</span>
                            {powerUp.incomeMultiplier ? (
                                <span className="nes-text is-warning">
                                    {" "}
                                    +{powerUp.incomeMultiplier * 100}
                                    %&nbsp;coins
                                </span>
                            ) : (
                                ""
                            )}
                            {powerUp.timerMultiplier != 1 ? (
                                <span className="nes-text is-primary">
                                    {" "}
                                    -{powerUp.timerMultiplier * 100}
                                    %&nbsp;service time
                                </span>
                            ) : (
                                ""
                            )}
                        </p>
                        {!powerUp.unlocked && (
                            <button
                                onClick={() => unlockPowerUp(powerUpIdx)}
                                class={
                                    money >= powerUp.cost
                                        ? "nes-btn is-small is-warning unlockPowerUp"
                                        : "nes-btn is-disabled is-small unlockPowerUp"
                                }
                                disabled={money < powerUp.cost}
                            >
                                Unlock for {powerUp.cost} coins
                            </button>
                        )}
                    </div>
                ))}
            </div>
        )
    } else {
        return (
            <div
                key={"building" + building.name}
                className="nes-container with-title is-centered"
            >
                <p class="title">{building.name}</p>
                <button
                    onClick={upgradeBuilding}
                    class={
                        availableLevels > 0
                            ? "nes-btn is-small is-warning unlockBuilding"
                            : "nes-btn is-disabled is-small unlockBuilding"
                    }
                    disabled={availableLevels === 0}
                >
                    Unlock building for {building.upgradeCost} coins
                </button>
            </div>
        )
    }
}
