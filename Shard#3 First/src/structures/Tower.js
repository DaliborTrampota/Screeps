const Base = require('./BaseStructure.js')

module.exports = class Tower extends Base {

    /** @param {StructureTower} struct */
    static run(struct){
        let target = this.getTarget(struct)
        struct.attack(target)
    }

    /** @param {StructureTower} struct */
    static getTarget(struct){
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