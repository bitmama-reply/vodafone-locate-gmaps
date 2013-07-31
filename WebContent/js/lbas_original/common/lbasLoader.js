var lbasLayout;

function initWelcome() {
	lbasLayout = $('body').layout({
		north :{
			size :'auto',
			spacing_open :0,
			closable :false,
			resizable :false,
			slidable :false
		},
		center :{
			spacing_open :0,
			size :'auto',
			resizable :true,
			slidable :true
		},
		west :{
			resizable :true,
			slidable :true
		}
	});

	var centerpHeight = parseInt($('#centerP').css('height'));
	var centerpWidth = parseInt($('#centerP').css('width'));

	$('#lbasMainMap').css({
		width :centerpWidth + 'px'
	});

	$('#calendarCenterDiv').css({
		height :centerpHeight + 'px'
	});

	$('#west').css({
		height :centerpHeight + 'px'
	});

	$("#collapseMap").bind("click", function(e) {
		closeWestPanel();
	});

	$("#expandMap").bind("click", function(e) {
		openWestPanel();
	});

	$("#accountLi").bind("click", function(e) {
		$('#centerP').css({
			overflow :''
		});
		$('#showEventOnMap').hide();
		$('#lbasMainMap').hide();
		$('#privacyCenterDiv').hide();
		$('#privacyRightDiv').hide();
		$('#messageDiv').hide();
		$('#dashboardDiv').hide();
		$('#calendarCenterDiv').hide();
		changeRightNavigation('usersRightNav', 'account');
		$('#mapNavs').hide();
		openWestPanel();

		$('#collapseMap').hide();

		$('#expandMap').hide();
	});

	$("#logout").bind("click", function(e) {
		$('#leftPanelContent').load('logout');
	});

	$("#helpLi").bind("click", function(e) {
		openHelp();
	});

	$("#privacyLi").bind("click", function(e) {
		openPrivacy();
	});

	$("#enterpriseTab").bind("click", function(e) {
		$("#search_places").val($.i18n.prop('general.Search'));
		changeRightNavigation('locationsRightNav', null);
		$('#enterpriseTab').addClass('selected');
		$('#findOnMapTab').removeClass('selected');
		$('#findOnMapTabContent').hide();
		$('#personalTab').removeClass('selected');
		$('#personalTabContent').hide();
		$('#enterpriseTab').show();
		$('#enterpriseTabContent').show();
		loadCategories(0, 0);
	});

	$("#personalTab").bind("click", function(e) {
		$("#search_places").val($.i18n.prop('general.Search'));
		changeRightNavigation('locationsRightNav', null);
		$('#personalTab').addClass('selected');
		$('#findOnMapTab').removeClass('selected');
		$('#findOnMapTabContent').hide();
		$('#enterpriseTab').removeClass('selected');
		$('#enterpriseTabContent').hide();
		$('#personalTab').show();
		$('#personalTabContent').show();
		loadCategories(1, 0);
	});

	$("#findOnMapTab").bind("click", function(e) {
	
		$('#findOnMapTab').addClass('selected');
		$('#personalTab').removeClass('selected');
		$('#findOnMapTabContent').show();
		$('#personalTabContent').hide();
		$('#enterpriseTab').removeClass('selected');
		$('#enterpriseTabContent').hide();
	});

	$("#usersAndGroupsTab").bind("click", function(e) {
		userTabNavigate('users', false);
	});

	$("#homeRightNav").bind("click", function(e) {
		$('#centerP').css({
			overflow :'auto'
		});
		$('#showEventOnMap').hide();
		$("#west").hide();
		$("#collapseMap").hide();
		$("#expandMap").hide();
		/*$('.olControlPanZoomBar').each(function() {
			$(this).css({
				left :'4px'
			});
		});*/
		$('#lbasMainMap').hide();
		$('#messageDiv').hide();
		$('#privacyCenterDiv').hide();
		$('#privacyRightDiv').hide();
		$('#calendarCenterDiv').hide();
		changeRightNavigation('homeRightNav', null);
		$('#dashboardDiv').show();
		fillDashboard();
	});

	$("#locationsRightNav").bind("click", function(e) {

		$('#centerP').css({
			overflow :''
		});
		$('#showEventOnMap').hide();
		$('#lbasMainMap').show();
		$('#messageDiv').hide();
		$('#privacyCenterDiv').hide();
		$('#privacyRightDiv').hide();
		$('#calendarCenterDiv').hide();
		$('#dashboardDiv').hide();

		if ($("#locations").html().trim().length <= 0) {

			$('#findOnMapTab').addClass('selected');
			$('#personalTab').removeClass('selected');
			$('#findOnMapTabContent').show();
			$('#personalTabContent').hide();
			$('#enterpriseTab').removeClass('selected');
			$('#enterpriseTabContent').hide();

			listLocation();
		}

		changeRightNavigation('locationsRightNav', null);

		openWestPanel();
	});

	$("#usersRightNav").bind("click", function(e) {
		$('#centerP').css({
			overflow :''
		});
		$('#showEventOnMap').hide();
		$('#lbasMainMap').show();
		$('#messageDiv').hide();
		$('#privacyCenterDiv').hide();
		$('#privacyRightDiv').hide();
		$('#calendarCenterDiv').hide();
		$('#dashboardDiv').hide();
		changeRightNavigation('usersRightNav', null);
		listGroup();
		$('#mapNavs').show();
		openWestPanel();
	});

	$("#routingRightNav").bind("click", function(e) {
		$('#centerP').css({
			overflow :''
		});
		$('#showEventOnMap').hide();
		$('#lbasMainMap').show();
		$('#messageDiv').hide();
		$('#privacyCenterDiv').hide();
		$('#privacyRightDiv').hide();
		$('#calendarCenterDiv').hide();
		$('#dashboardDiv').hide();
		changeRightNavigation('routingRightNav', null);
		getSavedRoutes();
		$('#mapNavs').show();
		openWestPanel();
	});

	$("#routingTab").bind("click", function(e) {
		$('#centerP').css({
			overflow :''
		});
		$('#routingTab').addClass('selected');
		$('#savedRoutesTab').removeClass('selected');
		$('#routingTabContent').show();
		$('#savedRoutes').hide();
		setRightClickMenu();
		openWestPanel();
	});

	$("#savedRoutesTab").bind("click", function(e) {

		$('#savedRoutesTab').addClass('selected');
		$('#routingTab').removeClass('selected');
		$('#savedRoutes').show();
		$('#routingTabContent').hide();
		openWestPanel();
	});

	$("#inboxRightNav").bind("click", function(e) {

		$('#centerP').css({
			overflow :'auto'
		});
		$('#showEventOnMap').hide();
		$('#lbasMainMap').hide();
		$('#privacyCenterDiv').hide();
		$('#privacyRightDiv').hide();
		$('#calendarCenterDiv').hide();
		$('#messageDiv').css({
			left :$('#west').css('width')
		// top :$('#north').css('height')
		});
		$('#messageDiv').show();
		$('#dashboardDiv').hide();
		changeRightNavigation('inboxRightNav', null);
		// showMessageBox('INBOX');
		loadInbox('INBOX');
		openWestPanel();
		$('#collapseMap').hide();
		$('#expandMap').hide();
	});

	$("#privacyTopNav").bind("click", function(e) {

		$('#centerP').css({
			overflow :'auto'
		});
		$('#showEventOnMap').hide();
		$('#lbasMainMap').hide();
		$('#messageDiv').hide();
		$('#calendarCenterDiv').hide();
		$('#dashboardDiv').hide();
		$('#privacyCenterDiv').css({
			left :$('#west').css('width')
		// top :$('#north').css('height')
		});

		$('#privacyCenterDiv').show();
		$('#privacyCenterDiv').html(myVisibility());
		adjustSelectedTabColor("PCMyVisibility");
		changeRightNavigation('privacyTopNav', null);
		openWestPanel();

		$('#collapseMap').hide();
		$('#expandMap').hide();
	});

	$("#calendarRightNav").bind("click", function(e) {

		$('#centerP').css({
			overflow :'auto'
		});
		$('#showEventOnMap').show();
		$('#lbasMainMap').hide();
		$('#privacyCenterDiv').hide();
		$('#privacyRightDiv').hide();
		$('#messageDiv').hide();
		$('#dashboardDiv').hide();
		$('#calendarCenterDiv').css({
			left :$('#west').css('width')
		// top :$('#north').css('height')
		});
		$('#calendarCenterDiv').show();

		openCalendar();
		openWestPanel();

		$('#collapseMap').hide();
		$('#expandMap').hide();

	});
        
	// load dialog template
	if (userLoggedIn) {
		$('#allDialogs').html(parseTemplate("dialogDivsTemplate", {}));

	}

}
function fillDashboard() {

	if (dashMap2MarkerManager != undefined) {
		displayCategoryPanelLocations();
	}

	listMeetings(new Date(), "todaysMeetings", "meetingListHomeTemplate");

	if (dashMap1MarkerManager != undefined) {
		showUsersAroundOnMap(dashMap1MarkerManager, dashMap1, null, null, 20, false, 'userLocationTooltip2Template');
	}
	$('#recentRoutes').html(populateRecentRoutes());
	$('#recentLocs').html(populateRecentLocations(false));
	$('#viewInBoxPanel').html(populateViewInBoxPanel());

}

function openWestPanel() {
  $('#right').css('left', '355px');
	/*
$('.olControlPanZoomBar').each(function() {
		$(this).css({
			left :'280px'
		});
	});
*/

	$("#collapseMap").show();
	$("#expandMap").hide();
	$("#west").show();

	if ($("#mapBottomDiv").css("display") != "none") {
		var westWidth = parseInt($("#west").css("width"));
		var lbasMainMapWidth = parseInt($("#lbasMainMap").css("width"));

		$("#mapBottomDiv").css('left', westWidth);

		$("#locReportListDiv").css("width", lbasMainMapWidth - westWidth);
		$("#locReportUserList").css("width", lbasMainMapWidth - westWidth);

		$("#locReportListDiv #locReportDetailsTable th").each(function() {
			$(this).css("width", lbasMainMapWidth - westWidth);
		});

		$("#locReportListDiv #locReportDetailsTable td").each(function() {
			$(this).css("width", lbasMainMapWidth - westWidth);
		});

		$("#locReportListDiv [id='locReportUserFullName']").each(function() {
			$(this).css("width", lbasMainMapWidth - westWidth - 50);
		});
	}
}

function closeWestPanel() {

	/*
$('.olControlPanZoomBar').each(function() {
		$(this).css({
			left :'4px'
		});
	});
*/
  $('#right').css('left', 0);

	$("#collapseMap").hide();
	$("#expandMap").show();
	$("#west").hide();

	if ($("#mapBottomDiv").css("display") != "none") {
		// var westWidth = parseInt($("#west").css("width"));
		var lbasMainMapWidth = parseInt($("#lbasMainMap").css("width"));

		$("#mapBottomDiv").css('left', 0);

		$("#locReportListDiv").css("width", lbasMainMapWidth);
		$("#locReportUserList").css("width", lbasMainMapWidth);

		$("#locReportListDiv #locReportDetailsTable th").each(function() {
			$(this).css("width", lbasMainMapWidth);
		});

		$("#locReportListDiv #locReportDetailsTable td").each(function() {
			$(this).css("width", lbasMainMapWidth);
		});

		$("#locReportListDiv [id='locReportUserFullName']").each(function() {
			$(this).css("width", lbasMainMapWidth - 50);
		});
	}
}

function lbasResize() {

	lbasLayout.resizeAll();

	setMapButtonStyle();

	var centerpHeight = parseInt($('#centerP').css('height'));
	var centerpWidth = parseInt($('#centerP').css('width'));

	$('#lbasMainMap').css({
		height :centerpHeight + 'px',
		width :centerpWidth + 'px'
	});

	map.updateSize();

	$('#west').css({
		'height' :centerpHeight + 'px',
		'overflow-y' :'auto',
		'overflow-x' :'hidden'
	});

	$('#idRouteResultsScrollPane').css('height', centerpHeight - 415 + 'px');
	$('#calendarCenterDiv').css('height', centerpHeight + 'px');
	$('#userAccordion').css('height', centerpHeight - 100 + 'px');
	$('#usersAccordionDiv').css('height', centerpHeight - 120 + 'px');
	$('#catgList0').css('height', centerpHeight - 155 + 'px');
	$('#catgList1').css('height', centerpHeight - 155 + 'px');

}
