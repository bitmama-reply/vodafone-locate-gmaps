var messageBoxTypeName;
var searchActive;
window.selected_index = 0;


/*
Date.prototype.customFormat = function(formatString){
    var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
    var dateObject = this;
    YY = ((YYYY=dateObject.getFullYear())+"").slice(-2);
    MM = (M=dateObject.getMonth()+1)<10?('0'+M):M;
    MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
    DD = (D=dateObject.getDate())<10?('0'+D):D;
    DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dateObject.getDay()]).substring(0,3);
    th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
    formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);

    h=(hhh=dateObject.getHours());
    if (h==0) h=24;
    if (h>12) h-=12;
    hh = h<10?('0'+h):h;
    AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
    mm=(m=dateObject.getMinutes())<10?('0'+m):m;
    ss=(s=dateObject.getSeconds())<10?('0'+s):s;
    return formatString.replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
};
*/

function inboxSearch() {
  
  if ($('#searchMessageInput').val().length == 0) {
    loadInbox(messageBoxTypeName, 0);
  } else {
        
    /* SET CORRECT SEARCH ACTION */
    var active_tab = $('.ui-tabs-nav').find('.ui-state-active a').attr('href');
    
    switch(active_tab) {

      case "#tab-inbox-messages":
        loadInbox(messageBoxTypeName, 1);
      break;
      
      case "#tab-inbox-requests":
        loadMessageBoxRequestList($('#searchMessageInput').val())
      break;
      
      case "#tab-sent-requests":
        loadMessageBoxSentList($('#searchMessageInput').val())
      break;
      
      default:
        loadInbox(messageBoxTypeName, 1);
    }
    /* switch to loading icon - OLD */
    //$('#searchMessageArea a').removeClass('magnifier').addClass('loading');
  }
}

function populateViewInBoxPanel() {
	var str;
	var d = new Date();
	// The getTimezoneOffset() method returns the time difference between Greenwich Mean Time (GMT) and local time, in minutes.
	// var gmtHours = -d.getTimezoneOffset() / 60;
	var clientTimeZoneOffSetInMiliSecond = -d.getTimezoneOffset() * 60000;

	$.ajax({
		url :'getInboxUnreadForPanel.action',
		type :'POST',
		async :false,
		dataType :'json',
		data :{
			clientTimeZoneOffSetInMiliSecond :clientTimeZoneOffSetInMiliSecond
		},
		success :function(json) {
			if (checkResponseSuccess(json)) {
				str = parseTemplate("inboxPanelTemplate", {
					json :json
				});
				return str;
			}
		}
	});
	return str;
}

function loadInbox(folderType, search, page, pgIndx, mexType, select_tab) {
	if (search == null) {
		search = 0;
	}

	if (search == 1) {
		searchActive = search;
		searchInbox(folderType, page, pgIndx);
		return;
	}
	searchActive = search;

	if (page == null || page < 1) {
		page = 1;
	}

	if (pgIndx == null || pgIndx < 1) {
		pgIndx = 1;
	}

	messageBoxTypeName = folderType;
	$('#mapNavs').hide();
	var d = new Date();
	// The getTimezoneOffset() method returns the time difference between Greenwich Mean Time (GMT) and local time, in minutes.
	// var gmtHours = -d.getTimezoneOffset() / 60;
	var clientTimeZoneOffSetInMiliSecond = -d.getTimezoneOffset() * 60000;
	
	if (mexType == null) {
    var data = {
      messageBoxTypeName :messageBoxTypeName,
			clientTimeZoneOffSetInMiliSecond :clientTimeZoneOffSetInMiliSecond,
			page :page
		};
	}else {
	   var data = {
	     messageBoxTypeName :messageBoxTypeName,
			 clientTimeZoneOffSetInMiliSecond :clientTimeZoneOffSetInMiliSecond,
			 page :page,
			 messageType : mexType
	   };
	}
	
	$.ajax({
		url :'loadMessageBox.action',
		type :'POST',
		data : data,
		dataType :'json',
		cache: false,
		success :function(json) {
			if (checkResponseSuccess(json)) {
				json.messageBoxTypeName = folderType;
				composeInboxPage(json, pgIndx, select_tab);
				/* fix for messages menu bar */	
				$(".menubar li").removeClass("currentIteam");
				$(".menubar li.messages").addClass("currentIteam");
		  		var str= document.URL;
				var n=str.split('#');
				location.replace(n[0]+'#message');
				/* fix for messages menu bar end*/
				stopLoader();
			}
		}
	});
	
}

function loadMessageBoxList(mailbox_ref) {/*load message box list*/

	$.ajax({
		url :'getMessageBoxList.action',
		type :'POST',
		dataType :'json',
		success :function(json) {
			if (checkResponseSuccess(json)) {
			 if (mailbox_ref != null) {
			   json.messageBoxTypeName = mailbox_ref;
				}
				$('#inbox').html(parseTemplate("inboxTemplate", {
					json :json
				}));
			}
			
		}
	});
	
}

/* FILL MEX NUMBERS IN LEFT MENU */
mailboxMenu = {
  sentAjaxComplete: false,
  sentReqAjaxComplete: false,
  outJson:0,
  outReqJson:0,
  sentTotal: function() {
    if (mailboxMenu.sentAjaxComplete && mailboxMenu.sentReqAjaxComplete){
      var tot = mailboxMenu.outJson + mailboxMenu.outReqJson;
      $('.messageBoxes .SENT_menu a span').html($.i18n.prop('inbox.sent') + " ("+tot+")");      
    }
  },
  getSentNumber: function() {
    $.ajax({
      url :'loadMessageBox.action',
      type :'POST',
      dataType :'json',
      data: {
        messageBoxTypeName:'SENT'
      }, 
      success :function(outJson) {
        if (checkResponseSuccess(outJson)) {
          mailboxMenu.sentAjaxComplete = true;
          mailboxMenu.outJson = outJson.totalRecords; 
          mailboxMenu.sentTotal();
          stopLoader();
        }
      }
    });
  },
  getSentReqNumber: function() {
    $.ajax({
      url :'getOutgoingRequestCount.action',
      type :'POST',
      dataType :'json',
      success :function(outReqJson) {
        if (checkResponseSuccess(outReqJson)) {
          mailboxMenu.sentReqAjaxComplete = true;
          mailboxMenu.outReqJson = outReqJson.outgoingRequestCount;                       
          mailboxMenu.sentTotal();          
          
          if( $("#inbox .active").length == 0 ){$("#inbox .inbox").addClass("active");}//fix to selected tab
        }
      }
    });
  }  
}

function getMexReqNumbers(unread) {
	$.ajax({
		url :'getIncomingRequestCount.action',
		type :'POST',
		dataType :'json',
		success :function(json) {
			if (checkResponseSuccess(json)) {
        $('.req-cnt').html(json.incomingRequestCount);
        updateUnreadCount(unread, json.incomingRequestCount);
			}
		}
	});
	
}

function searchInbox(folderType, page, pgIndx) {

	searchActive = 1;

	if (page == null || page < 1) {
		page = 1;
	}

	if (pgIndx == null || pgIndx < 1) {
		pgIndx = 1;
	}

	messageBoxTypeName = folderType;
	$('#mapNavs').hide();
	var d = new Date();
	// The getTimezoneOffset() method returns the time difference between Greenwich Mean Time (GMT) and local time, in minutes.
	// var gmtHours = -d.getTimezoneOffset() / 60;
	var searchText = $('#searchMessageInput').val();
	var clientTimeZoneOffSetInMiliSecond = -d.getTimezoneOffset() * 60000;
	$.ajax({
    url: 'searchMessageBox.action',
		type :'POST',
		data :{
			searchText :searchText,
			messageBoxTypeName :messageBoxTypeName,
			clientTimeZoneOffSetInMiliSecond :clientTimeZoneOffSetInMiliSecond,
			page :page
		},
		dataType :'json',
		success :function(jsonSearch) {
			if (checkResponseSuccess(jsonSearch)) {
			 jsonSearch.messageBoxTypeName = messageBoxTypeName;
			 composeInboxPage(jsonSearch, pgIndx);
			 $('#searchMessageInput').val(searchText);
			}
		}
	});
}

function handleSearchBlur () {
    
  var active_tab_text = $('.ui-tabs-nav li:eq('+$( "#messages-container" ).tabs("option", "selected")+') span').text().toLowerCase();
  if (active_tab_text.indexOf('(')!=-1) {
    active_tab_text = $.trim(active_tab_text.substring(0, active_tab_text.indexOf('(')));
  }else {
    active_tab_text = $.trim(active_tab_text.substring(0, active_tab_text.length));
  }
  setSearchboxText(active_tab_text);
  //$('#searchMessageArea a').removeClass('search-reset').addClass('magnifier');

}

function composeInboxPage(json, pgIndx, select_tab) {
  /* reg ex for search fields */
  var reMex = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchMessages'), 'g');
  var reInReq = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchInReq'), 'g');
  var reOutMex = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchOutMessages'), 'g');
  var reOutReq = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchOutReq'), 'g');
  var reTrash = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchTrash'), 'g');


    
	if (pgIndx == null) {
		pgIndx = 1;
	}
	
    
  /* Set left menu active section */
	$("#inbox ul a").removeClass("active");
	$("#inbox li."+messageBoxTypeName+"_menu a").addClass("active");
	 if( $(".ui-dialog").length == 1 ){utils.closeDialog();}
	 
  $('#ajax-message').html(parseTemplate("inboxBodyTemplate", {
		json :json,
		pgIndx :pgIndx
	}));
	
	

	/* SHOW ACTIVE TAB CONTENTS, HIDE OTHERS */	
  $('#message-viewer div[id^=tab-]').hide();
  $('#message-viewer div[id^=tab-'+messageBoxTypeName.toLowerCase() +']').show();
	
	
  $('#searchMessageArea').off('click', 'a');
  $('#searchMessageArea').on('click', 'a', function(e) {
      
      if ($(this).hasClass('search-reset')) {
      
      /* SET CORRECT SEARCH ACTION */
        var active_tab = $('.ui-tabs-nav').find('.ui-state-active a').prop('href');
            
        switch(active_tab) {

          case "#tab-inbox-messages":
            loadInbox(messageBoxTypeName, 0);
          break;
          
          case "#tab-inbox-requests":
            loadMessageBoxRequestList("");
          break;
          
          case "#tab-sent-requests":
            loadMessageBoxSentList("");
          break;
          
          default:
            loadInbox(messageBoxTypeName, 0);
        } 
      }
    });
	
	
	/* on text input blur, set correct default text */
/*
  $('#searchMessageInput').blur(function(e){
    
    window.setTimeout('handleSearchBlur()', 200);

	});
*/

	
	$('#searchMessageInput').focus(function(){
  
    s_val = $.trim( $('#searchMessageInput').val() );
    
    if ( s_val.match(reMex) || s_val.match(reInReq) || s_val.match(reOutMex) || s_val.match(reOutReq) || s_val.match(reTrash) ) {
      $('#searchMessageInput').val("");
    }
	});
	

  	
	// fix last column header width according to scrollbar width =================================================================== REMOVED CAUSE NO SCROLLBARS ARE APPLIED
  //var last_column = $('#messageListContent .fixedArea tbody td').last();
  //var lcw = parseInt(last_column.css('width'));
	//last_column.css('width', lcw + scrollbarWidth());
  //$('#requestedListContent .fixedArea .four').css('width', lcw + scrollbarWidth());

	
	styleMessages();

  var active_tab_text = "";

	$( "#messages-container" ).tabs({
		show: function(event, ui) {
		    active_tab_text = $('.ui-tabs-nav li:eq('+$( "#messages-container" ).tabs("option", "selected")+') span').text().toLowerCase();
		    if (active_tab_text.indexOf('(')!=-1) {
			    active_tab_text = $.trim(active_tab_text.substring(0, active_tab_text.indexOf('(')));
		    } else {
			    active_tab_text = $.trim(active_tab_text.substring(0, active_tab_text.length));
		    }
		    if (!$("#searchMessageInput").is(":focus")) {
			    $('#searchMessageInput').val($.i18n.prop('inbox.search') + " "+active_tab_text); 
		    }
		    /* deselct all message */
		    unSelectMessages();
		    $('.inboxActionLink').toggleClass('multi_user_button_inactive', !($('input:checked').length>0));
		    /* end deselct all message */
		    
		    $('#tab-inbox-messages .headBar').show();
    	}
    });
  
  /* SET ACTIVE TAB WHEN ACTIVE IS NOT FIRST DEFAULT TAB */
	if (select_tab != null) {
  	$( "#messages-container" ).tabs( "select" , select_tab.substring(1, select_tab.length) );
	}
	
	/* SET CORRECT ACTION OF SEARCH BOX */
  var active_tab = $('.ui-tabs-nav').find('.ui-state-active a').attr('href');
  var tabs = $('.ui-tabs-nav>li>a');
  
  
  var search_text = $.i18n.prop('inbox.search') + " ";


  switch(active_tab_text) {

    case $.i18n.prop('inbox.searchMessages'):
      search_text += $.i18n.prop('inbox.searchMessages');
    break;

    case $.i18n.prop('inbox.searchInReq'):
      search_text += $.i18n.prop('inbox.searchInReq');
    break;

    case $.i18n.prop('inbox.searchOutMessages'):
      search_text += $.i18n.prop('inbox.searchOutMessages');
    break;

    case $.i18n.prop('inbox.searchOutReq'):
      search_text += $.i18n.prop('inbox.searchOutReq');
    break;

    case $.i18n.prop('inbox.searchTrash'):
      search_text += $.i18n.prop('inbox.searchTrash');
    break;

    default:
      search_text += $.i18n.prop('inbox.searchMessages');
  }
  
  /* Set correct search field text */
  if (!$("#searchMessageInput").is(":focus")) {
    $('#searchMessageInput').val(search_text);
  }

	s_val = $.trim( $('#searchMessageInput').val() );
	
	
	if (!( s_val.match(reMex) || s_val.match(reInReq) || s_val.match(reOutMex) || s_val.match(reOutReq) || s_val.match(reTrash) )) {
      $('#searchMessageArea a').removeClass('loading').removeClass('magnifier').addClass('search-reset');
  } else {
    $('#searchMessageArea a').removeClass('loading').removeClass('search-reset').addClass('magnifier');
  }
  
  
  
  	/* Get second tab numbers */
  if (messageBoxTypeName.toLowerCase() == "inbox") {
    getMexReqNumbers(json.unreadMessageCount);
    loadMessageBoxRequestList();
    
    /* set btn listeners */
    $(active_tab+' .mark-read').click(function(e){
      e.preventDefault();
      if (!$(this).hasClass('multi_user_button_inactive')) {
        markMessage(true);
        return false;
      }
    });
    $(active_tab+' .mark-unread').click(function(e){
      e.preventDefault(); 
      if (!$(this).hasClass('multi_user_button_inactive')) {
        markMessage(false);
        return false;
      }
    });
    $(active_tab+' .mark-delete').click(function(e){
      e.preventDefault();      
      if (!$(this).hasClass('multi_user_button_inactive')) {
        deleteMessage(1);
        return false;
      }
    });
  }
  
  if (messageBoxTypeName.toLowerCase() == "sent") {
    
    
    /* Set mex count */
    $('a[href=#tab-sent-messages] .sent-cnt').html(' ('+json.totalRecords+')');
    loadMessageBoxSentList();
    
    /* set btn listeners */
    $('#tab-sent-messages .mark-delete').click(function(e){
      e.preventDefault();
      if (!$(this).hasClass('multi_user_button_inactive')) {
        deleteMessage(1);
        return false;
      }
    });
    $('#tab-sent-requests .mark-delete').click(function(e){
      e.preventDefault();
      if (!$(this).hasClass('multi_user_button_inactive')) {
        deleteMessage(1);
        return false;
      }
    });

  }
  
  if (messageBoxTypeName.toLowerCase() == "trash") {
    
    /* set btn listeners */
    $(active_tab+' .mark-delete').click(function(e){
      e.preventDefault();
      if (!$(this).hasClass('multi_user_button_inactive')) {
        deleteMessage(0);
        return false;
      }
    });
    
    $(active_tab+' .mark-move').click(function(e){
      e.preventDefault();
      if (!$(this).hasClass('multi_user_button_inactive')) {
        undeleteMessage();
        return false;
      }
    });
  }

  	
	/* custom select */
	$("#message-type").selectmenu({
    change: function() {
      window.selected_index = $("#message-type")[0].selectedIndex;
      /* 1=MEETING_MESSAGE - 7= SHARE_ROUTE_MESSAGE - none=all mex */
      if (window.selected_index == 1)
        loadInbox(messageBoxTypeName, 0, 1, 1, 1);
      else if (window.selected_index == 2)
        loadInbox(messageBoxTypeName, 0, 1, 1, 7);
      else
        loadInbox(messageBoxTypeName, 0, 1, 1);
    }
  });
  
  $("#message-type").selectmenu("value",$("#message-type").children(":eq("+window.selected_index+")").val());
  
  /* set pagination */
  setInboxPagination(json, active_tab);
  
  /* Set left menu numbers */
  mailboxMenu.getSentNumber();
  mailboxMenu.getSentReqNumber();
  
  
  /* activate buttons if chkbox  */
/*   $('#messageListContent input[type=checkbox]').click(function() { */
    ///*var chk = $(this);*/
/*    $('.inboxActionLink').toggleClass('multi_user_button_inactive', !($('input:checked').length>0)); */
    /*if ($('input:checked').length>0) {
      $('.multi_user_button_inactive').removeClass('multi_user_button_inactive');
    }else {
      $('.inboxActionLink').addClass('multi_user_button_inactive');
    }*/
/*   }); */
/*
  $('#messageListContent input[type=checkbox]').click(function() {
   $('.inboxActionLink').toggleClass('multi_user_button_inactive', !($('input:checked').length>0));
  });
*/
  
  

  
  
}

function setInboxPagination(json, tab) {
    
  var tot_pages = json.totalPages;
  var active_page = json.page;
  var bulk_page_num = 10;
  var active_bulk = Math.ceil(active_page / bulk_page_num);
  var mid = Math.floor(bulk_page_num/2)-1;
  
  var start = Math.max(active_page-mid, 1);
  var end = Math.min(start+bulk_page_num-1, tot_pages);
  
  if (end == tot_pages) {
    start = Math.max(end-(bulk_page_num-1), 1); 
  }
  
    
	for (var i=start ;i <= end ;i++) {
    var html = "";
    var page_link = i;
    
    $("#inboxPaging label").css('opacity',0.3);
    
    if (page_link == active_page)
      html = '<li><a href="#" class="page-link active">'+page_link+'</a></li>'
    else
      html = '<li><a href="#" class="page-link">'+page_link+'</a></li>'
    
    $(tab+' #inboxPaging .page-link-list').append(html);
  }

  
  $(tab+' .page-link').on('click', function(event){
    event.preventDefault();
    
    var clicked_page = $(this).text()
    var search = 0;
    if( $('#searchMessageInput').val() !== $.i18n.prop('inbox.search') +" "+ $.i18n.prop('inbox.searchMessages')  ){
      search = 1;
    }else if( $('#searchMessageInput').val() !== $.i18n.prop('inbox.search') +" "+ $.i18n.prop('inbox.searchInReq')  ){
      search = 1;
    }else if( $('#searchMessageInput').val() !== $.i18n.prop('inbox.search') +" "+ $.i18n.prop('inbox.searchOutMessages')  ){
      search = 1;
    }else if( $('#searchMessageInput').val() !== $.i18n.prop('inbox.search') +" "+ $.i18n.prop('inbox.searchOutReq')  ){
      search = 1;
    }else if( $('#searchMessageInput').val() !== $.i18n.prop('inbox.search') +" "+ $.i18n.prop('inbox.searchTrash')  ){
      search = 1;
    }    

    switch(tab) {
      
      case "#tab-inbox-messages":
        loadInbox('INBOX', search, parseInt(clicked_page), null, null, tab);
      break;
      
      case "#tab-inbox-requests":
        //loadMessageBoxRequestList()
        loadInbox('INBOX', search, parseInt(clicked_page), null, null, tab);
      break;
      
      case "#tab-sent-messages":
        loadInbox('SENT', search, parseInt(clicked_page), null, null, tab);
        break;
        
      case "#tab-sent-requests":
        //loadInbox('SENT', 0, parseInt(clicked_page), null, null, tab);
        loadInboxReq(parseInt(clicked_page));
        //loadMessageBoxSentList()
      break;
      
      case "#tab-trash":
        loadInbox('TRASH', search, parseInt(clicked_page), null, null, tab);
      break;
      
      default:
        loadInbox(messageBoxTypeName, 0);
    }
  });
  
}

function setSearchboxText (active_tab_text) {
  console.log('active_tab_tex',active_tab_text);
  /* SET CORRECT ACTION OF SEARCH BOX */
  var active_tab = $('.ui-tabs-nav').find('.ui-state-active a').attr('href');
  var tabs = $('.ui-tabs-nav>li>a');
  
  $('.ui-tabs-nav li.searchPart').css({'opacity':1});
  
  var search_text = $.i18n.prop('inbox.search') + " ";

  switch(active_tab_text) {

    case $.i18n.prop('inbox.searchMessages'):
      search_text += $.i18n.prop('inbox.searchMessages');
    break;

    case $.i18n.prop('inbox.searchInReq'):
      search_text += $.i18n.prop('inbox.searchInReq');
    break;

    case $.i18n.prop('inbox.searchOutMessages'):
      search_text += $.i18n.prop('inbox.searchOutMessages');
    break;

    case $.i18n.prop('inbox.searchOutReq'):
      search_text += $.i18n.prop('inbox.searchOutReq');
    break;

    case $.i18n.prop('inbox.searchTrash'):

      search_text += $.i18n.prop('inbox.searchTrash');
    break;

    default:
      search_text += $.i18n.prop('inbox.searchMessages');
  }
  
  /* Set correct search field text */
  $('#searchMessageInput').val(search_text);
}

function updateUnreadCount(umc, irc) {
  
  
	var regex = /\(([0-9]+)\)/;
	var matches;
	
	// tab header
  matches = $('#btn_messages span').text().match(regex);
  var oldCountSagHeader = 0;
  if (null != matches) {
    oldCountSagHeader = matches[1];
  }
  
  // sol panel
  matches = $('.INBOX_menu .inbox span').text().match(regex);
  var oldCountSolPanel = 0;
  if (null != matches) {
    oldCountSolPanel = matches[1];
  }
	
	// inner tab
  matches = $('#tab-mex span').text().match(regex);
  var oldUnreadNum = 0;
  if (null != matches) {
    oldUnreadNum = matches[1];
  }
	
	//totMailCnt = parseInt(umc)+parseInt(irc);
	//mailCnt = parseInt(umc);
	
	if (umc == 0) { // no unread
    $('#tab-mex span').html($('#tab-mex span').html().replace("("+oldUnreadNum+")", ""));
    if (irc == 0) {// no unread or incominq requests
      $('.INBOX_menu .inbox').html($('.INBOX_menu .inbox').html().replace("("+oldCountSolPanel+")", ""));
      $('#btn_messages').html($('#btn_messages').html().replace("("+oldCountSagHeader+")", ""));
    }
	}
  else {

		$('.INBOX_menu .inbox').html($('.INBOX_menu .inbox').html().replace(oldCountSolPanel, umc+irc));
    $('#btn_messages').html($('#btn_messages').html().replace(oldCountSagHeader, umc+irc));
    $('#tab-mex span').html($('#tab-mex span').text().replace(oldUnreadNum, umc));
	}
}

function selectMailCheckbox() {
	if ($("#selectMailCheckbox").attr("checked") == false) {
		unSelectMessages();
		$("#selectMailCheckbox").attr("checked", false);
	} else {
		selectMessages();
		$("#selectMailCheckbox").attr("checked", true);
	}
}

function selectMessages() {
	$(".inboxTable input:checkbox").each(function() {
		this.checked = 'checked';
	});
}

function unSelectMessages() {
	$(".inboxTable input:checkbox").each(function() {
		this.checked = '';
	});
}


function decreaseUnreadMessageCount(diffCount) {

	// unread mesaj sayisini sol tarafta ve tab linkinde guncelliyoruz.

	var x = $('#inboxRightNav').html();
	var start = x.indexOf("(");
	var end = x.indexOf(")");

	var presentCount;
	if (start != -1 && end != -1) {
		presentCount = x.slice(start + 1, end);
		var newCount = parseInt(presentCount) - parseInt(diffCount);

		if (newCount > 0) {
			$('#inboxLblAnch').html($('#inboxLblAnch').html().replace(presentCount, newCount));
			// tab headeri
			$('#inboxRightNav').html($('#inboxRightNav').html().replace(presentCount, newCount));
		} else {
			$('#inboxLblAnch').html($.i18n.prop('welcome.Mail'));
			$('#inboxRightNav').html($.i18n.prop('welcome.Mail'));
		}
	}

}

function increaseUnreadMessageCount(diffCount) {
	// unread mesaj sayisini sol tarafta ve tab linkinde guncelliyoruz.

	var x = $('#inboxRightNav').html();
	var start = x.indexOf("(");
	var end = x.indexOf(")");

	var presentCount;
	if (start != -1 && end != -1) {
		presentCount = x.slice(start + 1, end);
		var newCount = parseInt(presentCount) + parseInt(diffCount);
		// sol panel
		$('#inboxLblAnch').html($('#inboxLblAnch').html().replace(presentCount, newCount));
		// tab headeri
		$('#inboxRightNav').html($('#inboxRightNav').html().replace(presentCount, newCount));
	} else {
		$('#inboxLblAnch').html($.i18n.prop('welcome.Mail') + ' (' + diffCount + ')');
		$('#inboxRightNav').html($.i18n.prop('welcome.Mail') + ' (' + diffCount + ')');
	}
}

function deleteMessageAjax (trashOrDelete, messageIdlist) {
  $.ajax({
    		type :'POST',
    		url :'deleteMessage.action',
    		data :{
    			messageIdlist :messageIdlist,
    			trashOrDelete :trashOrDelete,
    			messageBoxTypeName :messageBoxTypeName
    		},
    		dataType :'json',
    		success :function(json) {
          
    			if (checkResponseSuccess(json)) {
    			 
    			 if (trashOrDelete == 0) {
    			   // delete
    			   var mex = messageIdlist.length>1?messageIdlist.length + " " +$.i18n.prop('message.multiple.deleted'):$.i18n.prop('message.single.deleted')
    			 }else {
    			   // trash
    			   var mex = messageIdlist.length>1?messageIdlist.length + " " +$.i18n.prop('message.multiple.moved.trash'):$.i18n.prop('message.single.moved.trash')
    			 }
    			
    			 var active_tab = $('.ui-tabs-nav').find('.ui-state-active a').attr('href');
    			 loadInbox(messageBoxTypeName,0, null, null, null,  active_tab);
    
    				var btns = {};
    				btns[$.i18n.prop('dialog.ok')] = function() {
    					$(this).dialog('close');
    				};
    				
    				utils.closeDialog();
    				    		
    				utils && utils.dialog({
    					content : "<div class='successMessageCheck'>" + mex +"</div>",
    					css: 'noCloseNoOk'
    				});
    				$(".noCloseNoOk").hide();
    				$(".noCloseNoOk").show();
    				timeMsg(); // fadeout for success message		
    			}
    		}
    	});
}

function deleteMessage(trashOrDelete, op_id) {
  
	var messageIdlist = [];
	
	if (typeof op_id == 'undefined') {
	 /* delete from select */
	 var id = null;
	 $(".inboxTable input:checked").each(function(){
	   id = $(this).val();
	   messageIdlist.push(id);		
	 });
	} else {
	 var id = op_id;
	 messageIdlist.push(id);
	}
  
	if (messageIdlist.length>0) {
	  	
    if (trashOrDelete == 0) { // show popup if deleting
      var dialogTitle =  "<img src=\"images/icon_notification.png\">" + $.i18n.prop('message.title.delete');
    
    
      var btns = {};
        
      utils && utils.dialog({
        title : dialogTitle,
        content: $('#confirmDelete').html(),
        buttons : btns,
        css: 'noClose'
      });
      
      
      // POSITION DIALOG
      var dialogWidth = $('.ui-dialog').outerWidth();
      $('.ui-dialog').css({
        'top': '50px',
        'margin-left': -dialogWidth/2,
        'width':'360px',
        'left':'50%'
       });
       
       $('.ui-dialog').find('button.send')
       .mousedown(function(e){
         e.preventDefault();
    		  $(this).addClass('purple_button_active');
    		  deleteMessageAjax(trashOrDelete, messageIdlist);
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
      
    } else {		
      	deleteMessageAjax(trashOrDelete, messageIdlist);
  	}// else
	}else {
	 utils && utils.dialogError({title: $.i18n.prop('dialog.error'), content: $.i18n.prop('dialog.select.one')});
	}
  	
  
}

/* Marks chosen message(s) as read or unread */
function markMessage(readOrUnread) {
  var id = null;
	var messageIdlist = [];
	$(".inboxTable input:checked").each(function(){
		id = $(this).val();
		messageIdlist.push(id);		
	});
	
	
	$.ajax({
		type :'POST',
		url :'markMessage.action',
		data :{
			markAsRead :readOrUnread,		
			messageIdList :messageIdlist
		},
		dataType :'json',
		success :function(json) {

			if (checkResponseSuccess(json)) {
			 /* CONSIDER SELECTED FILTER OF INBOX */
			 if (window.selected_index == 1)
        loadInbox(messageBoxTypeName, 0, 1, 1, 1);
      else if (window.selected_index == 2)
          loadInbox(messageBoxTypeName, 0, 1, 1, 7);
        else
          loadInbox(messageBoxTypeName, 0, 1, 1);
				  //loadInbox('INBOX',0);
			}
		}
	});
}

function deleteMessages(trashOrDelete) {

	var messageIdlist = [];
	var anyMessageSelected = false;
	$(".inboxTable input:checked").each(function() {
		var idValue = $(this).val();

		if (!isNaN(parseInt(idValue)) && isFinite(idValue)) {

			messageIdlist.push(idValue);
			anyMessageSelected = true;
		}

	});

	if (anyMessageSelected) {
		$.ajax({
			type :'POST',
			url :'removeMessage.action',
			data :{
				messageIdlist :messageIdlist,
				trashOrDelete :trashOrDelete,
				messageBoxTypeName :messageBoxTypeName
			},
			dataType :'json',
			success :function(json) {
				if (checkResponseSuccess(json)) {
					composeInboxPage(json);
				}
			}
		});
	}

}

function deleteAllMessages(trashOrDelete) {

	$.ajax({
		type :'POST',
		url :'removeAllMessages.action',
		data :{
			trashOrDelete :trashOrDelete,
			messageBoxTypeName :messageBoxTypeName
		},
		dataType :'json',
		success :function(json) {
			if (checkResponseSuccess(json)) {
				composeInboxPage(json);
			}
		}
	});

}

function showMessageContent(messageId, read, tdComponent) {
  
  var active_tab_id = $(tdComponent).parents('div[id^=tab]').prop('id');
  

  
/*
	if (!read && $(tdComponent).hasClass('bold')) {
		//decreaseUnreadMessageCount(1);
		// TODO: tdComponent ve ayni leveldaki diger td lerin bold larinin kaldirilmasi gerekmez mi acaba?
	}
*/
	
	$(".inboxTbTRRowCellSelected").each(function() {
		$(this).removeClass("inboxTbTRRowCellSelected");
		$(this).addClass("inboxTbTRRowCell");
	});

	$(tdComponent).parent().removeClass("inboxTbTRRowCellHover");
	$(tdComponent).parent().removeClass("inboxTbTRRowCell");
	$(tdComponent).parent().addClass("inboxTbTRRowCellSelected");

	var first = true;
	$(tdComponent).parent().find('.first .read_unread').removeClass('bold');
	$(tdComponent).parent().children().each(function() {
		if (!first) {
			$(this).removeClass("inboxTbRowCell");
			$(this).removeClass("bold");
			$(this).addClass("inboxTbRowCellSelected");
		}
		first = false;
	});
	
	$.ajax({
		url :'getMessageDetail.action',
		type :'POST',
		data :{
			id :messageId,
			messageBoxTypeName :messageBoxTypeName
		},
		dataType :'json',
		success :function(json) {

			if (checkResponseSuccess(json)) {
			    refreshMessageViewTimeout(); /* Refresh Number */
			   
			  
			  
				$('#'+active_tab_id+' #messageUserFromToId').html(json.fromUserId + "-" + json.toUserId);

/* 				if (json.messageModelType == 0 || json.messageModelType == 6) { // standart */
          console.log(json, ">>>>>>>>>>>> showMessageContent");
          
      		if (active_tab_id.toLowerCase() == 'tab-trash') {
        		$('#'+active_tab_id+' #messageDetail').html(parseTemplate("inboxDeletedMessageTemplate", {
	  				  json :json
			  		}));
          }else if (json.messageModelType == 1) {// meeting
  					$('#'+active_tab_id+' #messageDetail').html(parseTemplate("inboxMeetingMessageTemplate", {
  						json :json
  					}));
      		}else if (json.messageModelType == 6) {// accepted view
        		$('#'+active_tab_id+' #messageDetail').html(parseTemplate("inboxStandardMessageAcceptRequest", {
  					  json :json
  					}));	
      		} else {
        		$('#'+active_tab_id+' #messageDetail').html(parseTemplate("inboxStandardMessageTemplate", {
  					  json :json
            }));
      		}
					// set correct time format
          var date = new Date(json.sendTime);
          var user_date = new Date();
          var diff = Math.floor((user_date - date) / 1000);
        
          var ago = "";
          if (diff <= 1) {ago = "(just now)";}
          else if (diff < 20) {ago = "("+diff + " "+$.i18n.prop('time.second.ago') +")";}
          else if (diff < 40) {ago = "("+$.i18n.prop('time.halfMinute.ago')+")";}
          else if (diff < 60) {ago = "("+$.i18n.prop('time.lessMinute.ago')+")";}
          else if (diff <= 90) {ago = "("+$.i18n.prop('time.oneMinute.ago')+")";}
          else if (diff <= 3540) {ago = "("+Math.round(diff / 60) + " "+$.i18n.prop('time.minutes.ago') +")";}
          else if (diff <= 5400) {ago = "("+$.i18n.prop('time.oneHour.ago')+")";}
          else if (diff <= 86400) {ago = "("+Math.round(diff / 3600) + " "+$.i18n.prop('time.hours.ago') +")";}
          else if (diff <= 129600) {ago = "("+$.i18n.prop('time.oneDay.ago')+")";}
          else if (diff < 604800) {ago = "("+Math.round(diff / 86400) + " "+$.i18n.prop('time.days.ago') +")";}
          else if (diff <= 777600) {ago = "("+$.i18n.prop('time.oneWeek.ago')+")";}
          else if (diff > 777600) {ago = "("+$.i18n.prop('time.overWeek.ago')+")";}
          console.log(date)
          $('.sentTime').append(date.getHoursFormatted()+":"+date.getMinutesFormatted()+" "+date.customFormat("#DD#/#MM#/#YYYY#" )+" "+ago);
				$('.headBar').hide();
				$('#'+active_tab_id+' #selectMulti').hide();
				$('#'+active_tab_id+' #messageListContent').hide();
				$('#'+active_tab_id+' #messageDetail').show();
			} else {
				$('#'+active_tab_id+' #messageDetail').html("");
			}

		}
	});
				/*} else if (json.messageModelType == 1) {// meeting

					$('#messageDetail').html(parseTemplate("inboxMeetingMessageTemplate", {
						json :json
					}));

				} else if (json.messageModelType == 2) {// location request

					$('#messageDetail').html(parseTemplate("inboxLocationRequestMessageTemplate", {
						json :json
					}));

				} else if (json.messageModelType == 3) {// request permission

					$('#messageDetail').html(parseTemplate("inboxRequestPermissionMessageTemplate", {
						json :json
					}));

				} else if (json.messageModelType == 4) {// request category permission

					$('#messageDetail').html(parseTemplate("inboxRequestCategoryPermissionMessageTemplate", {
						json :json
					}));

				} else if (json.messageModelType == 5) {// request location permission

					$('#messageDetail').html(parseTemplate("inboxRequestLocationPermissionMessageTemplate", {
						json :json
					}));

				}
*/
								
}

function hideMessageContent(element) {
  var active_tab_id = $(element).parents('div[id^=tab]').attr('id');
	$('#'+active_tab_id+' #messageDetail').html('').hide();
  $('#'+active_tab_id+' .headBar').show();
  $('#'+active_tab_id+' #selectMulti').show();
  $('#'+active_tab_id+' #messageListContent').show();
}

function updateUnreadMessageCount(period) {
	var t = setTimeout("updateUnreadMessageCount(" + period + ")", period);
	$.getJSON(
					'getUnreadMessages',
					function(data) {
						if (!data.error) {
							$('#inboxRightNav').text($.i18n.prop('inbox.mail', [ data.unreadCount ]));

							var xSolPanel = $('#inboxLblAnch').html();
							if (xSolPanel != null) {

								var startSolPanel = xSolPanel.indexOf("(");
								var endSolPanel = xSolPanel.indexOf(")");

								var oldCountSolPanel;
								if (startSolPanel != -1 && endSolPanel != -1) {
									oldCountSolPanel = xSolPanel.slice(startSolPanel + 1, endSolPanel);
								} else {
									oldCountSolPanel = -1;
								}

								if (oldCountSolPanel != -1 && oldCountSolPanel < data.unreadCount) {

									var diffCount = parseInt(data.unreadCount - oldCountSolPanel);

									var inboxHTML = $("#inboxTable tbody").html();

									$("#inboxTable tbody").html("");

									var messageHTML = "";
									for ( var i = 0; i < diffCount; i++) {

										var message = data.messageList[i];

										messageHTML += "<tr class=\"inboxTbTRRowCell\" onmouseout=\"if (!$(this).hasClass('inboxTbTRRowCellSelected')) this.className='inboxTbTRRowCell';\" onmouseover=\"if (!$(this).hasClass('inboxTbTRRowCellSelected')) this.className='inboxTbTRRowCellHover';\" class=\"inboxTbTRRowCell\">";

										messageHTML += "<td width=25px\" class=\"inboxTbRowCell\"><input type=\"checkbox\" value=\"" + message.id
												+ "\"> </td>";

										messageHTML += "<td onclick=\"showMessageContent(" + message.id
												+ ",false,this)\" class=\"inboxTbRowCell bold\">" + message.userFromName + "</td>";

										messageHTML += "<td onclick=\"showMessageContent(" + message.id
												+ ",false,this)\" class=\"inboxTbRowCell bold\">" + message.subject + "</td>";

										messageHTML += "<td width=90px\" onclick=\"showMessageContent(" + message.id
												+ ",false,this)\" class=\"inboxTbRowCell bold\">" + getDate(message.sendTime) + "</td></tr>";
									}

									$("#inboxTable tbody").append(messageHTML + inboxHTML);

								}

								$('#inboxLblAnch').text($.i18n.prop('inbox.inboxx', [ data.unreadCount ]));
							}

						}
					});
}

function refreshMessageContent(messageId, messageBoxTypeName) {
	$.ajax({
		url :'showMessageContent.action',
		type :'POST',
		data :{
			id :messageId,
			messageBoxTypeName :messageBoxTypeName
		},
		dataType :'json',
		success :function(json) {

			if (checkResponseSuccess(json)) {

         console.log(json + ">>>>>>>>>>>>");
				if (json.messageModelType == 0) {// standart

					$('#messageDetail').html(parseTemplate("inboxStandardMessageTemplate", {
						json :json
					}));

				} else if (json.messageModelType == 1) {// meeting

					$('#messageDetail').html(parseTemplate("inboxMeetingMessageTemplate", {
						json :json
					}));

				} else if (json.messageModelType == 2) {// location request

					$('#messageDetail').html(parseTemplate("inboxLocationRequestMessageTemplate", {
						json :json
					}));

				} else if (json.messageModelType == 3) {// request permission

					$('#messageDetail').html(parseTemplate("inboxRequestPermissionMessageTemplate", {
						json :json
					}));

				} else if (json.messageModelType == 4) {// request category permission

					$('#messageDetail').html(parseTemplate("inboxRequestCategoryPermissionMessageTemplate", {
						json :json
					}));

				} else if (json.messageModelType == 5) {// request location permission

					$('#messageDetail').html(parseTemplate("inboxRequestLocationPermissionMessageTemplate", {
						json :json
					}));

				}
				$('#messageDetail').show();

			} else {
				$('#messageDetail').html("");
			}

		}
	});
}

function AjxUpdateSendMeMail() {
	var sendMeMailPeriod = $('#sendMeMailPeriod').val();
	var sendMeMailCheckbox = $('#sendMeMailCheckbox').attr('checked');
	$.ajax({
		url :'updateSendMeMail.action',
		type :'POST',
		dataType :'json',
		data :{
			sendMeMailPeriod :sendMeMailPeriod,
			sendMeMailCheckbox :sendMeMailCheckbox
		}
	});
}

/* Remove message from trash back to inbox */
function undeleteMessage() {
  var messageIdList = [];
	$(".inboxTable input:checked").each(function(){
		id = $(this).val();
    messageIdList.push(id);		
	});
		
	
  $.ajax({
		url :'undeleteMessage.action',
		type :'POST',
		dataType :'json',
		data :{
			messageIdList :messageIdList
		},
		success :function(json) {
		  if (checkResponseSuccess(json)) {
        
				loadInbox('TRASH',0);

				/*
				 FEEDBACK
				
var btns = {};
				btns[$.i18n.prop('dialog.ok')] = function() {
					$(this).dialog('close');
				};
				
				utils.closeDialog();
				
				var mex = $.i18n.prop('message.trash.moved');
		
				utils && utils.dialog({
					content : "<div class='successMessageCheck'>" + mex +"</div>",
					css: 'noCloseNoOk'
				});
				$(".noCloseNoOk").hide();
				$(".noCloseNoOk").fadeIn("slow");
				timeMsg(); // fadeout for success message		
*/
		
		  }
		}
	});
}

function removeFromTrash() {
  var messageIdList = [];
	$(".inboxTable input:checked").each(function(){
		id = $(this).val();
    messageIdList.push(id);		
	});
		
	
  $.ajax({
		url :'removeFromTrash.action',
		type :'POST',
		dataType :'json',
		data :{
			messageIdList :messageIdList
		},
		success :function(json) {
		  if (checkResponseSuccess(json)) {
        
				loadInbox('TRASH',0);

				/*
				 FEEDBACK
				
var btns = {};
				btns[$.i18n.prop('dialog.ok')] = function() {
					$(this).dialog('close');
				};
				
				utils.closeDialog();
				
				var mex = $.i18n.prop('message.trash.moved');
		
				utils && utils.dialog({
					content : "<div class='successMessageCheck'>" + mex +"</div>",
					css: 'noCloseNoOk'
				});
				$(".noCloseNoOk").hide();
				$(".noCloseNoOk").fadeIn("slow");
				timeMsg(); // fadeout for success message		
*/
		
		  }
		}
	});
}

function replyToMessage(messageID, type) {
	//var toUser = $(".inboxTbTRRowCellSelected td:nth-child(2)").text();
	var toUser = [];

	 //toUser = $('#standardMessageDetailContent .from span').text();
	 toUser.push($('#standardMessageDetailContent .from span').text());

	if (type == "all") {
   toUser.push($('#standardMessageDetailContent .to span').text());
  }
	if (toUser == null || toUser == undefined || toUser == [])
		showErrorDialog($.i18n.prop('warning.select.message'), true);
	else if (toUser == $.i18n.prop('lbas.system'))
		showErrorDialog($.i18n.prop('error.message.reply'), true);
	else {
		//var messageSubject = $(".inboxTbTRRowCellSelected td:nth-child(3)").text();
		var messageSubject = $('#standardMessageDetailContent .head h2').text();
		var messageBody = $('#standardMessageDetailContent .content').text();
    var action = "reply"		

		openComposeMessageDialogFromInbox(toUser, messageSubject, messageBody, action);
	}
}

function forwardMessage(messageID) {
	var toUser = [];
  var messageSubject = $('#standardMessageDetailContent .head h2').text();
  var messageBody = $('#standardMessageDetailContent .content').text();
  var action = "forward"
  openComposeMessageDialogFromInbox(toUser, messageSubject, messageBody, action);
}

function styleMessages(){
  if ($("#messages").length>0) { // if in messages tab
  	var inboxPos = $("#inbox").offset();
  	var inboxPosTop = inboxPos.top;
  	var pageHeight = $(window).height();
  	var contentHeight = pageHeight-inboxPosTop;
  	var messageContainerHeight = $("#messages-container").height();
  	var tablePos = $(".inboxTableCover").offset();
  	var tablePosTop = tablePos.top;
  	var newHeightTable = pageHeight - tablePosTop
  	
  	//$("#inbox").css("height", contentHeight);
  	var topPosition =$("#inbox").offset();
	var topPositionTop = topPosition.top;
	var privacyHeight =  $("#messageDiv").outerHeight();
	
	var visHeight = $(window).height();
	if( privacyHeight > visHeight  ){
		
		$("#inbox").css("height", privacyHeight);

	}else{
		$("#inbox").css("height", visHeight - topPositionTop );

	}
  	
  	var last_column = $('#messageListContent .fixedArea .four');
  	var lcw = parseInt(last_column.css('width'));
  	
	}
}

function toggelAllMessages(el) {
  
  var active_tab = $(el).parents('div[id^=tab-]').attr('id');
  var chkbs = $('#'+active_tab + ' .inboxTable .inboxTbRowCell input[type=checkbox]');

  if ($('#'+active_tab + ' .selectAll>input').is(':checked')) {
    chkbs.not(':checked').click();
    $('.inboxActionLink').addClass('multi_user_button_inactive');			  
  }else{
	  chkbs.filter(':checked').click();   
    $('.inboxActionLink').removeClass('multi_user_button_inactive');			  
  }		  
	  
  if(chkbs.length>0){
    $('.inboxActionLink').toggleClass('multi_user_button_inactive');
  }


}

/* INCOMING REQUEST */
function loadMessageBoxRequestList(searchText) {
  
  if (searchText != null || typeof searchText != 'undefined') {
    var data = {
      searchText : searchText
    }
  } else data = {}



	$.ajax({
		url :'listIncomingRequests.action',
		type :'POST',
    data: data,    
		dataType :'json',
		success :function(json) {
			if (checkResponseSuccess(json)) {
			 /* reg ex for search fields */
        var reMex = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchMessages'), 'g');
        var reInReq = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchInReq'), 'g');
        var reOutMex = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchOutMessages'), 'g');
        var reOutReq = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchOutReq'), 'g');
        var reTrash = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchTrash'), 'g');
            
            $('#requestedList').empty()
            
            var messageBoxTypeName = "INBOX";
            var searchActive = 0;

/* PAGINATION ========================= */
/*
            if (json.page>1) {
              var prev_page = json.page-1;
                    $("#tab-inbox-requests #prevNav").html(
                        '<a href="#" class="inboxPagingLink standartLink" onclick="loadInbox(' +json.messageBoxTypeName +','+searchActive+',1,5); return false;">' + '<img src="http://lbas.vodafone.com/reply/images/messages/go_first.png" width="13" height="13" alt="go_first" />'+'</a>'
                            +'<a href="#" class="inboxPagingLink standartLink" onclick="loadInbox(' +json.messageBoxTypeName +','+searchActive+','+ prev_page +',5);return false" >'+ '<img src="http://lbas.vodafone.com/reply/images/messages/go_prev.png" width="13" height="13" alt="go_prev" />'+'</a>'
                    );
                }
                else {
                    $("#tab-inbox-requests #prevNav").html(
                        '<label>' + ' <img src="http://lbas.vodafone.com/reply/images/messages/go_first.png" width="13" height="13" alt="go_first" />'+' </label>'
                            +'<label>'+' <img src="http://lbas.vodafone.com/reply/images/messages/go_prev.png" width="13" height="13" alt="go_prev" />'+' </label>'
                    );
                }
                $("#tab-inbox-requests #inputNav").html(
                  '<ul class="page-link-list"></ul>'
                );

                if (json.page < json.total) {
                  var next_page = json.page + 1;
                    $("#nextNav").html(
                        '<a href="#" class="inboxPagingLink standartLink" onclick="loadInbox(' +json.messageBoxTypeName +','+searchActive+',1,5); return false;">' + '<img src="http://lbas.vodafone.com/reply/images/messages/go_next.png" width="13" height="13" alt="go_next" />'+'</a>'
                            +'<a href="#" class="inboxPagingLink standartLink" onclick="loadInbox(' +json.messageBoxTypeName +','+searchActive+','+ next_page +',5);return false" >'+ '<img src="http://lbas.vodafone.com/reply/images/messages/go_last.png" width="13" height="13" alt="go_last" />'+'</a>'
                    );
                }
                else {
                    $("#tab-inbox-requests #nextNav").html(
                        '<label>' + ' <img src="http://lbas.vodafone.com/reply/images/messages/go_next.png" width="13" height="13" alt="go_next" />'+' </label>'
                            +'<label>'+' <img src="http://lbas.vodafone.com/reply/images/messages/go_last.png" width="13" height="13" alt="go_last" />'+' </label>'
                    );
                }

*/
				var id, read, sendTime, subject, userFromName, userToName ;
				
				/* update req number only if not searching */
				if (searchText == null || typeof searchText == 'undefined') {
          $('.req-cnt').html(json.totalRecords);
        }
				
				
				$.each(json.messageList, function(i,v){
          var date = new Date(v.sendTime);
          date = date.customFormat( "#DD#/#MM#/#YYYY# #hh#:#mm#" );
					
					$('<tr id="'+v.id+'" class="inboxTbTRRowCell"></tr>').html(
							   '<td class="inboxTbRowCell first">'+'<input class="selector" type="checkbox" value='+v.id
						+'></td><td class="inboxTbRowCell second" onclick="showRequestContent('+v.id+',true,this)">'+v.userFromName
						 +'</td><td class="inboxTbRowCell third" onclick="showRequestContent('+v.id+',true,this)">'+v.subject
						 +'</td><td class="inboxTbRowCell four" onclick="showRequestContent('+v.id+',true,this)">'+date
						+'</td>').appendTo("#requestedList");


				});
				
				/* switch to search icon */
				s_val = $.trim( $('#searchMessageInput').val() );
				if (!( s_val.match(reMex) || s_val.match(reInReq) || s_val.match(reOutMex) || s_val.match(reOutReq) || s_val.match(reTrash) )) {
  				$('#searchMessageArea a').removeClass('loading').removeClass('magnifier').addClass('search-reset');
  		} else {
    		$('#searchMessageArea a').removeClass('loading').removeClass('search-reset').addClass('magnifier');
    		}
				
        
        
/*         $('#searchMessageArea a').removeClass('loading').addClass('magnifier'); */
        
        var active_tab = "#tab-inbox-requests"
        
        /* set pagination */
        setInboxPagination(json, active_tab);        
				
			}
		}
	});
	
}

function showRequestContent(messageId, read, tdComponent) {
		
		var active_tab_id = $(tdComponent).parents('div[id^=tab]').attr('id');


		$.ajax({
		url :'getMessageDetail.action',
		type :'POST',
		data :{
			id :messageId,
			messageBoxTypeName :messageBoxTypeName
		},
		dataType :'json',
		success :function(json) {

			if (checkResponseSuccess(json)) {
			  
			//	$("#messageUserFromToId").html(json.fromUserId + "-" + json.toUserId);



        
				if (json.messageModelType == 2) {// location request

					$('#'+active_tab_id+' #requestDetail').html(parseTemplate("inboxLocationRequestMessageTemplate", {
						json :json
					}));

				}


        // set correct time format
        var date = new Date(json.sendTime);
        var user_date = new Date();
        var diff = Math.floor((user_date - date) / 1000);

        var ago = "";
        if (diff <= 1) {ago = "(just now)";}
        else if (diff < 20) {ago = "("+diff +" "+ $.i18n.prop('time.second.ago');}
        else if (diff < 40) {ago = $.i18n.prop('time.halfMinute.ago');}
        else if (diff < 60) {ago = $.i18n.prop('time.lessMinute.ago');}
        else if (diff <= 90) {ago = $.i18n.prop('time.oneMinute.ago');}
        else if (diff <= 3540) {ago = "("+Math.round(diff / 60) + " "+ $.i18n.prop('time.minutes.ago');}
        else if (diff <= 5400) {ago = $.i18n.prop('time.oneHour.ago');}
        else if (diff <= 86400) {ago = "("+Math.round(diff / 3600) + " "+ $.i18n.prop('time.hours.ago');}
        else if (diff <= 129600) {ago = $.i18n.prop('time.oneDay.ago');}
        else if (diff < 604800) {ago = "("+Math.round(diff / 86400) + " "+ $.i18n.prop('time.days.ago');}
        else if (diff <= 777600) {ago = $.i18n.prop('time.oneWeek.ago');}
        else if (diff > 777600) {ago = $.i18n.prop('time.overWeek.ago');}

        $('#sentTimeReq').append(date.customFormat( "#hh#:#mm#:#ss# #DD#/#MM#/#YYYY#" )+ " "+ago);
                
        // Set temporary req action time
        var req_start = new Date(json.startTime);
        var req_end = new Date(json.stopTime);
        
        var req_time = req_start.customFormat("#DDD# #DD#/#MM#/#YYYY#") + " " +$.i18n.prop('poi.from')+ " " + req_start.getHoursFormatted() +":"+ req_start.getMinutesFormatted() + " " +$.i18n.prop('poi.to')+ " " + req_end.getHoursFormatted() +":"+ req_end.getMinutesFormatted();

        $('#locationRequestMessageDetailContent .req-time').append(req_time);
					
				$('.headBar').hide();
        $('#'+active_tab_id+' #selectMulti').hide();
        $('#'+active_tab_id+' #requestedListContent').hide();


        $('#'+active_tab_id+' #requestDetail').show();
			}
			else {
				$('#'+active_tab_id+' #requestDetail').html("");
			}
		}
		
		});
}

function hideRequestContent(element) {
    var active_tab_id = $(element).parents('div[id^=tab]').attr('id');
    $('#'+active_tab_id+' #requestDetail')
        .html('')
        .hide();
   /* $('#'+active_tab_id+' .headBar').show(); */
    $('#'+active_tab_id+' #selectMulti').show();
    $('#'+active_tab_id+' #requestedListContent').show();
}


/* SEND REMINDER */
function sendReminder(element) {
  var active_tab_id = $(element).parents('div[id^=tab]').attr('id');
  

  
  /* get selected ids */
  //var messageIdlist = [];
  var targetIdlist = [];
	$("#"+active_tab_id+" .inboxTable input:checked").each(function(){
		 //id = $(this).val();
		 var id = $(this).attr('data-req-id');
		 var target = $(this).attr('data-req-target');

		 //messageIdlist.push(id+':1');
		 var status =$(this).parent().next().next().next().attr('status');

		 if(status == 'false'){

			 targetIdlist.push(id+':'+target);
		 }
	 });
	 
	 if(targetIdlist.length === 0){
		 utils.dialogSuccess($.i18n.prop('reminder.noUser'));
		 return false;
	 }


  $.ajax({
    url :'sendLocationRequestReminder.action',
    type :'POST',
    dataType :'json',
    data: {
      //remindersToSend: messageIdlist
      remindersToSend: targetIdlist
    },
    success :function(jsonReminder) {
      
       utils.closeDialog();

		utils && utils.dialog({
		    content : "<div class='successMessageCheck'>"+$.i18n.prop('reminder.sent')+"</div>",
		    css: 'noCloseNoOk'
		});
		$(".noCloseNoOk").hide();
		$(".noCloseNoOk").fadeIn("slow");
		timeMsg();
    }
  });
}


/* SENT REQUESTS */
function loadMessageBoxSentList(searchText) {
    /*load sent request message box list */
    
    if (searchText != null || typeof searchText != 'undefined') {
      var data = {
        searchText : searchText
      }
    } else data = {}
    
    
    $.ajax({
        url :'listOutgoingRequests.action',
        type :'POST',
        dataType :'json',
        data:data,
        success :function(json) {
          
          if (checkResponseSuccess(json)) {
            /* reg ex for search fields */
            var reMex = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchMessages'), 'g');
            var reInReq = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchInReq'), 'g');
            var reOutMex = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchOutMessages'), 'g');
            var reOutReq = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchOutReq'), 'g');
            var reTrash = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchTrash'), 'g');
                        
            $("#sentList").empty();
            
            /* update req number only if not searching */
            if (searchText == null || typeof searchText == 'undefined') {
              
              var tot = json.totalRecords;
              $('.req-sent-cnt').html(tot);
            }

            if (json.page == null || json.page < 1) {
              json.page = 1;
            }
             
            var messageBoxTypeName = "SENT";
            var searchActive = 0;
             

                                  
            if (json.page>1) {
              var prev_page = json.page-1;
              
                $("#tab-sent-requests #inboxPaging #prevNav").html(
                    '<a href="#" class="inboxPagingLink standartLink" onclick="loadInboxReq(1); return false;">' + '<img src="images/messages/go_first.png" width="13" height="13" alt="go_first" />'+'</a>'
                        +'<a href="#" class="inboxPagingLink standartLink" onclick="loadInboxReq('+prev_page+');return false" >'+ '<img src="images/messages/go_prev.png" width="13" height="13" alt="go_prev" />'+'</a>'
                );
                /*.appendTo("#inboxPagingReq");*/
            }
            else {

                $("#tab-sent-requests #inboxPaging #prevNav").html(
                    '<label>' + ' <img src="images/messages/go_first.png" width="13" height="13" alt="go_first" />'+' </label>'
                        +'<label>'+' <img src="images/messages/go_prev.png" width="13" height="13" alt="go_prev" />'+' </label>'
                );
            }
            $("#tab-sent-requests #inboxPaging #inputNav").html(
                  '<ul class="page-link-list"></ul>'                
/*                     '<input id="inboxPagInput" type="text" style="width:35px" value='+ json.page +' />' + $.i18n.prop('inbox.paging.of') + json.total */
            );

            if (json.page < json.totalPages) {
              var next_page = json.page + 1;
                $("#tab-sent-requests #inboxPaging #nextNav").html(
                    '<a href="#" class="inboxPagingLink standartLink" onclick="loadInboxReq('+ next_page + '); return false;">' + '<img src="images/messages/go_next.png" width="13" height="13" alt="go_next" />'+'</a>'
                        +'<a href="#" class="inboxPagingLink standartLink" onclick="loadInboxReq('+ json.totalPages +');return false" >'+ '<img src="images/messages/go_last.png" width="13" height="13" alt="go_last" />'+'</a>'
                );
            }
            else {
                $("#tab-sent-requests #inboxPaging #nextNav").html(
                    '<label>' + ' <img src="images/messages/go_next.png" width="13" height="13" alt="go_next" />'+' </label>'
                        +'<label>'+' <img src="images/messages/go_last.png" width="13" height="13" alt="go_last" />'+' </label>'
                );
            }


            var id, read, sendTime, subject, userFromName, userToName ;
            $.each(json.messageList, function(i,v){
                

                
                var date = new Date(v.sendTime);
                date = date.customFormat( "#DD#/#MM#/#YYYY# #hh#:#mm#" );
                $('<tr class="inboxTbTRRowCell "'+v.read+'></tr>').html(
                        '<td class="inboxTbRowCell first">'+'<input class="selector" type="checkbox" data-req-id='+v.locationRequestId+' data-req-target='+v.targetUserId+' value='+v.id
                        +'></td><td class="inboxTbRowCell second" onclick="">'+v.userToName
                        +'</td><td class="inboxTbRowCell third" onclick="">'+v.subject
                        +'</td><td class="inboxTbRowCell four status" status="'+v.read+'">'+v.statusText.toLowerCase()
                        +'</td><td class="inboxTbRowCell fifth" onclick="">'+ date
                        +'</td>').appendTo("#sentList");
            });
            
            
            s_val = $.trim( $('#searchMessageInput').val() );
            if (!( s_val.match(reMex) || s_val.match(reInReq) || s_val.match(reOutMex) || s_val.match(reOutReq) || s_val.match(reTrash) )) {
              $('#searchMessageArea a').removeClass('loading').removeClass('magnifier').addClass('search-reset');
            } else {
              $('#searchMessageArea a').removeClass('loading').removeClass('search-reset').addClass('magnifier');
            }
            
/*                 $('#searchMessageArea a').removeClass('loading').addClass('magnifier'); */
            
            var active_tab = "#tab-sent-requests"
            /* set pagination */
            setInboxPagination(json, active_tab);
            
            
            
            /* set btn listeners */
            $(active_tab+' .mark-delete').click(function(e){
              e.preventDefault();
              if (!$(this).hasClass('multi_user_button_inactive')) {
                deleteMessage(1);
                return false;
              }
            });
            $(active_tab+' .mark-reminder').click(function(e){
              e.preventDefault();
              if (!$(this).hasClass('multi_user_button_inactive')) {
                sendReminder(this);
                return false;
              }
            });
            
            /* activate buttons if chkbox  */
            $(active_tab+' input[type=checkbox]').click(function() {

              var chk = $(this);
              var control = chk.parent().parent().find('.four').text().toUpperCase();

              if(control === $.i18n.prop('locationRequests.pending').toUpperCase() ){
              
                $(active_tab+ ' .inboxActionLink').toggleClass('multi_user_button_inactive', !($(active_tab +' input:checked').length>0));
	              /*if ($(active_tab +' input:checked').length>0) {
	                $(active_tab+ ' .inboxActionLink').removeClass('multi_user_button_inactive');
	              }else {
	                $(active_tab+ ' .inboxActionLink').addClass('multi_user_button_inactive');
	              }*/
              }
              if(control === $.i18n.prop('locationRequests.accepted').toUpperCase() ){
              
                $(active_tab +' input:checked').toggleClass('multi_user_button_inactive', !($(active_tab +' input:checked').length>0));
	              /*if ($(active_tab +' input:checked').length>0) {
	                $(active_tab+ ' .mark-delete').removeClass('multi_user_button_inactive');
	              }else {
	                $(active_tab+ ' .inboxActionLink').addClass('multi_user_button_inactive');
	              }*/
              
              }
              

            });   
                
          }
        }
    });
}

function loadInboxReq(page){
	var page = page;
	    $.ajax({
        url :'listOutgoingRequests.action?page='+page,
        type :'POST',
        dataType :'json',
        success :function(json) {
          
          if (checkResponseSuccess(json)) {
            /* reg ex for search fields */
            var reMex = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchMessages'), 'g');
            var reInReq = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchInReq'), 'g');
            var reOutMex = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchOutMessages'), 'g');
            var reOutReq = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchOutReq'), 'g');
            var reTrash = new RegExp($.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchTrash'), 'g');
                        
            $("#sentList").empty();
            

            if (json.page == null || json.page < 1) {
              json.page = 1;
            }
             
            var messageBoxTypeName = "SENT";
            var searchActive = 0;
             

                                  
            if (json.page>1) {
              var prev_page = json.page-1;
              
                $("#tab-sent-requests #inboxPaging #prevNav").html(
                    '<a href="#" class="inboxPagingLink standartLink" onclick="loadInboxReq(1); return false;">' + '<img src="images/messages/go_first.png" width="13" height="13" alt="go_first" />'+'</a>'
                        +'<a href="#" class="inboxPagingLink standartLink" onclick="loadInboxReq('+prev_page+');return false" >'+ '<img src="images/messages/go_prev.png" width="13" height="13" alt="go_prev" />'+'</a>'
                );
                /*.appendTo("#inboxPagingReq");*/
            }
            else {

                $("#tab-sent-requests #inboxPaging #prevNav").html(
                    '<label>' + ' <img src="images/messages/go_first.png" width="13" height="13" alt="go_first" />'+' </label>'
                        +'<label>'+' <img src="images/messages/go_prev.png" width="13" height="13" alt="go_prev" />'+' </label>'
                );
            }
            $("#tab-sent-requests #inboxPaging #inputNav").html(
                  '<ul class="page-link-list"></ul>'                
/*                     '<input id="inboxPagInput" type="text" style="width:35px" value='+ json.page +' />' + $.i18n.prop('inbox.paging.of') + json.total */
            );

            if (json.page < json.totalPages) {
              var next_page = json.page + 1;
                $("#tab-sent-requests #inboxPaging #nextNav").html(
                    '<a href="#" class="inboxPagingLink standartLink" onclick="loadInboxReq('+ next_page + '); return false;">' + '<img src="images/messages/go_next.png" width="13" height="13" alt="go_next" />'+'</a>'
                        +'<a href="#" class="inboxPagingLink standartLink" onclick="loadInboxReq('+ json.totalPages +');return false" >'+ '<img src="images/messages/go_last.png" width="13" height="13" alt="go_last" />'+'</a>'
                );
            }
            else {
                $("#tab-sent-requests #inboxPaging #nextNav").html(
                    '<label>' + ' <img src="images/messages/go_next.png" width="13" height="13" alt="go_next" />'+' </label>'
                        +'<label>'+' <img src="images/messages/go_last.png" width="13" height="13" alt="go_last" />'+' </label>'
                );
            }


            var id, read, sendTime, subject, userFromName, userToName ;
            $.each(json.messageList, function(i,v){
                

                
                var date = new Date(v.sendTime);
                date = date.customFormat( "#DD#/#MM#/#YYYY# #hh#:#mm#" );
                $('<tr class="inboxTbTRRowCell "'+v.read+'></tr>').html(
                        '<td class="inboxTbRowCell first">'+'<input class="selector" type="checkbox" data-req-id='+v.locationRequestId+' data-req-target='+v.targetUserId+' value='+v.id
                        +'></td><td class="inboxTbRowCell second" onclick="">'+v.userToName
                        +'</td><td class="inboxTbRowCell third" onclick="">'+v.subject
                        +'</td><td class="inboxTbRowCell four status" status="'+v.read+'">'+v.statusText.toLowerCase()
                        +'</td><td class="inboxTbRowCell fifth" onclick="">'+ date
                        +'</td>').appendTo("#sentList");
            });
            
            
/*
            s_val = $.trim( $('#searchMessageInput').val() );
            if (!( s_val.match(reMex) || s_val.match(reInReq) || s_val.match(reOutMex) || s_val.match(reOutReq) || s_val.match(reTrash) )) {
              $('#searchMessageArea a').removeClass('loading').removeClass('magnifier').addClass('search-reset');
            } else {
              $('#searchMessageArea a').removeClass('loading').removeClass('search-reset').addClass('magnifier');
            }
*/
            
/*                 $('#searchMessageArea a').removeClass('loading').addClass('magnifier'); */
            
            var active_tab = "#tab-sent-requests"
            /* set pagination */

            setInboxPagination(json, active_tab);
            
            
            
            /* set btn listeners */

            $(active_tab+' .mark-delete').click(function(e){
              e.preventDefault();
              if (!$(this).hasClass('multi_user_button_inactive')) {
                deleteMessage(1);
                return false;
              }
            });
            $(active_tab+' .mark-reminder').click(function(e){
              e.preventDefault();
              if (!$(this).hasClass('multi_user_button_inactive')) {
                sendReminder(this);
                return false;
              }
            });

            
            /* activate buttons if chkbox  */

            $(active_tab+' input[type=checkbox]').click(function() {
              
              

              var chk = $(this);
              $(active_tab+ ' .inboxActionLink').toggleClass('multi_user_button_inactive', !($(active_tab +' input:checked').length>0));
              /*
              if ($(active_tab +' input:checked').length>0) {
                $(active_tab+ ' .inboxActionLink').removeClass('multi_user_button_inactive');
              }else {
                $(active_tab+ ' .inboxActionLink').addClass('multi_user_button_inactive');
              }*/
            });   

                
          }
        }
    });

	
}
/* DOM READY (PARTIALLY) */
$(function(){
  
  $('body .searchPart').live('click','a', function(e){e.preventDefault();});
  
  /* DISABLE ALL .multi_user_button_inactive BUTTONS */
  //$('body #messages').on('click', '.multi_user_button_inactive' ,function(e){e.preventDefault();});
  
  /* search with enter button */
  $('body').on('keyup','#searchMessageInput', function(e){
        
    if(enterPressed(e)){ // if search starts on key press
      inboxSearch();
    }// enter pressed
    
  }); // key up
  
  /* search with mag button */
/*
  $('body').on('click', '.searchPart .search-bt', function(){
    is_search_clicked = true;
    inboxSearch();
  });
*/
  
  $('body').on('click', function(e){
    if ($('#messages').length>0 &&  $('#messages').css('display') == 'block') {
      var t = e.target;
      if ($(t).attr('class') == 'search-bt') {
        inboxSearch();
      } else if ($(t).attr('id') != 'searchMessageInput') {
        if( $('#searchMessageInput').val() == '') {
          handleSearchBlur();
        }
      }
    }
  });
    
});






