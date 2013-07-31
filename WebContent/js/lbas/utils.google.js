var geocoder = new google.maps.Geocoder();

function GMapsHelper() { }

//usage: GMapsHelper.reverseGeocode(45.77061, 8.071548000000007, function() { ... });
GMapsHelper.reverseGeocode = function(lat, lon, callback, fail_callback, param) {

  geocoder.geocode({ 'latLng': new google.maps.LatLng( lat, lon ) }, function( results, status ) {
    if (status == google.maps.GeocoderStatus.OK) {
      if ( results[0] ) {
        callback( GMapsHelper.addressToObj(results[0], lat, lon), param );
      }
    } else if ( fail_callback != undefined ) {
      //alert("Geocoder failed due to: " + status);
      fail_callback();
    }
  });

};

GMapsHelper.addressToObj = function(r, lat, lon, requestAddress) {
  if ( typeof(r) == 'undefined' )
    return;

  var data = {};

  if ( lat != undefined )
    data.lat = lat;
  if ( lon != undefined )
    data.lng = lon;
  if ( requestAddress != undefined )
    data.requestAddress = requestAddress;
  data.address = r.formatted_address;

  data.latitude  = r.geometry.location.lat();
  data.longitude = r.geometry.location.lng();

  $.each(r.address_components, function(id, addr) {
    switch ( addr.types[0] ) {
      case 'street_number':
          data.street_number = addr.long_name;
        break;
      case 'postal_code':
          data.postal_code = addr.long_name;
        break;
      case 'street_address':
          data.street = addr.long_name;
        break;
      case 'route':
          if ( data.street == undefined )
            data.street = addr.long_name;
        break;
      case 'locality':
          data.city = addr.long_name;
        break;
      case 'administrative_area_level_3':
          if ( data.city == undefined )
            data.city = addr.long_name;
        break;
      case 'country':
          data.country = addr.long_name;
        break;
      default: break;
    };
  });

  return data;
};

GMapsHelper.routeMarkers = function(myRoute, noDrawIcon) {
  for (i = 0; i <= myRoute.legs.length; i++) {
    var lat, lng;
    if ( i == myRoute.legs.length ) {
      lat = myRoute.legs[ i - 1 ].end_location.lat();
      lng = myRoute.legs[ i - 1 ].end_location.lng();
    } else {
      lat = myRoute.legs[i].start_location.lat();
      lng = myRoute.legs[i].start_location.lng();
    }
    if(!noDrawIcon) {
      GMapsHelper.createRouteMarker(i,lat,lng);
    }
  }
};


GMapsHelper.createRouteMarker = function(i,lat,lng) {
  
  var letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
  var icon = 'images/pin_route_' + letters[i] + '.png';
  if ( typeof(pinImagesFromPages) != "undefined" )
    icon = '../' + icon;
      mainMarkerManager.createMarker({
      id: 'routeMarker' + i,
      latitude: lat,
      longitude: lng,
      hasTooltip: false,
      staticContent: true,
      icon: icon,
      forceToOpen: true
    });
};


//Gmaps migrated copy of NavteqGISManager.poi
GMapsHelper.deg2dms = function(deg) {
  var d  = parseInt(deg);
  var md = Math.abs(deg - d) * 60;
  var m  = parseInt(md);
  var sd = (md - m) * 60;
  return parseInt(d*100)/100 + '°' + parseInt(m*100)/100 + "'" + parseInt(sd*100)/100 + '"';
};

//Gmaps migrated copy of NavteqGISManager.poi
GMapsHelper.poi = function(name, bounds, success, fail) {

  /*var poisBound = {
    0: {
      lat: 0,
      lng: 0
    },
    1: {
      lat: 0,
      lng: 0
    }
  };
  var leftBottom;
  var rightTop;
  if (bounds == null) {
    var extent = map.getBounds();
    var leftBottom = extent.getSouthWest();
    var rightTop = extent.getNorthEast();
    poisBound[0].lat = leftBottom.lat();
    poisBound[0].lng = leftBottom.lng();
    poisBound[1].lat = rightTop.lat();
    poisBound[1].lng = rightTop.lng();
  } else {
    rightTop = bounds.rightTop;
    leftBottom = bounds.leftBottom;
    poisBound[0].lat = leftBottom.lat;
    poisBound[0].lng = leftBottom.lon;
    poisBound[1].lat = rightTop.lat;
    poisBound[1].lng = rightTop.lon;
  }

  var midpointLat = (poisBound[1].lat + poisBound[0].lat) / 2;
  var midpointLon = (poisBound[1].lng + poisBound[0].lng) / 2;

  var radius = distanceBetweenTwoPoints(poisBound[0].lat, poisBound[0].lng, midpointLat, midpointLon);*/
  success();

};

GMapsHelper.getVectorStyle = function() {
  return {
    cursor: "inherit",
    fillColor: "#ee9900",
    fillOpacity: 0.4,
    hoverFillColor: "white",
    hoverFillOpacity: 0.8,
    hoverPointRadius: 1,
    hoverPointUnit: "%",
    hoverStrokeColor: "red",
    hoverStrokeOpacity: 1,
    hoverStrokeWidth: 0.2,
    pointRadius: 6,
    pointerEvents: "visiblePainted",
    strokeColor: "#ee9900",
    strokeDashstyle: "solid",
    strokeLinecap: "round",
    strokeOpacity: 1,
    strokeWidth: 1
  };
};