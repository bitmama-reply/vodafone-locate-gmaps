<%@page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@taglib uri="/struts-tags" prefix="s" %>

<script language="javascript">

var privacyStatement;
$(function(){
	 $.post('getCompanyPrivacy.action', {}, function(json) {
		 privacyStatement=json.privacyStatement;
		 initializeLbasMessages() ;
     });
	 
	 $('#privacyStatement').attr('title',$.i18n.prop('tip.companyPrivacy.statmentEditorFrame'));
	 displayTitleOnToolTip("privacyStatement", "top center", "displayTitleOnArrowToolTip", true);
 });


</script>

<h2><b><lm name="privacy.statement.company"></lm></b></h2>
<div id="privacyStatement" class="privacyStatement">
<s:property escape="false" value="companyPrivacyStatement" />	
</div>

<table><tr>
		<td width ="500"></td>		
			<td align="right">   
			   <s:a href="javascript:void(0);"  style="color: #FFFFFF;text-decoration:none" cssClass="textBtnRed"  
			        onclick="$('#privacyList').load('editCompanyPrivacy.action');$('.displayTitleOnArrowToolTip').remove();" >                          	                          
				       <span class="btnSpan"><lm name="buttons.edit"/></span>                     	
			   </s:a>
			</td>
	</tr></table>
