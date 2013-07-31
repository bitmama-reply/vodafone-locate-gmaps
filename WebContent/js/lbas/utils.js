$.ajaxSetup({
	cache: 'false'
});

var utils = {};


//var pointArray = new Array();
utils.lbasDoHttp = function(url, options){
	var isAsync = options.async?true:false;
	return $.ajax({
		url: url,
		contentType: options.contentType || 'application/x-www-form-urlencoded; charset=UTF-8', /*added because request of oksijen */
		type: options.type || 'POST', cache: options.cache || false,
		async: isAsync, //options.async?true:false,
		success: function(data, textStatus, jqXHR){
			if(jqXHR.getResponseHeader('Content-Type').indexOf('html')!==-1){
			         /*response html error */
			         utils.onError(jqXHR, textStatus, 'Session Expired');
			         utils.closeDialog();
			         utils && utils.dialog({
                    content : "<div class='successMessageCheck'>" + $.i18n.prop('session.expired') +"</div>",
                    css: 'noCloseNoOk'
                });
               
               /* FORCE LOGOUT */
              /*****************/
               setTimeout(forceLogOut, 1000);
               
               /*setTimeout(forceLogOut, 2000);*/
               /*setTimeout(utils.onError(jqXHR, textStatus, 'Session Expired'), 2000);*/
				       /*utils.onError(jqXHR, textStatus, 'Session Expired'); */
			}else{
			  /* CHECK AUTHORIZATION ERROR */
			  if(data){
			    
				  if(data.authorizationMessage != undefined){
				      resetViewOnAuthorizationError();
				      utils.closeDialog();
				      utils && utils.dialogError({title: $.i18n.prop('dialog.title.error'), content:  data.authorizationMessage, css:"error-dialog-generic-error"});
	        } else if(data.errorText != undefined && data.errorText.length > 0){
             utils && utils.dialogError({title: $.i18n.prop('dialog.title.error'), content:  data.errorText, css:"error-dialog-generic-error"});
          }  

         }
				if(options.success) {
					options.success(data, textStatus, jqXHR, options.extra);
				} else {
					utils.onSuccess;
				}
  			
			}
		},
		error: options.error || utils.onError,
		//dataType: options.datatype || 'json',
		complete: options.complete || utils.onComplete,
		data: options.data || []
	});
};

utils.lbasDoGet = function(url, options){
	options = options || {};
	options.type = 'POST';
	return utils.lbasDoHttp(url, options);
};

utils.lbasDoPost = function(url, options){
	options = options || {};
	options.type = 'POST';
	return utils.lbasDoHttp(url, options);
};

utils.onSuccess = function(data, textStatus, jqXHR){

};

utils.onError = function(jqXHR, textStatus, errorThrown){
  
	if(textStatus!=='abort'){
		$('#login').html(jqXHR.responseText);
	}
	/*if($('.generic-ajax-error').length == 0) {
	  utils && utils.dialogError({title: 'Error', content: 'Error control by reply', css : 'generic-ajax-error '});
	}*/
	
};

utils.onComplete = function(jqXHR, textStatus){

};


utils.dialogError = function(options){
	options.css = options.css + ' dialogError';
	options.buttonClass = 'purple_button';
	options.title = '<img src="images/icon_notification.png"> ' + options.title;

	utils.dialog(options);
};

utils.dialogInfo = function(options){
	options.css = options.css + ' dialogInfo';
	options.title = '<img src="images/icon_info.png" style="float:left;"> ' + options.title;

	utils.dialog(options);
};

utils.dialogLocate = function(options){
	var $dialog = $('.locateSingleUser');
	if($dialog.length===0 && options.data){// && options.data.success==false || options.data && options.data.locatable)){
		var btns = {};
		btns[$.i18n.prop('buttons.cancel')] = function() {
			$(this).dialog('close');
		};
		options.css = 'locateSingleUser';
		options.buttons = btns;
		options.buttonClass = 'purple_button';
		options.title = false; //$.i18n.prop('dialog.locating.title');
		options.content = parseTemplate('locatingDialog', {
			data: options.data
		});
		options.close = function(){
		 user && user.abortAllUserLocate();
		 $(this).remove();
			
		};
		options.modal=false;
		$dialog = utils.dialog(options);
	}	
	
	var permissions = options.data.permissions || options.data; 
	if($dialog.length===1){
		var $content;
		if(options.data){
		        if(options.data.fullName) options.data.fullName =Encoder.htmlDecode(options.data.fullName);
            if(options.data.name) options.data.name= Encoder.htmlDecode(options.data.name);
            if(options.data.isANearestUser===true) {
                /* change type popup */
                var $container = $('.locateSingleUser ul#dialog_list_nearest_locating');
                var $content = $('#locateSingleUser_'+ (options.data.userId || options.data.user_id || options.data.id));
                var $li = $('<li style="display:none;"></li>')
                 .addClass('locateSingleUserLocating')
                 .attr('id', 'locateSingleUser_'+ (options.data.userId || options.data.user_id || options.data.id))
                 //.text($.i18n.prop('warning.no.locate.permission'))
                 .data('item', options.data);
                var $button = $('<a class="globalSearchButton reportNotAvailableLeft" href="#"><span class="globalSearchText reportNotAvailableRight">'+ $.i18n.prop('globalsearch.requestPermission') +'</span></a>')
                    .click(function(e){
                        actionSelected("1", options.container, $(this).parent().data('item'));
                        e.preventDefault();
                    });

                 if($content.length>0) {
                  $content.replaceWith($li).show();
                 } else {
                  $container.append($li).show();
                 }

                //$container.show();
            } else if(permissions.success){
				setTimeout(
					function(){
						$('#locateSingleUser_'+options.data.userId).fadeOut('slow', 
							function(){
								$(this).remove();
								if($('.locateSingleUser ul#dialog_list_locating li').length===1){
									$('.locateSingleUser ul#dialog_list_locating').hide();
   								}
								if($('.locateSingleUser ul li').length<=3){
									$('.locateSingleUser').fadeOut('fast', function(){
										$(this).remove();
									});
 								}
								if($("#dialog_list_panding").children().size() > 1){

								} else if($("#dialog_list_permission_req").children().size() > 1){

								} else if($("#dialog_list_errors").children().size() > 1){

								} else if($("#dialog_list_locating").children().size() > 1){

								} else{
									$('#dialog').dialog('close');
								}
 								//$('#dialog').dialog('close');
 								if(locationRequests == 0) {
 									utils.checkLocationRequests();
 								}
 								
 								//pointArray.push(map.layerContainerOrigin);
 								
 								/*calculateMapZoomLevel_multi(pointArray);*/
							});		
					}, 1
				);
					
			}else if(permissions.pendingRequest || permissions.hasPendingPermissionRequest){
				var $container = $('.locateSingleUser ul#dialog_list_panding');
				var $content = $('#locateSingleUser_'+ (options.data.userId || options.data.user_id || options.data.id));
				var $li = $('<li></li>').addClass('locateSingleUserLocating').text( Encoder.htmlDecode(options.data.fullName || options.data.name) )
					//.text(options.data.errorText)
					.attr('id', 'locateSingleUser_'+ (options.data.userId || options.data.user_id || options.data.id))
					.data('item', options.data);
				var $button = $('<a class="globalSearchButton pendingRequestLeft" href="#"><span class="globalSearchText pendingRequestRight">'+ $.i18n.prop('globalsearch.pendingRequest') +'</span></a>');

				$li.append($button);
				if($content.length>0)
					$content.replaceWith($li).show();
				else
					$container.append($li).show();
			}else if(permissions.locatable && !options.data.pendingRequest){
				utils.checkUsersResults(options.data);
				var $container = $('.locateSingleUser ul#dialog_list_locating');
				var $content = $('#locateSingleUser_'+ (options.data.userId || options.data.user_id || options.data.id));
				var $li = $('<li></li>')
					.addClass('locateSingleUserLocating')
					.attr('id', 'locateSingleUser_'+ (options.data.userId || options.data.user_id || options.data.id))
					.text(Encoder.htmlDecode(options.data.fullName || options.data.name))
					.data('item', options.data);
				var $button = $('<a class="globalSearchButton locationInProgress" href="#"><span class="globalSearchText">' + $.i18n.prop('buttons.cancel') + '</span></a>')
					.click(function(e){
						var data = $(this).data('item');
						var id = options.data.userId || options.data.user_id || options.data.id;
						if($(this).hasClass('locationInProgress')){
							user.locateAbort(id);
						}else{
							user && user.locate(id, false, false);
						}
						e.preventDefault();
					});
				$li.append($button);
				
				if($content.length>0) {
					$content.replaceWith($li).show();
				} else {
					$container.append($li).show();
				}
				
			} else if(!permissions.locatable && !permissions.pendingRequest && permissions.success==undefined){
				locationRequests--;
                /* change type popup */
				var $container = $('.locateSingleUser ul#dialog_list_permission_req');
                //var $container = $('.locateSingleUser ul#dialog_list_locating');
				var $content = $('#locateSingleUser_'+ (options.data.userId || options.data.user_id || options.data.id));
				var $li = $('<li></li>')
				  .addClass('locateSingleUserLocating')
				  .attr('id', 'locateSingleUser_'+ (options.data.userId || options.data.user_id || options.data.id))
				  //.text($.i18n.prop('warning.no.locate.permission'))
				  .text(Encoder.htmlDecode(options.data.fullName ||options.data.name || options.data.usr.fullName || options.data.usr.name))
				  .data('item', options.data);
				  
					/*
                    .addClass('locateSingleUserLocating')
					.text(options.data.errorText)
					.attr('id', 'locateSingleUser_'+ (options.data.userId || options.data.user_id || options.data.id))
					.data('item', options.data);
*/
				
				var $button = $('<a class="globalSearchButton reportNotAvailableLeft" href="#"><span class="globalSearchText reportNotAvailableRight">'+ $.i18n.prop('globalsearch.requestPermission') +'</span></a>')
					.click(function(e){
						actionSelected("1", options.container, $(this).parent().data('item'));
						e.preventDefault();
					});

				$li.append($button);
				if($content.length>0)
					$content.replaceWith($li).show();
				else
					$container.append($li).show();

			}else if(!permissions.success){
			  user.errorPermissionOnMultipleUserLocate=true;
			  
				//show location errors list
				$('#dialog_list_errors').show();
				if($("#dialog_list_locating").children().size() == 2){
					$("#dialog_list_locating").hide();
				}
				$('#locateSingleUser_'+(options.data.userId || options.data.user_id || options.data.id)).remove();
				$('#dialog_list_errors')
					.append( '<li style="line-height:30px;padding-left:11px" class="response" id="response_'+(options.data.userId || options.data.user_id || options.data.id)+'">'+ Encoder.htmlDecode(options.data.usr.fullName || options.data.usr.name) + '</li>');
				
				/*var $content = $('#locateSingleUser_'+(options.data.userId || options.data.user_id || options.data.id));
				var $li = $('<li></li>')
					.addClass('locateSingleUserLocating')
					.attr('id', 'locateSingleUser_'+ (options.data.userId || options.data.user_id || options.data.id))
					.text(options.data.errorText);
					//.data('item', options.data);
				
				$content.replaceWith($li);*/
			}
		}	
	}
};


/* Produce report */
utils.dialogReport = function(options){

  $('.locationReportRequestPermission').hide().remove();
  	
	var $dialog = $('.locateSingleUser');
	if($dialog.length===0 && options.data){
		var btns = {};
		btns[$.i18n.prop('buttons.cancel')] = function() {
			$(this).dialog('close');
		};
		options.css = 'locateSingleUser';
		options.buttons = btns;
		options.buttonClass = 'purple_button';
		options.title = false; //$.i18n.prop('dialog.locating.title');
		options.content = parseTemplate('reportingDialog', {
			data: options.data
		});
		options.close = function(){
			var toAbort = $('.locateSingleUser ul#dialog_list_locating li');
			$.each(toAbort, function(){
				var item = $(this).data('item');
				if(item){
					user && user.locateAbort(item.user_id || item.id);
				}
			});
			$(this).remove();
			
		};
		options.modal=false;
		$dialog = utils.dialog(options);
	}	
	

	
	var permissions = options.data.permissions || options.data; 
	var reportObj = options.data;
	
	if($dialog.length===1){
		var $content;
		if(reportObj){
		  if (reportObj.viewReportNotPermittedString != null) {
					showInfoDialog($.i18n.prop('error.asset.invalid.operation.listassets', [ reportObj.viewReportNotPermittedString ]));
				}

				markerObj = new MarkerObj();
				
				// locatableUsersList
				/* for ( var i = 0; i < reportObj.locatableUsersList.length; i++) { */

					if (reportObj.locatableUsersList.length>0) {

						var locationReportTable = parseTemplate("locationReportTableTemplate", {
								locReportTableList: reportObj.locReportTableList,
								startdate: reportObj.startDate,
								enddate: reportObj.endDate
						});

						/* $($(locationReportTable).attr('id')).remove(); */
						$('body').append(locationReportTable);
						$('#locationReportTable').draggable({containment: '#right'});

						mainMarkerManager.showClearMapButton();
					} // locatableUsersList > 0
				for ( var i = 0; i < reportObj.locatableUsersList.length; i++) {					
					user && user.locate(reportObj.locatableUsersList[i], false, false);
				}// for loop only for relocate
				
				// permissionRequiredUserList
				if (reportObj.permissionRequiredUserList.length > 0) {
  				var $container = $('.locateSingleUser ul#dialog_list_permission_req');
  				  				
  				for ( var j = 0; j < reportObj.permissionRequiredUserList.length; j++) {
  				  
    				var $content = $('#locateSingleUser_'+ (reportObj.permissionRequiredUserList[j].id ));
    				var $li = $('<li></li>')
  				  .addClass('locateSingleUserLocating')
            .text(reportObj.permissionRequiredUserList[j].name || "")
            .attr('id', 'locateSingleUser_'+ (reportObj.permissionRequiredUserList[j].id))
            .data('item', reportObj);
          var $button = $('<a class="globalSearchButton reportNotAvailableLeft" href="#"><span class="globalSearchText reportNotAvailableRight">'+ $.i18n.prop('globalsearch.requestPermission') +'</span></a>');
          
          $li.append($button);
          
          // Get user obj
          $.ajax({
            url :'viewUser.action',
            type :'POST',
            async :false,
            data :{
              id : reportObj.permissionRequiredUserList[j].id
            },
            dataType :'json',
            success :function(jsonUser) {
              $button.click(locRequestAction(null, jsonUser));
            }
          });
          
          if($content.length>0)
            $content.replaceWith($li).show();
          else
					 $container.append($li).show();
  				}
  				
  				
					/* OLD WAY
					var btns = {};
					btns[$.i18n.prop('buttons.cancel')] = function(){
						$(this).dialog('close');
					};

					var content = parseTemplate("permissionRequiredListTemplate", {
						permissionRequiredList: reportObj.permissionRequiredUserList
					});
					utils && utils.dialogError({title:$.i18n.prop('dialog.title.error'), content: content, buttons: btns});
					*/
					mainMarkerManager.showClearMapButton();
				}

				// locationNotAvailableContent
				if (reportObj.locationNotAvailableContent != null){
					utils && utils.dialogError({title:$.i18n.prop('dialog.title.error'), content:reportObj.locationNotAvailableContent});
					
					locationRequests--;
/*
          
          // change type popup
          var $container = $('.locateSingleUser ul#dialog_list_errors');
          //var $container = $('.locateSingleUser ul#dialog_list_locating');
          var $content = $('#locateSingleUser_'+ (options.data.userId || options.data.user_id || options.data.id));
          var $li = $('<li></li>')
				    .addClass('locateSingleUserLocating')
				    .attr('id', 'locateSingleUser_'+ (options.data.userId || options.data.user_id || options.data.id))
				    .text(options.data.fullName || options.data.name)
				    .data('item', options.data);
				  
				  var $button = $('<a class="globalSearchButton reportNotAvailableLeft" href="#"><span class="globalSearchText reportNotAvailableRight">'+ $.i18n.prop('globalsearch.requestPermission') +'</span></a>')
					 .click(function(e){
						  actionSelected("1", options.container, $(this).parent().data('item'));
						  e.preventDefault();
						});

				$li.append($button);
				if($content.length>0)
					$content.replaceWith($li).show();
				else
					$container.append($li).show();
					
					*/
						
				}
				
				
		
		
		
/*
OLD WAY		
  		if(permissions.success){
				setTimeout(
					function(){
						$('#locateSingleUser_'+options.data.userId).fadeOut('slow', 
							function(){
								$(this).remove();
								if($('.locateSingleUser ul#dialog_list_locating li').length===1){
									$('.locateSingleUser ul#dialog_list_locating').hide();

   								}
								if($('.locateSingleUser ul li').length<=3){
									$('.locateSingleUser').fadeOut('fast', function(){

										$(this).remove();
									});
 								}

								if($("#dialog_list_panding").children().size() > 1){

								} else if($("#dialog_list_permission_req").children().size() > 1){

								} else if($("#dialog_list_errors").children().size() > 1){

								} else if($("#dialog_list_locating").children().size() > 1){

								} else{

									$('#dialog').dialog('close');
								}
 								//$('#dialog').dialog('close');
 								if(locationRequests == 0) {

 									utils.checkLocationRequests();
 								}
							});		
					}, 1
				);
					
			}
  		else if(permissions.pendingRequest || permissions.hasPendingPermissionRequest){


				
				var $container = $('.locateSingleUser ul#dialog_list_panding');
				var $content = $('#locateSingleUser_'+ (options.data.userId || options.data.user_id || options.data.id));
				var $li = $('<li></li>')
					.addClass('locateSingleUserLocating')
					//.text(options.data.errorText)
                    .text(options.data.fullName || options.data.name)
					.attr('id', 'locateSingleUser_'+ (options.data.userId || options.data.user_id || options.data.id))
					.data('item', options.data);
				var $button = $('<a class="globalSearchButton pendingRequestLeft" href="#"><span class="globalSearchText pendingRequestRight">'+ $.i18n.prop('globalsearch.pendingRequest') +'</span></a>');

				$li.append($button);
				if($content.length>0)
					$content.replaceWith($li).show();
				else
					$container.append($li).show();
			}
  		
  		else if(permissions.locatable && !options.data.pendingRequest){

				utils.checkUsersResults(options.data);
				var $container = $('.locateSingleUser ul#dialog_list_locating');
				var $content = $('#locateSingleUser_'+ (options.data.userId || options.data.user_id || options.data.id));
				var $li = $('<li></li>')
					.addClass('locateSingleUserLocating')
					.attr('id', 'locateSingleUser_'+ (options.data.userId || options.data.user_id || options.data.id))
					.text(options.data.fullName || options.data.name)
					.data('item', options.data);
				var $button = $('<a class="globalSearchButton locationInProgress" href="#"><span class="globalSearchText">' + $.i18n.prop('buttons.cancel') + '</span></a>')
					.click(function(e){
						var data = $(this).data('item');
						var id = options.data.userId || options.data.user_id || options.data.id;
						if($(this).hasClass('locationInProgress')){
							user.locateAbort(id);
						}else{
							user && user.locate(id, false, false);
						}
						e.preventDefault();
					});
				$li.append($button);
				
				if($content.length>0)
					$content.replaceWith($li).show();
				else
					$container.append($li).show();
			} 
  		else if(!permissions.locatable && !permissions.pendingRequest && permissions.success==undefined){
				locationRequests--;

				var $container = $('.locateSingleUser ul#dialog_list_permission_req');
                //var $container = $('.locateSingleUser ul#dialog_list_locating');
				var $content = $('#locateSingleUser_'+ (options.data.userId || options.data.user_id || options.data.id));
				var $li = $('<li></li>')
				  .addClass('locateSingleUserLocating')
				  .attr('id', 'locateSingleUser_'+ (options.data.userId || options.data.user_id || options.data.id))
				  //.text($.i18n.prop('warning.no.locate.permission'))
				  .text(options.data.fullName || options.data.name)
				  .data('item', options.data);
				  

				
				var $button = $('<a class="globalSearchButton reportNotAvailableLeft" href="#"><span class="globalSearchText reportNotAvailableRight">'+ $.i18n.prop('globalsearch.requestPermission') +'</span></a>')
					.click(function(e){
						actionSelected("1", options.container, $(this).parent().data('item'));
						e.preventDefault();
					});

				$li.append($button);
				if($content.length>0)
					$content.replaceWith($li).show();
				else
					$container.append($li).show();

			}
  		else if(!permissions.success){
                //al momento nascosto l'errore per il singolo tente non localizzabile per qualsiasi ragione
                //return



				//show location errors list
				$('#dialog_list_errors').show();

				if($("#dialog_list_locating").children().size() == 2){
					$("#dialog_list_locating").hide();
				}
				$('#locateSingleUser_'+(options.data.userId || options.data.user_id || options.data.id)).remove();
				$('#dialog_list_errors')
					.append( '<li style="line-height:30px;padding-left:11px" class="response" id="response_'+(options.data.userId || options.data.user_id || options.data.id)+'">'+ (options.data.usr.fullName || options.data.usr.name) + '</li>')
				;

			}
*/
		}	
	}
};

utils.dialog = function(options){
	//remove same dialog with same class
	
	var btns = {};
	btns[$.i18n.prop('buttons.ok')] = function() {
		$(this).dialog('close');
	};
	
	
	var opt = options || {};
	if(opt.css != undefined && opt.css != '') {
	  $('.'+opt.css.split(" ")[0]).remove();
	}

	if(opt.open==undefined)
		opt.open = true;
	
	var $dialog = $('<div id="dialog"></div>');
	$dialog.dialog({
		title: opt.title || '',
		bgiframe: opt.bigFrame || true,
/* 		modal: opt.modal!=undefined?opt.modal:glbmodal, */
		overlay :{
			backgroundColor :'#000',
			opacity :0.8
		},
		buttons: opt.buttons || btns,
		width: opt.width || 'auto',
		height: opt.height || 'auto',
		position: 'center',
		autoOpen: opt.open,	
		closeOnEscape: false,
	    close: opt.close || function(){
			$(this).remove();
			$('.dialog').filter(function(){
	            if ($(this).text() == "")
	            {
	                return true;
	            }
	                return false;
	        }).remove();
		},
		resizable: false,
		draggable: true,
		dialogClass: 'dialog ' + opt.css || '' 
	});
	/*
	$dialog.parent().draggable({
                        cancel:'#dialog'
                  });
	*/
	var $widget = $dialog.dialog('widget');
	if(!opt.title){
		$widget.find('.ui-dialog-titlebar').remove();
	}else{
		$widget.find('.ui-dialog-titlebar')
			//.append('<span style="width: 96%; position: absolute; left: 0pt; margin-left: 10px; bottom: -3px; border-top: 1px solid rgb(204, 204, 204);"></span>');
			.append('<span class="under-dialog-title"></span>');
		
		$widget.find('.ui-dialog-titlebar a span').text($.i18n.prop('dialog.label.close'));
	}
	$widget.find('.ui-button')
		.addClass(opt.buttonClass || 'multi_user_button')
		.mousedown(function(e) {
			  $(this).addClass(opt.buttonClass?opt.buttonClass+'_active':'multi_user_button_active');
			  e.preventDefault();
		}).mouseup(function() {
			  $(this).removeClass(opt.buttonClass?opt.buttonClass+'_active':'multi_user_button_active');
		});
	
	$widget.children().wrapAll('<div class="bd"><div class="c"><div class="s"></div></div></div>');
	$widget
		.prepend('<div class="hd"><div class="c"></div></div>')
		.append('<div class="ft"><div class="c"></div></div>');
		//.not("input, checkbox, radio, textarea").disableSelection();
	
	
	if(opt.content){
		$dialog.html(opt.content);
	}
	
	
	return $dialog;
};

/* checks for already located users in dialog */
utils.checkUsersResults = function(usrData) {
	var id = usrData.userId || usrData.user_id || usrData.id;
	if( $('#response_'+id).length ) {
		var el = $('#response_'+id );
		var parent = $(el).parent();
		el.remove();
		
		if( $('.response', $(parent)).length == 0) {
			$(parent).hide();
		}
	}
}

utils.closeDialog = function(ref) {
  (ref ? $(ref).parents('#dialog') : $('#dialog')).dialog('destroy').remove();
}

utils.getChecked = function(elements, filter, onlyLocatable){
	var locatableClass = undefined;
	var toReturn = $(elements);
	if($('#tab-users').is(':visible') && $('#filter_all_tab-users').selectmenu('value')==2){
		locatableClass= 'locatableItems';
	}
	if($('#tab-assets').is(':visible') && $('#filter_all_tab-assets').selectmenu('value')==2){
		locatableClass= 'locatableItems';
	}
  
  //forse onlyLocatable
  if(onlyLocatable) locatableClass= 'locatableItems';
  
	if(filter){
		var tmp = $.grep(toReturn, function(e){
			var tmp = false;
			if(locatableClass)
				tmp = $(e).hasClass(filter) && $(e).parent().parent().parent().hasClass(locatableClass);
			else
				tmp = $(e).hasClass(filter);
			return tmp;
		});
		toReturn = tmp;
	}
	if(toReturn.length===0){
		$.each($(elements), function(){
			var data = $(this).data('group');
			if(data){
				var u = data.users;
				$.each(u, function(){
					if(locatableClass){ //only locatable
						if(this.locatable){
						  
							this.permissions = {};
							this.id=this.userId;
							toReturn.push(this);
						}	
					}else{ //include all
						toReturn.push(this.userId);
					}	
				});
			} 
		});
	} 
	return toReturn;
};


utils.getLocalTime = function(offset) {
	d = new Date();
	utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	nd = new Date(utc + (3600000*offset/60));
 	
	var minutes = nd.getMinutes();
	var seconds = nd.getSeconds();
	
	if(minutes==0 || minutes<10){
		minutes = '0'+minutes;
	}
	if(seconds==0 || seconds<10){
		seconds = '0'+seconds;
	}	
	
	// return time as a string
	return nd.getHours()+':'+minutes+':'+seconds+' (GMT +' + ((offset) / 60) + ':00)';
}

utils.getLocalTimeMillSec = function(offset) {
	
	d = new Date();
	
	utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	
	localTimeMillSec = new Date(utc + (3600000*offset/60));
	
	// return time in milliseconds
	return localTimeMillSec
}


utils.checkLocationRequests = function() {
	if( $('#dialog .locateSingleUserLocating').length ) return;
	if( $('#dialog_list_errors').css('display') == 'block' ) {
		utils.removeDialogTitle();
	}else{
		utils.closeDialog();
	}
}

/**************************
  removes locating dialog title
**************************/
utils.removeDialogTitle = function() {
	if($('#dialog_list_locating').children().size() == 1){
		$('#dialog_list_locating').hide();
	}
}


utils.formatPoiOpenTime = function(val) {
  var rt="";
  if(val && val.length >0) {
   var ar=val.split(":");
   for(var j=0; j< ar.length; j++) {
     var sv=ar[j];
     rt += (sv.length ==1 ? "0"+sv : sv.length ==0 ? "00" : sv);
     if (j==0) rt += ":";
   }
  }
  return rt;
}
utils.formatMinuteDate = function(val) {
  var rt="";
  if(val && val.length >0) {
   rt=(val.length ==1 ? "0"+val : val.length ==0 ? "00" : val);
  }
  return rt;
}




/***************************
  Custom checkboxes
  used in:
  - userSendMessage.html
  - ...
 ***************************/
$.fn.customCheckBox = function(){
	return this.each(function(){
		if($(this).hasClass('jqTransformHidden')) {return;}

		var $input = $(this);
		var inputSelf = this;

		//set the click on the label
		var oLabel=utils.customGetLabel($input);
		oLabel && oLabel.click(function(){aLink.trigger('click');});
		
		var aLink = $('<a href="#" class="jqTransformCheckbox"></a>');
		//wrap and add the link
		$input.addClass('jqTransformHidden').wrap('<span class="jqTransformCheckboxWrapper"></span>').parent().prepend(aLink);
		//on change, change the class of the link
		$input.change(function(){
			this.checked && aLink.addClass('jqTransformChecked') || aLink.removeClass('jqTransformChecked');
			return true;
		});
		// Click Handler, trigger the click and change event on the input
		aLink.click(function(){
			//do nothing if the original input is disabled
			if($input.attr('disabled')){return false;}
			//trigger the envents on the input object
			$input.trigger('click').trigger("change");	
			return false;
		});
		
		//set the click on the label
		var oLabel=utils.customGetLabel($input);
		oLabel && oLabel.click(function(){aLink.trigger('click');});
		
		// set the default state
		this.checked && aLink.addClass('jqTransformChecked');		
	});
};

utils.customGetLabel = function(objfield){
	var selfForm = $(objfield.get(0).form);
	var oLabel = objfield.next();
	if(!oLabel.is('label')) {
		oLabel = objfield.prev();
		if(oLabel.is('label')){
			var inputname = objfield.attr('id');
			if(inputname){
				oLabel = selfForm.find('label[for="'+inputname+'"]');
			} 
		}
	}
	if(oLabel.is('label')){return oLabel.css('cursor','pointer');}
	return false;
};