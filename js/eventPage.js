var routesBaseUrl = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc"
var directionsBaseUrl = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r="
var stopBaseUrl = "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&stopId="



$(document).ready(function(){
  var routes,
  currentRouteTag,
  directions,
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
    $("#upcoming").html("");
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
        var stopIdUrl = (stopBaseUrl + stopTag.stopId + "&routeTag=" + currentRouteTag);
        $.get(stopIdUrl, function(xml){
          var response = $.xml2json(xml, true);
          if (!response.predictions || typeof response.predictions[0].direction === "undefined") {
            $("#no-prediction").html("Nothing's coming..now. Please check back soon!!");
            return;
          } 

          function timeConvert(coming){
            var predTime = parseInt(coming.seconds);
            var betterTime = moment.duration(predTime, 'seconds');
            var hours = Math.floor(betterTime.asHours());
            var mins = Math.floor(betterTime.asMinutes()) - hours * 60;
            $("#upcoming").append('<li>' + (hours + " m: " + mins) + '</li>');
            $('#routeDirections').html(directions.title);
            $("#your-times").html('Your upcoming times:');
          };
          var directions = response.predictions[0].direction;

          directions.forEach(function(direction){
            direction.prediction.forEach(function(prediction){
              timeConvert(prediction, direction.title);
            });
          });
        });
      };
  });
});

return true;

});
