function ValidationMap() {
}
var validationMap = new ValidationMap();

function registerValidations(form) {
	if (!form)
		throw new Error("LBASValidation::initialize - No form element reference or element id has been provided!");

	var validationArr = new Array();
	var validationArrIndex = 0;
	var inputFieldArr = $('#' + form + ' :input');
	for ( var i = 0; i < inputFieldArr.length; i++) {

		var validationObj;
		var fieldId = $(inputFieldArr[i]).attr("id");
		
		// select-one is added for lbasUser.msisdn validation
		if (($(inputFieldArr[i]).attr("type") == "text" || $(inputFieldArr[i]).attr("type") == "textarea"
				|| $(inputFieldArr[i]).attr("type") == "password" || $(inputFieldArr[i]).attr("type") == "select-one")
				&& fieldId != "") {
			var onlyOnSubmit = false;
			if ($(inputFieldArr[i]).hasClass("vldOnlyOnSubmit")) {
				onlyOnSubmit = true;
			}
			validationObj = new LiveValidation(fieldId, {
				insertAfterWhatNode :fieldId,
				onlyOnSubmit :onlyOnSubmit
			});
		
			/* Control Required */
			if ($(inputFieldArr[i]).hasClass("vldRequired")) {
				validationObj.add(Validate.Presence, {
					failureMessage :$.i18n.prop('error.required')
				});
			}

			var classList = $(inputFieldArr[i]).attr('class')?$(inputFieldArr[i]).attr('class').split(/\s+/):[];
			if(classList && classList.length>0){
				$.each(classList, function(index, item) {
					if (item.indexOf("vldMaxLength") != -1) {
						try {
							var max = item.substr(12, item.length - 1);
	
							validationObj.add(Validate.Length, {
								maximum :max,
								failureMessage :$.i18n.prop('error.maxlength', new Array(max))
							});
	
						} catch (e) {
						}
					}
				});
				
				if ($(inputFieldArr[i]).hasClass("vldIntMax10")) {
					validationObj.add(Validate.Numericality, {
						failureMessage :$.i18n.prop('error.intMax', new Array('9999999999')),
						maximum :9999999999,
						onlyInteger :true
					});
				}
	
				if ($(inputFieldArr[i]).hasClass("vldIntMax5")) {
					validationObj.add(Validate.Numericality, {
						failureMessage :$.i18n.prop('error.intMax', new Array('999999')),
						maximum :99999,
						onlyInteger :true
					});
				}
	
				if ($(inputFieldArr[i]).hasClass("vldPhone")) {
					validationObj.add(Validate.Format, {
						pattern :/(^[0-9]{0,15}$)|(^\+[0-9]{0,15}$)/,
						failureMessage :$.i18n.prop('error.phone')
					});
					
				}
	
				if ($(inputFieldArr[i]).hasClass("vldPoiPhone")) {
					validationObj.add(Validate.Format, {
						pattern :/(^([0-9\(\)\/\+ \-]{2,20})$)/,
						failureMessage :$.i18n.prop('error.phone')
					});
					
				}
	
				if ($(inputFieldArr[i]).hasClass("vldFax")) {
					validationObj.add(Validate.Format, {
						pattern :/(^([0-9\(\)\/\+ \-]{2,16})$)/,
						failureMessage :$.i18n.prop('error.fax')
					});
				}
	
				if ($(inputFieldArr[i]).hasClass("vldNumeric")) {
					validationObj.add(Validate.Numericality, {
						notAnIntegerMessage :$.i18n.prop('error.numeric'),
						onlyInteger :true
					});
				}
	
				if ($(inputFieldArr[i]).hasClass("vldEmail")) {
					validationObj.add(Validate.Email, {
						failureMessage :$.i18n.prop('error.email')
					});
				}
	
				if ($(inputFieldArr[i]).hasClass("vldEmailOrPhone")) {
					validationObj.add(Validate.EmailOrPhone, {
						failureMessage :$.i18n.prop('error.emailOrPhone')
					});
					
				}
	
				if ($(inputFieldArr[i]).hasClass("vldUrl")) {
					validationObj
							.add(
									Validate.Format,
									{
										pattern :/^(((ht|f)tp(s?))\:\/\/)?(www.|[a-zA-Z].)[a-zA-Z0-9\-\.]+\.(com|edu|gov|mil|net|org|biz|info|name|museum|us|ca|uk)(\:[0-9]+)*(\/($|[a-zA-Z0-9\.\,\;\?\'\\\+&amp;%\$#\=~_\-]+))*$/,
										failureMessage :$.i18n.prop('error.url')
									});
				}
				
			}

			if (validationObj && validationObj.validations.length == 0) {
				validationObj = undefined;
			}
			if (validationObj) {
				validationArr[validationArrIndex++] = validationObj;
			}
		}
	}

	validationMap[form] = validationArr;
	
}

function lbasValidate(form) {
	if (!form)
		throw new Error("LBASValidation::initialize - No form element reference or element id has been provided!");
		
	var map_validation = validationMap[form];
	var areAllValid=false;
	
	if(map_validation != undefined)  {
		areAllValid = LiveValidation.massValidate(map_validation);
	}
	if (!areAllValid) {
			showErrorDialog($.i18n.prop('error.correct.invalid.fields'), false, form);
	}
	return areAllValid;
}