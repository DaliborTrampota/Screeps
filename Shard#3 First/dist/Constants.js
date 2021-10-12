const roles = {
    HARVESTER: 0,
    UPGRADER: 1,
    BUILDER: 2,
    RUNNER: 3,
    REPAIRER: 4,
    FIGHTER: 5
}

const states = {
    WITHDRAW: 0,
    DEPOSIT: 1,
    PULLING: 2
}

module.exports.USERNAME = "KokoNeot"
module.exports.WALL_THRESHOLD = 2500
module.exports.roles = roles
module.exports.states = states

module.exports.STORAGE_STRUCTS = [STRUCTURE_STORAGE, STRUCTURE_CONTAINER, STRUCTURE_LINK]
module.exports.PRIORITY_ENERGY = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER]

module.exports.settings = {
    [roles.HARVESTER]: {
        population: 3,
        priority: 1,
        parts: {
            base: [WORK, MOVE, CARRY],
            advanced: [WORK, WORK, WORK, MOVE, CARRY]
        },
        build: "advanced",
        name: "Harvester",
        defaultMemory: {}
    },
    [roles.UPGRADER]: {
        population: 1,
        priority: 5,
        parts: {
            base: [WORK, MOVE, CARRY],
            advanced: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
        },
        build: "advanced",
        name: "Upgrader",
        defaultMemory: { 
            upgrading: false 
        }
    },
    [roles.RUNNER]: {
        population: 2,
        priority: 2,
        parts: {
            base: [CARRY, CARRY, MOVE],
            advanced: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
        },
        build: "advanced",
        name: "Runner",
        defaultMemory: {
            state: states.WITHDRAW 
        }
    },
    [roles.BUILDER]: {
        population: 3,
        priority: 4,
        parts: {
            base: [WORK, CARRY, MOVE],
            advanced: [WORK, WORK, MOVE, MOVE, CARRY, CARRY]
        },
        build: "advanced",
        name: "Builder",
        defaultMemory: { 
            building: false 
        }
    },
    [roles.REPAIRER]: {
        population: 2,
        priority: 3,
        parts: {
            base: [WORK, CARRY, MOVE],
            advanced: [CARRY, CARRY, WORK, WORK, MOVE, MOVE]
        },
        build: "advanced",
        name: "Repairer",
        defaultMemory: { 
            repairing: false,
            repairQueue: []
        }
    },
    [roles.FIGHTER]: {
        population: 0,
        priority: 1,
        parts: {
            base: [TOUGH, ATTACK, MOVE],
            advanced: [TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE]
        },
        build: "advanced",
        name: "Fighter",
        defaultMemory: {}
    }
}