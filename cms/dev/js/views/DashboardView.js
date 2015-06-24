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
