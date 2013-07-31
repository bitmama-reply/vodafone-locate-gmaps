<%@page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@taglib uri="/struts-tags" prefix="s" %>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" dir="ltr">
<head>
    <meta http-equiv="content-type" content="text/html;charset=UTF-8" />
    <META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE">
    <META HTTP-EQUIV="Pragma" CONTENT="no-cache">
	<link rel="icon" type="image/vnd.microsoft.icon" href="../images/favicon.ico" />
	<link type="text/css" href="../js/jquery/plugins/jquery.jqGrid-3.6.2/css/jquery-ui-1.7.1.custom4jqGrid.css" rel="stylesheet" />
    <link type="text/css" href="../js/jquery/plugins/jquery.jqGrid-3.6.2/css/ui.jqgrid.css" rel="stylesheet" />
    <link type="text/css" href="../js/jquery/css/jquery-ui-1.8.11.custom.css"	rel="stylesheet" />
    <link type="text/css" href="../js/jquery/plugins/cleditor/jquery.cleditor.css" rel="stylesheet" />
    <link type="text/css" href="../js/jquery/plugins/tokeninput/css/token-input-facebook.css?version=<s:property value='#session.lbasVersion'/>"	rel="stylesheet" />
    <link type="text/css" href="../js/jquery/plugins/jcrop/jquery.Jcrop.css" rel="stylesheet" />
    
	<script type="text/javascript" src="../js/jquery/js/jquery-1.4.2.min.js"></script>
	<script type='text/javascript' src='../js/jquery/js/jquery.tools.min.js'></script>
    <script type="text/javascript" src="../js/jquery/js/jquery.bgiframe.min.js"  ></script>
	<script type='text/javascript' src='../js/jquery/plugins/jquery.i18n/jquery.i18n.properties-1.0.4-min.js'></script>
	<script type="text/javascript" src="../js/jquery/js/jquery-ui-1.8.11.custom.min.js"></script>
	<script type="text/javascript" src="../js/jquery/plugins/ui.layout/jquery.layout.min-1.2.0.js"></script>
	<script type="text/javascript" src="../js/jquery/plugins/multiselects/jquery.multiselects-0.3.pack.js"></script>
	<script type="text/javascript" src="../js/jquery/plugins/jquery.jqGrid-3.6.2/js/i18n/grid.locale-<s:property value='#session.WW_TRANS_I18N_LOCALE.language'/>.js"></script>
	<script type="text/javascript" src="../js/jquery/plugins/jquery.jqGrid-3.6.2/js/jquery.jqGrid.min.js"></script>
	<script type='text/javascript' src='../js/jquery/plugins/autocomplete/jquery.autocomplete.pack-1.0.js'></script>	
	<script type="text/javascript" src="../js/jquery/plugins/maxlength/maxlength-1.0.js"></script>
	<script type="text/javascript" src="../js/livevalidation/1.3/livevalidation_standalone.js"></script>
    <script type="text/javascript" src="../js/jquery/js/jquery.bt-1.0.js"></script>
    <script type="text/javascript" src="../js/jquery/plugins/jquery.jec/jquery.jec-1.3.0.js"></script>
    <script type='text/javascript' src='../js/jquery/plugins/cleditor/jquery.cleditor.min.js'></script>
	<script type="text/javascript" src="../js/jquery/plugins/tokeninput/jquery.tokeninput.js?version=<s:property value='#session.lbasVersion'/>"></script>
    <script type='text/javascript' src='../js/jquery/plugins/jcrop/jquery.Jcrop.js'></script>
    <script type="text/javascript" src="../js/jquery/plugins/jquery.form/jquery.form.js"></script>

	<%@ include file="includes.jsp" %>

	<script type="text/javascript">
	initializeLbasMessages() ;
	contextPath='<%=request.getContextPath()%>';
	lbasVersion='<s:property value="#session.lbasVersion"/>';
	changePswd='<s:property value="passwordChangeRequired"/>';
	var companyId='<s:property value="#session.LBAS_USER_SESSION.company_id"/>';
	userLocale = '<s:property value="#session.WW_TRANS_I18N_LOCALE.language"/>';
	var userRoleType = '<s:property value="userRoleType"/>';
	
	if(userLocale==null || userLocale=='')userLocale='en';

	$.ajaxSetup({
		  cache: false
	});
	
	aPage = true;
    jQuery.i18n.properties({
	    name:'lbas_locale',
	    path:'../resources/',
	    mode:'map',
	    language:userLocale,
	    callback: function() {
	    }
	});
	
	$(function(){
		$('body').layout({ 
			defaults: {
		    },
			north: {
				size:"auto",
				spacing_open:0,
				closable:false,
				resizable:false
				},
			west:{
	            size:$('body').innerWidth() * 0.15,
	            resizable:false
	            ,applyDefaultStyles: true
			},
			center:{
				size:$('body').innerWidth() * 0.85,
				resizable:false
				,applyDefaultStyles: true				
			}
	
		});
		if (userRoleType == 1)
			displayCompanyDetailInfo(companyId);
		if (userRoleType == 2)
			$('#assetList').load('listAssets');
		if(userRoleType == 3)
			$('#companyList').load('listCompanies');
		if(userRoleType == 4)
			$('#opcoAdminUserList').load('listOpcoAdminUsers');
		
		$('#allDialogs').html(parseTemplate("dialogDivsAdminTemplate", {}));
		if(changePswd=='true'){
			var tooltipClass = "displayTitleOnArrowToolTip";
	        openPasswordChangeDialog(tooltipClass);
	    }
		
		$("#logout").bind("click", function(e) {
			$('#mainContent').load('logout');
		});
		
	});
	
	</script>


</head>
<body onload="initializeErrorHandler();">

<div class="ui-layout-north">
	<div id="header">    
		
		<div id="top">
			<div class="header-logo"></div>
			<ul id="topNav">	   	    
				<li onclick ="openHelpAdm();"><a href="javascript:void(0);" style="text-decoration: none; color: #333333;"><lm name="welcome.Help" /></a></li>
				<li style="margin-left:7px;">|</li>
				
				<s:if test="%{ userRoleType == 1}">
				<li><a href="<%= request.getContextPath() %>/RedirectToLBASAction.action" style="margin-left:15px;text-decoration: none; color: #7E7E7E;"><lm name="welcome.Home" /></a></li>
				<li style="margin-left:7px;">|</li>
				 </s:if>
				 
				<%-- <li><a href="<%= request.getContextPath() %>/admin/adminLogout.action" style="margin-left:15px;text-decoration: none; color: #7E7E7E;"><lm name="welcome.Logout" /></a></li> --%>
				<li id="logout"><a href="javascript:void(0);" style="margin-left:15px;text-decoration: none; color: #7E7E7E;"><lm name="welcome.Logout" /></a></li>
				<li>
					<img src="../images/bt_logout14x14.png" style="margin-top: 5px;margin-left:5px;"></span>
				</li>
			</ul>
		</div>
	</div>		    
			
</div>

<div class="ui-layout-center content">
     <div id="mainContent">
     <s:if test="%{ userRoleType == 3}"> 
        <div id="companyList" style="">   
	           
		   <%@ include file="listCompanies.jsp" %>
	           
	    </div>
	     <div id="kpiList"  style="display:none">   
          
          
        </div> 
     </s:if>
     <s:if test="%{ userRoleType == 1}"> 
        <div id="companyList" style="">   
	           
	           
	    </div>
	    <div id="userList" style="">   
         
   	   
          
        </div>
        <div id="assetList" style="display:none">   
         
   	   
          
        </div>
	           
	             
	     <div id="groupList"  style="display:none">   
          
          
          </div>
	           
	             
	      <div id="locationList" style="display:none">   
          
    	     <%@ include file="locationList.jsp" %>
          
          </div>
          
          <div id="privacyList" style="display:none">   
	
          </div>
     </s:if>
     <s:if test="%{ userRoleType == 4}"> 
        <div id="opcoAdminUserList" style="">   
	       
	           
	    </div>
	    
	    <div id="userStatisticsList"  style="display:none">   
          
          
        </div>
        
        <div id="kpiList"  style="display:none">   
          
          
        </div> 
        
        <div id="applicationList" style="display:none">  
        
        </div>
        
        <div id="dbObjectsList"  style="display:none"></div>
          
     </s:if>
          
     
     </div>
</div>

<div class="ui-layout-west">
	<div id="adNav" class="ui-layout-content">
		<ul id="adMenu" style="background:#FFFFFF;">
		<s:if test ="%{ userRoleType == 3}">
			<li id="companyListLi" class="adMenuSelected" onclick=""><a id="companyListA" style="text-decoration:none;color:white;font-weight:bold" href="#company_managment" onclick="changeAdminNavigation('companyList');$('#companyList').load('listCompanies');"><lm name="admin.CompanyManagement"/></a></li>
			<li id="kpiListLi" class="adMenu"><a id="kpiListA" style="text-decoration:none;color:white;font-weight:bold" href="#kpi_managment" onclick="changeAdminNavigation('kpiList');AjxListKpi();"><lm name="admin.kpiManagement"/></a></li>					
		</s:if>
		<s:if test ="%{ userRoleType == 1}">
			<li id="companyListLi" class="adMenuSelected" onclick=""><a id="companyListA" style="text-decoration:none;color:white;font-weight:bold" href="#company_managment" onclick="changeAdminNavigation('companyList');displayCompanyDetailInfo(companyId);"><lm name="admin.CompanyManagement"/></a></li>		
			<li id="userListLi" class="adMenu"><a id="userListA" style="text-decoration:none;color:white;font-weight:bold" href="#users_managment" onclick="changeAdminNavigation('userList');$('#userList').load('listusers');"><lm name="admin.UsersManagement"/></a></li>
			<s:if test ="%{ assetEnable==true}">
				<li id="assetListLi" class="adMenu"><a id="assetListA" style="text-decoration:none;color:white;font-weight:bold" href="#asset_managment" onclick="changeAdminNavigation('assetList');$('#assetList').load('listAssets');"><lm name="admin.AssetManagement"/></a></li>
			</s:if>	
			<li id="groupListLi" class="adMenu"><a id="groupListA" style="text-decoration:none;color:white;font-weight:bold" href="#group_managment" onclick="changeAdminNavigation('groupList');$('#groupList').load('listgroups');"><lm name="admin.GroupManagement"/></a></li>
			<li id="locationListLi" class="adMenu"><a id="locationListA" style="text-decoration:none;color:white;font-weight:bold" href="#location_managment" onclick="changeAdminNavigation('locationList');loadAdminCategoryList();"><lm name="admin.LocationManagement"/></a></li>
			<li id="privacyListLi" class="adMenu"><a id="privacyListA" style="text-decoration:none;color:white;font-weight:bold" href="#privacy_managment" onclick="changeAdminNavigation('privacyList');$('#privacyList').load('showCompanyPrivacy.action');"><lm name="welcome.Privacy"/></a>			
			</li>
		</s:if>
		<s:if test ="%{ userRoleType == 4}">
			<li id="opcoAdminUserListLi" class="adMenuSelected" onclick=""><a id="opcoAdminUserListListA" style="text-decoration:none;color:white;font-weight:bold" href="#opcoAdminUser_managment" onclick="changeAdminNavigation('opcoAdminUserList');$('#opcoAdminUserList').load('listOpcoAdminUsers');"><lm name="admin.OpcoAdminUserManagement"/></a></li>
			<li id="userStatisticsListLi" class="adMenu"><a id="userStatisticsListA" style="text-decoration:none;color:white;font-weight:bold" href="#userStatistics_managment" onclick="changeAdminNavigation('userStatisticsList');AjxListUserStatistics();"><lm name="admin.UserStatisticsManagement"/></a></li>
			<li id="kpiListLi" class="adMenu"><a id="kpiListA" style="text-decoration:none;color:white;font-weight:bold" href="#kpi_managment" onclick="changeAdminNavigation('kpiList');AjxListKpi();"><lm name="admin.kpiManagement"/></a></li>
			<li id="applicationListLi" class="adMenu" onclick=""><a	id="applicationListListA" style="text-decoration: none; color: white; font-weight: bold" href="#application_managment" onclick="changeAdminNavigation('applicationList');$('#applicationList').load('listApplications');"><lm name="admin.ApplicationManagement" /> </a></li>
			<li id="dbObjectsListLi" class="adMenu"><a id="dbObjectsListA" style="text-decoration:none;color:white;font-weight:bold" href="#dbObjects_managment" onclick="changeAdminNavigation('dbObjectsList');AjxListDBObjects();AjxSearchDBObjects();"><lm name="admin.DBObjectsManagement"/></a></li>
		</s:if>
		</ul>
	</div>
</div>

<script id="allAdminTemplate" type="text/html" class="lbasTemplate:../pages/template/allAdminTemplate.html">
</script>
<div id="lbasTemplates"></div>

<div id="allDialogs">
</div>

<div id="adminLogoutDiv"></div>
 
  <div id="errorDiv">
 	<%@ include file="../common/errorMessage.jsp"%>
 	<%@ include file="../common/infoMessage.jsp"%>
 </div>
</body>
</html>
