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

	$("#listOpcoAdminUsers th").each(function() {
		if ($.browser.msie)
			columnStateText = $(this).text();
		else
			columnStateText = $(this).text().trim();

		if (columnStateText == 'Username') {
			$(this).text($.i18n.prop('lbasUser.username'));
		}
		if(columnStateText == 'OpcoAreaCode'){
			$(this).text($.i18n.prop('lbasUser.opcoAreaCode'));
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

	<display:table name="lbasUsers" class="list" requestURI="/listOpcoAdminUsers" id="lbasUserList" export="true" pagesize="25" decorator="dyndecorator">
     <display:column media="html" class="dtCheckBox">
    	<s:checkbox id="userchbx" name="userchbx" onclick="this.value=this.checked; clickedOnUserCheckBox();"/> 
    </display:column>
    
    <display:column property="username" sortable="true" titleKey="lbasUser.username"/>
    <display:column property="opcoDisplayName" sortable="true" titleKey="lbasUser.opcoAreaCode"/>

    
    <display:column titleKey="buttons.edit" media="html" class="dtEditButton">
      <a href="javascript:void(0);" onclick="openEditUserDialog($(this).parent().parent().get(0).id,2);"><img id="search" src="../images/edit.png" /></a>
    </display:column>
    
    <display:column titleKey="buttons.delete" media="html" class="dtDeleteButton">
      <a href="javascript:void(0);" onclick="adminDelete('#opcoAdminUserList','deleteOpcoAdminUser', $(this).parent().parent().get(0).id, $.i18n.prop('admin.delete.user.confirm') );"><img id="search" src="../images/incorrectly.png" /></a>
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
		 <table cellpadding="2" cellspacing="2" align="right" style="margin-right:5px">
			<tr>
				<td align="left">
   					<s:select id="adminUserListSelectBox" value="" list="adminUserActionList" listKey="key" listValue="value"/>					
   				</td>
		   	   <td>    
			      <a href="javascript:void(0);"  style="color: #FFFFFF;" class="textBtnGrey" onclick="superAdminUserActionSelected($('#adminUserListSelectBox').val()); ">		                   	                                          	                        
			           <span class="btnSpan"><lm name="buttons.apply" /></span>                     	
			      </a>
			  </td>
	         </tr>
	      </table> 
	</div>
</div>
