var rightNavigations = [ 'homeRightNav', 'locationsRightNav', 'usersRightNav', 'routingRightNav', 'calendarRightNav', 'inboxRightNav',
		'privacyTopNav' ];
var leftNavigationDivs = [ 'homeLeftNavDiv', 'locationsLeftNavDiv', 'usersLeftNavDiv', 'routingLeftNavDiv', 'calendarLeftNavDiv', 'inboxLeftNavDiv',
		'privacyLeftNavDiv' ];
var leftMainDivs = [ 'home', 'locations', 'users', 'routing', 'calendarPage', 'inbox', 'privacy' ];

function changeRightNavigation(selected, type) {
  return;
	$("#" + selected).addClass("selected");
	$("#accountLeftNavDiv").hide();
	$("#mapBottomDiv").hide();
	$("#locationReportTable").hide();
	$("#permissionRequiredDiv").hide();

  var tot_rightNavigations=rightNavigations.length;
	for ( var i = 0; i < tot_rightNavigations; i++) {
	  var item_rightNavigations=rightNavigations[i];
	  var item_leftNavigationDivs=leftNavigationDivs[i];
	  var item_leftMainDivs=leftMainDivs[i];
	  
	  
		if (item_rightNavigations != selected) {
			$("#" + item_rightNavigations).removeClass("selected");
			$("#" + item_leftNavigationDivs).hide();
			$("#" + item_leftMainDivs).hide();
		} else {
			if (type == 'account') {
				$("#" + item_rightNavigations).removeClass("selected");
				$("#" + item_leftMainDivs).empty().load('getAccount');
				$("#accountLeftNavDiv").show();
				document.getElementById("usersLeftNavDiv").style.display = "none";
			}
			if (type == null) {
				$("#" + item_leftNavigationDivs).show();
			}
			$("#" + item_leftMainDivs).show();
		}
	}

}