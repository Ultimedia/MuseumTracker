appData.routers.AppRouter = Backbone.Router.extend({
    routes: {
        "":                 "login",
        "login":            "login",
        "statistics":       "statistics",
        "dashboard":		"dashboard",
        "exit":             "exit",
        "exhibit/:id":          "exhibit",
        "create-exhibit":   "createexhibit",
        "settings":         "settings",
        "*notFound":        "notfound",
        "settings":         "settings",
        "*notFound":        "notfound"
    },

    initialize: function () {
        this.routesHit = 0;
        //keep count of number of routes handled by the application
        Backbone.history.on('route', function() { this.routesHit++; }, this);
    },

    exit: function(){
      appData.settings.set('loggedIn', false)
      appData.router.navigate("login", true);
    },

    statistics: function(){
        
       if (appData.settings.get('loggedIn')) $('#container #page-content-wrapper').empty().append(new appData.views.StatisticsView().render().$el);
       else appData.router.navigate("login", true);
    },


    createexhibit: function(){

       if (appData.settings.get('loggedIn')) $('#container #page-content-wrapper').empty().append(new appData.views.CreateExhibitView().render().$el);
       else appData.router.navigate("login", true);
    },


    login: function () {
      if (appData.settings.get('loggedIn')){
        appData.router.navigate("dashboard", true);
      }else{
        $('#container').empty().append(new appData.views.LoginView().render().$el);
      }
    },

    settings: function(){
       if (appData.settings.get('loggedIn')) $('#container #page-content-wrapper').empty().append(new appData.views.SettingsView().render().$el);
       else appData.router.navigate("login", true);
    },


    exhibit: function(exhibitid){


          if (appData.settings.get('loggedIn')){

            $.when(appData.collections.museumCollection.fetch()).then(function() {

             // appData.selectedExhibit = appData.selectedMuseum.attributes.exhibits[exhibitid]


              $('#container #page-content-wrapper').empty().append(new appData.views.ExhibitView().render().$el);

            });

          }


    },

    dashboard: function(){
       if (appData.settings.get('loggedIn')){
            $('#container').empty().append(new appData.views.DashboardView().render().$el);

            // set title once logged in
            $('#account-title').text('Ingelogd als ' + appData.models.userModel.get('user_email'))

            // show menu once logged in
            $('#navbar .nav').removeClass('hide');



      }
       else appData.router.navigate("login", true);
    },

    settings: function(){
       if (appData.settings.get('loggedIn')) $('#container #page-content-wrapper').empty().append(new appData.views.SettingsView().render().$el);
       else appData.router.navigate("login", true);
    },

    notfound: function(){
       $('#container').empty().append(new appData.views.NotFoundView().render().$el);
    }
});

