var ttc = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=32"
var prediction = "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&stopId="
// function not being called yet
// function get_station(station_number) {
//   return "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=" + station_number
// }

var json = {};


$.get(ttc, prediction, function(xml){
  json = $.xml2json(xml);
  $('#route').html((json.route.title));


  // stores names of stops
  var stops = json.route.stop
  // iterates over each stop and collects stopId
  stops.forEach(function(stop, index){
    $('#myTransit').append("<option value='" + stop.stopId + "'>" + stop.title + "</option>");

  // use stopId that user selected to show predicted times  
  $('myTransit').val(function(value) {
    

  });

});
});









