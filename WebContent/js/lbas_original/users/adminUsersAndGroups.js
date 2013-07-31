var editGroupActive = false;

 
function openViewUserDialog(userId, name) {
	
	var options = {};
	options.data = {
		'id' :userId
	};
	
	options.extra = {title: name};
	options.success = function(json, textStatus, jqXHR, options) {
		if (checkResponseSuccess(json)){
			var content = parseTemplate('userViewTemplate', {
				json: json
			});
			utils && utils.dialogInfo({title: options.title, content: content, buttons: {}, css:'itemDetails'});

		}
	};
	
	utils && utils.lbasDoPost('viewUser.action', options);
}
function changeUserEditTemplate(currentTariffModel){	
	 if (!currentTariffModel.add_edit_enterprise_location) {								                                                             							
		 $('#id_add_enterprise_location').attr('checked', false);
		 $('#id_add_enterprise_location').val(false);

		 if ( $.browser.msie && /6.0/.test(navigator.userAgent) ) {
			 $('#id_add_enterprise_location').attr('disabled',true);
		 } else {
			 $('#id_add_enterprise_location').attr('disabled','disabled');
		 }
	 }          


	 if (!currentTariffModel.request_location ) {
		 $('#id_request_current_location').attr('checked', false);		
		 $('#id_request_current_location').val(false);

		 if ( $.browser.msie && /6.0/.test(navigator.userAgent) ) {
			 $('#id_request_current_location').attr('disabled',true);
		 }else{
			 $('#id_request_current_location').attr('disabled','disabled');
		 }
	 }    



	 if (!currentTariffModel.request_location_report ) {						           								
		 $('#id_request_location_report').attr('checked', false);
		 $('#id_request_location_report').val(false);

		 if ( $.browser.msie && /6.0/.test(navigator.userAgent) ) {
			 $('#id_request_location_report').attr('disabled',true);
		 }else{
			 $('#id_request_location_report').attr('disabled','disabled');
		 }
	 }    


	 if (!currentTariffModel.create_meetings) {                                    								                  															
		 $('#id_create_meetings').attr('checked', false);
		 $('#id_create_meetings').val(false);

		 if ( $.browser.msie && /6.0/.test(navigator.userAgent) ) {
			 $('#id_create_meetings').attr('disabled',true);
		 }else{
			 $('#id_create_meetings').attr('disabled','disabled');
		 }
	 }

	 if (!currentTariffModel.be_located) {                                      								                       
		 $('#id_be_located').attr('checked', false);
		 $('#id_be_located').val(false);

		 if ( $.browser.msie && /6.0/.test(navigator.userAgent) ) {
			 $('#id_be_located').attr('disabled',true);
		 } else {
			 $('#id_be_located').attr('disabled','disabled');
		 }							
	 }

}
function openEditUserDialog(userId,userType) {	
	// fromAdminGUI=true icin userType 1, fromAdminGUI=false icin userType 0
	// userType 2, super admin
	
	var options = {};
	options.data = {
		'id' :userId
	};
	options.success = function(json) {
		if(checkResponseSuccess(json)){
			if (userType==1 || userType==2) {
				json.createGroup=true;
				json.editGroup=true;
			} else {
				json.createGroup= lbasRightManager.checkRight('create_edit_groups');					
				json.editGroup=lbasRightManager.checkRight('create_edit_groups');
			}	
			
			var templateName = "newUserTemplate";
			
			var content = $('<div></div>').load('pages/template/' + templateName + '.html', function(){
				
				var tooltipClass = 'displayTitleOnArrowToolTip';
				if(userType == 0){// user web gui
					if ($.browser.msie) {
						tooltipClass = 'displayTitleOnArrowToolTipIE';
					}
				}
				
				var tmp = 'userDetailTemplate';
				if (userType == 2 ) {
					tmp = 'opcoAdminUserEditTemplate';
				}
				
				$("#tabs_in_edit_user").tabs({});
				$('#edit_user_tab1').html(getContent(tmp));
				$('#edit_user_tab2').html(getContent('userGroupsTemplate'));
				$('#edit_user_tab3').html(getContent('userPermissionsTemplate'));
				$('#edit_user_tab4').html(getContent('userCDFDataTemplate'));
				
				localize && localize.newUserDialog();
				registerValidations("userDetailForm");
				
				function getContent(template){
					var tmp = '';
					if(template){
					 	tmp = parseTemplate(template, {
							 json: json,
							 tooltipClass: tooltipClass || ''
						});
					}	 
					return tmp;	 	
				}
			});
			
			var btns = {};
			btns[$.i18n.prop('buttons.save')] = function() {
				if(lbasValidate('userDetailForm')) 
					AjxSaveUser(); //users.js
			};
			btns[$.i18n.prop('buttons.cancel')] = function() {
				$(this).dialog('close');
				$(this).dialog('destroy');
			};
			
			utils && utils.dialog({title: '--EDIT USER--', content: content, buttons: btns});
			
			$('#opcoAreaCode').val(json.lbasUser.opcoAreaCode);
			
			 if(json.lbasUser.role_id == 1) {						 
		    	 $("#userEditRightTable input[type=checkbox]").each(function() { 
				 	var id = $(this).attr("id");
				 	// check whether the logged in user is admin user
				 	if(json.adminEditsOwn){						 		
				 		// if admin user has tariff(means company is provisioned & tariff exist for admin user); then make the following
						// permissions editable
				 		if (json.userHasTariff) {
					 		if(id === 'id_request_current_location'){
					 			if(!json.currentTariff.request_location){
					 				$(this).attr('disabled','disabled');
					 			}
					 		} else if(id === 'id_request_location_report'){
					 			if(!json.currentTariff.request_location_report){
					 				$(this).attr('disabled','disabled');
					 			}
					 		}else if(id === 'id_be_located'){
					 			if(!json.currentTariff.be_located){
					 				$(this).attr('disabled','disabled');
					 			}
					 		}else{
					 			$(this).attr('disabled','disabled');
					 		}
				 		}else{// means company is provisioned, but admin user has no tariff or company is not provisioned
				 			if(json.companyIsProvisioned){
				 				$(this).attr('disabled','disabled');
				 			}else{
				 				if(id !== 'id_request_current_location' && id !== 'id_request_location_report' && id !== 'id_be_located')
				 					$(this).attr('disabled','disabled');
				 			}
				 		}
				 	}else{
				 		$(this).attr('disabled','disabled');
				 	}
				});				
			 } else {
				 var currentTariffModel = null;
				 // tarifesi varsa
				 if (json.userHasTariff) { 
					 currentTariffModel = json.currentTariff;
					 if (currentTariffModel != null) {							 							 
							changeUserEditTemplate(currentTariffModel);																				 						
					 }
				 }
			 }
		}
	};
	
	var editUrl = "editUser.action";
	
	if (userType == 2 ) {
		editUrl = "editOpcoAdminUser.action";
	}
	utils && utils.lbasDoPost(editUrl, options);
	
	/*
	if (userType == 2 ) {
		$("#edit_user_dialog").dialog( {
			modal :glbmodal,
			bgiframe :true,
			resizable :false,
			close : function(event, ui) {
				$('input[name="lbasUser.user_id"]').val(0);
				$("#edit_user_dialog").dialog('destroy');
			}
		}).height("auto");
	} else {
		$("#edit_user_dialog").dialog( {
			modal :glbmodal,
			width : 640,
			bgiframe :true,
			resizable :false,
			close : function(event, ui) {
				$('input[name="lbasUser.user_id"]').val(0);
				$("#edit_user_dialog").dialog('destroy');
				
				$('.displayTitleOnArrowToolTip').remove();
 				$('.displayTitleOnArrowToolTipIE').remove();
				
			}
		}).height("auto");
	}
	$("#edit_user_dialog").dialog('option', 'title', $.i18n.prop('userEdit.editUser'));
	
	var editUrl = "editUser.action";
	var templateName = "userDetailTemplate";
	
	if (userType == 2 ) {
		editUrl = "editOpcoAdminUser.action";
		templateName = "opcoAdminUserEditTemplate";
	}	
	
	$.ajax( {
		url :editUrl,
		type :'POST',
		async :false,
		data : {
			'id' :userId
		},
		dataType :'json',
		success : function(json) {
			
			if(checkResponseSuccess(json)){
				if (userType==1 || userType==2) {
					json.createGroup=true;
					json.editGroup=true;
				} else {
					json.createGroup= lbasRightManager.checkRight('create_edit_groups');					
					json.editGroup=lbasRightManager.checkRight('create_edit_groups');
				}	
				
				if(templateName != 'userDetailTemplate'){
					$('#edit_user_dialog').html(parseTemplate(templateName, {
						json :json
					}));
				}else{
					
					$("#tabs_in_edit_user").tabs();
					$("#tabs_in_edit_user").tabs('select', 0);
					
					$("#editUserDialogButtons").show();
					$("#editUserSaveButton").show();
					$("#createUserSaveButton").hide();
							
					var tooltipClass = "displayTitleOnArrowToolTip";

 					if(userType == 0){// user web gui
 						if ($.browser.msie) {
 							tooltipClass = "displayTitleOnArrowToolTipIE";
 						}
 					}
					
					 $('#edit_user_tab1').html(parseTemplate("userDetailTemplate", {
						 json :json,
						 tooltipClass :tooltipClass
					 }));
					
					 $('#edit_user_tab2').html(parseTemplate("userGroupsTemplate", {
						 json :json
					 }));
					 
					 $('#edit_user_tab3').html(parseTemplate("userPermissionsTemplate", {
						 json :json
					 }));
					 
					 $('#edit_user_tab4').html(parseTemplate("userCDFDataTemplate", {
						 json :json
					 }));
					 
				}

				
				$('#opcoAreaCode').val(json.lbasUser.opcoAreaCode);
				 if(json.lbasUser.role_id == 1) {						 
					 if ( $.browser.msie && /6.0/.test(navigator.userAgent) ) {  
						 $("#userEditRightTable input[type=checkbox]").each(function(index, checkbox) { 
						 	var id = $(this).attr("id");
						 	// check whether the logged in user is admin user
						 	if(json.adminEditsOwn){
						 		// if admin user has tariff(means company is provisioned & tariff exist for admin user); then make the following
								// permissions editable
						 		if (json.userHasTariff) {
							 		if(id == 'id_request_current_location'){
							 			if(!json.currentTariff.request_location){
							 				checkbox.disabled=true;
							 			}
							 		}
							 		else if(id == 'id_request_location_report'){
							 			if(!json.currentTariff.request_location_report){
							 				checkbox.disabled=true;
							 			}
							 		}
							 		else if(id == 'id_be_located'){
							 			if(!json.currentTariff.be_located){
							 				checkbox.disabled=true;
							 			}
							 		}else
							 			checkbox.disabled=true;
						 		}else{// means company is provisioned, but admin user has no tariff or company is not provisioned
						 			if(json.companyIsProvisioned){
						 				checkbox.disabled=true;
						 			}else{
						 				if(id != 'id_request_current_location' && id != 'id_request_location_report' && id != 'id_be_located')
						 					checkbox.disabled=true;
						 			}
						 		}
						 	}else{
						 		checkbox.disabled=true;
						 	}
						});
				    } else {
				    	 $("#userEditRightTable input[type=checkbox]").each(function() { 
						 	var id = $(this).attr("id");
						 	// check whether the logged in user is admin user
						 	if(json.adminEditsOwn){						 		
						 		// if admin user has tariff(means company is provisioned & tariff exist for admin user); then make the following
								// permissions editable
						 		if (json.userHasTariff) {
							 		if(id == 'id_request_current_location'){
							 			if(!json.currentTariff.request_location){
							 				$(this).attr("disabled","disabled");
							 			}
							 		}
							 		else if(id == 'id_request_location_report'){
							 			if(!json.currentTariff.request_location_report){
							 				$(this).attr("disabled","disabled");
							 			}
							 		}
							 		else if(id == 'id_be_located'){
							 			if(!json.currentTariff.be_located){
							 				$(this).attr("disabled","disabled");
							 			}
							 		}else{
							 			$(this).attr("disabled","disabled"); 
							 		}
						 		}else{// means company is provisioned, but admin user has no tariff or company is not provisioned
						 			if(json.companyIsProvisioned){
						 				$(this).attr("disabled","disabled");
						 			}else{
						 				if(id != 'id_request_current_location' && id != 'id_request_location_report' && id != 'id_be_located')
						 				$(this).attr("disabled","disabled");
						 			}
						 		}
						 	}else{
						 		$(this).attr("disabled","disabled");
						 	}
						});
				    }					
				 } else {
					 var currentTariffModel = null;
					 // tarifesi varsa
					 if (json.userHasTariff) { 
						 currentTariffModel = json.currentTariff;
						 if (currentTariffModel != null) {							 							 
								changeUserEditTemplate(currentTariffModel);																				 						
						 }
					 }
				 }
				
				$("#edit_user_dialog").dialog( "option", "position", 'center' );
				$("#edit_user_dialog").dialog('open');
			}
		}
	});
	*/
	
}


function openNewUserDialogTemp(userType) {
	openNewUserDialog(userType);
}

function openNewPreUserDialog(){
	
	$('#preUserMsisdn').val('');
	$( function() {
		$("#add_pre_user_dialog").dialog( {
			modal :glbmodal,
			width :300,
			bgiframe :true,
			resizable :false,
			close : function(event, ui) {
				$("#add_pre_user_dialog").dialog('destroy');
			}
		}).height("auto");
	});
	
	$("#add_pre_user_dialog").dialog('option', 'title', $.i18n.prop('userList.NewUser'));
	$("#add_pre_user_dialog").dialog('open');
}

function savePreUser(){
	var serializedFormData = $('#newPreUser').serialize();
	$.ajax( {
		type :'POST',
		url :'savePreUser',
		data :serializedFormData,
		success : function(json) {
		  if(checkResponseSuccess(json)){
			  $("#add_pre_user_dialog").dialog('destroy');
			  openNewUserDialog(1);
		  }
		}

	});
}


function openNewUserDialog(userType) {
   console.log(userType,">>>>> openNewUserDialog");
	
	var editUrl = 'userPreCreate.action'; //'editUser.action';
	//var templateName = "userDetailTemplate";
	if (userType==2 ) {
		editUrl = 'editOpcoAdminUser.action';
		//templateName = "opcoAdminUserEditTemplate";
	}

	
	var options = {};
	options.success = function(json) {
		
		if(checkResponseSuccess(json)){
			if (userType==2 ) {
				templateName = "opcoAdminUserEditTemplate";
				var content = parseTemplate(templateName, {
					json :json
				});
				utils && utils.dialog({content: content});
			} else {
				
				var templateName = "newUserTemplate";
				var content = $('<div></div>').load('pages/template/' + templateName + '.html', function(){
					var tooltipClass = "displayTitleOnArrowToolTip";
					if(userType == 0){// user web gui
						if ($.browser.msie) {
							tooltipClass = "displayTitleOnArrowToolTipIE";
						}
					}
					
					$("#tabs_in_edit_user").tabs({});
					$('#edit_user_tab1').html(getContent('userDetailTemplate'));
					$('#edit_user_tab2').html(getContent('userGroupsTemplate'));
					$('#edit_user_tab3').html(getContent('userPermissionsTemplate'));
					$('#edit_user_tab4').html(getContent('userCDFDataTemplate'));
					
					localize && localize.newUserDialog();
					registerValidations("userDetailForm");
					
					function getContent(template){
						var tmp = '';
						if(template){
						 	tmp = parseTemplate(template, {
								 json: json,
								 tooltipClass :tooltipClass || ''
							});
						}	 
						return tmp;	 	
					}
				});
				
				var btns = {};
				btns[$.i18n.prop('buttons.save')] = function() {
					if(lbasValidate('userDetailForm')) 
						AjxSaveUser(); //users.js
				};
				btns[$.i18n.prop('buttons.cancel')] = function() {
					$(this).dialog('close');
					$(this).dialog('destroy');
				};
				utils && utils.dialog({title: $.i18n.prop('userEdit.createUser'), content: content, buttons: btns});
        json.editGroup = true;
				 if (userType==1 || userType==2) {
					 json.createGroup=true;
				 } else {
					 json.createGroup= lbasRightManager.checkRight('create_edit_groups');
				 }
				 preUserModelMap = json.preUserModelMap;
				 if(json.lbasUser.user_id == 0){
					 if(json.companyIsProvisioned && json.userHasTariff) {
						 setUserRightsBasedOnGroup(document.getElementById('saveUser_selectedGroup'),json.companyIsProvisioned, json.userHasTariff, json.currentTariff.add_edit_enterprise_location,json.currentTariff.tarif_request_location, json.currentTariff.tariff_request_location_report, json.currentTariff.tariff_create_meetings);
					 } else {
						 setUserRightsBasedOnGroup(document.getElementById('saveUser_selectedGroup'),json.companyIsProvisioned, json.userHasTariff);
					}
				 }
				 selectedPreUserChanged($('#userEditMobile'));
				 console.log(">>>>> openNewUserDialog");
			};

		}
	};
	
	utils && utils.lbasDoPost(editUrl, options);
}

var groupUsersMap;
var usersMap;
var groupUsersMapleftArray = [];
var usersMapArray = [];

function openEditGroupDialog(group) {
	var options = {};
	options.data = {
		'groupId' :group.id
	};
	options.success = createEditGroup;
	
	/*
	options.success = function(json){
		var templateName = "newGroupDialog";
		
		var content = $('<div></div>').load('pages/template/' + templateName + '.html', function(){
			if(json.lbasGroup.assetGroup)
				$("#edit_group_tab2_link").hide();
			else
				$("#edit_group_tab2_link").show();
			
			groupUsersMap = json.groupUsersMap;
			usersMap = json.userMap;		

			usersMapArray = [];
			for(var i in json.userMap) { 				 				 
				usersMapArray[usersMapArray.length] = {
						value: usersMap[i],
						key: i
				};
			}

			for(var i in json.groupUsersMap) { 				 				 
				groupUsersMapleftArray[groupUsersMapleftArray.length] = {
						value: groupUsersMap[i],
						key: i
				};
			}
			
			$("#edit_group_dialog").tabs({
				cache: true,
				show: function(event, ui){
					var html = '&nbsp';
					switch (ui.index){
						case 0:
							if($.trim($(ui.panel).html())===''){
								html = getContent('groupDetailEditTemplate');
								$(ui.panel).html(html);
							}	
						  break;					
						case 1:
							if($.trim($(ui.panel).html())===''){
								html = getContent('groupMemberEditTemplate');
								$(ui.panel).html(html);
								edit_group_tab1Ready(json);
							}	
						  break;
						case 2:
							if($.trim($(ui.panel).html())===''){
								html = getContent('groupPermissionEditTemplate');
								$(ui.panel).html(html);
							}	
						  break;
						case 3:
							if($.trim($(ui.panel).html())===''){
								html = getContent('groupAdminEditTemplate');
								$(ui.panel).html(html);
							}	
						  break;
					}
				}
			});
			
			loadGroupAdminAcc();
			localize && localize.newGroupDialog();
			registerValidations("userDetailForm");
			
			function getContent(template){
				var tmp = '';
				if(template){
				 	tmp = parseTemplate(template, {   
						 json: json
					});
				}	 
				return tmp;	 	
			}
		});
		
		var btns = {};
		btns[$.i18n.prop('buttons.save')] = function() {
			if(lbasValidate('userDetailForm'))
				groups && groups.getGroupsList({}, true);
				//updateUserGroup(json);
		};
		btns[$.i18n.prop('buttons.cancel')] = function() {
			$(this).dialog('close');
			$(this).dialog('destroy');
		};
		
		utils && utils.dialog({title: $.i18n.prop('groupEdit.editGroup'), content: content, buttons: btns, data: group});
	};
	*/
	
	utils && utils.lbasDoPost('editGroup.action', options);
}

function edit_group_tab1Ready(data) {
	//custom serch in select
        $("#groupMemberUserSearch").autocomplete({
          minLength: 0,
          autofocus: true,
          source: function(request, response){
            var $sel=$("select[id='selected']");
            $sel.find("option").show();
            var term=request.term.toLowerCase();
            $.each(data.userMap, function(i, k){
              var $e = $sel.find("option[value="+i+"]");
              if(k.toLowerCase().indexOf(term)===-1) {
                $e.remove();
              } else {
                $e.remove();
                 $e=$('<option value="'+i+'">'+k+'</option>');
                 $sel.append($e)
              }
            });
          }
        });
        $("#groupMemberUserSearch2").autocomplete({
          minLength: 0,
          autofocus: true,
          source: function(request, response){
            var $sel=$("select[id='available']");
            $sel.find("option").show();
            var term=request.term.toLowerCase();
              $.each(data.groupUsersMap, function(i, k){
                var $e = $sel.find("option[value="+i+"]");
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
	
	
	
	//custom serch in select
	/*
	$("#groupMemberUserSearch").autocomplete({
		source: function(request, response){
			$("select[id='selected'] option").show();
			$.each(json.userMap, function(i, k){
				var $e = $("select[id='selected'] option[value="+i+"]");
				if(k.toLowerCase().indexOf(request.term)===-1)
					$e.hide();
				else 
					$e.show();
			});
		},
		autofocus: true
	});
	
	$("#groupMemberUserSearch2").autocomplete({
		source: function(request, response){
			$("select[id='available'] option").show();
			$.each(json.groupUsersMap, function(i, k){
				var $e = $("select[id='available'] option[value="+i+"]"); 
				if(k.toLowerCase().indexOf(request.term)===-1)
					$e.hide();
				else
					$e.show();
			});
		},
		autofocus: true
	});*/
	
	groupMemberPickList();
}


function getGroupMembers(){
	if($('#updateGroupName input[name=lbasGroup.id]').val() == 0){// create new group operation
		$.ajax( {
			url :'retrieveGroupMembers.action',
			type :'POST',
			async :false,
			data : {
				assetGroup :$('#updateGroupName input[name=lbasGroup.assetGroup]').val()
			},
			dataType :'json',
			success : function(json) {
				if (checkResponseSuccess(json)) {
					 $('#edit_group_tab1').html(parseTemplate("groupMemberEditTemplate", {
						 json :json
					 }));
					 
					 groupUsersMap = json.groupUsersMap;
					 usersMap = json.userMap;
						
					 usersMapArray = new Array();
					 for(var i in json.userMap) {
						 usersMapArray[usersMapArray.length] = {
							 velyu :usersMap[i],
							 kiy :i
						 };
					 }
						
					 for(var i in json.groupUsersMap) {
						 groupUsersMapleftArray[groupUsersMapleftArray.length] = {
							 velyu :groupUsersMap[i],
							 kiy :i
						 };
					 }
					 
					 groupMemberPickList();
					 
					 if($('#updateGroupName input[name=lbasGroup.assetGroup]').val() == "true"){
						 $("#edit_group_tab2_link").hide();
					 }else{
						 $("#edit_group_tab2_link").show();
					 }
				}
			}
		});
	}
}

var selectedUserId;
var selectedUserFullName;
var selectedUserGroup;

function loadGroupAdminAcc() {

	jQuery('#navigationGroupAdmin').accordion( {
		active :false,
		header :'.head',
		navigation :true,
		autoHeight :false,
		animated :false,
		collapsible :true
	});

}

function destroyAccordion() {
	jQuery('#navigationGroupAdmin').accordion('destroy');
}

function createAccordion() {
	jQuery('#navigationGroupAdmin').accordion( {
		active :false,
		header :'.head',
		navigation :true,
		autoHeight :false,
		animated :false,
		collapsible :true
	});
}

function checkGroupEmpty(groupId) {
	var groupUsers = document.getElementById(groupId).getElementsByTagName("li");
	var userCount = 0;
	for ( var i = 0; i < groupUsers.length; i++) {
		if (groupUsers[i].style.display == "") {
			userCount++;
		}
	}
	if (userCount == 0) {
		return true;
	}
	return false;
}

function selectGroupAdminChange() {
// document.getElementById("user" + selectedUserId).style.display = 'none';
// var empty = checkGroupEmpty("group" + selectedUserGroup);
// if (empty == true) {
// document.getElementById("group" + selectedUserGroup).style.display = "none";
// }
// destroyAccordion();
	// createAccordion();

	var selectedUser =$("#groupAdminChangeCombo select option:selected").text();
	var selectedUserID= $("#groupAdminChangeCombo select option:selected").val();
	$("#groupAdminName").html( selectedUser);
	$("#groupAdmin input[name=newGroupAdmin]").val(selectedUserID);
	
	$('#groupAdminChangeCombo').hide();
	/*
$('#groupAdminChangeSelect').hide();
	$('#groupAdminChangeOk').hide();
	$('#groupAdminChangeCancel').hide();
	
*/
	$('#groupAdminChangeLink').show();
	
}

function selectAdmin(userId, fullName, groupId) {
	selectedUserId = userId;
	selectedUserFullName = unescape(fullName);
	selectedUserGroup = groupId;
	localize && localize.adminPlaceManagement();	
	$('#changeCategoryAdmin table').eq(1).attr('class','buttons').css('margin','-20px 20px');
}

function refreshGroupMemberUserSearch2(){
	groupUsersMapleftArray = [];
	$("select[id='available'] option").each(function() {						
		groupUsersMapleftArray.push( {
			velyu: $.trim(this.text),
			kiy: this.value
		});								
	});
}

function refreshGroupMemberUserSearch(){
	usersMapArray = [];
	$("select[id='selected'] option").each(function() {						
		usersMapArray.push( {
			velyu: $.trim(this.text),
			kiy: this.value
		});								
	});
}

function groupMemberPickList() {
	var options = {
            button_select: "#removeUserFromGroup",
            button_deselect: "#addUserFromGroup",
            //button_select_all: "#removeUserFromGroup_all",
            //button_deselect_all: "#addUserFromGroup_all",
            afterMove: function (){
				refreshGroupMemberUserSearch2();
				refreshGroupMemberUserSearch();
			}
          };
	
	$("select[id='selected']").multiSelect("select[id='available']", options);
}

function createGroupCallBack() {
	var groupId = $('#id').val();
	$('#edit_group_tab1').load('editGroup', {
		'id' :groupId
	});
	$('#edit_group_tab2').load('editGroupPermission', {
		'id' :groupId
	});
	$('#edit_group_tab3').load('editGroupAdmin', {
		'id' :groupId
	});
	changeRightNavigation('usersRightNav', null);
}


function openNewGroupDialogUsersRightNav(isNewUserpage) {
	
	var options = {};
	options.data = {
		isNewUserpage :isNewUserpage
	};
	
	options.success = createEditGroup;
	
	/*
	options.success = function(json){
		var templateName = "newGroupDialog";
		
		var content = $('<div></div>').load('pages/template/' + templateName + '.html', function(){
			if(json.lbasGroup.assetGroup)
				$("#edit_group_tab2_link").hide();
			else
				$("#edit_group_tab2_link").show();
			
			groupUsersMap = json.groupUsersMap;
			usersMap = json.userMap;		

			usersMapArray = [];
			for(var i in json.userMap) { 				 				 
				usersMapArray[usersMapArray.length] = {
						value: usersMap[i],
						key: i
				};
			}

			for(var i in json.groupUsersMap) { 				 				 
				groupUsersMapleftArray[groupUsersMapleftArray.length] = {
						value: groupUsersMap[i],
						key: i
				};
			}
			
			$("#edit_group_dialog").tabs({
				cache: true,
				show: function(event, ui){
					var html = '&nbsp';
					switch (ui.index){
						case 0:
							if($.trim($(ui.panel).html())===''){
								html = getContent('groupDetailEditTemplate');
								$(ui.panel).html(html);
							}	
						  break;					
						case 1:
							if($.trim($(ui.panel).html())===''){
								html = getContent('groupMemberEditTemplate');
								$(ui.panel).html(html);
								edit_group_tab1Ready(json);
							}	
						  break;
						case 2:
							if($.trim($(ui.panel).html())===''){
								html = getContent('groupPermissionEditTemplate');
								$(ui.panel).html(html);
							}	
						  break;
						case 3:
							if($.trim($(ui.panel).html())===''){
								html = getContent('groupAdminEditTemplate');
								$(ui.panel).html(html);
							}	
						  break;
					}
				}
			});
			
			loadGroupAdminAcc();
			localize && localize.newGroupDialog();
			registerValidations("userDetailForm");
			
			function getContent(template){
				var tmp = '';
				if(template){
				 	tmp = parseTemplate(template, {   
						 json: json
					});
				}	 
				return tmp;	 	
			}
		});
		
		var btns = {};
		btns[$.i18n.prop('buttons.save')] = function() {
			if(lbasValidate('userDetailForm')) 
				groups && groups.getGroupsList({}, true);
		};
		btns[$.i18n.prop('buttons.cancel')] = function() {
			$(this).dialog('close');
			$(this).dialog('destroy');
		};
		
		utils && utils.dialog({title: $.i18n.prop('groupEdit.newGroup'), content: content, buttons: btns});
		
	};
	*/
	
	utils && utils.lbasDoPost('groupPreCreate.action', options);
}


function setOptionGroup(id) {
	if ($("#isNewUserpage").val() == 1) {
		var newgrubname = $("#lbasGroupname").val();
		$("select[name='selectedGroup']").append("<option value='" + id + "' SELECTED>" + newgrubname + "</option>");	
		
		var userId = $('#userDetailForm input[name="lbasUser.user_id"]').val();
		if(userId == 0){// create new user
			var isCompanyProvisioned = $('#userDetailForm input[name="companyIsProvisioned"]').val();
			removeGroupRights(eval(isCompanyProvisioned));
		}
	}else if ($("#isNewUserpage").val() == 2){
		var newgrubname = $("#lbasGroupname").val();
		$("#saveAsset_selectedGroup").append("<option value='" + id + "' SELECTED>" + newgrubname + "</option>");		
	}
}

function updateUserGroup(group){
	
	if($('#updateGroupName input[name="lbasGroup.id"]').val() == 0){ // new group
		AjxSaveGroup();	
			
	}else{
		var groupChanged = false;
		$('#available option').each(function(index) {	    
		    if(groupUsersMap[$(this).val()]==undefined){
		    	groupChanged= true;
		    }
		    
		 });
	
		var groupMemberCount = $("#groupMemberCount").val();
		if($('#available option').length!=groupMemberCount){
			groupChanged=true;
		}
		
		if(!groupChanged){
			AjxUpdateGroup();
		}else{
			var confirmText =  $.i18n.prop('groupMembers.confirm.changeGroup');
		
			var btns = {};
			
			btns[$.i18n.prop('buttons.cancel')] = function() {
				$(this).dialog('close');
				$(this).dialog('destroy');
			};
			btns[$.i18n.prop('buttons.ok')] =   function() {
				
				AjxUpdateGroup(group);
				
				$(this).dialog('close');
				$(this).dialog('destroy');
			};
			
			utils && utils.dialog({title: $.i18n.prop('buttons.confirm'), content: confirmText, buttons: btns});
		}
	}
}

function AjxUpdateGroup(group){	
	var serializedFormData = '';
	
	if($('#updateGroupPermissions').length>0){
		$("#updateGroupPermissions input:checkbox").each( function() {
			serializedFormData += '&' + $(this).attr('name') + '=' + $(this).is(':checked');
		});
	}
	
	if($('#updateGroupName').length>0){
		serializedFormData += '&' + $('#updateGroupName').serialize();
	}
	
	if($('#updateGroupMembers').length>0){
		$('#updateGroupMembers select option').removeAttr('selected');
		$('#updateGroupMembers select[id=available] option').attr('selected', 'selected');
		serializedFormData += '&' + $('#updateGroupMembers').serialize();
	}
	
	if($('#groupAdmin').length>0){
		serializedFormData += '&' + $('#groupAdmin').serialize();
	}
	
	var options = {};
	options.data = serializedFormData;
	options.success =  function(json) {
		if (checkResponseSuccess(json)) {
			$('.dialog').dialog('close');
			
			var btns = {};
			btns[$.i18n.prop('buttons.ok')] = function() {
				groups && groups.getGroupsList({}, true);
				$(this).dialog('close');
			};
			
			utils && utils.dialog({title: json.group.name, content: json.infoMessage || json.message, buttons: btns});
			//groups && groups.getGroupsList();
		}
	};
	
	utils && utils.lbasDoPost('updateGroup', options);
}

function AjxUpdateGroupName() {
	var serializedFormData = $('#updateGroupName').serialize();
	var newLbasGroupName= $('#updateGroupName input[name=lbasGroup.name]').val();
	
	$.ajax( {
		type :'POST',
		url :'updateGroupName',
		data :serializedFormData,
		success : function(ajaxCevap) {
			$("#groupList").html(ajaxCevap);
			$("#edit_group_dialog").dialog('close');
		}
	});
}

function AjxSaveGroup() {
	
	var serializedFormData = '';
	
	if($('#updateGroupPermissions').length>0){
		$("#updateGroupPermissions input:checkbox").each( function() {
			serializedFormData += '&' + $(this).attr('name') + '=' + $(this).is(':checked');
		});
	}
	
	if($('#updateGroupName').length>0){
		serializedFormData += '&' + $('#updateGroupName').serialize();
	}
	
	if($('#updateGroupMembers').length>0){
		$('#updateGroupMembers select option').removeAttr('selected');
		$('#updateGroupMembers select[id=available] option').attr('selected', 'selected');
		serializedFormData += '&' + $('#updateGroupMembers').serialize();
	}
	
	if($('#groupAdmin').length>0){
		serializedFormData += '&' + $('#groupAdmin').serialize();
	}
	
	
	
	var options = {};
	options.data = serializedFormData;
	options.success =  function(json) {
		if (checkResponseSuccess(json)) {
			$('.dialog').dialog('close');
			
			var btns = {};
			btns[$.i18n.prop('buttons.ok')] = function() {
				groups && groups.getGroupsList({}, true);
				$(this).dialog('close');
			};
			
			utils && utils.dialog({title: $.i18n.prop('dialog.title.success'), content: json.message, buttons: btns});
		}
	};
	
	utils && utils.lbasDoPost('json/addNewGroup.action', options);
}

function updateGroupMembers() {
	$('select#available option').attr('selected', 'selected');
	$.post('updateGroupUsers.action', $('#updateGroupMembers').serialize(), function(data) {
		if (!aPage) {
			$('#gm' + $('#groupId').val()).html('(' + $('select#available option').length + ')');
			if ($("#groupContent" + $('#groupId').val() + " li").length > 0) {
				selectGroup($('#groupId').val(), true);
			}
		}
		$("#edit_group_dialog").dialog('close');
	});
}

function updateGroupPermissions() {
	var parms = $('#updateGroupPermissions').serialize();

	$("#updateGroupPermissions input:checkbox").each( function() {
		if (!$(this).is(':checked')) {
			parms = parms + '&' + $(this).attr('name') + '=false';
		}
	});
	$.post('updateGroupPermissions.action', parms, function(data) {
		$("#edit_group_dialog").dialog('close');
	});
}

function adminDelete(divId, url, id, textMsg) {
	document.getElementById("deleteConfirmation").style.display = "";
	var btns = {};
	
	btns[$.i18n.prop('buttons.cancel')] = function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
	};
	btns[$.i18n.prop('buttons.ok')] =   function() {
		
		$.ajax( {
			type :'POST',
			url :url,
			data :{id :id},
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
	$( function() {
		$("#deleteConfirmation").dialog( {
			bgiframe : true,
			resizable : false,
			height : 140,
			modal : glbmodal,
			title : $.i18n.prop('buttons.delete'),
			overlay : {
				backgroundColor :'#000',
				opacity :0.5
			},
			buttons : btns
		});
	});

	$("#deleteConfirmation").dialog('open');
	$("#deleteConfirmation p").text(textMsg);
}

function actionElement(key, value, reason, fromTime, toTime) {
	this.key = key;
	this.value = value;
}

function clickedOnUserCheckBox() {
	
	if ($("#userListContent input:checked").length == 0) {

		$("#adminUserListSelectBox option").each(function() {
			$(this).remove();
		});
		$("#adminUserListSelectBox").append("<option value='-1'>" + $.i18n.prop('general.actions') + "</option>");
		for ( var i = 0; i < adminUsersTabActions.length; i++) {
			var action = adminUsersTabActions[i];
			if (action.key == 8 || action.key == 4) {
				$("#adminUserListSelectBox").append("<option value=" + action.key + ">" + action.value + "</option>");
			}
		}

	}else if ($("#userListContent input:checked").length >= 1) {

		$("#adminUserListSelectBox option").each(function() {
			$(this).remove();
		});
		$("#adminUserListSelectBox").append("<option value='-1'>" + $.i18n.prop('general.actions') + "</option>");
		for ( var i = 0; i < adminUsersTabActions.length; i++) {
			var action = adminUsersTabActions[i];
			if (action.key != 8 && action.key != 4) {
				$("#adminUserListSelectBox").append("<option value=" + action.key + ">" + action.value + "</option>");
			}
		}

	}

}


function clickedOnGroupCheckBox() {
	
	if ($("#groupListContent input:checked").length == 0) {

		$("#adminGroupListSelectBox option").each(function() {
			$(this).remove();
		});
		$("#adminGroupListSelectBox").append("<option value='-1'>" + $.i18n.prop('general.actions') + "</option>");
		for ( var i = 0; i < adminGroupTabActions.length; i++) {
			var action = adminGroupTabActions[i];
			if (action.key == 1) {
				$("#adminGroupListSelectBox").append("<option value=" + action.key + ">" + action.value + "</option>");
			}
		}

	}else if ($("#groupListContent input:checked").length >= 1) {

		$("#adminGroupListSelectBox option").each(function() {
			$(this).remove();
		});
		$("#adminGroupListSelectBox").append("<option value='-1'>" + $.i18n.prop('general.actions') + "</option>");
		for ( var i = 0; i < adminGroupTabActions.length; i++) {
			var action = adminGroupTabActions[i];
			if (action.key != 1) {
				$("#adminGroupListSelectBox").append("<option value=" + action.key + ">" + action.value + "</option>");
			}
		}

	}

}



function superAdminUserActionSelected(selectedAction) {
	switch (selectedAction) {
	case "8": {		
		openNewUserDialogTemp(2);
		break;
	}
	default:
		alert('default state');
	}
}


function adminUserActionSelected(selectedAction) {
	switch (selectedAction) {
	case "1": {
		adminUserSelectActions('deleteusermulti', $.i18n.prop('admin.delete.user.confirm'), $.i18n.prop('admin.delete.user.title'));
		break;
	}
	case "2": {
		openSendMessageDialogForAdmin();
		break;
	}
	case "3": {
		openMoveUsersToNewGroupDialog("admin");
		break;
	}
	case "4": {
		openUploadFileDialog("user");
		break;
	}
	case "5": {
		alert("Export operation is not implemented yet");
		break;
	}
	case "6": {
		adminUserSelectActions('activateUsers', $.i18n.prop('admin.activate.user.confirm'), $.i18n.prop('admin.activate.user.title'));
		break;
	}
	case "7": {
		adminUserSelectActions('deactivateUsers', $.i18n.prop('admin.deactivate.user.confirm'), $.i18n.prop('admin.deactivate.user.title'));
		break;
	}
	case "8": {		
		openNewUserDialogTemp(1);
		break;
	}
	default:
		alert('default state');
	}
}

function adminGroupActionSelected(selectedAction) {
	switch (selectedAction) {
	case "1": {
		openNewGroupDialogUsersRightNav('3');
		break;
	}
	case "2": {
		adminGroupSelectActions('deletegroupMulti', $.i18n.prop('admin.delete.group.confirm'), $.i18n.prop('admin.delete.user.title'));
		break;
	}
	case "3": {
		adminGroupSelectActions('activateGroups', $.i18n.prop('admin.activate.group.confirm'), $.i18n.prop('admin.activate.user.title'));
		break;
	}
	case "4": {
		adminGroupSelectActions('deactivateGroups', $.i18n.prop('admin.deactivate.group.confirm'), $.i18n.prop('admin.deactivate.user.title'));
		break;
	}
	default:
		alert('default state');
	}
}


function adminLocationActionSelected(selectedAction) {
	switch (selectedAction) {
	case "1": {
		var btns = {};
		btns[$.i18n.prop('buttons.ok')] =   function() {
			if(adminJqGridContent == 'category')
				deleteMultipleCategories(selectedItems, true);
			else if (adminJqGridContent == 'poi') {
				deleteMultipleLocations(selectedItems, true);
			}

			$(this).dialog('close');
			$(this).dialog('destroy');
		};
		btns[$.i18n.prop('buttons.cancel')] = function() {
			$(this).dialog('close');
			$(this).dialog('destroy');
		};
		
		var selectedItems = new Array();
		$("#list2 input:checked").each( function() {
			var itemId = this.id.substring(4,this.id.length);
			selectedItems.push(itemId + ":" + this.value);
		});

		if(selectedItems.length > 0){
		$("#deleteConfirmation").dialog( {
			bgiframe :true,
			resizable :false,
			height :140,
			modal :glbmodal,
			overlay : {
				backgroundColor :'#000',
				opacity :0.5
			},
			buttons : btns
		});
		}else{
			popupUserConfirmationDialog();
			if(adminJqGridContent == 'category')
				$("#selectUserConfirmation p").text($.i18n.prop('warning.select.category'));
			else if (adminJqGridContent == 'poi')
				$("#selectUserConfirmation p").text($.i18n.prop('warning.select.location'));
		}
		
		break;
	}
	case "2": {
		openUploadFileDialog("poiCategory");
		break;
	}
	case "3": {
		var selectedItems = '';
		$("#list2 input:checked").each( function() {
			var itemId = this.id.substring(4,this.id.length);
			selectedItems += itemId + ";";
		});
		
		if(selectedItems.length > 0){
			if(adminJqGridContent == 'category')
				window.location.href = 'exportCategories.action?type=xls&categories=' + selectedItems;
			else if (adminJqGridContent == 'poi')
				window.location.href = 'exportPois.action?type=xls&pois=' + selectedItems;
		}else{
			popupUserConfirmationDialog();
			if(adminJqGridContent == 'category')
				$("#selectUserConfirmation p").text($.i18n.prop('warning.select.category'));
			else if (adminJqGridContent == 'poi')
				$("#selectUserConfirmation p").text($.i18n.prop('warning.select.location'));
		}
		
		break;
	}
	case "4": {
		alert("Not implemented yet");
		break;
	}
	case "5": {
		alert("Not implemented yet");
		break;
	}
	default:
		alert('default state');
	}
}

function openSendMessageDialogForAdmin() {
	$("#messageTo").val('');
	var userIdName = [];

	$("#userListContent tbody input:checked").each(function() {
		var userid = $(this).parent().parent().get(0).id;
		var name = $(this).parent().parent().get(0).cells.item(1).innerHTML;
		var surname = $(this).parent().parent().get(0).cells.item(3).innerHTML;
		var fullName = name + " " + surname;
		userIdName.push( {
			id :'u' + userid,
			name :jQuery.trim(fullName)
		});
	});


	$('#messageTo').html("");

	$(document).ready(function() {
		$("#messageTo").tokenInput("userSearchTokenAutocomplete.action", {
			type :"POST",
			noResultsText: $.i18n.prop('no.results.text'),
			prePopulate :userIdName,
			classes : {
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
	});

	$("#messageSubject").val('');
	$("#messageContent").val('');

	$("#sendMessageDialog").dialog( {
		title :$.i18n.prop('messages.send.message'),
		width :350,
		bgiframe :true,
		modal :glbmodal,
		resizable :false,
		close :function(event, ui) {
			$("#sendMessageDialog").dialog('destroy');
			$("#sendMessageDialog .token-input-list-facebook").remove();
		}
	}).height("auto");

	$('#messageContent').maxlength( {
		'feedback' :'.charsLeft'
	});

}

function adminUserSelectActions(url, textMsg, title) {
	var data;
	var selectedUserList = new Array();
	$("#userListContent tbody input:checked").each(function() {
		var userid = $(this).parent().parent().get(0).id;
		selectedUserList.push(userid);
	});
	
	if(url == 'activateUsers'){
		data = {selectedUserList:selectedUserList,activate:1};
	}
	else if(url == 'deactivateUsers'){
		url = 'activateUsers';
		data = {selectedUserList:selectedUserList,activate:0};
	}else if(url == 'deleteusermulti'){
		data = {selectedUserList:selectedUserList};
	}
		

	var btns = {};
	btns[$.i18n.prop('buttons.confirm')] = function() {
		$.ajax( {
			type :'POST',
			url : url,
			data :data,
			dataType :'json',
			async :false,
			success :function(json) {
				if (checkResponseSuccess(json)) {
					$("#activateUsersDialog").dialog('close');
					
					$.ajax( {
						type :'POST',
						url :'listusers.action',
						success :function(ajaxResponse) {
							if (checkResponseSuccess(ajaxResponse)) {
								$('#userList').html(ajaxResponse);
							}
						}
					});
				}else{
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
	$( function() {
		$("#activateUsersDialog").dialog( {
			bgiframe :true,
			resizable :false,
			height :140,
			modal :glbmodal,
			overlay : {
				backgroundColor :'#000',
				opacity :0.5
			},
			buttons : btns
		});
	});

	$("#activateUsersDialog").dialog('option', 'title', title);
	$("#activateUsersDialog p").text(textMsg);
	$("#activateUsersDialog").dialog('open');
}



function adminGroupSelectActions(url, textMsg, title) {
	var data;
	var selectedGroupList = new Array();
	$("#groupListContent input:checked").each(function() {
		var groupid = $(this).parent().parent().get(0).id;
		selectedGroupList.push(groupid);
	});
	
	if(url == 'activateGroups'){
		data = {selectedGroupList:selectedGroupList,activate:1};
	}
	else if(url == 'deactivateGroups'){
		url = 'activateGroups';
		data = {selectedGroupList:selectedGroupList,activate:0};
	}else if(url == 'deletegroupMulti'){
		data = {selectedGroupList:selectedGroupList};
	}
		
	var btns = {};
	btns[$.i18n.prop('buttons.cancel')] = function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
	};
	btns[$.i18n.prop('buttons.confirm')] = function() {
		$.ajax( {
			type :'POST',
			url :url,
			data :data,
			async :false,
			success :function(response) {
				$("#activateUsersDialog").dialog('close');
				if (checkResponseSuccess(response)) {
					$('#groupList').html(response);
					
				}
			}
		});

		$(this).dialog('close');
		$(this).dialog('destroy');
	};

	document.getElementById("activateUsersDialog").style.display = "";
	$( function() {
		$("#activateUsersDialog").dialog( {
			bgiframe :true,
			resizable :false,
			height :140,
			modal :glbmodal,
			overlay : {
				backgroundColor :'#000',
				opacity :0.5
			},
			buttons : btns
		});
	});

	$("#activateUsersDialog").dialog('option', 'title', title);
	$("#activateUsersDialog p").text(textMsg);
	$("#activateUsersDialog").dialog('open');
}


function selectAllUsers(){
	$("#lbasUserList input:checkbox").each(function() {
		this.checked = 'checked';
	});
	clickedOnUserCheckBox();
}

function deselectUsers(){
	$("#lbasUserList input:checkbox").each(function() {
		this.checked = '';
	});
	clickedOnUserCheckBox();
}

function selectGroups(){
	$("#lbasGroupList input:checkbox").each(function() {
		this.checked = 'checked';
	});
	clickedOnGroupCheckBox();
}

function deselectGroups(){
	$("#lbasGroupList input:checkbox").each(function() {
		this.checked = '';
	});
	clickedOnGroupCheckBox();
}

function addEnterpriseClicked(checked, type){
	if(type === 0 && checked){
		$("#userEditRightTable input[name='lbasUser.view_enterprise_locations']").attr('checked', 'checked').val(true);
	}else if(type === 1 && checked){// group
		$("#groupEditRightTable input[name='lbasGroup.view_enterprise_locations']").attr('checked', 'checked').val(true);
	}
}

function viewEnterpriseClicked(checked, type){
	if(type === 0 && !checked){// user
		$("#userEditRightTable input[name='lbasUser.add_enterprise_location']").removeAttr('checked').val(false);
	}else if(type === 1 && !checked){
		$("#groupEditRightTable input[name='lbasGroup.add_enterprise_location']").removeAttr('checked').val(false);
	}
}

var preUserModelMap = null;

function updateAndDisableSingleUserCheckBox(name,value_permission, disable) {
  var ref=$('#'+name);
  ref.removeAttr('disabled');
  
  if (value_permission) {
    ref.attr('checked', true);
    ref.val(true);
    //ref.val(true);
  } else {
    ref.attr('checked', false);
    ref.val(false);
    
    if(disable != false) {
      if (getIEBrowserVersion() == 6){
        ref.attr('disabled',true);
      }else{
        ref.attr('disabled','disabled');
      }
    }
  }
}

function selectedPreUserChanged(sel) {
	// clean -s-
	
	 console.log("selectedPreUserChanged");
	 $("#userEditRightTable input[type=checkbox]:checked").each( function() {
		 $(this).attr("checked",false);
	 });
	 $("#userEditRightTable input[type=checkbox]:disabled").each( function() {
		 if (getIEBrowserVersion() == 6) {
			 $(this).attr('disabled',false);
	 	 } else {
	 		 $(this).removeAttr('disabled');
	 	 }
	 });
	 // clean -e-
	var lbasUserId = $('input[name="lbasUser.user_id"]').val();
	if(lbasUserId <= 0 && sel != null && sel.options.selectedIndex >= 0) {
	  console.log(lbasUserId);
		var permissions = preUserModelMap[sel.options[sel.selectedIndex].value];
		console.log(permissions);
		
		if (permissions != null) {
		  /*updateAndDisableSingleUserCheckBox('id_add_enterprise_location', permissions.add_enterprise_location);
		  updateAndDisableSingleUserCheckBox('id_create_meetings', permissions.create_meetings);*/
		  
		  updateAndDisableSingleUserCheckBox('id_agps_enabled', permissions.agpsEnabled, false);
		  updateAndDisableSingleUserCheckBox('id_sms_interface_enabled', permissions.smsInterfaceEnabled, false);
		  
		  
		  updateAndDisableSingleUserCheckBox('id_be_located', permissions.be_located);
      updateAndDisableSingleUserCheckBox('id_request_current_location', permissions.request_current_location);
      updateAndDisableSingleUserCheckBox('id_request_location_report', permissions.request_location_report);
      
      
      
		}
	}                         
}

function selectOrUnselectAll(checkbox) {
    if(checkbox.checked){
    	selectAllUsers();
    }else{
    	deselectUsers();
    }
}


function createEditGroup(json){
	var templateName = "newGroupDialog";
	var content = $('<div></div>').load('pages/template/' + templateName + '.html', function(){
		if(json.lbasGroup.assetGroup)
			$("#edit_group_tab2_link").hide();
		else
			$("#edit_group_tab2_link").show();
		
		groupUsersMap = json.groupUsersMap;
		usersMap = json.userMap;		

		usersMapArray = [];
		for(var i in json.userMap) { 				 				 
			usersMapArray[usersMapArray.length] = {
					value: usersMap[i],
					key: i
			};
		}

		for(var i in json.groupUsersMap) { 				 				 
			groupUsersMapleftArray[groupUsersMapleftArray.length] = {
					value: groupUsersMap[i],
					key: i
			};
		}
		
		$("#edit_group_dialog").tabs({
			cache: true,
			show: function(event, ui){
				var html = '&nbsp';
				switch (ui.index){
					case 0:
						if($.trim($(ui.panel).html())===''){
							html = getContent('groupDetailEditTemplate');
							$(ui.panel).html(html);
						}	
					  break;					
					case 1:
						if($.trim($(ui.panel).html())===''){
							html = getContent('groupMemberEditTemplate');
							$(ui.panel).html(html);
							edit_group_tab1Ready(json);
						}	
					  break;
					case 2:
						if($.trim($(ui.panel).html())===''){
							html = getContent('groupPermissionEditTemplate');
							$(ui.panel).html(html);
						}	
					  break;
					case 3:
						if($.trim($(ui.panel).html())===''){
							html = getContent('groupAdminEditTemplate');
							$(ui.panel).html(html);
						}	
					  break;
				}
			}
		});
		
		loadGroupAdminAcc();
		localize && localize.newGroupDialog();
		registerValidations("userDetailForm");
		
		function getContent(template){
			var tmp = '';
			if(template){
			 	tmp = parseTemplate(template, {   
					 json: json
				});
			}	 
			return tmp;	 	
		}
	});
	
	var btns = {};
	btns[$.i18n.prop('buttons.save')] = function() {
		if(lbasValidate('userDetailForm'))
			//groups && groups.getGroupsList({}, true);
			updateUserGroup(json);
	};
	btns[$.i18n.prop('buttons.cancel')] = function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
	};
	
	utils && utils.dialog({title: $.i18n.prop('groupEdit.editGroup'), content: content, buttons: btns});
}