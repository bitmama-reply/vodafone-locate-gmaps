/**
 * 
 */

var banDoCRadioValue = '0';

function popupRenewPasswordDialog(infoText) {

	$("#companyPasswordResetDialog [id*='infoText']").text(infoText);
	var btns = {};

	btns[$.i18n.prop('buttons.cancel')] = function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
	};
	btns[$.i18n.prop('buttons.ok')] = function() {
		$.ajax({
			type :'POST',
			url :'companyAdminUserRenewPassword.action',
			data :$('#updateCompany').serialize(),
			dataType :'json',
			success :function(json) {
				if (checkResponseSuccess(json)) {
					$('span.ui-icon-closethick:last').click();
				}
			}
		});
	};

	$("#companyPasswordResetDialog").dialog({
		bgiframe :true,
		resizable :false,
		height :140,
		width :300,
		modal :glbmodal,
		overlay :{
			backgroundColor :'#000',
			opacity :0.5
		},
		buttons :btns
	});

	$("#companyPasswordResetDialog").dialog('open');

}

function AjxUpdateCompany() {
	if (lbasValidate('updateCompany')) {
		var serializedFormData = $('#updateCompany').serialize();

		var banList = '';
		var value = 0;
		$('.banTd').each(function() {
			if ($("#" + $(this).attr('id') + " b[id*='companyBanState']").html().indexOf($.i18n.prop('companyList.Doc.enabled')) > 0) {
				value = 1;
			} else if ($("#" + $(this).attr('id') + " b[id*='companyBanState']").html().indexOf($.i18n.prop('companyList.Doc.disabled')) > 0) {
				value = 0;
			}
			var companyId = $(this).attr('id');
			var id = companyId.substring(10, companyId.length);
			banList = banList + id + "|" + value + ";";

		});

		if (banList.length < 1) {
			showErrorDialog($.i18n.prop('companyList.banRequired'), false);
			return;
		}

		var selectedUser = $("#adminUserCandidates").selected().val();
		var splittedUserValue = selectedUser.split(":");
		var contactNumber = splittedUserValue[0];

		serializedFormData = serializedFormData + "&companyBans=" + banList + "&contactNumber=" + contactNumber;

		$.ajax({
			type :'POST',
			url :'updateCompany.action',
			data :serializedFormData,
			success :function(ajaxCevap) {
				if (checkResponseSuccess(ajaxCevap)) {
					/*********************************************************************************************************************************
					 * $('#companyList').html(ajaxCevap); $.ajax( { url :'loadExpiryDateString.action', dataType :'json', success :function(json) {
					 * $('#expiryDateDatePickerStart').val(json.expiryDateStr); } });
					 ********************************************************************************************************************************/

					$("#createCompanyDialog").dialog('close');
					$("#createCompanyDialog").dialog('destroy');
					$('#companyList').load('listCompanies');

				}
			}
		});
	}
}

function AjxAddCompany() {

	// alert("serialize "+$('#updateCompany').serialize());
	// &lbasCompany.maxUsers=

	if (lbasValidate('updateCompany')) {

		var serializedFormData = $('#updateCompany').serialize();

		var banList = '';
		var value = 0;
		$('.banTd').each(function() {
			if ($("#" + $(this).attr('id') + " b[id*='companyBanState']").html().indexOf($.i18n.prop('companyList.Doc.enabled')) > 0)
				value = 1;
			else if ($("#" + $(this).attr('id') + " b[id*='companyBanState']").html().indexOf($.i18n.prop('companyList.Doc.disabled')) > 0)
				value = 0;

			var companyId = $(this).attr('id');
			var id = companyId.substring(10, companyId.length);
			banList = banList + id + "|" + value + ";";
		});

		if (banList.length < 1) {

			showErrorDialog($.i18n.prop('companyList.banRequired'), false);
			return;

		}

		serializedFormData = serializedFormData + "&companyBans=" + banList;

		$.ajax({
			type :'POST',
			url :'addNewCompany',
			data :serializedFormData,
			success :function(ajaxCevap) {
				if (checkResponseSuccess(ajaxCevap)) {
					$('#companyList').html(ajaxCevap);
					$("#createCompanyDialog").dialog('close');
					$("#createCompanyDialog").dialog('destroy');
				}
			}
		});

	}
}

function removeCompanyBan(cmpBanId, companyId) {

	selectedCompanyId = companyId;
	var recordSize = 0;

	$('.banTd').each(function() {
		if ($(this).attr('id') == 'companyBan' + cmpBanId) {
			$(this).remove();
		}
	});

	$("#deleteConfirmation").dialog('close');
	$("#deleteConfirmation").dialog('destroy');

	return;

}

function addNewCompanyBan(companyId, banValue, status) {

	selectedCompanyId = companyId;

	banDoCRadioValue = status;

	if (status == '0') {
		$('#banDoCRadioItem0').attr('checked', true);
		$("#banDoCRadioItem1").attr("checked", false);
	} else if (status == '1') {
		$('#banDoCRadioItem1').attr('checked', true);
		$("#banDoCRadioItem0").attr("checked", false);
	}

	$('#newCompanyBan').val(banValue);

	if (banValue == '') {
		$('#newCompanyBan').attr('readonly', '');
		$('#banAddOrUpdate').html($.i18n.prop('buttons.add'));
		$('#banAddOrUpdateId').unbind('click');
		$('#banAddOrUpdateId').click(function() {
			if (lbasValidate('newCompanyBanForm'))
				saveCompanyBan(1, banValue);
		});
	} else {
		$('#newCompanyBan').attr('readonly', 'readonly');
		$('#banAddOrUpdate').html($.i18n.prop('buttons.update'));
		$('#banAddOrUpdateId').unbind('click');
		$('#banAddOrUpdateId').click(function() {
			if (lbasValidate('newCompanyBanForm'))
				saveCompanyBan(2, banValue);
		});
	}

	$(function() {
		$("#add_company_ban_dialog").dialog({
			modal :glbmodal,
			width :300,
			bgiframe :true,
			resizable :false,
			close :function(event, ui) {
				$("#add_company_ban_dialog").dialog('destroy');
			}
		}).height("auto");
	});

	$("#add_company_ban_dialog").dialog('option', 'title', $.i18n.prop('companyList.newBan'));
	$("#add_company_ban_dialog").dialog('open');

}

function saveCompanyBan(type, banValue) {

	var status = banDoCRadioValue;

	var DoCoption = $.i18n.prop('companyList.Doc.enabled');
	var key = "companyList.Doc.enabled";
	if (banDoCRadioValue == "0") {// not available
		DoCoption = $.i18n.prop('companyList.Doc.disabled');
		key = "companyList.Doc.disabled";
	}

	if (type == 1) {

		var banList = '';
		$('.banTd').each(function() {
			banList = banList + $(this).attr('id') + ";";
		});
		var arrbanList = banList.split(";");
		var newBan = $.trim($('#newCompanyBan').val());// no space character at
		// the end of ban
		newBan = newBan.replace(/^\s+|\t+|\n+| |\s+$/g, '');// no space
		// character inside
		// ban

		for ( var count = 0; count < arrbanList.length; count++) {
			if (arrbanList[count] == "companyBan" + newBan) {
				showErrorDialog($.i18n.prop('errors.duplicated.ban2'), false);
				return;
			}
		}

		var addNewCompanyBanId = 'addNewCompanyBanId';

		$("#companyBans").append(
				$('<tr id=\"companyBan' + newBan + '\" class="banTd">' + '<td>' + newBan + '</td>'
						+ '<td><a href=\"javascript:void(0);\" onclick=\"removeCompanyBan(\'' + newBan + '\',\'1\',\'' + selectedCompanyId + '\');\"'
						+ 'class=\"changestyle\" style=\"color:#0077B7\">' + $.i18n.prop('buttons.delete') + '</a></td>' + '<td><b>'
						+ $.i18n.prop('companyList.DoC.acronym') + '</b></td>' + '<td><b id=\"companyBanState\" ' + '>' + "<span key=" + key
						+ " class='lm'>" + DoCoption + "</span>" + '</b></td>' + '<td><a id=\"' + addNewCompanyBanId
						+ '\" href=\"javascript:void(0);\" onclick=\"addNewCompanyBan(\'' + selectedCompanyId + '\', \'' + newBan + '\', \'' + status
						+ '\');\"' + 'class=\"changestyle\" style=\"color:#0077B7\"> <b>' + $.i18n.prop('buttons.edit') + '</b></a></td>' + '</tr>'));

	} else if (type == 2) {
		$('.banTd').each(function() {
			if ($(this).attr('id') == 'companyBan' + banValue) {
				$("#companyBan" + banValue + " b[id*='companyBanState']").html("<span key=" + key + " class='lm'>" + DoCoption + "</span>");
				$("#companyBan" + banValue + " a[id*='addNewCompanyBanId']").unbind('click');
				$("#companyBan" + banValue + " a[id*='addNewCompanyBanId']").click(function() {
					addNewCompanyBan(selectedCompanyId, $('#newCompanyBan').val(), status);
				});
			}
		});
	}

	$("#add_company_ban_dialog").dialog('close');
	$("#deleteConfirmation").dialog('close');

}

function openCreateCompanyDialog() {

	$('#createCompanyDialog').html("");
	$("#createCompanyDialog").dialog({
		modal :glbmodal,
		width :500,
		bgiframe :true,
		resizable :false,
		close :function(event, ui) {
			$("#createCompanyDialog").dialog('destroy');
		}
	}).height("auto");

	$('#createCompanyDialog').load('createNewCompany.action', function(data) {
		$("#createCompanyDialog").dialog("option", "position", 'center');
		$("#createCompanyDialog").dialog('option', 'title', $.i18n.prop('companyList.NewCompany'));
		$("#createCompanyDialog").dialog('open');
	});

}

function openEditCompanyDialog(companyId) {

	var dialogWidth = 500;

	$('#createCompanyDialog').html("");
	$("#createCompanyDialog").dialog({
		modal :glbmodal,
		width :600,
		bgiframe :true,
		resizable :false,
		close :function(event, ui) {
			$("#createCompanyDialog").dialog('destroy');
		}
	}).height("auto");

	$.ajax({
		type :'POST',
		url :'editCompany.action',
		data :{
			id :companyId
		},
		cache :false,
		success :function(data, textStatus) {
			if (checkResponseSuccess(data)) {

				$('#createCompanyDialog').html(data);
				$('#updateCompany input[type=text]').addClass('lbasInputTextLarge');
				$('#updateCompany #adminUserCandidates').addClass('lbasInputTextLarge');
				$("#createCompanyDialog").dialog("option", "position", 'center');
				$("#createCompanyDialog").dialog('option', 'title', $.i18n.prop('companyList.EditCompany'));
				$("#createCompanyDialog").dialog('open');

			}
		}

	});
}

function popupViewHistoryDialog() {

	$.ajax({
		type :'POST',
		url :'companyAdminUserViewHistory.action',
		data :$('#updateCompany').serialize(),
		dataType :'json',
		success :function(json) {
			if (checkResponseSuccess(json)) {

				$('#companyViewHistoryDialog').html("");
				$("#companyViewHistoryDialog").dialog({
					modal :glbmodal,
					width :400,
					height :180,
					resizable :false,
					title :$.i18n.prop('companyList.ViewHistory'),
					bgiframe :true,
					close :function(event, ui) {
						$("#companyViewHistoryDialog").dialog('destroy');
					}
				});

				$("#companyViewHistoryDialog").html(parseTemplate("companyHistoryTemplate", {
					companyHistoryList :json.companyHistoryList
				}));

				$("#companyViewHistoryDialog").dialog("option", "position", 'center');
				$("#companyViewHistoryDialog").dialog('option', 'title', $.i18n.prop('companyList.ViewHistory'));
				$("#companyViewHistoryDialog").dialog('open');
			}
		}
	});
}

function deleteCompany(divId, url, id, textMsg) {
	var btns = {};
	btns[$.i18n.prop('buttons.cancel')] = function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
	};
	btns[$.i18n.prop('buttons.ok')] = function() {
		$.ajax({
			type :'POST',
			url :url,
			data :{
				id :id
			},
			async :false,
			success :function(response) {
				if (checkResponseSuccess(response)) {
					$(divId).html(response);
				}
			}
		});

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
		}).height("auto");
	});

	$("#deleteConfirmation").dialog('open');
	$("#deleteConfirmation p").text(textMsg);
}

function selectBanDocRadio(value) {
	banDoCRadioValue = value;
	switch (value) {
	case "1": {
		$("#banDoCRadioItem1").attr("checked", true);
		$("#banDoCRadioItem0").attr("checked", false);
		break;
	}
	case "0": {
		$("#banDoCRadioItem0").attr("checked", true);
		$("#banDoCRadioItem1").attr("checked", false);
		break;

	}
	}
}
function privacyTypeSelected(selectedPrivacy) {
	if (selectedPrivacy == 0) {
		// vodafone privacy
		$("#userAssetEnableCheckboxes input[type=checkbox]").each(function(i) {
			this.disabled = false;
			this.checked = false;
		});
		$("#userAssetEnableCheckboxes").removeClass("lbasDisabledText");
		$("#userAssetEnableCheckboxes").addClass("lbasEnabledText");
		$("#userEnableCheckbox").attr("checked", true);
		$("#userEnableCheckbox").attr("disabled", true);
		$("#userEnableCheckbox").val(true);

	} else if (selectedPrivacy == 1) {
		// customer privacy
		$("#userAssetEnableCheckboxes input[type=checkbox]").each(function(i) {
			this.disabled = true;
			this.checked = true;
		});
		$("#userAssetEnableCheckboxes").removeClass("lbasEnabledText");
		$("#userAssetEnableCheckboxes").addClass("lbasDisabledText");
	}
}

function changeAdminUser() {
	var selectedUser = $("#adminUserCandidates").selected().val();
	var splittedUserValue = selectedUser.split(":");
	if (splittedUserValue.length == 2) {// it is pre-user (msisdn:email)
		// then make textfields editable
		$("#admContactName").attr('readonly', false);
		$("#admContactSurname").attr('readonly', false);
		$("#admContactEmail").attr('readonly', false);

		$("#admContactName").val('');
		$("#admContactSurname").val('');

		if (splittedUserValue[1] == null || splittedUserValue[1] == undefined || splittedUserValue[1] == '' || splittedUserValue[1] == 'null') {
			$("#admContactEmail").val('');
		} else {
			$("#admContactEmail").val(splittedUserValue[1]);
		}
	} else if (splittedUserValue.length > 2) {// it is standart user (msisdn:name:surname:email)
		$("#admContactName").attr('readonly', true);
		$("#admContactSurname").attr('readonly', true);
		$("#admContactEmail").attr('readonly', true);

		var splittedUserValue = selectedUser.split(":");
		$("#admContactName").val(splittedUserValue[1]);
		$("#admContactSurname").val(splittedUserValue[2]);
		$("#admContactEmail").val(splittedUserValue[3]);
	}
}

function ageOfLocationTypeChanged(value) {

	var dayList = $.i18n.prop('company.ageOfLocationDayList');
	var splittedDayList = dayList.split("|");
	var isExist = false;

	if (value == 0) {// hour selected
		for ( var x = 0; x < splittedDayList.length; x++) {
			$("#ageofLocationValueList option").each(function() {
				if (this.value == splittedDayList[x]) {
					$(this).remove();
				}
			});
		}

	} else if (value == 1) {// day selected
		for ( var x = 0; x < splittedDayList.length; x++) {
			isExist = false;

			$("#ageofLocationValueList option").each(function() {
				if (this.value == splittedDayList[x]) {
					isExist = true;
				}
			});

			if (!isExist)
				$("#ageofLocationValueList").append("<option value='" + splittedDayList[x] + "'>" + splittedDayList[x] + "</option>");
		}
	}
}

function displayCompanyDetailInfo(companyId) {

	$.ajax({
		type :'POST',
		url :'editCompany.action',
		data :{
			id :companyId
		},
		cache :false,
		success :function(data, textStatus) {
			if (checkResponseSuccess(data)) {
				$("#companyList").html(data);
				// make all fields readonly in companyList.jsp

				$('#updateCompany input[type=text]').addClass('lbasInputTextLarge');
				$('#updateCompany #adminUserCandidates').addClass('lbasInputTextLarge');
				$('#updateCompany input[type=text]').css('font-size', '1em');

				$("#admCompanyName").attr("disabled", true);
				$("#adminUserCandidates").attr("disabled", true);
				$("#admContactName").attr("disabled", true);
				$("#admContactSurname").attr("disabled", true);
				$("#admContactEmail").attr("disabled", true);
				$("#admCompanyAddress").attr("disabled", true);
				$("#admCompanyCity").attr("disabled", true);
				$("#expiryDateDatePickerStart").attr("disabled", true);
				$("#admMaxUsers").attr("disabled", true);
				$("#notifyMeEveryNthLocationCheckbox").attr("disabled", true);
				$("#notifyMeEveryNthLocationCount").attr("disabled", true);
				$("#useProvisioningCheckbox").attr("disabled", true);
				$("#adminUserSessionTimeout").attr("disabled", true);
				$("#standardUserSessionTimeout").attr("disabled", true);
				$("#companyListContent input[name='lbasCompany.status']").attr("disabled", true);
				// $("#companyListContent [key='buttons.delete']").css("display", "none");
				// $("#companyListContent [key='buttons.edit']").css("display", "none");
				// $("#companyListContent [key='buttons.add']").css("display", "none");
			}
		}

	});
}

function updateCompanyDetailInfo() {

	// first validate selected time values
	var from = "";
	var to = "";
	var validationResult = true;

	for ( var x = 0; x < 7; x++) {
		if ($("#companyCheck" + x).attr('checked') == true) {
			from = $("#companyFromHour" + x).val() + ":" + $("#companyFromMinute" + x).val();
			to = $("#companyToHour" + x).val() + ":" + $("#companyToMinute" + x).val();
			validationResult = validateHours(from, to);
			if (!validationResult)
				break;
		}
	}

	if (validationResult) {
		// Allowed IP validation
		validationResult = validateAllowedIP($("#admCompanyAllowedIp").val());
	}

	if (validationResult) {
		var serializedFormData = $('#updateCompany').serialize();

		// compose business hour data
		var businessHours = "";

		for ( var x = 0; x < 7; x++) {
			if ($("#companyCheck" + x).attr('checked') == true) {
				businessHours += $("#companyFromHour" + x).val() + ":" + $("#companyFromMinute" + x).val() + "-" + $("#companyToHour" + x).val()
						+ ":" + $("#companyToMinute" + x).val();

				businessHours += "|";
			} else {
				businessHours += "|";
			}
		}

		if (businessHours == "|||||||")
			businessHours = "";

		serializedFormData += "&businessHours=" + businessHours;
		$.ajax({
			type :'POST',
			url :'updateCompanyDetailInfo.action',
			data :serializedFormData,
			cache :false,
			success :function(data, textStatus) {
				if (checkResponseSuccess(data)) {
					// displayCompanyDetailInfo(companyId);
				}
			}
		});
	}
}

function prepareBusinessHours(businessHours, tag) {
	var dayNameShortList = $.i18n.prop('calendar.dayNames').split(',');

	$("#" + tag + "BusinessHour6").text(dayNameShortList[0]);
	for ( var x = 0; x < dayNameShortList.length; x++) {
		if (x + 1 < dayNameShortList.length)
			$("#" + tag + "BusinessHour" + x).text(dayNameShortList[x + 1]);
	}

	if (businessHours != null && businessHours != undefined && businessHours != "" && $.trim(businessHours) != "null") {
		var businessHoursArray = businessHours.split("|");
		for ( var x = 0; x < businessHoursArray.length; x++) {
			if (businessHoursArray[x] != "") {
				var fromToHours = businessHoursArray[x].split("-");
				var fromHour = fromToHours[0].substring(0, fromToHours[0].indexOf(":"));
				var fromMinute = fromToHours[0].substring(fromToHours[0].indexOf(":") + 1, fromToHours[0].length);
				var toHour = fromToHours[1].substring(0, fromToHours[1].indexOf(":"));
				var toMinute = fromToHours[1].substring(fromToHours[1].indexOf(":") + 1, fromToHours[1].length);

				$("#" + tag + "FromHour" + x).show();
				$("#" + tag + "FromMinute" + x).show();
				$("#" + tag + "ToHour" + x).show();
				$("#" + tag + "ToMinute" + x).show();
				$("#" + tag + "To" + x).show();
				$("#" + tag + "Check" + x).attr("checked", true);

				$("#" + tag + "FromHour" + x).val(fromHour);
				$("#" + tag + "FromMinute" + x).val(fromMinute);
				$("#" + tag + "ToHour" + x).val(toHour);
				$("#" + tag + "ToMinute" + x).val(toMinute);
				$("#" + tag + "To" + x).text($.i18n.prop('locationRequests.content.to'));
			}
		}
	}
}

function businessHourSelected(value, id, tag) {
	var dayId = id.substring((tag + "Check").length, id.length);
	if (value == 'true') {
		$("#" + tag + "To" + dayId).text($.i18n.prop('locationRequests.content.to'));
		$("#" + tag + "FromHour" + dayId).show();
		$("#" + tag + "FromMinute" + dayId).show();
		$("#" + tag + "To" + dayId).show();
		$("#" + tag + "ToHour" + dayId).show();
		$("#" + tag + "ToMinute" + dayId).show();
	} else if (value == 'false') {
		$("#" + tag + "FromHour" + dayId).hide();
		$("#" + tag + "FromMinute" + dayId).hide();
		$("#" + tag + "To" + dayId).hide();
		$("#" + tag + "ToHour" + dayId).hide();
		$("#" + tag + "ToMinute" + dayId).hide();
	}
}

function crudCDF(method, id, name, desc) {

	$('#cdfMethod').val(method);
	$('#cdfId').val(id);
	$('#cdfName').val(name);
	$('#cdfDesc').val(desc);

	var serializedFormData = $('#updateCompany').serialize();

	$.ajax({
		type :'POST',
		url :'crudCDF.action',
		data :serializedFormData,
		cache :false,
		success :function(data, textStatus) {
			if (checkResponseSuccess(data)) {

				if ($.trim($('#createCompanyDialog').html()) == '') {

					displayCompanyDetailInfo(data.lbasCompany.id);
				} else {

					$("#createCompanyDialog").dialog('close');
					$("#createCompanyDialog").dialog('destroy');
					openEditCompanyDialog(data.lbasCompany.id);
				}
			}
		}
	});

}

function AjxSearchDBObjects() {

	var serializedFormData = $('#listDBObjects').serialize();

	$.ajax({
		type :'POST',
		url :"fillSelectBoxesOnDBObjects.action",
		data :serializedFormData,
		success :function(json) {
			if (checkResponseSuccess(json)) {
				$('#dbObjectsSearchArea').html(parseTemplate("searchDBObjectsTemplate", {
					json :json
				}));

			}
		}
	});
}

function validateSearchDBObjects() {
	if (($("#searchMethod").val() == "" || $("#searchMethod").val() == "SELECT")
			|| ($("#selectedOpco").val() == "" || $("#selectedOpco").val() == "SELECT")
			|| ($("#selectedCompany").val() == "" || $("#selectedCompany").val() == "SELECT")) {

		showErrorDialog($.i18n.prop('errors.searchDBObject.selectRequired'), false);
		return false;
	}
	return true;
}

function AjxListDBObjects() {

	var serializedFormData = $('#listDBObjects').serialize();

	$.ajax({
		type :'POST',
		url :'listDBObjects.action',
		data :serializedFormData,
		dataType :'json',
		success :function(json) {
			if (checkResponseSuccess(json)) {

				$("#dbObjectsList").html(parseTemplate("listDBObjectsTemplate", {
					json :json
				}));

				if (json.lbasDBObjects.length == 0) {
					AjxSearchDBObjects();
				} else {

					for ( var i = 0; i < json.lbasDBObjects.length; i++) {
						fillListDBObjectsTableColumns(json.lbasDBObjects[i], i);
					}
				}

			}
		}
	});
}

function fillListDBObjectsTableColumns(lbasDBObjects, i) {

	if ($("#hdr1").text() == "" || $("#bdy1_" + i).text() == "" || $("#hdr2").text() == "" || $("#bdy2_" + i).text() == "") {

		var qName = lbasDBObjects.name;

		for ( var j = 0; j < lbasDBObjects.attributes.length; j++) {

			var tmpKey = lbasDBObjects.attributes[j].key;
			var tmpVal = lbasDBObjects.attributes[j].value;

			if (qName == "POIByID" || qName == "POIByName" || qName == "POICategoryByID" || qName == "POICategoryByName" || qName == "GroupByID"
					|| qName == "GroupByName") {

				if (tmpKey == "ID") {
					$("#hdr1").text(tmpKey);
					$("#bdy1_" + i).text(tmpVal);
				} else if (tmpKey == "NAME") {
					$("#hdr2").text(tmpKey);
					$("#bdy2_" + i).text(tmpVal);
				}

			}

			else if (qName == "UserByID" || qName == "UserByMsisdn") {

				if (tmpKey == "USER_ID") {
					$("#hdr1").text(tmpKey);
					$("#bdy1_" + i).text(tmpVal);
				} else if (tmpKey == "MSISDN") {
					$("#hdr2").text(tmpKey);
					$("#bdy2_" + i).text(tmpVal);
				}

			} else if (qName == "UserByEmail") {

				if (tmpKey == "USER_ID") {
					$("#hdr1").text(tmpKey);
					$("#bdy1_" + i).text(tmpVal);
				} else if (tmpKey == "EMAIL") {
					$("#hdr2").text(tmpKey);
					$("#bdy2_" + i).text(tmpVal);
				}

			} else if (qName == "CompanyByID" || qName == "CompanyByName") {

				if (tmpKey == "COMPANY_ID") {
					$("#hdr1").text(tmpKey);
					$("#bdy1_" + i).text(tmpVal);
				} else if (tmpKey == "COMPANY_NAME") {
					$("#hdr2").text(tmpKey);
					$("#bdy2_" + i).text(tmpVal);
				}

			} else if (qName == "MeetingByID") {

				if (tmpKey == "ID") {
					$("#hdr1").text(tmpKey);
					$("#bdy1_" + i).text(tmpVal);
				} else if (tmpKey == "SUBJECT") {
					$("#hdr2").text(tmpKey);
					$("#bdy2_" + i).text(tmpVal);
				}

			} else if (qName == "PreUserByMsisdn") {

				if (tmpKey == "COMPANY_ID") {
					$("#hdr1").text(tmpKey);
					$("#bdy1_" + i).text(tmpVal);
				} else if (tmpKey == "MSISDN") {
					$("#hdr2").text(tmpKey);
					$("#bdy2_" + i).text(tmpVal);
				}

			} else if (qName == "PreUserByEmail") {

				if (tmpKey == "COMPANY_ID") {
					$("#hdr1").text(tmpKey);
					$("#bdy1_" + i).text(tmpVal);
				} else if (tmpKey == "EMAIL") {
					$("#hdr2").text(tmpKey);
					$("#bdy2_" + i).text(tmpVal);
				}

			} else if (qName == "PrivacyByUserId" || qName == "PrivacyByMsisdn" || qName == "PrivacyByEmail") {

				if (tmpKey == "ID") {
					$("#hdr1").text(tmpKey);
					$("#bdy1_" + i).text(tmpVal);
				} else if (tmpKey == "COMPANY_ID") {
					$("#hdr2").text(tmpKey);
					$("#bdy2_" + i).text(tmpVal);
				}

			}
		}
	}
}

function viewDBObjectsAttr(id) {

	$('#viewDBObjectsAttrDialog').html("");

	$("#viewDBObjectsAttrDialog").dialog({
		modal :glbmodal,
		width :410,
		resizable :false,
		title :$.i18n.prop('viewDBObjectsAttr.viewDetails'),
		bgiframe :true,
		close :function(event, ui) {
			$("#viewDBObjectsAttrDialog").dialog('destroy');
		}
	}).height("auto");

	$("#viewDBObjectsAttrDialog").html(parseTemplate("viewDBObjectsAttrTemplate", {
		dbObjectsAttr :$('#' + id).val()
	}));

	$("#viewDBObjectsAttrDialog").dialog('option', 'position', 'center');

	if ($("#viewDBObjectsAttrDialog").height() > 500) {
		$("#viewDBObjectsAttrDialog").dialog('option', 'height', 500);
	}

	$("#viewDBObjectsAttrDialog").dialog('open');

}

function initSearchDBObjects() {

	$(":text").keyup(function(e) {
		if ($(this).val() != '') {
			$(":text").not(this).attr('disabled', 'disabled').val('');
		} else {
			$(":text").removeAttr('disabled');
		}
	});

	$("#searchMethod").change(function() {

		if ($("#searchMethod").val() == "COMPANY") {

			$('#idColumn').show();
			$('#nameColumn').show();
			$('#emailColumn').hide();
			$('#msisdnColumn').hide();

		} else if ($("#searchMethod").val() == "GROUP") {

			$('#idColumn').show();
			$('#nameColumn').show();
			$('#emailColumn').hide();
			$('#msisdnColumn').hide();

		} else if ($("#searchMethod").val() == "USER") {

			$('#idColumn').show();
			$('#nameColumn').hide();
			$('#emailColumn').show();
			$('#msisdnColumn').show();

		} else if ($("#searchMethod").val() == "POI") {

			$('#idColumn').show();
			$('#nameColumn').show();
			$('#emailColumn').hide();
			$('#msisdnColumn').hide();

		} else if ($("#searchMethod").val() == "POI_CATEGORY") {

			$('#idColumn').show();
			$('#nameColumn').show();
			$('#emailColumn').hide();
			$('#msisdnColumn').hide();

		} else if ($("#searchMethod").val() == "MEETING") {

			$('#idColumn').show();
			$('#nameColumn').hide();
			$('#emailColumn').hide();
			$('#msisdnColumn').hide();

		} else if ($("#searchMethod").val() == "PRE_USER") {

			$('#idColumn').hide();
			$('#nameColumn').hide();
			$('#emailColumn').show();
			$('#msisdnColumn').show();

		} else if ($("#searchMethod").val() == "PRIVACY") {

			$('#idColumn').show();
			$('#nameColumn').hide();
			$('#emailColumn').show();
			$('#msisdnColumn').show();

		}
	}).trigger('change');

}

function showHideCDF() {

	$('#cdfViewDiv').hide();

	$('#showHideCDFBtn').text($.i18n.prop('buttons.showCdf'));

	$('#showHideCDFBtn').click(function() {

		if ($('#cdfViewDiv').is(':visible')) {
			$('#cdfViewDiv').hide();
			$('#showHideCDFBtn').text($.i18n.prop('buttons.showCdf'));
		} else {
			$('#cdfViewDiv').show();
			$('#showHideCDFBtn').text($.i18n.prop('buttons.hideCdf'));
		}

	});
}

function validateAllowedIP(allowedIP) {
	var valid = false;
	var allowedIPAddresses = allowedIP.split("|");
	if (allowedIPAddresses.length > 0) {
		for ( var x = 0; x < allowedIPAddresses.length; x++) {
			valid = validateIPAddress(allowedIPAddresses[x]);
			if (!valid)
				break;
		}
	}

	if (!valid)
		showErrorDialog($.i18n.prop('error.IPRange'), true);

	return valid;
}