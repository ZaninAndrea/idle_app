import React from "react"

export default function BuildingDisplay({ building, money, upgrade }) {
    const availableLevels = building.availableLevels(money)

    return (
        <p key={"building" + building.name}>
            {building.toString()}{" "}
            {availableLevels > 0 && <button onClick={upgrade}>+1</button>}
            <span> Need {building.upgradeCost} coins for next level</span>
        </p>
    )
}
