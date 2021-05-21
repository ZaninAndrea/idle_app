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
        let moneyDiff = 0

        if (this.level > 0) {
            const msDiff = new Date() - this.updatedAt
            this.fill += msDiff / 1000

            const cycles = Math.floor(this.fill / this.timer)
            this.fill -= this.timer * cycles
            moneyDiff += this.income * cycles

            if (cycles > 0) {
                this._justFilled = true
            }
        }

        this.updatedAt = new Date()
        return moneyDiff
    }
}

// First power up: 20 times more expensive than building, level 10
// Second power up: 100 times, level 18
// Third power up: 300 times, level 25

const buildings = [
    new Building({
        name: "Kebab place",
        baseIncome: 5,
        baseTimer: 5,
        powerUps: [
            {
                name: "Open 24/7",
                incomeMultiplier: 1,
                cost: 20_000,
                timerMultiplier: 1,
                unlocked: false,
            },
            {
                name: "Hot Sauce",
                incomeMultiplier: 0,
                cost: 100_000,
                timerMultiplier: 0.5,
                unlocked: false,
            },
            {
                name: "Wagyu Kebab",
                incomeMultiplier: 1.5,
                cost: 300_000,
                timerMultiplier: 0.7,
                unlocked: false,
            },
        ],
        fill: 0,
        level: 1,
        updatedAt: new Date(),
        cost: 1000,
    }),
    new Building({
        name: "Café",
        baseIncome: 450,
        baseTimer: 30,
        powerUps: [
            {
                name: "Frappuccino",
                incomeMultiplier: 1,
                cost: 300_000,
                timerMultiplier: 1,
                unlocked: false,
            },
            {
                name: "Bubble tea",
                incomeMultiplier: 0,
                cost: 1_500_000,
                timerMultiplier: 0.5,
                unlocked: false,
            },
            {
                name: "Espresso",
                incomeMultiplier: 1.5,
                cost: 5_000_000,
                timerMultiplier: 0.7,
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
                name: "Plant-based patties",
                incomeMultiplier: 1,
                cost: 10000000,
                timerMultiplier: 1,
                unlocked: false,
            },
            {
                name: "Drive-through",
                incomeMultiplier: 0,
                cost: 50000000,
                timerMultiplier: 0.5,
                unlocked: false,
            },
            {
                name: "Cheesy fries",
                incomeMultiplier: 1.5,
                cost: 150_000_000,
                timerMultiplier: 0.7,
                unlocked: false,
            },
        ],
        fill: 0,
        level: 0,
        updatedAt: new Date(),
        cost: 500000,
    }),
    new Building({
        name: "Pizzeria",
        baseIncome: 7_000_000,
        baseTimer: 900,
        powerUps: [
            {
                name: "Double mozzarella",
                incomeMultiplier: 1,
                cost: 500_000_000,
                timerMultiplier: 1,
                unlocked: false,
            },
            {
                name: "Take away",
                incomeMultiplier: 0,
                cost: 2_500_000_000,
                timerMultiplier: 0.5,
                unlocked: false,
            },
            {
                name: "Italian staff",
                incomeMultiplier: 1.5,
                cost: 7_500_000_000,
                timerMultiplier: 0.7,
                unlocked: false,
            },
        ],
        fill: 0,
        level: 0,
        updatedAt: new Date(),
        cost: 25_000_000,
    }),
    new Building({
        name: "Restaurant",
        baseIncome: 400_000_000,
        baseTimer: 1800,
        powerUps: [
            {
                name: "Kids menu",
                incomeMultiplier: 1,
                cost: 20_000_000_000,
                timerMultiplier: 1,
                unlocked: false,
            },
            {
                name: "Porcelain dinnerware",
                incomeMultiplier: 0,
                cost: 100_000_000_000,
                timerMultiplier: 0.5,
                unlocked: false,
            },
            {
                name: "Michelin star",
                incomeMultiplier: 1.5,
                cost: 300_000_000_000,
                timerMultiplier: 0.7,
                unlocked: false,
            },
        ],
        fill: 0,
        level: 0,
        updatedAt: new Date(),
        cost: 1_000_000_000,
    }),
    new Building({
        name: "Sushi Place",
        baseIncome: 75_000_000_000, // 20_000_000 per s
        baseTimer: 3600,
        powerUps: [
            {
                name: "All you can eat",
                incomeMultiplier: 1,
                cost: 2_000_000_000_000,
                timerMultiplier: 1,
                unlocked: false,
            },
            {
                name: "Caviar sushi",
                incomeMultiplier: 0,
                cost: 10_000_000_000_000,
                timerMultiplier: 0.5,
                unlocked: false,
            },
            {
                name: "Golden chopsticks",
                incomeMultiplier: 1.5,
                cost: 30_000_000_000_000,
                timerMultiplier: 0.7,
                unlocked: false,
            },
        ],
        fill: 0,
        level: 0,
        updatedAt: new Date(),
        cost: 100_000_000_000,
    }),
    new Building({
        name: "Banquet Hall",
        baseIncome: 36_000_000_000_000, // 5_000_000_000 per s
        baseTimer: 7200,
        powerUps: [
            {
                name: "Mariachi band",
                incomeMultiplier: 1,
                cost: 500_000_000_000_000,
                timerMultiplier: 1,
                unlocked: false,
            },
            {
                name: "Diamond chandelier",
                incomeMultiplier: 0,
                cost: 2_500_000_000_000_000,
                timerMultiplier: 0.5,
                unlocked: false,
            },
            {
                name: "Fireworks",
                incomeMultiplier: 1.5,
                cost: 7_500_000_000_000_000,
                timerMultiplier: 0.7,
                unlocked: false,
            },
        ],
        fill: 0,
        level: 0,
        updatedAt: new Date(),
        cost: 25_000_000_000_000,
    }),
]

module.exports = { Building, buildings }
