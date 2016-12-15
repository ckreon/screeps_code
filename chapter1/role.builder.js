var roleHealer = require('role.healer');
var roleHarvester = require('role.harvester');

var roleBuilder = {

	/** @param {Creep} creep **/
	run: function(creep) {

		if (creep.memory.harvesting) {
			var sources = creep.room.find(FIND_SOURCES);
			var storage = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (
								 (structure.structureType == STRUCTURE_SPAWN) &&
								 (structure.energy > 250));
				}
			});

			if (storage.length > 0) {
				var target = creep.pos.findClosestByRange(storage);

				if (!(creep.pos.isNearTo(target))) {
					creep.moveTo(target);
				}
				else {
					creep.withdraw(target, RESOURCE_ENERGY,
												(creep.carryCapacity - _.sum(creep.carry)));
				}
			}
			else if (sources.length) {
				for (source in sources) {
					if (_.filter(Game.creeps, (creep) =>
											(creep.memory.source == source)
					).length < 4) {
						creep.memory.source = source;
					}
				}
				if (creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[creep.memory.source]);
				}
			}
			else if (creep.carry.energy == creep.carryCapacity) {
					creep.say('Building');
			    creep.memory.harvesting = false;
			}
		}
		else {
		  var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
		  	filter: (structure) => {
		  		return (!(structure.structureType == STRUCTURE_CONTAINER));
		  	}
		  });

			if (targets.length) {
				var target = creep.pos.findClosestByRange(targets);
				if (creep.build(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target);
				}
				if (creep.carry.energy == 0) {
					creep.say('Harvesting');
					creep.memory.harvesting = true;
				}
			}
			else {
					roleHealer.run(creep);
			}
		}

	} // function

}; // roleBuilder

module.exports = roleBuilder;