<!--
<div class="searchPart">
			<div id="searchMessageArea" class="modBorder">
				
        <input type="text" id="searchMessageInput" class="searchInput"
							value="" size="10"
							$.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchMessages')
							onfocus=""
							onblur="">
				<a href="javascript:void(0);" style="color: #FFFFFF;margin-left:0px">
					<img id="search" src="images/mg_icon_small.png" />
				</a>
			</div>
</div>
-->

<div id="inbox">
	 
</div>
<div id="messageDiv">
  <div class="searchPart">
			<div id="searchMessageArea" class="modBorder">
				
        <input type="text" id="searchMessageInput" class="searchInput"
							value="" size="10"
							$.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchMessages')
							onfocus=""
							onblur="">
<!-- 				<a href="javascript:void(0);" class="search-ico magnifier"></a> -->
			</div>
			<a href="javascript:void(0);" class="search-bt"></a>
</div>
  <div id="ajax-message"></div>
	<!-- NEW
<div id="messages-container">

  	
    <ul>
  		<li class="searchPart">
  			<div id="searchMessageArea" class="modBorder">

          <input type="text" id="searchMessageInput" class="searchInput"
  							value="" size="10"
  							$.i18n.prop('inbox.search')+" "+$.i18n.prop('inbox.searchMessages')
  							onfocus=""
  							onblur="">
  				<a href="javascript:void(0);" style="color: #FFFFFF;margin-left:0px">
  					<img id="search" src="images/mg_icon_small.png" />
  				</a>
  			</div>
  		</li>
  	</ul>
  	<div class="ulcover"></div>
  	<div id="ajax-content"></div>
	
	
	</div>
--><!-- messages-container -->
	
	
  <!-- NEW
<div id="sendMessageDialog" style="display:none"></div>
  <div id="confirmDelete" style="display:none">
    <h2 class="dialog_text"><#= $.i18n.prop('messages.alert.delete') #>?</h2>
    <div class="button_class dialog_action">
      <button aria-disabled="false" role="button" class="send ui-button ui-widget ui-button-text-only purple_button no-border" type="button"><span style="line-height:2.5em !important" class="ui-button-text"><#= $.i18n.prop('buttons.delete') #></span></button>       
      <button onclick="javascript:utils.closeDialog()" aria-disabled="false" role="button" class="cancel ui-button ui-widget  ui-button-text-only no-border" type="button"><span style="line-height:2.5em !important" class="ui-button-text"><#= $.i18n.prop('buttons.cancel') #></span></button>
    </div>
  </div>
-->

	
</div><!-- messageDiv -->


<script type="text/javascript">

	$(window).resize(function() {
		styleMessages();
	});
	
	/* NEW
$(function() {

		$( "#messages-container" ).tabs( "option", "selected", 0 );
	});
*/
	
</script>