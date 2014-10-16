define('pact', [], function () {
	function Pact() {
		this.provider = {};
		this.consumer = {};
		this.interactions = [];
		this.metadata = {
			"pactSpecificationVersion" : "1.0.0"
		};
	}

	return Pact;
});