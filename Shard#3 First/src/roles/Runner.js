const { states, settings } = require('./Constants')
const Base = require('./Base')
const Util = require('../Util')

module.exports = class Runner extends Base{


    /** @param {Creep} creep */
    static run(creep){

        this.checkState(creep)
        
        if(creep.memory.state === states.WITHDRAW){
            let structure = Game.getObjectById(creep.memory.withdrawTarget)
            if(!structure || structure.resourceType !== 'energy' && structure.store[RESOURCE_ENERGY] === 0) return delete creep.memory.withdrawTarget
            
            let act = creep.withdraw(structure, RESOURCE_ENERGY)
            if(act === OK) return
            if(act === ERR_INVALID_TARGET) act = creep.pickup(structure)
            if(act === ERR_NOT_IN_RANGE) creep.moveTo(structure, {visualizePathStyle: { stroke: settings[creep.memory.role].pathColor }})
            return
        }

        if(creep.memory.state === states.DEPOSIT){
            let structure = Game.getObjectById(creep.memory.depositTarget)
            if(!structure) return delete creep.memory.depositTarget

            const transfer = creep.transfer(structure, RESOURCE_ENERGY)
            if(transfer === ERR_NOT_IN_RANGE) creep.moveTo(structure, {visualizePathStyle: { stroke: settings[creep.memory.role].pathColor }})
            else if(transfer === ERR_FULL) delete creep.memory.depositTarget
            return
        }

        /*if(creep.memory.state === states.PULLING){
            let builders = _.filter(Game.creeps, creep => creep.memory.role == roles.BUILDER)
            if(creep.pull(builders[0]) === ERR_NOT_IN_RANGE)
                creep.moveTo(builders[0])
        }*/
    }

    /** @param {Creep} creep */
    static checkState(creep){
        if(creep.memory.state === states.WITHDRAW){
            if(creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                creep.memory.state = states.DEPOSIT
                return delete creep.memory.withdrawTarget
            }

            if(!creep.memory.withdrawTarget){
                let target = Util.findEnergy(creep)
                if(target) creep.memory.withdrawTarget = target.id
            }
        }

        if(creep.memory.state === states.DEPOSIT){
            if(creep.store.getUsedCapacity() === 0) {
                creep.memory.state = states.WITHDRAW
                return delete creep.memory.depositTarget
            }

            if(!creep.memory.depositTarget){
                let target = Util.findDepositTarget(creep)
                if(target) creep.memory.depositTarget = target.id
            }
        }
    }

}