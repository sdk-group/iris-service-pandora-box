'use strict'

let emitter = require("global-queue");
let ServiceApi = require('resource-management-framework')
	.ServiceApi;

class PandoraBox {
	constructor() {
		this.emitter = emitter;
	}

	init(cfg) {}

	//API
	actionServiceGroups({
		workstation,
		user_id,
		user_type = "SystemEntity",
		query
	}) {
		return this.emitter.addTask('agent', {
				_action: 'available-workstations',
				user_id,
				user_type: "SystemEntity"
			})
			.then((res) => {
				return this.iris.getServiceTree(query);
			})
	}

	actionBootstrap({
		workstation,
		user_id,
		user_type = "SystemEntity"
	}) {
		let term;
		return this.emitter.addTask('workstation', {
				_action: 'by-id',
				user_id,
				user_type,
				workstation
			})
			.then((res) => {
				term = _.find(res, (val) => (val.device_type === 'pandora-box'));

				return Promise.props({
					workstation: this.emitter.addTask('workstation', {
							_action: 'occupy',
							user_id,
							user_type,
							workstation
						})
						.then((res) => {
							return res.workstation;
						})
				});
			})
			.catch(err => {
				console.log("TERM BTSTRP ERR", err.stack);
			})
	}

	actionReady({
		user_id,
		workstation
	}) {
		return Promise.resolve({
			success: true
		});
	}
}

module.exports = PandoraBox;
