'use strict'

let emitter = require("global-queue");
let ServiceApi = require('resource-management-framework')
	.ServiceApi;
let TicketApi = require('resource-management-framework')
	.TicketApi;

class PandoraBox {
	constructor() {
		this.emitter = emitter;
	}

	init(cfg) {
		this.services = new ServiceApi();
		this.services.initContent();
		this.tickets = new TicketApi();
		this.tickets.initContent();
	}

	//API
	actionSlotsCache({}) {
		return this.tickets.getServiceSlotsCache();
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

				return this.emitter.addTask('workstation', {
					_action: 'occupy',
					user_id,
					user_type,
					workstation
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
