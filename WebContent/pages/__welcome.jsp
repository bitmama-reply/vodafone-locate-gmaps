<%@page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@taglib uri="/struts-tags" prefix="s"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!--
    <meta name="viewport" content="width=device-width,height=device-height,initial-scale=1,minimum-scale=1,maximum-scale=1">
    <meta name = "format-detection" content = "telephone=yes">
    -->
<!--     <title>VF-Locate - <s:property value="loginState"/></title> -->
    <title>Welcome to Vodafone Locate</title>
    
    <link rel="stylesheet" type="text/css" href="style/jquery-ui-1.8.16.custom/jquery-ui-1.8.16.custom.css">
    <link rel="stylesheet" type="text/css" href="style/lbas_032013.min.css">
    <link rel='stylesheet' type='text/css' href='style/fullcalendar.print.css' media='print' />
    
    <!-- jQuery && jQuery UI -->
    <script type="text/javascript" src="js/ext/jquery-1.7.min.js"></script>
    <script type="text/javascript" src="js/ext/jquery-ui-1.8.16.custom.min.js"></script>
    <script type="text/javascript" src="js/ext/jquery.i18n.properties-min-1.0.9.js"></script>
    <script type="text/javascript" src="js/ext/jquery.blockUI.js"></script>
    <script type="text/javascript" src="js/ext/jquery.history.js"></script>
    <script type="text/javascript" src="js/ext/jquery.tokeninput.js"></script>
    <script type="text/javascript" src="js/ext/jquery.maxlength-min.js"></script>
    <script type="text/javascript" src="js/ext/jquery.multiselects.js"></script>
    <script type="text/javascript" src="js/ext/jquery.ui.selectmenu.js"></script>
    <script type="text/javascript" src="js/ext/jquery.fileinput.min.js"></script>
    <script type="text/javascript" src="js/ext/encoder.js"></script>
    <script type="text/javascript" src="js/jquery/plugins/jquery.form/jquery.form-3.14.js"></script>
    <script type="text/javascript" src="js/livevalidation/1.3/livevalidation_standalone.js"></script>
    <script type="text/javascript" src="js/jquery/plugins/jquery.jqGrid-3.6.2/js/i18n/grid.locale-en.js"></script>
    <script type="text/javascript" src="js/jquery/plugins/jquery.jqGrid-3.6.2/js/jquery.jqGrid.min.js"></script>
    
    
    <!--  calendar -->
    <script type="text/javascript" src="js/ext/fullcalendar.min.js"></script>
    <script type="text/javascript" src="js/ext/gcal.js"></script>
    
    <!-- map -->
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAVHgwNHmQcaVMuAQFVrFIcK1WvONih0eo&amp;libraries=places&amp;sensor=false&amp;language=<s:property value="#session.WW_TRANS_I18N_LOCALE.language"/>"></script>
    <script type="text/javascript" src="js/ext/gmaps-infobox.js"></script>
    
    <script type="text/javascript">
      if (typeof console == "undefined") var console = { log: function() {} };
    	if ( $.browser.msie && /6.0/.test(navigator.userAgent) ) {
    		glbmodal = false ;
    	} else {
    		glbmodal = true ;
    	}
    	var lbasVersion='<s:property value="#session.lbasVersion"/>';
    	var contextPath='<%=request.getContextPath()%>';
    	var userLocale = '<s:property value="#session.WW_TRANS_I18N_LOCALE.language"/>';
    	if (userLocale.indexOf('_') !== -1) {
    		userLocale = userLocale.substring(0, userLocale.indexOf('_'));
    	}

    	var currentUser = '<s:property value="#session.LBAS_USER_SESSION.user_id"/>';
    	var viewLocationFrequency = parseInt('<s:property value="#session.viewLocationFrequency"/>');
    	var viewLocationDuration = parseInt('<s:property value="#session.viewLocationDuration"/>');
    	var regionId = '<s:property value="#session.region.id"/>';
    	var regionLowerLeftLat = '<s:property value="#session.region.southLatitude"/>';
    	var regionLowerLeftLon = '<s:property value="#session.region.westLongitude"/>';
    	var regionUpperRightLat = '<s:property value="#session.region.northLatitude"/>';
    	var regionUpperRightLon = '<s:property value="#session.region.eastLongitude"/>';

    	var regionCountryCode = '<s:property value="#session.region.countryCode"/>';
    	var userSessionLat = '<s:property value="#session.latitude"/>';
    	var userSessionLon = '<s:property value="#session.longitude"/>';
    	var userFullName = '<s:property value="#session.LBAS_USER_SESSION.fullName"/>';
    	var userWorkingHours = '<s:property value="#session.userWorkingHours"/>';
    	var userDistanceUnit = '<s:property value="#session.userDistanceUnit"/>';
    	var roleIdOfLoggedInUser = '<s:property value="#session.LBAS_USER_SESSION.role_id"/>';
    	var userAgentType = '<s:property value="#session.LBAS_USER_SESSION.agentType"/>';

    	var mailCnt = '<s:property value="inboxTabHeader"/>';
    	var totMailCnt = 0;
    	totMailCnt=mailCnt;
    	var userConf = '<s:property value="userConfJson"/>';
    	userConf = userConf.replace(/&quot;/g,'"');
    	userConf = jQuery.parseJSON(userConf);

    	var loginState = '<s:property value="loginState"/>';
    	var userLoggedIn = '<s:property value="loginState"/>' == 'SUCCESS';
    	var showCaptcha = '<s:property value="showCaptcha"/>';
    </script>
    
    <script type="text/javascript" src="js/lbas_032013.js"></script>
	
    <!--[if lte IE 8]>
		<link rel="stylesheet" type="text/css" href="style/ie7-8.css">
		<![endif]-->
    
    <s:if test="%{ loginState == 'SUCCESS'}">

    </s:if>
  </head>
  <body>
  	<div id="header" class="clearfix">
  		<div id="top" class="clearfix">
  			<div class="logo">
  				<h1><a href="#map" title="Vadafone Locate"></a></h1>
  			</div><!--end:logo-->

  			<div class="menu">
  				<ul>
  					<s:if test="%{ loginState == 'SUCCESS'}">
  						<li>
  							<a href="#account" id="btn_username"></a>
  							<div id="changeVisibiityIcon" class="clearfix">
  								<div id="myVis"></div>
  								<div class="arrow"></div>
  							</div>
  							<div id="changeVisibiityBox">
	  							<div class="partLeft">
		  							<ul class="list">
			  							<li class="clearfix">
			  								<span class="name"></span>
			  								<div id="myVis"></div>
			  								<div class="arrow"></div>
			  							</li>
			  							<li class="clearfix row">
			  								<span class="vis"></span>
			  								<div class="fixed">
			  									<span class="iconOn"></span>
			  									<span class="visCheck"></span>
			  								</div>
			  							</li>
			  							<li class="clearfix row">
			  								<span class="notvis"></span>
			  								<div class="fixed">
			  									<span class="iconOff"></span>
			  									<span class="invisCheck"></span>
			  								</div>
			  							</li>
			  							<li class="clearfix row">
			  								<span class="privacy"></span>
			  							</li>
		  							</ul>
	  							</div>
	  							<div class="partRight"></div>
  							</div>
  						</li>
  						<s:if test="#session.LBAS_USER_SESSION.role_id < 2 ">
  						<li>
  							<a id="btn_admin" href="#admin"></a>
  						</li>
  						</s:if>
  						<li>
  							<a href="#PrivacyStatements" id="btn_privacy_terms"></a>
  						</li>
  						<li>
  							<a href="javascript:void(0);" id="btn_logout"></a>
  						</li>
  						<li>
  							<a href="javascript:void(0);" target="_blank" id="btn_help"></a>
  						</li>
  					</s:if>

  				</ul>
  			</div>
  		</div><!--end: top-->

  		<s:if test="%{ loginState == 'SUCCESS'}">
  		<div id="bottom" class="clearfix">
  			<ul class="menubar">
  				<li>&nbsp;</li>
  				<li class="map">
  					<a href="#map" id="btn_map"></a>
  				</li>
  				<li class="messages">
  					<a href="#tab-inbox-messages" id="btn_messages" onclick="return false;"></a>
  				</li>
  				<li class="calendar">
  					<a href="#calendar" id="btn_calendar" ></a>
  				</li>
  				<li class="privacy">
  					<a href="#privacy" id="btn_privacy" ></a>
  				</li>
  			</ul>
  			<!--Html structure for all search fields-->
  			<div id="search">
  				<span>
  					<input id="inpt_search" class="search" />
  					<span class="searchMagnifier">&nbsp;</span>
  				</span>
  			</div>
  			<!--end:Html structure for all search fields-->
  		</div><!--end: bottom-->
  		</s:if>
  	</div><!--end: header-->
  	<div id="loader" style="width: 100%; height: 788px; background: url(images/loader.gif) no-repeat scroll center center #fff; position: absolute; top: 101px; z-index: 1000; display:none;" class="clearfix content"></div>
  	<div id="login"></div>
  	<div id="privacy-statement"></div>
  	<div id="footer">FOOTER</div>

  <s:if test="%{ loginState == 'SUCCESS'}">
   <!--<script type="text/javascript" src="js/lbas_032013.js"></script>-->
  </s:if>
  <s:else>
    <script>
      
    init = {
      showPrivacy : function() {
    	$.ajax({
    		url :"json/showPrivacyStatementAfterLogin.action",
    		type :'POST',
    		success :function(json) {
    			$('#privacy-statement').load('pages/privacy/privacy_statement.html');
    		}
      });
     }
    };
    
    
    $(document).ready(function(){
      
      //if(loginState === 'INITIAL' || loginState === "FAILURE" || loginState === ""){
      if(loginState !== 'PRIVACY'){
        
        $('#login').load('pages/login.jsp', function(){
        localize && localize.init();
        localize && localize.login();
        if(loginState === 'FAILURE'){
          $('#loginError').text($.i18n.prop('login.failure') || '');
        }

        function validateLoginForm(){
          var usr = $('#loginUserName').val().length > 0;
          var pwd = $('#loginPassword').val().length > 0;

          if(!usr || !pwd /* && lbasValidate('login')*/){
            //showErrorDialog($.i18n.prop('error.correct.invalid.fields'), false);
            //utils && utils.dialog({title:$.i18n.prop('dialog.title.error'), content: $.i18n.prop('login.failure')});
            $('#loginError').text($.i18n.prop('login.failure') || '');
            return false;
          }
          return true;
        }


        $('#captcha').hide();
        $('#loginForm').submit(function(event){
/*
          if (validateLoginForm()) {
            init.showPrivacy();
          }
*/
          return validateLoginForm();
        });

        if(showCaptcha && showCaptcha==1){
          $('#captcha').show();
          $('#kaptchaImage').click(function (){
            $(this).attr('src', 'kaptcha/kaptcha.jpg?' + Math.floor(Math.random()*100) );
          });
        };

        $("#loginUserName").focus();
      });
    } else if (loginState === "PRIVACY") {
        init.showPrivacy();
      }
    });
    </script>
  </s:else>
  
  </body>
</html>