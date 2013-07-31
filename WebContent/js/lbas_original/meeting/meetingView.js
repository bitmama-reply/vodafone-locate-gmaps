function prepareMeetingTimeStrOnWireFrame(id, Starttimestamp, Stoptimestamp) {
	// alert(dateFormat(Starttimestamp, "dd/mm/yyyy"));
	// dateFormat(Starttimestamp,"HH:MM")+"-"+dateFormat(Stoptimestamp,"HH:MM"));
	var gh = dateFormat(Starttimestamp, "dd/mm/yyyy");
	var ch = dateFormat(Stoptimestamp, "dd/mm/yyyy");

	if (gh == ch) {
		$("#" + id).html(
				dateFormat(Starttimestamp, "dd/mm/yyyy") + " " + dateFormat(Starttimestamp, "HH:MM") + "-" + dateFormat(Stoptimestamp, "HH:MM"));

	} else {

		$("#" + id).html(
				dateFormat(Starttimestamp, "dd/mm/yyyy") + " " + dateFormat(Starttimestamp, "HH:MM") + "-" + dateFormat(Stoptimestamp, "dd/mm/yyyy")
						+ " " + dateFormat(Stoptimestamp, "HH:MM"));
	}

/* 	$("#meetingMessageDetailTable").width($("#meetingMessageDetailContent").width()); */
}