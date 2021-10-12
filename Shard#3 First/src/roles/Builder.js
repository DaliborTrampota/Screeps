const Base = require('./Base')
const Util = require('../Util')

module.exports = class Builder extends Base {

    /** @param {Creep} creep */
    static run(creep){
        
        this.checkState(creep)

        if(creep.memory.building){
            let structure = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)
            if(creep.build(structure) === ERR_NOT_IN_RANGE)
                creep.moveTo(structure, { visualizePathStyle: { stroke: '#ffffff' }})
            return
        }
        // !creep.memory.upgrading
        this.getEnergy(creep)
    }

    /** @param {Creep} creep */
    static checkState(creep){
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.building = false
            creep.say('Harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            creep.memory.building = true
            creep.say('Build');
        }
    }
}