var ROUTE_POINTS_ZINDEX = 100;
var ROUTE_MARKERS_ZINDEX = ROUTE_POINTS_ZINDEX + 1;
var routeStyle = GMapsHelper.getVectorStyle();
var range_group= 200;
var range_closest= 100;
var last_located_id;
var allCircles = {};
routeStyle.strokeColor = "#000088";
routeStyle.strokeWidth = 4;
routeStyle.cursor = "pointer";
routeStyle.graphicZIndex = ROUTE_POINTS_ZINDEX;

MarkerDefaults = { // Default values for Marker
    id: '',
    latitude: '',
    longitude: '',
    icon:'images/pin_user.png', // Default marker icon
    iconWidth: 29, // Default marker icon width
    iconHeight: 39, // Default marker icon height
    radius: 0, // Default radius is 0
    definitionCircle:50,
    radiusColor: "#FF0000", // Default color of circle
    hasTooltip: true,
    staticContent: true,// no action and template related to this marker contentHtml must be set
    contentHtml: '',// if static tooltip content this must be set
    actionPath: '',// action for retrieving tooltip data in json format
    actionParams: {},// action parameters
    templateId: '',// template for creating tooltip content with json
    forceToOpen: false,// to open tooltip when adding marker
    leaveOthersOpen: false,// if you want open multi tooltip at the same time set it true
    history: true,
    setZoomLevel: true,
    border: 6,
    isGrouped:false,
    idGroup:null,
    type :''
};

MarkerGroupDefaults = { // Default values for Marker
    id: '',
    latitude: '',
    longitude: '',
    icon: 'images/pin_multiple_users.png', // Default marker icon
    iconWidth: 45, // Default marker icon width
    iconHeight: 50, // Default marker icon height
    radius: 0, // Default radius is 0
    radiusColor: "#FF0000", // Default color of circle
    hasTooltip: true,
    definitionCircle:50,
    staticContent: true,// no action and template related to this marker contentHtml must be set
    contentHtml: '',// if static tooltip content this must be set
    actionPath: '',// action for retrieving tooltip data in json format
    actionParams: {},// action parameters
    templateId: '',// template for creating tooltip content with json
    forceToOpen: true,// to open tooltip when adding marker
    leaveOthersOpen: false,// if you want open multi tooltip at the same time set it true
    history: false,
    setZoomLevel: true,
    border: 6,
    type :'',
    groupType:''
    };
function LbasMarkerManger(mp, layer, crcLayer) {
	this.mainMap = mp;
	this.markerLayer = layer;
	this.circleLayer = crcLayer;
	this.markers = new Object();
    this.groupmarkers = new Object();
	this.openMarkers = new Array();
	this.neighbours = new Object();

	LbasMarkerManger.prototype.removeMarker = function(id) {
		var markerObject = this.markers[id];
		if (markerObject) {
			if (markerObject.circle) {
				markerObject.circle.setMap();
            	if ( allCircles[id] != undefined )
            		delete allCircles[id];
			}
			if (markerObject.feature != null && markerObject.feature.popup != null) {
				markerObject.feature.popup.close();
			}
			// markerObject.feature.marker.destroy();
			if (markerObject.feature != null) {
				markerObject.feature.setMap();
			}
			for ( var i = 0; i < this.openMarkers.length; i++) {
				if (this.openMarkers[i] == id) {
					delete this.openMarkers[i];
				}
			}
			delete this.markers[id];
			delete this.neighbours[id];
			for (var key in this.neighbours) {
				var neighbourList = this.neighbours[key];
				for ( var x = 0; x < neighbourList.length; x++) {
					if (neighbourList[x] == id) {
						neighbourList.splice(x, 1);
					}
				}
			}
		}
	};
	
	
	LbasMarkerManger.prototype.getTotallMarkers = function() {
        //destroy icon groups
    var counter=0
    for (id in this.markers) {
      counter++;
    }
    return counter;
  };
	LbasMarkerManger.prototype.removeAllMarkers = function() {
        //destroy icon groups
        this.removeAllGroupUserMarkers();
		for (id in this.markers) {
			this.removeMarker(id);
		}
		//this.markerLayer.clearMarkers();
		if (this.circleLayer != undefined) {
			this.circleLayer.destroyFeatures();
		}
		this.markers = new Array();
		this.openMarkers = new Array();
		this.hideClearMapButton();
		this.neighbours = new Object();
	};
	LbasMarkerManger.prototype.removeUserMarkers = function() {
		for (id in this.markers) {
			if (id[0] == "u") {
				this.removeMarker(id);
			}
		}
	};
	LbasMarkerManger.prototype.showClearMapButton = function() {
		if (!$('.clearMapItemInactive').is(':visible')) {
			$('.clearMapItemInactive').show();
		}
	};
	LbasMarkerManger.prototype.hideClearMapButton = function() {
		if ($('.clearMapItemInactive').is(':visible')) {
			$('.clearMapItemInactive').hide();
		}
	};
	
	LbasMarkerManger.prototype.createMarker = function(lbasMarker, locateNeighbours, fromCalendar) {
	    //delete group existent
	    this.removeAllGroupUserMarkers();
		var isMarkerPresent = this.markers[lbasMarker.id];
		if(isMarkerPresent){
			this.removeMarker(lbasMarker.id);
		} else if(lbasMarker.id.indexOf('multiple')!==-1){
			var markerID = (lbasMarker.id+'').replace('multiple', 'u');
			isMarkerPresent =  this.markers[markerID];
			if(isMarkerPresent)
				this.removeMarker(markerID);
		}
		var markerOpts = jQuery.extend(false, MarkerDefaults, lbasMarker);
		var markerCoords = new google.maps.LatLng(markerOpts.latitude, markerOpts.longitude);
    var feature = new google.maps.Marker({
        position: markerCoords,
        map: map,
        icon: markerOpts.icon
    });

		if (markerOpts.id == '') {
			var currentTime = new Date().getTime();
			var str = currentTime.toString();
			feature.id = str.substring(str.length - 9, str.length);
			markerOpts.id = feature.id;
		} else {
			feature.id = markerOpts.id;
		}
        last_located_id =markerOpts.id;

		var circle;
		if (markerOpts.radius > 0) {

		    var coordCircle = markerCoords.lat() + markerCoords.lng();
		    var foundKeys = Object.keys(allCircles).filter(function(key) {
			    return allCircles[key] == coordCircle;
			});
			if ( foundKeys.length == 0) {

			    var options = {
			      strokeColor: markerOpts.radiusColor,
			      strokeOpacity: .3,
			      strokeWeight: 1,
			      fillColor: markerOpts.radiusColor,
			      fillOpacity: .1,
			      map: map,
			      center: markerCoords,
			      radius: markerOpts.radius / 2
			    };
			    circle = new google.maps.Circle(options);
		    	allCircles[feature.id] = coordCircle;	
			}

		}
		this.markers[feature.id] = {
			feature: feature,
			markerOpts: markerOpts,
			circle: circle
		};
		if (markerOpts.hasTooltip) {
	        this.markerClickHandler(feature);
	        google.maps.event.addListener(feature, 'click', function() {
		        var toView = false;
				if ( !feature.popup.isViewed ) 
					toView = true;

				this.closeAllTooltip();
				if ( toView ) {
					feature.popup.open(map, feature);
					feature.popup.isViewed = true;
				}
	        }.bind(this));
		}
		
		//if (this.getTotallMarkers() == 1 ) {
  		if (markerOpts.hasTooltip && markerOpts.forceToOpen) {
  			google.maps.event.trigger( feature, "click" );
  		} 
		/*} else {
        	this.resetOpenMarkers();
     	}*/
     	

		if (markerOpts.history) {
			if (markerOpts.address != undefined && markerOpts.address.length > 1) {
				var options = {};
				options.data = {
					address: markerOpts.address == null ? "" : markerOpts.address,
					latitude: markerOpts.latitude,
					longitude: markerOpts.longitude
				};
				options.async = true;
				//LOCALE: utils && utils.lbasDoPost('saveToRecentHistory.action', options);
			}
		}
		
		
		if(!$.browser.mozilla ){
	  		if (typeof fromCalendar != 'undefined' && fromCalendar) {
	    		$('#'+ markerOpts.id +"_popup").css({'height':'200px', 'width':'376px', 'marginTop':'-155px'});
	    		$('#'+ markerOpts.id +"_popup_contentDiv").css({'width':'350px', 'height':'200px'});
	    		$('#'+ markerOpts.id +"_FrameDecorationDiv_0").css({'width':'354px', 'height':'150px'});
	    		$('#'+ markerOpts.id +"_FrameDecorationDiv_1").css({'height':'149px'});				
	    		$('#'+ markerOpts.id +"_FrameDecorationDiv_2").css({'width':'354px'});
	    		
	    		if ($.browser.version == "8.0" || $.browser.version == "7.0"){
	      			$('#'+ markerOpts.id +"_popup").css({'marginTop':-20})
	    		}
	  		}
	    }
		

		// if coming marker is a user marker, then find the markers closer to each other
		if (markerOpts.id[0] == "u" && markerOpts.icon != "images/people_aqua-01.png") {
			// add each marker to its own neighbor list
			var neighbourList = [];
			neighbourList.push({
				feature: feature,
				markerOpts: markerOpts,
				circle: circle
			});

			this.neighbours[markerOpts.id] = neighbourList;
			if(locateNeighbours) {
  				this.getCloserUsersPoints(this.markers[markerOpts.id]);
  			}
		}
	    //crea
		return feature.id;
	};

  LbasMarkerManger.prototype.resetOpenMarkers = function (id){
        //se aperte vengono chiuse
        var cleaned = false;
        for ( var i = 0; i < this.openMarkers.length; i++) {
            var omID = this.openMarkers[i];
            if (omID == undefined || omID == null ) {
                // cleaned = true;
            } else  if (omID != id) {
                //this.markers[this.openMarkers[i]].feature.popup.toggle();
                var marker_obj = this.markers[omID];
                var marker_group_obj = this.groupmarkers[omID];
                if(marker_obj != undefined && marker_obj != null) {
                    marker_obj.feature.popup.close();
                    clearTimeout(marker_obj.feature.popup_timeout);
                    clearTimeout(marker_obj.feature.delayToggleTimeout);
                    cleaned = true;
                } else if (marker_group_obj != undefined && marker_group_obj != null ) {
                    marker_group_obj.feature.popup.close();
                    clearTimeout(marker_group_obj.feature.popup_timeout);
                    clearTimeout(marker_obj.feature.delayToggleTimeout);
                    cleaned = true;
                }
                //this.markers[this.openMarkers[i]].feature.popup.toggle();
            }
        }
        if (cleaned) {
            this.openMarkers = new Array();
        }
    };
  
	LbasMarkerManger.prototype.markerClickHandler = function(feature) {
		try {
			var marker     = this.markers[feature.id],
				markerOpts = marker.markerOpts;

			if (!markerOpts.leaveOthersOpen) {
        		this.resetOpenMarkers(feature.id);
			}

			if (feature.popup == null) {
				var boxClass = 'infoBox', maxWidth = 456;
				if ( markerOpts.littleTooltip != undefined && markerOpts.littleTooltip ) {
					boxClass = 'infoBoxLittle';
					maxWidth = 256;
				}

			  	feature.popup = new InfoBox({ // INITIALLY: google.maps.InfoWindow
		          maxWidth: maxWidth,/*Next wereadded for InfoBox*/
		          alignBottom: true,
		          closeBoxURL: '',
		          boxClass: boxClass
		        });
        
        		feature.popup.isViewed = false;
				if (markerOpts.staticContent) {
					feature.popup.setContent(markerOpts.contentHtml);
				} else {
					/*
					var mapType = 0;
					if (this.manager.mainMap.div.id == 'dashMap1') {
						mapType = 1;
					} else if (this.manager.mainMap.div.id == 'dashMap2') {
						mapType = 2;
					}
					*/

					$.ajax({
						url :markerOpts.actionPath,
						type :'POST',
						async :false,
						data :markerOpts.actionParams,
						dataType :'json',
						success :function(json) {
							if (checkResponseSuccess(json)) {
							  
								var ctHtml = parseTemplate(markerOpts.templateId, {
									json :json,
									markerId :markerOpts.id
								});
								popup.setContentHTML(ctHtml);
								if (markerOpts.history) {
									var adress = $('.content', ctHtml).html();
									if (adress.length > 1) {
										$.post("saveToRecentHistory.action", {
											address :adress == null ? "" : adress,
											latitude :markerOpts.latitude,
											longitude :markerOpts.longitude
										});
									}
								}
								/*if (mapType == 1) {
									dashMap1MarkerManager.mainMap.addPopup(popup);
								} else if (mapType == 2) {
									dashMap2MarkerManager.mainMap.addPopup(popup);
								} else {
									mainMarkerManager.mainMap.addPopup(popup);
								}*/

								$('.starRating_' + json.pois[0].id).html('');
								$('.starRating_' + json.pois[0].id).rater('updateRatePoi?poi.id=' + json.pois[0].id, {
									style :'small',
									curvalue :json.pois[0].rating
								});

							}
						}
					});
				}
			}
			this.openMarkers[this.openMarkers.length] = feature.id;
		} catch (e) {
			$.getJSON('reportError.action', {
				code :LBASErrorCodes.MARKER_OPERATION_FAILED,
				text :e.message
			}, function(json) {

			});
		}
	};

	LbasMarkerManger.prototype.closeAllTooltip = function(mId) {

		for (j in this.markers) {
			var ft=this.markers[j].feature.popup
			if (ft) {
				ft.setMap();
				ft.isViewed = false;
			}

			//this.closeTooltip(j);
		}
	};
	LbasMarkerManger.prototype.closeTooltip = function(mId, isGrouped) {
		if ( typeof(isGrouped) == 'undefined' )
			isGrouped = false;

		var obj_market = this.markers[mId];
		if ( typeof(obj_market) == 'undefined' )
			return;

        obj_market.feature.popup.setMap();
		obj_market.feature.popup.isViewed = false;
        if ( obj_market.markerOpts.isGrouped && !isGrouped ) {
            this.closeGroupTooltip(obj_market.markerOpts.idGroup);
        }
	};
	LbasMarkerManger.prototype.openTooltip = function(mId) {
	  var feature = this.markers[mId].feature;
	  this.closeAllTooltip();
      if (feature.popup == null) {
          feature.marker.events.triggerEvent("mousedown");
      } else {
        
        feature.popup.show();
      }  
        
  };
	
	
	
    LbasMarkerManger.prototype.closeGroupTooltip = function(mId) {
    	//mainMarkerManager.closeTooltip(mId, true);
    	google.maps.event.trigger( this.markers[mId].feature, "click" );
        /*if( this.groupmarkers[mId] != undefined) {
        	this.groupmarkers[mId].feature.marker.events.triggerEvent("mousedown");
        }*/
    };
	LbasMarkerManger.prototype.updateMarkerSize = function(markerId) {
		/*if (this.markers[markerId] != null && this.markers[markerId].feature && this.markers[markerId].feature.popup) {
			this.markers[markerId].feature.popup.updateSize();
		}*/
	};
	LbasMarkerManger.prototype.minimizePoiTooltip = function(markerId) {
		$('#pLng' + markerId).hide();
		$('#pSht' + markerId).show();
		$('.poiTooltipMaximizer').show();
		$('.poiTooltipMinimizer').hide();
		//this.markers[markerId].feature.popup.updateSize();
	};
	LbasMarkerManger.prototype.maximizePoiTooltip = function(markerId) {
		$('#pSht' + markerId).hide();
		$('#pLng' + markerId).show();
		$('.poiTooltipMinimizer').show();
		$('.poiTooltipMaximizer').hide();
		//this.markers[markerId].feature.popup.updateSize();
	};
	LbasMarkerManger.prototype.minimizeUserTooltip = function(markerId) {
		$('#userCDF' + markerId).hide();
		$('#userTooltipMaximizer').show();
		$('#userTooltipMinimizer').hide();
		//this.markers[markerId].feature.popup.updateSize();
	};
	LbasMarkerManger.prototype.maximizeUserTooltip = function(markerId) {
		$('#userCDF' + markerId).show();
		$('#userTooltipMinimizer').show();
		$('#userTooltipMaximizer').hide();
		//this.markers[markerId].feature.popup.updateSize();
	};
    LbasMarkerManger.prototype.getCloserUsersPoints = function(lbasMarker) {
        var userMarkers = [];
		// search for all markers on map
		for (obj in this.markers) {
            var obj_marker = this.markers[obj];
			if (obj_marker.markerOpts) {
				if (obj_marker.markerOpts.id) {
					if ((obj_marker.markerOpts.id[0] == "u" || obj_marker.markerOpts.id.indexOf("multiple") === 0)  && obj_marker.markerOpts.icon != "images/people_aqua-01.png")// get the user markers only
					{
						userMarkers.push({
							feature :obj_marker.feature,
							markerOpts :obj_marker.markerOpts,
							circle :obj_marker.circle
						});
					}
				}
			}
		}
		var point0 = new google.maps.LatLng(lbasMarker.markerOpts.latitude, lbasMarker.markerOpts.longitude);
		var found = false;
		for ( var x = 0; x < userMarkers.length; x++) {
			// find distance between new marker and existing markers on map
			if (lbasMarker.markerOpts.id != userMarkers[x].markerOpts.id && userMarkers[x].markerOpts.icon != "images/people_aqua-01.png") {
				var point1 = new google.maps.LatLng(userMarkers[x].markerOpts.latitude, userMarkers[x].markerOpts.longitude);
				var distance = distanceBetweenTwoPoints(point0.lat(), point0.lng(), point1.lat(), point1.lng());
				var neighbourList;
				if (distance <= range_closest) {
					found = false;
					neighbourList = this.neighbours[lbasMarker.markerOpts.id] || [];
					for ( var count = 0; neighbourList && count < neighbourList.length; count++) {
						if (neighbourList[count].markerOpts.id == userMarkers[x].markerOpts.id) {
							found = true;
							break;
						}
					}
					if (!found) {
						neighbourList.push({
							feature :userMarkers[x].feature,
							markerOpts :userMarkers[x].markerOpts,
							circle :userMarkers[x].circle
						});
					}
					// update neighbour list of new marker
					this.neighbours[lbasMarker.markerOpts.id] = neighbourList;

					// add new marker to the neighbor list of existing marker
					found = false;
					var neighbourListOfUserMarker = this.neighbours[userMarkers[x].markerOpts.id] || [];

					for ( var count = 0; count < neighbourListOfUserMarker.length; count++) {
						if (neighbourListOfUserMarker[count].markerOpts.id == lbasMarker.markerOpts.id) {
							found = true;
							break;
						}
					}
					if (!found) {
						neighbourListOfUserMarker.push({
							feature :lbasMarker.feature,
							markerOpts :lbasMarker.markerOpts,
							circle :lbasMarker.circle
						});
					}
					// update neighbour list of existing marker
					this.neighbours[userMarkers[x].markerOpts.id] = neighbourListOfUserMarker;
				}
			}
		}

		/*for ( var key in this.neighbours) {
			var neighbourList = this.neighbours[key];

			if (neighbourList.length > 1) {

				openCloserUsersDialog(neighbourList, 'closerUsersTemplate');
			}
			//else {
			//	$("#closerUsersLink" + key).css("display", "none");
			//}
		}

		openCloserUsersDialog(null, 'allCloserUsersTemplate');*/
	};


    /*******************************************************************************************/
    /*******************************************************************************************/
    /*******************************************************************************************/
    /*******************************************************************************************/
    /*******************************************************************************************/
    /*******************************************************************************************/
    /*******************************************************************************************/
    /* detect point near and create groups*/
    LbasMarkerManger.prototype.collapseCloserUsersPoints = function() {
        var collpasedGroup = [];
        var userMarkers = [];
        for (obj in this.markers) {
            var obj_marker = this.markers[obj];
            if (obj_marker.markerOpts) {
                if (obj_marker.markerOpts.id) {
                    userMarkers.push(obj_marker);
                }
            }
        }
        // search for all markers on map
        /*for (obj in this.markers) {
            var obj_marker = this.markers[obj];
            if (obj_marker.markerOpts) {
                if (obj_marker.markerOpts.id) {
                    if (obj_marker.markerOpts.id.indexOf("u") == 0 || obj_marker.markerOpts.id.indexOf("multiple") == 0)// get the user markers only
                    {
                        userMarkers.push({
                            feature :obj_marker.feature,
                            markerOpts :obj_marker.markerOpts,
                            circle :obj_marker.circle
                        });
                    }
                }
            }
        }*/
        /*for ( var i = 0; i < userMarkers.length; i++) {
            var obj_marker =userMarkers[i];
        }*/

        var collapsed_groups = [];
        var tot_markers=  userMarkers.length;
        //var ul = userMarkers.length;
        for ( var i = 0; i <  tot_markers; i++) {
            var seletced_obj = userMarkers[i];
            if(seletced_obj) {
                var counter_markers = i
                var ifCreatedNewGroup= false
                var newgroup = [];

                for ( var k = 0; k <  tot_markers; k++) {
                    var current_point = userMarkers[k];
                    if(current_point) {
                        if(seletced_obj.markerOpts.id != current_point.markerOpts.id) {
                            var markeropts_selected = seletced_obj.markerOpts;
                            var markeropts_current = current_point.markerOpts;
                            var coordinate_point_selected = new google.maps.LatLng(markeropts_selected.latitude, markeropts_selected.longitude);
                            var coordinate_point_cycle = new google.maps.LatLng(markeropts_current.latitude, markeropts_current.longitude);
                            var distance = distanceBetweenTwoPoints(coordinate_point_selected.lat(), coordinate_point_selected.lng(), coordinate_point_cycle.lat(), coordinate_point_cycle.lng());

                            if(distance < range_group) {
                                if (!ifCreatedNewGroup) {
                                    collapsed_groups.push(newgroup);
                                }
                                if(k<i) counter_markers-=1;

                                if ( userMarkers[k].markerOpts.idGroup == undefined ) 
                                	newgroup.push(userMarkers[k]);

                                userMarkers[k] = null;
                                //userMarkers.splice(k,1);
                                ifCreatedNewGroup = true;
                            }
                        }
                    }
                }
                if(ifCreatedNewGroup) {

                    if ( userMarkers[counter_markers].markerOpts.idGroup == undefined ) 
                    	newgroup.push(userMarkers[counter_markers]);
                      userMarkers[counter_markers] = null;
                    //userMarkers.splice(counter_markers,1);
                    i--;
                }
            }
        }
        //test one group reference
        /***************************************************/
        /*var newgroup= []
         newgroup.push(userMarkers[0])
         group_created.push(newgroup);*/

        //funzione per raggruppare i pin
        /***************************************************/
        this.creteCollapsedGroup(collapsed_groups);
        return;
    };
    LbasMarkerManger.prototype.creteCollapsedGroup = function(collpasedGroup) {
        for ( var k = 0; k < collpasedGroup.length; k++) {
            var group_obj = collpasedGroup[k];
            this.createSingleGroupMarker(group_obj);
        }
    }
    LbasMarkerManger.prototype.createSingleGroupMarker = function(itemsMarkerArray) {
      
        //hide pin part of group
        /*****************************************************/
        if(itemsMarkerArray.length ==0) return;
        var currentTime = new Date().getTime();
        var str = currentTime.toString();
        var id_group = str.substring(str.length - 9, str.length);
        var tot_groups = itemsMarkerArray.length;
        var string_idmarkers='';
        var icon_group='';
        for ( var i = 0; i < tot_groups; i++) {
            var obj_itemmarker = itemsMarkerArray[i];
            var icon_type=(String(obj_itemmarker.markerOpts.icon).indexOf('asset') != -1 ) ? "images/pin_multiple_assets.png":"images/pin_multiple_users.png";
            if (icon_group == icon_type) {
            } else {
              if(icon_group.length==0) {
                icon_group=icon_type;
              } else {
                icon_group="images/pin_multiple_mix.png"
              }
            }
            var obj_markerOpts = obj_itemmarker.markerOpts;
            var obj_feature = obj_itemmarker.feature;
            var item_popup = obj_feature.popup;

            if ( obj_markerOpts.icon == "images/people_aqua-01.png" )
            	return;

            obj_markerOpts.isGrouped = true;
            obj_markerOpts.idGroup = id_group;

            //nascondo pin
            obj_feature.setVisible(false);

            if (obj_itemmarker.circle) {
            	obj_itemmarker.circle.setMap();
            	if ( allCircles[i] != undefined )
            		delete allCircles[i];
            }

            //hide openpopup
            clearTimeout(obj_feature.popup_timeout);

            //all popup on the same position
            if (item_popup != null) {
                item_popup.hide();
            }
            string_idmarkers += "_" +obj_feature.id;
        }

        var lbasMarker = itemsMarkerArray[0].markerOpts;
        /*lbasMarker.icon = MarkerGroupDefaults.icon;*/
        lbasMarker.icon = icon_group;
        lbasMarker.iconWidth =MarkerGroupDefaults.iconWidth;
        lbasMarker.iconHeight =MarkerGroupDefaults.iconHeight;

        var markerOpts = jQuery.extend(false, MarkerGroupDefaults, lbasMarker);

        var lonLat = new google.maps.LatLng(markerOpts.longitude, markerOpts.latitude);

        markerOpts.id = id_group;
		markerOpts.hasTooltip = true;
		markerOpts.staticContent = true;

		var tooltipId = 'groupTooltip' + id_group;
        markerOpts.contentHtml = parseTemplate('closerUsersTemplate', {
	        neighbourList: itemsMarkerArray,
	        tooltipId: tooltipId
	    });
		var featureId = mainMarkerManager.createMarker(markerOpts, false);

        google.maps.event.addListener(mainMarkerManager.markers[featureId].feature.popup, 'domready', function() {

			$('#btn_tooltip_close_group_' + tooltipId).off();
			$('#btn_tooltip_close_group_' + tooltipId).on('click' ,function(e) {
				e.preventDefault();
				mainMarkerManager.closeTooltip(featureId, true);
			});
			$('#tooltipContainer' + tooltipId + ' .viewGroupTooltipUser').off();
			$('#tooltipContainer' + tooltipId + ' .viewGroupTooltipUser').on('click' ,function(e) {
				e.preventDefault();
				mainMarkerManager.openItemGroupPopUp(featureId, $(e.target).closest('a').attr('data-id'));
			});

        });

    };

    LbasMarkerManger.prototype.openItemGroupPopUp = function(group_id, item_id) {
        this.closeGroupTooltip(group_id);
        this.markers[item_id].feature.popup.show();
        google.maps.event.trigger( this.markers[item_id].feature, "click" );
    }
    LbasMarkerManger.prototype.removeAllGroupUserMarkers = function() {
        for (id in this.groupmarkers) {
            this.removeGroupMarker(id);
        }
    };
    LbasMarkerManger.prototype.removeGroupMarker = function(id) {
        var markerObject = this.groupmarkers[id];
        if (markerObject) {
            if (markerObject.circle) {
                markerObject.circle.destroy();
            }
            if (markerObject.feature != null && markerObject.feature.popup != null) {
                clearTimeout(markerObject.feature.popup_timeout);
                markerObject.feature.popup.destroy();
            }
            // markerObject.feature.marker.destroy();
            if (markerObject.feature != null && markerObject.feature.marker != null) {
                this.markerLayer.removeMarker(markerObject.feature.marker);
            }
            for ( var i = 0; i < this.openMarkers.length; i++) {
                if (this.openMarkers[i] == id) {
                    delete this.openMarkers[i];
                }
            }
            delete this.groupmarkers[id];
        }
    };
    LbasMarkerManger.prototype.markerGroupClickHandler = function(evt) {
    
        try {
            var id = this.marker.id;
            var ref_group = this.manager.groupmarkers[id];
            var feature = ref_group.feature;
            var markerOpts = ref_group.markerOpts;

            if (!markerOpts.leaveOthersOpen) {
                this.manager.resetOpenMarkers(id);
            }
            if (feature.popup == null) {
                //build popup
                popup = ref_group.feature.createPopup(false);// param for closebox
                popup.id = id;
                popup.panMapIfOutOfView = true;
                popup.keepInMap = true;

                // Force the popup to always open to the top-right
                popup.calculateRelativePosition = function () {
                    return 'tr';
                }
                var list_html ="<div class='contents contents-list-grouped'><ul class='users'>";
                /*****************************************************************/
                //build output on popup
                /*****************************************************************/
                var tp = ref_group.itemsmarker.length;
                var title_popup=tp + " people in this location";
                for(var k=0; k < tp; k++) {
                    var obj_itemmarker = ref_group.itemsmarker[k];
                    var obj_markerOpts = obj_itemmarker.markerOpts;
                    var obj_feature = obj_itemmarker.feature;
                    var item_popup = obj_feature.popup;
                    //get name from popup
                    var nm= $(".toolTipLeft", '#'+ obj_markerOpts.id +"_popup_contentDiv").html();
                    //list_html+='<li><a href="javascript:void(0);" onclick=mainMarkerManager.openItemGroupPopUp(\"' + id +'\",\"'+obj_markerOpts.id+'\")>'+nm +'</a></li>';
                    list_html+='<li><div class="usersList groupElement"><div class="container">';
                    list_html+='<span class="name-item">'+nm +'</span><a href="javascript:void(0);" class="globalSearchButton" onclick=mainMarkerManager.openItemGroupPopUp(\"' + id +'\",\"'+obj_markerOpts.id+'\")><span class="globalSearchText locationAvailableRight">Show</span></a>';
                    list_html+='</div></div></li>';
                }
                //debug mode
                /*for(var k=0; k < 10; k++) {
                    list_html+=list_html
                }*/

                list_html +="</ul></div>";
                var content_html ='<div id="toolTipContainer_'+id+'" class="toolTipContainer toolTipGroupContainer" >';
                content_html += '<div class="toolTipHeader"><span class="toolTipLeft">'+ title_popup+'</span><span class="toolTipRight"><a id="btn_tooltip_close_'+id+'\" href="#" onclick=mainMarkerManager.closeGroupTooltip(\"' + id +'\",\"'+obj_markerOpts.id+'\")><span>Close</span><img src="images/dialog_close_button.png"></a></span></div>';
                content_html += '<div class="toolTipContent" class="clearfix">'+ list_html +'</div>';
                content_html +='</div>';
                
                popup.setContentHTML(content_html);
                popup.panMapIfOutOfView = true;
                popup.keepInMap = true;
                this.manager.mainMap.addPopup(popup);
                popup.hide();
                if (locationRequests==0) {
                    feature.popup_timeout=setTimeout(function(){
                        feature.popup.toggle();
                    }, 200);
                }
                //return
            } else {
                feature.popup.toggle();
            }
            //aggiungo oggetto
            this.manager.openMarkers[this.manager.openMarkers.length] = id;
            // evt.stopPropagation();
        } catch (e) {
            $.getJSON('reportError.action', {
                code :LBASErrorCodes.MARKER_OPERATION_FAILED,
                text :e.message
            }, function(json) {
            });
        }
    };
}