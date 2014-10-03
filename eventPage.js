var ttc = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=32"


function get_station(station_number) {
  return "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=" + station_number
}

var json = {};


$.get(ttc, function(xml){
  json = $.xml2json(xml);
  $('#route').html((json.route.title));


  function findAllStops() {
    var stops = json.route.stop
    console.log(stops)
    for (var i=0; i<stops.length; i++) {
      return(i);
    };
  }

});



