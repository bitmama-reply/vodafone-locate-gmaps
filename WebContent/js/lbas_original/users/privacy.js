var gnotifyMeEveryNthLocationCheckbox = false;
var gnotifyMeEveryNthLocationCount = 0;
var exceptionList = new Array();
var dayFromComboValues = new Array();
var dayComboValuesFromToList = new Array();
var geventArr = new Array();
// starts with 0 index,0 means monday...
var changingsOnDayTimeSettings = new Array("", "", "", "", "", "", "");
var minTime = '0:00';
var maxTime = '24:00';
var calendarHeight = 520;
var personalCalendarView = false;

function acceptPrivacyStatement(statementOwner) {
	// var dontShowCheckId = statementOwner+'DontShowCheckbox';
	// var checkValue= $('#'+dontShowCheckId).checked;

	var otherStatementOwner;
	if (statementOwner == 'vodafone') {
		otherStatementOwner = 'company';
	} else if (statementOwner == 'company') {
		otherStatementOwner = 'vodafone';
	} else {
		return false;
	}
	var params = $("#submitPrivacyPage").serialize();
	params += "&statementOwner=" + statementOwner;
	$.post("acceptPrivacyStatement", params, function(data) {

		if (statementOwner == 'vodafone') {
			$('#vodafonePrivacyAcceptButtons').hide();
		} else if (statementOwner == 'company') {
			$('#companyPrivacyAcceptButtons').hide();
		}
		if (data.submitPage) {
			document.submitPrivacyPage.submit();
		} else if ($("#submitPrivacyPage  input[name=" + otherStatementOwner + "PrivacyAccepted ]").val() == 'false') {
			$("#" + statementOwner + "Statement").hide();
			$("#" + otherStatementOwner + "Statement").show();
			return false;
		}
	}, "json");

}

function updateStatement(statementOwner) {

	var loginState = $("#submitPrivacyPage  input[name='loginState' ]").val();
	var otherStatementOwner;
	if (statementOwner == 'vodafone') {
		otherStatementOwner = 'company';
	} else if (statementOwner == 'company') {
		otherStatementOwner = 'vodafone';
	} else {
		return false;
	}

	if (loginState == 'PRIVACY') {

		if ($("#submitPrivacyPage  input[name=" + otherStatementOwner + "PrivacyAccepted ]").val() == 'false') {
			$("#" + statementOwner + "Statement").hide();
			$("#" + otherStatementOwner + "Statement").show();
			return false;
		} else {
			document.submitPrivacyPage.submit();
		}

	} else if (loginState = 'SUCCESS') {
		acceptPrivacyStatement(statementOwner);
	}

}

function adjustPrivacySettingsTab() {
	if ($('#vfPrivacyStatements').css('display') != 'none')
		$('#vfPrivacyStatements').css('display', 'none');
	else
		$('#vfPrivacyStatements').css('display', '');

	if ($('#cPrivacyStatements').css('display') != 'none')
		$('#cPrivacyStatements').css('display', 'none');
	else
		$('#cPrivacyStatements').css('display', '');
}

function adjustVodafonePrivacySettings() {
	$('#companyStatement').hide();
	$('#vodafoneStatement').show();
	$('#linkcPrivacyStatements').css('color', 'rgb(0, 119, 183)');
	$('#linkvfPrivacyStatements').css('color', 'black');
	$('#linkvfPrivacyStatements').css('font-weight', 'bold');
	$('#linkcPrivacyStatements').css('font-weight', '');
}

function adjustCompanyPrivacySettings() {
	$('#vodafoneStatement').hide();
	$('#companyStatement').show();
	$('#linkvfPrivacyStatements').css('color', 'rgb(0, 119, 183)');
	$('#linkcPrivacyStatements').css('color', 'black');
	$('#linkcPrivacyStatements').css('font-weight', 'bold');
	$('#linkvfPrivacyStatements').css('font-weight', '');
}

function adjustSelectedTabColor(divname) {
	$("#privacyAndControlTable tr[id='" + divname + "']").css('backgroundColor', '#EFEFEF');
	$("#privacyAndControlTable tr[id!='" + divname + "']").css('backgroundColor', '#ffffff');
}

function whoCanLocateMe() {
	var str;
	$.ajax( {
		url :'whoCanLocateMe.action',
		type :'POST',
		async :false,
		dataType :'json',
		success :function(json) {
			if (checkResponseSuccess(json)) {
				str = parseTemplate("whoCanLocateMeTemplate", {
					requestorList :json.requestorList,
					searchText :null
				});

				$('#privacyRightDiv').html(json.privacyDisclaimer);

				return str;
			}
		}
	});
	return str;
}
function whomICanLocate() {
	var str;
	$.ajax( {
		url :'whomICanLocate.action',
		type :'POST',
		async :false,
		dataType :'json',
		success :function(json) {
			if (checkResponseSuccess(json)) {
				str = parseTemplate("whomICanLocateTemplate", {
					targetList :json.targetList,
					searchText :null
				});

				$('#privacyRightDiv').html(json.privacyDisclaimer);

				return str;
			}
		}
	});
	return str;
}

function composeWhoHasLocatedMePage(json) {

	var str = parseTemplate("whoHasLocatedMeTemplate", {
		json :json
	});
	$('#privacyCenterDiv').css('left', '265px');
	$('#privacyCenterDiv').show();
	$('#privacyRightDiv').show();
	$('#vfPrivacyStatements').css('display', 'none');
	$('#cPrivacyStatements').css('display', 'none');
	$('#privacyCenterDiv').html(str);

	$("#sendMeUpdateCheckbox").attr("checked", json.sendMeUpdateCheckbox);
	$("#sendMeUpdatePeriod").val(json.sendMeUpdatePeriod);

}

function resortHistoryTable(daysBefore, sidx, iconId) {

	if ($(iconId).attr('src').contains('arrow_off.png')) {
		sord = "desc";
	} else if ($(iconId).attr('src').contains('arrow_up.png')) {
		sord = "desc";
	} else if ($(iconId).attr('src').contains('arrow_down.png')) {
		sord = "asc";
	}

	$.ajax( {
		url :'whoHasLocatedMe.action',
		type :'POST',
		dataType :'json',
		data : {
			daysBefore :daysBefore,
			sidx :sidx,
			sord :sord
		},
		success :function(json) {
			if (checkResponseSuccess(json)) {
				composeWhoHasLocatedMePage(json);
				if (sord == "desc") {
					$(iconId).attr('src', './images/arrow_down.png');
				} else {
					$(iconId).attr('src', './images/arrow_up.png');
				}

			}
		}
	});

}

function whoHasLocatedMe(daysBefore) {
	showLoadingIcon();

	$.ajax( {
		url :'whoHasLocatedMe.action',
		dataType :'json',
		type :'POST',
		data : {
			daysBefore :daysBefore
		},
		success :function(json) {
			if (checkResponseSuccess(json)) {
				composeWhoHasLocatedMePage(json);
			}

			hideLoadingIcon();
		}
	});
}

function AjxSaveSendMeUpdate() {
	var sendMeUpdatePeriod = $('#sendMeUpdatePeriod').val();
	var sendMeUpdateCheckbox = $('#sendMeUpdateCheckbox').attr('checked');
	$.ajax( {
		url :'saveSendMeUpdate.action',
		dataType :'json',
		type :'POST',
		data : {
			sendMeUpdatePeriod :sendMeUpdatePeriod,
			sendMeUpdateCheckbox :sendMeUpdateCheckbox
		},
		success :function(json) {
			checkResponseSuccess(json);
		}
	});

}

function deleteLocatingHistoryItems(daysBefore) {

	var selectedLocatingHistoryItemIDlist = [];
	var anyLocatingHistoryItemSelected = false;
	$("#whoHasLocatedMeTable input:checked").each(function() {
		var idValue = $(this).val();
		selectedLocatingHistoryItemIDlist.push(idValue);
		anyLocatingHistoryItemSelected = true;
	});

	if (anyLocatingHistoryItemSelected) {
		$.ajax( {
			url :'deleteLocatingHistoryItems.action',
			dataType :'json',
			type :'POST',
			data : {
				selectedLocatingHistoryItemIDlist :selectedLocatingHistoryItemIDlist
			},
			success :function(json) {
				if (checkResponseSuccess(json)) {
					whoHasLocatedMe(daysBefore);
				}
			}
		});

	}

}

function deleteAllLocatingHistoryItems(daysBefore) {
	$.ajax( {
		url :'clearLocatingHistory.action',
		dataType :'json',
		success :function(json) {
			if (checkResponseSuccess(json)) {
				whoHasLocatedMe(daysBefore);
			}
		}
	});
}
function selectLocatingHistoryItems() {
	$("#whoHasLocatedMeTable input:checkbox").each(function() {
		this.checked = 'checked';
	});
}

function unSelectLocatingHistoryItems() {
	$("#whoHasLocatedMeTable input:checkbox").each(function() {
		this.checked = '';
	});
}

function cancelApproval(ruleId, userid, fromTimeStamp, toTimeStamp) {
	var timeDuration = "";
	var trid = userid + ruleId;

	if (fromTimeStamp != 0 && toTimeStamp != 0) {
		timeDuration = getDate(fromTimeStamp) + " - " + getDate(toTimeStamp);
	} else
		timeDuration = $.i18n.prop('locationRequest.always');

	$.ajax( {
		url :'cancelApproval.action',
		dataType :'json',
		type :'POST',
		data : {
			ruleId :ruleId,
			userid :userid,
			timeDuration :timeDuration
		},
		success :function(json) {
			$("#" + trid).unblock();
			if (checkResponseSuccess(json)) {
				$("#" + trid).css("display", "none");
				$("#" + trid).attr("id", "cancelapproved");

				var btns = {};

				btns[$.i18n.prop('buttons.ok')] = function() {
					$(this).dialog("close");
				};

				$('#cancelPermissionInformationDialog').html(
						'<p><span class="ui-icon ui-icon-check" style="float:left; margin:0 7px 20px 0;"></span>' + json.infoMessage + '</p>');
				$("#cancelPermissionInformationDialog").dialog( {
					modal :glbmodal,
					resizable :false,
					position :'center',
					title :$.i18n.prop('privacyAndControl.cancel.approval.title'),
					close :function(event, ui) {
						$(this).dialog('destroy');
					},
					buttons :btns
				}).height("auto");
			}
		}
	});
}

function whoCanLocateMeUserSearch() {
	$("#whoCanLocateMeUserSearchInput").autocomplete("userSearchAutocomplete", {
		width :260,
		selectFirst :false,
		extraParams : {
			excludedUser :currentUser
		},
		parse :function(data) {
			var parsed = new Array();
			var json = data;
			var resultList = json.resultList;
			if (resultList != null) {
				for ( var i = 0; i < resultList.length; i++) {
					parsed[i] = {
						data :new Array(resultList[i].value),
						value :resultList[i].value,
						result :resultList[i].value
					};
				}
			}
			return parsed;
		}
	});
	$('#whoCanLocateMeUserSearchInput').result(function(event, data, formatted) {
		$('#whoCanLocateMeUserSearchInput').val(unEscapeHtmlEntity(data[0]));
		var searchText = $('#whoCanLocateMeUserSearchInput').val();
		$("#whocanlocatemetable tr").css("display", "none");

		$("#whocanlocatemetable tr[class*='whocanlocateme'] td[class*='recentLocation'] b").each(function() {
			var fullName = $(this).html();
			if (fullName.contains(searchText)) {
				var id = $(this).attr("id");
				$("#whocanlocatemetable tr[id='" + id + "']").css("display", "");
			}
		});
	});
}

function whomICanLocateUserSearch() {
	$("#whomICanLocatUserSearchInput").autocomplete("userSearchAutocomplete", {
		width :260,
		selectFirst :false,
		extraParams : {
			excludedUser :currentUser
		},
		parse :function(data) {
			var parsed = new Array();
			var json = data;
			var resultList = json.resultList;
			if (resultList != null) {
				for ( var i = 0; i < resultList.length; i++) {
					parsed[i] = {
						data :new Array(resultList[i].value),
						value :resultList[i].value,
						result :resultList[i].value
					};
				}
			}
			return parsed;
		}
	});
	$('#whomICanLocateUserSearchInput').result(function(event, data, formatted) {
		$('#whomICanLocateUserSearchInput').val(unEscapeHtmlEntity(data[0]));
		var searchText = $('#whomICanLocateUserSearchInput').val();
		$("#whomicanlocatetable tr").css("display", "none");

		$("#whomicanlocatetable tr[class*='whocanlocateme'] td[class*='recentLocation'] b").each(function() {
			var fullName = $(this).html();
			if (fullName.contains(searchText)) {
				var id = $(this).attr("id");
				$("#whomicanlocatetable tr[id='" + id + "']").css("display", "");
			}
		});
	});
}

function convertStartEndTimes(value) {
	var startTime;
	var endTime;

	var startH = value.fromHour;
	var endH = value.toHour;
	if (endH == '2400') {
		endH = '0000';
	}

	startTime = startH.substring(0, 2) + ":" + startH.substring(2, 4);
	endTime = endH.substring(0, 2) + ":" + endH.substring(2, 4);
	return startTime + "-" + endTime;
}

function getTimeSettings(timeSettingList) {
	var settingList = new Array("", "", "", "", "", "", "");
	exceptionList = new Array();

	var mondayList = new Array();
	var tuesdayList = new Array();
	var wednesdayList = new Array();
	var thursdayList = new Array();
	var fridayList = new Array();
	var saturdayList = new Array();
	var sundayList = new Array();

	if (timeSettingList != null && timeSettingList.length > 0) {
		for ( var i = 0; i < timeSettingList.length; i++) {
			if (timeSettingList[i].dailyRule == true) {
				if (timeSettingList[i].monday == true) {
					mondayList.push(convertStartEndTimes(timeSettingList[i]));
				} else if (timeSettingList[i].tuesday == true) {
					tuesdayList.push(convertStartEndTimes(timeSettingList[i]));
				} else if (timeSettingList[i].wednesday == true) {
					wednesdayList.push(convertStartEndTimes(timeSettingList[i]));
				} else if (timeSettingList[i].thursday == true) {
					thursdayList.push(convertStartEndTimes(timeSettingList[i]));
				} else if (timeSettingList[i].friday == true) {
					fridayList.push(convertStartEndTimes(timeSettingList[i]));
				} else if (timeSettingList[i].saturday == true) {
					saturdayList.push(convertStartEndTimes(timeSettingList[i]));
				} else if (timeSettingList[i].sunday == true) {
					sundayList.push(convertStartEndTimes(timeSettingList[i]));
				}
			} else {// exception case
				exceptionList.push(timeSettingList[i]);
			}
		}

		var sortedMondayList = mondayList.sort();
		var sortedTuesdayList = tuesdayList.sort();
		var sortedWednesdayList = wednesdayList.sort();
		var sortedThursdayList = thursdayList.sort();
		var sortedFridayList = fridayList.sort();
		var sortedSaturdayList = saturdayList.sort();
		var sortedSundayList = sundayList.sort();

		settingList[0] = convertToTextData(sortedMondayList);
		settingList[1] = convertToTextData(sortedTuesdayList);
		settingList[2] = convertToTextData(sortedWednesdayList);
		settingList[3] = convertToTextData(sortedThursdayList);
		settingList[4] = convertToTextData(sortedFridayList);
		settingList[5] = convertToTextData(sortedSaturdayList);
		settingList[6] = convertToTextData(sortedSundayList);
	}
	return settingList;
}

function convertToTextData(list) {
	var andStr = " " + $.i18n.prop('myVisibility.and') + " ";
	var text = "";
	for ( var x = 0; x < list.length; x++) {
		if (x == 0)
			text = list[x];
		else
			text += andStr + list[x];
	}
	return text;
}

function convertToCalendarEventForPrivacy(timeSettingList) {
	var eventArr = new Array();
	var minStartTime = "";
	var maxStopTime = "";

	for ( var i = 0; i < timeSettingList.length; i++) {

		if (timeSettingList[i].dailyRule == true) {
			var startV = new Date();
			startV.setHours(timeSettingList[i].fromHour.substring(0, 2));
			startV.setMinutes(timeSettingList[i].fromHour.substring(2, 4));

			var endV = new Date();
			endV.setHours(timeSettingList[i].toHour.substring(0, 2));
			endV.setMinutes(timeSettingList[i].toHour.substring(2, 4));

			calendarStartEndTime = calculateCalendarStartEndTimes(timeSettingList[i].fromHour.substring(0, 2), timeSettingList[i].fromHour.substring(
					2, 4), timeSettingList[i].toHour.substring(0, 2), timeSettingList[i].toHour.substring(2, 4), minStartTime, maxStopTime);
			if (calendarStartEndTime != "") {
				var calendarStartEndTimeArray = calendarStartEndTime.split("|");
				minStartTime = calendarStartEndTimeArray[0];
				maxStopTime = calendarStartEndTimeArray[1];
			}

			var dayId;

			if (timeSettingList[i].monday == true)
				dayId = 1;
			else if (timeSettingList[i].tuesday == true)
				dayId = 2;
			else if (timeSettingList[i].wednesday == true)
				dayId = 3;
			else if (timeSettingList[i].thursday == true)
				dayId = 4;
			else if (timeSettingList[i].friday == true)
				dayId = 5;
			else if (timeSettingList[i].saturday == true)
				dayId = 6;
			else if (timeSettingList[i].sunday == true)
				dayId = 7;

			var today = new Date();
			var todayDayId = today.getDay();
			if (dayId > todayDayId) {
				var diffDayInsecond = (dayId - todayDayId) * 24 * 60 * 60 * 1000;
				startV.setTime(startV.getTime() + diffDayInsecond);
				endV.setTime(endV.getTime() + diffDayInsecond);
			} else if (dayId < todayDayId) {
				var diffDayInsecond = (todayDayId - dayId) * 24 * 60 * 60 * 1000;
				startV.setTime(startV.getTime() - diffDayInsecond);
				endV.setTime(endV.getTime() - diffDayInsecond);
			}

			// if full day is selected then, set end hour one day later to see it in the graph correctly..
			if (timeSettingList[i].fromHour == '0000' && timeSettingList[i].toHour == '0000') {
				var startTime = new Date(startV.getFullYear(), startV.getMonth(), startV.getDate(), 0, 0, 0, 0);
				startV.setTime(startTime);
				endV.setTime(startV.getTime() + 24 * 60 * 60 * 1000);
			} else if (timeSettingList[i].fromHour != '0000' && timeSettingList[i].toHour == '0000') {
				var startTime = new Date(startV.getFullYear(), startV.getMonth(), startV.getDate(), 0, 0, 0, 0);
				var tmpstartDate = new Date();
				tmpstartDate.setTime(startTime);
				endV.setTime(tmpstartDate.getTime() + 24 * 60 * 60 * 1000);
			}

			eventArr.push( {
				id :timeSettingList[i].rule_id,
				title :'',
				start :startV,
				end :endV,
				allDay :false
			});

		}
	}

	setCalendarHeight(minStartTime, maxStopTime);

	return eventArr;
}

function myVisibility() {
	var str;
	var text = "";
	var text2 = "";
	var textDefineOrUpdateVisibilitySettings = "";
	var counter = 0;
	var hourduration;
	var eventList = new Array();

	$.ajax( {
		url :'getMyVisibility.action',
		type :'POST',
		async :false,
		dataType :'json',
		success :function(json) {
			if (checkResponseSuccess(json)) {
				$('#visibilityDetailInfo').hide();

				if (json.timeSettingList != null && json.timeSettingList.length > 0) {
					var dayNameList = $.i18n.prop('calendar.dayNames').split(',');
					var settingList = getTimeSettings(json.timeSettingList);
					eventList = convertToCalendarEventForPrivacy(json.timeSettingList);

					text = $.i18n.prop('myVisibility.existentTimeSetting');
					textDefineOrUpdateVisibilitySettings = $.i18n.prop('myVisibility.update.visibility.settings');

					for ( var x = 0; x < settingList.length; x++) {
						hourduration = settingList[x];

						if (settingList[x] != "") {
							if (x == settingList.length - 1)
								text2 += $.i18n.prop('myVisibility.on') + " " + dayNameList[0] + " " + $.i18n.prop('myVisibility.between') + " "
										+ hourduration + "<br>";
							else
								text2 += $.i18n.prop('myVisibility.on') + " " + dayNameList[x + 1] + " " + $.i18n.prop('myVisibility.between') + " "
										+ hourduration + "<br>";
						} else
							counter++;
					}
					if (counter == 7) {
						// there is no defined visibility setting
						text = $.i18n.prop('myVisibility.noTimeSetting');
						text2 = $.i18n.prop('myVisibility.define.timeSetting');
						textDefineOrUpdateVisibilitySettings = $.i18n.prop('myVisibility.update.visibility.settings');
						// if user is a newly created user or if he has no visibility defined till now then he will see business hours or
						// default
						// time settings(whole days visible for 24/7 hours)
						if (!json.visibilityDefined) {
							textDefineOrUpdateVisibilitySettings = $.i18n.prop('myVisibility.define.visibility.settings');
							if (json.businessHours == undefined || json.businessHours == null || json.businessHours == "") {
								setDefaultTimeSettings(eventList);
							} else {
								setBusinessHoursSettings(eventList, json.businessHours);
							}
						} else {
							personalCalendarView = false;
						}
					}
				} else {
					// there is no defined visibility setting and exception list
					text = $.i18n.prop('myVisibility.noTimeSetting');
					text2 = $.i18n.prop('myVisibility.define.timeSetting');
					textDefineOrUpdateVisibilitySettings = $.i18n.prop('myVisibility.update.visibility.settings');
					// if user is a newly created user or if he has no visibility defined till now then he will see business hours or default
					// time settings(whole days visible for 24/7 hours)
					if (!json.visibilityDefined) {
						textDefineOrUpdateVisibilitySettings = $.i18n.prop('myVisibility.define.visibility.settings');
						if (json.businessHours == undefined || json.businessHours == null || json.businessHours == "") {
							setDefaultTimeSettings(eventList);
						} else {
							setBusinessHoursSettings(eventList, json.businessHours);
						}
					} else {
						personalCalendarView = false;
					}
				}

				gnotifyMeEveryNthLocationCheckbox = json.notifyMeEveryNthLocationCheckbox;
				gnotifyMeEveryNthLocationCount = json.notifyMeEveryNthLocationCount;

				var notifyMeEveryNthLocationCountList = $.i18n.prop('privacy.notifyMeEveryNthLocation1').split('|');

				str = parseTemplate("myVisibilityTemplate", {
					text :text,
					text2 :text2,
					textDefineOrUpdateVisibilitySettings :textDefineOrUpdateVisibilitySettings,
					pnotifyMeEveryNthLocationCheckbox :json.notifyMeEveryNthLocationCheckbox,
					pnotifyMeEveryNthLocationCount :json.notifyMeEveryNthLocationCount,
					notifyMeEveryNthLocationCountList :notifyMeEveryNthLocationCountList
				});

				geventArr = eventList;

				return str;
			}
		}
	});
	return str;
}

function setDefaultTimeSettings(eventList) {
	var startV = new Date();
	var endV = new Date();
	var todayDayId = startV.getDay();
	if (todayDayId > 1) {
		startV.setTime(startV.getTime() - (todayDayId - 1) * 24 * 60 * 60 * 1000);
	}

	for ( var x = 0; x < 7; x++) {
		var startDate = new Date();
		var endDate = new Date();

		var startTime = new Date(startV.getFullYear(), startV.getMonth(), startV.getDate(), 0, 0, 0, 0);
		if (x == 0) {
			startV.setTime(startTime.getTime() + x * 24 * 60 * 60 * 1000);
			endV.setTime(startV.getTime() + 24 * 60 * 60 * 1000);
		} else {
			startV.setTime(endV.getTime());
			endV.setTime(endV.getTime() + 24 * 60 * 60 * 1000);
		}

		startDate.setTime(startV);
		endDate.setTime(endV);

		var dayIdOnChanging;
		if (startDate.getDay() == 0) {
			dayIdOnChanging = 6;
		} else {
			dayIdOnChanging = startDate.getDay() - 1;
		}

		eventList.push( {
			id :"new-" + dayIdOnChanging + getHourMinute(startDate) + "-" + getHourMinute(endDate),
			title :'',
			start :startDate,
			end :endDate,
			allDay :false
		});

		var tempdate = getHourMinute(startDate) + "-" + getHourMinute(endDate);

		changingsOnDayTimeSettings[dayIdOnChanging] = changingsOnDayTimeSettings[dayIdOnChanging] + "add" + tempdate + "|";
		//
	}
}

function calculateCalendarStartEndTimes(fromHour, fromMinute, toHour, toMinute, minStartTime, maxStopTime) {
	if (minStartTime == "")
		minStartTime = fromHour + ":00";
	else {
		if (fromHour + ":00" < minStartTime)
			minStartTime = fromHour + ":00";
	}

	if (maxStopTime == "" || ((toHour + ":" + toMinute) > maxStopTime) || toHour == "00") {
		if (toHour == "00")
			maxStopTime = "24:00";
		else {
			if (toMinute > "00") {
				if (toHour == "23")
					maxStopTime = "24:00";
				else
					maxStopTime = parseInt(toHour, 10) + 1 + ":00";
			} else {
				maxStopTime = toHour + ":00";
			}
		}
	}

	return minStartTime + "|" + maxStopTime;
}

function setCalendarHeight(minStartTime, maxStopTime) {
	if (minStartTime != "" && maxStopTime != "") {
		var dStart = new Date();
		var dEnd = new Date();
		dStart.setHours(minStartTime.substring(0, minStartTime.indexOf(":")));
		dStart.setMinutes(minStartTime.substring(minStartTime.indexOf(":") + 1, minStartTime.length));
		dEnd.setHours(maxStopTime.substring(0, maxStopTime.indexOf(":")));
		dEnd.setMinutes(maxStopTime.substring(maxStopTime.indexOf(":") + 1, maxStopTime.length));

		if (dEnd - dStart <= 12 * 60 * 60 * 1000) {
			minTime = minStartTime;
			maxTime = maxStopTime;

			var calStartValue = parseInt(minStartTime.substring(0, minStartTime.indexOf(":")), 10);
			var calEndValue = parseInt(maxStopTime.substring(0, maxStopTime.indexOf(":")), 10);
			calendarHeight = (calEndValue - calStartValue) * 21 + 16; // 21 = $(".fc-agenda-body tr").height() & 16 = $(".fc-agenda-head
			// tr").height()

			personalCalendarView = true;
		} else {
			$("#toggleImage").hide();
			personalCalendarView = false;
		}
	}
}

function setBusinessHoursSettings(eventList, businessHours) {

	var minStartTime = "";
	var maxStopTime = "";
	var startV = new Date();
	var todayDayId = startV.getDay();
	if (todayDayId > 1) {
		startV.setTime(startV.getTime() - (todayDayId - 1) * 24 * 60 * 60 * 1000);
	}

	var businessHoursArray = businessHours.split("|");
	for ( var x = 0; x < businessHoursArray.length; x++) {
		if (businessHoursArray[x] != "") {
			var fromToHours = businessHoursArray[x].split("-");
			var fromHour = fromToHours[0].substring(0, fromToHours[0].indexOf(":"));
			var fromMinute = fromToHours[0].substring(fromToHours[0].indexOf(":") + 1, fromToHours[0].length);
			var toHour = fromToHours[1].substring(0, fromToHours[1].indexOf(":"));
			var toMinute = fromToHours[1].substring(fromToHours[1].indexOf(":") + 1, fromToHours[1].length);

			// calculate minTime and maxTime for calendar view - start
			calendarStartEndTime = calculateCalendarStartEndTimes(fromHour, fromMinute, toHour, toMinute, minStartTime, maxStopTime);
			if (calendarStartEndTime != "") {
				var calendarStartEndTimeArray = calendarStartEndTime.split("|");
				minStartTime = calendarStartEndTimeArray[0];
				maxStopTime = calendarStartEndTimeArray[1];
			}
			// calculate minTime and maxTime for calendar view - end

			var startDate = new Date();
			var endDate = new Date();

			var startTime = new Date(startV.getFullYear(), startV.getMonth(), startV.getDate(), fromHour, fromMinute, 0, 0);
			var endTime = new Date(startV.getFullYear(), startV.getMonth(), startV.getDate(), toHour, toMinute, 0, 0);

			startDate.setTime(startTime.getTime() + x * 24 * 60 * 60 * 1000);
			endDate.setTime(endTime.getTime() + x * 24 * 60 * 60 * 1000);

			if (toHour == "00" && toMinute == "00") {
				endDate.setTime(startDate.getTime() + 24 * 60 * 60 * 1000);
				endDate.setHours(0);
				endDate.setMinutes(0);
				endDate.setSeconds(0, 0);
			}

			var dayIdOnChanging;
			if (startDate.getDay() == 0) {
				dayIdOnChanging = 6;
			} else {
				dayIdOnChanging = startDate.getDay() - 1;
			}

			eventList.push( {
				id :"new-" + dayIdOnChanging + getHourMinute(startDate) + "-" + getHourMinute(endDate),
				title :'',
				start :startDate,
				end :endDate,
				allDay :false
			});

			var tempdate = getHourMinute(startDate) + "-" + getHourMinute(endDate);

			changingsOnDayTimeSettings[dayIdOnChanging] = changingsOnDayTimeSettings[dayIdOnChanging] + "add" + tempdate + "|";
		}
	}

	setCalendarHeight(minStartTime, maxStopTime);
}

function loadEditVisibilityCalendar(switchView, calendarStartTime, calendarEndTime, calHeight) {

	if ($("#calendarVisibility").html() == "" || switchView) {

		if (switchView) {
			$("#calendarVisibility").html("");
		}

		$("#visibilityDetailInfo").show();

		if (calendarStartTime == undefined && calendarEndTime == undefined) {
			calendarStartTime = minTime;
			calendarEndTime = maxTime;
			calHeight = calendarHeight;
		}

		if (calendarStartTime.charAt(0) == "0") {
			calendarStartTime = calendarStartTime.substring(1, calendarStartTime.lenght);
		}

		if (calendarEndTime.charAt(0) == "0") {
			calendarEndTime = calendarEndTime.substring(1, calendarEndTime.lenght);
		}

		var calendar = $('#calendarVisibility').fullCalendar( {
			header : {
				left :'',
				center :'',
				right :''
			},

			defaultView :'agendaWeek',
			columnFormat : {
				month :'ddd',
				week :'ddd',
				day :'ddd'
			},
			firstDay :1,
			dayNamesShort :$.i18n.prop('calendar.dayNamesShort').split(','),
			dayNames :$.i18n.prop('calendar.dayNames').split(','),
			allDaySlot :false,
			selectable :true,
			selectHelper :true,
			events :geventArr,
			eventColor :'#1e90ff',
			defaultEventMinutes :60,
			slotMinutes :60,
			axisFormat :"H:mm", // 24h timeformat
			timeFormat :"H:mm{ - H:mm}",
			minTime :calendarStartTime,
			maxTime :calendarEndTime,
			height :calHeight,
			select :function(start, end, allDay) {

				var dayIdOnChanging;
				if (start.getDay() == 0) {
					dayIdOnChanging = 6;
				} else {
					dayIdOnChanging = start.getDay() - 1;
				}

				calendar.fullCalendar('renderEvent', {
					title :'',
					start :start,
					end :end,
					allDay :allDay,
					id :"new-" + dayIdOnChanging + getHourMinute(start) + "-" + getHourMinute(end)
				}, true // make the event "stick"
						);

				var tempdate = getHourMinute(start) + "-" + getHourMinute(end);

				changingsOnDayTimeSettings[dayIdOnChanging] = changingsOnDayTimeSettings[dayIdOnChanging] + "add" + tempdate + "|";

				// unselect event; so that it will be possible to
			// call any other event method; e.g: eventClick
			$('#calendarVisibility').fullCalendar('unselect');
		},
		eventClick :function(calEvent, jsEvent, view) {

			var dayIdOnChanging;
			if (calEvent.start.getDay() == 0) {
				dayIdOnChanging = 6;
			} else {
				dayIdOnChanging = calEvent.start.getDay() - 1;
			}

			var ruleid = "" + calEvent.id;

			var dialogTitle = $.i18n.prop('myVisibility.header');
			$("#visibilityEditTimeDialog").dialog( {
				title :dialogTitle,
				bgiframe :true,
				resizable :false,
				close :function(event, ui) {
					$("#visibilityEditTimeDialog").dialog('destroy');
				}
			}).height("auto");
			$("#visibilityEditTimeDialog").dialog('option', 'title', dialogTitle);
			$("#visibilityEditTimeDialog").dialog('open');

			$('#visibilityEditTimeDialog').html(parseTemplate("visibilityEditTimeTemplate", {
				start :calEvent.start,
				end :calEvent.end,
				ruleid :ruleid,
				dayIdOnChanging :dayIdOnChanging
			}));

			$("#visibilityHourFrom").val(getHour(calEvent.start));
			$("#visibilityMinuteFrom").val(getMinute(calEvent.start));
			$("#visibilityHourTo").val(getHour(calEvent.end));
			$("#visibilityMinuteTo").val(getMinute(calEvent.end));

		},
		disableResizing :true,
		disableDragging :true,
		editable :false
		});

		if (personalCalendarView) {
			$(".fc-agenda-head .fc-leftmost").html(
					"<a><img id='toggleImage' src='images/actn008.gif' style='cursor:pointer;' onclick='changeVisibilityView();'></a>");
			$("#toggleImage").attr("title", $('#visibilitySwitchLink').text());
		} else {
			$("#toggleImage").hide();
		}

	} else if ($("#calendarVisibility").css("display") == "none") {
		$("#calendarVisibility").show();
		$("#visibilityDetailInfo").show();
	} else {
		$("#calendarVisibility").hide();
		$("#visibilityDetailInfo").hide();
	}
}

function saveVisibilitySettings() {

	var d = new Date();
	var gmt = -d.getTimezoneOffset() / 60;

	var notifyMeEveryNthLocationCount = $('#notifyMeEveryNthLocationCount').val();
	var notifyMeEveryNthLocationCheckbox = $('#notifyMeEveryNthLocationCheckbox').attr('checked');

	$.ajax( {
		type :'POST',
		url :'saveTimeVisibilitySettings.action',
		data : {
			dayTimeSettings :changingsOnDayTimeSettings,
			gmt :gmt,
			notifyMeEveryNthLocationCount :notifyMeEveryNthLocationCount,
			notifyMeEveryNthLocationCheckbox :notifyMeEveryNthLocationCheckbox
		},
		success :function(ajaxCevap) {
			$('#privacyCenterDiv').html(myVisibility());
			$('#visibilityDetailInfo').hide();
		}
	});

	// clear data in changingsOnDayTimeSettings array
	changingsOnDayTimeSettings = new Array("", "", "", "", "", "", "");
	minTime = '0:00';
	maxTime = '24:00';
	calendarHeight = 520;
}

function openAddTimeExceptionDialog(ruleid, fromTime, toTime, reason, status, isUpdate) {

	var dialogTitle;

	$('#addTimeExceptionDialog').html("");

	if (isUpdate == 1)
		dialogTitle = $.i18n.prop('editVisibility.editException.title');
	else
		dialogTitle = $.i18n.prop('editVisibility.addTimeException.title');

	document.getElementById("addTimeExceptionDialog").style.display = "";

	$(function() {
		$("#addTimeExceptionDialog").dialog( {
			title :dialogTitle,
			bgiframe :true,
			resizable :false,
			width :450,
			modal :glbmodal,
			close :function(event, ui) {
				$("#addTimeExceptionDialog").dialog('destroy');
			}
		}).height("auto");
	});

	var str = parseTemplate("addTimeExceptionTemplate", {
		ruleid :ruleid,
		fromTime :fromTime,
		toTime :toTime,
		reason :reason,
		status :status,
		isUpdate :isUpdate
	});

	$('#addTimeExceptionDialog').html(str);

	// $("[aria-labelledby ='ui-dialog-title-addTimeExceptionDialog']").css("z-index", "5006");

	$("#addTimeExceptionDialog").dialog('open');
}

function prepareDateComboValues(startTimeStamp, value) {
	$("#timeExceptionDay" + value + " option").filter(function() {
		return $(this).attr('value') == getDay(startTimeStamp);
	}).attr('selected', 'selected');

	var month;
	var monthInt = parseInt(getMonth(startTimeStamp), 10) + 1;
	if (monthInt < 10)
		month = "0" + monthInt.toString();
	else
		month = monthInt.toString();

	$("#timeExceptionMonth" + value + " option").filter(function() {
		return $(this).attr('value') == month;
	}).attr('selected', 'selected');
	$("#timeExceptionYear" + value + " option").filter(function() {
		return $(this).attr('value') == getYear(startTimeStamp);
	}).attr('selected', 'selected');
	$("#timeExceptionHourMinute" + value + " option").filter(function() {
		return $(this).attr('value') == getHourMinute(startTimeStamp);
	}).attr('selected', 'selected');
}

function timeExceptionDialogReady(fromTime, toTime, reason, status) {

	var statusList = $.i18n.prop('editVisibility.statusList').split(",");
	prepareDateComboValues(fromTime, "From");
	prepareDateComboValues(toTime, "To");

	if (reason != 'null')
		$("#timeExceptionReason").val(reason);

	if (status == 1)
		$("#timeExceptionStatus").val(statusList[0]);
	else if (status == 0)
		$("#timeExceptionStatus").val(statusList[1]);

	var locale = userLocale == 'en' ? '' : (userLocale == null ? '' : userLocale);

	$("#timeExceptionDatePickerStart").datepicker($.extend( {}, $.datepicker.regional['' + locale + ''], {
		showMonthAfterYear :false,
		showOn :'button',
		dateFormat :'dd/mm/yy',
		buttonImage :'images/calendar.png',
		buttonImageOnly :true,
		minDate :new Date(),
		onSelect :function(dateText, inst) {
			var daystart = $("#timeExceptionDatePickerStart").datepicker("getDate");

			$("#timeExceptionDatePickerStop").datepicker("option", "minDate", $("#timeExceptionDatePickerStart").datepicker("getDate"));
			$("#timeExceptionDatePickerStop").datepicker("setDate", $("#timeExceptionDatePickerStart").datepicker("getDate"));

			$("#timeExceptionDayFrom").val($.datepicker.formatDate('dd', $("#timeExceptionDatePickerStart").datepicker("getDate")));
			$("#timeExceptionDayTo").val($.datepicker.formatDate('dd', $("#timeExceptionDatePickerStart").datepicker("getDate")));

			$("#timeExceptionMonthFrom").val($.datepicker.formatDate('mm', $("#timeExceptionDatePickerStart").datepicker("getDate")));
			$("#timeExceptionMonthTo").val($.datepicker.formatDate('mm', $("#timeExceptionDatePickerStart").datepicker("getDate")));

			$("#timeExceptionYearFrom").val($.datepicker.formatDate('yy', $("#timeExceptionDatePickerStart").datepicker("getDate")));
			$("#timeExceptionYearTo").val($.datepicker.formatDate('yy', $("#timeExceptionDatePickerStart").datepicker("getDate")));

		}
	}));
	$("#timeExceptionDatePickerStop").datepicker($.extend( {}, $.datepicker.regional['' + localeToBeUsed + ''], {
		showMonthAfterYear :false,
		showOn :'button',
		dateFormat :'dd/mm/yy',
		buttonImage :'images/calendar.png',
		buttonImageOnly :true,
		minDate :new Date(),
		onSelect :function(dateText, inst) {
			$("#timeExceptionDayTo").val($.datepicker.formatDate('dd', $("#timeExceptionDatePickerStop").datepicker("getDate")));
			$("#timeExceptionMonthTo").val($.datepicker.formatDate('mm', $("#timeExceptionDatePickerStop").datepicker("getDate")));
			$("#timeExceptionYearTo").val($.datepicker.formatDate('yy', $("#timeExceptionDatePickerStop").datepicker("getDate")));

		}
	}));

	$("#timeExceptionYearFrom").change(function() {
		if ($("#timeExceptionYearTo").val() < $("#timeExceptionYearFrom").val())
			$("#timeExceptionYearhTo").val($("#timeExceptionYearFrom").val());
	});

	$("#timeExceptionMonthFrom").change(function() {
		if ($("#timeExceptionMonthTo").val() < $("#timeExceptionMonthFrom").val())
			$("#timeExceptionMonthTo").val($("#timeExceptionMonthFrom").val());
	});

	$("#timeExceptionDayFrom").change(function() {
		if ($("#timeExceptionDayTo").val() < $("#timeExceptionDayFrom").val()) {
			$("#timeExceptionDayTo").val($("#timeExceptionDayFrom").val());
		}

	});
}

function saveTimeException(ruleId) {

	var dayFrom = $("#timeExceptionDayFrom").val();
	var monthFrom = $("#timeExceptionMonthFrom").val();
	var yearFrom = $("#timeExceptionYearFrom").val();
	var hourMinuteFrom = $("#timeExceptionHourMinuteFrom").val();

	var dayTo = $("#timeExceptionDayTo").val();
	var monthTo = $("#timeExceptionMonthTo").val();
	var yearTo = $("#timeExceptionYearTo").val();
	var hourMinuteTo = $("#timeExceptionHourMinuteTo").val();

	var exceptionReason = null;
	var exceptionStatus = -1;
	var reasonStr = $.i18n.prop('editVisibility.addTimeException.optional');
	var statusList = $.i18n.prop('editVisibility.statusList').split(",");

	if ($("#timeExceptionReason").val() != reasonStr)
		exceptionReason = $("#timeExceptionReason").val();

	if ($("#timeExceptionStatus").val() == statusList[0])// visible case
		exceptionStatus = 1;
	else
		exceptionStatus = 0;

	var mFromInt = parseInt(monthFrom, 10) - 1;
	var mToInt = parseInt(monthTo, 10) - 1;

	var exceptionStartTime = new Date(yearFrom, mFromInt.toString(), dayFrom, hourMinuteFrom.substring(0, hourMinuteFrom.indexOf(":")),
			hourMinuteFrom.substring(hourMinuteFrom.indexOf(":") + 1), hourMinuteFrom.length).getTime();

	var exceptionStopTime = new Date(yearTo, mToInt.toString(), dayTo, hourMinuteTo.substring(0, hourMinuteTo.indexOf(":")), hourMinuteTo
			.substring(hourMinuteTo.indexOf(":") + 1), hourMinuteTo.length).getTime();

	var today = new Date().getTime();

	if (exceptionStopTime < today || exceptionStopTime < exceptionStartTime) {
		showErrorDialog($.i18n.prop('error.invalid.dateFormat'), true);
		// $("[aria-labelledby ='ui-dialog-title-errorMessage']").css("z-index", "5012");
	} else {
		$("#addTimeExceptionDialog").dialog('close');
		$.ajax( {
			type :'POST',
			url :'saveTimeException',
			async :false,
			dataType :'json',
			data : {
				exceptionStartTime :exceptionStartTime,
				exceptionStopTime :exceptionStopTime,
				exceptionReason :exceptionReason,
				exceptionStatus :exceptionStatus
			},
			success :function(json) {
				openCalendar();
				$("#privacyCenterDiv").hide();
				$('#calendarCenterDiv').show();
			}
		});
	}
}

function deleteTimeException(method, ruleId) {
	$.post('deleteTimeException.action', {
		ruleId :ruleId
	});
	if (method == 'delete') {
		$("#addTimeExceptionDialog").dialog('close');
		$('#calendar').fullCalendar('removeEvents', ruleId);
	}
}

function deleteVisibilitySetting(ruleid, dayIdOnChanging, start, end) {

	if (ruleid.search("new") == -1) {
		changingsOnDayTimeSettings[dayIdOnChanging] = changingsOnDayTimeSettings[dayIdOnChanging] + "delete" + ruleid + "|";
	} else {
		var startDate = new Date(start);
		var endDate = new Date(end);

		var tempdate = getHourMinute(startDate.getTime()) + "-" + getHourMinute(endDate.getTime());
		var deletedStr = "add" + tempdate + "|";
		changingsOnDayTimeSettings[dayIdOnChanging] = changingsOnDayTimeSettings[dayIdOnChanging].replace(deletedStr, "");
	}

	$('#calendarVisibility').fullCalendar('removeEvents', ruleid);

	$("#visibilityEditTimeDialog").dialog('destroy');

}

function addVisibilitySetting(ruleid, dayIdOnChanging, start, end) {

	if (validateHours($("#visibilityHourFrom").val() + ":" + $("#visibilityMinuteFrom").val(), $("#visibilityHourTo").val() + ":"
			+ $("#visibilityMinuteTo").val())) {

		deleteVisibilitySetting(ruleid, dayIdOnChanging, start, end);// remove old one

		var tempdate = $("#visibilityHourFrom").val() + ":" + $("#visibilityMinuteFrom").val() + "-" + $("#visibilityHourTo").val() + ":"
				+ $("#visibilityMinuteTo").val();

		changingsOnDayTimeSettings[dayIdOnChanging] = changingsOnDayTimeSettings[dayIdOnChanging] + "add" + tempdate + "|";// add new one

		var startDate = new Date(start);
		var endDate = new Date(end);

		startDate.setHours($("#visibilityHourFrom").val());
		startDate.setMinutes($("#visibilityMinuteFrom").val());
		endDate.setHours($("#visibilityHourTo").val());
		endDate.setMinutes($("#visibilityMinuteTo").val());

		if (getHourMinute(endDate.getTime()) == "00:00") {
			endDate.setTime(startDate.getTime() + 24 * 60 * 60 * 1000);
			endDate.setHours(0);
			endDate.setMinutes(0);
			endDate.setSeconds(0, 0);
		} else {
			if (endDate.getTime() - startDate.getTime() > 24 * 60 * 60 * 1000) {
				endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), endDate.getHours(), endDate.getMinutes(),
						endDate.getSeconds(), endDate.getMilliseconds());
			}
		}

		$('#calendarVisibility').fullCalendar(
				'renderEvent',
				{
					title :'',
					start :startDate,
					end :endDate,
					allDay :false,
					id :"new-" + dayIdOnChanging + $("#visibilityHourFrom").val() + ":" + $("#visibilityMinuteFrom").val() + "-"
							+ $("#visibilityHourTo").val() + ":" + $("#visibilityMinuteTo").val()
				}, true // make the event "stick"
				);

		$("#visibilityEditTimeDialog").dialog('destroy');
	}
}

function changeVisibilityView() {
	personalCalendarView = true;
	if ($("#visibilitySwitchLink").text() == $.i18n.prop('myVisibility.switchTo.businessHoursView')) {
		// switch calendar to business hours view
		loadEditVisibilityCalendar(true, minTime, maxTime, calendarHeight);
		$("#visibilitySwitchLink").text($.i18n.prop('myVisibility.switchTo.defaultView'));
		$("#toggleImage").attr("title", $('#visibilitySwitchLink').text());
	} else if ($("#visibilitySwitchLink").text() == $.i18n.prop('myVisibility.switchTo.defaultView')) {
		// switch calendar to 7/24 view
		loadEditVisibilityCalendar(true, '0:00', '24:00', 520);
		$("#visibilitySwitchLink").text($.i18n.prop('myVisibility.switchTo.businessHoursView'));
		$("#toggleImage").attr("title", $('#visibilitySwitchLink').text());
	} else {
		// nothing to do
	}
}