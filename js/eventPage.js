var ttc = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=32"
var prediction = "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&stopId="
// function not being called yet
// function get_station(station_number) {
//   return "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=" + station_number
// }

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



  // use selected stopId to show predicted times  
  $('#myTransit').on('change', function(){
    console.log(prediction + this.value);

    var stop_data = prediction + this.value
    $.get(stop_data, function(xml){
      json = $.xml2json(xml);


    });
  });













