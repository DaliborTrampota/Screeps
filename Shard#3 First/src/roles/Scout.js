const Base = require('./Base')
const Util = require('../Util')
const { roles } = require('../Constants')

module.exports = class Builder extends Base {

    /** @param {Creep} creep */
    static run(creep){

        if(creep.store.getFreeCapacity(RESOURCE_ENERGY) !== 0)
            return this.getEnergy(creep)

        if(!creep.memory.flag) creep.memory.flag = this.getFlag()
        if(!creep.memory.flag) return this.idle(creep)


        if(creep.room.controller.my){
            creep.say('Harvesting mode')
            return creep.memory.role = roles.HARVESTER
        }
        if(creep.room.name == Game.flags[creep.memory.flag].room.name){
            if(creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE)
                creep.moveTo(creep.room.controller)
            return
        }

        creep.moveTo(Game.flags[creep.memory.flag])
    }

    static getFlag(){
        return Game.flags['RoomCapture'] ? "RoomCapture" : false
    }

}