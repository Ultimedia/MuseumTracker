Settings = Backbone.Model.extend({
	defaults: {
		loggedIn: false,
		language: "nl",
		copy: {
			nl: {
				login: {
					loginBtn: "Login",
					emailField: "E-mailadres",
					passwordField: "Paswoord",
					loginError: "Je paswoord is niet correct of je hebt geen toegang tot het CSM systeem."
				}
			}
		}
	},
	initialize: function(){
    	this.bind("change:language", this.languageChangeHandler)
	},

	// update the language
    languageChangeHandler: function(event){
    	Backbone.trigger('languageChangeHandler');
    }
});

