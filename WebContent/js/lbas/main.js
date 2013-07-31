/********************************************************/
/* RESIZE MAP */
/********************************************************/
var left_tabs;
var users_tabs;
var map;
var leftPreviousHeigth;
var currentPage;

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

function forceLogOut() {
  $("#btn_logout").trigger("click");
}


function resizeMap() {
   var $right=$('#right');
   var rightWidth = $(window).width();
  if($('#btn_map_expand_collapse').hasClass("expanded")) {
    $right.css({'width': rightWidth-355 });
  } else {
    $right.css({'width':'100%'});
  }
  google.maps.event.trigger(map, 'resize');
}



function positionMapControls() {
  /*var $mappanel=$('#mapPanel');*/
  var $right=$('#right');
  /*var fromTop = $mappanel.position().top + $mappanel.height() + 10;*/
  var rightWidth = $right.width();
  /*console.log(right_pos,"toggle map controls");*/
  
  
  
  if($('#btn_map_expand_collapse').hasClass("expanded")) {
  /*if ($('#left').is(':visible')) {*/
    //if(rightWidth) var toLeft = 0;
    $right.css({'width': rightWidth-355 });
    /*if(right_pos != '355px') {
      $right.animate({'left': '355px'})
    }*/
    
    /*$('#right').animate({'left': '355px'}).css('width', rightWidth-355);*/
    /*$('#left').show();*/
  } else {
    $right.css({'width':'100%'});
    /*, 'left': '0px'*/
    
    /*$('#right').animate({'left': '0px'}).css('width','100%');*/
  }
  google.maps.event.trigger(map, 'resize');
  
}

function resizer() {
  var w = $(window).width();
  var h = ($(window).height() - $('#header').outerHeight(true));
  h = h - 2;
  $("#map").width(w);
  $("#map").height(h);

  var topOffset = $('#mapPanel').outerHeight() - 2;
  $('#right').height($("#map").height() - topOffset);

  if ($('#tabs').is(':visible')) {
    var left=$('#left');
    left.height(h-topOffset);
    var lh = left.outerHeight(true);
    $('#tabs').css({
    	width:'98%',
	    height : h,
	    'overflow': 'hidden' 
	   });

    var tnh = $('.ui-tabs-nav').outerHeight();
    var h1 = left.outerHeight(); 
    var h2 = left.css('top');
    h2 = h2.substring(0, h2.length-2);
    $('#tabs').outerHeight(h1-h2);

    var th = $('#tabs').outerHeight();
    var tth =left.find('div.title').outerHeight();
    var pp = $('#tabs ul.ui-tabs-nav').outerHeight(); 
    var xh = $('#tabs .x-input:visible').outerHeight();
    var ah = $('#tabs .actions:visible').outerHeight();
    
    $('#tabs .contents').css({
	    height : th-pp-xh-ah-50,
	    'overflow-x': 'hidden',
	    'overflow-y': 'auto'
    });
  
    
    if($('#tab-places').is(':visible')){
      resizeTabPlaces();
    }

    $('#right').css({'width': w+'px'});
    var mapStylesHeight = $('.mapStyles').height();
    var rightHeight = $('#right').height();
      $('.olMapViewport').css('height', rightHeight-mapStylesHeight);
    }
    
    /*resizeMap();*/
}

function resizeTabPlaces(){
  var th = $('#tabs').outerHeight();
  var pp = $('#tabs ul.ui-tabs-nav').outerHeight();
  var xh = $('#tabs .x-input:visible').outerHeight();
  var sh1 = $('#tabs .subtabs ul').outerHeight();
  var ah1 = $('#tabs #tab-places .actions:visible').outerHeight();

  $('#tabs .subtabs .contents').height((th-pp-xh-sh1-ah1-70));
  $('#tab-places-enterprise .contents ,#tab-places-personal .contents,#tab-places-recents .contents').height((th-pp-xh-sh1-ah1-104))
  $('#tabs .subtabs .ui-tabs-panel').css('overflow', 'hidden');
  $('#tabs .subtabs .contents').css({'overflow-x': 'hidden', 'overflow-y': 'auto'});
}

function afterInitMapTab() {
  $(window).resize(function() {
    resizer();
    resizeMap();
    /*positionMapControls();*/
  });
  groups.setup();
}

/**************************************************************************/
/* CONFIG ADDITIONAL INFO
/**************************************************************************/

  if(userLoggedIn) {
  
    var lbasRightManager = new LbasRightManager(userConf.rights);
    function scrollbarWidth() {
      // Find the Width of the Scrollbar
      var wide_scroll_html = '<div id="wide_scroll_div_one" style="width:50px;height:50px;overflow-y:scroll;position:absolute;top:-200px;left:-200px;"><div id="wide_scroll_div_two" style="height:100px;width:100%"></div></div>';
      $("body").append(wide_scroll_html); // Append our div and add the hmtl to your document for calculations
      var scroll_w1 = $("#wide_scroll_div_one").width(); // Getting the width of the surrounding(parent) div - we already know it is 50px since we styled it but just to make sure.
      var scroll_w2 = $("#wide_scroll_div_two").innerWidth(); // Find the inner width of the inner(child) div.
      var scroll_bar_width = scroll_w1 - scroll_w2; // subtract the difference
      $("#wide_scroll_div_one").remove(); // remove the html from your document
      return scroll_bar_width;
    }

    function loadTab(element) {
      console.log(element, ">>>>>>>>");
  	  if(element === ''){
  	      setTimeout('$("#btn_map").click();', 1000);
  	  }
      document.title = 'Vodafone Locate - ' + $.i18n.prop('changeTitle.'+element);

      /*RESET ENTRY POINT*/
      user && user.abortAllUserLocate();
      $('.content').hide();
      if (!(userConf && userConf.password_change_required == true))
          forceToCloseDialogBoxes();
      $("#header .menubar li").removeClass("currentIteam");
    
    /**********************************************/

      if(document.location.hash.length === 0 ) {
        element = 'map';
        startLoader();
        loadMapTab(element);
        $("body").css({'overflow':'hidden', 'minWidth':'auto'});
        $("#header .menubar li.map").addClass("currentIteam");
      } else if(element === 'map'){
        element = 'map';
        startLoader();
        loadMapTab(element);
        $("body").css({'overflow':'hidden', 'minWidth':'auto'});
        if($('#locReportTableDiv').length == 1){$('#locReportTableDiv .closeReport').click();}
        $("#header .menubar li.map").addClass("currentIteam");
      }else if(element==='message') {
        element = 'messages';
        startLoader();
        loadMessagesTab(element);
        $("body").css({'overflow':'auto', 'minWidth':1090});
        if($('#locReportTableDiv').length == 1){$('#locReportTableDiv .closeReport').click();}
        $("#header .menubar li.messages").addClass("currentIteam");
      }else if(element==='privacy') {
        element = 'privacy';
        startLoader();
        loadPrivacyTab(element);
        $("body").css({'overflow':'auto', 'minWidth':'auto'});
        if($('#locReportTableDiv').length == 1){$('#locReportTableDiv .closeReport').click();}
        $("#header .menubar li.privacy").addClass("currentIteam");
      }else if(element==='calendar') {
        element = 'calendar';
        startLoader();
        loadCalendarTab(element);
        $("body").css({'overflow':'auto', 'minWidth':1260});
        if($('#locReportTableDiv').length == 1){$('#locReportTableDiv .closeReport').click();}
        $("#header .menubar li.calendar").addClass("currentIteam");
      }else if(element==='admin') {
	    startLoader();
	      $.ajax({
	      url: 'json/editOwnCompany.action',
	      type: 'POST',
	      cache: false,
	      success: function(data) {
	        if (checkResponseSuccess(data)) {
	          MasterAdmin.accountLoad(data);
	          $("body").css({'overflow':'auto', 'minWidth':1090});
	        }
       		}
      	});
        

        forceToCloseDialogBoxes();
        if($('#locReportTableDiv').length == 1){$('#locReportTableDiv .closeReport').click();}        
        
      }else if(element==='PrivacyStatements'){
        element = 'PrivacyStatements';
        startLoader();
        if($('#locReportTableDiv').length == 1){$('#locReportTableDiv .closeReport').click();}        
        loadPrivacyStatements(element);
      }else if(element==='account'){
        element = 'account';
         startLoader();
        $.ajax({
          url: 'json/getAccount.action',
          type: 'POST',
          cache: false,
          success: function(data) {
            if (checkResponseSuccess(data)) {
              UserAccount.accountLoad(data);
              stopLoader();
            }
          }
        });
        if($('#locReportTableDiv').length == 1){$('#locReportTableDiv .closeReport').click();}    
      }else {
        if(element=="" || element==undefined) return;
        loadTmp(element);
        $("body").css({'overflow':'hidden', 'minWidth':'auto'});
        if($('#locReportTableDiv').length == 1){$('#locReportTableDiv .closeReport').click();}        
      }
        currentPage=element;
        
    }

    function loadMapTab(element) {
      var rd="?rd="+(new Date()).getTime();
      /* show global search field */
      $('#search').show();
      var $element = $('#' + element);

      if($element.length === 0) {
        $element = $('<div></div>')
          .attr('id', element)
          .addClass('content ' + element)
          .insertAfter($('#header'));

        $element.load('pages/map.jsp'+rd, function(){
          afterInitMapTab();
          leftPanel && leftPanel.init('#tabs');
          resizer();
          initMainMap('right');
          resizeMap();

          $('#btn_map_expand_collapse').click(function(e){
            
            var $this=$(this);
            var status=$(this).find('> span > span.status');
            var txt = status.text();
           
            
            if(txt.length===0) txt = '+';
            
            /*$("#tabs").toggle('blind', positionMapControls);*/
            
            if($this.hasClass('expanded')){
              $('#left').stop().animate({'left': '-360px'},250, function() {$('#left').hide() });
              /*$('#left').show().height(leftPreviousHeigth);*/
              status.text(txt.replace('+', '-'));
              $('#right').stop().animate({'left': '0px'},250);
              
            }else{
              
               $('#left').stop().show().animate({'left': '-5px'},250, function() {resizeMap() });
               $('#right').stop().animate({'left': '355px'},250);
              /*$(this).removeClass('collapsed');*/
              /*leftPreviousHeigth = $('#left').height();*/
              
              /*$('#left').hide();*/
              status.text(txt.replace('-', '+'));
              /*resizer();*/
            }
            $this.toggleClass('expanded').toggleClass('collapsed');
            if (!$this.hasClass('expanded')) resizeMap();
            
            
            /*positionMapControls();*/
            e.preventDefault();
          });
          stopLoader();
        });
      }
      else {
      stopLoader();
        if(!$element.is('visible')) {
          $element.show();
           resizeMap();
        }
      }
    };

    function startLoader(){
    	//Non cancello le dialog se devo cambiare passwd    	
    	if(!(userConf && userConf.password_change_required == true))
    		utils.closeDialog();
        $('#loader')
          .css({
      'height': $(window).height() - $('#header').height(),
      'top':$('#header').height()
      })
      .show();      
    }
    function stopLoader(){
        $('#loader')
      .delay(500)
      .hide();

    }

    function loadCalendarTab(element) {
      $('#search').hide();
      
    if($("#calendar").length == 1){
      $("#calendar").remove();
    }
    
      var $element = $('#'+element);

      if($element.length===0){
        $element = $('<div></div>')
          .attr('id', element)
          .addClass('clearfix content ' + element)
          .css('width', '100%')
          .css('height', $('document').height()-$('#header').outerHeight())
          .insertAfter($('#header')
          );
          
        $element.load('pages/calendar.jsp', function(){
          cm = new CalendarManager($('#calendar-wrapper'));
          cm.openCalendar();
          stopLoader();
        });
      }else{
        stopLoader();      
        if(!$element.is('visible'))
          $element.show();
      }
    }

    function loadPrivacyStatements(element) {

      /* hide global search field */
      $('#search').hide();

      var $element = $('#'+element);

      if($element.length===0){
        $element = $('<div></div>')
          .attr('id', element)
          .addClass('clearfix content ' + element)
          .css('width', '100%')
          .css('height', $('document').height()-$('#header').outerHeight())
          .insertAfter($('#header')
          );
          $element.load('pages/PrivacyStatements.jsp', function(){
          stopLoader();    
          }); 
          
      }else{
        stopLoader();
        if(!$element.is('visible'))
          $element.show();
      }

    
    }

    function loadAdminTab(element) {
      /* hide global search field */
      $('#search').hide();

      var $element = $('#'+element);

      if($element.length===0){
        $element = $('<div></div>')
          .attr('id', element)
          .addClass('clearfix content ' + element)
          .css('width', '100%')
          .css('height', $('document').height()-$('#header').outerHeight())
          .insertAfter($('#header')
          );
        $element.load('admin/RedirectToAdminloginAction.action', function(){
          $('.left').load('pages/calendar/calendarLeft.jsp', function() {
          });
        });
      }else{
      stopLoader();
        if(!$element.is('visible'))
          $element.show();
      }
    }

    function loadMessagesTab(element) {

      /* hide global search field */
      $('#search').hide();

      var $element = $('#'+element);

      if($element.length===0){
        $element = $('<div></div>')
          .attr('id', element)
          .addClass('clearfix content ' + element)
          .insertAfter($('#header')
          .css('width', '100%')
          .css('height', $('document').height())
          );
        $element.load('pages/inbox.jsp', function(){
          loadMessageBoxList();
          loadInbox('INBOX');
        });
        stopLoader();
      }else{
      stopLoader();
        if(!$element.is('visible'))
          $element.show();
      }

      //openCalendar(); /* WHY ????? */

    }

    function loadPrivacyTab(element) {
      var rd="?rd="+(new Date()).getTime();
      /* hide global search field */
      $('#search').hide();

      var $element = $('#'+element);
        if($element.length===0){
          $element = $('<div></div>')
            .attr('id', element)
            .addClass('content clearfix')
            .insertAfter($('#header'));
        $element.load('pages/privacy.jsp'+rd, function(){
            loadAvailabilityMenu();
            loadAvailability();
            stopLoader();
        });
        }else{
        stopLoader();
            if(!$element.is('visible'))
            {
                $element.show();
            }
      }
    }

    function loadTmp(element) {
    
      var $element = $('#'+element);
      if($element.length===0){
        $element = $('<div></div>')
          .attr('id', element)
          .addClass('content')
          .insertAfter($('#header'));
        $element.empty();
        $element.load('pages/tmp.jsp');
      }else{
        stopLoader();
        if(!$element.is('visible'))
          $element.show();
      }
      
    }
  }

/*
  tab_ref format: "messages" if INBOX
*/
function loadInnerTabs(page_ref,mailbox_ref, element, tab_ref) {
  
  /* ie 7 bug fix*/
   if($.browser.msie && $.browser.version == 7){
    var str= tab_ref;
    var n=str.split('#');
    tab_ref = '#'+n[1];
    }

  /* hide global search field */
  $('#search').hide();
  $('.content').hide();

  var $element = $('#'+element);

  if($element.length===0){
    $element = $('<div></div>')
      .attr('id', element)
      .addClass('clearfix content ' + element)
      .insertAfter($('#header')
      .css('width', '100%')
      .css('height', $('document').height())
      );

    $element.load(page_ref, function(){
      loadMessageBoxList(mailbox_ref);
      loadInbox(mailbox_ref, 0, null, null, null, tab_ref);
    });


  }else{
    if(!$element.is('visible'))
      $element.load(page_ref, function(){
        loadMessageBoxList(mailbox_ref);
        loadInbox(mailbox_ref, 0, null, null, null, tab_ref);
      });
      $element.show();
  }
}


popupNumbers = {

  mex_complete: false,
  in_complete: false,
  out_complete: false,

  timeout: null,

  showPopup : function(el) {
    if (popupNumbers.mex_complete && popupNumbers.in_complete && popupNumbers.out_complete) {
      /* start timer to control popup appearance */
      popupNumbers.timeout=setTimeout(function() {el.hide()},500);
      el.show();
      popupNumbers.mex_complete = false;
      popupNumbers.in_complete = false;
      popupNumbers.out_complete = false;
    }
  },

  getMexNum : function() {
    var data = {
      messageBoxTypeName:'INBOX'
    };

    $.ajax({
      url :'loadMessageBox.action',
      type :'POST',
      data : data,
      dataType :'json',
      success :function(mexJson) {
        if (checkResponseSuccess(mexJson)) {
          $('.mex-cnt').html("("+ mexJson.unreadMessageCount +")");
          popupNumbers.mex_complete = true;
          popupNumbers.showPopup($(".menu-popup"));
        }
      }
    });

  },

  getTotNum : function () {
    return $('.menubar #btn_messages span').html();
  },

  getInReqNum: function() {
    $.ajax({
      url :'listIncomingRequests.action',
      type :'POST',
      dataType :'json',
      success :function(inReqJson) {
        $('.req-cnt').html( inReqJson.totalRecords );
        popupNumbers.in_complete = true;
        popupNumbers.showPopup($(".menu-popup"));
      }
    });
  },

  getOutNum: function() {
    $.ajax({
      url :'loadMessageBox.action',
      type :'POST',
      dataType :'json',
      data: {
        messageBoxTypeName:'SENT'
      },
      success :function(outJson) {
        if (checkResponseSuccess(outJson)) {
          $('.menu-popup-wrapper .sent-cnt').html("("+ outJson.totalRecords +")");
        }
      }
    });
  },

  getOutReqNum: function() {
    $.ajax({
      url :'listOutgoingRequests.action',
      type :'POST',
      dataType :'json',
      success :function(outReqJson) {
        $('.req-sent-cnt').html( outReqJson.totalRecords );
        popupNumbers.out_complete = true;
        popupNumbers.showPopup($(".menu-popup"));
      }
    });
  }

};/*popupNumbers*/

function privacyAddScroll(){

}


function menuBarVisibility(){

  $.ajax({
        url :'getMyAvailability.action',
        type :'POST',
        dataType :'json',
        success :function(json) {
            if (checkResponseSuccess(json)) {
              if(json.visible){
                $('#header #changeVisibiityIcon #myVis').addClass('on');
                $('#header #changeVisibiityBox #myVis').addClass('on');
                $('#header #changeVisibiityBox .visCheck').show();
                $('#header #changeVisibiityBox .invisCheck').hide();
              }else{
                $('#header #changeVisibiityBox .invisCheck').show();
                $('#header #changeVisibiityIcon #myVis').removeClass('on');
                $('#header #changeVisibiityBox #myVis').removeClass('on');
                $('#header #changeVisibiityBox .visCheck').hide();
                $('#header #changeVisibiityBox .invisCheck').show();
              }
            }    
        }
    });
    $('#header #changeVisibiityIcon').off().on('click',function(){
      $('#header #changeVisibiityBox').css({
        left : $('#header #changeVisibiityIcon').position().left-$('#header #btn_username').width()-30
      }).show();
    });
    
    $('#header #changeVisibiityBox li').eq(0).off().on('click',function(){
      $('#header #changeVisibiityBox').hide();
    });
    
    $('#header #changeVisibiityBox li').eq(1).off().on('click',function(){
      /* make online */
      selectChange('visible')
        $('#header #changeVisibiityIcon #myVis').addClass('on');
        $('#header #changeVisibiityBox #myVis').addClass('on');
        $('#header #changeVisibiityBox .visCheck').show();
        $('#header #changeVisibiityBox .invisCheck').hide();
        $('#header #changeVisibiityBox').hide(); 
    });    
    
    $('#header #changeVisibiityBox li').eq(2).off().on('click',function(){
      selectChange('invisible');
      $('#header #changeVisibiityIcon #myVis').removeClass('on');
      $('#header #changeVisibiityBox #myVis').removeClass('on');
      $('#header #changeVisibiityBox .visCheck').hide();
      $('#header #changeVisibiityBox .invisCheck').show();
      $('#header #changeVisibiityBox').hide();
    });    
    
    $('#header #changeVisibiityBox li').eq(3).off().on('click',function(){
      /* go avability */
      $('#header #changeVisibiityBox').hide();
      $("#header #btn_privacy").click();
    });    
    
}

$(document).ready(function() {

  if(userLoggedIn){
	refreshMessageNumberTimeout(userConf.refresh_mail_period);
  
    localize && localize.init();
    localize.mainMenu();
    
    $.history.init(loadTab);
    
    menuBarVisibility();
    
    $('body').on('click', '.ui-dialog.menu-popup a', function(e) {
      //e.preventDefault();
      loadInnerTabs('pages/inbox.jsp', $(this).prop('class').toUpperCase(), 'messages', $(this).attr('href') );
      return false;
    });

    /* SHOW MENU POP */
    $('#btn_messages').on('mouseenter', function(e){

      /* retrieve req numbers*/
      popupNumbers.getMexNum();
      popupNumbers.getOutNum();
      popupNumbers.getOutReqNum();
      popupNumbers.getInReqNum();
 
      //utils.closeDialog();
      utils && utils.dialog({content : parseTemplate("menuPopupTemplate", {}),css: 'menu-popup'});
      $(".menu-popup").hide();

      /* retrieve tot mex number*/
      $('.menu-popup-wrapper .title a').html(popupNumbers.getTotNum());
      /*$(".menu-popup").fadeIn("slow");*/

      /* POSITION DIALOG*/
      var dialogWidth = $('.ui-dialog').outerWidth();


      /* calculate popup pos relative to underneath button */
      var mex_btn_pos = Math.floor($("#btn_messages").offset().left);

      $('.ui-dialog.menu-popup').css({
        'top': '51px',
        'left': mex_btn_pos-5,
        'modal': false
       });

    });

    /* Destroy popup timeout to avoid closing */
    $('body').on('mouseenter', '.ui-dialog.menu-popup', function(){
      window.clearTimeout(popupNumbers.timeout);
    });

    /* HIDE MENU POPUP */
    $('body').on('mouseleave', '.ui-dialog.menu-popup', function(){
      $('.menu-popup').dialog('destroy').remove();
    });

    $('#btn_map, #btn_calendar, #btn_privacy').click(function(e){
      /*====================================
        Add active state to main navigation
      ======================================*/
      $(".menubar li").removeClass("currentIteam").removeClass('prev-then-selected');
      var whichTab = $(this).parents("li").attr("class");
      $(this).parents("li").addClass("currentIteam");
      $(this).parent().prev().addClass('prev-then-selected');

      hash = $(this).attr('href');
      if(userLoggedIn){
        if(hash!==document.location.hash)
          $.history.load(hash.substring(1, hash.length));
          
          /*Fix for ie8 navigation*/          
          if( jQuery.browser.msie && $.browser.version == '8.0'){
                loadTab(hash.substring(1, hash.length));          
          }
      } else {
        document.location = 'logout';
      }
      e.preventDefault();
    });

    $("#btn_logout").bind("click", function(e) {
      $('.content').remove();
      var options = {};
      options.datatype = 'html';
      options.success = function(data){
        document.location = 'welcome';
      };
      utils && utils.lbasDoGet('logout', options);
    });
    
    
    
    
    $("#btn_username").bind("click", function(e) {
    $.ajax({
      url: 'json/getAccount.action',
      type: 'POST',
      cache: false,
      success: function(data) {
        if (checkResponseSuccess(data)) {
          UserAccount.accountLoad(data);
        }
      }
    });
    });

  $("#btn_admin").bind("click", function(e) {
    $.ajax({
      url: 'json/editOwnCompany.action',
      type: 'POST',
      cache: false,
      success: function(data) {
        if (checkResponseSuccess(data)) {
          MasterAdmin.accountLoad(data);
          $("body").css({'overflow':'auto', 'minWidth':1090});          
        }
      }
    });
  });

    $("#btn_user_search_reset").click(function(){
      $('#search_users').val('');
    });

    $("#btn_places_search_reset").click(function(){
      $('#search_places').val('');
    });

    var t = $('li.messages a').html();
    $('li.messages a').html(t + '<img width="10px" src="images/arrow_down_grey.png">'); 
  }

  /*====================================
    Elements for styles
  ======================================*/
  $(".menu ul li:last").addClass("lastIteam");
  $(".menubar li:first").addClass("prev-then-selected");
 /* $(".menubar li.map").addClass("currentIteam");*/
  $(".menubar li a").wrapInner("<span />");


});

$(window).load(function(){
	  if (userConf && userConf.password_change_required == true) {
		  setTimeout('firstTimeLoginPopup()', 1000)
      }
});

function firstTimeLoginPopup (){
	

    $('body').append('<div id="overlayFirstLogin" style="z-index:1000; background:#fff; position:absolute; top:0; left:0;"></div>');
    $('#overlayFirstLogin').css({
      'opacity':0.75,
      'width':$(window).width(),
      'height':$(window).height()
      });
	
    var btns = {};
    utils && utils.dialog({
      title   : $.i18n.prop('firstTimeLogin.header') ,
      content : parseTemplate("accountChangePassword", {}),
      css : 'noClose firstTimeLogin',
      buttons : btns
    });
    rePlaceDialog('firstTimeLogin',200);
    $('.firstTimeLogin h2').text( $.i18n.prop('firstTimeLogin.message')).css('padding','10px 0');
    $('.firstTimeLogin .graphicBtn.little.loadTplBtn').hide();
    
    console.log("Finish open change passws dialog");
    
    $(".firstTimeLogin #updatePasswordBtn").on('click', function(){
      var newPassword        = $('#newPassword').val();
      var newPasswordConfirm = $('#retypePassword').val();
      var validator=new Validator({
       newPasswordConfirm: {
            domElement: '#retypePassword',
            validate: function() {
              return ( $('#newPassword').val() === $('#retypePassword').val() );
            }
          },
        newPassword: {
            domElement: '#newPassword',
            validate: 'presence'
          },
          retypePassword: {
            domElement: '#retypePassword',
            validate: 'presence'/*,
            tooltip: '.tooltip-alert-meetingSubject'*/
          }
        });
        //client validation
        var fieldErrors={}
        var clientValidation=true;
        
        if ( newPassword != newPasswordConfirm ) {
          clientValidation=false;
          fieldErrors["newPasswordConfirm"]=[$.i18n.prop('user.details.passwordsnequal')];
        }
        if ( newPasswordConfirm == '' ) {
          clientValidation=false;
          fieldErrors["retypePassword"]=[$.i18n.prop('user.details.retypepasswordrequired')];
        }
        if ( newPassword == '' ) {
          clientValidation=false;
          fieldErrors["newPassword"]=[$.i18n.prop('user.details.passwordrequired')];
        }
        if (!clientValidation) {
          errorsOnDialog(fieldErrors);
          return;
        }
          
      function errorsOnDialog(serverErrors) {
        var el = validator.parseServerErrors(serverErrors);
          $('.firstTimeLogin #send-list-wrapper').empty().append(el);
          $('.firstTimeLogin #error-view-sendmessage').show();
      }
      $.ajax({
        url: 'changePassword.action',
        type: 'POST',
        cache: false,
        data: {
          newPassword: newPassword,
          newPasswordConfirm: newPasswordConfirm
        },
        success: function(msg) {
          if (checkResponseSuccess(msg,errorsOnDialog)) {
            utils.closeDialog();
            utils.dialogSuccess(msg.infoMessage);
            $('#overlayFirstLogin').fadeOut().remove();
          }
        }
      });
         
    
        });
 
}

function refreshUsers(){
  $('#tab-users .contents ul').remove().promise().done(function(){
    var load = true;
    load && groups && groups.getGroupsList({}, true);
    updatePlacesNumberTab();
  });
}

function refreshAssets(){
  $('#tab-assets .contents ul').remove().promise().done(function(){
    var load = true;
    load && groups && groups.getGroupsList({}, false);
    updatePlacesNumberTab();
  });

}

function refreshTabRecentPlaces(){
  $('#tab-places-recents .contents ul').remove().promise().done(function(){
    load = true;
    load && places && places.getRecents();
    resizeTabPlaces();
    updatePlacesNumberTab();
  });
}

function refreshTabPlacesEnterprise(){
  $('#tab-places-enterprise .contents ul').remove().promise().done(function(){
    load = true;
    load && places && places.getEnterprise();
    resizeTabPlaces();
    updatePlacesNumberTab();
  });
}

function refreshTabPlacesPersonal(){
  $('#tab-places-personal .contents ul').remove().promise().done(function(){
    load = true;
    load && places && places.getPrivate();
    resizeTabPlaces();
    updatePlacesNumberTab();
  });
}

function updatePlacesNumberTab(){
	$.ajax({
		type: 'POST',
		url : 'getlocationmain.action',
		success: function(json){
			$('#btn_tab-places-personal').html($.i18n.prop('category.personal') + " (" + json.clist[0].poiCount + ")");
	        $('#btn_tab-places-enterprise').html($.i18n.prop('category.enterprise') + " (" + json.clist[1].poiCount + ")");
			
		}
	});
	
}

function refreshMessageNumberTimeout(time){

	
	setInterval(function(){
		if( $('#tab-inbox-messages').is(':visible') || $('#tab-inbox-requests').is(':visible') ){
			refreshMessageViewTimeout();
		}else{
			refreshMessageNumberTimeoutNum();
		}
    }, time);
}


function refreshMessageViewTimeout(){
	var total, inbox, req;
    $.ajax({
      url :'loadMessageBox.action',
      type :'POST',
      async :false,
      data : {
	      messageBoxTypeName:'INBOX'	      
      },
      dataType :'json',
      success :function(json) {
        if (checkResponseSuccess(json)) {
    			$('#tab-mex span').text($.i18n.prop('message.Messages') +' ('+ json.unreadMessageCount +')');
    			inbox = json.unreadMessageCount;
      			if($('#inboxPaging .page-link-list li').eq(0).find('a').hasClass('active') ){
      	        	$('#inboxTable').empty();
      				for(var i=0; i < json.messageList.length; i++) { 
      					var top = json.messageList[i];
      					var lineRow ='';
      					var unread = top.read ? '' : 'bold';
      					lineRow += '<tr class="inboxTbTRRowCell" onmouseout="if (!$(this).hasClass(\'inboxTbTRRowCellSelected\')) this.className=\'inboxTbTRRowCell\';" onmouseover="if (!$(this).hasClass(\'inboxTbTRRowCellSelected\')) this.className=\'inboxTbTRRowCellHover\';" class="inboxTbTRRowCell">';
      				    lineRow += '<td class="inboxTbRowCell first" valign="middle">';
      				    lineRow += '<input class="selector" type="checkbox" value="'+top.id+'">';
      				    lineRow += '<div class="read_unread '+unread+'"></div>';
      			        lineRow += '</td>';
      			        lineRow += '<td onclick="showMessageContent('+top.id+','+ top.read +', this)" class="inboxTbRowCell second  '+unread+'">'+top.userFromName;
      			        lineRow += '</td>';
      			        lineRow += '<td onclick="showMessageContent('+top.id+','+ top.read +', this)" class="inboxTbRowCell third  '+unread+'">'+top.subject;
      			        lineRow += '</td>';
      			        lineRow += '<td onclick="showMessageContent('+top.id+','+ top.read +', this)" class="inboxTbRowCell four  '+unread+'">'+getDate(top.sendTime);
      			        lineRow += '</td>';
      			        lineRow += '</tr>';	   
      			        $('#inboxTable').append(lineRow);
              }
            }
          }
        }
    });

	$.ajax({
		url :'listIncomingRequests.action',
		type :'POST',
		dataType :'json',
		async :false,
		success :function(json) {
			$('#messages-container ul li.tab-requests a span .req-cnt').text( json.messageList.length);
			req = json.messageList.length;
        	$('#requestedList').empty();
			for(var i=0; i < json.messageList.length; i++) { 
				var top = json.messageList[i];
				
				var date = new Date(top.sendTime);
				date = date.customFormat( "#DD#/#MM#/#YYYY# #hh#:#mm#" );
					
					$('<tr id="'+top.id+'" class="inboxTbTRRowCell"></tr>').html('<td class="inboxTbRowCell first">'+'<input class="selector" type="checkbox" value='+top.id
						+'></td><td class="inboxTbRowCell second" onclick="showRequestContent('+top.id+',true,this)">'+top.userFromName
						 +'</td><td class="inboxTbRowCell third" onclick="showRequestContent('+top.id+',true,this)">'+top.subject
						 +'</td><td class="inboxTbRowCell four" onclick="showRequestContent('+top.id+',true,this)">'+date
						+'</td>').appendTo("#requestedList");	
			}

		},
		error:function (xhr, ajaxOptions, thrownError){
			forceLogOut();
		}
	});
	total = inbox + req;
	$('li.messages a span').html($.i18n.prop('inbox.inboxx', [ total ]) + '<img width="10px" src="images/arrow_down_grey.png">');     
	$('.INBOX_menu a span').text($.i18n.prop('welcome.Mail') +' ('+ total +')');			
    
}
function refreshMessageNumberTimeoutNum(){
var total, inbox, req;
    $.ajax({
      url :'loadMessageBox.action',
      type :'POST',
      async :false,
      data : {
	      messageBoxTypeName:'INBOX'	      
      },
      dataType :'json',
      success :function(json) {
        if (checkResponseSuccess(json)) {
			inbox = json.unreadMessageCount;
        }
      }
    });

	$.ajax({
		url :'listIncomingRequests.action',
		type :'POST',
		dataType :'json',
		async :false,
		success :function(json) {
			req = json.messageList.length;
		},
		error:function (xhr, ajaxOptions, thrownError){
			forceLogOut();
		}
	});
	total = inbox + req;
	$('li.messages a span').html($.i18n.prop('inbox.inboxx', [ total ]) + '<img width="10px" src="images/arrow_down_grey.png">');     

    
}

function forceToCloseDialogBoxes(){
	var close_tot = $('.ui-dialog').length;
	for ( var i = 0; i < close_tot; i++) {
		utils.closeDialog();
	}
}

function rePlaceDialog(cssName , fromTop){
  setTimeout(function(){
    var dialog, t;
    if (cssName !== undefined)
      dialog = $('.'+cssName);
    else
      dialog = $('.ui-dialog');  
    
    if(fromTop !== undefined)
      t = fromTop;
    else
      t = 100;
    var w = dialog.outerWidth()/2;
    var p = ($(window).width()/2) - w;
    dialog.css({
      top: t,
      left: p
    });
  }, 300)
}