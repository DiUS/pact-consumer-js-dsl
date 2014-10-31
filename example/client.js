define('client',[], 
	function($) {

	    function Client(baseUrl){
	        this.sayHello = function (){
	        	var xhr = new XMLHttpRequest();
	            xhr.open("GET", baseUrl + "/sayHello", false);
	            xhr.send(); 
	            return JSON.parse(xhr.responseText).reply;
	        };
	        
	        this.unfriendMe = function (){
	        	var xhr = new XMLHttpRequest();
	            xhr.open("PUT", baseUrl + "/unfriendMe", false);
	            xhr.send(); 
	            return JSON.parse(xhr.responseText).reply;
	        };
	    }; 
    return Client;
});
