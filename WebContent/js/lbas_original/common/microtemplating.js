var _tmplCache = {};
var _tmplDir="pages/template/";
this.parseTemplate = function(templateId, data) {
	var err = "";
	try {
		//var rootElement = document.getElementById(templateId);
		var templateHtml,
			_url;
		
		if(aPage){
			_url = "../"+_tmplDir+templateId+".html"+"?version="+lbasVersion;
		}else{
			_url = _tmplDir+templateId+".html"+"?version="+lbasVersion;
		}
		var p=(new Date()).getTime();
		_url +="&p="+p; 
		
		$.ajax( {
			url: _url,
			type : 'POST',
			async : false,
			cache: false,
			contentType:'text/json',
			dataType:'html',
			success : function(responseText) {
				templateHtml = responseText;
			},
			error : function(responseText) {
        forceLogOut();
      }
		});
		var func = _tmplCache[templateHtml];
		if (!func) {
			var strFunc = "var p=[],print=function(){p.push.apply(p,arguments);};"
					+ "with(obj){p.push('"
					+ templateHtml.replace(/[\r\t\n]/g, " ").replace(
							/'(?=[^#]*#>)/g, "\t").split("'").join("\\'")
							.split("\t").join("'").replace(/<#=(.+?)#>/g,
									"',$1,'").split("<#").join("');").split(
									"#>").join("p.push('")
					+ "');}return p.join('');";

			func = new Function("obj", strFunc);
			_tmplCache[templateHtml] = func;
		}
		return func(data);
	} catch (e) {
		err = e.message;
	}
	
	/***********************************************************/
	/*if i have error i am out of session force click and reload*/
	/***********************************************************/
	
	//$("#btn_logout").trigger("click");
	//return "< # ERROR: " + err + " # >";
	forceLogOut();
	return "";
};