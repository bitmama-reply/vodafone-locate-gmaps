<%@taglib uri="/struts-tags" prefix="s"%>
<div id="searchArea">
	<form action="login.action" method="post" id="loginForm">
		<div id="sideLinkLogin" style="position: absolute; top: 0px; left: 93%; color: #000; font-size: 12px;" > 
	  		<a href="https://locate.vodafone.com/privacy/en/" target="_blank" style="padding: 0 5px;  color: #000;">Privacy</a> |
	  		<a href="http://www.business.vodafone.com/site/locate/help/en/index.jsp" target="_blank" style="padding: 0 5px;  color: #000;">Help</a>
  	</div>	
		<label for="loginUserName" id="lbl_loginUserName"></label>
		<br>
		<input type="text" id="loginUserName" name="username" class="lbasInputTextSmall vldRequired vldMaxLength100 vldOnlyOnSubmit" />
		<span id="loginUserNameVld"></span>
		<br>
		<label for="loginPassword" id="lbl_loginPassword"></label>
		<br>
		<input type="password" id="loginPassword" name="password" size="20" class="lbasInputTextSmall vldRequired vldMaxLength20 vldOnlyOnSubmit" />
		<span id="loginPasswordVld"></span>
		<br>
		<a id="usernameOrPassword" href="javascript:void(0);" class="simpleLinkNotSelected" onclick="forgotUsernamePassword(); return false;"></a>
		<br>
		
		<span id="captcha" style="display: none">
			<img src="kaptcha/kaptcha.jpg" id="kaptchaImage"/>
			<br>
			<label for="loginsecuritycode" id="lbl_loginsecuritycode"></label>
			<input type="text" id="loginsecuritycode" name="securitycode" size="20" class="lbasInputTextSmall vldRequired vldMaxLength20 vldOnlyOnSubmit" />
			<br/>
		</span>
		<div id="loginError"></div>
		<div id="forgotUsernamePasswordDialog"></div>
		<input type="submit" id="btn_login" class="textBtnRed" href="javascript:void(0);"/>
	</form>
</div>