const { STORAGE_STRUCTS, REPAIR_QUEUE_LEN, WALL_THRESHOLD, repairTypes, roles, settings } = require('../Constants')
const Base = require('./Base')
const Util = require('../Util')

module.exports = class Repairer extends Base {

    /** @param {Creep} creep */
    static run(creep){
        
        this.checkState(creep)

        //If nothing to repair become a Runner
        if(!creep.memory.repairQueue.length){
            //return this.idle(creep)
            creep.memory.repairing = false
            if(creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0)
                return this.dropEnergy(creep)
            
        }

        if(creep.memory.repairing){
            let target = Game.getObjectById(creep.memory.repairQueue[0])
            //If the target doesnt exist anymore or if the target is already repaired or if the wall is repaired above the threshold and while there is something to repair in the queue
            while((!target || target.hits === target.hitsMax || ([STRUCTURE_RAMPART, STRUCTURE_WALL].includes(target.structureType) && target.hits >= WALL_THRESHOLD)) && creep.memory.repairQueue.length){
                creep.memory.repairQueue.shift()
                target = Game.getObjectById(creep.memory.repairQueue[0])
            }
            if(!target) return //TODO fill the repair queue again instead of wait for next tick?
            if(creep.repair(target) === ERR_NOT_IN_RANGE)
                creep.moveTo(target, { visualizePathStyle: { stroke: settings[creep.memory.role].pathColor }})
            return
        }
        
        this.getEnergy(creep)
    }

    /** @param {Creep} creep */
    static checkState(creep){
        if(creep.memory.type == repairTypes.NONE)
            creep.memory.type = this.assignType(creep)

        if(creep.memory.repairing && creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0){
            creep.memory.repairing = false
            creep.say('Harvest')
        }

        if(!creep.memory.repairing && creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0){
            creep.memory.repairing = true
            creep.say('Repairing')
        }
        
        if(!creep.memory.repairQueue.length)
            creep.memory.repairQueue = this.getRepairQueue(creep)
            //if(!creep.room.memory.toRepair.length)
            //    creep.room.memory.toRepair = creep.room.find(FIND_STRUCTURES, { filter: s => s.hits !== s.hitsMax }).map(s => s.id)
            
    }

    static getRepairQueue(creep){
        const memRoom = Memory.rooms[creep.room.name]
        if(!memRoom.toRepair || memRoom.toRepair.tick != Game.tick) //Refresh the queue every tick not for every repairer in the tick
            memRoom.toRepair = { tick: Game.time, queue: creep.room.find(FIND_STRUCTURES, { filter: s => s.hits !== s.hitsMax })}

        if(!memRoom.toRepair.queue.length) return console.log("Nothing to repair")
        let filteredRepair = []
        //let toRepair = creep.room.memory.toRepair.map(id => Game.getObjectById(id)).filter(s => s && s.hits !== s.hitsMax)
        switch(Number(creep.memory.type)){
            case repairTypes.ROAD:
                filteredRepair = memRoom.toRepair.queue.filter(s => s.structureType === STRUCTURE_ROAD)
                break

            case repairTypes.STRUCTURE:
                filteredRepair = memRoom.toRepair.queue.filter(s => STORAGE_STRUCTS.includes(s.structureType) && s.hitsMax - s.hits)
                break

            case repairTypes.WALL:
                filteredRepair = memRoom.toRepair.queue.filter(s => [STRUCTURE_WALL, STRUCTURE_RAMPART].includes(s.structureType) && s.hits < WALL_THRESHOLD)
                break

            default:
                console.log("default", JSON.stringify(creep.memory), creep.name)
                filteredRepair = memRoom.toRepair.queue.filter(s => s.structureType === STRUCTURE_ROAD)
                break
        }

        if(!filteredRepair.length) {
            filteredRepair = memRoom.toRepair.queue.filter(s => ![STRUCTURE_WALL, STRUCTURE_RAMPART].includes(s.structureType))
            //console.log(`No ${creep.memory.type == 0 ? 'roads' : creep.memory.type == 1 ? 'structures' : 'walls'} to repair.`)
        }
        //from lowest % of hits to the highest eg: structures with less hits will be priotized
        filteredRepair.sort((a, b) => (a.hits / a.hitsMax) - (b.hits / b.hitsMax))
        const creepQueue = filteredRepair.slice(0, REPAIR_QUEUE_LEN).map(s => s.id)
        //Remove the queued from the queue so no two creeps are repairign the same object
        for(let i = memRoom.toRepair.queue.length - 1; i >= 0; --i){
            if(creepQueue.includes(memRoom.toRepair.queue[i]))
                memRoom.toRepair.queue.splice(i, 1)
        }
        creep.say('Filled queue!')
        return creepQueue
    }

    static assignType(creep){
        let repairers = _.filter(Game.creeps, c => c.memory.role == roles.REPAIRER)
        let wall = 0, struct = 0, road = 0;
        
        for(let rep of repairers){
            switch(Number(rep.memory.type)){
                case repairTypes.WALL:
                    ++wall
                    break
                case repairTypes.STRUCTURE:
                    ++struct
                    break
                case repairTypes.ROAD: default:
                    ++road
                    break
            }
        }

        console.log(`Assinging repairer type`, wall, struct, road)
        if(!struct) return creep.memory.type = repairTypes.STRUCTURE
        if(!road) return creep.memory.type = repairTypes.ROAD
        if(!wall) return creep.memory.type = repairTypes.WALL
        console.log('Assigned ROAD')

        creep.memory.type = repairTypes.ROAD
    }
}