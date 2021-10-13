const { STORAGE_STRUCTS, PRIORITY_ENERGY, roles } = require('./Constants')

module.exports = class Util {

    /** @param {Creep} creep */
    static getHarvesterTarget(creep){
        //First find storage struct in 3 block radius around  the creep. The creep should be next to energy source when this fnc runs
        let target = creep.pos.findClosestByRange(FIND_STRUCTURES, { 
            filter: s => STORAGE_STRUCTS.includes(s.structureType) && s.store[RESOURCE_ENERGY] < s.store.getCapacity(RESOURCE_ENERGY) && s.pos.inRangeTo(creep, 3) })
        if(target) return { id: target.id, temp: false }

        //If none found find closest deposit target
        return this.findDepositTarget(creep)
    }

    /** @param {Creep} creep */
    static findDepositTarget(creep){
        //First find priority strucutres such as spawn and extensions or towers
        let target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: s => PRIORITY_ENERGY.includes(s.structureType) && s.store.getFreeCapacity(RESOURCE_ENERGY) !== 0 })
        if(target) return target.id
        
        //If none are found find storage boxes around Room controller or spawn if no controller
        let obj = creep.room.controller || _.find(Game.spawns, s => s.room === creep.room)
        target = obj.pos.findInRange(FIND_STRUCTURES, 5, { filter: s => STORAGE_STRUCTS.includes(s.structureType) && s.store.getFreeCapacity(RESOURCE_ENERGY) !== 0 })
        if(target) return target.id

        return false
    }

    /** @param {Creep} creep */
    static findEnergy(creep){
        //First find on ground
        let dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: r => r.resourceType === RESOURCE_ENERGY })
        if(dropped) return dropped.id
        
        //Find in storages
        let target = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: s => STORAGES.includes(s.structureType) && s.store[RESOURCE_ENERGY] !== 0 })
        if(target) return target.id

        return false
    }

    /** @param {Room} room */
    static getLessUsedSource(room){
        let sources = Memory.sources[room.name]
        let lessUsed = { id: null, count: Infinity }
        for(let sID in sources){//TODO if same usage take path into consideration
            if(sID === 'closestToController') continue
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
        switch(creep.memory.role){
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
                creep.memory.sourceID = Memory.sources[creep.room.name].closestToController
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
            if(sID === 'closestToController') continue
            if(sources[sID] > lessUsed.count) continue
            lessUsed = { id: sID, count: sources[sID] }
        }
        return lessUsed
    }

}