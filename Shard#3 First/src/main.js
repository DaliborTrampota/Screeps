const { settings } = require('./Constants')
const Spawner = require('./Spawner')

module.exports.loop = function () {

	Spawner.check()

	/*if(!Memory.sources){
        Memory.sources = { }
    }*/

	for(let spawnName in Game.spawns){
		const spawn = Game.spawns[spawnName]
		if(spawn.spawning){
			spawn.room.visual.text(`${spawn.spawning.name} (${100 - Math.floor(spawn.spawning.remainingTime / spawn.spawning.needTime * 100)}%)`, spawn.pos.x + 4, spawn.pos.y)
		}
	}

	for(let roomName in Game.rooms){
		if(Memory.sources[roomName].closestToController) continue

		if(!Memory.sources[roomName]){
			Memory.sources[roomName] = {}
			let sources = Game.rooms[roomName].find(FIND_SOURCES)
			for(let s of sources) Memory.sources[roomName][s.id] = 0
		}

		let source = Game.rooms[roomName].controller.pos.findClosestByPath(FIND_SOURCES)
		if(source) Memory.sources[roomName].closestToController = source.id
	}
	
	for(let creepName in Game.creeps){
		const creep = Game.creeps[creepName]
		if(!creep.memory) return console.log(`${creepName} - no memory`)

		require(`./roles/${settings[creep.memory.role].name}`).run(creep)
	}
	
	if (Game.cpu.bucket >= 10000) Game.cpu.generatePixel();
}