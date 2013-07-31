function updateTips( t ) {
    /*
    tips
        .text( t )
        .addClass( "ui-state-highlight" );
    setTimeout(function() {
        tips.removeClass( "ui-state-highlight", 1500 );
    }, 500 );
    */
    return true;
}

function checkDate(field)
{
    var allowBlank = true;
    var minYear = 1902;
    var maxYear = 2500;
    var errorMsg = "";
    var regsDate= "";

    var regDate = new RegExp("^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$") ;

    if(field != '') {
        if( regsDate = field.match(regDate)) {
            if(regsDate[1] < 1 || regsDate[1] > 31) {
                errorMsg = "Invalid value for day: " + regsDate[1];
                updateTips( errorMsg );
                return errorMsg;
            } else
            if(regsDate[2] < 1 || regsDate[2] > 12) {
                errorMsg = "Invalid value for month: " + regsDate[2];
                updateTips( errorMsg );
                return errorMsg;
            } else
            if(regsDate[3] < minYear || regsDate[3] > maxYear) {
                errorMsg = "Invalid value for year: " + regsDate[3] + " - must be between " + minYear + " and " + maxYear;
                updateTips( errorMsg );
                return errorMsg;
            }
        } else {
            errorMsg = "Invalid date format: " + field;
            updateTips( errorMsg );
            return errorMsg;
        }
    }
    else
        if(allowBlank) {
            errorMsg = "Empty date not allowed!";
            updateTips( errorMsg );
            return errorMsg;
        }
return true;
}

function checkTime( field)
{
    var errorMsg = "";
    var regsTime = "";

    var regTime = new RegExp("^(\\d{1,2}):(\\d{1,2})$") ;

    if(field != '') {
        if(regsTime = field.match(regTime)) {
            if(regsTime[1] > 23) {
                errorMsg = "Invalid value for hours: " + regsTime[1];
                updateTips( errorMsg );
                return false;
            }
            else
                if( regsTime[2] > 59) {
                    errorMsg = "Invalid value for minutes: " + regsTime[2];
                    updateTips( errorMsg );
                    return false;
                }else{
                    return true;
                }
        } else {
            errorMsg = "Invalid time format: " + field;
            updateTips( errorMsg );
            return false;
        }
    }
    else  {
        errorMsg = "Empty time not allowed!";
        updateTips( errorMsg );
        return false;
    }
return true;
}

function loadAvailabilityMenu() {
/*    $('#visibility').html('Loading'); */
   $.ajax({
        url :'getMyAvailability.action',
        type :'POST',
        dataType :'json',
        contentType:'text/json',
        data:{ie:(new Date()).getTime()},
        cache:false,
        success :function(json) {
            if (checkResponseSuccess(json)) {
              
              delete firstCall;
                $('#visibility').html(parseTemplate("availabilityTemplate", {
                    json :json
                }));
                styleAvalibilityLink();
                setWidthAvalibility();
            }
        }
    });

}

var getApiCall = function(call, data){
    var url=call;
    var optionalArg = (typeof data === "undefined")?'':data;
    return $.post(url, optionalArg); /*, {count:5}, null, 'jsonp');*/
};



function loadAvailability(){

    $.when( getApiCall('getMyAvailability.action',{cache:false}),
        getApiCall('whoCanLocateMeNow.action',{cache:false})
    ).done(function(call1, call2){
            var allCalls = [].concat(call1[0]).concat(call2[0]);
            $('#availabilityDiv').html(parseTemplate("availabilityBodyTemplate", {
                json :allCalls
            }));
            setWidthAvalibility();
            loadAvailabilityMenu();
        });
}

function getVisibilityState() {
    var returnResp="";

    $.ajax({
        url :'getMyAvailability.action',
        type :'POST',
        async :false,
        dataType :'json',
        success :function(json) {
            if (checkResponseSuccess(json)) {
                returnResp = json;
            }
        }
    });
    return returnResp;
}


function loadWhoCanLocateMe() {

    $.ajax({
        url :'whoCanLocateMe.action',
        type :'POST',
        async :false,
        cache: false,
        dataType :'json',
        success :function(json) {
            if (checkResponseSuccess(json)) {
                $('#availabilityDiv').html(parseTemplate("whoCanLocateMeBodyTemplate", {
                    json :json
                }));
            setWidthAvalibility();    
            }
        }
    });

}


function loadWhomICanLocate() {
    $.ajax({
        url :'whomICanLocate.action',
        type :'POST',
        async :false,
        cache: false,
        dataType :'json',
        success :function(json) {
            if (checkResponseSuccess(json)) {
                $('#availabilityDiv').html(parseTemplate("whomICanLocateBodyTemplate", {
                    json :json
                }));
            setWidthAvalibility();    
            }
        }
    });

}

function selectChange(data){
    if (data === 'invisible') {
        $.ajax({
            url :'setVisibilityOff.action',
            type :'POST',
            dataType :'json'
        });
        $("#visIcon").css("background", "url(images/availability/availability_icon.png) " );
        $('#visibilityStatus-button .ui-selectmenu-status').empty().text($.i18n.prop('editVisibility.notvisible'));
        /* change top icon */
        $('#header #changeVisibiityIcon #myVis').removeClass('on');
	    $('#header #changeVisibiityBox #myVis').removeClass('on');
	    $('#header #changeVisibiityBox .visCheck').hide();
		$('#header #changeVisibiityBox .invisCheck').show();
        $('#header #changeVisibiityBox').hide();
        refreshUsers();
    }
    else
        if (data === 'visible') {
            $.ajax({
                url :'setVisibilityOn.action',
                type :'POST',
                dataType :'json'
            });
            $("#visIcon").css("background", "url(images/availability/avaibleCheck.png) " );
            $('#visibilityStatus-button .ui-selectmenu-status').empty().text($.i18n.prop('editVisibility.visible'));
            /* change top icon */
	        $('#header #changeVisibiityIcon #myVis').addClass('on');
		    $('#header #changeVisibiityBox #myVis').addClass('on');
		    $('#header #changeVisibiityBox .visCheck').show();
			$('#header #changeVisibiityBox .invisCheck').hide();
	        $('#header #changeVisibiityBox').hide(); 
	        refreshUsers();	        
    }
    if($('#availabilityDiv').is(':visible')){
	    loadAvailability();
    }
}


function AddExceptionDialog(nameExcp, start, end){
    var returnResp;
    if (nameExcp === ""){
	    nameExcp = $.i18n.prop('editVisibility.exception.addException');
    }
	var validator=new Validator({
	  exceptionName: {
        domElement: '#name',
        validate: 'presence'
      },
      exceptionStartTime: {
        domElement: '#start-date',
        validate: 'isvaliddate'
      },
      exceptionStopTime: {
        domElement: '#end-date',
        validate: 'isvaliddate'
      }
    });
	
	function errorsOnDialog(serverErrors) {
		var el = validator.parseServerErrors(serverErrors);
		$('#send-list-wrapper',"#dialog").empty().append(el);
    	$('#error-view-sendmessage',"#dialog").show();
	}
    $.ajax({
        url :'addAvailabilityException.action',
        type :'POST',
        async :false,
        data :{
            exceptionName : nameExcp,
            exceptionStartTime :start.getTime(),
            exceptionStopTime :end.getTime()
        },
        dataType :'json',
        success :function(json) {
            if (checkResponseSuccess(json, errorsOnDialog)) {
                returnResp = json;
            }
        }
    });
    return returnResp;
}

function DeleteExceptionDialog(ruleId){

    $.ajax({
        url :'deleteAvailabilityException.action',
        type :'POST',
        async :false,
        data :{
            ruleId : ruleId
        },
        dataType :'json',
        success :function(json) {
            if (checkResponseSuccess(json)) {
               /* returnResp = json; */

                var btns = {};

                utils.closeDialog();

                utils && utils.dialog({
                    content : "<div class='successMessageCheck'>" + json.infoMessage +"</div>",
                    css: 'noCloseNoOk'
                });
                                                  $('#availabilityDiv').empty();
                                  loadAvailability();
                $(".noCloseNoOk").hide();
                $(".noCloseNoOk").fadeIn("slow");
                timeMsg();
                
            }
        }
    });
}

function editExceptionDialog(exceptionName, exceptionRuleId, exceptionStartTime, exceptionStopTime){
    var returnResp;
    var startTime = $( "#start-date" ).datepicker('getDate');
    startTime.setHours( $('#start-time .hours').val() );
    startTime = startTime.setMinutes( $('#start-time .mins').val() );
    var endTime = $( "#end-date" ).datepicker('getDate');
    endTime.setHours( $('#end-time .hours').val() );
    endTime = endTime.setMinutes( $('#end-time .mins').val() );
    if ( exceptionName === ''){
      exceptionName = $.i18n.prop('editVisibility.exception.addException');
    }
    $.ajax({
        url :'editAvailabilityException.action',
        type :'POST',
        async :false,
        data :{
            exceptionName : exceptionName,
            exceptionRuleId : exceptionRuleId,
            exceptionStartTime : startTime,//exceptionStartTime.getTime(),
            exceptionStopTime :endTime//exceptionStopTime.getTime()
        },
        dataType :'json',
        success :function(json) {
            if (checkResponseSuccess(json)) {
                returnResp = json;
            }
        }
    });
    return returnResp;
}

function formatExcepDate(dateM) {
    var returnDate = [];
    var dateF = new Date(dateM);
    var month = dateF.getDate();
    var day = dateF.getMonth();
    day++;
    var year = dateF.getFullYear();
    var hours = dateF.getHours();
    var minutes = dateF.getMinutes();
/*
    var suffix = "AM";
    if (hours >= 12) {
        suffix = "PM";
        hours = hours - 12;
    }
    if (hours == 0) {
        hours = 12;
    }
*/
    if (minutes < 10)
        minutes = "0" + minutes;
    returnDate.push(day, month, year, hours, minutes);

    return returnDate;
}

function formatExcepTime(timeM) {
    var returnTime = [];

    var dateF = new Date(timeM);

    var hours = dateF.getHours();
    var minutes = dateF.getMinutes();
/*

    var suffix = "AM";
    if (hours >= 12) {
        suffix = "PM";
        hours = hours - 12;
    }
    if (hours == 0) {
        hours = 12;
    }
*/
    if (minutes < 10)
        minutes = "0" + minutes;

    returnTime.push( hours, minutes);

    return returnTime;
}

function styleAvalibilityLink(){
	$(".availabilityMenu li a").click(function() {
		utils.closeDialog();	
		$(".availabilityMenu li a").removeClass("active");
		$(this).addClass("active");
		
	});	
}

function setWidthAvalibility(){
	/*page width*/
	var pageWidth = $(window).width();
	var leftpart = $("#visibility").outerWidth()+125;	
	$("#availabilityDiv").css("width" , pageWidth - leftpart);
	
	/* left panel height*/
	var topPosition =$("#visibility").offset().top;
	var privacyHeight =  $("#availabilityDiv").outerHeight()+131;
	var visHeight = $(window).height();
	
	if( privacyHeight > visHeight  ){
		$("#visibility").css("height", privacyHeight);
	}else{
		$("#visibility").css("height", visHeight - topPosition );
		if ($("#visibilityProfiles-container").length == 1){
  			$("#visibility").css("height", visHeight - topPosition + 62 );
  		}
	}
}


function listVisibilityProfile(profileId){
    var returnResp;

    $.ajax({
        url :'listUsersAssignedToVisibilityProfile.action',
        type :'POST',
        async :false,
        data :{
            visibilityProfileId  :profileId
        },
        dataType :'json',
        success :function(json) {
            if (checkResponseSuccess(json)) {
                returnResp = json;
            }
        }
    });
    return returnResp;
}

function loadVisibilityProfilesDetails(profileId) {
    var returnResp;

    $.ajax({
        url :'getVisibilityProfileDetails.action',
        type :'POST',
        async :false,
        cache: false,
        data :{
            visibilityProfileId  :profileId
        },
        dataType :'json',
        success :function(json) {
            if (checkResponseSuccess(json)) {
                returnResp = json;
                $('.visProDropDown').selectmenu('destroy');
                /*$('.visProDropDown').selectmenu('destroy');*/
            }
        }
    });
    return returnResp;
}

function loadVisibilityProfiles() {
    $.ajax({
        url :'getMyVisibilityProfiles.action',
        type :'POST',
        async :false,
        cache: false,
        dataType :'json',
        success :function(json) {
            if (checkResponseSuccess(json)) {
                $('#availabilityDiv').html(parseTemplate("myVisibilityProfiles", {
                    json :json
                }));
                setWidthAvalibility();
            }
        }
    });
}

function removeUserPri(privacySettingRuleId, userId){
    var returnResp;

    $.ajax({
        url :'deleteAvailabilityException.action',
        type :'POST',
        async :false,
        data :{
            privacySettingRuleId : privacySettingRuleId,
            userId : userId
        },
        dataType :'json',
        success :function(json) {
            if (checkResponseSuccess(json)) {
                returnResp = json;
            }
        }
    });
    return returnResp;
}

function DeleteCanLocateDialog(permissionId, userId){
    
    $.ajax({
        url :'cancelLocationPermission.action',
        type :'POST',
        async :false,
        data :{
            permissionRuleId  : permissionId,
            userId  : userId
        },
        dataType :'json',
        success :function(json) {
            if (checkResponseSuccess(json)) {
            /* returnResp = json; */
				
                var btns = {};

                utils.closeDialog();

                utils && utils.dialog({
                    content : "<div class='successMessageCheck'>" + json.infoMessage +"</div>",
                    css: 'noCloseNoOk'
                });
                $(".noCloseNoOk").hide();
                $(".noCloseNoOk").fadeIn("slow");
                timeMsg();
				
			var currentNumber = $('#privacy #whoCanLocateMeNumber').text();	
			var newNumber =	parseInt(currentNumber);
				newNumber= newNumber - 1;
				$('#whoLocate-container h1 span').text(newNumber);
				$('#privacy #whoCanLocateMeNumber').text(newNumber);
				$('#whoLocate #plusBox .number').text(newNumber);
				$('#whoLocate #minusBox .number').text(newNumber);
            }
        }
    });
}


function deleteLocationPermission(privacySettingRuleId, userId) {

    var btns = {};

        utils && utils.dialog({
            title : '',
            content: $('#confirmDelete').html(),
            buttons : btns,
            css: 'noClose'
        });


        /* POSITION DIALOG*/
        var dialogWidth = $('.ui-dialog').outerWidth();
        $('.ui-dialog').css({
            'top': '270px',
            'margin-left': -dialogWidth/2,
            'width':'400px',
            'left':'50%'
        });

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

    $('button.send').bind('click', function(){
        removeUserPri(privacySettingRuleId, userId);
    });
}

function removeProfile(profileID, newprofileID){
    var returnResp;
    var newprofileID= newprofileID; 
    if(newprofileID == null){
	   newprofileID =''; 
    }
    $.ajax({
        url :'removeMyVisibilityProfile.action',
        type :'POST',
        async :false,
        data :{
            deleteProfileId : profileID,
            newProfileId : newprofileID
        },
        dataType :'json',
        success :function(json) {
            if (checkResponseSuccess(json)) {
                returnResp = json;
                loadVisibilityProfiles();
            }
        }
    });
    
    return returnResp;
}

function deleteProfile(profileID, taaab, index) {

        
}

var src = [], allEvents=[], srcJson;
var fullHours;
var addEvent = [];
var delEvent = [];
var events = [];
var date = new Date();
var d = date.getDate();
var m = date.getMonth();
var y = date.getFullYear();

function ShowCalendar(allEvents, full, clean, profileId)
{
    
    var pIR = profileId;
    if (profileId == '-100')
    {
	    $("#calClear, #calSave").hide();
    }else{
    	$("#calClear, #calSave").show();
    }
    fullHours = full;
    $('#calendarVis').empty();
    
    addEvent = [];
    delEvent = [];
    
    var oldSource = eventsX;
    var eventsX=new Array();
    var evntTmp;
    
        
        $.each(allEvents.visibilityProfileDetail.privacySettingList, function(index, value)
        {
            var dow = new Date().getDay() - 1;
            var fromHour = value.fromHour;
            var fh = fromHour.substring(0, 2);
            var ft = fromHour.substring(2, 4);
            var toHour = value.toHour;
            var th = toHour.substring(0, 2);
            var tt = toHour.substring(2, 4);

            var startX, endX;

            var todayFrom = new Date(y,m,d, fh, ft);
            var todayTo = new Date(y,m,d, th, tt);

            if (dow > value.dayOfWeek)
            {
                startX = new Date(y, m, d-(dow - value.dayOfWeek), fh, ft);
                endX = new Date(y, m, d-(dow - value.dayOfWeek), th, tt);
            }
            else
            {
                startX = new Date(y, m, d+(value.dayOfWeek - dow), fh, ft);
                endX = new Date(y, m, d+(value.dayOfWeek - dow), th, tt);
            }   
			
			var event = null;
            event = new Object();       
            event.id = value.rule_id;
            event.title = endX.format("HH:MM");
            event.start = startX;
            event.end = endX;
            event.allDay = false;
            eventsX.push(event);
        });
            
        var calendar =	$('#calendarVis').fullCalendar({
            header : { left: '',	center: '',	right: ''},
            columnFormat : { week: 'ddd' },
            allowCalEventOverlap : false,
            firstDay : 1,
            height: 600,
            defaultView : 'agendaWeek',
            allDaySlot : false,
            axisFormat : 'H:mm',
            timeFormat: 'H:mm',
            slotMinutes : 30,
            minTime : full == true ? 0 : 8,
            maxTime : full == true ? 24 : 18,
            firstHour: 8,
            selectable: pIR == -100 ? false : true,
            selectHelper: pIR == -100 ? false : true,
            draggable: pIR == -100 ? false : true, 
            droppable: pIR == -100 ? false : true, 
            editable: pIR == -100 ? false : true, 

            select: function(start, end, allDay)
            {
                var NewEvent = new Object();       
                NewEvent.id = -1;
                NewEvent.start = start;
                NewEvent.end = end;
                if (!isOverlapping(NewEvent))
                {
                    var dday = start.getDay() > 0 ? start.getDay() - 1 : 6;
                    addEvent.push({start:start,end:end,day:dday});
                    calendar.fullCalendar('renderEvent',
                        {
                            title: '', /*end.format("HH:mm"),*/
                            start: start,
                            end: end,
                            allDay: allDay
                        }, true  /*  make the event "stick" */
                    );
                }
                else
                    calendar.fullCalendar( 'unselect' );
                
            },
            
            eventDragStart: function(event, jsEvent, ui, view )
            {
                var dday = event.start.getDay() > 0 ? event.start.getDay() - 1 : 6;
                /*delEvent.push({id:event.id,day:dday});*/

            },
            
            eventDrop: function(event,dayDelta,minuteDelta,allDay,revertFunc)
            {
                var dday = event.start.getDay() > 0 ? event.start.getDay() - 1 : 6;
                var eventEndTime = event.end.format("HH:MM");
                event.title = eventEndTime;
             
                if (!isOverlapping(event)){
                    delEvent.push({id:event.id,day:dday});
                    addEvent.push({start:event.start,end:event.end,day:dday});
                }
                else
                    revertFunc();
                /*
                
				var array = calendar.fullCalendar('clientEvents');
				for(i in array)
                                {
                                    if(array[i].id != event.id)
                                    {
        				if(!(array[i].start >= event.end || array[i].end <= event.start)){ revertFunc();}
                                    }
				}
    			
    		*/	
				
                /*control the limits*/
                /*
                var firstTimeOnTable = $("#calendarVis .fc-slot0 th.fc-agenda-axis.fc-widget-header").html().split(":");
				var lastTimeOnTable = $("#calendarVis tr:last-child").prev().find("th").html().split(":");                
                var currentTimeStart = event.start.format("HH");
                var currentTimeEnd = event.end.format("HH");
                var currentTimeStartMin = event.start.format("MM");
                var currentTimeEndMin = event.end.format("MM");
                var workTime = $("#workingTime").hasClass("selected");
                var fullTime = $("#fullTime").hasClass("selected");
                var addDecimal = 0;
                
                if(workTime == true){
                	if ( "08" > currentTimeStart || currentTimeEnd > 18  || event.end.format("HH:MM") == "18:30") {revertFunc();}
                	event.title = event.end.format("HH:MM");
                }
                	
				if(fullTime == true){

					var valMinEnd = parseInt(currentTimeEndMin);
					var valMinStart = parseInt(currentTimeStartMin);
					var valHourStart = Number(currentTimeStart);
					var valHourEnd = Number(currentTimeEnd); 
					var decimal = valMinStart + valMinEnd;
					if (decimal == 30){	decimal = 0.5;	}else{ decimal = 0;	}
					var howLongIsBar = valHourEnd - valHourStart + decimal;  
					event.title = event.end.format("HH:MM");
					if(valHourEnd == 00 && valMinEnd == 00 ){

					}else if(valMinEnd == 30 && valHourEnd == 00 ){
						revertFunc();							
					}else if (howLongIsBar < 0){
						revertFunc();
					}else if( valHourStart+howLongIsBar != valHourEnd + decimal ){
						revertFunc();
					}
					  
				}
				*/
				/* control the limits end*/
				
            },
            
            eventResizeStart : function(event, jsEvent, ui, view )
            {
                var dday = event.start.getDay() > 0 ? event.start.getDay() - 1 : 6;
                
            },
            
            eventResize : function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view)
            {
                var dday = event.start.getDay() > 0 ? event.start.getDay() - 1 : 6;
                var eventEndTime = event.end.format("HH:MM");
				        event.title = eventEndTime;

                if (!isOverlapping(event))
                {
                    delEvent.push({id:event.id,day:dday});
                    addEvent.push({
						            start:event.start,
                        end:event.end,
                        title:"1",
                        day:dday});
                }
                else
                {
                    revertFunc();
                }    
                    /*control the limits*/
                   
               /*
                var firstTimeOnTable = $("#calendarVis .fc-slot0 th.fc-agenda-axis.fc-widget-header").html().split(":");
				var lastTimeOnTable = $("#calendarVis tr:last-child").prev().find("th").html().split(":");                
                var currentTimeStart = event.start.format("HH");
                var currentTimeEnd = event.end.format("HH");
                var currentTimeStartMin = event.start.format("MM");
                var currentTimeEndMin = event.end.format("MM");
                var workTime = $("#workingTime").hasClass("selected");
                var fullTime = $("#fullTime").hasClass("selected");
                var addDecimal = 0;
                
                if(workTime == true){
                	if ( "08" > currentTimeStart || currentTimeEnd > 18  || event.end.format("HH:MM") == "18:30") {revertFunc();}
                	event.title = event.end.format("HH:MM");
                }
				if(fullTime == true){
					
					var valMinEnd = parseInt(currentTimeEndMin);
					var valMinStart = parseInt(currentTimeStartMin);
					var valHourStart = Number(currentTimeStart);
					var valHourEnd = Number(currentTimeEnd); 
					var decimal = valMinStart + valMinEnd;
					if (decimal == 30){	decimal = 0.5;	}else{ decimal = 0;	}
					var howLongIsBar = valHourEnd - valHourStart + decimal;
                	event.title = event.end.format("HH:MM");  
					if(valHourEnd == 00 && valMinEnd == 00 ){
						
					}else if(valMinEnd == 30 && valHourEnd == 00 ){
						revertFunc();							
					}else if (howLongIsBar < 0){
						revertFunc();
					}else if( valHourStart+howLongIsBar != valHourEnd + decimal ){
						revertFunc();
					}
				}
				*/
				
				/* control the limits end*/
				
            },
            
      eventClick: function( event, jsEvent, view ) {
				var idName = 'delbut'+event._id;
				if($('#'+idName).length == 0){ 
					/*$("#events-layer .closeTray").hide();*/
					        var butNameID ='delbut'+event._id;
	                var layer =	'<div id="events-layer" class="fc-transparent"><a class="closeTray" title="delete" id="'+butNameID+'"></a></div>';
	                $(this).append(layer);
	                $(this).find(".ui-resizable-handle").show();
	                
	                $("#delbut"+event._id).click(function() {
	                    if(event._id) 
	                    {
	                        var dday = event.start.getDay() > 0 ? event.start.getDay() - 1 : 6;
	                        $('#calendarVis').fullCalendar('removeEvents', event._id);
	                        delEvent.push({id:event.id,day:dday});
	                    }
	                });
	                
	                $(this).css('border-color', 'red');
					
					if(profileId == "-100"){
						$("#events-layer .closeTray").hide();
					}
				}
				
				if(profileId == "-100"){
					if($(".notInWorkingHours").length == 0){
						var btns = {};
            utils.closeDialog();
            utils && utils.dialog({
                content : "<div class='notInWorkingHours'><img src='images/icon_notification.png' style='float:left;' alt='...' /> <div style='width:215px;float:left; margin-left:10px; '><p style='margin-top:5px;'>"+$.i18n.prop('cant.edit.privacyProfile1')+" </p><p style='margin-top:5px;font-weight:normal;'>"+$.i18n.prop('cant.edit.privacyProfile2')+"</p></div> </div>",
                css: 'noCloseNoOk'
            });
            $(".notInWorkingHours").css("width",260);   
            $(".noCloseNoOk").hide().fadeIn("slow");
            timeMsg();
          }
				}
       },
            eventAfterRender : function(event, element , view) 
            {
				$(".ui-resizable-handle").hide(); 
				$(".fc-event-time").hide();
				$(".fc-event-title").hide();
            	var width_of_cell = $(".fc-widget-content").outerWidth(); 
                $(element).css('width',width_of_cell-5);

                if ($.inArray(event, src) >= 0 ) {
					
                } else {
					src.push(event);
                }
            },
            eventMouseover : function( event, jsEvent, view ) {
            	if(pIR != "-100"){
            		$(".ui-resizable-handle").hide();
            		$(".fc-event-time").hide();
            		$(".fc-event-title").hide();
            		$(this).find(".ui-resizable-handle").show();
            		$(this).find(".fc-event-time").show();
            		$(this).find(".fc-event-title").show();
            	}
            }
            
        	
        });
        
        function isOverlapping(event){
            var array = calendar.fullCalendar('clientEvents');
            for(var i in array){
              var obj_evt=array[i];
                if(obj_evt.id != event.id){
                    if(!(obj_evt.start >= event.end || obj_evt.end <= event.start)){
                        return true;
                    }
                }
            }
            /* Check if is out of hours*/
            if (fullHours === false)
            {
                if (parseInt(event.start.format("H")) < 8 || parseInt(event.end.format("H")) > 18)
                    return true;
            }
            return false;
        }

        
        calendar.fullCalendar('removeEvents').fullCalendar('removeEventSources');
        calendar.fullCalendar('addEventSource',eventsX);
}

function configureMyVisibilityProfile() {
  
  
        privacyAddScroll();
        var tab_counter = 1;
        var $tabs = $( "#visibilityProfiles-container" ).tabs({
            select: function(event, ui) 
            {
                var profId = ui.tab.id;
                var profileId = profId.split('_');
                allEvents = loadVisibilityProfilesDetails(profileId[1]);
                ShowCalendar(allEvents, false, false, profileId[1]);
                $("#workingTime").unbind('click').click(function(){
                  ShowCalendar(allEvents, false, true, profileId[1]);
                  $("#workingTime").addClass("selected");
                  $("#fullTime").removeClass("selected");
                  setWidthAvalibility();
                  return false;
                });
            
                $("#fullTime").unbind('click').click(function(){
                    ShowCalendar(allEvents, true, true, profileId[1]);
                    $("#fullTime").addClass("selected");
                    $("#workingTime").removeClass("selected");
                    setWidthAvalibility();
                    return false;
                });
            },
            selected: $("#tabVis_-100").parent().index()
        });

    var name = $("#tabVis_-100 span").text();
    var changeName = name.split('('); 
    $("#tabVis_-100 span").html('<p class="big">'+changeName[0]+'</p><p class="little">('+changeName[1]+'</p>');
    /*working hours first*/
    var workingHourTab = $("#tabVis_-100").parent().index();
/*    $("#visibilityProfiles-container ul li:eq("+ workingHourTab +")").insertBefore($("#visibilityProfiles-container ul li:eq(0)")); */
    if(workingHourTab != 0) {
      $("#visibilityProfiles-container ul li:eq("+ workingHourTab +")").insertBefore($("#visibilityProfiles-container ul li:eq(0)"));
    }
    $(".tab-profiles:first").addClass("ui-first");
    $(".tab-profiles.ui-state-disabled").css({"opacity":1, "padding":"0 15px 0 0"});
    $("#visibilityProfiles-container ul li:eq(0)").click();
    
        function addTab(profileName) {
            var myDate = new Date();
            var days = new Array();
            days[0] = "";
            days[1] = "";
            days[2] = "";
            days[3] = "";
            days[4] = "";
            days[5] = "";
            days[6] = "add00:00-00:01";
            
            $.ajax({
                url :'addMyVisibilitySettings.action',
                type :'POST',
                async :false,
                data :{
                    profileName : profileName,
                    /*timeZone : myDate.getTimezoneOffset(),*/
                    dayTimeSettings : days
                },
                dataType :'json',
                success :function(json)
                {
                    if (checkResponseSuccess(json))
                    {
                       //delte default created
                      /* var np= loadVisibilityProfilesDetails(json.visibilityProfile.id);*/
                      utils.closeDialog();
                      loadVisibilityProfiles();
                    }   
                    /*
                    $tabs.tabs( "add", "#tabs-123", profileName );
                    tab_counter++;*/
                }
            });
            
        }
        
        $("#calClear")
            .click(function()
            {
                ShowCalendar(allEvents, false, false, 0);
                return false;
            }
        );
        
        $("#calSave")
            .click(function()
            {
                var days = new Array();
                days[0] = "";
                days[1] = "";
                days[2] = "";
                days[3] = "";
                days[4] = "";
                days[5] = "";
                days[6] = "";
                $.each(addEvent, function(key, value) 
                { 
                    var str = "add" + pad(value.start.getHours(), 2) + ":" + pad(value.start.getMinutes(), 2) + "-" + pad(value.end.getHours(), 2) + ":" + pad(value.end.getMinutes(), 2);
                    days[value.day] += (days[value.day] != '') ? "|" + str : str;
                }); 
                
                $.each(delEvent, function(key, value) 
                {
                    if (value.id != undefined)
                    {
                        var str = "delete" + value.id;
                        days[value.day] += days[value.day] != '' ? "|" + str : str;
                    }
                });
                

                
                var myDate = new Date();
                var profId = $(".tab-profiles.ui-tabs-selected > a").attr('id');
                var profileName = $(".tab-profiles.ui-tabs-selected > a > span").html();
                var profileId = profId.split('_');
                $.ajax({
                    url :'editMyVisibilitySettings.action',
                    type :'POST',
                    async :false,
                    data :{
                        profileName : profileName,
                        profileId: profileId[1],
                        /*timeZone : myDate.getTimezoneOffset(),*/
                        dayTimeSettings : days
                    },
                    dataType :'json',
                    success :function(json)
                    {
                        if (checkResponseSuccess(json)) 
                        {
                            allEvents = loadVisibilityProfilesDetails(profileId[1]);
                            if (fullHours)
                                $('#fullTime').trigger('click');
                            else
                                $('#workingTime').trigger('click');
                            
                            ShowCalendar(allEvents, fullHours, false, profileId[1]);
                            addEvent = [];
                            delEvent = [];
                            var btns = {};
                            utils.closeDialog();
                            utils && utils.dialog({
                                content : "<div class='successMessageCheck'>Saved</div>",
                                css: 'noCloseNoOk'
                            });
                            $(".noCloseNoOk").hide().fadeIn("slow");
                            timeMsg();
                        }
                    }
                });
            return false;
            });

        $( "#tabVis_0" )
            .click(function() 
            {
                var btns = {};

            $(".ui-dialog").dialog('destroy');
            utils.closeDialog();
            $(".errorsDisplay").hide();
              utils && utils.dialog({
                  title : $.i18n.prop('myVisibility.addPermission'),
                  content: $('#AddVisibility').html(),
                  buttons : btns,
                  css: 'noClose'
              });
                
                /* POSITION DIALOG */
                var dialogWidth = $('.ui-dialog').outerWidth();
                $('.ui-dialog').css({
                    'top': '250px',
                    'margin-left': -dialogWidth/2,
                    'width':'500px',
                    'left':'50%'
                });
                 $('.ui-dialog').find('button.send')
                        .mousedown(function(e){
                        	e.preventDefault();
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

                    $('button.send').bind('click', function()
          {
                        var formParent = $(this).parent().parent();
                        var tab_title = formParent.children( "#tab_title" );
                        var newName = tab_title.val();
                        var stopSaving = true;  
                        var na = $(".linkProfiles span").each(function(i,v){
                          var check = $(".linkProfiles span").eq(i).text();
                          if ( check == newName ){
                            stopSaving = false;
                          }
                        });

                        if(newName == ""){
                          $(".errorsDisplay").show();
                          $(".errorsDisplay .message h1").empty().html( $.i18n.prop("avability.error.emptyField") );
                        }else if (stopSaving == false){
                          $(".errorsDisplay").show();
                          $(".errorsDisplay .message h1").empty().html( $.i18n.prop("avability.error.inUse") );
                        }else if(newName.length > 21){
                          $(".errorsDisplay").show();
                          $(".errorsDisplay .message h1").empty().html( $.i18n.prop("avability.error.overCharacter") );
                        }else{
                          $(".errorsDisplay").hide();
                          addTab(newName);
                        }
                    });

                    return false;
                });
        
            
        
        $( "#visibilityProfiles-container span.closeBT" ).live( "click", function(){
          if( $('.deleteTabMessage').length == 0 ){
              var index = $( "li", $tabs ).index( $( this ).parent() );
              var id_tmp = $(this).attr('id').replace("btDel_", "");
              /*deleteProfile(id_tmp, $tabs, index);*/
              
/*
                $.ajax({
              url :'listUsersAssignedToVisibilityProfile.action',
              type :'POST',
              async :false,
              data :{
                  visibilityProfileId  :id_tmp
              },
              dataType :'json',
              success :function(json) {
                  if (checkResponseSuccess(json)) {
                      if(json.profileUsers.length===0){
                        $('.blockFirst , .blockSecond').hide();
                      }else{
                        $('.blockFirst , .blockSecond').show();
                      }
                  }
              }
          });
*/

              
              var btns = {};
              utils && utils.dialog({
                  title : '',
                  content: $('#confirmDeleteProfile_' + id_tmp).html(),
                  buttons : btns,
                  css: 'noClose deleteTabMessage'
              });
        $('.visProDropDown').selectmenu('destroy');
            $('.visProDropDown').selectmenu({
          change: function() {
            $('.visProDropDown').change();
          }
        });
        
              var dialogWidth = $('.deleteTabMessage').outerWidth();
              $('.ui-dialog').css({
                  'top': '270px',
                  'margin-left': -dialogWidth/2,
                  'width':'500px',
                  'left':'50%'
              });
        
              $('.ui-dialog').find('button.send')
                  .mousedown(function(e){
	                  e.preventDefault();
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
  
                  $('button.send').bind('click', function()
                  {
                      /* if ($("#dialog #chkDelProfile:checked").val() == 'AssignDifferentProfile') */
                      if ( $('.blockFirst').is(':visible') && $("#dialog #chkDelProfile:checked").val() == 'AssignDifferentProfile')
                          removeProfile(id_tmp, $("#dialog #visPro option:selected").val());
                      else
                          removeProfile(id_tmp, null);
            
                      utils.closeDialog();
                      $tabs.tabs( "remove", index );
                      $tabs.tabs('select', '0');
                  });
            }  
        });
       
       
       $(".clearfixP").each(function(index)
       {    
           $(this).live( "click", function()
            {
                var profiles = $(this).attr('profiles');
                $(this).hide();
                $(".Pro" + profiles).show();
                return false;
            });
       });
       
       $(".clearfixM").each(function(index)
       {    
           $(this).live( "click", function()
            {
                var profiles = $(this).attr('profiles');
                $(".Pro" + profiles).hide();
                $("#plusBox[profiles='" + profiles + "']").css('display', 'block');
                return false;
            });
       });
        /*
        $("#minusBox").click(function(){
            $("#profiles").hide();
            $("#plusBox").show();
            return false;
        });
        */
       
       $(".makeHover").hover(function(){
            $(this).children("td").addClass("makeHoverThis");
            $(this).find(".edit").css("display","block");
            $(this).find(".delete").css("display","block");
        }, function() {
            $(this).children("td").removeClass("makeHoverThis");
            $(this).find(".edit").css("display","none");
            $(this).find(".delete").css("display","none");
        });
        
        var profId = $(".tab-profiles.ui-tabs-selected > a").attr('id');
        var profileId = profId.split('_');

        
    $("#workingTime").click(function(){
      ShowCalendar(allEvents, false, true, profileId[1]);
      $("#workingTime").addClass("selected");
      $("#fullTime").removeClass("selected");
      setWidthAvalibility();
      return false;
    });
        
    $("#fullTime").click(function(){
      ShowCalendar(allEvents, true, true, profileId[1]);
      $("#fullTime").addClass("selected");
      $("#workingTime").removeClass("selected");
      setWidthAvalibility();
      return false;
    });
        
        
        allEvents = loadVisibilityProfilesDetails(profileId[1]);
        ShowCalendar(allEvents, false, false, profileId[1]);
        
        function pad(number, length) {
            var str = '' + number;
            while (str.length < length) {
                str = '0' + str;
            }
            return str;
        }
    var trAdress = $("#profiles-viewer .ui-tabs-panel");
        trAdress.each(function(){
          var number = $(this).find('.innerBorder #listUsers tr').length;
          if (number == 0)
            $(this).find('#whoListUsers .text').html($.i18n.prop('myVisibility.seeLocation.NoUser'));
          else if(number == 1)
            $(this).find('#whoListUsers .text').html(number +" "+ $.i18n.prop('myVisibility.seeLocation.oneUser'));
          else{
            $(this).find('#whoListUsers .text .number').html(number);
          }
        });
  
}


