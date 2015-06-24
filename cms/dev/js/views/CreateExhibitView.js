appData.views.CreateExhibitView = Backbone.View.extend({
    initialize: function () {

    	this.model = new Exhibit();
    	appData.views.CreateExhibitView.model = this.model;
    	appData.views.CreateExhibitView.model.attributes.exhibit_museum_id = appData.selectedMuseum.attributes.museum_id
    	appData.views.CreateExhibitView.coverUploaded = false

    	_.bindAll(this);    
	    Backbone.on('languageChangeHandler', this.render);
    	appData.views.CreateExhibitView.fileUploadedHandler = this.fileUploadedHandler;
      appData.views.CreateExhibitView.exhibitCreatedHandler = this.exhibitCreatedHandler;

    },

    addedChallengeHandler: function(){
   		Backbone.off('addedCoverHandler');
    	appData.views.CreateExhibitView.coverUploaded = true
    },

    fileErrorHandler: function(){
      Backbone.off('fileErrorEvent');
      alert('Het bestand dat je hebt gekozen is te groot, verklein het bestand en probeer opnieuw');
    },

    render: function() {
    	this.$el.html(this.template({copy: appData.settings.attributes.copy[appData.settings.attributes.language].login}));
    	appData.settings.currentPageHTML = this.$el;


      $('#createTitle span', appData.settings.currentPageHTML).text(appData.selectedMuseum.attributes.museum_title);

    	$('#exhibit-form', appData.settings.currentPageHTML).validate({
    		ignore: ":hidden", 

		    errorPlacement: function(error, element) {

        },

    		submitHandler: function(){

    			appData.views.CreateExhibitView.model.attributes.exhibit_title = $('#exhibitTitle', appData.settings.currentPageHTML).val();
    			appData.views.CreateExhibitView.model.attributes.exhibit_description = $('#description', appData.settings.currentPageHTML).val();
    			appData.views.CreateExhibitView.model.attributes.exhibit_subtitle = $('#subtitel', appData.settings.currentPageHTML).val();

          appData.views.CreateExhibitView.model.attributes.exhibit_museum_id = appData.selectedMuseum.attributes.museum_id
          appData.views.CreateExhibitView.model.attributes.exhibit_hash = ""
          appData.views.CreateExhibitView.model.attributes.exhibit_website = ""
          appData.views.CreateExhibitView.model.attributes.exhibiti_twitter = ""
          appData.views.CreateExhibitView.model.attributes.exhibit_facebook = ""
          appData.views.CreateExhibitView.model.attributes.exhibit_twitter_enabled  = 1
          appData.views.CreateExhibitView.model.attributes.exhibit_facebook_enabled = 1
          appData.views.CreateExhibitView.model.attributes.exhibit_adres  =  $('#adres', appData.settings.currentPageHTML).val();
          appData.views.CreateExhibitView.model.attributes.exhibit_opening = $('#openingsuren', appData.settings.currentPageHTML).val();


    			if(appData.views.CreateExhibitView.coverUploaded){

    				// now create this exhibit
            Backbone.on('exhibitCreated', appData.views.CreateExhibitView.exhibitCreatedHandler);
    				appData.services.phpService.createExhibitService(appData.views.CreateExhibitView.model);



    			}else{
            alert('Upload een cover afbeelding voor deze exhibitie')
          }

    		}
    		});


    


      return this;
    },

    events: {
    	"change #nonNativeFileField":"nonNativeFileSelectedHandler",
      	"submit #mediaForm": "mediaFormSubmitHandler",
      	"click #createExhibit": "submitFormHandler"
    },

    exhibitCreatedHandler: function(dataEvent){
      Backbone.off('exhibitCreated')

      appData.exhibitCreated = true;
      appData.exhibitCreatedId = dataEvent;

      Backbone.trigger('refreshData', appData.views.DashboardView.refreshDataHandler);
    },

    submitFormHandler: function(evt){
    	$('#exhibit-form', appData.settings.currentPageHTML).submit()
    },

    fileUploadedHandler: function(data){
      Backbone.off('fileUploadedEvent');
      var filename = data.files[0].replace(/^.*[\\\/]/, '');
      
      // store filename
      appData.views.CreateExhibitView.coverUploaded = true
      appData.views.CreateExhibitView.model.attributes.exhibit_cover_image = filename;
      $('#coverImage', appData.settings.currentPageHTML).attr('src', appData.services.imagePath +  filename).removeClass('hide');
    },

    nonNativeFileSelectedHandler: function(evt){

        // upload script
        var files = evt.target.files;
        appData.views.CreateExhibitView.files = files;

        $('#mediaForm', appData.settings.currentPageHTML).submit();
    },

    mediaFormSubmitHandler: function(event){
      event.stopPropagation(); // Stop stuff happening
      event.preventDefault(); // Totally stop stuff happening

      // Create a formdata object and add the files
      var data = new FormData();
      $.each(appData.views.CreateExhibitView.files, function(key, value){
      	console.log(key);
      	console.log(value);

        data.append(key, value);
      });

      Backbone.on('fileUploadedEvent', appData.views.CreateExhibitView.fileUploadedHandler);
      
      appData.services.phpService.uploadExhibitCover(data);

    }

});

