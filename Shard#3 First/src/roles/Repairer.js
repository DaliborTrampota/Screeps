const { STORAGE_STRUCTS, REPAIR_QUEUE_LEN, WALL_THRESHOLD, repairTypes, roles } = require('../Constants')
const Base = require('./Base')
const Util = require('../Util')

module.exports = class Repairer extends Base {

    /** @param {Creep} creep */
    static run(creep){
        
        this.checkState(creep)

        //If nothing to repair become a Runner
        if(!creep.memory.repairQueue.length){
            creep.memory.repairing = false
            if(creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0)
                return this.dropEnergy(creep)
            
        }

        if(creep.memory.repairing){
            let target = Game.getObjectById(creep.memory.repairQueue[0])
            while(!target && creep.memory.repairQueue.length){
                creep.memory.repairQueue.shift()
                target = Game.getObjectById(creep.memory.repairQueue[0])
            }
            if(!target) return //TODO fill the repair queue again instead of wait for next tick?
            if((target.structureType == STRUCTURE_WALL || target.structureType == STRUCTURE_RAMPART) ? target.hits >= WALL_THRESHOLD : target.hits == target.hitsMax) creep.memory.repairQueue.shift()
            if(creep.repair(target) === ERR_NOT_IN_RANGE)
                creep.moveTo(target)//, { visualizePathStyle: { stroke: settings[creep.memory.role].pathColor }})
            return
        }
        
        this.getEnergy(creep)
    }

    /** @param {Creep} creep */
    static checkState(creep){
        if(creep.memory.type === repairTypes.NONE){
            let repairers = _.filter(Game.creeps, c => c.memory.role === roles.REPAIRER)
            let wall = struct = road = 0
            for(let rep of repairers){
                switch(Number(rep.memory.type)){
                    case repairTypes.WALL:
                        ++wall
                        break
                    case repairTypes.STRUCTURE:
                        ++struct
                        break
                    case repairTypes.ROAD:
                        ++road
                        break
                }
            }
            if(!struct) creep.memory.type = repairTypes.STRUCTURE
            else if(!road) creep.memory.type = repairTypes.ROAD
            else if(!wall) creep.memory.type = repairTypes.WALL
        }

        if(creep.memory.repairing && creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0){
            creep.memory.repairing = false
            creep.say('Harvest')
        }

        if(!creep.memory.repairing && creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0){
            creep.memory.repairing = true
            creep.say('Repairing')
        }
        
        if(!creep.memory.repairQueue.length){
            let toRepair = creep.room.find(FIND_STRUCTURES, { filter: s => s.hitsMax - s.hits })
            switch(Number(creep.memory.repairType)){
                case repairTypes.ROAD: default:
                    toRepair = toRepair.filter(s => s.structureType === STRUCTURE_ROAD)
                    break

                case repairTypes.STRUCTURE:
                    toRepair = toRepair.filter(s => STORAGE_STRUCTS.includes(s.structureType) && s.hitsMax - s.hits > 10000)
                    break

                case repairTypes.WALL:
                    toRepair = toRepair.filter(s => s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART && s.hits < 2500)
                    break
            }
            
            if(toRepair.length){
                toRepair.sort((a, b) => (a.hits / a.hitsMax) - (b.hits / b.hitsMax))//from lowest % of hits to the highest eg: structures with less hits will be priotized
                // && a.pos.getDirectionTo(creep) - b.pos.getDirectionTo(creep)
                creep.memory.repairQueue = toRepair.slice(0, REPAIR_QUEUE_LEN).map(s => s.id)
                creep.say('Filled queue!')
            }
        }
    }
}