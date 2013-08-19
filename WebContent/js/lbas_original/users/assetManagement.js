var AssetManagement = AdminList.extend({
	options: {
		url:        'json/listAssets.action',
		urlSearch:  'json/searchAssets.action',
		total:      'admin.list.assetsFound',
		deleteText: $.i18n.prop('admin.delete.asset.confirm'),
		deleteUrl:  'json/deleteAsset.action',
		exportUrl:  'exportAsset.action',
		entityName: 'assets',
		importTitle:'admin.list.importAssets'
	},

	listStruct: function( instance ) {
		return instance.data.assetList;
	},

	actionsDropdown: function( instance ) {
		instance._super(instance);
		
		$('<option value="import">' + $.i18n.prop('admin.list.Import') + '</option>').prependTo( $('.no-selected .actions-list') );
		$('<option value="add asset">' + $.i18n.prop('admin.list.AddAsset') + '</option>').prependTo( $('.no-selected .actions-list') );
		
		$('<option value="delete">' + $.i18n.prop('buttons.delete') + '</option>').prependTo( $('.for-selected .actions-list') );
		
	},

	list: function( instance ) {
		this._super(instance);
		var sampleRow = $('.' + instance.wrapClass).find('.sample-row');
		$('.list-content tbody tr:not(.sample-row)').remove();
		$(instance.data.assetList).each(function(key, data) {
			var row = sampleRow.clone().removeClass('sample-row');
			if ( (key % 2) == 0 )
				row.addClass('odd');
  			row.find('input[type="checkbox"]').val( key );
  			row.find('input[name="id"]').val( data.user_id );
  			row.find('.name').html( data.name );
  			row.find('.group').html( data.groupName );
  			row.find('.id-number').html( data.identificationNumber );
  			row.find('.allocated-to').html( Encoder.htmlDecode(data.allocatedToFullName));
  			row.find('.status').html( data.active ? $.i18n.prop('admin.list.active') : $.i18n.prop('admin.list.inactive') );
  			row.find('.model').html( data.surname );
  			row.find('.mobile-no').html( data.msisdn );
  			row.insertBefore(sampleRow);
		});

		// Fill in the list of groups
		$.ajax({
			url: 'listGroups.action',
			type: 'POST',
			cache: false,
			data: {
				includeAssetGroups: true,
				includeUserDetails: false
			},
			success: function(data) {
				if (checkResponseSuccess(data)) {
					utils.closeDialog();
					var select = $('<select></select>').addClass('assetGroupsListDropdown');
					$(data.userGroups).each(function(key, group) {
						var option = $('<option></option>')
							.attr('value', group.id)
							.html(group.name)
							.appendTo(select);
					});
					$('.asset-group-form-block select, .asset-group-form-block span').remove();
					select.insertBefore( $('.asset-group-form-block a') );
					setAdminLineHeight();
				}
			}
		});

		// The list of cdf in new asset's form
		$.ajax({
			url: 'json/editOwnCompany.action',
			type: 'POST',
			cache: false,
			success: function(data) {
				var tbody = $('.cdf-asset-edit-tbody');
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
			case 'add asset':
					$.ajax({
						url: 'assetPreCreate.action',
						type: 'POST',
						cache: false,
						success: function(data) {
							if (checkResponseSuccess(data))
								instance.assetDialog(instance, data, 'assetEdit.newAsset');
						}
					});

				break;
			default: break;
		}
	},

	assetDialog: function(instance, data, title) {
		utils.closeDialog();
		var btns = {},
			content = $('<div></div>').html(parseTemplate('adminEditAsset', { json: data }));
  		// Creation of the overlay
  		utils && utils.dialog({
  			title: $.i18n.prop(title),
  			content: content.html(),
  			buttons: btns,
  			css: 'addExcpPos'
  		});
		var dialogWidth = $('.ui-dialog').outerWidth(),
			dialog = $('.ui-dialog');
  		dialog.css({
  			'top': '100px',
  			'margin-left': -(545/2),
  			'width':'545px',
  			'left':'50%'
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

		dialog.find('select').selectmenu();
        $('#permanentPeriodicTrackingFrequency-menu').css({'overflow-y':'auto' , 'height':120});
        if( $('#permanentPeriodicTracking').is(':checked')) {
			$("#permanentPeriodicTrackingFrequency-button").show();
		} else {
			$("#permanentPeriodicTrackingFrequency-button").hide();
		}
		$('#permanentPeriodicTracking').click(function() {
			if( $(this).is(':checked')) {
				$("#permanentPeriodicTrackingFrequency-button").show();
			} else {
				$("#permanentPeriodicTrackingFrequency-button").hide();
			}
		});
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
					retrieveAssets :false
				}, function(data) {
					response($.map(data.resultList, function(item) {
						return {
							label : Encoder.htmlDecode(item.name),
							value : Encoder.htmlDecode(item.name),
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

	},

	sendAddNew: function(instance, dialog) {
	  

		if (lbasValidate('saveAsset')) {
		
			var isItFull= dialog.find('input[name="lbasAsset.allocatedToFullName"]').val();
				if(isItFull === ''){
					dialog.find('#saveAsset input[name="lbasAsset.allocatedTo"]').val('');
				}
			
			var serializedFormData = dialog.find('#saveAsset').serialize(),
				allocatedTo        = dialog.find('input[name="lbasAsset.allocatedTo"]').val(),
				lbasAssetId        = dialog.find('input[name="lbasAsset.user_id"]').val(),
				paramUrl           = '';
				
				serializedFormData += '&frequency='+ $('#permanentPeriodicTrackingFrequency').selectmenu('value') +'&tracking='+$('#permanentPeriodicTracking').is(':checked');		
				

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

      var validator=new Validator({
       "lbasAsset.name": {
        domElement: '[name="lbasAsset.name"]',
             validate: 'presence'
         },
         "lbasAsset.surname": {
        domElement: '[name="lbasAsset.surname"]',
             validate: 'presence'
         },
         "selectedGroup": {
        domElement: '#saveAsset_selectedGroup-button',
             validate: 'presence'
         },
         "lbasAsset.allocatedToFullName": {
        domElement: '#allocatedToFullName',
             validate: 'presence'
         },
         "lbasAsset.allocatedToNotFound": {
        domElement: '#allocatedToFullName',
             validate: 'presence'
         }
        });
       function errorsOnDialog(serverErrors) {

         if(serverErrors.errorText && serverErrors.errorText.indexOf("allocatedToNotFound") != -1) {
           //exception
           var txt=serverErrors.errorText;
           serverErrors= {};
           serverErrors["lbasAsset.allocatedToNotFound"]=[txt];
           
           
         }
         
         
         
        var el = validator.parseServerErrors(serverErrors);
        $('#error-view-asset > div.content-cell >span','#dialog').html($.i18n.prop('error.send.title'));
        $('#error-view-asset > div > ul','#dialog').empty().append(el);
        $('#error-view-asset','#dialog').show();
      }

			$.ajax({
				type: 'POST',
				url: paramUrl,
				data: serializedFormData,
				dataType: 'json',
				success: function(json) {
					if (checkResponseSuccess(json, errorsOnDialog)) {
						utils.closeDialog();
						utils.dialogSuccess(json.message);
						instance.start( instance );
						refreshAssets();
					}
				}
			});
		}
	},

	update: function( instance, btn ) {
		$.ajax({
			url: 'editAsset.action',
			type: 'POST',
			cache: false,
			data: { id: btn.closest('tr').find('input[name="id"]').val() },
			success: function(data) {
				if (checkResponseSuccess(data))
					instance.assetDialog(instance, data, 'assetEdit.editAsset');
			}
		});
	}
});