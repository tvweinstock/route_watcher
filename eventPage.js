var ttc = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=32"
var ttc = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=32"

function get_station(station_number) {
  return "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=" + station_number
}

var json = {};



$.get(ttc, function(xml){
  json = $.xml2json(xml);
});






// Use ttcStations() to load the stations
// use ngRepeat to list the stations on the page

// Place filter on station results
// Create a searcher input field

// Figure out what station has been selected
// show time of next departure






// Geolocation 
// ttcNearby()