const { STORAGE_STRUCTS, PRIORITY_ENERGY, roles } = require('./Constants')

module.exports = class Util {

    /** @param {Creep} creep */
    static getHarvesterTarget(creep){
        //First find storage struct in 3 block radius around  the creep. The creep should be next to energy source when this fnc runs
        let target = creep.pos.findClosestByRange(FIND_STRUCTURES, { 
            filter: s => STORAGE_STRUCTS.includes(s.structureType) && s.store[RESOURCE_ENERGY] < s.store.getCapacity(RESOURCE_ENERGY) && s.pos.inRangeTo(creep, 3) })
        if(target) return { id: target.id, temp: false }

        //If none found find closest deposit target
        return { id: this.findDepositTarget(creep).id, temp: true }
    }

    /** @param {Creep} creep */
    static findDepositTarget(creep){
        //First find priority strucutres such as spawn and extensions or towers
        let target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: s => PRIORITY_ENERGY.includes(s.structureType) && s.store.getFreeCapacity(RESOURCE_ENERGY) !== 0 })
        if(target) return target
        
        //If none are found find storage boxes around Room controller or spawn if no controller - TODO give storages types and dont deposit to ones next to source
        let obj = creep.room.controller || _.find(Game.spawns, s => s.room === creep.room)
        target = obj.pos.findInRange(FIND_STRUCTURES, 5, { filter: s => STORAGE_STRUCTS.includes(s.structureType) && s.store.getFreeCapacity(RESOURCE_ENERGY) !== 0 })
        if(target) return target[0]

        return false
    }

    /** @param {Creep} creep */
    static findEnergy(creep){
        //First find on ground
        let dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: r => r.resourceType === RESOURCE_ENERGY })
        if(dropped) return dropped
        
        //Find in storages 
        let target = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: s => STORAGE_STRUCTS.includes(s.structureType) && s.store[RESOURCE_ENERGY] !== 0 })
        if(target) return target

        return false
    }

    /** @param {Room} room */
    static getLessUsedSource(room){
        let sources = Memory.sources[room.name]
        let lessUsed = { id: null, count: Infinity }
        for(let sID in sources){//TODO if same usage take path into consideration
            //if(sID === 'closestToController') continue
            if(sources[sID] > lessUsed.count) continue
            lessUsed = { id: sID, count: sources[sID] }
        }
        return lessUsed
    }

    
    /** @param {Creep} creep */
    static setSource(creep){
        if(creep.memory.sourceID)
            return Game.getObjectById(creep.memory.sourceID)
            
        let closest, lessUsed
        switch(Number(creep.memory.role)){
            case roles.HARVESTER:
                closest = creep.pos.findClosestByPath(FIND_SOURCES)
                if(closest) {
                    creep.memory.sourceID = closest.id
                    return closest
                }
        
                lessUsed = this.getLessUsedSource(creep.room)
                creep.memory.sourceID = lessUsed.id
                return Game.getObjectById(lessUsed.id)

            case roles.UPGRADER:
                //creep.memory.sourceID = Memory.sources[creep.room.name].closestToController
                Memory.sources[creep.room.name][creep.memory.sourceID]++
                return Game.getObjectById(creep.memory.sourceID)

            default:
                lessUsed = this.getLessUsedSource(creep.room)
                Memory.sources[creep.room.name][lessUsed.id]++
                creep.memory.sourceID = lessUsed.id
                return Game.getObjectById(creep.memory.sourceID)

        }
    }

    /** @param {Room} room */
    static getLessUsedSource(room){
        let sources = Memory.sources[room.name]
        let lessUsed = { id: null, count: 127 }
        for(let sID in sources){//TODO if same usage take path into consideration
            //if(sID === 'closestToController') continue
            if(sources[sID] > lessUsed.count) continue
            lessUsed = { id: sID, count: sources[sID] }
        }
        return lessUsed
    }

    static getCountFor(role) {
        return _.filter(Game.creeps, (creep) => creep.memory.role == role).length
    }

    static cleanDead(){
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

}