var routesBaseUrl = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc"

// give user full list of vehicles to select

$.get(routesBaseUrl, function(xml){
  var response = $.xml2json(xml);
  routes = response.route
  routes.forEach(function(route, index){
    $('#myRoute').append("<option value='" + route.tag + "'>" + route.title + "</option>");
    $('#myRoute').prop("selectedIndex", -1);
  });
});

// Saves options to chrome.storage
function save_options() {
  var route = document.getElementById('myRoute').value;
  
  chrome.storage.sync.set({
    favoriteRoute: route,
    
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

document.getElementById('save').addEventListener('click', save_options);