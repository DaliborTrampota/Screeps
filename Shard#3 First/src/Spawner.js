const { settings } = require('./Constants')
const population = require('./Population')
const Util = require('./Util')

module.exports.check = async (room) => {

    Util.cleanDead()
    let settingsSorted = Object.entries(settings).sort((a, b) => b[1].priority - a[1].priority)

    for(let [role, data] of settingsSorted){
        let count = Util.getCountFor(role)
        let name = 1
        let spawn = _.find(Game.spawns, s => s.room.name == room.name)
        
        let populationData = population[room.name][role]
        while(count < populationData.count){
            if(!spawn.spawning) {
                const res = require(`./roles/${data.name}`).spawn(
                    spawn,
                    `${data.name} ${name}`,
                    { role, ...data.defaultMemory },
                    populationData.type
                )

                if(res === OK) name++
                else if(res == ERR_NAME_EXISTS) {
                    name++
                    continue
                }
                if(count === 0 && res !== OK) return //Makes sure if there is no creep with the role it waits for the required energy for it to spawn one
            }
            count++
        }
    }
}