const roles = {
    HARVESTER: 0,
    UPGRADER: 1,
    BUILDER: 2,
    RUNNER: 3,
    REPAIRER: 4,
    FIGHTER: 5
}

module.exports.USERNAME = "KokoNeot"
module.exports.WALL_THRESHOLD = 2500
module.exports.REPAIR_QUEUE_LEN = 5
module.exports.roles = roles

module.exports.STORAGE_STRUCTS = [STRUCTURE_STORAGE, STRUCTURE_CONTAINER, STRUCTURE_LINK]
module.exports.PRIORITY_ENERGY = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER]

module.exports.population = {
    [roles.HARVESTER]: 3,
    [roles.UPGRADER]: 1,
    [roles.BUILDER]: 1,
    [roles.RUNNER]: 0,
    [roles.REPAIRER]: 2,
    [roles.FIGHTER]: 0
}

const states = {
    WITHDRAW: 0,
    DEPOSIT: 1,
    PULLING: 2
}

const repairTypes = {
    NONE: -1,
    ROAD: 0,
    STRUCTURE: 1,
    WALL: 2
}

module.exports.repairTypes = repairTypes
module.exports.states = states

module.exports.settings = {
    [roles.HARVESTER]: {
        priority: 1,
        parts: {
            base: [WORK, MOVE, CARRY],
            advanced: [WORK, WORK, WORK, MOVE, CARRY]
        },
        build: "base",
        name: "Harvester",
        defaultMemory: {}
    },
    [roles.UPGRADER]: {
        priority: 5,
        parts: {
            base: [WORK, MOVE, CARRY],
            advanced: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
        },
        build: "base",
        name: "Upgrader",
        defaultMemory: { 
            upgrading: false 
        }
    },
    [roles.RUNNER]: {
        priority: 2,
        parts: {
            base: [CARRY, CARRY, MOVE],
            advanced: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
        },
        build: "advanced",
        name: "Runner",
        defaultMemory: {
            state: states.WITHDRAW 
        },
        pathColor: "#00ff00"
    },
    [roles.BUILDER]: {
        priority: 4,
        parts: {
            base: [WORK, CARRY, MOVE],
            advanced: [WORK, WORK, MOVE, MOVE, CARRY, CARRY]
        },
        build: "base",
        name: "Builder",
        defaultMemory: { 
            building: false 
        }
    },
    [roles.REPAIRER]: {
        priority: 3,
        parts: {
            base: [WORK, CARRY, MOVE],
            advanced: [CARRY, CARRY, WORK, WORK, MOVE, MOVE]
        },
        build: "base",
        name: "Repairer",
        defaultMemory: { 
            repairing: false,
            repairQueue: [],
            type: repairTypes.NONE
        },
        pathColor: "#ffff00" 
    },
    [roles.FIGHTER]: {
        priority: 1,
        parts: {
            base: [TOUGH, ATTACK, MOVE, MOVE],
            advanced: [TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE]
        },
        build: "advanced",
        name: "Fighter",
        defaultMemory: {}
    }
}