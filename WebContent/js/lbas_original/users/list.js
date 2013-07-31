function createNewGroupOvl(instance, selectToUpdate, fromNewAsset) {
  
  var validator=new Validator({
      "lbasGroup.name": {
        domElement: '#dialog #lbasGroup\\.name',
        validate: 'presence'
      }
  });
  function errorsOnDialog(serverErrors) {
    var el = validator.parseServerErrors(serverErrors);
    $('#error-view-group > div.content-cell >span').html($.i18n.prop('error.send.title'));
    $('#error-view-group > div > ul').empty().append(el);
    $('#error-view-group').show();
  }
  
  
	var fromNewAsset = fromNewAsset;
	var callAssets;
	
	if(fromNewAsset){
		callAssets = '?isNewUserpage=2';
	}else{
		callAssets = '';
	}
	$.ajax({
		url: 'groupPreCreate.action'+callAssets,
		type: 'POST',
		cache: false,
		success: function(data) {

			if (checkResponseSuccess(data, errorsOnDialog)) {
				if($('#adminEditGroup').length===1){

					$('#adminEditGroup').empty().remove();
				}
				var btns = {},
					content = $('<div id="adminEditGroup"></div>').html(parseTemplate('adminEditGroup', { json: data })),
					options = {
						'top': '250px',
						'width':'545px',
						'left':'50%'
					};


				// Creation of the overlay
				utils && utils.dialog({
					title: $.i18n.prop('groupList.NewGroup'),
					content: content,//.html(),
					buttons: btns,
					css: 'newGroupOvl noClose addExcpPos'
				});
				var dialogWidth = $('.ui-dialog').outerWidth(),
					dialog = $('.ui-dialog.newGroupOvl');
				if (instance != undefined && instance !== false)
					options['margin-left'] = -dialogWidth/2;
				dialog.css(options);
				dialog.find('.cancel-button').click(function(e){
					e.preventDefault();
					dialog.remove();
				});
				dialog.find('.send-button').click(function(e){
					e.preventDefault();
					if ($('#available option').length > 0){
						var btns = {};
						btns[$.i18n.prop('buttons.cancel')] = function() {
							$(this).dialog('close');
						};
						btns[$.i18n.prop('buttons.ok')] = function() {
							$(this).dialog('close');
							sendAddNewGroup( dialog, instance, selectToUpdate, fromNewAsset );
						};
							
						utils && utils.dialog({
							title : $.i18n.prop('groupMembers.GroupMembers'),
							content: $.i18n.prop('groupMembers.confirm.changeGroup'),
							buttons : btns,
							css: 'confirmation noClose'
						});

					}else{
						sendAddNewGroup( dialog, instance, selectToUpdate, fromNewAsset );
					}
				});
				dialog.find('form').submit(function(e){
					e.preventDefault();
					sendAddNewGroup( dialog, instance, selectToUpdate );
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
		                 $sel.append($e)
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
		                  $sel.append($e);
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
				
				if(fromNewAsset){
					$('.newGroupOvl .tabs-wrapper .tabs li').eq(2).hide();
				}
			}
		}
	});
}

function sendAddNewGroup(dialog, instance, selectToUpdate, fromNewAsset) {
	var validator=new Validator({
			"lbasGroup.name": {
				domElement: '#dialog #lbasGroup\\.name',
				validate: 'presence'
			}
	});
	function errorsOnDialog(serverErrors) {
		var el = validator.parseServerErrors(serverErrors);
		$('#error-view-group > div.content-cell >span').html($.i18n.prop('error.send.title'));
		$('#error-view-group > div > ul').empty().append(el);
		$('#error-view-group').show();
	}
	
	
	
	if (lbasValidate('updateGroupName')) {
		var serializedFormData = '',
			options = {};

		if (dialog.find('#updateGroupPermissions').length > 0) {
			dialog.find("#updateGroupPermissions input:checkbox").each( function() {
				serializedFormData += '&' + $(this).attr('name') + '=' + $(this).is(':checked');
			});
		}

		if (dialog.find('#updateGroupName').length > 0)
			serializedFormData += '&' + dialog.find('#updateGroupName').serialize();

		if (dialog.find('#updateGroupMembers').length > 0) {
			dialog.find('#updateGroupMembers select option').removeAttr('selected');
			dialog.find('#updateGroupMembers select[id=available] option').attr('selected', 'selected');
			serializedFormData += '&' + dialog.find('#updateGroupMembers').serialize();
		}

		if (dialog.find('#groupAdmin').length > 0)
			serializedFormData += '&' + dialog.find('#groupAdmin').serialize();
			if( fromNewAsset){
				serializedFormData += '&lbasGroup.assetGroup=true'
			}

		options.data = serializedFormData;
		options.success =  function(json) {
			if (checkResponseSuccess(json,errorsOnDialog)) {
				dialog.remove();
				if (selectToUpdate != undefined) {
					var option = $('<option value="' + json.group.id + '">' + json.group.name + '</option>');
					option.appendTo(selectToUpdate);
					selectToUpdate.selectmenu();
					selectToUpdate.selectmenu('value', json.group.id);
				}

				if (instance != undefined && instance !== false) {
					utils.dialogSuccess(json.message);
					instance.start( instance );
				}
				$('.addExcpPos .tabs-wrapper .tabs li').eq(1).click();
			}
		};

		utils && utils.lbasDoPost('json/addNewGroup.action', options);
	}
}

var AdminList = Class.extend({
	page: 1,
	rows: 25,
	selectmenu: false,
	columnListeners: false,
	options: {
		url: '',
		urlSearch: '',
		deleteText: '',
		deleteUrl: '',
		exportUrl: ''
	},
	wrapClass: '',
	init: function( instance, options ) {
		if (instance == undefined)
			var instance = this;
		if (options != undefined)
			this.options = $.merge(this.options, options);

		this.start( instance );
	},

	start: function( instance, sortColumn, sortType ) {
		var options = {
			page: instance.page,
			rows: instance.rows
		};
		if (sortColumn != undefined)
			options.sortColumn = sortColumn;
		if (sortType != undefined)
			options.sortType = sortType;
		$.ajax({
			url: instance.options.url,
			type: 'POST',
			cache: false,
			data: options,
			success: function(data) {
				if (checkResponseSuccess(data)) {

					instance.render( instance, data );
				}
			}
		});
	},

	render: function( instance, data ) {
		instance.data = data;
		instance.toolbar( instance );
		instance.list( instance );
		instance.afterListCreated( instance );
	},

	search: function( instance, text ) {
		if ( text == '' ) {
			instance.start( instance );
			return;
		}

		$.ajax({
			url: instance.options.urlSearch,
			type: 'POST',
			cache: false,
			data: {
				searchText: text
			},
			success: function(data) {
				if (checkResponseSuccess(data)) {
					instance.render( instance, data );
				}
			}
		});
	},

	toolbar: function( instance ) {
		// Operations to do only while opening the page
		if ( !instance.selectmenu ) {
			instance.actionsDropdown( instance );
			var actionsList = $('.' + instance.wrapClass).find('.actions-list');
			actionsList.selectmenu();
			actionsList.selectmenu('index', 0);
			$('.actions-list-box').css('display', 'block');
			instance.selectmenu = true;

			// Listener for the search
			$('#adminContent .search').keypress(function(e){
				var code = e.keyCode ? e.keyCode : e.which;
				if (code == 13)
					instance.search( instance, $(this).val() );
			});
			$('#adminContent .searchMagnifier').click(function(e){
				e.preventDefault();
				instance.search( instance, $(this).prev().val() );
			});

			// Check actions from the toolbar
			$('#adminContent .toolbar-apply').click(function(e){
				e.preventDefault();
				instance.applyAction( instance, $(this) );
			});

		}

		var from  = ((instance.page - 1) * instance.rows) + 1,
			to    = from + instance.listStruct(instance).length - 1;

		if ( to < from )
			from = to;

		$('.list-count').html( $.i18n.prop( instance.options.total, instance.data.totalRecords, from, to ) );
		instance.pages = Math.ceil(instance.data.totalRecords / instance.rows);

		if ( instance.pages < 2 ) {
			$('.list-paging').html('');
			return false;
		}

		var pager = $('<ul></ul>');
		for (var xx = 1; xx <= instance.pages; xx++)
			$('<li ' + ((xx == instance.page) ? 'class="active"' : '') + '>' + xx + '</li>').click(function(e){
				e.preventDefault();
				instance.page = $(this).html();
				instance.init();
			}).appendTo(pager);

		if (instance.pages > 1) {
			$('<li class="icon prev ' + ((instance.page == 1) ? 'inactive' : '') + '"></li>').click(function(e){
				e.preventDefault();
				if (instance.page == 1)
					return false;

				instance.page--;
				instance.init();
			}).prependTo(pager);
			$('<li class="icon first ' + ((instance.page == 1) ? 'inactive' : '') + '"></li>').click(function(e){
				e.preventDefault();
				if (instance.page == 1)
					return false;

				instance.page = 1;
				instance.init();
			}).prependTo(pager);
			$('<li class="icon next ' + ((instance.page == instance.pages) ? 'inactive' : '') + '"></li>').click(function(e){
				e.preventDefault();
				if (instance.page == instance.pages)
					return false;

				instance.page++;
				instance.init();
			}).appendTo(pager);
			$('<li class="icon last ' + ((instance.page == instance.pages) ? 'inactive' : '') + '"></li>').click(function(e){
				e.preventDefault();
				if (instance.page == instance.pages)
					return false;

				instance.page = instance.pages;
				instance.init();
			}).appendTo(pager);
		}

		$('.list-paging').html( pager );
	},

	actionsDropdown: function() {

	},

	applyAction: function( instance, btn ) {
		var action = $('.' + instance.wrapClass).find('.actions-list-wrapper.viewed .actions-list').selectmenu('value');
		switch (action) {
			case 'import':
					utils.closeDialog();
					var btns = {};
					var content = $('.import-form');

					// Creation of the overlay
					utils && utils.dialog({
						title: $.i18n.prop(instance.options.importTitle),
						content: content.html(),
						buttons: btns,
						css: 'addExcpPos'
					});
					var dialogWidth = $('.ui-dialog').outerWidth();
					var dialog = $('.ui-dialog');
					dialog.css({
						'top': '250px',
						'margin-left': -dialogWidth/2,
						'width':'545px',
						'left':'50%'
					});
					dialog.find('input[name="uploadObj"]').fileinput();
					dialog.find('.upload-button').click(function(e){
						e.preventDefault();
						var form = $(this).closest('form');
						var isThereFile = form.find('.fileinput-input').text();
						if(isThereFile == ''){
						utils.dialogError({ title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('upload.error.message') });
							return false;
						}
						form.ajaxSubmit({
						type:'POST',
							dataType: 'json',
							success: function(data) {
								if (data.errorText != undefined && data.errorText != '')
									utils.dialogError({ title: $.i18n.prop('dialog.title.error'), content: data.errorText });
								else {
									var txt =(data.uploadStatusMessage != undefined && data.uploadStatusMessage != '') ? data.uploadStatusMessage : $.i18n.prop('info.upload.success');
					                  utils.closeDialog();
					                  utils.dialogSuccess(txt);
									instance.start( instance );
								}
							}
						});
					});
					return;
				break;

			case 'delete':
				utils.closeDialog();
				var content = $('<div class="clearfix"><p style="margin-bottom:20px;">' + instance.options.deleteText + '</p></div>');         
				$('<a href="#" class="graphicBtn violet right"><span>' + $.i18n.prop('buttons.ok') + '</span></a>').click(function(e){
						e.preventDefault();
						var checked = instance.checkedRecords( instance );
						if (checked === false) {
							utils.dialogError({ title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('admin.list.selectData') });
							return false;
						}
	
						checked.each(function(key){
							$.ajax({
								type: 'POST',
								url: instance.options.deleteUrl,
								data: { id: $(this).next().val() },
								async: false
							});
						});
						utils.closeDialog();
						$('.actions-list-wrapper.no-selected').addClass('viewed');
						$('.actions-list-wrapper.for-selected').removeClass('viewed');						
						utils.dialogSuccess($.i18n.prop('info.delete'));
						instance.start( instance );
						refreshAssets();
			}).appendTo(content);

			$('<a href="#" class="graphicBtn little right"><span>' + $.i18n.prop('buttons.cancel') + '</span></a>').click(function(e) {
				e.preventDefault();
				utils.closeDialog();
			}).appendTo(content);

			utils && utils.dialog({
				title: $.i18n.prop('buttons.delete'),
				content: content,
				buttons: { },
				css: 'noClose'
			});

					return;
				break;
			case 'xls':
			case 'csv':
			case 'xml':
			case 'pdf':	
					var ids = [];
					var checked = instance.checkedRecords( instance );

					if (checked == ''){
						utils && utils.dialog({
							title : $.i18n.prop('dialog.error') ,
							content : $.i18n.prop('dialog.errormessage.user.noselected'),
							css: 'noClose'
						});
						return false;
					}

					if (checked !== false){
						checked.each(function(key){
							ids.push( $(this).next().val() );
						});
					}else {
						var page  = 1,
							pages = 1,
							rows  = 100;

						while (page <= pages) {
							$.ajax({
								url: instance.options.url,
								type: 'POST',
								cache: false,
								data: { page: page, rows: rows },
								async: false,
								success: function(data) {
									pages = data.totalPages;
									$( instance.listStruct({ data: data }) ).each(function(key, row) {
										ids.push(row.user_id);
									});
								}
							});
							page++;
						}

					}

					window.location.href = instance.options.exportUrl + "?exportType=" + action + "&" + this.options.entityName + "=" + ids.join(';');

					return;
				break;
			default: break;
		}

		instance.afterApplyAction(instance, action);
	},

	afterApplyAction: function( instance, action ) {  },

	checkedRecords: function( instance ) {
		var sampleRowRemove = $('.' + instance.wrapClass).find('.sample-row').clone();
			$('.' + instance.wrapClass).find('.sample-row').remove();
		var checked = instance.tableList.find('tbody input[type="checkbox"]:checked');
			$('.' + instance.wrapClass).find('tbody').append(sampleRowRemove);

		if (checked.length == 0)
			return false;

		return checked;
	},

	listStruct: function( instance ) {
		return instance.data.userList;
	},

	list: function( instance ) {
		instance.tableList = $('.' + instance.wrapClass).find('.list-content');
		$('.' + instance.wrapClass).find('.list-select-all').change(function(e){
			e.preventDefault();
			instance.tableList.find('tbody input[type="checkbox"]').attr('checked', $(this).is(':checked'));
		});
		if (!instance.columnListeners) {
			instance.tableList.find('thead th[data-sortColumn]').click(function(e){
				e.preventDefault();
				var sortType = 'asc';
				if ($(this).hasClass('asc')) {
					$(this).removeClass('asc');
					sortType = 'desc';
				} else if ($(this).hasClass('desc'))
					$(this).removeClass('desc');

				instance.tableList.find('thead th[data-sortColumn]').removeClass('asc desc');
				$(this).addClass(sortType);
				instance.start( instance, $(this).attr('data-sortColumn'), sortType );
			});
			instance.columnListeners = true;
		}
	},

	update: function( instance, btn ) {  },

	remove: function( instance, btn ) {
		var content = $('<div class="clearfix"><p style="margin-bottom:20px;">' + instance.options.deleteText + '</p></div>');

		$('<a href="#" class="graphicBtn violet right"><span>' + $.i18n.prop('buttons.ok') + '</span></a>').click(function(e) {
			e.preventDefault();
			var row = btn.closest('tr');
			$.ajax({
				type: 'POST',
				url: instance.options.deleteUrl,
				data: { 
					id: row.find('input[name="id"]').val() 
					},
				async :false,
				success :function(response) {
					if (checkResponseSuccess(response)) {
						utils.closeDialog();
						if (response.infoMessage != undefined){
							utils.dialogSuccess(response.infoMessage);
						}else if (response.message != undefined){
							utils.dialogSuccess(response.message);							
						}
						$('.actions-list-wrapper.no-selected').addClass('viewed');
						$('.actions-list-wrapper.for-selected').removeClass('viewed');						
						utils.closeDialog();
						instance.start( instance );
						refreshAssets();
					}
				}
			});

		}).appendTo(content);

		$('<a href="#" class="graphicBtn little right"><span>' + $.i18n.prop('buttons.cancel') + '</span></a>').click(function(e) {
			e.preventDefault();
			utils.closeDialog();
		}).appendTo(content);

		utils && utils.dialog({
			title: $.i18n.prop('buttons.delete'),
			content: content,
			buttons: { },
			css: 'noClose'
		});
	},

	afterListCreated: function( instance ) {
	  
		instance.tableList.css('display', '');
		instance.tableList.find('.btn-update').click(function(event){
			event.preventDefault();
			utils.closeDialog();
			instance.update(instance, $(this));
		});
		instance.tableList.find('.btn-delete').click(function(event){
			event.preventDefault();
			instance.remove(instance, $(this));
		});
		instance.tableList.find('input[type="checkbox"]').change(function(e){
			e.preventDefault();
			if (instance.tableList.find('input[type="checkbox"]:checked').length > 0) {
				$('.' + instance.wrapClass).find('.actions-list-wrapper.no-selected').removeClass('viewed');
				$('.' + instance.wrapClass).find('.actions-list-wrapper.for-selected').addClass('viewed');
			} else {
				$('.' + instance.wrapClass).find('.actions-list-wrapper.no-selected').addClass('viewed');
				$('.' + instance.wrapClass).find('.actions-list-wrapper.for-selected').removeClass('viewed');
			}
		});
		setAdminLineHeight();
		refreshUsers();
	}
});
