


var placesSearch = {};
placesSearch.autocompleteUrl = 'poiSearchAutocomplete'; //'api/poiSearchAutocomplete.json'
placesSearch.retrieveCategoryUrl = 'getCategoryById.action'; //api/searchCategory.json
placesSearch.retrievePoisUrl = 'listpois.action'; //api/listPois.json

placesSearch.req,
placesSearch.res;
/**
 * 
 * @param req
 * @param resp
 */
placesSearch.autocomplete = function(req, resp){
	placesSearch.req = req;
	placesSearch.resp = resp;
	
	var options = {};
	
	var params = [];
	params.push({'name': 'q', 'value': req.term});
	
	options.data = params;
	options.success = placesSearch.onAutocompleteSuccess;
	options.async = true;
	 
	utils && utils.lbasDoGet(placesSearch.autocompleteUrl, options);
};

placesSearch.onAutocompleteSuccess = function(data, textStatus, jqXHR){
	var suggestions = [];
	if(data){
		var tmp = data.searchList;
		$.each(tmp, function(index, item){
			item.category = 'Places';
			item.label = item.name;
			suggestions.push(item);
		});
	}
	placesSearch.resp && placesSearch.resp(suggestions);
};

/**
 * 
 * @param item
 */

placesSearch.retreiveCategory = function(item){
	var params = [];
	params.push({'name': 'listIndex', 'value': '0'});
	params.push({'name': 'categoryId', 'value': item.id});
	
	var options = {};
	options.data = params;
	options.success = placesSearch.onRetreiveCategorySuccess;
	options.async = true;
	options.extra = item;
	
	utils && utils.lbasDoPost(placesSearch.retrieveCategoryUrl, options);
};


/**
 * 
 * @param data
 * @param textStatus
 * @param jqXHR
 * @param extra
 */

placesSearch.onRetreiveCategorySuccess = function(data, textStatus, jqXHR, extra){
	if(data){
		var place = data;
		 if(leftPanel){
			 leftPanel.tabs.tabs('select', leftPanel.tabPlaces.id); 
			 $('#tab-places .contents').empty();
			 $('#tab-places input').val(extra.name);
			 
			 if($.isArray(place.categoryArr)){
				 for(var categoryCount = 0; place.categoryArr && categoryCount<place.categoryArr.length; categoryCount++){
					 var categoryName = place.categoryArr[categoryCount].name;
					 var categoryPOICount = place.categoryArr[categoryCount].poiCount;
					 var categoryID = 'category-' + categoryName.replace(/ /g,"-").replace(/[\(\)\.\-\s,]/g, "");
					 var group = $('#'+categoryID);
					 if(group.length==0){
						group = $('<h3 id="' + categoryID + '"><b>Group: ' + categoryName + '</b> (' + categoryPOICount + ')</h3>').css('cursor', 'pointer')
							.click(function(){
								var list = $('#'+categoryID).next();// + ' ul');
								if(categoryPOICount>0 && list.length===0){
									placesSearch.retreivePois(place);
								}else{
									list.toggle('blind');
								}
							 });
						//group.html(li);
						group.appendTo($('#tab-places .contents'));
					 }
				 }
				 //$('#tab-places .contents').fadeIn();
			 }
		 }	 
	}
};

placesSearch.retreivePois = function(category){
	var params = [];
	params.push({'name': 'categoryId', 'value': category.categoryId});
	params.push({'name': 'type', 'value': '0'});
	params.push({'name': 'poiCount', 'value': '1'});
	params.push({'name': 'listIndex', 'value': '0'});
	params.push({'name': 'firstPoiId', 'value': '0'});
	
	var options = {};
	options.data = params;
	options.success = placesSearch.onRetreivePoisSuccess;
	options.async = false;
	
	lbasDoPost(placesSearch.retrievePoisUrl, options);
};

placesSearch.onRetreivePoisSuccess = function(data, textStatus, jqXHR, extra){
	if(data){
		var pois = data;
		var categoryName = pois.selectedPoiCategory.name;
		var categoryID = 'category-' + categoryName.replace(/ /g,"-").replace(/[\(\)\.\-\s,]/g, "");
		var parent = $('#'+categoryID);
		var ul = $('<ul></lu>');
		ul.insertAfter(parent);
			
		 if($.isArray(pois.poilist)){
			 for(var poiCount = 0; pois.poilist && poiCount<pois.poilist.length; poiCount++){
				 var poi = pois.poilist[poiCount];
				 var li = $('<li></li>').data('poi', poi);
				 li.css('cursor', 'pointer');
				 li.click(function(){
					 if(map){
						 var poi = $(this).data('poi');
					     var coords = new jsapi.geo.Coordinate(poi.latitude, poi.longitude);
	                     var marker = new jsapi.map.StandardMarker(coords);
	                     var accuracyCircle = new jsapi.map.Circle(coords, 1);
	                     map.objects.addAll([accuracyCircle, marker]);
	                     map.zoomTo(accuracyCircle.getBoundingBox(), false, "default");
	                     if (map.zoomLevel > 16) 
	                    	 map.set("zoomLevel", 16); //zoom out if too close
					 }
				 });
				 li.text(poi.name);
				 li.appendTo(ul);
			 }
		 }
	}
};