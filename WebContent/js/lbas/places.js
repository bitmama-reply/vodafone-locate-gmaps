var places = {};

places.listCategoriesURL = 'listcategories.action';
places.listPOIsPerCategoryURL = 'listpois.action';
places.listRecentsURL = 'getlocationmain.action';

places.subTabEnterprise = '#tab-places-enterprise';
places.subTabPersonal = '#tab-places-personal';
places.subTabRecents = '#tab-places-recents';

places.categories = {};
places.personalCategories = {};



places.getEnterprise = function(options){
	places.categories = {};
	var data = {
			firstCatId:	0,
			listIndex:	0,
			type:	0	
	};
	
	options = options || {};
	options.extra = {container: places.subTabEnterprise,type:0};
	options.type=0;
	options.data = options.data || data;
	options.success = places.getGroupsListOnSuccess;
	options.async = true;
	 
	utils && utils.lbasDoGet(places.listCategoriesURL, options);
};

places.getPrivate = function(options){
	
	var data = {
			firstCatId:	0,
			listIndex:	0,
			type:	1
	};
	
	options = options || {};
	options.extra = {container: places.subTabPersonal,type:1};
	options.type=1;
	options.data = options.data || data;
	options.success = places.getGroupsListOnSuccess;
	options.async = true;
	 
	utils && utils.lbasDoGet(places.listCategoriesURL, options);
};

places.getRecents = function(options){
  console.log('options -->',options)
	options = options || {};
	options.extra = {container: places.subTabRecents};
	//options.data = options.data || '';
	options.success = places.getRecentsListOnSuccess;
	options.async = true;
	 
	utils && utils.lbasDoGet(places.listRecentsURL, options);
	prepareSearchLocationAutoCompleteOperations();
};

places.getGroupsListOnSuccess = function(data, textStatus, jqXHR,  options){
  prepareSearchLocationAutoCompleteOperations();
      
	var container = '#tab-places';
	var search_mode=false;
	if(data){
	  /* DETECT IF SEARCH MODE */
	  if(data.category && data.categoryArr==null) {
	   search_mode=true;
	   data.categoryArr=[data.category];
	   
	  }
		//if(data.actionList){
		//	places.getActions(data.actionList);
		//}
		places.categories = data.categoryArr;
		if(options) container = options.container;
		if($.isArray(places.categories)){
			$(container + ' .contents').empty();
			var $ul = $('<ul></ul>').data('group.data', '');
			for(var i=0; i<places.categories.length; i++){
				var group = places.categories[i];
				var $li = $('<li></li>').attr('id', 'group' + group.id).attr('class', 'noLocatableItems placeCategory');
				//var $divl = $('<div style="line-height: 2em; display: inline-block;"></div>').attr('class', 'left').append('<img src="images/controlPanel/Groups/group_background_blend_left.png" style="line-height: 2em;">');
				//var $divr = $('<div style="display: inline-block; text-align: right;"></div>').attr('class', 'right').append('<img src="images/controlPanel/Groups/group_background_blend_right.png" style="line-height: 2em;">');;
				var $divc = $('<div class="group accordionStyles"></div>');
				if(options) {
  				options.type = options.type || 0;
  				group.options = options;
				}
				var $input = $('<input type="checkbox" id="g'+group.id+'" value="'+group.id+'" class="placeId">')
					.data('group', group)
					.change(function(){
						var dataX = $(this).data('group');
						var children = $(this).parent().parent().find(':checkbox');
						if($(this).is(':checked')) {
							if(children.length>1){
								children.attr('checked', 'checked');
							}else{
								var options = {};
								options.extra = {'show': false, 'id':dataX.id};
								options.poiCount = dataX.poiCount;
								options.type = dataX.type;
								options.id = dataX.id;
								places && places.listPOIsPerCategory(options);
							}
						} else {
	           children.removeAttr('checked');
						}
            EnableDisableButtons($(this).attr("value"));
            places.getAvailableActions(data.actionList);
					});
					var groupName = '<span class="groupName" id="groupName_' + group.id + '">' + group.name + '</span> <span class="groupUsercount"><span class="all_total_count">' + group.poiCount + '</span></span><span class="loader-group"></span>';
          var $label = $('<span for="g'+group.id+'" id="label_g' + group.id + '" class="groupNameContainer" />')
                        .html(groupName)
                      		.click(function(e){
                      		    openCloseCategory($(this));
                              e.preventDefault();
                        });
				var $openclose  = $('<span id="open_group_details_'+ group.id +'" class="openClose"> <img class="openClose" src="images/arrow_right.png"> </span>');
				if(group.poiCount!==0){
						$openclose.click(function(e){
							openCloseCategory($(this));
							e.preventDefault();
						});
				}
				
				//$li.append($divl);
				$li.append($divc);
				$divc.append($input);
			  $($divc).append($openclose);
				$divc.append($label);
				$ul.append($li);
				
				//places.getUsersInGroup(group.id, data);
			}
			if(search_mode) {
			  return $ul;
			} else {
			  $(container + ' .contents').append($ul);
			  $('.subtabs li div').width('100%');
        $('.contents').css('overlow-x', 'hidden !important');
			}
		}
	}else{
		$(container + ' .contents').html('no results');
	}
        $('#btn_tab-places_newCategory').unbind('click').click(function(e) {
        	e.preventDefault();
        	if($('#btn_tab-places_newCategory').hasClass('multi_user_button_inactive')){
	        	return false;
        	}
        	if($('.newCategoryPopUp').length === 0 ){
        		if (userConf.rights.create_enterprise_categories === false && $('#tab-places-enterprise').is(':visible')){
	        		return false;
        		}
	            showSelectedCategory('4');	        	
        	}
	});
};

function openCloseCategory($this) {
  var $li = $this.parents("li");
  var id = $li.attr('id').substring('group'.length);
  var data = $li.find('#g'+id).data('group');
  var $subul = $li.children('ul');
  if($subul && $subul.length === 0){
    var options = {};
    options.extra = {'show': true};
    options.poiCount = data.poiCount;
    options.type = data.type;
    options.id = data.id;
    places && places.listPOIsPerCategory(options);
  }else{
    $subul.toggle();
    updateCategoryArrow($li);
  }
  
}

function updateCategoryArrow($li) {
  var $subul = $li.children('ul');
  $img=$li.find("span.openClose > img");
  if($subul && $subul.length === 0){
    $img.attr('src', 'images/arrow_down.png');
  }else{
    if($subul && $subul.is(':visible')) {
      $img.attr('src', 'images/arrow_down.png');
    }else{
      $img.attr('src', 'images/arrow_right.png');
    }
  }
}





function EnableDisableButtons(id)
{
    var isUncategorized= (String(id)== "-1" || String(id)== "group-1");
    var tab_index=places.getSelectedTab();
    var tab = tab_index== 0 ? 'tab-places-recents' : (tab_index== 1) ? 'tab-places-enterprise' : 'tab-places-personal';
    var count = 0;
    var categories = $('#' + tab + ' .contents >ul >li.placeCategory');		
    var countOfGroups = 0;
    
    $.each(categories, function(){
    	if( $(this).find('.placeId').is(':checked') ){
    		countOfGroups++;
		}
		if (tab === 'tab-places-enterprise'){
		  if(countOfGroups != 1 || isUncategorized){
		    $('#editCategoryGroupAction').addClass('inactive');
      }else{
        $('#editCategoryGroupAction').removeClass('inactive');
      }
		}else{
		  if(countOfGroups != 1 || isUncategorized){
		    $('#editCategoryGroupActionPer').addClass('inactive');
      }else{
        $('#editCategoryGroupActionPer').removeClass('inactive');
      }
		}
    });
    count=$('#' + tab + ' .contents li.singlePoi input.place:checkbox').filter(':checked').length;
    console.log(tab);
    /*
    if(categories.length >0) {
      for(var i = 0, len = categories.length; i < len; i++){
        var category = categories.eq(i);
        var children;
        if (category.find('.placeId').is(':checked')){
            count += parseInt(category.find('.all_total_count').html());
        } else {
          children = category.find('ul.places').children().find('.place:checkbox');
          if (children.length > 0){
            count += parseInt(children.filter(':checked').length);
          }
        }
      }
    } else {
    }*/
    
    
    if (count > 0) 
    {
      $('#tab-places .multi_user_button_inactive').removeClass('multi_user_button_inactive').addClass('multi_user_button');
    }
    else 
    {
      $('#tab-places .multi_user_button').removeClass('multi_user_button').addClass('multi_user_button_inactive');
      if ( $('.placeId').is(':checked') && !isUncategorized){
  		  $('#tab-places #btn_tab-places_Delete').removeClass('multi_user_button_inactive').addClass('multi_user_button');
      }else{
  		  $('#tab-places #btn_tab-places_Delete').addClass('multi_user_button_inactive').removeClass('multi_user_button');
      }
/*
      if(!$('#tab-places-recents').is(':visible')){
  		  $('#btn_tab-places_Delete').addClass('multi_user_button_inactive').removeClass('multi_user_button');      
        $('#btn_tab-places_newCategory').removeClass('multi_user_button_inactive').addClass('multi_user_button');        
      }
*/

     }
     /* control on the page */
     if(tab === 'tab-places-recents'){
  		  $('#btn_tab-places_Delete, #btn_tab-places_newCategory').addClass('multi_user_button_inactive').removeClass('multi_user_button');       
     }
}

places.getAvailableActions = function(actionList) {
        var ShowOnMap = false;
        var Delete = false;
        var ExportToPdf = false;
        var AddNewCategory = false;
        var Edit = false;
        $.each(actionList, function(index, action)
        {
            if (action.key == '1') //delete
                Delete = true;
            if (action.key == '5') //show on map
                ShowOnMap = true;
            if (action.key == '3') //export to pdf
                ExportToPdf = true;
            if (action.key == '4') // add new category
                AddNewCategory = true;
            if (action.key == '7') // edit
                Edit = true;
            /*
            if (action.value == 'Delete')
                Delete = true;
            if (action.value == 'Show on Map')
                ShowOnMap = true;
            if (action.value == 'Export to pdf')
                ExportToPdf = true;
            if (action.value == 'Add new Category')
                AddNewCategory = true;
            if (action.value == 'Edit')
                Edit = true;*/  
                             
         	});
        
        var container = 'tab-places';
        $('#btn_'+container+'_showOnMap, #btn_'+container+'_Delete, #btn_'+container+'_Pdf').unbind('click');
        if (ShowOnMap)
        {
          $('#btn_'+container+'_showOnMap').click(function(e) {
            if (!$(this).hasClass('multi_user_button_inactive')) {
                showSelectedCategory('5');
            }
            e.preventDefault();
          });
        }
        
        if (Delete)
        {
            $('#btn_'+container+'_Delete').click(function(e){
                    if (!$(this).hasClass('multi_user_button_inactive'))
                    {
                        showSelectedCategory('1');
                    }
                    e.preventDefault();
            });
        }
	
        if (ExportToPdf)
        {
            $('#btn_'+container+'_Pdf').click(function(e) {
                    if (!$(this).hasClass('multi_user_button_inactive')) {
                        showSelectedCategory('3');
                    }
                    e.preventDefault();
            });
        }
        if(Edit=== false)
        {
	        $('#editCategoryGroupAction').addClass('inactive block');
        }
        
/*
        if(AddNewCategory)
        {
	        $('#btn_tab-places_newCategory').removeClass('multi_user_button_active');
        }else{
	        $('#btn_tab-places_newCategory').removeClass('multi_user_button_active multi_user_button').addClass('multi_user_button_inactive');
        }
*/
      
    	$('.multi_user_button').live('mousedown', function(e) {
    		if (!$(this).hasClass('multi_user_button_inactive')) {
    		  $(this).addClass('multi_user_button_active');
    		}
    		e.preventDefault();
    	});
    	
    	$('.multi_user_button').live('mouseup mouseout', function(e) {
    		if (!$(this).hasClass('multi_user_button_inactive')) {
    		  $(this).removeClass('multi_user_button_active');
    		}
    		e.preventDefault();
    	});
        
};

places.listPOIsPerCategory = function(options){
	options = options || {};
	var params = {
		categoryId: options.id || 0,
		firstPoiId: options.firstPoiId || 0,
		listIndex: options.listIndex || 0,
		poiCount: options.poiCount || 0,
		type: options.type || 0
	};
	options.success = places.getPlacesInGroupOnSuccess;
	options.async = true;
	options.data = params;
	
	//showloader
	var id='group'+params.categoryId;
  $(places.getMainContainerByType(params.type)+' #' + id).find('span.loader-group').show();
	utils && utils.lbasDoGet(places.listPOIsPerCategoryURL, options);
};

places.getMainContainerByType = function(type) {
  return type ==1 ? places.subTabPersonal : places.subTabEnterprise;
}

places.getPlacesInGroupOnSuccess = function(data, textStatus, jqXHR, options){
  console.log(data);
  console.log(options);
  
  
	if(data){
	  var id=null;
		if(data.selectedPoiCategory) id = 'group'+data.selectedPoiCategory.id;
		var placesList = data.poilist;
		if($.isArray(placesList)){
			var $ul = $("<ul class='places'></ul>").hide();
			var total_item=placesList.length;
			for(var j=0; j<total_item; j++){
				var place = placesList[j];
				console.log(place);
				
				//if(place.address && place.address.length>0){
				var $li = $('<li class="singlePoi"></li>');
        var $div = $('<div id="item_' + place.id + '"></div>').addClass('placesList').addClass('groupElement');
        var $div1 = $('<div></div>').addClass('container').mouseenter(userEnter).mouseleave(userLeave);
        var $checkbox = $('<input type="checkbox" id="u' + place.id + '" value="' + place.id + '" class="place">')
            .data('place', place)
						.change(function(){
							EnableDisableButtons($(this).attr("value"));
							if($(this).is(':checked')){
							}else{
							  if(id) {
							    $('#g'+id.substring('group'.length)).removeAttr('checked');
							  }
							}
              places.getAvailableActions(data.actionList);
						});
					if(options && options.show===false){
						$checkbox.attr('checked', 'checked');
					}else{
						$checkbox.removeAttr('checked', 'checked');
					}
        var $openclose = $('<span id="open_item_details_' + place.id + '"><img src="images/arrow_right.png" class="openClose"></span>');
        var $span1 = $('<span class="nameUser" id="item_name_' + place.id + '"></span>')
          .text(Encoder.htmlDecode(place.name) || Encoder.htmlDecode(place.address) || ' ')
          .data('place', place)
          .click(function(){
            showPoiDetailOnMap([ $(this).data('place') ]);
           })
          .mouseenter(userLabelEnter)
          .mouseleave(userLabelLeave);
          //.click(userLabelClick);
        
        	var $span2 = $('<a class="globalSearchButton locationPlacesLeft" href="#"><span class="globalSearchText locationPlacesRight">'+$.i18n.prop("buttons.show")+'</span></a>').data('place', place)
        .click(function(e){
            var placeBtn = $(this).data('place');
            showPoiDetailOnMap([ placeBtn ], placeBtn.latitude, placeBtn.longitude);
            e.preventDefault();
         });
        var $ulExpandedButtons = $('<ul id="items_list_buttons_' + place.id + '" class="items_list_buttons clearfix"></ul>')
            .hide().append($('<li class="first"></li>') .html('PRINT')
            );
        $div1.append($checkbox);
        $div1.append($openclose);
        $div1.append($span1);
        $div1.append($span2);
        $div1.append($ulExpandedButtons);
        $div.append($div1);
        $li.append($div);
				$ul.append($li);
				//}
			}
			if($($ul.parent().find(':checkbox')[0]).is(':checked')){
				$ul.find(':checkbox').attr('checked', 'checked');
				
			}
			/* esiste id e aggiungo la lista */
			 if(id || !options || options.show!==false) {
        $ul.show();
        
      }
			
			if(id) {
			 var li_content= $(places.getMainContainerByType(data.selectedPoiCategory.type)+' #' + id);
			 li_content.append($ul).find('span.loader-group').hide();
			 updateCategoryArrow(li_content);
			 EnableDisableButtons(id);  
			} else {
			  return $ul;
			}
		}
	}
};

function userEnter() {
    $(this).css({
      'text-decoration': 'underline',
      'cursor': 'pointer'
    });
  }

  function userLeave() {
    $(this).css({
      'text-decoration': 'none',
      'cursor': 'default'
    });
  }

function userLabelEnter() {
    $(this).css({
      'text-decoration': 'underline',
      'cursor': 'pointer'
    });
  }

  function userLabelLeave() {
    $(this).css({
      'text-decoration': 'none',
      'cursor': 'default'
    });
  }

places.getRecentsListOnSuccess = function(data, textStatus, jqXHR, options){
	var container = '#tab-places';
	if(data){
	  
	   var search_mode=false;
    /* DETECT IF SEARCH MODE */
    if(data.locationList==null && data[0]) {
     search_mode=true;
     data.locationList=[data[0]];
     
    }
	  		
		if(data.actionList){
			places.getActionsForRecents(data.actionList);
		}
		
		places.categories = data.locationList;
		if(options)
			container = options.container;
		
		//var id = 'group'+data.selectedPoiCategory.id;
		var placesList = data.locationList;
		
		if($.isArray(placesList)){
			$(container + ' .contents').empty();
			var $ul = $("<ul></ul>").addClass('places').hide();
			for(var i=0; i<placesList.length; i++){
				var place = placesList[i];
				console.log('--->place',place);
				if(place.address && place.address.length>0){
					var $li = $('<li class="singlePoi"></li>');
					var $div1 = $('<div></div>').addClass('placesList').addClass('accordionStyles');
					var $checkbox = $('<input type="checkbox" id="u'+place.id+'" value="'+place.id+'" class="place">')
						.change(function(e){
/*
							if($(this).is(':checked')){
								//user && user.getAvailableActions(true); //T.B..D
							}else{
							  // $('#g'+id.substring('group'.length)).removeAttr('checked');
							}
*/
							EnableDisableButtons($(this).attr("value"));	
							 e.preventDefault();
							 
						});
					
					if(options && options.show===false){
						$checkbox.attr('checked', 'checked');
					}else{
						$checkbox.removeAttr('checked', 'checked');
					}
					
					var $span1 = $('<span class="adressPlace"></span>')
						.text(place.name || place.address || ' ')
						.data('place', place)
						.css('cursor', 'pointer')
						.click(function(e){
							var data = $(this).data('place');
							//showPoiOnMapNew(data.id, data.latitude, data.longitude, data.address, data.name);
              showPoiDetailOnMap([ $(this).data('place') ]);
              e.preventDefault();
						});
					$div1.append($checkbox);
					$div1.append($span1);
					$li.append($div1);
					$ul.append($li);
				}
			}
			if($($ul.parent().find(':checkbox')[0]).is(':checked')){
				$ul.find(':checkbox').attr('checked', 'checked');
			}
			if(!options || options.show!==false)
        $ul.show();
			
			if (search_mode) {
			  return $ul;
			} else {
			  $(container + ' .contents').append($ul);
			}
		}
	}else{
		$(container + ' .contents').html('no results');
	}



  $('#btn_tab-places_showOnMap').unbind('click');
  $('#btn_tab-places_showOnMap').click(function(e) {
    e.preventDefault();
    if (!$(this).hasClass('multi_user_button_inactive')) {
        showSelectedCategory('5');
    }

  });

	$('#btn_tab-places_Pdf').unbind('click');
  $('#btn_tab-places_Pdf').click(function(e) {
    e.preventDefault();
    if (!$(this).hasClass('multi_user_button_inactive')) {
      showSelectedCategory('3');
    }
  });
};

places.getActions = function(actionsList, func){
	$('#btn_tab_places_locate_selected').unbind('click');
	var $select = $('<select></select>');
	$.each(actionsList, function(index, action){
		$opt = $("<option></option")
			.attr('value', action.key)
			.text(action.value);
		$select.append($opt);
	});
	$('#tab_places_action_select').replaceWith($select);
	$select.attr('id', 'tab_places_action_select');
	$('#btn_tab_places_locate_selected').click(function(e){
		showSelectedCategory($select.val());
		e.preventDefault();
	});
};

places.getActionsForRecents = function(actionsList, func){
		$('#btn_tab_places_locate_selected').unbind('click');
		var $select = $('<select></select>');
		$.each(actionsList, function(index, action){
			$opt = $("<option></option")
				.attr('value', action.key)
				.text(action.value);
			$select.append($opt);
		});
		$('#tab_places_action_select').replaceWith($select);
		$select.attr('id', 'tab_places_action_select');
		$('#btn_tab_places_locate_selected').click(function(){
			goSelectedAction($select.val());
		});
};

places.locatePlacesById = function(idList){
	if(idList){
		if($.isArray(idList) && idList.length>0){
			$.each(idList, function(i, k){
				places.locatePlaceById(k);
			});
		}else{
			places.locatePlaceById(idList);
		}
	}
};

places.locatePlaceById = function(id){
	var options = {};
	options.data = {
			poiId: id
	};
	options.success = function(json){
/* 		showPoiOnMapNew(json.poii.id, json.poii.latitude, json.poii.longitude, json.poii.address, json.poii.name); */
		showPoiMarkerOnMap(json.poii);
	};
	utils && utils.lbasDoGet('getPOIById.action', options);
};

places.getSelectedTab = function(){
	return leftPanel && leftPanel.tabPlacesSubTabs.tabs('option', 'selected');
};

places.reloadTabs = function(){
	places.getEnterprise();
	places.getPrivate();
	places.getRecents();
};