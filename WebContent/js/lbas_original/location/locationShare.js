var shareList = new Array();
var shareListCounter = 0;

function addNewRow(emailOrMsisdn) {
	var validator=new Validator({
		shareName: {
			domElement: '#dialog #emailOrSms',
			validate: 'emailorsms'
		}}
	);
	var fieldErrors={}
	var tx = $('#emailOrSms','#dialog' ).val();
    if ( tx == $.i18n.prop('tooltipshare.emailOrSmsTextValue') || !validator.settings["shareName"].validation(tx)) {
    	fieldErrors["shareName"]=[$.i18n.prop('error.correct.invalid.fields')];
    	errorsOnDialog(fieldErrors);
    	return;
    }
	
    function errorsOnDialog(serverErrors) {
		var el = validator.parseServerErrors(serverErrors);
		showErrorShare(el)
	}

	shareListCounter++;
	var tVal = $("#emailOrSms").val();
	var tableStr = "<tr id='row_" + shareListCounter + "' style= 'display:block' ><td id='rowtd_" + shareListCounter + "'  > " + tVal
			+ "</td><td style='padding-left:10px;'><a href='#' onClick='removeRow($(\"#row_" + shareListCounter + "\")); return false;' ><img src='" + contextPath
			+ "/images/delete_resize1.png' border='0'/></a></td></tr>";

	$("#shareTable").append(tableStr);

	if ($("#shareTable tr[id^='row_'] ").html() != null) {
		$("#3rdPartyShareTr").show();
		$('.shareWithMailPhone .purple_button').removeClass('inactive').css({'opacity':1});


	}
	
}

function removeRow(objRow) {
	objRow.remove();
	if ($("#shareTable tr[id^='row_'] ").html() == null) {
		$("#3rdPartyShareTr").hide();
		$('.shareWithMailPhone .purple_button').addClass('inactive').css({'opacity':0.5});
	}
}

function showErrorShare(list) {
	$('#error-view-share > div.content-cell >span','#dialog').html($.i18n.prop('error.send.title'));
	$('#error-view-share > div > ul','#dialog').empty().append(list);
    $('#error-view-share','#dialog').show();
}


function share3rdParty(poiDetail) {
  
  
	if ($('.shareWithMailPhone .purple_button').hasClass('inactive')){
		return false;
	}
	shareList = new Array();
	$("#shareTable td[id^='rowtd_'] ").each(function(){
		shareList[shareList.length] = $(this).text().trim();
	});
	var validator=new Validator({
		shareName: {
			domElement: '#dialog #emailOrSms',
			validate: 'emailorsms'
		}
		});
    function errorsOnDialog(serverErrors) {
		var el = validator.parseServerErrors(serverErrors);
		showErrorShare(el);
	}
	
	$.ajax({
		url :'share3rdParty.action',
		type :'POST',
		async :false,
		data :{
			shareListArray :shareList,
			latitude :poiDetail.latitude,
			longitude :poiDetail.longitude,
			address : poiDetail.address,
			name :(poiDetail.name || poiDetail.address),
			radius :poiDetail.radius,
			poiId:poiDetail.id
		},
		dataType :'json',
		success :function(json) {
			if (checkResponseSuccess(json,errorsOnDialog)){
				$('span.ui-icon-closethick:last').click();
			}
		}
	});
	return false;
}