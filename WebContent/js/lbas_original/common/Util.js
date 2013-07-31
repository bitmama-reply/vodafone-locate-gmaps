function Point_Multi(lat, lon) {
	this.lat = lat;
	this.lon = lon;
}

function getZoomLevel(radius) {
	var rad = 200;
	if (radius < 4 * rad)
		return 15;
	if (radius < 6 * rad)
		return 14;
	if (radius < 10 * rad)
		return 13;
	if (radius < 15 * rad)
		return 12;
	if (radius < 45 * rad)
		return 11;
	if (radius < 80 * rad)
		return 10;
	if (radius < 200 * rad)
		return 9;
	if (radius < 240 * rad)
		return 8;
	if (radius < 500 * rad)
		return 7;
	if (radius < 800 * rad)
		return 6;
	if (radius < 2000 * rad)
		return 5;
	if (radius < 3000 * rad)
		return 4;
	if (radius < 6000 * rad)
		return 3;
	if (radius < 20000 * rad)
		return 2;
	return 1;
}

function calculateMapZoomLevel_multi(pointArray) {

	var count = pointArray.length;
	if (count <= 1) {
		return 13;
	}

	var minLatitude = pointArray[0].lat;
	var maxLatitude = pointArray[0].lat;
	var minLongitude = pointArray[0].lon;
	var maxLongitude = pointArray[0].lon;
	for ( var i = 1; i < count; ++i) {
		if (minLatitude > pointArray[i].lat) {
			minLatitude = pointArray[i].lat;
		} else if (maxLatitude < pointArray[i].lat) {
			maxLatitude = pointArray[i].lat;
		}

		if (minLongitude > pointArray[i].lon) {
			minLongitude = pointArray[i].lon;
		} else if (maxLongitude < pointArray[i].lon) {
			maxLongitude = pointArray[i].lon;
		}
	}
	

	var R = 6371;
	var dLat = (maxLatitude - minLatitude) / 180 * Math.PI;
	var dLon = (maxLongitude - minLongitude) / 180 * Math.PI;
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((minLatitude / 180 * Math.PI)) * Math.cos((maxLatitude / 180 * Math.PI))
			* Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	
	var maxDistance = R * c * 1000;// in meter
	return getZoomLevel(maxDistance);

}

function getDestPointDistanceAngleFromStart(centerlat_form, centerlong_form, azimuth, radius_form) {
	var lat1, long1, d_rad, d;
	var azimuthi = azimuth;
	azimuthi = (azimuthi + 360) % 360;
	var radial, lat_rad, dlon_rad, lon_rad;
	centerlong_form * (Math.PI) / 180;

	lat1 = centerlat_form * (Math.PI) / 180;
	long1 = centerlong_form * (Math.PI) / 180;

	d = radius_form;
	d_rad = d / 6378137;

	radial = ((azimuthi) * (Math.PI) / 180);

	lat_rad = Math.asin(Math.sin(lat1) * Math.cos(d_rad) + Math.cos(lat1) * Math.sin(d_rad) * Math.cos(radial));
	dlon_rad = Math.atan2(Math.sin(radial) * Math.sin(d_rad) * Math.cos(lat1), Math.cos(d_rad) - Math.sin(lat1) * Math.sin(lat_rad));
	lon_rad = ((long1 + dlon_rad + Math.PI) % (2 * Math.PI)) - Math.PI;

	var point = new Point_Multi(180 * (lat_rad) / Math.PI, 180 * (lon_rad) / Math.PI);

	return point;
}

function distanceBetweenTwoPoints(lat1, lon1, lat2, lon2) {
	var R = 6371;
	var dLat = (lat2 - lat1) / 180 * Math.PI;
	var dLon = (lon2 - lon1) / 180 * Math.PI;
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 / 180 * Math.PI)) * Math.cos((lat2 / 180 * Math.PI)) * Math.sin(dLon / 2)
			* Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return result = R * c * 1000;// in meter
}

function adjustZoomLevel(mp) {
	return;

	var mbb;
	for ( var i = 0; i < mp.layers.length; i++) {
		var layer = mp.layers[i];
		if (layer.visibility && layer.getDataExtent() != null) {
			var lbb = layer.getDataExtent();
			if (!mbb){
				mbb = lbb;
			} else {
				mbb.extend(lbb);
			}
		}
	}
	
	if(mbb){
		if ($('#map').is(':visible') == 'none') {
			mp.zoomToExtent(mbb, true);
			mp.pan(0, 0);
		}
	}
}

function adjustZoomLevelAndCenterMap(mp, lat, lon ) {

	if (lat && lon) {
			var D = document;
		var docHeight =  Math.max(
			Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
			Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
			Math.max(D.body.clientHeight, D.documentElement.clientHeight)
		);
		if (docHeight < 800) {
			lat = parseFloat(lat)+0.002;
		}
		/*map.setCenter(new google.maps.LatLng(lat, lon));*/
		/*map.panTo(new google.maps.LatLng(lat, lon));*/
		map.setZoom(16);
		map.setCenter(new google.maps.LatLng(lat, lon));
		/*map.panTo(new google.maps.LatLng(lat, lon));*/
	}
	return true;
}

function adjustZoomLevelToBound(mbb) {
	if ($('#map').not(':visible')) {
		map.zoomToExtent(mbb, true);
	} else {
		mbb.left = mbb.left - 100;
		map.zoomToExtent(mbb, true);
		map.pan(-100, 0);
	}
}

function adjustZoomLevelBoundsBox(mManager, mp, lat, lon) {

	var LatLngList = [],
		viewed     = [];

	for (i in mManager.markers) {
		LatLngList.push( new google.maps.LatLng(mManager.markers[i].markerOpts.latitude, mManager.markers[i].markerOpts.longitude) );
		viewed.push( mManager.markers[i].feature.popup.getVisible() );
	}

	if ( LatLngList.length == 1 )
		return adjustZoomLevelAndCenterMap(map, LatLngList[0].lat(), LatLngList[0].lng());

	var bounds = new google.maps.LatLngBounds();
	for (var i = 0, LtLgLen = LatLngList.length; i < LtLgLen; i++)
	  bounds.extend(LatLngList[i]);

	map.fitBounds(bounds);

	//The following adjustment is needed to adapt the zoom also considering the tooltip for the opened marker
	
	var bounds = new google.maps.LatLngBounds(),
		scale  = map.getZoom();

	for (var i = 0, LtLgLen = LatLngList.length; i < LtLgLen; i++) {
	  bounds.extend(LatLngList[i]);
	  if ( viewed[i] ) {
	  	var proj     = map.getProjection(),
	  		point    = proj.fromLatLngToPoint(LatLngList[i]),
	  		boundOvl = new google.maps.Point(((point.x * scale) + 8)/ scale, point.y - 1);

    	bounds.extend( proj.fromPointToLatLng(boundOvl) );
	  }
	}

	map.fitBounds(bounds);
	return;
}