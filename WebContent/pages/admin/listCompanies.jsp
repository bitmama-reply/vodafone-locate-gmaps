<%@ include file="../common/taglibs.jsp"%>
<script language="javascript">
	initializeLbasMessages() ;

	$("#companyList th").each(function() {
		if ($.browser.msie)
			columnStateText = $(this).text();
		else
			columnStateText = $(this).text().trim();

	    if(columnStateText == 'StatusText'){
	        $(this).text($.i18n.prop('admin.userlist.column.state'));
	    }
	});
</script>
<script type="text/javascript">
 
		$(function(){
			$('.pagelinks a').each(function (i) {
                 var dfd=$(this).attr('href');
                 var params=dfd.split('?');
                 this.href='javascript:void($(\'#companyList\').load(\'listCompanies?'+params[1]+'\'));';
			}); 
			
			$('.sortable a').each(function (i) {
                var dfd=$(this).attr('href');
                var params2=dfd.split('?');
                this.href='javascript:void($(\'#companyList\').load(\'listCompanies?'+params2[1]+'\'));';
			}); 

		});	



</script>

<% 
        request.setAttribute("dyndecorator2", new org.displaytag.decorator.TableDecorator()
        {
            public String addRowId()
            {
                return ""+evaluate("id");
            }
        });

%>

<div id="companyListContent">

	<div id="searchArea" class="modBorder" style="height: 34px">	
			<table  cellpadding="3" cellspacing="3" style="margin-left:2px">
				<tr>
		            <td>
		               <label><lm name="companyList.CompanyName"/>:</label>
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
		                              onclick="$('#companyList').load('searchCompanies',{searchText:$('#searchInput').val()})">                          	                          
			                   <span class="btnSpan"><lm name="buttons.search"/></span>                     	
		               </s:a>
					</td>
				</tr>
			</table>
	</div>
	  
    <display:table name="companyList" class="list" requestURI="/listCompanies" id="companyList" export="true" pagesize="25" decorator="dyndecorator2" defaultsort="2" defaultorder="ascending">
   
    <display:column titleKey="buttons.edit" media="html" class="dtEditButton">
      <a href="javascript:void(0);" onclick="openEditCompanyDialog(this.parentNode.parentNode.id);"><img id="search" src="../images/edit.png" /></a>
    </display:column>
    <display:column property="id" sortable="true" titleKey="companyList.id"/>
    <display:column property="name" sortable="true" titleKey="companyList.name"/>
    <display:column property="contactName" sortable="true" titleKey="companyList.contactName"/>
    <display:column property="contactNumber" sortable="true" titleKey="companyList.contactNumber"/>
    <display:column property="contactEmail" sortable="true" titleKey="companyList.contactEmail"/>
    <display:column property="address" sortable="true" titleKey="companyList.address"/>
    <display:column property="city" sortable="true" titleKey="companyList.city"/>
    <display:column property="expiryDate" sortable="true" titleKey="companyList.expiryDate"/>
    <display:column property="maxUsers" sortable="true" titleKey="companyList.maxUsers"/>
    <display:column property="statusText" sortable="true" titleKey="companyList.statusText"/>
    <display:column titleKey="buttons.delete" media="html" class="dtDeleteButton">
      <a href="javascript:void(0);" onclick="adminDelete('#companyList','deleteCompany', $(this).parent().parent().get(0).id, $.i18n.prop('admin.delete.company.confirm') );"><img id="search" src="../images/incorrectly.png" /></a>
    </display:column>
    

    
    <display:setProperty name="paging.banner.item_name"><lm name="companyList.Company"/></display:setProperty>
    <display:setProperty name="paging.banner.items_name"><lm name="companyList.Company"/></display:setProperty>

    <display:setProperty name="export.excel.filename"><s:text name='companyList.Company'/>.xls</display:setProperty>
    <display:setProperty name="export.csv.filename"><s:text name='companyList.Company'/>.csv</display:setProperty>
    <display:setProperty name="export.pdf.filename"><s:text name='companyList.Company'/>.pdf</display:setProperty>
    <display:setProperty name="export.pdf" value="true" />
    
   </display:table>
   
   <s:a href="javascript:void(0);"  style="color: #FFFFFF;text-decoration:none" cssClass="textBtnRed"
		 onclick="openCreateCompanyDialog();">                          	                          
		   <span class="btnSpan"><lm name="companyList.NewCompany"/></span>                     	
   </s:a>
</div>

