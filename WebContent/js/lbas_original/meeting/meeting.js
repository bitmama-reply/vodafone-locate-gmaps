var radioShowEtaLocation = 0;
// name,address,latitude,longitude
var addressSearch = new AddressSearch("", "", null, null);
var selectedCalendarDate = new Date();

function changeMeetingStopTime() {
	var yearFromMeeting = $('#yearFromMeeting option:selected').val();
	var monthFromMeeting = $('#monthFromMeeting option:selected').val();
	var dayFromMeeting = $('#dayFromMeeting option:selected').val();
	var hourFromMeeting = $('#hourFromMeeting option:selected').val();
	var minuteFromMeeting = $('#minuteFromMeeting option:selected').val();

	var startTimeStamp = new Date(yearFromMeeting, monthFromMeeting, dayFromMeeting, hourFromMeeting, minuteFromMeeting);
	var stopTimeStamp = startTimeStamp.getTime() + 30 * 60 * 1000;
	var month = getMonth(stopTimeStamp);

	$("#yearToMeeting").val(getYear(stopTimeStamp));
	$("#monthToMeeting").val(parseInt(month, 10));
	$("#dayToMeeting").val(getDay(stopTimeStamp));
	$("#hourToMeeting").val(getHour(stopTimeStamp));
	$("#minuteToMeeting").val(getMinute(stopTimeStamp));
}

function newMeetingDialogReady() {
	var localeToBeUsed = userLocale == 'en' ? '' : (userLocale == null ? '' : userLocale);

	$("#datepickerStart").datepicker($.extend({}, $.datepicker.regional['' + localeToBeUsed + ''], {
		showMonthAfterYear :false,
		showOn :'button',
		dateFormat :'dd/mm/yy',
		buttonImage :'images/calendar.png',
		buttonImageOnly :true,
		minDate :new Date(),
		onSelect :function(dateText, inst) {
			var daystart = $("#datepickerStart").datepicker("getDate");

			$("#datepickerStop").datepicker("option", "minDate", daystart);
			$("#datepickerStop").datepicker("setDate", daystart);

			$("#dayFromMeeting").val($.datepicker.formatDate('dd', daystart));
			$("#dayToMeeting").val($.datepicker.formatDate('dd', daystart));

			$("#monthFromMeeting").val($.datepicker.formatDate('m', daystart - 1));
			$("#monthToMeeting").val($.datepicker.formatDate('m', daystart - 1));

			$("#yearFromMeeting").val($.datepicker.formatDate('yy', daystart));
			$("#yearToMeeting").val($.datepicker.formatDate('yy', daystart));

		}
	}));
	$("#datepickerStop").datepicker($.extend({}, $.datepicker.regional['' + localeToBeUsed + ''], {
		showMonthAfterYear :false,
		showOn :'button',
		dateFormat :'dd/mm/yy',
		buttonImage :'images/calendar.png',
		buttonImageOnly :true,
		minDate :new Date(),
		onSelect :function(dateText, inst) {
			var daystop = $("#datepickerStop").datepicker("getDate");

			$("#dayToMeeting").val($.datepicker.formatDate('dd', daystop));
			$("#monthToMeeting").val($.datepicker.formatDate('m', daystop - 1));
			$("#yearToMeeting").val($.datepicker.formatDate('yy', daystop));

		}
	}));

	$("#yearFromMeeting").change(function() {
		$("#yearToMeeting").val($("#yearFromMeeting").val());
	});

	$("#monthFromMeeting").change(function() {
		$("#monthToMeeting").val($("#monthFromMeeting").val());
	});

	$("#dayFromMeeting").change(function() {
		$("#dayToMeeting").val($("#dayFromMeeting").val());
	});

	$("#hourFromMeeting").change(function() {
		// $("#hourToMeeting").val($("#hourFromMeeting").val());
		changeMeetingStopTime();
	});

	$("#minuteFromMeeting").change(function() {
		// $("#minuteToMeeting").val($("#minuteFromMeeting").val());
		changeMeetingStopTime();
	});
	registerValidations("createMeeting");
	// add for validate subject , detail , email
	registerValidations("secondpart");
}

function editMeetingDialogReady(startTimeStamp, endTimeStamp, existingUsers, meetingAddress) {
	prepareMeetingDateCombos(new Date());
	showMeetingDateCombos(startTimeStamp, endTimeStamp);
	prepareAutoCompleteOperations();

	$("#meetingUsers").tokenInput("userSearchMeetingAutocomplete.action", {
		type :"POST",
		minChars :2,
		prePopulate :existingUsers,
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
	$(".token-input-dropdown-facebook").css("position", "relative");

	var localeToBeUsed = userLocale == 'en' ? '' : (userLocale == null ? '' : userLocale);

	$("#datepickerStart").datepicker($.extend({}, $.datepicker.regional['' + localeToBeUsed + ''], {
		showMonthAfterYear :false,
		showOn :'button',
		dateFormat :'dd/mm/yy',
		buttonImage :'images/calendar.png',
		buttonImageOnly :true,
		minDate :new Date(),
		onSelect :function(dateText, inst) {
			var daystart = $("#datepickerStart").datepicker("getDate");

			$("#datepickerStop").datepicker("option", "minDate", $("#datepickerStart").datepicker("getDate"));
			$("#datepickerStop").datepicker("setDate", $("#datepickerStart").datepicker("getDate"));

			$("#dayFromMeeting").val($.datepicker.formatDate('dd', $("#datepickerStart").datepicker("getDate")));
			$("#dayToMeeting").val($.datepicker.formatDate('dd', $("#datepickerStart").datepicker("getDate")));

			$("#monthFromMeeting").val($.datepicker.formatDate('m', $("#datepickerStart").datepicker("getDate")) - 1);
			$("#monthToMeeting").val($.datepicker.formatDate('m', $("#datepickerStart").datepicker("getDate")) - 1);

			$("#yearFromMeeting").val($.datepicker.formatDate('yy', $("#datepickerStart").datepicker("getDate")));
			$("#yearToMeeting").val($.datepicker.formatDate('yy', $("#datepickerStart").datepicker("getDate")));

		}
	}));
	$("#datepickerStop").datepicker($.extend({}, $.datepicker.regional['' + localeToBeUsed + ''], {
		showMonthAfterYear :false,
		showOn :'button',
		dateFormat :'dd/mm/yy',
		buttonImage :'images/calendar.png',
		buttonImageOnly :true,
		minDate :new Date(),
		onSelect :function(dateText, inst) {
			$("#dayToMeeting").val($.datepicker.formatDate('dd', $("#datepickerStop").datepicker("getDate")));
			$("#monthToMeeting").val($.datepicker.formatDate('m', $("#datepickerStop").datepicker("getDate")) - 1);
			$("#yearToMeeting").val($.datepicker.formatDate('yy', $("#datepickerStop").datepicker("getDate")));

		}
	}));

	$("#yearFromMeeting").change(function() {
		$("#yearToMeeting").val($("#yearFromMeeting").val());
	});
	$("#monthFromMeeting").change(function() {
		$("#monthToMeeting").val($("#monthFromMeeting").val());
	});

	$("#dayFromMeeting").change(function() {
		$("#dayToMeeting").val($("#dayFromMeeting").val());
	});

	$("#hourFromMeeting").change(function() {
		// $("#hourToMeeting").val($("#hourFromMeeting").val());
		changeMeetingStopTime();
	});

	$("#minuteFromMeeting").change(function() {
		// $("#minuteToMeeting").val($("#minuteFromMeeting").val());
		changeMeetingStopTime();
	});

	registerValidations("editMeeting");
	// add for validate subject
	registerValidations("secondpart");

	var updatedAddress = checkMeetingAddress(meetingAddress);
	$("#nameOfaLocation").val(updatedAddress);
}

function createNewMeeting(loadEnabled, latitude, longitude, invitees, dateparam, endDate) {
  console.log("createNewMeeting  190");
	selectedCalendarDate = dateparam;
	// resetAddressMeeting();
	$("#viewMeetingDialog").dialog('close');

	// true ise yeniden yaratir,bos sayfa gelir. false ise sadece gorunur
	// olur.
	var dialogTitle = "";

	if (loadEnabled == true) {
		dialogTitle = $.i18n.prop('meetings.title.create');
	}
	if (loadEnabled == false) {
		dialogTitle = $.i18n.prop('meetings.title.edit');
	}

	if (loadEnabled == true) {

		$("#meetingNewDialog").dialog({
			autoOpen :false,
			title :dialogTitle,
			width :380,
			bgiframe :true,
			modal :glbmodal,
			resizable :false,
			close :function(event, ui) {
				$("#meetingNewDialog").dialog('destroy');
			}
		}).height("auto");

		// newMeeting.action yalnizca regionList i getirir baska bisii yapmaz.
		$.ajax({
/* 			url :'newMeeting.action', */
			url: 'addNewMeeting.action',
			type :'POST',
			async :false,
			data: {
  			
			},
			dataType :'json',
			success :function(json) {
				if (checkResponseSuccess(json)) {
					$('#meetingNewDialog').html(parseTemplate("meetingCreateNewTemplate", {
						json :json
					}));

					$("#meetingNewDialog").dialog('option', 'title', dialogTitle);
					$("#meetingNewDialog").dialog('open');
				}
			}
		});

		if (endDate != null) {
			prepareMeetingDateComboValues(dateparam, endDate);
		} else {
			if (dateparam) {
				prepareMeetingDateCombos(dateparam);
			} else {
				prepareMeetingDateCombos(new Date());
			}
		}

		prepareAutoCompleteOperations();

		$("#meetingUsers").tokenInput("userSearchMeetingAutocomplete.action", {
			type :"POST",
			minChars :2,
			prePopulate :invitees,
			noResultsText :$.i18n.prop('no.results.text'),
			onResult :function(sonuc) {
				// show scroll while selecting user from search results
				$('div[aria-labelledby="ui-dialog-title-meetingNewDialog"]').css('overflow-y', 'auto');
				$('div[aria-labelledby="ui-dialog-title-meetingNewDialog"]').css('overflow-x', 'hidden');

				return sonuc;
			},
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
		$(".token-input-dropdown-facebook").css("position", "relative");

	} else {

		$("#meetingNewDialog").dialog({
			autoOpen :false,
			modal :glbmodal,
			title :dialogTitle,
			width :380,
			bgiframe :true,
			resizable :false,
			close :function(event, ui) {
				$("#meetingNewDialog").dialog('destroy');
			}
		}).height("auto");

		$.ajax({
/* 			url :'newMeeting.action', */
      url: 'addNewMeeting.action',  
			type :'POST',
			async :false,
			dataType :'json',
			success :function(json) {
				if (checkResponseSuccess(json)) {
					$('#meetingNewDialog').html(parseTemplate("meetingCreateNewTemplate", {
						json :json
					}));
					$("#meetingNewDialog").dialog('option', 'title', dialogTitle);
					$("#meetingNewDialog").dialog('open');
				}
			}
		});

		prepareAutoCompleteOperations();

	}

	// while showing token input search results, blur attribute block scroll manually then we unbind it
	if ($('#meetingAttendees').find('.token-input-list-facebook input') != null) {
		$('#meetingAttendees').find('.token-input-list-facebook input').unbind('blur');
	}

	// removeAllMarkers();
}

function selectShowEtaLocation(value) {

	radioShowEtaLocation = value;
}

// listMeetings($("#datepicker").datepicker('getDate'),"listMeetingScroll","idlistMeetingScroll");
function listMeetings(selectedDate, divId, templateName) {
	// /dd/mm/yy

	// method for meeting list in left meeting menu.
	//

	var d2 = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
	var d3 = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59);

	$.ajax({
		url :'listMeeting.action',
		type :'POST',
		async :false,
		data :{
			selectedStartTimeMillis :d2.getTime(),
			selectedEndTimeMillis :d3.getTime()
		},
		dataType :'json',
		success :function(json) {

			$('#' + divId).html('');
			$('#' + divId).html(parseTemplate(templateName, {
				json :json
			}));
			var localeToBeUsed = userLocale == 'en' ? '' : (userLocale == null ? '' : userLocale);
			if (localeToBeUsed == 'de') {

				$("#meetingDateTitle").text($.datepicker.formatDate('DD, d. MM yy', new Date(), {
					dayNamesShort :$.datepicker.regional['' + localeToBeUsed + ''].dayNamesShort,
					dayNames :$.datepicker.regional['' + localeToBeUsed + ''].dayNames,
					monthNamesShort :$.datepicker.regional['' + localeToBeUsed + ''].monthNamesShort,
					monthNames :$.datepicker.regional['' + localeToBeUsed + ''].monthNames
				}));

			} else {

				$("#meetingDateTitle").text($.datepicker.formatDate('DD, MM d, yy', new Date(), {
					dayNamesShort :$.datepicker.regional['' + localeToBeUsed + ''].dayNamesShort,
					dayNames :$.datepicker.regional['' + localeToBeUsed + ''].dayNames,
					monthNamesShort :$.datepicker.regional['' + localeToBeUsed + ''].monthNamesShort,
					monthNames :$.datepicker.regional['' + localeToBeUsed + ''].monthNames
				}));
			}
		}
	});

}

function updateViewMeeting(id, loadEnabled) {
	resetAddressMeeting();
	$("#viewMeetingDialog").dialog('close');

	var dialogTitle = $.i18n.prop('meetings.title.edit');
	$("#meetingNewDialog").dialog({
		autoOpen :false,
		modal :glbmodal,
		title :dialogTitle,
		width :380,
		bgiframe :true,
		resizable :false,
		close :function(event, ui) {
			$("#meetingNewDialog").dialog('destroy');
		}
	}).height("auto");

	if (loadEnabled != true) {
		$.ajax({
			url :'updateViewMeeting.action',
			type :'POST',
			async :false,
			data :{
				meetingID :id
			},
			dataType :'json',
			success :function(json) {
				if (checkResponseSuccess(json)) {
					$('#meetingNewDialog').html(parseTemplate("meetingEditTemplate", {
						json :json
					}));

					$("#meetingNewDialog").dialog('option', 'title', dialogTitle);
					$("#meetingNewDialog").dialog('open');
				}
			}
		});

	}

}

function openEditMeetingDialog(id, dialogTitle) {
	resetAddressMeeting();
	$("#meetingNewDialog").dialog('close');
	$("#viewMeetingDialog").dialog('close');
	$("#viewMeetingDialog").dialog({
		modal :glbmodal,
		title :dialogTitle,
		bgiframe :true,
		resizable :false,
		close :function(event, ui) {
			$("#viewMeetingDialog").dialog('destroy');
		}
	}).height("auto");

	$.ajax({
		url :'viewMeeting.action',
		type :'POST',
		async :false,
		data :{
			meetingID :id,
			localeTime :new Date().getTime()
		},
		dataType :'json',
		success :function(json) {
			$('#viewMeetingDialog').html('');
			$('#viewMeetingDialog').html(parseTemplate("meetingViewTemplate", {
				json :json
			}));
		}
	});
}

function deleteMeeting(meetingID) {
	var btns = {};
	btns[$.i18n.prop('buttons.ok')] = function() {
		$.ajax({
			url :"deleteMeeting.action",
			type :'POST',
			data :{
				meetingID :meetingID
			},
			dataType :'json',
			success :function(json) {
				if (json.errorText == null) {
					mainMarkerManager.removeAllMarkers();
				}
			}
		});

		$(this).dialog('close');
		$(this).dialog('destroy');
		$("#viewMeetingDialog").dialog('destroy');
		var calendar = $('#calendar').fullCalendar('removeEvents', meetingID);
	};
	btns[$.i18n.prop('buttons.cancel')] = function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
		$("#viewMeetingDialog").dialog('destroy');
	};

	$("#deleteConfirmation").css("display", "block");
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

}

function preUpdateMeeting() {

	var yearFromMeeting = $('#yearFromMeeting option:selected').val();
	var monthFromMeeting = $('#monthFromMeeting option:selected').val();
	var dayFromMeeting = $('#dayFromMeeting option:selected').val();
	var hourFromMeeting = $('#hourFromMeeting option:selected').val();
	var minuteFromMeeting = $('#minuteFromMeeting option:selected').val();

	var yearToMeeting = $('#yearToMeeting option:selected').val();
	var monthToMeeting = $('#monthToMeeting option:selected').val();
	var dayToMeeting = $('#dayToMeeting option:selected').val();
	var hourToMeeting = $('#hourToMeeting option:selected').val();
	var minuteToMeeting = $('#minuteToMeeting option:selected').val();

	var startTimeStamp = new Date(yearFromMeeting, monthFromMeeting, dayFromMeeting, hourFromMeeting, minuteFromMeeting);
	var stopTimeStamp = new Date(yearToMeeting, monthToMeeting, dayToMeeting, hourToMeeting, minuteToMeeting);

	var today = new Date();

	var invalidDate = validateMeetingTime(startTimeStamp, stopTimeStamp);

	if (!invalidDate) {
		var d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, today.getHours(), today.getMinutes());
		var d3 = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate(), 23, 59);

		var btns = {};
		btns[$.i18n.prop('buttons.ok')] = function() {
			updateMeeting();
			$(this).dialog('close');
			$(this).dialog('destroy');
			return;
		};
		btns[$.i18n.prop('buttons.cancel')] = function() {
			$(this).dialog('close');
			$(this).dialog('destroy');
		};

		$.ajax({
			url :'listMeeting.action',
			type :'POST',
			async :false,
			data :{
				selectedStartTimeMillis :d2.getTime(),
				selectedEndTimeMillis :d3.getTime()
			},
			dataType :'json',
			success :function(json) {

				var meeting, meetingStart, meetingEnd;
				var conflictFound = false;

				var meetingId = parseFloat($('#editMeeting_meeting_id').val());

				for ( var i = 0; i < json.meetingList.length; i++) {

					meeting = json.meetingList[i];
					if (meetingId != parseFloat(meeting.id)) {
						meetingStart = parseFloat(meeting.start_timestamp);
						meetingEnd = parseFloat(meeting.end_timestamp);

						if ((meetingStart <= startTimeStamp && meetingEnd >= startTimeStamp)
								|| (meetingStart <= stopTimeStamp && meetingEnd >= stopTimeStamp)) {

							conflictFound = true;

							$("#errorMessage").dialog({
								autoOpen :false,
								title :$.i18n.prop('buttons.delete'),
								bgiframe :true,
								width :300,
								modal :glbmodal,
								resizable :false,
								buttons :btns
							}).height("auto");

							$("#errorMessage [id*='errorText']").text($.i18n.prop('meetings.conflict'));
							$("#errorMessage").dialog("open");
							$("#errorMessage").dialog("moveToTop");
						}
					}
				}
				if (!conflictFound) {
					updateMeeting();
				}

			}
		});
	}
}

function updateMeeting() {

	var yearFromMeeting = $('#yearFromMeeting option:selected').val();
	var monthFromMeeting = $('#monthFromMeeting option:selected').val();
	var dayFromMeeting = $('#dayFromMeeting option:selected').val();
	var hourFromMeeting = $('#hourFromMeeting option:selected').val();
	var minuteFromMeeting = $('#minuteFromMeeting option:selected').val();

	var yearToMeeting = $('#yearToMeeting option:selected').val();
	var monthToMeeting = $('#monthToMeeting option:selected').val();
	var dayToMeeting = $('#dayToMeeting option:selected').val();
	var hourToMeeting = $('#hourToMeeting option:selected').val();
	var minuteToMeeting = $('#minuteToMeeting option:selected').val();

	var startTimeStamp = new Date(yearFromMeeting, monthFromMeeting, dayFromMeeting, hourFromMeeting, minuteFromMeeting).getTime();
	var stopTimeStamp = new Date(yearToMeeting, monthToMeeting, dayToMeeting, hourToMeeting, minuteToMeeting).getTime();

	var invalidDate = validateMeetingTime(new Date(startTimeStamp), new Date(stopTimeStamp));

	if (!invalidDate) {
		var latlon;

		var null_var = null;

		if ($("#nameOfaLocation").val() == "") {
			setAddressSearchForMeeting("", "", null, null);
		}

		if (addressSearch.name == "-") {
			latlon = "&latitude=" + "&longitude=";
		}

		if (addressSearch.address == "" && addressSearch.latitude == null && addressSearch.longitude == null) {

			if ($('#meetingLocationLatitude').val() == null) {
				latlon = "&latitude=" + null_var + "&longitude=" + null_var;
			} else {
				latlon = "&latitude=" + $('#meetingLocationLatitude').val() + "&longitude=" + $('#meetingLocationLongitude').val();
			}

		}

		if (addressSearch.latitude != null && addressSearch.longitude != null) {
			latlon = "&latitude=" + addressSearch.latitude + "&longitude=" + addressSearch.longitude;
		}

		var serializedFormData = $('#editMeeting').serialize();

		$.ajax({
			type :'POST',
			url :'updateMeeting.action',
			data :serializedFormData + "&startTimeStamp=" + startTimeStamp + "&stopTimeStamp=" + stopTimeStamp + latlon,
			success :function(ajaxCevap) {
				if (checkResponseSuccess(ajaxCevap)) {
					$("#meetingNewDialog").dialog('close');

					// remove old event
					var eventID = $('#editMeeting_meeting_id').val();
					$('#calendar').fullCalendar('removeEvents', eventID);
					// then add new event
					$('#calendar').fullCalendar('renderEvent', {
						id :ajaxCevap.meeting.id,
						title :$('#meetingSubject').val(),
						start :new Date(startTimeStamp),
						end :new Date(stopTimeStamp),
						allDay :false
					}, true);

					if (ajaxCevap.meetingLocationChanged && $("#calendarCenterDiv").css("display") == "none") {
						resetAddressMeeting();
						showMeetingAndAttendeePointsOnMap(ajaxCevap.meeting.id);
					}
				}
			}
		});
	}
}

function preSaveMeeting(sendinvite) {

	var yearFromMeeting = $('#yearFromMeeting option:selected').val();
	var monthFromMeeting = $('#monthFromMeeting option:selected').val();
	var dayFromMeeting = $('#dayFromMeeting option:selected').val();
	var hourFromMeeting = $('#hourFromMeeting option:selected').val();
	var minuteFromMeeting = $('#minuteFromMeeting option:selected').val();

	var yearToMeeting = $('#yearToMeeting option:selected').val();
	var monthToMeeting = $('#monthToMeeting option:selected').val();
	var dayToMeeting = $('#dayToMeeting option:selected').val();
	var hourToMeeting = $('#hourToMeeting option:selected').val();
	var minuteToMeeting = $('#minuteToMeeting option:selected').val();

	var startTimeStamp = new Date(yearFromMeeting, monthFromMeeting, dayFromMeeting, hourFromMeeting, minuteFromMeeting);
	var stopTimeStamp = new Date(yearToMeeting, monthToMeeting, dayToMeeting, hourToMeeting, minuteToMeeting);

	var today = new Date();

	var invalidDate = validateMeetingTime(startTimeStamp, stopTimeStamp);

	if (!invalidDate) {
		var d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, today.getHours(), today.getMinutes());
		var d3 = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate(), 23, 59);

		var btns = {};
		btns[$.i18n.prop('buttons.ok')] = function() {
			saveMeeting(sendinvite);
			$(this).dialog('close');
			$(this).dialog('destroy');
			return;
		};
		btns[$.i18n.prop('buttons.cancel')] = function() {
			$(this).dialog('close');
			$(this).dialog('destroy');
		};

		$.ajax({
			url :'listMeeting.action',
			type :'POST',
			async :false,
			data :{
				selectedStartTimeMillis :d2.getTime(),
				selectedEndTimeMillis :d3.getTime()
			},
			dataType :'json',
			success :function(json) {

				var meeting, meetingStart, meetingEnd;
				var conflictFound = false;
				for ( var i = 0; i < json.meetingList.length; i++) {

					meeting = json.meetingList[i];
					meetingStart = parseFloat(meeting.start_timestamp);
					meetingEnd = parseFloat(meeting.end_timestamp);

					if ((meetingStart <= startTimeStamp && meetingEnd >= startTimeStamp)
							|| (meetingStart <= stopTimeStamp && meetingEnd >= stopTimeStamp)) {

						conflictFound = true;

						$("#errorMessage").dialog({
							autoOpen :false,
							title :$.i18n.prop('buttons.delete'),
							bgiframe :true,
							width :300,
							modal :glbmodal,
							resizable :false,
							buttons :btns
						}).height("auto");

						$("#errorMessage [id*='errorText']").text($.i18n.prop('meetings.conflict'));
						$("#errorMessage").dialog("open");
						$("#errorMessage").dialog("moveToTop");
					}

				}
				if (!conflictFound) {
					saveMeeting(sendinvite);
				}

			}
		});
	}
}

function saveMeeting(sendinvite) {

	var yearFromMeeting = $('#yearFromMeeting option:selected').val();
	var monthFromMeeting = $('#monthFromMeeting option:selected').val();
	var dayFromMeeting = $('#dayFromMeeting option:selected').val();
	var hourFromMeeting = $('#hourFromMeeting option:selected').val();
	var minuteFromMeeting = $('#minuteFromMeeting option:selected').val();

	var yearToMeeting = $('#yearToMeeting option:selected').val();
	var monthToMeeting = $('#monthToMeeting option:selected').val();
	var dayToMeeting = $('#dayToMeeting option:selected').val();
	var hourToMeeting = $('#hourToMeeting option:selected').val();
	var minuteToMeeting = $('#minuteToMeeting option:selected').val();

	var startTimeStamp = new Date(yearFromMeeting, monthFromMeeting, dayFromMeeting, hourFromMeeting, minuteFromMeeting);
	var stopTimeStamp = new Date(yearToMeeting, monthToMeeting, dayToMeeting, hourToMeeting, minuteToMeeting);

	var invalidDate = validateMeetingTime(startTimeStamp, stopTimeStamp);

	if (!invalidDate) {
		var latlon;
		var meetingAddress;
		var null_var = null;

		if (addressSearch.name == "-") {
			latlon = "&latitude=" + "&longitude=";
			meetingAddress = "&meetingAddress=" + "&meetingAddressName=";
		}

		if (addressSearch.address == "" && addressSearch.latitude == null && addressSearch.longitude == null) {
			if ($('#meetingLocationLatitude').val() == null) {
				latlon = "&latitude=" + null_var + "&longitude=" + null_var;
			} else {

				latlon = "&latitude=" + $('#meetingLocationLatitude').val() + "&longitude=" + $('#meetingLocationLongitude').val();
			}
			if ($('#meetingLocationAddress').val() == null) {
				meetingAddress = "&meetingAddress=" + "&meetingAddressName=";
			} else {
				meetingAddress = "&meetingAddress=" + $('#meetingLocationAddress').val() + "&meetingAddressName=";
			}

		}

		if (addressSearch.latitude != null && addressSearch.longitude != null) {
			latlon = "&latitude=" + addressSearch.latitude + "&longitude=" + addressSearch.longitude;
			meetingAddress = "&meetingAddress=" + addressSearch.address + "&meetingAddressName=" + addressSearch.name;

		}

		var serializedFormData = $('#createMeeting').serialize();

		$.ajax({
			type :'POST',
			url :'saveMeeting.action',
			data :serializedFormData + "&sendinvite=" + sendinvite + "&startTimeStamp=" + startTimeStamp.getTime() + "&stopTimeStamp="
					+ stopTimeStamp.getTime() + latlon + meetingAddress,
			success :function(ajaxCevap) {
				if (checkResponseSuccess(ajaxCevap)) {
					$("#meetingNewDialog").dialog('close');

					$('#calendar').fullCalendar('renderEvent', {
						id :ajaxCevap.meetingId,
						title :$("#createMeeting input[name=meetingSubject]").val(),
						start :startTimeStamp,
						end :stopTimeStamp,
						allDay :false
					}, true);
					if ($('#calendarRightNav').hasClass('selected') == false) {
						if (addressSearch.latitude != null && addressSearch.longitude != null)
							showMeetingAndAttendeePointsOnMap(ajaxCevap.meetingId);
					}
				}
			},
			complete :function(XMLHttpRequest, textStatus) {
				var localeToBeUsed = userLocale == 'en' ? '' : (userLocale == null ? '' : userLocale);

				if (localeToBeUsed == 'de') {
					$("#meetingDateTitle").text($.datepicker.formatDate('DD, d. MM yy', startTimeStamp, {
						dayNamesShort :$.datepicker.regional['' + localeToBeUsed + ''].dayNamesShort,
						dayNames :$.datepicker.regional['' + localeToBeUsed + ''].dayNames,
						monthNamesShort :$.datepicker.regional['' + localeToBeUsed + ''].monthNamesShort,
						monthNames :$.datepicker.regional['' + localeToBeUsed + ''].monthNames
					}));

				} else {
					$("#meetingDateTitle").text($.datepicker.formatDate('DD, MM d, yy', startTimeStamp, {
						dayNamesShort :$.datepicker.regional['' + localeToBeUsed + ''].dayNamesShort,
						dayNames :$.datepicker.regional['' + localeToBeUsed + ''].dayNames,
						monthNamesShort :$.datepicker.regional['' + localeToBeUsed + ''].monthNamesShort,
						monthNames :$.datepicker.regional['' + localeToBeUsed + ''].monthNames
					}));
				}

				resetAddressMeeting();
			}
		});
	}

}

function AddressSearch(name, address, latitude, longitude) {

	this.name = name;
	this.address = address;
	this.latitude = latitude;
	this.longitude = longitude;

}

function preAcceptMeetingRequest(meetingRequestID, accepted, isShowEta, isShowLocation, isWarnETA) {
/*
	var startTime =startTime;
	var endTime = endTime;
*/
	var isShowEta = isShowEta.is(':checked');
	var isShowLocation = isShowLocation.is(':checked');
	var isWarnETA = isWarnETA.is(':checked');
	$.ajax({
			url :'answerMeetingRequest.action',
			type :'POST',
			async :false,
			data :{
				'id' :meetingRequestID,
				'accepted' :accepted,
				'showEta' :isShowEta,
				'showLocation' :isShowLocation,
				'warnETA' :isWarnETA
			},
			dataType :'json',
			success :function(json) {
				if (checkResponseSuccess(json)) {
					$('#meetinginboxcheckboxes').hide();
					$('#meetinginboxbuttons').hide();
					if (accepted) {
						$('#meetingRequestAnswerStatusId').html($.i18n.prop('messageDetail.ACCEPTED'));
					} else {
						$('#meetingRequestAnswerStatusId').html($.i18n.prop('messageDetail.DENIED'));
					}
				}
			}
		});

	
/*
	$.ajax({
		url :'viewMeeting.action',
		type :'POST',
		async :false,
		data :{
			id :meetingRequestID,
			localeTime :new Date().getTime()
		},
		dataType :'json',
		success :function(json) {

			var startTimeStamp = startTime; //json.meeting.start_timestamp;
			var stopTimeStamp = endTime;// json.meeting.end_timestamp;

			var today = new Date();
			var d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes());
			var d3 = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate(), 23, 59);

			var btns = {};
			btns[$.i18n.prop('buttons.ok')] = function() {
				answerMeetingRequest(meetingRequestID, accepted, isShowEta, isShowLocation, isWarnETA ,startTimeStamp ,stopTimeStamp);
				$(this).dialog('close');
				$(this).dialog('destroy');
				return;
			};
			btns[$.i18n.prop('buttons.cancel')] = function() {
				$(this).dialog('close');
				$(this).dialog('destroy');
			};
			$.ajax({
				url :'listMeetings.action',
				type :'POST',
				async :false,
				data :{
					selectedStartTimeMillis :d2.getTime(),
					selectedEndTimeMillis :d3.getTime()
				},
				dataType :'json',
				success :function(json) {

					var meeting, meetingStart, meetingEnd;
					var conflictFound = false;
					for ( var i = 0; i < json.meetingList.length; i++) {

						meeting = json.meetingList[i];
						meetingStart = parseFloat(meeting.start_timestamp);
						meetingEnd = parseFloat(meeting.end_timestamp);

						if ((meetingStart <= startTimeStamp && meetingEnd >= startTimeStamp)
								|| (meetingStart <= stopTimeStamp && meetingEnd >= stopTimeStamp)) {

							conflictFound = true;

							$("#errorMessage").dialog({
								autoOpen :false,
								title :$.i18n.prop('buttons.delete'),
								bgiframe :true,
								width :300,
								modal :glbmodal,
								resizable :false,
								buttons :btns
							}).height("auto");

							$("#errorMessage [id*='errorText']").text($.i18n.prop('meetings.conflict'));
							$("#errorMessage").dialog("open");
							$("#errorMessage").dialog("moveToTop");
						}

					}
					if (!conflictFound) {
						answerMeetingRequest(meetingRequestID, accepted, isShowEta, isShowLocation, isWarnETA);
					}

				}
			});

		}
	});
*/

}

function answerMeetingRequest(meetingRequestID, accepted, isShowEta, isShowLocation, isWarnETA ) {
	var isShowEta = isShowEta.is(':checked');
	var isShowLocation = isShowLocation.is(':checked');
	var isWarnETA = isWarnETA.is(':checked');

	$.ajax({
			url :'answerMeetingRequest.action',
			type :'POST',
			async :false,
			data :{
				'id' :meetingRequestID,
				'accepted' :accepted,
				'showEta' :isShowEta,
				'showLocation' :isShowLocation,
				'warnETA' :isWarnETA
			},
			dataType :'json',
			success :function(json) {
				if (checkResponseSuccess(json)) {
					$('#meetinginboxcheckboxes').hide();
					$('#meetinginboxbuttons').hide();
					if (accepted) {
						$('#meetingRequestAnswerStatusId').html($.i18n.prop('messageDetail.ACCEPTED'));
					} else {
						$('#meetingRequestAnswerStatusId').html($.i18n.prop('messageDetail.DENIED'));
					}
				}
			}
		});

/*
	$.post("answerMeetingRequest.action", {
		'id' :meetingRequestID,
		'accepted' :accepted,
		'showEta' :isShowEta,
		'showLocation' :isShowLocation,
		'warnETA' :isWarnETA
	}, function(data) {
		if (checkResponseSuccess(data)) {
			$('#meetinginboxcheckboxes').hide();
			$('#meetinginboxbuttons').hide();
			if (accepted) {
				$('#meetingRequestAnswerStatusId').html($.i18n.prop('messageDetail.ACCEPTED'));
			} else {
				$('#meetingRequestAnswerStatusId').html($.i18n.prop('messageDetail.DENIED'));
			}
		}
	}, "json");
*/

}

function declineMeetingRequest(meetingID) {

	var btns = {};
	btns[$.i18n.prop('buttons.ok')] = function() {
		$.ajax({
			url :"declineMeetingRequest.action",
			type :'POST',
			data :{
				meetingRequestID :meetingID
			},
			dataType :'json',
			success :function(json) {
				if (json.errorText == null) {
					mainMarkerManager.removeAllMarkers();
				}
			}
		});

		$(this).dialog('close');
		$(this).dialog('destroy');
		$("#viewMeetingDialog").dialog('destroy');
		var calendar = $('#calendar').fullCalendar('removeEvents', meetingID);
	};
	btns[$.i18n.prop('buttons.cancel')] = function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
		$("#viewMeetingDialog").dialog('destroy');
	};

	$("#declineConfirmation").css("display", "block");
	$(function() {
		$("#declineConfirmation").dialog({
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
}

function refreshETA(meetingID, userID, chairMsisdn, meetlatitude, meetlongitude) {

	$('#refresh' + userID).html($.i18n.prop('meetings.refreshing'));

	$("#viewMeetingDialog").dialog('option', 'modal', true);

	$.ajax({
		url :"refreshETA.action",
		type :'POST',
		data :{
			meetingID :meetingID,
			userID :userID,
			chairMsisdn :chairMsisdn,
			meetlatitude :meetlatitude,
			meetlongitude :meetlongitude
		},
		dataType :'json',
		success :function(json) {
			$("#user_" + userID).html(json.ETA);
			$('#refresh' + userID).html($.i18n.prop('meetings.refresh'));
			$("#viewMeetingDialog").dialog('option', 'modal', false);
		}
	});

}

function pleaseWaitForRoute() {

	var dialogTitle = "";

	$("#meetingWaitForRouteDialog").dialog({
		title :dialogTitle,
		width :230,
		modal :glbmodal,
		height :80,
		bgiframe :true,
		close :function(event, ui) {
			$("#meetingWaitForRouteDialog").dialog('destroy');
		}
	});

}
function addStartOrEndPoint(attendeeName, latitude, longitude, text) {

	var currentTime = new Date().getTime();
	var str = currentTime.toString();
	var markerId = str.substring(str.length - 9, str.length);

	var tooltipContent = parseTemplate('genericTooltipTemplate', {
		header :text,
		content :attendeeName,
		markerId :'m' + markerId
	});

	var markerOptions = {
		id :'m' + markerId,
		// icon : 'images/meeting_point.png',
		// iconWidth : 29,
		// iconHeight : 29,
		latitude :parseFloat(latitude),
		longitude :parseFloat(longitude),
		hasTooltip :true,
		staticContent :true,
		contentHtml :tooltipContent,
		forceToOpen :true,
		history :true
	};

	mainMarkerManager.createMarker(markerOptions);

}

function showMeetingAndAttendeePointsOnMap(meetingID) {
  
  queryEventOnMap(meetingID,new Date().getTime());
  return;
  
  console.log("showMeetingAndAttendeePointsOnMap >>>>>>");
  
  /* EXIT FUNCTION NO TEMPLATE AVAILABLE- NEDD TO DEBUG IF NEEDED */
	/*if (!$('#lbasMainMap').is(':visible')) {
		$("#locationsRightNav").click();
	}*/

	$.ajax({
		/*url :'showOnMapMeeting.action',*/
		url :'showMeetingOnMap.action',
		beforeSend :function() {
			if(mainMarkerManager) mainMarkerManager.removeAllMarkers();
			if(routeLayerForMeeting) {
  			for ( var i = 0; i < routeLayerForMeeting.features.length; i++) {
  				routeLayerForMeeting.removeFeatures(routeLayerForMeeting.features[i]);
  				i--;
  			}
			}
			// pleaseWaitForRoute();
			$("#viewMeetingDialog").dialog('close');
		},
		type :'POST',
		async :false,
		data :{
		  id :meetingID,
			meetingID :meetingID,
			localeTime:new Date().getTime()
		},
		dataType :'json',
		success :function(json) {
		  
		  

			var attendees = json.meeting.attendees;
			var meeting = json.meeting;

			// make route req. for each attendee and then draw route
			if (attendees.length > 0) {
				for (attendee in attendees) {
					var points = [];
					var userid = attendees[attendee].id;
					var fullname = attendees[attendee].fullname;
					var updatedPoints = points;
					var atdLongitude = attendees[attendee].longitude;
					var atdLatitude = attendees[attendee].latitude;
					var metLongitude = meeting.longitude;
					var metLatitude = meeting.latitude;
					if (atdLongitude != undefined && atdLatitude != undefined) {
						updatedPoints.push(new google.maps.LatLng(atdLatitude, atdLongitude));
					}
					if (metLongitude != undefined && metLatitude != undefined) {
						updatedPoints.push(new google.maps.LatLng(metLatitude, metLongitude));// last element is the meeting point
					}

					if (updatedPoints.length > 1) {
						var request = {
							travelMode: google.maps.TravelMode.DRIVING,
							durationInTraffic: true
						};
						var waypoints = [];
						$(updatedPoints).each(function(i, pn) {
							if ( i == 0 )
								request.origin = pn;
							else if ( i == updatedPoints.length - 1 )
								request.destination = pn;
							else
								waypoints.push({
									location: pn,
									stopover: true
								});
						});
						if ( waypoints.length > 0 )
							request.waypoints = waypoints;
						
						var displayDirections = new google.maps.DirectionsRenderer({
							suppressMarkers : true
						});
						var direction = new google.maps.DirectionsService().route(request, function(result, status) {
							if ( status == google.maps.DirectionsStatus.OK ) {
								displayDirections.setDirections(result);
								GMapsHelper.routeMarkers(result.routes[0]);
							}
						});

						/*routeRequest = {
							points :updatedPoints,
							routeType :'DRIVING',
							user :attendees[attendee],
							includeTraffic :true
						};
						lbasGISConn.route(routeRequest, function(json) {

							if (json.rpoints != null && json.rpoints != undefined) {
								// draw route here
								var fname = json.user.fullname;
								if (json.rpoints.length > 2) {
									addStartOrEndPoint(fname, json.rpoints[0].road[0].latitude, json.rpoints[0].road[0].longitude, $.i18n
											.prop('meetings.start'));
									addStartOrEndPoint(fname, json.rpoints[0].road[json.rpoints[0].road.length - 2].latitude,
											json.rpoints[0].road[json.rpoints[0].road.length - 2].longitude, $.i18n.prop('meetings.end'));
								}
								drawRouteForMeeting(json.rpoints);

							}
						}, function() {
							// alert("problem on route");
						});*/

					}
				}
			}
			//

			var attendeeModel;
			var toolTipContent;
			var iconMeetingPoint = 'images/meeting_point.png';

			var gh = dateFormat(meeting.start_timestamp, "dd/mm/yyyy");
			var ch = dateFormat(meeting.end_timestamp, "dd/mm/yyyy");
			var meetingTimeStr = "";
			if (gh == ch) {
				meetingTimeStr = dateFormat(meeting.start_timestamp, "dd/mm/yyyy") + " " + dateFormat(meeting.start_timestamp, "HH:MM") + "-"
						+ dateFormat(meeting.end_timestamp, "HH:MM");

			} else {
				meetingTimeStr = dateFormat(meeting.start_timestamp, "dd/mm/yyyy") + " " + dateFormat(meeting.start_timestamp, "HH:MM") + "-"
						+ dateFormat(meeting.end_timestamp, "dd/mm/yyyy") + " " + dateFormat(meeting.end_timestamp, "HH:MM");
			}
			var btnsss = [];
			var creator = (meeting.chairId == currentUser) ? true : false;

			var tooltipContent = parseTemplate('meetingTooltipTemplate', {
				meetingId :meetingID,
				changeMeeting :creator && !json.meetingTimePassed,
				header :$.i18n.prop('meetings.meetingpoint'),
				content :'<p>' + meeting.location_address + '</p>' + meetingTimeStr,
				markerId :'m' + meetingID
			});

			var markerOptions = {
				id :'m' + meetingID,
				icon :iconMeetingPoint,
				iconWidth :29,
				iconHeight :29,
				latitude :parseFloat(meeting.latitude),
				longitude :parseFloat(meeting.longitude),
				hasTooltip :true,
				staticContent :true,
				contentHtml :tooltipContent,
				forceToOpen :true
			};

			mainMarkerManager.createMarker(markerOptions);

			var tooltipContent2;
			var tmpMarkerIds = [];
			for ( var i = 0; i < attendees.length; i++) {

				attendeeModel = attendees[i];

				var etaCalculated = "";
				if (attendeeModel.eta != null && attendeeModel.eta != undefined) etaCalculated = attendeeModel.eta;

				tooltipContent2 = parseTemplate('genericTooltipTemplate', {
					header :attendeeModel.fullname,
					content :$.i18n.prop('meetings.eta2') + " " + (attendeeModel.showMyEta ? etaCalculated : ""),
					markerId :'u' + i + '_' + meetingID
				});

				var markerOptions2 = {
					id :'u' + i + '_' + meetingID,
					latitude :parseFloat(attendeeModel.latitude),
					longitude :parseFloat(attendeeModel.longitude),
					hasTooltip :true,
					staticContent :true,
					contentHtml :tooltipContent2,
					forceToOpen :true
				};

				mainMarkerManager.createMarker(markerOptions2);
				// mainMarkerManager.updateMarkerSize(markerOptions2.id);
				tmpMarkerIds[i] = markerOptions2.id;
			}
			adjustZoomLevel(map);

			for ( var i = 0; i < tmpMarkerIds.length; i++) {
				mainMarkerManager.updateMarkerSize(tmpMarkerIds[i]);
			}
		}
	});

}
function closeAllMeetingDialogs() {
	$("#meetingNewDialog").dialog('close');
	$("#viewMeetingDialog").dialog('close');
}
function setAsMeetingLocation(loadEnabled, latitude, longitude, addressText, name) {
	// resetAddressMeeting();

	var dialogTitle = $.i18n.prop('meetings.title.create');
	$("#viewMeetingDialog").dialog('close');
	// elcin:24 mart 2010
	$("#meetingNewDialog").html('');
	$("#viewMeetingDialog").html('');
	//
	$("#meetingNewDialog").dialog({
		autoOpen :false,
		modal :glbmodal,
		title :dialogTitle,
		bgiframe :true,
		width :380,
		resizable :false,
		close :function(event, ui) {
			$("#meetingNewDialog").dialog('destroy');
			$("#meetingNewDialog").html('');
		}
	}).height("auto");

	$.ajax({
		url :'newMeeting.action',
		type :'POST',
		async :false,
		dataType :'json',
		success :function(json) {
			if (checkResponseSuccess(json)) {
				$('#meetingNewDialog').html(parseTemplate("meetingCreateNewTemplate", {
					json :json
				}));

				$("#meetingNewDialog").dialog('option', 'title', dialogTitle);
				$("#meetingNewDialog").dialog('open');
			}
		}
	});

	prepareMeetingDateCombos(new Date());

	prepareAutoCompleteOperations();

	$("#meetingUsers").tokenInput("userSearchMeetingAutocomplete.action", {
		type :"POST",
		minChars :2,
		noResultsText :$.i18n.prop('no.results.text'),
		onResult :function(son) {
			// show scroll while selecting user from search results
			$('div[aria-labelledby="ui-dialog-title-meetingNewDialog"]').css('overflow-y', 'auto');
			$('div[aria-labelledby="ui-dialog-title-meetingNewDialog"]').css('overflow-x', 'hidden');

			return son;
		},
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
	$(".token-input-dropdown-facebook").css("position", "relative");

	// while showing token input search results, blur attribute block scroll manually then we unbind it

	// $('#idmeetinglocation').html(addressText);
	$('#nameOfaLocation').val(addressText);

	addressSearch.latitude = latitude;
	addressSearch.longitude = longitude;
	addressSearch.address = addressText;
	addressSearch.name = name;

	document.getElementById("secondpart").style.display = "block";

	if ($('#meetingAttendees').find('.token-input-list-facebook input') != null) {
		$('#meetingAttendees').find('.token-input-list-facebook input').unbind('blur');
	}

}

function resetAddressMeeting() {
	addressSearch.latitude = null;
	addressSearch.longitude = null;
	addressSearch.address = "";
	addressSearch.name = "";

}

function checkMeetingAddress(meetingAddress) {
	var updatedAddress = "";
	if (meetingAddress != null) {

		var address = meetingAddress;
		var index = address.lastIndexOf(' ');
		updatedAddress = address.substring(index + 1, address.length);
		if (updatedAddress == "null")
			updatedAddress = address.substring(0, index);
		else
			updatedAddress = meetingAddress;
	}
	return updatedAddress;
}

function meetingAllDaySelected(checkbox, startTimeStamp, endTimeStamp) {
	if (startTimeStamp == null)
		startTimeStamp = selectedCalendarDate.getTime();

	if (checkbox.value == "true") {
		$("#hourFromMeeting").val("00");
		$("#minuteFromMeeting").val("00");
		$("#hourToMeeting").val("00");
		$("#minuteToMeeting").val("00");

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

		$("#dayFromMeeting").val(getDay(startTimeStamp));
		startTimeStamp = startTimeStamp + 24 * 60 * 60 * 1000;
		$("#dayToMeeting").val(getDay(startTimeStamp));
	} else {

		var d = new Date();
		if (endTimeStamp == null) {
			d.setTime(startTimeStamp);
			prepareMeetingDateCombos(d);
		} else {
			d.setTime(startTimeStamp);
			var dEnd = new Date();
			dEnd.setTime(endTimeStamp);
			prepareMeetingDateComboValues(d, dEnd);
		}

		$("#dayFromMeeting").attr("disabled", false);
		$("#monthFromMeeting").attr("disabled", false);
		$("#yearFromMeeting").attr("disabled", false);
		$("#hourFromMeeting").attr("disabled", false);
		$("#minuteFromMeeting").attr("disabled", false);

		$("#dayToMeeting").attr("disabled", false);
		$("#monthToMeeting").attr("disabled", false);
		$("#yearToMeeting").attr("disabled", false);
		$("#hourToMeeting").attr("disabled", false);
		$("#minuteToMeeting").attr("disabled", false);
	}
}

function validateMeetingTime(start, end) {
	var now = new Date();
	var invalidDate = false;

	if ((start.getTime() < now.getTime()) || (end.getTime() < now.getTime())) {
		if (start.getTime() < now.getTime() && end.getTime() > now.getTime() && getHourMinute(start) == "00:00" && getHourMinute(end) == "00:00") {
			// means all day selected
		} else {
			invalidDate = true;
			showErrorDialog($.i18n.prop('error.meeting.time.passed'), true);
		}
	} else if (end.getTime() < start.getTime()) {
		invalidDate = true;
		showErrorDialog($.i18n.prop('error.meeting.stop.time.error'), true);
	} else if (start.getTime() == end.getTime()) {
		invalidDate = true;
		showErrorDialog($.i18n.prop('error.meeting.timing.error'), true);
	}

	return invalidDate;
}