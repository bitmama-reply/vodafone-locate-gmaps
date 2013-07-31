var adminJqGridContent;
var adminClickedCategoryId;

function loadAdminCategoryList() {

	adminJqGridContent = 'category';
	destroyJqGrid();

	$("#list2").jqGrid(
			{
				url :'listEnterpriseCategories.action',
				datatype :"json",
				colNames :[ 'ID', 'Name', 'Poi_count', 'Edit', 'Delete' ],
				colModel :[ {
					name :'id',
					index :'ID',
					key :true,
					hidden :true
				}, {
					name :'name',
					index :'NAME',
					width :900,
					search :true
				}, {
					name :'poiCount',
					index :'',
					align :"right",
					hidden :true
				}, {
					name :'edit',
					width :50,
					align :"right",
					sortable :false
				}, {
					name :'dlt',
					width :50,
					align :"right",
					sortable :false
				} ],
				jsonReader :{
					repeatitems :false
				},
				rowNum :10,
				rowList :[ 10, 20, 30 ],
				pager :'#pager2',
				sortname :'name',
				viewrecords :true,
				sortorder :"asc",
				width :1000,
				height :230,
				multiselect :true,
				gridComplete :function() {
					var ids = jQuery("#list2").jqGrid('getDataIDs');
					for ( var i = 0; i < ids.length; i++) {
						var cl = ids[i];
						var categoryName = jQuery("#list2").getRowData(cl).name;
						var poiCount = jQuery("#list2").getRowData(cl).poiCount;

						var re = "";
						var rd = "";

						if (cl != -1) {

							re = "<a onclick=\"openEnterpriseEditCategoryDialog(0,'" + cl + "','" + categoryName + "','" + poiCount
									+ "');\" ><img src=\"../images/edit.png\" style=\"cursor:pointer\"/></a>";
							rd = "<a onclick=\"deleteCategory('" + cl
									+ "',0,true);\" ><img src=\"../images/incorrectly.png\" style=\"cursor:pointer\"/></a>";
						}

						var name = "<a style=\"color:#0077B7;cursor:pointer;font-weight:bold\" onclick=\"loadAdminLocationList('" + cl + "');\" >"
								+ categoryName + ' (' + poiCount + ')</a>';
						jQuery("#list2").jqGrid('setRowData', ids[i], {
							edit :re
						});
						jQuery("#list2").jqGrid('setRowData', ids[i], {
							dlt :rd
						});
						jQuery("#list2").jqGrid('setRowData', ids[i], {
							name :name
						});

					}

				},

				caption :"Company Name"
			});
	$("#list2").jqGrid('navGrid', '#pager2', {
		edit :false,
		add :false,
		del :false,
		search :false
	});

	$.getJSON("getCompanyNameFunc.action", {}, function(json) {
		$('.ui-jqgrid-title').text($.i18n.prop('companyList.CompanyName') +" : "+ json.companyName);
	});
}

function loadAdminLocationList(categoryId, search, searchText) {
	adminJqGridContent = 'poi';
	adminClickedCategoryId = categoryId;
	destroyJqGrid();
	var url;
	var nameHeader;
	if (search) {
		url = 'searchEnterprisePois.action?searchText=' + searchText;
		nameHeader = '<a href=\"#\" onclick=\"loadAdminCategoryList();\" style="">Enterprise categories</a> Search results';
	} else {
		url = 'listEnterprisePois.action?categoryId=' + categoryId;
		nameHeader = 'Name';
	}
	$("#list2").jqGrid(
			{
				url :url,
				datatype :"json",
				colNames :[ 'ID', nameHeader, 'Rating', '', 'Edit', 'Delete' ],
				colModel :[ {
					name :'id',
					index :'ID',
					key :true,
					hidden :true
				}, {
					name :'name',
					index :'NAME',
					width :900,
					search :true
				}, {
					name :'rating',
					width :170,
					align :"left",
					sortable :false
				}, {
					name :'ratingreset',
					width :40,
					align :"left",
					sortable :false
				}, {
					name :'edit',
					width :50,
					align :"right",
					sortable :false
				}, {
					name :'dlt',
					width :50,
					align :"right",
					sortable :false
				} ],
				jsonReader :{
					repeatitems :false
				},
				rowNum :10,
				rowList :[ 10, 20, 30 ],
				pager :'#pager2',
				sortname :'name',
				viewrecords :true,
				sortorder :"asc",
				width :1000,
				height :230,
				multiselect :true,
				gridComplete :function() {
					var ids = jQuery("#list2").jqGrid('getDataIDs');
					for ( var i = 0; i < ids.length; i++) {
						var cl = ids[i];
						var locationName = jQuery("#list2").getRowData(cl).name;
						var ratingValue = jQuery("#list2").getRowData(cl).rating;

						var ratingHtml = "<div style=\"width:125px;\" id=\"starRatingAdmin_" + cl + "\"></div>";

						var ratingResetHtml = "<a style=\"color:#0077B7;cursor:pointer;font-weight:bold\" onclick=\"resetRate('" + cl + "');\" >"
								+ $.i18n.prop('poi.rating.reset') + "</a>";

						var re = "<a onclick=\"openEditLocationDialog('" + cl + "','" + locationName
								+ "',0,true); return false;\" ><img src=\"../images/edit.png\" style=\"cursor:pointer\"/></a>";
						var rd = "<a onclick=\"deleteLocation('" + cl
								+ "',0,0,0,0,true); return false;\" ><img src=\"../images/incorrectly.png\" style=\"cursor:pointer\"/></a>";

						jQuery("#list2").jqGrid('setRowData', ids[i], {
							edit :re
						});
						jQuery("#list2").jqGrid('setRowData', ids[i], {
							rating :ratingHtml
						});

						jQuery("#list2").jqGrid('setRowData', ids[i], {
							ratingreset :ratingResetHtml
						});

						jQuery("#list2").jqGrid('setRowData', ids[i], {
							dlt :rd
						});

						$('#starRatingAdmin_' + cl).rater('updateAdminRatePoi?poiid=' + cl, {
							style :'small',
							curvalue :ratingValue
						});

					}

				},

				caption :"Company Name"
			});
	$("#list2").jqGrid('navGrid', '#pager2', {
		edit :false,
		add :false,
		del :false,
		search :false
	});

	$.getJSON("getCompanyNameFunc.action", {}, function(json) {
		$('.ui-jqgrid-title').text("Company Name:" + json.companyName);
	});

}
function resetRate(poiId) {

	$.post('resetRate.action', {
		poiid :poiId
	}, function() {

	});

	$("#starRatingAdmin_" + poiId).find('.star-rating').children('.current-rating').css({
		width :(0) + '%'
	});
}
function destroyJqGrid() {

	$('#locationListContent').html('');

	$('#locationListContent').append($(document.createElement('table')).attr({
		id :'list2'
	}));

	$('#locationListContent').append($(document.createElement('div')).attr({
		id :'pager2'
	}));
}
