const Base = require('./BaseStructure')

module.exports = class Tower extends Base {

    /** @param {StructureTower} struct */
    static run(struct){
        return
        let enemies = this.findEnemies(struct)
        if(enemies.length) return struct.attack[target[0]]

        let damagedStructs = this.findForRepair(struct)
        if(damagedStructs.length) return struct.repair(damagedStructs[0])
        
    }

    /** @param {StructureTower} struct */
    static getTarget(struct){ //TODO implement into Memory since structs dont have memory
        if(!struct.memory.targetQueue || !struct.memory.targetQueue.length){
            struct.memory.targetQueue = this.findEnemies(struct)
        }
        let target = Game.getObjectById(struct.memory.targetQueue[0])
        while(!target || !target.hits && struct.memory.targetQueue.length) {
            struct.memory.targetQueue.shift()
            target = Game.getObjectById(struct.memory.targetQueue[0])
        }
        return target
    }

}