<%@page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<%@taglib uri="/struts-tags" prefix="s" %>
<div id="infoMessage" style="display:none" title="Info">
	<p>
		<span class="ui-icon ui-icon-info" style="float:left; margin:0 7px 50px 0;"></span>
		<div id="infoText">
			<s:fielderror/>
			<s:actionerror />		
		</div>		
	</p>
</div>