'use strict'


let ServiceApi = require('resource-management-framework')
	.ServiceApi;
let BookingApi = require('resource-management-framework')
	.BookingApi;

class PandoraBox {
	constructor() {
		this.emitter = message_bus;
	}

	init(cfg) {
		this.services = new ServiceApi();
		this.services.initContent();
		this.iris = new BookingApi();
		this.iris.initContent();
	}

	//API
	actionPlacementSnapshot({
		user_id,
		workstation,
		dedicated_date
	}) {
		return this.emitter.addTask('prebook', {
				_action: 'workstation-organization-data',
				workstation
			})
			.then((org) => {
				return this.iris.observe({
					operator: '*',
					time_description: [0, 86400],
					dedicated_date: moment.tz(dedicated_date, org.org_merged.org_timezone),
					service_keys: this.services.getSystemName('cache', 'service_ids'),
					operator_keys: this.services.getSystemName('global', 'membership_description'),
					organization: org.org_merged.id,
					count: 0,
					service_count: 1,
					method: 'prebook',
					existing_only: true
				});
			})
			.then(res => _.values(res));
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
			});
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
