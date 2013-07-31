(function() {
  
      
  jQuery.extend({
  	removeArray: function(array, from, to){
  		if ($.isArray(array)){
  			var rest = array.slice((to || from) + 1 || array.length);
  			array.length = from < 0 ? array.length + from : from;
  			return array.push.apply(array, rest);
  		}
  		return(array);
  	}
  });
  jQuery.extend({
	 insertArray: function(array, index, items, flattenIt){
		if ($.isArray(array)){
			array.splice(index,0,items);
			if(flattenIt) {return $.flattenArray(array);}
			return array;
		}
		return(array);
	 }
  });
  jQuery.extend({
  	uniqueArray: function(array){
  		if ($.isArray(array)){
  			var unique = []; var len, i;
  			for (i=0,len=array.length;i<len;i++){
  				if(typeof(array[i]) == 'object'){
  					var found = false;
  					for(var j=0,ulen=unique.length;j<ulen;j++){
  						try{
  							if(array[i].equals(unique[j])) {
  								found = true;
  							}
  						} catch(err){
  							if(console) {
  								console.log('Array contains objects without an .equals() method - all objects are left in the array');
  							}
  							break;
  						}
  					}
  					if(!found) {
  						unique.push(array[i]);
  					}
  				} else {
  					if ($.inArray(array[i], unique) === -1) {
  						unique.push(array[i]);
  					}
  				}
  			}
  			return(unique);
  		}
  		return(array);
  	}
  });
  jQuery.extend({
  	flattenArray: function(array){
      var flatten = [];
      for (var i = 0, len = array.length; i < len; i++){
          var type = Object.prototype.toString.call(array[i]).split(' ').pop().split(']').shift().toLowerCase();
          if (type) { flatten = flatten.concat(/^(array|collection|arguments|object)$/.test(type) ? $.flattenArray(array[i]) : array[i]); }
      }
      return flatten;
  	}
  });

  

  function Search(request, callback) {
    this.request = request;
    this.callback = callback;
    this.lbasRequest = null;
    this.navteqRequest = null;
    this.results = [];
    
    //array per risultati ricerca su Navteq
    this.resultsNavteq = [];

    this.lbasCompleteted = false;
    this.navteqCompleted = false;

    this.startLbasAutocomplete();
    this.startNavteqAutocomplete();

    this.checkRequestsEnded();
  }

  Search.prototype.startLbasAutocomplete = function() {
    var options, req;

    if(utils) {
      try {
        me = this;
        req = this.request;

        options = {
          data: {
            q: $.trim(req.term),
            maxAssets: req.maxAssets || globalSearch.maxAssets,
            maxUsers: req.maxUsers || globalSearch.maxUsers,
            maxPlaces: req.maxPlaces || globalSearch.maxPlaces,
            maxRoutes: req.maxRoutes || globalSearch.maxRoutes
          },
          success: function(data, textStatus, jqXHR){
            me.lbasAutocompleteSuccess(data, textStatus, jqXHR);
          },
          async: true
        };

        this.lbasRequest = utils.lbasDoGet(globalSearch.autocompleteUrl, options);
      }
      catch(ex) {
        this.lbasCompleteted = true;
      }
    }
    else {
      this.lbasCompleteted = true;
    }
  };

  Search.prototype.startNavteqAutocomplete = function() {
    var me = this;

    if (genericSearch) {
      try {
        this.navteqRequest = genericSearch({address: $.trim(me.request.term), region: regionCountryCode}, true, true, function(results) {
          me.navteqAutocompleteSuccess(results);
        });
      }
      catch(ex) {
        this.navteqCompleted = true;
      }
    }
    else {
      this.navteqCompleted = true;
    }
  };

  Search.prototype.lbasAutocompleteSuccess = function(data, textStatus, jqXHR) {
    var me = this;

    if (data) {

      // users

      var users = data.users.list;
      var totUsers = data.users.tot;
      $.each(users, function(index, item){
        item.category = 'Users';
        item.key = item.id;
        item.value = item.name;
        item.tot = totUsers;
        me.results.push(item);
      });

      // assets

      var assets = data.assets.list;
      var totAssets = data.assets.tot;
      $.each(assets, function(index, item){  
        item.category = 'Assets';
        item.key = item.id;
        item.value = item.name;
        item.tot = totAssets;
        me.results.push(item);
      });

      // places

      var places = data.places.list;
      var totPlaces = data.places.tot;
      $.each(places, function(index, item){
        item.category = 'Places';
        item.key = item.id;
        item.value = item.name;
        item.tot = totPlaces;
        me.results.push(item);
      });

      // routes

      var routes = data.routes.list;
      var totRoutes = data.routes.tot;
      $.each(routes, function(index, item){
        item.category = 'Routes';
        item.key = item.id;
        item.value = item.name;
        item.tot = totRoutes;
        me.results.push(item);
      });

    }

    me.lbasCompleteted = true;
    me.checkRequestsEnded();
  };

  Search.prototype.navteqAutocompleteSuccess = function(results) {

    var totalAddresses = results.length,
        i, len, item, maxAddresses;

    maxAddresses = this.request.maxAddresses || globalSearch.maxAddresses;
    len = Math.min(maxAddresses, results.length);

    for(i = 0; i < len; i++) {
      item = results[i];

      item.category = 'Addresses';
      item.key = item.latitude + '-' + item.longitude;
      if (item.address.length>35)
        item.value = item.address.substring(0,34) + "...";
      else
        item.value = item.address;
      
      item.tot = totalAddresses;
      //me.results.push(item);
      me.resultsNavteq.push(item);
    }

    this.navteqCompleted = true;
    this.checkRequestsEnded();
  }

  Search.prototype.checkRequestsEnded = function() {
    if (this.navteqCompleted && this.lbasCompleteted) {
      if (this.callback) {
      
        var isRoutes = false;
        var routesIndex = 0;
        $.each(this.results, function(index, val){
          if(val.category == "Routes") {
            isRoutes = true;
            routesIndex = index;
            return false;
          }
        });
        
        var res = this.results;
        if (isRoutes) { 
          $.each(this.resultsNavteq, function(index, val) {
            var n = $.insertArray(res,routesIndex+index,val, true);
          });
        } else {
          $.each(this.resultsNavteq, function(index, val) {
            var n = $.insertArray(res,res.length+index,val, true);
          });
        }
              
        this.callback(this.results);
      }
    }
  };

  Search.prototype.abort = function() {
    this.callback = null;

    if (this.lbasRequest) {
      this.lbasRequest.abort();
    }
  };

  var globalSearch = {
    autocompleteUrl: 'globalSearchAutocomplete', //'api/globalSearchAutocomplete.json',
    retrieveUrl: 'searchGroup.action', //'api/searchGroup.json',
    maxAssets: 3,
    maxUsers: 3, // previously 10
    maxPlaces: 3,
    maxRoutes: 2,
    maxAddresses: 2,
    currentRequest: null,
    autocomplete: function(request, response) {
      if (globalSearch.currentRequest && globalSearch.currentRequest.abort) {
        globalSearch.currentRequest.abort();
      }

      globalSearch.currentRequest = new Search(request, response);
    }
  };

  window.globalSearch = globalSearch;

})();


