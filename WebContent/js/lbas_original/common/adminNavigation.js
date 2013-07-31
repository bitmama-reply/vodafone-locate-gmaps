var adminNavigations = [ 'companyList', 'userList', 'assetList', 'groupList', 'locationList', 'privacyList', 'opcoAdminUserList',
		'userStatisticsList', 'kpiList', 'applicationList', 'dbObjectsList' ];

function changeAdminNavigation(selected) {

	$("#" + selected + "Li").addClass("adMenuSelected");

	for ( var i = 0; i < adminNavigations.length; i++) {
		if (adminNavigations[i] != selected) {
			$("#" + adminNavigations[i] + "Li").removeClass("adMenuSelected");
			$("#" + adminNavigations[i] + "Li").addClass("adMenu");
			$("#" + adminNavigations[i]).hide();

		} else {
			$("#" + adminNavigations[i]).show();
		}
	}

}