<%@ include file="../common/taglibs.jsp"%>

<script type="text/javascript">
	
	var columnStateText;

	$("#lbasUserStatisticsList th").each(function() {
		if ($.browser.msie)
			columnStateText = $(this).text();
		else
			columnStateText = $(this).text().trim();
	
		if (columnStateText == 'OpcoAreaCode') {
			$(this).text($.i18n.prop('lbasUser.opcoAreaCode'));
		}
		if(columnStateText == 'CompanyName'){
			$(this).text($.i18n.prop('lbasUser.companyName'));
		}
	    if(columnStateText == 'CompanyContactEmail'){
	        $(this).text($.i18n.prop('lbasUser.companyContactEmail'));
	    }
	    if(columnStateText == 'Tariff'){
	        $(this).text($.i18n.prop('lbasUser.tariff'));
	    }
	    if(columnStateText == 'Msisdn'){
	        $(this).text($.i18n.prop('lbasUser.msisdn'));
	    }
	    if(columnStateText == 'ActiveText'){
	        $(this).text($.i18n.prop('lbasUser.activeText'));
	    }
		
	});

	
	$(function() {
		$('.pagelinks a')
				.each(
						function(i) {
							var dfd = $(this).attr('href');
							var params = dfd.split('?');
							this.href = 'javascript:void($(\'#userstatisticsListContent\').load(\'listUserStatistics?'
									+ params[1] + '\'));';
						});

		$('.sortable a')
				.each(
						function(i) {
							var dfd = $(this).attr('href');
							var params2 = dfd.split('?');
							this.href = 'javascript:void($(\'#userstatisticsListContent\').load(\'listUserStatistics?'
									+ params2[1] + '\'));';
						});

		//for ie6,ie7
		var resultSize = $('.pagebanner', $('#userstatisticsListContent')).html().split(
				' ')[0];
		var userName = $.i18n.prop('userList.User');
		$('.pagebanner', $('#userstatisticsListContent')).html(
				$.i18n.prop('general.displaytag.pagebanner', [ resultSize,
						userName, userName ]));

	});
</script>

<%
   request.setAttribute("dyndecorator", new org.displaytag.decorator.TableDecorator() {

      public String addRowId() {
         return "" + evaluate("user_id");
      }

   });
%>


<div id="userStatisticsSearchArea" class="modBorder"
	style="height: 34px"></div>

<div id="userstatisticsListContent">

	<display:table name="lbasUserStatistics" class="list"
		requestURI="/listUserStatistics" id="lbasUserStatisticsList"
		export="true" pagesize="25" decorator="dyndecorator">



		<display:column property="opcoDisplayName" sortable="true"
			titleKey="lbasUser.opcoAreaCode" />
		<display:column property="companyName" sortable="true"
			titleKey="lbasUser.companyName" />
		<display:column property="companyContactEmail" sortable="true"
			titleKey="lbasUser.companyContactEmail" />
		<display:column property="tariff" sortable="true"
			titleKey="lbasUser.tariff" />
		<display:column property="msisdn" sortable="true"
			titleKey="lbasUser.msisdn" />
		<display:column property="activeText" sortable="true"
			titleKey="lbasUser.activeText" />


		<display:setProperty name="paging.banner.item_name"
			value="UserStatistics" />
		<display:setProperty name="paging.banner.items_name"
			value="UserStatistics" />

		<display:setProperty name="export.excel.filename">
				Users.xls</display:setProperty>
		<display:setProperty name="export.csv.filename">
				Users.csv</display:setProperty>
		<display:setProperty name="export.pdf.filename">
				Users.pdf</display:setProperty>
		<display:setProperty name="export.xml.filename">
				Users.xml</display:setProperty>
		<display:setProperty name="export.pdf" value="true" />

	</display:table>
</div>

