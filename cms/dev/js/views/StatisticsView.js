appData.views.StatisticsView = Backbone.View.extend({
    initialize: function () {
    	_.bindAll(this);
    },

    render: function() {
    	this.$el.html(this.template({copy: appData.settings.attributes.copy[appData.settings.attributes.language].home }));
		return this;
    }
});