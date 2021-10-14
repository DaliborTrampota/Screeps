const { settings, roles } = require('./Constants')
const Spawner = require('./Spawner')
const Util = require('./Util')

module.exports.loop = function () {

	Spawner.check()

	/*if(!Memory.sources){
        Memory.sources = { }
    }*/


	for(let spawnName in Game.spawns){
		const spawn = Game.spawns[spawnName]
		spawn.room.visual.text(spawn.room.energyAvailable + '/' + spawn.room.energyCapacityAvailable, spawn.pos.x, spawn.pos.y + 1)
		if(spawn.spawning){
			spawn.room.visual.text(`${spawn.spawning.name} (${100 - Math.floor(spawn.spawning.remainingTime / spawn.spawning.needTime * 100)}%)`, spawn.pos.x + 4, spawn.pos.y)
		}
	}

	for(let roomName in Game.rooms){
		//if(Memory.sources[roomName].closestToController) continue

		if(!Memory.sources[roomName]){
			Memory.sources[roomName] = {}
			let sources = Game.rooms[roomName].find(FIND_SOURCES)
			for(let s of sources) Memory.sources[roomName][s.id] = 0
		}

		/*let source = Game.rooms[roomName].controller.pos.findClosestByPath(FIND_SOURCES)
		if(source) Memory.sources[roomName].closestToController = source.id
		*/
	}

	for(let creepName in Game.creeps){
		const creep = Game.creeps[creepName]
		if(!creep.memory) return console.log(`${creepName} - no memory`)

		if(creep.memory.role == undefined || creep.memory.role == null ) {
			console.log(`Creep ${creep.name} has no role`)
			Game.notify(`Creep ${creep.name} has no role`, 5)
			//creep.memory.role = roles.HARVESTER
			continue
		}
		require(`./roles/${settings[creep.memory.role].name}`).run(creep)
	}
	

	for(let structName in Game.structures){
		let struct = Game.structures[structName]
		switch(struct.structureType){
			case STRUCTURE_TOWER:
				require('./structures/Tower').run(struct)
				break
		}
	}

	/*if(Game.time % 10 === 0) {
		let str = `Stats\n`
		for(let role in roles){
			str += `${settings[role].name}: ${Util.getCountFor(role)}\n`
		}
		console.log(str)
	}*/
	
	if (Game.cpu.bucket >= 10000) Game.cpu.generatePixel();
}