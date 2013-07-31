TelmapGISManager.prototype = new IGISManager();

function TelmapGISManager() {
	IGISManager.apply(this, arguments);
};

var directionsService = new telmap.maps.DirectionsService();
var geocoder = new telmap.maps.Geocoder();

TelmapGISManager.prototype.route = function(req, success, fail) {
	var waypoints = [];
	for ( var i = 1; i < req.points.length - 1; i++) {

		waypoints.push( {
			'location' :new telmap.maps.LatLng(req.points[i].y, req.points[i].x)
		});
	}
	var telmapRouteRequest = {
		'origin' :new telmap.maps.LatLng(req.points[0].y, req.points[0].x),
		'destination' :new telmap.maps.LatLng(req.points[req.points.length - 1].y, req.points[req.points.length - 1].x),
		'travelMode' :(req.routeType && req.routeType == 'pedestrian') ? 'WALKING' : 'DRIVING',
		'waypoints' :waypoints
	// ,zoom :map.getZoom()
	};
	directionsService.route(telmapRouteRequest, function(response, status) {

		if (status == telmap.maps.DirectionsStatus.OK) {

			success( {
				rpoints :parseTelmapRoutes(response.trips[0].routes[0].steps),
				time :response.trips[0].routes[0].duration.text,
				distance :response.trips[0].routes[0].distance.text,
				route :parseTelmapInstructions(response.trips[0].routes[0].steps),
				totalDistanceInMeters :response.trips[0].routes[0].distance.value,
				totalTimeSeconds :response.trips[0].routes[0].duration.value,
				user :req.user
			});

		} else if (status == telmap.maps.DirectionsStatus.INVALID_SESSION && forceCreateTelmapSession) {

			telmapRefreshSession();

			lbasGISConn.route(req, success, fail);

		} else {
			var points = 'points={';
			if (req.points != null) {
				for ( var i = 0; i < req.points.length; i++) {
					points += 'lat' + i + ':' + req.points[i].y + ',lon' + i + ':' + req.points[i].x + ',';
				}
			}
			points += '}';

			var errortext = 'route request failed for ' + points + ', received status : ' + status;
			if (response != undefined && response != null)
				errortext += ' errorCode:' + response.errorCode + ' message:' + response.message;

			$.getJSON('reportError.action', {
				code :LBASErrorCodes.ROUTING_FAILED,
				text :errortext
			}, function(json) {
			});
			fail();
		}
	});
};

TelmapGISManager.prototype.singleLineGeocode = function(address, region, success, fail) {

	geocoder.geocode( {
		'address' :address,
		region :region
	}, function(response, status) {
		if (status == telmap.maps.GeocoderStatus.OK) {
			var bounds = response.results[0].geometry.viewport;
			var lbasResults = [];
			for ( var i = 0; i < response.results.length; ++i) {
				var r = response.results[i];
				var city;
				var country;
				var street;
				if (response.results[i].address_components[2]) {
					city = response.results[i].address_components[2].long_name;
				}
				if (response.results[i].address_components[3]) {
					country = response.results[i].address_components[3].long_name;
				}
				if (response.results[i].address_components[1]) {
					street = response.results[i].address_components[1].long_name;
				}

				lbasResults[i] = {
					address :response.results[i].formatted_address,
					city :city,
					country :country,
					street :street,
					latitude :response.results[i].geometry.location.y,
					longitude :response.results[i].geometry.location.x,
					requestAddress :address,
					index :success.index
				};
			}
			success(lbasResults);
		} else if (status == telmap.maps.GeocoderStatus.INVALID_SESSION && forceCreateTelmapSession) {

			telmapRefreshSession();

			lbasGISConn.geocode(address, region, success, fail);
		} else {
			$.getJSON('reportError.action', {
				code :LBASErrorCodes.GEOCODING_FAILED,
				text :'geocode request failed for name: ' + address + ' and region : ' + region + ', received status : ' + status
			}, function(json) {
			});
			// fail(status);
			fail(success.index);
		}
	});

};
TelmapGISManager.prototype.geocode = function(geocodeReqObj, success, fail) {
	var geocoderObj;
	if (geocodeReqObj.address) {
		geocoderObj = {
			'address' :geocodeReqObj.address,
			region :geocodeReqObj.region
		};
	} else {
		geocoderObj = {
			region :geocodeReqObj.region,
			city :geocodeReqObj.city,
			houseNumber :geocodeReqObj.houseNumber,
			postcode :geocodeReqObj.postcode,
			street :geocodeReqObj.street
		};
	}
	geocoder.geocode(geocoderObj, function(response, status) {

		if (status == telmap.maps.GeocoderStatus.OK) {

			var bounds = response.results[0].geometry.viewport;
			var lbasResults = [];
			for ( var i = 0; i < response.results.length; ++i) {
				var r = response.results[i];
				var city;
				var country;
				var street;
				if (response.results[i].address_components[2]) {
					city = response.results[i].address_components[2].long_name;
				}
				if (response.results[i].address_components[3]) {
					country = response.results[i].address_components[3].long_name;
				}
				if (response.results[i].address_components[1]) {
					street = response.results[i].address_components[1].long_name;
				}

				lbasResults[i] = {
					address :response.results[i].formatted_address,
					city :city,
					country :country,
					street :street,
					latitude :response.results[i].geometry.location.y,
					longitude :response.results[i].geometry.location.x
				};
			}
			success(lbasResults);
		} else if (status == telmap.maps.GeocoderStatus.INVALID_SESSION && forceCreateTelmapSession) {

			telmapRefreshSession();

			lbasGISConn.geocode(geocodeReqObj, success, fail);

		} else {
			var errorText = 'geocode request failed for ';
			if (geocodeReqObj.address) {
				errorText += 'address: ' + geocodeReqObj.address + ', ';
			}
			if (geocodeReqObj.city) {
				errorText += 'city: ' + geocodeReqObj.city + ', ';
			}
			if (geocodeReqObj.houseNumber) {
				errorText += 'houseNumber: ' + geocodeReqObj.houseNumber + ', ';
			}
			if (geocodeReqObj.postcode) {
				errorText += 'postcode: ' + geocodeReqObj.postcode + ', ';
			}
			if (geocodeReqObj.street) {
				errorText += 'street: ' + geocodeReqObj.street + ', ';
			}
			if (geocodeReqObj.region) {
				errorText += 'region:' + geocodeReqObj.region + ', ';
			}
			errorText += 'received status : ' + status;

			$.getJSON('reportError.action', {
				code :LBASErrorCodes.GEOCODING_FAILED,
				text :errorText
			}, function(json) {
			});
			fail(status);
		}

	});
};

TelmapGISManager.prototype.reverseGeocode = function(point, success, fail) {
	geocoder.reverse( {
		latLng :new telmap.maps.LatLng(point.y, point.x)
	}, function(response, status) {

		if (status == telmap.maps.GeocoderStatus.OK) {

			if (response.locations.length > 0) {
				var adr = response.locations[0].formatted_address;
				var lat = response.locations[0].geometry.location.y;
				var lon = response.locations[0].geometry.location.x;
				var city;
				var country;
				var street;
				var postcode;
				var houseNumber;
				for ( var i = 0; i < response.locations[0].address_components.length; i++) {
					if (response.locations[0].address_components[i].types[0] == "street_address") {
						street = response.locations[0].address_components[i].long_name;
					} else if (response.locations[0].address_components[i].types[0] == "locality") {
						city = response.locations[0].address_components[i].long_name;
					} else if (response.locations[0].address_components[i].types[0] == "country") {
						country = response.locations[0].address_components[i].long_name;
					} else if (response.locations[0].address_components[i].types[0] == "postcode") {
						postcode = response.locations[0].address_components[i].long_name;
					} else if (response.locations[0].address_components[i].types[0] == "houseNumber") {
						houseNumber = response.locations[0].address_components[i].long_name;
					}
				}
				success( {
					address :adr,
					postcode :postcode,
					houseNumber :houseNumber,
					city :city,
					country :country,
					street :street,
					latitude :lat,
					longitude :lon
				});
			} else {
				$.getJSON('reportError.action', {
					code :LBASErrorCodes.REVERSE_GEOCODING_FAILED,
					text :'reverse geocoding failed for lat: ' + point.y + ' lon:' + point.x + ', received null location'
				}, function(json) {
				});
				fail();
			}
		} else if (status == telmap.maps.GeocoderStatus.INVALID_SESSION && forceCreateTelmapSession) {

			telmapRefreshSession();

			lbasGISConn.reverseGeocode(point, success, fail);

		} else {
			$.getJSON('reportError.action', {
				code :LBASErrorCodes.REVERSE_GEOCODING_FAILED,
				text :'reverse geocoding failed for lat: ' + point.y + ' lon:' + point.x + ', received status : ' + status
			}, function(json) {
			});
			fail();
		}
	});
};

TelmapGISManager.prototype.poi = function(name, bounds, success, fail) {
	var leftBottom;
	var rightTop;
	if (bounds == null) {
		var extent = map.getExtent();
		var leftBottom = new OpenLayers.LonLat(extent.left, extent.bottom);
		leftBottom.transform(proj900913, proj4326);// for sphericalMercator

		var rightTop = new OpenLayers.LonLat(extent.right, extent.top);
		rightTop.transform(proj900913, proj4326);// for sphericalMercator

	} else {
		rightTop = bounds.rightTop;
		leftBottom = bounds.leftBottom;
	}

	var northEast = new telmap.maps.LatLng(rightTop.lat, rightTop.lon);
	var southWest = new telmap.maps.LatLng(leftBottom.lat, leftBottom.lon);
	telmapBounds = new telmap.maps.LatLngBounds(southWest, northEast);

	var request = {
		'name' :name,
		'bounds' :telmapBounds,
		'category' :telmap.maps.GeocoderPOICategory.POI_ALL
	};

	geocoder.poi(request, function(response, status) {

		if (status == telmap.maps.GeocoderStatus.OK) {

			var bounds = response.results[0].geometry.viewport;

			var lbasResults = [];
			for ( var i = 0; i < response.results.length; ++i) {
				var r = response.results[i];
				lbasResults[lbasResults.length] = {
					address :response.results[i].formatted_address,
					city :'',
					country :'',
					street :'',
					latitude :response.results[i].geometry.location.y,
					longitude :response.results[i].geometry.location.x
				};
			}
			success(lbasResults);

		} else if (status == telmap.maps.GeocoderStatus.INVALID_SESSION && forceCreateTelmapSession) {

			telmapRefreshSession();

			lbasGISConn.poi(name, bounds, success, fail);

		} else {
			$.getJSON('reportError.action', {
				code :LBASErrorCodes.POI_SEARCH_FAILED,
				text :'poi search failed for name:' + name + ', received status : ' + status
			}, function(json) {
			});
			fail(status);
		}

	});
};

function parseTelmapInstructions(telmapRouteSteps) {
	var route = [];
	for ( var i = 0; i < telmapRouteSteps.length; i++) {
		route[i] = {
			description :telmapRouteSteps[i].instructions,
			distance :telmapRouteSteps[i].distance.text
		};
	}
	return route;
}

function parseTelmapRoutes(telmapRouteSteps) {
	var route = [];
	route[0] = {
		road : []
	};
	for ( var i = 0; i < telmapRouteSteps.length; i++) {
		for ( var j = 0; j < telmapRouteSteps[i].lat_lngs.length; j++) {
			route[0].road[route[0].road.length] = {
				latitude :telmapRouteSteps[i].lat_lngs[j].y,
				longitude :telmapRouteSteps[i].lat_lngs[j].x
			};
		}
	}
	return route;
}
