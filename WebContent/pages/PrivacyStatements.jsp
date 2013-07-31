<div id="privacyStatementLeft">
	
        <ul class="privacyStatementMenu">
            <li>
                <a href="#privacyStatementBox1" class="linking active">
                	<span class="line1"> </span>
                </a>
            </li>

            <li class="last">
                <a href="#privacyStatementBox2" class="linking">
                	<span class="line2"></span>
                </a>
            </li>
        </ul>
</div>

<div id="privacyStatementBody">

	<div class="privacyTab" id="privacyStatementBox1">
		<h1></h1>
		<div class="content"></div>
		<div class="clearfix" style="margin:10px 0;">
			<input type="checkbox" value="" id="dontShowPrivacySetting"> <p class="message"></p>
		</div>
	</div>
	
	<div class="privacyTab" id="privacyStatementBox2">
		<h1></h1>
		<div class="content"></div>
		<div class="clearfix" style="margin:10px 0;">
			<input type="checkbox" value="" id="dontShowPrivacySettingCompany"> <p class="message"></p>
		</div>
	</div>
	
</div>

<script>
$(function(){

	$('#privacyStatementLeft li a').on('click', function(e){
		e.preventDefault();
		$('#privacyStatementLeft li a').removeClass('active');
		$(this).addClass('active');
		var ShowMe = $(this).attr('href');
		$('.privacyTab').hide();
		$(ShowMe).show();
		setPrivacyStatementHeight();
	});

	$.ajax({
		url :"json/showPrivacyStatement.action",
		type :'POST',
		success :function(json) {
			/* VODAFONE */
			$('#privacyStatementBox1 .content').html(json.vodafonePrivacy.privacyStatement);
			$('#privacyStatementBox1 .content div').each(function(i,v){
				$(this).addClass('line'+i);
			});
			$('#privacyStatementBox1 .content div span span').each(function(){
				$(this).remove();
			});
			if(json.vodafonePrivacy.dontShowPrivacySetting){
				$('#dontShowPrivacySetting').attr('checked', true);
			}
			/* COMPANY */
			var convertHTML =json.companyPrivacy.privacyStatement;
			$('#privacyStatementBox2 .content').html($('<div/>').html(json.companyPrivacy.privacyStatement).text());
			
			
			if(json.companyPrivacy.dontShowPrivacySetting){
				$('#dontShowPrivacySettingCompany').attr('checked', true);
			}
		}
	});	

	localize && localize.privacyStatements();

	$('#dontShowPrivacySetting').change(function() {
        var dontShowCheck = $('#dontShowPrivacySetting').attr('checked');
        if(dontShowCheck === undefined){
	       dontShowCheck = false; 
        }else{
	       dontShowCheck = true;
        }
    	$.ajax({
			url :"/json/acceptPrivacyStatement.action",
			data : {
				privacyDontShowSetting : dontShowCheck ,
				statementOwner : 'vodafone'
			},
			type :'POST',
			success :function(json) {
				utils.dialogSuccess( $.i18n.prop('info.update') );
			}
		});
    });

	$('#dontShowPrivacySettingCompany').change(function() {
        var dontShowCheck = $('#dontShowPrivacySettingCompany').attr('checked');
        if(dontShowCheck === undefined){
	       dontShowCheck = false; 
        }else{
	       dontShowCheck = true;
        }
    	$.ajax({
			url :"/json/acceptPrivacyStatement.action",
			data : {
				privacyDontShowSetting : dontShowCheck ,
				statementOwner : 'company'
			},
			type :'POST',
			success :function(json) {
				utils.dialogSuccess( $.i18n.prop('info.update') );
			}
		});
    });
    
    
    setPrivacyStatementHeight();

});

$(window).resize(function() {
	setPrivacyStatementHeight();
});

function setPrivacyStatementHeight(){
	
	/* left panel height*/
	var topPosition =$("#privacyStatementLeft").offset().top;
	var privacyHeight =  $("#privacyStatementBody").outerHeight()+131;
	var visHeight = $(window).height();
	
	if( privacyHeight > visHeight  ){
		$("#privacyStatementLeft").css("height", privacyHeight);
		
	}else{
		$("#privacyStatementLeft").css("height", visHeight - topPosition );		
	}	
	
}


</script>
