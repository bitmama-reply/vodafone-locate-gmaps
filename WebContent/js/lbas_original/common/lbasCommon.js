var contextPath;
var userLocale;
var lbasVersion;
var aPage = false;
var glbmodal = true;
var timer;
var timerOn=0;

var locationSearchMaxLimit;

jQuery.ajaxSettings.traditional = true;

String.prototype.setCharAt = function(index, chr) {
	if (index > this.length - 1){
		return str;
	}
	return this.substr(0, index) + chr + this.substr(index + 1);
};

function enterPressed(event) {
	var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
	if (keyCode == 13) {
		return true;
	} else {
		return false;
	}
}

var userRightsJson ;
var lbasRightManager ;
function initializeLBAS(showMap, latitude, longitude, zoom, userConfJson, simultaneousTileCount) {


	initializeErrorHandler();
	initializeLbasMessages();
	if (userConfJson){
		var userConf = jQuery.parseJSON(userConfJson);
		lbasRightManager = new LbasRightManager(userConf.rights);
		if (userConf.password_change_required == true) {
			var tooltipClass = "displayTitleOnArrowToolTip";
 			if ($.browser.msie) {
 				tooltipClass = "displayTitleOnArrowToolTipIE";
 			}
			openPasswordChangeDialog(tooltipClass);
		}
		setTimeout("updateUnreadMessageCount("+userConf.refresh_mail_period+")",userConf.refresh_mail_period);

		setTimeout("groupUsersAutoRefresh("+userConf.refresh_mail_period+")",userConf.refresh_mail_period);

		locationSearchMaxLimit = userConf.location_search_max_limit;
	}
	if (showMap) {
		// initializeWayFinderMap(latitude, longitude, zoom);
		var centerpHeight = parseInt($('#centerP').css('height'));
		var centerpWidth = parseInt($('#centerP').css('width'));

		$('#lbasMainMap').css( {
			height :centerpHeight + 'px',
			width :centerpWidth + 'px'
		});
		 initLbasMap(latitude, longitude, zoom, simultaneousTileCount);
	}

}

function initializeErrorHandler() {

	$("#errorDiv").ajaxComplete( function(evt, request, settings) {

		var openErrordialog = false;
		var openInfodialog = false;
		if (request == undefined) {
			return false;
		} else if (request.responseText.indexOf("errorMessage") > 0) {

			$("#errorDiv").html(request.responseText);
			openErrordialog = true;

		} else if (request.responseText.indexOf("errorText") > 0 || request.responseText.indexOf("messageText") > 0) {

			var jsonData = eval('(' + request.responseText + ')');

			if (jsonData.errorText != null) {

				var errorText = jsonData.errorText;

				$("#errorMessage [id*='errorText']").text(errorText);

				openErrordialog = true;

			}
			if (jsonData.messageText != null) {

				var messageText = jsonData.messageText;

				$("#infoMessage [id*='infoText']").text(messageText);

				openInfodialog = true;

			}

		}

		var btns = {};
		btns[$.i18n.prop('buttons.ok')] =   function() {
			$(this).dialog('close');
			$(this).dialog('destroy');
		};
		if (openErrordialog) {
			$( function() {
				$("#errorMessage").dialog( {
					title : $.i18n.prop('dialog.error'),
					bgiframe :true,
					width :300,
					modal :glbmodal,
					resizable: false,
					buttons : btns
				}).height("auto");
			});

		}
		if (openInfodialog) {
			$( function() {
				$("#infoMessage").dialog( {
					title : $.i18n.prop('dialog.info'),
					bgiframe :true,
					resizable: false,
					width :300,
					buttons : btns
				}).height("auto");
			});
		}

		initializeLbasMessages();
	});

	$("#logoutDiv").ajaxComplete( function(e, xhr, set) {

		if (xhr == undefined) {

			return false;
		} else if (xhr.responseText.indexOf("login_indicator") > 0) {

			window.location = "logout.action";
		}

	});

	$("#adminLogoutDiv").ajaxComplete( function(e, xhr, set) {

		if (xhr == undefined) {

			return false;
		} else if (xhr.responseText.indexOf("login_indicator") > 0) {

			// window.location = "adminLogout.action";
			window.location = "logout.action";
		}

	});

// $("#errorDiv").ajaxStop( function() {
// initializeLbasMessages();
//
// });

}

function initializeLbasMessages() {
	var mkey, mparams;
	$('lm').each( function() {

		mkey = $(this).attr('name');
		mparams = $(this).attr('params');
		if (mparams != null && mparams.length > 0) {

			$(this).replaceWith("<span class='lm' key='"+mkey+"'>"+$.i18n.prop(mkey, mparams.split(','))+"</span>");

		} else {

			$(this).replaceWith("<span class='lm' key='"+mkey+"'>"+$.i18n.prop(mkey)+"</span>");
		}
	});

}

function fillBoxIncludedErrors(id) {
	
	
	
}




function showErrorDialog(errorText, modal,form) {
	/*if(form != undefined) {
		switch(form) {
			case "3rdPartyShare":
				var validator=new Validator({
				 shareName: {
			        domElement: '#dialog #emailOrSms',
			         validate: 'emailorsms'
			      }
			    });
				
				
				var fieldErrors={}
				fieldErrors["shareName"]=[errorText];
				$('#error-view-share > div.content-cell >span','#dialog').html($.i18n.prop('error.send.title'));
				$('#error-view-share > div > ul','#dialog').empty().append(validator.parseServerErrors(fieldErrors));
		    	$('#error-view-share','#dialog').show();
				return;
			break;
		}
	}*/
	
	
	utils && utils.dialog({title: $.i18n.prop('dialog.error'), content: errorText})
}

function showInfoDialog(infoText) {
	if (infoText) {
		$("#infoMessage [id*='infoText']").text(infoText);
	}
	var btns = {};
	btns[$.i18n.prop('buttons.ok')] =   function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
	};
	$("#infoMessage").dialog( {
		title : $.i18n.prop('dialog.info'),
		bgiframe :true,
		width :300,
		modal :false,
		buttons : btns,
		resizable :false,
		close :function(event, ui) {
			$("#infoMessage").dialog('destroy');
		}
	}).height("auto");
}
function checkResponseSuccess(data, errorCallback) {
	var toReturn = true;
	var content = '';
	var title = $.i18n.prop('dialog.title.error');
	if (data.errorText) {
		content = data.errorText;
		toReturn = false;
	} else if (data.length && data.indexOf("errorMessage") > 0) {
		toReturn = false;
	} else if (data.length && data.indexOf("errorText") > 0) {
    	var jsonData = eval('(' + data + ')');
		if (jsonData.errorText != null) {
			toReturn = false;
    	}
	} else if (!$.isEmptyObject(data.fieldErrors) || (data.fieldErrors && data.fieldErrors.length > 0) ) {
		content = '';
		$.each(data.fieldErrors, function(i, k){
	      content += ' ';
				if($.isArray(k)){
					$.each(k, function(i, v){
						content += v + ' ';
					});
				}
				content += '<br>';
			});
	    toReturn = false;
	} else if (!$.isEmptyObject(data.actionErrors)) {
		toReturn = false;
	} else if(data.authorizationMessage != undefined){
	  content = data.authorizationMessage;
    toReturn = false;
  }

	if(!toReturn) {
	  var authorizationMessage = data.authorizationMessage ;
	  if(authorizationMessage) resetViewOnAuthorizationError();
	  var error_data=data.fieldErrors || data.actionErrors || data.authorizationMessage || data;
	    if (errorCallback && errorCallback.call && !authorizationMessage) {
	    	errorCallback(error_data);
	    } else {
	      if($("#sendMessage").length > 0 && !authorizationMessage) {
          composeMessageDialogManager.showErrorCallback(error_data);
	      }else{
	        utils && utils.dialogError({title: title, content: content, css:"error-dialog-generic-error"});
	      }
	    }
	}
	return toReturn;
}

function resetViewOnAuthorizationError () {
  /* RESET EVENTUALLY LOADER*/
   $('#tabs .subtabs .contents > ul > li').find('span.loader-group').hide();
   /* CLOSE EDIT POPUP*/
   $('#tabs_in_enterpriseCategoryDialog').parents("#dialog").dialog("destroy");
   
  
}



function showhide(id) {
	if (document.getElementById(id).style.display == "none") {
		$('#' + id).show();
	} else {
		$('#' + id).hide();
	}
}
function getDay(timeStamp) {
	var d = new Date();
	d.setTime(timeStamp);
	var date = d.getDate();
	if (date < 10)
		return "0" + date.toString();
	else
		return date.toString();
}

function getMonth(timeStamp) {
	var d = new Date();
	d.setTime(timeStamp);
	var date = d.getMonth();
	if (date < 10)
		return "0" + date.toString();
	else
		return date.toString();
}

function getYear(timeStamp) {
	var d = new Date();
	d.setTime(timeStamp);
	var date = d.getFullYear();
	return date.toString();
}

function getHour(timeStamp) {
	var d = new Date();
	d.setTime(timeStamp);
	var date = d.getHours();
	if (date < 10)
		return "0" + date.toString();
	else
		return date.toString();
}

function getMinute(timeStamp) {
	var d = new Date();
	d.setTime(timeStamp);
	var date = d.getMinutes();
	if (date < 10)
		return "0" + date.toString();
	else
		return date.toString();
}

function getSecond(timeStamp) {
	var d = new Date();
	d.setTime(timeStamp);
	var date = d.getSeconds();
	if (date < 10)
		return "0" + date.toString();
	else
		return date.toString();
}

function getDate(timeStamp) {
	var month;
	var monthInt = parseInt(getMonth(timeStamp), 10) + 1;
	if (monthInt < 10)
		month = "0" + monthInt.toString();
	else
		month = monthInt.toString();
	return getDay(timeStamp) + "/" + month + "/" + getYear(timeStamp) + " " + getHour(timeStamp) + ":" + getMinute(timeStamp);
	// , "HH:MM, dd/mm/yyyy"
}

function getDateWithSecond(timeStamp) {
	var month;
	var monthInt = parseInt(getMonth(timeStamp), 10) + 1;
	if (monthInt < 10)
		month = "0" + monthInt.toString();
	else
		month = monthInt.toString();
	return getDay(timeStamp) + "/" + month + "/" + getYear(timeStamp) + " " + getHour(timeStamp) + ":" + getMinute(timeStamp) + ":" + getSecond(timeStamp);
}

function getHourMinute(timeStamp) {
	return getHour(timeStamp) + ":" + getMinute(timeStamp);
}

function getHourMinuteSecond(timeStamp) {
	return getHour(timeStamp) + ":" + getMinute(timeStamp) + ":" + getSecond(timeStamp);
}

function openHelp() {
	if (userLocale.toLowerCase() == 'de' || userLocale.toLowerCase() == 'ro') {
		window.open('http://www.business.vodafone.com/site/locate/help/'+userLocale.toLowerCase()+'/index.jsp');
	} else {
		window.open('http://www.business.vodafone.com/site/locate/help/en/index.jsp');
	}
}
function openPrivacy() {
	var url = location.href.substring(0, location.href.lastIndexOf('\/'));

	if (userLocale.toLowerCase() == 'de' || userLocale.toLowerCase() == 'ro') {
		window.open(url+'/privacy/'+userLocale.toLowerCase());
	} else {
		window.open(url+'/privacy/en');
	}
}
function openHelpAdm() {
	if (userLocale.toLowerCase() == 'de' || userLocale.toLowerCase() == 'ro') {
		window.open('http://www.business.vodafone.com/site/locate/help/'+userLocale.toLowerCase()+'/admin_index.jsp');
	}else {
		window.open('http://www.business.vodafone.com/site/locate/help/en/admin_index.jsp');
	}
}
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /* , from */)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}



function getIEBrowserVersion(){
	if ($.browser.msie) {
		userAgent = $.browser.version;
		userAgent = userAgent.substring(0, userAgent.indexOf('.'));
		version = userAgent;
		return version;
	}
}

function initUploadPage(fileType) {

	$(document).ready(function() {
		$('#uploadForm').ajaxForm({
			target :'#uploadOutput',
			success :function(response) {
				if (checkResponseSuccess(response)) {
					if(fileType != undefined && $.trim(fileType) != "" && fileType == "image") {
						initJcrop();
					}
				}
			}
		});
	});
}

function openUploadFileDialog(fileType,uploadType) {

	var dialogTitle="";
	var templateFileName="";
	var templateFileText="";
	var formActionName="";

	if(fileType != undefined && $.trim(fileType) != "") {
		if(fileType == "user") {
			dialogTitle = $.i18n.prop("import.user.title");
			templateFileName = "TemplateForUserUpload.xls";
			templateFileText = $.i18n.prop("import.user.text");
			formActionName = "uploadUserFile";
		} else if(fileType == "asset") {
			dialogTitle = $.i18n.prop("import.asset.title");
			templateFileName = "TemplateForAssetUpload.xls";
			templateFileText = $.i18n.prop("import.asset.text");
			formActionName = "uploadAssetFile";
		} else if(fileType== "poiCategory") {
			dialogTitle = $.i18n.prop("import.poi.category.title");
			templateFileName = "TemplateForPoiAndCategoryUpload.xls";
			templateFileText = $.i18n.prop("import.poi.category.text");
			formActionName = "uploadPoiCategoryFile";
		} else if(fileType== "image") {
			dialogTitle = $.i18n.prop("buttons.uploadIcon");
			formActionName = "uploadImage";
		}
	}

	$("#UploadFileDialog").dialog({
		autoOpen: false,
		title : dialogTitle,
		position :'center',
        modal: glbmodal,
        width: 430,
        bgiframe: true,
        resizable :false,
		close :function(event, ui) {

			if(fileType != undefined && $.trim(fileType) != "") {
				if(fileType == "user") {
					$('#userList').load('listusers.action');
				} else if(fileType == "asset") {
					$('#assetList').load('listAssets.action');
				} else if(fileType== "poiCategory") {
					loadAdminCategoryList();
				}
			}

			$("#UploadFileDialog").dialog("destroy");
		}
	}).height("auto");

	$('#UploadFileDialog').html(
			parseTemplate("uploadTemplate",
					{
				fileType : fileType,
				uploadType :uploadType,
				templateFileName : templateFileName,
				templateFileText : templateFileText,
				formActionName : formActionName
				}));

	// $("[aria-labelledby ='ui-dialog-title-UploadFileDialog']").css("z-index", "5003");

	$("#UploadFileDialog").dialog("open");
	 initUploadPage(fileType);
	 $("#UploadFileDialog").height(410);

}

function showLoadingIcon(){
	var centerpHeight = parseInt($('#centerP').css('height'));
	var centerpWidth = parseInt($('#centerP').css('width'));

	$("#loadingIcon").css("top",centerpHeight/2);
	$("#loadingIcon").css("left",centerpWidth/2);

	$("#loadingIcon").show();

	if (!timerOn)
	  {
		timerOn=1;
		setTimerValue();
	  }
}

function hideLoadingIcon(){
	$("#loadingIcon").hide();
	clearTimeout(timer);
	timerOn=0;
}

function setTimerValue()
{
	timer=setTimeout("hideLoadingIcon()",60000);
}


function validateHours(fromHourMinute, toHourMinute) {
	var hourFrom = fromHourMinute.substring(0, fromHourMinute.indexOf(":"));
	var minuteFrom = fromHourMinute.substring(fromHourMinute.indexOf(":") + 1, fromHourMinute.length);

	var hourTo = toHourMinute.substring(0, toHourMinute.indexOf(":"));
	var minuteTo = toHourMinute.substring(toHourMinute.indexOf(":") + 1, toHourMinute.length);

	var today = new Date().getTime();

	var startTime = new Date(getYear(today), getMonth(today), getDay(today), hourFrom, minuteFrom).getTime();
	var stopTime = new Date(getYear(today), getMonth(today), getDay(today), hourTo, minuteTo).getTime();

	if (startTime > stopTime) {
		if (hourTo == "00" && minuteTo == "00"){
			return true;
		}else{
			showErrorDialog($.i18n.prop('error.invalid.dateFormat'), true);
			return false;
		}
	}

	return true;
}

function displayTitleOnToolTipForForm(formName, position, tipClass, mouseOverEvent) {

	elementId = formName + " :input[title]";

	var api={};
	if (mouseOverEvent) {

		api = $("#" + elementId).tooltip({ // select all desired input fields and attach tooltips to them
			tipClass :tipClass, // use div.tooltip as our tooltip
			position :position, // place tooltip on the right edge
			offset :[ -2, 10 ], // a little tweaking of the position
			effect :"fade", // use the built-in fadeIn/fadeOut effect
			opacity :0.7, // custom opacity setting
			events :{
				def :"mouseover,mouseleave", // default show/hide events for an element
				input :"focus mouseover,blur mouseleave" // for all input elements
			},
			delay :0, // there is no delay when the mouse is moved away from the trigger
			api:true
		});

	} else {

		api = $("#" + elementId).tooltip({ // select all desired input fields and attach tooltips to them
			tipClass :tipClass, // use div.tooltip as our tooltip
			position :position, // place tooltip on the right edge
			offset :[ -2, 10 ], // a little tweaking of the position
			effect :"fade", // use the built-in fadeIn/fadeOut effect
			opacity :0.7, // custom opacity setting
			delay :0, // there is no delay when the mouse is moved away from the trigger
			api:true
		});

	}
	return api;
}

function displayTitleOnToolTip(elementName, position, tipClass, mouseOverEvent) {

	elementId = elementName + "[title]";

	var api;
	if (mouseOverEvent) {

		api = $("#" + elementId).tooltip({ // select all desired input fields and attach tooltips to them
			tipClass :tipClass, // use div.tooltip as our tooltip
			position :position, // place tooltip on the right edge
			offset :[ -2, 10 ], // a little tweaking of the position
			effect :"fade", // use the built-in fadeIn/fadeOut effect
			opacity :0.7, // custom opacity setting
			events :{
				def :"mouseover,mouseleave", // default show/hide events for an element
				input :"focus mouseover,blur mouseleave" // for all input elements
			},
			delay :0, // there is no delay when the mouse is moved away from the trigger
			api:true
		});

	} else {

		api = $("#" + elementId).tooltip({ // select all desired input fields and attach tooltips to them
			tipClass :tipClass, // use div.tooltip as our tooltip
			position :position, // place tooltip on the right edge
			offset :[ -2, 10 ], // a little tweaking of the position
			effect :"fade", // use the built-in fadeIn/fadeOut effect
			opacity :0.7, // custom opacity setting
			delay :0, // there is no delay when the mouse is moved away from the trigger
			api:true
		});

	}
	return api;
}

function unEscapeHtmlEntity(val) {

	if (val && val != null) {
		return val.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '\"');
	}
}

function escapeHtmlEntity(val) {

	if (val && val != null) {
		return val.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
	}
}

function validateIPAddress(IPAddress){
	var pattern1 = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;	var pattern2 = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.\*$/;
	var pattern3 = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.\*$/;
	var pattern4 = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.\*$/;
	var pattern5 = /^\*$/;

	if (pattern1.test(IPAddress) || pattern2.test(IPAddress) || pattern3.test(IPAddress) || pattern4.test(IPAddress) || pattern5.test(IPAddress)) {
		// validation is successfull
		return true;
	}else{
		return false;
	}
}

// DEFINIZIONE DI VALIDATOR
/*

USO:

var validator = new Validator({
    nomeAttributoDalServer: {
      domElement:     'query per jquery o funzione che torna il dom del campo (la funzione accetta un parametro, se == 'focus' si aspetta il campo a cui dare il focus - se diverso). Se omesso viene usato il nomeAttributoDalServer',
      tooltip:        'query per jquery o funzione che ritorna il tooltip. Se omesso viene usato .tooltip-alert-nomeAttributoDalServer',
      validate:       'stringa o funzione. se è una stringa è una delle validazioni già presenti di default (al momento solo presence) se è una funzione deve tornare true per valido e false per non valido (se richiesto viene passato il value attuale del campo).ù
                      Per ulteriore nota sulle validazioni di default vedi DEFAULT_VALIDATIONS più sotto',
      defaultMessage: "value", 'stringa che identifica un eventuale messaggio di default messo dal server nel campo e da eliminare'
    }
  });


validator.parseServerErrors(errors)
controlla e mostra gli errori come arrivati dal server (obj di errori formato json)
per un esempio vedi messaging.js o calendar.js

DEFAULT_VALIADTIONS
oltre alle validazioni di default configurabili tramite stringa, sono presenti anche delle funzioni che costruiscono in automatico le funzioni di validazione, passando e rendendo di default alcuni parametri.
Es: DEFAULT_VALIDATIONS.limit(options) accetta come opzioni min e max e torna una funzione che valida se il value è compreso tra min e max.
Al momento limit è l'unica funzione presente.


ACCORTEZZE HTML/CSS
- le lightbox devono essere rese overflow:visible, aggiungendo la classe overflow-not-hidden al div ui-dialog
es: $('div.ui-dialog').addClass('overflow-not-hidden');

- i tooltip devono essere presenti in pagina fin dall'inizio, ma non è necessario che contengano il messaggio di errore (viene comunque sovrascritto da quello che arriva dal server al momento della validazione)
  i toolip devono avere la classe: tooltip-alert-generic-left
es: <div class="tooltip-alert-generic-left tooltip-alert-nomeAttributoDalServer"><span></span></div>

*/

(function(win, $) {

  DEFAULT_VALIDATIONS = {
    presenceFn: function(value) {
      return !!value;
    },
    presence: function() {
      return DEFAULT_VALIDATIONS.presenceFn;
    },
    none: function() {
      return true;
    },
    limit: function(options) {
      return function(value) {
        return (value && value.length <= options.max && value.length >= options.min);
      };
    },
    presencelist: function(options) {
      return function(value) {
        return value.children().length >1
      };
    },
    emailorsms: function(value) {
      return function(value) {
      	var patt=/((^[0-9]{0,15}$)|(^\+[0-9]{0,15}$))|(([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$)/i;
      	return patt.test(value)
      };
    },
    isEmail: function(value){
      return function(value) {
      	var patt=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      	return patt.test(value)
      };
    },
    isvaliddate: function (dt) {
    	return function(value) {
    	if(value == undefined) return false
    	var txtDate=value.toString();
	    var aoDate, ms, month, day, year;
		var separator = '/';
		aoDate = txtDate.split(separator);
	    if (aoDate.length !== 3) {
	        return false;
	    }
	    month = aoDate[1] - 1; 
	    day = aoDate[0] - 0;
	    year = aoDate[2] - 0;
	    if (year < 1000 || year > 3000) {
	        return false;
	    }
	    ms = (new Date(year, month, day)).getTime();
	    aoDate = new Date();
	    aoDate.setTime(ms);
	    if (aoDate.getFullYear() !== year ||
	        aoDate.getMonth() !== month ||
	        aoDate.getDate() !== day) {
	        return false;
	    }
	    return true;
	};
	}
  };

  function blankValidation() {
    return true;
  }

  function buildGetElement(domElement) {
    if (domElement.call) {
      return domElement;
    }
    else {
      
      return function() { 
      	return $(domElement); 
      };
    }
  }

  function buildValidation(validate) {

    if (validate) {
      if (validate.call) {
        return validate;
      }
      else {
      	
        if (validate in DEFAULT_VALIDATIONS) {
          return DEFAULT_VALIDATIONS[validate.toLowerCase()]();
          
        }
        else {
          return blankValidation();
        }
      }
    }
    else {
      return blankValidation();
    }
  }

  function buildGetTooltip(attributeName, tooltip) {
    if (tooltip) {
      if(tooltip.call) {
        return tooltip;
      }
      else {
        return function(){ return $(tooltip); };
      }
    }
    else {
      return function() { return $('.tooltip-alert-' + attributeName); };
    }
  }

  function buildHandleErrorMessageClick(validator) {
    return function(ev) {
      var attributeName, attribute, element, el = $(this);

      ev.preventDefault();
      attributeName = el.data('attribute-name');
      if(validator.settings == undefined) return;
      attribute = validator.settings[attributeName];
      if(attribute == undefined) return;
      element = attribute.getElement();

      hideHighlightedFields();
      hideAllTooltips();
	
	  var value_subject;
	  switch(attribute.validate) {
	  	case "presencelist":
		  	value_subject=element;
		  	break;
	  	default:
	  		value_subject=element.val();
	  }
      if (attribute.validation(value_subject)) {
        highglightElementCorrect(element);
      }
      else {
      	highglightElementError(element);
        showAndPositionateTooltip(attribute.getTooltip(), element);
      }
      initListener(validator, attributeName);
    };
  }

  function hideHighlightedFields() {
    $('.verified-input-highlight').removeClass('verified-input-highlight');
    $('.error-input-highlight').removeClass('error-input-highlight');
  }

  function hideAllTooltips() {
    $('.tooltip-alert-generic-left').hide();
  }

  function buildElementListener(validator, attributeName) {
    return function() {
      var attribute, el, elFocus;

      attribute = validator.settings[attributeName];

      removeHighlightElement(attribute.getElement());
      hideTooltip(attribute.getTooltip());
      attribute.getElement('focus').unbind('focus.validator');
    };
  }

  function showAndPositionateTooltip(tooltip, attributeField) {
  	if(tooltip.length == 0) return 
    var fieldOffset, offsetParent, parentOffset, tooltipTop, tooltipLeft;
    tooltip.show();

    offsetParent = tooltip.offsetParent();
    parentOffset = offsetParent.offset();
    fieldOffset = attributeField.offset();

    tooltipTop = fieldOffset.top - parentOffset.top  + (attributeField.outerHeight() / 2) - (tooltip.outerHeight() / 2);
    tooltipLeft = fieldOffset.left - parentOffset.left + attributeField.outerWidth() + 5;

    tooltip.css({
      top: tooltipTop,
      left: tooltipLeft
    });
  }

  function hideTooltip(tooltip) {
    tooltip.hide();
  }

  function highglightElementCorrect(element) {
    element.addClass('verified-input-highlight');
  }

  function highglightElementError(element) {
    element.addClass('error-input-highlight');
  }

  function removeHighlightElement(element) {
    element.removeClass('error-input-highlight');
    element.removeClass('verified-input-highlight');
  }

  function resetFields(validator) {
    var attributeName, el,
        settings = validator.settings;

    for(attributeName in settings) {
      attribute = settings[attributeName];
      el = attribute.getElement();
      if (el.val() === attribute.defaultMessage) {
        el.val('');
      }
    }
  }

  function setupTooltips(validator, errors) {
    var attributeName, attributeErrors, errorMessage, i, len, attribute,
        settings = validator.settings;

    for (attributeName in errors) {
      attributeErrors = errors[attributeName];

      if ($.isArray(attributeErrors)) {
        for(i = 0, len = attributeErrors.length; i < len; i++) {
	          errorMessage = attributeErrors[i];
	          if(settings) { 
	          	attribute = settings[attributeName];
		          if (attribute) {
		            attribute.getTooltip().find('span').html(errorMessage);
		          }
	        }
        }
      }
    }
  }

  function buildErrorsBox(validator, errors) {
    if(errors.errorText) errors['errorText']=[errors.errorText];
    
    var errorObj, attributeName, attributeErrors, errorMessage, i, len, elements, list = [];
    for (attributeName in errors) {
      attributeErrors = errors[attributeName];
      if ($.isArray(attributeErrors)) {
        for(i = 0, len = attributeErrors.length; i < len; i++) {
          errorMessage = attributeErrors[i];
			list.unshift('<li><a href="#" class="js-error-message" data-attribute-name="' + attributeName.replace('"', '&quot;')  + '">'+ errorMessage +'</a></li>');
        }
      }
    }
    elements = $(list.join(''));
    $(elements).find('.js-error-message').click(buildHandleErrorMessageClick(validator));

    return elements;
  }
  function updateErrorView() {
  	
  }
  function getHtmlGenericContainer() {
  	return '<div id="error-view-sendmessage"><div class="content-cell"><span><#= $.i18n.prop("error.send.title") #></span><ul id="send-list-wrapper"></ul></div></div>';
  	
  }
  function initListener(validator, attributeName) {
    var attribute = validator.settings[attributeName],
        listener;

    listener = buildElementListener(validator, attributeName);
    attribute.getElement('focus').unbind('focus.validator').bind('focus.validator', listener);
  }

  function init(validator) {
  	if(!validator) return;
    var attribute, attributeName, settings = validator.settings;
	if(settings) {
	    for (attributeName in settings) {
	      attribute = settings[attributeName];
	      attribute.getElement = buildGetElement(attribute.domElement);
	      attribute.validation = buildValidation(attribute.validate);
	      attribute.getTooltip = buildGetTooltip(attributeName, attribute.tooltip);
	    }
	}
  }

  function Validator(settings) {
    this.settings = settings;
    init(this);
  }

  Validator.prototype.buildSuccessMessage= function(msg) {
  };
  
  Validator.prototype.parseServerErrors = function(errors) {
    resetFields(this);
    setupTooltips(this, errors);
    return buildErrorsBox(this, errors);
  };

  win.Validator = Validator;
  win.DEFAULT_VALIDATIONS = DEFAULT_VALIDATIONS;

})(this, jQuery);
