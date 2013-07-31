<%@page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@taglib uri="/struts-tags" prefix="s" %>
<script language="javascript">

initializeLbasMessages() ;

var selectedCompanyId;

registerValidations("updateCompany");
registerValidations("newCompanyBanForm");
var loginUserLocale = '<s:property value="#session.WW_TRANS_I18N_LOCALE.language"/>';
var locale = loginUserLocale == 'en' ? '' : (loginUserLocale == null ? '' : loginUserLocale);
$(function() {			
		$("#expiryDateDatePickerStart").datepicker($.extend( {}, $.datepicker.regional['' + locale + ''], {
				showMonthAfterYear :false,
				showOn: 'button',
				dateFormat: 'dd/mm/yy',
				buttonImage: '../images/calendar.png',
				buttonImageOnly: true,
				minDate: new Date(),			
				onSelect: function(dateText, inst) {
					var daystart = $("#expiryDateDatePickerStart").datepicker("getDate");			
				 }
				}));
		});

ageOfLocationTypeChanged('<s:property value="lbasCompany.ageOfLocationType"/>');
prepareBusinessHours('<s:property value="lbasCompany.businessHours"/>','company');
$('#cdfViewDiv').html($('#cdfDiv').html());
$('input[id^=cdfN_]').attr('title',$.i18n.prop('tip.company.cdf'));
displayTitleOnToolTipForForm("updateCompany", "top center", "displayTitleOnArrowToolTip", true);

</script>

<s:if test ="%{ method == 1 }">
	<script language="javascript">showHideCDF();</script>
</s:if>

<div id="companyListContent">
<s:form action="updateCompany" theme="simple">
<table cellpadding="9" cellspacing="9">
<s:hidden name="lbasCompany.id"/>

<tr>
    <td><lm name="companyList.CompanyName"/></td>
    <td><s:textfield id="admCompanyName" name="lbasCompany.name"  cssClass="vldRequired vldMaxLength30"/></td>
	<td width ="12"><span id="admCompanyNameVld"/></td>
	
	<s:if test ="%{ userRoleType != 1}">
		<td>
			<lm name="companyList.Status"/>&nbsp;
			<s:if test ="%{ method == 0}">
			    <s:radio name="lbasCompany.status" list="#{1:'active',0:'inactive'}" value="1"></s:radio> 
		    </s:if>
		    <s:else>
		    	<s:radio name="lbasCompany.status" list="#{1:'active',0:'inactive'}" value="lbasCompany.status"></s:radio> 	    
		    </s:else>
		</td>
	</s:if>
	<s:else>
		<td>&nbsp;</td>
	</s:else>
	
</tr>
<tr>
	<td><lm name="companyList.ContactNumber"/></td>
	<s:if test ="%{ method == 0}">
		<td><s:textfield id="admContactNumber" name="lbasCompany.contactNumber" cssClass="vldRequired vldPhone"/></td>
	</s:if>
	<s:else>
		<td><s:select id="adminUserCandidates" name="lbasCompany.contactNumber + ':' + lbasCompany.contactName + ':' + lbasCompany.contactSurname + ':' + lbasCompany.contactEmail"  list="adminUserCandidatesList" listKey="key" listValue="value" onchange="changeAdminUser();"/>	</td>
	</s:else>
	<td width ="12"><span id="admContactNumberVld"/></td>
	
	<s:if test ="%{ userRoleType != 1}">
		<td>
			<s:checkbox id="notifyMeEveryNthLocationCheckbox" key="notifyMeEveryNthLocationCheckbox" />	
			<lm name="privacy.notifyMeEveryNthLocation3"/>&nbsp;
			<s:select id="notifyMeEveryNthLocationCount" name="lbasCompany.notificationCount"  list="notifyMeEveryNthLocationCountList" />					
			<lm name="privacy.notifyMeEveryNthLocation2"/>     	      
		</td>
	</s:if>
	<s:else>
		<td>&nbsp;</td>
	</s:else>
	
</tr>
<tr>
	<td><lm name="companyList.ContactName"/></td>
	<s:if test ="%{ method == 0}">
		<td><s:textfield id="admContactName" name="lbasCompany.contactName" cssClass="vldRequired vldMaxLength50"/></td>
	</s:if>
	<s:else>
		<td><s:textfield id="admContactName" name="lbasCompany.contactName" cssClass="vldRequired vldMaxLength50" readonly="true"/></td>
	</s:else>
	<td width ="12"><span id="admContactNameVld "/></td>			
	
	<s:if test ="%{ userRoleType != 1}">
		<td>
			<s:checkbox id="useProvisioningCheckbox" key="lbasCompany.useProvisioning"/>&nbsp;
			<lm name="companyList.useProvisioning"/>
		</td>
	</s:if>
	<s:else>
		<td>&nbsp;</td>
	</s:else>
	
</tr>
<tr>
	<td><lm name="companyList.ContactSurName"/></td>
	<s:if test ="%{ method == 0}">
		<td><s:textfield id="admContactSurname" name="lbasCompany.contactSurname" cssClass="vldRequired vldMaxLength50"/></td>
	</s:if>
	<s:else>
		<td><s:textfield id="admContactSurname" name="lbasCompany.contactSurname" cssClass="vldRequired vldMaxLength50" readonly="true"/></td>	
	</s:else>
	<td width ="12"><span id="admContactSurameVld "/></td>			
	
	<s:if test ="%{ userRoleType != 1}">
		<td>
			<lm name="companyList.AdminUserSessionTimeout"/>&nbsp;
			<s:select id="adminUserSessionTimeout" name="lbasCompany.adminUserSessionTimeout"  list="adminUserSessionTimeoutList" />					
		</td>
	</s:if>
	<s:else>
		<td>&nbsp;</td>
	</s:else>
	
</tr>
<tr>
	<td><lm name="companyList.ContactEmail"/></td>
	<s:if test ="%{ method == 0}">
		<td><s:textfield id="admContactEmail" name="lbasCompany.contactEmail" cssClass="vldRequired vldEmail vldMaxLength50"/></td>
	</s:if>
	<s:else>
		<td><s:textfield id="admContactEmail" name="lbasCompany.contactEmail" cssClass="vldRequired vldEmail vldMaxLength50" readonly="true"/></td>
	</s:else>
	<td width ="12"><span id="admContactEmailVld"/></td>
	
	<s:if test ="%{ userRoleType != 1}">
		<td>
			<lm name="companyList.StandardUserSessionTimeout"/>&nbsp;
			<s:select id="standardUserSessionTimeout" name="lbasCompany.standardUserSessionTimeout"  list="standardUserSessionTimeoutList" />					
		</td>
	</s:if>
	<s:else>
		<td>&nbsp;</td>
	</s:else>
	
</tr>
<tr>
	<td><lm name="companyList.Address"/></td>
	<td><s:textfield id="admCompanyAddress" name="lbasCompany.address" cssClass="vldRequired vldMaxLength250"/></td>
	<td width ="12"><span id="admCompanyAddressVld"/></td>
	
	<s:if test ="%{ userRoleType != 1}">
		<td><lm name="companyList.PrivacyManagement"/></td>
	</s:if>
	<s:else>
		<td>&nbsp;</td>
	</s:else>
	
</tr>
<tr>
	<td><lm name="companyList.City"/></td>
	<td><s:textfield id="admCompanyCity" name="lbasCompany.city" cssClass="vldRequired vldMaxLength50"/></td> 
	<td width ="12"><span id="admCompanyCityVld"/></td>
	
	<s:if test ="%{ userRoleType != 1}">
		<td><s:if test ="%{ method == 0}">
				<s:if test ="%{ opcoAssetEnabled == true}">
					<s:radio name="lbasCompany.privacyType" list="privacyList" listKey="key" listValue="value" onclick="privacyTypeSelected(this.value);" ></s:radio>
				</s:if>
				<s:else>
					<s:radio name="lbasCompany.privacyType" list="privacyList" listKey="key" listValue="value"  ></s:radio>
				</s:else>
			</s:if>	
			<s:else>
				<s:radio name="lbasCompany.privacyType" list="privacyList" listKey="key" listValue="value" disabled="true"></s:radio>
			</s:else>		
		</td>
	</s:if>
	<s:else>
		<td>&nbsp;</td>
	</s:else>
	
</tr>

<s:if test ="%{ userRoleType != 1}">
	<tr>
		<td><lm name="companyList.ExpiryDate"/></td>	
		<td>
			<input id="expiryDateDatePickerStart" name="expiryDateStr" readOnly="true"/>
		</td>
		<td width ="12"></td>
		<td>	
			<span id="userAssetEnableCheckboxes" cssClass="lbasDisabledText">
				<s:if test ="%{ method == 0}">
					<s:checkbox id="userEnableCheckbox" key="lbasCompany.userEnable"  disabled="true"  checked="checked"/><lm name="companyList.enableUsers"/>
					<s:if test ="%{ opcoAssetEnabled == true}">
						<s:checkbox id="assetEnableCheckbox" key="lbasCompany.assetEnable"/><lm name="companyList.enableAssets"/>
					</s:if>
					<s:else>	
						<s:checkbox id="assetEnableCheckbox" key="lbasCompany.assetEnable" disabled="true"/><lm name="companyList.enableAssets"/>
					</s:else>		
				</s:if>
				<s:else>
					<s:checkbox id="userEnableCheckbox" key="lbasCompany.userEnable" disabled="true"  /><lm name="companyList.enableUsers"/>
					<s:checkbox id="assetEnableCheckbox" key="lbasCompany.assetEnable" disabled="true"/><lm name="companyList.enableAssets"/>
				</s:else>	
			</span>	
		</td>
	</tr>
	
	<tr>
		<td><lm name="companyList.MaxUsers"/></td>
		<td><s:textfield id="admMaxUsers" name="lbasCompany.maxUsers" cssClass="vldMaxLength5 vldNumeric"/></td>
		<td width ="12"><span id="admMaxUsersVld"/></td>
		<td>
			<s:if test ="%{ method == 1 }">
					<a id="renewPasswordLink" href="javascript:void(0);" onclick="popupRenewPasswordDialog($.i18n.prop('confirmation.resetAdminpassword'));" 
			             class="changestyle" style="color:#0077B7"><lm name='userEdit.Password'/></a>
			</s:if>	
		</td>	
	</tr>
	<tr>
	    <td><lm name="user.lang"></lm></td>
	    <td><s:select id="langListId" name="lbasCompany.language" list="langList" listKey="key" listValue="value" /></td>
		<td></td>
		<td>
			<s:if test ="%{ method == 1 }">
					<lm name="companyList.History"/>&nbsp;
					<a id="viewHistoryDialogLink" href="javascript:void(0);" onclick="popupViewHistoryDialog();" 
				             class="changestyle" style="color:#0077B7"><lm name='companyList.ViewHistory'/></a>
			</s:if>	
		</td>		
	</tr>
	<tr>
	     <td><lm name="companyList.BAN"></lm></td>
	     <td>
			<table id="companyBans" cellspacing="4">
				<s:iterator value="lbasCompanyBans">
				<tr id="companyBan<s:property value="ban"/>" class="banTd">
					<td><s:property value="ban"/></td>
					<td><a href="javascript:void(0);" onclick="removeCompanyBan('<s:property value="ban"/>','<s:property value='lbasCompany.id'/>');" class="changestyle" style="color:#0077B7"><lm name='buttons.delete'/></a></td>
					<td><b><lm name="companyList.DoC.acronym"/></b></td>
					<s:if test ="%{ status == 1}">
					<td><b id="companyBanState"><lm name='companyList.Doc.enabled'/></b></td>
					</s:if>
					<s:if test ="%{ status == 0}">
					<td><b id="companyBanState"><lm name='companyList.Doc.disabled'/></b></td>
					</s:if>
					<td>
						<a id="addNewCompanyBanId" href="javascript:void(0);" onclick="addNewCompanyBan('<s:property value='lbasCompany.id'/>','<s:property value="ban"/>','<s:property value="status"/>');" class="changestyle" style="color:#0077B7">
							<b><lm name='buttons.edit'/></b>
						</a>
					</td>
				</tr>
				</s:iterator>
			</table>	
		</td>
		<td></td>
		<td></td>
	</tr>
	
	<tr>
		<td></td>
		<td>
			<a href="javascript:void(0);" onclick="addNewCompanyBan('<s:property value='lbasCompany.id'/>','','0');" class="changestyle" style="color:#0077B7"><lm name='buttons.add'/></a>
		</td>
	</tr>
	
	<tr>
		<s:if test ="%{ method == 1 }">
		   <td align="right" colspan="7">   
			   <s:a href="javascript:void(0);"  style="color: #FFFFFF;text-decoration:none" cssClass="textBtnRed"  
			        onclick="AjxUpdateCompany();" >                          	                          
				       <span class="btnSpan"><lm name="buttons.update"/></span>                     	
			   </s:a>
			</td>
		</s:if>
		<s:if test ="%{ method == 0}">
			   <td align="right" colspan="7">   
			   <s:a href="javascript:void(0);"  style="color: #FFFFFF;text-decoration:none" cssClass="textBtnRed"  
			        onclick="AjxAddCompany();" >                          	                          
				       <span class="btnSpan"><lm name="buttons.create"/></span>                     	
			   </s:a>
			</td>
		</s:if>
	</tr>
</s:if>
</table>

<s:if test ="%{ method == 1 }">
	<div><a id="showHideCDFBtn" href="javascript:void(0);"></a></div>
</s:if>

<div id="cdfViewDiv" />

<s:if test ="%{ method == 1 && userRoleType == 1}">

	<table>
		<tr>
			<table>
				<tr>
					<td><lm name="companyList.ageOfLocation"/></td>
					<td width="15px"></td>
					<td><s:radio name="lbasCompany.ageOfLocationType" list="ageOfLocationTypeList" listKey="key" listValue="value"  onchange="ageOfLocationTypeChanged(this.value);"></s:radio></td>		
					<td width="15px"></td>
					<td><s:select id="ageofLocationValueList" list="ageofLocationValueList" name="lbasCompany.ageOfLocationValue"/></td>		
					<td width="15px"></td>	
				</tr>
				<tr><td colspan="6">&nbsp;</td></tr>
				<tr>
					<td><lm name="companyList.allowedIP"/></td>
					<td colspan="4" align="left"><s:textfield id="admCompanyAllowedIp" name="lbasCompany.allowedIP" cssClass="vldRequired vldMaxLength150"/></td> 
					<td width ="15px"><span id="admCompanyAllowedIpVld"/></td>
				</tr>
			</table>
		</tr>
		
		<tr><br></br></tr>
		<tr>
			<td>
				<table>
					<tr><lm name="companyList.businessHours"/></tr>	
					
					<s:iterator status="businessHoursDayList" value="{0,1,2,3,4,5,6}" >
			        <tr>			        
						<td>
							<s:checkbox id ="companyCheck%{#businessHoursDayList.index}" name="companyCheck%{#businessHoursDayList.index}" onclick="this.value=this.checked; businessHourSelected(this.value, this.id, 'company');"/>
							<s:label id="companyBusinessHour%{#businessHoursDayList.index}"></s:label>
						</td>
						<td width="20"></td>
						<td>
							<s:select id="companyFromHour%{#businessHoursDayList.index}" value="" list="hourList" style="display:none"/>
						</td>
						<td>
							<s:select id="companyFromMinute%{#businessHoursDayList.index}" value="" list="minList" style="display:none"/>
						</td>
						<td width="20"></td>
						<td>
							<s:label id="companyTo%{#businessHoursDayList.index}" style="display:none"></s:label>
						</td>
						<td width="20"></td>
						<td>
							<s:select id="companyToHour%{#businessHoursDayList.index}" value="" list="hourList" style="display:none"/>
						</td>
						<td>
							<s:select id="companyToMinute%{#businessHoursDayList.index}" value="" list="minList" style="display:none"/>			                     
						</td>
			        </tr>
			       </s:iterator>
	        	</table>
	        </td>	        			
		</tr>
		
		<tr>
			<td align="right">
			   <s:a href="javascript:void(0);"  style="color: #FFFFFF;text-decoration:none" cssClass="textBtnRed"  
			        onclick="if (lbasValidate('updateCompany')) updateCompanyDetailInfo();">                          	                          
				       <span class="btnSpan"><lm name="buttons.update"/></span>                     	
			   </s:a>
			</td>
		</tr>
	</table>

</s:if>

<s:if test ="%{ method == 1 }">
	<input type="hidden" id="cdfMethod" name="cdfMethod">
	<input type="hidden" id="cdfId" name="cdfId" >
	<input type="hidden" id="cdfName" name="cdfName">
	<input type="hidden" id="cdfDesc" name="cdfDesc">
	<s:set name="cdfCount" value="%{0}"/>
	<s:iterator value="cdfList" status="cdfListStatus">
		<s:set name="cdfCount" value="%{#cdfListStatus.count}"/>
	</s:iterator>
</s:if>

</s:form>

<div id="cdfDiv" style="display: none;">
	
	<s:if test ="%{ method == 1 }">
		<table id="cdfMainTable" class="cdfTable">
			<tr>
				<td width="255"><b><lm name="company.label.cdfHeader"></lm></b></td>
				<td width="255"><b><lm name="company.label.cdfDesc"></lm></b></td>
				<td>&nbsp;</td>
			</tr>
			
			<tr>
				<td colspan="3">	
					<s:iterator value="cdfList" status="cdfListStatus">
						<script language="javascript">registerValidations('cdfForm_<s:property value='companyId'/>_<s:property value='id'/>');</script>
						<s:form id="cdfForm_%{companyId}_%{id}">
							<table id="cdfTable_%{companyId}_%{id}">
								<tr>
									<td><s:textfield name="name" id="cdfN_%{companyId}_%{id}" maxLength="50" cssClass="vldRequired vldMaxLength50" title ="<lm name='tip.company.cdf'></lm>"/></td>
									<td width ="12"><span id="cdfN_<s:property value='companyId'/>_<s:property value='id'/>Vld"/></td>
									<td><s:textfield name="desc" id="cdfD_%{companyId}_%{id}" maxLength="100" cssClass="vldRequired vldMaxLength100" /></td>
									<td width ="12"><span id="cdfD_<s:property value='companyId'/>_<s:property value='id'/>Vld"/></td>
									<td width="46"><a href="javascript:void(0);" onclick="if (lbasValidate('cdfForm_<s:property value='companyId'/>_<s:property value='id'/>')) crudCDF('update', <s:property value='id'/>, $('#cdfN_<s:property value='companyId'/>_<s:property value='id'/>').val(), $('#cdfD_<s:property value='companyId'/>_<s:property value='id'/>').val());" class="changestyle" style="color:#0077B7"><lm name='buttons.update'/></a></td>
									<td width="46"><a href="javascript:void(0);" onclick="crudCDF('remove', <s:property value='id'/>, $('#cdfN_<s:property value='companyId'/>_<s:property value='id'/>').val(), $('#cdfD_<s:property value='companyId'/>_<s:property value='id'/>').val());" class="changestyle" style="color:#0077B7"><lm name='buttons.delete'/></a></td>
								</tr>
							</table>
						</s:form>
					</s:iterator>
				</td>
			</tr>
					
			<s:if test="%{#cdfCount + 1 <= 10}">
				<tr>
					<td colspan="3">
						<script language="javascript">registerValidations('cdfFormNew');</script>
						<s:form id="cdfFormNew">
							<table id="cdfTableNew">
								<tr>
									<td><s:textfield id="cdfN_%{lbasCompany.id}_0" maxLength="50" cssClass="vldRequired vldMaxLength50" /></td>
									<td width ="12"><span id="cdfN_<s:property value='lbasCompany.id'/>_0Vld"/></td>
									<td><s:textfield id="cdfD_%{lbasCompany.id}_0" maxLength="100" cssClass="vldRequired vldMaxLength100" /></td>
									<td width ="12"><span id="cdfD_<s:property value='lbasCompany.id'/>_0Vld"/></td>
									<td><a href="javascript:void(0);" onclick="if (lbasValidate('cdfFormNew')) crudCDF('add', '0', $('#cdfN_<s:property value='lbasCompany.id'/>_0').val(), $('#cdfD_<s:property value='lbasCompany.id'/>_0').val());" class="changestyle" style="color:#0077B7"><lm name='buttons.addNew'/></a></td>
									<td>&nbsp;</td>
								</tr>
							</table>
						</s:form>
					</td>
				</tr>
			</s:if>
			
		</table>
	</s:if>
	
</div>

</div>