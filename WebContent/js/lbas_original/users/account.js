utils.dialogSuccess = function(msg) {
	$('#error-view-sendmessage').hide();
	var successDialog = $('<div></div>')
		.insertAfter(
			$('#header')
		).html(msg).dialog({
			draggable: false,
			resizable: false,
			dialogClass: 'success-dialog'
		});
	setTimeout(function() {
		successDialog.fadeOut('slow', function() {
			$(this).remove()
		});
	}, 3000);
};

var UserAccount = {};

UserAccount.accountLoad = function(data) {
	this.data    = data;
	this.label   = 'account';
	this.element = $('#' + this.label);

	if (this.element.length === 0) {
		this.render();
	}

	this.show();
};

UserAccount.render = function() {
	this.element = $('<div></div>')
		.attr('id', this.label)
		.addClass('clearfix content ' + this.label)
		.insertAfter(
			$('#header')
			.css('width', '100%')
			.css('height', $('document').height())
		).html(parseTemplate('accountTemplate', {}));

	this.menuHeight();
	this.controls();
};

UserAccount.menuHeight = function() {
	this.menu         = $('#accountNav');
	this.content      = $('#accountContent .inside');
	var menuTop       = this.menu.offset().top;
	var contentHeight = $('#accountContent').outerHeight();
	var visHeight     = $(window).height();

	if ( contentHeight > visHeight ) {
		this.menu.css("height", contentHeight);
	} else {
		this.menu.css("height", visHeight - menuTop );
	}
};

UserAccount.show = function() {
	$('.content').hide();
	$('.menubar li').removeClass('currentIteam');

	this.element.show();
};

UserAccount.controls = function() {
	var bindingFn = this.section;

	this.menu_links = $('#accountNav .accountMenu a');
	if ( this.menu_links.length > 0 ) {

		//Initial section selected (the first link)
		bindingFn(this.menu_links[0], this);

		//Add listener for right-nav
		this.menu_links.bind( 'click', { instance: this }, function(event) {
				bindingFn(this, event.data.instance);
			}
		);

	}
};

UserAccount.section = function( link, instance, link_from_content ) {

	if (link_from_content === undefined || link_from_content === false) {
		instance.menu_links.removeClass('active');
		$(link).addClass('active');
	}

	if ($(link).attr('data-tpl') != undefined)
		instance.setContent( $(link).attr('data-tpl'), instance );

};

UserAccount.setContent = function( tpl, instance ) {

	instance.content.html( parseTemplate(tpl, {
			data: instance.data
		}
	) );
	instance.contentControls( instance );

};

UserAccount.contentControls = function( instance ) {

	instance.content.find('.loadTplBtn').bind( 'click', function(event) {
			instance.section(this, instance, true);
		}
	);

	//Password update listener
	instance.content.find('#updatePasswordBtn').bind( 'click', function(event) {
			instance.updatePwd(instance);
		}
	);

	//Group update listener
	instance.content.find('#updateGroupBtn').bind( 'click', function(event) {
			instance.updateGroup(instance);
		}
	);

	//Time zone update listener
	instance.content.find('#updateTimeZoneBtn').bind( 'click', function(event) {
			instance.updateTimeZone(instance);
		}
	);

	//Unit update listener
	instance.content.find('#updateUnitsBtn').bind( 'click', function(event) {
			instance.updateUnits(instance);
		}
	);

	//Unit update listener
	instance.content.find('#updateTemperatureBtn').bind( 'click', function(event) {
			instance.updateTemperature(instance);
		}
	);

	//Work address update listener
	instance.content.find('#updateWorkAddressBtn').bind( 'click', function(event) {
			instance.updateWorkAddress(instance);
		}
	);

	//Language update listener
	instance.content.find('#updateLanguageBtn').bind( 'click', function(event) {
			instance.updateLanguage(instance);
		}
	);

};

UserAccount.updatePwd = function( instance ) {
	var newPassword        = $('#newPassword').val();
	var newPasswordConfirm = $('#retypePassword').val();

	
	
	var validator=new Validator({
	 newPasswordConfirm: {
        domElement: '#retypePassword',
        validate: function() {
        	return ( $('#newPassword').val() === $('#retypePassword').val() );
        }
      },
	  newPassword: {
        domElement: '#newPassword',
        validate: 'presence'
      },
      retypePassword: {
        domElement: '#retypePassword',
        validate: 'presence'/*,
        tooltip: '.tooltip-alert-meetingSubject'*/
      }
    });
    //client validation
    
    //{"newPasswordConfirm":["The passwords do not match."]}
    //{"actionErrors":[],"fieldErrors":{"exceptionStartTime":["The value of field exceptionStartTime is invalid","exceptionStartTime field is required."],"exceptionStopTime":["The value of field exceptionStopTime is invalid","exceptionStopTime field is required."],"exceptionName":["Supplied value is not valid for field exceptionName."]}}
    var fieldErrors={}
    var clientValidation=true;
    
    
    if ( newPassword != newPasswordConfirm ) {
    	clientValidation=false;
    	fieldErrors["newPasswordConfirm"]=[$.i18n.prop('user.details.passwordsnequal')];
    }
    if ( newPasswordConfirm == '' ) {
    	clientValidation=false;
    	fieldErrors["retypePassword"]=[$.i18n.prop('user.details.retypepasswordrequired')];
    }
    if ( newPassword == '' ) {
    	clientValidation=false;
    	fieldErrors["newPassword"]=[$.i18n.prop('user.details.passwordrequired')];
    }
    if (!clientValidation) {
    	errorsOnDialog(fieldErrors);
    	return;
    }
    
    
    
    /*if ( newPassword == '' ) {
		utils.dialogError({ title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('user.details.passwordrequired') });
		return false;
	}
	if ( newPasswordConfirm == '' ) {
		utils.dialogError({ title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('user.details.retypepasswordrequired') });
		return false;
	}
	if ( newPassword != newPasswordConfirm ) {
		utils.dialogError({ title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('user.details.passwordsnequal') });
		return false;
	}*/
    
    
    
    
    
    
    
	function errorsOnDialog(serverErrors) {
		var el = validator.parseServerErrors(serverErrors);
		$('#send-list-wrapper').empty().append(el);
    	$('#error-view-sendmessage').show();
	}

	$.ajax({
		url: 'changePassword.action',
		type: 'POST',
		cache: false,
		data: {
			newPassword: newPassword,
			newPasswordConfirm: newPasswordConfirm
		},
		success: function(msg) {
			if (checkResponseSuccess(msg,errorsOnDialog)) {
				utils.dialogSuccess(msg.infoMessage);
				instance.section( $('#updatePasswordBtn'), instance, true );
			}
		}
	});
};

UserAccount.updateGroup = function( instance ) {
	$.ajax({
		url: 'json/updateAccountGroup.action',
		method: 'POST',
		cache: false,
		data: {
			groupId: $("#accountGroupDropdown").selectmenu('value')
		},
		success: function(data) {
			if (checkResponseSuccess(data)) {
				instance.data = data;
				utils.dialogSuccess($.i18n.prop('user.msgs.updatedgroup'));
			}
		}
	});
};

UserAccount.updateTimeZone = function( instance ) {
	$.ajax({
		url: 'json/updateAccountTimeZone.action',
		type: 'POST',
		cache: false,
		data: {
			timeZone: $("#accountTimeZoneDropdown").selectmenu('value')
		},
		success: function(data) {
			if (checkResponseSuccess(data)) {
				instance.data = data;
				utils.dialogSuccess($.i18n.prop('user.msgs.updatedtimezone'));
			}
		}
	});
};

UserAccount.updateUnits = function( instance ) {
	$.ajax({
		url: 'json/updateAccountUnit.action',
		method: 'POST',
		cache: false,
		data: {
			unit: $("#accountUnitsDropdown").selectmenu('value')
		},
		success: function(data) {
			if (checkResponseSuccess(data)) {
				instance.data = data;
				utils.dialogSuccess($.i18n.prop('user.msgs.updatedunits'));
			}
		}
	});
};

UserAccount.updateTemperature = function( instance ) {
	$.ajax({
		url: 'json/updateAccountTemperature.action',
		method: 'POST',
		cache: false,
		data: {
			temperature: $("#accountTemperatureDropdown").selectmenu('value')
		},
		success: function(data) {
			if (checkResponseSuccess(data)) {
				instance.data = data;
				utils.dialogSuccess($.i18n.prop('user.msgs.updatedtemperature'));
			}
		}
	});
};

UserAccount.updateWorkAddress = function( instance ) {
	var work_address = $("#accountWorkAddressText").val();
		work_address=$.trim(work_address);
	if ( work_address == '' ) {
		utils.dialogError({ title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('user.workAddress.required') });
		return false;
	}

	$.ajax({
		url: 'json/updateAccountWorkAddress.action',
		method: 'POST',
		cache: false,
		data: {
			workAddress: work_address
		},
		success: function(data) {
			if (checkResponseSuccess(data)) {
				instance.data = data;
				utils.dialogSuccess($.i18n.prop('user.msgs.updatedworkaddress'));
			}
		}
	});
};

UserAccount.updateLanguage = function( instance ) {
	var language = $("#accountLanguageDropdown").selectmenu('value');
	$.ajax({
		url: 'json/updateAccountLanguage.action',
		method: 'POST',
		cache: false,
		data: {
			lang: language
		},
		success: function(data) {
			if (checkResponseSuccess(data)) {
				instance.data = data;
				changeCurrentLanguage(language);
				utils.dialogSuccess($.i18n.prop('user.msgs.updatedlanguage'));
			}
		}
	});
};

function changeCurrentLanguage(language){	
	userLocale = language;
  	localize && localize.init();
  	//localize && localize.mainMenu();
  	localize && localize.routingTemplate();
  	localize && localize.tooltip();
  	localize && localize.mapTabs();
  	localize && localize.newUserDialog();
  	localize && localize.newGroupDialog();
  	localize && localize.routesTab0();
  	localize && localize.newEnterprisePlaceGroupDialog();
  	localize && localize.newPersonalPlaceGroupDialog();
  	localize && localize.itemDetails();
  	localize && localize.newPlaceDialog();
  	localize && localize.newPlaceDialog_tab1();
  	localize && localize.newPlaceDialog_tab2();
  	localize && localize.nearestUserDialogTemplate();
  	localize && localize.apply();
  	localize && localize.privacyStatements();
  	localize && localize.adminPlaceManagement();
  	localize && localize.addTitleForGrid();
  	
	$('#btn_map span').text($.i18n.prop('welcome.Map'));
	$('#btn_messages span').text($.i18n.prop('welcome.Mail') + ' ' + totMailCnt);
	$('#btn_calendar span').text($.i18n.prop('welcome.Calendar'));
	$('#btn_privacy span').text($.i18n.prop('welcome.Privacy'));
	$('#btn_help').text($.i18n.prop('welcome.Help'));
	$('#btn_help').attr('title', $.i18n.prop('welcome.Help'));
	$('#btn_logout').text($.i18n.prop('welcome.Logout'));
	$('#btn_logout').attr('title', $.i18n.prop('welcome.Logout'));
	$('#btn_privacy_terms').text($.i18n.prop('welcome.PrivacyStatement'));
	$('#btn_privacy_terms').attr('title', $.i18n.prop('welcome.PrivacyStatement'));
	$('#btn_privacy_terms').attr('href', '#PrivacyStatements');	
	$('#btn_help').text($.i18n.prop('welcome.Help'));
	$('#btn_help').attr('title', $.i18n.prop('welcome.Help'));
	//$('#btn_help').attr('href', $.i18n.prop('welcome.HelpLink'));	
	$('#btn_admin').text($.i18n.prop('welcome.adminLink'));
	$('#btn_admin').attr('title', $.i18n.prop('welcome.adminLink'));

	
	$('#account #accountContent h1.underline').text($.i18n.prop('welcome.myAccount'));
	$('#account #accountContent h2.no-margin').text($.i18n.prop('user.lang'));
	$('#account #accountContent #updateLanguageBtn span').text($.i18n.prop('buttons.update'));
	$('#account #accountNav .accountMenu li').eq(0).find('a span').text($.i18n.prop('user.menu.details'));
	$('#account #accountNav .accountMenu li').eq(1).find('a span').text($.i18n.prop('user.password'));
	$('#account #accountNav .accountMenu li').eq(2).find('a span').text($.i18n.prop('user.menu.groups'));	
	$('#account #accountNav .accountMenu li').eq(3).find('a span').text($.i18n.prop('user.menu.timezone'));
	$('#account #accountNav .accountMenu li').eq(4).find('a span').text($.i18n.prop('user.Units'));	
	$('#account #accountNav .accountMenu li').eq(5).find('a span').text($.i18n.prop('user.Temperature'));
	$('#account #accountNav .accountMenu li').eq(6).find('a span').text($.i18n.prop('user.WorkAddress'));	
	$('#account #accountNav .accountMenu li').eq(7).find('a span').text($.i18n.prop('user.lang'));	
	
}

function changeAccountInfo(changeDiv, div) {
	showAccountInfo(changeDiv);
	hideAccountInfo(div);
}
function hideAccountInfo(div) {
	$(div).css("display", "none");
}
function showAccountInfo(div) {
	$(div).css("display", "");
}
/*
function updateAccountLanguage() {
	var language = $('#langListId option:selected').val();

	$.ajax({
		url :'updateAccountLanguage.action',
		type :'POST',
		cache :false,
		data :{
			lang :language
		},
		success :function(data) {
			if (checkResponseSuccess(data)) {
				$('#users').html(data);
				jQuery.i18n.properties({
					name :'lbas_locale',
					path :'resources/',
					mode :'map',
					language :language,
					callback :function() {
					}
				});
				userLocale = language;
				$('.lm').each(function(index) {
					var key = $(this).attr('key');

					if ($(this).context.nodeName == 'SELECT' || $(this).context.nodeName == 'select') {

						if (!key) {
							key = $(this).attr('lmkey');
						}
						if (key) {
							var labelsSemicolon = $.i18n.prop(key).split("|");
							var options = $(this).children();
							for ( var i = 0; i < options.length; i++) {
								if (labelsSemicolon[i]) {
									var label = labelsSemicolon[i].split(':')[0];
									$(options[i]).text(label);
								}
							}

						}
					} else {
						$(this).html($.i18n.prop(key));
					}
				});
			}
		}
	});
}*/

function updateAccountBusinessHours() {
	// first validate selected time values
	var from = "";
	var to = "";
	var validationResult = true;
	for ( var x = 0; x < 7; x++) {
		if ($("#accountCheck" + x).attr('checked') == true) {
			from = $("#accountFromHour" + x).val() + ":" + $("#accountFromMinute" + x).val();
			to = $("#accountToHour" + x).val() + ":" + $("#accountToMinute" + x).val();
			validationResult = validateHours(from, to);
			if (!validationResult)
				break;
		}
	}

	if (validationResult) {

		var workingHours = "";

		for ( var x = 0; x < 7; x++) {
			if ($("#accountCheck" + x).attr('checked') == true) {
				workingHours += $("#accountFromHour" + x).val() + ":" + $("#accountFromMinute" + x).val() + "-" + $("#accountToHour" + x).val() + ":"
						+ $("#accountToMinute" + x).val();

				workingHours += "|";
			} else {
				workingHours += "|";
			}
		}

		if (workingHours == "|||||||")
			workingHours = null;

		$.ajax({
			url :'updateAccountBusinessHours.action',
			type :'POST',
			cache :false,
			data :{
				workingHours :workingHours
			},
			success :function(data) {
				if (checkResponseSuccess(data)) {
					$('#users').html(data);
				}
			}
		});
	}
}

function setPredefinedAccountValue(divname, text) {
	$("#" + divname + " option").each(function() {
		if (text == this.text) {
			$("#" + divname).val(this.value);
		}
	});
}