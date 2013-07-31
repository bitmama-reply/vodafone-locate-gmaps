<%@ include file="../common/taglibs.jsp"%>

<script type="text/javascript">
var adminGroupTabActions = new Array();
var columnStateText;
$("#adminGroupListSelectBox option").each(function() {
	var newelement = new actionElement(this.value, this.text);
	adminGroupTabActions.push(newelement);
});

clickedOnGroupCheckBox();

initializeLbasMessages() ;

		$(function(){
			$('.pagelinks a').each(function (i) {
                 var dfd=$(this).attr('href');
                 var params=dfd.split('?');
                 this.href='javascript:void($(\'#groupList\').load(\'listgroups?'+params[1]+'\'));';
			}); 
			
			$('.sortable a').each(function (i) {
                var dfd=$(this).attr('href');
                var params2=dfd.split('?');
                this.href='javascript:void($(\'#groupList\').load(\'listgroups?'+params2[1]+'\'));';
			}); 

			/**$('.deleteCategory img').each(function (i) {

				
				if(this.parentNode.parentNode.parentNode.id==2){
					$(this).attr('style','display:none');
				}

			}); **/

             $('.groupState').each(function (i) {
                 
				if($(this).html()=='0'){
					$(this).html('passive');
				}else if($(this).html()=='1'){
					$(this).html('active');
				}

			}); 

			//for ie6,ie7
			var resultSize=$('.pagebanner',$('#groupListContent')).html().split(' ')[0];
			var groupName=$.i18n.prop('groupList.Group');
  			$('.pagebanner',$('#groupListContent')).html($.i18n.prop('general.displaytag.pagebanner', [resultSize,groupName,groupName]));
  			
		});

</script>

<% 
        request.setAttribute("dyndecorator", new org.displaytag.decorator.TableDecorator()
        {
            public String addRowId()
            {
                return ""+evaluate("id");
            }
        });

%>

<div id="groupListContent">

<div id="searchArea" class="modBorder" style="height: 34px">	
			<table  cellpadding="3" cellspacing="3" style="margin-left:2px">
				<tr>
		            <td>
		               <label><lm name="groupName.groupName"/>:</label>
		            </td>
					<td width="50" align="left">
					<input type="text" id="groupSearchInput"   
						value="<s:property value='searchText'/>" size="10" 
						onfocus="if (this.value==$.i18n.prop('general.Search')) { this.style.color='black'; this.value=''; }"
						onblur="if (this.value=='') { this.style.color='#7E7E7E'; this.value=$.i18n.prop('general.Search'); }"
						style="color:grey;width:150px";/>
						
				    </td>
					
					<td align="right">
					  <s:a href="javascript:void(0);"  style="color: #FFFFFF;text-decoration:none" cssClass="textBtnGrey"
		                              onclick="$('#groupList').load('searchgroups.action',{searchText:$('#groupSearchInput').val()})">                          	                          
			                   <span class="btnSpan"><lm name="buttons.search"/></span>                     	
		               </s:a>
					</td>
					<td>
						<s:a href="javascript:void(0);" onclick="selectGroups();" ><lm name="message.SelectAll"/></s:a><label style="color: #0077B7">&nbsp;|&nbsp;</label>
					</td>
					<td>
						<s:a href="javascript:void(0);" onclick="deselectGroups();" ><lm name="message.SelectNone"/></s:a><label style="color: #0077B7">&nbsp;|&nbsp;</label>
					</td>
					
				</tr>
			</table>
	</div>

  <display:table name="lbasGroups" class="list"  requestURI="/listgroups" id="lbasGroupList" export="false" pagesize="25" decorator="com.oksijen.lbas.decorator.GroupListDecorator">
 
    <display:column media="html" class="dtCheckBox">
    	<s:checkbox id="groupchbx" name="groupchbx" onclick="this.value=this.checked; clickedOnGroupCheckBox();"/> 
    </display:column>
    <display:column property="name" sortable="true" titleKey="lbasGroup.name"/>
    <display:column property="state" sortable="true" titleKey="lbasGroup.state" class="groupState"/>
    <display:column media="html" title="" property="editIcon" class="dtEditButton"></display:column>
	<display:column media="html" title="" property="deleteIcon" class="dtDeleteButton"></display:column>
    <display:setProperty name="paging.banner.item_name" value="Group"/>
    <display:setProperty name="paging.banner.items_name" value="Group"/>

<!--    <display:setProperty name="export.excel.filename"><s:text name='groupList.Group'/>.xls</display:setProperty>-->
<!--    <display:setProperty name="export.csv.filename"><s:text name='groupList.Group'/>.csv</display:setProperty>-->
<!--    <display:setProperty name="export.pdf.filename"><s:text name='groupList.Group'/>.pdf</display:setProperty>-->
<!--    <display:setProperty name="export.pdf" value="true" />-->
    
   </display:table>
   
   	<div style="" class="multiSelectAction">
		 <table  cellpadding="6" cellspacing="6" align="left" style="margin-left:0px">
			<tr>
				<td align="left">
   					<s:select id="adminGroupListSelectBox" value="" list="adminGroupActionList" listKey="key" listValue="value"/>					
   				</td>
		   	   <td>    
			      <a href="javascript:void(0);"  style="color: #FFFFFF;" class="textBtnGrey" onclick="adminGroupActionSelected($('#adminGroupListSelectBox').val()); ">		                   	                                          	                        
			           <span class="btnSpan"><lm name="buttons.apply" /></span>                     	
			      </a>
			  </td>
	         </tr>
	      </table> 
	</div>
	
</div>

