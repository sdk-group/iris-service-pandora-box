'use strict'

let events = {
	pandora_box: {}
};

let tasks = [];


module.exports = {
	module: require('./pandora-box.js'),
	permissions: [],
	exposed: true,
	tasks: tasks,
	events: {
		group: 'pandora-box',
		shorthands: events.pandora_box
	}
};
