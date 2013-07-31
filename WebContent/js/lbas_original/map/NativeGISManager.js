NativeGISManager.prototype = new IGISManager();

function NativeGISManager() {
	IGISManager.apply(this, arguments);
};

NativeGISManager.prototype.route = function(routeRequest, success, fail) {
	$.post('getRoute.action?', {
		lats :lats,
		lons :lons,
		routeFrom :routeRequest.routeFrom,
		routeTo :routeRequest.routeTo,
		width :routeRequest.width,
		height :routeRequest.height,
		weight :routeRequest.weight,
		hazardous :routeRequest.hazardous,
		routeName :routeRequest.name,
		routeType :routeRequest.routeType
	}, function(json) {
		if (json.errorText == null) {
			success( {
				rpoints :json.route,
				route : {
					time :json.route.time,
					distance :json.route.distance,
					header :json.routeHeader,
					route :json.route.route
				}
			});
		} else {
			fail();
		}
	}, "json");
};

NativeGISManager.prototype.reverseGeocode = function(point, success, fail) {
	$.getJSON("getAddress.action", {
		latitude :point.y,
		longitude :point.x
	}, function(json) {
		if (json != null) {
			success( {
				address :json.address,
				city :json.city,
				country :json.country,
				street :json.street,
				latitude :json.latitude,
				longitude :json.longitude
			});
		} else {
			fail();
		}
	});
};
