<%@page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<script language="JavaScript" type=text/javascript>
/*
userLocale = '<s:property value="#session.WW_TRANS_I18N_LOCALE.language"/>';
*/
/* var localeToBeUsed = userLocale == 'en' ? '' : (userLocale == null ? '' : userLocale);  */ 

/* var dates = [new Date(2012, 6-1, 30), new Date(2012, 6-1, 18)]; */



$().ready(function(){


  
/*   mcm = new MiniCalendarManager( $('#calendarDatepicker') ); */
	   
	  /*
function highlightDays(date) {

        for (var i = 0; i < dates.length; i++) {
          if (dates[i].getTime() == date.getTime()) {
            return [true, 'highlight'];
          }
        }
         return [true, ''];
        
    }; 

		$('#calendarDatepicker').datepicker(
			$.extend( {}, $.datepicker.regional['' + localeToBeUsed + ''], {
				showMonthAfterYear :false,
				dateFormat: 'dd/mm/yy',
				firstDay: 1,
				beforeShowDay: mcm.highlightDays,
				onSelect: function(dateText, inst) {				
				  var date = $(this).datepicker('getDate');
				  $('#calendar .right #calendar-wrapper').fullCalendar( 'gotoDate', date.getFullYear(), date.getMonth(), date.getDate() );							
				}	
			}));
*/ 
		});
</script>

<div class=modHeader></div>
<div class="modBorder">
	<div class="modCopy">
		<div id="calendarDatepicker"></div>
	</div>
</div>
<div class=modFooter></div>