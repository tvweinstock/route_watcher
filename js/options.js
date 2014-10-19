var routesBaseUrl = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc"
var directionsBaseUrl = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r="
var stopBaseUrl = "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&stopId="

$.get(routesBaseUrl, function(xml){
  var response = $.xml2json(xml);
  routes = response.route
  routes.forEach(function(route, index){
    $('#myRoute').append("<option value='" + route.tag + "'>" + route.title + "</option>");
    $('#myRoute').prop("selectedIndex", -1);
  });
});

$('#myRoute').on('change', function(){
  $('#myDirection').html("");
  $('#myStop').html("");
  currentRouteTag = this.value;
  var directionsUrl = (directionsBaseUrl + this.value);
  $.get(directionsUrl, function(xml){
    var response = $.xml2json(xml);
    directions = response.route.direction;
    routeStops = response.route.stop;
    directions.forEach(function(direction, index){
      $('#myDirection').append("<option value='" + direction.tag + "'>" + direction.title + "</option>");
      $('#myDirection').prop("selectedIndex", -1);
    });
  });
});

$('#myDirection').on('change', function(){
  $('#myStop').html("");
  var stops = [];
  var menuValue = this.value;
  if (!directions) return;
  directions.forEach(function(direction) {
    if (direction.tag == menuValue) {
      routeStops.forEach(function(stop) {
        stops.push(stop);
      });
    } 
  });

  stops.forEach(function(stop, index){
    if (stop.tag.indexOf('_ar') == -1) {
      $('#myStop').append("<option value='" + stop.tag + "'>" + stop.title + "</option>");
      $('#myStop').prop("selectedIndex", -1);
    } else {
      return;
    }
  });
});

// Saves options to chrome.storage
function save_options() {
  var stop = $('#myStop option:selected');
  chrome.storage.sync.set({
    favoriteStop: {
      id: stop.attr("value"),
      name: stop.text()
    }
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
    display_options();
  });
}

function display_options() {
  chrome.storage.sync.get('favoriteStop',function(stops) {
    $.each(stops, function(index, stop) {
      $('#favouritesList').append(stop.name + "<br/>");
      
    });
  });
}


function restore_options() {
  chrome.storage.sync.get({
    favoriteRoute: '5',
    favoriteDirection: '5_0_5B',
    favoriteStop: '14189'
  }, function(items) {
    document.getElementById('myRoute').value = items.favoriteRoute;
    document.getElementById('myDirection').value = items.favoriteDirection;    
    document.getElementById('myStop').value = items.favoriteStop;
  });
}

// document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
$(document).ready(function() {
  display_options();  
});
