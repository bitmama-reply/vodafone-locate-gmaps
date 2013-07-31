<%@ include file="../common/taglibs.jsp"%>

<script type="text/javascript">

	$(function() {
		$("#startDatePickerStartKpi").datepicker(
				$.extend({}, $.datepicker.regional['' + userLocale + ''], {
					showMonthAfterYear : false,
					showOn : 'button',
					dateFormat : 'dd/mm/yy',
					buttonImage : '../images/calendar.png',
					buttonImageOnly : true,
					onSelect : function(dateText, inst) {
						var daystart = $("#startDatePickerStartKpi").datepicker(
								"getDate");
					}
				}));
	});

	$(function() {
		$("#endDatePickerStartKpi").datepicker(
				$.extend({}, $.datepicker.regional['' + userLocale + ''], {
					showMonthAfterYear : false,
					showOn : 'button',
					dateFormat : 'dd/mm/yy',
					buttonImage : '../images/calendar.png',
					buttonImageOnly : true,
					onSelect : function(dateText, inst) {
						var dayend = $("#endDatePickerStartKpi").datepicker(
								"getDate");
					}
				}));
	});

</script>

<s:form action="listKpi" theme="simple">

	<table cellpadding="3" cellspacing="3" style="margin-left: 2px">
		<tr>

			<td align="right" colspan="3"><lm name="userStatisticList.Start" />
			</td>
			<td align="right" colspan="3"><input id="startDatePickerStartKpi"
				name="startDateStr" readOnly="true" /></td>

			<td align="right" colspan="3"><lm name="userStatisticList.End" />
			</td>
			<td align="right" colspan="3"><input id="endDatePickerStartKpi"
				name="endDateStr" readOnly="true" /></td>
 				
 			<s:if test ="%{ userRoleType == 4}">
				<td align="right" colspan="3"><lm
						name="userStatisticList.opco" />
						
				<td align="right" colspan="3"><s:select
						id="selectedOpcoSelectBox" name="selectedOpco" list="opcoList"
						listKey="key" listValue="value"
						onchange="AjxListKpiSelectBox();" />
				</td>
			</s:if>
				
			<td align="right" colspan="3"><lm
						name="userStatisticList.companyList" />
				
						
				<td align="right" colspan="3"><s:select
						id="companyListSelectBox" name="selectedCompany"
						list="companyList" listKey="key" listValue="value"
						onchange="AjxListKpiSelectBox();" />
				</td>
				
				<td align="right" colspan="3"><lm
						name="userStatisticList.userList" />
				
						
				<td width="100px"><s:select id="userListSelectBox"
						name="selectedUser" list="userList" listKey="key"
						listValue="value" />
						</td>
					
			
						
				<td align="right" colspan="3"><a href="javascript:void(0);"
					style="color: #FFFFFF;" class="textBtnGrey"
					onclick="AjxListKpi();"> <span class="btnSpan"><lm
								name="buttons.list" />
					</span> </a>
						</td>

		</tr>
	</table>
</s:form>
