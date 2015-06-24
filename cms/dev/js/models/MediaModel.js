Media = Backbone.Model.extend({
	defaults:{
		mercury_media_id: "",
		mercury_room_id: "",
		mercury_room_media_caption: "",
		mercury_room_media_url: "",
		mercury_room_media_type: ""
	},
	url: appData.services.roomService,
	initialize: function(){

	}
});