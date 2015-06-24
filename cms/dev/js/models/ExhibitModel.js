Exhibit = Backbone.Model.extend({
	defaults:{
		exhibit_museum_id: undefined,
		exhibit_title: undefined,
		exhibit_description: undefined,
		exhibit_hash: undefined,
		exhibit_website: undefined,
		exhibiti_twitter: undefined,
		exhibit_facebook: undefined,
		exhibit_subtitle: undefined,
		exhibit_cover_image: undefined,
		exhibit_twitter_enabled: undefined,
		exhibit_adres: undefined,
		exhibit_opening: undefined,
		exhibit_facebook_enabled: undefined,
		exhibitData: [],
		rooms: []
	},
	url: appData.services.createExhibitService,
	initialize: function(){

	}
});