function AddressSearch(name, address, latitude, longitude) {
	this.name = name;
	this.address = address;
	this.latitude = latitude;
	this.longitude = longitude;
}

function retrievePoiResponseForMeeting(poiResults, responseArr) {

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

function prepareAutoCompleteOperations() {

	$("#nameOfaLocation").autocomplete(
			{
				source :function(request, response) {
					var responseArr = [];
					$.ajax({
						url :"poiSearchAutocompleteWithCredentials",
						data :"q=" + request.term,
						success :function(data) {
							responseArr = $.map(data.poiSearchList, function(item) {
								return {
									label :item.name,
									value :item.name,
									id :item.id
								};
							});
						}
					});

		          	geocoder.geocode({ 'address': request.term, region: regionCountryCode }, function( results, status ) {
		            	var lbasResults = [ GMapsHelper.addressToObj(results[0], null, null, encodeURIComponent(request.term)) ];
		            	lbasResults[0].index = null;
		            	response(retrievePoiResponseForMeeting(lbasResults, responseArr));
		         	});

		         	/*lbasGISConn.singleLineGeocode(encodeURIComponent(request.term), regionCountryCode, function(lbasResults) {
						response(retrievePoiResponseForMeeting(lbasResults, responseArr));
					}, function(lbasResults) {
						response(retrievePoiResponseForMeeting(lbasResults, responseArr));
					});*/
					forceAdressToGeocode = true;

				},
				width :260,
				minLength :4,
				select :function(event, ui) {
					this.value = unEscapeHtmlEntity(ui.item.label);

					if (ui.item.latitude) {
						setAddressSearchForMeeting(ui.item.label, ui.item.label, ui.item.latitude, ui.item.longitude);
					} else {
						$.ajax({
							url :'searchPOIs.action',
							type :'POST',
							async :false,
							data :{
								//listIndex :0,
                                                                page: 0,
								searchText :ui.item.label
								//poiId :ui.item.id
							},
							dataType :'json',
							success :function(json) {
								if (json.poilist != null && json.poilist.length > 0) {
									setAddressSearchForMeeting(json.poilist[0].name, json.poilist[0].address, json.poilist[0].latitude,
											json.poilist[0].longitude);
								}
							}
						});
					}

				},
				open :function() {
					$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
				},
				close :function() {
					$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
				}

			});
}

function setAddressSearchForMeeting(name, address, lat, lon) {

	addressSearch.name = name;
	addressSearch.address = address;
	addressSearch.longitude = lon;
	addressSearch.latitude = lat;

	$('#meetingLocationLatitude').val(lat);
	$('#meetingLocationLongitude').val(lon);
	$('#meetingLocationAddress').val(address);
}

function setMeetingFromDateComboValues(comboDay, comboMonth, comboYear, comboHour, comboMinute) {

	$("#dayFromMeeting option").filter(function() {
		return $(this).attr('value') == comboDay;
	}).attr('selected', 'selected');

	$("#monthFromMeeting option").filter(function() {
		return $(this).attr('value') == comboMonth;
	}).attr('selected', 'selected');

	$("#yearFromMeeting option").filter(function() {
		return $(this).attr('value') == comboYear;
	}).attr('selected', 'selected');

	$("#hourFromMeeting option").filter(function() {
		return $(this).attr('value') == comboHour;
	}).attr('selected', 'selected');

	$("#minuteFromMeeting option").filter(function() {
		return $(this).attr('value') == comboMinute;
	}).attr('selected', 'selected');
}

function setMeetingToDateComboValues(comboEndDay, comboEndMonth, comboEndYear, comboEndHour, comboEndMinute) {

	$("#dayToMeeting option").filter(function() {
		return $(this).attr('value') == comboEndDay;
	}).attr('selected', 'selected');

	$("#monthToMeeting option").filter(function() {
		return $(this).attr('value') == comboEndMonth;
	}).attr('selected', 'selected');

	$("#yearToMeeting option").filter(function() {
		return $(this).attr('value') == comboEndYear;
	}).attr('selected', 'selected');

	$("#hourToMeeting option").filter(function() {
		return $(this).attr('value') == comboEndHour;
	}).attr('selected', 'selected');

	$("#minuteToMeeting option").filter(function() {
		return $(this).attr('value') == comboEndMinute;
	}).attr('selected', 'selected');

}

function showMeetingDateCombos(startLong, endLong) {

	var startTime = new Date(startLong);
	var endTime = new Date(endLong);

	var comboDay = getDay(startTime);
	var comboMonth = startTime.getMonth();// optiondaki value=0/key=01..;
	var comboYear = getYear(startTime);
	var comboHour = startTime.getHours();
	var comboMinute = getMinute(startTime);

	var comboEndDay = getDay(endTime);
	var comboEndMonth = endTime.getMonth();// optiondaki value=0/key=01..;
	var comboEndYear = getYear(endTime);
	var comboEndHour = endTime.getHours();
	var comboEndMinute = getMinute(endTime);

	setMeetingFromDateComboValues(comboDay, comboMonth, comboYear, comboHour, comboMinute);
	setMeetingToDateComboValues(comboEndDay, comboEndMonth, comboEndYear, comboEndHour, comboEndMinute);

	if (getHourMinute(startLong) == "00:00" && getHourMinute(endLong) == "00:00" && (endLong - startLong == 24 * 60 * 60 * 1000)) {
		$("#meetingCheckboxAllDay").attr("checked", true);

		$("#dayFromMeeting").attr("disabled", true);
		$("#monthFromMeeting").attr("disabled", true);
		$("#yearFromMeeting").attr("disabled", true);
		$("#hourFromMeeting").attr("disabled", true);
		$("#minuteFromMeeting").attr("disabled", true);

		$("#dayToMeeting").attr("disabled", true);
		$("#monthToMeeting").attr("disabled", true);
		$("#yearToMeeting").attr("disabled", true);
		$("#hourToMeeting").attr("disabled", true);
		$("#minuteToMeeting").attr("disabled", true);
	}
}

function prepareMeetingDateCombos(today) {

	var updatedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), 0, 0);
	var mm = updatedDate.getMinutes() / 15;
	var c = parseInt(mm) + 1;
	var g = c * 15;

	updatedDate.setMinutes(g);

	var comboDay = getDay(updatedDate);// 
	var comboMonth = updatedDate.getMonth();// optiondaki value=0/key=01..
	var comboYear = getYear(updatedDate);// 
	var comboFromHour = getHour(updatedDate);// 00..01..02:23
	var comboFromMinute = getMinute(updatedDate);// 

	setMeetingFromDateComboValues(comboDay, comboMonth, comboYear, comboFromHour, comboFromMinute);

	var myDate = new Date(updatedDate.getTime() + (60 * 60 * 1000));

	var comboMDay = getDay(myDate);// 	
	var comboMMonth = myDate.getMonth();// optiondaki value=0/key=01..
	var comboMYear = getYear(myDate);// 
	var comboMFromHour = getHour(myDate);// 00..01..02:23
	var comboMFromMinute = getMinute(myDate);// 

	setMeetingToDateComboValues(comboMDay, comboMMonth, comboMYear, comboMFromHour, comboMFromMinute);

}

function prepareMeetingDateComboValues(start, end) {

	var fromDay = getDay(start);
	var fromMonth = start.getMonth();
	var fromYear = getYear(start);
	var fromHour = getHour(start);
	var fromMinute = getMinute(start);

	setMeetingFromDateComboValues(fromDay, fromMonth, fromYear, fromHour, fromMinute);

	var toDay = getDay(end);
	var toMonth = end.getMonth();
	var toYear = getYear(end);
	var toHour = getHour(end);
	var toMinute = getMinute(end);

	setMeetingToDateComboValues(toDay, toMonth, toYear, toHour, toMinute);

}
