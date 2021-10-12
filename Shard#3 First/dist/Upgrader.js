const Base = require(`./Base`)
const Util = require(`./Util`)

module.exports = class Upgrader extends Base {


    /** @param {Creep} creep */
    static run(creep){
        this.checkState(creep)
        
        if(creep.memory.upgrading){
            if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE)
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' }})
            return
        }
        
        this.getEnergy(creep)
    }

    /** @param {Creep} creep */
    static checkState(creep){
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.upgrading = false
            creep.say('Refill');
        }
        if(!creep.memory.upgrading && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            creep.memory.upgrading = true
            creep.say('Upgrade');
        }
    }

}