var PrivacyManagement = Class.extend({
	init: function() {
		$.post('json/showCompanyPrivacyStatement.action', {}, function(json) {
			$('#privacyStatement').html($('<div/>').html(json.companyPrivacyStatement).text());
		});

		$('#privacyEditBtn').click(function(e){
			e.preventDefault();
			/* return; */
			$.ajax({
				url: 'json/showCompanyPrivacyStatement.action',
				type: 'POST',
				cache: false,
				async: false,
				success: function(data) {
					privacyStatement = data.companyPrivacyStatement;
					$('#privacyContentWrapper').html('<div id="privacyListContent" style="width:100%"><iframe id="statmentEditorFrame" src ="pages/admin/editor.jsp" width="100%" height="450" frameBorder="0" style="width:100%"><p>Your browser does not support iframes.</p></iframe></div>');
					setAdminLineHeight();
				}
			});
		});
	}
});