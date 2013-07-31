function prepareStartDate(timestamp) {
	if (timestamp != -1)
		$("#locRequestInboxStartTime").text(getDate(timestamp) + " - ");
	else {
		$("#locRequestInboxStartTime").text($.i18n.prop('locationRequest.always'));
	}
}

function prepareStopDate(timestamp) {
	if (timestamp != -1)
		$("#locRequestInboxStopTime").text(getDate(timestamp));
}

function showCategoryDetail(poiCatId, catName, catPoiCount) {

	openEnterpriseEditCategoryDialog(0, poiCatId, catName, catPoiCount);
	// $("[aria-labelledby ='ui-dialog-title-dialog']").css("z-index", "5004");

}

function showPoiDetail(poiId, poiName, poiType, modal) {

	openEditLocationDialog(poiId, poiName, poiType, modal);
	// $("[aria-labelledby ='ui-dialog-title-edit_loc_dialog']").css("z-index", "5006");

}

function shareMyLocation(userId, userName, messageId) {
	var selectedUserList = [];
	selectedUserList.push(userId + ":" + userName);
	var dialogTitle = $.i18n.prop('shareMyLocation.title');
	$("#shareMyLocationDialog").dialog( {
		title :dialogTitle,
		width :650,
		minHeight :280,
		bgiframe :true,
		modal :glbmodal,
		close :function(event, ui) {
			$("#shareMyLocationDialog").dialog('destroy');
		}
	});

	// $("[aria-labelledby ='ui-dialog-title-shareMyLocationDialog']").css("z-index", "5003");

	$("#shareMyLocationDialog").dialog('option', 'title', dialogTitle);
	$("#shareMyLocationDialog").dialog('open');

	$('#shareMyLocationDialog').html(parseTemplate("shareMyLocationTemplate", {
		messageId :messageId,
		selectedUserList :selectedUserList
	}));
}