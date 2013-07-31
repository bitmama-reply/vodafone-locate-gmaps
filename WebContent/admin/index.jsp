<%@page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@taglib uri="/struts-tags" prefix="s" %>
<html>
<script type="text/javascript">

function refreshSecurityCode(){
	 document.getElementById("kaptchaImage").src='kaptcha/kaptcha.jpg?' + Math.floor(Math.random()*100);
}

</script>


<head>
<title>Vodafone Locate Admin Panel</title>
<meta equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="icon" type="image/vnd.microsoft.icon" href="../images/favicon.ico" />	
<style type="text/css">
.mod3Col{
	width:576px;
	float:left;
}
.mod3Col .modBorder{
	width:576px;
	background-image: url("../images/3columnBorder.gif");
}
.mod3Col .modTop{
	background-image: url("../images/3columnTop.gif");
	width:576px;
	height:1px
}
.modHeight16{
	height:16em; 
	overflow:hidden;
}
.modCopy, .modCopy1col, .modCopy2col, .modCopy3col {
padding:8px 0 6px 7px;
}
.mod3Col .modFooter {
background-image:url(../images/3columnFooter.gif);
width:576px;
}
.modFooter {
font-size:1px;
height:8px;
line-height:1px;
margin-bottom:5px;
}
.textBtnRed {
background:transparent url(../images/redRight.gif) no-repeat scroll right top;
}
.textBtnRed, .textBtnGrey, .textBtnBlue {
color:#FFFFFF;
display:inline;
font-family:arial;
font-weight:bold;
line-height:14px;
margin-top:6px;
padding-bottom:10px;
position:relative;
text-decoration:none;
}
html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, font, img, ins, kbd, q, s, samp, small, tt, var, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, hr {
border:0 none;
font-family:Arial,Helvetica,sans-serif;
font-size:11px;
font-style:inherit;
font-weight:inherit;
margin:0;
outline-style:none;
outline-width:0;
padding:0;
}
.textBtnRed span {
background:transparent url(../images/redLeft.gif) no-repeat scroll left top;
}

.textBtnRed span, .textBtnGrey span, .textBtnBlue span, .textBtnGreyRoute span {
left:-1px;
padding-bottom:10px;
padding-left:9px;
padding-right:9px;
position:relative;
top:0;
}

.lbasInputTextSmall {
	width: 126px;
}
</style>

</head>
<body>
   <div id="home" class="mod3Col" style="" 
   onkeypress="enterPressed(event);">   
	
	<s:form theme="simple" action="adminlogin">
		<input type="hidden" name="login_indicator"/>

		<div class="modBorder" style="margin:300px">
		<div class="modTop"> </div>
		<div class="modHeight19">
		<div class="modCopy"> 
		
		<table style="margin-left:90px">
		 <tr>
		   <td><img src="../images/vod_brand_flag_small.gif"></td>
		   <td><div style="background:#FFFFFF;color:#0077B7;font-size:200%;font-weight:bold;width:300">Vodafone Locate Admin Panel</div></td>
		 </tr>
		</table> 
		
		
		<div style="margin-top:10px;margin-left:200px">  
			   <table width="100" cellpadding="6" cellspacing="6"
			style="margin-left: 12px"> 
			<tr>
			    <td width="50" align="left">Login</td><td width="50" align="left"><b><s:textfield name="username" key="login.username" size="100" cssClass="lbasInputTextSmall" maxlength="100"/></b></td>
			</tr>
			
			<tr>
			    <td width="50" align="left">Password</td><td width="50" align="left"><b><s:password name="password" key="login.password" size="20" cssClass="lbasInputTextSmall" maxlength="40"/></b></td>
			</tr>
			
			<s:if test="%{ showCaptcha ==1 }">
		
				<tr>
					<td colspan="2">
						<img src="kaptcha/kaptcha.jpg" id="kaptchaImage" onclick="refreshSecurityCode()" />
					</td>
				</tr>
				
				<tr>
					 <td width="50" align="left">Security Code</td>
					<td width="50" align="left"><b><s:textfield	name="securitycode" key="login.securitycode"  size="20"/></b></td>
					<td></td>
				</tr>
				
			</s:if>
		
			<tr>
			    <td  colspan="2">
			       <s:actionerror />		    
				</td>
		    </tr>
			
			<tr>
			    <td align="right" colspan="2"><a class="textBtnRed" style="color: #FFFFFF;"
					href="javascript:document.forms[0].submit();"><span class="btnSpan">Login</span></a>
				</td>
			</tr>
		  </table>
		</div>
		
		</div>
	
		</div>
		<div class=modFooter></div>
		</div>
	 </s:form>
        
	</div>
</body>
</html>

<script type="text/javascript">
function enterPressed(e) {
	var KeyID = (window.event) ? window.event.keyCode : e.which;

	switch(KeyID)
	{
	case 13:
		document.forms[0].submit();
	break;
	}
}

</script>