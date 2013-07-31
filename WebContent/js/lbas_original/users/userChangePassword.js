var aPage  = false;

function openPasswordChangeDialog(tooltipClass) {

	$('#upsw1').val('');
	$('#upsw2').val('');
	$("#userChangePasswordDialog").dialog({
		title :name,
		bgiframe :true,
		width :400,
		modal :glbmodal,
		resizable :false,
		close :function(event, ui) {
			$("#userChangePasswordDialog").dialog('destroy');

			$('.displayTitleOnArrowToolTip').remove();
			$('.displayTitleOnArrowToolTipIE').remove();

		}
	}).height("auto");

	displayTitleOnToolTipForForm("userChangePassword", "top center", tooltipClass, true);
}

function updateUserPassword(serializedFormData) {

	if (!serializedFormData) {
		serializedFormData = $("#userChangePassword").serialize();
	}
	$.post("userChangePassword.action", serializedFormData, function(data) {
		if (checkResponseSuccess(data)) {
			$('span.ui-icon-closethick:last').click();
			$('#changePswddMsj').show();
		}
	}, 'json');

}


function timeMsg() {
  setTimeout(alertMsg, 2000);
}

function alertMsg() {
  $('.noCloseNoOk').fadeOut(2000, function() {
    $('.noCloseNoOk .ui-dialog-buttonset button').click();
  });
}


function forgotUsernamePassword() {
  var btns = {};
  	var loadTemp;
  		$.ajax({
  			url: "./pages/template/forgotUsernamePasswordTemplate.html",
	  		success: function(json){
		  		loadTemp = json;
	  		}
  		}).done(function(){

		  utils && utils.dialog({
		    content :loadTemp, /*  parseTemplate("forgotUsernamePasswordTemplate", {}), */
		    title: $.i18n.prop('forgotPassword.enterMsisdnEmail', [$.i18n.prop('msisdn')], [$.i18n.prop('email')]),
		    buttons : btns,
		    css: 'forgotUsernamePassword',
		    close :function(event, ui) {
				  $("#forgotUsernamePasswordDialog").dialog('destroy');
				}
		  });
		
		  $("label[for='email']").text($.i18n.prop('email'));
		  $("label[for='msisdn']").text($.i18n.prop('msisdn'));
		  $('#forgotUsernamePasswordForm .send .ui-button-text').text($.i18n.prop('buttons.ok'));
		  /* POSITION DIALOG*/
		  var dialogWidth = $('.ui-dialog').outerWidth();
		  $('.ui-dialog').css({
		      'top': '170px',
		      'margin-left': -dialogWidth/2,
		      'width':'450px',
		      'left':'50%'
		  });
		  
		  
		  $('.ui-dialog').find('button.send')
		    .mousedown(function(){
		        var email_val = $('.ui-dialog').find('#email').val();
		        var mobile_val = $('.ui-dialog').find('#msisdn').val();
		        var form = $('.ui-dialog #forgotUsernamePasswordForm');
		        $(this).addClass('purple_button_active');
		        
		        $.ajax({
		    		  url :"requestNewPassword.action",
		    		  type :'POST',
		    		  data :{
		      		  email: email_val,
		      		  msisdn: mobile_val
		    		  },
		    		  dataType :'json',
		    		  success :function(json) {
		    			 if (checkResponseSuccess(json)) {
		      			 //utils.closeDialog();
		      			 utils.closeDialog();utils && utils.dialog({
		      			   content : "<div class='successMessageCheck'>" + json.infoMessage +"</div>",
		      			   css: 'noCloseNoOk'
		      			 });
		      			 $(".noCloseNoOk").hide();
		      			 $(".noCloseNoOk").show();
		      			 timeMsg(); // fadeout for success message
		    			 }
		    			}
		    		});
		    		
		    })
		    .mouseup(function(){
		        $(this).removeClass('purple_button_active');
		    })
		    .mouseenter(function(){
		        $(this).addClass('purple_button_over');
		    })
		    .mouseleave(function(){
		        $(this).removeClass('purple_button_over');
		    });

  });
/*

	$.get("forgotUsernamePassword", function(data) {
		$("#forgotUsernamePasswordDialog").html(data);
		$("#forgotUsernamePasswordDialog").dialog({
			title :name,
			width :350,
			bgiframe :true,
			modal :glbmodal,
			resizable :false,
			close :function(event, ui) {
				$("#forgotUsernamePasswordDialog").dialog('destroy');
			}
		}).height("auto");

	});
*/
}

function requestPassword() {
	var serializedFormData = $("#requestNewPassword").serialize();

	$.post("requestNewPassword", serializedFormData, function(data) {
		if (checkResponseSuccess(data)) {
			$('span.ui-icon-closethick:last').click();
			if (data.messageText != null) {
				showInfoDialog(data.messageText);
			}
		}
	}, "json");
}