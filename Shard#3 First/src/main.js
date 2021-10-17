const { settings } = require('./Constants')
const Spawner = require('./Spawner')
const Util = require('./Util')

let showStats = false
let cpuUsage = { iter: 0, data: {} }
let startCPU

module.exports.loop = function () {

	Spawner.check()

	/*if(!Memory.sources){
        Memory.sources = { }
    }*/

	showStats = Game.time % 100 === 0


	for(let roomName in Game.rooms){
		if(!Memory.rooms[roomName]) Memory.rooms[roomName] = {}
		if(!Memory.rooms[roomName].toRepair) Memory.rooms[roomName].toRepair = []
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
		
		if(!cpuUsage.data.hasOwnProperty(creep.memory.role)) cpuUsage.data[creep.memory.role] = 0
		startCPU = Game.cpu.getUsed()
		
		require(`./roles/${settings[creep.memory.role].name}`).run(creep)

		cpuUsage.data[creep.memory.role] += Game.cpu.getUsed() - startCPU
	}
	++cpuUsage.iter
	

	for(let structName in Game.structures){
		let struct = Game.structures[structName]
		switch(struct.structureType){
			case STRUCTURE_TOWER:
				require('./structures/Tower').run(struct)
				break
		}
	}

	for(let spawnName in Game.spawns){
		const spawn = Game.spawns[spawnName]
		spawn.room.visual.text(spawn.room.energyAvailable + '/' + spawn.room.energyCapacityAvailable, spawn.pos.x, spawn.pos.y + 1)
		if(spawn.spawning){
			spawn.room.visual.text(`${spawn.spawning.name} (${100 - Math.floor(spawn.spawning.remainingTime / spawn.spawning.needTime * 100)}%)`, spawn.pos.x + 4, spawn.pos.y)
		}
	}


	if(showStats) {
		let str = `Stats - Average of ${cpuUsage.iter} ticks\n` 
		for(let role in settings){
			if(!cpuUsage.data[role]) continue
			str += `${settings[role].name}: ${Util.getCountFor(role)} (${(cpuUsage.data[role] / cpuUsage.iter).toFixed(3)})\n`
			cpuUsage.data[role] = 0
		}
		console.log(str)
		cpuUsage.iter = 0
	}
	
	if (Game.cpu.bucket >= 10000) Game.cpu.generatePixel();
}