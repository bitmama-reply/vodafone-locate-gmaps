function deleteRecentHistory(recenthistoryId) {
	var btns = {};
	btns[$.i18n.prop('buttons.ok')] = function() {
		$.post('deleteRecentHistory.action', {
			id :recenthistoryId
		}, function(data, textStatus) {
			if (data.errorText == null)
				// $("#recentLocationTable tr[id*=" + recenthistoryId + "]").css("display", "none");
				$('#lcRecentLcs').html(populateRecentLocations(true));
		});

		$(this).dialog('close');
		$(this).dialog('destroy');
	};
	btns[$.i18n.prop('buttons.cancel')] = function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
	};

	document.getElementById("deleteConfirmation").style.display = "";
	$(function() {
		$("#deleteConfirmation").dialog({
			bgiframe :true,
			resizable :false,
			height :140,
			modal :glbmodal,
			overlay :{
				backgroundColor :'#000',
				opacity :0.5
			},
			buttons :btns
		});
	});

	$("#deleteConfirmation").dialog('open');

}

function showPoiOnMapNew(id, latitude, longitude, address, name) {

	if (mainMarkerManager.markers['r' + id] == null){
		
		/*
		var tooltipContent = parseTemplate('poiRecentTooltipTemplate', {
			latitude :latitude,
			longitude :longitude,
			address :address,
			name :$.i18n.prop('location.address'),
			markerId :'r' + id
		});
		*/
		
		var lastTrackTime = calculateElapsedTime(data.last_pos_date);
		var lastTrackTimeForUsersOffset = calculateElapsedTime(data.last_pos_date, user.timeZoneOffset);
		
		var poi = data.poii;
		var tooltipContent = parseTemplate('userLocationTooltipTemplate', {
			user: poi,
			latitude: GMapsHelper.deg2dms(poi.latitude),
			longitude: GMapsHelper.deg2dms(poi.longitude),
			radius: poi.radius,
			lastTrackTime: d || poi.lastPositionTimestamp,
			lastTrackTimeForUsersOffset : lastTrackTimeForUsersOffset,//data.lastTrackTimeForUsersOffset,
			locateLCS: false,
			address: poi.address,
			markerId: 'r' + poi.id,
			minSize: {w:450, h:350}
		});
	
		var markerOptions = {
			id :"r" + id,
			icon :'images/marker_cat_vf_uncategorized.png',
			iconWidth :26,
			iconHeight :32,
			latitude :latitude,
			longitude :longitude,
			hasTooltip :true,
			staticContent :true,
			contentHtml :tooltipContent,
			history :false,
			forceToOpen :true
		};
	
		mainMarkerManager.createMarker(markerOptions);
	}

	adjustZoomLevelAndCenterMap(map, latitude, longitude);

}

function deleteMultipleRecentLocations() {
	$("input[id ^= poicheckbox-id]:checked").each(function(index) {
		var recentLocationId = $(this).attr("name");
		deleteRecentHistory(recentLocationId);
	});
}