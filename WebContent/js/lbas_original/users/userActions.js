var permissionRequiredList;
var markerObj;
var locationRequestsNumber;
var request_limit = 10000;
var multipleLocate = false;
//var errorPermissionOnMultipleUserLocate=false;


// 1
function locRequestAction(container, user) {
	if (container === undefined){
		if($('#tab-users').is(':visible')){
			container = '#tab-users';
		}
	}

	var startTime = new Date().getTime();
	var stopTime = new Date().getTime();
	var selectedUserList = [];
	var whoDoesNotHaveRights =[];

	var checkedUsers = user;

	if(checkedUsers === undefined){
		checkedUsers = utils && utils.getChecked(container + ' input:checked', 'user');
	}else{
		var id = user.user_id;
		var good = $('#item_'+id).find('.globalSearchButton').hasClass('reportNotAvailableLeft');
		if (good){
			whoDoesNotHaveRights.push($(this));
		}

	}
	$.each(checkedUsers, function(){
		var id = $(this).attr('value');
		var good = $('#item_'+id).find('.globalSearchButton').hasClass('reportNotAvailableLeft');
		if (good){
			whoDoesNotHaveRights.push($(this));
		}
	});
/*

	if(checkedUsers.length === 0 ){
		var id = user.user_id;
		var good = $('#item_'+id).find('.globalSearchButton').hasClass('reportNotAvailableLeft');
		if (good){
			whoDoesNotHaveRights.push($(this));
		}

	}
	
*/
	if (whoDoesNotHaveRights.length === 0){
		utils && utils.dialogError({title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.youHave.rights')});
		return false;
	}
	checkedUsers = whoDoesNotHaveRights;

	if(checkedUsers && checkedUsers.length===0 && user === undefined){
		utils && utils.dialogError({title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.select.user')});
	}else{
		if(checkedUsers.hasOwnProperty('length')){
		
			if(user != undefined){
				checkedUsers = user;
				var checkedUsers = user;
				if(!user){
					checkedUsers = utils && utils.getChecked(container + ' input:checked', 'user');
				}	
				//$.each(checkedUsers, function() {
					var data = checkedUsers;
					var id = checkedUsers.user_id;
					var name = Encoder.htmlDecode(checkedUsers.fullName);
					selectedUserList.push(id+':'+ name);
				//});				
			}else{			
				$.each(checkedUsers, function() {
					var data = $(this).data('user');
					var id = data.user_id;
					var name = Encoder.htmlDecode(data.fullName);
					selectedUserList.push(id+':'+ name);
				});
			}
		
			
		}else{
			var data = user;
			var id = data.user_id;
			var name = Encoder.htmlDecode(data.fullName);
			selectedUserList.push(id+':'+ name);
		}

		var region = "1";
		var viewLocation = 1;
		var locationRequestID = -1;
		var workFrom = '';
		var workTo = '';

		if (userWorkingHours != null && userWorkingHours != "") {
			var workingHoursList = userWorkingHours.split('|');
			if (workingHoursList[0] != "") {
				workFrom = workingHoursList[0].substring(0, workingHoursList[0].indexOf("-"));
				workTo = workingHoursList[0].substring(workingHoursList[0].indexOf("-") + 1, workingHoursList[0].length);
			}
		}

		var data = [{name: 'locationRequestID', value: '-1'},{name: 'selectedUserList', value: selectedUserList}];

		var options = {};
		options.async = false;
		options.data = data;
		options.success = function(json){
			if (json && checkResponseSuccess(json)) {

				var btns = {};
				btns[$.i18n.prop('buttons.cancel')] = function() {
					$(this).dialog('close');
					$(this).dialog('destroy');
				};

				btns[$.i18n.prop('category.RequestPermission')] = function() {
					request();
					refreshUsers();
				};

				var content = parseTemplate("locationRequestTemplate", {
					selectedUserList :selectedUserList,
					startTime :startTime,
					stopTime :stopTime,
					region :region,
					viewLocation :viewLocation,
					locationRequestID :locationRequestID,
					work_from :workFrom,
					work_to :workTo,
					operation :'add',
					duration :null,
					frequency :null,
					restrictDistance :null,
					restrictRegion :null,
					restrictLocation :null,
					restrictEnable :null,
					regionListLocating :json.regionListLocating,
					defaultRegion :json.defaultRegion
				});
				utils && utils.dialog({
					'title':$.i18n.prop('locationRequests.locationRequest'),
					'content':content,
					'buttons': btns,
					'css': 'noClose reqPermission'});

				$('.reqPermission').css({
					'width':500,
					'top':100,
					'margin-left':-90
				});
				$('.reqPermission .s').css({
					'height':370,
					'overflow-y':'auto'
				});

				$(".reqPermission .ui-button-text").each(function(){
					var toPurple = $.i18n.prop('category.RequestPermission');
					var current = $(this).text();
					if(toPurple == current){
						$(this).parent().removeClass('multi_user_button').addClass('purple_button');
					}
				});
			}
		};

		utils && utils.lbasDoGet('locationRequest.action', options);
	}
}

function locReportAction(container, user) {



	//var selectedUserList = user.userId;
	if(!user){

		selectedUserList = utils && utils.getChecked(container + ' input:checked', 'user',true);
  }
	if(selectedUserList && selectedUserList.length===0){

		utils && utils.dialog({title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.select.user')});
	}else if (selectedUserList.length > 5) {

		utils && utils.dialog({title: 'ERROR', content:$.i18n.prop('warning.select.less.user')});
	} else {
	//var content = parseTemplate("locationReportTemplate", {
	//		selectedUserList: selectedUserList
	//	});
	
	var btns = {};
	var content = null;
	
	btns[$.i18n.prop('buttons.cancel') ] = function(){
  	$(this).dialog('close');
		$(this).dialog('destroy');
		};
	
		if (!user) {
	    content = parseTemplate("requestReportPermissionTimeDialog", {});
	    btns[$.i18n.prop('buttons.create')] = function(){

    			var startDate =$(".dateInputFrom").datepicker('getDate')
    			startDate.setHours( $('#start-time .time').val() );
		    	startDate= startDate.setMinutes( $('#start-time .mins').val());
    			var endDate =$(".dateInputTo").datepicker('getDate')
		    	endDate.setHours( $('#end-time .time').val() );
				endDate = endDate.setMinutes( $('#end-time .mins').val());


				reportMultipleUsersOnMap(container, user, startDate , endDate);
			};
	  }else {
	    content = parseTemplate("requestReportPermissionDialog", {
			  selectedUserList: selectedUserList
			  //requestReport: data
			});
			btns[$.i18n.prop('buttons.request')] = function(){
				   viewLocationReportTableOnMap(container, user);
			};
	  }
		utils && utils.dialog({
			title: $.i18n.prop('locationReport.viewReport'),
			content:content, 
			buttons: btns, 
			css: 'locationReportRequestPermission'
		});
	}
}


//view Report on pop up
function locViewReportAction(container, user) {


  	user['permissions'] = {};
  	user.permissions['hasCreateReportPermission']= true;
	var selectedUserList = user;	
	var btns = {};
	var content = null;
	
	
	btns[$.i18n.prop('buttons.cancel') ] = function(){
  	$(this).dialog('close');
		$(this).dialog('destroy');
	};
	
    content = parseTemplate("requestReportPermissionTimeDialog", {});
    btns[$.i18n.prop('buttons.create')] = function(){
	    	
	    	var startDate =$(".dateInputFrom").datepicker('getDate')
	    	startDate.setHours( $('#start-time .time').val() );
	    	startDate= startDate.setMinutes( $('#start-time .mins').val());
/*     		startDate = $.datepicker.formatDate('@', startDate / 1000); */
    		
	    	var endDate =$(".dateInputTo").datepicker('getDate')
	    	endDate.setHours( $('#end-time .time').val() );
    		endDate = endDate.setMinutes( $('#end-time .mins').val());
/*     		endDate = $.datepicker.formatDate('@', endDate / 1000); */

    		
			reportMultipleUsersOnMap(container, user ,startDate ,endDate);
		};
	
	utils && utils.dialog({
/* 		title: $.i18n.prop('reportRequest.title'), */
		title: $.i18n.prop('locationReport.viewReport'),
		content:content,
		buttons: btns,
		css: 'locationReportRequestPermission'
	});
}

function viewLocationReportTableOnMap(container, usr) {
	var selectedUserList = [];
	var checkedUsers = usr;
	if(!usr)
		checkedUsers = utils && utils.getChecked(container + ' input:checked', 'user');

	if(checkedUsers && checkedUsers.length===0){
		utils && utils.dialogError({title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.select.user')});
	}else{
		if(checkedUsers.hasOwnProperty('length')){
			$.each(checkedUsers, function() {
				var id = $(this).attr("value");
				selectedUserList.push(id);
			});
		}else{
			selectedUserList.push(usr.user_id);
		}

		var startH = $('#start-time .hours').val();
		var startM = $('#start-time .mins').val();
		var endH = $('#end-time .hours').val();
		var endM = $('#end-time .mins').val();
	
        var tmFrom = startH+":"+startM;
        var tmTo = endH+":"+endM;



		var starttime = $("#date1").datepicker("getDate");
		starttime.setHours(startH);
		starttime.setMinutes(startM);

		
		var endtime = $("#date2").datepicker("getDate");
		endtime.setHours(endH);
		endtime.setMinutes(endM);
		


		if (endtime.getTime() <= starttime.getTime()) {
			showErrorDialog($.i18n.prop('error.invalid.dateFormat'), true);
		} else if (endtime.getTime() - starttime.getTime() > (86400000 * 60)) {
			showErrorDialog($.i18n.prop('errors.report.duration'), true);
		} else {
			$(".dialog").dialog('close');

			mainMarkerManager.removeUserMarkers();

			for ( var x = 0; x < routeLayerForLocationReport.length; x++) {
				routeLayerForLocationReport[x].setMap();
			}

			var options = {};
			options.data= {
					selectedUserList: selectedUserList
			};
			options.success = function(json) {
				if (json.viewReportNotPermittedString != null) {
					showInfoDialog($.i18n.prop('error.asset.invalid.operation.listassets', [ json.viewReportNotPermittedString ]));
				}

				markerObj = new MarkerObj();
					if (json.locatableUsersList.length>0) {

						var locationReportTable = parseTemplate("locationReportTableTemplate", {
							locReportTableList: json.locReportTableList,
							startdate: starttime.getTime(),
							enddate: endtime.getTime()
						});

						/* $($(locationReportTable).attr('id')).remove(); */
						$('#right').append(locationReportTable);
						$('#locReportTableDiv').draggable({containment: 'parent', scroll: false });

						mainMarkerManager.showClearMapButton();
					}

				for ( var i = 0; i < json.locatableUsersList.length; i++) {

					user && user.locateLcsControll(json.locatableUsersList[i], false, false);
				}

				if (json.permissionRequiredUserList.length > 0) {

					var btns = {};
					btns[$.i18n.prop('buttons.cancel')] = function(){
						$(this).dialog('close');
					};

					var content = parseTemplate("permissionRequiredListTemplate", {
						permissionRequiredList: json.permissionRequiredUserList
					});
					utils && utils.dialogError({title:$.i18n.prop('dialog.title.error'), content: content, buttons: btns});
					mainMarkerManager.showClearMapButton();
				}

				if (json.locationNotAvailableContent != null){
					utils && utils.dialogError({title:$.i18n.prop('dialog.title.error'), content:json.locationNotAvailableContent});
				}
			};

			utils && utils.lbasDoPost('displayUsersLocation.action', options);
		}
	}
}


function popupUserRenewPasswordConfirmationDialog(infoText) {

	var infoText = $.i18n.prop('confirmation.resetpassword');
	var serializedFormData = $('#userDetailForm').serialize() + "&" + $('#userGroupsForm').serialize() + "&" + $('#userPermissionsForm').serialize() + "&" + $('#userCDFDataForm').serialize();

	var btns = {};
	btns[$.i18n.prop('buttons.cancel')] = function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
	};
	btns[$.i18n.prop('buttons.ok')] = function() {
		var popup_new_pwd = $(this),
			options = {};
		options.data = serializedFormData;
		options.success = function(json) {
			if (checkResponseSuccess(json)) {
				popup_new_pwd.dialog('close');
				popup_new_pwd.dialog('destroy');

				var btns = {};
				btns[$.i18n.prop('buttons.ok')] = function() {
					$(this).dialog('close');
				};
				utils && utils.dialog({title: $.i18n.prop('dialog.title.success'), content: json.infoMessage, buttons: btns});
			}
		};

		utils && utils.lbasDoPost('renewPassword.action', options);
	};

	utils && utils.dialog({title:$.i18n.prop('password'), content: infoText, buttons: btns});

}

// elcin
function viewSelectedUserInUsersTab(container, item) {
	//var checkedUsers = $("#usersAccordionDiv ul input:checked");
	var checkedUsers = item;
	if(!item)
		checkedUsers = utils && utils.getChecked(container + ' input:checked', 'user');
	if($.isArray(checkedUsers) && checkedUsers.length>1){
		utils && utils.dialogError({title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.select.user')});
	}else{
		var data = $(checkedUsers).data('user');
		if(!data) data = checkedUsers;
		openViewUserDialog(data.user_id, data.fullName || Encoder.htmlDecode(data.fullName));
	}
}

// elcin
function editSelectedUserInUsersTab(container) {
	var selectedUserList = [];
	var anyUserSelected = false;
	var checkedUsers = utils && utils.getChecked(container + ' input:checked', 'user');//getCheckedUsers('user');
	var value;
	var name;
	var editAsset = false;
	$.each(checkedUsers, function() {
		value = $(this).attr("value");
		name = $("#tdid" + value).text();
		selectedUserList.push(value + ":" + name);
		anyUserSelected = true;
		editAsset = $(this).hasClass("assetRole");
	});
	if (anyUserSelected) {
		if (selectedUserList.length > 1) {
			utils && utils.dialog();
			$("#selectUserConfirmation p").text('select only one user');

		} else {

			if (editAsset) {
				openEditAssetDialog(value);
			} else {
				openEditUserDialog(value, 0);
			}
		}

	} else {
		utils && utils.dialogError({title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.select.user')});

	}
}
// elcin
function editSelectedGroupInUsersTab(container) {
	var btns = {};
	btns[$.i18n.prop('buttons.ok')] = function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
	};

	var checked = utils && utils.getChecked(container + ' input:checked', 'groupId');//getCheckedUsers('user');
	if($.isArray(checked) && checked.length>1){
		utils && utils.dialogError({title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.select.group')});
	}else{
		openEditGroupDialog($(checked).data('group'));
	}
	/*
	if (currentSelectedGroupId == 0) {
		document.getElementById("selectGroupConfirm").style.display = "";

		$(function() {
			$("#selectGroupConfirm").dialog({
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

		$("#selectGroupConfirm").dialog('open');

	} else {

		openEditGroupDialog(currentSelectedGroupId);
	}
	*/
}

function reportMultipleUsersOnMap(container, usr, startDate ,endDate) {
	
	var startDate = startDate;
	var endDate = endDate;
	var selectedUserList = [];
	var checkedUsers = usr;
	if(!usr)
		checkedUsers = utils && utils.getChecked(container + ' input:checked', 'user');
		
	if(checkedUsers && checkedUsers.length===0){
		utils && utils.dialogError({title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.select.user')});

	}else{
		if(checkedUsers.hasOwnProperty('length')){

			$.each(checkedUsers, function() {
				var id = $(this).attr("value");
				selectedUserList.push(id);
			});
		}else{

			selectedUserList.push(usr.user_id);
		}

/*
		var s_time = $("#date1").datepicker("getDate");
		s_time.setHours($('#start-time .hours'), $('#start-time .mins'))


		var e_time = $("#date2").datepicker("getDate");
		e_time.setHours($('#end-time .hours'), $('#end-time .mins'));
*/

		if (endDate <= startDate) {

			showErrorDialog($.i18n.prop('error.invalid.dateFormat'), true);
		} else if (endDate - startDate > (86400000 * 60)) {

			showErrorDialog($.i18n.prop('errors.report.duration'), true);
		} 
		else 
		{

			$(".dialog").dialog('close');

			mainMarkerManager.removeUserMarkers();

			for ( var x = 0; x < routeLayerForLocationReport.length; x++) {
				routeLayerForLocationReport[x].setMap();
			}
			
			var options = {};
			options.data= {
				 selectedUserList : selectedUserList,
				 startDate : startDate,
				 endDate : endDate
			};

			options.success = function(json) {
			 json['startDate'] = startDate;
			 json['endDate'] = endDate;

			 
			 utils && utils.dialogReport({data:json});
			}
			
/* 			utils && utils.lbasDoPost('displayUsersLocation.action', options); */
			


			var options = {};
			options.data= {
					selectedUserList: selectedUserList
			};
			options.success = function(json) {
				if (json.viewReportNotPermittedString != null) {
					showInfoDialog($.i18n.prop('error.asset.invalid.operation.listassets', [ json.viewReportNotPermittedString ]));
				}

				markerObj = new MarkerObj();
				
				// locatableUsersList
				for ( var i = 0; i < json.locatableUsersList.length; i++) {
					
					user && user.locate(json.locatableUsersList[i], false, false);
				}// for loop
				if (json.locatableUsersList.length>0) {
					var locationReportTable = parseTemplate("locationReportTableTemplate", {
						locReportTableList: json.locReportTableList,
						startdate: startDate,
						enddate: endDate
					});
	
	/*
					$($(locationReportTable).attr('id')).remove();
					$('body').append(locationReportTable);
					$('#'+ $(locationReportTable).attr('id')).draggable({containment: '#map'});
	*/
					$('#right').append(locationReportTable);
					$('#locReportTableDiv').draggable({containment: 'parent', scroll: false });
	
					mainMarkerManager.showClearMapButton();
				} // locatableUsersList > 0
				
				// permissionRequiredUserList
				if (json.permissionRequiredUserList.length > 0) {

					var btns = {};
					btns[$.i18n.prop('buttons.cancel')] = function(){ 
						$(this).dialog('close');
					};

					var content = parseTemplate("permissionRequiredListTemplate", {
						permissionRequiredList: json.permissionRequiredUserList
					});
					utils && utils.dialogError({title:$.i18n.prop('dialog.title.error'), content: content, buttons: btns});
					mainMarkerManager.showClearMapButton();
				}

				// locationNotAvailableContent
				if (json.locationNotAvailableContent != null){
					utils && utils.dialogError({title:$.i18n.prop('dialog.title.error'), content:json.locationNotAvailableContent});
				}
			};

			utils && utils.lbasDoPost('displayUsersLocation.action', options);
		}
	}
}

function locateMultipleUsersOnMap(container) {
	//reset request counter
	locationRequests = 0;
	user.errorPermissionOnMultipleUserLocate=false;
	var checkedUsers = utils && utils.getChecked(container + ' input:checked', 'user', true);

	/* 5 user limit */
	if(checkedUsers && checkedUsers.length>request_limit){
		utils && utils.dialogError({title: $.i18n.prop('dialog.title.max5users'), content: $.i18n.prop('dialog.errorMessage.max5users')});
	}else if (checkedUsers && checkedUsers.length>0) {
		$.each(checkedUsers, function() {
			var data = $(this).data('user');
			if(!data) data = this;
			if(data.permissions.locatable){
				data.locatable = true;
				data.pendingRequest=false;
				multipleLocate = true;
				user && user.locate(data, false, true);
			}else if(data.permissions.hasPendingPermissionRequest){
				data.pendingRequest=true;
				user.errorPermissionOnMultipleUserLocate=true;
				data.errorText= Encoder.htmlDecode(data.fullName);
				utils && utils.dialogLocate({data:data});
			}else if(!data.permissions.hasLocatePermission){
			  user.errorPermissionOnMultipleUserLocate=true;
				data.locatable=false;
				data.pendingRequest=false;
				data.errorText= Encoder.htmlDecode(data.fullName);;
				utils && utils.dialogLocate({data:data});
			}
		});
	} else {
		utils && utils.dialogError({title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.select.user')});
	}
}



/* 0m4r - T.B.D. */
function openMoveUsersToNewGroupDialog(method, container) {
	utils && utils.dialog({title:'--OUT OF SCOPE--', content: '--OUT OF SCOPE--'});
	/*
	var checkedUsers = utils && utils.getChecked(container + ' input:checked', 'user');//getCheckedUsers('user');

	var selectedUserList = [];
	var anyUserSelected = false;
	var userIDs = [];
	var assetErrorText = "";

	if (method == "admin") {
		$.each(checkedUsers, function(i, k) {
			var data = $(k).data('user');
			var userid = data.user_id;
			var fullName = data.fullName;
			/--*
			var userid = $(this).parent().parent().get(0).id;
			var name = $(this).parent().parent().get(0).cells.item(1).innerHTML;
			var surname = $(this).parent().parent().get(0).cells.item(3).innerHTML;
			var fullName = name + " " + surname;
			*--/
			selectedUserList.push(userid + ":" + fullName);
			userIDs.push(userid);
		});
	} else {
		var groupAdminHash = {};
		var checkedUsers = utils && utils.getChecked(container + ' input:checked', 'user');//getCheckedUsers('user');
		$.each(checkedUsers, function(i, k) {
			var data = $(k).data('user');
			var value = data.user_id;//$(this).attr("value");
			var name = data.fullName; //$("#tdid" + value).text();



			if ($(this).hasClass('assetRole') && $('#locatable' + value + ' img').attr('src').indexOf("NotLocatable") > -1) {
				// check if loggedin user is company admin
				if (roleIdOfLoggedInUser == 1) {// company admin
					selectedUserList.push(value + ":" + name);
					anyUserSelected = true;
					userIDs.push(value);
				} else {
					// check if loggedin user is admin of this asset group
					var groupContentText = $('#userLi' + value).parent().attr("id");
					var groupId = groupContentText.substring('groupContent'.length, groupContentText.length);
					var adminUserId = groupAdminHash[groupId];

					if (adminUserId != undefined) {
						if (adminUserId == currentUser) {
							selectedUserList.push(value + ":" + name);
							anyUserSelected = true;
							userIDs.push(value);
						} else {
							assetErrorText += name + ",";
						}
					} else {
						$.ajax({
							url :'retrieveGroupAdminOfAssetGroup.action',
							type :'POST',
							dataType :'json',
							async :false,
							data :{
								id :groupId
							},
							success :function(json) {
								if (checkResponseSuccess(json)) {
									groupAdminHash[groupId] = json.adminUserId;
									if (json.adminUserId == currentUser) {
										selectedUserList.push(value + ":" + name);
										anyUserSelected = true;
										userIDs.push(value);
									} else {
										assetErrorText += name + ",";
									}
								}
							}
						});
					}
				}

			} else {
				selectedUserList.push(value + ":" + name);
				anyUserSelected = true;
				userIDs.push(value);
			}
		});
	}


	if (selectedUserList.length > 0) {
		var dialogTitle = $.i18n.prop('user.moveToNewGroup');
		$("#moveToNewGroupDialog").dialog({
			modal :glbmodal,
			title :dialogTitle,
			bgiframe :true,
			resizable :false,
			close :function(event, ui) {
				$("#moveToNewGroupDialog").dialog('destroy');
			}
		}).height("auto");
		$("#moveToNewGroupDialog").dialog('option', 'title', dialogTitle);

		$.ajax({
			url :'listGroups2.action',
			type :'POST',
			dataType :'json',
			data :{
				usersChecked :userIDs
			},
			success :function(json) {
				if (checkResponseSuccess(json)) {
					$('#moveToNewGroupDialog').html(parseTemplate("moveToNewGroupTemplate", {
						json :json,
						selectedUserList :selectedUserList,
						method :method
					}));

					$("#moveToNewGroupDialog").dialog('open');
				} else
					$("#moveToNewGroupDialog").dialog('close');

			}
		});
	}

	if (assetErrorText.length > 0) {
		assetErrorText = assetErrorText.substring(0, assetErrorText.length - 1);
		if (anyUserSelected) {
			showInfoDialog($.i18n.prop('error.asset.invalid.operation.listassets', [ assetErrorText ]));
		} else {
			showInfoDialog($.i18n.prop('error.asset.invalid.operation'));
		}

	}
	*/

}

function moveUsersToNewGroup() {
	var requestedUsers = getSelectedUsers("#moveToNewGroupUserList");

	if (requestedUsers.length < 1) {
		showErrorDialog($.i18n.prop('warning.select.user'), true);
		$("#moveToNewGroupDialog").dialog('close');
		return;
	}

	$.ajax({
		type :'POST',
		url :'updateUsersGroup.action',
		data :{
			selectedUsers :requestedUsers,
			selectedGroup :$('#userMoveGroups').val()
		},
		success :function(ajaxCevap) {
			if (checkResponseSuccess(ajaxCevap)) {
				groupUsersRefresh();
			}
			$("#moveToNewGroupDialog").dialog('close');
		}
	});

}

function getRadiusColor(icon) {
	var radiusColor = "#000088";
	if (icon.indexOf("aqua-01.png") > 0)
		radiusColor = "#2AA8AF";
	else if (icon.indexOf("orange-01.png") > 0)
		radiusColor = "#DD8747";
	else if (icon.indexOf("green-01.png") > 0)
		radiusColor = "#B6C146";
	else if (icon.indexOf("purple-01.png") > 0)
		radiusColor = "#962A77";
	else if (icon.indexOf("yellow-01.png") > 0)
		radiusColor = "#F6D754";
	return radiusColor;
}




function createNewUserAction(){
  console.log("userPreCreate.action");
	$.ajax({
		url: 'userPreCreate.action',
		type: 'POST',
		cache: false,
		success: function(data) {
			if (checkResponseSuccess(data)) {

				utils.closeDialog();
				preUserModelMap = data.preUserModelMap;
				var btns = {},
					content = $('<div></div>').html(parseTemplate('adminEditUser', { json: data }));
				// Creation of the overlay
				utils && utils.dialog({
					title: $.i18n.prop('userList.NewUser'),
					content: content.html(),
					buttons: btns,
					css: 'noClose addExcpPos'
				});
				var dialogWidth = $('.ui-dialog').outerWidth(),
					dialog = $('.ui-dialog');
				dialog.css({
					'top': '250px',
					'margin-left': -dialogWidth/2,
					'width':'545px',
					'left':'50%'
				});
				dialog.find('.cancel-button').click(function(e){
					e.preventDefault();
					utils.closeDialog();
				});
				dialog.find('.send-button').click(function(e){
					e.preventDefault();
					//instance.sendAddNew( instance, dialog, data );
					if(lbasValidate('userDetailForm')) {
						var serializedFormData = dialog.find('#userDetailForm').serialize() + "&" + dialog.find('#userGroupsForm').serialize() + "&" + dialog.find('#userPermissionsForm').serialize() + "&" + dialog.find('#userCDFDataForm').serialize(),
							lbasUserId = dialog.find('input[name="lbasUser.user_id"]').val(),
							paramUrl,
							options = {};
			
						if (lbasUserId > 0) {
							if (dialog.find("#saveUserGroupName").attr("title") != undefined)// means that user does not have create/edit group right
								serializedFormData = serializedFormData + "&selectedGroup=" + dialog.find("#saveUserGroupName").attr("title");
							paramUrl = 'updateUser.action';
						} else {
							paramUrl = 'addNewUser.action';//'saveUser.action';
						}
						
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
							$('#dialog').scrollTop(0);
						}
						options.data = serializedFormData;
						options.success = function(json) {
							if (checkResponseSuccess(json, errorsOnDialog)) {
								utils.closeDialog();
								utils.dialogSuccess(json.message);
								//instance.start( instance );
								refreshUsers();
							}
						};
						utils && utils.lbasDoPost(paramUrl, options);
					}

				});
				dialog.find('form').submit(function(e){
					e.preventDefault();
					instance.sendAddNew( instance, dialog, data );
				});

				dialog.find('input[type="checkbox"]').click(function(){
					$(this).val($(this).prop('checked'));
				});

				// Management of tabs
				var contents = dialog.find('.tabs-content > li');
				dialog.find('.tabs-wrapper > .tabs > li').click(function(){
					$('.ui-dialog').find('.tabs > li.active').removeClass('active');
					$('.ui-dialog').find('.tabs-content > li.active').removeClass('active');
					$(this).addClass('active');
					$(contents[$(this).attr('data-index')]).addClass('active');
				});

				dialog.find('select').selectmenu();
				dialog.find('.send-button span').html($.i18n.prop('buttons.create'));
				dialog.find('.link-new').click(function(e){
					e.preventDefault();
					createNewGroupOvl(false, $(this).closest('.userGroupsList').find('select'));
				});
				/* select default */
        var json=data;
        if(json.lbasUser.user_id == 0){
           if(json.companyIsProvisioned && json.userHasTariff) {
             setUserRightsBasedOnGroup(document.getElementById('saveUser_selectedGroup'),json.companyIsProvisioned, json.userHasTariff, json.currentTariff.add_edit_enterprise_location,json.currentTariff.tarif_request_location, json.currentTariff.tariff_request_location_report, json.currentTariff.tariff_create_meetings);
           } else {
             setUserRightsBasedOnGroup(document.getElementById('saveUser_selectedGroup'),json.companyIsProvisioned, json.userHasTariff);
          }
         }
        selectedPreUserChanged($('#userEditMobile').get(0));
				
			}
		}
	});
}



function createNewGroupAction(fromNewAsset) {
  

  /* ERROR VIEW FRIENDLY */
  
  
	var fromNewAsset = fromNewAsset;
	var callAssets;

	if(fromNewAsset){
		callAssets = '?isNewUserpage=2';
	}else{
		callAssets = '';
	}
	var validator=new Validator({
      "lbasGroup.name": {
        domElement: '#dialog #lbasGroup\\.name',
        validate: 'presence'
      }
  });
  function errorsOnDialog(serverErrors) {
    var el = validator.parseServerErrors(serverErrors);
    $('#error-view-group > div.content-cell >span').html($.i18n.prop('error.send.title'));
    $('#error-view-group > div > ul').empty().append(el);
    $('#error-view-group').show();
  }
	
	$.ajax({
		url: 'groupPreCreate.action'+callAssets,
		type: 'POST',
		cache: false,
		success: function(data) {

			if (checkResponseSuccess(data,errorsOnDialog)) {
				if($('#adminEditGroup').length===1){

					$('#adminEditGroup').empty().remove();
				}
				var btns = {},
					content = $('<div id="adminEditGroup"></div>').html(parseTemplate('adminEditGroup', { json: data })),
					options = {
						'top': '250px',
						'width':'545px',
						'left':'50%'
					};


				// Creation of the overlay
				utils && utils.dialog({
					title: $.i18n.prop('groupList.NewGroup'),
					content: content,//.html(),
					buttons: btns,
					css: 'newGroupOvl noClose addExcpPos'
				});
				var dialogWidth = $('.ui-dialog').outerWidth(),
					dialog = $('.ui-dialog.newGroupOvl');
/*
				if (instance != undefined && instance !== false)
					options['margin-left'] = -dialogWidth/2;
*/
				dialog.css(options);
				dialog.find('.cancel-button').click(function(e){
					e.preventDefault();				
					dialog.remove();
				});
				dialog.find('.send-button').click(function(e){
					e.preventDefault();

					if ($('#available option').length > 0){
						var btns = {};
						btns[$.i18n.prop('buttons.cancel')] = function() {
							$(this).dialog('close');
						};
						btns[$.i18n.prop('buttons.ok')] = function() {
							$(this).dialog('close');
							if (lbasValidate('updateGroupName')) {
								var serializedFormData = '',
									options = {};	
								if (dialog.find('#updateGroupPermissions').length > 0) {
									dialog.find("#updateGroupPermissions input:checkbox").each( function() {
										serializedFormData += '&' + $(this).attr('name') + '=' + $(this).is(':checked');
									});
								}
						
								if (dialog.find('#updateGroupName').length > 0)
									serializedFormData += '&' + dialog.find('#updateGroupName').serialize();
						
								if (dialog.find('#updateGroupMembers').length > 0) {
									dialog.find('#updateGroupMembers select option').removeAttr('selected');
									dialog.find('#updateGroupMembers select[id=available] option').attr('selected', 'selected');
									serializedFormData += '&' + dialog.find('#updateGroupMembers').serialize();
								}
						
								if (dialog.find('#groupAdmin').length > 0)
									serializedFormData += '&' + dialog.find('#groupAdmin').serialize();
									if( fromNewAsset){
										serializedFormData += '&lbasGroup.assetGroup=true'
									}

								options.data = serializedFormData;
								options.success =  function(json) {
									if (checkResponseSuccess(json, errorsOnDialog)) {
										dialog.remove();
										utils.dialogSuccess(json.message);
										refreshUsers();
										refreshAssets();
									}
								};
						
								utils && utils.lbasDoPost('json/addNewGroup.action', options);
							}
						};
							
				        utils && utils.dialog({
				            title : $.i18n.prop('groupMembers.GroupMembers'),
				            content: $.i18n.prop('groupMembers.confirm.changeGroup'),
				            buttons : btns,
				            css: 'noClose'
				        });

					}else{
					  
					  
						var validator=new Validator({
								 "lbasGroup.name": {
								 	domElement: '#dialog #lbasGroup\\.name',
							         validate: 'presence'
							     }
						});
						 function errorsOnDialog(serverErrors) {
							var el = validator.parseServerErrors(serverErrors);
							$('#error-view-group > div.content-cell >span').html($.i18n.prop('error.send.title'));
							$('#error-view-group > div > ul').empty().append(el);
							$('#error-view-group').show();
						}
						
						
						
						if (lbasValidate('updateGroupName')) {
							var serializedFormData = '',
								options = {};
					
							if (dialog.find('#updateGroupPermissions').length > 0) {
								dialog.find("#updateGroupPermissions input:checkbox").each( function() {
									serializedFormData += '&' + $(this).attr('name') + '=' + $(this).is(':checked');
								});
							}
					
							if (dialog.find('#updateGroupName').length > 0)
								serializedFormData += '&' + dialog.find('#updateGroupName').serialize();
					
							if (dialog.find('#updateGroupMembers').length > 0) {
								dialog.find('#updateGroupMembers select option').removeAttr('selected');
								dialog.find('#updateGroupMembers select[id=available] option').attr('selected', 'selected');
								serializedFormData += '&' + dialog.find('#updateGroupMembers').serialize();
							}
					
							if (dialog.find('#groupAdmin').length > 0)
								serializedFormData += '&' + dialog.find('#groupAdmin').serialize();
								if( fromNewAsset){
									serializedFormData += '&lbasGroup.assetGroup=true'
								}

							options.data = serializedFormData;
							options.success =  function(json) {
								if (checkResponseSuccess(json,errorsOnDialog)) {
									dialog.remove();
									utils.dialogSuccess(json.message);
									refreshUsers();
								}
							};
					
							utils && utils.lbasDoPost('json/addNewGroup.action', options);
						}

					}

				});
				dialog.find('form').submit(function(e){
					e.preventDefault();
					sendAddNewGroup( dialog, instance, selectToUpdate );
				});

				//custom serch in select
				dialog.find("#groupMemberUserSearch").autocomplete({
				  minLength: 0,
					source: function(request, response){
						dialog.find("select[id='selected'] option").show();
						var $sel=dialog.find("select[id='selected']");
						$.each(data.userMap, function(i, k){
						  var $e = $sel.find("option[value="+i+"]");
						  var term=request.term.toLowerCase();
							if(k.toLowerCase().indexOf(term)===-1) {
								$e.remove();
							} else {
							  $e.remove();
							   $e=$('<option value="'+i+'">'+k+'</option>');
                 $sel.append($e);
							}
						});
					}
				});
				dialog.find("#groupMemberUserSearch2").autocomplete({
				  minLength: 0,
					source: function(request, response){
						dialog.find("select[id='available'] option").show();
						var $sel=dialog.find("select[id='available']");
						var term=request.term.toLowerCase();
						if(data && data.groupUsersMap) {
  						$.each(data.groupUsersMap, function(i, k){
  						  var $e = $sel.find("option[value="+i+"]");
                if(k.toLowerCase().indexOf(term)===-1) {
                  $e.remove();
                } else {
                  $e.remove();
                  $e=$('<option value="'+i+'">'+k+'</option>');
                  $sel.append($e)
                }
  						  /*
  							var $e = dialog.find("select[id='available'] option[value="+i+"]");
  							if(k.toLowerCase().indexOf(request.term)===-1)
  								$e.hide();
  							else
  								$e.show();*/
  						});
						}
					}
				});

				$("select[id='selected']").multiSelect("select[id='available']", {
					button_select: dialog.find('.action-arrow.add'),
					button_deselect: dialog.find('.action-arrow.remove'),
					afterMove: function() {
						refreshGroupMemberUserSearch2();
						refreshGroupMemberUserSearch();
					}
				});
				dialog.find('input[type="checkbox"]').click(function(e){
					//e.preventDefault();				
					$(this).val($(this).prop('checked'));
				});

				// Management of tabs
				var contents = dialog.find('.tabs-content > li');
				dialog.find('.tabs-wrapper > .tabs > li').click(function(e){
					e.preventDefault();
					$('.ui-dialog').find('.tabs > li.active').removeClass('active');
					$('.ui-dialog').find('.tabs-content > li.active').removeClass('active');
					$(this).addClass('active');
					$(contents[$(this).attr('data-index')]).addClass('active');
				});
				if(fromNewAsset){
					$('.newGroupOvl .tabs-wrapper .tabs li').eq(2).hide();
				}
			}
		}
	});
}

function editUserAction(userId){
			
			var Id;
			$.each(userId, function(i,val){
				Id =  $(this).attr("value");
			});

		$.ajax({
			url: 'editUser.action',
			type: 'POST',
			cache: false,
			data: {
			 id: Id
			 },
			success: function(data) {
				if (checkResponseSuccess(data)) {
						 //key  = btn.closest('tr').find('input[type="checkbox"]').val(),
						//user = instance.data.userList[key],
					var	btns = {};
						content = $('<div></div>').html(parseTemplate('adminEditUser', { json: data }));
					utils.closeDialog();

					// Creation of the overlay
					utils && utils.dialog({
						title: $.i18n.prop('user.actionList.9'),
						content: content.html(),
						buttons: btns,
						css: 'noClose addExcpPos'
					});
					var dialogWidth = $('.ui-dialog').outerWidth(),
						dialog = $('.ui-dialog');
					dialog.css({
						'top': '250px',
						'margin-left': -dialogWidth/2,
						'width':'545px',
						'left':'50%'
					});

					dialog.find('.cancel-button').click(function(e){
						e.preventDefault();
						utils.closeDialog();
					});
					dialog.find('.send-button').click(function(e){
						e.preventDefault();
						//instance.sendAddNew( instance, dialog, data );
						
						if(lbasValidate('userDetailForm')) {
							var serializedFormData = dialog.find('#userDetailForm').serialize() + "&" + dialog.find('#userGroupsForm').serialize() + "&" + dialog.find('#userPermissionsForm').serialize() + "&" + dialog.find('#userCDFDataForm').serialize(),
								lbasUserId = dialog.find('input[name="lbasUser.user_id"]').val(),
								paramUrl,
								options = {};
				
							if (lbasUserId > 0) {
								if (dialog.find("#saveUserGroupName").attr("title") != undefined)// means that user does not have create/edit group right
									serializedFormData = serializedFormData + "&selectedGroup=" + dialog.find("#saveUserGroupName").attr("title");
								paramUrl = 'updateUser.action';
							} else {
								paramUrl = 'addNewUser.action';//'saveUser.action';
							}
							
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
				
				
							options.data = serializedFormData;
							options.success = function(json) {
								if (checkResponseSuccess(json, errorsOnDialog)) {
									utils.closeDialog();
									utils.dialogSuccess(json.message);
									refreshUsers();
									//instance.start( instance );
								}
							};
							utils && utils.lbasDoPost(paramUrl, options);
						}
						
						
					});
					dialog.find('form').submit(function(e){
						e.preventDefault();
						instance.sendAddNew( instance, dialog, data );
					});

					dialog.find('input[type="checkbox"]').click(function(e){
						//e.preventDefault();
						$(this).val($(this).prop('checked'));
					});

					// Management of tabs
					var contents = dialog.find('.tabs-content > li');
					dialog.find('.tabs-wrapper > .tabs > li').click(function(e){
						e.preventDefault();					
						$('.ui-dialog').find('.tabs > li.active').removeClass('active');
						$('.ui-dialog').find('.tabs-content > li.active').removeClass('active');
						$(this).addClass('active');
						$(contents[$(this).attr('data-index')]).addClass('active');
					});
					dialog.find('select').selectmenu();
					dialog.find('.send-button span').html($.i18n.prop('buttons.save'));
					dialog.find('.link-new').click(function(e){
						e.preventDefault();
						createNewGroupOvl(false, $(this).closest('.userGroupsList').find('select'));
					});
				}
			}
		});

}

function openDeleteSelectedUsersDialog(container) {

    var checkedUsers = utils && utils.getChecked(container + ' input:checked', 'user');//getCheckedUsers('user');


	var anyUserSelected = false;

	var selectedUserList = [];
	var selectedNameList='';
	$.each(checkedUsers, function(i, k) {
		var data = $(k).data('user');
		var value = data.user_id;//$(this).attr("value");

		selectedNameList += $('#item_name_'+value).text()+', ';
		selectedUserList.push(value);
		anyUserSelected = true;
	});

	if (anyUserSelected) {
		var btns = {};
		btns[$.i18n.prop('buttons.ok')] = function() {

			var options = {};
			options.data = {
					selectedUserList :selectedUserList
			};
			options.success = function(json){
				if (checkResponseSuccess(json)) {

					var btns = {};
					btns[$.i18n.prop('buttons.ok')] = function() {
						groups && groups.getGroupsList({}, true);
						$(this).dialog('close');
					};
					//utils && utils.dialog({title: $.i18n.prop('dialog.title.success'), content: '--SUCCESS--', buttons: btns});
					//groups && groups.getGroupsList({}, false);
					utils.closeDialog();
					utils.dialogSuccess($.i18n.prop('info.delete'));
					refreshUsers();
					refreshAssets();
				}
			};

			utils && utils.lbasDoPost('deleteusermulti.action', options);
		};

		btns[$.i18n.prop('buttons.cancel')] = function() {
			$(this).dialog('close');
			$(this).dialog('destroy');
		};

		utils && utils.dialog({title: $.i18n.prop('confirmation.delete.title'), content: selectedNameList+' '+ $.i18n.prop('confirmation.delete.user'), buttons: btns});

	} else {
		utils && utils.dialogError({title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.select.user')});
	}

}

function moveUserNewGroupAction(container){
		utils.closeDialog();

		var users    = [],
			users_id = [],
			btns     = {},
			checked  = utils && utils.getChecked(container + ' input:checked', 'user');//getCheckedUsers('user');

var content  =  '<div class="move-to-group-form"><form action="#" method="post" enctype="multipart/form-data"><div class="move-legend-row-label">'+ $.i18n.prop('user.selectedUsers') +':</div><div class="move-legend-row selected-user-info"></div><div class="move-legend-row-label">'+ $.i18n.prop('user.ToGroup') +':</div><div class="move-legend-row selected-user-togroup"></div><div class="overlay-actions-wrapper"><a href="#" class="cancel-button graphicBtn little"><span>'+$.i18n.prop('message.cancel') +'</span></a><a href="#" class="apply-button graphicBtn violet"><span>'+ $.i18n.prop('buttons.apply') +'</span></a></div></form></div>'




		if (checked === false) {
			utils.dialogError({ title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('admin.list.selectData') });
			return false;
		}
		$.each(checked, function(key){
			users_id.push($(this).attr("value"));
			users.push( $('#item_name_'+$(this).attr("value")).text());

		});

		// Creation of the overlay
		utils && utils.dialog({
			title: $.i18n.prop('user.moveToNewGroup'),
			content: content,
			buttons: btns,
			css: 'noClose addExcpPos'
		});
		var dialogWidth = $('.ui-dialog').outerWidth(),
			dialog = $('.ui-dialog');

		dialog.css({
			'top': '250px',
			'margin-left': -dialogWidth/2,
			'width':'545px',
			'left':'50%'
		});

		dialog.find('.selected-user-info').html( users.join(' ; ') );
		
		$('.selected-user-togroup').append('<select class="usersMoveToGroupDropdown"></select>')
		$.ajax({
			type: 'GET',
			url : 'listGroups.action',
			data:{
				includeAssetGroups : false,
				includeUserDetails : false
			},
			success: function(json){
				$.each(json.userGroups , function(i, value){
					dialog.find('.usersMoveToGroupDropdown').append('<option value="'+value.id+'">'+value.name+'</option>');
				});
				dialog.find('.usersMoveToGroupDropdown').selectmenu({
					width : 200
				});
				if($.browser.msie){
					$('.usersMoveToGroupDropdown').css('width', 200);
				}
			}
		});
		
		
		
		dialog.find('.cancel-button').click(function(e){
			e.preventDefault();
			utils.closeDialog();
		});
		dialog.find('.apply-button').click(function(e){
			e.preventDefault();
			var group_id = dialog.find('.usersMoveToGroupDropdown').selectmenu('value');
			$.ajax({
				type: 'POST',
				url: 'json/updateGroupUsers.action',
				data: {
					groupId: group_id,
					selectedUsers: users_id
				},
				success: function(data) {
					utils.closeDialog();
					utils.dialogSuccess($.i18n.prop('info.update'));
					refreshUsers();

/*
					checked.each(function(key){
						instance.data.userList[$(this).val()].group_id = group_id;
					});
*/
				}
			});
		});

}

function editGroupAction(container){

	var checked = utils && utils.getChecked(container + ' input:checked', 'groupId');//getCheckedUsers('user');
	var groupID;
	$.each(checked, function(key){
		groupID = $(this).attr('value');
	});

	var options = {};
	
	options.data = {
		'groupId' :groupID
	};
	
	options.success = function(data) {

		if (checkResponseSuccess(data)) {
			var btns = {},
				content = $('<div></div>').html(parseTemplate('adminEditGroup', { json: data }));
	
			utils.closeDialog();
	
			// Creation of the overlay
			utils && utils.dialog({
				title: $.i18n.prop('groupEdit.editGroup'),
				content: content.html(),
				buttons: btns,
				css: 'noClose addExcpPos'
			});
			var dialogWidth = $('.ui-dialog').outerWidth(),
				dialog = $('.ui-dialog');
			dialog.css({
				'top': '250px',
				'margin-left': -dialogWidth/2,
				'width':'545px',
				'left':'50%'
			});
			dialog.find('.cancel-button').click(function(e){
				e.preventDefault();
				utils.closeDialog();
			});
			dialog.find('.send-button').click(function(e){
				e.preventDefault();
				var groupChanged = false,
					groupMemberCount = dialog.find("#groupMemberCount").val();

				$('#available option').each(function(index) {

					if(data.groupUsersMap[$(this).val()]==undefined){
						groupChanged= true;
					}
				});
		
				if ($('#available option').length!=groupMemberCount) {
					groupChanged=true;
				}
		
				if (!groupChanged) {
					var serializedFormData = '',
						options = {};
			
					if (dialog.find('#updateGroupPermissions').length > 0)
						dialog.find("#updateGroupPermissions input:checkbox").each( function() {
							serializedFormData += '&' + $(this).attr('name') + '=' + $(this).is(':checked');
						});
			
					if (dialog.find('#updateGroupName').length > 0)
						serializedFormData += '&' + dialog.find('#updateGroupName').serialize();
			
					if (dialog.find('#updateGroupMembers').length > 0) {
						dialog.find('#updateGroupMembers select option').removeAttr('selected');
						dialog.find('#updateGroupMembers select[id=available] option').attr('selected', 'selected');
						serializedFormData += '&' + dialog.find('#updateGroupMembers').serialize();
					}
			
					if (dialog.find('#groupAdmin').length > 0)
						serializedFormData += '&' + dialog.find('#groupAdmin').serialize();
			
					options.data = serializedFormData;
					options.success =  function(json) {
						if (checkResponseSuccess(json)) {
							utils.closeDialog();
							utils.dialogSuccess(json.message);
							//instance.start( instance );
							refreshUsers();							
						}
					};
			
					utils && utils.lbasDoPost('updateGroup.action', options);

				} else {
					var confirmText = $.i18n.prop('groupMembers.confirm.changeGroup'),
						btns = {};
		
					btns[$.i18n.prop('buttons.cancel')] = function() {
						$(this).dialog('close');
						$(this).dialog('destroy');
					};
					btns[$.i18n.prop('buttons.ok')] = function() {
						var serializedFormData = '',
							options = {};
				
						if (dialog.find('#updateGroupPermissions').length > 0)
							dialog.find("#updateGroupPermissions input:checkbox").each( function() {
								serializedFormData += '&' + $(this).attr('name') + '=' + $(this).is(':checked');
							});
				
						if (dialog.find('#updateGroupName').length > 0)
							serializedFormData += '&' + dialog.find('#updateGroupName').serialize();
				
						if (dialog.find('#updateGroupMembers').length > 0) {
							dialog.find('#updateGroupMembers select option').removeAttr('selected');
							dialog.find('#updateGroupMembers select[id=available] option').attr('selected', 'selected');
							serializedFormData += '&' + dialog.find('#updateGroupMembers').serialize();
						}
				
						if (dialog.find('#groupAdmin').length > 0)
							serializedFormData += '&' + dialog.find('#groupAdmin').serialize();
				
						options.data = serializedFormData;
						options.success =  function(json) {
							if (checkResponseSuccess(json)) {
								utils.closeDialog();
								utils.dialogSuccess(json.message);
								refreshUsers();
								//instance.start( instance );
							}
						};
				
						utils && utils.lbasDoPost('updateGroup.action', options);

						$(this).dialog('close');
						$(this).dialog('destroy');
					};
		
					utils && utils.dialog({title: $.i18n.prop('buttons.confirm'), content: confirmText, buttons: btns});
				}

			});
			dialog.find('form').submit(function(e){
				e.preventDefault();
				instance.sendUpdate( instance, dialog, data );
			});
	
			//custom serch in select
			dialog.find("#groupMemberUserSearch").autocomplete({
				source: function(request, response){
					dialog.find("select[id='selected'] option").show();
					$.each(data.userMap, function(i, k){
						var $e = dialog.find("select[id='selected'] option[value="+i+"]");
						if(k.toLowerCase().indexOf(request.term)===-1)
							$e.hide();
						else
							$e.show();
					});
				}
			});

			dialog.find("#groupMemberUserSearch2").autocomplete({
				source: function(request, response){
					dialog.find("select[id='available'] option").show();
					$.each(data.groupUsersMap, function(i, k){
						var $e = dialog.find("select[id='available'] option[value="+i+"]");
						if(k.toLowerCase().indexOf(request.term)===-1)
							$e.hide();
						else
							$e.show();
					});
				}
			});
	
			$("select[id='selected']").multiSelect("select[id='available']", {
				button_select: dialog.find('.action-arrow.add'),
				button_deselect: dialog.find('.action-arrow.remove'),
				afterMove: function() {
					refreshGroupMemberUserSearch2();
					refreshGroupMemberUserSearch();
				}
			});
			dialog.find('input[type="checkbox"]').click(function(e){
				//e.preventDefault();			
				$(this).val($(this).prop('checked'));
			});
	
			// Management of tabs
			var contents = dialog.find('.tabs-content > li');
			dialog.find('.tabs-wrapper > .tabs > li').click(function(e){
				e.preventDefault();
				$('.ui-dialog').find('.tabs > li.active').removeClass('active');
				$('.ui-dialog').find('.tabs-content > li.active').removeClass('active');
				$(this).addClass('active');
				$(contents[$(this).attr('data-index')]).addClass('active');
			});
		}
	}
	
	utils && utils.lbasDoPost('editGroup.action', options);
}

function shareMyLocationAction(container, oneUser) {
  if($('.shareMyLocationBox').is(':visible')){
    return false;
  }
	var oneUser = oneUser;
	var selectedUserList = [];
	var selectedUserListIds = [];
	var checkedUsers = utils && utils.getChecked(container + ' input:checked', 'user');

	if(checkedUsers && checkedUsers.length===0 && oneUser === undefined){
		utils && utils.dialogError({title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.select.user')});
	}else{

		if(oneUser != undefined){
			checkedUsers = oneUser;
			var id = oneUser; //$(this).attr("value");
			var name = $('#item_name_'+oneUser).text();

			selectedUserList.//.push({id+':'+ name});
			push({
				id : id,
				name : $.trim(name)
			});
			selectedUserListIds.push(id);
			
			
		}else{
			$.each(checkedUsers, function(i, k) {
				var data = $(k).data('user');
				var id = data.user_id; //$(this).attr("value");
				var name = Encoder.htmlDecode(data.fullName); //$(this).next().text();
				selectedUserList.//.push({id+':'+ name});
				push({
					id : id,
					name : $.trim(name)
				});
				selectedUserListIds.push(id);
			});
		}
		var btns = {};
		btns[$.i18n.prop('buttons.share')] = function() {
			var selectedFrequency;
			if ( $('#shareFrequencyCheck').is(':checked') ){
				selectedFrequency = $('#shareFrequency').selectmenu('value');			
			}else{
				selectedFrequency = 10; 
			}

			if( $('#radioList1').is(':checked') )
			{
				
				$.ajax({
					url: 'shareMyLocationAlways.action',
					type: 'POST',
					cache: false,
					data: {
					 frequency: selectedFrequency,
					 selectedUserList : selectedUserListIds,
					 visibilityProfileId : $('#shareSpecificProfileSelect').selectmenu('value')
					 },
					success: function(json) {
						if (checkResponseSuccess(json)) {
						  $('#privacy').remove();
							utils.closeDialog();
							utils.dialogSuccess(json.infoMessage);			
						}						
					}
				});
				
			}
			else
			{
				var startDate = $("#date1").datepicker("getDate");
				var endDate = $("#date2").datepicker("getDate");

				var startTime = $('#start-time .hours').val()+':'+$('#start-time .mins').val();
				var endTime = $('#end-time .hours').val()+':'+$('#end-time .mins').val();
				startDate.setHours($('#start-time .hours').val());
				endDate.setHours($('#end-time .hours').val());
				startDate = startDate.setMinutes($('#start-time .mins').val());
				endDate = endDate.setMinutes($('#end-time .mins').val());
				
				$.ajax({
					url: 'shareMyLocationSpecific.action',
					type: 'POST',
					cache: false,
					data: {
					 endDate : endDate,
					 frequency: selectedFrequency,
					 fromHourMin : startTime,
					 toHourMin : endTime,
					 selectedUserList : selectedUserListIds,
					 startDate: startDate

					 },
					success: function(json) {
						if (checkResponseSuccess(json)) {
						  $('#privacy').remove();
							utils.closeDialog();
							utils.dialogSuccess(json.infoMessage);			
						}						
					}
				});
			}
			//share('-1', selectedUserListIds);
		};
		btns[$.i18n.prop('buttons.cancel')] = function() {
			$(this).dialog('close');
			$(this).dialog('destroy');
      $('div.token-input-dropdown-facebook').hide();
		};

		var content = parseTemplate("shareMyLocationTemplate", {
			messageId :-1,
			selectedUserList: selectedUserList
		});

		utils && utils.dialog({
		  title: $.i18n.prop('shareMyLocation.title'), 
		  content: content, 
		  buttons: btns,
		  css: 'shareMyLocationBox'
		});

		registerValidations('shareRequest');
		$("#shareWith").tokenInput("userSearchTokenAutocomplete.action", {
			type : 'GET',
			searchDelay: 1000,
			noResultsText : $.i18n.prop('no.results.text'),
			prePopulate: selectedUserList,
			jsonContainer: 'resultList',
			classes: {
				tokenList : 'token-input-list-facebook',
				token : 'token-input-token-facebook',
				tokenDelete : 'token-input-delete-token-facebook',
				selectedToken : 'token-input-selected-token-facebook',
				highlightedToken : 'token-input-highlighted-token-facebook',
				dropdown : 'token-input-dropdown-facebook',
				dropdownItem : 'token-input-dropdown-item-facebook',
				selectedDropdownItem : 'token-input-selected-dropdown-item-facebook',
				inputToken : 'token-input-input-token-facebook'
			}
		});
    var zLevel = $('.shareMyLocationBox').css('z-index');
		$('div.token-input-dropdown-facebook').css('z-index', zLevel+10);
		
		$('.shareMyLocationBox .ui-dialog-titlebar-close').click(function(){
		  $('.shareMyLocationBox').remove();
      $('div.token-input-dropdown-facebook').hide();
  		return false;
		});
	}

}

function createAssetGroupAction(){
	var fromNewAsset = true;
	createNewGroupAction(fromNewAsset)
}

function editAssetAction(){
	var container = '#tab-assets';
	var userID = utils && utils.getChecked(container + ' input:checked', 'user');

		$.each(userID, function(i,val){
			userID =  $(this).attr("value");
		});

	$.ajax({
		url: 'editAsset.action',
		type: 'POST',
		cache: false,
		data: { id: userID },
		success: function(data) {
			if (checkResponseSuccess(data))
				//instance.assetDialog(instance, data, 'assetEdit.editAsset');
				utils.closeDialog();
				var btns = {},
					content = $('<div></div>').html(parseTemplate('adminEditAsset', { json: data }));
		
				// Creation of the overlay
				utils && utils.dialog({
					title: $.i18n.prop('assetEdit.editAsset'),
					content: content.html(),
					buttons: btns,
					css: 'addExcpPos'
				});
				var dialogWidth = $('.ui-dialog').outerWidth(),
					dialog = $('.ui-dialog');
				dialog.css({
					'top': '250px',
					'margin-left': -dialogWidth/2,
					'width':'545px',
					'left':'50%'
				});
				dialog.find('.send-button').click(function(e){
					e.preventDefault();
					//instance.sendAddNew( instance, dialog, data );
					if (lbasValidate('saveAsset')) {
						var serializedFormData = dialog.find('#saveAsset').serialize(),
							allocatedTo        = dialog.find('input[name="lbasAsset.allocatedTo"]').val(),
							lbasAssetId         = dialog.find('input[name="lbasAsset.user_id"]').val(),
							paramUrl           = '';
			
						/*if (allocatedTo == 0) {
							var allocatedToInvalidStr = dialog.find('input[name="lbasAsset.allocatedToFullName"]').val();
							dialog.find('input[name="lbasAsset.allocatedToFullName"]').val('');
							if (!lbasValidate('saveAsset')) {
								dialog.find('input[name="lbasAsset.allocatedToFullName"]').val(allocatedToInvalidStr);
							}
							return;
						}*/
			
						if (lbasAssetId > 0)
							paramUrl = 'updateAsset.action';
						else
							paramUrl = 'addNewAsset.action';
			
						$.ajax({
							type: 'POST',
							url: paramUrl,
							data: serializedFormData,
							dataType: 'json',
							success: function(json) {
								if (checkResponseSuccess(json)) {
									utils.closeDialog();
									utils.dialogSuccess(json.message);
									//instance.start( instance );
									refreshAssets();
								}
							}
						});
					}
					
				});
				dialog.find('form').submit(function(e){
					e.preventDefault();
					instance.sendAddNew( instance, dialog, data );
				});
		
				dialog.find('input[type="checkbox"]').click(function(e){
					//e.preventDefault();
					$(this).val($(this).prop('checked'));
				});
		
				dialog.find('select').selectmenu();
				dialog.find('.link-new').click(function(e){
					e.preventDefault();
					var fromNewAsset = true;
					createNewGroupOvl(false, $(this).closest('.asset-group-form-block').find('select'), fromNewAsset);
				});
				dialog.find("#allocatedToFullName").autocomplete({
					source :function(request, response) {
						$.getJSON('userSearchAutocomplete.action', {
							q :request.term,
							excludeGroups :true,
							retrieveAssets :true
						}, function(data) {
							response($.map(data.resultList, function(item) {
								return {
									label :item.name,
									value :item.name,
									id :item.id
								};
							}));
						});
					},
					minLength :3,
					select :function(event, ui) {
						dialog.find("#assetAllocatedTo").val(ui.item.id.substr(1));
					},
					open :function() {
						$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
					},
					close :function() {
						$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
					}
				});
				
				
				
		}
	});

}

function moveAssetNewGroupAction(container){
	
	var container = '#tab-assets';
	utils.closeDialog();

	var users    = [],
		users_id = [],
		btns     = {},
		checked  = utils && utils.getChecked(container + ' input:checked', 'user');//getCheckedUsers('user');

	var content  =  '<div class="move-to-group-form"><form action="#" method="post" enctype="multipart/form-data"><div class="move-legend-row-label">'+ $.i18n.prop('user.selectedUsers') +':</div><div class="move-legend-row selected-user-info"></div><div class="move-legend-row-label">'+ $.i18n.prop('user.ToGroup') +':</div><div class="move-legend-row selected-user-togroup"></div><div class="overlay-actions-wrapper"><a href="#" class="cancel-button graphicBtn little"><span>'+$.i18n.prop('message.cancel') +'</span></a><a href="#" class="apply-button graphicBtn violet"><span>'+ $.i18n.prop('buttons.apply') +'</span></a></div></form></div>'




	if (checked === false) {
		utils.dialogError({ title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('admin.list.selectData') });
		return false;
	}
	$.each(checked, function(key){
		users_id.push($(this).attr("value"));
		users.push( $('#item_name_'+$(this).attr("value")).text());

	});

	// Creation of the overlay
	utils && utils.dialog({
		title: $.i18n.prop('user.moveToNewGroup'),
		content: content,
		buttons: btns,
		css: 'noClose addExcpPos'
	});
	var dialogWidth = $('.ui-dialog').outerWidth(),
		dialog = $('.ui-dialog');

	dialog.css({
		'top': '250px',
		'margin-left': -dialogWidth/2,
		'width':'545px',
		'left':'50%'
	});

	dialog.find('.selected-user-info').html( users.join(' ; ') );
	
	$('.selected-user-togroup').append('<select class="usersMoveToGroupDropdown"></select>')
	$.ajax({
		type: 'GET',
		url : 'listGroups.action',
		data:{
			includeAssetGroups : true,
			includeUserDetails : false
		},
		success: function(json){
			$.each(json.userGroups , function(i, value){
				dialog.find('.usersMoveToGroupDropdown').append('<option value="'+value.id+'">'+value.name+'</option>');
			});
			dialog.find('.usersMoveToGroupDropdown').selectmenu();	
		}
	});
	
	
	
	dialog.find('.cancel-button').click(function(e){
		e.preventDefault();
		utils.closeDialog();
	});
	dialog.find('.apply-button').click(function(e){
		e.preventDefault();
		var group_id = dialog.find('.usersMoveToGroupDropdown').selectmenu('value');
		$.ajax({
			type: 'POST',
			url: 'json/updateGroupUsers.action',
			data: {
				groupId: group_id,
				selectedUsers: users_id
			},
			success: function(data) {
				utils.closeDialog();
				utils.dialogSuccess($.i18n.prop('info.update'));
				refreshAssets();

/*
				checked.each(function(key){
					instance.data.userList[$(this).val()].group_id = group_id;
				});
*/
			}
		});
	});

}

function editCategoryGroupAction(ref){
  
    if(ref) {
      if($(ref).hasClass('inactive')) {
        return false;
      }
    }
    
  	if ($('.newCategoryPopUp').length === 1  ){
  		return false;
  	}
  	
    var tab = places.getSelectedTab() == 1 ? 'tab-places-enterprise' : 'tab-places-personal';
    if (tab === 'tab-places-enterprise' && $('#editCategoryGroupAction').hasClass('inactive') ){
	    return false;
    }
    
    var count = 0;
    var categories = $('#' + tab + ' .contents li');		
    var selectedID;
    $.each(categories, function(){
    	if( $(this).find('.placeId').is(':checked') ){
		    selectedID = $(this).find('.placeId').attr('id');
		  }		
    });

    selectedID= selectedID.substring(1);
    var categoryName = $('#groupName_'+selectedID).text();
    var poiCount = $('#label_g'+selectedID+' .all_total_count').text();
    poiCount = parseInt(poiCount);

    openEnterpriseEditCategoryPoiDialog(0 ,selectedID, categoryName, poiCount, true);
}


function globalLocRequestAction(item) {

	
	var container = '#tab-users';

	var startTime = new Date().getTime();
	var stopTime = new Date().getTime();

	var selectedUserList = [];
/*
	var checkedUsers = user;
	if(!user)
*/
	var	checkedUsers = [];//utils && utils.getChecked(container + ' input:checked', 'user');
	checkedUsers.push(item.id);

	if(checkedUsers && checkedUsers.length===0 && user === undefined){
		utils && utils.dialogError({title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.select.user')});
	}else{

		
				
		
		var id = item.id;
		var name = Encoder.htmlDecode(item.name);
		selectedUserList.push(id+':'+ name);
				
		
			
		var region = "1";
		var viewLocation = 1;
		var locationRequestID = -1;
		var workFrom = '';
		var workTo = '';

		if (userWorkingHours != null && userWorkingHours != "") {
			var workingHoursList = userWorkingHours.split('|');
			if (workingHoursList[0] != "") {
				workFrom = workingHoursList[0].substring(0, workingHoursList[0].indexOf("-"));
				workTo = workingHoursList[0].substring(workingHoursList[0].indexOf("-") + 1, workingHoursList[0].length);
			}
		}

		var data = [{name: 'locationRequestID', value: '-1'},{name: 'selectedUserList', value: selectedUserList}];

		var options = {};
		options.async = false;
		options.data = data;
		options.success = function(json){
			if (json && checkResponseSuccess(json)) {

				var btns = {};
				btns[$.i18n.prop('buttons.cancel')] = function() {
					$(this).dialog('close');
					$(this).dialog('destroy');
				};

				btns[$.i18n.prop('category.RequestPermission')] = function() {
					request();
					refreshUsers();
				};

				var content = parseTemplate("locationRequestTemplate", {
					selectedUserList :selectedUserList,
					startTime :startTime,
					stopTime :stopTime,
					region :region,
					viewLocation :viewLocation,
					locationRequestID :locationRequestID,
					work_from :workFrom,
					work_to :workTo,
					operation :'add',
					duration :null,
					frequency :null,
					restrictDistance :null,
					restrictRegion :null,
					restrictLocation :null,
					restrictEnable :null,
					regionListLocating :json.regionListLocating,
					defaultRegion :json.defaultRegion
				});
				utils && utils.dialog({
					'title':$.i18n.prop('locationRequests.locationRequest'),
					'content':content,
					'buttons': btns,
					'css': 'noClose reqPermission'});

				$('.reqPermission').css({
					'width':500,
					'top':100,
					'margin-left':-90
				});
				$('.reqPermission .s').css({
					'height':370,
					'overflow-y':'auto'
				});

				$(".reqPermission .ui-button-text").each(function(){
					var toPurple = $.i18n.prop('category.RequestPermission');
					var current = $(this).text();
					if(toPurple == current){
						$(this).parent().removeClass('multi_user_button').addClass('purple_button');
					}
				});
			}
		};

		utils && utils.lbasDoGet('locationRequest.action', options);
	}
}
/*
function globalSetRoutes(routeID){
	$('#btn_tab-routes').click();
	var options ={};
	options.success = function(json){
		var glbSavedRoutes = json.savedRoutes;
		$('#btn_tab-routes_routingTab').click();
		for (var i = 0; i < glbSavedRoutes.length; i++){
		
			if (glbSavedRoutes[i].id == routeID){
				$('#routingTypes li.selected a').val(glbSavedRoutes[i].mode);
				redrawRoute(glbSavedRoutes[i].points);
			}
		
		}
	});
	utils && utils.lbasDoGet('getSavedRoutes.action', options);
	
}*/