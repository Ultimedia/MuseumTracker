appData.views.NoExhibitView = Backbone.View.extend({
    initialize: function () {
    	_.bindAll(this);
    },

    render: function() {
    	this.$el.html(this.template());
		return this;
    }
});