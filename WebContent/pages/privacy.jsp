<%
response.setHeader("Cache-Control","no-cache"); 
response.setHeader("Pragma","no-cache"); 
response.setDateHeader ("Expires", -1);
%>
<div id="visibility">

</div>
<div id="availabilityDiv">

</div>

<script>
$(function(){
	$(window).resize(function(){
		setWidthAvalibility();
	});	
});
</script>
