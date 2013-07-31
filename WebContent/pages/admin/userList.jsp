<%@ include file="../common/taglibs.jsp"%>

<script type="text/javascript">
	var adminUsersTabActions = new Array();
	var columnStateText;
	$("#adminUserListSelectBox option").each(function() {
		var newelement = new actionElement(this.value, this.text);
		adminUsersTabActions.push(newelement);
	});

	clickedOnUserCheckBox();

	initializeLbasMessages() ;

	$("#lbasUserList th").each(function() {
		if ($.browser.msie)
			columnStateText = $(this).text();
		else
			columnStateText = $(this).text().trim();

	    if(columnStateText == 'ActiveText'){
	        $(this).text($.i18n.prop('admin.userlist.column.state'));
	    }
	});
	
	
		$(function(){
			$('.pagelinks a').each(function (i) {
                 var dfd=$(this).attr('href');
                 var params=dfd.split('?');
                 this.href='javascript:void($(\'#userList\').load(\'listusers?'+params[1]+'\'));';
			}); 
			
			$('.sortable a').each(function (i) {
                var dfd=$(this).attr('href');
                var params2=dfd.split('?');
                this.href='javascript:void($(\'#userList\').load(\'listusers?'+params2[1]+'\'));';
			}); 

			//for ie6,ie7
			var resultSize=$('.pagebanner',$('#userListContent')).html().split(' ')[0];
			var userName=$.i18n.prop('userList.User');
  			$('.pagebanner',$('#userListContent')).html($.i18n.prop('general.displaytag.pagebanner', [resultSize,userName,userName]));

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
		
		
<div id="userListContent">

	<div id="searchArea" class="modBorder" style="height: 34px">	
			<table  cellpadding="3" cellspacing="3" style="margin-left:2px">
				<tr>
		            <td>
		               <label><lm name="userList.UserName"/>:</label>
		            </td>
					<td width="50" align="left">
					<input type="text" id="searchInput"   
						value="<s:property value='searchText'/>" size="10" 
						onfocus="if (this.value==$.i18n.prop('general.Search')) { this.style.color='black'; this.value=''; }"
						onblur="if (this.value=='') { this.style.color='#7E7E7E'; this.value=$.i18n.prop('general.Search'); }"
						style="color:grey;width:150px";/>
						
				    </td>
					
					<td align="right">
					  <s:a href="javascript:void(0);"  style="color: #FFFFFF;text-decoration:none" cssClass="textBtnGrey"
		                              onclick="$('#userList').load('searchusers.action',{searchText:$('#searchInput').val()})">                          	                          
			                   <span class="btnSpan"><lm name="buttons.search"/></span>                     	
		               </s:a>
					</td>
					<td>
						<s:a href="javascript:void(0);" onclick="selectAllUsers();" ><lm name="message.SelectAll"/></s:a><label style="color: #0077B7">&nbsp;|&nbsp;</label>
					</td>
					<td>
						<s:a href="javascript:void(0);" onclick="deselectUsers();" ><lm name="message.SelectNone"/></s:a><label style="color: #0077B7">&nbsp;|&nbsp;</label>
					</td>
					
				</tr>
			</table>
	</div>

    <display:table name="lbasUsers" class="list" requestURI="/listusers" id="lbasUserList" export="true" pagesize="25" decorator="dyndecorator">
     <display:column media="html" class="dtCheckBox">
    	<s:checkbox id="userchbx" name="userchbx" onclick="this.value=this.checked; clickedOnUserCheckBox();"/> 
    </display:column>
    <display:column property="name" sortable="true" titleKey="lbasUser.name"/>
    <display:column property="surname" sortable="true" titleKey="lbasUser.surname"/>
    <display:column property="email" sortable="true" titleKey="lbasUser.email"/>
    <display:column property="msisdn" sortable="true" titleKey="lbasUser.msisdn"/>
    <display:column property="activeText" sortable="true" titleKey="lbasUser.activeText"/>

    
    <display:column titleKey="buttons.edit" media="html" class="dtEditButton">
      <a href="javascript:void(0);" onclick="openEditUserDialog($(this).parent().parent().get(0).id,1);"><img id="search" src="../images/edit.png" /></a>
    </display:column>
    
    <display:column titleKey="buttons.delete" media="html" class="dtDeleteButton">
      <a href="javascript:void(0);" onclick="adminDelete('#userList','deleteuser', $(this).parent().parent().get(0).id, $.i18n.prop('admin.delete.user.confirm') );"><img id="search" src="../images/incorrectly.png" /></a>
    </display:column>
    
    <display:setProperty name="paging.banner.item_name" value="User"/>
    <display:setProperty name="paging.banner.items_name" value="User"/>

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
   					<s:select id="adminUserListSelectBox" value="" list="adminUserActionList" listKey="key" listValue="value"/>					
   				</td>
		   	   <td>    
			      <a href="javascript:void(0);"  style="color: #FFFFFF;" class="textBtnGrey" onclick="adminUserActionSelected($('#adminUserListSelectBox').val()); ">		                   	                                          	                        
			           <span class="btnSpan"><lm name="buttons.apply" /></span>                     	
			      </a>
			  </td>
	         </tr>
	      </table> 
	</div>
</div>
