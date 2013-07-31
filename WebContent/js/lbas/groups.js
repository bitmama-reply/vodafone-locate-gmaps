(function(){

  var tabs = ['tab-users', 'tab-assets'];
  var request_limit = 10000;
  var OpenOnClick = true;
  var all = false;
  var Remall = false;
  var IsSearching = false;
  var procedi = true;

  var selectedUsers = {
    groups: {}
  };

  function setup() {
    window.name = "";

    for (var i = 0, len = tabs.length; i < len; i++) {
      /* CAMBIO SELECT (ALL / LOCATABLE)*/
      $('#filter_all_' + tabs[i]).live('change', filterAllChange);
      /* SELECT ALL*/
      $('#select_all_' + tabs[i]).live('change', selectAllChange);
    }
    /* group*/

    $('.groupId.check-box').live('change', groupCheck);    
    
    /* menu  left */
    $('#tab-users .groupNameContainer').live('click', groupLabelClick);
    $('#tab-users .group img.openClose').live('click', groupArrowClick);
    
    $('#tab-assets .groupNameContainer').live('click', groupLabelClick);
    $('#tab-assets .group img.openClose').live('click', groupArrowClick);
    
    /* user*/

    $('.user.check-box').live('click', userCheck);
    $('.users img.openClose').live('click', userArrowClick);


    $('.usersList.groupElement')
      .live('mouseenter', userEnter)
      .live('mouseleave', userLeave);

    $('a[name=btn_item_locate]')
      .live('click', locateUser)
      .live('mousedown', locateUserDown)
      .live('mouseup', locateUserUp);

    $('a[name=btn_item_create_report]')
      .live('click', userCreateReport)
      .live('mousedown', userCreateReportDown)
      .live('mouseup', userCreateReportUp);

    $('a[name=btn_item_send_message]')
      .live('click', userSendMessage)
      .live('mousedown', userSendMessageDown)
      .live('mouseup', userSendMessageUp);

    $('a[name=btn_item_more_info]')
      .live('click', userMoreInfo)
      .live('mousedown', userMoreInfoDown)
      .live('mouseup', userMoreInfoUp);

    /* search*/
    
    $('#search_users').autocomplete( "destroy" );
    $('#search_users')
      .autocomplete({
        source: function(req, resp) {
          var options = {
            container: '#tab-users',
            show: true,
            IsSearching: true,
            retrieveAssets: false,
            onlyLocatable: isLocatableSelected('tab-users')
          };
          if ($.trim(req.term) != '') 
          {
              
            storeSelected('tab-users');
            userSearch.autocomplete(req, resp, options);
          }
        },
        delay: 1000
      })
      .keyup(function(event) {
          var val = $(this).val();
          val = $.trim(val);

          if((val.length === 0) || (val == $.i18n.prop('general.Search'))) {
            
            $('#tab-users span.searchReset')
              .addClass('searchMagnifier')
              .removeClass('searchReset');
            if (event.keyCode != 32 && event.keyCode != 8) {
              storeSelected('tab-users');
              $('#tab-users .contents').empty();
              groups && groups.getGroupsList({}, true);
            }
          }
          else {
            $('#tab-users span.searchMagnifier')
              .removeClass('searchMagnifier')
              .addClass('searchLoading');
          }
      })
      .keypress(function(event) {
          if (event.keyCode == 27)
            {
              $(this).val('');
              $('#tab-assets span.searchReset')
              .addClass('searchMagnifier')
              .removeClass('searchLoading');
              $(this).val($.i18n.prop('general.Search'));
             
            }
        if (event.keyCode == 8 && $(this).val().length==1) {
          storeSelected('tab-users');
          $('#tab-users .contents').empty();
          groups && groups.getGroupsList({}, true);
        }
      })
      .blur(function(event) {
        var val = $(this).val();
        val = $.trim(val);

        if ((val.length === 0) || (val == $.i18n.prop('general.Search'))) {
          $(this).val($.i18n.prop('general.Search'));
          $('#tab-users span.searchReset')
            .addClass('searchMagnifier')
            .removeClass('searchReset');
        }
      });
    
    $('#tab-users span.searchReset').live('click', function() {
        $('#select_all_tab-users').removeAttr('checked');
        $('#search_users').val($.i18n.prop('general.Search')).keyup();
        
    });
    $('#search_assets').autocomplete( "destroy" );
    
    $('#search_assets').autocomplete({
        source: function(req, resp) {
          var options = {
            container: '#tab-assets',
            show: true,
            retrieveAssets: true,
            onlyLocatable: isLocatableSelected('tab-assets')
          };

          storeSelected('tab-assets');
          IsSearching = true;
          userSearch.autocomplete(req, resp, options);
          
        },
        delay: 1000
      })
      .keyup(function(event) {
          var val = $(this).val();
          val = $.trim(val);

          if((val.length === 0) || (val == $.i18n.prop('general.Search'))) {
            $('#tab-assets span.searchReset').addClass('searchMagnifier').removeClass('searchReset');
            if (event.keyCode != 32 && event.keyCode != 8) {
              storeSelected('tab-assets');
              $('#tab-assets .contents').empty();
              groups && groups.getGroupsList({}, false);
            }
          }else {
            $('#tab-assets span.searchMagnifier')
              .removeClass('searchMagnifier')
              .addClass('searchLoading');
          }
      })
      .keypress(function(event) {
        if (event.keyCode == 8 && $(this).val().length == 1) {
          $('#tab-assets .contents').empty();
          storeSelected('tab-assets');
          groups && groups.getGroupsList({}, false);
        }
      })
      .blur(function(event) {
        var val = $(this).val();
        val = $.trim(val);

        if ((val.length == 0) || (val == $.i18n.prop('general.Search'))) {
          $(this).val($.i18n.prop('general.Search'));

          $('#tab-assets span.searchReset')
            .addClass('searchMagnifier')
            .removeClass('searchReset');
        }

      });

    $('#tab-assets span.searchReset').live('click', function() {
      $('#search_assets').val($.i18n.prop('general.Search')).keyup();
    });
  }

  /* groups manager*/

  function groupCheck(e) {
    
    e.preventDefault();
    var el = $(this), data = el.data('group'),  container = data.options.container.substring(1), children, childrenLabel;
    var tab = 'tab-assets';
    if ($("#filter_all_tab-users")) tab = 'tab-users';
    if (isLocatableSelected(container)) {
      children = el.parents('li').find('ul.users >li.locatableItems ').children().find('.user:checkbox');
    } else {
      children = el.parents('li').find('ul.users >li ').children().find('.user:checkbox');
    }
    
    el.removeClass('js-locatable-all');
    if (el.is(':checked'))  {
      if (children.length > 0) {
        children.attr({checked: 'checked'});
        var grp = $('#' + tab + ' .contents li').find('.groupId.check-box:visible');
        var grpChecked = $('#' + tab + ' .contents li').find('.groupId.check-box:visible:checked');
        if (grp.length == grpChecked.length) $('#select_all_' + tab).attr({checked: 'checked'});
         /*if (checkbox.is(':visible') && (checkbox.attr('checked') == undefined || !checkbox.attr('checked')))*/
         /*    checkAll = false;*/
        
        /*arrangeGroups(tab);*/
      } else {
        if (isLocatableSelected(container)) el.addClass('js-locatable-all');
        OpenOnClick = false;
        toggleGroup(data.id, false,false);
        //if (!all) setTimeout('OpenOnClick = true;', 2500);
      }
    }
    else
    {
      children.removeAttr('checked');
      /* Tolgo il check da all*/
      $('#select_all_' + tab).removeAttr('checked');
    }
    countSelected(container);
    
  }

  function groupArrowClick(e) {
    var group = $(this).parent().parent().find('input').data('group');
    toggleGroup(group.id);
    e.preventDefault();
  }

  function groupLabelClick(e) {
    var id = $(this).attr('id').substring('label_g'.length);
    toggleGroup(id);
    e.preventDefault();
  }

  function toggleGroup(groupId, forceOpen, noToggle) 
  {
    if(noToggle==undefined) noToggle=true;
    
    var el = $('#open_group_details_' + groupId + ' img.openClose'),
        group = el.parent().parent().find('input').data('group'),
        options = group.options,
        id = groupId;
        
    var $subul = $('#group' + id).find('ul.users');
    if(forceOpen && options)  options.show=true;
    if ($subul.length === 0) 
    {
        if (OpenOnClick) el.attr('src', 'images/arrow_down.png');
        groups.getUsersInGroup(id, options);
        
    }
    else 
    {
        
      if (forceOpen) {
          /* disabilitato su riichiesta del cliente il 20/06/2012*/ 
        /* el.attr('src', 'images/arrow_down.png');*/
        /* $subul.show();*/
      }

      else 
      {
        /* commented autoopen 25 2 13*/
       if(noToggle) {
          if ($subul && $subul.is(':visible')) {
            el.attr('src', 'images/arrow_right.png');
          }
          else {
            el.attr('src', 'images/arrow_down.png');
          }
          $subul.toggle();
        }
      }
    }
  }

  function createGroup(group, options) {
    var $li = $('<li></li>').attr('id', 'group' + group.id);
    
    if(group.userCountLocatable === 0) {
      $li.addClass('noLocatableItems');
    }

    var $divc = $('<div class="group accordionStyles"></div>');
    var $input = $('<input type="checkbox" id="g' + group.id +'" value="' + group.id + '" class="groupId check-box">').data('group', group);

    /*group count display options*/
    var groupName = '<span class="groupName" id="groupName_' + group.id + '">' + group.name + '</span> <span class="groupUsercount"><span class="all_total_count">' + group.userSize + '</span><span class="all_locatable_count">' + group.userCountLocatable + '</span></span><span class="loader-group">';
    var $label = $('<span id="label_g' + group.id + '" class="groupNameContainer" />').html(groupName);

    if (isLocatableSelected(options.container.substring(1))) {
      $label.find('.all_total_count').hide();
    }
    else {
      $label.find('.all_locatable_count').hide();
    }

    var $openclose = $('<span class="openClose" id="open_group_details_' + group.id + '">&nbsp;&nbsp;</span>');
    /* if (group.userSize !== 0) { */
      $('<img class="openClose"/>')
        .appendTo($openclose)
        .attr('src', 'images/arrow_right.png');
    /* } */

    $divc.append($input);
    $divc.append($openclose);
    $divc.append($label);
    $li.append($divc);
    return $li;
  }

  /* user events*/

  function userCheck() {
    /* CLICK SINGOLO UTENTE*/
    var el = $(this),
        usr = el.data('user'),
        tab = usr.options.container.substring(1),
        group = usr.group_id;

    if (el.is(':checked')) {
      el.parent().css({backgroundColor: '#f4f4f4'});
    }
    else {
      $('#g' + group).removeAttr('checked');
      $('#select_all_' + tab).removeAttr('checked');
      el.parent().css({backgroundColor: 'transparent'});
    }
    countSelected(tab);
  }

  function userArrowClick(e) {
     e.stopImmediatePropagation();
    e.preventDefault();
    var id = $(this).parent().attr('id').substring('open_item_details_'.length);
    var container = $('#item_details_'+id);
    var buttons = $('#items_list_buttons_'+id);
    var mainContainer = $('#item_'+id);
    var itemName = $('#item_name_'+id);
    var $subul = $('#item_details_' +id +' li');
    if($subul && $subul.length === 0){
      user && user.getDetails(id, container);
      /*$(this).text('-');*/
      $(this).attr('src', 'images/arrow_down.png');
      container.show();
      buttons.show();
      mainContainer.addClass('groupElementExpanded');
      itemName.addClass('itemNameExpanded');
    }
    else{
      if($subul && $subul.is(':visible')){
        $(this).attr('src', 'images/arrow_right.png');
        container.hide();
        buttons.hide();
        mainContainer.removeClass('groupElementExpanded');
        itemName.removeClass('itemNameExpanded');
      }else{
        $(this).attr('src', 'images/arrow_down.png');
        container.show();
        buttons.show();
        mainContainer.addClass('groupElementExpanded');
        itemName.addClass('itemNameExpanded');
      }
    }
   
  }

  function locateUser(e) {
	if($(this).parent().hasClass('locked')){
		return false;
	}
    var id = $(this).attr('id').substring('locate_'.length);
    var element = $('#u'+id).data('user');
    user && user.locate(element, false, false);
    user.removeNotLocatableStatus(id);
    e.preventDefault();
  }

  function locateUserUp() {
    $(this).removeClass('map_buttons_left_panel_active');
  }

  function locateUserDown() {
    $(this).addClass('map_buttons_left_panel_active');
  }

  function userLocateClick(e) {
	
    var el = $(this);
    if (el.hasClass('locationInProgress')) {
      user && user.locateAbort(el.data('item').user_id);
    }
    else {
      user && user.locate(el.data('item'), false, false);
    }

    e.preventDefault();
  }

  function userLocateDown(e) {
    var el = $(this);

    if(el.hasClass('locationInProgress')){
      el.addClass('locationInProgressActive');
    }
    else {
      el.addClass('globalSearchButtonActive');
    }
  }

  function userLocateUp(e) {
    var el = $(this);

    if(el.hasClass('locationInProgressActive')) {
      el.removeClass('locationInProgressActive');
    }

    el.removeClass('globalSearchButtonActive');
    el.addClass('locationAvailableLeft');
  }


  function userNoLocateClick(e) {
    var el = $(this),
        usr = el.parents('.usersList').find('.user.check-box').data('user'),
        container = usr.options;
    if( el.hasClass('locked') ){
	    return false;
    }
	if($('.reqPermission').length != 1){
    	actionSelected("1", container, el.data('item'));
   }
    e.preventDefault();
  }

  function userNoLocateDown() {
    $(this).addClass('globalSearchButtonActive');
  }

  function userNoLocateUp() {
    $(this).removeClass('globalSearchButtonActive');
  }

  function userEnter() {
    var s = $(this).find('span.locate');
    s.css({
      display: 'inline-block',
      cssFloat: 'right',
      zoom: '1',
      '*display': 'inline'
    });

    if (s.not(':visible')) {
      s.fadeIn('fast');
    }
  }

  function userLeave() {
    var s = $(this).find('span.locate');

    if (s.is(':visible')) {
      s.fadeOut('fast');
    }
  }

  function userCreateReport(e) {
  	if($(".locationReportRequestPermission").length == 0){
	    var el = $(this),
	        usr = el.parents('.usersList').find('.user.check-box').data('user'),
	        container = usr.options,
	        id = el.attr('id').substring('create_report_'.length);
	        element = $('#u' + id);
	        
	        if($(this).parent().hasClass('locked')){
		        return false;
	        }
	        
	        actionSelected("7", container, usr);
	}
    e.preventDefault();
  }

  function userCreateReportDown() {
    $(this).addClass('map_buttons_left_panel_active');
  }

  function userCreateReportUp() {
    $(this).removeClass('map_buttons_left_panel_active');
  }

  function userSendMessage(e) {
        var el = $(this),
        usr = el.parents('.usersList').find('.user.check-box').data('user'),
        container = usr.options,
        id = el.attr('id').substring('send_message_'.length),
        element = $('#u' + id);
        if($(this).hasClass('locked')){
	        return false;
        }
		if( $("#tabs .tabsHolder .ui-state-active #btn_tab-assets").length == 1 ){
		
		}else{
			if($('.userSendMessage').length > 0){
				return false;
			}
		    actionSelected("6", container, element);
		}
    e.preventDefault();
  }

  function userSendMessageDown() {
    $(this).addClass('map_buttons_left_panel_active');
  }

  function userSendMessageUp() {
    $(this).removeClass('map_buttons_left_panel_active');
  }

  function userMoreInfo(e) {
  	if($(this).hasClass('locked')){
	  	return false;
  	}
    var el = $(this),
        usr = el.parents('.usersList').find('.user.check-box').data('user'),
        container = usr.options,
        id = $(this).attr('id').substring('more_info_'.length),
        element = $('#u' + id);

    actionSelected("3", container, element);
    e.preventDefault();
  }
  function userMoreInfoDown() {
    $(this).addClass('map_buttons_left_panel_active');
  }

  function userMoreInfoUp() {
    $(this).removeClass('map_buttons_left_panel_active');
  }
  function userLabelClick(e) {
    var id = $(this).attr('id').substring('item_name_'.length);
    $('#open_item_details_'+id+ ' img.openClose').click();
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

  function preventDefault(e) {
    e.preventDefault();
  }

  function createUser(usr, container) {
    console.log('usr',usr)
    console.log('container', container);
    
    var tab = container.substring(1);

    var $li = $("<li></li>");

    var $div = $('<div id="item_' + usr.user_id + '"></div>')
      .addClass('usersList')
      .addClass('groupElement');

    var $div1 = $('<div></div>')
      .addClass('container');

    var $checkbox = $('<input type="checkbox" id="u' + usr.user_id + '" value="' + usr.user_id + '" class="user check-box" fullName="' + unescape(usr.fullName) + '">')
      .data('user', usr);

    var $ulExpanded = $('<ul id="item_details_' + usr.user_id + '" class="item_details"></ul>')
      .css('line-height', '1em')
      .css('padding-left', '0')
      .hide();

    var $openclose = $('<span id="open_item_details_' + usr.user_id + '"></span>').addClass('openClose');

    $('<img src="images/arrow_right.png" class="openClose"/>').appendTo($openclose);
      
      /* USER HANDLING */
    var pointerLocate = 'pointer';
		var opacityLocate =1;
		var messageLocate = $.i18n.prop('globalsearch.showonmap');
		if(usr.permissions && usr.permissions.hasLocatePermission === false){
			opacityLocate = 0.5;
			pointerLocate = 'default';
			messageLocate = $.i18n.prop('warning.no.locate.permission');
		}
		var opacityReport =1;
    var pointerReport = 'pointer';
    var messageReport = $.i18n.prop('user.action.createReport');
		if(usr.permissions && usr.permissions.hasCreateReportPermission === false || userConf.rights.request_location_report === false){
			opacityReport = 0.5;
			pointerReport = 'default';
			messageReport = $.i18n.prop('permission.required.report');
		}
		var opacityMessage =1;
		var lockMessage=''
		var message = $.i18n.prop('tooltipmain.SendMessage');
		var pointerMessage = 'pointer';
		if(userConf.rights.send_messages === false){
			opacityMessage = 0.5;
			lockMessage = 'locked';
			message = $.i18n.prop('permission.required.messages')
			pointerMessage = 'default';
		}
		var notLoc = ''
		if(usr.permissions.locatable==false){	
				notLoc ='locked';
				opacityLocate = 0.5;
				pointerLocate = 'default';
			}
			
    var $ulExpandedButtons = $('<ul id="items_list_buttons_' + usr.user_id + '" class="items_list_buttons clearfix"></ul>')
      .hide()
      .append($('<li class="first '+notLoc+'" title="'+$.i18n.prop('globalsearch.showonmap')+'"></li>')
        .attr({
        	'class': function() {if(usr.permissions && usr.permissions.hasLocatePermission == false ) return 'icon locked first';},
        	'title': messageLocate
        })
        .html($('<a href="#" class="map_buttons_left_panel" style="cursor:'+pointerLocate+'" name="btn_item_locate" class="'+notLoc+'" id="locate_' + usr.user_id + '"><span></span></a>'))
        .css({
	        'opacity' : opacityLocate
        })
      )
      .append($('<li class="second" title="'+$.i18n.prop('user.action.createReport')+'"><a href="#" style="cursor:'+pointerReport+'" class="map_buttons_left_panel" name="btn_item_create_report" id="create_report_' + usr.user_id + '"><span></span></a></li>').data('item', usr)
        .attr({
        	'class': function() {if(usr.permissions && usr.permissions.hasCreateReportPermission == false || userConf.rights.request_location_report === false) return 'icon locked second';},
        	'title':messageReport
        	})
        .css({
	        'opacity' : opacityReport
        })
      )
      .append($('<li class="third" title="'+$.i18n.prop('tooltipmain.SendMessage')+'"><a href="#"  style="cursor:'+ pointerMessage+'" class="map_buttons_left_panel '+lockMessage+'" name="btn_item_send_message" id="send_message_' + usr.user_id + '"><span></span></a></li>')
		.css({
		    'opacity' : opacityMessage
		}).attr('title',message)
      )
      .append($('<li class="last" title="'+$.i18n.prop("buttons.user.details")+'"><a href="#" class="map_buttons_left_panel" name="btn_item_more_info" id="more_info_' + usr.user_id + '"><span></span></a></li>')
      )
      .append($('<li class="fifth" title="'+$.i18n.prop("shareMyLocation.title")+'"><a href="#" onClick="shareMyLocationAction(\'#tab-users\' ,'+usr.user_id+'); return false;" class="share_my_location" name="share_my_location" id="share_my_location' + usr.user_id + '"><span></span></a></li>')
      );
		
	
		
      /* ASSET HANDLING */		
      
    var pointerLocateAsset = 'pointer';
		var opacityLocateAsset =1;
		var messageLocateAsset = $.i18n.prop('globalsearch.showonmap');
		var addClassLocked = '';
		if(usr.permissions && usr.permissions.hasLocatePermission === false || usr.permissions && usr.permissions.trackable == false){
			opacityLocateAsset = 0.5;
			pointerLocateAsset = 'default';
			messageLocateAsset = $.i18n.prop('warning.no.locate.permission');
			addClassLocked = 'locked';
		}
		var opacityReportAsset =1;
      	var pointerReportAsset = 'pointer';
      	var messageReportAsset = $.i18n.prop('user.action.createReport');
		if(usr.permissions && usr.permissions.hasCreateReportPermission === false){
			opacityReportAsset = 0.5;
			pointerReportAsset = 'default';
			messageReportAsset = $.i18n.prop('permission.required.report');
		}	
      
	var $ulExpandedButtonsAsset = $('<ul id="items_list_buttons_' + usr.user_id + '" class="items_list_buttons clearfix"></ul>')
      .hide()
      .append($('<li class="first" title="Locate"></li>')
        .attr({
        	'class': function() {if(usr.permissions && usr.permissions.hasLocatePermission == false || usr.permissions && usr.permissions.trackable == false ) return 'icon locked first';},
        	'title': messageLocateAsset
        })
        .html($('<a href="#" class="map_buttons_left_panel" style="cursor:'+pointerLocateAsset+'" name="btn_item_locate" id="locate_' + usr.user_id + '"><span></span></a>'))
        .css({'opacity':opacityLocateAsset})
      )
      .append($('<li class="second" title="Create Report"><a href="#" style="cursor:'+pointerReportAsset+'" class="map_buttons_left_panel" name="btn_item_create_report" id="create_report_' + usr.user_id + '"><span></span></a></li>').data('item', usr)
        .attr({
        	'class': function() {if(usr.permissions && usr.permissions.hasCreateReportPermission == false) return 'icon locked second';},
        	'title': messageReportAsset
        	})
        .css({'opacity':opacityReportAsset})
      )
      .append($('<li class="third disabled" title="You Can not Send Message to Assets"><a href="#" style="cursor:default;" class="map_buttons_left_panel" name="btn_item_send_message" id="send_message_' + usr.user_id + '"><span></span></a></li>')
      	.css("opacity",0.5)
      	.attr("href" , "")
      )
      .append($('<li class="last" title="User Details"><a href="#" class="map_buttons_left_panel '+addClassLocked+'" style="cursor:'+pointerLocateAsset+'" name="btn_item_more_info" id="more_info_' + usr.user_id + '"><span></span></a></li>')
        .css({'opacity':opacityLocateAsset})
      );
	
	
	
    var $span1 = $('<span id="item_name_' + usr.user_id + '">'+ (unescape(usr.fullName) || ' ') +'</span>')
      .mouseenter(userLabelEnter)
      .mouseleave(userLabelLeave)
      .click(userLabelClick);

    var $span2 = $('<a href="#"></a>')
      .data('item', usr)
      .addClass('globalSearchButton');

    var $innerSpan1 = $('<span>' + $.i18n.prop('globalsearch.showonmap') + '</span>')
      .addClass('globalSearchText')
      .addClass('locationAvailableRight');
    $span2.append($innerSpan1);


    /* availability icons - START */
    if (usr.permissions && usr.permissions.hasLocatePermission && usr.permissions.locatable) {
      /* && usr.permissions.currentLocationAvailable==true){*/
      $li.addClass('locatableItems');
      $span2
        .click(userLocateClick)
        .mousedown(userLocateDown)
        .mouseup(userLocateUp);
    }
    else if(usr.permissions.hasLocatePermission == false && usr.permissions.hasPendingPermissionRequest == false) {
      $li.addClass('noLocatableItems');

      $span2
        .addClass('reportNotAvailableLeft')
        .removeClass('reportAvailableLeft')
        .click(userNoLocateClick)
        .mousedown(userNoLocateDown)
        .mouseup(userNoLocateUp);
        if(userConf.rights.request_current_location === false || usr.options.type === false){
	        $span2.addClass('locked').css('opacity',0.5);
	        $span2.attr('title',$.i18n.prop('permission.required.request'));
        }

      $innerSpan1
        .text($.i18n.prop('globalsearch.requestPermission'))
        .addClass('reportNotAvailableRight')
        .removeClass('reportAvailableRight')
        .mousedown(userNoLocateDown)
        .mouseup(userNoLocateUp);
    }
    else if(usr.permissions.hasPendingPermissionRequest == true) {
      $li.addClass('noLocatableItems');

      $span2
        .addClass('pendingRequestLeft')
        .click(preventDefault)
        .mousedown(userNoLocateDown)
        .mouseup(userNoLocateUp);

      $innerSpan1
        .text($.i18n.prop('globalsearch.pendingRequest'))
        .addClass('pendingRequestRight')
        .mousedown(userNoLocateDown)
        .mouseup(userNoLocateUp);

    }else if(usr.permissions.locatable==false){/* || usr.permissions.currentLocationAvailable==false){*/
      $li.addClass('noLocatableItems');

      $span2.
      click(preventDefault)
      .addClass('locationNotAvailableLeft')
      .removeClass('locationAvailableLeft');

      $innerSpan1
        .text($.i18n.prop('globalsearch.notlocatable'))
        .addClass('locationNotAvailableRight')
        .removeClass('locationAvailableRight');
    }
    /* availability icons - STOP */

    $div1.append($checkbox);
    $div1.append($openclose);
    $div1.append($span1);
    $div1.append($span2);
    $div1.append($ulExpanded);
    if( $("#tabs .tabsHolder .ui-state-active #btn_tab-assets").length == 1 ){
    	$div1.append($ulExpandedButtonsAsset);
    }else{
	    $div1.append($ulExpandedButtons);
    } 

    $div.append($div1);
    $li.append($div);
	

    /* check me if my group is checked*/

    if (isSearching(tab)) {
      if ($('#select_all_' + tab).is(':checked')) {
        $checkbox.attr('checked', 'checked');
      }
    }
    else {
      groupCheckBox = $('#g' + usr.group_id);

      if (groupCheckBox.is(':checked')) {
        if ((!groupCheckBox.hasClass('js-locatable-all')) || (usr.permissions && usr.permissions.hasLocatePermission && usr.permissions.locatable)) {
          $checkbox.attr('checked', 'checked');
        }
      }
    }
    return $li;
  }

  /* global events*/

  function filterAllChange() {
    var tab = this.id.replace('filter_all_', '');
    filterLocatable(tab);
    arrangeGroups(tab);
    countSelected(tab);
    if (tab === '#tab-users' && $('#search_users').val().length > 0 && $('#search_users').val() != $.i18n.prop('general.Search')) {
      $('#search_users').autocomplete( "search", $('#search_users').val() );
    }
    else if(tab === '#tab-assets' && $('#search_assets').val().length > 0 && $('#search_assets').val() != $.i18n.prop('general.Search')) {
      $('#search_assets').autocomplete( "search", $('#search_assets').val() );
    }
  }



  function selectAllChange() 
  {
    var all = true;
      
    /*from label click*/
    var userDiv = $('.users .container'),
        tab = this.id.replace('select_all_',''),
        groups = $('#' + tab + ' .contents input[type=checkbox]:visible');
    
    var rem = false;
    if ($(this).is(':checked')) 
    {
      userDiv.css({backgroundColor: '#f4f4f4'});
      groups.attr('checked', 'checked');
    } else {
        userDiv.css({backgroundColor: '#ffffff'});
        groups.removeAttr('checked');
        rem = true;
    }
    groups.trigger('change');
    OpenOnClick = false;
    arrangeGroups(tab);
    countSelected(tab);
    setTimeout('all = false;', 2500);
    if ( rem && $('#search_users').val() != '')
        $(this).removeAttr('checked');
    }

  /* generic functions*/
  function isLocatableSelected(tab) {
    return ($('#filter_all_' + tab).selectmenu('value') == 2)
  }
  function filterLocatable(tab) {
    var isLocatable = isLocatableSelected(tab),
    container = $('#' + tab);
    container.find('.all_total_count').toggle(!isLocatable);
    container.find('.all_locatable_count').toggle(isLocatable);
    container.find('.noLocatableItems').toggle(!isLocatable);
  }
  function countSelectedStandard(tab) {
    
    var count = 0,isLocatable = isLocatableSelected(tab),groups, group, groupCount, children;
    groups = $('#' + tab + ' .contents li');
    if (isLocatableSelected(tab)) {
          children = groups.find('ul.users').children().filter('.locatableItems').find('.user:checkbox');
        } else {
          children = groups.find('ul.users').children().find('.user:checkbox');
        }
    return (children.length > 0) ? children.filter(':checked').length : 0;
  }
  


  function countSelectedInSearch(tab) {
    var count;
    if (isLocatableSelected(tab)) {
      count = $('ul.users > li.locatableItems .user.check-box:checked').length;
    } else {
      count = $('ul.users .user.check-box:checked').length;
    }
    return count;
  }

  function isSearching(tab) {
    return $('#search_users').val() != $.i18n.prop('general.Search');
  }

  function countSelected(tab) {
    var isTabUsers= (tab=="tab-users");
    var isTabAsset= (tab=="tab-assets");
    var count, label;
    
    if(isSearching(tab)) {
      count = countSelectedInSearch(tab);
    } else {
      count = countSelectedStandard(tab);
    }
      var ArrayUser = utils && utils.getChecked("#"+tab + ' input:checked', 'user');
      var ArrayGroup = utils && utils.getChecked("#"+tab + ' input:checked', 'groupId');
      /*getCheckedUsers('user');*/
      var howManyUser = ArrayUser.length;
      var howManyGroup = ArrayGroup.length;

      if (isTabUsers) {
        
        
        if(howManyUser === 1){
          $('#userActionList2-button').show();        
          $('#userActionList-button, #userActionList3-button, #userActionList4-button, #userActionList5-button, #userActionList6-button').hide();
        }else if (howManyUser > 1 && howManyGroup === 0){
          $('#userActionList4-button').show();
          $('#userActionList-button, #userActionList2-button, #userActionList3-button, #userActionList5-button').hide();
        }else if(howManyUser === 1 && howManyGroup === 1){
          $('#userActionList6-button').show();
          $('#userActionList-button, #userActionList2-button, #userActionList3-button, #userActionList4-button, #userActionList5-button, #userActionList6-button').hide();
        }else if(howManyUser > 0 && howManyGroup === 1){
          $('#userActionList5-button').show();
          $('#userActionList-button, #userActionList2-button, #userActionList3-button, #userActionList4-button, #userActionList6-button').hide();
        }else if(howManyUser > 0 && howManyGroup > 0){
          $('#userActionList3-button').show();
          $('#userActionList-button, #userActionList2-button, #userActionList4-button, #userActionList5-button, #userActionList6-button').hide();
        } else {
          $('#userActionList-button').show();        
          $('#userActionList2-button, #userActionList3-button, #userActionList4-button, #userActionList5-button, #userActionList6-button').hide();
        } 
      } else {
      /* TAB ASSETS */
      
      
    }
    //}
    
    var ArrayUserLocatable = utils && utils.getChecked("#"+tab + ' input:checked', 'user',true);
    var howManyUserLocatable = ArrayUserLocatable.length;

    
    if(count == 0 || count > request_limit) {
      $('#btn_' + tab + '_showOnMap').addClass('locate_off');
      $('#btn_' + tab + '_showOnMap span').attr('title', 'You can locate max '+request_limit+' people / assets at a time');
    } else if(howManyUserLocatable > 0 && count <= request_limit) {
      $('#btn_' + tab + '_showOnMap').removeClass('locate_off');
      $('#btn_' + tab + '_showOnMap span').attr('title', 'Locate');
    }

    /* multi user button active/inactive*/

    if (howManyUserLocatable > 0) {
      $('#' + tab + ' .multi_user_button_inactive').removeClass('multi_user_button_inactive').addClass('multi_user_button');
      if(tab == "tab-assets"){
		      $('#btn_tab-assets_sendMessage').removeClass('multi_user_button').addClass('multi_user_button_inactive');
    	}
    } else {
      $('#' + tab + ' .multi_user_button').removeClass('multi_user_button').addClass('multi_user_button_inactive');
    }

    if(tab === 'tab-assets') {
      label = $.i18n.prop('mesage.selected.assets');
    } else {
      label = $.i18n.prop('mesage.selected.users');
    }

    $('#' + tab + '_count').text(count + ' ' + label).attr('title',count + ' ' + label);
    if(userConf.rights.send_messages === false){
	    $('#btn_tab-users_sendMessage').removeClass('multi_user_button').addClass('multi_user_button_inactive');
    }

  }

  function arrangeGroups(tab) {
    var i, len, groups, group, groupId, checkbox, selectAll;

    groups = $('#' + tab + ' .contents li');
    
    var checkAll = true;
    
    for(i = 0, len = groups.length; i < len; i++) {
      group = groups.eq(i);
      
      checkbox = group.find('.groupId.check-box');
      
      
      if (checkbox.length > 0) {
          
         if (checkbox.is(':visible') && (checkbox.attr('checked') == undefined || !checkbox.attr('checked')))
             checkAll = false;
          
        groupId = checkbox.attr('id').replace(/^g/, '');

        if (isLocatableSelected(tab)) {
          children = group.find('ul.users').children().filter('.locatableItems').find('.user:checkbox');
        }
        else {
          children = group.find('ul.users').children().find('.user:checkbox');
        }
        
        if (children.length > 0) {
          checkedChildren = children.filter(':checked');
          if (checkedChildren.length == children.length) {
            /* ho selezionato tutti i figli, seleziono checkbox*/
            
            checkbox.attr({checked: 'checked'});
          }
          else {
            /* non tutti i figli sono selezionati: deseleziono checkbox*/
            checkbox.removeAttr('checked');


            if (checkedChildren.length > 0) {
              /* ho selezionato almeno un figlio: apro l'accordion*/
              toggleGroup(groupId, true);
            }
          }

        }

      }
    }
    
    groups = groups.filter(':visible');
    
    selectAll = $('#select_all_' + tab);
    var groups_visible =   groups.filter(':visible').find('.group');
    var groups_visible_checked = groups_visible.find('input[type=checkbox]:checked');
       
       
       
      if (checkAll && groups_visible_checked.length > 0 && groups_visible.length == groups_visible_checked.length) {
          selectAll.attr({checked: 'checked'});
      } else {
          
          /* Controllo se è stata fatta una ricerca, non ci sono gruppi ma ci sono utenti selezionati*/
          var users_visible =   groups.filter(':visible').find('.user');
          var users_visible_checked = $('.users .user.check-box:checked');
          if (checkAll && users_visible.length > 0 && users_visible.length == users_visible_checked.length) {
                selectAll.attr({checked: 'checked'});
            } else {
                selectAll.removeAttr('checked');
            }
      }
      
      procedi = true;
      
  }
  
  function storeSelected(tab) {
    if (!isSearching(tab)) {
      storeSelectedInSearch(tab);
    } else {
      storeSelectedStandard(tab);
    }
  }

  function storeSelectedStandard(tab) {
    var groups, group, i, len, j, lenj, checkbox, children, groupId, user, userId;
    groups = $('#' + tab + ' .contents li');

    for(i = 0, len = groups.length; i < len; i++) {
      group = groups.eq(i);
      checkbox = group.find('.groupId.check-box');
      if (checkbox.length > 0) {
        groupId = checkbox.attr('id').replace(/^g/, '');
        children = group.find('ul.users').children().find('.user:checkbox');

        if (children.length > 0) {

          if (! (groupId in selectedUsers.groups)) {
            selectedUsers.groups[groupId] = {};
          }
          else {
            if ('all' in selectedUsers.groups[groupId]) {
              delete selectedUsers.groups[groupId].all;
            }
          }

          if (children.filter(':checked').length > 0) {

            for (j = 0, lenj = children.length; j < lenj; j++) {
              user = children.eq(j);
              userId = user.attr('id').replace(/^u/, '');

              if (user.is(':checked')) {
                selectedUsers.groups[groupId][userId] = true;
              }
              else {
                if (userId in selectedUsers.groups[groupId]) {
                  delete selectedUsers.groups[groupId][userId];
                }
              }
            }
          }
          else {
            delete selectedUsers.groups[groupId];
          }
        }
        else {
          if (checkbox.is(':checked')) {
            selectedUsers.groups[groupId] = {all: true}
          }
        }
      }
    }
  }

  function storeSelectedInSearch(tab) {
    var users, i, len, user, userData, groupId, userId;

    users = $('#' + tab + ' .users .user.check-box');

    for(i = 0, len = users.length; i < len; i++) {
      user = users.eq(i);
      userData = user.data('user');
      groupId = userData.group_id;
      userId = userData.user_id;

      if (! (groupId in selectedUsers.groups)) {
        selectedUsers.groups[groupId] = {};
      }

      if (user.is(':checked')) {
        selectedUsers.groups[groupId][userId] = true
      }
      else {
        if ('all' in selectedUsers.groups[groupId]) {
          delete selectedUsers.groups[groupId].all;
        }

        if (userId in selectedUsers.groups[groupId]) {
          delete selectedUsers.groups[groupId][userId];
        }
      }
    }
  }

  function restoreSelected(tab) {
    if (isSearching(tab)) {
      restoreSelectedInSearch(tab);
    }
    else {
      restoreSelectedStandard(tab);
    }
  }

  function restoreSelectedInSearch(tab) {
    var users, i, len, user, userData, groupId, userId;

    users = $('#' + tab + ' .users .user.check-box');

    for(i = 0, len = users.length; i < len; i++) {
      user = users.eq(i);
      userData = user.data('user');
      groupId = userData.group_id;
      userId = userData.user_id;

      if (groupId in selectedUsers.groups) {
        if(selectedUsers.groups[groupId].all || selectedUsers.groups[groupId][userId]) {
          user.attr({checked: 'checked'});
        }
      }
    }
  }

  function restoreSelectedStandard(tab) {
    var groups, group, i, len, j, lenj, checkbox, children, groupId, user, userId;

    groups = $('#' + tab + ' .contents li');

    for(i = 0, len = groups.length; i < len; i++) {
      group = groups.eq(i);
      checkbox = group.find('.groupId.check-box');

      if (checkbox.length > 0) {
        groupId = checkbox.attr('id').replace(/^g/, '');

        if (groupId in selectedUsers.groups) {

          if (selectedUsers.groups[groupId].all) {
            checkbox.attr({checked: 'checked'});
          }
          else {
            children = group.find('ul.users').children().find('.user:checkbox');

            if (children.length > 0) {
              restoreSelectedInGroup(groupId);
            }
            else {
              for (u in selectedUsers.groups[groupId]) {
                if (selectedUsers.groups[groupId].hasOwnProperty(u))
                {
                    procedi = false;
                  toggleGroup(groupId);
                  return;
                }
              }
            }
          }
        }
      }
    }
  }

  function restoreSelectedInGroup(groupId) {
    var group, children, user, userId, i, len;

    group = $('#group' + groupId);
    children = group.find('ul.users').children().find('.user:checkbox');

    for(i = 0, len = children.length; i < len; i++) {
      user = children.eq(i);
      userId = user.attr('id').replace(/^u/, '');

      if (userId in selectedUsers.groups[groupId]) {
        user.attr({checked: 'checked'});
      }
    }
  }

  /* public functions*/

  function getGroupsList(options, type){
    groups.list = {};
    options = options || {};
    options.success = groups.getGroupsListOnSuccess;
    options.async = true;
    options.extra = {
      type: type,
      container: options.container || ((type === groups.type.user) ? '#tab-users' : '#tab-assets')
    };
    options.data = {
      includeUserDetails: true,
      includeAssetGroups: true
    };
    utils && utils.lbasDoGet(groups.listGroupsURL, options);
  }

  function getGroupsListOnSuccess(data, textStatus, jqXHR, options) {

    if(data) {
      var groupsList = data.userGroups;
      var actionList = data.userActionList;
      groups.list = groupsList;
      groups.actionList = actionList;
      actionList && user && user.getAvailableActions(actionList, false, options.type);

      if($.isArray(groupsList)) {
        var $ul = $('<ul></ul>').data('group.actionList', actionList);
        for(var i = 0, len = groupsList.length; i < len; i++) {
          var group = groupsList[i];
/*           if(group.userSize > 0) { */
            group.options = options;
            var isAssetGroup = group.assetGroup;
            var queue = false;
            if (options.type === groups.type.user) {
              queue = !isAssetGroup;
            }
            else if (options.type === groups.type.asset) {
              queue = isAssetGroup;
            }
            if(queue) {
              group.userCountLocatable = 0;
              $.each(group.users, function() {
                if(this.locatable){
                  group.userCountLocatable++;
                }
              });
              var $li = createGroup(group, options);
              $ul.append($li);
            }
          /* } */
        }
        /* groupsList for loop*/
        $(options.container + ' .contents').append($ul);
      }
    }
    else {
      $(options.container + ' .contents').html($.i18n.prop('globalsearch.noResults'));
    }
    restoreSelected(options.container.substring(1));
    
  }

  /* fill del dettaglio del gruppo*/
  function getUsersInGroup(groupID, opts) {
    var params = [];
    params.push({'name': 'groupId', 'value': groupID});
    params.push({'name': 'timestamp', 'value': new Date().getTime()});
    var options = {};
    options.extra = opts;
    options.success = function(data, textStatus, jqXHR, options) {
      window.setTimeout(function(){
        groups.getUsersInGroupOnSuccess(data, textStatus, jqXHR, options);
      }, 1);
    }
    options.async = false;
    options.data = params;

    $('#group' + groupID).find('span.loader-group').show();
    utils && utils.lbasDoGet(groups.groupUSersURL, options);
  }

  function getUsersInGroupOnSuccess(data, textStatus, jqXHR, options) {
    var showOnlyLocatable, container, tab, parent, usersList;
    container = options.container;
    tab = container.substring(1);
    if(data) {
      parent = $(data.groupId ? '#group' + data.groupId : container + ' .contents');
      parent.find('span.loader-group').hide();
      usersList = data.groupUsers;
      showOnlyLocatable = isLocatableSelected(tab);

      if ($.isArray(usersList)) {
        /* $(parent).empty();*/

        if (usersList.length === 0) {
          var $ul = $('<ul class="users"></ul>');
          var $li = $("<li></li>")
            .append('<div class="groupElement"><div class="container">' + $.i18n.prop('globalsearch.noResults') + '</div></div>')
            .appendTo($ul);

          $(container + ' .contents').append($ul);
        }
        else {

          var $ul = $("<ul></ul>").addClass('users').hide();

          for(var i=0; i < usersList.length; i++) {
            var usr = usersList[i];
            var permissions = data.usersCurrentLocationPermissionStatuses && data.usersCurrentLocationPermissionStatuses[usr.user_id];
            usr.permissions = permissions || usr.usersCurrentLocationPermissionStatuses;
            usr.options = options;

            if (usr.fullName && usr.fullName.length > 0) {
              var $li = createUser(usr, container);
              $ul.append($li);
            }
          }

          parent.append($ul);
          localize && localize.itemDetails();
          if (!options || options.show !== false) {
            $(container + ' .contents').show();
            if (OpenOnClick || options.IsSearching) $ul.show();
          }
          if (showOnlyLocatable) {
            $(container + ' .noLocatableItems').hide();
          } else {
            $(container + ' .noLocatableItems').show();
          }
        }
      }
    }
    procedi = true;
    
    setTimeout(function(){arrangeGroups('tab-users')}, 500);
    restoreSelected(tab);
    countSelected(tab);
    
  }

  window.groups = {
    setup: setup,
    listGroupsURL: "listGroups.action",
    groupUSersURL: "groupUsers.action",
    type: {
      asset:false,
      user: true
    },
    list: {},
    getGroupsList: getGroupsList,
    getGroupsListOnSuccess: getGroupsListOnSuccess,
    getUsersInGroup: getUsersInGroup,
    getUsersInGroupOnSuccess: getUsersInGroupOnSuccess
  };

})();