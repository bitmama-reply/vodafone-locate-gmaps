var totalHash = new Array();
var locationReportRouteResult;
var trackingHash;

function total(time, distance, avgSpeed) {
	this.time = time;
	this.distance = distance;
	this.avgSpeed = avgSpeed;
}

function locationReportDialogReady() {

	var locale = userLocale == 'en' ? '' : (userLocale == null ? '' : userLocale);

	$("#locReportDatePickerStart").datepicker($.extend( {}, $.datepicker.regional['' + locale + ''], {
		showMonthAfterYear :false,
		showOn :'button',
		dateFormat :'dd/mm/yy',
		buttonImage :'images/calendar.png',
		buttonImageOnly :true,
		onSelect :function(dateText, inst) {
			var daystart = $("#locReportDatePickerStart").datepicker("getDate");
		}
	}));
	$("#locReportDatePickerStop").datepicker($.extend( {}, $.datepicker.regional['' + locale + ''], {
		showMonthAfterYear :false,
		showOn :'button',
		dateFormat :'dd/mm/yy',
		buttonImage :'images/calendar.png',
		buttonImageOnly :true,
		onSelect :function(dateText, inst) {
			var daystop = $("#locReportDatePickerStop").datepicker("getDate");
		}
	}));

	var today = new Date();

	// 1 day = 1 * 24 hours = 24 hours
	// 24 hours = 24 * 60 min = 1440 min
	// 1440 min = 1440 * 60 sec = 86400 sec
	// 86400 sec = 86400 * 1000 ms = 86400000 ms
	var yesterday = new Date(today.getTime() - 86400000);

	$("#locReportDatePickerStart").datepicker("setDate", yesterday);
	$("#locReportDatePickerStop").datepicker("setDate", today);

	$("#locReportHourFrom").val(getHour(today.getTime()));
	$("#locReportMinuteFrom").val(getMinute(today.getTime()));
	$("#locReportHourTo").val(getHour(today.getTime()));
	$("#locReportMinuteTo").val(getMinute(today.getTime()));
}

function openRequestReportPermissionDialog(container, user) {

	var content = parseTemplate('requestReportPermissionDialog', {
		user: user
                
	});
        /*var data = $('#u'+userId).data('user');*/
		if (user.permissions.hasCreateReportPermission == false){
			var btns = {};

			btns[$.i18n.prop('buttons.cancel')] = function() {
				$(this).dialog('close');
			};
			
			btns[$.i18n.prop('buttons.create')] = function() 
		        {
				/*requestUserLocationPermission();*/
		        viewLocationReportTableOnMap(container, user);
			};
	
	$(".locationReportRequestPermission").css({
		"top" : 300,
		"width" : 500
	});	
			
		}else{
			var btns = {};
			
			btns[$.i18n.prop('buttons.cancel')] = function() {
				$(this).dialog('close');
			};
			
			btns[$.i18n.prop('buttons.create')] = function() 
		        {
				/*requestUserLocationPermission();*/
		        viewLocationReportTableOnMap(container, user);
			};
	
	$(".locationReportRequestPermission").css({
		"top" : 300,
		"width" : 400
	});				

		}
	utils && utils.dialog({
		title: "title", 
		content: content, 
		buttons: btns, 
		css: 'noClose locationReportRequestPermission'
	});
                                     
}

function MarkerObj() {

}

function updateLocation(userIdIcon) {

	var userIdAndIcon = userIdIcon.split(";");
	var userId = userIdAndIcon[0];
	var userIcon = userIdAndIcon[1];

	$("#tooltipUpdateUserLoc_" + userId).show();

	$.ajax( {
		url :"locateUser.action",
		type :'POST',
		data : {
			userId :userId,
			locateLCS :true
		},
		dataType :'json',
		success :function(json) {
			$("#tooltipUpdateUserLoc_" + userId).hide();
			mainMarkerManager.updateMarkerSize("u" + userId);
			if (checkResponseSuccess(json)) {

				json.userModel['iconWidth'] = 36;
				json.userModel['iconHeight'] = 53;
				json.userModel.iconName = userIcon;

				var radiusColor = "#000088";

				if (userIcon == "images/blue_circle.gif")
					radiusColor = "#6DC1D7";
				else if (userIcon == "images/blue_circle_2.gif")
					radiusColor = "#0077B7";
				else if (userIcon == "images/b_grn.gif")
					radiusColor = "#33CC33";
				else if (userIcon == "images/empty_star.png")
					radiusColor = "#CCCCCC";
				else if (userIcon == "images/filledstar.png")
					radiusColor = "#F3B700";

				json.userModel.radiusColor = radiusColor;

				if (json.userModel) {
					showUsersOnMap(json.userModel, true);
				}
			}
		}
	});
}

function openLocationNotAvailableDialog(content) {

	$("#locationNotAvailableUser").html(content);
	$("#locationNotAvailableDialog").dialog( {
		modal :glbmodal,
		bgiframe :true,
		resizable :false,
		close :function(event, ui) {
			$("#locationNotAvailableDialog").dialog('destroy');
		}
	}).height("auto");
	$("#locationNotAvailableDialog").dialog('open');

}

function openPermissionRequiredDialog(userId, userFullName) {

	$("#permRequestedUser").html(userFullName);
	$("#permRequestedUserId").val(userId);
	$("#permissionRequiredDialog").dialog( {
		modal :glbmodal,
		title :$.i18n.prop('locationReport.permission.required'),
		width :400,
		height :90,
		bgiframe :true,
		close :function(event, ui) {
			$("#permissionRequiredDialog").dialog('destroy');
		}
	});
	$("#permissionRequiredDialog").dialog('open');

	// IE7 fix
	$("#permissionRequiredDialog").css("height", "90");

	permissionRequiredLink.onclick = function() {
		openRequestLocationPermissionDialog(userId, userFullName);
	};
}

function displayPermissionRequiredList(permissionRequiredList) {
	$('#permissionRequiredDiv').html(parseTemplate("permissionRequiredListTemplate", {
		permissionRequiredList :permissionRequiredList
	}));
}

function skipClosePoints(points) {

	// for ( var j = 0; j < points.length; j++) {
	// alert("points: " + points[j].y + " " + points[j].x);
	// }

	var updatedPoints = new Array();
	for ( var i = 0; i < points.length; i++) {
		updatedPoints.push(points[i]);
		if (i + 1 < points.length) {
			var distance = distanceBetweenTwoPoints(points[i].y, points[i].x, points[i + 1].y, points[i + 1].x);
			if (distance < 50) {
				// delete i. point
				updatedPoints.pop();
			}
		}
	}

	// for ( var k = 0; k < updatedPoints.length; k++) {
	// alert("updatedPoints: " + updatedPoints[k].y + " " + updatedPoints[k].x);
	// }

	return updatedPoints;
}

function selectLocReportUser(userId, listIndex) {

	if ($("#locReportIcon" + userId).attr('src') == contextPath + '/images/arrow_right4x7.gif') {
		loadLocationReports(userId, listIndex);
		$("#locReportContent" + userId).show();
		$("#locReportIcon" + userId).attr('src', contextPath + '/images/arrow_down7x4.gif');
	} else {
		$("#locReportContent" + userId).hide();
		$("#locReportIcon" + userId).attr('src', contextPath + '/images/arrow_right4x7.gif');

	}
}

function loadLocationReports(userId, listIndex) {
	
	var data = {
		userId: userId,
		pageSize: 5,
		page: listIndex
    };
	
	var options = {};
	options.async = false;
	options.data = data;
	options.success = function(json){
		if(checkResponseSuccess(json)){
			$("#locReportContent" + userId).html('');
	
			$("#locReportContent" + userId).html(parseTemplate("locationReportListTemplate", {
				locationReport: json.locationReport,
				userId: userId,
				listSize: json.total,
				listIndex: json.page,
				listPageSize: json.locationReport.length,
				total: totalHash[userId],
				count: json.page * json.locationReport.length,
				pageSize: data.pageSize
			}));
		}
	};
	
	//utils && utils.lbasDoPost('listLocationReportBasedOnPaging.action', options);
	utils && utils.lbasDoPost('listLocationReport.action', options);
}

function drawForLocationReport(trackingList, userId) {

	var tooltipContent;

	if (trackingList != null) {
		locationReportRouteResult[userId] = [];

		for ( var x = 0; x < trackingList.length; x++) {
			if (trackingList[x].latitude != null && trackingList[x].longitude != null) {
				var latitude = trackingList[x].latitude;
				var longitude = trackingList[x].longitude;

				locationReportRouteResult[userId][x] = new google.maps.LatLng(latitude, longitude);
			}
		}
	}

	if (locationReportRouteResult[userId]) {
		for ( var x = 0; x < trackingList.length; x++) {
			if (trackingList[x].latitude != null && trackingList[x].longitude != null) {// hata
				// d�nmemi�se
				// lokasyon var
				// demektir ;bu
				// durumda marker
				// ekle
				var latitude = trackingList[x].latitude;
				var longitude = trackingList[x].longitude;
				var radius = trackingList[x].radius;
				var timestamp = trackingList[x].timestamp;
				var street = trackingList[x].street;
				var area = trackingList[x].area;
				var city = trackingList[x].city;
				var country = trackingList[x].country;
				var fullName = trackingList[0].user.fullName;
				var icon = 'images/' + trackingList[0].user.icon;
				var time = getDate(timestamp);

				var content = fullName + "<br/>";
				var addressDetail = "";

				if (street != null && street != "N/A")
					addressDetail += street + " ";

				if (area != null && area != "N/A")
					addressDetail += area + " ";

				if (city != null && city != "N/A")
					addressDetail += city + " ";

				if (country != null && country != "N/A")
					addressDetail += country;

				content += addressDetail;

				var radiusColor = "#000088";
				var routingLineColor = "#000088";

				if (radius != null) {
					radiusColor = routingLineColor = getRadiusColor(icon);
				}

				tooltipContent = parseTemplate('locationReportTooltipTemplate', {
					time :time,
					content :content,
					latitude :latitude,
					longitude :longitude,
					street :street,
					city :city,
					country :country,
					address :addressDetail,
					markerId :'l' + x + userId
				});

				var markerOptions = {
					id :'l' + x + userId,
					icon :icon,
					latitude :latitude,
					longitude :longitude,
					hasTooltip :true,
					littleTooltip: true,
					staticContent :true,
					contentHtml :tooltipContent,
					radius :radius,
					radiusColor :radiusColor,
					forceToOpen :false
				};

				mainMarkerManager.createMarker(markerOptions);
			}
		}

		var routeStyleForLocationReport = GMapsHelper.getVectorStyle();
		routeStyleForLocationReport.strokeColor = routingLineColor || 'red';
		routeStyleForLocationReport.strokeWidth = 4;
		routeStyleForLocationReport.cursor = "pointer";
		routeStyleForLocationReport.graphicZIndex = ROUTE_POINTS_ZINDEX;

		drawForLocationReportPoints(locationReportRouteResult[userId], routeStyleForLocationReport);

	}
}

function selectPointsForRoute(points) {

	var updatedPoints = skipClosePoints(points);
	if (updatedPoints.length > 30) {
		var selectedPoints = new Array();
		var count = parseInt(updatedPoints.length / 30);
		var x = 0;
		while (x < updatedPoints.length) {
			selectedPoints.push(updatedPoints[x]);
			x += count;
		}
		return selectedPoints;
	} else
		return updatedPoints;
}

function viewReport(startdate, enddate) {

	$('#map').block({ message: "<div class='s'><div class='ui-dialog-titlebar' style='padding:20px'><span class='ui-dialog-title'><p><img src='images/loader.gif' style='vertical-align:middle'>  "+$.i18n.prop('dialog.message.please.wait')+"</p></span></div></div>" });
	
	var selectedUserList = [];
	var idList = [];
	locationReportRouteResult = [];
	var checkedUsers = utils.getChecked('#locReportTableDetail input:checked'); //utils.getChecked('#tab-users .contents ul input:checked', 'user');
	selectedUserList = new Array;

	$.each(checkedUsers, function(i ,v) {
		var id = $(this).attr("id");
		var pin = $(this).parent().attr('pin');
		
		//if($(this).data('user').permissions.locatable===true){
			selectedUserList.push(id+':'+pin);
			idList.push(id);
		//}	
	});

	if (selectedUserList.length>0) {
		
		var data = []
		$.each(selectedUserList, function(i,v){

			data.push({name:'selectedUserList', value: selectedUserList[i]})

		});

/*
		data = [
			{name: 'startDate', value: startdate},
			{name:'endDate', value: enddate}
		];
*/
		data.push({name: 'startDate', value: startdate});
		data.push({name: 'endDate', value: enddate});

		var options = {};
		options.data = data;
		//Modifica, è una chiamata asyncrona
		options.async = true;
		options.success = function(json){
			
			if (json && checkResponseSuccess(json)) {
				trackingHash = json.locationReportHash;

				var reportTableContent = parseTemplate("locationReportUserListTemplate", {
					locationReport: trackingHash
				});

				var widthOfReport = $('#map #right').width();
				$reportTable = $('<div id="reportTableContent" class="report"></div>')
					.html(reportTableContent)
					.css({
						'position': 'absolute',
						'bottom': 0,
						'right':0,
						'width': widthOfReport
						})
					.appendTo('#map');
				
				//mainMarkerManager.removeUserMarkers();
        console.log('--->',idList);

      for(i=0; i<idList.length; i++){
        mainMarkerManager.removeMarker('u'+idList[i]);
      }



				
				// routing - start
				console.log(idList);
				for ( var x = 0; x < idList.length; x++) {
					console.log(trackingHash[idList[x]]);
					console.log(idList[x]);
					drawForLocationReport(trackingHash[idList[x]], idList[x]);
				}
				
				adjustZoomLevelBoundsBox(mainMarkerManager, map);
				// routing - end
			}/*
else{
				utils && utils.dialog({title:$.i18n.prop('dialog.title.error'), content: json.errorText});
			}
*/

			$('#map').unblock();	
		};
		options.failure = function(json){
			$('#map').unblock();
		}
		utils && utils.lbasDoPost('viewReport.action', options);
	} else {
		utils && utils.dialog({title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.select.user')});
	}	
	
}

function requestUserLocationPermission()
{
	var serializedFormData = $('#requestLocationPermission').serialize();
	
	var options = {};
	options.data = serializedFormData;
	options.success = function(json) {
		if(checkResponseSuccess(json)){
			$('.dialog').dialog('close');
			utils && utils.dialog({title: $.i18n.prop('dialog.title.success'), content: json.infoMessage});
			$(this).dialog('close');
		}
	};
	utils && utils.lbasDoPost('requestPermission.action', options);
}

function clearMapForLocationReport() {
	clearMapClicked();

	if ($("#permissionRequiredDialog").dialog('isOpen'))
		$("#permissionRequiredDialog").dialog('close');
	if ($("#locationNotAvailableDialog").dialog('isOpen'))
		$("#locationNotAvailableDialog").dialog('close');
}

function locationReportUserCheckboxAction(value, userid, iconName) {
	if (value == 'true') {
		if (locationReportRouteResult != undefined && locationReportRouteResult[userid] != undefined)
			drawForLocationReport(trackingHash[userid], userid);
	} else {
		routeColor = getRadiusColor(iconName);

		// remove route line
		for ( var x = 0; x < routeLayerForLocationReport.length; x++) {
			if (routeLayerForLocationReport[x].style.strokeColor == routeColor) {
				routeLayerForLocationReport[x].setMap();
			}
		}
		// remove circles
		for ( var x = 0; x < circleLayer.features.length; x++) {
			if (circleLayer.features[x].style.strokeColor == routeColor) {
				circleLayer.removeFeatures(circleLayer.features[x]);
				x--;
			}
		}
		// remove markers
		for ( var x = 0; x < markerLayer.markers.length; x++) {
			if (markerLayer.markers[x].icon.url == "images/" + iconName) {
				mainMarkerManager.removeMarker(markerLayer.markers[x].id);
				x--;
			}
		}
	}

}

function exportLocationReport(timeZoneOffset, startDate, endDate) {
  var myList = new Array(),
      userList='';
  
  $('#locReportTableDetail .namePart input').each(function(){
      if( $(this).attr('checked') ){
         myList.push($(this).attr('id'));
    }
  });
  
  $.each(myList, function(x , y){
    userList +='&userIdList['+x+']='+y;
  })

	window.location.href = "exportLocationReport.action?type=" + $("#locationReportExportType").val() + "&clientGMTOffset="
			+ timeZoneOffset + "&startDate=" + startDate + "&endDate=" + endDate +userList;
			
}

function locationReportShowHide(row, id){
	if( routeLayerForLocationReport[row] === undefined ){
  	return false;
	}
	var pin = $('#locReportUser'+id).attr('pin');
	var color = routeLayerForLocationReport[row].strokeColor;
	if($('#locReportUser'+id).find('input').is(':checked')){
		
		if(routeLayerForLocationReport[row].strokeColor === color){
			routeLayerForLocationReport[row].setVisible(true);
		}
		for (x in mainMarkerManager.markers){
			if(mainMarkerManager.markers[x].feature.icon === "images/"+pin){
    	    	mainMarkerManager.markers[x].feature.setVisible(true);
    	    	}
    	}

	}else{

		if(routeLayerForLocationReport[row].strokeColor === color){
			routeLayerForLocationReport[row].setVisible(false);
		}
		for (x in mainMarkerManager.markers){
			if(mainMarkerManager.markers[x].feature.icon === "images/"+pin){
    	    	mainMarkerManager.markers[x].feature.setVisible(false);
    	    	}
    	}
	}
}