var routesBaseUrl = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc"
var directionsBaseUrl = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r="
var stopBaseUrl = "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&stopId="
// var ttcNextBus = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=32"
// var whatsComing = "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&stopId="
// var routeTag = "&routeTag=32"
var json = {};
// function not being called yet
// function get_stop(stop_id) {
//   return "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&stopId=" + stop_id + "&routeTag=32"
// };


// this url gets specific for the stop id and the routeTag
// "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=<agency_tag>&stopId=<stop id>&routeTag=<route tag>"
$(document).ready(function(){

  // Get routes
  $.get(routesBaseUrl, function(xml){
    json = $.xml2json(xml);
    var routes = json.route
    routes.forEach(function(route, index){
      $('#myRoute').append("<option value='" + route.tag + "'>" + route.title + "</option>");
      $('#myRoute').prop("selectedIndex", -1);
    });
  });

  // Manage change of route
  $('#myRoute').on('change', function(){
    $('#myDirection').html("");
    $('#myStop').html("");
    var directionsUrl = (directionsBaseUrl + this.value);
    $.get(directionsUrl, function(xml){
      json = $.xml2json(xml);
      var directions = json.route.direction
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
    json.route.direction.forEach(function(direction) {
      if (direction.tag == menuValue) {
        direction.stop.forEach(function(stop) {
          stops.push(stop);
        });
      }
    });

    stops.forEach(function(stop, index){
      $('#myStop').append("<option value='" + stop.tag + "'>" + stop.tag + "</option>");
      $('#myStop').prop("selectedIndex", -1);
    });

    $("#myStop").on("change", function(){
      $("#upcoming").html("");
      console.log(this.value);
      var stopMenuValue = this.value;
      json.route.stop.forEach(function(stopTag){
        if (stopTag.tag == stopMenuValue) {
          var stopIdUrl = (stopBaseUrl + (stopTag.stopId) + "&routeTag=" + (json.route.tag));
          $.get(stopIdUrl, function(xml){
            json = $.xml2json(xml);

            var predictions = json.predictions.direction.prediction;
            console.log(predictions)
            predictions.forEach(function(coming){
              var predTime = parseInt(coming.seconds);
              var betterTime = moment.duration(predTime, 'seconds');
              var hours = Math.floor(betterTime.asHours());
              var mins = Math.floor(betterTime.asMinutes()) - hours * 60;
              if (predictions == 0) {
                $("#yourTimes").html("Nothing's coming!..now. Please check back soon!!");
              } else {
                $("#upcoming").append('<li>' + ("h: " + hours + " m: " + mins) + '</li>');
                $("#yourTimes").html('Your upcoming times');
              };
            });
          })
        };
      });
      
    });

return true;
})
});

// TODO   
// convert predicted times to look good
// if a user picks a new bus remove the previous predicted times
// var time = new Date(epochTime)











