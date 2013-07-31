<%@ include file="../common/taglibs.jsp"%>

<script type="text/javascript">


	var columnStateText;
	
	$("#kpisList th").each(function() {
		if ($.browser.msie)
			columnStateText = $(this).text();
		else
			columnStateText = $(this).text().trim();
	
		if(columnStateText == 'OpcoDisplayName'){
			$(this).text($.i18n.prop('lbasUser.opcoAreaCode'));
		}
		if(columnStateText == 'CompanyName'){
			$(this).text($.i18n.prop('lbasUser.companyName'));
		}		
	    if(columnStateText == 'Msisdn'){
	        $(this).text($.i18n.prop('lbasUser.msisdn'));
	    }
	    if(columnStateText == 'UsersProvisionedCount'){
	        $(this).text($.i18n.prop('lbasUser.usersProvisionedCount'));
	    }
	    if(columnStateText == 'UsersDeProvisionedCount'){
	        $(this).text($.i18n.prop('lbasUser.usersDeProvisionedCount'));
	    }
	    if(columnStateText == 'LocationRequestsCount'){
	        $(this).text($.i18n.prop('lbasUser.locationRequestsCount'));
	    }
	    if(columnStateText == 'CreatedPoiCount'){
	        $(this).text($.i18n.prop('lbasUser.createdPoiCount'));
	    }
	    if(columnStateText == 'CreatedMeetingCount'){
	        $(this).text($.i18n.prop('lbasUser.createdMeetingCount'));
	    }
	    if(columnStateText == 'ActiveUsersCount'){
	        $(this).text($.i18n.prop('lbasUser.activeUsersCount'));
	    }
	});

	$(function() {
		$('.pagelinks a')
				.each(
						function(i) {
							var dfd = $(this).attr('href');
							var params = dfd.split('?');
							this.href = 'javascript:void($(\'#kpiListContent\').load(\'listKpi?'
									+ params[1] + '\'));';
						});

		$('.sortable a')
				.each(
						function(i) {
							var dfd = $(this).attr('href');
							var params2 = dfd.split('?');
							this.href = 'javascript:void($(\'#kpiListContent\').load(\'listKpi?'
									+ params2[1] + '\'));';
						});

		//for ie6,ie7
		var resultSize = $('.pagebanner', $('#kpiListContent')).html().split(
				' ')[0];
		var userName = $.i18n.prop('kpiList.kpi');
		$('.pagebanner', $('#kpiListContent')).html(
				$.i18n.prop('general.displaytag.pagebanner', [ resultSize,
						userName, userName ]));

	});
</script>

<%
   request.setAttribute("dyndecorator", new org.displaytag.decorator.TableDecorator() {

      public String addRowId() {
         return "" ;
      }

   });
%>






	<div id="kpiSearchArea" class="modBorder" style="height: 34px">

	</div>

	<div id="kpiListContent">

		<display:table name="kpis" class="list"
			requestURI="/listKpi" id="kpisList" export="true"
			pagesize="25" decorator="dyndecorator">



			<display:column property="opcoDisplayName" sortable="true"
				titleKey="lbasUser.opcoAreaCode" />
			<display:column property="companyName" sortable="true"
				titleKey="lbasUser.companyName" />
			<display:column property="msisdn" sortable="true"
				titleKey="lbasUser.msisdn" />
			<display:column property="usersProvisionedCount" sortable="true"
				titleKey="lbasUser.usersProvisionedCount" />
			<display:column property="usersDeProvisionedCount" sortable="true"
				titleKey="lbasUser.usersDeProvisionedCount" />
			<display:column property="locationRequestsCount" sortable="true"
				titleKey="lbasUser.locationRequestsCount" />
			<display:column property="createdPoiCount" sortable="true"
				titleKey="lbasUser.createdPoiCount" />
			<display:column property="createdMeetingCount" sortable="true"
				titleKey="lbasUser.createdMeetingCount" />	
			<display:column property="activeUsersCount" sortable="true"
				titleKey="lbasUser.activeUsersCount" />	
							

			<display:setProperty name="paging.banner.item_name" value="Kpi" />
			<display:setProperty name="paging.banner.items_name" value="Kpi" />

			<display:setProperty name="export.excel.filename">
				KPI.xls</display:setProperty>
			<display:setProperty name="export.csv.filename">
				KPI.csv</display:setProperty>
			<display:setProperty name="export.pdf.filename">
				KPI.pdf</display:setProperty>
			<display:setProperty name="export.xml.filename">
				KPI.xml</display:setProperty>
			<display:setProperty name="export.pdf" value="true" />

		</display:table>
	</div>

