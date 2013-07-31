var userSearch = {};
userSearch.req;
userSearch.res;
userSearch.autocompleteUrl = 'userSearchAutocomplete'; //'api/userSearchAutocomplete.json';
userSearch.retrieveUrl = 'searchGroup.action'; //'api/searchGroup.json';

/**
 * 
 * @param req
 * @param resp
 */
userSearch.autocomplete = function(req, resp){
	userSearch.req = req;
	userSearch.resp = resp;
	
	var options = {};
	
	var params = [];
	params.push({'name': 'q', 'value': req.term});
	params.push({'name': 'retrieveAssets', 'value': true});
	
	options.data = params;
	options.success = userSearch.onAutocompleteSuccess;
  options.cache = false;
	options.async = true;
	 
	utils && utils.lbasDoGet(userSearch.autocompleteUrl, options);
};

/**
 * 
 * @param data
 * @param textStatus
 * @param jqXHR
 */

userSearch.onAutocompleteSuccess = function(data, textStatus, jqXHR)
{
	var suggestions = [];
	if(data){
		var tmp = data.resultList;
		$.each(tmp, function(index, item){
			item.category = 'Users';
			item.value = item.name;
			item.key = item.id;
			suggestions.push(item);
		});
	}
	userSearch.resp && userSearch.resp(suggestions);
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
						 list = $('<ul></ul>');
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