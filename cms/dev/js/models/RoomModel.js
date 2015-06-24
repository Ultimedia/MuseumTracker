Room = Backbone.Model.extend({
	defaults:{
		mercury_room_id: "",
		mercury_room_exhibit_id: "",
		mercury_room_type: "",
		mercury_room_title: "",
		mercury_room_description: "",
		mercury_room_order: ""
	},
	url: appData.services.roomService,
	initialize: function(){

	}
});