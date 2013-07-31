<%@ include file="../common/taglibs.jsp"%>

<script type="text/javascript">

	$(function() {
		$("#startDatePickerStart").datepicker(
				$.extend({}, $.datepicker.regional['' + userLocale + ''], {
					showMonthAfterYear : false,
					showOn : 'button',
					dateFormat : 'dd/mm/yy',
					buttonImage : '../images/calendar.png',
					buttonImageOnly : true,
					onSelect : function(dateText, inst) {
						var daystart = $("#startDatePickerStart").datepicker(
								"getDate");
					}
				}));
	});

	$(function() {
		$("#endDatePickerStart").datepicker(
				$.extend({}, $.datepicker.regional['' + userLocale + ''], {
					showMonthAfterYear : false,
					showOn : 'button',
					dateFormat : 'dd/mm/yy',
					buttonImage : '../images/calendar.png',
					buttonImageOnly : true,
					onSelect : function(dateText, inst) {
						var dayend = $("#endDatePickerStart").datepicker(
								"getDate");
					}
				}));
	});

</script>

<s:form action="listUserStatistics" theme="simple">

	<table cellpadding="3" cellspacing="3" style="margin-left: 2px">
		<tr>

			<td align="right" colspan="3"><lm name="userStatisticList.Start" />
			</td>
			<td align="right" colspan="3"><input id="startDatePickerStart"
				name="startDateStr" readOnly="true" /></td>

			<td align="right" colspan="3"><lm name="userStatisticList.End" />
			</td>
			<td align="right" colspan="3"><input id="endDatePickerStart"
				name="endDateStr" readOnly="true" /></td>

			<td><lm name="userStatisticList.tariffList" /><td align="right" colspan="3"><s:select
						id="tariffListSelectBox" name="selectedTariff" list="tariffList"
						listKey="key" listValue="value" /></td>

					<td align="right" colspan="3"><lm
						name="userStatisticList.opco" />
						
				<td align="right" colspan="3"><s:select
						id="selectedOpcoSelectBox" name="selectedOpco" list="opcoList"
						listKey="key" listValue="value"
						onchange="AjxListUserStatisticsSearch();" />
				</td>
				
				<td align="right" colspan="3"><lm
						name="userStatisticList.companyList" />
				
						
				<td align="right" colspan="3"><s:select
						id="companyListSelectBox" name="selectedCompany"
						list="companyList" listKey="key" listValue="value"
						onchange="AjxListUserStatisticsSearch();" />
				</td>
				
				<td align="right" colspan="3"><lm
						name="userStatisticList.userList" />
				
						
				<td width="100px"><s:select id="userListSelectBox"
						name="selectedUser" list="userList" listKey="key"
						listValue="value" />
						</td>
					
			
						
				<td align="right" colspan="3"><a href="javascript:void(0);"
					style="color: #FFFFFF;" class="textBtnGrey"
					onclick="AjxListUserStatistics();"> <span class="btnSpan"><lm
								name="buttons.list" />
					</span> </a>
						</td>

		</tr>
	</table>
</s:form>
