/**
* PHP Services
*/
appData.services.PhpServices = Backbone.Model.extend({

	initialize: function() {

	},

	loginService: function(loginModel){
		var that = this;
		$.ajax({
	        url:appData.services.loginService,
	        type:'POST',
	        dataType:'json',
	        data: "user_email="+loginModel.attributes.user_email+
	        "&user_password="+loginModel.attributes.user_password,
	        timeout:60000,
	        success:function(data){

	        	if(data){
	        	if(data.value === true){
	        		Backbone.trigger('userLoggedIn', data.id);

	        	}else{

	        	}
	        	}else{
	        		Backbone.trigger('userLoggedInError');
	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},

	setRoomOrder: function(room_id, order_id){
		var that = this;

		$.ajax({
        url:appData.services.setRoomorderService,
        type:'POST',
        dataType:'json',
        data: "mercury_room_id="+room_id+
        	  "&mercury_room_order="+order_id,
        timeout:60000,
	        success:function(data){
	        	if(data.value === true){
	        		Backbone.trigger('roomOrderSet', data.id);
	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        }
    	});
	},


	removeRoomService: function(roomID){
		var that = this;

		$.ajax({
        url:appData.services.removeRoomService,
        type:'POST',
        dataType:'json',
        data: "room_id="+roomID,
        timeout:60000,
	        success:function(data){
	        	if(data.value === true){
	        		Backbone.trigger('roomRemoved', data.id);

	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},

	removeMediaService: function(mediaModel){
		var that = this;

		$.ajax({
        url:appData.services.removeMediaService,
        type:'POST',
        dataType:'json',
        data: "mercury_room_media_id="+mediaModel,
        timeout:60000,
	        success:function(data){
	        	if(data.value === true){
	        		Backbone.trigger('mediaRemoved', data.id);
	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},

	removeExhibitService: function(exhibitModel, visible){
		var that = this;

		$.ajax({
        url:appData.services.removeExhibitService,
        type:'POST',
        dataType:'json',
        data: "exhibit_id="+exhibitModel+
        "&visible="+visible,
        timeout:60000,
	        success:function(data){
	        	if(data.value === true){
	        		Backbone.trigger('exhibitRemoved', data.id);

	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},

	removeBeaconService: function(beaconModel){
		var that = this;

		$.ajax({
        url:appData.services.removeBeaconService,
        type:'POST',
        dataType:'json',
        data: "beacon_id="+beaconModel,
        timeout:60000,
	        success:function(data){
	        	if(data.value === true){
	        		Backbone.trigger('beaconRemoved', data.id);

	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},

	createRoomService: function(roomModel){
		var that = this;
		$.ajax({
	        url:appData.services.createRoomService,
	        type:'POST',
	        dataType:'json',
	        data: "mercury_room_exhibit_id="+roomModel.attributes.mercury_room_exhibit_id+
	        "&mercury_room_type="+roomModel.attributes.mercury_room_type+
	        "&mercury_room_title="+roomModel.attributes.mercury_room_title+
	        "&mercury_room_description="+roomModel.attributes.mercury_room_description+
	        "&mercury_room_order="+roomModel.attributes.mercury_room_order,
	        timeout:60000,
	        success:function(data){
	        	console.log(data);

	        	
	        	if(data.value === true){
	        		Backbone.trigger('roomCreated', data.id);
	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},


	updateRoomService: function(roomModel){
		var that = this;
		$.ajax({
	        url:appData.services.roomUpdateService,
	        type:'POST',
	        dataType:'json',
	        data: "mercury_room_id="+roomModel.attributes.mercury_room_id+
	        "&mercury_room_title="+roomModel.attributes.mercury_room_title+
	        "&mercury_room_description="+roomModel.attributes.mercury_room_description,
	        timeout:60000,
	        success:function(data){
	        	console.log(data);

	        	if(data.value === true){
	        		Backbone.trigger('roomUpdated', data.id);
	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},

	createBeaconService: function(roomModel){

		var that = this;
		$.ajax({
	        url:appData.services.createBeaconService,
	        type:'POST',
	        dataType:'json',
	        data: "mercury_beacon_identifier="+roomModel.attributes.mercury_beacon_identifier+
	        "&mercury_beacon_device_id="+roomModel.attributes.mercury_beacon_device_id+
	        "&mercury_beacon_uuid="+roomModel.attributes.mercury_beacon_uuid+
	        "&mercury_room_id="+roomModel.attributes.mercury_room_id+
	       	"&mercury_exhibit_id="+roomModel.attributes.mercury_exhibit_id+
	        "&mercury_media_id="+roomModel.attributes.mercury_media_id+
	        "&mercury_museum_id="+roomModel.attributes.mercury_museum_id,
	        timeout:60000,
	        success:function(data){
	        	
	        	if(data.value === true){
	        		Backbone.trigger('beaconCreated', data.id);
	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},

	updateBeaconService: function(roomModel){

		var that = this;
		$.ajax({
	        url:appData.services.updateBeaconService,
	        type:'POST',
	        dataType:'json',
	        data: "mercury_beacon_identifier="+roomModel.attributes.mercury_beacon_identifier+
	        "&mercury_beacon_device_id="+roomModel.attributes.mercury_beacon_device_id+
	        "&mercury_beacon_uuid="+roomModel.attributes.mercury_beacon_uuid+
	        "&mercury_room_id="+roomModel.attributes.mercury_room_id+
	       	"&mercury_exhibit_id="+roomModel.attributes.mercury_exhibit_id+
	        "&mercury_media_id="+roomModel.attributes.mercury_media_id+
	        "&mercury_museum_id="+roomModel.attributes.mercury_museum_id+
	        "&mercury_beacon_id="+roomModel.attributes.mercury_beacon_id,
	        timeout:60000,
	        success:function(data){
	        	
	        	if(data.value === true){
	        		Backbone.trigger('beaconUpdated', data.id);
	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},


	createMediaService: function(mediaModel){
		var that = this;
		$.ajax({
	        url:appData.services.createMediaService,
	        type:'POST',
	        dataType:'json',
	        data: "mercury_room_id="+mediaModel.attributes.mercury_room_id+
	        "&mercury_room_media_caption="+mediaModel.attributes.mercury_room_media_caption+
	        "&mercury_room_media_url="+mediaModel.attributes.mercury_room_media_url+
	        "&mercury_room_media_type="+mediaModel.attributes.mercury_room_media_type+
	        "&mercury_room_order="+mediaModel.attributes.mercury_room_order,
	        timeout:60000,
	        success:function(data){
	        	console.log(data);

	        	
	        	if(data.value === true){
	        		Backbone.trigger('mediaCreated', data.id);
	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},

	updateExhibitService: function(exhibitModel){
		var that = this;

		console.log(exhibitModel);

		$.ajax({
        url:appData.services.updateExhibitService,
        type:'POST',
        dataType:'json',
        data: "exhibit_museum_id="+exhibitModel.exhibit_museum_id+
        "&exhibit_title="+exhibitModel.exhibit_title+
        "&exhibit_description="+exhibitModel.exhibit_description+
        "&exhibit_hash="+exhibitModel.exhibit_hash+
        "&exhibit_website="+exhibitModel.exhibit_website+
        "&exhibiti_twitter="+exhibitModel.exhibiti_twitter+
        "&exhibit_facebook="+exhibitModel.exhibit_facebook+
        "&exhibit_subtitle="+exhibitModel.exhibit_subtitle+
        "&exhibit_cover_image="+exhibitModel.exhibit_cover_image+
        "&exhibit_twitter_enabled="+exhibitModel.exhibit_twitter_enabled+
        "&exhibit_facebook_enabled="+exhibitModel.exhibit_facebook_enabled+
        "&exhibit_adres="+exhibitModel.exhibit_adres+
        "&exhibit_opening="+exhibitModel.exhibit_opening+
        "&exhibit_id="+exhibitModel.exhibit_id,
        timeout:60000,
	        success:function(data){


	        	if(data.value === true){
	        		Backbone.trigger('exhibitUpdated');

	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        }
    	});
	},



	createExhibitService: function(exhibitModel){
		var that = this;

		console.log(appData.services.createExhibitService)

		$.ajax({
        url:appData.services.createExhibitService,
        type:'POST',
        dataType:'json',
        data: "exhibit_museum_id="+exhibitModel.attributes.exhibit_museum_id+
        "&exhibit_title="+exhibitModel.attributes.exhibit_title+
        "&exhibit_description="+exhibitModel.attributes.exhibit_description+
        "&exhibit_hash="+exhibitModel.attributes.exhibit_hash+
        "&exhibit_website="+exhibitModel.attributes.exhibit_website+
        "&exhibiti_twitter="+exhibitModel.attributes.exhibiti_twitter+
        "&exhibit_facebook="+exhibitModel.attributes.exhibit_facebook+
        "&exhibit_subtitle="+exhibitModel.attributes.exhibit_subtitle+
        "&exhibit_cover_image="+exhibitModel.attributes.exhibit_cover_image+
        "&exhibit_twitter_enabled="+exhibitModel.attributes.exhibit_twitter_enabled+
        "&exhibit_facebook_enabled="+exhibitModel.attributes.exhibit_facebook_enabled+
        "&exhibit_adres="+exhibitModel.attributes.exhibit_adres+
        "&exhibit_opening="+exhibitModel.attributes.exhibit_opening,
        timeout:60000,
	        success:function(data){

	        	if(data.value === true){
	        		Backbone.trigger('exhibitCreated', data.id);

	        		console.log(data.id)
	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},


	updateMediaService: function(mediaModel){
		var that = this;
		$.ajax({
	        url:appData.services.updateMediaService,
	        type:'POST',
	        dataType:'json',
	        data: "mercury_room_id="+mediaModel.mercury_room_id+
	        "&mercury_room_media_caption="+mediaModel.mercury_room_media_caption+
	        "&mercury_room_media_url="+mediaModel.mercury_room_media_url+
	        "&mercury_room_media_type="+mediaModel.mercury_room_media_type+
	        "&mercury_room_order="+mediaModel.mercury_room_order+
	       	"&mercury_room_media_id="+mediaModel.mercury_room_media_id,
	        timeout:60000,
	        success:function(data){
	        	
	        	if(data.value === true){
	        		Backbone.trigger('mediaUpdated');
	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},
	

  	uploadExhibitCover: function(files){
		$.ajax({
			url:appData.services.uploadExhibitCoverService + "?files",
			type:'POST',
			cache: false,
			dataType:'json',
			data: files,
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		    success: function(data, textStatus, jqXHR){

		    	
		    	if(typeof data.error === 'undefined')
		    	{
		    		console.log("succes")
		    		// Success so call function to process the form
		    		console.log(data);
		    		Backbone.trigger('fileUploadedEvent', data);

		    	}
		    	else
		    	{
	    			//Backbone.trigger('fileErrorEvent');
		    		console.log('ERRORS: ' + data.error);
					
					alert('Het bestand dat je hebt gekozen is te groot, verklein het bestand en probeer opnieuw');
		    	}
		    },
		    error: function(jqXHR, textStatus, errorThrown)
		    {

	           alert('Het bestand dat je hebt gekozen is te groot, verklein het bestand en probeer opnieuw');
	
	    		Backbone.trigger('fileErrorEvent');		    	
		    	// Handle errors here
		    	console.log('ERRORS: ' + textStatus);
		    	// STOP LOADING SPINNER
		    }
		});	
    },



     updateExhibitCover: function(files){
		$.ajax({
			url:appData.services.uploadExhibitCoverService + "?files",
			type:'POST',
			cache: false,
			dataType:'json',
			data: files,
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		    success: function(data, textStatus, jqXHR){

		    	
		    	if(typeof data.error === 'undefined')
		    	{
		    		console.log("succes")
		    		// Success so call function to process the form
		    		console.log(data);
		    		Backbone.trigger('fileCoverUploadedEvent', data);

		    	}
		    	else
		    	{
	    			//Backbone.trigger('fileErrorEvent');
		    		console.log('ERRORS: ' + data.error);
					
					alert('Het bestand dat je hebt gekozen is te groot, verklein het bestand en probeer opnieuw');
		    	}
		    },
		    error: function(jqXHR, textStatus, errorThrown)
		    {

	           alert('Het bestand dat je hebt gekozen is te groot, verklein het bestand en probeer opnieuw');
	
	    		Backbone.trigger('fileErrorEvent');		    	
		    	// Handle errors here
		    	console.log('ERRORS: ' + textStatus);
		    	// STOP LOADING SPINNER
		    }
		});	
    }
});
