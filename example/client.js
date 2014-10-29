define('client', 
	['jquery'], 
	function($) {

	    function Client(baseUrl){
	        this.sayHello = function (){
	        	var reply = "";
	        	
	        	var request = $.ajax({
		            url: baseUrl+"/sayHello",
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
		            url: baseUrl+"/unfriendMe",
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
