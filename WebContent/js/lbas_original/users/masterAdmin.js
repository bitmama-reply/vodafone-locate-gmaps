var MasterAdmin = {};

MasterAdmin.accountLoad = function(data) {
	$("body").css({'overflow':'auto', 'minWidth':'auto'});
	this.data    = data;

	this.label   = 'admin';
	this.element = $('#' + this.label);

	if (this.element.length === 0) {
		this.render();
	}

	this.show();
};

MasterAdmin.render = function() {
	this.element = $('<div></div>')
		.attr('id', this.label)
		.addClass('clearfix content ' + this.label)
		.insertAfter(
			$('#header')
			.css('width', '100%')
			.css('height', $('document').height())
		).html(parseTemplate('adminTemplate', {}));

	this.menuHeight();
	this.controls();
	setAdminLineHeight();
	//this.defaultVisibilityProfile();

};

MasterAdmin.menuHeight = function() {
	this.menu         = $('#adminNav');
	this.content      = $('#adminContent');
	var menuTop       = this.menu.offset().top;
	var contentHeight = $('#adminContent').outerHeight();
	var visHeight     = $(window).height();

/*
	if ( contentHeight > visHeight ) {
		this.menu.css("height", contentHeight);
	} else {
		this.menu.css("height", visHeight - menuTop );
	}
*/
};

MasterAdmin.show = function() {
	$('.content').hide();
	$('.menubar li').removeClass('currentIteam');

	this.element.show();
};

MasterAdmin.activeSubmit = function() {
	$('#update-company').removeClass('inactive');
};

MasterAdmin.controls = function() {
	var bindingFn = this.section;

	this.menu_links = $('#adminNav .adminMenu a');
	if ( this.menu_links.length > 0 ) {

		//Initial section selected (the first link)
		bindingFn(this.menu_links[0], this);

		//Add listener for right-nav
		this.menu_links.bind( 'click', { instance: this }, function(event) {
				bindingFn(this, event.data.instance);
			}
		);
		
	}
	
};

MasterAdmin.section = function( link, instance, link_from_content ) {
	if (link_from_content === undefined || link_from_content === false) {
		instance.menu_links.removeClass('active');
		$(link).addClass('active');
	}
	var tpl = $(link).attr('data-tpl');
	if (tpl != undefined)
		instance.setContent( tpl, instance );

};

MasterAdmin.setContent = function( tpl, instance ) {

	instance.content.html( parseTemplate(tpl, {
			data: instance.data
		}
	) );
	instance.contentControls( instance );

};

MasterAdmin.contentControls = function( instance ) {

	instance.content.find('.accordion .accordion-tab').click(function(){
		$(this).css('display', 'none');
		$(this).closest('.accordion').find('.accordion-content').css('display', 'block');
		setAdminLineHeight();
		
		var content = $('#adminContent');
		var menuTop = $('#adminNav').offset().top;
		var contentHeight = $('#adminContent').outerHeight();
		var visHeight = $(window).height();

		if ( contentHeight > visHeight ) {
			$('#adminNav').css("height", contentHeight);
		}else{
			$('#adminNav').css("height", visHeight - menuTop );
		}
				
		return false;
	});

	instance.content.find('.accordion .minusWrapper').click(function(){
		$(this).closest('.accordion-content').css('display', 'none');
		$(this).closest('.accordion').find('.accordion-tab').css('display', 'block');
		
		var content = $('#adminContent');
		var menuTop = $('#adminNav').offset().top;
		var contentHeight = $('#adminContent').outerHeight();
		var visHeight = $(window).height();

		if ( contentHeight > visHeight ) {
			$('#adminNav').css("height", contentHeight);
		}else{
			$('#adminNav').css("height", visHeight - menuTop );
		}
		
		return false;
	});

	instance.content.find('.delete-cdf').click(function(e){
		e.preventDefault();
		instance.deleteCdf( instance, $(this) );
	});

	instance.content.find('#add-new-cdf').click(function(e){
		e.preventDefault();
		instance.createCdf( instance, $(this) );
	});

	instance.content.find('#update-cdf').click(function(e){
		e.preventDefault();
		if ( !$(this).hasClass('inactive') )
			instance.updateCdf( instance, $(this) );
	});

	instance.content.find('#update-company').click(function(e){
		e.preventDefault();
		if ( !$(this).hasClass('inactive') )
			$('#update-company').addClass('inactive');
			instance.updateCompany( instance );
			
	});

	instance.content.find('.loadTplBtn').bind( 'click', function(event) {
			event.preventDefault();
			instance.section(this, instance, true);
		}
	);
	instance.content.find('#cdf-table-list input').keydown(function() {
		instance.content.find('#update-cdf').removeClass('inactive');
	});

	instance.content.find('.radio[data-radio]').click(function() {
		instance.content.find('.radio[data-radio="' + $(this).attr('data-radio') + '"]').removeClass('active');
		$(this).addClass('active');
		instance.activeSubmit();
	});
	instance.content.find('#allowedIP').keydown(function() {
		instance.activeSubmit();
	});

};

MasterAdmin.deleteCdf = function( instance, btn ) {
	$.ajax({
		url: 'crudCDF.action',
		type: 'POST',
		cache: false,
		data: {
			cdfMethod: 'remove',
			cdfName: true,
			cdfId: btn.attr('data-cdfId'),
			companyId: instance.data.lbasCompany.id,
			cdfDesc: true
		},
		success: function(msg) {
			if (checkResponseSuccess(msg)) {
				utils.dialogSuccess(msg.infoMessage);
				btn.closest('tr').remove();
				utils.dialogSuccess($.i18n.prop('info.delete'));
				$.ajax({
					url: 'json/editOwnCompany.action',
					type: 'POST',
					cache: false,
					success: function(data) {
						if (checkResponseSuccess(data)) {
							instance.data = data;
							instance.section( btn, instance, true );
							$('.accordion-tab').eq(0).click();
						}
					}
				});

			}
		}
	});
};

MasterAdmin.createCdf = function( instance, btn ) {
	var element = $('#sample-cdf');
	if (element.find('input[name="name"]:text[value=""]').length > 0) {
		utils.dialogError({ title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('error.correct.invalid.fields') });
		return false;
	}

	var newCdf = element.clone().attr('id', '');
	newCdf.insertBefore(element);
	newCdf.find('.btn-add').remove();
	element.find('input').attr('value', '');
};

MasterAdmin.updateCdf = function( instance, btn ) {
	var addedCdf = false;

	if (instance.content.find('#cdf-table-list tbody tr:not(#sample-cdf) input[name="name"]:text[value=""]').length > 0) {
		utils.dialogError({ title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('error.correct.invalid.fields') });
		return false;
	}
	if (instance.content.find('#cdf-table-list tbody tr#sample-cdf input:text[value=""]').length == 1) {
		utils.dialogError({ title: $.i18n.prop('dialog.title.error'), content:  $.i18n.prop('error.correct.invalid.fields') });
		return false;
	}

	instance.content.find('#cdf-table-list tbody tr').each(function(index){
		var data    = {};
		var element = $(this);

		if ( element.attr('id') == 'sample-cdf' && element.find('input:text[value=""]').length == 2 )
			return;

		if ( element.hasClass('new') ) {
			data = {
				cdfMethod: 'add',
				cdfName: element.find('input[name="name"]').val(),
				cdfId: 0,
				companyId: instance.data.lbasCompany.id,
				cdfDesc: element.find('input[name="desc"]').val()
			};
			addedCdf = true;
		} else
			data = {
				cdfMethod: 'update',
				cdfName: element.find('input[name="name"]').val(),
				cdfId: element.find('.delete-cdf').attr('data-cdfId'),
				companyId: instance.data.lbasCompany.id,
				cdfDesc: element.find('input[name="desc"]').val()
			};

		$.ajax({
			url: 'crudCDF.action',
			type: 'POST',
			cache: false,
			data: data
		});
	});
	utils.dialogSuccess($.i18n.prop('info.update'));

	/* if ( addedCdf ) */
		$.ajax({
			url: 'json/editOwnCompany.action',
			type: 'POST',
			cache: false,
			success: function(data) {
				if (checkResponseSuccess(data)) {
					instance.data = data;
					instance.section( btn, instance, true );
					$('.accordion-tab').eq(0).click();
				}
			}
		});
};

MasterAdmin.updateCompany = function( instance ) {
	var allowedIP = instance.content.find("#allowedIP").val();

	if ( validateAllowedIP(allowedIP) ) {
/*
		var lbasCompany = {
			id: instance.data.lbasCompany.id,
			allowedIP: allowedIP,
			ageOfLocationValue: instance.content.find('#ageOfLocationValue').selectmenu('value'),
			ageOfLocationType: instance.content.find('.radio.active[data-radio="ageOfLocationType"]').attr('data-type')
		};*/
		/* TODO: remove this line */
	var businessHours='';
	var exitSubmit = false;
		$('#defaultVisibilityProfile .row').each(function(x ,y){
			if ($('#defaultVisibilityProfile .row').eq(x).find(".checkBox").is(':checked')) {

				businessHours += $('#defaultVisibilityProfile .row').eq(x).find(".fromTime .time-wrap .hours").val()+':'+$('#defaultVisibilityProfile .row').eq(x).find(".fromTime .time-wrap .mins").val() +"-"+ $('#defaultVisibilityProfile .row').eq(x).find(".toTime .time-wrap .hours").val() +':'+$('#defaultVisibilityProfile .row').eq(x).find(".toTime .time-wrap .mins").val();	
				businessHours += "|";

				var Hours = $('#defaultVisibilityProfile .row').eq(x).find(".toTime .time-wrap .hours").val() - $('#defaultVisibilityProfile .row').eq(x).find(".fromTime .time-wrap .hours").val();
				var Minutes   = $('#defaultVisibilityProfile .row').eq(x).find(".toTime .time-wrap .mins").val() - $('#defaultVisibilityProfile .row').eq(x).find(".fromTime .time-wrap .mins").val();
				
				if ( Hours < 0){
					exitSubmit = true;
				}else if(Hours === 0 && Minutes < 0 ){
					exitSubmit = true;
				}else if(Hours === 0 && Minutes === 0 ){
					exitSubmit = true;
				}
				
			} else {
				businessHours += "|";
			}
		});
		
		instance.data.lbasCompany.businessHours = businessHours;
		if(exitSubmit){
			$('#update-company').removeClass('inactive');
			utils && utils.dialogError({
				title: $.i18n.prop('dialog.error'),
				content: $.i18n.prop('working.hours.error')
				});
			return false;
		}
		$.ajax({
			url: 'updateCompanyDetailInfo.action',
			type: 'POST',
			dataType: 'json',
			data: {
				'businessHours': instance.data.lbasCompany.businessHours,
				'lbasCompany.id': instance.data.lbasCompany.id,
				'lbasCompany.allowedIP': allowedIP,
				'lbasCompany.ageOfLocationValue': instance.content.find('#ageOfLocationValue').selectmenu('value'),
				'lbasCompany.ageOfLocationType': instance.content.find('.radio.active[data-radio="ageOfLocationType"]').attr('data-type')
			},
			success: function(data) {
				if (checkResponseSuccess(data)) {
					utils.dialogSuccess($.i18n.prop('info.update'));
				}
			}
		});
	}



	/*
		// compose business hour data
		var businessHours = "";

		for ( var x = 0; x < 7; x++) {
			if ($("#companyCheck" + x).attr('checked') == true) {
				businessHours += $("#companyFromHour" + x).val() + ":" + $("#companyFromMinute" + x).val() + "-" + $("#companyToHour" + x).val()
						+ ":" + $("#companyToMinute" + x).val();

				businessHours += "|";
			} else {
				businessHours += "|";
			}
		}

		if (businessHours == "|||||||")
			businessHours = "";

		serializedFormData += "&businessHours=" + businessHours;*/
};
MasterAdmin.defaultVisibilityProfile = function(){

	var selectTimeTable ='<select class="timeVisPro" style="width:70px;"><option value="0000">00:00</option><option value="0030">00:30</option><option value="0100">01:00</option><option value="0130">01:30</option><option value="0200">02:00</option><option value="0230">02:30</option><option value="0300">03:00</option><option value="0330">03:30</option><option value="0400">04:00</option><option value="0430">04:30</option><option value="0500">05:00</option><option value="0530">05:30</option><option value="0600">06:00</option><option value="0630">06:30</option><option value="0700">07:00</option><option value="0730">07:30</option><option value="0800">08:00</option><option value="0830">08:30</option><option value="0900">09:00</option><option value="0930">09:30</option><option value="1000">10:00</option><option value="1030">10:30</option><option value="1100">11:00</option><option value="1130">11:30</option><option value="1200">12:00</option><option value="1230">12:30</option><option value="1300">13:00</option><option value="1330">13:30</option><option value="1400">14:00</option><option value="1430">14:30</option><option value="1500">15:00</option><option value="1530">15:30</option><option value="1600">16:00</option><option value="1630">16:30</option><option value="1700">17:00</option><option value="1730">17:30</option><option value="1800">18:00</option><option value="1830">18:30</option><option value="1900">19:00</option><option value="1930">19:30</option><option value="2000">20:00</option><option value="2030">20:30</option><option value="2100">21:00</option><option value="2130">21:30</option><option value="2200">22:00</option><option value="2230">22:30</option><option value="2300">23:00</option><option value="2330">23:30</option></select>';

	

	var timeTable =this.data.lbasCompany.businessHours;

/* 	var timeTable ='08:00-12:00|08:00-12:00|08:00-12:00|08:00-12:00|08:00-12:00|08:00-12:00|08:00-12:00'; */
	timeTable=timeTable.split('|');
	var dayName = $.i18n.prop('user.businessHours.dayNames');
	dayName = dayName.split(',');
	
	for (var i=0;i<7;i++){
		
		if(timeTable[i] != ''){
/* 			console.log($('#defaultVisibilityProfile .row').eq(i).find('.checkBox'));//$('#defaultVisibilityProfile .row').eq(i).find('.checkBox').attr('checked','checked'); */
			timeSet=timeTable[i].split('-');
			timeStart=timeSet[0].split(':');
			timeEnd=timeSet[1].split(':');
			

			var timeS = '<div class="time-wrap time"> \
						<input type="text" value="'+timeStart[0]+'" class="inputText time hours vldRequired" maxlength="2" name="" id="">\
						<span>:</span>\
						<input type="text" value="'+timeStart[1]+'" class="inputText time mins vldRequired" maxlength="2" name="" id=""></div>';
			var timeE = '<div class="time-wrap time"> \
						<input type="text" value="'+timeEnd[0]+'" class="inputText time hours vldRequired" maxlength="2" name="" id="">\
						<span>:</span>\
						<input type="text" value="'+timeEnd[1]+'" class="inputText time mins vldRequired" maxlength="2" name="" id=""></div>';


		var lineRow = "<tr class='row'> \
			<td><input class='checkBox' type='checkbox' checked /></td>\
			<td><span class='dayName'>"+dayName[i]+"</span></td>\
			<td><span class='fromOrTo'>"+ $.i18n.prop('poi.from') +"</span> <div class='fromTime'>"+timeS+"</div></td>\
			<td><span class='fromOrTo'>"+  $.i18n.prop('poi.to')+"</span> <div class='toTime'> "+timeE+"</div></td>\
			</tr>"

		$("#defaultVisibilityProfile table").append(lineRow);


			
	        
         }else{
			var timeS = '<div class="time-wrap time"> \
						<input type="text" value="" class="inputText time hours vldRequired" maxlength="2" name="" id="">\
						<span>:</span>\
						<input type="text" value="" class="inputText time mins vldRequired" maxlength="2" name="" id=""></div>';
			var timeE = '<div class="time-wrap time"> \
						<input type="text" value="" class="inputText time hours vldRequired" maxlength="2" name="" id="">\
						<span>:</span>\
						<input type="text" value="" class="inputText time mins vldRequired" maxlength="2" name="" id=""></div>';

         
			var lineRow = "<tr class='row'> \
				<td><input class='checkBox' type='checkbox' /></td>\
				<td><span class='dayName'>"+dayName[i]+"</span></td>\
				<td><span class='fromOrTo'>"+ $.i18n.prop('poi.from') +"</span> <div class='fromTime'>"+timeS+"</div></td>\
				<td><span class='fromOrTo'>"+  $.i18n.prop('poi.to')+"</span> <div class='toTime'> "+timeE+"</div></td>\
				</tr>"
	
			$("#defaultVisibilityProfile table").append(lineRow);
	         
         }
	 }
	 
 	checkTheInputTime();
 	
	 
	 $('#defaultVisibilityProfile .time').keyup(function(){
		 if( $('#update-company').hasClass('inactive') ){
	    	 $('#update-company').removeClass('inactive');	
		 }
	 });
	 $('#defaultVisibilityProfile .time').live("focus blur", function(event){
	 		var time= $(this).val();
			if(event.type == "focusout"){
				if(time.length === 1){
					$(this).attr('value', '0'+time);
				}

			}
	 });
/*

    $('.fromTime select , .toTime select').each(function(){
    	$(this).addClass("changeStyle").selectmenu({
        	 change: function(e){
            	 $('#update-company').removeClass('inactive');
        	 }
    	});
	});
*/
	
	$("#defaultVisibilityProfile .checkBox").change(function() {
    	 $('#update-company').removeClass('inactive');
    }); 
  /*  work around scrollbar */  
  $('.ui-selectmenu-menu > ul').css({
    overflow:'auto'
  });
    
  /*  
  $('.ui-selectmenu-menu .changeStyle').css({
    height:'auto'
  }).parent().css({
    height:210
  });*/
};

function setAdminLineHeight(){
	
	/*page width*/
/*
	var pageWidth = $(window).width();
	var leftpart = $("#adminNav").outerWidth()+125;	
	$("#adminContent").css("width" , pageWidth - leftpart);
*/
	
	/* left panel height*/
	var topPosition =$("#adminNav").offset().top;
	var privacyHeight =  $("#adminContent").outerHeight()+131;
	var visHeight = $(window).height();
	

	
	if( privacyHeight > visHeight  ){
		$("#adminNav").css("height", privacyHeight);
		
	}else{
		$("#adminNav").css("height", visHeight - topPosition );
/*
		if ($("#visibilityProfiles-container").length == 1){
  			$("#adminNav").css("height", visHeight - topPosition + 62 );
  		}
*/
		
	}	
	
}