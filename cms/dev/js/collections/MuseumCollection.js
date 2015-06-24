


MuseumCollection = Backbone.Collection.extend({
	model: Museum,
   initialize: function(models,options) { 
        this.url = (options||{}).url || "defaultURL";
    },
});