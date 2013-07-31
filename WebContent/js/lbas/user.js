var user = {};
var locationRequests = 0;
user.locateRequests = [];
user.getUsersAroundUrl = 'usersAround';
var request_limit = 10000;
var fromLocateMeButton;

user.locate = function(usr, lastLocation, locateNeighbours ,fromLocateMeButton) {
	fromLocateMeButton = fromLocateMeButton;
	//contatore richieste
 	locationRequests++;
  if(locationRequests > request_limit) {
		utils && utils.dialogError({title: $.i18n.prop('dialog.title.max5users'), content: $.i18n.prop('dialog.errorMessage.max5users')});
		locationRequests--;
		return false;
	}

	var id = usr;
	var newRequest = true;
	var fullname = userFullName || '';
	if(typeof usr === 'object') {
		id = usr.user_id || usr.id;
		fullname = Encoder.htmlDecode(usr.fullName || usr.name || '');
	}
	
	$.each(user.locateRequests, function() {
		if($(this).attr('id') === id) {
			newRequest = false;
			return false;
		}
	});
	if (newRequest) {
		user.addLocatingStatus(id);
		utils && utils.dialogLocate({buttons: {}, data:usr});
		var data = {fullName: userFullName, user_id: currentUser};
		data.permissions = {locatable: true};

		var options = {};
		options.data = {
			userId: id,
		    locateLCS:true
		};
		options.async = true;
		options.extra = {
				locateNeighbours: locateNeighbours != undefined? locateNeighbours:true,
				userId: id,
				locatingUser: usr || data
		};
		options.success = user.locateOnSuccess;
		options.error = function(jqXHR, textStatus, errorThrown){
		  if(textStatus!=='abort'){
  		  if($('.generic-ajax-error').length == 0) {
          utils && utils.dialogError({title: $.i18n.prop('error.send.title'), content: $.i18n.prop('errors.db.fail'), css : 'generic-ajax-error '});
        }
     }
		}
		var req = utils && utils.lbasDoGet('locateUser.action', options);
		user.locateRequests.push({id: id, req: req});
	}
};

//Aggiunto dietro richiesta di Saadet per avere last Location=false
user.locateLcsControll = function(usr, lastLocation, locateNeighbours ,fromLocateMeButton) {
	fromLocateMeButton = fromLocateMeButton;
	//contatore richieste
 	locationRequests++;
  if(locationRequests > request_limit) {
		utils && utils.dialogError({title: $.i18n.prop('dialog.title.max5users'), content: $.i18n.prop('dialog.errorMessage.max5users')});
		locationRequests--;
		return false;
	}

	var id = usr;
	var newRequest = true;
	var fullname = userFullName || '';
	if(typeof usr === 'object') {
		id = usr.user_id || usr.id;
		fullname = Encoder.htmlDecode(usr.fullName || usr.name || '');
	}
	
	$.each(user.locateRequests, function() {
		if($(this).attr('id') === id) {
			newRequest = false;
			return false;
		}
	});
	if (newRequest) {
		user.addLocatingStatus(id);
		utils && utils.dialogLocate({buttons: {}, data:usr});
		var data = {fullName: userFullName, user_id: currentUser};
		data.permissions = {locatable: true};

		var options = {};
		options.data = {
			userId: id,
		    locateLCS: (lastLocation != true)?false:true
		};
		options.async = true;
		options.extra = {
				locateNeighbours: locateNeighbours != undefined? locateNeighbours:true,
				userId: id,
				locatingUser: usr || data
		};
		options.success = user.locateOnSuccess;
		options.error = function(jqXHR, textStatus, errorThrown){
		  if(textStatus!=='abort'){
  		  if($('.generic-ajax-error').length == 0) {
          utils && utils.dialogError({title: $.i18n.prop('error.send.title'), content: $.i18n.prop('errors.db.fail'), css : 'generic-ajax-error '});
        }
     }
		}
		var req = utils && utils.lbasDoGet('locateUser.action', options);
		user.locateRequests.push({id: id, req: req});
	}
};


user.locateOnSuccess = function(data, textStatus, jqXHR, options) {
  
  console.log("locateOnSuccess");
  console.log(data, ">>>>>>>>>>>>>>> dat data ");
  var isOnMap = (currentPage == "map");
	if(locationRequests == 0) utils.removeDialogTitle();
		
	if (data) {
		if (data.errorText) {
			data.success = false;
			data.userId = options.userId;
			data.usr = options.locatingUser;
			user.errorPermissionOnMultipleUserLocate=true;
			if (isOnMap) utils && utils.dialogLocate({content:data.errorText, data: data});
			
		} else {
      
      data.success=true;
      if (isOnMap) utils && utils.dialogLocate({data:data});
			if(data.lastPositionAddress) {
			  
			  var lastTrackTime = calculateElapsedTime(data.lastPositionTimestamp);
        var lastTrackTimeForUsersOffset = calculateElapsedTime(data.lastPositionTimestamp, user.timeZoneOffset);
        var localTime = utils.getLocalTime(data.timeZoneOffset);

        
        
        
				/*var d = new Date(data.lastPositionTimestamp);
				d = d.format('dd/mm/yyyy HH:mm Z');

        var f = calculateElapsedTime(d.last_pos_date);
        var e = calculateElapsedTime(d.last_pos_date, d.timeZoneOffset);

				/*
				var lastTrackTime = calculateElapsedTime(data.lastPositionTimestamp);
				var lastTrackTimeForUsersOffset = calculateElapsedTime(data.lastPositionTimestamp, user.timeZoneOffset);
				
				
				var localTime = utils.getLocalTime(data.timeZoneOffset);
				var localTimeMillSec = utils.getLocalTimeMillSec(data.timeZoneOffset);
				var lastUpdate = localTimeMillSec - data.lastPositionTimestamp;
				localTime = getDateWithOffset(data.timeZoneOffset);*/
				
				
				/* lastUpdate = Math.abs(lastUpdate); */
				// lastUpdate < 1h = 60*60*1000 = 3600000ms : show min
				/*if(lastUpdate<3600000){
					lastUpdate = Math.floor( lastUpdate / (60*1000) );
					if(lastUpdate < 0){
						lastUpdate = data.timeZoneOffset + lastUpdate;
						lastUpdate = Math.abs(lastUpdate);
					}
					lastUpdate = lastUpdate +' '+ $.i18n.prop('tooltip.min.ago');
				}
				// 1h <= lastUpdate < 24h : show hours
				if(lastUpdate>=3600000 || lastUpdate<8640000){
					lastUpdate = Math.floor( lastUpdate / (3600*1000) );
					lastUpdate = Math.abs(lastUpdate);
					if(lastUpdate === 1){
						lastUpdate = lastUpdate +' '+ $.i18n.prop('tooltip.hour.ago');
					} else {
						lastUpdate = lastUpdate +' '+ $.i18n.prop('tooltip.hour.ago');
					}
				}
				// 24h <= lastUpdate < 30days : show days
				if(lastUpdate>=8640000 || lastUpdate<2.592 * Math.pow(10, 9)){
					lastUpdate = Math.floor( lastUpdate / (3600*24*1000) );
					if(lastUpdate==1){
						lastUpdate = lastUpdate +' '+ $.i18n.prop('tooltip.day.ago');
					} else {
						lastUpdate = lastUpdate +' '+ $.i18n.prop('tooltip.days.ago');
					}
				}
				// lastUpdate >= 30days : show date
 				if(lastUpdate>=2.592 * Math.pow(10, 9)){
					lastUpdate = d.split(' ', 1);
				}*/

				var tooltipContent = parseTemplate('userLocationTooltipTemplate', {
					user: data,
					latitude: GMapsHelper.deg2dms(data.latitude),
					longitude: GMapsHelper.deg2dms(data.longitude),
					radius: data.radius,
					lastTrackTime: lastTrackTime,
					lastTrackTimeForUsersOffset : lastTrackTimeForUsersOffset,
					/*lastTrackTime: lastUpdate,
          lastTrackTimeForUsersOffset : lastTrackTimeForUsersOffset,*/
					locateLCS: false,
					address: data.lastPositionAddress,
					markerId: 'u' + data.userId,
					minSize: {w:450, h:350},
					localTime: localTime
				});
				
				var assetTrue = false;
				var selectedTab = "pin_user.png";
				
				if(data.email === null || data.email === ''){
					assetTrue = true;
					selectedTab = "pin_asset.png";
				}
				
				var markerOptions = {
          id :'u' + data.userId,
          latitude: data.latitude,
          longitude: data.longitude,
          hasTooltip: true,
          staticContent: true,
          contentHtml: tooltipContent,
          radius: data.radius,
          forceToOpen: true,
          leaveOthersOpen: false,
          address: data.lastPositionAddress,
          icon :'images/'+selectedTab
				};

				var featureId = mainMarkerManager.createMarker(markerOptions, options.locateNeighbours);

				//Check for locating 1 or multiple users and adjust accordingly the map zoom
				if ( multipleLocate )
					adjustZoomLevelBoundsBox(mainMarkerManager, map, data.latitude, data.longitude) 
				else
					adjustZoomLevelAndCenterMap(map, data.latitude, data.longitude);

		        google.maps.event.addListener(mainMarkerManager.markers[featureId].feature.popup, 'domready', function() {

					$('#btn_tooltip_close_'+data.userId).off().on('click' ,function(e) {
						e.preventDefault();
						mainMarkerManager.closeTooltip('u' + data.userId);
					});
					$('#btn_tooltip_moreInfo_'+data.userId).click(function(e) {
						data.user_id = data.userId;
						viewSelectedUserInUsersTab(null, data);
						e.preventDefault();
					});

					$('#btn_tooltip_showNearestUsers_' + data.userId).click(function(e) {
						showNearestUsers(data);
						e.preventDefault();
					});


					$('#btn_tooltip_createReport_'+data.userId).on('click',function(e) {
						data.user_id = data.userId;
						/* locReportAction(null, data); */
						locViewReportAction(null, data);
						e.preventDefault();
					});

					$('#btn_tooltip_savePlace_'+data.userId).click(function(e) {
						if($(this).hasClass('block')){
							return false;
						}
						e.preventDefault();
						GMapsHelper.reverseGeocode(data.latitude, data.longitude, function( resp ) {
							resp.user_id = data.userId;
							openSaveLocationDialog(data.fullname, resp);
/* 							openSaveLocationDialog('', resp); */
						});
					});

					$('#btn_tooltip_setUpMeeting_'+data.userId).click(function(e) {
						e.preventDefault();
						/* TODO REMOVE RETURN TO SHOW POPUP */						
						var location = data.lastPositionAddress;
						var attendee = data.fullname;

						
						var cm = new CalendarManager( $('#calendar-wrapper') );
						prepopulate = {};
			        	prepopulate.location = location;
			        	prepopulate.attendee = attendee;
			        	prepopulate.lat = data.latitude;
			        	prepopulate.lng = data.longitude;

						cm.createEventPopup(new Date(),new Date(), prepopulate, true );
					});

					if ( data.email === null ) {
						$('#btn_tooltip_sendMessage_' + data.userId).css('opacity', 0.3);
					} else {
						$('#btn_tooltip_sendMessage_' + data.userId).css('opacity', 1);
					}
					$('#btn_tooltip_sendMessage_' + data.userId).click(function(e) {
						if(data.email === null){
							return false;
						}else{
							data.user_id = data.userId;
							openSendMessageDialog(null, data);
						}
						e.preventDefault();
					});

					$('#btn_tooltip_getDirection_'+data.userId).click(function(e) {					
			           leftPanel.tabs.tabs('select', leftPanel.tabRoutes.id);

				        var fnLoadedTab = function() {
				          GMapsHelper.reverseGeocode( data.latitude, data.longitude, function( json ) {
				            setRoutePoint(json.address, data.latitude, data.longitude, 1, false);
				          });
				        };

				        if ( leftPanel.tabRoutes.loaded )
				          fnLoadedTab();
				        else {
				          $('body').on('tabRoutedLoaded', function() {
				            fnLoadedTab();
				          });
				        }

						e.preventDefault();
					});
		        });
				data.success = true;
			}else{
				if (isOnMap) utils && utils.dialogLocate({title: $.i18n.prop('dialog.title.error'), content:$.i18n.prop('errors.no.location.data'), data: data});
			}
		}
		user.removeLocatingStatus(data.userId);
		$.each(user.locateRequests, function(i, k) {
			if(options.userId && k.id==options.userId) {
				user.locateRequests.splice(i, 1);
				return false;
			}
		});
	}
    locationRequests--;
    //check 0 locationrequests
    if(locationRequests==0) {
      if (user.errorPermissionOnMultipleUserLocate) {
      } else { 
        //$('.ui-dialog.locateSingleUser').hide();
        utils.closeDialog();
     };
     //location zero -- reset no request
      multipleLocate = false;
      //collapse group on map
      mainMarkerManager.collapseCloserUsersPoints();
    }
};

/** shows user marker and tooltip on map, by clicking on closer users dialog **/
user.showOnMap = function(data) {
	data.fullname = (data.name || data.fullname);
	data.userId = (data.id || data.userId);
	
	var d = new Date(data.lastPositionTimestamp);
		d = d.format('dd/mm/yyyy HH:mm Z');
	
		var lastTrackTime = calculateElapsedTime(data.lastPositionTimestamp);
		var lastTrackTimeForUsersOffset = calculateElapsedTime(data.lastPositionTimestamp, data.timeZoneOffset);
		var localTime = utils.getLocalTime(data.timeZoneOffset);
		
		
		
		/*var localTime = utils.getLocalTime(data.timeZoneOffset);
		var localTimeMillSec = utils.getLocalTimeMillSec(data.timeZoneOffset);
		var lastUpdate = localTimeMillSec - data.lastPositionTimestamp;
				
		// lastUpdate < 1h = 60*60*1000 = 3600000ms : show min
		if(lastUpdate<3600000){
			lastUpdate = Math.floor( lastUpdate / (60*1000) );
			lastUpdate = lastUpdate + ' min ago';
		}
		// 1h <= lastUpdate < 24h : show hours
		if(lastUpdate>=3600000 || lastUpdate<8640000){
			lastUpdate = Math.floor( lastUpdate / (3600*1000) );
			if(lastUpdate==1){
				lastUpdate = lastUpdate + ' hour ago';
			} else {
				lastUpdate = lastUpdate + ' hours ago';
			}
		}
		// 24h <= lastUpdate < 30days : show days
		if(lastUpdate>=8640000 || lastUpdate<2.592 * Math.pow(10, 9)){
			lastUpdate = Math.floor( lastUpdate / (3600*24*1000) );
			if(lastUpdate==1){
				lastUpdate = lastUpdate + ' day ago';
			} else {
				lastUpdate = lastUpdate + ' days ago';
			}
	
		}
		// lastUpdate >= 30days : show date
	 	if(lastUpdate>=2.592 * Math.pow(10, 9)){
			lastUpdate = d.split(' ', 1);
	 }*/	
					
	var tooltipContent = parseTemplate('userLocationTooltipTemplate', {
		user: data,
		latitude: GMapsHelper.deg2dms(data.latitude),
		longitude: GMapsHelper.deg2dms(data.longitude),
		/*lastTrackTime: lastUpdate,
		lastTrackTimeForUsersOffset : lastTrackTimeForUsersOffset,*/
		lastTrackTime: lastTrackTime,
    lastTrackTimeForUsersOffset : lastTrackTimeForUsersOffset,
		locateLCS: false,
		address: data.lastPositionAddress,
		markerId: 'u' + data.id,
		minSize: {w:450, h:350},
		localTime: localTime
	});
	
	var markerOptions = {
		id :'u' + data.id,
		latitude: data.latitude,
		longitude: data.longitude,
		hasTooltip: true,
		staticContent: true,
		contentHtml: tooltipContent,
		radius: (data.radius || 5000),
		forceToOpen: true,
		leaveOthersOpen: false,
		address: data.lastPositionAddress
	};
	
	mainMarkerManager.createMarker(markerOptions, false);
	adjustZoomLevelAndCenterMap(map, data.latitude, data.longitude);
	$('#btn_tooltip_close_'+data.id).die()
	$('#btn_tooltip_close_'+data.id).live('click', function(e) {
		e.preventDefault();
		mainMarkerManager.closeTooltip('u' + data.id);
	});
	
	$('#btn_tooltip_moreInfo_'+data.id).click(function(e) {
		data.user_id = data.id;
		viewSelectedUserInUsersTab(null, data);
		e.preventDefault();
	});
	
	$('#btn_tooltip_showNearestUsers_'+data.id).click(function(e) {
		showNearestUsers(data);
		e.preventDefault();
	});
	
	$('#btn_tooltip_sendMessage_'+data.id).click(function(e) {
		data.user_id = data.id;
		openSendMessageDialog(null, data);
		e.preventDefault();
	});
	
	$('#btn_tooltip_createReport_'+data.id).click(function(e) {
		data.user_id = data.id;
		locReportAction(null, data);
		e.preventDefault();
	});
	
	$('#btn_tooltip_savePlace_'+data.id).click(function(e) {
		if($(this).hasClass('block')){
			return false;
		}
		data.user_id = data.id;
		openSaveLocationDialog('', data);
		e.preventDefault();
	});
	
	$('#btn_tooltip_getDirection_'+data.id + ', #btn_tooltip_setUpMeeting_'+data.id).click(function(e) {
		alert('N/A');
		e.preventDefault();
	});
}


user.getUsersAround = function(usr){
	var options = {};
	var data = [];
	data.push({ name: 'lon', value: usr.longitude });
	data.push({ name: 'lat', value: usr.latitude });
	data.push({ name: 'radius', value: usr.radius * 4 });

	options.data = data;
	options.async = true;
	options.success = user.getUsersAroundOnSuccess;

	utils && utils.lbasDoGet(user.getUsersAroundUrl, options);
};

user.getUsersAroundOnSuccess = function(data) {
	// T.B.D.
	if(data){}
};

user.getAvailableActions = function(actionList, showAllActions, isUser) {
	var container = 'tab-users';

	if(!isUser){
		container = 'tab-assets';
	}

	$('#btn_'+container+'_showOnMap, #btn_'+container+'_requestPermission, #btn_'+container+'_createReport, #btn_'+container+'_sendMessage').unbind('click');
	$('#btn_'+container+'_showOnMap').click(function(e) {
		if (!$(this).hasClass('multi_user_button_inactive')) {
			actionSelected("12", '#'+container);
		}
		e.preventDefault();
	});

	$('#btn_'+container+'_requestPermission').click(function(e){
		if (!$(this).hasClass('multi_user_button_inactive')) {
			actionSelected("1", '#'+container);
		}
		e.preventDefault();
	});

	$('#btn_'+container+'_createReport').click(function(e) {
		if (!$(this).hasClass('multi_user_button_inactive')) {
			actionSelected("7", '#'+container);
		}
		e.preventDefault();
	});
	$('#btn_'+container+'_sendMessage').click(function(e) {
		if($('.userSendMessage').length > 0){
			return false;
		}
		if (!$(this).hasClass('multi_user_button_inactive')) {
			actionSelected("6", '#'+container);
		}
		e.preventDefault();
	});

	$('.multi_user_button').live('mousedown', function() {
		if (!$(this).hasClass('multi_user_button_inactive')) {
		  $(this).addClass('multi_user_button_active');
		}
	});
	$('.multi_user_button').live('mouseup', function() {
		if (!$(this).hasClass('multi_user_button_inactive')) {
		  $(this).removeClass('multi_user_button_active');
		}
	});
};

user.getDetails = function(userId, container) {
	function errorOnAsset(json){
        utils && utils.dialog({
            content : "<div class='notInWorkingHours'><img src='images/icon_notification.png' style='float:left;' alt='...' /> <div style='width:215px;float:left; margin-left:10px; '><p style='margin-top:5px;'>"+ $.i18n.prop('asset.Error.message') +" </p></div> </div>",
            css: 'noCloseNoOk'
        });
        $(".notInWorkingHours").css("width",260);   
        $(".noCloseNoOk").hide();
        $(".noCloseNoOk").fadeIn("slow");
        timeMsg();
	}

	var options = {};
	options.data = {
		id: userId
	};
	options.async = false;
	options.extra = {
			container: container
	};
	options.success = function(json, textStatus, jqXHR, options) {
		if (checkResponseSuccess(json, errorOnAsset)){
			$(options.container).append($('<li></li>').html('<span class="bold">' + $.i18n.prop('userEdit.Email') + ':</span> ' + (json.email || '')));
			$(options.container).append($('<li></li>').html('<span class="bold">' + $.i18n.prop('userEdit.Mobile') + ':</span> ' + (json.msisdn || '')));
			$(options.container).append($('<li></li>').html('<span class="bold">' + $.i18n.prop('lbasUser.companyName') + ':</span> ' + (json.companyName || '')));
		}
	};

	utils && utils.lbasDoPost('viewUser.action', options);
};

user.locateAbort = function(id) {
	locationRequests--;
	$.each(user.locateRequests, function(i, k) {
		if($(k).attr('id')==id){
			var _req = k.req;
			_req.abort();
			user.locateRequests.splice(i, 1);
			user.removeLocatingStatus(id);
			setTimeout(function() {
				$('#locateSingleUser_' + id).fadeOut('slow', function() {
					$(this).remove();
					if(locationRequests == 0) utils.checkLocationRequests();
					if ($('.locateSingleUser ul li').length<=3){
						$('.locateSingleUser').fadeOut('slow', function() {
							$(this).remove();
						});
						user.locateRequests.length = 0;
					}
				}); 

			},0);
			
			return false;
		}
	});
};

user.abortAllUserLocate = function() {
  if($('.locateSingleUser').length > 0) {
  
    var toAbort = $('.locateSingleUser ul#dialog_list_locating li');
    $.each(toAbort, function(){
    var item = $(this).data('item');
    if(item){
      user && user.locateAbort(item.user_id || item.id);
     }
     });
  }
}




user.removeNotification = function(elem, id) {
	var element = $(elem);
	element.fadeOut('slow', function() {
		$(this).remove();
		if ($('.ui-dialog-content').children().length === 0) {
			$('.locateSingleUser').fadeOut().remove();
			user.locateRequests.length = 0;
		}
	});
	$.each(user.locateRequests, function(i, k) {
		if (k.id==id) {
			user.locateRequests.splice(i, 1);
			return false;
		}
	});
};

user.addLocatingStatus = function(id) {
	var $item = $('#item_' + id + ' .globalSearchButton');
	$item
		.removeClass('locationAvailableLeft')
		.addClass('locationInProgress');

	$item.find('span')
		.removeClass('locationAvailableRight')
		.text($.i18n.prop('buttons.cancel'));
	};

user.removeLocatingStatus = function(id) {
	setTimeout(function() {
		var $item = $('#item_' + id + ' .globalSearchButton');
		$item
			.addClass('locationAvailableLeft')
			.removeClass('locationInProgress');

		$item.find('span')
			.addClass('locationAvailableRight')
			.text($.i18n.prop('globalsearch.showonmap'));
      	
	}, 1);	
	
};

user.removeNotLocatableStatus = function(id) {
	setTimeout(function() {
		var $item = $('#item_' + id + ' .globalSearchButton');
		$item
			.addClass('locationAvailableLeft')
			.removeClass('locationInProgress');

		$item.find('span')
			.addClass('locationAvailableRight')
			.text($.i18n.prop('globalsearch.requestPermission'));
		locationRequests--;
      
	}, 1);
	
};


function getDateWithOffset(offset){
  var now = new Date();
  var hour = 60*60*1000;
  var min = 60*1000;

  var nd =  new Date(now.getTime() + (now.getTimezoneOffset() * min) + ((offset/60) * hour));
  
  var minutes = nd.getMinutes();
  var seconds = nd.getSeconds();
	
  if(minutes==0 || minutes<10){
	  minutes = '0'+minutes;
	}
  if(seconds==0 || seconds<10){
		seconds = '0'+seconds;
	}	
	
	// return time as a string
	return nd.getHours()+':'+minutes+':'+seconds;

}