const COST_EXP_FACTOR = 1.25

class Building {
    constructor({
        name,
        baseIncome,
        baseTimer,
        powerUps,
        fill,
        level,
        updatedAt,
        cost,
    }) {
        this.name = name
        this.baseIncome = baseIncome
        this.baseTimer = baseTimer
        this.powerUps = powerUps
        this.fill = fill
        this.level = level
        this.updatedAt = new Date(updatedAt)
        this.cost = cost
        this._justFilled = true
    }

    toJSON() {
        console.log("converted to json")
        return {
            name: this.name,
            baseIncome: this.baseIncome,
            baseTimer: this.baseTimer,
            powerUps: this.powerUps.map((powerUp) => ({ ...powerUp })),
            fill: this.fill,
            level: this.level,
            updatedAt: this.updatedAt,
            cost: this.cost,
        }
    }

    justFilled() {
        if (this._justFilled) {
            this._justFilled = false
            return true
        }

        return false
    }
    get timer() {
        const multiplier = this.powerUps.reduce(
            (acc, curr) => (curr.unlocked ? acc * curr.timerMultiplier : acc),
            1
        )
        return this.baseTimer * multiplier
    }
    get income() {
        const multiplier = this.powerUps.reduce(
            (acc, curr) => (curr.unlocked ? acc + curr.incomeMultiplier : acc),
            1
        )
        return this.baseIncome * multiplier * this.level
    }

    toString() {
        return `${this.name} (${this.level}) ${Math.floor(this.fill)}/${
            this.timer
        }`
    }

    availableLevels(money) {
        let count = 0
        let cost = this.cost * Math.pow(COST_EXP_FACTOR, this.level)

        while (money >= cost) {
            count++
            money -= Math.ceil(cost)
            cost *= COST_EXP_FACTOR
        }

        return count
    }

    get upgradeCost() {
        return Math.ceil(this.cost * Math.pow(COST_EXP_FACTOR, this.level))
    }

    upgrade() {
        this.level += 1
        this.fill = (this.fill * (this.level - 1)) / this.level

        return Math.ceil(this.cost * Math.pow(COST_EXP_FACTOR, this.level - 1))
    }

    unlockPowerUp(powerUpIdx) {
        this.powerUps[powerUpIdx].unlocked = true

        return this.powerUps[powerUpIdx].cost
    }

    update() {
        let update = { moneyDiff: 0, thumbsUpDiff: 0 }

        if (this.level > 0) {
            const msDiff = new Date() - this.updatedAt
            this.fill += msDiff / 1000

            const cycles = Math.floor(this.fill / this.timer)
            this.fill -= this.timer * cycles
            update.moneyDiff += this.income * cycles

            if (cycles > 0) {
                this._justFilled = true
            }
        }

        this.updatedAt = new Date()
        return update
    }
}

const buildings = [
    new Building({
        name: "Kebabbaro",
        baseIncome: 5,
        baseTimer: 5,
        powerUps: [
            {
                name: "Aperto 24/7",
                incomeMultiplier: 1,
                cost: 100,
                levelRequirement: 5,
                timerMultiplier: 1,
                unlocked: false,
            },
        ],
        fill: 0,
        level: 1,
        updatedAt: new Date(),
        cost: 1000,
    }),
    new Building({
        name: "Piadineria",
        baseIncome: 300,
        baseTimer: 30,
        powerUps: [
            {
                name: "Piadine alla Nutella",
                incomeMultiplier: 1,
                cost: 100,
                levelRequirement: 5,
                timerMultiplier: 1,
                unlocked: false,
            },
        ],
        fill: 0,
        level: 0,
        updatedAt: new Date(),
        cost: 15000,
    }),
    new Building({
        name: "Burger Empire",
        baseIncome: 100000,
        baseTimer: 600,
        powerUps: [
            {
                name: "Panini extra-unti",
                incomeMultiplier: 1,
                cost: 100,
                levelRequirement: 5,
                timerMultiplier: 1,
                unlocked: false,
            },
        ],
        fill: 0,
        level: 0,
        updatedAt: new Date(),
        cost: 500000,
    }),
]

module.exports = { Building, buildings }
