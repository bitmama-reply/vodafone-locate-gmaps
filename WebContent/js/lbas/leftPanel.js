var leftPanel = {};

leftPanel.tabUsers = {"id": 0, "label": "Users"};
leftPanel.tabAssets = {"id": 1, "label": "Assets"};
leftPanel.tabPlaces = {"id": 2, "label": "Places"};
leftPanel.tabRoutes = {"id": 3, "label": "Routes"};
leftPanel.tabGeofences = {"id": 4, "label": "Geofences"};

leftPanel.tabPlacesSubTabs;
leftPanel.tabRoutesSubTabs;

leftPanel.tabRoutes.loaded = false;

leftPanel.tabs;

leftPanel.init = function(element){
	if(element){
		leftPanel.tabs = $(element).tabs({
			show: function(event, ui) {
				var html = $('#' + ui.panel.id + ' .contents').html();
				var load = false;
				if($.trim(html).length===0){
					load = true;
				}
				$('.tabsHolder ul li').removeClass('prev-then-selected');
				var $prev = $('#' + ui.tab.id).parent().prev();
				$prev.addClass('prev-then-selected');
				switch (ui.index){
					case leftPanel.tabUsers.id:
						load && groups && groups.getGroupsList({}, true);
						break;
					case leftPanel.tabAssets.id:
						load && groups && groups.getGroupsList({}, false);
						$("#btn_tab-assets_sendMessage span").attr("title", $.i18n.prop('assetsMessageTooltip'));
						break;	
					case leftPanel.tabPlaces.id:
						load && leftPanel.initPlacesSubTabs(ui.panel);
							$('#editCategoryGroupAction span').text($.i18n.prop('category.edit'));
							$('#editCategoryGroupActionPer span').text($.i18n.prop('category.edit'));	
						
						$('#actionMultipleEnterprise').selectmenu({
					      change: function() {
						      actionSelected( $('#actionMultipleEnterprise').val());
					      }
					    });
						$('#actionMultipleEnterprise2').selectmenu({
					      change: function() {
						      actionSelected( $('#actionMultipleEnterprise2').val());
					      }
					    });
						$('#actionMultipleEnterprise3').selectmenu({
					      change: function() {
						      actionSelected( $('#actionMultipleEnterprise3').val());
					      }
					    });
					    $('#actionMultipleEnterprise2-button, #actionMultipleEnterprise3-button').hide();						
						if(userConf.rights.view_enterprise_locations===false){
							$('#tab-places .subtabsCover .second').addClass('ui-state-disabled');
						}			
						break;
					case leftPanel.tabRoutes.id:
						load && leftPanel.initRoutesSubTabs(ui.panel);
						break;
				}
				
		    },
		    cache: true,
		    opacity: 'toggle'
		});
	}
	
	localize && localize.mapTabs();

	//custom select
    $("#filter_all_tab-users").selectmenu({
      change: function() {
        $('#filter_all_tab-users').change();
      }
    });
    $("#filter_all_tab-assets").selectmenu({
      change: function() {
        $('#filter_all_tab-assets').change();
      }
    });
    
    
    
    /* USER MENU FUNCTIONALITY */
    $('#userActionList, #userActionList2, #userActionList3, #userActionList4, #userActionList5, #userActionList6, #actionMultipleAsset, #actionMultipleAsset2, #actionMultipleAsset3, #actionMultipleAsset4, #actionMultipleAsset5, #actionMultipleAsset6, #actionMultipleEnterprise, #actionMultipleEnterprise2, #actionMultipleEnterprise3').append('<option class="generalActions" value="-1">' + $.i18n.prop('general.actions') + '</option>');
    
    if(userConf.rights.create_edit_users){
		$('#userActionList, #userActionList2, #userActionList3, #userActionList4, #userActionList5, #userActionList6').append('<option value="2" class="userActionList2">'+ $.i18n.prop('user.actionList.2') +'</option>');
		$('#userActionList2, #userActionList3, #userActionList4, #userActionList5, #userActionList6').append('<option class="userActionList11" value="8">' + $.i18n.prop('user.actionList.8') + '</option>');
		$('#userActionList2').append('<option class="userActionList11" value="9">' + $.i18n.prop('user.actionList.9') + '</option>');
		$('#userActionList2, #userActionList3, #userActionList4, #userActionList6').append('<option class="userActionList10" value="10">' + $.i18n.prop('user.actionList.10') + '</option>');
		
		$('#actionMultipleAsset2, #actionMultipleAsset4').append('<option class="userActionList22" value="22">' + $.i18n.prop('user.actionList.22') + '</option>'); //edit asset

		
    }
    if(userConf.rights.create_edit_groups){
		$('#userActionList, #userActionList2, #userActionList3, #userActionList4, #userActionList5, #userActionList6').append('<option value="4" class="userActionList4">'+ $.i18n.prop('user.actionList.4') +'</option>');
		$('#userActionList2, #userActionList5').append('<option class="userActionList5" value="5">' + $.i18n.prop('user.actionList.5') + '</option>');

		$('#actionMultipleAsset ,#actionMultipleAsset2, #actionMultipleAsset3, #actionMultipleAsset4, #actionMultipleAsset5, #actionMultipleAsset6').append('<option class="userActionList20" value="20">' + $.i18n.prop('user.actionList.4') + '</option>'); //create group
		$('#actionMultipleAsset2, #actionMultipleAsset4, #actionMultipleAsset5, #actionMultipleAsset6').append('<option class="userActionList21" value="21">' + $.i18n.prop('user.actionList.21') + '</option>'); //delete asset
		$('#actionMultipleAsset2, #actionMultipleAsset4, #actionMultipleAsset5').append('<option class="userActionList24" value="24">' + $.i18n.prop('user.actionList.5') + '</option>');	//edit group
/* 		$('#actionMultipleAsset2, #actionMultipleAsset3').append('<option class="userActionList10" value="23">' + $.i18n.prop('user.actionList.10') + '</option>'); //move to new group */
    }
    if(userConf.rights.request_location_report){    
	    $('#userActionList2, #userActionList3, #userActionList4, #userActionList5, #userActionList6').append('<option class="userActionList1" value="1">' + $.i18n.prop('user.actionList.1') + '</option>');
	}
	
    if(userConf.rights.request_location_report){
		
	}
    $('#userActionList2, #userActionList3, #userActionList4, #userActionList5, #userActionList6').append('<option class="userActionList11" value="11">' + $.i18n.prop('user.actionList.11') + '</option>');
    
	$('#userActionList').selectmenu({
      change: function() {
	      actionSelected( $('#userActionList').val());
      }
    });

	$('#userActionList2').selectmenu({
      change: function() {
	      actionSelected( $('#userActionList2').val());
      }
    });
    $('#userActionList3').selectmenu({
      change: function() {
	      actionSelected( $('#userActionList3').val());
      }
    });
    $('#userActionList4').selectmenu({
      change: function() {
	      actionSelected( $('#userActionList4').val());
      }
    });
    $('#userActionList5').selectmenu({
      change: function() {
	      actionSelected( $('#userActionList5').val());
      }
    });
	$('#userActionList6').selectmenu({
      change: function() {
	      actionSelected( $('#userActionList6').val());
      }
    });

          
    $('#userActionList2-button, #userActionList3-button, #userActionList4-button, #userActionList5-button, #userActionList6-button').hide();
};

leftPanel.initPlacesSubTabs = function(element){
	leftPanel.tabPlacesSubTabs = $(element).find('.subtabs').tabs({
		cache: true,
		opacity: 'toggle',
		show: function(event, ui){
			var html = $('#'+$(ui.panel).attr('id') + ' .contents').html();
      		$('#search_places').val('');
      		$('.searchLoading').hide();
			var load = false;
			if($.trim(html).length===0){
				load = true;
			}
			switch (ui.index){
				case 1:
					load && places && places.getEnterprise();
					if($('#btn_places_search_reset').is(':visible')){$('#btn_places_search_reset').click();}
					$('#btn_tab-places_newCategory').removeClass('multi_user_button_inactive').addClass('multi_user_button');
					if(userConf.rights.create_enterprise_categories === false){
						$('#btn_tab-places_newCategory').removeClass('multi_user_button').addClass('multi_user_button_inactive');
					}
				break;
				case 2:
					load && places && places.getPrivate();
					if($('#btn_places_search_reset').is(':visible')){$('#btn_places_search_reset').click();}					
					$('#btn_tab-places_newCategory').removeClass('multi_user_button_inactive').addClass('multi_user_button');
				break;
				case 0:
					load && places && places.getRecents();
					if($('#btn_places_search_reset').is(':visible')){$('#btn_places_search_reset').click();}					
          $('#btn_tab-places_Delete, #btn_tab-places_newCategory').addClass('multi_user_button_inactive').removeClass('multi_user_button');       
				break;
			};
			resizeTabPlaces();
		}
/* 		,disabled: !userConf.rights.view_enterprise_locations? [ 0, 1 ] : true */
	});
};

leftPanel.initRoutesSubTabs = function(element){
	leftPanel.tabRoutesSubTabs = $(element).find('.subtabs').tabs({
		cache: true,
		opacity: 'toggle',
		show: function(event, ui){
			switch (ui.index){
				case 0:
					if($.trim($(ui.panel).html()).length===0){
						$(ui.panel).load('pages/routing.jsp?_' + Math.floor(Math.random()*100), function(){
							leftPanel.tabRoutes.loaded = true;
							$('body').trigger('tabRoutedLoaded');
							initRoutingPage();
						    if($.browser.msie){
					        	$('.token-input-list-facebook', $('#idSaveRouteDiv')).css({height:'60px'});
					        	$('#routingModHeader').css('margin-top','-3px');       	        	        	
					        }
						    localize && localize.routesTab0();
						});
					}
				break;
				case 1:
					getSavedRoutes(ui.panel); //routing.js
				break;
			};
		}
	});
	//localize && localize.routes();
};