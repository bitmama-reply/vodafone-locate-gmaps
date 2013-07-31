

var userSearch = {};
userSearch.req;
userSearch.res;
userSearch.autocompleteUrl = 'userSearchAutocomplete.action'; //'api/userSearchAutocomplete.json';
userSearch.retrieveUrl = 'searchGroup.action'; //'api/searchGroup.json';

/**
 * 
 * @param req
 * @param resp
 */
userSearch.autocomplete = function(req, resp, opts){
	userSearch.req = req;
	userSearch.resp = resp;
	
	var options = {};
	options.data = {
		q: $.trim(req.term),
		includeFullDetails: true,
		retrieveAssets: opts.retrieveAssets,
		excludeGroups: true,
		onlyLocatable: opts.onlyLocatable
	};
	
	options.extra = opts;
	options.success = userSearch.onAutocompleteSuccess;
	options.async = true;
	
	var $ul = $('<ul></ul>').addClass('users');
	var $li = $('<li></li>')
		.append('<div class="groupElement"><div class="container">' + $.i18n.prop('globalsearch.loading') + '</div></div>')
		.appendTo($ul);
	
	var container;
	if(opts.retrieveAssets)
		container = '#tab-assets';
	else
		container = '#tab-users';
	
	$(container + ' .contents').empty().append($ul);
	
	setTimeout(function(){
		utils && utils.lbasDoGet(userSearch.autocompleteUrl, options)
	}, 1000);
};

/**
 * 
 * @param data
 * @param textStatus
 * @param jqXHR
 */

userSearch.onAutocompleteSuccess = function(data, textStatus, jqXHR, opts){
        
	if(data && data.fullDetails){
                
		var options = opts;
		$(options.container + ' .contents').empty();
		var respIdList = data.fullDetails.userList;
		var respPermissionsList = data.fullDetails.usersCurrentLocationPermissionStatuses;
		
		if(opts.retrieveAssets){
			respIdList = $.grep(respIdList, function(a){
				return a.role_id === 6;
			});
		}
		
		$.each(respIdList, function(){
			var uID = $(this)[0].user_id;
			$(this)[0].usersCurrentLocationPermissionStatuses = respPermissionsList[uID];
		});
		
		if(opts.onlyLocatable){
			respIdList = $.grep(respIdList, function(u){
				return u.usersCurrentLocationPermissionStatuses.locatable == true;
			});
		}
		var ul = {};
		ul.groupUsers = respIdList;
		
		groups && groups.getUsersInGroupOnSuccess(ul, null, null, options);
		
		$(options.container + ' span.searchLoading')
			.addClass('searchReset')
			.removeClass('searchLoading');
	}
};

/**
 * 
 * @param item
 */
userSearch.retreive = function(item){
	var params = [];
	params.push({'name': 'listIndex', 'value': '0'});
	params.push({'name': 'searchUserId', 'value': item.key});
	
	var options = {};
	options.data = params;
	options.success = userSearch.onRetreiveSuccess;
	options.async = true;
	options.extra = item;
	
	utils && utils.lbasDoPost(userSearch.retrieveUrl, options);
};

/**
 * 
 * @param data
 * @param textStatus
 * @param jqXHR
 * @param extra
 */
userSearch.onRetreiveSuccess = function(data, textStatus, jqXHR, extra){
	if(data){
		var user = data;
		 if(leftPanel){
			 leftPanel.tabs.tabs('select', leftPanel.tabUsers.id); // switch to first tab
			 $('#tab-users .contents').empty();
			 $('#tab-users .contents').data('groups', '');
			 $('#tab-users .contents').data('groups', data);
			 $('#tab-users input').val(extra.value);
			 
			 if($.isArray(user.userGroups)){
				 for(var groupsCount = 0; user.userGroups && groupsCount<user.userGroups.length; groupsCount++){
					 var groupName = user.userGroups[groupsCount].name;
					 var groupID = 'user-'+ groupName.replace(/ /g,"-").replace(/[\(\)\.\-\s,]/g, "");
					 var group = $('#'+groupID);
					 var list;
					 if(group.length===0){
						var group = $('<h3 id="' + groupID + '"><b>Group: ' + groupName + '</b></h3>').css('cursor', 'pointer').click(function(){
							list = $('#'+groupID).next();// + ' ul');
							list.toggle('blind');
						 });
						 group.appendTo($('#tab-users .contents'));
						 list = $('<ul></lu>');
						 list.insertAfter(group);
					 }
					 
					 list = $('#'+groupID).next();
					 var userID = user.searchUserId;
					 var elementID = userID + '-' + groupName;
					 var isDuplicate = false;
					 $.each($(list).children(), function(index, item){
						 var tmp = $(item);
						 if(tmp.attr('id') === elementID && tmp.text()===extra.value){
							 isDuplicate = true;
							 return false;
						 }	 
					 });
					 if(!isDuplicate){
						 var user = $('<li id="' + elementID + '">'+ extra.value +'</li>');
						 user.appendTo(list);
					 }
				 }
			 }
		 }	 
	}
};


/*************************************************************************************/
/* ROUTE                **************************************************************/
/*************************************************************************************/



var routeSearch = {};
routeSearch.req;
routeSearch.res;
routeSearch.autocompleteUrl = 'searchSavedRoutes.action'; //'api/userSearchAutocomplete.json';
routeSearch.retrieveUrl = 'getSavedRoutes.action'; //'api/searchGroup.json';

/**
 * 
 * @param req
 * @param resp
 */
routeSearch.autocomplete = function(req, resp, opts){
  routeSearch.req = req;
  routeSearch.resp = resp;
  var options = {};
  options.data = {
    searchText: $.trim(req.term)
  };
  
  options.extra = opts;
  options.success = routeSearch.onAutocompleteSuccess;
  options.async = true;
  
  var $ul = $('<ul></ul>').addClass('users');
  var $li = $('<li></li>')
    .append('<div class="groupElement"><div class="container">' + $.i18n.prop('globalsearch.loading') + '</div></div>')
    .appendTo($ul);
  
  var container='#tab-routes';
  $(container + ' .contents').empty().append($ul);
  
  setTimeout(function(){
    utils && utils.lbasDoGet(routeSearch.autocompleteUrl, options)
  }, 1000);
};

/**
 * 
 * @param data
 * @param textStatus
 * @param jqXHR
 */

routeSearch.onAutocompleteSuccess = function(data, textStatus, jqXHR, opts){
  if(data){
    renderRoutes(null, data);
    $('#tab-routes span.searchLoading').addClass('searchReset').removeClass('searchLoading');
    return;
  }
  
  
  /*
  if(data && data.fullDetails){
    
    var options = opts;
    $(options.container + ' .contents').empty();
    var respIdList = data.fullDetails.userList;
    var respPermissionsList = data.fullDetails.usersCurrentLocationPermissionStatuses;
    
    if(opts.retrieveAssets){
      respIdList = $.grep(respIdList, function(a){
        return a.role_id === 6;
      });
    }
    
    $.each(respIdList, function(){
      var uID = $(this)[0].user_id;
      $(this)[0].usersCurrentLocationPermissionStatuses = respPermissionsList[uID];
    });
    
    if(opts.onlyLocatable){
      respIdList = $.grep(respIdList, function(u){
        return u.usersCurrentLocationPermissionStatuses.locatable == true;
      });
    }
    var ul = {};
    ul.groupUsers = respIdList;
    groups && groups.getUsersInGroupOnSuccess(ul, null, null, options);
    $(options.container + ' span.searchLoading').addClass('searchReset').removeClass('searchLoading');
  }*/
};

/**
 * 
 * @param item
 */
routeSearch.retreive = function(item){

  var params = [];
  params.push({'name': 'listIndex', 'value': '0'});
  params.push({'name': 'searchUserId', 'value': item.key});
  
  var options = {};
  options.data = params;
  options.success = routeSearch.onRetreiveSuccess;
  options.async = true;
  options.extra = item;
  
   getSavedRoutes();
   return;
  
  utils && utils.lbasDoPost(routeSearch.retrieveUrl, options);
};

/**
 * 
 * @param data
 * @param textStatus
 * @param jqXHR
 * @param extra
 */
routeSearch.onRetreiveSuccess = function(data, textStatus, jqXHR, extra){
  if(data){
    var user = data;
     if(leftPanel){
      
       leftPanel.tabs.tabs('select', leftPanel.tabUsers.id); // switch to first tab
       $('#tab-users .contents').empty();
       $('#tab-users .contents').data('groups', '');
       $('#tab-users .contents').data('groups', data);
       $('#tab-users input').val(extra.value);
       
       if($.isArray(user.userGroups)){
         for(var groupsCount = 0; user.userGroups && groupsCount<user.userGroups.length; groupsCount++){
           var groupName = user.userGroups[groupsCount].name;
           var groupID = 'user-'+ groupName.replace(/ /g,"-").replace(/[\(\)\.\-\s,]/g, "");
           var group = $('#'+groupID);
           var list;
           if(group.length===0){
            var group = $('<h3 id="' + groupID + '"><b>Group: ' + groupName + '</b></h3>').css('cursor', 'pointer').click(function(){
              list = $('#'+groupID).next();// + ' ul');
              list.toggle('blind');
             });
             group.appendTo($('#tab-users .contents'));
             list = $('<ul></lu>');
             list.insertAfter(group);
           }
           
           list = $('#'+groupID).next();
           var userID = user.searchUserId;
           var elementID = userID + '-' + groupName;
           var isDuplicate = false;
           $.each($(list).children(), function(index, item){
             var tmp = $(item);
             if(tmp.attr('id') === elementID && tmp.text()===extra.value){
               isDuplicate = true;
               return false;
             }   
           });
           if(!isDuplicate){
             var user = $('<li id="' + elementID + '">'+ extra.value +'</li>');
             user.appendTo(list);
           }
         }
       }
     }   
  }
};











