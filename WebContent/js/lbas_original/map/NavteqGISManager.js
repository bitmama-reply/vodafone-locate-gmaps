NavteqGISManager.prototype = new IGISManager();

function NavteqGISManager() {
	IGISManager.apply(this, arguments);
};

NavteqGISManager.prototype.route = function(req, success, fail) {

	var routeManager = new jsapi.advrouting.Manager();

	routeManager.addObserver("state", function(observedManager, key, value) {
		if (value == "finished" && observedManager.routes.length > 0) {
			var route = observedManager.routes[0];
			var routeArr = route.shape.internalArray;
			var timeStr;
			// alert("route.summary.baseTime"+route.summary.baseTime);
			// alert("route.summary.TrafficTime"+route.summary.trafficTime);
			if (route.summary.trafficTime < 3600) {
				timeStr = $.i18n.prop('routing.mins.secs', [ Math.floor(route.summary.trafficTime / 60), route.summary.trafficTime % 60 ]);
			} else {
				timeStr = $.i18n.prop('routing.hours.mins', [ Math.floor(route.summary.trafficTime / 3600),
						Math.floor((route.summary.trafficTime % 3600) / 60) ]);
			}

			success( {
				rpoints :parseNavteqRoutes(routeArr),
				time :timeStr,
				distance :route.summary.distance / 1000 + ' ' + $.i18n.prop('routing.km'),
				route :parseNavteqInstructions(route.legs),
				totalDistanceInMeters :route.summary.distance,
				totalTimeSeconds :route.summary.trafficTime,
				user :req.user
			});

		} else if (value == "failed" || value == "finished") {
			var m = observedManager;
			var points = 'points={';
			if (req.points != null) {
				for ( var i = 0; i < req.points.length; i++) {
					points += 'lat' + i + ':' + req.points[i].y + ',lon' + i + ':' + req.points[i].x + ',';
				}
			}
			points += '}';

			var errortext = 'route request failed for ' + points + ', received status : ' + status;
			if (observedManager && observedManager != null) {
				if (observedManager.getErrorCause() && observedManager != null) {
					errortext += ' errorCode:' + observedManager.getErrorCause().type + '/' + observedManager.getErrorCause().subtype + ' message:'
							+ observedManager.getErrorCause().message;
				}
			}
			$.getJSON('reportError.action', {
				code :LBASErrorCodes.ROUTING_FAILED,
				text :errortext
			}, function(json) {
			});
			fail();

			fail();
		}
	});

	var waypoints = [];
	for ( var i = 0; i < req.points.length; i++) {
		waypoints[waypoints.length] = {
			position :new jsapi.geo.Coordinate(req.points[i].y, req.points[i].x)
		};

	}
	
	var routingRequest = {
		waypoints :waypoints,
		representationOptions : {
			language :userLocale + "-" + userLocale.toUpperCase(),
			representationMode :"overview",
			routeAttributes : [ "sm", "sh", "lg" ],
			legAttributes : [ "wp", "mn", "le", "tt" ],
			maneuverAttributes : [ "po", "tt", "le", "di" ]
		},
		modes : [ {
			type :(req.includeTraffic)? 'fastestNow':'fastest',
			transportModes : [ (req.routeType && req.routeType == 'pedestrian') ? 'pedestrian' : 'car' ],
			trafficMode : (req.includeTraffic)? 'enabled':'disabled'
		} ]
	};
	var resp = routeManager.calculateRoute(routingRequest);
	routeManager.clear();
};

NavteqGISManager.prototype.singleLineGeocode = function(address, region, success, fail) {


	var searchManagerSLG = new jsapi.advsearch.Manager();
	searchManagerSLG.set("address", address);
	searchManagerSLG.set("region", region);

	var searchRequest = {
		searchText :address,
		representationOptions : {
			language : [ userLocale + "-" + userLocale ]
		}
	};

	searchManagerSLG
			.addObserver(
					"state",
					function(observedManager) {
						if (observedManager.state == "finished") {
							if (observedManager.locations.length > 0) {
								var lbasResults = [];
								
								
								
								for ( var x = 0; x < observedManager.locations.length; x++) {
                  
                  
                  var label = 
                    (observedManager.locations[x].address.label != undefined) ? observedManager.locations[x].address.label
											: '';

									var city = (observedManager.locations[x].address.city != undefined) ? observedManager.locations[x].address.city
											: '';
									var country = (observedManager.locations[x].address.country != undefined) ? observedManager.locations[x].address.country
											: '';
									var county = (observedManager.locations[x].address.county != undefined) ? observedManager.locations[x].address.county
											: '';
									var district = (observedManager.locations[x].address.district != undefined) ? observedManager.locations[x].address.district
											: '';
									var houseNumber = (observedManager.locations[x].address.houseNumber != undefined) ? observedManager.locations[x].address.houseNumber
											: '';
									var postalCode = (observedManager.locations[x].address.postalCode != undefined) ? observedManager.locations[x].address.postalCode
											: '';
									var state = (observedManager.locations[x].address.state != undefined) ? observedManager.locations[x].address.state
											: '';
									var street = (observedManager.locations[x].address.street != undefined) ? observedManager.locations[x].address.street
											: '';

									var adr = ((houseNumber != '') ? (houseNumber + ' ') : '') + ((street != '') ? (street + ', ') : '')
											+ ((district != '') ? (district + ', ') : '') + ((county != '') ? (county + ' ') : '')
											+ ((city != '') ? (city + ' ') : '') + ((postalCode != '') ? (postalCode + ', ') : '') + country;

									var lat = observedManager.locations[x].displayPosition.latitude;
									var lon = observedManager.locations[x].displayPosition.longitude;

									lbasResults[x] = {
										/*address :adr,*/
										address: label,
										city :city,
										country :country,
										street :street,
										latitude :lat,
										longitude :lon,
										requestAddress :address,
										index :success.index
									};
								}

								success(lbasResults);

							} else {
								$.getJSON('reportError.action', {
									code :LBASErrorCodes.GEOCODING_FAILED,
									text :'singleLineGeocode failed for address: ' + observedManager.address + ' and region : '
											+ observedManager.region + ', received null location'
								}, function(json) {
								});
								fail(success.index);
							}
						} else if (observedManager.state == "failed") {
							$.getJSON('reportError.action', {
								code :LBASErrorCodes.GEOCODING_FAILED,
								text :'singleLineGeocode failed for address: ' + observedManager.address + ' and region : ' + observedManager.region
							}, function(json) {
							});

							fail(success.index);
						}
					});

	searchManagerSLG.geocode(searchRequest);
	searchManagerSLG.clear();

};

NavteqGISManager.prototype.geocode = function(geocodeReqObj, success, fail) {


  
	if (geocodeReqObj.address != null) {
	 
		// alert("geocode encodeURIComponent : " + encodeURIComponent(geocodeReqObj.address));
		// alert("geocode encodeURI : " + encodeURI(geocodeReqObj.address));
		// alert("geocode escape : " + escape(geocodeReqObj.address));

		// if (isLetterExists(geocodeReqObj.address, lettersDEArr)) {
		// geocodeReqObj.address = encodeURIComponent(geocodeReqObj.address); // encode for german special characters
		// }

		lbasGISConn.singleLineGeocode(encodeURIComponent(geocodeReqObj.address), geocodeReqObj.region, success, fail);
	} else {
		var searchManagerG = new jsapi.advsearch.Manager();
		searchManagerG.set("country", country);
		searchManagerG.set("city", city);
		searchManagerG.set("houseNumber", houseNumber);
		searchManagerG.set("postalCode", postalCode);
		searchManagerG.set("street", street);

		var country = "";
		var city = "";
		var houseNumber = "";
		var postalCode = "";
		var street = "";

		if (geocodeReqObj.region != null)
			country = geocodeReqObj.region;
		if (geocodeReqObj.city != null)
			city = geocodeReqObj.city;
		if (geocodeReqObj.houseNumber != null)
			houseNumber = geocodeReqObj.houseNumber;
		if (geocodeReqObj.postcode != null)
			postalCode = geocodeReqObj.postcode;
		if (geocodeReqObj.street != null)
			street = geocodeReqObj.street;

		var searchRequest = {
			locationFilter : {
				country :country,
				city :city,
				houseNumber :houseNumber,
				postalCode :postalCode,
				street : [ street ]
			},
			representationOptions : {
				language : [ userLocale + "-" + userLocale ]
			}
		};

		searchManagerG
				.addObserver(
						"state",
						function(observedManager) {
							if (observedManager.state == "finished") {
								if (observedManager.locations.length > 0) {
									var lbasResults = [];
									for ( var x = 0; x < observedManager.locations.length; x++) {
									
									 var label = 
                    (observedManager.locations[x].address.label != undefined) ? observedManager.locations[x].address.label
											: '';

										var city = (observedManager.locations[x].address.city != undefined) ? observedManager.locations[x].address.city
												: '';
										var country = (observedManager.locations[x].address.country != undefined) ? observedManager.locations[x].address.country
												: '';
										var county = (observedManager.locations[x].address.county != undefined) ? observedManager.locations[x].address.county
												: '';
										var district = (observedManager.locations[x].address.district != undefined) ? observedManager.locations[x].address.district
												: '';
										var houseNumber = (observedManager.locations[x].address.houseNumber != undefined) ? observedManager.locations[x].address.houseNumber
												: '';
										var postalCode = (observedManager.locations[x].address.postalCode != undefined) ? observedManager.locations[x].address.postalCode
												: '';
										var state = (observedManager.locations[x].address.state != undefined) ? observedManager.locations[x].address.state
												: '';
										var street = (observedManager.locations[x].address.street != undefined) ? observedManager.locations[x].address.street
												: '';

										var adr = ((houseNumber != '') ? (houseNumber + ' ') : '') + ((street != '') ? (street + ', ') : '')
												+ ((district != '') ? (district + ', ') : '') + ((county != '') ? (county + ' ') : '')
												+ ((city != '') ? (city + ' ') : '') + ((postalCode != '') ? (postalCode + ', ') : '') + country;

										var lat = observedManager.locations[x].displayPosition.latitude;
										var lon = observedManager.locations[x].displayPosition.longitude;

										lbasResults[x] = {
											/* address :adr, */
										  address: label,											
											city :city,
											country :country,
											street :street,
											latitude :lat,
											longitude :lon
										};
									}

									success(lbasResults);

								} else {
									var errorText = 'geocode request failed for ';

									if (observedManager.city) {
										errorText += 'city: ' + observedManager.city + ', ';
									}
									if (observedManager.houseNumber) {
										errorText += 'houseNumber: ' + observedManager.houseNumber + ', ';
									}
									if (observedManager.postalCode) {
										errorText += 'postcode: ' + observedManager.postalCode + ', ';
									}
									if (observedManager.street) {
										errorText += 'street: ' + observedManager.street + ', ';
									}
									if (observedManager.country) {
										errorText += 'region:' + observedManager.country + ', ';
									}
									errorText += ' received null location';

									$.getJSON('reportError.action', {
										code :LBASErrorCodes.GEOCODING_FAILED,
										text :errorText
									}, function(json) {
									});
									fail();
								}
							} else if (observedManager.state == "failed") {
								var errorText = 'geocode request failed for ';

								if (observedManager.city) {
									errorText += 'city: ' + observedManager.city + ', ';
								}
								if (observedManager.houseNumber) {
									errorText += 'houseNumber: ' + observedManager.houseNumber + ', ';
								}
								if (observedManager.postalCode) {
									errorText += 'postcode: ' + observedManager.postalCode + ', ';
								}
								if (observedManager.street) {
									errorText += 'street: ' + observedManager.street + ', ';
								}
								if (observedManager.country) {
									errorText += 'region:' + observedManager.country + ', ';
								}

								$.getJSON('reportError.action', {
									code :LBASErrorCodes.GEOCODING_FAILED,
									text :errorText
								}, function(json) {
								});
								fail();

							}
						});

		searchManagerG.geocode(searchRequest);
		searchManagerG.clear();
	}
};

NavteqGISManager.prototype.reverseGeocode = function(point, success, fail) {

	var searchManagerRG = new jsapi.advsearch.Manager();
	searchManagerRG.set("lat", point.y);
	searchManagerRG.set("lon", point.x);

	var searchRequest = {
		spatialFilter : {
			center :new jsapi.geo.Coordinate(point.y, point.x),
			radius :100
		// in basic search, default radius value is 10; so here we put 10 as default for adv. reverse geocode
		},
		representationOptions : {
			language : [ userLocale + "-" + userLocale ],
			MaxResults :1
		},
		reverseGeocodeSettings : {
			mode :"retrieveAddresses"
		}
	};

	searchManagerRG.addObserver("state", function(observedManager) {
		if (observedManager.state == "finished") {

			if (observedManager.locations.length > 0) {
				var city = (observedManager.locations[0].address.city != undefined) ? observedManager.locations[0].address.city : '';
				var country = (observedManager.locations[0].address.country != undefined) ? observedManager.locations[0].address.country : '';
				var county = (observedManager.locations[0].address.county != undefined) ? observedManager.locations[0].address.county : '';
				var district = (observedManager.locations[0].address.district != undefined) ? observedManager.locations[0].address.district : '';
				var houseNumber = (observedManager.locations[0].address.houseNumber != undefined) ? observedManager.locations[0].address.houseNumber
						: '';
				var postalCode = (observedManager.locations[0].address.postalCode != undefined) ? observedManager.locations[0].address.postalCode
						: '';
				var state = (observedManager.locations[0].address.state != undefined) ? observedManager.locations[0].address.state : '';
				var street = (observedManager.locations[0].address.street != undefined) ? observedManager.locations[0].address.street : '';

				var adr = ((houseNumber != '') ? (houseNumber + ' ') : '') + ((street != '') ? (street + ', ') : '')
						+ ((district != '') ? (district + ', ') : '') + ((county != '') ? (county + ' ') : '') + ((city != '') ? (city + ' ') : '')
						+ ((postalCode != '') ? (postalCode + ', ') : '') + country;

				var lat = observedManager.locations[0].displayPosition.latitude;
				var lon = observedManager.locations[0].displayPosition.longitude;

				success( {
					address :adr,
					postcode :postalCode,
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
					text :'reverse geocoding failed for lat: ' + observedManager.lat + ' lon:' + observedManager.lon + ', received null location'
				}, function(json) {
				});
				fail();
			}
		} else if (observedManager.state == "failed") {
			$.getJSON('reportError.action', {
				code :LBASErrorCodes.REVERSE_GEOCODING_FAILED,
				text :'reverse geocoding failed for lat: ' + observedManager.lat + ' lon:' + observedManager.lon
			}, function(json) {
			});
			fail();
		}
	});

	searchManagerRG.reverseGeocode(searchRequest);

	searchManagerRG.clear();

};

NavteqGISManager.prototype.poi = function(name, bounds, success, fail) {
  
	// alert("poi encodeURIComponent : " + encodeURIComponent(name));
	// alert("poi encodeURI : " + encodeURI(name));
	// alert("poi escape : " + escape(name));

	// if (isLetterExists(name, lettersDEArr)) {
	// name = encodeURIComponent(name); // encode for german special characters
	// }

	var poisBound = {
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
		/*var extent = map.getExtent();
		var leftBottom = new OpenLayers.LonLat(extent.left, extent.bottom);
		leftBottom.transform(proj900913, proj4326);// for sphericalMercator

		var rightTop = new OpenLayers.LonLat(extent.right, extent.top);
		rightTop.transform(proj900913, proj4326);// for sphericalMercator*/
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

	var radius = distanceBetweenTwoPoints(poisBound[0].lat, poisBound[0].lng, midpointLat, midpointLon);

	var searchRequest = { // search
		searchText :encodeURIComponent(name),
		spatialFilter : {
			center :new jsapi.geo.Coordinate(midpointLat, midpointLon),
			radius :radius
		},
		representationOptions : {
			language : [ userLocale + "-" + userLocale ]
		}
	};

	var searchManagerPOI = new jsapi.advsearch.Manager();

	searchManagerPOI.set("name", encodeURIComponent(name));
	searchManagerPOI
			.addObserver(
					"state",
					function(observedManager) {
						if (observedManager.state == "finished") {
							if (observedManager.places.length > 0) {
								var lbasResults = [];

								for ( var x = 0; x < observedManager.places.length; x++) {
									var name = (observedManager.places[x].name != undefined) ? observedManager.places[x].name : '';
									var city = (observedManager.places[x].locations[0].address.city != undefined) ? observedManager.places[x].locations[0].address.city
											: '';
									var country = (observedManager.places[x].locations[0].address.country != undefined) ? observedManager.places[x].locations[0].address.country
											: '';
									var county = (observedManager.places[x].locations[0].address.county != undefined) ? observedManager.places[x].locations[0].address.county
											: '';
									var district = (observedManager.places[x].locations[0].address.district != undefined) ? observedManager.places[x].locations[0].address.district
											: '';
									var houseNumber = (observedManager.places[x].locations[0].address.houseNumber != undefined) ? observedManager.places[x].locations[0].address.houseNumber
											: '';
									var state = (observedManager.places[x].locations[0].address.state != undefined) ? observedManager.places[x].locations[0].address.state
											: '';
									var street = (observedManager.places[x].locations[0].address.street != undefined) ? observedManager.places[x].locations[0].address.street
											: '';

									var adr = name + ', ' + ((houseNumber != '') ? (houseNumber + ' ') : '')
											+ ((street != '') ? (street + ', ') : '') + ((district != '') ? (district + ', ') : '')
											+ ((county != '') ? (county + ' ') : '') + ((city != '') ? (city + ' ') : '') + country;

									var lat = observedManager.places[x].locations[0].displayPosition.latitude;
									var lon = observedManager.places[x].locations[0].displayPosition.longitude;

									lbasResults[x] = {
										address :adr,
										city :city,
										country :country,
										street :street,
										latitude :lat,
										longitude :lon
									};
								}
                
                

                
								success(lbasResults);

							} else {
							
							 
							 								
							 								
							 								
								$.getJSON('reportError.action', {
									code :LBASErrorCodes.GEOCODING_FAILED,
									text :'poi failed for name: ' + observedManager.name + ', received null location'
								}, function(json) {
								});
								
								fail();
							}
						} else if (observedManager.state == "failed") {
						

							
							
							$.getJSON('reportError.action', {
								code :LBASErrorCodes.GEOCODING_FAILED,
								text :'poi failed for name: ' + observedManager.name
							}, function(json) {
							});

							fail();
						}
					});

	searchManagerPOI.search(searchRequest);

	searchManagerPOI.clear();
};

function parseNavteqInstructions(navteqRoutelegs) {
	var route = [];
	var routeIndex = 0;
	for ( var i = 0; i < navteqRoutelegs.length; i++) {

		for ( var j = 0; j < navteqRoutelegs[i].maneuvers.length; j++)
			route[routeIndex++] = {
				description :navteqRoutelegs[i].maneuvers[j].instruction,
				distance :Math.round(navteqRoutelegs[i].maneuvers[j].length / 100) / 10 + ' ' + $.i18n.prop('routing.km'),
				direction :navteqRoutelegs[i].maneuvers[j].direction
			};
	}
	return route;
}

function parseNavteqRoutes(navteqRouteSteps) {
	var route = [];
	route[0] = {
		road : []
	};
	for ( var i = 0; i < navteqRouteSteps.length - 3; i = i + 3) {
		route[0].road[route[0].road.length] = {
			latitude :navteqRouteSteps[i],
			longitude :navteqRouteSteps[i + 1]
		};

	}
	// for ( var i = 0; i < navteqRoutelegs.length; i++) {
	//
	// for ( var j = 0; j < navteqRoutelegs[i].maneuvers.length; j++)
	// route[0].road[route[0].road.length] = {
	// latitude :navteqRoutelegs[i].maneuvers[j].position.latitude,
	// longitude :navteqRoutelegs[i].maneuvers[j].position.longitude
	// };
	// }

	return route;
}
