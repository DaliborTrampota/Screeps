const { settings, roles, STORAGE_STRUCTS } = require('../Constants')
const Util = require('../Util')

module.exports = class BaseRole {

    /** @param {Creep} creep */
    static dropEnergy(creep){
        if(!creep.memory.dropTarget){
            switch(creep.memory.role){
                case roles.HARVESTER:
                    creep.memory.dropTarget = Util.getHarvesterTarget(creep)
                    break

                case roles.RUNNER:
                    creep.memory.dropTarget = Util.getD(creep)
                    break
            }
            
        }
        const targetObj = creep.memory.dropTarget ? Game.getObjectById(creep.memory.dropTarget.id) : false
        if(!targetObj) return console.log(`${creep.name} - No energy target or container is full`)

        const transfer = creep.transfer(targetObj, RESOURCE_ENERGY)
        if(transfer === OK) return delete creep.memory.dropTarget
        if(transfer === ERR_NOT_IN_RANGE) 
            creep.moveTo(targetObj)
    }

    /** @param {Creep} creep */
    static getEnergy(creep){
        let storage = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: s => STORAGE_STRUCTS.includes(s.structureType) && s.store[RESOURCE_ENERGY] >= 50 })
        if(!storage) return console.log("No Storage Struct with energy")
        if(creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
            creep.moveTo(storage)
    }

    /** @param {Spawn} spawn */
    static spawn(spawn, name, memory){
        if(!memory.role) return console.log(`Cant spawn - no role provided`)

        let set = settings[memory.role]
        return spawn.spawnCreep(set.parts[set.build], name, memory)
    }

}