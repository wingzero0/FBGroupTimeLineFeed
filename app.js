// model
;(function ($) {
	
	var app = this.app || (this.app = {});
	app.model = {};

}).call(this, jQuery);

// view, must be init after "app.model" is ready
;(function($){
	var app = this.app || (this.app = {});
	app.view = {};
	
}).call(this, jQuery);

// controller
;(function($){
	$("#setting").click(function(){
		console.log("click setting");
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				console.log('Logged in.');
			}
			else {
				FB.login();
			}
		});
	});
}).call(this, jQuery);


