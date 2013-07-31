var meetingDialogManager = {
  timeMsg: function () {
    var t=setTimeout("alertMsg()",2000);
  },
  alertMsg: function() {
    $(".noCloseNoOk").fadeOut("slow", function(){
        $(".noCloseNoOk .ui-dialog-buttonset button").click();
    });
  }
};

function AddressSearch(name, address, latitude, longitude) {
  this.name = name;
  this.address = address;
  this.latitude = latitude;
  this.longitude = longitude;
}


var CalendarManager;
var localeToBeUsed;
//to be removed - var lbasGISConn = new NavteqGISManager();
window.event_dates = [];


CalendarManager = (function() {

  CalendarManager.name = 'CalendarManager';
  CalendarManager.loaded = false;
  CalendarManager.dateArr = [];

  function CalendarManager(wrapper) {
    this.cal_wrapper = wrapper;
    this.validator = new Validator({
      messageSubject: {
        domElement: '#meetingSubject',
        validate: 'presence',
        tooltip: '.tooltip-alert-meetingSubject'
      },
      meetingLocationFullAddress: {
        domElement: '#nameOfaLocation',
        validate: 'presence'
      },
      meetingLocationAddress: {
        domElement: '#nameOfaLocation',
        validate: function() {
          return !(addressSearch.address == null || addressSearch.longitude == 0 || addressSearch.latitude == 0);
          }
      },
      Latitude: {
        domElement: '#nameOfaLocation',
        validate: function() {
          return !(addressSearch.address == null || addressSearch.longitude == 0 || addressSearch.latitude == 0);
          }
      },
      Longitude: {
        domElement: '#nameOfaLocation',
        validate: function() {
          return !(addressSearch.address == null || addressSearch.longitude == 0 || addressSearch.latitude == 0);
          }
      }
    });
  }
  CalendarManager.prototype.openCalendar = function() {
    var obj = this;
  	changeRightNavigation('calendarRightNav', null);
  	/*
  	 use instead of below ajax to use
  	 with eventRender and viewDisplay
  	 obj.createCalendar();
	  */
  	var calendarEvents = new Array();
  	var start = new Date();
  	start.setMonth(start.getMonth() - 4, 1);

  	var end = new Date();
  	end.setMonth(end.getMonth() + 1, 30);
  	end.setFullYear(end.getFullYear() + 1);
    
  	$.ajax({
  		url :"listMeetings.action",
  		type :'POST',
  		data :{
  			selectedStartTimeMillis :start.getTime(),
  			selectedEndTimeMillis :end.getTime()
  		},
  		dataType :'json',
  		success :function(json) {
  			if (checkResponseSuccess(json)) {
  				if (json.meetingList) {
  					calendarEvents = obj.convertToCalendarEvent(json.meetingList);
            window.event_dates=[];
  				  $.each(calendarEvents, function(i,e) {
    				  window.event_dates.push(e.start);
  				  });

  				  $('#calendar .left').append('<div id="calendarDatepicker"></div>');
  					mcm = new MiniCalendarManager($('#calendarDatepicker'));

  					/*
  				  //obj.cal_wrapper.fullCalendar( 'removeEvents').fullCalendar('removeEventSources');
  				  //obj.cal_wrapper.fullCalendar('addEventSource',calendarEvents);

  					// old way
  					//obj.getExceptionList(calendarEvents, start, end);

  					// new way
  					*/
  					//obj.getExceptionListTime();

  					//obj.createCalendar(calendarEvents);
  					obj.getExceptionList(calendarEvents, start, end);
  				}

  			}
  		}
  	});


  	/*obj.calenderDaySelect($('#calendarDatepicker'), [17/06/12, 18/06/12]);*/
  };

  CalendarManager.prototype.getExceptionListTime = function() {
    var obj = this
    return $.ajax({
  		url :'getMyAvailability.action',
  		type :'POST',
  		async :false,
  		dataType :'json',
  		success :function(json) {
  			if (checkResponseSuccess(json)) {
  				if (json.timeSettingList) {
  					calendarEvents = convertExceptionsToCalendarEvent(json.timeSettingList, calendarEvents);
  				}
  				obj.createCalendar(calendarEvents);
/*   				obj.fullCalendar('renderEvent',calendarEvents); */

  			}
  		}
  	});
  };

  CalendarManager.prototype.getExceptionList = function(calendarEvents, start, end) {
    var obj = this
    return $.ajax({
  		url :'getExceptionList.action',
  		type :'POST',
  		async :false,
  		data :{
  			exceptionStartTime :start.getTime(),
  			exceptionStopTime :end.getTime()
  		},
  		dataType :'json',
  		success :function(json) {
  			if (checkResponseSuccess(json)) {
  				if (json) {
            calendarEvents = obj.convertExceptionsToCalendarEvent(json, calendarEvents);
  				}
  				obj.createCalendar(calendarEvents);
  			}
  		}
  	});
  };

  CalendarManager.prototype.convertExceptionsToCalendarEvent = function(exceptionList, eventArr) {
    for ( var x = 0; x < exceptionList.exceptionList.length; x++) {
    	var startTimeH = new Date(exceptionList.exceptionList[x].fromTimeStamp).getHours();
    	var startTimeM = new Date(exceptionList.exceptionList[x].fromTimeStamp).getMinutes();
    	if(startTimeM  < 10 ){
		    startTimeM = '0'+ startTimeM;
    	} 
    	var endTimeH = new Date(exceptionList.exceptionList[x].toTimeStamp).getHours();
    	var endTimeM =  new Date(exceptionList.exceptionList[x].toTimeStamp).getMinutes();
    	if(endTimeM  < 10 ){
		    endTimeM = '0'+ endTimeM;
    	} 

  		eventArr.push({
  			id :exceptionList.exceptionList[x].rule_id,
  			title :startTimeH+':'+startTimeM +'-' +endTimeH+':'+endTimeM +' | ' +$.i18n.prop('myVisibility.exception.calendar.title') +' | '+ exceptionList.exceptionList[x].exceptionName,
  			start :new Date(exceptionList.exceptionList[x].fromTimeStamp),
  			end :new Date(exceptionList.exceptionList[x].toTimeStamp),
  			allDay :false,
  			exceptionReason :exceptionList.exceptionList[x].text,
  			exceptionIndicator :exceptionList.exceptionList[x].indicator
  		});
  	}
  	return eventArr;
  };

  CalendarManager.prototype.convertToCalendarEvent = function(meetingList) {
    var eventArr;
  	eventArr = new Array();
  	for ( var i = 0; i < meetingList.length; i++) {
  		var start = new Date(meetingList[i].start_timestamp);
  		var today = new Date();
  		var title = '';
  		if (meetingList[i].message_subject != null && meetingList[i].message_subject != undefined) {
  			title = meetingList[i].message_subject;
  		}
  		if (meetingList[i].id != null && meetingList[i].start_timestamp != null && meetingList[i].end_timestamp != null) {
  			eventArr.push({
  				id :meetingList[i].id,
  				title :title,
  				start :new Date(meetingList[i].start_timestamp),
  				end :new Date(meetingList[i].end_timestamp),
  				allDay :false
  			});

  		}
  	}
  	return eventArr;
  };


  /*this function builds an array with the displayed days*/
  CalendarManager.prototype.viewCalDisplay = function (view) {

    var obj = $(this);
    var cal = this;
    var $calE = obj;

    var today = $calE.fullCalendar('getDate');
    var cMonth = today.getMonth();
    var cYear = today.getFullYear();
    var lDay, lMonth, lYear, lDate ;
    var $cal_slots=$(view.element.find('.fc-day-number'));
    if ($cal_slots!=null) {
            CalendarManager.dateArr = [];
            $cal_slots.each(function() {
                lDay = parseInt($(this).text());
                /*check if it is another month date*/
                if($(this).parents('td').hasClass('fc-other-month')) {
                    lYear = parseInt(cYear);

                    if(lDay>15) {
                        lMonth = parseInt(cMonth) - 1;
                        lDate = new Date(lYear,lMonth,lDay);
                        CalendarManager.dateArr.push(lDate);
                    } else {/*belong to the next month*/
                        lMonth = parseInt(cMonth) + 1;
                        lDate = new Date(lYear,lMonth,lDay);
                        CalendarManager.dateArr.push(lDate);
                    }
                } else {
                    lMonth = parseInt(cMonth);
                    lDate = new Date(lYear,lMonth,lDay);
                    CalendarManager.dateArr.push(lDate);
                }
            });

     }
  };

  /* paints the days cells*/
  CalendarManager.prototype.onRenderCalDay = function(event, element, view){

    var obj = $(this);
    var $calE = obj;
    if (event.end==null)
      event.end = event.start;


    var daySlots= view.element.find('td')

    for(var i in CalendarManager.dateArr){
        aSlot=$(daySlots[i])


        if((Math.round(CalendarManager.dateArr[i].getTime() / 1000) >= Math.round(event.start.getTime() / 1000))&&
           (Math.round(CalendarManager.dateArr[i].getTime() / 1000) <= Math.round(event.end.getTime() / 1000))) {
                if (aSlot!=null){
                    /*aSlot.attr('title',"Click here to see this day's events"); /// adds a hint to the day cell
                    aSlot.addClass("event") ;                      /// colorize the day cell through custom css class*/
                }
          }
    }
  };

  CalendarManager.prototype.createCalendar = function(events) {
    var obj = this;
    var todate = new Date(); 
  	this.cal_wrapper.html('');
  	var selectFunction;
  	if (lbasRightManager.checkRight('create_meetings')) {
  	 /* click / select days on calendar */
  	 selectFunction = function(start, end, allDay) {

    	 obj.cal_wrapper.fullCalendar('unselect');
    	 var activeDiv = obj.cal_wrapper.find("span[class*='fc-state-active']");
    	 var activeDivClass = activeDiv.attr("class");

    	 if (activeDivClass.contains('fc-button-agendaDay') || activeDivClass.contains('fc-button-agendaWeek')) {
    	   /* day or week view selected*/
    	   /*
var invalidDate = validateMeetingTime(start, end);
    	   if (!invalidDate) {
      	   createNewMeeting(false, 0.0, 0.0, false, start, end);
      	 }
*/      
        /* open popup */
        obj.createEventPopup(start, end);
        
      } else {/* month view selected*/
          /* open popup */
          obj.createEventPopup(start, end);
          /*
          start.setHours(todate.getHours());
          start.setMinutes(todate.getMinutes());
          createNewMeeting(false, 0.0, 0.0, false, start, null);
          */
        }
      };
    }
    var centerpHeight = parseInt($('#centerP').css('height'));
    var monthView = 'MMMM yyyy'; /* September 2009*/
    var weekView = "MMM d[ yyyy]{ '&#8212;'[ MMM] d yyyy}";/* Sep 7 - 13 2009*/
    var dayView = 'dddd, MMM d, yyyy';/* Tuesday, Sep 8, 2009*/

    if (userLocale == 'de' || userLocale == 'DE') {
    	weekView = "d[ yyyy]. MMM { '&#8212;' d. MMM yyyy}"; /* 4. Jul — 10. Jul 2011*/
    	dayView = 'dddd, d. MMM yyyy'; /* Freitag, 8. Jul 2011*/
    }

    var calendar = this.cal_wrapper.fullCalendar(
  		{
  			header :{
  				left :'agendaDay,agendaWeek,month',
          /* right :'title prev,next' */
  				right :'prev title next'

  			},
  			allDaySlot :false,
  			firstDay :1,
  			buttonText :{
  				month :$.i18n.prop('calendar.month'),
  				week :$.i18n.prop('calendar.week'),
  				day :$.i18n.prop('calendar.day')
  			},
  			titleFormat :{
  				month :monthView,
  				week :weekView,
  				day :dayView
  			},
  			dayNamesShort :$.i18n.prop('calendar.dayNamesShort').split(','),
  			dayNames :$.i18n.prop('calendar.dayNames').split(','),
  			monthNames :$.i18n.prop('calendar.monthNames').split(','),
  			monthNamesShort :$.i18n.prop('calendar.monthNamesShort').split(','),
  			selectable :true,
  			selectHelper :true,
  			select :selectFunction,
  			/*
  			eventMouseover: function(calEvent, jsEvent, view) {
  			},*/

  			eventClick :function(calEvent, jsEvent, view) {
  				if (calEvent.title == $.i18n.prop('myVisibility.exception.calendar.title')) {
  					openAddTimeExceptionDialog(calEvent.id, calEvent.start.getTime(), calEvent.end.getTime(), calEvent.exceptionReason,
  							calEvent.exceptionIndicator, 1);
  				} else {
  				  var coords = [jsEvent.pageX, jsEvent.pageY]
  				  obj.openMeetingDetailsPopup(calEvent.id, calEvent.title, calEvent, coords);
  				}
  			},

  			/*
  			dayClick: function(date, allDay, jsEvent, view) {
          if (allDay) {
              alert('Clicked on the entire day: ' + date);
          }else{
              alert('Clicked on the slot: ' + date);
          }
          //alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
          //alert('Current view: ' + view.name);
          // change the day's background color just for fun
          //$(this).css('background-color', 'red');
          //$(this).addClass('event');
        },
        */

  			height :centerpHeight - 30,
  			timeFormat :'H:mm',
  			disableResizing :true,
  			disableDragging :true,
  			events :events,
  			eventColor:"#007d92",
  			eventRender: function(event, element) {
          element.find('.fc-event-time').hide();
        },
  			/*
  			eventRender: obj.onRenderCalDay,
        viewDisplay: obj.viewCalDisplay,
  			events: function(start,end,eventsCallBack) {

    		  var calendarEvents = new Array();
        	var start = new Date();
        	start.setMonth(start.getMonth() - 4, 1);

        	var end = new Date();
        	end.setMonth(end.getMonth() + 1, 30);

        	$.ajax({
        		url :"listMeetings.action",
        		type :'POST',
        		data :{
        			selectedStartTimeMillis :start.getTime(),
        			selectedEndTimeMillis :end.getTime()
        		},
        		dataType :'json',
        		success :function(json) {

        			if (checkResponseSuccess(json)) {


          			var i, daySlots, arrLen, events = [];
          			daySlots=$('#calendar-wrapper').find('td');
          			arrLen=daySlots.length;
          			for( i=0; i<arrLen ;i++) {
                    //$j(daySlots[i]).attr('title','')    /// removes hint
                    $(daySlots[i]).removeClass('event'); /// removes custom css class
                }


        				if (json.meetingList) {
        					calendarEvents = convertToCalendarEvent(json.meetingList);


        				  $.each(calendarEvents, function(i,e) {
          				  window.event_dates.push(e.start);
        				  });



        					mcm = new MiniCalendarManager($('#calendarDatepicker'));


        				}

        			}

        			eventsCallBack(calendarEvents);
        		}
        	});

    		},
    		*/
  			axisFormat :"H:mm", /* 24h timeformat*/
  			columnFormat :{
  				month :"ddd",
  				week :"ddd",
  				day :"dddd"
  			}
  		}
    );
    
    obj.calendar = calendar;
    /*
    $('.fc-button-agendaWeek').live('click', function(e){
      var view = calendar.fullCalendar('getView');

      if (view.end.getMonth() > view.start.getMonth()) {
        $('#calendarDatepicker').datepicker('setDate', 'c+1m');

        // /* fix for fullcalendar bug skipping one month
        calendar.fullCalendar( 'gotoDate', view.end);
      }
      
    });
*/
    /* Navigazione fullCalendar --> datePicker */
    $('.fc-button-prev').die().live('click', function(e){
      var view = calendar.fullCalendar('getView');
      switch (view.name){
        case "month":
          /* update datepicker */
          $('#calendarDatepicker').datepicker('setDate', 'c-1m');
          /* fix for fullcalendar bug skipping one month */
          /*calendar.fullCalendar( 'gotoDate', $('#calendarDatepicker').datepicker('getDate'));*/
          break;
        case "agendaWeek":
          /*
          
          if ( view.start.getMonth() < $('#calendarDatepicker').datepicker('getDate').getMonth() ) {
            // update datepicker
            $('#calendarDatepicker').datepicker('setDate', 'c-1m');
          }
          
          // fix for fullcalendar bug skipping one month
          //calendar.fullCalendar( 'gotoDate', $('#calendarDatepicker').datepicker('getDate').getYear(), $('#calendarDatepicker').datepicker('getDate').getMonth());
          */
          break;
        case "agendaDay":
          /*

          if (view.start.getMonth() < $('#calendarDatepicker').datepicker('getDate').getMonth()) {
            //update datepicker
            $('#calendarDatepicker').datepicker('setDate', 'c-1m');
          }
          */
          break;
      }
      
      
      
/*
      if (calendar.fullCalendar('getView').name == "month") {
        $('#calendarDatepicker').datepicker('setDate', 'c-1m');
        calendar.fullCalendar( 'gotoDate', $('#calendarDatepicker').datepicker('getDate'));
      }
*/
    });
    $('.fc-button-next').die().live('click',function(){

      var view = calendar.fullCalendar('getView');
      switch (view.name){ 
        case "month":
          /* update datepicker */
          $('#calendarDatepicker').datepicker('setDate', 'c+1m');
          /* fix for fullcalendar bug skipping one month */
          /*calendar.fullCalendar( 'gotoDate', $('#calendarDatepicker').datepicker('getDate'));*/
          break;
        case "agendaWeek":
          /*
          
          if ( view.start.getMonth() > $('#calendarDatepicker').datepicker('getDate').getMonth() ) {
            // update datepicker
            $('#calendarDatepicker').datepicker('setDate', 'c+1m');
          }
          
          // fix for fullcalendar bug skipping one month
          //calendar.fullCalendar( 'gotoDate', $('#calendarDatepicker').datepicker('getDate').getYear(), $('#calendarDatepicker').datepicker('getDate').getMonth());
          */
          break;
        case "agendaDay":
          /*
          if (view.start.getMonth() > $('#calendarDatepicker').datepicker('getDate').getMonth()) {
            // update datepicker
            $('#calendarDatepicker').datepicker('setDate', 'c+1m');
          }
          */
          break;
      }

      /*
      if (calendar.fullCalendar('getView').name == "month") {
        // /* update datepicker
        $('#calendarDatepicker').datepicker('setDate', 'c+1m');

        // /* fix for fullcalendar bug skipping one month
        calendar.fullCalendar( 'gotoDate', $('#calendarDatepicker').datepicker('getDate'));
      }
      */
    });
    calendar.fullCalendar( 'gotoDate', $('#calendarDatepicker').datepicker('getDate'));
  };

  CalendarManager.prototype.getCalendar = function() {
    //return $('#calendar-wrapper');
    return this.cal_wrapper;
  };

  CalendarManager.prototype.removeMeetingFromCalendar = function(meeting_id, event_title) {
    var obj = this;
    var dialogTitle =  "<img src=\"images/icon_notification.png\">" + $.i18n.prop('message.delete.event');

    var btns = {};

    utils && utils.dialog({
      title : dialogTitle,
      content: $('.delete-popup'),
      buttons : btns,
      css: 'noClose delete-text'
    });

    /* POSITION DIALOG*/
    var dialogWidth = $('.ui-dialog.delete-text').outerWidth();
    $('.ui-dialog.delete-text').css({
      'width':'364px'
    });

    var text = $.i18n.prop('meetings.delete.alert', event_title);
    text = text.replace(event_title, '<strong>'+event_title+'</strong>');
    $(".ui-dialog.delete-text .text").html(text);
    /*
    //$('.ui-dialog.delete-text').find('.text').text($.i18n.prop('meetings.delete.alert', event_title));
    //$(".ui-dialog.delete-text .text:contains('"+event_title+"')").html().replace(event_title, '<strong>'+event_title+'</strong>');
    //$(".ui-dialog.delete-text .text").text( $(".ui-dialog.delete-text .text:contains('"+event_title+"')").html().replace(event_title, 'aaaa') );
    */
    $('.ui-dialog.delete-text').find('.delete-popup').show();


    $('.ui-dialog').find('button.send')
      .mousedown(function(){$(this).addClass('purple_button_active');obj.deleteMeeting(meeting_id);$('.ui-dialog').each(function(){$(this).remove();$('#dialog').remove();});})
      .mouseup(function(){$(this).removeClass('purple_button_active');})
      .mouseenter(function(){$(this).addClass('purple_button_over');})
      .mouseleave(function(){$(this).removeClass('purple_button_over');});


    $('.ui-dialog').find('button.cancel')
      .mousedown(function(e){
        e.preventDefault();
        $(this).addClass('cancelActive');
        $('.ui-dialog').each(function(){$(this).remove();$('#dialog').remove();});
    })
      .mouseup(function(){$(this).removeClass('cancelActive');})
      .mouseenter(function(){$(this).addClass('cancelOver');}).mouseleave(function(){$(this).removeClass('cancelOver');});
  };

  /* AUTOCOMPLETE LOCATION */
  CalendarManager.prototype.retrievePoiResponseForMeeting = function(poiResults, responseArr) {
  	if (poiResults != undefined) {
  		for ( var i = 0; i < poiResults.length; i++) {
  			responseArr.push({
  				label :poiResults[i].address,
  				value :poiResults[i].address,
  				latitude :poiResults[i].latitude,
  				longitude :poiResults[i].longitude
  			});
  		}
  	}
  	return responseArr;
  };

  CalendarManager.prototype.prepareAutoCompleteOperations = function() {
    var obj = this;
      $("#nameOfaLocation").autocomplete({
        
				source :function(request, response) {
				  var poiQuery=false;
				  var googleQuery=false;
					var responseArr = [];
					var collapsedArr = [];
					function collapseResult(datasearch) {
					  if(datasearch && datasearch.length > 0) {
  					  for (var j=0; j <datasearch.length; j++) {
  					    collapsedArr.push(datasearch[j]);
  					  }
					  }
					  if(poiQuery && googleQuery) {
					    $('#createMeeting .location .wrap span').removeClass('searchLoading');
					    response(collapsedArr);
					    /*$('.location-autocomplete li').eq(0).addClass("first-item");*/
					  }
					}
					
					$.ajax({
						url :"poiSearchAutocompleteWithCredentials.action",
						data :"q=" + request.term,
						success: function(data) {
						  poiQuery=true;
						  collapseResult($.map(data.poiSearchList, function(item) {
                  return {
                      label: item.name,
                      value: item.name
                  };
              }));
              /*response($.map(data.poiSearchList, function(item) {
                  return {
                      label: item.name,
                      value: item.name
                  };
              }));*/
             
            }
					});
          geocoder.geocode({ 'address': request.term, region: regionCountryCode }, function( results, status ) {
            googleQuery=true;
            var lbasResults = [ GMapsHelper.addressToObj(results[0], null, null, encodeURIComponent(request.term)) ];
            if (lbasResults[0]) {
              lbasResults[0].index = null;
              collapseResult(retrievePoiResponseForMeeting(lbasResults, responseArr));
              /*response(retrievePoiResponseForMeeting(lbasResults, responseArr));*/
            }
           
          });
					/*lbasGISConn.singleLineGeocode(encodeURIComponent(request.term), regionCountryCode, function(lbasResults) {
						response(retrievePoiResponseForMeeting(lbasResults, responseArr));
					}, function(lbasResults) {
						response(retrievePoiResponseForMeeting(lbasResults, responseArr));
					});*/
					forceAdressToGeocode = true;
				},
				focus:true,
				width :357,
				minLength :1,
				type:"json",
				search: function(event, ui){
  				$('#createMeeting .location .wrap span').addClass('searchLoading');
				},
				select :function(event, ui) {
					this.value = unEscapeHtmlEntity(ui.item.label);
					if (ui.item.latitude) {
						obj.setAddressSearchForMeeting(ui.item.label, ui.item.label, ui.item.latitude, ui.item.longitude);
					} else {
						$.ajax({
							url :'searchPOIs.action',
							type :'POST',
							async :false,
							data :{
                page: 0,
                searchText :ui.item.label
                /* listIndex :0, */
                /* poiId :ui.item.id */
							},
							dataType :'json',
							success :function(json) {
								if (json.poilist != null && json.poilist.length > 0) {
									obj.setAddressSearchForMeeting(json.poilist[0].name, json.poilist[0].address, json.poilist[0].latitude,json.poilist[0].longitude);
								}
							}
						});
					}

				},
				open :function() {
					/*$(this).removeClass("ui-corner-all").addClass("ui-corner-top");*/
				},
				close :function() {
					/*$(this).removeClass("ui-corner-top").addClass("ui-corner-all");*/
				}
			});

    $("#nameOfaLocation").autocomplete("widget").addClass("location-autocomplete");
    /*$("#nameOfaLocation").attr('autocomplete','on');*/
  };

  CalendarManager.prototype.setAddressSearchForMeeting = function (name, address, lat, lon) {
	  addressSearch.name = name;
	  addressSearch.address = address;
	  addressSearch.longitude = lon;
	  addressSearch.latitude = lat;
	  /*
	  $('#meetingLocationLatitude').val(lat);
	  $('#meetingLocationLongitude').val(lon);
	  $('#meetingLocationAddress').val(address);
	  */
  }

  CalendarManager.prototype.initLocation = function(default_location, default_lat, default_lng) {
    /* set defualt location if present */
    if (default_location != null) {
      $('#nameOfaLocation').val((default_location));
      addressSearch.address = default_location;
      addressSearch.name = default_location;
    }
    if (default_lat != null && default_lng != null) {
      addressSearch.latitude = default_lat;
      addressSearch.longitude = default_lng;
    }
    this.prepareAutoCompleteOperations();


    /*
    $("#nameOfaLocation").tokenInput("poiSearchAutocompleteWithCredentials.action", {
        method : 'GET',
        noResultsText : $.i18n.prop('no.results.text'),
        jsonContainer: 'poiSearchList',
        classes: {
            tokenList : 'token-input-list-facebook',
            token : 'token-input-token-facebook',
            tokenDelete : 'token-input-delete-token-facebook',
            selectedToken : 'token-input-selected-token-facebook',
            highlightedToken : 'token-input-highlighted-token-facebook',
            dropdown : 'token-input-dropdown-facebook',
            dropdownItem : 'token-input-dropdown-item-facebook',
            selectedDropdownItem : 'token-input-selected-dropdown-item-facebook',
            inputToken : 'token-input-input-token-facebook'
        }
    });
    */
  };
  /* FINE AUTOCOMPLETE LOCATION*/

  /* AUTOCOMPLETE ATTENDEES */
  CalendarManager.prototype.initAttendees = function(default_attendee) {
    var pre_list = null;
    var action_btn = $('.ui-dialog').find('button.send span');
    if (default_attendee != null) {
      pre_list = [];
      $.each(default_attendee, function(i, el) {
        pre_list.push( {id:'u'+el.id, name: el.name} );
      });
      /*pre_list = [{id:1, name:default_attendee}];*/
    }

    if (pre_list.length>0) {
      action_btn.text($.i18n.prop('message.send'));
    }


    $("#meetingAttendees > textarea").tokenInput("userSearchTokenAutocomplete.action", {
        prePopulate: pre_list,
        type : 'POST',
        noResultsText : $.i18n.prop('no.results.text'),
        preventDuplicates : true,
        jsonContainer: 'resultList',
        onResult: function(results){
           $.each(results.resultList, function (key, value) {
             if(value) {
               if(value.type === 'group'){
                 results.resultList.splice(key, 1)
               }
             }
           });
          return results;
        },
        onDelete: function(){
          if ($('#meetingAttendees li.token-input-token-facebook').length > 0) {
            action_btn.text($.i18n.prop('message.send'));
          } else {
            action_btn.text($.i18n.prop('message.save'));
          }
        },
        tokenFormatter: function(item){
          action_btn.text($.i18n.prop('message.send'));
          return "<li>" + "<span style='display: inline-block;' class='user-name'>" + item.name + "</span><span class='user-id' style='display:none'>" + item.id + "</span></li>"
        },
        classes: {
            tokenList : 'token-input-list-facebook',
            token : 'token-input-token-facebook',
            tokenDelete : 'token-input-delete-token-facebook',
            selectedToken : 'token-input-selected-token-facebook',
            highlightedToken : 'token-input-highlighted-token-facebook',
            dropdown : 'token-input-dropdown-facebook',
            dropdownItem : 'token-input-dropdown-item-facebook',
            selectedDropdownItem : 'token-input-selected-dropdown-item-facebook',
            inputToken : 'token-input-input-token-facebook'
        }
    });
  };

  CalendarManager.prototype.createEventPopup = function(start, end, prepopulate, from_map) {    
    var obj = this;
    /* scroll page up */
    $('html, body').animate({scrollTop: 0}, {duration:700, easing:'swing'});
    var dialogTitle = $.i18n.prop('calendar.create.new.event');
    var obj = this;
    var btns = {};
    var edit = false;
    /* EDIT MODE */
    if (typeof prepopulate != 'undefined' || prepopulate != null) {
    	if (typeof from_map == 'undefined' || from_map == null) {
      		edit = true;
     	}
    }

    if (edit) {
      dialogTitle = $.i18n.prop('calendar.edit.event');
    }

    utils.closeDialog();
    utils && utils.dialog({
    	content : parseTemplate("meetingCreateNewTemplate", {}),
    	css: 'noClose',
    	title: dialogTitle,
    	buttons : btns
    	});

    $('div.ui-dialog').addClass('overflow-not-hidden');

    /* set fields if present (edit mode) */
    if (edit) {
      $('#meetingSubject').val(unescape(prepopulate.subject));
      $('#meetingDetails').val(unescape(prepopulate.details));
    }
    /* set fields if present (from_map mode) */
    if (from_map) {
      $('#nameOfaLocation').val(prepopulate.location);
    }
    
    


    /* set start and end dates of event */
    $( "#start-date" ).datepicker({
			showOn: "button",
			buttonImage: "images/availability/my_availability_calendar_icon.png",
			buttonImageOnly: true,
			dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S' ],
			firstDay: +1,
			dateFormat: "dd/mm/yy",
			minDate: '0',
			defaultDate: start,
			beforeShow: function(input, inst) {
			 inst.dpDiv.css({marginTop: -(input.offsetHeight+95) + 'px', marginLeft: input.offsetWidth+50 + 'px'});
			 }
		});

		$( "#end-date" ).datepicker({
			showOn: "button",
			buttonImage: "images/availability/my_availability_calendar_icon.png",
			buttonImageOnly: true,
			dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S' ],
			firstDay: +1,
			dateFormat: "dd/mm/yy",
			minDate: '0',
			defaultDate: end,
			beforeShow: function(input, inst) {
			 inst.dpDiv.css({marginTop: -(input.offsetHeight+95) + 'px', marginLeft: input.offsetWidth+50 + 'px'});
			 }
		});


    /* POSITION DIALOG */
    var dialogWidth = $('.ui-dialog').outerWidth();
    $('.ui-dialog').css({
      'top': '50px',
      'margin-left': -dialogWidth/2,
      'left':'50%'
    });

    /* SET start / end DATES */

    $( "#start-date" ).datepicker('setDate', start);
    $( "#end-date" ).datepicker('setDate', end);
    
    /* set start / end time */
   
   if(from_map == true){/*if its coming from plan a meeting*/
        
   		  $('#createMeeting .hours').val(start.getHoursFormatted()+1);
	      $('#createMeeting .mins').val(start.getMinutesFormatted());
	      var d = new Date();
	      d.setHours(d.getHours() + 2);
	      $('#createMeeting #end-time .hours').val(d.getHoursFormatted());
	      $('#createMeeting #end-time .mins').val(end.getMinutesFormatted());      
	
   } else if (edit) {
      $('#createMeeting .hours').val(start.getHoursFormatted());
      $('#createMeeting .mins').val(start.getMinutesFormatted());
      $('#createMeeting #end-time .hours').val(end.getHoursFormatted());
      $('#createMeeting #end-time .mins').val(end.getMinutesFormatted()); 
      if(start.getHoursFormatted() === '00' && end.getHoursFormatted() === '00' && start.getMinutesFormatted() === '00' && end.getMinutesFormatted()=== '00'){
        $('#meetingCheckboxAllDay').attr('checked',true);
        $('#createMeeting .time-wrap span, #createMeeting .time-wrap .hours, #createMeeting .time-wrap .mins' ).hide();
        $('#createMeeting .time-wrap .disabled-input').val('00 : 00').prop('disabled', 'disabled').show();

        
      }
      
   } else {
	    if (obj.calendar.fullCalendar('getView').name != 'month') {
	      
	      $('#createMeeting .hours').val(start.getHoursFormatted()+1);
	      $('#createMeeting .mins').val(start.getMinutesFormatted());
	      $('#createMeeting #end-time .hours').val(end.getHoursFormatted());
	      $('#createMeeting #end-time .mins').val(end.getMinutesFormatted());      
	      
	    }else{ /* month view, have to set hours+mins manually */    
	      var d = new Date();
	      if (start.getTime()==end.getTime()) { /* if same day add 30 mins from current time to start time */
/* 	        d.setMinutes(d.getMinutes() + 30); */
	      }
    
	      start.setHours(d.getHours() + 1);
	      start.setMinutes(d.getMinutes());
	      end.setHours(d.getHours() + 2);
	      end.setMinutes(d.getMinutes());	      

        d.setHours(d.getHours() + 1);
	      $('#createMeeting .hours').val(d.getHoursFormatted());
	      $('#createMeeting .mins').val(d.getMinutesFormatted());
	      d.setHours(d.getHours() + 1);
	      $('#createMeeting #end-time .hours').val(d.getHoursFormatted());
	      

        $( "#start-date" ).datepicker('setDate', start);
        $( "#end-date" ).datepicker('setDate', end);
        console.log(start,end);
	      
	      
	    }
	}

    /* BUTTONS */
    $('.ui-dialog').find('button.send')
		.mousedown(function(){
        $(this).addClass('purple_button_active');
    })
		.mouseup(function(){
    	   $(this).removeClass('purple_button_active');
    })
		.mouseenter(function(){
    	   $(this).addClass('purple_button_over');
    })
		.mouseleave(function(){
    	   $(this).removeClass('purple_button_over');
    });

    $('.ui-dialog').find('button.cancel')
      .mousedown(function(e){
        e.preventDefault();
        $(this).addClass('cancelActive');
      })
    	.mouseup(function(){
    		$(this).removeClass('cancelActive');
    	})
    	.mouseenter(function(){
      	$(this).addClass('cancelOver');
    	})
    	.mouseleave(function(){
      	$(this).removeClass('cancelOver');
      });

    /*checkbox creator*/
     var warnETA=true;
     var showMyEta=true;
     var showMyLocation=true;
     
     if (edit) {
       for (var i=0; i <prepopulate.updateStoredObject.meeting.attendees.length ;i++)  {
         var item_attendee=prepopulate.updateStoredObject.meeting.attendees[i];
         if(item_attendee.user_id ==  currentUser) {
           warnETA=item_attendee.warnETA;
           showMyEta=item_attendee.showMyEta;
           showMyLocation=item_attendee.showMyLocation;
         }
       }
     } 
    $('#checkboxShowEta')[0].checked=showMyEta;
    $('#checkboxShowLocation')[0].checked=showMyLocation;
    $('#checkboxWarnETA')[0].checked=warnETA;

    /* CANCEL CLICK =================================================================== */
    $('.ui-dialog').find('button.cancel').mousedown(function(e){
        e.preventDefault();
     }).click(function(e) {
      utils.closeDialog();
      $( "#start-date" ).datepicker('destroy');
      $( "#end-date" ).datepicker('destroy');
    });

    /* SEND CLICK =====================================================================  */
    $('.ui-dialog').find('button.send').mousedown(function(e){
        e.preventDefault();
     }).click(function(e) {
      var form = $('#createMeeting');
      var meeting_data = {};
      var meeting = {};
      /* start date */
      var s_pref = ($('#createMeeting #start-date').val()).split("/");
      var s_suf = ["00","00"];

      /* end date */
      var e_pref = ($('#createMeeting #end-date').val()).split("/");
      var e_suf = ["00","00"];

      if (!$('#createMeeting #meetingCheckboxAllDay').prop("checked")) {
        s_suf[0] = $('#createMeeting #start-time .hours').val();
        s_suf[1] = $('#createMeeting #start-time .mins').val();
        e_suf[0] = $('#createMeeting #end-time .hours').val();
        e_suf[1] = $('#createMeeting #end-time .mins').val();
      }

      /* js months start from 0 */
      s_pref[1] = parseInt(s_pref[1], 10)-1;
      e_pref[1] = parseInt(e_pref[1], 10)-1;

      /*var data= new Date('anno','mese','giorno','ora','minuti','secondi', 'millisecondi');*/
      var s_d = new	Date(''+s_pref[2]+'',''+s_pref[1]+'',''+s_pref[0]+'', ''+s_suf[0]+'', ''+s_suf[1]+'');
      var e_d;
      if (!$('#createMeeting #meetingCheckboxAllDay').prop("checked")) { /* if not allday event*/
        e_d = new	Date(''+e_pref[2]+'',''+e_pref[1]+'',''+e_pref[0]+'', ''+e_suf[0]+'', ''+e_suf[1]+'');
      }else {
        e_d = new Date(s_d.getTime()+86400000); /*86400000 == 24h*/
      }

      /* Meeting Object (not used -- only structure view) */

      /* meeting.attendees = new Array(); */
      /*meeting.usersIds = new Array();*/
      meeting.users = new Array();
      $('#createMeeting #meetingAttendees .token-input-list-facebook li.token-input-token-facebook').each(function(){
        var attendee = new Object();
        attendee.fullname = $(this).find('.user-name').text();
        /*meeting.attendees.push( attendee );*/
        var u_id = $(this).find('.user-id').text();
        /* meeting.usersIds.push( u_id ); */
        meeting.users.push( u_id );
      });
      $('#createMeeting #emailAttendeesList li').each(function(){
	      meeting.users.push($(this).find('.user-name').text());
      });      
      


      meeting.end_timestamp = e_d.getTime();
      meeting.latitude = addressSearch.latitude;
      meeting.longitude = addressSearch.longitude;

      /* meeting.location_address = []; */
      /* meeting.location_address.push(addressSearch.address); */


      meeting.message_details = $('#createMeeting #meetingDetails').val();
      meeting.message_subject = $('#createMeeting #meetingSubject').val();
      meeting.start_timestamp = s_d.getTime();

      /*meeting_data.meeting = meeting;*/
      meeting_data.latitude = meeting.latitude;
      meeting_data.longitude = meeting.longitude;

      meeting_data.end_timestamp = meeting.end_timestamp;
      meeting_data.start_timestamp = meeting.start_timestamp;

      meeting_data.message_details = meeting.message_details;
      meeting_data.message_subject =  meeting.message_subject;

      meeting_data.meetingLocationAddress = addressSearch.address;//meeting.location_address;
      meeting_data.meetingLocationName = addressSearch.name;
      /*
      meeting_data.usersIds = meeting.usersIds;
      meeting_data.attendees = meeting.attendees;
      */

      meeting_data.meetingUsers = meeting.users.join(',');
      meeting_data.showMyEta = false;
      meeting_data.showMyLocation = false;
      meeting_data.warnMyETA = false;
      
      if ($('#checkboxShowEta').is(':checked')) meeting_data.showMyEta = true;
      if ($('#checkboxShowLocation').is(':checked')) meeting_data.showMyLocation = true;
      if ($('#checkboxWarnETA').is(':checked')) meeting_data.warnMyETA = true;

      if (!edit){
        obj.addNewMeeting(meeting_data);
      }else{
    	var obj_to_update={};
    	obj_to_update.meeting=prepopulate.updateStoredObject.meeting;
    	//obj_to_update.meeting.start_timestamp=meeting_data.start_timestamp;
    	//obj_to_update.meeting.end_timestamp=meeting_data.end_timestamp;
    	//meeting_data=tempStoredObject;

    	/*meeting_data.id=prepopulate.MeetingId;
    	meeting_data.chairFullName=prepopulate.meeting.chairFullName;
    	meeting_data.chairId=prepopulate.meeting.chairId;
    	meeting_data.chairMsisdn=prepopulate.meeting.chairMsisdn;
      obj.updateMeeting(meeting_data);	*/
      
      obj_to_update.meeting.latitude = addressSearch.latitude;
      obj_to_update.meeting.longitude = addressSearch.longitude;      
      
      //convert userid to id
      var iduser=meeting_data.meetingUsers.split("u").join("");
      iduser=iduser.split("g").join("");
      
      obj_to_update.meeting.message_details =meeting.message_details,
      obj_to_update.meeting.message_subject=meeting.message_subject,
      obj_to_update.meeting.end_timestamp = meeting.end_timestamp;
      obj_to_update.meeting.start_timestamp = meeting.start_timestamp;
      
      obj_to_update.meetingUsers= iduser;
      obj_to_update.meetingLocationAddress= addressSearch.address;
      obj_to_update.meetingLocationName= addressSearch.name;
      obj_to_update.showMyEta= meeting_data.showMyEta;
      obj_to_update.showMyLocation= meeting_data.showMyLocation;
      obj_to_update.warnMyETA= meeting_data.warnMyETA;
      
      
      obj.updateMeeting(obj_to_update); 
      }
    });



    /* all day click */
    $('#meetingCheckboxAllDay').click(function() {
      if ($(this).prop("checked")) {
        /* replace inputs/span with single input */
        $('#createMeeting .time-wrap span, #createMeeting .time-wrap .hours, #createMeeting .time-wrap .mins' ).hide();
        $('#createMeeting .time-wrap .disabled-input').val('00 : 00').prop('disabled', 'disabled').show();
        /* add one day to start date */
        $( "#end-date" ).datepicker('setDate', new Date(start.getTime() + 86400000) );

      }else {
				var myTime = new Date();
				var StartTimeHour = myTime.getHours()+1;
        var EndTimeHour= myTime.getHours()+2; 
				$('#start-time .hours').val( StartTimeHour < 10 ? '0'+StartTimeHour : StartTimeHour );		
				$('#end-time .hours').val(EndTimeHour < 10 ? '0'+EndTimeHour : EndTimeHour);		
        $('#createMeeting .mins').val(new Date().getMinutesFormatted());
        $('#createMeeting .time-wrap .disabled-input').hide();
        $('#createMeeting .time-wrap span, #createMeeting .time-wrap .hours, #createMeeting .time-wrap .mins' ).show();
        $( "#end-date" ).datepicker('setDate', start);
      }
    });

		if (prepopulate != undefined && prepopulate.thirdPartyEmails != null) {
	var emailAttendees = prepopulate.thirdPartyEmails;
			var substr= emailAttendees.split(',');
			  $.each(substr, function(i,el) {
				$('<li class="token-input-token-facebook"> <span style="display: inline-block"; class="user-name">'+ el +'</span><a href="#" onclick="$(this).parent().remove(); return false;">×</a></li>').appendTo($('#emailAttendeesList'));
			});
		}


    /* extract attendee names from attendees array */
    var attendee_names = [];
    if (typeof prepopulate != 'undefined' || prepopulate != null) {
      if (typeof prepopulate.attendees != 'undefined' || prepopulate.attendees != null) {
        $.each(prepopulate.attendees, function(i, el){
          //attendee_names.push(el.fullname, el.user_id);
          attendee_names.push({"name":el.fullname, "id":el.user_id})
          });
      }
    } else {
      /* init attendees */
      if (edit == false) {
        prepopulate = {
          attendees : null,
          location : null,
          lat : null,
          lng : null
        };
      }
    }


    obj.initAttendees(attendee_names);
    obj.initLocation(prepopulate.location, prepopulate.lat, prepopulate.lng);
	
	/*checking inputs*/
	checkTheInputTime();
  };

  CalendarManager.prototype.addNewMeeting = function(meeting_data) {
    var obj = this;
    $.ajax({
      url: "addNewMeeting.action",
      type: "POST",
      async: false,
      data: {
        startTimestamp: meeting_data.start_timestamp,
        endTimestamp: meeting_data.end_timestamp,
        latitude: meeting_data.latitude || '',
        longitude: meeting_data.longitude || '',
        messageDetails : meeting_data.message_details,
        messageSubject : meeting_data.message_subject,
        meetingLocationAddress: meeting_data.meetingLocationAddress,
        //meeting.usersIds": meeting_data.usersIds.join(','),
        //meetingLocationAddress: meeting_data.meetingLocationAddress.join(','),
        meetingLocationName: meeting_data.meetingLocationName,
        meetingUsers: meeting_data.meetingUsers,
        //meetingUsers: meeting_data.usersIds.join(','),
        showMyEta: meeting_data.showMyEta,
        showMyLocation: meeting_data.showMyLocation,
        warnMyETA: meeting_data.warnMyETA
      },
      dataType: "json",
      success: function(addMeetingJson) {
        if (checkResponseSuccess(addMeetingJson, function(errors) { obj.manageErrors(errors); } )) {
          utils.closeDialog();
          utils.dialogSuccess(addMeetingJson.message);
          obj.openCalendar();
  			}
      }
    });
  };

  CalendarManager.prototype.updateMeeting = function(meeting_data) {
    var obj = this;
    /*
    var meeting ={      
    	attendees:[],
    	chairFullName:meeting_data.chairFullName,
  		chairId:meeting_data.chairId,
  		chairMsisdn:meeting_data.chairMsisdn,
  		end_timestamp:meeting_data.end_timestamp,
  		id:meeting_data.id,
  		latitude:meeting_data.latitude,
  		longitude:meeting_data.longitude,
  		location_address:meeting_data.meetingLocationAddress,
  		message_details:meeting_data.message_details,
  		message_subject:meeting_data.message_subject,
  		start_timestamp:meeting_data.start_timestamp,
  		usersIds: meeting_data.meetingUsers,
  		thirdPartyEmails:""*/
  		/*rescheduled:"",
  		thirdPartyEmails:"",
  		usersIds:""*/
   /* 	};
    	
    var data={
      meeting : meeting,
      meetingUsers: meeting_data.meetingUsers,
      meetingLocationAddress: meeting_data.meetingLocationAddress,
      meetingLocationName: meeting_data.meetingLocationName,
      showMyEta: $('#checkboxShowEta').is(':checked'),
      showMyLocation: $('#checkboxShowLocation').is(':checked'),
      warnMyETA: $('#checkboxWarnETA').is(':checked') 
      //meeting.usersIds": meeting_data.usersIds.join(','),
      //meetingLocationAddress: meeting_data.meetingLocationAddress.join(','),
      //meetingUsers: meeting_data.usersIds.join(','),
    }  */
   
    	
    	


    
    $.ajax({
      url: "updateMeeting.action",
      type: "POST",
      async: false,
      dataType: "json",
      contentType:'application/json',
      data: JSON.stringify(meeting_data),
      
      success: function(updateMeetingJson) {
        if (checkResponseSuccess(updateMeetingJson, function(errors) { obj.manageErrors(errors); } )) {
          utils.closeDialog();
          obj.openCalendar();
          
					utils.dialogSuccess(updateMeetingJson.message);
  			}
      }
    });
  };


  CalendarManager.prototype.editMeeting = function(id) {
    var obj = this;
    $.ajax({
  		url :"editMeeting.action",
  		type :'POST',
  		data :{
  			id : id
  		},
  		dataType :'json',
  		success :function(editMeetingJson) {
  		  if (checkResponseSuccess(editMeetingJson)) {
    		  var prepopulate = {};
    		  prepopulate.subject = editMeetingJson.meeting.message_subject;
    		  prepopulate.details = editMeetingJson.meeting.message_details;
    		  prepopulate.location = editMeetingJson.meeting.location_address;
    		  prepopulate.attendees = editMeetingJson.meeting.attendees;
    		  prepopulate.lat = editMeetingJson.meeting.longitude;
    		  prepopulate.lng = editMeetingJson.meeting.latitude;
    		  prepopulate.MeetingId = id;
    		  prepopulate.thirdPartyEmails = editMeetingJson.meeting.thirdPartyEmails;
    		  prepopulate.meeting=editMeetingJson.meeting
    		  var start = new Date(editMeetingJson.meeting.start_timestamp);
    		  var end = new Date(editMeetingJson.meeting.end_timestamp);
          prepopulate.updateStoredObject=editMeetingJson;
    		  obj.createEventPopup(start, end, prepopulate);

  		  }
  		}
    });
  };

  CalendarManager.prototype.showOnMap = function(id, time, creator, canEdit) {
   /*showMeetingAndAttendeePointsOnMap();*/
   queryEventOnMap(id, time, creator, canEdit);
   return;
    /*
    $('#btn_map').click();
    setTimeout(function() {
      showMeetingAndAttendeePointsOnMap(id);
    }, 500);
    return;*/
    
    //showMeetingAndAttendeePointsOnMap
    $('#btn_map').click();
    $.ajax({
  		url :"showMeetingOnMap.action",
  		type :'POST',
  		data :{
  			id : id,
  			localeTime : time
  		},
  		dataType :'json',
  		success :function(showOnMapJson) {
  		  if (checkResponseSuccess(showOnMapJson)) {
  		  		setTimeout(function() {
  		  		  
                showEventOnMap(showOnMapJson, creator, canEdit);
                /*showMeetingAndAttendeePointsOnMap(showOnMapJson, creator, canEdit);*/
                
                             
              }, 500);
  		  		/*if($('#map').length === 0){
  		  			setTimeout(function() {
		  		  		showEventOnMap(showOnMapJson, creator, canEdit);	  		  			
      				}, 3000);
  		  		}else{
	  		  		showEventOnMap(showOnMapJson, creator, canEdit);		
  		  		}*/
  		  		/*$('#btn_map').click();*/
    		  //name,address,latitude,longitude, index
  		  }
  		}
    });
  };

  CalendarManager.prototype.deleteMeeting = function(id) {
    var obj = this;

    $.ajax({
  		url :"deleteMeeting.action",
  		type :'POST',
  		data :{
  			id : id
  		},
  		dataType :'json',
  		success :function(deleteMeetingJson) {
  		  if (checkResponseSuccess(deleteMeetingJson)) {
  		    var btns = {};
          utils.closeDialog();
          utils && utils.dialog({
            /*title : $.i18n.prop('dialog.title.success'),*/
            content : "<div class='successMessageCheck'>" + $.i18n.prop('meetings.deleted') +"</div>",
            css: 'noCloseNoOk',
            modal: false
            /*buttonClass : 'purple_button'*/
          });
          $(".noCloseNoOk").hide();
          $(".noCloseNoOk").fadeIn("slow");
          meetingDialogManager.timeMsg(); /* fadeout for success message*/
          obj.openCalendar();
  		  }
  		}
    });
  };

  CalendarManager.prototype.openMeetingDetailsPopup = function(event_id, event_title, event, coords) {
    var obj = this;
    var dialogTitle = event_title;
    var btns = {};

    /*
    btns[$.i18n.prop('buttons.show.on.map')] = function() {
		  obj.showOnMap(event.id, new Date().getTime());
		};

		btns[$.i18n.prop('buttons.edit')] = function() {
  		obj.editMeeting(event.id);
		};


		btns[$.i18n.prop('buttons.delete')] = function() {

      obj.removeMeetingFromCalendar(event.id, event_title);

    };
    */

    utils.closeDialog();

    /* utils && utils.dialog({content : parseTemplate("meetingDetailsTemplate", {}), css: 'meeting-detail', title: dialogTitle, buttons : btns }); */



    /* fill dialog data */


    $.ajax({
  		url :"viewMeeting.action",
  		type :'POST',
  		data :{
  			id : event.id,
  			localeTime : new Date().getTime()
  		},
  		dataType :'json',
  		success :function(meetingDetailJson) {
	  		if(meetingDetailJson.errorText !== undefined){
		  		return false;
	  		}
    		/* show / hide btns */
    		if (meetingDetailJson.view_on_map_link_active) {
    		  btns[$.i18n.prop('buttons.show.on.map')] = function() {
      		  obj.showOnMap(event.id, new Date().getTime(), meetingDetailJson.creator, meetingDetailJson.canEdit);
      		};
        }
        
        if (meetingDetailJson.creator && meetingDetailJson.canEdit) {
          btns[$.i18n.prop('buttons.edit')] = function() {
            obj.editMeeting(event.id);
          };
         }
         
         if (meetingDetailJson.creator) {
            btns[$.i18n.prop('buttons.delete')] = function() {
            obj.removeMeetingFromCalendar(event.id, event_title);
          };
         }
       
        
        /*
        if (meetingDetailJson.canEdit) {
          btns[$.i18n.prop('buttons.edit')] = function() {
            obj.editMeeting(event.id);
          };
        }

        btns[$.i18n.prop('buttons.delete')] = function() {
          obj.removeMeetingFromCalendar(event.id, event_title);
        };*/

        utils && utils.dialog({content : parseTemplate("meetingDetailsTemplate", {}), css: 'meeting-detail', title: dialogTitle, buttons : btns });
        
        
        var start = new Date(meetingDetailJson.meeting.start_timestamp);//.toString();
  		var end = new Date(meetingDetailJson.meeting.end_timestamp);//.toString();



  		  $('#meetingDetails #location .content').html(meetingDetailJson.meeting.location_address);
/*      $('#meetingDetails #time .content').html(start.customFormat( "#DD#/#MM#/#YYYY# #hh#:#mm#" ) + " - " + end.customFormat( "#DD#/#MM#/#YYYY# #hh#:#mm#" ));
*/      $('#meetingDetails #time .content').html(start.getDate()+'/'+(start.getMonth()+1)+'/'+start.getFullYear()+'  '+start.getHoursFormatted()+':'+start.getMinutesFormatted() + " - " + end.getDate()+'/'+(end.getMonth()+1)+'/'+end.getFullYear()+'  '+end.getHoursFormatted()+':'+end.getMinutesFormatted() );


  		  $('#meetingDetails #details .content').html(meetingDetailJson.meeting.message_details);
/*   		  $('#meetingDetails #attendees .list').append('<li>'+ meetingDetailJson.userAsAttendee.fullname +'</li>'); */
  		  $.each(meetingDetailJson.meeting.attendees, function(i,el) {
  		    var eta = "ETA: ";
  		    if (el.showMyEta) {
  		       (el.eta != null && typeof el.eta != 'undefined')? eta += el.eta : eta += "-";
  		    } else {
  		      eta = "&nbsp;&nbsp;";
  		    }
  		    
  		   
    		  $('#meetingDetails #attendees .list').append('<li class="clearfix"><span class="name">'+el.fullname+'</span><span class="eta">'+ eta +'</span><span class="status">'+ el.acceptStatusString +'</span></li>');
    		});
    		
    		var string = meetingDetailJson.meeting.thirdPartyEmails;
    		if(string != null){
	    		var substr= string.split(',');
				$.each(substr, function(i,el) {
					$('#meetingDetails #attendees .list').append('<li class="clearfix"><span class="name">'+el+'</span></li>');
				});
		    }
	    	
    		/* POSITION DIALOG*/
        var dialogWidth = $('.ui-dialog').outerWidth();
        var dialogHeight = $('.ui-dialog').outerHeight();
        var top = coords[1]-(dialogHeight/2)+5;
        var left = coords[0];
        var screenWidth = $(window).width();
    		var control = left + dialogWidth;
        if( screenWidth > control){
        	$('.ui-dialog').css({
	          'top': top+'px',
	          'width':'370px',
	          'left':left
	         });
         }else{
         	$('.ui-dialog').css({
	          'top': top+'px',
	          'width':'370px',
	          'left':left-dialogWidth-50
	         }).addClass('opposite');
         }


  		}

    });
  };

  CalendarManager.prototype.calenderDaySelect = function(calendar, dates) {
    calendar.datepicker({
      beforeShowDay: function(dates) {
        for (var i = 0; i < dates.length; i++) {
          if (dates[i] == date) {
            return [true, 'highlight'];
          }
        }
      }
    });
  };

  CalendarManager.prototype.manageErrors = function(serverErrors) {
    var el = this.validator.parseServerErrors(serverErrors);
    $('#send-list-wrapper', '#createMeeting').empty().append(el);
    $('#error-view-sendmessage', '#createMeeting').show();
  };
  return CalendarManager;

})();


/* window.event_dates = [new Date(2012, 6-1, 30), new Date(2012, 6-1, 18)]; */
var MiniCalendarManager;

MiniCalendarManager = (function() {

  MiniCalendarManager.name = 'MiniCalendarManager';

  function MiniCalendarManager(wrapper) {
    this.cal_wrapper = wrapper;
    this.init();
  }

  MiniCalendarManager.prototype.init = function() {
    var o = this;
    var c_month = 0;
    var c_year = 0;
    var next_date = new Date();
    var last_date = new Date();

    o.cal_wrapper.datepicker(
			$.extend( {}, $.datepicker.regional['' + localeToBeUsed + ''], {
				showMonthAfterYear :false,
				onChangeMonthYear: function(year, month, inst) {

				  // set next date on datepicker obj
				  next_date.setFullYear(year);
				  next_date.setMonth(month-1);
				  $(this).datepicker('setDate', next_date);

				  // next or prev month on big calendar
				  /*
				  if ( next_date.getTime() > last_date.getTime() ) {
				    $('#calendar-wrapper').fullCalendar( 'next' );
				  }
				  else if ( next_date < last_date ) {
				    $('#calendar-wrapper').fullCalendar( 'prev' );
				  }
				  */

				  $('#calendar-wrapper').fullCalendar('gotoDate', $(this).datepicker('getDate'));

				  // update last date with next date
				  var date = $(this).datepicker('getDate');
				  c_year = date.getFullYear();
				  c_month = date.getMonth();
				  last_date.setFullYear(c_year);
				  last_date.setMonth(c_month);
				},
				dateFormat: 'dd/mm/yy',
				firstDay: 1,
				showOtherMonths: true,
				beforeShowDay: function(date) {
          for (var i = 0; i < window.event_dates.length; i++) {
            /* highlight day if event is present */
            if ( window.event_dates[i].getDate() == date.getDate() && window.event_dates[i].getMonth() == date.getMonth() && window.event_dates[i].getYear() == date.getYear() ) {
              return [true, 'highlight'];
            }
          }
          return [true, ''];

				},

				onSelect: function(dateText, inst) {
				  var date = $(this).datepicker('getDate');
				  /* update date on fullcalendar when user picks date on datepicker */
				  $('#calendar .right #calendar-wrapper').fullCalendar( 'gotoDate', date.getFullYear(), date.getMonth(), date.getDate() );

				}
			}));
  };

  return MiniCalendarManager;

})();

function editEventFromMap(id){
	$('#btn_calendar').click();
  setTimeout(function(){

    cm.editMeeting(id)
  }, 1000)
	//	var editThisEvent = new CalendarManager( $('#calendar-wrapper') );
	//	editThisEvent.editMeeting(id);		

}