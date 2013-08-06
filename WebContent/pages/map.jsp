<div id="edit_loc_dialog" title="" style="display:none;">
    <div id="tabs_in_edit_loc">
        <ul>				        				       
            <li id ="edit_loc_tab1_list_item"><a id="edit_loc_tab1_link" href="#edit_loc_tab1" onclick="openEditLocTab1('#edit_loc_tab1');"></a></li>				            
            <li id ="edit_loc_tab2_list_item"><a id="edit_loc_tab2_link" href="#edit_loc_tab2" onclick ="openEditLocTab2('#edit_loc_tab2');"></a></li>
            <li id ="edit_loc_tab3_list_item" ><a id="edit_loc_tab3_link" href="#edit_loc_tab3" onclick ="openEditLocTab3('#edit_loc_tab3');"></a></li>
            <li id ="edit_loc_tab4_list_item"><a id="edit_loc_tab4_link" href="#edit_loc_tab4" onclick ="openEditLocTab4('#edit_loc_tab4');"></a></li>
        </ul>
		<div id="error-view-sendmessage" class="box-error-message">
			<div class="content-cell"><span><#= $.i18n.prop('error.send.title') #></span><ul id='send-list-wrapper'></ul></div>
		</div>
        <div id="edit_loc_tab1"> </div>				        
        <div id="edit_loc_tab2"> </div>
        <div id="edit_loc_tab3"> </div>
        <div id="edit_loc_tab4"> </div>				        
        <div class="buttons clearfix">
            <a id ="updateLocationButton" href="javascript:void(0);" style="float:right; display:none;" class="purple_button" >                          	                          
                <span class="lm" key="buttons.save" >Update</span>
            </a>
            <a id ="addLocationButton" href="javascript:void(0);" style="float:right;display:none;" class="purple_button"  onclick="if (lbasValidate('updateLocationDetail')){AjxSaveNewLocation();} return false; " tabindex="20" >
                <span class="lm" key="buttons.save" >Saves</span>
            </a>
            <a id ="cancelButton"href="javascript:void(0);"  class="multi_user_button">                          	                          
                <span class="lm" key="buttons.update" >Cancel</span>                     	
            </a>	
		</div>
    </div>


</div>
<!--
<div id="edit_cat_dialog" title="" style="display:none;">
    <div id="tabs_in_edit_loc">
        <ul>				        				       
            <li id ="edit_cat_tab1_list_item"><a id="edit_cat_tab1_link" href="#edit_cat_tab1" onclick="openEditCatTab1('#edit_cat_tab1');">Details</a></li>				            
            <li id ="edit_cat_tab2_list_item"><a id="edit_cat_tab2_link" href="#edit_cat_tab2" onclick ="openEditCatTab2('#edit_cat_tab2');">Admin</a></li>
        </ul>

        <div id="edit_cat_tab1">				        	   
        </div>				        
        <div id="edit_cat_tab2">				        	
        </div>
         <table width="100%">
        <tr>
                <td  align="right" >
                        <a id ="cancelCatButton"href="javascript:void(0);"  style="color: #FFFFFF;" class="textBtnGrey"  onclick="$('span.ui-icon-closethick:last').click();" >                          	                          
                                <span class='btnSpan'>
                                        <span class="lm" key="buttons.update" >Cancel</span>                     	
                                </span>
                        </a>&nbsp;	
                        <a id ="updateCatButton" href="javascript:void(0);" style="color: #FFFFFF;display:none;" class="textBtnRed" tabindex="20" >                          	                          
                                <span class='btnSpan'>
                                        <span class="lm" key="buttons.save" >Save</span>
                                </span>                     	
                        </a>&nbsp;
                        <a id ="addCatButton" href="javascript:void(0);" style="color: #FFFFFF;display:none;" class="textBtnRed"  onclick="if (lbasValidate('updateLocationDetail'))AjxSaveNewCategory();" tabindex="20" >                          	                          
                                <span class='btnSpan'>
                                        <span class="lm" key="buttons.save" >Saves</span>
                                </span>                     	
                        </a>&nbsp;
                </td>
                </tr>
                <tr><td>&nbsp;</td></tr>	
        </table>


</div>
-->
<div class=demo sizcache="0" sizset="61" style="display:none"><!-- share with 3rd party  -->
	<div id="share3rdPartyDialog" title="">
	</div>
</div>
<div class="mapStyles">
	<div id="mapPanel" class="clearfix">
		<a href="javascript:void(0);" id="btn_map_expand_collapse" class="map_button expanded">
			<span></span>
		</a>

		<ul class="map_button_bar">
		  <li>
		  	<a class="map_button" id="btn_map_clear" href="javascript:void(0);" onclick="clearMapClicked(); return false"><span>Clear Map</span></a>
		  </li>
		  <li>
		  	<a class="map_button map_rel" id="btn_map_traffic" href="javascript:void(0);" onclick="trafficButtonClicked(); return false"><span>Traffic</span></a>
		  </li>
		  <li>
		  	<a class="map_button map_rel active" id="btn_map_street" href="javascript:void(0);" onclick="streetMapButtonClicked(); return false"><span>Map</span></a>
		  </li>
		  <li>
		  	<a class="map_button map_rel" id="btn_map_satellite" href="javascript:void(0);" onclick="satelliteMapButtonClicked(); return false"><span>Satellite</span></a>
		  </li>
		  <li>
		  	<a class="map_button map_rel" id="btn_map_hybrid" href="javascript:void(0);" onclick="hybridMapButtonClicked(); return false"><span>Hybrid</span></a>
		  </li>
		  <li>
			<a class="map_button" id="btn_map_myLocation" href="javascript:void(0);" onclick="myLocationClicked(); return false"><span>My Location</span></a>
		  </li>
		</ul>
	</div>
</div>


<div id="left">
    <!--
    <div class="title">
      <h1>Control Panel 12 3 4</h1>
      <span id="map_expand_collapse" class="expanded">&nbsp;</span>
    </div>
    -->

	<div id="tabs">
		<div class="tabsHolder">
			<ul>
				<li>
					<a id="btn_tab-users" href="#tab-users"></a>
				</li>
				<li>
					<a id="btn_tab-assets" href="#tab-assets"></a>
				</li>
				<li>
					<a id="btn_tab-places" href="#tab-places"></a>
				</li>
				<li>
					<a id="btn_tab-routes" href="#tab-routes"></a>
				</li>
				<!--<li>
					<a id="btn_tab-geofences" href="#tab-geofences"></a>
				</li>-->
			</ul>
			<div id="tab-users">

				<div class="search_container clearfix">
 					<ul class="x-input clearfix">
					    <li>
					        <span class="search-wrap">
								<input id="search_users" class="search" value="Search" onfocus="if (this.value == $.i18n.prop('general.Search')) {this.value = '';}" onblur="if (this.value == '') {this.value = $.i18n.prop('general.Search');}" />
								<span class="searchMagnifier">&nbsp;</span>
							</span>
					    </li>
					    <li class="ui-selectmenu-parent">
					    	<input type="checkbox" value="select_all_users" id="select_all_tab-users" class="check-box">
					     	<select id="filter_all_tab-users">
								<option value="1" id="allPeolple"></option>
							   	<option value="2" class="allLocatable"></option>
							</select>
 					    </li>
					</ul>
					<div class="search_container_bottom"></div>
 				</div><!-- search_container -->

				<div class="contents"></div>
				<div class="actions clearfix">
					<div class="clearfix" style="margin:0 0 5px;">
						<div id="tab-users_count"></div>
						<div id="adminRightAction">							
							<select name="actionMultiple" id="userActionList"></select>
							<select name="actionMultiple2" id="userActionList2"></select>
							<select name="actionMultiple2" id="userActionList3"></select>
							<select name="actionMultiple2" id="userActionList4"></select>
							<select name="actionMultiple2" id="userActionList5"></select>
							<select name="actionMultiple2" id="userActionList6"></select>
						</div>
						<div id="refreshUsers"><a href="javascript:void(0);" onClick="refreshUsers(); return false;" class="multi_user_button_refresh"><span>Refresh</span></a></div>
					</div>
					<ul class="action_button_bar clearfix">
						<li class="first">
							<a id="btn_tab-users_showOnMap" href="javascript:void(0);" class="multi_user_button_inactive">
								<span></span>
							</a>
						</li>
						<li>
							<a id="btn_tab-users_createReport" href="javascript:void(0);" class="multi_user_button_inactive">
								<span></span>
							</a>
						 </li>
						 <li>
							<a id="btn_tab-users_sendMessage" href="javascript:void(0);" class="multi_user_button_inactive">
								<span></span>
							</a>
						 </li>
					</ul>

					  <!--
					  <select id="tab_users_action_select" class="selectAction" disabled="disabled"></select>
					  <input type="button" class="button goBtn" id="btn_tab_users_locate_selected" value="Go"/>
					  -->
				</div><!--end: actions-->
			</div><!--end: tab-users-->


			<div id="tab-assets">

 				<div class="search_container clearfix">
 					<ul class="x-input clearfix">
					    <li>
					    	<
					        <span class="search-wrap">
								<input id="search_assets" class="search" value="Search" onfocus="if (this.value == $.i18n.prop('general.Search')) {this.value = '';}" onblur="if (this.value == '') {this.value = $.i18n.prop('general.Search');}"/>
								<span class="searchMagnifier">&nbsp;</span>
							</span>
					    </li>
					    <li class="ui-selectmenu-parent">
					    	<input type="checkbox" value="select_all_assets" id="select_all_tab-assets" class="check-box">
					     	<select id="filter_all_tab-assets">
								<option value="1" id="allAssets"></option>
							   	<option value="2" class="allLocatable"></option>
							</select>
 					    </li>
					</ul>
					<div class="search_container_bottom"></div>
 				</div><!-- search_container -->

				<div class="contents"></div>
				<div class="actions clearfix">
					<div class="clearfix" style="margin:0 0 5px;">
						<div id="tab-assets_count"></div>
						<div id="adminRightAction">							
<!--
							<select name="actionMultipleAsset" id="actionMultipleAsset"></select>
							<select name="actionMultipleAsset2" id="actionMultipleAsset2"></select>
							<select name="actionMultipleAsset3" id="actionMultipleAsset3"></select>
							<select name="actionMultipleAsset4" id="actionMultipleAsset4"></select>
							<select name="actionMultipleAsset5" id="actionMultipleAsset5"></select>
							<select name="actionMultipleAsset6" id="actionMultipleAsset6"></select>
-->

						</div>						
						<div id="refreshAssets"><a href="javascript:void(0);" onClick="refreshAssets(); return false;" class="multi_user_button_refresh"><span>Refresh</span></a></div>
					</div>	
					<ul class="action_button_bar clearfix">
						<li class="first">
							<a id="btn_tab-assets_showOnMap" href="javascript:void(0);" class="multi_user_button_inactive">
								<span></span>
							</a>
						</li>
						<li>
							<a id="btn_tab-assets_createReport" href="javascript:void(0);" class="multi_user_button_inactive">
								<span></span>
							</a>
						 </li>
						 <li>
							<a id="btn_tab-assets_sendMessage" href="javascript:void(0);" class="multi_user_button_inactive">
								<span></span>
							</a>
						 </li>
					</ul>
					<!--
					  <select id="tab_assets_action_select" class="selectAction" disabled="disabled"></select>
					  <input type="button" class="button goBtn" id="btn_tab_assets_locate_selected" value="Go"/>
					 -->
				</div><!--end: actions-->
			</div>
			<div id="tab-places">
				<div class="subtabs">
					<div class="subtabsCover">
						<ul>
							<li class="first">
								<a id="btn_tab-places-recents" href="#tab-places-recents"></a>
							</li>
							<li class="second">
								<a id="btn_tab-places-enterprise" href="#tab-places-enterprise"></a>
							</li>
							<li class="third">
								<a id="btn_tab-places-personal"	href="#tab-places-personal"></a>
							</li>
						</ul>
						
                    	<div id="fom_single_search">
                      	<span class="placesSearch">
                        	<input type="text" id="search_places" class="x-input-text search" value="Search"  />
                        </span>
                        <span class="searchMagnifier">&nbsp;</span>
                        <span id="btn_places_search_reset" class="searchReset"> X </span>
                        <span class="searchLoading">&nbsp;</span>
                    	</div>
                    	<div class="container_bottom"></div>
					</div>
                                    
                                        <div class="places">

                                        	
                                        	<a class="advancedButton" href="javascript:void(0);" onclick="toggleSingleAdvancedSearch();">Advanced</a>
                                        	<div id="fom_advanced_search" style="min-heigth:200px;display:none;">
                                                <table style="width:98%;" >
													<tbody>
														<tr>
															<td>
																<span class="lm" key="poi.number">Number</span>
															</td>
															<td>
																<span class="lm" key="poi.street">Street</span>
															</td>
														</tr>
														<tr>
															<td>
																<input class="searchInput" type="text" style="width:50px;" name="number">
															</td>
															<td>
																<input id="street" class="searchInput vldRequired LV_valid_field" type="text" style="width:100px;display:inline-block;" name="street">
																<span class=" LV_validation_message LV_valid"></span>
																<span id="streetVld"></span>
															</td>
														</tr>
														<tr>
															<td>
																<span class="lm" key="poi.postcode">Postcode</span>
															</td>
															<td>
																<span class="lm" key="poi.towncity">Town/city</span>
															</td>
														</tr>
														<tr>
															<td>
																<input class="searchInput" type="text" style="width:50px;" name="postcode">
															</td>
															<td>
																<input id="city" class="searchInput vldRequired LV_valid_field" type="text" style="width:100px;display:inline-block;" name="city">
																<span class=" LV_validation_message LV_valid"></span>
																<span id="cityVld"></span>
															</td>
														</tr>
														<tr>
															<td colspan="2">
																<div>
															</td>
														</tr>
														<tr>
															<td align="right" colspan="2">
																<a onclick="searchAddress2();" href="javascript:void(0);">Search</a>
															</td>
														</tr>
													</tbody>
												</table>
                                               </div>
                                               
                                               <div id="idGenericPOIsearchResult"></div>
                                              
                                                
                                        </div>
                                    
					<div id="tab-places-recents" style="padding:0px;">
						<div class="contents"></div>
						  <div class="clearfix wp-admin-buttons" >
                <div id="adminRightAction"></div>
                <div id="refreshTabRecentPlaces">
                  <a href="javascript:void(0);" onclick="refreshTabRecentPlaces(); return false;" class="multi_user_button_refresh"><span>Refresh</span></a>
                </div>
            </div>
					</div>
					
					<div id="tab-places-enterprise" style="padding:0px;">
						<div class="contents"></div>
						<div class="clearfix wp-admin-buttons">
							<div id="adminRightAction">
								<a href="javascript:void(0);" id="editCategoryGroupAction" class="inactive" onclick="editCategoryGroupAction(this); return false;"><span></span></a>
							</div>
							<div id="refreshTabPlacesEnterprise">
								<a href="javascript:void(0);" onclick="refreshTabPlacesEnterprise(); return false;" class="multi_user_button_refresh"><span>Refresh</span></a>
							</div>
						</div>
					</div>
					<div id="tab-places-personal" style="padding:0px;">
						<div class="contents"></div>
						<div class="clearfix wp-admin-buttons" >
							<div id="adminRightAction">
								<a href="javascript:void(0);" id="editCategoryGroupActionPer" class="inactive" onclick="editCategoryGroupAction(this); return false;"><span></span></a>
							</div>						
							<div id="refreshTabPlacesPersonal">
								<a href="javascript:void(0);" onclick="refreshTabPlacesPersonal(); return false;" class="multi_user_button_refresh"><span>Refresh</span></a>
							</div>
						</div>
					</div>
				</div>
				
                                <!--
                                <div class="actions">
					<select id="tab_places_action_select" class="selectAction" disabled="disabled"></select>
					<input type="button" class="button goBtn" id="btn_tab_places_locate_selected" value="GO" />
				</div>
                                -->
                            
				<div class="actions">
					
					<ul class="action_button_bar clearfix">
						<li class="first">
							<a id="btn_tab-places_showOnMap" href="javascript:void(0);" class="multi_user_button_inactive">
								<span></span>
							</a>
						</li>
						<li class="second">
							<a id="btn_tab-places_newCategory" href="javascript:void(0);" class="multi_user_button_inactive">
								<span></span>
							</a>
						 </li>
						 <li class="third">
							<a id="btn_tab-places_Delete" href="javascript:void(0);" class="multi_user_button_inactive">
								<span></span>
							</a>
						 </li>
                         <li class="fourth">
							<a id="btn_tab-places_Pdf" href="javascript:void(0);" class="multi_user_button_inactive">
								<span></span>
							</a>
						 </li>
					</ul>

					  <!--
					  <select id="tab_users_action_select" class="selectAction" disabled="disabled"></select>
					  <input type="button" class="button goBtn" id="btn_tab_users_locate_selected" value="Go"/>
					  -->
				</div><!--end: actions-->
				
			</div><!--end:tab-places-->

			<div id="tab-routes">
				<div class="subtabs">
					<div class="subtabsCover">
						<ul>
							<li class="first">
								<a id="btn_tab-routes_routingTab" href="#tab-routes-routing"><lm name="routing.routing"/></a>
							</li>
							<li class="second">
								<a id="btn_tab-routes_savedRoutesTab" href="#tab-routes-savedRoutes"><lm name="welcome.myRoutes"/></a>
							</li>
						</ul>
						<div class="searchSavedRoutes" style="display:none;">
							<!--<input type="text" id="searchRoute"   class="searchInput" value="<#= $.i18n.prop('general.Search') #>" size="10" 
							onfocus="if (this.value==$.i18n.prop('general.Search')) { this.style.color='black'; this.value=''; }"
							onblur="if (this.value=='') { this.style.color='#7E7E7E'; this.value=$.i18n.prop('general.Search'); }"
							style="color:grey;width:215px;cursor:text" />
							-->
							<div class="search_container_route">
								<span class="search-wrap">
									<input id="searchRoute" class="search" value="Search" onfocus="if (this.value == $.i18n.prop('general.Search')) {this.value = '';}" onblur="if (this.value == '') {this.value = $.i18n.prop('general.Search');}" />
									<span class="searchMagnifier">&nbsp;</span>
								</span>
							</div>
						</div>
						<div class="container_bottom"></div>
					</div>		
					<div id="tab-routes-routing">
					</div>
					<div id="tab-routes-savedRoutes">
					</div>
				</div>
				
			</div>
			<!--<div id="tab-geofences">
				<p>
					N/A
				</p>
			</div>-->
		</div><!--end:tabsHolder-->
	</div><!--end:tabs-->
</div>

<div id="right">
<!--
	<div class="mapStyles">
		<div id="mapPanel" class="clearfix">
				<ul class="map_button_bar clearfix">
				  <li>
					<a class="map_button" id="btn_map_myLocation" href="javascript:void(0);" onclick="myLocationClicked(); return false"><span>My Location</span></a>
				  </li>
				  <li>
					<a class="map_button" id="btn_map_hybrid" href="javascript:void(0);" onclick="hybridMapButtonClicked(); return false"><span>Hybrid</span></a>
				  </li>
				  <li>
					<a class="map_button" id="btn_map_satellite" href="javascript:void(0);" onclick="satelliteMapButtonClicked(); return false"><span>Satelite</span></a>
				  </li>
				  <li>
					<a class="map_button" id="btn_map_street" href="javascript:void(0);" onclick="streetMapButtonClicked(); return false"><span>Map</span></a>
				  </li>
				  <li>
					<a class="map_button" id="btn_map_traffic" href="javascript:void(0);" onclick="trafficButtonClicked(); return false"><span>Traffic</span></a>
				  </li>
				   <li>
					<a class="map_button" id="btn_map_clear" href="javascript:void(0);" onclick="clearMapClicked(); return false"><span>Clear Map</span></a>
				   </li>
				</ul>
		</div>
	</div>
 -->

	<!--EDIT ARTERA-->
	<div id="menuMap">
	    <ul>
	        <li class="but" id="RouteFrom">
	        	<div class="onHover"><span><#= $.i18n.prop("tooltipmain.RouteFrom") #></span></div>	 
	        </li>
	        <li class="but" id="RouteTo">
	        	<div class="onHover"><span><#= $.i18n.prop("tooltipmain.RouteTo") #></span></div>
	        </li>
	        <li class="line"></li>
	        <li class="but" id="SavePlace">
	        	<div class="onHover"><span><#= $.i18n.prop("tooltipmain.SaveLocation") #></span></div>
	        </li>
	        <li class="line"></li>
	        <li class="but" id="ShowNearestUsers">
	        	<div class="onHover"><span><#= $.i18n.prop("tooltipmain.ShowNearestUsers") #></span></div>
	        </li>
	        <li class="line"></li>
	        <li class="but" id="PlanMeeting">
	        	<div class="onHover"><span><#= $.i18n.prop("tooltipmain.PlanAMeeting") #></span></div>
	        </li>
	        <script>
	        	$(function(){

          		
	        	});
	        </script>
	    </ul>
	    <div class="rightPart"></div>
	</div>

	<div id="rightMapWrapper"></div><!--EDIT ARTERA-->

	<!-- here goes the map -->
	<div id="legend">
		<ul>
			<li class="clearfix">
				<div class="color green"></div> <div class="name" key="trafficInfo.freeflowing"></div>
			</li>
			<li class="clearfix">
				<div class="color yellow"></div> <div class="name" key="trafficInfo.sluggish"></div>
			</li>
			<li class="clearfix">
				<div class="color red"></div> <div class="name" key="trafficInfo.slowstopped"></div>
			</li>
			<li class="clearfix">
				<div class="color black"></div> <div class="name" key="trafficInfo.Closed"></div>
			</li>
		</ul>
	</div>
</div>
<script language="Javascript">
$(document).ready(function(){
   
    $(document).click(function() {
        $('#menuMap').hide();
    });
	if(userConf.rights.create_meetings=== false){
		$("#PlanMeeting").addClass('blocked').css({opacity:0.5});
	}
  
    $("#btn_tab-routes_routingTab").click(function(){
    	$(".searchSavedRoutes").hide();
    	return false;
    });
    $("#btn_tab-routes_savedRoutesTab").click(function(){
    	$(".searchSavedRoutes").show();
    	return false;
    });
	listLocationNumber(); /* to call enterprise & personal number */        

	$('#search_places').focus(function(){
		if (this.value == $.i18n.prop('general.Search')) {
			this.value = '';
		}
		$('#tab-places .subtabsCover .searchReset').show();
		$('#tab-places .subtabsCover .searchMagnifier').hide();

	});
	$('#search_places').focusout(function(){
		if (this.value == '') {
			this.value = $.i18n.prop('general.Search');	
			$('#tab-places .subtabsCover .searchMagnifier').show();
			$('#tab-places .subtabsCover .searchReset').hide();
		}
	});	
	
	$('#btn_places_search_reset').click(function(){
		$('#search_places').attr('value' , $.i18n.prop('general.Search') );
		$('#tab-places .subtabsCover .searchMagnifier').show();
		$('#tab-places .subtabsCover .searchReset').hide();
		$('#tab-places-recents').show();
		$('#tab-places-enterprise').show();
		$('#tab-places-personal').show();
		$('#idGenericPOIsearchResult').hide();
		//reload data refresh
		
		/*
		 var ts=leftPanel.tabPlacesSubTabs.tabs('option', 'selected');

      switch(ts) {
        case 0:
          places.getRecents();
        break;
        case 1:
          places.getEnterprise();
        break;
        case 2:
          places.getPrivate();
        break;
      }*/

	});
});
</script>