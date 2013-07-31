function AjxSaveApplication() {
	var serializedFormData = $('#saveApplication').serialize();

	var lbasApplicationId = $('input[name="lbasApplication.id"]').val();

	var paramUrl;
	if (lbasApplicationId > 0) {
		paramUrl = 'updateApplication.action';
	} else {
		paramUrl = 'saveApplication.action';
	}

	$.ajax({
		type :'POST',
		url :paramUrl,
		data :serializedFormData,
		dataType :'json',
		success :function(json) {
			if (checkResponseSuccess(json)) {
				$('#applicationList').load('listApplications.action');
				$('#edit_application_dialog').dialog('close');
			}
		}
	});
}

function openEditApplicationDialog(id) {
	$("#edit_application_dialog").dialog({
		modal :glbmodal,
		bgiframe :true,
		resizable :false,
		close :function(event, ui) {
			$('input[name="lbasApplication.id"]').val(0);
			$("#edit_application_dialog").dialog('destroy');
		}
	}).height("auto");

	$("#edit_application_dialog").dialog('option', 'title', $.i18n.prop('applicationEdit.editApplication'));
	var editUrl = "editApplication.action";
	var templateName = "applicationEditTemplate";
	$.ajax({
		url :editUrl,
		type :'POST',
		async :false,
		data :{
			'id' :id
		},
		dataType :'json',
		success :function(json) {

			if (checkResponseSuccess(json)) {
				$('#edit_application_dialog').html(parseTemplate(templateName, {
					json :json
				}));

				$("#edit_application_dialog").dialog("option", "position", 'center');
				$("#edit_application_dialog").dialog('open');
			}
		}
	});

}

function clickedOnApplicationCheckBox() {

	if ($("#applicationListContent input:checked").length == 0) {

		$("#applicationListSelectBox option").each(function() {
			$(this).remove();
		});
		$("#applicationListSelectBox").append("<option value='-1'>" + $.i18n.prop('general.actions') + "</option>");
		for ( var i = 0; i < applicationTabActions.length; i++) {
			var action = applicationTabActions[i];
			if (action.key == 8 || action.key == 4) {
				$("#applicationListSelectBox").append("<option value=" + action.key + ">" + action.value + "</option>");
			}
		}

	} else if ($("#applicationListContent input:checked").length >= 1) {

		$("#applicationListSelectBox option").each(function() {
			$(this).remove();
		});
		$("#applicationListSelectBox").append("<option value='-1'>" + $.i18n.prop('general.actions') + "</option>");
		for ( var i = 0; i < applicationTabActions.length; i++) {
			var action = applicationTabActions[i];
			if (action.key != 8 && action.key != 4) {
				$("#applicationListSelectBox").append("<option value=" + action.key + ">" + action.value + "</option>");
			}
		}

	}

}

function applicationActionSelected(selectedAction) {
	switch (selectedAction) {
	case "8": {
		openEditApplicationDialog();
		break;
	}
	default:
		alert('default state');
	}
}
