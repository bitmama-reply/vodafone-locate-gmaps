var localize = {};
	
localize.init = function(){
	jQuery.i18n.properties({
	    name:'lbas_locale',
	    path:'resources/',
	    mode:'map',
	    language: userLocale || ''
	});
};	

localize.login = function(){
	//login
	$('#lbl_loginUserName').text($.i18n.prop('login.login'));
	$('#loginUserName').attr('title', $.i18n.prop('login.login'));
	$('#lbl_loginPassword').text($.i18n.prop('password'));
	$('#loginPassword').attr('title', $.i18n.prop('password'));
	$('#lbl_loginsecuritycode').text($.i18n.prop('login.brute.force.attack.warning'));
	$('#lbl_loginsecuritycode').attr('title', $.i18n.prop('login.brute.force.attack.warning'));
	
	$('#usernameOrPassword').text($.i18n.prop('login.usernameOrPassword'));
	$('#usernameOrPassword').attr('title', $.i18n.prop('login.usernameOrPassword'));
	
	//$('#btn_login').text($.i18n.prop('login.login'));
	$('#btn_login').attr('value', $.i18n.prop('login.login'));
	$('#btn_login').attr('title', $.i18n.prop('login.login'));
};	

localize.routingTemplate = function(){
  $('#routingTypes a.driving').attr('title', $.i18n.prop('routing.routeType.driving'));
  $('#routingTypes a.pedestrian').attr('title', $.i18n.prop('routing.routeType.pedestrian'));  
};

localize.tooltip = function(){
  $('.toolTipContent a[id^=btn_tooltip_moreInfo_]').attr('title', $.i18n.prop('place.moreinfo'));
  $('.toolTipContent a[id^=btn_tooltip_share_]').attr('title', $.i18n.prop('place.share'));
  $('.toolTipContent a[id^=btn_tooltip_edit_]').attr('title', $.i18n.prop('place.edit'));    
};

localize.mainMenu = function(){
	//header top bar
	var nm=Encoder.htmlDecode(userFullName);
	nm=Encoder.htmlDecode(nm);
	
	
	$('#btn_username').html(nm || $.i18n.prop('userEdit.Username'));
	$('#btn_username').attr('title', nm || $.i18n.prop('userEdit.Username'));
/*
	
	$('#btn_help').text($.i18n.prop('welcome.Help'));
	$('#btn_help').attr('title', $.i18n.prop('welcome.Help'));
*/
	
	$('#btn_logout').text($.i18n.prop('welcome.Logout'));
	$('#btn_logout').attr('title', $.i18n.prop('welcome.Logout'));
	
	$('#btn_privacy_terms').text($.i18n.prop('welcome.PrivacyStatement'));
	$('#btn_privacy_terms').attr('title', $.i18n.prop('welcome.PrivacyStatement'));
	$('#btn_privacy_terms').attr('href', '#PrivacyStatements');
	
	$('#btn_help').text($.i18n.prop('welcome.Help'));
	$('#btn_help').attr('title', $.i18n.prop('welcome.Help'));
	
	if( roleIdOfLoggedInUser < 2){
		var link='http://www.business.vodafone.com/site/locate/help/'+userLocale.toLowerCase()+'/admin_index.jsp'
		$('#btn_help').attr('href', link);
	}else{
		var link='http://www.business.vodafone.com/site/locate/help/'+userLocale.toLowerCase()+'/index.jsp';
		$('#btn_help').attr('href', link);		
	}
	
	$('#btn_admin').text($.i18n.prop('welcome.adminLink'));
	$('#btn_admin').attr('title', $.i18n.prop('welcome.adminLink'));
	
	// header bottom bar
	$('#btn_map').text($.i18n.prop('welcome.Map'));
	$('#btn_map').attr('title', $.i18n.prop('welcome.Map'));
	
	$('#btn_messages').text($.i18n.prop('welcome.Mail') + ' ' + totMailCnt);
	$('#btn_messages').attr('title', $.i18n.prop('welcome.Mail') + ' ' + totMailCnt);

	
	$('#btn_calendar').text($.i18n.prop('welcome.Calendar'));
	$('#btn_calendar').attr('title', $.i18n.prop('welcome.Calendar'));
	
	$('#btn_privacy').text($.i18n.prop('welcome.Privacy'));
	$('#btn_privacy').attr('title', $.i18n.prop('welcome.Privacy'));
	
	
	$('#changeVisibiityBox .partLeft .name').html(nm).text();
	$('#changeVisibiityBox .partLeft .vis').text($.i18n.prop('editVisibility.visible'));
	$('#changeVisibiityBox .partLeft .notvis').text($.i18n.prop('editVisibility.notvisible'));
	$('#changeVisibiityBox .partLeft .privacy').text($.i18n.prop('welcome.Privacy'));
	localize && localize.mapTabs();
};

localize.mapTabs = function(){
	//localize.apply('#btn_map_expand_collapse span.left', $.i18n.prop('welcome.ControlPanel'));
	
	$('#btn_map_expand_collapse span:first').html($.i18n.prop('welcome.ControlPanel') + '<span class="status"> - </span>');
	$('#btn_map_expand_collapse span:first').attr('title', $.i18n.prop('welcome.ControlPanel'));	
	
	localize.apply('#lbl_select_all_tab-users', $.i18n.prop('users.allPeople'));
	localize.apply('#lbl_select_all_tab-assets', $.i18n.prop('users.allAssets'));
	
	localize.apply('#btn_tab-places', $.i18n.prop('welcome.Places'));
	localize.apply('#btn_tab-routes', $.i18n.prop('welcome.Routes'));
	localize.apply('#btn_tab-users', $.i18n.prop('welcome.Users'));
	localize.apply('#btn_tab-assets', $.i18n.prop('welcome.Assets'));
	localize.apply('#btn_tab-geofences', $.i18n.prop('welcome.Geofences'));
	
	localize.apply('#btn_tab-places-recents', $.i18n.prop('category.findonmap'));
	//localize.apply('#btn_tab-places-enterprise', $.i18n.prop('category.enterprise'));
	//localize.apply('#btn_tab-places-personal', $.i18n.prop('category.personal'));
	
	localize.apply('#btn_tab-routes_routingTab', $.i18n.prop('routing.routing'));
	localize.apply('#btn_tab-routes_savedRoutesTab', $.i18n.prop('welcome.myRoutes'));
	
	localize.apply('#btn_tab-users_showOnMap span', $.i18n.prop('globalsearch.showonmap'));
	localize.apply('#btn_tab-users_requestPermission span', $.i18n.prop('user.actionList.1'));
	localize.apply('#btn_tab-users_createReport span', $.i18n.prop('user.action.createReport'));
	localize.apply('#btn_tab-users_sendMessage span', $.i18n.prop('user.actionList.6'));
	
	localize.apply('#btn_tab-assets_showOnMap span', $.i18n.prop('globalsearch.showonmap'));
	localize.apply('#btn_tab-assets_requestPermission span', $.i18n.prop('user.actionList.1'));
	localize.apply('#btn_tab-assets_createReport span', $.i18n.prop('user.action.createReport'));
	localize.apply('#btn_tab-assets_sendMessage span', $.i18n.prop('user.actionList.6'));
        
    localize.apply('#btn_tab-places_showOnMap span', $.i18n.prop('places.showonmap'));
	localize.apply('#btn_tab-places_newCategory span', $.i18n.prop('places.newCategory'));
	localize.apply('#btn_tab-places_Delete span', $.i18n.prop('places.delete'));
	localize.apply('#btn_tab-places_Pdf span', $.i18n.prop('places.Pdf'));
	
	localize.apply('#tab-assets_count', '0 ' + $.i18n.prop('mesage.selected.assets'));
	localize.apply('#tab-users_count', '0 ' + $.i18n.prop('mesage.selected.users'));
	
	localize.apply('#allPeolple', $.i18n.prop('users.allPeople'));
	localize.apply('#allAssets', $.i18n.prop('users.allAssets'));
	localize.apply('.allLocatable', $.i18n.prop('users.locatable'));
	
	localize.apply('#allPeolple', $.i18n.prop('users.allPeople'));
	
	localize.apply('#userActionList option.generalActions', $.i18n.prop('general.actions'));
	localize.apply('#userActionList option.userActionList2', $.i18n.prop('user.actionList.2'));
	localize.apply('#userActionList option.userActionList4', $.i18n.prop('user.actionList.4'));
	
		localize.apply("#menuMap #RouteFrom span", $.i18n.prop("tooltipmain.RouteFrom"));
		localize.apply("#menuMap #RouteTo span", $.i18n.prop("tooltipmain.RouteTo"));
		localize.apply("#menuMap #SavePlace span", $.i18n.prop("tooltipmain.SaveLocation"));
		localize.apply("#menuMap #ShowNearestUsers span", $.i18n.prop("tooltipmain.ShowNearestUsers"));
		localize.apply("#menuMap #PlanMeeting span", $.i18n.prop("tooltipmain.PlanAMeeting"));

		localize.apply('#btn_map_clear span', $.i18n.prop("welcome.clearMap"));
		localize.apply('#btn_map_traffic span', $.i18n.prop("welcome.Traffic"));
		localize.apply('#btn_map_satellite span', $.i18n.prop("welcome.Satellite"));
		localize.apply('#btn_map_hybrid span', $.i18n.prop("welcome.Hybrid"));
		localize.apply('#btn_map_myLocation span', $.i18n.prop("welcome.MyLocation"));
		
		localize.apply('#btn_map_street span', $.i18n.prop("welcome.Map"));

		 	    
		$('#search_users').attr('value', $.i18n.prop('general.Search'));
		$('#search_assets').attr('value' , $.i18n.prop('general.Search') );

		localize.apply('.multi_user_button_refresh span', $.i18n.prop('category.Refresh'));          			
	
};	

localize.newUserDialog = function(){
	localize.apply('#edit_user_tab1_link', $.i18n.prop('location.details'));
	localize.apply('#edit_user_tab2_link', $.i18n.prop('userEdit.Groups'));
	localize.apply('#edit_user_tab3_link', $.i18n.prop('location.permissions'));
	localize.apply('#edit_user_tab4_link', $.i18n.prop('user.cdf'));
};

localize.newGroupDialog = function(){
	localize.apply('#edit_group_tab0_link', $.i18n.prop('groupEdit.GroupDetails'));
	localize.apply('#edit_group_tab1_link', $.i18n.prop('groupEdit.GroupMembers'));
	localize.apply('#edit_group_tab2_link', $.i18n.prop('groupEdit.Permissions'));
	localize.apply('#edit_group_tab3_link', $.i18n.prop('groupEdit.Admin'));
};

localize.routesTab0 = function(){
	$('#label_routePoint0').text($.i18n.prop('routing.from'));
	$('#label_routePoint1').text($.i18n.prop('routing.to'));
	$('#routing_addDestination').text($.i18n.prop('routing.adddestination'));
	$('#label_routingTrafficEnableCheck').text($.i18n.prop('routing.includeTraffic'));
	$('#label_routingTypes').text($.i18n.prop('routing.travelMode'));
	$('#btn_routingTitle').text($.i18n.prop('routing.title'));
	
	$('#label_idHeight').text($.i18n.prop('routing.m'));
	$('#label_idWidth').text($.i18n.prop('routing.m'));
	$('#label_idWeight').text($.i18n.prop('routing.Ton'));
	$('#label_idHazardous').text($.i18n.prop('routing.HazardousMaterials'));
	
	$('#btn_route_route span').text($.i18n.prop('buttons.route'));
	$('#btn_routing_cancel').text($.i18n.prop('buttons.cancel'));
	$('#btn_routing_save').text($.i18n.prop('buttons.save'));
	
};

localize.newEnterprisePlaceGroupDialog = function(){
	localize.apply('#tab1', $.i18n.prop('editEnterpriseCategoryDialog.Details'));
	localize.apply('#tab2', $.i18n.prop('editEnterpriseCategoryDialog.Permissions'));
	localize.apply('#tab3', $.i18n.prop('editEnterpriseCategoryDialog.Admin'));
};

localize.newPersonalPlaceGroupDialog = function(){
	localize.apply('#tab1', $.i18n.prop('editPersonalCategoryDialog.Details'));
	localize.apply('#tab2', $.i18n.prop('editPersonalCategoryDialog.Sharing'));
};

localize.itemDetails = function(){
	localize.apply('a[name=btn_item_locate] span', $.i18n.prop('globalsearch.showonmap'));
	localize.apply('a[name=btn_item_more_info] span', $.i18n.prop('user.actionList.3'));
	localize.apply('a[name=btn_item_create_report] span', $.i18n.prop('user.action.createReport'));
	localize.apply('a[name=btn_item_send_message] span', $.i18n.prop('user.actionList.6'));
};

localize.newPlaceDialog = function(){
	localize.apply('#edit_loc_tab1_link', $.i18n.prop('location.details'));
	localize.apply('#edit_loc_tab2_link', $.i18n.prop('location.categories'));
	localize.apply('#edit_loc_tab3_link', $.i18n.prop('location.permissions'));
	localize.apply('#edit_loc_tab4_link', $.i18n.prop('location.admin'));
};

localize.newPlaceDialog_tab1 = function(){
	localize.apply('#lbl_radioCategoryTypeId1', $.i18n.prop('category.enterprise'));
	localize.apply('#lbl_radioCategoryTypeId2', $.i18n.prop('category.personal'));
	localize.apply('.lbl_newCategory', $.i18n.prop('location.categories.createNewCategory'));
	
	localize.apply('.btn_create', $.i18n.prop('buttons.create'));
	localize.apply('.btn_cancel', $.i18n.prop('buttons.cancel'));
	localize.apply('.lbl_selectCategory', $.i18n.prop('location.categories.selectCategory'));
};

localize.newPlaceDialog_tab2 = function(){
	localize.apply('#locPermissionHeader', $.i18n.prop('location.permissions'));
	localize.apply('#savePlace_allUSersAndGroup', $.i18n.prop('location.permissions.AllUsersAndGroups'));
	localize.apply('#lbl_changePermissions0', $.i18n.prop('location.permissions.viewLocation'));
	localize.apply('#lbl_changePermissions1', $.i18n.prop('location.permissions.rateLocation'));
	localize.apply('#lbl_changePermissions2', $.i18n.prop('location.permissions.editPermissions'));
	localize.apply('#lbl_changePermissions3', $.i18n.prop('location.permissions.editDetails'));
	localize.apply('#lbl_changePermissions4', $.i18n.prop('location.permissions.deleteLocation'));
	localize.apply('#lbl_changePermissions5', $.i18n.prop('location.permissions.shareLocation'));
	localize.apply('#lbl_changePermissions6', $.i18n.prop('location.permissions.changeCategory'));
	
};

localize.nearestUserDialogTemplate = function(){
	localize.apply('#nearestUsersDialog_first', $.i18n.prop('nearestUsers.dialog.first'));
	localize.apply('#nearestUsersDialog_second', $.i18n.prop('nearestUsers.dialog.second'));
};

localize.apply = function(container, label){
	$(container).text(label);
	if (label != $.i18n.prop('user.action.createReport')) {
	 $(container).attr('title', label);	
	}
};

localize.privacyStatements = function(){
	localize.apply('#privacyStatementLeft .line1', $.i18n.prop('privactStatement.privacyStatementMenu.line1'));
	localize.apply('#privacyStatementLeft .line2', $.i18n.prop('privactStatement.privacyStatementMenu.line2'));	
	localize.apply('#privacyStatementBox1 h1', $.i18n.prop('privactStatement.box1.header'));
	localize.apply('#privacyStatementBox1 .message', $.i18n.prop('privactStatement.box.message'));
	localize.apply('#privacyStatementBox2 h1', $.i18n.prop('privactStatement.box2.header'));
	localize.apply('#privacyStatementBox2 .message', $.i18n.prop('privactStatement.box.message'));
	
};

localize.adminPlaceManagement = function(){
	localize.apply('#CategoryAdmin [name="categoryAdmin.ChangeAdmin"]', $.i18n.prop('categoryAdmin.ChangeAdmin'));
	localize.apply('#CategoryAdmin [name="categoryAdmin.CurrentAdmin"]', $.i18n.prop('categoryAdmin.CurrentAdmin'));		
	localize.apply('#CategoryAdmin [name="changeCategoryAdmin.addNewUser"]', $.i18n.prop('changeCategoryAdmin.addNewUser'));
	localize.apply('#CategoryAdmin [name="categoryAdmin.OtherUsersWithAdminRights"]', $.i18n.prop('categoryAdmin.OtherUsersWithAdminRights'));
	localize.apply('#CategoryAdmin [name="buttons.cancel"]', $.i18n.prop('buttons.cancel'));
	localize.apply('#CategoryAdmin [name="buttons.select"]', $.i18n.prop('buttons.save'));
	localize.apply('#CategoryAdmin [name="user.change"]', $.i18n.prop('user.change'));
	localize.apply('#CategoryAdmin [name="categoryAdmin.Message"]', $.i18n.prop('categoryAdmin.Message'));
	localize.apply('#CategoryAdmin [name="changeCategoryAdmin.newAdmin"]', $.i18n.prop('changeCategoryAdmin.newAdmin'));
	localize.apply('#CategoryAdmin [name="changeCategoryAdmin.UsersGroups"]', $.i18n.prop('changeCategoryAdmin.UsersGroups'));
/* 	localize.apply('#CategoryAdmin [name="user.change"]', $.i18n.prop('user.change')); */	
	
};

localize.addTitleForGrid = function(){
	$('.btn-update').attr('title', $.i18n.prop('buttons.update'));
	$('.btn-delete').attr('title', $.i18n.prop('buttons.delete'));
	$('.ui-jqgrid-btable tr td:last-child').attr('title','');
};

localize.traficLegend = function(){
	$('#right #legend li .name').each(function(){
		var name = $(this).attr('key');
		$(this).text($.i18n.prop(name));
	});
}