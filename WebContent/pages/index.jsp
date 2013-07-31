<%@page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@taglib uri="/struts-tags" prefix="s"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name = "format-detection" content = "telephone=yes">

<title>VF-Locate</title>
<link href="css/reset.css" rel="stylesheet" type="text/css">
<!--
<link href="css/ui-lightness/jquery-ui-1.8.16.custom.css" rel="stylesheet" type="text/css">
-->
<link href="css/jquery-ui-1.8.16.custom/jquery-ui-1.8.16.custom.css" rel="stylesheet" type="text/css">
<link href="css/style.less" rel="stylesheet/less" type="text/css">

<!-- jQuery && jQuery UI -->
<script src="js/ext/jquery-1.7.min.js" type="text/javascript"></script>
<script src="js/ext/jquery-ui-1.8.16.custom.min.js" type="text/javascript"></script>
<script src="js/ext/jquery.i18n.properties-min-1.0.9.js" type="text/javascript"></script>

<!-- less -->
<script src="js/ext/less-1.1.3.min.js" type="text/javascript"></script>

<!--  modernizr -->
<script src="js/ext/modernizr.custom.js" type="text/javascript"></script>

<!-- backbone -->
<script src="js/ext/json2.js" type="text/javascript"></script>
<script src="js/ext/underscore-min.js" type="text/javascript"></script>
<script src="js/ext/backbone-min.js" type="text/javascript"></script>

<!-- locate -->
<script src="js/lbas/user.js" type="text/javascript"></script>

<!-- map -->
<!-- <script src="https://jsapi.lbsp.navteq.com/v1/jsl.js" type="text/javascript" charset="utf-8"></script> -->

<!-- lbas -->
<script src="js/lbas/placesSearch.js" type="text/javascript"></script>
<script src="js/lbas/userSearch.js" type="text/javascript"></script>
<script src="js/lbas/globalAutocomplete.js"></script>
<script src="js/lbas/utils.js" type="text/javascript"></script>
<script src="js/lbas/i18n.js" type="text/javascript"></script>



<style type="text/css">
.ui-autocomplete-category {
	font-weight: bold;
	padding: .2em .4em;
	margin: .8em 0 .2em;
	line-height: 1.5;
	color: red;
}

#header ul li {
	display: inline;
}
</style>

<script type="text/javascript">
 //<![CDATA[
	    
	    $.ajaxSetup({
			  cache: false
		});
	    
	    if ( $.browser.msie && /6.0/.test(navigator.userAgent) ) {  
	    	glbmodal = false ;
	    	 	
	    } else {
	    	glbmodal = true ;	    		    	
	    }

        lbasVersion='<s:property value="#session.lbasVersion"/>';
        contextPath='<%=request.getContextPath()%>';      
        userLocale = '<s:property value="#session.WW_TRANS_I18N_LOCALE.language"/>';
        var currentUser = '<s:property value="#session.LBAS_USER_SESSION.user_id"/>';        
        var viewLocationFrequency=parseInt('<s:property value="#session.viewLocationFrequency"/>');
        var viewLocationDuration=parseInt('<s:property value="#session.viewLocationDuration"/>');
        var regionId = '<s:property value="#session.region.id"/>';
        var regionLowerLeftLat  = '<s:property value="#session.region.southLatitude"/>';
        var regionLowerLeftLon  = '<s:property value="#session.region.westLongitude"/>';
        var regionUpperRightLat = '<s:property value="#session.region.northLatitude"/>';
        var regionUpperRightLon = '<s:property value="#session.region.eastLongitude"/>';

        var regionCountryCode = '<s:property value="#session.region.countryCode"/>';
        var userSessionLat = '<s:property value="#session.latitude"/>';
        var userSessionLon = '<s:property value="#session.longitude"/>';
        var userFullName='<s:property value="#session.LBAS_USER_SESSION.fullName"/>';
        var userWorkingHours='<s:property value="#session.userWorkingHours"/>';
        var userDistanceUnit='<s:property value="#session.userDistanceUnit"/>';
		var roleIdOfLoggedInUser='<s:property value="#session.LBAS_USER_SESSION.role_id"/>';
		var userAgentType='<s:property value="#session.LBAS_USER_SESSION.agentType"/>';
        
            
        userLoggedIn='<s:property value="loginState"/>'=='SUCCESS';                

//]]>
</script>

<script type="text/javascript">
	var left_tabs;
	var users_tabs;
	var map;
		
	$(window).resize(function() {
		  var w = $(window).width();
		  var h = ($(window).height() - $('#header').height());
		  h = h -2;

		  $("#content").width(w);
		  $("#content").height(h);

		  $('#right').height($("#content").height());
		  $('#left').height($("#content").height());
		  $('#tabs').height($("#content").height());
		  $('#left').width(w*20/100);
		  $('#tabs').height($('#left').width()-10);
		  $('#tabs').height($('#left').height()-10);
		});


	$(document).ready(function(){
		
		  var w = $(window).width();
		  var h = ($(window).height() - $('#header').height());
		  h = h -2;
		  
		  $("#content").width(w);
		  $("#content").height(h);
		  $('#left').height($("#content").height());
		  $('#left').width(w*20/100);
		  $('#tabs').width($('#left').width()-4);
		  $('#tabs').height($('#left').height()-4);
				
		  $('#right').height($("#content").height());
			//$('#left').css('z-index', '5000');
			var lat = 52.51, 
				lang = 13.4
			
			//initializeLBAS(false,0,0,0,0);
			
			/*jsapi.util.ApplicationContext.set("authenticationToken", "APP000229774");
			map = new jsapi.map.Display(document.getElementById("right"), {
			      components: [ new jsapi.map.component.Behavior(), //behavior collection 
			                    new jsapi.map.component.ZoomBar(),
			                    new jsapi.map.component.Overview(),
			                    new jsapi.map.component.TypeSelector(),     
			                    new jsapi.map.component.ScaleBar(),
			                    new jsapi.map.component.ViewControl(),
			                    //new jsapi.map.component.OverlaysSelector(["trafficflow", "trafficincidents"]),
			                    new jsapi.map.component.ZoomRectangle(),
			                    new jsapi.map.component.DistanceMeasurement()
			                  ],
			      zoomLevel: 12,
			      center: [lat, lang]
			    });
			//remove zoom.MouseWheel behavior for better page scrolling experience
			map.removeComponent(map.getComponentById("zoom.MouseWheel")); */
			
			if (Modernizr.geolocation){
				navigator.geolocation.getCurrentPosition(function(position){
					lat = position.coords.latitude;
					lang = position.coords.longitude;
					/*if(map)
						map.setCenter(new jsapi.geo.Coordinate(lat, lang), 'default');*/
				});
			} 
			
		
		left_tabs = $('#left #tabs').tabs();
		//$( "#btn_users_locatable").buttonset();
		users_tabs = $( "#btn_users_locatable").tabs();
		
		$('#search_users').autocomplete({
			source: function(req, resp){
				userSearch.autocomplete(req, resp);
			}, 
			select : function(event, item) {
				userSearch.retreive(item.item);
			}
		});
		
		$('#search_places').autocomplete({
			source: function(req, resp){
				placesSearch.autocomplete(req, resp);
			},
			select: function(event, item){
				if(item.item.type === 1){ //retrive category
					placesSearch.retreiveCategory(item.item);
				}else if(item.item.type === 2){ //retrive category
                    /*var coords = new jsapi.geo.Coordinate(52.3356864, 4.8916481);
                    var marker = new jsapi.map.StandardMarker(coords);
                    var accuracyCircle = new jsapi.map.Circle(coords, 1);
                    map.objects.addAll([accuracyCircle, marker]);
                    map.zoomTo(accuracyCircle.getBoundingBox(), false, "default");
                    if (map.zoomLevel > 16) map.set("zoomLevel", 16); //zoom out if too close */
	            }
			}
		});
		
		$('#btn_map').click(function(){
			$( "#left" ).toggle( 'blind');
		});
	});
</script>

</head>
<body>
	<div id="header">
		<div id="top">
			<ul class="menu">
				<li>
					<a href="privacy/privacy.html" id="btn_privacy_terms">privacy terms</a>
				</li>
				<li>
					<a href="javascript:void(0);" id="btn_help">help</a>
				</li>
				<li>
					<a href="javascript:void(0);" id="btn_username">username</a>
				</li>
				<li>
					<button id="btn_logout">LOG OUT</button>
				</li>
			</ul>
		</div>

		<div id="bottom">
			<ul class="menu">
				<li>
					<img alt="vodafone logo" src="img/vodafone-logo.png">
				</li>
				<!-- 
				<li>
					<a href="tel:+4915257907711" id="btn_test">49-1525-7907711</a>
				</li>
				 -->
				<li>
					<a href="javascript:void(0);" id="btn_map">Map</a>
				</li>
				<li>
					<a href="javascript:void(0);" id="btn_message">Messages</a>
				</li>
				<li>
					<a href="javascript:void(0);" id="btn_calendar">Calendar</a>
				</li>
				<li>
					<a href="javascript:void(0);" id="btn_privacy"></a>
				</li>
				<li id="search">
					<input id="inpt_search" class="search">
			    </li>
			</ul>
		</div>
	</div>

	<div id="content">
		<span id="left">
			<span id="tabs">
				<ul>
					<li><a id="btn_tab-users" href="#tab-users"></a></li>
					<li><a id="btn_tab-places" href="#tab-places"></a></li>
					<li><a id="btn_tab-routes" href="#tab-routes"></a></li>
				</ul>
				<div id="tab-users">
					<input type="text" id="search_users" class="search">
				</div>
				<div id="tab-places">
					<input type="text" id="search_places" class="search">
				</div>
				<div id="tab-routes">
					<p>T.B.D.</p>
				</div>
			</span>
		</span>
		

		<span id="right">
		</span>
	</div>

	<div id="footer">FOOTER</div>
</body>
</html>