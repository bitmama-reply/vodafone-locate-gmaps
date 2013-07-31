var usersTabActions;

function userTabNavigate(operation, refresh) {
	if (operation == 'users') {
		$('#usersAndGroupsTab').addClass('selected');
		$('#usersTabContent').show();
	}
}

function groupUsersRefresh() {

	// one group and one user searched again for refresh the content
	if ($(".groupContent").size() == 1 && $(".groupContent").find('li').size() == 1 && $.trim($(".groupContent").find('li').text()) != ''
			&& $.trim($(".groupContent").find('li').text()) == $.trim($('#groupUserSearchInput').val())) {

		var searchUserId = $(".groupContent").find('li').attr("id").replace('userLi', 'u');
		searchGroup(0, searchUserId);
	} else {

		var groupList = [];
		$(".groupContent").each(function() {
			if ($(this).find('li').text() != '') {
				var groupId = $(this).attr('id').replace('groupContent', '');
				groupList.push(groupId);
			}
		});

		var groupUsersTmp = [];
		$(".groupContent").each(function() {
			if ($(this).find('li').text() != '') {
				$(this).find('li').each(function() {
					var user_id = $(this).attr("id").replace('userLi', '');
					var group_id = $(this).parent(".groupContent").attr('id').replace('groupContent', '');
					groupUsersTmp.push(group_id + ":" + user_id);
				});
			}
		});

		$.ajax({
			url :"groupUsersAutoRefresh",
			type :"POST",
			dataType :"json",
			data :{
				groupList :groupList,
				groupUsersTmp :groupUsersTmp
			},
			success :function(json) {

				try {
					// group tabi acilmis ise
					if (groupList.length > 0) {

						// gruplara ait user bilgilerini set ediyoruz
						if (json != null && json.groupUsers.length > 0) {

							for ( var i = 0; i < json.groupUsers.length; i++) {

								var top = json.groupUsers[i];
								var uclpss = json.usersCurrentLocationPermissionStatuses;
								var uclps = uclpss[top.user_id];

								$("#" + top.user_id).attr("name", top.name);
								$("#tdid" + top.user_id).text(top.fullName);

								// $("#locI" +
								// top.user_id).unbind('click');

								// set locate icon
								var iconName = "";
								if (uclps.locatable == 1 && uclps.trackable == 1 && uclps.roaming == 0) {
									iconName = "User_Trackable.png";
								} else if (uclps.locatable == 1 && uclps.trackable == 1 && uclps.roaming == 1) {
									iconName = "RoamingUser_Trackable.png";
								} else if (uclps.locatable == 0 && uclps.roaming == 0) {
									iconName = "User_NotLocatable.png";
								} else if (uclps.locatable == 0 && uclps.roaming == 1) {
									iconName = "RoamingUser_NotLocatable.png";
								} else if (uclps.locatable == 1 && uclps.trackable == 0 && uclps.roaming == 0) {
									iconName = "User_OnlyLocatable.png";
								} else {
									iconName = "RoamingUser_OnlyLocatable.png";
								}
								$("#locatable" + top.user_id).attr("style", "width:18px; height:14px;");

								var locatableLine = "<img id='locI" + top.user_id + "' src='images/" + iconName + "' name='" + top.user_id + ":"
										+ top.fullName + "' onClick='locateUser(" + top.user_id + ",false," + top.role_id
										+ ")' style='cursor: pointer; width: 11px; height: 10px;'>";

								$("#locatable" + top.user_id).html(locatableLine);

							}
						}

						// remove user
						if (json != null && json.removedUsers.length > 0) {

							for ( var i = 0; i < json.removedUsers.length; i++) {
								var top = json.removedUsers[i];
								$('#userLi' + top.user_id).empty().remove();
							}
						}

						// add user
						if (json != null && json.addedUsers.length > 0) {

							for ( var i = 0; i < json.addedUsers.length; i++) {

								var top = json.addedUsers[i];
								var uclpss = json.usersCurrentLocationPermissionStatuses;
								var uclps = uclpss[top.user_id];

								var newUserLine = "<li id='userLi" + top.user_id + "' style='display: block; padding-left: 22px;'><table><tbody><tr>"
										+ "<td style='width: 12px; height: 14px;' ><input type='checkbox' id='" + top.user_id + "' name='" + top.name
										+ "' value='" + top.user_id + "' onchange='clickUserCheckBox()' ></td>"
										+ "<td style='width: 130px; height: 14px;' id='tdid" + top.user_id + "' >" + top.fullName + "</td>";

								var iconName = "";
								if (uclps.locatable == 1 && uclps.trackable == 1 && uclps.roaming == 0) {
									iconName = "User_Trackable.png";
								} else if (uclps.locatable == 1 && uclps.trackable == 1 && uclps.roaming == 1) {
									iconName = "RoamingUser_Trackable.png";
								} else if (uclps.locatable == 0 && uclps.roaming == 0) {
									iconName = "User_NotLocatable.png";
								} else if (uclps.locatable == 1 && uclps.roaming == 1) {
									iconName = "RoamingUser_NotLocatable.png";
								} else if (uclps.locatable == 1 && uclps.trackable == 0 && uclps.roaming == 0) {
									iconName = "User_OnlyLocatable.png";
								} else {
									iconName = "RoamingUser_OnlyLocatable.png";
								}

								newUserLine += "<td id='locatable" + top.user_id + "' style='width: 18px; height: 14px;'><img id='locI" + top.user_id
										+ "' src='images/" + iconName + "' name='" + top.user_id + ":" + top.fullName + "' onClick='locateUser("
										+ top.user_id + ",false," + top.role_id + ")' style='cursor: pointer; width: 11px; height: 10px;'>"
										+ "</td></tr></tbody></table></li>";

								$("#groupContent" + top.group_id).append(newUserLine);
							}
						}
					}

					// list groups
					if (json != null && json.userGroups.length > 0) {

						for ( var i = 0; i < json.userGroups.length; i++) {

							var top = json.userGroups[i];

							$("#groupcheck" + top.id).attr("name", top.name);
							$("#gn" + top.id).html(top.name);
							$("#gm" + top.id).text("(" + top.userSize + ")");
						}
					}

				} catch (err) {
					alert(err);
				}
			}
		});

	}

}

function groupUsersAutoRefresh(period) {
	var t = setTimeout("groupUsersAutoRefresh(" + period + ")", period);

	groupUsersRefresh();
}

function selectGroup2(userGroup, searchUserId, forceRefresh, groupCheck) {

	groupId = userGroup.id;

	if (!editGroupActive || forceRefresh) {
		currentSelectedGroupId = groupId;

		if (forceRefresh) {
			$("#groupContent" + groupId).empty();
		}

		if ($("#groupContent" + groupId + " li").length <= 0) {
			$("#groupContent" + groupId).empty();
			var result;
			var url = "groupUserByUserId.action";

			var timestamp = new Date().getTime();

			$.ajax({
				url :url,
				type :'POST',
				data :{
					groupId :groupId,
					searchUserId :searchUserId,
					timestamp :timestamp
				},
				dataType :'json',
				success :function(json) {

					try {
						if (json != null && json.groupUsers.length > 0) {

							$("#groupContent" + groupId).html(parseTemplate("groupUserTemplate", {
								json :json
							}));
						}
					} catch (err) {
						alert(err);
					}
				}
			});

		}

		var usercount = $("#gm" + groupId).text();
		var str = usercount.substring(usercount.indexOf('(') + 1, usercount.indexOf(')'));
		var usersize = parseInt(str, 10);

		// groupCheck is undefined means only icon(+,-) clicked
		if (groupCheck == undefined || groupCheck == "undefined") {
			if (usersize > 0) {
				if ($("#groupcheck" + groupId).is(':checked') == false && //
				$("#acIcon" + groupId).attr('src').contains('images/expand_window.png')) {

					$("#groupContent" + groupId).show();
					$("#acIcon" + groupId).attr('src', 'images/colapse_window.png');
				} else if ($("#groupcheck" + groupId).is(':checked') == false
						&& $("#acIcon" + groupId).attr('src').contains('images/colapse_window.png')) {

					$("#groupContent" + groupId).hide();
					$("#acIcon" + groupId).attr('src', 'images/expand_window.png');
				} else if ($("#groupcheck" + groupId).is(':checked') == true
						&& $("#acIcon" + groupId).attr('src').contains('images/expand_window.png')) {

					$("#groupContent" + groupId).show();
					$("#acIcon" + groupId).attr('src', 'images/colapse_window.png');
				} else if ($("#groupcheck" + groupId).is(':checked') == true
						&& $("#acIcon" + groupId).attr('src').contains('images/colapse_window.png')) {

					$("#groupContent" + groupId).hide();
					$("#acIcon" + groupId).attr('src', 'images/expand_window.png');
				}
			} else {

				$("#groupContent" + groupId).hide();
				$("#acIcon" + groupId).attr('src', 'images/colapse_window.png');
			}

		}
	}
}

function selectGroup(groupId, forceRefresh, groupCheck) {

	if (!editGroupActive || forceRefresh) {
		currentSelectedGroupId = groupId;

		if (forceRefresh) {
			$("#groupContent" + groupId).empty();
		}

		if ($("#groupContent" + groupId + " li").length <= 0) {
			$("#groupContent" + groupId).empty();
			var result;
			var url = "groupUsers.action";
			var timestamp = new Date().getTime();

			$.ajax({
				url :url,
				type :'POST',
				data :{
					groupId :groupId,
					timestamp :timestamp
				},
				dataType :'json',
				success :function(json) {

					try {
						if (json != null && json.groupUsers.length > 0) {

							$("#groupContent" + groupId).html(parseTemplate("groupUserTemplate", {
								json :json
							}));
						}
					} catch (err) {
						alert(err);
					}
				}
			});

		}

		var usercount = $("#gm" + groupId).text();
		var str = usercount.substring(usercount.indexOf('(') + 1, usercount.indexOf(')'));
		var usersize = parseInt(str, 10);

		// groupCheck is undefined means only icon(+,-) clicked
		if (groupCheck == undefined || groupCheck == "undefined") {
			if (usersize > 0) {
				if ($("#groupcheck" + groupId).is(':checked') == false && //
				$("#acIcon" + groupId).attr('src').contains('images/expand_window.png')) {

					$("#groupContent" + groupId).show();
					$("#acIcon" + groupId).attr('src', 'images/colapse_window.png');
				} else if ($("#groupcheck" + groupId).is(':checked') == false
						&& $("#acIcon" + groupId).attr('src').contains('images/colapse_window.png')) {

					$("#groupContent" + groupId).hide();
					$("#acIcon" + groupId).attr('src', 'images/expand_window.png');
				} else if ($("#groupcheck" + groupId).is(':checked') == true
						&& $("#acIcon" + groupId).attr('src').contains('images/expand_window.png')) {

					$("#groupContent" + groupId).show();
					$("#acIcon" + groupId).attr('src', 'images/colapse_window.png');
				} else if ($("#groupcheck" + groupId).is(':checked') == true
						&& $("#acIcon" + groupId).attr('src').contains('images/colapse_window.png')) {

					$("#groupContent" + groupId).hide();
					$("#acIcon" + groupId).attr('src', 'images/expand_window.png');
				}
			} else {

				$("#groupContent" + groupId).hide();
				$("#acIcon" + groupId).attr('src', 'images/colapse_window.png');
			}

		}
	}
}

function searchGroup(listIndx, searchUserId) {
	$.ajax({
		url :'searchGroup.action',
		type :'POST',
		async :false,
		data :{
			listIndex :listIndx,
			searchUserId :searchUserId
		},
		dataType :'json',
		success :function(json) {
			$('#users').html(parseTemplate("usersTemplate", {
				json :json,
				searchText :$('#groupUserSearchInput').val()
			}));

			selectGroup2(json.userGroups[0], searchUserId);
		}
	});

}

function usersTabReady(searchText) {

	// set user list div according to centerP panel
	var centerpHeight = parseInt($('#centerP').css('height'));
	$('#userAccordion').css('height', centerpHeight - 100 + 'px');
	$('#usersAccordionDiv').css('height', centerpHeight - 120 + 'px');

	$("#groupUserSearchInput").autocomplete("userSearchAutocomplete", {
		width :260,
		selectFirst :false,
		extraParams :{
			retrieveAssets :true
		// ,excludedUser :currentUser
		},
		parse :function(data) {
			var parsed = new Array();
			var json = data;
			var resultList = json.resultList;
			if (resultList != null) {
				for ( var i = 0; i < resultList.length; i++) {
					parsed[i] = {
						data :new Array(resultList[i].value, resultList[i].key),
						value :resultList[i].value,
						result :resultList[i].value
					};
				}
			}
			return parsed;
		}
	});
	$('#groupUserSearchInput').result(function(event, data, formatted) {
		$('#groupUserSearchInput').val(unEscapeHtmlEntity(data[0]));
		searchGroup(0, data[1]);
	});

	var usStxt;

	if (searchText && searchText != null && searchText != '')
		usStxt = searchText;
	else
		usStxt = $.i18n.prop('general.Search.UsernameOrGroup');

	$('#groupUserSearchInput').val(usStxt);

}

function selectUsers() {
	$("input[id ^= groupcheck]").each(function() {
		this.checked = 'checked';
	});

	$("#userActionList option").each(function() {
		$(this).remove();
	});
	$("#userActionList").append("<option value='-1' class='lm' key ='general.actions' >" + $.i18n.prop('general.actions') + "</option>");
	for ( var i = 0; i < usersTabActions.length; i++) {
		var action = usersTabActions[i];

		// if groupcheck checked then group and user actions listed
		if (($("input[id ^= groupcheck]:checked").length > 1) && (action.key == 2 || action.key == 4 || action.key == 6)) {
			$("#userActionList").append(
					"<option value=" + action.key + "  class='lm' key ='user.actionList." + action.key + "' >" + action.value + "</option>");
		}
	}

}

function unSelectUsers() {
	$("#usersAccordionDiv input:checkbox").each(function() {
		this.checked = '';
	});
	clickUserCheckBox();
}

function clickGroupCheckBox(groupId) {

	if ($("input[id ^= groupcheck]:checked").length > 0) {
		// send groupCheck parameter true
		selectGroup(groupId, false, true);
	} else {
		// send groupCheck parameter false
		selectGroup(groupId, false, false);
	}

	var usercount = $("#gm" + groupId).text();
	var str = usercount.substring(usercount.indexOf('(') + 1, usercount.indexOf(')'));
	var usersize = parseInt(str, 10);

	// if more than one groupchecks are checked then remove checks
	if ($("input[id ^= groupcheck]:checked").length > 1) {

		$("div[id^=locPermGroup]").each(function() {

			if ($(this).find('input:checkbox').attr('id') != ("groupcheck" + groupId)) {

				$(this).find('.userRole').attr('checked', false);
				$(this).find('.assetRole').attr('checked', false);
			}
		});
	}

	// if groupcheck exists then check group checkbox and related users
	// checkboxes
	if ($("input[id ^= groupcheck]:checked").length == 1 && usersize > 0) {

		$("div[id=locPermGroup" + groupId + "]").each(function() {
			if ($(this).find('input:checkbox').attr('id') == ("groupcheck" + groupId)) {

				if ($(this).find('input:checkbox').attr('checked')) {
					$(this).find('.userRole').attr('checked', true);
					$(this).find('.assetRole').attr('checked', true);
				} else {
					$(this).find('.userRole').attr('checked', false);
					$(this).find('.assetRole').attr('checked', false);
				}

			} else {

				$(this).find('.userRole').attr('checked', false);
				$(this).find('.assetRole').attr('checked', false);
			}
		});

	}// if unselect the groupcheck then we remove related users checkboxes
	else if ($("input[id ^= groupcheck]:checked").length == 0 && usersize > 0) {

		$("div[id=locPermGroup" + groupId + "]").each(function() {
			if ($(this).find('input:checkbox').attr('id') == ("groupcheck" + groupId)) {

				$(this).find('input:checkbox').attr('checked', false);
				$(this).find('.userRole').attr('checked', false);
				$(this).find('.assetRole').attr('checked', false);
			}
		});
	}

	clickUserCheckBox();
}

function insertGroupUserActions(id) {

	$("#usersAccordionDiv input:checkbox").each(function() {
		if ($("#" + id).val() == $(this).val())
			$(this).attr('checked', true);
		else
			$(this).attr('checked', false);
	});

	clickUserCheckBox();
}

function initActions(id) {

	var c_contextHtml = "<div class=\"jscontextBtn\" style=\"background:#e4e4e4;\" onclick=\"jscontext('close');\"><b><img src=\"images/dropdwn_arrw_g.png\">&nbsp;"
			+ $.i18n.prop('general.actions') + "</b></div>";

	for ( var i = 0; i < usersTabActions.length; i++) {
		var action = usersTabActions[i];

		c_contextHtml += "<div class=\"jscontextBtn\" onclick=\"insertGroupUserActions(" + id + ");actionSelected('" + action.key
				+ "');jscontext('close');\">" + $.i18n.prop("user.actionList." + action.key) + "</div>";
	}

	$("#actionsText" + id).jscontext({
		html :c_contextHtml,
		bind :"hover",
		fade :true,
		closeOnMouseLeave :true
	});
}

function clickUserCheckBox() {

	// there are 2 cases for this if statement:
	// 1. group is checked, user is not checked; so in this case 'Edit group'and
	// 'Send Message To Group Member' should be seen in action combobox.
	// 2. group check is removed; user check is removed; in this case 'Edit
	// group' should not be seen in action combobox.
	if ($("#usersAccordionDiv input:checkbox:checked").length == 0) { // nothing checked

		$("#userActionList option").each(function() {
			$(this).remove();
		});
		$("#userActionList").append("<option value='-1' class='lm' key ='general.actions'>" + $.i18n.prop('general.actions') + "</option>");
		for ( var i = 0; i < usersTabActions.length; i++) {

			var action = usersTabActions[i];
			if (action.key == 2 || action.key == 4) {
				$("#userActionList").append(
						"<option value=" + action.key + " class='lm' key ='user.actionList." + action.key + "' >" + action.value + "</option>");
			}
		}

	} else if ($("#usersAccordionDiv input:checkbox:checked").length == 1) { // user
		// or
		// group
		// clicked

		$("#userActionList option").each(function() {
			$(this).remove();
		});
		$("#userActionList").append("<option value='-1' class='lm' key ='general.actions' >" + $.i18n.prop('general.actions') + "</option>");
		var selectedUserId = $($("#usersAccordionDiv input:checkbox:checked")[0]).attr('value');
		for ( var i = 0; i < usersTabActions.length; i++) {
			var action = usersTabActions[i];

			// if groupcheck checked then group and user actions listed
			if (($("input[id ^= groupcheck]:checked").length == 1) && action.key != 10) {
				$("#userActionList").append(
						"<option value=" + action.key + " class='lm'  key ='user.actionList." + action.key + "'>" + action.value + "</option>");
			}
			// else only user actions listed
			else if (action.key != 5 && action.key != 2 && action.key != 4) {
				if (action.key == 1 && checkAsset(selectedUserId) && checkLocatable(selectedUserId)) {
					$("#userActionList").append(
							"<option value=" + action.key + " class='lm' key ='user.actionList." + action.key + "'>"
									+ $.i18n.prop('user.actionList.tracking.request') + "</option>");

				} else {
					$("#userActionList").append(
							"<option value=" + action.key + " class='lm' key ='user.actionList." + action.key + "'>" + action.value + "</option>");
				}
			}

		}

	} else if ($("#usersAccordionDiv input:checkbox:checked").length > 1) { // user(s)
		// and/or
		// group(s)

		$("#userActionList option").each(function() {
			$(this).remove();
		});

		$("#userActionList").append("<option value='-1' class='lm' key ='general.actions' >" + $.i18n.prop('general.actions') + "</option>");

		for ( var i = 0; i < usersTabActions.length; i++) {
			var action = usersTabActions[i];

			// only user actions listed
			if (($("input[id ^= groupcheck]:checked").length == 0)
					&& (action.key != 9 && action.key != 5 && action.key != 3 && action.key != 2 && action.key != 4)) {

				if (action.key == 1 && checkIfAllLocatableAssets()) {
					$("#userActionList").append(
							"<option value=" + action.key + "  class='lm'  key ='user.actionList." + action.key + "'>"
									+ $.i18n.prop('user.actionList.tracking.request') + "</option>");
				} else {
					$("#userActionList").append(
							"<option value=" + action.key + "  class='lm'  key ='user.actionList." + action.key + "'>" + action.value + "</option>");
				}
			}
			// groupcheck checked then group and user actions listed
			else if (($("input[id ^= groupcheck]:checked").length == 1) && (action.key != 9 && action.key != 3)) {
				$("#userActionList").append(
						"<option value=" + action.key + "  class='lm' key ='user.actionList." + action.key + "' >" + action.value + "</option>");
			}
			// more than one group checked
			else if (($("input[id ^= groupcheck]:checked").length > 1) && (action.key == 2 || action.key == 4 || action.key == 6)) {
				$("#userActionList").append(
						"<option value=" + action.key + "  class='lm' key ='user.actionList." + action.key + "' >" + action.value + "</option>");
			}
		}

	}

}

function actionSelected(selectedAction, container, user) {
	
	//alert("selectedAction: " + selectedAction);
	var myCont = $('#tab-users').is(':visible') ? '#tab-users' :  '#tab-assets' ;
	switch (selectedAction) {
		case "1": {
			locRequestAction(container, user);
			break;
		}
		case "2": {
			//openNewUserDialog(0);
			createNewUserAction();
			break;
		}
		case "3": {
			// alert('View details of the selected user');
			viewSelectedUserInUsersTab(container, user);
			break;
		}
		case "4": {
			// alert('Create a new group');
			var fromAsset = $('#tab-users').is(':visible') ? false: true;
			createNewGroupAction(fromAsset);
			break;
		}
		case "5": {
			editGroupAction(myCont);
			//editSelectedGroupInUsersTab(container);
			break;
		}
		case "6": {
			openSendMessageDialog(container, user);
			break;
		}
		case "7": {
				if (user != undefined){
					openRequestReportPermissionDialog(container, user);
				}else{
					locReportAction(container, user);	
				}
			break;
		}
		case "8": {
			openDeleteSelectedUsersDialog(myCont);
			break;
		}
		case "9": {
			//editSelectedUserInUsersTab(myCont);
			var checkedUser = utils && utils.getChecked(myCont + ' input:checked', 'user');
			editUserAction(checkedUser);
			break;
		}
		case "10": {
			//openMoveUsersToNewGroupDialog(undefined, container);	
			moveUserNewGroupAction(myCont);
			break;
		}
		case "11": {			
			shareMyLocationAction(myCont);
			break;
		}
		case "12": {
			locateMultipleUsersOnMap(container);
			break;
		}
		case "20": {
			createAssetGroupAction();
			break;
		}
		case "21": {
			openDeleteSelectedUsersDialog(myCont);
			break;
		}
		case "22": {
			editAssetAction();
			break;
		}
		case "23": {
			moveAssetNewGroupAction();
			break;
		}	
		case "24": {
			editGroupAction(myCont);
			break;
		}	

	}
}

function checkAsset(userId) {
	return $('#' + userId).hasClass('assetRole');
}
function checkLocatable(userId) {
	return $('#locatable' + userId + ' img').size() > 0;
}

function checkIfAllLocatableAssets() {
	var assetCheckedSize = $("#usersAccordionDiv input[class=assetRole]:checkbox:checked").length;
	var totalCheckedSize = $("#usersAccordionDiv input:checkbox:checked").length;
	var allLocatable = true;
	if (assetCheckedSize != totalCheckedSize) {
		return false;
	} else {
		$("#usersAccordionDiv input[class=assetRole]:checkbox:checked").each(function(index) {
			allLocatable = allLocatable && checkLocatable($(this).attr('id'));
		});

		return allLocatable;
	}
}

function listGroup() {

	if ($("#usersTabContent").length <= 0) {
		$.ajax({
			url :'listGroups.action',
			type :'POST',
			async :false,
			dataType :'json',
			success :function(json) {
				$('#users').html(parseTemplate("usersTemplate", {
					json :json,
					searchText :null
				}));
			}
		});
	}
}

function refreshGroup() {

	$.ajax({
		url :'listGroups.action',
		type :'POST',
		async :false,
		dataType :'json',
		success :function(json) {
			$('#users').html(parseTemplate("usersTemplate", {
				json :json,
				searchText :null
			}));
		}
	});
}

function AjxSaveUser() {
	
	var validator=new Validator({
	 "lbasUser.name": {
	 	domElement: '#dialog #lbasUser\\.name',
         validate: 'presence'
     },
     "lbasUser.surname": {
	 	domElement: '#dialog #lbasUser\\.surname',
         validate: 'presence'
     },
     "lbasUser.email": {
	 	domElement: '#dialog #lbasUser\\.email',
         validate: 'presence'
     }
    });
	
	 function errorsOnDialog(serverErrors) {
		var el = validator.parseServerErrors(serverErrors);
		$('#error-view-user > div.content-cell >span','#dialog').html($.i18n.prop('error.send.title'));
		$('#error-view-user > div > ul','#dialog').empty().append(el);
		$('#error-view-user','#dialog').show();
	}
	
	var serializedFormData = $('#userDetailForm').serialize() + "&" + $('#userGroupsForm').serialize() + "&" + $('#userPermissionsForm').serialize()
			+ "&" + $('#userCDFDataForm').serialize();
	var lbasUserId = $('input[name="lbasUser.user_id"]').val();
	var paramUrl;
	if (lbasUserId > 0) {
		if ($("#saveUserGroupName").attr("title") != undefined)// means that user does not have create/edit group right
			serializedFormData = serializedFormData + "&selectedGroup=" + $("#saveUserGroupName").attr("title");
		paramUrl = 'updateUser.action';
	} else {
		paramUrl = 'addNewUser.action';//'saveUser.action';
	}

	
	var options = {};
	options.data = serializedFormData;
	options.success = function(json) {
		if (checkResponseSuccess(json,errorsOnDialog)) {
			var btns = {};
			btns[$.i18n.prop('buttons.ok')] = function() {
				$('.dialog').dialog('close');
				groups && groups.getGroupsList({}, true);
				/*
				if (messageId != -1) {
					refreshMessageContent(messageId, 'INBOX');
				}
				*/
			};
			utils && utils.dialog({title: $.i18n.prop('dialog.title.success'), content: json.infoMessage || json.message, buttons: btns});
			
		}
	};
	utils && utils.lbasDoPost(paramUrl, options);
}

function AjxSaveOpcoAdminUser() {
	var serializedFormData = $('#saveOpcoAdminUser').serialize();

	var lbasUserId = $('input[name="lbasUser.user_id"]').val();

	var paramUrl;
	if (lbasUserId > 0) {
		paramUrl = 'updateOpcoAdminUser.action';
	} else {
		paramUrl = 'saveOpcoAdminUser.action';
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
				} else {
					$('#opcoAdminUserList').load('listOpcoAdminUsers.action');
				}
				$('#edit_user_dialog').dialog('close');
			}
		}
	});
}

function showUsersAroundAPointOnMap() {

	$.getJSON('usersAroundMe', {
		lat :'41.107553944813',
		lon :'29.029312133788'
	}, function(data) {
		// alert('Load was performed.' + data.length);
	});

}

function showUsersAroundOnMap(markerManager, map, lat, lon, radius, showAllMarkers, template, data) {
	if (!showAllMarkers) markerManager.removeAllMarkers();

	//map.updateSize();

    var userId = data.userId;



	var options = {};
	options.data = {
		lat: data.latitude || '',
		lon: data.longitude || '',
		radius: radius
	};
	
	var usersList = [];
	
	options.success = function(json) {
		if (checkResponseSuccess(json)) {
			//use timestamp as id for marker and tooltip
			var timestampId = new Date().getTime();

            var tot_aroundme = json.usersAroundMe.length;



            //check if one


			if(tot_aroundme < 2 ){
				utils && utils.dialog({title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.no.user.found')});
			} else{
				for(var i = 0; i < tot_aroundme; i++){
					usersList.push(json.usersAroundMe[i]);
					//user && user.locate(usr, false, false);
				}
				var lastTrackTime = calculateElapsedTime(data.last_pos_date);
				var lastTrackTimeForUsersOffset = calculateElapsedTime(data.last_pos_date, user.timeZoneOffset);
				

/* to be removed
var tooltipContent = parseTemplate('multipleUsersToolTipTemplate', {
					users: usersList,
					markerId: 'multiple' + timestampId,
					minSize: {w:450, h:350}
				});

 				var markerOptions = {
					id :'multiple' + timestampId,
					latitude: data.latitude,
					longitude: data.longitude,
					hasTooltip: true,
					staticContent: true,
					contentHtml: tooltipContent,
					radius: data.radius,
					forceToOpen: true,
					leaveOthersOpen: false,
					address: data.lastPositionAddress
				};
				
				mainMarkerManager.createMarker(markerOptions, options.locateNeighbours);
				var marker = markerManager.markers[markerOptions.id];
				markerManager.getCloserUsersPoints(marker);
				
				adjustZoomLevel(map);
				

$('.globalSearchButton, .globalSearchText').mousedown(function() {
					  $(this).addClass('globalSearchButtonActive');
				}).mouseup(function() {
					  $(this).removeClass('globalSearchButtonActive');
				});
				
				$('.toolTipContent ul li a').click(function(e){
					markerManager.removeAllMarkers();	
					//var id = $(this).attr('id').substring('multiple_user_'.length);
					//user.locate(id, false, false);
					var index = $(this).attr('index');
					user && user.showOnMap(usersList[index]);
					e.preventDefault();
				});
				
				 $('#btn_tooltip_close').click(function(e){
					mainMarkerManager.closeTooltip('multiple' + timestampId);
					e.preventDefault();
				});
*/
			}
 
/*			


   			$.each(json.usersAroundMe, function(){

  			});
*/
 
			/*
 			var nearestArr = new Array();
 			var nearestGroup = new Array(); 
			var len = json.usersAroundMe.length; 
			var i,j;
 			
			nearestArr = json.usersAroundMe;
 			 			
 			for (i=0; i<len; i++) {
				for (j=i+1; j<len; j++) {
					if (nearestArr[i].latitude==nearestArr[j].latitude && nearestArr[i].longitude==nearestArr[j].longitude) {
						nearestGroup.push(nearestArr[i]);
 						nearestGroup.push(nearestArr[j]);
 					}
				}
 			}
            */


			if ( tot_aroundme > 1 )
				multipleLocate = true;

			for(var i=0; i<tot_aroundme; i++){
                var obj_around = json.usersAroundMe[i];
                obj_around.isANearestUser = true;

                //user && user.locate(obj_around, false, false);

                if(userId != obj_around.id) {
                    user && user.locate(obj_around, false, false);
                }
   			}
   			
 			
   			
		}
	};
 	utils && utils.lbasDoGet('usersAround.action', options);
 			
}

 
function updateUserLocationInDashboard(userId) {

	$("#dsUpdtUsrLoc_" + userId).show();
	$.ajax({
		url :"locateUser.action",
		type :'POST',
		data :{
			userId :userId,
			locateLCS :true
		},
		dataType :'json',
		success :function(json) {
			$("#dsUpdtUsrLoc_" + userId).hide();
			if (checkResponseSuccess(json)) {
				var latitude = GMapsHelper.deg2dms(user.latitude);
				var longitude = GMapsHelper.deg2dms(user.longitude);
				var lastTrackTime = calculateElapsedTime(json.user.last_pos_date);
				var lastTrackTimeForUsersOffset = calculateElapsedTime(json.user.last_pos_date, json.user.timeZoneOffset);
				$("#dsUsrLocAd_" + userId).html(json.user.last_pos_address);
				$("#dsUsrLat_" + userId).html(latitude.substring(0, latitude.length - 1));
				$("#dsUsrLon_" + userId).html(longitude.substring(0, longitude.length - 1));
				$("#dsUsrLocTime_" + userId).html(lastTrackTime);
				$("#dsUsrLocTimeUserOffset_" + userId).html(lastTrackTimeForUsersOffset);
			}
		}
	});

}

function calculateElapsedTime(last_pos_date, offset) {
	var str = '';

	var now = new Date();
	var date = new Date(last_pos_date);
  var mhour=3600000;
  var mday=86400000;

	if (offset) {
		var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
		var userDate = new Date(utc + (60000 * (offset)));
		
		str = userDate.getDate() + '.' + (userDate.getMonth() + 1) + '.' + userDate.getFullYear() + ' ';
		str += userDate.toLocaleTimeString() + ' (GMT +' + ((offset) / 60) + ':00)';

		result = $.i18n.prop('locationRequest.last.updated.useroffset', [ str ]);
	} else {
		str = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ';
		str += date.toLocaleTimeString() + ' (GMT +' + ((-1 * date.getTimezoneOffset()) / 60) + ':00)';
		
		/* check difference */
		var diffdate=now.getTime()-date.getTime();
  	if(diffdate<mhour){
        var min = Math.abs(Math.floor( diffdate / (60*1000) ));
        str = min +' '+ $.i18n.prop('tooltip.min.ago');
    } else if(diffdate>=mhour && diffdate< mday){
        var hour =  Math.abs(Math.floor( diffdate / mhour));  
        var lb=(hour==1) ? $.i18n.prop('tooltip.hour.ago') : $.i18n.prop('tooltip.hour.ago');
        str = hour +' '+ lb;
     } if( (diffdate >=mday) && (diffdate < (mday*30))) {
        console.log(diffdate);
        var days = Math.abs(Math.floor( diffdate / mday));
        var lb=(days==1) ? $.i18n.prop('tooltip.day.ago') : $.i18n.prop('tooltip.days.ago');
        str = days +' '+ lb;
     }
		result = $.i18n.prop('locationRequest.last.updated', [ str ]);
	}
	return result;
}

function AjxListUserStatistics() {

	var starttime = $("#startDatePickerStart").val();

	var endtime = $("#endDatePickerStart").val();

	if (endtime <= starttime) {

		showErrorDialog($.i18n.prop('error.invalid.dateFormat'), true);

	} else {

		var serializedFormData = $('#listUserStatistics').serialize();
		$.ajax({
			type :'POST',
			url :"listUserStatistics.action",
			data :serializedFormData,
			async :false,
			success :function(response) {
				if (checkResponseSuccess(response)) {
					/*********************************************************************************************************************************
					 * $('#companyList').html(ajaxCevap); $.ajax( { url :'loadExpiryDateString.action', dataType :'json', success :function(json) {
					 * $('#expiryDateDatePickerStart').val(json.expiryDateStr); } });
					 ********************************************************************************************************************************/
					$('#userStatisticsList').html(response);
				}
			}
		});

		$.ajax({
			type :'POST',
			url :"fillSelectBoxesOnUserList.action",
			data :serializedFormData,
			success :function(response) {
				if (checkResponseSuccess(response)) {
					/*********************************************************************************************************************************
					 * $('#companyList').html(ajaxCevap); $.ajax( { url :'loadExpiryDateString.action', dataType :'json', success :function(json) {
					 * $('#expiryDateDatePickerStart').val(json.expiryDateStr); } });
					 ********************************************************************************************************************************/
					$('#userStatisticsSearchArea').html(response);

				}
			}
		});
	}

}

function AjxListUserStatisticsSearch() {

	var serializedFormData = $('#listUserStatistics').serialize();

	$.ajax({
		type :'POST',
		url :"fillSelectBoxesOnUserList.action",
		data :serializedFormData,
		success :function(response) {
			if (checkResponseSuccess(response)) {
				/*************************************************************************************************************************************
				 * $('#companyList').html(ajaxCevap); $.ajax( { url :'loadExpiryDateString.action', dataType :'json', success :function(json) {
				 * $('#expiryDateDatePickerStart').val(json.expiryDateStr); } });
				 ************************************************************************************************************************************/
				$('#userStatisticsSearchArea').html(response);

			}
		}
	});
}

function AjxListKpi() {
	var serializedFormData = $('#listKpi').serialize();

	$.ajax({
		type :'POST',
		url :"listKpi.action",
		async :false,
		data :serializedFormData,
		success :function(response) {
			if (checkResponseSuccess(response)) {
				/*************************************************************************************************************************************
				 * $('#companyList').html(ajaxCevap); $.ajax( { url :'loadExpiryDateString.action', dataType :'json', success :function(json) {
				 * $('#expiryDateDatePickerStart').val(json.expiryDateStr); } });
				 ************************************************************************************************************************************/
				$('#kpiList').html(response);
				AjxListKpiSelectBox();

			}
		}
	});

	$.ajax({
		type :'POST',
		url :"fillSelectBoxesOnKpiList.action",
		data :serializedFormData,
		success :function(response) {
			if (checkResponseSuccess(response)) {
				/*************************************************************************************************************************************
				 * $('#companyList').html(ajaxCevap); $.ajax( { url :'loadExpiryDateString.action', dataType :'json', success :function(json) {
				 * $('#expiryDateDatePickerStart').val(json.expiryDateStr); } });
				 ************************************************************************************************************************************/
				$('#kpiSearchArea').html(response);

			}
		}
	});
}

function AjxListKpiSelectBox() {

	var serializedFormData = $('#listKpi').serialize();

	$.ajax({
		type :'POST',
		url :"fillSelectBoxesOnKpiList.action",
		data :serializedFormData,
		success :function(response) {
			if (checkResponseSuccess(response)) {
				/*************************************************************************************************************************************
				 * $('#companyList').html(ajaxCevap); $.ajax( { url :'loadExpiryDateString.action', dataType :'json', success :function(json) {
				 * $('#expiryDateDatePickerStart').val(json.expiryDateStr); } });
				 ************************************************************************************************************************************/
				$('#kpiSearchArea').html(response);

			}
		}
	});
}

function setUserRightsBasedOnGroup(selectedOption, isCompanyProvisioned, isUserHasTariff, tariff_add_edit_enterprise_location,
		tariff_request_location, tariff_request_location_report, tariff_create_meetings) {
		  
	var isAddEnterpriseLocation = false;
	var isCreateEnterpriseCategories = false;
	var isCreateEditUsers = false;
	var isCreateEditGroups = false;
	var isRequestCurrentLocation = false;
	var isRequestLocationReport = false;
	var isViewEnterpriseLocations = false;
	var isCreateMeetings = false;
	var isSendMessages = false;


	if (selectedOption != null && selectedOption.options.selectedIndex >= 0) {
		var optionLabel = selectedOption.options[selectedOption.selectedIndex].id;	
		var splittedOptionLabels = optionLabel.split("|");
		
		
		// getting rights from ActionCommons.getGroupListWithGroupRights() method.
		isAddEnterpriseLocation = eval(splittedOptionLabels[1]);
		isCreateMeetings = eval(splittedOptionLabels[2]);
		isRequestCurrentLocation = eval(splittedOptionLabels[3]);
		isSendMessages = eval(splittedOptionLabels[4]);
		isCreateEnterpriseCategories = eval(splittedOptionLabels[5]);
		isCreateEditUsers = eval(splittedOptionLabels[6]);
		isRequestLocationReport = eval(splittedOptionLabels[7]);
		isViewEnterpriseLocations = eval(splittedOptionLabels[8]);
		isCreateEditGroups = eval(splittedOptionLabels[9]);

    
    //if(isUserHasTariff== undefined) return;
    
    
    
    
		if (!isCompanyProvisioned || (isCompanyProvisioned && !isUserHasTariff)) {
		  
			if (isAddEnterpriseLocation) {
				$('#id_add_enterprise_location').attr('checked', true);
				$('#id_add_enterprise_location').val(true);
			} else {
				$('#id_add_enterprise_location').attr('checked', false);
				$('#id_add_enterprise_location').val(false);

				if (getIEBrowserVersion() == 6) {
					$('#id_add_enterprise_location').attr('disabled', true);
				}
			}

			if (isViewEnterpriseLocations) {
				$('#id_view_enterprise_locations').attr('checked', true);
				$('#id_view_enterprise_locations').val(true);
			} else {
				$('#id_view_enterprise_locations').attr('checked', false);
				$('#id_view_enterprise_locations').val(false);

				if (getIEBrowserVersion() == 6) {
					$('#id_view_enterprise_locations').attr('disabled', true);
				}
			}

			if (isRequestCurrentLocation) {
				$('#id_request_current_location').attr('checked', true);
				$('#id_request_current_location').val(true);
			} else {
				$('#id_request_current_location').attr('checked', false);
				$('#id_request_current_location').val(false);

				if (getIEBrowserVersion() == 6) {
					$('#id_request_current_location').attr('disabled', true);
				}
			}

			if (isRequestLocationReport) {
				$('#id_request_location_report').attr('checked', true);
				$('#id_request_location_report').val(true);
			} else {
				$('#id_request_location_report').attr('checked', false);
				$('#id_request_location_report').val(false);

				if (getIEBrowserVersion() == 6) {
					$('#id_request_location_report').attr('disabled', true);
				}
			}

			if (isCreateMeetings) {
				$('#id_create_meetings').attr('checked', true);
				$('#id_create_meetings').val(true);
			} else {
				$('#id_create_meetings').attr('checked', false);
				$('#id_create_meetings').val(false);

				if (getIEBrowserVersion() == 6) {
					$('#id_create_meetings').attr('disabled', true);
				}
			}
		} else {
			if (isUserHasTariff) {
				if (tariff_add_edit_enterprise_location) {
					if (isAddEnterpriseLocation) {
						$('#id_add_enterprise_location').attr('checked', true);
						$('#id_add_enterprise_location').val(true);
					} else {
						$('#id_add_enterprise_location').attr('checked', false);
						$('#id_add_enterprise_location').val(false);

						if (getIEBrowserVersion() == 6) {
							$('#id_add_enterprise_location').attr('disabled', true);
						}
					}

					if (isViewEnterpriseLocations) {
						$('#id_view_enterprise_locations').attr('checked', true);
						$('#id_view_enterprise_locations').val(true);
					} else {
						$('#id_view_enterprise_locations').attr('checked', false);
						$('#id_view_enterprise_locations').val(false);

						if (getIEBrowserVersion() == 6) {
							$('#id_view_enterprise_locations').attr('disabled', true);
						}
					}
				}

				if (tariff_request_location) {
					if (isRequestCurrentLocation) {
						$('#id_request_current_location').attr('checked', true);
						$('#id_request_current_location').val(true);
					} else {
						$('#id_request_current_location').attr('checked', false);
						$('#id_request_current_location').val(false);

						if (getIEBrowserVersion() == 6) {
							$('#id_request_current_location').attr('disabled', true);
						}
					}
				}

				if (tariff_request_location_report) {
					if (isRequestLocationReport) {
						$('#id_request_location_report').attr('checked', true);
						$('#id_request_location_report').val(true);
					} else {
						$('#id_request_location_report').attr('checked', false);
						$('#id_request_location_report').val(false);

						if (getIEBrowserVersion() == 6) {
							$('#id_request_location_report').attr('disabled', true);
						}
					}
				}

				if (tariff_create_meetings) {
					if (isCreateMeetings) {
						$('#id_create_meetings').attr('checked', true);
						$('#id_create_meetings').val(true);
					} else {
						$('#id_create_meetings').attr('checked', false);
						$('#id_create_meetings').val(false);

						if (getIEBrowserVersion() == 6) {
							$('#id_create_meetings').attr('disabled', true);
						}
					}
				}

			}
		}

		if (isCreateEnterpriseCategories) {
			$('#id_create_enterprise_categories').attr('checked', true);
			$('#id_create_enterprise_categories').val(true);
		} else {
			$('#id_create_enterprise_categories').attr('checked', false);
			$('#id_create_enterprise_categories').val(false);

			if (getIEBrowserVersion() == 6) {
				$('#id_create_enterprise_categories').attr('disabled', true);
			}
		}
		if (isCreateEditUsers) {
			$('#id_create_edit_users').attr('checked', true);
			$('#id_create_edit_users').val(true);
		} else {
			$('#id_create_edit_users').attr('checked', false);
			$('#id_create_edit_users').val(false);

			if (getIEBrowserVersion() == 6) {
				$('#id_create_edit_users').attr('disabled', true);
			}
		}
		if (isCreateEditGroups) {
			$('#id_create_edit_groups').attr('checked', true);
			$('#id_create_edit_groups').val(true);
		} else {
			$('#id_create_edit_groups').attr('checked', false);
			$('#id_create_edit_groups').val(false);

			if (getIEBrowserVersion() == 6) {
				$('#id_create_edit_groups').attr('disabled', true);
			}
		}

		if (isSendMessages) {
			$('#id_send_messages').attr('checked', true);
			$('#id_send_messages').val(true);
		} else {
			$('#id_send_messages').attr('checked', false);
			$('#id_send_messages').val(false);

			if (getIEBrowserVersion() == 6) {
				$('#id_send_messages').attr('disabled', true);
			}
		}
	}
}

function setUserRightsBasedOnGroupAndPreUserModelMap(selectedOption, sel) {
		  
	var isAddEnterpriseLocation = false;
	var isCreateEnterpriseCategories = false;
	var isCreateEditUsers = false;
	var isCreateEditGroups = false;
	var isRequestCurrentLocation = false;
	var isRequestLocationReport = false;
	var isViewEnterpriseLocations = false;
	var isCreateMeetings = false;
	var isSendMessages = false;

	var preIsAddEnterpriseLocation = false;
	var preIsCreateEnterpriseCategories = false;
	var preIsCreateEditUsers = false;
	var preIsCreateEditGroups = false;
	var preIsViewEnterpriseLocations = false;
	var preIsCreateMeetings = false;
	var preIsSendMessages = false;

	//Vince Preprovisioned e se falsi sono non abilitabili (c'erano anche prima a livello di gruppo)
	var preIsRequestCurrentLocation = false;
	var preIsRequestLocationReport = false;
	//Vince Preprovisioned e se falsi sono non abilitabili (non è presente a livello di gruppo)
	var preIsBeLocated = false;
	
	//Vince Preprovisioned, non ci sono permessi del gruppo
	var preIsViewAllGroups = false;
	var preIsAgpsEnabled = false;
	var preIsSmsInterfaceEnabled = false;

	if (selectedOption != null && selectedOption.options.selectedIndex >= 0) {
		var optionLabel = selectedOption.options[selectedOption.selectedIndex].id;	
		var splittedOptionLabels = optionLabel.split("|");
		
		
		// getting rights from ActionCommons.getGroupListWithGroupRights() method.
		isAddEnterpriseLocation = eval(splittedOptionLabels[1]);
		isCreateMeetings = eval(splittedOptionLabels[2]);
		isRequestCurrentLocation = eval(splittedOptionLabels[3]);
		isSendMessages = eval(splittedOptionLabels[4]);
		isCreateEnterpriseCategories = eval(splittedOptionLabels[5]);
		isCreateEditUsers = eval(splittedOptionLabels[6]);
		isRequestLocationReport = eval(splittedOptionLabels[7]);
		isViewEnterpriseLocations = eval(splittedOptionLabels[8]);
		isCreateEditGroups = eval(splittedOptionLabels[9]);

    
    //if(isUserHasTariff== undefined) return;
    

		var lbasUserId = $('input[name="lbasUser.user_id"]').val();
		if(lbasUserId <= 0 && sel != null && sel.options.selectedIndex >= 0) {
		  console.log(lbasUserId);
			var permissions = preUserModelMap[sel.options[sel.selectedIndex].value];
			console.log(permissions);
			
			if (permissions != null) {
			  /*updateAndDisableSingleUserCheckBox('id_add_enterprise_location', permissions.add_enterprise_location);
			  updateAndDisableSingleUserCheckBox('id_create_meetings', permissions.create_meetings);*/

				preIsAddEnterpriseLocation = permissions.add_enterprise_location;
				preIsCreateEnterpriseCategories = permissions.create_enterprise_categories;
				preIsCreateEditUsers =  permissions.create_edit_users;
				preIsCreateEditGroups =  permissions.create_edit_groups;
				preIsViewEnterpriseLocations =  permissions.view_enterprise_locations;
				preIsCreateMeetings =  permissions.create_meetings;
				preIsSendMessages =  permissions.send_messages;

				//Vince Preprovisioned e se falsi sono non abilitabili (c'erano anche prima a livello di gruppo)
				preIsRequestCurrentLocation =  permissions.request_current_location;
				preIsRequestLocationReport =  permissions.request_location_report;
				//Vince Preprovisioned e se falsi sono non abilitabili (non è presente a livello di gruppo)
				preIsBeLocated = permissions.be_located;
				
				//Vince Preprovisioned, non ci sono permessi del gruppo
				preIsViewAllGroups = permissions.view_all_groups;
				preIsAgpsEnabled = permissions.agpsEnabled;
				preIsSmsInterfaceEnabled = permissions.smsInterfaceEnabled;
				
			}
		}                         
				
		//details
		//1
		if (preIsAgpsEnabled) {
			$('#id_agps_enabled').attr('checked', true);
			$('#id_agps_enabled').val(true);
		} else {
			$('#id_agps_enabled').attr('checked', false);
			$('#id_agps_enabled').val(false);
		}
		//2
		if (preIsSmsInterfaceEnabled) {
			$('#id_sms_interface_enabled').attr('checked', true);
			$('#id_sms_interface_enabled').val(true);
		} else {
			$('#id_sms_interface_enabled').attr('checked', false);
			$('#id_sms_interface_enabled').val(false);
		}

		
		//Permissions
		//1
		if (isAddEnterpriseLocation || preIsAddEnterpriseLocation) {
			$('#id_add_enterprise_location').attr('checked', true);
			$('#id_add_enterprise_location').val(true);
		} else {
			$('#id_add_enterprise_location').attr('checked', false);
			$('#id_add_enterprise_location').val(false);
		}
		
		//2
		if (isCreateEnterpriseCategories || preIsCreateEnterpriseCategories) {
			$('#id_create_enterprise_categories').attr('checked', true);
			$('#id_create_enterprise_categories').val(true);
		} else {
			$('#id_create_enterprise_categories').attr('checked', false);
			$('#id_create_enterprise_categories').val(false);
		}

		//3
		if (isCreateEditUsers || preIsCreateEditUsers) {
			$('#id_create_edit_users').attr('checked', true);
			$('#id_create_edit_users').val(true);
		} else {
			$('#id_create_edit_users').attr('checked', false);
			$('#id_create_edit_users').val(false);
		}
		
		//4
		if (isCreateEditGroups || preIsCreateEditGroups) {
			$('#id_create_edit_groups').attr('checked', true);
			$('#id_create_edit_groups').val(true);
		} else {
			$('#id_create_edit_groups').attr('checked', false);
			$('#id_create_edit_groups').val(false);
		}

		//5 - se falso non è editabile
		if (preIsRequestCurrentLocation) {
			
			//Lo abilito
			if (getIEBrowserVersion() == 6) {
				$('#id_request_current_location').attr('disabled',false);
			} else {
				$('#id_request_current_location').removeAttr('disabled');
			}
			
			$('#id_request_current_location').attr('checked', true);
			$('#id_request_current_location').val(true);
			
		} else {
			
			//Lo disabilito
			if (getIEBrowserVersion() == 6) {
				$('#id_request_current_location').attr('disabled',true);
			} else {
				$('#id_request_current_location').attr('disabled','disabled');
			}
			
			$('#id_request_current_location').attr('checked', false);
			$('#id_request_current_location').val(false);

		}
		
		//6 - se falso non è editabile
		if (preIsRequestLocationReport) {
			
			//Lo abilito
			if (getIEBrowserVersion() == 6) {
				$('#id_request_location_report').attr('disabled',false);
			} else {
				$('#id_request_location_report').removeAttr('disabled');
			}			
			
			$('#id_request_location_report').attr('checked', true);
			$('#id_request_location_report').val(true);
		} else {

			//Lo disabilito
			if (getIEBrowserVersion() == 6) {
				$('#id_request_current_location').attr('disabled',true);
			} else {
				$('#id_request_current_location').attr('disabled','disabled');
			}
			
			$('#id_request_location_report').attr('checked', false);
			$('#id_request_location_report').val(false);

			if (getIEBrowserVersion() == 6) {
				$('#id_request_location_report').attr('disabled', true);
			}
		}

		//7
		if (isViewEnterpriseLocations || preIsViewEnterpriseLocations) {
			$('#id_view_enterprise_locations').attr('checked', true);
			$('#id_view_enterprise_locations').val(true);
		} else {
			$('#id_view_enterprise_locations').attr('checked', false);
			$('#id_view_enterprise_locations').val(false);
		}
		
		//8
		if (isCreateMeetings || preIsCreateMeetings) {
			$('#id_create_meetings').attr('checked', true);
			$('#id_create_meetings').val(true);
		} else {
			$('#id_create_meetings').attr('checked', false);
			$('#id_create_meetings').val(false);
		}
		
		//9
		if (isSendMessages || preIsSendMessages) {
			$('#id_send_messages').attr('checked', true);
			$('#id_send_messages').val(true);
		} else {
			$('#id_send_messages').attr('checked', false);
			$('#id_send_messages').val(false);
		}
		
		//10- se falso non è editabile
		if (preIsBeLocated) {

			//Lo abilito
			if (getIEBrowserVersion() == 6) {
				$('#id_be_located').attr('disabled',false);
			} else {
				$('#id_be_located').removeAttr('disabled');
			}			

			$('#id_be_located').attr('checked', true);
			$('#id_be_located').val(true);
			
		} else {
			
			//Lo disabilito
			if (getIEBrowserVersion() == 6) {
				$('#id_be_located').attr('disabled',true);
			} else {
				$('#id_be_located').attr('disabled','disabled');
			}
			
			$('#id_be_located').attr('checked', false);
			$('#id_be_located').val(false);
		}
		
		//11
		if (preIsViewAllGroups) {
			$('#id_view_all_groups').attr('checked', true);
			$('#id_view_all_groups').val(true);
		} else {
			$('#id_view_all_groups').attr('checked', false);
			$('#id_view_all_groups').val(false);
		}
				
	}
}

function removeGroupRights(isCompanyProvisioned) {

	$("#userEditRightTable input[type=checkbox]:checked").each(
			function() {
				if (isCompanyProvisioned) {
					if (($(this).attr("id") == "id_create_enterprise_categories") || ($(this).attr("id") == "id_create_edit_users")
							|| ($(this).attr("id") == "id_create_edit_groups") || ($(this).attr("id") == "id_send_messages"))

						$(this).attr("checked", false);
				} else
					$(this).attr("checked", false);
			});

	$("#userEditRightTable input[type=checkbox]:disabled").each(
			function() {
				if (getIEBrowserVersion() == 6) {
					if (isCompanyProvisioned) {
						if (($(this).attr("id") == "id_create_enterprise_categories") || ($(this).attr("id") == "id_create_edit_users")
								|| ($(this).attr("id") == "id_create_edit_groups") || ($(this).attr("id") == "id_send_messages"))

							$(this).attr('disabled', false);
					} else
						$(this).attr('disabled', false);
				}

			});
}



/* thomas */
function checkAndCollapseUserOnSameLocation() {

}