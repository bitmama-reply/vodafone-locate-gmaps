var globalAutocomplete = {};

globalAutocomplete.contents = [];
globalAutocomplete.old_term;

globalAutocomplete.categories = {};
globalAutocomplete.categories.users= 'users';
globalAutocomplete.categories.places = 'places';
globalAutocomplete.categories.routes = 'routes';
globalAutocomplete.categories.assets = 'assets';

globalAutocomplete.categories.address = 'addresses';//before it was address



$.widget("custom.catcomplete", $.ui.autocomplete, {
	_renderMenu : function(ul, items) {
		var self = this, currentCategory = "";
		if(!$(ul).hasClass('globalSearchResultsList')){
			$(ul).addClass('globalSearchResultsList')
				 .mouseleave(function(){
				 	$('#inpt_search').blur();
				 });
		}

		$.each(items, function(index, item) {
			if (item.category && $('ul.' + item.category).length === 0 && item.category != currentCategory) {
				var $li_cat = $('<li class="ui-menu-item ui-autocomplete-category"><span class="border" /><span  class="left '+ item.category + '">' + $.i18n.prop('globalsearch.category.'+item.category) + '</span><span class="right groupUsercount">'+item.tot+'</span></li>');
				ul.append($li_cat);
				currentCategory = item.category;

			}
			self._renderItem(ul, item);
		});
	},
	_renderItem : function(ul, item) {
		var self = this;
		var $li = $('<li><span class="border"/></li>')
			.data("item.autocomplete", item);

		var $el = $('<a></a>');

		if (item.label == $.i18n.prop('globalsearch.noResults')) {
		  $li.addClass('no-result');
		  $el = $('<span></span>');
		} else if (!item.locatable && (item.category.toLowerCase()==='users')) {
		  $el = $('<span></span>');
		}

		//var $a = $('<a></a>')

    // add <strong>
    var $el_html = (item.label || item.name);
    __highlight($el_html, globalAutocomplete.old_term);

		//$el.html(item.label || item.name);
		$el.html($el_html);
		$li.append($el);

		//$li.append($a);

		if(item.category && (item.category.toLowerCase()==='users' || item.category.toLowerCase()==='assets')){
		
		
			var $span = $('<span></span>')
				.data('item', item)
				.addClass('globalSearchButton')
				.removeClass('locationAvailableLeft');
			var $innerSpan1 = $('<span>' + $.i18n.prop('globalsearch.showonmap') + '</span>')
				.addClass('globalSearchText')
				.addClass('locationAvailableRight');

			if(item.locatable && item.hasLocatePermission){
				$li.addClass('locatableItems');
				$span.click(function(event){
					user && user.locate($(this).data('item'), false, false);
					self.close( event );
				});

				$innerSpan1.text($.i18n.prop('globalsearch.showonmap'));
				$innerSpan1.addClass('locationAvailableRight');
				$innerSpan1.removeClass('locationNotAvailableRight');

			}else if(!item.hasLocatePermission && !item.hasPendingPermissionRequest){
				$li.addClass('noLocatableItems');
				if (item.category && item.category.toLowerCase()==='users'){	
				$span.click(function(e){
/* 						actionSelected("1", options.container, $(this).data('item')); */
						globalLocRequestAction(item);						
						e.preventDefault();
					})
					.addClass('reportNotAvailableLeft')
					.removeClass('reportAvailableLeft');
				}else{
					$span.addClass('locked').css({'opacity':0.5});
					$span.click(function(e){
							e.preventDefault();
						})
						.addClass('reportNotAvailableLeft')
						.removeClass('reportAvailableLeft');
				}
					$innerSpan1.text($.i18n.prop('globalsearch.requestPermission'))
						.addClass('reportNotAvailableRight')
						.removeClass('reportAvailableRight');
			} else if(item.hasPendingPermissionRequest){
				$li.addClass('noLocatableItems');
				$span.click(function(e){
						e.preventDefault();
					})
					.addClass('pendingRequestLeft');

				$innerSpan1.text($.i18n.prop('globalsearch.pendingRequest'))
					.addClass('pendingRequestRight');

			}else if(!item.locatable){
				$li.addClass('noLocatableItems');

				$span.click(function(e){
					e.preventDefault();
				})
				.addClass('locationNotAvailableLeft')
				.removeClass('locationAvailableLeft');

				$innerSpan1.text($.i18n.prop('globalsearch.notlocatable'))
					.addClass('locationNotAvailableRight')
					.removeClass('locationAvailableRight');
			}

			$span.mousedown(function() {
				  $(this).addClass('globalSearchButtonActive');
			}).mouseup(function() {
				  $(this).removeClass('globalSearchButtonActive');
			});

			$innerSpan1.mousedown(function() {
				  $(this).addClass('globalSearchButtonActive');
			}).mouseup(function() {
				  $(this).removeClass('globalSearchButtonActive');
			});

			$span.append($innerSpan1);
			$li.append($span);
		}
		$("ul.ui-autocomplete li:first-child").addClass("fistResultIteam");

		if (item.category && $('ul.' + item.category).length > 0) {
			$li.insertAfter($('li.' + item.category));
		} else {
			ul.append($li);
		}

	},
	_search: function( value ) {
		this.pending++;
		this.cancelSearch = false;
		var trim_value = $.trim(value);
		if (trim_value.length>0) {
		  this.element.addClass( "ui-autocomplete-loading" );
		  this.source( { term: trim_value }, this.response );
		}
		/*
		this._suggest([ {
			label : 'Loading...'
		} ]);
		*/
	},
	_response : function(content) {
		if (content) {
			content = this._normalize(content);
			globalAutocomplete.contents = content;
		}

		this._trigger("response", null, {
			content : globalAutocomplete.contents
		});
		if (!this.options.disabled && globalAutocomplete.contents && globalAutocomplete.contents.length>0) {
			this._suggest(globalAutocomplete.contents);
			this._trigger("open");
		} else if(globalAutocomplete.contents.length === 0){
			//globalAutocomplete.contents.length === 0;
			// this.menu.element.empty().hide();
			this._suggest([ {
				label : $.i18n.prop('globalsearch.noResults')
			} ]);
			//this.close();
		}else{
			this.close();
		}
		this.pending--;
		if (this.pending<=0) {
			this.element.removeClass("ui-autocomplete-loading");
		}

		$('#search span.searchLoading')
			.removeClass('searchLoading')
			.addClass('searchReset');
	},
	_suggest: function( items ) {
		var ul = this.menu.element
			.empty()
			.zIndex( this.element.zIndex() + 1 );
		this._renderMenu( ul, items );
		// TODO refresh should check if the active item is still in the dom, removing the need for a manual blur
		//this.menu.blur();
		this.menu.refresh();

		// size and position menu
		ul.fadeIn('fast');
		this._resizeMenu();
		ul.position( $.extend({
			of: this.element
		}, this.options.position ));

		if ( this.options.autoFocus ) {
			this.menu.next( new $.Event("mouseover") );
		}
	},
	close: function( event ) {
		clearTimeout( this.closing );
		if ( this.menu.element.is(":visible") ) {
			this.menu.element.delay(250).fadeOut('slow');
			this._trigger( "close", event );
		}
	}
});

/* UI relevant code */

$(document).ready(function() {
	$('#inpt_search').catcomplete({
		source : function(req, resp) {
		  $.trim(req.term);
			if (globalAutocomplete.old_term ) {
				globalAutocomplete.contents.length = 0;
			}
			globalAutocomplete.old_term = req.term;
			globalSearch && globalSearch.autocomplete(req, resp);
		},
		select : function(event, item) {
			var cat = item.item.category;
			if (cat) {
				cat = cat.toLowerCase();
				if (cat === globalAutocomplete.categories.users && item.item.hasLocatePermission && item.item.locatable ) {
					user && user.locate(item.item, false, false);
				}
        else if (cat === globalAutocomplete.categories.assets && item.item.hasLocatePermission && item.item.locatable) {
					user && user.locate(item.item, false, false);
				}
        else if (cat === globalAutocomplete.categories.places) {
					places && places.locatePlaceById(item.item.id);
				}
        else if (cat == globalAutocomplete.categories.address) {
          	showPoiMarkerOnMap(item.item);
          	//addressSelected(item.item);
        }
        else if(cat === globalAutocomplete.categories.routes) {
/* 	        processSavedRouteAction(1, item.item.id); */

			$("#btn_tab-routes").click();
	        setTimeout('$("#btn_tab-routes_savedRoutesTab").click();', 1500);
	        setTimeout('$("#item_name_'+item.item.id+'").click();', 2500);
					//globalSetRoutes(item.item.id);
					//alert('N/A');
        			/*getSavedRoutes();
					processSavedRouteAction(1, item.item.id);*/
				}
			}
			$(this).blur();
			return false;

		},
		position: {my: "right top", at: "right bottom", collision: "none", of: '#search'}
	})
	.focus(function(){
		if($(this).val().length>0)
			$('.globalSearchResultsList').fadeIn('fast');
	}).keyup(function(){
	 if ($.trim($(this).val()).length>0) {
			$('#search span.searchMagnifier')
				.removeClass('searchMagnifier')
				.addClass('searchLoading');

			$('#search span.searchReset')
				.removeClass('searchReset')
				.addClass('searchLoading');
		}else{
      /*
      SE NON VOGLIO CHE UTENTE USI SPAZI ALL'INIZIO DELLA STRINGA
      */
			$('#search span.searchLoading')
				.removeClass('searchLoading')
				.addClass('searchMagnifier');

			$('#search span.searchReset')
				.removeClass('searchReset')
				.addClass('searchMagnifier');
		}
	});

	$('#search span.searchReset').live('click', function(){
		$('#inpt_search').val('');
		$('#search span.searchReset')
			.removeClass('searchReset')
			.addClass('searchMagnifier');
	});
});

function __highlight(s, t) {
  if( typeof(s) !== 'undefined' && typeof(t) !== 'undefined' ) { 
    var matcher = new RegExp("("+$.ui.autocomplete.escapeRegex(t)+")", "i" );
    return s.replace(matcher, "<strong>$1</strong>");
  }
}

function addressSelected(address) {
  try {

    if (mainMarkerManager.markers['a' + address.key] == null) {

      var tooltipData = {
        key: address.key,
        address: address.address,
        latitude: GMapsHelper.deg2dms(address.latitude),
        longitude: GMapsHelper.deg2dms(address.longitude),
        markerId: 'a' + address.key,
        minSize: {w: 450, h: 350}
      }

      var tooltipContent = parseTemplate('addressTooltip', tooltipData);
      var markerOptions = {
        id: 'a' + address.key,
        icon: 'images/pin_place.png',
        iconWidth: 26,
        iconHeight: 32,
        latitude: address.latitude,
        longitude: address.longitude,
        hasTooltip: true,
        staticContent: true,
        contentHtml: tooltipContent,
        history: false,
        forceToOpen: true
      };

      mainMarkerManager.createMarker(markerOptions);
    }



    adjustZoomLevelAndCenterMap(map, address.latitude, address.longitude);
  }
  catch(ex) {

  }
}