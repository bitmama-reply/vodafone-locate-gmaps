<%@taglib uri="/struts-tags" prefix="s" %>
<script language="javascript">

initializeLbasMessages() ;

$('iframe#statmentEditorFrame').attr('title',$.i18n.prop('tip.companyPrivacy.statmentEditorFrame'));
displayTitleOnToolTip("statmentEditorFrame", "bottom center", "displayTitleOnReversedArrowToolTip", true);

</script>
<div id="privacyListContent" style="width:100%">


<iframe id="statmentEditorFrame" src ="../pages/admin/editor.jsp" width="100%" height="450" frameBorder="0" style="width:100%">
  <p>Your browser does not support iframes.</p>
</iframe>



</div>