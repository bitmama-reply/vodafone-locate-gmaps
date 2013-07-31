<%@ include file="../common/taglibs.jsp"%>
<script type='text/javascript' src='js/jquery/plugins/autocomplete/jquery.autocomplete.pack-1.0.js'></script>

<script type="text/javascript">
initializeLbasMessages() ;
</script>

<div id="locSearchArea" class="modBorder" style="height: 34px">
	<form name="locSearchForm" onsubmit="return false;">
		<table cellpadding="3" cellspacing="3" style="margin-left: 2px">
			<tr>
				<td><label><lm name="locations.location" />:</label></td>
				<td width="50" align="left">
					<input type="text" onkeypress="if(event.keyCode==13){ loadAdminLocationList('',true,this.value); }" 
					name="searchInput" id="searchInput" value="Search" size="10"
					onfocus="if (this.value==$.i18n.prop('general.Search')) { this.style.color='black'; this.value=''; }"
					onblur="if (this.value=='') { this.style.color='#7E7E7E'; this.value=$.i18n.prop('general.Search'); }"
					style="color: grey; width: 150px" ;/></td>
		
				<td align="right"><s:a href="javascript:void(0);"
					style="color: #FFFFFF;text-decoration:none" cssClass="textBtnGrey"
					onclick="loadAdminLocationList('',true,document.locSearchForm.searchInput.value);">
					<span class="btnSpan"><lm name="buttons.search" /></span>
				</s:a></td>
			</tr>
		</table>
	</form>
</div>


<div id="locationListContent">
<table id="list2"></table>
<div id="pager2"></div>
</div>


   	<div id="selectBoxMulti" style="" class="multiSelectAction">
		 <table cellpadding="6" cellspacing="6" align="left" style="margin-right:5px">
			<tr>
				<td align="left">
   					<s:select id="adminLocationListSelectBox" value="" list="adminLocationActionList" listKey="key" listValue="value"/>					
   				</td>
		   	   <td>    
			      <a href="javascript:void(0);"  style="color: #FFFFFF;" class="textBtnGrey" onclick="adminLocationActionSelected($('#adminLocationListSelectBox').val()); ">		                   	                                          	                        
			           <span class="btnSpan"><lm name="buttons.apply" /></span>                     	
			      </a>
			  </td>
	         </tr>
	      </table> 
	</div>


