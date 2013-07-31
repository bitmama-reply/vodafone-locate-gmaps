<%@page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@taglib uri="/struts-tags" prefix="s" %>

<s:hidden name="startLatitude"/>
<s:hidden name="startLongitude"/>
<s:hidden name="endLatitude"/>
<s:hidden name="endLongitude"/>
<s:hidden name="duration"/>
<s:hidden name="distance"/>

<div id="routingModHeader" class="modHeader"></div>
<div id="routingTabContent">

	<div id="idRoutingSearchBoxDiv">	
		<div id="routing" class="modBorder">
			<div id="error-view-sendmessage" class="box-error-message">
				<div class="content-cell"><span><#= $.i18n.prop('error.send.title') #></span><ul id='send-list-wrapper'></ul></div>
			</div>
			<div>
				<table id="routePointTable">
					<tr id ="routePointTR0">
						<td class="pointLabel" >
							<label for="routePoint0" id="label_routePoint0"></label>
						</td>
						<td class="inputCov">
							<s:textfield id="routePoint0" name="routeFrom" theme="simple"  cssClass="inputText"/>
							<a id="deletePoint0" href="javascript:void(0);" onclick="deletePoint(this);" style="display:none;">
								<img src="images/dialog_close_button.png" />
							</a>
						</td>
					</tr>
					
					<tr id ="routePointTR1" >
						<td  class="pointLabel" >
							<label for="routePoint1" id="label_routePoint1"></label>
						</td>
						<td class="inputCov">
							<s:textfield id="routePoint1" name="routeTo" theme="simple"  cssClass="inputText"/>
							<a id="deletePoint1" href="javascript:void(0);" onclick="deletePoint(this);" style="display:none;">
								<img src="images/dialog_close_button.png" />
							</a>
						</td>
					</tr>
					
				</table>	
			</div>
			<table id="routeButtons">
				
				<tr>
					<td colspan="2">
						<a href="javascript:void(0);" style="text-decoration:none;" onclick="addDestination({}); return false;" id="routing_addDestination"></a>
					</td>
				</tr>
				<tr>
					<td colspan="2">&nbsp;</td>					
				</tr>
				<tr>					
					<td  nowrap="nowrap">
						<label for="routingTypes" id="label_routingTypes"></label>
					</td>
					<td class="coverSelect"> 
						<span style="float:left;">
							<ul id="routingTypes" class ="lm clearfix">
								<li class="selected drive"><a class="driving" title="drv" href="javascript:void(0);">test d</a></li>
								<li class="pedestrian"><a class="pedestrian" href="javascript:void(0);" title="ped">test p</a></li>
							</ul>							
						</span>
						<div class="traficCover">
							<label for="routingTrafficEnableCheck" id="label_routingTrafficEnableCheck"></lm></label>
							<s:checkbox id="routingTrafficEnableCheck" name="routingTrafficEnable"/>
						</div>
					</td>
				</tr>
			</table>
		</div>
	
		<div id="idRoutingDetailsDiv" class="modBorder" style="display:none;">
			<div class="modHeader transparentBlueBG">
				<table>
					<tr>
						<td>
							<a class="showHideBtn" style="color: #333333;" href="javascript:void(0);" onclick="showhide('routingDetails'); return false;" id="btn_routingTitle"></a>
						</td>
						<td>
							<img src="<s:url value="/images/dropdwn_arrw_g.png"/>"/>
						</td>
					</tr>
				</table>
			</div>
			<!--
<div id="routingDetails" class="modBodyRoute" style="display:none;">
				<div class="modCopyRoute">
				    <table align="center" class="formTable">      
						<tr>
							<td>
								<s:checkbox id="idHeightCB" theme="simple" name="checkbox1" value="true" fieldValue="true" onclick="enableDisable(idHeightCB, idHeight)"/>
							</td>
							<td>
								<img src="<s:url value="/images/height.gif"/>" height="25" width="25"/>
							</td>
							<td>
								<b><s:textfield id="idHeight" theme="simple" name="height" cssClass="inputText" size="1" /></b>
								<label for="idHeight" id="label_idHeight"></label>
							</td>
							<td>
								<s:checkbox id="idWidthCB" theme="simple" name="checkbox2" value="true" fieldValue="true" onclick="enableDisable(idWidthCB, idWidth)"/>
							</td>
							<td>
								<img src="<s:url value="/images/width.gif"/>" height="25" width="25"/>
							</td>
							<td>
								<b><s:textfield id="idWidth" theme="simple" name="width" cssClass="inputText" size="1" /></b>
								<label for="idWidth" id="label_idWidth"></label>
							</td>
						</tr>
						<tr>
							<td>
								<s:checkbox id="idWeightCB" theme="simple" name="checkbox3" value="true" fieldValue="true" onclick="enableDisable(idWeightCB, idWeight)"/>
							</td>
							<td>
								<img src="<s:url value="/images/weight.gif"/>" height="25" width="25"/>
							</td>
							<td>
								<s:textfield id="idWeight" theme="simple" name="weight" cssClass="inputText" size="1" />
								<label for="idWeight" id="label_idWeight"></label>
							</td>
						</tr>
						<tr>
							<td>
								<s:checkbox id="idHazardous" theme="simple" name="hazardous" value="aBoolean"/>
							</td>
							<td>
								<img src="<s:url value="/images/warning.gif"/>" height="25" width="25"/>
							</td>
							<td>
								<label for="idHazardous" id="label_idHazardous"></label>
							</td>
						</tr>
				    </table>       
				</div>
			</div>
-->
		</div>
		
		<div class="modBorder">
			<div class="modCopyRoute  clearfix">
				<a href="javascript:void(0);" onclick="searchRoute()" id="btn_route_route" class="button purple_button"> 
					<span> Route </span>
				</a>
			</div>
		</div>
		<div class="bottomBody"></div>
	</div>
	<div id="idRouteResult"></div>
	
	<div class=modFooter></div>	
</div>

<div id="savedRoutes" class="mod2Col" style="display:none">   
	<div class=modHeader></div>
	<div id="savedRoutesTabContent">
		<div id="idSavedRoutesBoxDiv">
			<div class="modBorder">
				<div id="idSavedRoutesDiv"></div>
			</div>
			<div class=modFooter></div>
		</div>
	</div>
</div>   

<div id="idSaveRouteDiv"  style="padding-top:2px;display:none;">
		<div id="error-view-saveroute" class="box-error-message">
			<div class="content-cell"><span><#= $.i18n.prop('error.send.title') #></span><ul id='send-list-wrapper'></ul></div>
		</div>
        <table style="width:100%;">
 				<tr>
					<td>
						<input id="idRouteName" name="idRouteName"
						class="inputText" maxlength="100"
						onfocus="if (this.value==''+$.i18n.prop('routing.select.typeInName')) { this.style.color='black'; this.value=''; }"
						onblur="if (this.value=='') { this.style.color='#000'; this.value=''+$.i18n.prop('routing.select.typeInName'); }"
						style="color: black; cursor: text" />
					</td>
				</tr>
				<tr>
                    <td>
						<a class="button purple_button" href="javascript:void(0);" id="btn_route_save"><span>Save</span></a>
						<a class="button multi_user_button" href="javascript:void(0);" id="btn_route_cancel"><span>Cancel</span></a>
					</td>
				</tr>
                
                <!--<tr height="30">
                        <td align="right" height="100%">					
                                <a class="purple_button textBtnGrey" id="cancelBtn" href="javascript:void(0);" onclick="hide('idShareRouteDiv');show('savedRoutesActionsDiv');">
                                    <span class="lm" key="buttons.cancel" style="color:#FFFFFF;"><#= $.i18n.prop('buttons.cancel') #></span>
                                </a>
                                
                                <a class="multi_user_button textBtnGrey " href="javascript:void(0);" onclick="shareRoute();">
                                    <span class="lm" key="buttons.share" style="color:#FFFFFF;"><#= $.i18n.prop('buttons.share') #></span>
                                </a>
                        </td>					
                </tr>-->
        </table>
</div>



<script>
$(function(){
  localize && localize.routingTemplate();
  
  var startPos = $('#routingTabContent').offset().top;
  
  var pageHeigh = $(window).height();
  
  $('#routingTabContent').css({
  	'height':pageHeigh-340,
  	 'overflow-y': 'auto'
  	});
  
  $('#routing_addDestination').css({
    'cursor': 'default',
    'opacity': 0.5
  });
	$('#routingTypes li').click(function(){
		$('#routingTypes li').removeClass("selected");
		$(this).addClass("selected");
		
		if( $(this).hasClass("pedestrian selected") ){
			$("#routeButtons .traficCover").hide();
		}else{
			$("#routeButtons .traficCover").show();
		}
		
	});

});
</script>