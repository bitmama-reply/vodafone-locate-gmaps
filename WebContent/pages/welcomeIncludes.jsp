<%@page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@taglib uri="/struts-tags" prefix="s"%>
<script type="text/javascript">
  var userLocale = '<s:property value="#session.WW_TRANS_I18N_LOCALE.language"/>';
  if (userLocale.indexOf('_') !== -1) {
    userLocale = userLocale.substring(0, userLocale.indexOf('_'));
  }
	var lbasVersion='<s:property value="#session.lbasVersion"/>';
</script>



<!-- this files contains lbas specific css and js files which are used before login -->

<!-- lbas css-->
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/style/newStyles.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/style/account.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/style/styleEnd.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/style/style.css" >

<!-- lbas js-->
<script type="text/javascript" src="${pageContext.request.contextPath}/js/lbas/i18n.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/lbas/utils.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/lbas_original/common/lbasCommon.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/lbas_original/users/userChangePassword.js"></script>