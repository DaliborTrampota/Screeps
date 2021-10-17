

module.exports = class Base {

    /** @param {Structure} struct */
    static findEnemies(struct){
        let enemies = struct.room.find(FIND_HOSTILE_CREEPS)
        if(enemies.length){
            enemies.sort((a, b) => a.pos.inRangeTo(struct) - b.pos.inRangeTo(struct))
            return enemies
        }
        return []
    }

}