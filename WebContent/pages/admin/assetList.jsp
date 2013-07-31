<%@ include file="../common/taglibs.jsp"%>
<script type="text/javascript" src="../js/jquery/js/jquery-ui-1.8.11.custom.min.js"></script>
<script type="text/javascript">

	var adminAssetsTabActions = new Array();
	var columnStateText;
	$("#adminAssetListSelectBox option").each(function() {
		var newelement = new actionElement(this.value, this.text);
		adminAssetsTabActions.push(newelement);
	});
	clickedOnAssetCheckBox();

	initializeLbasMessages() ;

	$("#lbasAssetList th").each(function() {
		if ($.browser.msie)
			columnStateText = $(this).text();
		else
			columnStateText = $(this).text().trim();

		if(columnStateText == 'Name'){
			$(this).text($.i18n.prop('assetEdit.name'));
		}
		if(columnStateText == 'IdentificationNumber'){
			$(this).text($.i18n.prop('assetEdit.identificationNumber'));
		}		
	    if(columnStateText == 'Surname'){
	        $(this).text($.i18n.prop('assetEdit.model'));
	    }
	    if(columnStateText == 'AllocatedToFullName'){
	        $(this).text($.i18n.prop('assetEdit.allocatedTo'));
	    }
	    if(columnStateText == 'GroupName'){
	        $(this).text($.i18n.prop('assetEdit.group'));
	    }
	    if(columnStateText == 'Msisdn'){
	        $(this).text($.i18n.prop('assetEdit.msisdn'));
	    }
	    if(columnStateText == 'AssetActiveText'){
	        $(this).text($.i18n.prop('assetEdit.state'));
	    }
	});
	
	
		$(function(){
			$('.pagelinks a').each(function (i) {
                 var dfd=$(this).attr('href');
                 var params=dfd.split('?');
                 this.href='javascript:void($(\'#assetList\').load(\'listAssets?'+params[1]+'\'));';
			}); 
			
			$('.sortable a').each(function (i) {
                var dfd=$(this).attr('href');
                var params2=dfd.split('?');
                this.href='javascript:void($(\'#assetList\').load(\'listAssets?'+params2[1]+'\'));';
			}); 

			//for ie6,ie7
			var resultSize=$('.pagebanner',$('#assetListContent')).html().split(' ')[0];
			var userName=$.i18n.prop('userList.User');
  			$('.pagebanner',$('#assetListContent')).html($.i18n.prop('general.displaytag.pagebanner', [resultSize,userName,userName]));

		});	

</script>
		
<% 
        request.setAttribute("dyndecorator", new org.displaytag.decorator.TableDecorator()
        {
            public String addRowId()
            {
                return ""+evaluate("user_id");
            }

        });
%>
		
		
<div id="assetListContent">

	<div id="assetSearchArea" class="modBorder" style="height: 34px">	
			<table  cellpadding="3" cellspacing="3" style="margin-left:2px">
				<tr>
		           <td width="50" align="left">
					<input type="text" id="assetSearchInput"   
						value="<s:property value='searchText'/>" size="10" 
						onfocus="if (this.value==$.i18n.prop('general.Search')) { this.style.color='black'; this.value=''; }"
						onblur="if (this.value=='') { this.style.color='#7E7E7E'; this.value=$.i18n.prop('general.Search'); }"
						style="color:grey;width:150px";/>
						
				    </td>
					
					<td align="right">
					  <s:a href="javascript:void(0);"  style="color: #FFFFFF;text-decoration:none" cssClass="textBtnGrey"
		                              onclick="$('#assetList').load('searchAssets',{searchText:$('#assetSearchInput').val()})">                          	                          
			                   <span class="btnSpan"><lm name="buttons.search"/></span>                     	
		               </s:a>
					</td>
					<td>
						<s:a href="javascript:void(0);" onclick="selectAllAssets();" ><lm name="message.SelectAll"/></s:a><label style="color: #0077B7">&nbsp;|&nbsp;</label>
					</td>
					<td>
						<s:a href="javascript:void(0);" onclick="deselectAssets();" ><lm name="message.SelectNone"/></s:a><label style="color: #0077B7">&nbsp;|&nbsp;</label>
					</td>
					
				</tr>
			</table>
	</div>

    <display:table name="lbasUsers" class="list" requestURI="/listAssets" id="lbasAssetList" export="true" pagesize="25" decorator="dyndecorator">
     <display:column media="html" class="dtCheckBox">
    	<s:checkbox id="assetchbx" name="assetchbx" onclick="this.value=this.checked; clickedOnAssetCheckBox();"/> 
    </display:column>
    <display:column property="name" sortable="true" titleKey="lbasUser.name"/>    
    <display:column property="surname" sortable="true" titleKey="lbasUser.surname"/>
    <display:column property="identificationNumber" sortable="true" titleKey="lbasUser.email"/>
    <display:column property="allocatedToFullName" sortable="true" titleKey="lbasUser.email"/>
    <display:column property="groupName" sortable="true" titleKey="lbasUser.email"/>
    <display:column property="msisdn" sortable="true" titleKey="lbasUser.msisdn"/>
    <display:column property="assetActiveText" sortable="true" titleKey="lbasUser.activeText"/>

    
    <display:column titleKey="buttons.edit" media="html" class="dtEditButton">
      <a href="javascript:void(0);" onclick="openEditAssetDialog($(this).parent().parent().get(0).id,1);"><img id="search" src="../images/edit.png" /></a>
    </display:column>
    
    <display:column titleKey="buttons.delete" media="html" class="dtDeleteButton">
      <a href="javascript:void(0);" onclick="adminDelete('#assetList','deleteAsset', $(this).parent().parent().get(0).id, $.i18n.prop('admin.delete.asset.confirm') );"><img id="search" src="../images/incorrectly.png" /></a>
    </display:column>
    
    <display:setProperty name="paging.banner.item_name" value="Asset"/>
    <display:setProperty name="paging.banner.items_name" value="Assets"/>

    <display:setProperty name="export.excel.filename"><s:text name='userList.User'/>.xls</display:setProperty>
    <display:setProperty name="export.csv.filename"><s:text name='userList.User'/>.csv</display:setProperty>
    <display:setProperty name="export.pdf.filename"><s:text name='userList.User'/>.pdf</display:setProperty>
    <display:setProperty name="export.xml.filename"><s:text name='userList.User'/>.xml</display:setProperty>
    <display:setProperty name="export.pdf" value="true" />
    
   </display:table>
   
   	<div id="selectBoxMulti" style="" class="multiSelectAction">
		 <table cellpadding="6" cellspacing="6" align="right" style="margin-right:5px">
			<tr>
				<td align="left">
   					<s:select id="adminAssetListSelectBox" value="" list="adminAssetActionList" listKey="key" listValue="value"/>					
   				</td>
		   	   <td>    
			      <a href="javascript:void(0);"  style="color: #FFFFFF;" class="textBtnGrey" onclick="adminAssetActionSelected($('#adminAssetListSelectBox').val()); ">		                   	                                          	                        
			           <span class="btnSpan"><lm name="buttons.apply" /></span>                     	
			      </a>
			  </td>
	         </tr>
	      </table> 
	</div>
</div>
