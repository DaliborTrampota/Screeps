const { settings } = require(`./Constants`) 

module.exports.check = async () => {
    cleanDead()

    let name = Object.keys(Game.creeps).length
    for(let role in settings){
        let count = getCountFor(role)
        let spawn = Game.spawns['Spawn1']
        while(count < settings[role].population){
            if(!spawn.spawning) {
                const res = require(`./${settings[role].name}.js`).spawn(spawn, `${settings[role].name} ${name + 1}`, { memory: {
                    role: role,
                    ...settings[role].defaultMemory
                }})

                if(res == OK) name++
                else if(res == ERR_NAME_EXISTS) {
                    name++
                    continue
                }
            }
            count++
        }
    }
}

function getCountFor(role){
    return _.filter(Game.creeps, (creep) => creep.memory.role == role).length
}

function cleanDead(){
    let deleted = false
    for(let creepName in Memory.creeps){
        if(!Game.creeps[creepName]){
            deleted = true
            delete Memory.creeps[creepName]
        }
    }

    if(deleted){
        for(let r in Game.rooms){
            for(let sID in Memory.sources[r]) Memory.sources[r][sID] = 0
        }
    
        for(let creepName in Game.creeps){
            let c = Game.creeps[creepName]
            if(!c.memory.sourceID) continue
            Memory.sources[c.room.name][c.memory.sourceID]++
        }
    }
    
}