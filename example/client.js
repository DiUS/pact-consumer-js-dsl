define('client', 
	['jquery'], 
	function($) {

	    function Client(){
	        this.sayHello = function (){
	        	var reply = "";
	        	
	        	var request = $.ajax({
		            url: "http://localhost:1234/sayHello",
		            type: "get",
		            async: false
		        });

		        request.always(function(data) { 
		            reply = data.reply;
		        });
		        return reply;
	        };
	        
	        this.unfriendMe = function (){
	        	var reply = "";
	        	
	        	var request = $.ajax({
		            url: "http://localhost:1234/unfriendMe",
		            type: "put",
		            async: false
		        });

		        request.always(function(data) { 
		            reply = data.reply;
		        });
		        return reply;
	        };
	    }; 
    return Client;
});
