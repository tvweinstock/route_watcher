var ttc = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=32"
var whatsComing = "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&stopId="
var routeTag = "&routeTag=32"
// function not being called yet
// function get_stop(stop_id) {
//   return "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&stopId=" + stop_id + "&routeTag=32"
// };


// this url gets specific for the stop id and the routeTag
// "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=<agency_tag>&stopId=<stop id>&routeTag=<route tag>"

var json = {};

$.get(ttc, function(xml){
  json = $.xml2json(xml);
  $('#route').html((json.route.title));
  // stores names of stops
  var stops = json.route.stop
  // iterates over each stop and collects stopId
  stops.forEach(function(stop, index){
    $('#myTransit').append("<option value='" + stop.stopId + "'>" + stop.title + "</option>");
    $('#myTransit').prop("selectedIndex", -1);
  });
});

var x = 433276000
var d = moment.duration(x, 'seconds');
var hours = Math.floor(d.asHours());
var mins = Math.floor(d.asMinutes()) - hours * 60;
console.log("hours:" + hours + " mins:" + mins);

$(document).ready(function(){
  $('#myTransit').on('change', function(){      
    var stop_data = (whatsComing + this.value + routeTag)
    console.log(stop_data)
    $.get(stop_data, function(xml){
      json = $.xml2json(xml);

      var thisRoute = json.predictions.direction.prediction;
      thisRoute.forEach(function(coming){
        var predTime = coming.seconds;
        console.log(predTime)
        var betterTime = moment.duration(predTime, 'seconds');
        var hours = Math.floor(betterTime.asHours());
        var mins = Math.floor(betterTime.asMinutes()) - hours * 60;
        console.log("hours:" + hours + " mins:" + mins);
        

        $("#upcoming").append('<li>' + predTime + '</li>');
        $("#yourTimes").html('Your upcoming times');

    });


    });
  });

});










// TODO   
// convert predicted times to look good
// if a user picks a new bus remove the previous predicted times
// var time = new Date(epochTime)











