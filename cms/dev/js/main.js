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






