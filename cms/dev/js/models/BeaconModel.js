Beacon = Backbone.Model.extend({
	defaults:{
		mercury_beacon_identifier: "",
		mercury_beacon_device_id: "",
		mercury_exhibit_id: "",
		mercury_beacon_uuid: "",
		mercury_room_id: "",
		mercury_media_id: "",
		mercury_museum_id: ""
	},
	url: appData.services.beaconService,
	initialize: function(){

	}
});