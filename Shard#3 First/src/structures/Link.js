const Base = require('./BaseStructure')

module.exports = class Tower extends Base {

    /** @param {StructureLink} struct */
    static run(struct){
        let link
        if(!Memory.rooms[struct.room.name].upgradeLink){
            if(!this.findUpgradeLink(struct)) link = this.findLink(struct)
            else link = Game.getObjectById(Memory.rooms[struct.room.name].upgradeLink)
        }else link = Game.getObjectById(Memory.rooms[struct.room.name].upgradeLink)
        
        struct.transferEnergy(link)
    }

    /** @param {StructureLink} struct */
    static findUpgradeLink(struct){
        let controller = struct.room.controller
        if(!controller) return false

        let link = controller.pos.findInRange(FIND_MY_STRUCTURES, 5, { filter: s => s.structureType === STRUCTURE_LINK})
        if(!link || !link.length) return false
        
        Memory.rooms[struct.room.name].upgradeLink = link[0].id
        return true
    }

    /** @param {StructureLink} struct */
    static findLink(struct){ //TODO implement into Memory since structs dont have memory
        let links = struct.room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_LINK})
        links.map(s => {
            s.fill = s.store.getUsedCapacity(RESOURCE_ENERGY) / s.store.getCapacity(RESOURCE_ENERGY)
            return s
        })

        links.sort((a, b) => a.fill - b.fill)
        let toBalance = links.filter(s => s.fill < 0.5)
        
        return toBalance[0] || links[0]
    }

}