const Base = require('./Base')
const Util = require('../Util')

module.exports = class Harvester extends Base {

    /** @param {Creep} creep */
    static run(creep){
        if(creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0)
            return this.dropEnergy(creep)

        this.harvest(creep)
    }

    /** @param {Creep} creep */
    static harvest(creep){
        let source = Util.setSource(creep)
        if(!source) return
        
        if(creep.harvest(source) == ERR_NOT_IN_RANGE){
            creep.moveTo(source)
        }
    }
}