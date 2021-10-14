const { settings, population } = require('./Constants')
const Util = require('./Util')

module.exports.check = async () => {

    Util.cleanDead()
    let settingsSorted = Object.entries(settings).sort((a, b) => b[1].priority - a[1].priority)

    for(let [role, data] of settingsSorted){
        let count = Util.getCountFor(role)
        let name = 1
        let spawn = Game.spawns['Spawn1']
        while(count < population[role]){
            if(!spawn.spawning) {
                const res = require(`./roles/${data.name}`).spawn(spawn, `${data.name} ${name}`, {
                    role, ...data.defaultMemory
                })

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