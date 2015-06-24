(function(){

// application data
var appData = {
  views: {},
  models: {},
  routers: {},
  collections: {},
  settings: {},
  utils: {},
  templates: {},
  services: {}
};

appData.settings.apiPath = "http://localhost/services/index.php";
appData.services.apiPath = "http://localhost/services/index.php";
appData.services.servicePath = "/services/webservices/services/";
appData.services.loginService =  appData.services.servicePath + "loginService.php";
appData.services.uploadExhibitCoverService = appData.services.servicePath + "uploadExhibitCover.php";
appData.services.createExhibitService = appData.services.servicePath + "createExhibit.php";
appData.services.removeExhibitService = appData.services.servicePath + "removeExhibit.php";
appData.services.createRoomService = appData.services.servicePath + "createRoom.php";
appData.services.removeRoomService = appData.services.servicePath + "removeRoom.php";
appData.services.createMediaService = appData.services.servicePath + "createMedia.php";
appData.services.removeMediaService = appData.services.servicePath + "removeMedia.php";
appData.services.removeBeaconService = appData.services.servicePath + "removeBeacon.php";
appData.services.createBeaconService = appData.services.servicePath + "createBeacon.php";
appData.services.setRoomorderService = appData.services.servicePath + "setOrder.php";
appData.services.updateExhibitService = appData.services.servicePath + "updateExhibit.php";
appData.services.roomUpdateService = appData.services.servicePath + "updateRoom.php";
appData.services.updateBeaconService = appData.services.servicePath + "updateBeacon.php";
appData.services.updateMediaService = appData.services.servicePath + "updateMedia.php";
appData.services.loginService = appData.services.servicePath + "loginService.php";


appData.services.imagePath = "/services/uploads/";


// settings
appData.exhibitCreated = false;


//appData.settings.apiPath = "eni/alp/syn/";
//appData.settings.pdfPath = "/pdf/";
//appData.services.servicePath = "almo/services/";

appData.settings.defaultLanguage = "/nl";

// initialise jquery
$(document).on("ready", function () {

  // New services class
  appData.services.phpService = new appData.services.PhpServices();

  // load backbone templates
  appData.utils.templates.load(["AppView", "LoginView", "DashboardView", "ExhibitView", "SettingsView", "NotFoundView", "CreateExhibitView", "StatisticsView", "NoExhibitView"],
  function () {

    // create a new app view instance and render it
    appData.settings = new Settings(); 
    
    var app = new appData.views.AppView();
    $("body").prepend(app.render().$el);

    // start history tracking
    Backbone.history.start();
  });
});








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

Media = Backbone.Model.extend({
	defaults:{
		mercury_media_id: "",
		mercury_room_id: "",
		mercury_room_media_caption: "",
		mercury_room_media_url: "",
		mercury_room_media_type: ""
	},
	url: appData.services.roomService,
	initialize: function(){

	}
});

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




Room = Backbone.Model.extend({
	defaults:{
		mercury_room_id: "",
		mercury_room_exhibit_id: "",
		mercury_room_type: "",
		mercury_room_title: "",
		mercury_room_description: "",
		mercury_room_order: ""
	},
	url: appData.services.roomService,
	initialize: function(){

	}
});

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



User = Backbone.Model.extend({
	defaults:{
		user_email: "",
		user_password: "",
		user_id: ""

	},
	initialize: function(){

	}
});






MuseumCollection = Backbone.Collection.extend({
	model: Museum,
   initialize: function(models,options) { 
        this.url = (options||{}).url || "defaultURL";
    },
});

  // Create the app view container
  appData.views.AppView = Backbone.View.extend({
    tagName: 'div',
    id: "application",

    initialize: function(options) { 
      _.bindAll(this); 

      // Load data on app init
      Backbone.on('languageChangeHandler', this.changeLanguage);  
    }, 

    events:{
      "click #languageSelection": "languageClickHandler",
      "click #logo": "logoClickHandler"
    },

    logoClickHandler: function(){
      appData.router.navigate('#evaluate', true);
    },

    languageClickHandler: function(evt){
      if(!$(evt.target).hasClass('selected')){

        // set button
        $('#languageSelection li a').toggleClass('selected');
        appData.settings.set('language', $(evt.target).attr('data-lang'));
      }
    },
    
    render: function() { 
      this.$el.html(this.template({copy: appData.settings.attributes.copy[appData.settings.attributes.language].general}));    
      appData.router = new appData.routers.AppRouter();
 
      return this; 
    },

    changeLanguage: function(){
      $('#brand h2').text(appData.settings.attributes.copy[appData.settings.attributes.language].general.title);
    }
});



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



appData.views.DashboardView = Backbone.View.extend({
    initialize: function () {
    	_.bindAll(this);
        
        appData.views.DashboardView.render  = this.render
        appData.views.DashboardView.optionSelected = ""
        appData.views.DashboardView.refreshDataHandler = this.refreshDataHandler;

        appData.selectedMuseum = new Museum() 

        this.refreshDataHandler();

        Backbone.on('refreshData', appData.views.DashboardView.refreshDataHandler);

    },

    refreshDataHandler: function(){ 
        var noExhibit = false;

        appData.collections.museumCollection = new MuseumCollection([],{url:appData.services.apiPath + "/museumsAdmin/" + appData.models.userModel.get('user_id')});
        appData.collections.museumCollection.on("sync reset",this.render);
        appData.collections.museumCollection.fetch().done(function(){
            if(appData.collections.museumCollection.length > 0){

                if(appData.exhibitCreated == true || appData.exhibitRemoved == true ||appData.forwardMuseum == true || appData.dataEdit == true){
                                    // set the selected museum
                    appData.collections.museumCollection.each(function(museum){

                        if(museum.attributes.museum_id == appData.selectedMuseum.attributes.museum_id){

                            appData.selectedMuseum = museum
                        }
                    });
                }

                // in case we are forwarding the user from creating a new exhibit
                if(appData.exhibitCreated){

                    appData.exhibitCreated = false;
                    $.each(appData.selectedMuseum.attributes.exhibits, function( index, value ) {
                        if(value.exhibit_id == appData.exhibitCreatedId){
                            appData.selectedExhibit = value
                        }
                    });

                }else if(appData.exhibitRemoved == true || appData.forwardMuseum == true){

                    appData.exhibitRemoved = false;
                    if(appData.selectedMuseum.attributes.exhibits.length > 0){
                        appData.selectedExhibit = appData.selectedMuseum.attributes.exhibits[0];
                    }else{
                        noExhibit = true;
                    }

                }else if(appData.dataEdit == true){
                    appData.dataEdit = false;

              //      alert('data edit')

                    $.each(appData.selectedMuseum.attributes.exhibits, function(index, exhibit){


                        if(index == appData.selectedExhibitID){

//                            alert(appData.selectedExhibit + " " + exhibit.exhibit_title)

                            appData.selectedExhibit = exhibit;
                            appData.setScroll = true;
                            console.log(exhibit);

                        }
                    });

                }else{
                    appData.selectedMuseum = appData.collections.museumCollection.models[0]

                    if( appData.selectedMuseum.attributes.exhibits.length > 0){
                        appData.selectedExhibit = appData.selectedMuseum.attributes.exhibits[0]    
                        appData.selectedExhibitID =   appData.selectedExhibit.exhibit_id;            
                    }
                }

                appData.views.DashboardView.render();

                // add selected exhibit
                if(noExhibit){
                    $('#container #page-content-wrapper').empty().append(new appData.views.NoExhibitView().render().$el)
                }else{
                    $('#container #page-content-wrapper').empty().append(new appData.views.ExhibitView().render().$el)
                }

                if(appData.setScroll){

                    appData.setScroll = false;

                    $(window, appData.settings.currentPageHTML).scrollTop(appData.scrollTop)
                }

            }
        });

    },

    events:{
        "change #museumSelect": "museumSelectChangedHandler",
        "click .exhibit-select": "exhibitSelectHandler",
        "click #removeExhibit": "removeExhibitHandler",
        "click #room-add": "createModalHandler",
        "click #createExhibitBtn": "createExhibitHandler"
    },

    createExhibitHandler: function(evt){

       if (appData.settings.get('loggedIn')) $('#container #page-content-wrapper').empty().append(new appData.views.CreateExhibitView().render().$el);
       else appData.router.navigate("login", true);

    },

    removeExhibitHandler: function(evt){
        $("#removeModal").modal('show');
    },

    createModalHandler: function(evt){
        $("#createModal").modal('show');
    },

    exhibitSelectHandler: function(evt){
        evt.preventDefault();

        // now get the right museums
        var exhibitSelected = $(evt.target).attr('exhibit-id');
            appData.selectedExhibit = appData.selectedMuseum.attributes.exhibits[exhibitSelected];
            appData.selectedExhibitID = exhibitSelected;

         $('#container #page-content-wrapper').empty().append(new appData.views.ExhibitView().render().$el);
    },

    museumSelectChangedHandler: function(evt){
        // now get the right museums
        var optionSelected = $("option:selected", evt.target).attr('museum-id');
        appData.selectedMuseum = appData.collections.museumCollection.models[optionSelected];

        if(appData.selectedMuseum.attributes.exhibits.length > 0){
            appData.selectedExhibit = appData.selectedMuseum.attributes.exhibits[0];
            appData.selectedExhibitID = appData.selectedExhibit.exhibit_id;
        }
        appData.views.DashboardView.optionSelected = optionSelected;

        appData.views.DashboardView.render();
        if(appData.selectedMuseum.attributes.exhibits.length == 0){
            $('#container #page-content-wrapper').empty().append(new appData.views.NoExhibitView().render().$el)
        }else{
            appData.selectedExhibit = appData.selectedMuseum.attributes.exhibits[0];
            $('#container #page-content-wrapper').empty().append(new appData.views.ExhibitView().render().$el)
        }
    },

    renderTableViews: function(internship){
        var internShipTableView = new appData.views.InternListView({model:internship});
        $('#internshipsTable tbody').append(internShipTableView.render().$el);
	},

    render: function() {
        $('.sidebar-nav').empty()

        this.$el.html(this.template({museums: appData.collections.museumCollection.toJSON(), selectedMuseum: appData.selectedMuseum.toJSON(), optionSelected: appData.views.DashboardView.optionSelected  }));
        appData.views.DashboardView.firstRender = "false"


      	return this;
    }
});


appData.views.ExhibitView = Backbone.View.extend({
    initialize: function () {
    	_.bindAll(this);
    	Backbone.on('languageChangeHandler', this.render);
        appData.views.ExhibitView.roomModel = new Room();
        appData.views.ExhibitView.mediaModel = new Media();
        appData.views.ExhibitView.beaconModel = new Beacon();

        appData.views.ExhibitView.exhibitRemovedHandler = this.exhibitRemovedHandler;
        appData.views.ExhibitView.roomCreatedHandler = this.roomCreatedHandler;
        appData.views.ExhibitView.roomDeletedHandler = this.roomDeletedHandler;
        appData.views.ExhibitView.mediaCreatedHandler = this.mediaCreatedHandler;
        appData.views.ExhibitView.mediaRemovedHandler = this.mediaRemovedHandler;
        appData.views.ExhibitView.fileUploadedHandler = this.fileUploadedHandler;
        appData.views.ExhibitView.fileCoverUploadedHandler = this.fileCoverUploadedHandler;
        appData.views.ExhibitView.beaconRemovedHandler = this.beaconRemovedHandler;
        appData.views.ExhibitView.beaconCreatedHandler = this.beaconCreatedHandler;
        appData.views.ExhibitView.exhibitUpdatedHandler = this.exhibitUpdatedHandler;
        appData.views.ExhibitView.beaconUpdatedHandler = this.beaconUpdatedHandler;
        appData.views.ExhibitView.mediaUpdatedHandler = this.mediaUpdatedHandler;

        // media uploaded
        appData.views.ExhibitView.mediaSelected = false
        appData.views.ExhibitView.mediaEdit = false

        appData.that = this
    },

    mediaUpdatedHandler: function(evt){

        Backbone.off('mediaUpdated');
    },

    beaconUpdatedHandler: function(evt){
        Backbone.off('beaconUpdated');

        $('#editBeaconModal', appData.settings.currentPageHTML).hide();
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();

        appData.scrollTop = $('body').scrollTop();
        appData.dataEdit = true;
        Backbone.trigger('refreshData');
    },

    fileUploadedHandler: function(data){

        Backbone.off('fileUploadedEvent');
        var filename = data.files[0].replace(/^.*[\\\/]/, '');
      
        // store filename
        appData.views.ExhibitView.mediaSelected = true
        appData.views.ExhibitView.mediaModel.attributes.mercury_room_media_url = filename;

        if(appData.views.ExhibitView.selectedMediaModel){
            appData.views.ExhibitView.selectedMediaModel.mercury_room_media_url = filename;
        }
        // update file
        $('#editMediaModal #badgeEdit', appData.settings.currentPageHTML).attr('src', appData.services.imagePath + "/" + filename)
        $('#createMediaModal #badge', appData.settings.currentPageHTML).attr('src', appData.services.imagePath + "/" + filename)

    },

    fileCoverUploadedHandler: function(data){

        Backbone.off('fileCoverUploadedEvent');
        var filename = data.files[0].replace(/^.*[\\\/]/, '');
      
        // store filename
        appData.selectedExhibit.exhibit_cover_image = filename;
        $('#coverImage', appData.settings.currentPageHTML).attr('src', appData.services.imagePath + "/" + filename);
    },


    nonNativeFileSelectedHandler: function(evt){

        // upload script
        var files = evt.target.files;
        appData.views.ExhibitView.files = files;


        $('#mediaForm', appData.settings.currentPageHTML).submit();
    },

    nonNativeFileEditSelectedHandler: function(evt){

        // upload script
        var files = evt.target.files;
        appData.views.ExhibitView.files = files;

        $('#mediaEditForm', appData.settings.currentPageHTML).submit();
    },

    coverFileSelectHandler: function(evt){

        // upload script
        var files = evt.target.files;
        appData.views.ExhibitView.files = files;

        $('#coverFileForm', appData.settings.currentPageHTML).submit();
    },

    mediaFormSubmitHandler: function(event){
      event.stopPropagation(); // Stop stuff happening
      event.preventDefault(); // Totally stop stuff happening

      // Create a formdata object and add the files
      var data = new FormData();
      $.each(appData.views.ExhibitView.files, function(key, value){
        data.append(key, value);
      });

      Backbone.on('fileUploadedEvent', appData.views.ExhibitView.fileUploadedHandler);
      appData.services.phpService.uploadExhibitCover(data);
    },

    coverFormSubmitHandler: function(event){
      event.stopPropagation(); // Stop stuff happening
      event.preventDefault(); // Totally stop stuff happening

      // Create a formdata object and add the files
      var data = new FormData();
      $.each(appData.views.ExhibitView.files, function(key, value){
        data.append(key, value);
      });

      Backbone.on('fileCoverUploadedEvent', appData.views.ExhibitView.fileCoverUploadedHandler);
      appData.services.phpService.updateExhibitCover(data);
    },

    events: {
        "click #editExhibitBtn": "editExhibitHandler", 
    	"click .room-btn": "roomSelectHandler",
        "click #removeExhibitModal": "removeExhibitHandler",
        "click #create-room": "createRoomHandler",
        "click .delete-room": "deleteRoomHandler",
        "click .add-media-room": "addRoomMediaHandler",
        "click #create-media": "createMediaHandler",
        "change #nonNativeFileField":"nonNativeFileSelectedHandler",
        "change #nonNativeFileFieldEdit":"nonNativeFileEditSelectedHandler",

        "change #coverFileField": "coverFileSelectHandler",
        "submit #mediaForm": "mediaFormSubmitHandler",
        "submit #mediaEditForm": "mediaFormSubmitHandler",
        "submit #coverFileForm": "coverFormSubmitHandler",
        "change #mediaSelectEdit": "mediaSelectEditHandler",

        "change #mediaSelect": "mediaSelectHandler",
        "click .media-remove-btn": "removeMediaHandler",
        "click .media-edit-btn": "editMediaHandler",
        "click .beacon-remove-btn": "removeBeaconHandler",
        "click .beacon-edit-btn": "editBeaconHandler",
        "click .add-beacon-room": "createBeaconHandler",
        "click #create-beacon": "createBeaconSubmitHandler",
        "change #room-description-edit": "roomUpdateHandler",
        "click .save-room": "saveRoomHandler",
        "click #edit-beacon-submit": "editBeaconSubmitHandler",
        "click #edit-media": "editMediaSubmitHandler",
        "change #radioVisible, #radioInvisible": "radioChangedHandler"
    },

    radioChangedHandler: function(evt){
        var visible = 0;

        if($(evt.currentTarget).attr('id') == "radioVisible"){
            visible = 1
        }else{
            visible = 0;
        }

        Backbone.on('exhibitRemoved', appData.views.ExhibitView.exhibitRemovedHandler)
        appData.services.phpService.removeExhibitService(appData.selectedExhibit.exhibit_id, visible);
   
    },

    editMediaSubmitHandler: function(evt){
        $('#edit-media-form', appData.settings.currentPageHTML).submit();
    },

    saveRoomHandler: function(evt){
        var roomID = '#rm' + $(evt.currentTarget).attr('room-id');

        var title = $(roomID + ' .room-title-edit', appData.settings.currentPageHTML).val();
        var description = $(roomID + ' .room-description-edit', appData.settings.currentPageHTML).val();
          
        appData.views.ExhibitView.roomModel.attributes.mercury_room_id = $(evt.currentTarget).attr('room-id');
        appData.views.ExhibitView.roomModel.attributes.mercury_room_title = title;
        appData.views.ExhibitView.roomModel.attributes.mercury_room_description = description;

        appData.services.phpService.updateRoomService(appData.views.ExhibitView.roomModel);
    },

    editBeaconSubmitHandler: function(evt){
        $('#beacon-edit-form', appData.settings.currentPageHTML).submit();
    },

    roomUpdateHandler: function(evt){

    },

    editExhibitHandler: function(evt){
        $('#edit-exhibit-form', appData.settings.currentPageHTML).submit();
    },

    createBeaconSubmitHandler: function(evt){
        $('#beacon-form', appData.settings.currentPageHTML).submit();
    },

    createBeaconHandler: function(evt){
        $('#createBeaconModal', appData.settings.currentPageHTML).modal('toggle');
        appData.views.ExhibitView.beaconModel.attributes.mercury_room_id = $(evt.currentTarget).attr('selected-room');
 
    },

    removeBeaconHandler: function(evt){
        Backbone.on('beaconRemoved', appData.views.ExhibitView.beaconRemovedHandler);
        appData.services.phpService.removeBeaconService($(evt.currentTarget).attr('beacon-id'));

        // remove media item
        $(evt.currentTarget).parent().remove();
    },

    beaconRemovedHandler: function(evt){
        Backbone.off('beaconRemoved');
    },

    beaconCreatedHandler: function(evt){
        $('#createBeaconModal', appData.settings.currentPageHTML).hide();
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();

        // add beacon to list
        Backbone.off('beaconCreated');
        appData.scrollTop = $('body').scrollTop();
        appData.dataEdit = true;
        Backbone.trigger('refreshData');
    },

    editBeaconHandler: function(evt){

        // open modal
        $('#editBeaconModal', appData.settings.currentPageHTML).modal('toggle');
        $.each(appData.selectedExhibit.beacons, function(index, beacon){

            if(beacon.mercury_beacon_id == $(evt.currentTarget).attr('beacon-id')){
                appData.views.ExhibitView.beacon_id = beacon.mercury_beacon_id;

                // beacon data
                $('#mercury_beacon_identifier_edit', appData.settings.currentPageHTML).val( beacon.mercury_beacon_identifier )
                $('#mercury_beacon_device_id_edit', appData.settings.currentPageHTML).val( beacon.mercury_beacon_device_id )
                $('#mercury_beacon_uuid_edit', appData.settings.currentPageHTML).val( beacon.mercury_beacon_uuid )
                $('#roomSelectEdit option').each(function(index, element){
                    if($(element).attr('room-id') == beacon.mercury_room_id){
                        $(element).attr('selected', true);
                    }
                })

            }
        });
    },

    mediaRemovedHandler: function(evt){
        Backbone.off('mediaRemoved');
    },

    removeMediaHandler: function(evt){
        Backbone.on('mediaRemoved', appData.views.ExhibitView.mediaRemovedHandler);
        appData.services.phpService.removeMediaService($(evt.currentTarget).attr('media-id'));

        // remove media item
        $(evt.currentTarget).parent().parent().remove();
    },

    editMediaHandler: function(evt){
        $('#editMediaModal', appData.settings.currentPageHTML).modal('toggle');
        appData.views.ExhibitView.mediaEdit = true
        appData.views.ExhibitView.mediaEditId = $(evt.currentTarget).attr('media-id');
        appData.views.ExhibitView.roomId = $(evt.currentTarget).attr('room-id');

        $(appData.selectedExhibit.rooms).each(function( index, element ) {
            if(element.mercury_room_id == appData.views.ExhibitView.roomId){

                var room = element;
                $(element.roomMedia).each(function( index, media ) {
                    
                    if(media.mercury_room_media_id == appData.views.ExhibitView.mediaEditId){
                        appData.views.ExhibitView.selectedMediaModel = media;
                        console.log(media);

                        $('#mediaCaptionEdit', appData.settings.currentPageHTML).text(appData.views.ExhibitView.selectedMediaModel.mercury_room_media_caption)
                        $('#mediaSelectEdit option[value="' + appData.views.ExhibitView.selectedMediaModel.mercury_room_media_type + '"]').attr('selected', 'true');
                        $('#badgeEdit', appData.settings.currentPageHTML).addClass('hide');

                        switch(appData.views.ExhibitView.selectedMediaModel.mercury_room_media_type){
                            case "image":
                                $('#badgeEdit', appData.settings.currentPageHTML).attr('src', appData.services.imagePath + "/" +  appData.views.ExhibitView.selectedMediaModel.mercury_room_media_url).removeClass('hide')
                            break;

                            case "quote":
                                $('#badgeEdit', appData.settings.currentPageHTML).attr('src', appData.services.imagePath + "/" +  appData.views.ExhibitView.selectedMediaModel.mercury_room_media_url).removeClass('hide')
                            break;

                            case "audio":


                            break;

                            case "editorial":
                                $('#badgeEdit', appData.settings.currentPageHTML).attr('src', appData.services.imagePath + "/" +  appData.views.ExhibitView.selectedMediaModel.mercury_room_media_url).removeClass('hide')
                            break;

                            case "video":

                            break;
                        }

                    }

                });
            }
        });
    },

    mediaSelectHandler: function(evt){

        $('#mediaText', appData.settings.currentPageHTML).text('Onderschrift');

        // manipulate the form
        var mediaType = $( "#mediaSelect" ).val()
        switch(mediaType){
            case "image":
                $('#badgeLabel', appData.settings.currentPageHTML).text('Afbeelding');
                $('#urlPop', appData.settings.currentPageHTML).addClass('hide');
                $('#mediaForm', appData.settings.currentPageHTML).removeClass('hide');
            break;

            case "quote":
                $('#badgeLabel', appData.settings.currentPageHTML).text('Afbeelding');
                $('#urlPop', appData.settings.currentPageHTML).addClass('hide');
                $('#mediaForm', appData.settings.currentPageHTML).removeClass('hide');

            break;

            case "audio":
                $('#badgeLabel', appData.settings.currentPageHTML).text('Afbeelding');
                $('#urlPop', appData.settings.currentPageHTML).removeClass('hide');
                $('#mediaForm', appData.settings.currentPageHTML).addClass('hide');
                $('#mediaText', appData.settings.currentPageHTML).text('Audio url (mp3)');

            break;

            case "editorial":
                $('#urlPop', appData.settings.currentPageHTML).addClass('hide');
                $('#mediaForm', appData.settings.currentPageHTML).removeClass('hide');
                $('#mediaText', appData.settings.currentPageHTML).text('Tekst');

            break;

            case "video":
                $('#urlPop', appData.settings.currentPageHTML).removeClass('hide');
                $('#mediaForm', appData.settings.currentPageHTML).addClass('hide');
                $('#mediaText', appData.settings.currentPageHTML).text('Video url (mp4)');
            break;

        }

        appData.views.ExhibitView.mediaModel.attributes.mercury_room_media_type = mediaType;
    },

    mediaSelectEditHandler: function(evt){

        $('#mediaText', appData.settings.currentPageHTML).text('Onderschrift');

        // manipulate the form
        var mediaType = $( "#mediaSelect" ).val()
        switch(mediaType){
            case "image":
                $('#badgeLabel', appData.settings.currentPageHTML).text('Afbeelding');
                $('#urlPop', appData.settings.currentPageHTML).addClass('hide');
                $('#mediaForm', appData.settings.currentPageHTML).removeClass('hide');
            break;

            case "quote":
                $('#badgeLabel', appData.settings.currentPageHTML).text('Afbeelding');
                $('#urlPop', appData.settings.currentPageHTML).addClass('hide');
                $('#mediaForm', appData.settings.currentPageHTML).removeClass('hide');

            break;

            case "audio":
                $('#badgeLabel', appData.settings.currentPageHTML).text('Afbeelding');
                $('#urlPop', appData.settings.currentPageHTML).removeClass('hide');
                $('#mediaForm', appData.settings.currentPageHTML).addClass('hide');

            break;

            case "editorial":
                $('#urlPop', appData.settings.currentPageHTML).addClass('hide');
                $('#mediaForm', appData.settings.currentPageHTML).removeClass('hide');
                $('#mediaText', appData.settings.currentPageHTML).text('Tekst');

            break;

            case "video":
                $('#urlPop', appData.settings.currentPageHTML).removeClass('hide');
                $('#mediaForm', appData.settings.currentPageHTML).addClass('hide');

            break;

        }

        appData.views.ExhibitView.mediaModel.attributes.mercury_room_media_type = mediaType;
    },

    fileErrorHandler: function(){
      Backbone.off('fileErrorEvent');
      alert('Het bestand dat je hebt gekozen is te groot, verklein het bestand en probeer opnieuw');
    },

    addRoomMediaHandler: function(evt){
        $('#createMediaModal', appData.settings.currentPageHTML).modal('toggle');
        appData.views.ExhibitView.mediaModel.attributes.mercury_room_id = $(evt.currentTarget).attr('selected-room');
        appData.views.ExhibitView.mediaEdit = false
        $('#editMediaModal #badge', appData.settings.currentPageHTML).attr('src', '');

    },

    createMediaHandler: function(evt){
        $('#media-form', appData.settings.currentPageHTML).submit();
    }, 

    mediaCreatedHandler: function(data){
        Backbone.off('mediaCreated');
        appData.views.ExhibitView.mediaSelected = false;

        $('#createMediaModal', appData.settings.currentPageHTML).hide();
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();

        $('#mediaCaption', appData.settings.currentPageHTML).val("");;
        $('#room-title', appData.settings.currentPageHTML).val("");
        $('#createMediaModal', appData.settings.currentPageHTML).modal('toggle');

        appData.scrollTop = $('body').scrollTop();
        appData.dataEdit = true;
        Backbone.trigger('refreshData');
    },

    removeExhibitHandler: function(evt){
        Backbone.on('exhibitRemoved', appData.views.ExhibitView.exhibitRemovedHandler)
        appData.services.phpService.removeExhibitService(appData.selectedExhibit.exhibit_id);
    },

    roomCreatedHandler: function(evt){

        Backbone.off('roomCreated')
        $('#createModal', appData.settings.currentPageHTML).modal('toggle');

        // clear vlaues
        $('#room-title', appData.settings.currentPageHTML).val("");
        $('#room-description', appData.settings.currentPageHTML).val("");

        // bootstrap bug
        $('#removeModal', appData.settings.currentPageHTML).remove();
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();

        appData.scrollTop = $('body').scrollTop();
        appData.dataEdit = true;
        Backbone.trigger('refreshData'); 
    },

    roomDeletedHandler: function(evt){
        Backbone.off('roomDeleted');
    },

    deleteRoomHandler: function(evt){

        var roomId = $(evt.currentTarget).attr('room-id')
        
        Backbone.on('roomDeleted', appData.views.ExhibitView.roomDeletedHandler)
        appData.services.phpService.removeRoomService(roomId);

        $(evt.currentTarget).parent().parent().hide();
    },

    roomSelectHandler: function(evt){

    },

    exhibitRemovedHandler: function(evt){

        Backbone.off('exhibitRemoved');

    },

    createRoomHandler: function(evt){
        $('#exhibit-form').submit();
    },

    render: function() {



        if(appData.selectedExhibit){

    
    	this.$el.html(this.template({ museum: appData.selectedMuseum.toJSON(), exhibit: appData.selectedExhibit, rooms: appData.selectedExhibit.rooms,  beacons: appData.selectedExhibit.beacons, imagePath: appData.services.imagePath}));
		appData.settings.currentPageHTML = this.$el

        var panelList = $('#roomList', this.$el);
        panelList.sortable({
            // Only make the .panel-heading child elements support dragging.
            // Omit this to make the entire <li>...</li> draggable.
            update: function(event, ui) { 
            console.log('update: '+ui.item.index())

                Backbone.on('roomOrderSet', appData.views.ExhibitView.roomOrderSetHandler)
                appData.services.phpService.setRoomOrder($(ui.item).attr('room-id'), ui.item.index());

            },
            start: function(event, ui) { 
                console.log('start: ' + ui.item.index())

            }
        });

        // create media form
        $('#media-form', appData.settings.currentPageHTML).validate({
            ignore: ":hidden", 

            errorPlacement: function(error, element) {
            },

            submitHandler: function(){
                appData.views.ExhibitView.mediaModel.attributes.mercury_room_media_caption =  $('#mediaCaption', appData.settings.currentPageHTML).val();;
                appData.views.ExhibitView.mediaModel.attributes.mercury_room_media_type = $( "#mediaSelect", appData.settings.currentPageHTML).val();


                if(appData.views.ExhibitView.mediaSelected == true){
                    Backbone.on('mediaCreated', appData.views.ExhibitView.mediaCreatedHandler)
                    appData.services.phpService.createMediaService(appData.views.ExhibitView.mediaModel);
                }else{
                    alert('upload een bestand')
                }
            }
            });

        }       

        $('#edit-media-form', appData.settings.currentPageHTML).validate({
            ignore: ":hidden", 

            errorPlacement: function(error, element) {
            },

            submitHandler: function(){

                appData.views.ExhibitView.selectedMediaModel.mercury_room_media_caption =  $('#mediaCaptionEdit', appData.settings.currentPageHTML).val();
                appData.views.ExhibitView.selectedMediaModel.mercury_room_media_type = $( "#mediaSelectEdit", appData.settings.currentPageHTML).val();

                if(appData.views.ExhibitView.selectedMediaModel.mercury_room_media_url != "" ){
                    Backbone.on('mediaUpdated', appData.views.ExhibitView.mediaUpdatedHandler)
                    appData.services.phpService.updateMediaService(appData.views.ExhibitView.selectedMediaModel);
                }else{
                    alert('upload een bestand')
                }
            }
            });


        // create room form
    	$('#exhibit-form', appData.settings.currentPageHTML).validate({
    		ignore: ":hidden", 

		    errorPlacement: function(error, element) {
            },

    		submitHandler: function(){

    			appData.views.ExhibitView.roomModel.attributes.mercury_room_exhibit_id = appData.selectedExhibit.exhibit_id;
    			appData.views.ExhibitView.roomModel.attributes.mercury_room_type = "room";
                appData.views.ExhibitView.roomModel.attributes.mercury_room_title = $('#room-title', appData.settings.currentPageHTML).val();
                appData.views.ExhibitView.roomModel.attributes.mercury_room_description = $('#room-description', appData.settings.currentPageHTML).val();
                appData.views.ExhibitView.roomModel.attributes.mercury_room_order = $('.list-group-item', appData.settings.currentPageHTML).size()
    
                Backbone.on('roomCreated', appData.views.ExhibitView.roomCreatedHandler)
                appData.services.phpService.createRoomService(appData.views.ExhibitView.roomModel);
    		}
    		});

        // create beacon form
        $('#beacon-form', appData.settings.currentPageHTML).validate({
            ignore: ":hidden", 

            errorPlacement: function(error, element) {
            },

            submitHandler: function(){


                appData.views.ExhibitView.beaconModel.attributes.mercury_beacon_identifier = $("#mercury_beacon_identifier", appData.settings.currentPageHTML).val();
                appData.views.ExhibitView.beaconModel.attributes.mercury_beacon_device_id = $("#mercury_beacon_device_id", appData.settings.currentPageHTML).val();
                appData.views.ExhibitView.beaconModel.attributes.mercury_exhibit_id = appData.selectedExhibit.exhibit_id;
                appData.views.ExhibitView.beaconModel.attributes.mercury_beacon_uuid = $('#mercury_beacon_uuid', appData.settings.currentPageHTML).val();
                appData.views.ExhibitView.beaconModel.attributes.mercury_media_id = 0;
                appData.views.ExhibitView.beaconModel.attributes.mercury_museum_id = appData.selectedExhibit.exhibit_museum_id;
                appData.views.ExhibitView.beaconModel.attributes.mercury_room_id = $('#roomSelect', appData.settings.currentPageHTML).find(':selected').attr('room-id');

                Backbone.on('beaconCreated', appData.views.ExhibitView.beaconCreatedHandler)
                appData.services.phpService.createBeaconService(appData.views.ExhibitView.beaconModel);

            }


        });

        $('#beacon-edit-form', appData.settings.currentPageHTML).validate({
            ignore: ":hidden", 

            errorPlacement: function(error, element) {
            },

            submitHandler: function(){

                appData.views.ExhibitView.beaconModel.attributes.mercury_beacon_id = appData.views.ExhibitView.beacon_id;
                appData.views.ExhibitView.beaconModel.attributes.mercury_beacon_identifier = $("#mercury_beacon_identifier_edit", appData.settings.currentPageHTML).val();
                appData.views.ExhibitView.beaconModel.attributes.mercury_beacon_device_id = $("#mercury_beacon_device_id_edit", appData.settings.currentPageHTML).val();
                appData.views.ExhibitView.beaconModel.attributes.mercury_exhibit_id = appData.selectedExhibit.exhibit_id;
                appData.views.ExhibitView.beaconModel.attributes.mercury_beacon_uuid = $('#mercury_beacon_uuid_edit', appData.settings.currentPageHTML).val();
                appData.views.ExhibitView.beaconModel.attributes.mercury_media_id = 0;
                appData.views.ExhibitView.beaconModel.attributes.mercury_museum_id = appData.selectedExhibit.exhibit_museum_id;
                appData.views.ExhibitView.beaconModel.attributes.mercury_room_id = $('#roomSelectEdit', appData.settings.currentPageHTML).find(':selected').attr('room-id');
                
                Backbone.on('beaconUpdated', appData.views.ExhibitView.beaconUpdatedHandler)
                appData.services.phpService.updateBeaconService(appData.views.ExhibitView.beaconModel);

            }


        });


        // create media form
        $('#edit-exhibit-form', appData.settings.currentPageHTML).validate({
            ignore: ":hidden", 

            errorPlacement: function(error, element) {
            },

            submitHandler: function(){

                appData.selectedExhibit.exhibit_title = $('#exhibitTitle', appData.settings.currentPageHTML).val();
                appData.selectedExhibit.exhibit_description = $('#description', appData.settings.currentPageHTML).val();
                appData.selectedExhibit.exhibit_subtitle = $('#subtitel', appData.settings.currentPageHTML).val();
                appData.selectedExhibit.exhibit_museum_id = appData.selectedMuseum.attributes.museum_id
                appData.selectedExhibit.exhibit_hash = ""
                appData.selectedExhibit.exhibit_website = ""
                appData.selectedExhibit.exhibiti_twitter = ""
                appData.selectedExhibit.exhibit_facebook = ""
                appData.selectedExhibit.exhibit_twitter_enabled  = 1
                appData.selectedExhibit.exhibit_facebook_enabled = 1
                appData.selectedExhibit.exhibit_adres  =  $('#adres', appData.settings.currentPageHTML).val();
                appData.selectedExhibit.exhibit_opening = $('#openingsuren', appData.settings.currentPageHTML).val();

                Backbone.on('exhibitUpdated', appData.views.ExhibitView.exhibitUpdatedHandler);
                appData.services.phpService.updateExhibitService(appData.selectedExhibit);
            }
            });

		return this;
    },

     exhibitUpdatedHandler:function(evt){
        Backbone.off('exhibitUpdated')
    }
});




appData.views.ExitView = Backbone.View.extend({
    initialize: function () {
    	_.bindAll(this);
    	Backbone.on('languageChangeHandler', this.render);
    },

    render: function() {
    	this.$el.html(this.template({copy: appData.settings.attributes.copy[appData.settings.attributes.language].home }));
		return this;
    }
});

appData.views.HomeView = Backbone.View.extend({
    initialize: function () {
    	_.bindAll(this);
    	Backbone.on('languageChangeHandler', this.render);
    },

    render: function() {
    	this.$el.html(this.template({copy: appData.settings.attributes.copy[appData.settings.attributes.language].home }));
		return this;
    }
});

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



appData.views.NoExhibitView = Backbone.View.extend({
    initialize: function () {
    	_.bindAll(this);
    },

    render: function() {
    	this.$el.html(this.template());
		return this;
    }
});

appData.views.NotFoundView = Backbone.View.extend({
    initialize: function () {
    	_.bindAll(this);    
    	Backbone.on('languageChangeHandler', this.render);
    },
    
    render: function() {
        this.$el.html(this.template({copy: appData.settings.attributes.copy[appData.settings.attributes.language].error}));
    	return this;
    }
});



appData.views.SettingsView = Backbone.View.extend({
    initialize: function () {
    	_.bindAll(this);
    	Backbone.on('languageChangeHandler', this.render);
    },

    render: function() {
    	this.$el.html(this.template({copy: appData.settings.attributes.copy[appData.settings.attributes.language].home }));
		return this;
    }
});

appData.views.StatisticsView = Backbone.View.extend({
    initialize: function () {
    	_.bindAll(this);
    },

    render: function() {
    	this.$el.html(this.template({copy: appData.settings.attributes.copy[appData.settings.attributes.language].home }));
		return this;
    }
});

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



/**
* PHP Services
*/
appData.services.PhpServices = Backbone.Model.extend({

	initialize: function() {

	},

	loginService: function(loginModel){
		var that = this;
		$.ajax({
	        url:appData.services.loginService,
	        type:'POST',
	        dataType:'json',
	        data: "user_email="+loginModel.attributes.user_email+
	        "&user_password="+loginModel.attributes.user_password,
	        timeout:60000,
	        success:function(data){

	        	if(data){
	        	if(data.value === true){
	        		Backbone.trigger('userLoggedIn', data.id);

	        	}else{

	        	}
	        	}else{
	        		Backbone.trigger('userLoggedInError');
	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},

	setRoomOrder: function(room_id, order_id){
		var that = this;

		$.ajax({
        url:appData.services.setRoomorderService,
        type:'POST',
        dataType:'json',
        data: "mercury_room_id="+room_id+
        	  "&mercury_room_order="+order_id,
        timeout:60000,
	        success:function(data){
	        	if(data.value === true){
	        		Backbone.trigger('roomOrderSet', data.id);
	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        }
    	});
	},


	removeRoomService: function(roomID){
		var that = this;

		$.ajax({
        url:appData.services.removeRoomService,
        type:'POST',
        dataType:'json',
        data: "room_id="+roomID,
        timeout:60000,
	        success:function(data){
	        	if(data.value === true){
	        		Backbone.trigger('roomRemoved', data.id);

	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},

	removeMediaService: function(mediaModel){
		var that = this;

		$.ajax({
        url:appData.services.removeMediaService,
        type:'POST',
        dataType:'json',
        data: "mercury_room_media_id="+mediaModel,
        timeout:60000,
	        success:function(data){
	        	if(data.value === true){
	        		Backbone.trigger('mediaRemoved', data.id);
	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},

	removeExhibitService: function(exhibitModel, visible){
		var that = this;

		$.ajax({
        url:appData.services.removeExhibitService,
        type:'POST',
        dataType:'json',
        data: "exhibit_id="+exhibitModel+
        "&visible="+visible,
        timeout:60000,
	        success:function(data){
	        	if(data.value === true){
	        		Backbone.trigger('exhibitRemoved', data.id);

	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},

	removeBeaconService: function(beaconModel){
		var that = this;

		$.ajax({
        url:appData.services.removeBeaconService,
        type:'POST',
        dataType:'json',
        data: "beacon_id="+beaconModel,
        timeout:60000,
	        success:function(data){
	        	if(data.value === true){
	        		Backbone.trigger('beaconRemoved', data.id);

	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},

	createRoomService: function(roomModel){
		var that = this;
		$.ajax({
	        url:appData.services.createRoomService,
	        type:'POST',
	        dataType:'json',
	        data: "mercury_room_exhibit_id="+roomModel.attributes.mercury_room_exhibit_id+
	        "&mercury_room_type="+roomModel.attributes.mercury_room_type+
	        "&mercury_room_title="+roomModel.attributes.mercury_room_title+
	        "&mercury_room_description="+roomModel.attributes.mercury_room_description+
	        "&mercury_room_order="+roomModel.attributes.mercury_room_order,
	        timeout:60000,
	        success:function(data){
	        	console.log(data);

	        	
	        	if(data.value === true){
	        		Backbone.trigger('roomCreated', data.id);
	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},


	updateRoomService: function(roomModel){
		var that = this;
		$.ajax({
	        url:appData.services.roomUpdateService,
	        type:'POST',
	        dataType:'json',
	        data: "mercury_room_id="+roomModel.attributes.mercury_room_id+
	        "&mercury_room_title="+roomModel.attributes.mercury_room_title+
	        "&mercury_room_description="+roomModel.attributes.mercury_room_description,
	        timeout:60000,
	        success:function(data){
	        	console.log(data);

	        	if(data.value === true){
	        		Backbone.trigger('roomUpdated', data.id);
	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},

	createBeaconService: function(roomModel){

		var that = this;
		$.ajax({
	        url:appData.services.createBeaconService,
	        type:'POST',
	        dataType:'json',
	        data: "mercury_beacon_identifier="+roomModel.attributes.mercury_beacon_identifier+
	        "&mercury_beacon_device_id="+roomModel.attributes.mercury_beacon_device_id+
	        "&mercury_beacon_uuid="+roomModel.attributes.mercury_beacon_uuid+
	        "&mercury_room_id="+roomModel.attributes.mercury_room_id+
	       	"&mercury_exhibit_id="+roomModel.attributes.mercury_exhibit_id+
	        "&mercury_media_id="+roomModel.attributes.mercury_media_id+
	        "&mercury_museum_id="+roomModel.attributes.mercury_museum_id,
	        timeout:60000,
	        success:function(data){
	        	
	        	if(data.value === true){
	        		Backbone.trigger('beaconCreated', data.id);
	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},

	updateBeaconService: function(roomModel){

		var that = this;
		$.ajax({
	        url:appData.services.updateBeaconService,
	        type:'POST',
	        dataType:'json',
	        data: "mercury_beacon_identifier="+roomModel.attributes.mercury_beacon_identifier+
	        "&mercury_beacon_device_id="+roomModel.attributes.mercury_beacon_device_id+
	        "&mercury_beacon_uuid="+roomModel.attributes.mercury_beacon_uuid+
	        "&mercury_room_id="+roomModel.attributes.mercury_room_id+
	       	"&mercury_exhibit_id="+roomModel.attributes.mercury_exhibit_id+
	        "&mercury_media_id="+roomModel.attributes.mercury_media_id+
	        "&mercury_museum_id="+roomModel.attributes.mercury_museum_id+
	        "&mercury_beacon_id="+roomModel.attributes.mercury_beacon_id,
	        timeout:60000,
	        success:function(data){
	        	
	        	if(data.value === true){
	        		Backbone.trigger('beaconUpdated', data.id);
	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},


	createMediaService: function(mediaModel){
		var that = this;
		$.ajax({
	        url:appData.services.createMediaService,
	        type:'POST',
	        dataType:'json',
	        data: "mercury_room_id="+mediaModel.attributes.mercury_room_id+
	        "&mercury_room_media_caption="+mediaModel.attributes.mercury_room_media_caption+
	        "&mercury_room_media_url="+mediaModel.attributes.mercury_room_media_url+
	        "&mercury_room_media_type="+mediaModel.attributes.mercury_room_media_type+
	        "&mercury_room_order="+mediaModel.attributes.mercury_room_order,
	        timeout:60000,
	        success:function(data){
	        	console.log(data);

	        	
	        	if(data.value === true){
	        		Backbone.trigger('mediaCreated', data.id);
	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},

	updateExhibitService: function(exhibitModel){
		var that = this;

		console.log(exhibitModel);

		$.ajax({
        url:appData.services.updateExhibitService,
        type:'POST',
        dataType:'json',
        data: "exhibit_museum_id="+exhibitModel.exhibit_museum_id+
        "&exhibit_title="+exhibitModel.exhibit_title+
        "&exhibit_description="+exhibitModel.exhibit_description+
        "&exhibit_hash="+exhibitModel.exhibit_hash+
        "&exhibit_website="+exhibitModel.exhibit_website+
        "&exhibiti_twitter="+exhibitModel.exhibiti_twitter+
        "&exhibit_facebook="+exhibitModel.exhibit_facebook+
        "&exhibit_subtitle="+exhibitModel.exhibit_subtitle+
        "&exhibit_cover_image="+exhibitModel.exhibit_cover_image+
        "&exhibit_twitter_enabled="+exhibitModel.exhibit_twitter_enabled+
        "&exhibit_facebook_enabled="+exhibitModel.exhibit_facebook_enabled+
        "&exhibit_adres="+exhibitModel.exhibit_adres+
        "&exhibit_opening="+exhibitModel.exhibit_opening+
        "&exhibit_id="+exhibitModel.exhibit_id,
        timeout:60000,
	        success:function(data){


	        	if(data.value === true){
	        		Backbone.trigger('exhibitUpdated');

	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        }
    	});
	},



	createExhibitService: function(exhibitModel){
		var that = this;

		console.log(appData.services.createExhibitService)

		$.ajax({
        url:appData.services.createExhibitService,
        type:'POST',
        dataType:'json',
        data: "exhibit_museum_id="+exhibitModel.attributes.exhibit_museum_id+
        "&exhibit_title="+exhibitModel.attributes.exhibit_title+
        "&exhibit_description="+exhibitModel.attributes.exhibit_description+
        "&exhibit_hash="+exhibitModel.attributes.exhibit_hash+
        "&exhibit_website="+exhibitModel.attributes.exhibit_website+
        "&exhibiti_twitter="+exhibitModel.attributes.exhibiti_twitter+
        "&exhibit_facebook="+exhibitModel.attributes.exhibit_facebook+
        "&exhibit_subtitle="+exhibitModel.attributes.exhibit_subtitle+
        "&exhibit_cover_image="+exhibitModel.attributes.exhibit_cover_image+
        "&exhibit_twitter_enabled="+exhibitModel.attributes.exhibit_twitter_enabled+
        "&exhibit_facebook_enabled="+exhibitModel.attributes.exhibit_facebook_enabled+
        "&exhibit_adres="+exhibitModel.attributes.exhibit_adres+
        "&exhibit_opening="+exhibitModel.attributes.exhibit_opening,
        timeout:60000,
	        success:function(data){

	        	if(data.value === true){
	        		Backbone.trigger('exhibitCreated', data.id);

	        		console.log(data.id)
	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},


	updateMediaService: function(mediaModel){
		var that = this;
		$.ajax({
	        url:appData.services.updateMediaService,
	        type:'POST',
	        dataType:'json',
	        data: "mercury_room_id="+mediaModel.mercury_room_id+
	        "&mercury_room_media_caption="+mediaModel.mercury_room_media_caption+
	        "&mercury_room_media_url="+mediaModel.mercury_room_media_url+
	        "&mercury_room_media_type="+mediaModel.mercury_room_media_type+
	        "&mercury_room_order="+mediaModel.mercury_room_order+
	       	"&mercury_room_media_id="+mediaModel.mercury_room_media_id,
	        timeout:60000,
	        success:function(data){
	        	
	        	if(data.value === true){
	        		Backbone.trigger('mediaUpdated');
	        	}else{

	        	}
	        },
	        error: function(er){
	        	console.log(er.responseText)
	        	alert('Fout bij het aanmaken van de exhibitie.')
	        }
    	});
	},
	

  	uploadExhibitCover: function(files){
		$.ajax({
			url:appData.services.uploadExhibitCoverService + "?files",
			type:'POST',
			cache: false,
			dataType:'json',
			data: files,
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		    success: function(data, textStatus, jqXHR){

		    	
		    	if(typeof data.error === 'undefined')
		    	{
		    		console.log("succes")
		    		// Success so call function to process the form
		    		console.log(data);
		    		Backbone.trigger('fileUploadedEvent', data);

		    	}
		    	else
		    	{
	    			//Backbone.trigger('fileErrorEvent');
		    		console.log('ERRORS: ' + data.error);
					
					alert('Het bestand dat je hebt gekozen is te groot, verklein het bestand en probeer opnieuw');
		    	}
		    },
		    error: function(jqXHR, textStatus, errorThrown)
		    {

	           alert('Het bestand dat je hebt gekozen is te groot, verklein het bestand en probeer opnieuw');
	
	    		Backbone.trigger('fileErrorEvent');		    	
		    	// Handle errors here
		    	console.log('ERRORS: ' + textStatus);
		    	// STOP LOADING SPINNER
		    }
		});	
    },



     updateExhibitCover: function(files){
		$.ajax({
			url:appData.services.uploadExhibitCoverService + "?files",
			type:'POST',
			cache: false,
			dataType:'json',
			data: files,
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		    success: function(data, textStatus, jqXHR){

		    	
		    	if(typeof data.error === 'undefined')
		    	{
		    		console.log("succes")
		    		// Success so call function to process the form
		    		console.log(data);
		    		Backbone.trigger('fileCoverUploadedEvent', data);

		    	}
		    	else
		    	{
	    			//Backbone.trigger('fileErrorEvent');
		    		console.log('ERRORS: ' + data.error);
					
					alert('Het bestand dat je hebt gekozen is te groot, verklein het bestand en probeer opnieuw');
		    	}
		    },
		    error: function(jqXHR, textStatus, errorThrown)
		    {

	           alert('Het bestand dat je hebt gekozen is te groot, verklein het bestand en probeer opnieuw');
	
	    		Backbone.trigger('fileErrorEvent');		    	
		    	// Handle errors here
		    	console.log('ERRORS: ' + textStatus);
		    	// STOP LOADING SPINNER
		    }
		});	
    }
});


appData.utils.templates = (function() {

    var load = function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (appData.views[view]) {
                deferreds.push($.get('public/templates/' + view + '.html', function(data) {
                    appData.views[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });


        $.when.apply(null, deferreds).done(callback);
    }



    // The public API
    return {
        load: load
    };


}());

})();