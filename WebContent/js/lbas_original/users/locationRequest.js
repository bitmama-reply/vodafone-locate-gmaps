var radioValue = "permanent";
var timeInterval = 0;
var restrictChecked = false;
var frequencyChecked = false;


function locationRequestListReady(searchText, searchText2) {

	var usStxt, usStxt2;
	if (searchText && searchText != null && searchText != '')
		usStxt = searchText;
	else
		usStxt = $.i18n.prop('general.Search');

	$('#locRequestSearchInput').val(usStxt);
	if (searchText2 && searchText2 != null && searchText2 != '')
		usStxt2 = searchText2;
	else
		usStxt2 = $.i18n.prop('general.Search');
	$('#sharedLocSearchInput').val(usStxt2);
}

function locationRequestDialogReady(startTime, stopTime, viewLocation) {

	prepareFromDate(startTime);
	prepareToDate(stopTime);
	selectRadio(viewLocation);
	// $("#regionListLocating").val(region);

	prepareComboBoxes();
	var locale = userLocale == 'en' ? '' : (userLocale == null ? '' : userLocale);

	$("#locRequestDatePickerStart").datepicker($.extend({}, $.datepicker.regional['' + locale + ''], {
		showMonthAfterYear :false,
		showOn :'button',
		dateFormat :'dd/mm/yy',
		buttonImage :'images/calendar.png',
		buttonImageOnly :true,
		minDate :new Date(),
		onSelect :function(dateText, inst) {
			var daystart = $("#locRequestDatePickerStart").datepicker("getDate");

			$("#locRequestDatePickerStop").datepicker("option", "minDate", $("#locRequestDatePickerStart").datepicker("getDate"));
			$("#locRequestDatePickerStop").datepicker("setDate", $("#locRequestDatePickerStart").datepicker("getDate"));

			$("#dayFrom").val($.datepicker.formatDate('dd', $("#locRequestDatePickerStart").datepicker("getDate")));
			$("#dayTo").val($.datepicker.formatDate('dd', $("#locRequestDatePickerStart").datepicker("getDate")));

			$("#monthFrom").val($.datepicker.formatDate('mm', $("#locRequestDatePickerStart").datepicker("getDate")));
			$("#monthTo").val($.datepicker.formatDate('mm', $("#locRequestDatePickerStart").datepicker("getDate")));

			$("#yearFrom").val($.datepicker.formatDate('yy', $("#locRequestDatePickerStart").datepicker("getDate")));
			$("#yearTo").val($.datepicker.formatDate('yy', $("#locRequestDatePickerStart").datepicker("getDate")));
		}
	}));
	$("#locRequestDatePickerStop").datepicker($.extend({}, $.datepicker.regional['' + locale + ''], {
		showMonthAfterYear :false,
		showOn :'button',
		dateFormat :'dd/mm/yy',
		buttonImage :'images/calendar.png',
		buttonImageOnly :true,
		minDate :new Date(),
		onSelect :function(dateText, inst) {
			$("#dayTo").val($.datepicker.formatDate('dd', $("#locRequestDatePickerStop").datepicker("getDate")));
			$("#monthTo").val($.datepicker.formatDate('mm', $("#locRequestDatePickerStop").datepicker("getDate")));
			$("#yearTo").val($.datepicker.formatDate('yy', $("#locRequestDatePickerStop").datepicker("getDate")));

		}
	}));

	$("#yearFrom").change(function() {
		$("#yearTo").val($("#yearFrom").val());
	});

	$("#monthFrom").change(function() {
		$("#monthTo").val($("#monthFrom").val());
	});

	$("#dayFrom").change(function() {
		$("#dayTo").val($("#dayFrom").val());
	});

	$("#hourFrom").change(function() {
		$("#hourTo").val($("#hourFrom").val());
	});

	$("#minuteFrom").change(function() {
		$("#minuteTo").val($("#minuteFrom").val());
	});

}

function getSelectedUsers(userListDiv) {
	var requestedUsers = $(userListDiv + " [id]");
	var selectedUsers = new Array();
	var j = 0;

	for ( var i = 0; i < requestedUsers.length; i++) {
		if (requestedUsers[i].style.display != "none") {
			selectedUsers[j] = requestedUsers[i].id;
			j++;
		}
	}

	return selectedUsers;
}

function removeUser(divId, userId) {
	//$(divId + " li[id*=" + userId + "]").css("display", "none");
	$(divId + " li[id*=" + userId + "]").remove();
}

function clickRestrict(restrictCheckBox) {
	if (restrictCheckBox.checked) {
		restrictChecked = true;
		$("#restrict").attr('disabled', '');
		$("#restrictLocation").attr('disabled', '');
		$("#regionListLocating").attr('disabled', '');
	} else {
		restrictChecked = false;
		$("#restrict").attr('disabled', 'disabled');
		$("#restrictLocation").attr('disabled', 'disabled');
		$("#regionListLocating").attr('disabled', 'disabled');
	}
}

function clickFrequency(frequencyCheckBox) {
	frequencyChecked = frequencyCheckBox.checked; 
	if (frequencyChecked) {
		$("#frequency").removeAttr('disabled');
	} else {
		$("#frequency").attr('disabled', 'disabled');
	}
}

function setSpecificHours(value, work_from, work_to) {

	if (value == 1)// all day
	{
		document.getElementById("hourFrom").style.display = "none";
		document.getElementById("minuteFrom").style.display = "none";
		document.getElementById("hourTo").style.display = "none";
		document.getElementById("minuteTo").style.display = "none";
		document.getElementById("hourMinTextFrom").style.display = "none";
		document.getElementById("hourMinTextTo").style.display = "none";
		timeInterval = 1;
	} else if (value == 2)// business hours
	{
		document.getElementById("hourFrom").style.display = "";
		document.getElementById("minuteFrom").style.display = "";
		document.getElementById("hourTo").style.display = "";
		document.getElementById("minuteTo").style.display = "";
		document.getElementById("hourMinTextFrom").style.display = "";
		document.getElementById("hourMinTextTo").style.display = "";

		if (work_from != "" && work_to != "") {
			document.getElementById("hourFrom").value = work_from.substring(0, 2);
			document.getElementById("minuteFrom").value = work_from.substring(3, 5);
			document.getElementById("hourTo").value = work_to.substring(0, 2);
			document.getElementById("minuteTo").value = work_to.substring(3, 5);
		}

		timeInterval = 2;
	}
}

function requestNow() {
	var stopYear;
	var stopMonth;
	var stopHour;
	var tomorrowDate;
	var requestedUsers = getSelectedUsers("#locRequestUserList");
	var locationRequestID = $('#locRequestID').val();

	if (requestedUsers.length > 0) {
		var selectedDuration = $('#locRequestDuration option:selected').val();

		var startDate = new Date();
		var startTime = startDate.getTime();
		var stopHourInt = parseInt(getHour(startTime), 10) + parseInt(selectedDuration);

		if (stopHourInt < 24) {
			stopYear = getYear(startTime);
			stopMonth = parseInt(getMonth(startTime), 10);
			stopDay = getDay(startTime);
			if (stopHourInt < 10)
				stopHour = "0" + stopHourInt.toString();
			else
				stopHour = stopHourInt.toString();
			  stopMinute = getMinute(startTime);
		} else if (stopHourInt == 24) {
			tomorrowDate = new Date();
			tomorrowDate.setDate(tomorrowDate.getDate() + 1);
			stopYear = getYear(tomorrowDate.getTime());
			stopMonth = parseInt(getMonth(tomorrowDate.getTime()), 10);
			stopDay = getDay(tomorrowDate.getTime());
			stopHour = "00";
			stopMinute = getMinute(tomorrowDate.getTime());
		} else if (stopHourInt > 24) {
			stopHourInt = stopHourInt - 24;
			tomorrowDate = new Date();
			tomorrowDate.setDate(tomorrowDate.getDate() + 1);
			stopYear = getYear(tomorrowDate.getTime());
			stopMonth = parseInt(getMonth(tomorrowDate.getTime()), 10);
			stopDay = getDay(tomorrowDate.getTime());
			if (stopHourInt < 10)
				stopHour = "0" + stopHourInt.toString();
			else
				stopHour = stopHourInt.toString();
			stopMinute = getMinute(tomorrowDate.getTime());
		}

		var stopTime = new Date(getYear(startTime), stopMonth.toString(), getDay(startTime), stopHour, getMinute(startTime)).getTime();

		if (locationRequestID == -1) {
			
			var options = {};
			options.data = {
				startTime :startTime,
				stopTime :stopTime,
				duration :selectedDuration,
				selectedUserList :requestedUsers,
				shareOwnLoc :$('#shareOwnLoc').is(':checked')
			};
			options.success = function(json) {
				if (checkResponseSuccess(json)) {
					$('.dialog').dialog('close');
					utils && utils.dialog({title: $.i18n.prop('locationRequests.info.title'), content: json.infoMessage});
				}
			};	
			utils && utils.lbasDoPost('requestNow.action', options);
		} else {
			
			var options = {};
			options.data = {
				startTime: startTime,
				stopTime: stopTime,
				duration: selectedDuration,
				selectedUserList: requestedUsers,
				locationRequestID: locationRequestID,
				viewLocation: 1
			};
			options.success = function(json) {
				if (checkResponseSuccess(json)) {
					$('.dialog').dialog('close');
					utils && utils.dialog({title: $.i18n.prop('locationRequests.info.title'), content: json.infoMessage});
				}
			};	
			utils && utils.lbasDoPost('updateLocationRequest.action', options);
		}
	} else {
		utils && utils.dialog({title:$.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.select.user')});
	}
}

function requestSpecific() 
{
    var requestedUsers = getSelectedUsers("#locRequestUserList");
    if (requestedUsers.length > 0) {
      var startH = $('#start-time .hours').val(),
          startM = $('#start-time .mins').val(),
          endH = $('#end-time .hours').val(),
          endM = $('#end-time .mins').val(),
          frequency = -1,
          locationRequestID = $('#locRequestID').val(),
          dtFrom = $('#date1').datepicker('getDate'),
          dtTo = $('#date2').datepicker('getDate'),
          endDate = new Date(dtTo),
          startDate = new Date(dtFrom),
          today = new Date();
          
          startDate.setHours(startH);
          startDate.setMinutes(startM);
          endDate.setHours(endH);
          endDate.setMinutes(endM);

          
          var fixStartTime ,fixStopTime;
          startM.length == 1 ? fixStartTime = startH+':0'+startM : fixStartTime = startH+':'+startM;
          endM.length == 1 ? fixStopTime = endH+':0'+endM : fixStopTime = endH+':'+endM;
      if (endDate < startDate) {
/*       if (endDate < today || endDate < startDate) { */
        utils && utils.dialog({title:$.i18n.prop('dialog.title.error'), css:"error-dialog-generic-error", content:$.i18n.prop('error.invalid.dateFormat')});
      }else{                        
            if ($("input[name='viewLocation']:checked").val() == 'location_and_report')
                frequency = 10;

            if (locationRequestID == -1) 
            {
                var options = {};
                options.data = 
                {
                    endDate: endDate.getTime(),
                    frequency: ( $('#viewLocationX[value="location_and_report"]').is(':checked') ) ? $('#shareFrequency').selectmenu('value') : '',
                    fromHourMin: fixStartTime,
                    selectedUserList: requestedUsers,
                    shareOwnLoc: $('#shareOwnLoc').is(':checked'),
                    startDate: startDate.getTime(),
                    toHourMin: fixStopTime,
                    reasonMessage: $('.reqPermission #sendSpecialMesTextarea').val()
                };
                options.success = function(json) {
                    if (checkResponseSuccess(json)) {
                      $('.reqPermission').dialog('destroy').remove();
                      utils && utils.dialog({title:$.i18n.prop('locationRequests.info.title'), content: json.infoMessage});
                    }
                };
                utils && utils.lbasDoPost('requestSpecific.action', options);
                }
                else 
                {
					
                    var options = {};
                    options.data = 
                    {
                        endDate: endDate.getTime(),
                        frequency: ( $('#viewLocationX[value="location_and_report"]').is(':checked') ) ? $('#shareFrequency').selectmenu('value') : '',
                        fromHourMin: '',
                        selectedUserList: requestedUsers,
                        shareOwnLoc: $('#shareOwnLoc').is(':checked'),
                        startDate: startDate.getTime(),
                        toHourMin: '',
                        requestType: 2,
                        locationRequestID: locationRequestID
                    };
                    options.success = function(json) {
                        if (checkResponseSuccess(json)) {
                            $('.dialog').dialog('close');
                            utils && utils.dialog({title:$.i18n.prop('locationRequests.info.title'), content: json.infoMessage});
                        }
                    };
                    utils && utils.lbasDoPost('updateLocationRequest.action', options); 
                }
        }
    } 
    else 
    {
        utils && utils.dialog({title:$.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.select.user')});
    }
}

function requestAlways() {
	
    var reqUsers = getSelectedUsers("#locRequestUserList");
        
    if (reqUsers.length > 0) 
    {
		
        var freq = -1;
        var locationRequestID = $('#locRequestID').val();

        if ($("input[name='viewLocation']:checked").val() == 'location_and_report')
            freq = 10;

                
        if (locationRequestID == -1) 
        {
            var options = {};
            options.data = {
                    frequency: ( $('#viewLocationX[value="location_and_report"]').is(':checked') ) ? $('#shareFrequency').selectmenu('value') : '',
                    selectedUserList: reqUsers,
                    shareOwnLoc: $('#shareOwnLoc').is(':checked'),
                    reasonMessage: $('.reqPermission #sendSpecialMesTextarea').val()
            };

            
            options.success = function(json) {
                    if (checkResponseSuccess(json)) {
                            $('.reqPermission').remove().dialog('close');
                            utils && utils.dialog({title:$.i18n.prop('locationRequests.info.title'), content: json.infoMessage});
                    }
            };

            utils && utils.lbasDoPost('requestAlways.action', options);
        } 
        else 
        {
            var options = {};
            options.data = {
                frequency: $('#shareFrequency').selectmenu('value'),
                selectedUserList: reqUsers,
                locationRequestID: locationRequestID,
                requestType: 3
            };
            options.success = function(json) {
                if (checkResponseSuccess(json)) {
                    $('.reqPermission').remove().dialog('close');
                    utils && utils.dialog({title:$.i18n.prop('locationRequests.info.title'), content: json.infoMessage});
                }
            };

            utils && utils.lbasDoPost('updateLocationRequest.action', options);

        }
		
    } 
    else 
    {
        utils && utils.dialog({title:$.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.select.user')});
    }
}

function request()
{
     
     var req = radioValue;

     if (req == 'permanent')
         requestAlways();
     
     if (req == 'temporary')
         requestSpecific();
     
}

function selectRadio(value) {
	radioValue = value;
	switch (value) {
	case "1": {
		document.getElementById("now").style.display = "";
		document.getElementById("specific").style.display = "none";
		document.getElementById("always").style.display = "none";
		break;
	}
	case "2": {
		document.getElementById("now").style.display = "none";
		document.getElementById("specific").style.display = "";
		document.getElementById("always").style.display = "";
		break;
	}
	case "3": {
		document.getElementById("now").style.display = "none";
		document.getElementById("specific").style.display = "none";
		document.getElementById("always").style.display = "";
		break;
	}
	}
}

function selectLocationRequests(type) {
	if (type == "incoming") {
		$('#incomingLocRequestLink').removeClass("simpleLinkNotSelected");
		$('#incomingLocRequestLink').addClass("simpleLinkSelected");
		$('#outgoingLocRequestLink').removeClass("simpleLinkSelected");
		$('#outgoingLocRequestLink').addClass("simpleLinkNotSelected");
		$('#incomingLocationRequests').show();
		$('#outgoingLocationRequests').hide();
	} else if (type == "outgoing") {
		$('#outgoingLocRequestLink').removeClass("simpleLinkNotSelected");
		$('#outgoingLocRequestLink').addClass("simpleLinkSelected");
		$('#incomingLocRequestLink').removeClass("simpleLinkSelected");
		$('#incomingLocRequestLink').addClass("simpleLinkNotSelected");
		$('#outgoingLocationRequests').show();
		$('#incomingLocationRequests').hide();
	}

}

function openEditOutgoingLocRequestDialog() {
	$("#edit_outgoing_loc_request_dialog").dialog({
		modal :glbmodal,
		width :700,
		height :300,
		bgiframe :true,
		close :function(event, ui) {
			$("#edit_outgoing_loc_request_dialog").dialog('destroy');
		}
	});

	$("#edit_outgoing_loc_request_dialog").dialog('option', 'title', name);
	$("#edit_outgoing_loc_request_dialog").dialog('open');
}

function viewLocationRequestDialog(type, locationRequestID) {
	if (type == 'outgoing') {
		$("#view_loc_request_dialog").dialog({
			width :500,
			height :150,
			bgiframe :true,
			close :function(event, ui) {
				$("#view_loc_request_dialog").dialog('destroy');
			}
		});
		// openEditOutgoingLocRequestDialog();

		$.ajax({
			url :'viewLocationRequest.action',
			type :'POST',
			dataType :'json',
			data :{
				'locationRequestID' :locationRequestID,
				'type' :type
			},
			success :function(json) {

				if (json.type == 'outgoing') {
					$('#view_loc_request_dialog').html(parseTemplate("locationRequestOutgoingViewTemplate", {
						json :json
					}));
				}

				$("#view_loc_request_dialog").dialog('option', 'title', title);

			}
		});

		// IE7 fix
		$("#view_loc_request_dialog").css("height", "150");

	} else if (type == 'incoming' || type == 'accepted' || type == 'shared') {
		$("#view_loc_request_dialog").dialog({
			width :500,
			height :150,
			bgiframe :true,
			close :function(event, ui) {
				$("#view_loc_request_dialog").dialog('destroy');
			}
		});

		var title;
		if (type == 'incoming') {
			title = $.i18n.prop('locationRequests.locationRequest');
		} else if (type == 'accepted' || type == 'shared') {
			title = $.i18n.prop('locationRequests.whoCanSeeYorLoc');
		}

		// $("#view_loc_request_dialog").load('viewLocationRequest', {
		// 'locationRequestID' :locationRequestID,
		// 'type' :type
		// });

		$.ajax({
			url :'viewLocationRequest.action',
			type :'POST',
			dataType :'json',
			data :{
				'locationRequestID' :locationRequestID,
				'type' :type
			},
			success :function(json) {

				if (json.type == 'accepted') {
					$('#view_loc_request_dialog').html(parseTemplate("locationRequestAcceptedViewTemplate", {
						json :json
					}));
				} else if (json.type == 'incoming') {
					$('#view_loc_request_dialog').html(parseTemplate("locationRequestIncomingViewTemplate", {
						json :json
					}));
				} else if (json.type == 'outgoing') {
					$('#view_loc_request_dialog').html(parseTemplate("locationRequestOutgoingViewTemplate", {
						json :json
					}));
				}

				$("#view_loc_request_dialog").dialog('option', 'title', title);

			}
		});

		// IE7 fix
		$("#view_loc_request_dialog").css("height", "150");

	}
}

function answerLocationRequest(locationRequestID, accepted, type ,profileID) {

	// alert("answerLocationRequest locationRequestID: " + locationRequestID + " type: " + type);

	var currentTime = new Date().getTime();
	$.post("answerLocationRequest.action", {
		'visibilityProfileId':profileID,
		'locationRequestID' :locationRequestID,
		'accepted' :accepted,
		'currentTime' :currentTime,
		'type' :type
	}, function(data) {
		// success or failure: in both cases remove blocking mode
		$('#locationRequestMessageDetailContent').unblock();

		if (checkResponseSuccess(data)) {

			$('#locationrequestinboxbuttons').hide();
			if (accepted) {
				$('#locationRequestAnswerStatusId').html($.i18n.prop('messageDetail.ACCEPTED'));
			} else {
				$('#locationRequestAnswerStatusId').html($.i18n.prop('messageDetail.DENIED'));
			}

			if ($('#usersLeftNavDiv').is(':visible')) {
				userTabNavigate('locationRequests', true);
			}

			$('span.ui-icon-closethick:last').click();

			if (type == 'incoming' && accepted == false) {
				$("#editIncomingLocReq" + locationRequestID).css("display", "none");
			}
			if (type == 'accepted' && accepted == false) {
				$("#editAcceptedLocReq" + locationRequestID).css("display", "none");
			}
			if (type == 'shared' && accepted == false) {
				$("#editSharedLocReq" + locationRequestID).css("display", "none");
			}
			if (type == 'outgoing' && accepted == false) {
				$("#editOutgoingLocReq" + locationRequestID).css("display", "none");
			}
		utils.dialogSuccess(data.infoMessage);
		loadInnerTabs('pages/inbox.jsp','INBOX', 'messages', '#tab-inbox-requests' );
		
		}
	}, "json");

}

function sendReminderForLocationRequest(linkObj, locationRequestID, userID) {
	$.post("sendReminderForLocationRequest", {
		'locationRequestID' :locationRequestID,
		'userID' :userID
	});
	linkObj.parentNode.removeChild(linkObj);
}

function editLocationRequest(locationRequestID) {
	var startTime = new Date().getTime();
	var stopTime = new Date().getTime();

	var dialogTitle = $.i18n.prop('locationRequests.locationRequest');
	$("#locationRequestDialog").dialog({
		modal :glbmodal,
		title :dialogTitle,
		width :650,
		height :280,
		bgiframe :true,
		close :function(event, ui) {
			$("#locationRequestDialog").dialog('destroy');
		}
	});

	$.ajax({
		url :'locationRequest.action',
		type :'POST',
		dataType :'json',
		data :{
			'locationRequestID' :locationRequestID,
			'type' :type,
			'startTime' :startTime,
			'stopTime' :stopTime
		},
		success :function(json) {

			if (checkResponseSuccess(json)) {
				var selectedUserList = [];
				for ( var i = 0; i < json.userList.length; i++) {
					selectedUserList.push(json.userList[i].user_id + ":" + json.userList[i].fullName);
				}

				$('#locationRequestDialog').html(parseTemplate("locationRequestTemplate", {
					selectedUserList :selectedUserList,
					startTime :json.startTime,
					stopTime :json.stopTime,
					viewLocation :json.viewLocation,
					locationRequestID :json.locationRequestID,
					work_from :json.work_from,
					work_to :json.work_to,
					operation :'update',
					duration :json.duration,
					frequency :json.frequency,
					restrictDistance :json.restrictDistance,
					restrictRegion :json.restrictRegion,
					restrictLocation :json.restrictLocation,
					restrictEnable :json.restrictEnable,
					regionListLocating :json.regionListLocating
				}));

				$("#locationRequestDialog").dialog('option', 'title', dialogTitle);
				$("#locationRequestDialog").dialog('open');
			} else {
				$("#locationRequestDialog").dialog('close');
			}
		}
	});

}

function prepareComboBoxes() {
	var freqEnable = $("#frequencyCheck").attr("checked");
	var restrEnable = $("#restrictCheck").attr("checked");

	if (!freqEnable)
		$("#frequency").attr('disabled', 'disabled');
	if (!restrEnable) {
		$("#restrict").attr('disabled', 'disabled');
		$("#restrictLocation").attr('disabled', 'disabled');
		$("#regionListLocating").attr('disabled', 'disabled');
	}
}

function prepareFromDate(startTimeStamp) {

	$("#dayFrom option").filter(function() {
		return $(this).attr('value') == getDay(startTimeStamp);
	}).attr('selected', 'selected');

	var month;
	var monthInt = parseInt(getMonth(startTimeStamp), 10) + 1;
	if (monthInt < 10)
		month = "0" + monthInt.toString();
	else
		month = monthInt.toString();

	$("#monthFrom option").filter(function() {
		return $(this).attr('value') == month;
	}).attr('selected', 'selected');
	$("#yearFrom option").filter(function() {
		return $(this).attr('value') == getYear(startTimeStamp);
	}).attr('selected', 'selected');
	$("#hourFrom option").filter(function() {
		return $(this).attr('value') == getHour(startTimeStamp);
	}).attr('selected', 'selected');
	$("#minuteFrom option").filter(function() {
		return $(this).attr('value') == getMinute(startTimeStamp);
	}).attr('selected', 'selected');
}

function prepareToDate(stopTimeStamp) {

	$("#dayTo option").filter(function() {
		return $(this).attr('value') == getDay(stopTimeStamp);
	}).attr('selected', 'selected');

	var month;
	var monthInt = parseInt(getMonth(stopTimeStamp), 10) + 1;
	if (monthInt < 10)
		month = "0" + monthInt.toString();
	else
		month = monthInt.toString();

	$("#monthTo option").filter(function() {
		return $(this).attr('value') == month;
	}).attr('selected', 'selected');
	$("#yearTo option").filter(function() {
		return $(this).attr('value') == getYear(stopTimeStamp);
	}).attr('selected', 'selected');
	$("#hourTo option").filter(function() {
		return $(this).attr('value') == getHour(stopTimeStamp);
	}).attr('selected', 'selected');
	$("#minuteTo option").filter(function() {
		return $(this).attr('value') == getMinute(stopTimeStamp);
	}).attr('selected', 'selected');
}

function calculateLastTrackedTime(pos_time) {

	var lastTrackedTime = "";
	var result = "";
	var today = new Date().getTime();
	var one_day = 1000 * 60 * 60 * 24;
	var one_hour = 1000 * 60 * 60;
	var one_minute = 1000 * 60;
	var dayDiff = Math.ceil((today - pos_time) / (one_day));
	var dayHour;
	var dayMinute;

	if (dayDiff > 0) {
		if (dayDiff == 1) {
			dayHour = Math.ceil((today - pos_time) / (one_hour));
			if (dayHour == 1) {
				dayMinute = Math.ceil((today - pos_time) / (one_minute));
				lastTrackedTime = ": " + dayMinute + " " + $.i18n.prop('locationRequest.minute') + ' ';

			} else {
				lastTrackedTime = ": " + dayHour + " " + $.i18n.prop('locationRequest.hour') + ' ';

			}
		} else {
			lastTrackedTime = ": " + dayDiff + " " + $.i18n.prop('locationRequest.day') + ' ';
		}

		result = $.i18n.prop('locationRequest.last.tracked', [ lastTrackedTime ]);
	}

	return result;
}
function populateIncomingRequests(data) {
	var str = parseTemplate("incomingLocationRequestTemplate", {
		incomingLocationRequestList :data
	});
	return str;
}

function populateOutgoingRequests(data) {
	var str = parseTemplate("outgoingLocationRequestTemplate", {
		outgoingLocationRequestList :data
	});
	return str;
}

function populateSharedRequests(sharedLocationList, acceptedLocationRequestList) {
	var str = parseTemplate("sharedLocationsTemplate", {
		sharedLocationList :sharedLocationList,
		acceptedLocationRequestList :acceptedLocationRequestList
	});
	return str;
}

function showHideTable(id, iconId) {
	if (document.getElementById(id).style.display == "none") {
		if ($(iconId).attr('src') == contextPath + '/images/arrow_right4x7.gif')
			$(iconId).attr('src', contextPath + '/images/arrow_down7x4.gif');
		show(id);
	} else {
		if ($(iconId).attr('src') == contextPath + '/images/arrow_down7x4.gif')
			$(iconId).attr('src', contextPath + '/images/arrow_right4x7.gif');
		hide(id);
	}
}

function prepareStartDateForAcceptedLocRequest(timestamp) {
	if (timestamp != -1)
		$("#acceptedStartTime").text(getDate(timestamp) + " " + $.i18n.prop('locationRequests.content.to'));
}

function prepareStopDateForAcceptedLocRequest(timestamp) {
	if (timestamp != -1)
		$("#acceptedStopTime").text(getDate(timestamp));
}

function prepareStartDateForIncomingLocRequest(timestamp) {
	if (timestamp != -1)
		$("#incomingStartTime").text(getDate(timestamp) + " " + $.i18n.prop('locationRequests.content.to'));
}

function prepareStopDateForIncomingLocRequest(timestamp) {
	if (timestamp != -1)
		$("#incomingStopTime").text(getDate(timestamp));
}

function prepareStartDateForOutgoingLocRequest(timestamp) {
	if (timestamp != -1)
		$("#outgoingStartTime").text(getDate(timestamp) + " " + $.i18n.prop('locationRequests.content.to'));
}

function prepareStopDateForOutgoingLocRequest(timestamp) {
	if (timestamp != -1)
		$("#outgoingStopTime").text(getDate(timestamp));
}