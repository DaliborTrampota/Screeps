const { roles } = require('./Constants')

module.exports = {
    "E48S15": { //Main
        [roles.HARVESTER]: { type: 'advanced', count: 4 },
        [roles.UPGRADER]: { type: 'advanced', count: 2 },
        [roles.BUILDER]: { type: 'advanced', count: 2 },
        [roles.RUNNER]: { type: 'advanced', count: 2 },
        [roles.REPAIRER]: { type: 'advanced', count: 3 },
        [roles.FIGHTER]: { type: 'advanced', count: 0 },
        [roles.SCOUT]: { type: 'base', count: 0 }
    },
    "E48S14": {
        [roles.HARVESTER]: { type: 'base', count: 2 },
        [roles.UPGRADER]: { type: 'base', count: 1 },
        [roles.BUILDER]: { type: 'base', count: 1 },
        [roles.RUNNER]: { type: 'base', count: 0 },
        [roles.REPAIRER]: { type: 'base', count: 0 },
        [roles.FIGHTER]: { type: 'base', count: 0 },
        [roles.SCOUT]: { type: 'base', count: 0 }
    }
}