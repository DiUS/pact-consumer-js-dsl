(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define('pactDetails', [], factory);
  } else {
    root.PactDetails = factory();
  }
}(this, function () {

	function PactDetails() {
		this.provider = {};
		this.consumer = {};
		this.pact_dir=".";
	}
	return PactDetails;
}));

