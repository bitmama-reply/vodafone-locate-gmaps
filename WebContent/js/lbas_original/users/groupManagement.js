var GroupManagement = AdminList.extend({
	options: {
		url:        'json/listGroupsOfCompany.action',
		urlSearch:  'json/searchGroups.action',
		total:      'admin.list.groupsFound',
		deleteText: $.i18n.prop('admin.delete.group.confirm'),
		deleteUrl:  'json/deleteGroup.action'
	},

	listStruct: function( instance ) {
		return instance.data.groups;
		
	},

	actionsDropdown: function( instance ) {
		instance._super(instance);
		$([ 'admin.list.AddGroup' , 'admin.list.AddGroupAsset']).each(function(key, value){
			$('<option value="' + $.i18n.prop(value).toLowerCase() + '">' + $.i18n.prop(value) + '</option>').prependTo( $('.no-selected .actions-list') );
		});

		$([ 'buttons.delete', 'admin.list.group.activate', 'admin.list.group.disable' ]).each(function(key, value){
			$('<option value="' + $.i18n.prop(value).toLowerCase() + '">' + $.i18n.prop(value) + '</option>').prependTo( $('.for-selected .actions-list') );
		});
	},
	afterApplyAction: function( instance, action ) {
		switch(action) {
			case $.i18n.prop('admin.list.AddGroup').toLowerCase()://'add user group'
					createNewGroupOvl(instance);
				break;
			case $.i18n.prop('admin.list.AddGroupAsset').toLowerCase()://'add asset group'
					createNewGroupOvl(instance, $(this).closest('.asset-group-form-block').find('select'), true);
				break;

			case 'disable':
			case 'activate':

					var infoText = 'admin.deactivate.group.confirm',
						title    = 'admin.deactivate.user.title',
						btns     = {},
						groups   = [],
						checked  = instance.checkedRecords( instance ),
						status   = 0,
						statText = 'admin.list.inactive';

					if (action != 'disable') {
						status = 1;
						statText = 'admin.list.active';
						infoText = 'admin.activate.group.confirm';
						title    = 'admin.activate.user.title';
					}

					btns[$.i18n.prop('buttons.cancel')] = function() {
						$(this).dialog('close');
						$(this).dialog('destroy');
					};

					btns[$.i18n.prop('buttons.ok')] = function() {
						checked.each(function(key){
							groups.push($(this).next().val());
						});
						$.ajax({
							type: 'POST',
							url: 'json/activateGroups.action',
							data: {
								activate: status,
								selectedGroupList: groups
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
			default: break;
		}
	},

	update: function( instance, btn ) {
		$.ajax({
			url: 'editGroup.action',
			type: 'POST',
			cache: false,
			data: { groupId: btn.closest('tr').find('input[name="id"]').val() },
			success: function(data) {
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
					if(data.lbasGroup.assetGroup){
						$('.tabs-wrapper .tabs li').eq(2).hide();
					}
					dialog.find('.cancel-button').click(function(e){
						e.preventDefault();
						utils.closeDialog();
					});
					dialog.find('.send-button').click(function(e){
						e.preventDefault();
						instance.sendUpdate( instance, dialog, data );
					});
					dialog.find('form').submit(function(e){
						e.preventDefault();
						instance.sendUpdate( instance, dialog, data );
					});

					dialog.find("#groupMemberUserSearch").autocomplete({
          minLength: 0,
          source: function(request, response){
            dialog.find("select[id='selected'] option").show();
            var $sel=dialog.find("select[id='selected']");
            var term=request.term.toLowerCase();
            $.each(data.userMap, function(i, k){
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
					dialog.find('input[type="checkbox"]').click(function(){
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
		});
	},

	sendUpdate: function( instance, dialog, data ) {
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
			instance.AjxUpdateGroup(instance, dialog);
		} else {
			var confirmText = $.i18n.prop('groupMembers.confirm.changeGroup'),
				btns = {};

			btns[$.i18n.prop('buttons.cancel')] = function() {
				$(this).dialog('close');
				$(this).dialog('destroy');
			};
			btns[$.i18n.prop('buttons.ok')] = function() {
				instance.AjxUpdateGroup(instance, dialog);
				$(this).dialog('close');
				$(this).dialog('destroy');
			};

			utils && utils.dialog({title: $.i18n.prop('buttons.confirm'), content: confirmText, buttons: btns});
		}
	},


	AjxUpdateGroup: function(instance, dialog){
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
				instance.start( instance );
			}
		};

		utils && utils.lbasDoPost('updateGroup.action', options);
	},

	list: function( instance ) {
		
		this._super(instance);
		var sampleRow = $('.' + instance.wrapClass).find('.sample-row');
		$('.list-content tbody tr:not(.sample-row)').remove();
		$(instance.data.groups).each(function(key, data) {
			var row = sampleRow.clone().removeClass('sample-row');
			if ( (key % 2) == 0 )
				row.addClass('odd');

			row.find('input[type="checkbox"]').val( key );
			row.find('input[name="id"]').val( data.id );
			row.find('.name').html( data.name );
			row.find('.status').html( data.active ? $.i18n.prop('admin.list.active') : $.i18n.prop('admin.list.inactive') );
			if (data.defaultGroup){
				row.find('.actions .btn-delete').css('visibility','hidden');
			}
			row.insertBefore(sampleRow);
		
		return;
		});
	
	}
});