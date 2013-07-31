<%@ include file="../common/taglibs.jsp"%>

<script type="text/javascript">
	var applicationTabActions = new Array();
	var columnStateText;
	$("#applicationListSelectBox option").each(function() {
		var newelement = new actionElement(this.value, this.text);
		applicationTabActions.push(newelement);
	});
	clickedOnApplicationCheckBox();
	$("#lbasApplications th").each(function() {
		if ($.browser.msie)
			columnStateText = $(this).text();
		else
			columnStateText = $(this).text().trim();

		if (columnStateText == 'AppKey') {
			$(this).text($.i18n.prop('lbasApplication.appKey'));
		}
		if (columnStateText == 'AppName') {
			$(this).text($.i18n.prop('lbasApplication.appName'));
		}
		if (columnStateText == 'AuthorizedUrlsPattern') {
			$(this).text($.i18n.prop('lbasApplication.authorizedUrlsPattern'));
		}
		
	});
	
	
		$(function(){
			$('.pagelinks a').each(function (i) {
                 var dfd=$(this).attr('href');
                 var params=dfd.split('?');
                 this.href='javascript:void($(\'#applicationList\').load(\'listApplications?'+params[1]+'\'));';
			}); 
			
			$('.sortable a').each(function (i) {
                var dfd=$(this).attr('href');
                var params2=dfd.split('?');
                this.href='javascript:void($(\'#applicationList\').load(\'listApplications?'+params2[1]+'\'));';
			}); 

			//for ie6,ie7
			var resultSize=$('.pagebanner',$('#applicationListContent')).html().split(' ')[0];
			var appName=$.i18n.prop('applicationList.application');
  			$('.pagebanner',$('#applicationListContent')).html($.i18n.prop('general.displaytag.pagebanner', [resultSize,appName,appName]));

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
		
		
<div id="applicationListContent">

	<display:table name="lbasApplications" class="list" requestURI="/listApplications" id="lbasApplicationsList" export="true" pagesize="25" decorator="dyndecorator">
     <display:column media="html" class="dtCheckBox">
    	<s:checkbox id="applicationchbx" name="applicationchbx" onclick="this.value=this.checked; clickedOnApplicationCheckBox();"/> 
    </display:column>
    
<%--     <display:column property="appKey" sortable="true" titleKey="lbasApplication.appKey"/> --%>
    <display:column property="appName" sortable="true" titleKey="lbasApplication.appName"/>
	<display:column property="authorizedUrlsPattern" sortable="true" titleKey="lbasApplication.authorizedUrlsPattern"/>
	<display:column property="contactEmail" sortable="true" titleKey="lbasApplication.contactEmail"/>
	<display:column property="contactSms" sortable="true" titleKey="lbasApplication.contactSms"/>
    
    <display:column titleKey="buttons.edit" media="html" class="dtEditButton">
      <a href="javascript:void(0);" onclick="openEditApplicationDialog($(this).parent().parent().get(0).id);"><img id="search" src="../images/edit.png" /></a>
    </display:column>
    
    <display:column titleKey="buttons.delete" media="html" class="dtDeleteButton">
      <a href="javascript:void(0);" onclick="adminDelete('#applicationList','deleteApplication', $(this).parent().parent().get(0).id, $.i18n.prop('admin.delete.application.confirm') );"><img id="search" src="../images/incorrectly.png" /></a>
    </display:column>
    
    <display:setProperty name="paging.banner.item_name" value="application"/>
    <display:setProperty name="paging.banner.items_name" value="applications"/>

    <display:setProperty name="export.excel.filename"><s:text name='applicationList.Application'/>.xls</display:setProperty>
    <display:setProperty name="export.csv.filename"><s:text name='applicationList.Application'/>.csv</display:setProperty>
    <display:setProperty name="export.pdf.filename"><s:text name='applicationList.Application'/>.pdf</display:setProperty>
    <display:setProperty name="export.xml.filename"><s:text name='applicationList.Application'/>.xml</display:setProperty>
    <display:setProperty name="export.pdf" value="true" />
    
   </display:table>
   
   
   
   	<div id="selectBoxMulti" style="" class="multiSelectAction">
		 <table cellpadding="2" cellspacing="2" align="right" style="margin-right:5px">
			<tr>
				<td align="left">
   					<s:select id="applicationListSelectBox" value="" list="applicationActionList" listKey="key" listValue="value"/>					
   				</td>
		   	   <td>    
			      <a href="javascript:void(0);"  style="color: #FFFFFF;" class="textBtnGrey" onclick="applicationActionSelected($('#applicationListSelectBox').val()); ">		                   	                                          	                        
			           <span class="btnSpan"><lm name="buttons.apply" /></span>                     	
			      </a>
			  </td>
	         </tr>
	      </table> 
	</div>
</div>
