var UsersManagement = AdminList.extend({
	options: {
		url:        'json/listUsers.action',
		urlSearch:  'json/searchUsers.action',
		total:      'admin.list.usersFound',
		deleteText: $.i18n.prop('admin.delete.user.confirm'),
		deleteUrl:  'json/deleteUser.action',
		exportUrl:  'exportUser.action',
		entityName: 'users',
		importTitle:'admin.list.importUsers'
	},

	actionsDropdown: function( instance ) {
		instance._super(instance);
		
		$('<option value="import">' + $.i18n.prop('admin.list.Import') + '</option>').prependTo( $('.no-selected .actions-list') );
		$('<option value="add user">' + $.i18n.prop('admin.list.AddUser') + '</option>').prependTo( $('.no-selected .actions-list') );
		
		$('<option value="delete">' + $.i18n.prop('buttons.delete') + '</option>').prependTo( $('.for-selected .actions-list') );
		$('<option value="message">' + $.i18n.prop('messages.message') + '</option>').prependTo( $('.for-selected .actions-list') );
		$('<option value="move to group">' + $.i18n.prop('user.moveToNewGroup') + '</option>').prependTo( $('.for-selected .actions-list') );
		$('<option value="activate users">' + $.i18n.prop('admin.list.activateUsers') + '</option>').prependTo( $('.for-selected .actions-list') );
		$('<option value="disable users">' + $.i18n.prop('admin.list.disableUsers') + '</option>').prependTo( $('.for-selected .actions-list') );

	},

	list: function( instance ) {
		this._super( instance );
		var sampleRow = $('.' + instance.wrapClass).find('.sample-row');
		$('.list-content tbody tr:not(.sample-row)').remove();
		$(instance.data.userList).each(function(key, user) {
			var row = sampleRow.clone().removeClass('sample-row');
			if ( (key % 2) == 0 ) row.addClass('odd');
			var optInState = [ 'locationRequests.pending', 'locationRequests.accepted', 'locationRequests.denied' ];
			row.find('input[type="checkbox"]').val( key );
			row.find('input[name="id"]').val( user.user_id );
			row.find('.name').html( user.fullName );
			row.find('.email').html( user.email );
			row.find('.msisdn').html( user.msisdn );
			row.find('.status').html( user.active ? $.i18n.prop('admin.list.active') : $.i18n.prop('admin.list.inactive') );
			row.find('.status').addClass((user.role_id==1) ? "isCompanyAdmin" : "");
			row.find('.option-status').html( $.i18n.prop(optInState[user.optInState]) );
			row.insertBefore(sampleRow);
		});
		$('.isCompanyAdmin').siblings('.actions').children('.btn-delete').css('visibility','hidden');
		/* $('#admin #adminContent table.list-content .sample-row').remove(); */
		/*  Fill in the list of groups */
		$.ajax({
			url: 'listGroups.action',
			type: 'POST',
			cache: false,
			data: {
				includeAssetGroups: false,
				includeUserDetails: false
			},
			success: function(data) {
				if (checkResponseSuccess(data)) {
					utils.closeDialog();
					var select = $('<select></select>').addClass('userGroupsListDropdown'),
						selectMove = $('<select></select>').addClass('usersMoveToGroupDropdown');
					$(data.userGroups).each(function(key, group) {
						var option = $('<option></option>')
							.attr('value', group.id)
							.html(group.name)
							.appendTo(select);
						var optionMove = $('<option></option>')
							.attr('value', group.id)
							.html(group.name)
							.appendTo(selectMove);
					});
					$('.userGroupsList select, .userGroupsList span').remove();
					select.insertAfter( $('.userGroupsList h4') );

					$('.selected-user-togroup').html('');
					$('.selected-user-togroup').append(selectMove);
					setAdminLineHeight();
				}
			}
		});

		// The list of cdf in new user's form
		$.ajax({
			url: 'json/editOwnCompany.action',
			type: 'POST',
			cache: false,
			success: function(data) {
				var tbody = $('.cdf-user-edit-tbody');
				tbody.html('');
				$(data.cdfList).each(function(index, cdf){
					var row = $('<tr></tr>');
					var th = $('<th>' + cdf.name + '</th>').appendTo(row);
					var td = $('<td><input class="graphic-input" type="text" name="cdf-' + cdf.id + '" value="" /></td>').appendTo(row);
					row.appendTo(tbody);
				});
			}
		});
		
	},

	afterApplyAction: function( instance, action ) {
		switch(action) {
			case 'add user':
			console.log('add user');
					$.ajax({
						url: 'userPreCreate.action',
						type: 'POST',
						cache: false,
						success: function(data) {
						  
							if (checkResponseSuccess(data)) {
								utils.closeDialog();
								preUserModelMap = data.preUserModelMap;
								
								var btns = {}, content = $('<div></div>').html(parseTemplate('adminEditUser', { json: data }));
								// Creation of the overlay
								utils && utils.dialog({
									title: $.i18n.prop('userList.NewUser'),
									content: content.html(),
									buttons: btns,
									css: 'noClose addExcpPos'
								});
								var dialogWidth = $('.ui-dialog').outerWidth(), dialog = $('.ui-dialog');
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
									instance.sendAddNew( instance, dialog, data );
								});
								dialog.find('form').submit(function(e){
									e.preventDefault();
									instance.sendAddNew( instance, dialog, data );
								});

								dialog.find('input[type="checkbox"]').change(function(e){
									e.preventDefault();
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
                     selectedPreUserChanged($('#userEditMobile').get(0));
                   } else {
                	 setUserRightsBasedOnGroupAndPreUserModelMap(document.getElementById('saveUser_selectedGroup'), $('#userEditMobile').get(0));
                  }
                 }
								//selectedPreUserChanged($('#userEditMobile').get(0));
								
							}
						}
					});

				break;
			case 'move to group':
					utils.closeDialog();

					var users    = [],
						users_id = [],
						btns     = {},
						content  = $('.move-to-group-form'),
						checked  = instance.checkedRecords( instance );

					if (checked === false) {
						utils.dialogError({ title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('admin.list.selectData') });
						return false;
					}
					checked.each(function(key){
						users_id.push($(this).next().val());
						users.push($(this).closest('tr').find('.name').html() + ' : ' + $(this).closest('tr').find('.email').html());
					});

					// Creation of the overlay
					utils && utils.dialog({
						title: $.i18n.prop('user.moveToNewGroup'),
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
					dialog.find('.selected-user-info').html( users.join(' ; ') );
					dialog.find('.usersMoveToGroupDropdown').selectmenu();
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
								checked.each(function(key){
									instance.data.userList[$(this).val()].group_id = group_id;
								});
							}
						});
					});
				break;
			case 'disable users':
			case 'activate users':
					var infoText = 'admin.deactivate.user.confirm',
						title    = 'admin.deactivate.user.title',
						btns     = {},
						users   = [],
						checked  = instance.checkedRecords( instance ),
						status   = 0,
						statText = 'admin.list.inactive',
						url = 'deActivateUsers.action';

					if (action != 'disable users') {
						url = 'activateUsers.action';
						status = 1;
						statText = 'admin.list.active';
						infoText = 'admin.activate.user.confirm';
						title    = 'admin.activate.user.title';
					}

					btns[$.i18n.prop('buttons.cancel')] = function() {
						$(this).dialog('close');
						$(this).dialog('destroy');
					};

					btns[$.i18n.prop('buttons.ok')] = function() {
						checked.each(function(key){
							users.push($(this).next().val());
						});
						$.ajax({
							type: 'POST',
							url: url,
							data: {
								selectedUserList: users
							},
							async: false
						});
						checked.each(function(key){
							$(this).closest('tr').find('.status').html( $.i18n.prop( statText ));
						});
						$(this).dialog('close');
						$(this).dialog('destroy');
					};

					utils && utils.dialog({ title: $.i18n.prop(title), content: $.i18n.prop(infoText), buttons: btns });
					return;
				break;
			case 'message':
					var users   = [],
						checked = instance.checkedRecords( instance ),
						content = parseTemplate('userSendMessage', {}),
						btns    = {};//composeMessageDialogManager.getSendButtons();

					checked.each(function(key){
						users.push({
							id: 'u' + $(this).next().val(),
							name: $.trim(instance.data.userList[$(this).val()].fullName)
						});
					});
					utils && utils.dialog({
						title: $.i18n.prop('messages.send.message'),
						content: content,
						buttons: btns,
						css:'userSendMessage'
					});
					composeMessageDialogManager.initSendMessageForm(users, 'resultList', -1);
					return;
				break;
			default: break;
		}
	},

	sendAddNew: function( instance, dialog, data ) {

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
					instance.start( instance );
				}
			};
			utils && utils.lbasDoPost(paramUrl, options);
		}
	},

	update: function( instance, btn ) {
		$.ajax({
			url: 'editUser.action',
			type: 'POST',
			cache: false,
			data: { id: btn.closest('tr').find('input[name="id"]').val() },
			success: function(data) {
				if (checkResponseSuccess(data)) {
					var key  = btn.closest('tr').find('input[type="checkbox"]').val(),
						user = instance.data.userList[key],
						btns = {};
						content = $('<div></div>').html(parseTemplate('adminEditUser', { json: data }));
					utils.closeDialog();

					// Creation of the overlay
					utils && utils.dialog({
						title: $.i18n.prop('user.actionList.9'),
						content: content.html(),
						buttons: btns,
						css: 'noClose addExcpPos editUser'
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
						instance.sendAddNew( instance, dialog, data );
					});
					dialog.find('form').submit(function(e){
						e.preventDefault();
						instance.sendAddNew( instance, dialog, data );
					});
					dialog.find('input[type="checkbox"]').change(function(e){
						/*e.preventDefault();*/
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
	},

	prepareModelToUpdate: function(user) {
		var params = {};
		$.each(user, function(key, value) {
			params['lbasUser.' + key] = value;
		});
		return params;
	},

	saveUpdate: function(instance, dialog, user) {
		user.name = dialog.find('input[name="user-name"]').val();
		user.surname = dialog.find('input[name="user-surname"]').val();
		user.email = dialog.find('input[name="user-email"]').val();
		user.agpsEnabled = dialog.find('input[name="agpsEnabled"]').prop('checked');
		user.smsInterfaceEnabled = dialog.find('input[name="smsInterfaceEnabled"]').prop('checked');

		var params = instance.prepareModelToUpdate(user);
		dialog.find('.checkboxes-permissions-list input[type="checkbox"]').each(function(index){
			params['lbasUser.' + $(this).attr('name')] = $(this).prop('checked');
		});
		params['lbasUser.customDataFields'] = '';//'{0:{companyId:0,desc:"",id:1,name:"company name",value:"asd"}}';
		params['selectedGroup'] = dialog.find('.userGroupsListDropdown').selectmenu('value');
		$.ajax({
			url: 'updateUser.action',
			type: 'POST',
			cache: false,
			data: params,
			success: function(data) {
				if (checkResponseSuccess(data)) {
					utils.closeDialog();
					utils.dialogSuccess(data.message);
					instance.start( instance );
				}
			}
		});
	},

	popupNewPassword: function(instance, user) {
		var infoText = $.i18n.prop('confirmation.resetpassword'),
			btns     = {};

		btns[$.i18n.prop('buttons.cancel')] = function() {
			$(this).dialog('close');
			$(this).dialog('destroy');
		};
		btns[$.i18n.prop('buttons.ok')] = function() {
			$.ajax({
				url: 'renewPassword.action',
				type: 'POST',
				cache: false,
				data: { userId: user.user_id },
				success: function(data) {
					if (checkResponseSuccess(data))
						utils.dialogSuccess(data.infoMessage);
				}
			});
			$(this).dialog('close');
			$(this).dialog('destroy');
		};

		utils && utils.dialog({ title: $.i18n.prop('password'), content: infoText, buttons: btns });
	}
});