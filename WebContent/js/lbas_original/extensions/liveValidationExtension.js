LiveValidation.prototype.createMessageSpan = function(valid) {
	var span = document.createElement('span');

	var imageToAppend = document.createElement('img');
	if (!valid) {
		imageToAppend.src = contextPath + "/images/controlPanel/Icons/alert-m.jpg";
		span.appendChild(imageToAppend);
		span.title = this.message;
	}

	return span;
};