'use strict'

let PandoraBox = require("./PandoraBox/pandora-box");
let config = require("./config/db_config.json");

describe("PandoraBox service", () => {
	let service = null;
	let bucket = null;
	before(() => {
		service = new PandoraBox();
		service.init();
	});
	describe("PandoraBox service", () => {
		it("should mark ticket called", (done) => {
			return service.actionTicketCalled()
				.then((res) => {
					console.log(res);
					done();
				})
				.catch((err) => {
					done(err);
				});
		})
	})

});