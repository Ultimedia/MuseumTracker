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


