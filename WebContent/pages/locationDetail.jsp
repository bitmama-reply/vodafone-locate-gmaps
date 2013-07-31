<%@page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" %>
<%@taglib uri="/struts-tags" prefix="s" %>

<script language="javascript">
	initializeLbasMessages() ;
	var changeIconText = $.i18n.prop('buttons.changeicon');
	$('#updateLocationDetail_poi_iconName').attr('title', changeIconText);
</script>
<s:form action="updateLocationDetail" theme="simple"   >
<table>
<s:hidden name="poi.iconId" id="poiIconId"/>
<s:hidden name="poi.id" />
<s:hidden name="poi.type" />
<s:hidden name="poi.latitude" />
<s:hidden name="poi.longitude" />

<s:if test ="%{ poi.categories.length > 0 }" >
<s:hidden name="poiFirstCategory" value=" %{poi.categories[0] }" />
</s:if>



<tr>
	<td><s:label cssClass="labelStyle"><lm name="poi.name"/></s:label></td>
	<td><s:textfield  id="editPoiName" cssClass="lbasInputText vldRequired vldMaxLength50" name ="poi.name"  tabindex="1" /></td>
	<td width ="22"><span id="editPoiNameVld"/></td>
	<s:if test ="%{ updateShow == 1 }" >
		<td><s:label cssClass="labelStyle" ><lm name="poi.id"/></s:label></td>  
		<td colspan ="4" ><s:property value = "poi.id" /></td>
	</s:if>
</tr>
<tr>
	<td><s:label cssClass="labelStyle" ><lm name="poi.street"/></s:label></td>
	<td><s:textfield id ="editPoiStreet" cssClass="lbasInputText vldMaxLength100" name ="poi.street" tabindex="4"/></td>
	<td width ="22"><span id="editPoiStreetVld"/></td>		
	<td><s:label cssClass="labelStyle"><lm name="poi.latitude"/></s:label></td>
	<td><span id="poiDetailLatitude"><s:property value ="poi.latitude"  /></span></td>
	<td><s:label cssClass="labelStyle"><lm name="poi.longitude"/></s:label></td>
	<td colspan="2"><span id="poiDetailLongitude"><s:property value ="poi.longitude"  /></span></td>
</tr>
<tr>	
	<td><s:label cssClass="labelStyle"><lm name="poi.houseNo"/></s:label></td>
	<td><s:textfield id ="editPoiHouseno" cssClass="lbasInputText vldMaxLength10" name ="poi.houseNo" tabindex="5"/></td>	
	<td width ="22"><span id="editPoiHousenoVld"/></td>		
	<td><s:label  cssClass="labelStyle" ><lm name="poi.email"/></s:label></td>
	<td colspan ="3" ><s:textfield id ="editPoiEmail" cssClass="lbasInputText vldEmail vldMaxLength200" name ="poi.email"  tabindex="12" /></td>
	<td width ="22"><span id="editPoiEmailVld"/></td>
</tr>
<tr>
	<td><s:label  cssClass="labelStyle" ><lm name="poi.city"/></s:label></td>
	<td><s:textfield id ="editPoiCity" cssClass="lbasInputText vldMaxLength20" name ="poi.city"  tabindex="3" /></td>
	<td width ="22"><span id="editPoiCityVld"/></td>	
	<td><s:label cssClass="labelStyle" ><lm name="poi.website"/></s:label></td>
	<td colspan ="3" ><s:textfield id="editPoiWebsite" cssClass="lbasInputText vldMaxLength200" name ="poi.website" tabindex="13" /></td>
	<td width ="22"><span id="editPoiWebsiteVld"/></td>
</tr>
<tr>	
	<td><s:label cssClass="labelStyle"><lm name="poi.country"/></s:label></td>
	<td><s:textfield id="editPoiCountry" cssClass="lbasInputText vldMaxLength20" name ="poi.country" tabindex="2" /></td>
	<td width ="22"><span id="editPoiCountryVld"/></td>
	<td><s:label  cssClass="labelStyle" ><lm name="poi.openHours"/>&nbsp;<lm name="poi.from"/></s:label></td>
	<td><s:select    name="openFromHour"  value ="poi.openFrom.substring(0,2)"    list="hourList" style="width:40px" tabindex="14"/>	
		<s:select    name="openFromMin"  value ="poi.openFrom.substring(3,5)" list="minList" style="width:40px" tabindex="15"/></td>
	<td><s:label  cssClass="labelStyle"><lm name="poi.to"/></s:label></td>
	<td><s:select    name="openToHour" value ="poi.openTo.substring(0,2)"   list="hourList" style="width:40px" tabindex="16"/>	
		<s:select    name="openToMin"  value ="poi.openTo.substring(3,5)" list="minList" style="width:40px" tabindex="17"/>	</td>
	<td width ="22"></td>		
</tr>
<tr>
	<td><s:label  cssClass="labelStyle"><lm name="poi.postcode"/></s:label></td>
	<td><s:textfield id="editPoiPostcode" cssClass="lbasInputText vldMaxLength16"  name ="poi.postcode" tabindex="6"/></td>
	<td width ="22"><span id ="editPoiPostcodeVld"/></td>
	<td colspan ="5"><s:label cssClass="labelStyle"><lm name="poi.shortDescription"/></s:label></td>
</tr>
<tr>
	<td><s:label cssClass="labelStyle" ><lm name="poi.address"/></s:label></td>
	<td><s:textfield id = "editPoiAddress" cssClass="lbasInputText vldMaxLength200" name ="poi.address" tabindex="7"/></td>
	<td width ="22"><span id ="editPoiAddressVld"/></td>
	<td colspan ="4"><s:textarea id="editPoiShortDesc" cssClass="lbasTextAreaSmall vldMaxLength200"  name ="poi.shortDescription"  cols="4" tabindex="18"/></td>
	<td width ="22"><span id ="editPoiShortDescVld"/></td>
</tr>
<tr>
	<td><s:label  cssClass="labelStyle" ><lm name="poi.phone"/></s:label></td>
	<td><s:textfield id = "editPoiPhone" cssClass="lbasInputText vldMaxLength20 vldPoiPhone" name ="poi.phone" tabindex="8"/></td>
	<td width ="22"><span id ="editPoiPhoneVld"/></td>
	<td colspan ="5"><s:label cssClass="labelStyle"><lm name="poi.longDescription"/></s:label></td>
</tr>
<tr>
	<td><s:label cssClass="labelStyle"><lm name="poi.fax"/></s:label></td>
	<td><s:textfield id ="editPoiFax" cssClass="lbasInputText vldMaxLength16 vldFax" name ="poi.fax" tabindex="9"/></td>
	<td width ="22"><span id ="editPoiFaxVld"/></td>
	<td colspan ="4" rowspan="3"><s:textarea id ="editPoiLongDesc" cssClass="lbasTextArea vldMaxLength1255" name ="poi.longDescription"  cols="4" tabindex="19"/></td>
	<td width ="22"><span id ="editPoiLongDescVld"/></td>
</tr>
<tr>
	<td><s:label cssClass="labelStyle"><lm name="poi.image"/></s:label></td>
	<td>
	<s:if test="%{icon == null}">
	<img id="updateLocationDetail_poi_iconName" title="" onclick="openSelectIconDialog(null,'poi','poi.iconName');"name="poi.iconName" src="<s:url value='/images/cat_vf_uncategorized.png'/>"/>
	</s:if>
	<s:if test="%{icon.scaledImageExists == false}">
	<img id="updateLocationDetail_poi_iconName" title="" onclick="openSelectIconDialog(null,'poi','poi.iconName');"name="poi.iconName" src="<s:url value='/images/%{poi.iconName}'/>" />
	</s:if>
	<s:if test="%{icon.scaledImageExists == true}">
	<img id="updateLocationDetail_poi_iconName" title="" onclick="openSelectIconDialog(null,'poi','poi.iconName');"name="poi.iconName" src="<s:url action="showImage"><s:param name="imageId" value="%{poi.iconId}"></s:param></s:url>" />
	</s:if>		
	</td>
	<td width ="22">&nbsp;</td>
</tr>
<tr>
	<td width ="22">&nbsp;</td>
	<td height="25" style="vertical-align: top;">
		<a href="javascript:void(0);" class="textBtnGrey" style="color: #FFFFFF;"
onclick="openUploadFileDialog('image','location');"><span class="btnSpan"><lm name="buttons.uploadIcon"/></span></a>
	</td>
</tr>
<tr>
	<td><s:label cssClass="labelStyle"><lm name="poi.language"/></s:label></td>
	<td><s:textfield id = "editPoiLanguage" cssClass="lbasInputText vldMaxLength50 " key ="poi.language" tabindex="11" /></td>
	<td width ="22"><span id ="editPoiLanguageVld"/></td>
</tr>
<tr>
	<td><s:checkbox id="editPoiRadiusCheckbox" name="editPoiRadiusCheckbox" onclick="this.value=this.checked; radiusForPoiChecked(this.value);"/>
	<s:label cssClass="labelStyle"><lm name="poi.radius"/></s:label></td>
	<td><s:textfield id ="editPoiRadius" cssClass="lbasInputText vldIntMax5" key ="poi.radius" name ="poi.radius" tabindex="12" style="display:none"/></td>
	<td width ="22"><span id ="editPoiRadiusVld"/></td>
</tr>

</table>
</s:form>
<div id ="iconsDiv"/>
<script>
	registerValidations("updateLocationDetail");
</script>
