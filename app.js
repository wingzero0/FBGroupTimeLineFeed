// model
;(function ($) {
	
	var app = this.app || (this.app = {});
	app.model = {};

}).call(this, jQuery);

// view, must be init after "app.model" is ready
;(function($){
	var app = this.app || (this.app = {});
	app.view = {};
	app.view.showPersonal = function(info){
		$("#userInfo").html(info);
	}
	app.view.addPost = function(time, message, picture){
		var localTime = new Date(time);
		$("#userInfo").append("<p>" + localTime + "</p>" + "<p>" + message + "</p>" + "<div id=" + picture + "></div>");
	}
	app.view.addPhoto = function(id, picture){
		console.log(id);
		$("#" + id).append("<img src=" + picture + "></img>");
	}
}).call(this, jQuery);

// controller
;(function($){
	var app = this.app || (this.app = {});
	app.controller = {};
	app.controller.init = function(){
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				console.log('Logged in.');
				app.controller.loadGroupInfo();
				$("#loginButtonM").html("refresh");
				$("#login").click(function(){
					$("#userInfo").html("");
					app.controller.loadGroupInfo();
				});
			}
			else {
				$("#login").click(function(){
					FB.login(function(response){
						app.controller.loadGroupInfo();
						$("#loginButtonM").html("refresh");

						$("#login").click(function(){
							$("#userInfo").html("");
						});
					}, {scope: 'user_groups,email'});
				});
			}
		});
	}
	app.controller.loadGroupInfo = function(){
		FB.api(
		    "/198136763558550/feed",
		    function (response) {
		    	var compare = function(a, b){
		    		if (a.created_time > b.created_time){
		    			return -1;
		    		}else if (a.created_time < b.created_time){
		    			return 1;
		    		}else {
		    			return 0;
		    		}
		    	}
				if (response && !response.error) {
					/* handle the result */
					response.data.sort(compare);
					$(response.data).each(function (index){
						app.view.addPost(this.created_time, this.message, this.id);
						app.controller.loadPostInfo(this.id);
					});
					// app.view.showPersonal(response.id);
				}
		    }
		);
	}
	app.controller.loadPostInfo = function(postId){
		FB.api(
		    "/" + postId + "?fields=attachments,message,type",
		    function (response) {
				console.log(response);
				if (response.type == "photo"){
					
					if (response.attachments.data[0].subattachments){
						$(response.attachments.data[0].subattachments.data).each(function(){
							app.view.addPhoto(postId, this.media.image.src);
							console.log("subattachments" + this.media.image.src);
						});
					}else {
						app.view.addPhoto(postId, response.attachments.data[0].media.image.src);
					}
					// app.controller.loadPhotoInfo(response.object_id);
				}
		    }
		);
	}
	app.controller.loadPhotoInfo = function(objectId){
		FB.api(
		    objectId,
		    function (response) {
				console.log(response);
				$(response.images).each(function(index){
					app.view.addPhoto(objectId, this.source);
				});
		    }
		);
	}
}).call(this, jQuery);


