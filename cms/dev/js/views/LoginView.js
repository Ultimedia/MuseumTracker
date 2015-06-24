appData.views.LoginView = Backbone.View.extend({
    initialize: function () {
      _.bindAll(this);    
      Backbone.on('languageChangeHandler', this.render);
      appData.views.LoginView.userLoggedInErrorHandler = this.userLoggedInErrorHandler;

      appData.views.LoginView.userLoggedInHandler = this.userLoggedInHandler;
    },

    userLoggedInErrorHandler: function(){
      Backbone.off('userLoggedInErrorHandler');
              $('#errorBox').removeClass('hide');

    },

    userLoggedInHandler: function(data){
        appData.models.userModel.set('user_id', data);
        Backbone.off('userLoggedIn');

        $('#errorBox').addClass('hide');

        // set loggedIn to true
        appData.settings.set('loggedIn', true);
        appData.router.navigate('dashboard', true);
    },  

    render: function() {
      this.$el.html(this.template({copy: appData.settings.attributes.copy[appData.settings.attributes.language].login}));

      var template = this.$el;

      $('#loginForm', this.$el).validate({
        submitHandler: function(){

          // store the user
          appData.models.userModel = new User();
          appData.models.userModel.set('user_password', $('#password', template).val());
          appData.models.userModel.set('user_email', $('#email', template).val());
         
          Backbone.on('userLoggedIn', appData.views.LoginView.userLoggedInHandler)
          Backbone.on('userLoggedInError', appData.views.LoginView.userLoggedInErrorHandler)

          appData.services.phpService.loginService(appData.models.userModel);
        }
      });

      return this;
    }
});

