<%@page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@taglib uri="/struts-tags" prefix="s" %>
<script type="text/javascript">
$().ready(function () {
	var entCatOpen;
	if ($("#selectEntCategoriesCheckContainer input:checkbox:checked").length > 0) {
		$("#radioCategoryTypeId1").attr('checked',"checked");
		selectRadioCategory('1');
		entCatOpen= true;
	}

	
	if ($("#selectPersCategoriesCheckContainer input:checkbox:checked").length > 0) {
		$("#radioCategoryTypeId2").attr('checked',"checked");
		
		selectRadioCategory('2');
	}else if($("#selectEntCategoriesCheckContainer").length==0){
		selectRadioCategory('2');
	}
	
	registerValidations("selectLocationCategoryForm");
});

</script>
<s:form id="selectLocationCategoryForm" action="updateLocationCategory" theme="simple">
<s:hidden name="poiId"></s:hidden>
<s:hidden name="poiType"></s:hidden>
<s:hidden name="poiType" value="<s:property value='#session.LBAS_USER_SESSION.add_enterprise_location'/>" ></s:hidden>
<s:if test="%{(poiId != 0 && poiType==0 ) || #session.LBAS_USER_SESSION.add_enterprise_location }" >
<div  style="margin-bottom:1em;width:590px">
	<div  id="entCategoryExpandCollapse"  class="modHeader blueBG" >
	<h2><input type="radio" name="radioCategoryTypeName" value="1" id="radioCategoryTypeId1" onclick="selectRadioCategory('1');" />
	<lm name="category.enterprise" /></h2>								
	</div>
	<div id="selectEntCategoryDiv" style="width:500px">	
	<table width="100%">
	<tr><td colspan="2">
	<lm name="location.categories.selectCategory"/>
	</td></tr>
	
	<tr >
	<td id="selectEntCategoriesCheckContainer"  colspan="2">	
	<s:if test="enterpriseCategoryList.size()>0" >
		<s:iterator value="enterpriseCategoryList">			  	 
		<s:set name="id" value="id"/>					  	 			  
		<s:if test="top.iconName == '-1' ">
			<s:if test="top.credentials.addPOI">
		    	<span class="catgfield"><s:checkbox  name="categoryIDs" fieldValue="%{#id}"   checked="checked"/>
		    	<s:property value='name'/></span>			
		    </s:if>
		</s:if>
		<s:if test="top.iconName != '-1' ">			
			<s:if test="top.credentials.addPOI">
		   		<span class="catgfield"><s:checkbox  name="categoryIDs" fieldValue="%{#id}"  />
		   		<s:property value='name'/></span>			
		    </s:if>
		 
		</s:if>  
	    
		</s:iterator> 
	</s:if>
	</td>
	</tr>
	<s:if test="%{ #session.LBAS_USER_SESSION.create_enterprise_categories}" >
		<tr id ="newEntCategoryCreationLink">
		<td colspan="2"><span onclick="$('#newEntCategoryCreationRow').show(); $('#newEntCategoryCreationLink').hide();"   class="simpleLinkNotSelected" style="color:#0077B7;"><lm name="location.categories.createNewCategory"/></span></td>
		</tr>		
		<tr id ="newEntCategoryCreationRow" style="display:none;">
		<td colspan="2" align="left">	
		<table>
		<tr >
		<td colspan="4"><lm name="location.categories.createNewCategory"/>:</td>
		</tr>	 		
		<tr >
		<td><s:textfield id ="poiCategoryNewEntCategoryName" cssClass="lbasInputText"  maxlength="50" style="position:relative;top:4px;"/></td>
		<td width ="22"><span id = "poiCategoryNewEntCategoryNameVld" style="position:relative;top:4px;"/></td>
		<td>
			<s:a href="javascript:void(0);"  style="color: #FFFFFF;" cssClass="textBtnRed" onclick="if (lbasValidate('selectLocationCategoryForm')) InsertNewCategory(0);" >                          	                          
	     		<span class="btnSpan"><lm name="buttons.create"/></span>                     	
			</s:a>&nbsp;
			<s:a href="javascript:void(0);"  style="color: #FFFFFF;" cssClass="textBtnGrey" onclick="$('#newEntCategoryCreationRow').hide(); $('#newEntCategoryCreationLink').show();" >                          	                          
	     		<span class="btnSpan"><lm name="buttons.cancel"/></span>                     	
			</s:a>
		</td>	
		</tr>	
		</table>
		</td></tr>
	</s:if>
	
	</table>
	</div>	
</div>							
</s:if>
<div  style="margin-bottom:1em;width:590px">
	<div  id="persCategoryExpandCollapse"  class="modHeader blueBG" >
		<h2><s:if test="%{(poiId!=0  && poiType==0 )  || #session.LBAS_USER_SESSION.add_enterprise_location}" >
		<input type="radio" name="radioCategoryTypeName" value="2" id="radioCategoryTypeId2" onclick="selectRadioCategory('2');" />
		</s:if>
		<lm name="category.personal" /></h2>																			
	</div>
	<div id="selectPersCategoryDiv" style="width:500px">	
	<table width="100%">
	<tr><td colspan="2">
	<lm name="location.categories.selectCategory"/>
	</td></tr>
	
	<tr >
	<td id="selectPersCategoriesCheckContainer"  colspan="2">	
	<s:if test="personalCategoryList.size() > 0" >
		<s:iterator value="personalCategoryList">			  	 
		<s:set name="id" value="id"/>					  	 			  
		<s:if test="top.iconName == '-1' ">
		    <span class="catgfield"><s:checkbox  name="categoryIDs" fieldValue="%{#id}"   checked="checked"/>
		    <s:property value='name'/></span>
		</s:if>
		<s:if test="top.iconName != '-1' ">
		  <span class="catgfield"> <s:checkbox  name="categoryIDs" fieldValue="%{#id}"  />
		   <s:property value='name'/>	</span>
		</s:if>  
	    		
		</s:iterator> 
	</s:if>
	</td>
	</tr>
	<tr id ="newPersCategoryCreationLink">
	<td colspan="2"><span onclick="$('#newPersCategoryCreationRow').show(); $('#newPersCategoryCreationLink').hide();"   class="simpleLinkNotSelected" style="color:#0077B7;"><lm name="location.categories.createNewCategory"/></span></td>
	</tr>	
	<tr id ="newPersCategoryCreationRow" style="display:none;">
	<td colspan="2" align="left">	
	<table>
	<tr >
	<td colspan="4"><lm name="location.categories.createNewCategory"/>:</td>
	</tr>	 		
	<tr >
	<td><s:textfield id ="poiCategoryNewPersCategoryName" cssClass="lbasInputText"  maxlength="50" style="position:relative;top:4px;"/></td>
	<td width ="22"><span id = "poiCategoryNewPersCategoryNameVld" style="position:relative;top:4px;"/></td>
	<td>
		<s:a href="javascript:void(0);"  style="color: #FFFFFF;" cssClass="textBtnRed" onclick="if (lbasValidate('selectLocationCategoryForm')) InsertNewCategory(1);" >                          	                          
     		<span class="btnSpan"><lm name="buttons.create"/></span>                     	
		</s:a>&nbsp;
		<s:a href="javascript:void(0);"  style="color: #FFFFFF;" cssClass="textBtnGrey" onclick="$('#newPersCategoryCreationRow').hide(); $('#newPersCategoryCreationLink').show();" >                          	                          
     		<span class="btnSpan"><lm name="buttons.cancel"/></span>                     	
		</s:a>
	</td>	
	</tr>	
	</table>
	</td></tr>
	
	</table>
	</div>	
</div>	
</s:form>

			

