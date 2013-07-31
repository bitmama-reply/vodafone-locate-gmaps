function openEditAssetDialog(userId) {
	var title;
	if (userId == undefined) {
		userId = 0;
		title = $.i18n.prop('assetEdit.newAsset');
	} else {
		title = $.i18n.prop('assetEdit.editAsset');
	}

	$.ajax({
		url :'editAsset',
		type :'POST',
		async :false,
		data :{
			'id' :userId
		},
		dataType :'json',
		success :function(json) {
			if (checkResponseSuccess(json)) {
				$("#edit_asset_dialog").dialog({
					modal :glbmodal,
					bgiframe :true,
					width :600,
					title :title,
					resizable :false,
					close :function(event, ui) {
						$("#edit_asset_dialog").dialog('destroy');
					}
				}).height("auto");
				$('#edit_asset_dialog').html(parseTemplate('assetEditTemplate', {
					json :json
				}));
				if (json.id > 0) {
					preUserModelMap = json.preUserModelMap;
				}

				initAllocatedUserAutocomplete();
			}
		}
	});
}

function initAllocatedUserAutocomplete() {
	$("#allocatedToFullName").autocomplete({
		source :function(request, response) {
			$.getJSON('userSearchAutocomplete.action', {
				q :request.term,
				excludeGroups :true,
				retrieveAssets :true
			}, function(data) {
				response($.map(data.resultList, function(item) {
					return {
						label :item.value,
						value :item.value,
						id :item.key
					};
				}));
			});
		},
		minLength :3,
		select :function(event, ui) {
			$("#assetAllocatedTo").val(ui.item.id.substr(1));
		},
		open :function() {
			$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
		},
		close :function() {
			$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
		}
	});
}

function AjxSaveAsset() {

	var allocatedTo = $('#saveAsset input[name="lbasUser.allocatedTo"]').val();

	if (allocatedTo == 0) {
		var allocatedToInvalidStr = $('#saveAsset input[name="lbasUser.allocatedToFullName"]').val();
		$('#saveAsset input[name="lbasUser.allocatedToFullName"]').val('');
		if (!lbasValidate('saveAsset')) {
			$('#saveAsset input[name="lbasUser.allocatedToFullName"]').val(allocatedToInvalidStr);
		}
		return;
	}

	var serializedFormData = $('#saveAsset').serialize();

	var lbasUserId = $('#saveAsset input[name="lbasUser.user_id"]').val();

	var paramUrl;
	if (lbasUserId > 0) {
		paramUrl = 'updateAsset.action';
	} else {
		paramUrl = 'saveAsset.action';
	}

	$.ajax({
		type :'POST',
		url :paramUrl,
		data :serializedFormData,
		dataType :'json',
		success :function(json) {
			if (checkResponseSuccess(json)) {
				if (!aPage) {
					var groupidofuser = json.lbasUser.group_id;
					if (json.lbasUser.password != null) {
						$('#gm' + groupidofuser).html('(' + parseInt(parseInt($('#gm' + groupidofuser).html().substr(1, 1)) + 1) + ')');
					}

					groupUsersRefresh();

				} else {
					$('#assetList').load('listAssets.action');
				}
				$('#edit_asset_dialog').dialog('close');
			}
		}
	});

}

function clickedOnAssetCheckBox() {
  
	if ($("#assetListContent input:checked").length == 0) {
		$("#adminAssetListSelectBox option").each(function() {
			$(this).remove();
		});
		$("#adminAssetListSelectBox").append("<option value='-1'>" + $.i18n.prop('general.actions') + "</option>");
		for ( var i = 0; i < adminAssetsTabActions.length; i++) {
			var action = adminAssetsTabActions[i];
			if (action.key == 2 || action.key == 4) {
				$("#adminAssetListSelectBox").append("<option value=" + action.key + ">" + action.value + "</option>");
			}
		}

	} else if ($("#assetListContent input:checked").length >= 1) {

		$("#adminAssetListSelectBox option").each(function() {
			$(this).remove();
		});
		$("#adminAssetListSelectBox").append("<option value='-1'>" + $.i18n.prop('general.actions') + "</option>");
		for ( var i = 0; i < adminAssetsTabActions.length; i++) {
			var action = adminAssetsTabActions[i];
			if (action.key != 2 && action.key != 4) {
				$("#adminAssetListSelectBox").append("<option value=" + action.key + ">" + action.value + "</option>");
			}
		}

	}

}

function adminAssetActionSelected(selectedAction) {
	switch (selectedAction) {
	case "1": {
		adminAssetSelectActions('deleteusermulti', $.i18n.prop('admin.delete.asset.confirm'), $.i18n.prop('admin.delete.user.title'));
		break;
	}
	case "2": {
		openEditAssetDialog();
		break;
	}
	case "4": {
		openUploadFileDialog("asset");
		break;
	}
	default:
		alert('default state');
	}
}

function adminAssetSelectActions(url, textMsg, title) {
	var data;
	var selectedAssetList = new Array();
	$("#assetListContent input:checked").each(function() {
		var id = $(this).parent().parent().get(0).id;
		selectedAssetList.push(id);
	});

	if (url == 'deleteusermulti') {
		data = {
			selectedUserList :selectedAssetList
		};
	}

	var btns = {};
	btns[$.i18n.prop('buttons.confirm')] = function() {
		$.ajax({
			type :'POST',
			url :url,
			data :data,
			dataType :'json',
			async :false,
			success :function(json) {
				if (checkResponseSuccess(json)) {
					$("#activateUsersDialog").dialog('close');

					$.ajax({
						type :'POST',
						url :'listAssets.action',
						success :function(ajaxResponse) {
							if (checkResponseSuccess(ajaxResponse)) {
								$('#assetList').html(ajaxResponse);
							}
						}
					});
				} else {
					$("#activateUsersDialog").dialog('close');
				}
			}
		});

		$(this).dialog('close');
		$(this).dialog('destroy');
	};
	btns[$.i18n.prop('buttons.cancel')] = function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
	};

	document.getElementById("activateUsersDialog").style.display = "";
	$(function() {
		$("#activateUsersDialog").dialog({
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

	$("#activateUsersDialog").dialog('option', 'title', title);
	$("#activateUsersDialog p").text(textMsg);
	$("#activateUsersDialog").dialog('open');
}

function selectAllAssets() {
	$("#lbasAssetList input:checkbox").each(function() {
		this.checked = 'checked';
	});
	clickedOnAssetCheckBox();
}

function deselectAssets() {
	$("#lbasAssetList input:checkbox").each(function() {
		this.checked = '';
	});
	clickedOnAssetCheckBox();
}

function findAssetUsersOnMap() {

	if (mainMarkerManager != null && mainMarkerManager != undefined) {
		var assetFound = false;
		for (markerObj in mainMarkerManager.markers) {
			var obj = mainMarkerManager.markers[markerObj];
			if (obj != null && obj != undefined) {
				var markerOptions = obj.markerOpts;
				if (markerOptions != null && markerOptions != undefined && markerOptions.type != '') {
					assetFound = true;
				}
			}
		}

		if (assetFound) {
			$("#saveAssetsAsPlacesRM").show();
		} else {
			$("#saveAssetsAsPlacesRM").hide();
		}
	}
}

function openSaveAssetsAsPlacesDialog() {
	clearPOIDialogTabs();

	var dialogTitle = $.i18n.prop('tooltipmain.saveAssetsAsPlaces');

	$("#saveAssetsAsPlacesDialog").dialog({
		modal :glbmodal,
		bgiframe :true,
		width :650,
		resizable :false,
		close :function(event, ui) {
			$("#saveAssetsAsPlacesDialog").dialog('destroy');
			$("#saveAssetsAsPlacesContent").html('');
		}
	}).height("auto");
	$("#saveAssetsAsPlacesDialog").dialog('option', 'title', dialogTitle);

	$.post("selectLocationCategory.action", {
		poiId :0
	}, function(data) {
		if (checkResponseSuccess(data)) {
			$('#saveAssetsAsPlacesContent').html(data);
			$("#radioCategoryTypeId2").attr('checked', true);
			unselectEnterpriseCategories();
			$("#saveAssetsAsPlacesDialog").dialog("option", "position", 'center');
			$("#saveAssetsAsPlacesDialog").dialog('open');
		}
	});
}

function saveAssetsAsPlaces() {

	var assetNames = new Array();
	var latitudeList = new Array();
	var longitudeList = new Array();
	if (mainMarkerManager != null && mainMarkerManager != undefined) {
		for (markerObj in mainMarkerManager.markers) {
			var obj = mainMarkerManager.markers[markerObj];
			if (obj != null && obj != undefined) {
				var markerOptions = obj.markerOpts;
				if (markerOptions != null && markerOptions != undefined && markerOptions.type != '') {
					var assetName = markerOptions.type.substring(markerOptions.type.indexOf(":") + 1, markerOptions.type.length);
					assetNames.push(assetName);
					latitudeList.push(markerOptions.latitude);
					longitudeList.push(markerOptions.longitude);
				}
			}
		}
	}

	var serializedFormData = $("#selectLocationCategoryForm").serialize();

	if (assetNames) {
		jQuery.each(assetNames, function(i, val) {
			serializedFormData += "&assetList=" + val;
		});
	}

	if (latitudeList) {
		jQuery.each(latitudeList, function(i, val) {
			serializedFormData += "&latitudeList=" + val;
		});
	}

	if (longitudeList) {
		jQuery.each(longitudeList, function(i, val) {
			serializedFormData += "&longitudeList=" + val;
		});
	}

	$.ajax({
		type :'POST',
		url :'saveAssetsAsPlaces.action',
		data :serializedFormData,
		cache :false,
		dataType :"json",
		success :function(data, textStatus) {
			if (checkResponseSuccess(data)) {
				var poiId = data.poiId;
				var categoryId = -1;
				if ($("#selectLocationCategoryForm input[name=categoryIDs]:checked").length > 0) {
					categoryId = $("#selectLocationCategoryForm input[name=categoryIDs]:checked:first").val();
				}

				var categoryType;
				if ($('#radioCategoryTypeId1:checked').val() == 1) {// enterprise
					categoryType = 0;
					updatePoiCount(assetNames.length, true);
				} else {// personal
					categoryType = 1;
					updatePoiCount(assetNames.length, false);
				}

				// if places tab not clicked before
				if ($('#personalTabContent').html() == null || $('#enterpriseTabContent').html() == null) {
					listLocation();
				}

				loadCategories4Search(categoryType, 0, categoryId, poiId);

				// showPoiDetailOnMap( [ poiId ]);

				$('span.ui-icon-closethick:last').click();
			}

			$("#saveAssetsAsPlacesContent").html('');
		}
	});
}
