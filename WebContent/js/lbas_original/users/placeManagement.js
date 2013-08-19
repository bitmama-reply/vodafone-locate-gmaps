var adminJqGridContent,
	adminClickedCategoryId;

function loadAdminCategoryListPlace() {
	$('<option value="import">' + $.i18n.prop('admin.list.Import') + '</option>').prependTo( $('.no-selected .actions-list') );
	$('<option value="delete">' + $.i18n.prop('buttons.delete') + '</option>').prependTo( $('.no-selected .actions-list') );
	
	$('.actions-list-box select option[value="xml"]').remove();
	$('.actions-list-box select option[value="pdf"]').remove();
	$('.actions-list-box select').selectmenu();
	$('.actions-list-box').css('display', 'block');

	// Check actions from the toolbar
	$('#adminContent .toolbar-apply').click(function(e){
		e.preventDefault();
		applyAction( $(this) );
	});


	adminJqGridContent = 'category';
//	destroyPlaceJqGrid();

	$("#list2").jqGrid({
		url :'listEnterpriseCategories.action',
		datatype :"json",
		colNames :[ 'ID', 'Name', '', '' ],
		colModel :[ {
			name :'id',
			index :'ID',
			key :true,
			hidden :true
		}, {
			name :'name',
			index :'NAME',
			width :900,
			search :true
		}, {
			name :'poiCount',
			index :'',
			align :"right",
			hidden :true
		}, {
			name :'edit',
			width :50,
			align :"right",
			sortable :false
		} ],
		jsonReader :{
			repeatitems :false
		},
		rowNum :10,
		toppager: true,
		pager: '#pager2',
		sortname :'name',
		viewrecords :true,
		sortorder :"asc",
		width :'',
		height :'',
		recordtext: $.i18n.prop('admin.list.placesFound'),
		pgtext: '<div class="pager-inside-text">' + $.i18n.prop('admin.list.pages') + '</div>',
		multiselect :true,
		subGridOptions: {
			selectOnLoad: true
		},
		gridComplete :function() {
			var ids = jQuery("#list2").jqGrid('getDataIDs');
			for ( var i = 0; i < ids.length; i++) {
			  
				var cl = ids[i],
					categoryName = jQuery("#list2").getRowData(cl).name,
					poiCount = jQuery("#list2").getRowData(cl).poiCount,
					re = "",
					rd = "";
				if (cl != -1) {
					re = "<a class=\"btn-update\" title='"+ $.i18n.prop('buttons.edit')+"' href=\"#\" onclick=\"openEnterpriseEditCategoryPoiDialog(0,'" + cl + "','" + categoryName + "','" + poiCount + "',true); return false;\"></a><a title='"+ $.i18n.prop('buttons.delete')+"' class=\"btn-delete\" href=\"#\" onclick=\"deletePlaceCategory(event, '" + cl + "',0,true); return false;\"></a>";
				}

				var name = "<a class=\"category-row-name\" onclick='$(\"#list2\").toggleSubGridRow(" + cl + ");'>" + categoryName + ' (' + poiCount + ')</a>';
				jQuery("#list2").jqGrid('setRowData', ids[i], {
					edit: re
				});
				if(poiCount !== '0'){
  				jQuery("#list2").jqGrid('setRowData', ids[i], {
	  				name: name
          });
        }else{
          $('#'+ids[i]+' .ui-sgcollapsed a').click(function(){
            return false;
          });
        }
			}
			localize && localize.addTitleForGrid();	
		},
		subGrid: true,
		subGridUrl: 'listEnterpriseCategories.action',
		subGridRowExpanded: function(subgrid_id, row_id) {
      if($(row_id))
			subgridPois(subgrid_id, row_id);
			if (row_id === '-1') {
				$('#p_list2_-1_t_left').empty().append('<div class="selectAllCover-1"><input type="checkbox" for="selectAll-1" id="selectAll-1"> <label for="selectAll-1">'+ $.i18n.prop("user.SelectAll")+'</label></div>');
				
				$('#selectAll-1').change(function(){
				
					if( $('#selectAll-1').is(':checked') ){
						$('#list2_-1_t .cbox').attr('checked', true);
					}else{
						$('#list2_-1_t .cbox').attr('checked', false);
					}
				});
			}
			localize && localize.addTitleForGrid();	
		}/*,
		caption :"Company Name"*/
	});

	$("#list2").jqGrid('navGrid', '#list2_toppager', {
		edit :false,
		add :false,
		del :false,
		search :false,
		cloneToTop: true
	});
	
	$('.toolbar-panel-info').remove();
	$('#pager2').insertBefore($('.list-grid-wrapper'));
	$('#pager2_left').remove();
	$('#pager2_center').attr('align', 'right');
	$('#pager2_right').attr('align', 'left').css('text-align', 'left').insertBefore($('#pager2_center'));
	$('#pager2_right div').addClass('list-count').css('text-align', 'left');
	$('.toolbar-panel .search-box span.searchMagnifier').click(function(){
		searchPois();
	});
	$('.toolbar-panel .search-box span input').keypress(function(e){
		var code = e.keyCode ? e.keyCode : e.which;
		if (code == 13)
			searchPois();
	});
/*	$.getJSON("getCompanyNameFunc.action", {}, function(json) {
		$('.ui-jqgrid-title').text($.i18n.prop('companyList.CompanyName') +" : "+ json.companyName);
	});*/
}

function searchPois() {
	var searchText = $('.toolbar-panel .search-box span input').val();

	if (searchText == '') {
		$('#gbox_list2').css('display', 'block');
		$('#pager2').css('display', 'block');
		$('#gbox_list3').css('display', 'none');
		return false;
	}

	$('#gbox_list3').remove();
	$('.list-grid-wrapper').append($('<table id="list3"></table>'));
	$('#gbox_list2').css('display', 'none');
	$('#pager2').css('display', 'none');

	var locationsTable = $('#list3');
	locationsTable.jqGrid({
		url:"searchEnterprisePois.action?searchText=" + searchText,
		datatype :"json",

		colNames :[ '', '', '', '', '' ],
		colModel :[ {
			name :'id',
			index :'ID',
			key :true,
			hidden :true
		}, {
			name :'name',
			index :'NAME',
			width : $('.toolbar-panel').width()-250,
			search :true
		}, {
			name :'rating',
			width :110,
			align :"left",
			sortable :false
		}, {
			name :'ratingreset',
			width :40,
			align :"left",
			sortable :false
		}, {
			name :'edit',
			width :90,
			align :"right",
			sortable :false
		} ],

		jsonReader :{
			repeatitems :false
		},
		rowNum: 10,
		rowList: [ 10, 20, 30 ],/*
		pager: '#pager2',*/
		sortname: 'name',
		viewrecords: true,
		sortorder: "asc",
		width: '100%',
		height: '100%',
		multiselect :true,
		gridComplete :function() {
			var ids = locationsTable.jqGrid('getDataIDs');
			for ( var i = 0; i < ids.length; i++) {
				var cl = ids[i],
					locationName = locationsTable.getRowData(cl).name,
					ratingValue = locationsTable.getRowData(cl).rating,
					ratingHtml = "<div style=\"width:80px;\" id=\"starRatingAdmin_" + cl + "\"></div>",
					ratingResetHtml = "<a style=\"color:#0077B7;cursor:pointer;font-weight:bold\" onclick=\"resetPlaceRate('" + cl + "');\" >" + $.i18n.prop('poi.rating.reset') + "</a>",
					re = "<a class=\"btn-update\" href=\"#\" onclick=\"openEditLocationDialog('" + cl + "','" + locationName
						+ "',0,true); return false;\">Update</a><a class=\"btn-delete\" href=\"#\" onclick=\"deletePlaceLocation(event, '" + cl
						+ "',0,0,0,0,true); return false;\">Delete</a>";

				locationsTable.jqGrid('setRowData', ids[i], {
					edit: re
				});
				locationsTable.jqGrid('setRowData', ids[i], {
					rating: ratingHtml
				});

				locationsTable.jqGrid('setRowData', ids[i], {
					ratingreset: ratingResetHtml
				});

				locationsTable.find('#starRatingAdmin_' + cl).rater('updateOverallPoiRate.action?poiId=' + cl, {
					style: 'small',
					curvalue: ratingValue
				});

			}
			localize && localize.addTitleForGrid();	
			$('#cb_list3').parent().parent().next().next().empty().text($.i18n.prop('user.SelectAll'));
		}
	});
}

function subgridPois(subgrid_id, row_id) {
  var justID = row_id;
	var subgrid_table_id = subgrid_id+"_t",
	pager_id = "p_"+subgrid_table_id;
	$("#"+subgrid_id).html('<div id="'+pager_id+'" class="scroll"></div><table id="'+subgrid_table_id+'" class="scroll"></table>');
	
	var locationsTable = jQuery("#"+subgrid_table_id);
	locationsTable.jqGrid({
		url:"listEnterprisePois.action?categoryId="+row_id,
		datatype :"json",
		colNames :[ '', '', '', '', '' ],
		colModel :[ {
			name :'id',
			index :'ID',
			key :true,
			hidden :true
		}, {
			name :'name',
			index :'NAME',
			/* width :950, */
			search :true
		}, {
			name :'rating',
			width :110,
			align :"left",
			sortable :false
		}, {
			name :'ratingreset',
			width :40,
			align :"left",
			sortable :false
		}, {
			name :'edit',
			width :90,
			align :"right",
			sortable :false
		} ],

		jsonReader :{
			repeatitems :false
		},
		/*rowNum: (row_id==-1) ? 1000 :10,*/
		rowNum :10,
		/*rowNum: (row_id==-1) ? 1000 :10,*/
		rowList:[ 10, 20, 30 ],
 		pager: '#'+pager_id,
		sortname: 'name',
		viewrecords: true,
		sortorder: "asc",
		width: '100%',
		height: '100%',
		multiselect :true,
		gridComplete :function() {
			var ids = locationsTable.jqGrid('getDataIDs');
			for ( var i = 0; i < ids.length; i++) {
				var cl = ids[i],
					locationName = locationsTable.getRowData(cl).name,
					ratingValue = locationsTable.getRowData(cl).rating,
					ratingHtml = "<div style=\"width:80px;\" id=\"starRatingAdmin_" + cl + "\"></div>",
					ratingResetHtml = "<a style=\"color:#0077B7;cursor:pointer;font-weight:bold\" onclick=\"resetPlaceRate('" + cl + "');\" >" + $.i18n.prop('poi.rating.reset') + "</a>",
					re = "<a class=\"btn-update\" href=\"#\" title='"+$.i18n.prop('buttons.update') +"' onclick=\"openEditLocationDialog('" + cl + "','" + locationName
						+ "',0,true); return false;\">Update</a><a class=\"btn-delete\" href=\"#\" title='"+$.i18n.prop('buttons.delete') +"' onclick=\"deletePlaceLocation(event, '" + cl
						+ "',0,"+justID+",0,0,true); return false;\">Delete</a>";

				locationsTable.jqGrid('setRowData', ids[i], {
					edit: re
				});
				locationsTable.jqGrid('setRowData', ids[i], {
					rating: ratingHtml
				});

				locationsTable.jqGrid('setRowData', ids[i], {
					ratingreset: ratingResetHtml
				});

				$('#starRatingAdmin_' + cl).rater('updateOverallPoiRate.action?poiId=' + cl, {
					style: 'small',
					curvalue: ratingValue
				});

			}
			locationsTable.find('tr').each(function(){
				$(this).find('td:last-child').attr('title','')
			});
			
			if (locationsTable.find('tr').length < 1 ){
				$('#'+pager_id).hide();				
			}
			
			/* STYLING FIX */
			var newWidth = $('#admin #adminContent .list-grid-wrapper tbody tr').width()-40;
			$('#'+subgrid_id+"_t").css('width',newWidth).find('tbody tr td').eq(2).css('width',newWidth-250);
			$('#p_'+subgrid_id+"_t").css('width',newWidth);
			
			/* LEFT LINE */
			var adminHeight = $('#admin').outerHeight()-30;
			$('#admin #adminNav').css('height',adminHeight);
		}
	});
	locationsTable.jqGrid('navGrid',"#"+pager_id,{edit:false,add:false,del:false});
	
}

function deletePlaceLocation(event, locationId, type, categoryId, poiCount, listIndex, admin) {
	event.preventDefault();
  $('html,body').animate({scrollTop: 0}, 1000);
	var btns = {};
	btns[$.i18n.prop('buttons.ok')] =   function() {

		$.ajax({
			url :"deletePoi.action",
			type :'POST',
			data :{
				poiId :locationId
			},
			dataType :'json',
			success :function(json) {
				if (checkResponseSuccess(json)) {
					if (admin) {
						//$("#list2").trigger("reloadGrid").toggleSubGridRow(categoryId);;
						$("#list2").toggleSubGridRow(categoryId).toggleSubGridRow(categoryId);
						return;
					}
	
					if (poiCount == 1) {
						$("#" + locationId).hide();
						$("#selectMultiPoi").hide();
						$("#hideMultiPoi").hide();
						poiCount--;
						$("#searchPoiListSize").text(poiCount);
	
					} else {
						if (categoryId == 0) {
							searchWithCoordinates("delete",listIndex, locationId);
						} else {
							// loadPois(type, categoryId, listIndex,
							// poiCount);
	
							categoryType=0;
							if($('#personalTabContent').is(':visible')){
								categoryType=1;
							}
							loadPoisUnderCategory(categoryType,categoryId,listIndex,poiCount,0,true);
							updatePoiCategoryCount(categoryId,1);
						}
					}
					if(type==0){
						updatePoiCount(-1, true);
					}else if(type==1){
						updatePoiCount(-1, false);
					}
	
				}
			}
		});

		$(this).dialog('close');
		$(this).dialog('destroy');
		refreshTabPlacesEnterprise();

	};
	btns[$.i18n.prop('buttons.cancel')] = function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
	};

	// Creation of the overlay
	utils && utils.dialog({
		title: $.i18n.prop('confirmation.delete.title'),
		content: $.i18n.prop('confirmation.delete'),
		buttons: btns,
		css: 'addExcpPos'
	});
	var dialogWidth = $('.ui-dialog').outerWidth(),
		dialog = $('.ui-dialog');
	dialog.css({
		'top': '250px',
		'margin-left': -dialogWidth/2,
		'width':'545px',
		'left':'50%',
		'position': 'fixed'
	});
}

function deletePlaceCategory(event, categoryId, type, admin, listIndex) {
	event.preventDefault();
	var btns = {};
	btns[$.i18n.prop('buttons.ok')] = function() {
	
/*
		var selectedPoiId = [];
		$.ajax({
			url :"listpois.action",
			type :'POST',
			async:false,
			data :{
				categoryId :categoryId,
				type : 0
			},
			dataType :'json',
			success :function(json) {
				
				$.each(json.poilist, function(i ,v){
					selectedPoiId.push(v.id);	
				});
				deleteMultipleLocations(selectedPoiId, false);
			}
		});
*/
	

		$.ajax({
			url :"deleteCategory.action",
			type :'POST',
			data :{
				categoryId :categoryId
			},
			async:false,
			dataType :'json',
			success :function(json) {
				if (json.errorText == null) {
					if (admin) {
						$("#list2").trigger("reloadGrid");
					} else {
						loadCategories(type, listIndex);
					}

				}
			}

			
			
		});

		$(this).dialog('close');
		$(this).dialog('destroy');
	};
	btns[$.i18n.prop('buttons.cancel')] = function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
	};

	// Creation of the overlay
	utils && utils.dialog({
		title: $.i18n.prop('confirmation.delete.title'),
		content: $.i18n.prop('confirmation.delete'),
		buttons: btns,
		css: 'addExcpPos'
	});


	var dialogWidth = $('.ui-dialog').outerWidth(),
	dialog = $('.ui-dialog');
	dialog.css({
		'top': '250px',
		'margin-left': -dialogWidth/2,
		'left':'50%',
		'position': 'fixed'
	});

	return false;
}

function resetPlaceRate(poiId) {

	$.post('resetPoiRate.action', {
		poiId :poiId
	}, function() {
	});

	$("#starRatingAdmin_" + poiId).find('.star-rating').children('.current-rating').css({
		width :(0) + '%'
	});
}

function destroyPlaceJqGrid() {

	$('#locationListContent').html('');

	$('#locationListContent').append($(document.createElement('table')).attr({
		id :'list2'
	}));

	$('#locationListContent').append($(document.createElement('div')).attr({
		id :'pager2'
	}));
}

function openEnterpriseEditCategoryPoiDialog(categoryType, categoryId, categoryName, poiCount, editPermissionRight) {
	utils.closeDialog();
	
	if (categoryName) {
		dialogTitle = $.i18n.prop('categoryDetail.editCategory') + ": " + categoryName + " (" + poiCount + ")";
	} else {
		dialogTitle = $.i18n.prop('categoryDetail.newCategory');
	}
	if (!categoryId) {
		categoryId = 0;
	}

	var confirm_btn_label;
	if (categoryId !== 0) {
		confirm_btn_label = $.i18n.prop('buttons.update');
	} else {
		confirm_btn_label = $.i18n.prop('buttons.save');
	}

	var btns = {};
	btns[confirm_btn_label] = function() {
		//if (lbasValidate('categoryDetailForm'))
			AjxUpdateCategoryPoi(categoryId);
	};

	btns[$.i18n.prop('buttons.cancel')] = function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
	};

	var $div = $('<div></div>').load('pages/template/editPOIEnterprise.html?' + Math.floor(Math.random()*999), function(){
		$("#tabs_in_enterpriseCategoryDialog").tabs({
			show: function(event, ui){
				switch (ui.index) {
					case 1:
						if($.trim($(ui.panel).html()).length===0) openCategoryPermissionsTab(ui.panel);
						break;
					case 2:
						if($.trim($(ui.panel).html()).length===0) getAdminOfCategory(ui.panel);
						break;
					default:
						if($.trim($(ui.panel).html()).length===0) openEditCatPoiTab1(ui.panel, categoryType, categoryId);
						break;
				}
			}
		});
		localize.newEnterprisePlaceGroupDialog();
		/*
		$.ajax({
			type :'GET',
			url :'getCategoryDetail',
			data :{
				categoryType :categoryType,
				categoryId :categoryId
			},
			cache :false,
			success :function(data, textStatus) {
				if (checkResponseSuccess(data)) {
					$('#tabs-1').html(data);
				}
			}
		});
		*/
		if (categoryId === 0)
		{
			$("#c").remove();
			$("#edit_ecat_tab3_list_item").remove();
			$("#tabs-3").remove();
		} else {
			if (!editPermissionRight || editPermissionRight === 'false') {
				$("#edit_ecat_tab2_list_item").remove();
				$("#tabs-2").remove();
			}
		}
	});

	utils && utils.dialog({
		'title': dialogTitle,
		'content': $div,
		'buttons': btns,
		'css': 'noClose newCategoryPopUp'
		});
	$(".newCategoryPopUp").css({
		'max-width':660,
		'width':660,
		'top':100,
		'margin-left':-200
	});
  $('html, body').animate({scrollTop: 0}, {duration:700, easing:'swing'});
	return false;
}

function AjxUpdateCategoryPoi(categoryId) {
	var serializedFormData = '';
	var categoryType = $("#categoryDetailForm input[name=categoryType]").val();
	//var categoryId = $("#categoryDetailForm input[name=categoryId]").val();
	//var admin = aPage;
	if (categoryType === '1')
		serializedFormData = $("#tab-1 #categoryDetailForm").serialize();
	else if (categoryType === '0')
		serializedFormData = $("#tabs-1 #categoryDetailForm").serialize();

	var share = false;
	var ShareSerializedFormData = "";
	var enis;
	if ($("#navigationCatShareRight").length > 0) {
		var users = $("#navigationCatShareRight  li[id*='rightUser']");
		var j = 0;
    for ( var i = 0; i < users.length; i++) {
			if (users[i].style.display != "none") {
				ShareSerializedFormData += "&selectedUserIdList=" + users[i].id.replace('rightUser', '');
				j++;
			}
		}
		share = true;
	}

	if (permissionsObj)
	{
		var permsX = new Array();
		$.each(permissionsObj, function(i, val)
		{
			var perms = new Object();

			/*perms.addPOI = val.substr(0, 1);
			perms['delete'] = val.substr(1, 1);
			perms.deletePOI = val.substr(2, 1);
			perms.edit = val.substr(3, 1);
			perms.editPermission = val.substr(4, 1);
			perms.sharePOI = val.substr(5, 1);
			perms.view = val.substr(6, 1);
			perms.userId = i;*/
			
			/*
			perms.addPOI = val.addPOI;
      perms['delete'] = val['delete'];
      perms.deletePOI = val.deletePOI;
      perms.edit = val.edit;
      perms.editPermission = val.editPermission;
      perms.sharePOI = val.sharePOI;
      perms.view = val.view;
      perms.userId = i;*/
			
			/*
			perms.addPOI = 1;
			perms['delete'] = 1;
			perms.deletePOI = 1;
			perms.edit = 1;
			perms.editPermission = 1;
			perms.sharePOI = 1;
			perms.view = 1;
			perms.userId = i;
			*/

			
			permsX.push(val);
			
			//PermsSerializedFormData += '&encodedUserPermissions='+i+':'+1010101;
			/*enis += '&encodedUserPermissions='+i+':'+'1010101';*/

			//serializedFormData += "&permList=" + i + ":" + val;
		});
    /*PermsSerializedFormData = JSON.stringify(permsX);*/
    PermsSerializedFormData = permsX;

	}



	var options = {};
	options.data = serializedFormData;
	options.success = function(data, textStatus) {
	  
	  var cat_ID=data.categoryId || data.successfullItems[0] ||  categoryId;
		if (checkResponseSuccess(data)) {
			if (share)
			{
				var optionsS = {};
				optionsS.data = "categoryId=" + cat_ID+ ShareSerializedFormData;
				utils && utils.lbasDoPost('json/updateCategoryShare.action', optionsS);
			}
			else
			{
			  console.log(data.categoryId);
        console.log(categoryId);
				var optionsS = {};
				//var formData={};
				optionsS.categoryId=cat_ID;
				optionsS.userPermissions=PermsSerializedFormData;
				/*optionsS.data = "categoryId=" + data.categoryId + "&userPermissions=" + PermsSerializedFormData;*/
				//optionsS.data =JSON.stringify(formData);
				//optionsS.contentType='application/json';
				/* optionsS.data = "categoryId="+data.categoryId;*/
				//utils && utils.lbasDoPost('updatePoiCategoryPermissions.action', optionsS);
				
				
				$.ajax({
				  type :'POST',
		          url :'updatePoiCategoryPermissions.action',
		          async :false,
		          contentType:'application/json',
		          data : JSON.stringify(optionsS),
		          dataType :'json',
		          success :function(json) {
		          }
		        });
						
				//utils && utils.lbasDoPost('updatePoiCategory.action', optionsS);
										   
			}
			if($('#tab-places-enterprise').is(':visible')){
				refreshTabPlacesEnterprise();				
			}else if($('#tab-places-personal').is(':visible')){
				refreshTabPlacesPersonal();				
			}

			var FeedBeckMessage = $.i18n.prop('info.update');
	        if (categoryId != undefined && categoryId === 0){
		        FeedBeckMessage = $.i18n.prop('location.group.update.success');
	        }			
			utils.closeDialog();
			utils.dialogSuccess(FeedBeckMessage);
		};
	};

	if (categoryId != undefined && categoryId === 0)
		utils && utils.lbasDoPost('addNewPoiCategory.action', options);
	else
		utils && utils.lbasDoPost('updatePoiCategory.action', options);
	$("#list2").trigger("reloadGrid");
	//utils && utils.lbasDoPost('updateCategoryDetail', options);
}

function applyAction(btn){
	var action = $('.actions-list-wrapper.viewed .actions-list').selectmenu('value');
	switch (action) {
		case 'import':
				utils.closeDialog();
				var btns = {};
				var content = $('.import-form');

				// Creation of the overlay
				utils && utils.dialog({
					title: $.i18n.prop('import.poi.category.title'),
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
					var form = $(this).closest('form');
					form.ajaxSubmit({
					  type:'POST',
						dataType: 'json',
						success: function(data) {
							if (data.errorText != undefined && data.errorText != '')
								utils.dialogError({ title: $.i18n.prop('dialog.title.error'), content: data.errorText });
							else {
							var txt =(data.uploadStatusMessage != undefined && data.uploadStatusMessage != '') ? data.uploadStatusMessage:$.i18n.prop('info.upload.success');
						  utils.closeDialog();
							//utils.dialogSuccess(txt);
							utils.dialogInfo({ title: $.i18n.prop('info.update'), content: txt });
							$("#list2").trigger("reloadGrid");
							refreshTabPlacesEnterprise();
							}
						}
					});
				});
				return;
			break;
		case 'delete':
				var ids = [],
					checked = checkedCategoriesRecords(),
					url = 'deleteMultipleCategories.action',
					data = {};
				if (checked === false) {
					checked = checkedPoiRecords();
					url = 'deleteMultiplePois.action';
					entityName = 'pois';
					if (checked !== false)
						checked.each(function(key){
							var splitted = $(this).attr('id').split('_');
							ids.push( splitted[1] );
						});
					else {
						utils.dialogError({ title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('admin.list.selectData') });
						return false;
					}
					data = { selectedPoiIds: ids };
				} else {
					checked.each(function(key){
						var splitted = $(this).attr('id').split('_');
						ids.push( splitted[1] );
					});
					data = { selectedCategoryIds: ids };
				}

				$.ajax({
					type: 'POST',
					url: url,
					data: data,
					async: false
				});
				utils.closeDialog();
				utils.dialogSuccess($.i18n.prop('info.delete'));
				$("#list2").trigger("reloadGrid");
				return;
			break;
		case 'xls':
		case 'csv':
				var ids = [],
					checked = checkedCategoriesRecords(),
					url = 'exportCategories.action',
					entityName = 'categories';
				if (checked !== false)
					checked.each(function(key){
						var splitted = $(this).attr('id').split('_');
						ids.push( splitted[1] );
					});
				else {
					checked = checkedPoiRecords();
					url = 'exportPois.action';
					entityName = 'pois';
					if (checked !== false)
						checked.each(function(key){
							var splitted = $(this).attr('id').split('_');
							ids.push( splitted[1] );
						});
					else {
						utils.dialogError({ title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.select.category') });
						return false;
					}
				}

				window.location.href = url + "?type=" + action + "&" + entityName + "=" + ids.join(';');
				return;
			break;
		default: break;
	}
}

function checkedCategoriesRecords() {
	var checked = $('.list-grid-wrapper #list2 > tbody > tr > td > input[type="checkbox"]:checked');
	if (checked.length == 0)
		return false;

	return checked;
}

function checkedPoiRecords() {
	var checked = $('.list-grid-wrapper #list2 > tbody table tr > td > input[type="checkbox"]:checked');
	if (checked.length == 0)
		return false;
	return checked;
}

function openEditCatPoiTab1(container, categoryType, categoryId){
	if (categoryId > 0) {
		$.ajax({
			type :'GET',
			url :'json/editPoiCategory.action',
			data :{
				categoryType :categoryType,
				categoryId :categoryId
			},
			cache :false,
			success :function(data, textStatus) {
				if (checkResponseSuccess(data))
				{
					$(container).load('pages/template/saveCategoryDialogTemplate_tab0.html', function(){
              $("#categoryDetailForm input[name='categoryType']").val(categoryType);
							$("#categoryDetailForm input[name='categoryId']").val(categoryId);
							$("#categoryDetailForm input[name='categoryName']").val(data.categoryName);
							$("#categoryDetailForm textarea[name='categoryDescription']").val(data.categoryDescription);
						}
					);
				}
			}
		});
	} else {
		$(container).load('pages/template/saveCategoryDialogTemplate_tab0.html', function(){
				$("#categoryDetailForm input[name='categoryType']").val(categoryType);
				$("#categoryDetailForm input[name='categoryId']").val(categoryId);
			}
		);
	}
}