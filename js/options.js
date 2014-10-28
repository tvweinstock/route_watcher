var routesBaseUrl = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc"
var directionsBaseUrl = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r="
var stopBaseUrl = "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&stopId="

$(document).ready(function() {
  var routes,
  currentRouteTag,
  directions,
  routeStops,
  stopIdUrl,
  favoriteStops = []

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
  $("#myStop").on("change", function(){
    $("#upcoming").html("");
    var stopMenuValue = this.value;
    routeStops.forEach(function(stopTag){
      if (stopTag.tag == stopMenuValue) {
        stopIdUrl = (stopBaseUrl + stopTag.stopId + "&routeTag=" + currentRouteTag);        
      };    
    });
  });

  

  function saveOptions() {
    var route = $('#myRoute option:selected');
    var stop = $('#myStop option:selected');
    stopIdUrl = stopIdUrl
    favoriteStops.push({
      routeTag: route.attr("value"),
      stopTag: stop.attr("value"),
      stopIdUrl: stopIdUrl,
      name: stop.text()
    });
    stop.removeAttr('selected');
    chrome.storage.sync.set({
      favoriteStops: favoriteStops
    }, function() {
        // Update status to let user know options were saved.
        var status = $('#status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
          status.textContent = '';
        }, 750);
        displayOptions();
      });
  };

  function displayOptions() {
    $('#favorites-list').html('');
    $.each(favoriteStops, function(index, stop) {

      $.get(stop.stopIdUrl, function(xml){
        var response = $.xml2json(xml, true);
        if (!response.predictions || typeof response.predictions[0].direction === "undefined") {
          $("#no-prediction").html(stop.name + " - Nothing's coming..now. Please check back soon!!");
          return;
        } 

        function showTime(coming, name){
          var predTime = parseInt(coming.seconds);
          var betterTime = moment.duration(predTime, 'seconds');
          var hours = Math.floor(betterTime.asHours());
          var mins = Math.floor(betterTime.asMinutes()) - hours * 60;
          $("#upcoming").append('<li>' + stop.name + " " + hours + " m: " + mins + '</li>');
        };
        var directions = response.predictions[0].direction;

        directions.forEach(function(direction){
          direction.prediction.forEach(function(prediction){
            showTime(prediction, direction.title);
          });
        });
      });
    });
  };

document.getElementById('save').addEventListener('click', saveOptions);

chrome.storage.sync.get("favoriteStops", function(data){
  favoriteStops = data.favoriteStops || [];
  displayOptions();

});


});












// to reset code in array
// chrome.storage.sync.set({ favoriteStops: [] });