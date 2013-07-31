var routeFromMarkerID = null;
var routeToMarkerID = null;
var routeMarkerIDs = [];
var routeMarkers = [];
var lats = [];
var lons = [];
var routeAdresses = [];
var alphArr = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
var maxRowID = 1;

var glbSavedRoutes;
var lineFeatures;
var lineFeaturesForMeeting;
var lineFeaturesForLocationReport;
var destinationIndex;
var routePartList;
var stickyMouse = false;
var factor;
var dragPoint;
var selectFeature;
var dragFeature;
var routeRequest;

var displayDirections = false;
var routeToCalc = false;


function clearRouting() {
	// alert('clearRouting');
	routeFromMarkerID = null;
	routeToMarkerID = null;
	clearRouteFrom();
	clearRouteTo();
	$('#idRouteResult').html(parseTemplate("routeResultTemplate", {
		route :{},
		routeHeader :null,
		routeFrom :null,
		routeTo :null
	}));
}
function clearRouteFrom() {
	if (routeFromMarkerID != null) {
		mainMarkerManager.removeMarker(routeFromMarkerID);
	}
	routeFromMarkerID = null;
	$('#routePoint0').attr('value', "");
	$('#startLatitude').attr('value', "");
	$('#startLongitude').attr('value', "");

}

function routeFrom(address, lat, lon) {
	changeRightNavigation('routingRightNav', null);
	$('#routingTab').click();
	var trId = $('#routePointTable tr')[0].id;
	var index = trId.replace('routePointTR', '');
	setRoutePoint(address, lat, lon, index);


}

function clearRouteTo() {
	if (routeToMarkerID != null) {
		mainMarkerManager.removeMarker(routeToMarkerID);
	}
	routeToMarkerID = null;
	$('#routePoint1').attr('value', "");
	$('#endLatitude').attr('value', "");
	$('#endLongitude').attr('value', "");
}

function setRoutePoint(address, lat, lon, index, autoRouteDisable) 
{
  console.log("-----------> setRoutePoint");
	if (index == undefined || index == null) {
		index = routeMarkers.length;
	}
	//createRouteMarker(lat, lon, index);
	// adjustZoomLevelToBound(routeLayer.getDataExtent());
	
	setRightClickMenu();
	SetRouteToExtra(address, lat, lon, index, autoRouteDisable);
	
}

function SetRouteToExtra(address, lat, lon, index, autoRouteDisable)
{
  
  
	if ( $("#routePoint" + index).length == 0) {
		createNewRow(address);

		if ($('#routePointTable input[type=text]').length > 2) {
			$('#label_routingTrafficEnableCheck').addClass('disabled');
			$('#routingTrafficEnableCheck').attr('disabled', true);
		}
	}

	$("#routePoint" + index).attr("value", address);
	// $('#endLatitude').attr('value', lat);
	// $('#endLongitude').attr('value', lon);
	lats[index] = lat;
	lons[index] = lon;
	routeAdresses[index] = address;
	
	var markerCount = 0;
	for ( var i = 0; i < routeMarkers.length; i++) {
		if (routeMarkers[i] != null) {
			markerCount++;
		}
	}

  /*draw first point*/
	if(index==0 && markerCount==0) {
    GMapsHelper.createRouteMarker(0,lat,lon);
  }
	
	if (!autoRouteDisable && $('#routePointTable input[type=text][value!=""]').length >= 2) {
		searchRoute();
	}
}

function areAllSamePoints() {
	var same = true;
	if (lats.length < 2 || lats[0] == undefined || lats[1] == undefined) {
		return false;
	}
	for ( var i = 0; i < lats.length; i++) {
		if (lats[i] && lons[i]) {
			if (i + 1 < lats.length && lats[i] != '' && lons[i] != '') {
				if (lats[i] != lats[i + 1]) {
					same = false;
					break;
				}
			}
		}
	}
	return same;
}
function deleteSamePoints() {
	for ( var i = 0; i < lats.length; i++) {
		if (lats[i] && lons[i]) {
			if (i + 1 < lats.length && lats[i] != '' && lons[i] != '') {
				if (lats[i] == lats[i + 1]) {
					deletePoint({
						id :'deletePoint' + i
					});
				}
			}
		}
	}

}
function setRightClickMenu() {
	var rowCount = $('#routePointTable input[type=text]').length;
	var markerCount = getRouteMarkersLength();

	if (markerCount >= 2) {
		$('#addDestRM').show();
		if (markerCount > 2) {
			$('#routeFromRM').hide();
			$('#routeToRM').hide();
		} else {
			$('#routeFromRM').show();
			$('#routeToRM').show();
		}
		if (markerCount == 15) {
			$('#addDestRM').hide();
		}
	} else {
		$('#routeFromRM').show();
		$('#routeToRM').show();
		$('#addDestRM').hide();
	}
}

function getRouteMarkersLength() {

	var length = 0;
	for ( var i = 0; i < routeMarkers.length; i++) {
		if (routeMarkers[i]) {
			length++;
		}
	}
	return length;
}
/*to be removed
function createRouteMarker(lat, lon, index, inx) {

	if (inx == undefined || inx == "undefined")
		inx = index;
		
	var letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
	// var markerOptions = {
	// icon :'images/pin.png',
	// iconWidth :19,
	// iconHeight :32,
	// latitude :lat,
	// longitude :lon,
	// hasTooltip :false,
	// history :true,
	// setZoomLevel :false
	// };
	//
	// routeMarkerIDs[index] = mainMarkerManager.createMarker(markerOptions);

	var imgLnk = 'images/pin_route_' + letters[inx] + '.png';

	var markerStyle = GMapsHelper.getVectorStyle();
	var mf = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lon, lat), null, {
		externalGraphic :imgLnk,
		graphicHeight :39,
		graphicWidth :29,
		cursor :'pointer',
		display :'',
		graphicZIndex :ROUTE_MARKERS_ZINDEX
	});

	if (routeMarkers[index]) {
		routeLayer.removeFeatures([ routeMarkers[index] ], {
			silent :true
		});
	}

	routeLayer.addFeatures([ mf ]);

	var lonLat = new OpenLayers.LonLat(lon, lat);
	lonLat.transform(proj4326, proj900913);
	mf.move(lonLat);
	routeMarkers[index] = mf;

	if (!$('.clearMapItemInactive').is(':visible')) {
		$('.clearMapItemInactive').show();
	}
}*/

function routeTo(address, lat, lon) {
	changeRightNavigation('routingRightNav', null);
	$('#routingTab').click();
	var trId = $('#routePointTable tr')[1].id;
	var index = trId.replace('routePointTR', '');
	setRoutePoint(address, lat, lon, index);
}

function addDestination(addDestObj) {

	changeRightNavigation('routingRightNav', null);
	$('#routingTab').click();
	var rowCount = $('#routePointTable input[type=text]').length;
	if (rowCount == 15) {
		return;
	}
	try {
		var index;
		if (addDestObj.position) {
			index = createNewRow(addDestObj.address, addDestObj.position);
			$('#label_routingTrafficEnableCheck').addClass('disabled');
			$('#routingTrafficEnableCheck').attr("disabled", true);
		} else if (isCreateNewRow()) {
			index = createNewRow(addDestObj.addres);
			$('#label_routingTrafficEnableCheck').addClass('disabled');
			$('#routingTrafficEnableCheck').attr("disabled", true);
		} else {
			// Dont add new row, use last one
			index = getNewRowID();
		}
		if (addDestObj.lat) {
			setRoutePoint(addDestObj.address, addDestObj.lat, addDestObj.lon, index, addDestObj.autoRouteDisable);
		}
                
	} catch (err) {
		// alert(err.decription);
	}
}

function createNewRow(address, position) {
	maxRowID++;
	index = maxRowID;
	var pointTR = $('#routePointTable tr:first').clone();
	var newTRID = 'routePointTR' + index;
	pointTR.attr('id', newTRID);
	if (position) {
		$($('#routePointTable tr')[position - 1]).after(pointTR);
	} else {
		pointTR.appendTo('#routePointTable');
	}
	$('#' + newTRID + ' input[type=text]').attr('id', 'routePoint' + index);
	$('#' + newTRID + ' input[type=text]').val('');
	$('#' + newTRID + ' td a').attr('id', 'deletePoint' + index);
	orderPointLabels();
	showHideDeleteIcons();
	initRoutePointAutocomplete([ index ]);
	//initTableDnD();
	return index;
}

function isCreateNewRow() {

	if (lats[maxRowID]) {
		return true;
	} else {
		if ($('#routePointTR' + maxRowID).length == 0) { // if row could not
			// found
			return true;
		} else {
			return false;
		}
	}
}

function getNewRowID() {
	var newRowID = 0;
	for ( var i = maxRowID; i >= 0; i--) {
		if (lats[i]) {
			newRowID = i + 1;
			break;
		}
	}
	return newRowID;
}

function orderPointLabels() {
	var labelCount = $('#routePointTable td.pointLabel').length;
	$('#routePointTable td.pointLabel').each(function(index) {
		if (labelCount > 2) {
			$(this).html('<img src="images/pin_route_'+alphArr[index]+'.png" width="20" />');
		} else {
			if (index == 0) {
				$(this).text($.i18n.prop('routing.from'));
			} else {
				$(this).text($.i18n.prop('routing.to'));
			}

		}
	});
}

function showhide(id) {
	if (document.getElementById(id).style.display == "none") {
		show(id);
	} else {
		hide(id);
	}
}

function show(id) {
	document.getElementById(id).style.display = "";
}

function hide(id) {
	document.getElementById(id).style.display = "none";
}

function enableDisable(cbId, id) {
	id.disabled = !cbId.checked;
}

function printRoute(printMethod) {

	// $('#idRouteResultsScrollPane').jqprint();
	// $('.olControlPanZoomBar', $('#lbasMainMap')).hide();
	// $('#lbasMainMap').jqprint();
	// $('.olControlPanZoomBar', $('#lbasMainMap')).show();

	var currentTime = new Date().getTime();
	var str = currentTime.toString();
	var url = 'pages/print.jsp?printMethod=' + printMethod;

	var printWindow = window.open(url, $.i18n.prop('buttons.print') + str.substring(str.length - 9, str.length),
			'width=800,height=600,scrollbars=yes,resizable=1');

}

function OpenSaveRoute()
{
    
    var btns = {};
    btns[$.i18n.prop('buttons.cancel')] = function() {
            $(this).dialog('close');
            $(this).dialog('destroy');
    };
    btns[$.i18n.prop('buttons.ok')] = function() {
        
            saveRoute();
            //$(this).dialog('close');
            //$(this).dialog('destroy');
    };
    btns = {};
    var ct = $('#idSaveRouteDiv').html();
    utils && utils.dialog({
    	title: $.i18n.prop('routing.SaveRoute'),
    	content: ct,
    	buttons: btns,
    	css: "saveDialogRoute"
    	})
    
    var butPos = $('#idRouteResultActionsDiv .multi_user_button').offset();
    var boxHeight = $('.saveDialogRoute').outerHeight()/2;
    var boxWidth = $('.saveDialogRoute').outerWidth()/2;
    	$('.saveDialogRoute').css({
    		"top":  butPos.top - boxHeight,
    		"left": butPos.left - boxWidth
    	});
	$('#btn_route_cancel').live('click', function(){
		utils.closeDialog();
	});
    	
    $('#btn_route_save').live('click', function(){
        var formParent = $(this).parent().parent();
        var name = $(".saveDialogRoute #idRouteName" ).val();
        saveRoute(name);
    });
}

function saveRoute(name) {
        
	//if ($('#idSaveRouteDiv #idRouteName').val() != "" && $('#idSaveRouteDiv #idRouteName').val() != $.i18n.prop('routing.select.typeInName')) {
	
	var name = $(".saveDialogRoute #idRouteName" ).val();

	if(name == "" ){
		/* GESTORE VALIDAZIONE ERRORI*/
		var validator=new Validator({
		 idRouteName: {
	        domElement: '#dialog #idRouteName',
	         validate: 'presence'
	      }
	    });
	    function errorsOnDialog(serverErrors) {
			var el = validator.parseServerErrors(serverErrors);
			$('#error-view-saveroute > div.content-cell >span','#dialog').html($.i18n.prop('error.send.title'));
			$('#error-view-saveroute > div > ul','#dialog').empty().append(el);
	    	$('#error-view-saveroute','#dialog').show();
		}
		var fieldErrors={}
		fieldErrors["idRouteName"]=[$.i18n.prop('routing.empty.saveRoute')];
		errorsOnDialog(fieldErrors);
	}	
	
    if (name != "" && name != $.i18n.prop('routing.select.typeInName')) {

		var routeFrom = $('#routePointTable input[type=text]:first').val();
		var routeTo = $('#routePointTable input[type=text]:last').val();
		var addressArr = [];
		$('#routePointTable input[type=text]').each(function() {
			addressArr.push($(this).val());
		});

		var orderedPoints = getOrderedPoints();

		$.ajax({
			url :'saveRoute.action',
			type :'POST',
			async :false,
			data :{
                address :addressArr,
                duration :$('#duration').val(),
                from :routeFrom,
                hazardous :$('idHazardous').checked,
                height :$('idHeightCB').checked ? $('idHeight').val() : 0,
                lats :orderedPoints.lats,
				lons :orderedPoints.lons,
				routeName :name,
                routeType :$('#routingTypes li.selected a').attr('key'),
				to :routeTo,
				width :$('idWidthCB').checked ? $('idWidth').val() : 0,
				weight :$('idWeightCB').checked ? $('idWeight').val() : 0
				//distance :$('#distance').val(),
			},
			dataType :'json',
			success :function(json) {
				getSavedRoutes();
				$('#idRouteName').val($.i18n.prop('routing.select.typeInName'));
				utils.closeDialog();
				var btns = {};
                utils.closeDialog();
                utils && utils.dialog({
            		content: "<div class='successMessageCheck'>Saved route "+ name +"</div>",
                    css: 'noCloseNoOk'
                });
                
                $(".noCloseNoOk").hide();
                $(".noCloseNoOk").fadeIn("slow");
                timeMsg();

			}
		});

		//hide('idSaveRouteDiv');
		show('idRouteResultActionsDiv');
		return (false);
	} else {
		var btns = {};
		btns[$.i18n.prop('buttons.ok')] = function() {
			$(this).dialog('close');
			$(this).dialog('destroy');
		};

		$("#errorMessage").dialog({
			bgiframe :true,
			width :300,
			modal :glbmodal,
			buttons :btns
		}).height("auto");
		resizable: false,

		$("#errorMessage [id*='errorText']").text($.i18n.prop('errors.empty.route.name'));
	}
}

function shareRoute(routeID) {
	
	
		var name = $('#dialog #messageTo').val();

		if(name == "" ){
			/* GESTORE VALIDAZIONE ERRORI*/
			var validator=new Validator({
			 shareMessageTo: {
			 	domElement: '#dialog .token-input-list-facebook',
		         validate: 'presencelist'
		      }
		    });
		    function errorsOnDialog(serverErrors) {
				var el = validator.parseServerErrors(serverErrors);
				$('#error-view-shareroute > div.content-cell >span','#dialog').html($.i18n.prop('error.send.title'));
				$('#error-view-shareroute > div > ul','#dialog').empty().append(el);
		    	$('#error-view-shareroute','#dialog').show();
			}
			var fieldErrors={}
			fieldErrors["shareMessageTo"]=[$.i18n.prop('routing.empty.shareRoute')];
			errorsOnDialog(fieldErrors);
			return
		}	
	
	
	
	//$("#idSavedRoutesScrollPane input[id*=savedRouteCheckbox-id]:checked").each(function() {
	//	var routeID = $(this).attr("value");
		// var routeName = $(this).parent().text();
		var userShareIds = [];
		jQuery.each( $('#dialog #messageTo').val().split(','), function() {
			userShareIds.push( this.replace('u','') );
		});

		$.ajax({
			url :'shareRoute.action',
			type :'POST',
			async :false,
			data :{
				routeID: routeID,
				shareWith: userShareIds.join(',')
			},
			dataType: 'json',
			success: function(json) {
				getSavedRoutes();
				$('#dialog').dialog('close');
				$('#idRouteName').val("");
				// $("div[title='messageTo']").click();
			}
		});
	//});

}

function findClosestPoint(points, point, start) {
	var dist = 99999999;
	var index = 0;
	for ( var i = start; i < points.length; i++) {
		var dist1 = point.distanceTo(points[i]);
		if (dist > dist1) {
			index = i;
			dist = dist1;
		}
	}
	return index;
}

function parseRoutePoints(points, start, end) {
	var points = [];
	for ( var i = start; i < end; i++) {
		points[i - start] = points[i];
	}
	return points;
}

function drawForLocationReportPoints(route, routeStyleForLocationReport) {
	if (route && route.length > 0) {
		//lineFeaturesForLocationReport = [];
		var opts = {
			path: route,
			map: map,
			strokeColor: routeStyleForLocationReport.strokeColor,
			strokeWeight: routeStyleForLocationReport.strokeWidth,
			zIndex: routeStyleForLocationReport.graphicZIndex
		};
		var alinefeature = new google.maps.Polyline(opts);
		routeLayerForLocationReport.push( alinefeature );
		routeLayerForLocationReportInfo.push( opts );
		/*lineFeaturesForLocationReport[0] = alinefeature;
		routeLayerForLocationReport.addFeatures(lineFeaturesForLocationReport);*/
	}
}
/*to be removed
function centerAndDrawRouteOnMap(route) {
	var routeIndexList = [ 0 ];
	var routePointList = [];
	routePartList = [];
	routePartList[0] = [];
	if (route != null && route != undefined) {
		for ( var i = 0; i < route.length; i++) {
			var road = route[i];

			if (road.road.length > 1) {

				for ( var j = 0; j < road.road.length; j++) {
					var point = road.road[j];

					var lonLat = new OpenLayers.LonLat(point.longitude, point.latitude);
					lonLat.transform(proj4326, proj900913);

					routePartList[0].push(new OpenLayers.Geometry.Point(lonLat.lon, lonLat.lat));
				}
			}

		}

		if (routePartList.length > 0) {
			lineFeatures = [];
			for ( var i = 0; i < routePartList.length; i++) {
				var alinefeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(routePartList[i]), null, routeStyle);
				lineFeatures[i] = alinefeature;
			}
			routeLayer.addFeatures(lineFeatures);

			if (selectFeature == null) {
				selectFeature = new OpenLayers.Control.SelectFeature(routeLayer, {
					hover :true,
					onSelect :function(e) {
						factor = Math.pow(2, (map.getNumZoomLevels() - map.getZoom()));
						stickyMouse = true;
						var lonlat = map.getLonLatFromPixel(this.handlers.feature.evt.xy);

						if (dragPoint == null) {
							dragPoint = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(0, 0), {
								some :'data'
							}, {
								externalGraphic :'images/nottrackable18x18.png',
								graphicHeight :18,
								graphicWidth :18,
								cursor :'pointer'
							});
							routeLayer.addFeatures([ dragPoint ]);
							dragPoint.style['display'] = 'none';
						}
						dragPoint.move(lonlat);
						dragPoint.style['display'] = '';
					},
					onUnselect :function(evt) {
						// dragPoint.style['display'] = 'none';
					}
				});

				map.addControl(selectFeature);
				selectFeature.activate();

				dragFeature = new OpenLayers.Control.DragFeature(routeLayer, {
					onComplete :function(feature, pixel) {
						if (dragPoint == feature) {
							var lonlat = map.getLonLatFromPixel(this.handlers.feature.evt.xy);
							lonlat.transform(proj900913, proj4326);
							lbasGISConn.reverseGeocode(new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat), function(json) {
								if (json.address != null) {
									addDestination({
										address :json.address,
										lat :json.latitude,
										lon :json.longitude,
										position :destinationIndex
									});
									// searchRoute();
								}
							}, function() {
								// failed
							});
						}
					},
					onDrag :function(feature, pixel) {
						// var lonlat =
						// map.getLonLatFromPixel(this.handlers.feature.evt.xy);
						// lonlat.transform(proj900913, proj4326);
						//
						// var arr = getOrderedPoints();
						// arr.lats.splice(destinationIndex, 0,
						// lonlat.lat);
						// arr.lons.splice(destinationIndex, 0,
						// lonlat.lon);
						// lbasGISConn.route( {
						// points :getPoints(arr),
						// routeFrom :routeFrom,
						// routeTo :routeTo,
						// width :$('idWidthCB').checked ?
						// $('idWidth').val() : 0,
						// height :$('idHeightCB').checked ?
						// $('idHeight').val() : 0,
						// weight :$('idWeightCB').checked ?
						// $('idWeight').val() : 0,
						// hazardous :$('idHazardous').checked,
						// routeName :$('#idRouteName').val(),
						// routeType :$('#routingTypes').val()
						// }, function(json) {
						// $('#duration').attr('value', json.time);
						// $('#distance').attr('value', json.distance);
						// }, function() {
						// // failed
						// });
					},
					onStart :function(feature, pixel) {
						if (dragPoint != feature) {
							this.cancel();
						} else {
							var lonlat = map.getLonLatFromPixel(this.handlers.feature.evt.xy);
							lonlat.transform(proj900913, proj4326);
							var dist = 9999999999;
							for ( var i = 1; i < lats.length; i++) {
								var dist1 = new OpenLayers.Geometry.Point(lons[i - 1], lats[i - 1]).distanceTo(new OpenLayers.Geometry.Point(
										lonlat.lon, lonlat.lat));
								var dist2 = new OpenLayers.Geometry.Point(lons[i], lats[i]).distanceTo(new OpenLayers.Geometry.Point(lonlat.lon,
										lonlat.lat));
								if ((dist1 + dist2) < dist) {
									dist = dist1 + dist2;
									destinationIndex = i;
								}
							}
						}
					},
					feature :dragPoint
				});
				map.addControl(dragFeature);
				dragFeature.activate();

			}
			// var minBounds = routeLayer.features[0].geometry.getBounds();
			var mbb = routeLayer.getDataExtent();
			adjustZoomLevelToBound(mbb);

			var zIndexOfRouteLayer = routeLayer.getZIndex();
			markerLayer.setZIndex(parseInt(zIndexOfRouteLayer) + 10);
		}
	}
}*/
function mouseMoved(e) {
	if (stickyMouse) {
		var position = map.events.getMousePosition(e);
		var lonlat = map.getLonLatFromPixel(position);
		var onRoute = false;
		for ( var i = 0; i < lineFeatures.length && !onRoute; i++) {
			onRoute = dragPoint.geometry.distanceTo(lineFeatures[i].geometry) < factor;
		}
		if (onRoute) {
			dragPoint.move(lonlat);
		} else {
			stickyMouse = false;
			dragPoint.style['display'] = 'none';
		}
	}
}

/*to be removed
function drawRouteForMeeting(route) {

	var routeList = [];
	routeList[0] = [];
	if (route != null && route != undefined) {
		for ( var i = 0; i < route.length; i++) {
			var road = route[i];

			if (road.road.length > 1) {

				for ( var j = 0; j < road.road.length; j++) {
					var point = road.road[j];

					var lonLat = new OpenLayers.LonLat(point.longitude, point.latitude);
					lonLat.transform(proj4326, proj900913);

					routeList[0].push(new OpenLayers.Geometry.Point(lonLat.lon, lonLat.lat));
				}
			}

		}

		if (routeList.length > 0) {
			lineFeaturesForMeeting = [];
			for ( var i = 0; i < routeList.length; i++) {
				var alinefeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(routeList[i]), null, routeStyle);
				lineFeaturesForMeeting[i] = alinefeature;
			}
			routeLayerForMeeting.addFeatures(lineFeaturesForMeeting);
		}

		adjustZoomLevel(map);
	}
}*/

/*to be removed
function getPoints(plist) {
	var points = [];
	for ( var i = 0; i < plist.lats.length; i++) {
		points[i] = new OpenLayers.Geometry.Point(plist.lons[i], plist.lats[i]);
	}
	return points;
}*/

function searchRoute() {
	var forceAdressToGeocode = false;
	$('#routePointTable input[type=text]').each(function() {
		var trId = $(this).attr('id');
		var index = trId.replace('routePoint', '');
		var value = $(this).val();
		if (value) {
			if ((!lats[index] && !lons[index]) || routeAdresses[index] != $(this).val()) {
				var callbackFunction = function(json) {
					geocodeCompleteForRouting(json);
				};
				callbackFunction.index = index;
			}
		}
	});

	if (!forceAdressToGeocode) {
		$.blockUI();
		doRouteRequest();
		$.unblockUI();
	}
}

function geocodeCompleteForRouting(lbasResults) {

	if (lbasResults.length <= 0) {
		$('#routePointTable input[type=text]').each(function() {
			var trId = $(this).attr('id');
			var index = trId.replace('routePoint', '');
			$("#routePoint" + index).removeClass("ui-autocomplete-loading");
		});
		return;
	}
  var lbasResult = lbasResults[0];
	var lat = lbasResult.latitude;
	var lon = lbasResult.longitude;
	var address = lbasResult.requestAddress;
	var index = lbasResult.index;
	setRoutePoint(address, lbasResult.latitude, lbasResult.longitude, index, false);
}

function geocodeFaliedForRouting(index) {
	// showErrorDialog($.i18n.prop('routing.noValidLocation', new Array($('#routePoint' + index).val())));
	// clear all route points
	$('#routePointTable input[type=text]').each(function() {
		var trId = $(this).attr('id');
		var index = trId.replace('routePoint', '');
		$("#routePoint" + index).removeClass("ui-autocomplete-loading");
	});
	return;
}

function doRouteRequest() {
	if (areAllSamePoints()) {
		showErrorDialog($.i18n.prop('error.routing.samepoints', false));
		return;
	}
	deleteSamePoints();

	var routeFrom = $('#routePointTable input[type=text]:first').val();
	var routeTo = $('#routePointTable input[type=text]:last').val();
	invalidCount = -1;
	/*var errorStr = [];
	$('#routePointTable input[type=text]').each(function() {
		var trId = $(this).attr('id');
		var index = trId.replace('routePoint', '');
		var value = $(this).val();
		if (value) {
			if (!lats[index] && !lons[index]) {
				errorStr[++invalidCount] = value;
			}
		}
	});*/
	/* GESTORE VALIDAZIONE ERRORI*/
	var validator=new Validator({
	 routePoint0: {
        domElement: '#routePoint0',
         validate: 'presence'
      },
	  routePoint1: {
        domElement: '#routePoint1',
        validate: 'presence'
      }
    });
    function errorsOnDialog(serverErrors) {
		var el = validator.parseServerErrors(serverErrors);
		$('#error-view-sendmessage > div.content-cell >span','#routing').html($.i18n.prop('error.send.title'));
		$('#send-list-wrapper','#routing').empty().append(el);
    	$('#error-view-sendmessage','#routing').show();
	}
	var fieldErrors={}
	if (routeFrom.length == 0) {
		/*showErrorDialog($.i18n.prop('routing.empty.routeFrom'));*/
		fieldErrors["routePoint0"]=[$.i18n.prop('routing.empty.routeFrom')];
		errorsOnDialog(fieldErrors);
		return;
	} else if (routeTo.length == 0) {
		fieldErrors["routePoint1"]=[$.i18n.prop('routing.empty.routeTo')];
		errorsOnDialog(fieldErrors);
		/*showErrorDialog($.i18n.prop('routing.empty.routeTo'));*/
		return;
	} else if (routeFrom.length > 0 && routeTo.length > 0) {
		$('#error-view-sendmessage','#routing').hide();
		// showErrorDialog($.i18n.prop('routing.noValidLocation', new Array(errorStr)));
		// clear all route points
		/*$('#routePointTable input[type=text]').each(function() {
			var trId = $(this).attr('id');
			var index = trId.replace('routePoint', '');
			$("#routePoint" + index).removeClass("ui-autocomplete-loading");
		});
		return;*/
	}
/*to be removed
	routeRequest = {
		points: getPoints(getOrderedPoints()),
		routeFrom: routeFrom,
		routeTo: routeTo,
		width: $('idWidthCB').checked ? $('idWidth').val() : 0,
		height: $('idHeightCB').checked ? $('idHeight').val() : 0,
		weight: $('idWeightCB').checked ? $('idWeight').val() : 0,
		hazardous: $('idHazardous').checked,
		routeName: $('#idRouteName').val(),
		routeType: $('#routingTypes li.selected a').attr('key'),
		includeTraffic: $('#routingTrafficEnableCheck').attr('checked')
	};*/
	

	//EDIT ARTERA:
	if ( !displayDirections ) {
		displayDirections = new google.maps.DirectionsRenderer({
			suppressMarkers : true,
			draggable: true
		});
		displayDirections.setPanel(document.getElementById("idRouteResult"));

		var letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
		google.maps.event.addListener(displayDirections, 'directions_changed', function() {
			
			if ( !routeToCalc ) {
				$('#routingTrafficEnableCheck').focus();
				var analysisEnd = false;
				var points = [], indexes = 0;

				for ( var xx in displayDirections.directions.routes[0].legs ) {
					var leg = displayDirections.directions.routes[0].legs[xx];
					points.push({
						latitude:  leg.start_location.lat(),
						longitude: leg.start_location.lng(),
						address:   leg.start_address
					});
					indexes++;
					for ( var iw in leg.via_waypoints ) {
						var reverseIndex = points.length;
						points.push({
							latitude:  leg.via_waypoints[iw].lat(),
							longitude: leg.via_waypoints[iw].lng()
						});
						GMapsHelper.reverseGeocode( leg.via_waypoints[iw].lat(), leg.via_waypoints[iw].lng(), function(address, reverseIndex) {
							points[ reverseIndex ].address = address.address;
							indexes++;
							if ( analysisEnd && indexes == points.length ){
								redrawRoute(points);
								return;
							}
						}, null, reverseIndex);
					}
					points.push({
						latitude:  leg.end_location.lat(),
						longitude: leg.end_location.lng(),
						address:   leg.end_address
					});
					indexes++;
				}
				analysisEnd = true;
				if ( indexes == points.length ) {
					redrawRoute(points);
					return;
				}

			}

			routeToCalc = false;

  			var duration = 0, distance = 0;
  			$(displayDirections.directions.routes).each(function( index, route ){
  				$(route.legs).each(function( idLeg, leg ){
					duration += leg.duration.value;
					distance += leg.distance.value;
  				});
  			});

			$('#idRouteResult').prepend( parseTemplate("routeResultTemplate", { } ) );
			setTimeout(function(){
        $('#routing_addDestination').css({'cursor': 'pointer', 'opacity': 1});			  
				$('#idRouteResult table.adp-directions > tbody > tr:even').addClass('grey');
				var i = 0;
				$('.adp-placemark img').each(function() {
					$(this).attr('src', 'images/pin_route_' + letters[i] + '.png');
					i++;
				});
				$('#duration').attr('value', duration);
				$('#distance').attr('value', distance);

				var timeStr;
				if (duration < 3600) {
					timeStr = $.i18n.prop('routing.mins.secs', [ Math.floor(duration / 60) ], [ duration % 60 ]);
				} else {
					timeStr = $.i18n.prop('routing.hours.mins', [ Math.floor(duration / 3600) ], [ Math.floor((duration % 3600) / 60) ]);
				}
				$('.adp-summary > span[jsdisplay="duration"]').html( timeStr );
				$('.adp-summary > span[jsdisplay="distance"]').html( Math.round(distance/100)/10 + ' km' );

				$('#idRouteResult .adp-summary').each(function(id, el) {
					if ( id > 0 )
						$(this).remove();
				});
			}, 1);

		});
	}
	displayDirections.setMap( map );
	var travelMode        = google.maps.TravelMode.DRIVING,
		durationInTraffic = $('#routingTrafficEnableCheck').attr('checked') == 'checked';

	if ( $('#routingTypes li.selected a').attr('key') == 'pedestrian' )
		travelMode = google.maps.TravelMode.WALKING;

	var waypoints = [];
	if ( $('#routePointTable input[type=text]').length > 2 ) {
		$('#routePointTable input[type=text]:not(:first,:last)').each(function() {
			waypoints.push({
				location: $(this).val(),
				stopover: true
			});
		});
	}


	var request = {
		origin: routeFrom,
		destination: routeTo,
		travelMode: travelMode,
		waypoints: waypoints,
		durationInTraffic: durationInTraffic
	};

	var direction = new google.maps.DirectionsService().route(request, function(result, status) {
		if ( status == google.maps.DirectionsStatus.OK ) {

			routeToCalc = true;
			$('#idRouteResult').html('');
			displayDirections.setDirections(result);

			var myRoute = result.routes[0];
			GMapsHelper.routeMarkers(myRoute);

		}
	});
/* to be removed

	lbasGISConn.route(routeRequest, function(json) {

		if (json.rpoints) {
			// routingin cizdigi markerleri ve linelari siler

			for ( var t = 0; t < routeLayer.features.length; t++) {
				// do not remove select drag feature
				if (routeLayer.features[t].style.externalGraphic != "images/nottrackable18x18.png") {
					routeLayer.removeFeatures(routeLayer.features[t], {
						silent :true
					});
					t--;
				}
			}

			routeMarkers = [];
			createRouteMarkerFromTRs();
			centerAndDrawRouteOnMap(json.rpoints);
			adjustZoomLevelToBound(routeLayer.getDataExtent());
			// 			
		}

		var timeStr;
		if (json.totalTimeSeconds < 3600) {
			timeStr = $.i18n.prop('routing.mins.secs', [ Math.floor(json.totalTimeSeconds / 60), json.totalTimeSeconds % 60 ]);
		} else {
			timeStr = $.i18n
					.prop('routing.hours.mins', [ Math.floor(json.totalTimeSeconds / 3600), Math.floor((json.totalTimeSeconds % 3600) / 60) ]);
		}


		var routeTypeText = $.i18n.prop('routing.routeType.' + routeRequest.routeType);

		$('#idRouteResult').html(parseTemplate("routeResultTemplate", {
			route: json.route,
			routeHeader: $.i18n.prop('routing.directions.header', [routeTypeText, routeRequest.routeTo, json.distance, timeStr]),
			routeFrom: routeRequest.routeFrom,
			routeTo: routeRequest.routeTo
		}));

		$('#duration').attr('value', json.totalTimeSeconds);
		$('#distance').attr('value', json.distance);

		var orderedPoints = getOrderedPointsAndAddress();
		if (orderedPoints.address != "") {
			$.post('addRecentRoute.action', {
				lats :orderedPoints.lats,
				lons :orderedPoints.lons,
				totalDistanceInMeters :json.totalDistanceInMeters,
				totalTimeSeconds :json.totalTimeSeconds,
				address :orderedPoints.address,
				duration :json.totalTimeSeconds,
				distance :json.totalDistanceInMeters
			}, function() {
				$('#recentRoutes').html(populateRecentRoutes());
			});
		}
		mainMarkerManager.showClearMapButton();

	}, function() {
		showErrorDialog($.i18n.prop('error.routing.routenotavailable', false));

	});*/

}

function getOrderedPoints() {

	var orderedPoints = {};
	var orderedLats = [];
	var orderedLons = [];
        
        
	$('#routePointTable tr').each(function(inx) {
		var trId = $(this).attr('id');
		var index = trId.replace('routePointTR', '');
		if (lats[index] && lons[index]) {
			if (index < lats.length && lats[index] != '' && lons[index] != '') {
				orderedLats[orderedLats.length] = lats[index];
				orderedLons[orderedLons.length] = lons[index];
			}
		}
	});

	orderedPoints.lats = orderedLats;
	orderedPoints.lons = orderedLons;
        
	return orderedPoints;
}
/* to be removed
function createRouteMarkerFromTRs() {

	$('#routePointTable tr').each(function(inx) {

		var trId = $(this).attr('id');
		// id val.
		var index = trId.replace('routePointTR', '');
		if (routeMarkers[index] == undefined) {
			createRouteMarker(lats[index], lons[index], index, inx);
		}
	});

}*/

function getOrderedPointsAndAddress() {

	var orderedPoints = {};
	var orderedLats = [];
	var orderedLons = [];
	var orderedAddress = [];
	var invalidAddress = false;

	$('#routePointTable tr').each(function(inx) {

		var trId = $(this).attr('id');
		var index = trId.replace('routePointTR', '');
		if (lats[index] && lons[index]) {

			if (index < lats.length && lats[index] != '' && lons[index] != '') {
				orderedLats[orderedLats.length] = lats[index];
				orderedLons[orderedLons.length] = lons[index];
			}
		}

		var tmpAddress = $('#routePoint' + index).val();
		if (tmpAddress == null || tmpAddress == undefined || tmpAddress == 'null' || tmpAddress == 'undefined' || tmpAddress == "")
			invalidAddress = true;
		orderedAddress[index] = $('#routePoint' + index).val();
	});

	orderedPoints.lats = orderedLats;
	orderedPoints.lons = orderedLons;
	if (invalidAddress)
		orderedPoints.address = "";
	else
		orderedPoints.address = orderedAddress;

	return orderedPoints;
}



function getSavedRoutes(container) {
	
  if (container == undefined) container = '#tab-routes-savedRoutes';
	var options = {};
	options.success = function(json) {
		if (checkResponseSuccess(json)){
		  renderRoutes(container, json);
		  return;
		  
      $(container).html();
      var content = parseTemplate("savedRoutesTemplate", {
				savedRoutes :json.savedRoutes,
				actionList :json.actionList
			});
			
			$(container).html(content);
                        
                        $('#tab-routes-savedRoutes #searchReset').hide();
                        $('#tab-routes-savedRoutes #search').show();
                        
                        $('.globalSearchButton').unbind('click')
                        .live('click', function(){
                            var id = $(this).attr('id').substring('item_name_'.length);

                            processSavedRouteAction(1, id);
                        });
                        $('.openClose, .routeDetail').die('click');
                        $('.openClose, .routeDetail').live('click', function(){
                            var id = $(this).attr('id').substring('open_item_details_'.length);
                            var container = $('#item_details_'+id);
                            var $subul = $(this).parent().find('ul#item_details_'+id);
                            var iconChange = $(this).parent().find('#open_item_details_'+id).find("img");
                            $(this).parent().parent().parent().toggleClass("expand");

                            
                            if($subul && $subul.is(':visible')){
                                iconChange.attr('src', 'images/arrow_right.png');
                                container.hide();
                                //buttons.hide();
                                //mainContainer.removeClass('groupElementExpanded');
                                //itemName.removeClass('itemNameExpanded');
                            }else{
                                iconChange.attr('src', 'images/arrow_down.png');
                                container.show();
                                //buttons.show();
                                //itemName.addClass('itemNameExpanded');
                            }

                        });
                        
                        $('#btn_routes_Print')
                        .die('click')
                        .live('click', function(){
                            printRoute('route');
                        });
                        
                        $('#btn_routes_Delete')
                        .die('click')
                        .live('click', function(){
                             var routeID = $(this).attr('routeID');
                            processSavedRouteAction(2, routeID);
                        });
                        
                        $('#btn_routes_Share')
                        .die('click')
                        .live('click', function(){
                             var routeID = $(this).attr('routeID');
                            processSavedRouteAction(3, routeID);
                        });
                        
                        $('#btn_routes_Delete_All')
                        .die('click')
                        .live('click', function(){
                            processSavedRouteAction(2, 0);
                        });
                        
			
			glbSavedRoutes = json.savedRoutes;
                
                /*
                $("#messageTo").tokenInput("userSearchRoutingAutocomplete.action", {
				method :"GET",
				noResultsText :$.i18n.prop('no.results.text'),
				jsonContainer: 'resultList',
				prePopulate: null,
				tokenFormatter: function(item){ return "<li>" + "<span style='display: inline-block;' class='user-name'>" + item.name + "</span><span class='user-id' style='display:none'>" + item.id + "</span></li>" },
				classes :{
					tokenList :"token-input-list-facebook",
					token :"token-input-token-facebook",
					tokenDelete :"token-input-delete-token-facebook",
					selectedToken :"token-input-selected-token-facebook",
					highlightedToken :"token-input-highlighted-token-facebook",
					dropdown :"token-input-dropdown-facebook",
					dropdownItem :"token-input-dropdown-item-facebook",
					selectedDropdownItem :"token-input-selected-dropdown-item-facebook",
					inputToken :"token-input-input-token-facebook"
				}
			});*/
			
			
			if ($.browser.msie) {
				$('.token-input-list-facebook', $('#idSaveRouteDiv')).css({
					height :'60px'
				});
			}
			return content;
		}
	}
	utils && utils.lbasDoGet('getSavedRoutes.action', options);
	
	/*
	$.ajax({
		url :'getSavedRoutes.action',
		type :'POST',
		async :false,
		data :{},
		dataType :'json',
		success :function(json) {
			$('#idSavedRoutesDiv').html(parseTemplate("savedRoutesTemplate", {
				savedRoutes :json.savedRoutes,
				actionList :json.actionList
			}));
			glbSavedRoutes = json.savedRoutes;

			$("#messageTo").tokenInput("userSearchRoutingAutocomplete.action", {
				method :"POST",
				noResultsText :$.i18n.prop('no.results.text'),
				classes :{
					tokenList :"token-input-list-facebook",
					token :"token-input-token-facebook",
					tokenDelete :"token-input-delete-token-facebook",
					selectedToken :"token-input-selected-token-facebook",
					highlightedToken :"token-input-highlighted-token-facebook",
					dropdown :"token-input-dropdown-facebook",
					dropdownItem :"token-input-dropdown-item-facebook",
					selectedDropdownItem :"token-input-selected-dropdown-item-facebook",
					inputToken :"token-input-input-token-facebook"
				}
			});
			if ($.browser.msie) {
				$('.token-input-list-facebook', $('#idSaveRouteDiv')).css({
					height :'60px'
				});
			}

			// $('#idSavedRoutesScrollPane').jScrollPane( {
			// showArrows :true,
			// scrollbarWidth :15,
			// arrowSize :16
			// });
		}
	});
	*/
}

function renderRoutes(container, json) {
  if (container == undefined) container = '#tab-routes-savedRoutes';
  $(container).html();
  
  var content = parseTemplate("savedRoutesTemplate", {
    savedRoutes :json.savedRoutes,
    actionList :json.actionList
  });
  $(container).html(content);
  $('#tab-routes-savedRoutes #searchReset').hide();
  $('#tab-routes-savedRoutes #search').show();
  $('.globalSearchButton').unbind('click')
  .live('click', function(){
      var id = $(this).attr('id').substring('item_name_'.length);
      processSavedRouteAction(1, id);
  });
  $('.openClose, .routeDetail').die('click').live('click', function(e){
      e.preventDefault();
      if($(this).attr('id') == undefined) return;
      var id = $(this).attr('id').substring('open_item_details_'.length);
      var container = $('#item_details_'+id);
      var $subul = $(this).parent().find('ul#item_details_'+id);
      var iconChange = $(this).parent().find('#open_item_details_'+id).find("img");
      $(this).parent().parent().parent().toggleClass("expand");
      if($subul && $subul.is(':visible')){
          iconChange.attr('src', 'images/arrow_right.png');
          container.hide();
          //buttons.hide();
          //mainContainer.removeClass('groupElementExpanded');
          //itemName.removeClass('itemNameExpanded');
      }else{
          iconChange.attr('src', 'images/arrow_down.png');
          container.show();
          //buttons.show();
          //itemName.addClass('itemNameExpanded');
      }
  
  });
  
  $('#btn_routes_Print')
  .die('click')
  .live('click', function(){
      printRoute('route');
  });
  
  $('#btn_routes_Delete')
  .die('click')
  .live('click', function(){
       var routeID = $(this).attr('routeID');
      processSavedRouteAction(2, routeID);
  });
  
  $('#btn_routes_Share')
  .die('click')
  .live('click', function(){
       var routeID = $(this).attr('routeID');
      processSavedRouteAction(3, routeID);
  });
  
  $('#btn_routes_Delete_All')
  .die('click')
  .live('click', function(){
      processSavedRouteAction(2, 0);
  });
  
  glbSavedRoutes = json.savedRoutes;
  if ($.browser.msie) {
    $('.token-input-list-facebook', $('#idSaveRouteDiv')).css({
      height :'60px'
    });
  }
  return content;
}










function searchSavedRoutes() {
  var valore = $('#searchRoute').val();
	$.ajax({
		url :'searchSavedRoutes.action',
		type :'POST',
		async :false,
		data :{
			searchText :$('#searchRoute').val()
		},
		dataType :'json',
		success :function(json) {
			if (json.savedRoutes.length > 0) 
            {
                            
                            $('#tab-routes-savedRoutes').empty();
                        
                            var content = parseTemplate("savedRoutesTemplate", {
                                    savedRoutes :json.savedRoutes,
                                    actionList :json.actionList
                            });
                            $('#tab-routes-savedRoutes').html(content);
                            $('#tab-routes-savedRoutes #searchRoute').val(valore);
                            $('#tab-routes-savedRoutes #searchReset').show();
                            $('#tab-routes-savedRoutes #search').hide();
                            
				if ($.browser.msie) {
					$('.token-input-list-facebook', $('#idSaveRouteDiv')).css({
						height :'60px'
					});
				}
			} else {
				popupConfirmationDialog();
				$("#selectConfirmation p").text($.i18n.prop('routing.noRouteFound'));

			}

			// $('#idSavedRoutesScrollPane').jScrollPane( {
			// showArrows :true,
			// scrollbarWidth :15,
			// arrowSize :16
			// });
		}
	});

}

function getSavedRoute(routeId) {
	$.ajax({
		url :'getSavedRoute.action',
		type :'POST',
		async :false,
		data :{
			routeId :routeId
		},
		dataType :'json',
		success :function(json) {

			if (json.savedRoutes.length > 0) {
				$('#idSavedRoutesDiv').html(parseTemplate("savedRoutesTemplate", {
					savedRoutes :json.savedRoutes,
					actionList :json.actionList
				}));
				/*

				$("#messageTo").tokenInput("userSearchRoutingAutocomplete.action", {
					method :"POST",
					noResultsText :$.i18n.prop('no.results.text'),
					classes :{
						tokenList :"token-input-list-facebook",
						token :"token-input-token-facebook",
						tokenDelete :"token-input-delete-token-facebook",
						selectedToken :"token-input-selected-token-facebook",
						highlightedToken :"token-input-highlighted-token-facebook",
						dropdown :"token-input-dropdown-facebook",
						dropdownItem :"token-input-dropdown-item-facebook",
						selectedDropdownItem :"token-input-selected-dropdown-item-facebook",
						inputToken :"token-input-input-token-facebook"
					}
				});
				*/
				if ($.browser.msie) {
					$('.token-input-list-facebook', $('#idSaveRouteDiv')).css({
						height :'60px'
					});
				}
			} else {
				popupConfirmationDialog();
				$("#selectConfirmation p").text($.i18n.prop('routing.noRouteFound'));
			}

			// $('#idSavedRoutesScrollPane').jScrollPane( {
			// showArrows :true,
			// scrollbarWidth :15,
			// arrowSize :16
			// });
		}
	});

}

function EnableDisableButtonsRouting()
{
    var count = 0;
    var routes = $('#tab-routes-savedRoutes .contents li');
    
    for(var i = 0, len = routes.length; i < len; i++) 
    {
      var route = routes.eq(i);
      
      if (route.find('.route').is(':checked'))
      {
          count += 1;
      }
      
    }
    if (count > 0) {
      $('#btn_routes_Delete_All')
        .removeClass('multi_user_button_inactive')
        .addClass('multi_user_button');
    }
    else {
      $('#btn_routes_Delete_All')
        .removeClass('multi_user_button')
        .addClass('multi_user_button_inactive');
    }
}

function unchecksavedOtherRoutes(checkedRouteId) {

	$('input:radio', $('#idSavedRoutesScrollPane')).each(function() {

		if ($(this).attr('id') != ("savedRouteCheckbox-id" + checkedRouteId)) {
			$(this).attr('checked', false);
		}
	});
}
function processSavedRouteAction(v, routeID) {
	
        //var v = $('#savedRoutesActions').val();
        

	var selectedRoutesArray = [];
        if (routeID > 0)
            selectedRoutesArray.push(routeID);
        else{
          $("input[id^='savedRouteCheckbox-id']:checked").each(function() {
                  var routeID = $(this).attr("value");
                  selectedRoutesArray[selectedRoutesArray.length] = routeID;
          });
        }
	if (selectedRoutesArray.length == 0) {
		showInfoDialog($.i18n.prop('warning.routing.select.one.route'));
	} else {
		if (v == 1) {// Show on map:1
			if (selectedRoutesArray.length == 1) {
				//$("input[id^='savedRouteCheckbox-id']:checked").each(function() {
				//	var routeID = $(this).attr("value");
			if(glbSavedRoutes === undefined){
				getSavedRoutes();
				for ( var i = 0; i < glbSavedRoutes.length; i++) {
					if (glbSavedRoutes[i].id == routeID) {
						$('#routingTypes li.selected a').val(glbSavedRoutes[i].mode);
						redrawRoute(glbSavedRoutes[i].points);
					}
				}								
			}else{
				for ( var i = 0; i < glbSavedRoutes.length; i++) {
					if (glbSavedRoutes[i].id == routeID) {
						$('#routingTypes li.selected a').val(glbSavedRoutes[i].mode);
						redrawRoute(glbSavedRoutes[i].points);
					}
				}				
			}

				//});
			} else {
				showInfoDialog($.i18n.prop('warning.routing.select.only.one.route'));
			}
		} else if (v == 2) {// Delete:2
			if (selectedRoutesArray.length > 0) {
				$.ajax({
					url :'deleteRoute.action',
					type :'POST',
					async :false,
					data :{
						selectedSavedRoutes :selectedRoutesArray
					},
					dataType :'json',
					success :function() {
						getSavedRoutes($('#tab-routes-savedRoutes'));
					}
				});
			}
		} else if (v == 3) {// Share:3
			if (selectedRoutesArray.length == 1) 
			{
				btns = {};
				var ct = $('#idShareRouteDiv').html();
			    utils && utils.dialog({
			    		title: $.i18n.prop('route.ShareRoute'),
			    		content: ct,
			    		css: 'shareRouteDialog',
			    		buttons: btns
			    	});
			    $(".shareRouteDialog").css({
			    	"width": 360
			    });
			    	
			    $('#btShareRoute').live('click', function(){
			        shareRoute(routeID);
			    });
			    $('#cancelBtn').live('click', function(){
			        utils.closeDialog();
			    });
			   
			    
			    $("#dialog #messageTo").tokenInput("userSearchRoutingAutocomplete.action", {
					type :"POST",
					prePopulate: null,
					noResultsText :$.i18n.prop('no.results.text'),
					tokenFormatter: function(item){ return "<li>" + "<span style='display: inline-block;' >" + item.name + "</span><span class='user-id' style='display:none'>" + item.id + "</span></li>" },
					jsonContainer: 'resultList',
					classes :{
						tokenList :"token-input-list-facebook",
						token :"token-input-token-facebook",
						tokenDelete :"token-input-delete-token-facebook",
						selectedToken :"token-input-selected-token-facebook",
						highlightedToken :"token-input-highlighted-token-facebook",
						dropdown :"token-input-dropdown-facebook",
						dropdownItem :"token-input-dropdown-item-facebook",
						selectedDropdownItem :"token-input-selected-dropdown-item-facebook",
						inputToken :"token-input-input-token-facebook"
					}
				});
				//$("#idShareRouteDiv").show();
				//$("#savedRoutesActionsDiv").hide();
			} else {
				showInfoDialog($.i18n.prop('warning.routing.select.only.one.route'));
			}
		}
	}
	/*
	$(".olControlPanZoomBar").css({left:0});*/
}

function swapRoutingLocations() {
	var routeFrom = $('#routePoint0').attr('value');
	var routeFromLat = $('#startLatitude').attr('value');
	var routeFromLon = $('#startLongitude').attr('value');

	var routeTo = $('#routePoint1').attr('value');
	var routeToLat = $('#endLatitude').attr('value');
	var routeToLon = $('#endLongitude').attr('value');

	if (routeFromMarkerID != null && routeToMarkerID != null) {
		setRoutePoint(routeTo, routeToLat, routeToLon, 0);
		setRoutePoint(routeFrom, routeFromLat, routeFromLon, 1);
	} else if (routeFromMarkerID != null) {
		clearRouteFrom();

		setRoutePoint(routeFrom, routeFromLat, routeFromLon, 1);
	} else if (routeToMarkerID != null) {
		clearRouteTo();

		setRoutePoint(routeTo, routeToLat, routeToLon, 0);
	}
}

function initRoutingPage() {
	initRoutePointAutocomplete([ '0', '1' ]);
	//initTableDnD();
	/*
	$("#routingTypes").empty();
	$("<option>").attr("value", 'driving').text($.i18n.prop('routing.driving')).appendTo("#routingTypes");
	$("<option>").attr("value", 'pedestrian').text($.i18n.prop('routing.pedestrian')).appendTo("#routingTypes");
	*/
	
	$("#routingTypes li a").each(function(index) {
		if ($(this).attr("class") == 'driving') {
			$(this).attr('key', 'driving');
		}
		if ($(this).attr("class") == 'pedestrian') {
			$(this).attr('key', 'pedestrian');
		}
		$(this).addClass('lm');
	});
	
	//getSavedRoutes();
}

function initTableDnD() {
	$("#routePointTable").tableDnD({
		onDrop :function(table, row) {
			orderPointLabels();
			var markerCount = 0;
			for ( var i = 0; i < routeMarkers.length; i++) {
				if (routeMarkers[i] != null) {
					markerCount++;
				}
			}
			if (markerCount >= 2) {

				searchRoute();

			}

		}
	});
}

function retrievePoiResponseArr(poiResults, responseArr) {
	$('#routePointTable input[type=text]').each(function() {
		var trId = $(this).attr('id');
		var index = trId.replace('routePoint', '');
		$("#routePoint" + index).removeClass("ui-autocomplete-loading");
	});

	if (poiResults != undefined) {

		for ( var i = 0; i < poiResults.length; i++) {
			responseArr.push({
				label :poiResults[i].address,
				value :poiResults[i].address,
				latitude :poiResults[i].latitude,
				longitude :poiResults[i].longitude

			});
		}
	}
	return responseArr;

}

function initRoutePointAutocomplete(indexArr) {

	for ( var i = 0; i < indexArr.length; i++) {
		if ( document.getElementById("routePoint" + indexArr[i]) == undefined )
			continue;

		var autocomplete = new google.maps.places.Autocomplete( document.getElementById("routePoint" + indexArr[i]), { } );
		autocomplete.idAutocomplete = indexArr[i];
		google.maps.event.addListener( autocomplete, 'place_changed', function() {
			var place    = this.getPlace();
			if ( place.geometry != undefined ) {
				setRoutePoint(this.name, place.geometry.location.lat(), place.geometry.location.lng(), this.idAutocomplete, false);
			} else {
				var options = {};
				options.data = {
					listIndex: 0,
					searchText: this.namel,
					poiId: 'routePoint' + this.idAutocomplete,
					routeIndex: this.idAutocomplete
				};
				options.async = false;
				options.success = function(json) {
					if(checkResponseSuccess(data)){
						if (json.poilist && json.poilist.length > 0) {
							setRoutePoint(json.poilist[0].name, json.poilist[0].latitude, json.poilist[0].longitude, json.routeIndex);
						}
					}
				};	
				
				utils && utils.lbasDoGet('searchPOIs.action');
			}
		});

	}

}

function populateRecentRoutes() {
	var str;
	$.ajax({
		url :'getrecentroute.action',
		type :'POST',
		async :false,
		dataType :'json',
		success :function(json) {
			if (checkResponseSuccess(json)) {
				str = parseTemplate("recentRoutesTemplate", {
					json :json
				});
				return str;
			}
		}
	});
	return str;
}

function clearAllPoints() {

	$('#routePointTable tr').each(function(index) {
		var indx = $(this).attr('id').replace('routePointTR', '');
		lats = [];
		lons = [];
		routeAdresses = [];
		if (routeMarkers[indx] != undefined) {
			routeLayer.removeFeatures([ routeMarkers[indx] ], {
				silent :true
			});
			routeMarkers.splice(indx, 1, null);

		}

		if (index > 1) {
			$('#routePointTR' + indx).remove();
			orderPointLabels();
			showHideDeleteIcons();
			setRightClickMenu();

		} else {
			$(this).attr('id', 'routePointTR' + index);
			$('#routePoint' + indx).attr('id', 'routePoint' + index);
		}
		maxRowID = 1;
	});
	$('#label_routingTrafficEnableCheck').removeClass('disabled');
	$('#routingTrafficEnableCheck').removeAttr('disabled');
	$('#idRouteResult').html('');
}

function splitPointsAndRedrawRoute(routePathName, routePathCoord) {

	var routePaths = routePathName.split(';');
	var routeCoords = routePathCoord.split(';');
	var orderedLats = [];
	var orderedLons = [];

	var points = [];
	for ( var i = 0; i < routeCoords.length - 1; i = i + 2) {
		points.push({
			latitude :routeCoords[i],
			longitude :routeCoords[i + 1]
		});
		// orderedLats.push(routeCoords[i]);
		// orderedLons.push(routeCoords[i + 1]);
	}

	for ( var i = 0; i < routePaths.length; i++) {
		points[i].address = routePaths[i];
	}
	redrawRoute(points);
}

function pausecomp(millis) 
{
var date = new Date();
var curDate = null;

do { curDate = new Date(); } 
while(curDate-date < millis);
} 

function redrawRoute(points) {

	

	$('#centerP').css({
		overflow :''
	});

	$('#lbasMainMap').show();
	$('#messageDiv').hide();
	$('#privacyCenterDiv').hide();
	$('#privacyRightDiv').hide();
	$('#calendarCenterDiv').hide();
	$('#dashboardDiv').hide();
	changeRightNavigation('routingRightNav', null);
	$('#mapNavs').show();
	openWestPanel();

	clearAllPoints();

	// var routePaths = routePathName.split(';');
	// var routeCoords = routePathCoord.split(';');

	// if (routePathName == "") {
	// routeFrom = "";
	// routeTo = "";
	// } else {
	// routeFrom = routePaths[0];
	// routeTo = routePaths[routePaths.length - 1];
	// }

	for ( var i = 0; i < points.length; i++) {

		var autoRouteDisable = true;
		
		if (i == points.length - 1) {
			autoRouteDisable = false;
		}
		if (points[i] != null) {
			setRoutePoint(points[i].address, points[i].latitude, points[i].longitude, i, autoRouteDisable) ;

			//setTimeout('addDestination({address :"' + points[i].address + '",lat :"' + points[i].latitude + '",lon :"' + points[i].longitude + '",autoRouteDisable :"' + autoRouteDisable + '"});', 500 * i);

		}
		

	}

	setTimeout('leftPanel.tabRoutesSubTabs.tabs("select", 0);', 1500);

}

function deletePoint(element) {

	var rowCount = $('#routePointTable input[type=text]').length;
	if (rowCount == 2) {
		return;
	}
	var deleteIconId = element.id;
	var index = deleteIconId.replace('deletePoint', '');
	$('#routePointTR' + index).remove();
	orderPointLabels();
	showHideDeleteIcons();
	lats[index] = '';
	lons[index] = '';
	routeAdresses[index] = '';
	// mainMarkerManager.removeMarker(routeMarkerIDs[index]);
	// routeMarkerIDs[index] = null;
	mainMarkerManager.removeMarker( 'routeMarker' + index );

	/*routeLayer.removeFeatures([ routeMarkers[index] ], {
		silent :true
	});
	routeMarkers.splice(index, 1);*/
	var rowCount = $('#routePointTable input[type=text]').length;
	if (rowCount == 2) {
		$('#label_routingTrafficEnableCheck').removeClass('disabled');
		$('#routingTrafficEnableCheck').removeAttr('disabled');
	}

	setRightClickMenu();
	searchRoute();
}

function showHideDeleteIcons() {

	var rowCount = $('#routePointTable input[type=text]').length;
	if (rowCount > 2) {
		$('#routePointTable a[id*=deletePoint]').show();
	} else {
		$('#routePointTable a[id*=deletePoint]').each(function(index) {
			if (index == 0 || index == 1) {
				$(this).hide();
			} else {
				$(this).show();
			}
		});
	}
}

function cancelRoute() {
	//hide('idSaveRouteDiv');
	show('idRouteResultActionsDiv');
	$('#idRouteName').css('color', '#7E7E7E');
	$("#idRouteName").val($.i18n.prop('routing.select.typeInName'));
}
