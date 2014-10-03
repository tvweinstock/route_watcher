var ttc = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=32"
var whatsComing = "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&stopId="
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
  $(document).ready(function(){
    $('#myTransit').on('change', function(){      
      var stop_data = (whatsComing + this.value)
      console.log(stop_data)
      $.get(stop_data, function(xml){
        json = $.xml2json(xml);
        console.log(json.predictions[1].direction);
        
        // console.log(json.predictions[1].direction.prediction[0].epochTime)
        $('#upcoming').text(json.predictions[1].direction);

      });
    });
  });













