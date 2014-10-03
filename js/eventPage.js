var ttc = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=32"


function get_station(station_number) {
  return "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=" + station_number
}

var json = {};


$.get(ttc, function(xml){
  json = $.xml2json(xml);
  $('#route').html((json.route.title));


  
  var stops = json.route.stop
  stops.forEach(function(stop, index){
    // console.log("Stop #" + index + ": " + stop.title);
    (stop.title).add($("<li></li>"));

  });
    
});


// convert XML to JSON
// iterate over stops
// select a stop
// find upcoming bus times



