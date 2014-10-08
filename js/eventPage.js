var routesBaseUrl = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc"
var directionsBaseUrl = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r="
var stopBaseUrl = "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&stopId="

function timeConvert(coming){
  var predTime = parseInt(coming.seconds);
  var betterTime = moment.duration(predTime, 'seconds');
  var hours = Math.floor(betterTime.asHours());
  var mins = Math.floor(betterTime.asMinutes()) - hours * 60;
  $("#upcoming").append('<li>' + ("h: " + hours + " m: " + mins) + '</li>');
  $("#yourTimes").html('Your upcoming times:');
};


$(document).ready(function(){
  var routes,
  currentRouteTag,
  directions,
  routeStops;

  // Get routes
  $.get(routesBaseUrl, function(xml){
    var response = $.xml2json(xml);
    routes = response.route
    routes.forEach(function(route, index){
      $('#myRoute').append("<option value='" + route.tag + "'>" + route.title + "</option>");
      $('#myRoute').prop("selectedIndex", -1);
    });
  });

  // Manage change of route
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
  })  

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
      $('#myStop').append("<option value='" + stop.tag + "'>" + stop.title + "</option>");
      $('#myStop').prop("selectedIndex", -1);
    });
  });
  $("#myStop").on("change", function(){
    $("#upcoming").html("");
    var stopMenuValue = this.value;
    routeStops.forEach(function(stopTag){
      if (stopTag.tag == stopMenuValue) {
        var stopIdUrl = (stopBaseUrl + stopTag.stopId + "&routeTag=" + currentRouteTag);
        $.get(stopIdUrl, function(xml){
          var response = $.xml2json(xml);
          if (!response.predictions || typeof response.predictions.direction === "undefined") {
            $("#yourTimes").html("Nothing's coming..now. Please check back soon!!");
            return;
          } 
          var estimateTime = response.predictions.direction.prediction;
          if (!estimateTime.Array) {timeConvert(estimateTime) 
          } else {}
          estimateTime.forEach(function(expectedBus){
            timeConvert(expectedBus);
          });

        })
      };
    });

});

return true;

});

// TODO   
// convert predicted times to look good
// if a user picks a new bus remove the previous predicted times
// var time = new Date(epochTime)