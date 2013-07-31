var selectedLat;
var selectedLon;
var hoverLat;
var hoverLon;
var markerLayer;
var circleLayer;
var routeLayer;
var routeLayerForLocationReport;
var routeLayerForLocationReportInfo = [];
var routeLayerForMeeting;
var currentPopup, popup;
var streetmap, aerial, streetMapTransparent, trafficMapTransparent, mainMarkerManager;
/* to be removed
var proj4326 = new OpenLayers.Projection("EPSG:4326");
var proj900913 = new OpenLayers.Projection("EPSG:900913");*/
var dashMap1, shaded1, dashMap2, shaded2, dashMap1MarkerLayer, dashMap2MarkerLayer, dashMap1MarkerManager, dashMap2MarkerManager;
//var lbasGISConn;
var forceCreateTelmapSession = true;
var geocoder = new google.maps.Geocoder();

var navteqUrlArr = [ 1 ];

var isTrafficVisible = false;
/*to be removed
function quadkey_getTileURL(bounds, prefix) {
	var res = this.map.getResolution();
	var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
	var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
	var z = this.map.getZoom();
	var limit = Math.pow(2, z);

	var path = tileXYToQuadKey(x, y, z);
	var url = this.url;
	if (url instanceof Array) {
		url = this.selectUrl(path, url);
	}

	return url + prefix + path;
}

function quadkey_getTileURLTraffic(bounds) {
	var res = this.map.getResolution();
	var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
	var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
	var z = this.map.getZoom();
	var limit = Math.pow(2, z);

	var path = tileXYToQuadKey(x, y, z);
	var url = this.url;
	if (url instanceof Array) {
		url = this.selectUrl(path, url);
	}

	return "https://" + url + ".tl.prd.lbsp.navteq.com/traffic/6.0/"
			+ "quadkeytraffic.jsp?profile=NTprtls&token=c56012a38fe8298f384b21298a86147ac48abeff3aa91f3e&quadkey=" + path;
}

function quadkey_getTileURLTransparent(bounds) {
	var res = this.map.getResolution();
	var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
	var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
	var z = this.map.getZoom();
	var limit = Math.pow(2, z);

	var path = tileXYToQuadKey(x, y, z);
	var url = this.url;
	if (url instanceof Array) {
		url = this.selectUrl(path, url);
	}

	return "https://"
			+ url
			+ ".tl.prd.lbsp.navteq.com/mgi/6.0/quadkey?mapstyle=navteq.com&cat=basemap.polyline|basemap.poi&token=c56012a38fe8298f384b21298a86147ac48abeff3aa91f3e&prop:TransparentAreas=true&quadkey="
			+ path;
}

function quadkey_getTileURLStreet(bounds) {
	var res = this.map.getResolution();
	var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
	var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
	var z = this.map.getZoom();
	var limit = Math.pow(2, z);

	var path = tileXYToQuadKey(x, y, z);
	var url = this.url;
	if (url instanceof Array) {
		url = this.selectUrl(path, url);
	}

	return "https://" + url
			+ ".tl.prd.lbsp.navteq.com/mgi/6.0/quadkey?mapstyle=navteq.com&token=c56012a38fe8298f384b21298a86147ac48abeff3aa91f3e&quadkey=" + path;
}

function quadkey_getTileURLSatellite(bounds) {
	var res = this.map.getResolution();
	var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
	var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
	var z = this.map.getZoom();
	var limit = Math.pow(2, z);

	var path = tileXYToQuadKey(x, y, z);
	var url = this.url;
	if (url instanceof Array) {
		url = this.selectUrl(path, url);
	}
	return "https://" + url + ".stl.prd.lbsp.navteq.com/satellite/6.0/images?token=APP000229774&syn=1&quadkey=" + path;
}*/

function tileXYToQuadKey(x, y, levelOfDetail) {

	var quadKey = "";

	for ( var i = levelOfDetail; i > 0; i--) {
		mask = 1 << (i - 1);
		digit = 0;
		if ((x & mask) != 0)
			digit += 1;

		if ((y & mask) != 0)
			digit += 2;

		quadKey += digit;
	}
	return quadKey;

}

function loginNavteq(elementId) {
	/*jsapi.Config.setDefault("secureConnection", "prefer");
	// // Set the authentication token, which is needed by the web-services to authenticate your application.
	jsapi.util.ApplicationContext.set("authenticationToken", "APP000229774");

  // HACK FOR FIREBUG
  try {
    document.oldWrite = document.write;
    document.write = function(code) {
      $('body').append(code);
    }
  }
  catch(ex) { }

  jsapi.util.ApplicationContext.set("defaultLanguage", "en-US");
*/
	on_login(elementId);
}

function telmapRefreshSession() {

}

function telmapRefreshSessionCallback(response, status) {

}

function on_login(elementId, response, status) {

	trafficMapTransparent = new google.maps.TrafficLayer();
	/*
	OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
	OpenLayers.Util.onImageLoadErrorColor = 'transparent';

	trafficMapTransparent = new OpenLayers.Layer.TMS("Navteq Transparent Traffic View", navteqUrlArr, {
		numZoomLevels :18,
		transparent :true,
		isBaseLayer :false,
		type :'png',
		getURL :quadkey_getTileURLTraffic
	}, {
		'buffer' :4
	});

	streetMapTransparent = new OpenLayers.Layer.TMS("Navteq Transparent Street View", navteqUrlArr, {
		numZoomLevels :18,
		transparent :true,
		isBaseLayer :false,
		type :'png',
		transitionEffect :'resize',
		getURL :quadkey_getTileURLTransparent
	}, {
		'buffer' :4
	});

	streetmap = new OpenLayers.Layer.TMS("Navteq Street View", navteqUrlArr, {
		numZoomLevels :18,
		baseLayer :true,
		type :'png',
		transitionEffect :'resize',
		displayOutsideMaxExtent :true,
		getURL :quadkey_getTileURLStreet
	}, {
		'buffer' :4
	});

	aerial = new OpenLayers.Layer.TMS("Navteq Satellite View", navteqUrlArr, {
		numZoomLevels :18,
		baseLayer :true,
		type :'png',
		transitionEffect :'resize',
		displayOutsideMaxExtent :true,
		getURL :quadkey_getTileURLSatellite
	}, {
		'buffer' :4
	});

	map.addLayers( [ streetmap, aerial, streetMapTransparent, trafficMapTransparent ]);

	circleLayer = new OpenLayers.Layer.Vector("Circle Layer", {
		displayInLayerSwitcher :false
	});

	routeLayer = new OpenLayers.Layer.Vector("Route Layer", {
		displayInLayerSwitcher :false,
		rendererOptions : {
			zIndexing :true
		}
	});*/

	routeLayerForLocationReport = [];
/*
	routeLayerForMeeting = new OpenLayers.Layer.Vector("Meeting Route Layer", {
		displayInLayerSwitcher :false,
		rendererOptions : {
			zIndexing :true
		}
	});*/

	var myNavControl = null;

	/*if ("ipad" == userAgentType || "iPhone" == userAgentType) {
		myNavControl = new OpenLayers.Control.TouchNavigation( {
			dragPanOptions : {
				enableKinetic :true
			}
		});
	} else {
		myNavControl = new OpenLayers.Control.Navigation( {
			handleRightClicks :true
		});
	}*/

	/*map.addControl(new OpenLayers.Control.PanZoomBar());
	map.addControl(myNavControl);
	map.addLayer(new OpenLayers.Layer.Vector("Navteq", {
		attribution :"<div class=\"navteqCopyright\"></div>"
	}));
	map.addControl(new OpenLayers.Control.Attribution());
	map.addControl(new OpenLayers.Control.ScaleLine());*/

	if (userLoggedIn) {
		/*if ("ipad" != userAgentType && "iPhone" != userAgentType) {
			myNavControl.handlers.click.callbacks.rightclick = function(evt) {
				mapRightClickHandler(evt);
			};

			map.events.register("mousemove", map, function(e) {
				mouseMoved(e);
			});
		}*/
		/*var panel = new OpenLayers.Control.Panel(OpenLayers.Control.TYPE_TOOL, 'Map Controls');

		var button1 = new OpenLayers.Control.Button( {
			displayClass :"clearMap",
			trigger :function() {
				clearMapClicked();
			}
		});

		var button2;
		if (lbasRightManager && lbasRightManager.checkRight("be_located")) {
			button2 = new OpenLayers.Control.Button( {
				displayClass :"myLocation",
				trigger :function() {
					myLocationClicked();
				}
			});
		} else {
			button2 = new OpenLayers.Control.Button( {
				displayClass :"myLocation"
			});
		}

		var button3 = new OpenLayers.Control.Button( {
			displayClass :"users",
			trigger :function() {
				usersMapButtonClicked();
			}
		});

		var button4 = new OpenLayers.Control.Button( {
			displayClass :"hybridMap",
			trigger :function() {
				hybridMapButtonClicked();
			}
		});

		var button5 = new OpenLayers.Control.Button( {
			displayClass :"satelliteMap",
			trigger :function() {
				satelliteMapButtonClicked();
			}
		});

		var button6 = new OpenLayers.Control.Button( {
			displayClass :"streetMap",
			trigger :function() {
				streetMapButtonClicked();
			}
		});

		var button7 = new OpenLayers.Control.Button( {
			displayClass :"traffic",
			trigger :function() {
				trafficButtonClicked();
			}
		});

		panel.addControls( [ button1, button2, button3, button4, button5, button6, button7 ]);
*/
		//map.addControl(panel);

		$('.clearMapItemInactive').css( {
			display :'none'
		});

		setMapButtonStyle();
	}

	/*markerLayer = new OpenLayers.Layer.Markers("mainMarkerLayer", {
		displayInLayerSwitcher :false
	});*/

	/*map.addLayers( [ circleLayer, routeLayer, routeLayerForLocationReport, routeLayerForMeeting, markerLayer ]);

	var point = new OpenLayers.LonLat(userSessionLon, userSessionLat);
	point.transform(proj4326, proj900913);// for sphericalMercator
	map.setCenter(point, 5);
	streetMapTransparent.setVisibility(false);
	trafficMapTransparent.setVisibility(false);
	$('#' + elementId).hide();*/

	mainMarkerManager = new LbasMarkerManger(map, markerLayer, circleLayer);

}

function setMapButtonStyle() {

	$('.clearMapItemInactive').css( {
		left :'' + (parseInt($(window).width()) - 710) + 'px'
	});

	$('.usersItemInactive').css( {
		left :'' + (parseInt($(window).width()) - 610) + 'px'
	});

	$('.trafficItemInactive').css( {
		left :'' + (parseInt($(window).width()) - 510) + 'px'
	});

	$('.streetMapItemInactive').css( {
		left :'' + (parseInt($(window).width()) - 410) + 'px'
	});

	$('.hybridMapItemInactive').css( {
		left :'' + (parseInt($(window).width()) - 310) + 'px'
	});

	$('.satelliteMapItemInactive').css( {
		left :'' + (parseInt($(window).width()) - 210) + 'px'
	});

	$('.myLocationItemInactive').css( {
		left :'' + (parseInt($(window).width()) - 110) + 'px'
	});

	if (lbasRightManager && lbasRightManager.checkRight("be_located") == false) {
		$('.myLocationItemInactive').css( {
			'background-color' :'#DFDFDF'
		});
	}

	$('.streetMapItemInactive').html("<span class='lm' key='welcome.Map'>" + $.i18n.prop('welcome.Map') + "</span>");
	$('.satelliteMapItemInactive').html("<span class='lm' key='welcome.Satellite'>" + $.i18n.prop('welcome.Satellite') + "</span>");
	$('.hybridMapItemInactive').html("<span class='lm' key='welcome.Hybrid'>" + $.i18n.prop('welcome.Hybrid') + "</span>");
	$('.trafficItemInactive').html("<span class='lm' key='welcome.Traffic'>" + $.i18n.prop('welcome.Traffic') + "</span>");
	$('.clearMapItemInactive').html("<span class='lm' key='welcome.clearMap'>" + $.i18n.prop('welcome.clearMap') + "</span>");
	$('.usersItemInactive').html("<span class='lm' key='welcome.ShowUsers'>" + $.i18n.prop('welcome.ShowUsers') + "</span>");
	$('.myLocationItemInactive').html("<span class='lm' key='welcome.MyLocation'>" + $.i18n.prop('welcome.MyLocation') + "</span>");

	$('.streetMapItemInactive').css('background-color', '#3F3F3F');
}

function initLbasMap(latitude, longitude, zoom, simultaneousTileCount) {


	try {
		if (simultaneousTileCount > 1) {
			for ( var i = 1; i < simultaneousTileCount; i++) {
				navteqUrlArr[i] = i + 1;
			}
		}
		// lbasGISConn = new TelmapGISManager();
		// lbasGISConn = new NativeGISManager();
				
		//lbasGISConn = new NavteqGISManager();
		/*var options2 = {
			controls : [ new OpenLayers.Control.PanZoomBar(), new OpenLayers.Control.Navigation() ],
			projection :new OpenLayers.Projection("EPSG:900913"),// for sphericalMercator
			displayProjection :new OpenLayers.Projection("EPSG:4326"),// for sphericalMercator
			units :"m",
			maxResolution :156543.0339,// for sphericalMercator
			maxExtent :new OpenLayers.Bounds(-20037508.34, -20037508.34,// for sphericalMercator
					20037508.34, 20037508.34)
		// for sphericalMercator

		};

		var myNavControl2 = null;
		if ("ipad" == userAgentType || "iPhone" == userAgentType) {
			myNavControl2 = new OpenLayers.Control.TouchNavigation( {
				dragPanOptions : {
					enableKinetic :true
				}
			});
		} else {
			myNavControl2 = new OpenLayers.Control.Navigation( {
				handleRightClicks :true
			});
		}

		dashMap1 = new OpenLayers.Map('dashMap1', options2);
		dashMap1.addControl(new OpenLayers.Control.PanZoomBar());
		dashMap1.addControl(myNavControl2);
		dashMap1.addLayer(new OpenLayers.Layer.Vector("Navteq", {
			attribution :"<div class=\"navteqCopyright\"></div>"
		}));
		dashMap1.addControl(new OpenLayers.Control.Attribution());
		/*shaded1 = new OpenLayers.Layer.TMS("Navteq", navteqUrlArr, {
			numZoomLevels :18,
			baseLayer :true,
			type :'png',
			transitionEffect :'resize',
			displayOutsideMaxExtent :true,
			getURL :quadkey_getTileURLStreet
		}, {
			'buffer' :4
		});*/

		/*dashMap1.addLayer(shaded1);

		dashMap1MarkerLayer = new OpenLayers.Layer.Markers("dashMap1MarkerLayer", {
			displayInLayerSwitcher :false
		});
		dashMap1.addLayer(dashMap1MarkerLayer);

		var point2 = new OpenLayers.LonLat(userSessionLon, userSessionLat);
		point2.transform(proj4326, proj900913);// for sphericalMercator
		dashMap1.setCenter(point2, 5);
		dashMap1MarkerManager = new LbasMarkerManger(dashMap1, dashMap1MarkerLayer, null);

		var options3 = {
			controls : [ new OpenLayers.Control.PanZoomBar(), new OpenLayers.Control.Navigation() ],
			projection :new OpenLayers.Projection("EPSG:900913"),// for sphericalMercator
			displayProjection :new OpenLayers.Projection("EPSG:4326"),// for sphericalMercator
			units :"m",
			maxResolution :156543.0339,// for sphericalMercator
			maxExtent :new OpenLayers.Bounds(-20037508.34, -20037508.34,// for sphericalMercator
					20037508.34, 20037508.34)
		// for sphericalMercator

		};

		var myNavControl3 = new OpenLayers.Control.Navigation( {
			handleRightClicks :false
		});

		dashMap2 = new OpenLayers.Map('dashMap2', options3);
		dashMap2.addControl(new OpenLayers.Control.PanZoomBar());
		dashMap2.addControl(myNavControl3);
		dashMap2.addLayer(new OpenLayers.Layer.Vector("Navteq", {
			attribution :"<div class=\"navteqCopyright\"></div>"
		}));
		dashMap2.addControl(new OpenLayers.Control.Attribution());
		/*shaded2 = new OpenLayers.Layer.TMS("Navteq", navteqUrlArr, {
			numZoomLevels :18,
			baseLayer :true,
			type :'png',
			transitionEffect :'resize',
			displayOutsideMaxExtent :true,
			getURL :quadkey_getTileURLStreet
		}, {
			'buffer' :4
		});*/

		/*dashMap2.addLayer(shaded2);

		dashMap2MarkerLayer = new OpenLayers.Layer.Markers("dashMap2MarkerLayer", {
			displayInLayerSwitcher :false
		});
		dashMap2.addLayer(dashMap2MarkerLayer);

		var point3 = new OpenLayers.LonLat(userSessionLon, userSessionLat);
		point3.transform(proj4326, proj900913);// for sphericalMercator
		dashMap2.setCenter(point3, 5);
		dashMap2MarkerManager = new LbasMarkerManger(dashMap2, dashMap2MarkerLayer, null);
		displayCategoryPanelLocations();
		showUsersAroundOnMap(dashMap1MarkerManager, dashMap1, null, null, 20, false, 'userLocationTooltip2Template');*/

		initMainMap();

	} catch (e) {

		alert(e.message);

	}
}

function initMainMap(elementId) {
    
  if(elementId) {
		var mapOptions = {
          center: new google.maps.LatLng(45.7716, 9.0009 ),
          zoom: 6,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          streetViewControl: false,
          minZoom:2,
          scaleControl: true
        };
        map = new google.maps.Map(document.getElementById('rightMapWrapper'), mapOptions);
		loginNavteq();

		google.maps.event.addListener(map, 'rightclick', function(event) {
			event.stop();
			var latlng = event.latLng;

            $("#SavePlace").unbind("click").click(function(){
                openSaveLocationDialogFromLatLon($.i18n.prop("tooltip.savePlace"), latlng.lat(), latlng.lng());
            });
            
            $("#RouteFrom").unbind("click").click(function(){
                leftPanel.tabs.tabs('select', leftPanel.tabRoutes.id);
                setTimeout(function(){
          				geocoder.geocode({ 'latLng': latlng }, function( results, status ) {
                    if (status == google.maps.GeocoderStatus.OK) {
                      if ( results[0] ) {
          			        $('#routePointTable input[type=text]:first').val( results[0].formatted_address );
                        setRoutePoint(results[0].formatted_address, latlng.lat(), latlng.lng(), 0, false);
                      }
                    } else {
                      alert("Geocoder failed due to: " + status);
                    }
                  });
                }, 500)
            });    
           
           $("#RouteTo").unbind("click").click(function(){
           		leftPanel.tabs.tabs('select', leftPanel.tabRoutes.id);

				geocoder.geocode({ 'latLng': latlng }, function( results, status ) {
			      if (status == google.maps.GeocoderStatus.OK) {
			        if ( results[0] ) {
			        	$('#routePointTable input[type=text]:last').val( results[0].formatted_address );
			        	setRoutePoint(results[0].formatted_address, latlng.lat(), latlng.lng(), 1, false);
			        }
			      } else {
			        alert("Geocoder failed due to: " + status);
			      }
			    });
                
            });
            
            $("#ShowNearestUsers").unbind("click");
            $("#ShowNearestUsers").click(function(){
            	var addDetail = new Object();
            	addDetail.latitude = latlng.lat();
            	addDetail.longitude = latlng.lng();
                showNearestUsers(addDetail);
            });
            
            $("#PlanMeeting").unbind("click");
	        $("#PlanMeeting").click(function(){
	        	if(userConf.rights.create_meetings === false){
		        	return false;
	        	}
	        	
				geocoder.geocode({ 'latLng': latlng }, function( results, status ) {
			      if (status == google.maps.GeocoderStatus.OK) {
			        if ( results[0] ) {

			        	var location = results[0].formatted_address;
						var attendee = null;
						var from_map = true;
			
						var cm = new CalendarManager( $('#calendar-wrapper') );
						prepopulate = {};
						prepopulate.location = location;
						prepopulate.attendee = attendee;
						prepopulate.lat = latlng.lat();
						prepopulate.lng = latlng.lng();																	
						cm.createEventPopup(new Date(),new Date(), prepopulate, from_map);

			        }
			      } else {
			        alert("Geocoder failed due to: " + status);
			      }
			    });
	        });
            
            $('#menuMap').css({
                top: event.pixel.y + 'px',
                left: event.pixel.x + 'px'
            }).show();
		});
	}

}

function initPrintMap(method) {

	var mapOptions = {
	          center: new google.maps.LatLng(45.7716, 9.0009 ),
	          zoom: 6,
	          mapTypeId: google.maps.MapTypeId.ROADMAP,
	          mapTypeControl: false,
	          streetViewControl: false
    };
    map = new google.maps.Map(document.getElementById('printMap'), mapOptions);
	mainMarkerManager = new LbasMarkerManger(map);

	if ( method == 'route') {

		displayDirections = new google.maps.DirectionsRenderer({
			suppressMarkers : true,
			map: map
		});
		displayDirections.setPanel(document.getElementById("routeDirections"));

		var travelMode        = google.maps.TravelMode.DRIVING,
			durationInTraffic = window.opener.jQuery('#routingTrafficEnableCheck').attr('checked') == 'checked';

		if ( window.opener.jQuery('#routingTypes li.selected a').attr('key') == 'pedestrian' )
			travelMode = google.maps.TravelMode.WALKING;

		var waypoints = [];
		if ( window.opener.jQuery('#routePointTable input[type=text]').length > 2 ) {
			window.opener.jQuery('#routePointTable input[type=text]:not(:first,:last)').each(function() {
				waypoints.push({
					location: $(this).val(),
					stopover: true
				});
			});
		}

		var routeFrom = window.opener.jQuery('#routePointTable input[type=text]:first').val(),
			routeTo   = window.opener.jQuery('#routePointTable input[type=text]:last').val();

		var request = {
			origin: routeFrom,
			destination: routeTo,
			travelMode: travelMode,
			waypoints: waypoints,
			durationInTraffic: durationInTraffic
		};

		var letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];

		var direction = new google.maps.DirectionsService().route(request, function(result, status) {
			if ( status == google.maps.DirectionsStatus.OK ) {
				$('#routeDirections').html('');
				displayDirections.setDirections(result);

				var myRoute = result.routes[0];
				GMapsHelper.routeMarkers(myRoute);

	  			var duration = 0, distance = 0;
	  			$(displayDirections.directions.routes).each(function( index, route ){
	  				$(route.legs).each(function( idLeg, leg ){
						duration += leg.duration.value;
						distance += leg.distance.value;
	  				});
	  			});

				setTimeout(function(){
					$('#routeDirections table.adp-directions > tbody > tr:even').addClass('grey');
					var i = 0;
					$('.adp-placemark img').each(function() {
						$(this).attr('src', '../images/pin_route_' + letters[i] + '.png');
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

					$('#routeDirections .adp-summary').each(function(id, el) {
						if ( id > 0 )
							$(this).remove();
					});

				}, 1);
			}
		});

	} else {

		var printLineFeatures = [];
		var opts = window.opener.routeLayerForLocationReportInfo;

		for ( var i = 0; i < opts.length; i++) {
			opts[i].map = map;
			var path = [];
			for ( xx in opts[i].path ) {
				path.push( new google.maps.LatLng( opts[i].path[xx].lat(), opts[i].path[xx].lng() ) );
			}
			opts[i].path = path;
			new google.maps.Polyline( opts[i] );
		}

		for ( i in window.opener.mainMarkerManager.markers ) {
			if ( i[0] == 'l' ) {
				var opts = window.opener.mainMarkerManager.markers[i].markerOpts;
				opts.icon = '../' + opts.icon;
				opts.hasTooltip = false;
				mainMarkerManager.createMarker(opts);
			}
		}
		adjustZoomLevelBoundsBox(mainMarkerManager, map);
	}
}

function clearMapClicked() {

	mainMarkerManager.removeAllMarkers();

	routeMarkers = [];
	for ( var x = 0; x < routeLayerForLocationReport.length; x++) {
		routeLayerForLocationReport[x].setMap();
	}

	if ( displayDirections !== false ){
		displayDirections.setMap();
		}
	$('#locReportTableDiv .closeReport').click();
	$('#locReportListDiv').parent().hide().remove();
}

function myLocationClicked() {
	//locateUser(currentUser, true);
	var data = {fullName: userFullName, user_id: currentUser};
	var fromLocateMeButton = true;
	data.permissions = {locatable: true};
	user && user.locate(data, true, true, fromLocateMeButton);

	//user && user.locate(currentUser, true, false);
}

String.prototype.compareColor = function() {
	if ((this.indexOf("#") != -1 && arguments[0].indexOf("#") != -1) || (this.indexOf("rgb") != -1 && arguments[0].indexOf("rgb") != -1)) {
		return this.toLowerCase() == arguments[0].toLowerCase();
	} else {
		xCol_1 = this;
		xCol_2 = arguments[0];
		if (xCol_1.indexOf("#") != -1)
			xCol_1 = xCol_1.toRGBcolor();
		if (xCol_2.indexOf("#") != -1)
			xCol_2 = xCol_2.toRGBcolor();
		return xCol_1.toLowerCase() == xCol_2.toLowerCase();
	}
};

String.prototype.toRGBcolor = function() {
	varR = parseInt(this.substring(1, 3), 16);
	varG = parseInt(this.substring(3, 5), 16);
	varB = parseInt(this.substring(5, 7), 16);
	return "rgb(" + varR + ", " + varG + ", " + varB + ")";
};


function setActiveMapBtn(btn) {
	


  $('#btn_map_hybrid, #btn_map_satellite, #btn_map_street').removeClass('active')
	btn.toggleClass('active');
/*   btn.addClass('active'); */

}


function trafficButtonClicked() {
	$('#btn_map_traffic').toggleClass('active');
/*   setActiveMapBtn($('#btn_map_traffic')); */

  	localize && localize.traficLegend();

	if(isTrafficVisible){
		trafficMapTransparent.setMap();
		$('#right #legend').slideUp();
	}else{
		trafficMapTransparent.setMap( map );
		$('#right #legend').slideDown();
	}
	isTrafficVisible = !isTrafficVisible;

	
	$('#right #legend #openCloseLegend').on('click', function(){
		$('#right #legend ul').slideToggle();
		return false;
	});
/*
	Free Flowing	#09A408
	Sluggish		#FCCB04
	Slow/Stopped	#E42D1D
	Closed			#000000
*/


	/*
	if ($('.trafficItemInactive').css('background-color').compareColor('#C2C2C2')) {

		$('.trafficItemInactive').css('background-color', '#3F3F3F');
		trafficMapTransparent.setVisibility(true);
		$('.trafficItemInactive').html(parseTemplate("trafficInfoTemplate", {}));

	} else if ($('.trafficItemInactive').css('background-color').compareColor('#3F3F3F')) {

		$('.trafficItemInactive').css('background-color', '#C2C2C2');
		trafficMapTransparent.setVisibility(false);
		$('.trafficItemInactive').html("<span class='lm' key='welcome.Traffic'>" + $.i18n.prop('welcome.Traffic') + "</span>");
	}
	*/
}

function usersMapButtonClicked() {

	if ($('.usersItemInactive').css('background-color').compareColor('#C2C2C2')) {
		$('.usersItemInactive').css('background-color', '#3F3F3F');
		showUsersAroundOnMap(mainMarkerManager, map, map.getCenter().lat(), map.getCenter().lng(), 20, true, 'userLocationTooltip3Template');
	} else if ($('.usersItemInactive').css('background-color').compareColor('#3F3F3F')) {
		$('.usersItemInactive').css('background-color', '#C2C2C2');
		mainMarkerManager.removeAllMarkers();
	}
}

function showNearestUsers(usr) {
	var btns = {};
 	
	btns[$.i18n.prop('buttons.cancel')] = function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
	};
	btns[$.i18n.prop('buttons.show')] = function() {

		showUsersAroundOnMap(mainMarkerManager, map, null, null, $('#nearestUsersDialog > select >option:selected').val(), true, null, usr);
		$(this).dialog('close');
		$(this).dialog('destroy');
	};

	var content = $('<div></div>').load('pages/template/nearestUsersDialogTemplate.html', function(){
		localize && localize.nearestUserDialogTemplate();
	});

	utils && utils.dialog({
		title: $.i18n.prop('nearestUsers.dialog.title'), 
		content: content, 
		buttons: btns 
	});
	
	//hide close button
	$('.ui-dialog-titlebar-close').hide(); 
	//buttons style
	$('.ui-dialog-buttonset button').eq(0).addClass('cancel');
	$('.ui-dialog-buttonset button').eq(1).removeClass('multi_user_button').addClass('show purple_button');
	
}

function hybridMapButtonClicked() {
	setActiveMapBtn($('#btn_map_hybrid'));
	map.setMapTypeId( google.maps.MapTypeId.HYBRID );
}

function satelliteMapButtonClicked() {
	setActiveMapBtn($('#btn_map_satellite'));
	map.setMapTypeId( google.maps.MapTypeId.SATELLITE );
}

function streetMapButtonClicked() {
	setActiveMapBtn($('#btn_map_street'));
	map.setMapTypeId( google.maps.MapTypeId.ROADMAP );
}

/* to be removed
function mapRightClickHandler(evt) {
	var lonlat = map.getLonLatFromPixel(evt.xy);
	lonlat.transform(proj900913, proj4326);
	// lonlat.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));// for sphericalMercator
	selectedLat = lonlat.lat;
	selectedLon = lonlat.lon;
}
OpenLayers.Control.PanZoomBar.prototype.draw = function(elementId, px) {
	// initialize our internal div
	var pos = new OpenLayers.Pixel(25, -20);
	this.position = pos;
	OpenLayers.Control.prototype.draw.apply(this, arguments);
	px = this.position.clone();

	// place the controls
	this.buttons = [];

	var sz = new OpenLayers.Size(18, 18);
	var centered = new OpenLayers.Pixel(px.x + sz.w / 2, px.y);
	var wposition = sz.w;

	if (this.zoomWorldIcon) {
		centered = new OpenLayers.Pixel(px.x + sz.w, px.y);
	}

	this._addButton("panup", "north-mini.png", centered, sz);
	px.y = centered.y + sz.h;
	this._addButton("panleft", "west-mini.png", px, sz);
	if (this.zoomWorldIcon) {
		this._addButton("zoomworld", "zoom-world-mini.png", px.add(sz.w, 0), sz);

		wposition *= 2;
	}
	this._addButton("panright", "east-mini.png", px.add(wposition, 0), sz);
	this._addButton("pandown", "south-mini.png", centered.add(0, sz.h * 2), sz);
	this._addButton("zoomin", "zoom-plus-mini.png", centered.add(0, sz.h * 3 + 5), sz);
	centered = this._addZoomBar(centered.add(0, sz.h * 4 + 5));
	this._addButton("zoomout", "zoom-minus-mini.png", centered, sz);
	// alert(this.div.style.left);
	if (this.map.div.id == elementId) {
		if ($('#left').is(':visible')) {
			this.div.style.left = "280px";
		} else {
			this.div.style.left = "4px";
		}
	}
	return this.div;
};

OpenLayers.Control.Panel.prototype.activateControl = function(control) {
	if (!this.active) {
		return false;
	}
	if (control.type == OpenLayers.Control.TYPE_BUTTON) {
		control.trigger();
		// this.redraw();
		return;
	}
	if (control.type == OpenLayers.Control.TYPE_TOGGLE) {
		if (control.active) {
			control.deactivate();
		} else {
			control.activate();
		}
		this.redraw();
		return;
	}
	for ( var i = 0, len = this.controls.length; i < len; i++) {
		if (this.controls[i] != control) {
			if (this.controls[i].type != OpenLayers.Control.TYPE_TOGGLE) {
				this.controls[i].deactivate();
			}
		}
	}
	control.activate();
};

OpenLayers.Control.Navigation.prototype.wheelUp = function(evt, delta) {

	this.map.zoomIn();
	// this.map.setCenter( this.map.getCenter(), this.map.getZoom()+1);
	OpenLayers.Event.stop(evt);

};

OpenLayers.Control.Navigation.prototype.wheelDown = function(evt, delta) {

	this.map.zoomOut();
	// this.map.setCenter( this.map.getCenter(), this.map.getZoom()-1);
	OpenLayers.Event.stop(evt);

};*/

/*to be removed
OpenLayers.Layer.TMS.prototype.getZoomForExtent = function(extent, closest) {

	var viewSize = this.map.getSize();
	var width = viewSize.w;
	var height = viewSize.h;

	if ($('#left').is(':visible') && this.map.div.id == 'right') {
		width = width - 560;
		height = height - 240;
	}

	var idealResolution = Math.max(extent.getWidth() / width, extent.getHeight() / height);

	return this.getZoomForResolution(idealResolution, closest);

};
OpenLayers.Layer.VirtualEarth.prototype.getZoomForExtent = function(extent, closest) {

	var viewSize = this.map.getSize();
	var width = viewSize.w;
	var height = viewSize.h;

	if ($('#left').is(':visible') && this.map.div.id == 'right') {
		width = width - 560;
		height = height - 240;
	}

	var idealResolution = Math.max(extent.getWidth() / width, extent.getHeight() / height);

	return this.getZoomForResolution(idealResolution, closest);

};*/
