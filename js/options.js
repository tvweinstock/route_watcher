var routesBaseUrl = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc"

// Saves options to chrome.storage

$.get(routesBaseUrl, function(xml){
  var response = $.xml2json(xml);
  routes = response.route
  routes.forEach(function(route, index){
    $('#myRoute').append("<option value='" + route.tag + "'>" + route.title + "</option>");
    $('#myRoute').prop("selectedIndex", -1);
  });
});

function save_options() {
  var userRoute = $('#myRoute').value;
  chrome.storage.sync.set({
    selectedRoute: userRoute
  }, function () {
    var status = $('#status');
    status.textContent = "Options saved.";
    setTimeout(function(){
      status.textContent = '';
    }, 1000);
  }
  )
  
}
