<%@page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<%@taglib uri="/struts-tags" prefix="s" %>
<div id="globalErrorMessage" style="display:none" title="Error">
	<p>
		<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 50px 0;"></span>
		<div id="errorText">
			<s:text name="errors.db.fail"/>			
		</div>		
	</p>
</div>
 