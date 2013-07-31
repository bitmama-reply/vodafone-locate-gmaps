function IGISManager() {
}

/**
 * request : {points [OpenLayers.Geometry.Point], routeType [pedestrian, driving, publicTransportation]}
 * 
 * success : callback function for success cases
 * 
 * fail : callback function for fail cases
 * 
 * returns json { rpoints [OpenLayers.Geometry.Point], route {time, distance, header}}
 */
IGISManager.prototype.route = function(request, success, fail) {
};

/**
 * point : OpenLayers.Geometry.Point
 * 
 * success : callback function for success cases
 * 
 * fail : callback function for fail cases
 * 
 * returns json { address , city , country , street , latitude , longitude }
 */
IGISManager.prototype.reverseGeocode = function(point, success, fail) {
};