Museum = Backbone.Model.extend({
	defaults:{
		museum_id: undefined,
		museum_cover: undefined,
		museum_title: undefined,
		museum_address: undefined,
		museum_open: undefined,
		museum_description: undefined,
		museum_website: undefined,
		museum_twitter: undefined,
		museum_facebook: undefined,
		exhibitData: []
	},
	initialize: function (models,options) { 
		
		console.log("hier")

	}
});


