var shareRadioValue = "1";
var shareRestrictChecked = false;
var shareFrequencyChecked = false;

function clickShareRestrict(restrictCheckBox) {
	if (restrictCheckBox.checked) {
		shareRestrictChecked = true;
		$("#shareRestrict").attr('disabled', '');
		$("#shareRestrictLocation").attr('disabled', '');
		$("#regionListSharing").attr('disabled', '');
	} else {
		shareRestrictChecked = false;
		$("#shareRestrict").attr('disabled', 'disabled');
		$("#shareRestrictLocation").attr('disabled', 'disabled');
		$("#regionListSharing").attr('disabled', 'disabled');
	}
}

function clickShareFrequency(frequencyCheckBox) {
	shareFrequencyChecked = frequencyCheckBox.checked
	if (shareFrequencyChecked) {
		$("#shareFrequency").removeAttr('disabled');
	} else {
		$("#shareFrequency").attr('disabled', 'disabled');
	}
}

function shareSpecific(messageId, requestedUsers) {
	var currentTime = new Date().getTime();

	if (requestedUsers.length > 0) {
		var restrictDistance = -1;
		var restrictLocation = null;
		var restrictRegion = null;
		var frequency = -1;

		var dayFrom = $('#shareDayFrom option:selected').val();
		var monthFrom = $('#shareMonthFrom option:selected').val();
		var yearFrom = $('#shareYearFrom option:selected').val();
		var hourFrom = $('#shareHourFrom option:selected').val();
		var minuteFrom = $('#shareMinuteFrom option:selected').val();

		var dayTo = $('#shareDayTo option:selected').val();
		var monthTo = $('#shareMonthTo option:selected').val();
		var yearTo = $('#shareYearTo option:selected').val();
		var hourTo = $('#shareHourTo option:selected').val();
		var minuteTo = $('#shareMinuteTo option:selected').val();

		var mFromInt = parseInt(monthFrom, 10) - 1;
		var mToInt = parseInt(monthTo, 10) - 1;

		var startTime = new Date(yearFrom, mFromInt.toString(), dayFrom, hourFrom, minuteFrom).getTime();

		var stopTime = new Date(yearTo, mToInt.toString(), dayTo, hourTo, minuteTo).getTime();

		var today = new Date().getTime();

		if (stopTime < today || stopTime < startTime) {
			//showErrorDialog($.i18n.prop('error.invalid.dateFormat'), true);
			//$("[aria-labelledby ='ui-dialog-title-errorMessage']").css("z-index", "5013");
			utils && utils.dialog({title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('error.invalid.dateFormat')});
		} else {
			if (shareFrequencyChecked)
				frequency = $('#shareFrequency option:selected').val();

			if (shareRestrictChecked) {
				restrictRegion = $('#regionListSharing option:selected').val();
				restrictDistance = $('#shareRestrict option:selected').val();
				restrictLocation = $('#shareRestrictLocation').val();
			}
			
			if (restrictLocation == "") {
				/*
				var btns = {};
				btns[$.i18n.prop('buttons.ok')] = function() {
					$(this).dialog('close');
					$(this).dialog('destroy');
				};
				
				$("#errorMessage").dialog( {
					bgiframe :true,
					width :300,
					modal :glbmodal,
					resizable :false,
					buttons :btns
				}).height("auto");

				$("#errorMessage [id*='errorText']").text($.i18n.prop('error.empty.text'));
				*/
				utils && utils.dialog({title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('error.empty.text')});
				
			} else {
				//$("#shareMyLocationDialog").dialog('close');

				var shareFrequencyEn = ((shareFrequencyChecked) ? 1 : 0);
				var shareRestrictEn = ((shareRestrictChecked) ? 1 : 0);
				
				var options = {};
				options.data = {
					currentTime :currentTime,
					startTime :startTime,
					stopTime :stopTime,
					messageId :messageId,
					shareFrequencyEnable :shareFrequencyEn,
					frequency :frequency,
					shareRestrictEnable :shareRestrictEn,
					restrictRegionShare :restrictRegion,
					restrictDistance :restrictDistance,
					restrictLocation :restrictLocation,
					selectedUserList :requestedUsers
				};
				options.success = function(json) {
					if(checkResponseSuccess(json)){
						var btns = {};
						btns[$.i18n.prop('buttons.ok')] = function() {
							$(".dialog").dialog('close');
							if (messageId != -1) {
								refreshMessageContent(messageId, 'INBOX');
							}
						};
						utils && utils.dialog({title: $.i18n.prop('dialog.title.success'), content: json.infoMessage, buttons: btns});
					};	
				};
				utils && utils.lbasDoPost('shareMyLocationSpecific.action', options);
				
				/*
				$.ajax( {
					type :'POST',
					url :'shareMyLocationSpecific.action',
					data : {
						currentTime :currentTime,
						startTime :startTime,
						stopTime :stopTime,
						messageId :messageId,
						shareFrequencyEnable :shareFrequencyEn,
						frequency :frequency,
						shareRestrictEnable :shareRestrictEn,
						restrictRegionShare :restrictRegion,
						restrictDistance :restrictDistance,
						restrictLocation :restrictLocation,
						selectedUserList :requestedUsers
					},
					success :function(ajaxCevap) {
						$("#shareMyLocationDialog").dialog('close');
						if (messageId != -1) {
							refreshMessageContent(messageId, 'INBOX');
						}
					}
				});
				*/
			}
		}
	} else {
		utils && utils.dialog({title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.select.user')});
	}
}

function shareAlways(messageId, requestedUsers) {
	if (requestedUsers.length > 0) {
		var frequency = -1;
		var restrictDistance = -1;
		var restrictLocation = null;
		var restrictRegion = null;

		if (shareFrequencyChecked)
			frequency = $('#shareFrequency option:selected').val();
		if (shareRestrictChecked) {
			restrictRegion = $('#regionListSharing option:selected').val();
			restrictDistance = $('#shareRestrict option:selected').val();
			restrictLocation = $('#shareRestrictLocation').val();
		}

		var shareFrequencyEn = ((shareFrequencyChecked) ? 1 : 0);
		var shareRestrictEn = ((shareRestrictChecked) ? 1 : 0);

		if (restrictLocation == "") {
			utils && utils.dialog({title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('error.empty.text')});
		} else {
			//$("#shareMyLocationDialog").dialog('close');
			
			var options = {};
			options.data = {
				messageId :messageId,
				shareFrequencyEnable :shareFrequencyEn,
				frequency :frequency,
				shareRestrictEnable :shareRestrictEn,
				restrictRegionShare :restrictRegion,
				restrictDistance :restrictDistance,
				restrictLocation :restrictLocation,
				selectedUserList :requestedUsers
			};
			
			options.success = function(json) {
				if(checkResponseSuccess(json)){
					var btns = {};
					btns[$.i18n.prop('buttons.ok')] = function() {
						$('.dialog').dialog('close');
						if (messageId != -1) {
							refreshMessageContent(messageId, 'INBOX');
						}
					};
					utils && utils.dialog({title: $.i18n.prop('dialog.title.success'), content: json.infoMessage, buttons: btns});
				};	
			};
			utils && utils.lbasDoPost('shareMyLocationAlways.action', options);
			
			/*
			$.ajax( {
				type :'POST',
				url :'shareMyLocationAlways.action',
				data : {
					messageId :messageId,
					shareFrequencyEnable :shareFrequencyEn,
					frequency :frequency,
					shareRestrictEnable :shareRestrictEn,
					restrictRegionShare :restrictRegion,
					restrictDistance :restrictDistance,
					restrictLocation :restrictLocation,
					selectedUserList :requestedUsers
				},
				success :function(ajaxCevap) {
					$("#shareMyLocationDialog").dialog('close');
					if (messageId != -1) {
						refreshMessageContent(messageId, 'INBOX');
					}
				}
			});
			*/
		}
	} else {
		utils && utils.dialog({title:$.i18n.prop('dialog.error.title'), content:$.i18n.prop('warning.select.user')});
	}
}

function share(messageId, requestedUsers) {
	var shareWith = utils && utils.getChecked('#shareLocationUserList ul li:visible p').length;

	if(shareWith>0){
		switch (shareRadioValue) {
			case "1": {
				shareAlways(messageId, requestedUsers);
				break;
			}
			case "2": {
				shareSpecific(messageId, requestedUsers);
				break;
			}
		}
	}else{
		utils && utils.dialog({title:$.i18n.prop('dialog.title.error'), content:$.i18n.prop('warning.select.user')});
	}	
}

function selectDuration(value) {
	shareRadioValue = value;
	switch (value) {
		case "1": {
			$("#shareSpecific").css('display','none');
			$("#shareSpecificProfile").css('display','block');
			break;
		}
		case "2": {
			$("#shareSpecific").css('display', 'block');
			$("#shareSpecificProfile").css('display','none');			
			break;
		}
	}
}

function prepareShareComboBoxes() {
	$("#shareFrequency").attr('disabled', 'disabled');

	$("#shareRestrict").attr('disabled', 'disabled');
	$("#shareRestrictLocation").attr('disabled', 'disabled');
	$("#regionListSharing").attr('disabled', 'disabled');

	var nowDate = new Date();
	prepareShareFromDate(nowDate.getTime());
	
	var oneHourAfterDate = new Date(nowDate.getTime() + (1 * 60 * 60 * 1000));
	prepareShareToDate(oneHourAfterDate.getTime());
}

function prepareShareFromDate(startTimeStamp) {

	$("#shareDayFrom option").filter(function() {
		return $(this).attr('value') == getDay(startTimeStamp);
	}).attr('selected', 'selected');

	var month;
	var monthInt = parseInt(getMonth(startTimeStamp), 10) + 1;
	if (monthInt < 10)
		month = "0" + monthInt.toString();
	else
		month = monthInt.toString();

	$("#shareMonthFrom option").filter(function() {
		return $(this).attr('value') == month;
	}).attr('selected', 'selected');
	$("#shareYearFrom option").filter(function() {
		return $(this).attr('value') == getYear(startTimeStamp);
	}).attr('selected', 'selected');
	$("#shareHourFrom option").filter(function() {
		return $(this).attr('value') == getHour(startTimeStamp);
	}).attr('selected', 'selected');
	$("#shareMinuteFrom option").filter(function() {
		return $(this).attr('value') == getMinute(startTimeStamp);
	}).attr('selected', 'selected');
}

function prepareShareToDate(stopTimeStamp) {

	$("#shareDayTo option").filter(function() {
		return $(this).attr('value') == getDay(stopTimeStamp);
	}).attr('selected', 'selected');

	var month;
	var monthInt = parseInt(getMonth(stopTimeStamp), 10) + 1;
	if (monthInt < 10)
		month = "0" + monthInt.toString();
	else
		month = monthInt.toString();

	$("#shareMonthTo option").filter(function() {
		return $(this).attr('value') == month;
	}).attr('selected', 'selected');
	$("#shareYearTo option").filter(function() {
		return $(this).attr('value') == getYear(stopTimeStamp);
	}).attr('selected', 'selected');
	$("#shareHourTo option").filter(function() {
		return $(this).attr('value') == getHour(stopTimeStamp);
	}).attr('selected', 'selected');
	$("#shareMinuteTo option").filter(function() {
		return $(this).attr('value') == getMinute(stopTimeStamp);
	}).attr('selected', 'selected');
}
