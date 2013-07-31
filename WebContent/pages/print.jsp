<%@page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@taglib uri="/struts-tags" prefix="s"%>
<html xmlns="http://www.w3.org/1999/xhtml" style="overflow-y:scroll">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta http-equiv="content-type" content="text/html;charset=UTF-8" />
<link rel="icon" type="image/vnd.microsoft.icon"	href="../images/favicon.ico" /> 
<script type="text/javascript" src="../js/ext/jquery-1.7.min.js"></script>

<script type="text/javascript">
pinImagesFromPages = true;
</script>

<!--to be removed<link rel="stylesheet" href="../js/openlayers/2.11/theme/default/style.css" type="text/css" />
<link rel="stylesheet" href="../js/openlayers/2.11/theme/default/google.css" type="text/css" />
<script src="../js/openlayers/2.11/OpenLayers.js"></script>
<script src="https://jsapi.lbsp.navteq.com/v1/jsl.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript" src="../js/livevalidation/1.3/livevalidation_standalone.js"></script> -->

<script src="https://maps.googleapis.com/maps/api/js?v=3&amp;client=gmetrial-vodafone&amp;libraries=places&amp;sensor=false&amp;signature=JLyXiQqzayFoKE--LgGBBWJVsQ4=&amp;language=<s:property value="#session.WW_TRANS_I18N_LOCALE.language"/>" type="text/javascript"></script>
<!-- <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAVHgwNHmQcaVMuAQFVrFIcK1WvONih0eo&amp;libraries=places&amp;sensor=false&amp;language=<s:property value="#session.WW_TRANS_I18N_LOCALE.language"/>"></script> -->

<script type="text/javascript" src="../js/ext/jquery.i18n.properties-min-1.0.9.js"></script>
<script type="text/javascript" src="../js/lbas/utils.google.js"></script>
<script type="text/javascript" src="../js/lbas_original/common/Util.js"></script>
<script type="text/javascript" src="../js/lbas_original/map/lbasOpenLayersAdapter.js"></script>
<script type="text/javascript" src="../js/lbas_original/map/markerTooltipManager4.js"></script>
<script type="text/javascript">
var userLocale = '<s:property value="#session.WW_TRANS_I18N_LOCALE.language"/>';

jQuery.i18n.properties({
    name:'lbas_locale',
    path:'../resources/',
    mode:'map',
    language: userLocale || ''
});
</script>
<title>Vodafone Locate</title>
  
<style type="text/css">
    
        #config {
            margin-top: 1em;
            width: 512px;
            position: relative;
            height: 8em;
        }
        #controls {
            padding-left: 2em;
            margin-left: 0;
            width: 12em;
        }
        #controls li {
            padding-top: 0.5em;
            list-style: none;
        }
        #options {
            font-size: 1em;
            top: 0;
            margin-left: 15em;
            position: absolute;
        }
        .olImageLoadError {
            background-color: transparent !important;
        }
        * html {
            overflow-y:scroll;
        }
        #routeDirections .adp-directions{
            width:100%;
        }
        
</style>
</head>
  

	<% if (request.getParameter("printMethod").equals("locationReport") || request.getParameter("printMethod").equals("route")) { 	%>
  	<body onload="initPrintMap('<%= request.getParameter("printMethod") %>')" style="margin:20px;background:none repeat scroll 0 0 #F3F3F3;">
	<% } else { %>
		<body onload="" style="margin:20px;background:none repeat scroll 0 0 #F3F3F3;">
	<% } %>

    
   <input type="button" value="Print" onclick="window.print();">
    
    <br/>
    
   <div id="printMainDiv" style="height:100%;width:100%">
   
     <div id="printMap" style="width:760px;height:400px">
  
     </div>
     
     <br/>
     <br/>
     
     <div id="routeDirections" style="overflow:hidden;position:absolute;">
     
     </div>
    
     
  </div>
  
  </body>
  
  
</html>
 

 