var poiCountInCategory;
var userArray;
var creatorId;

function openCategoryDialog(categoryType) {
	//categoryType = places && places.getSelectedTab();
	if (categoryType == 0) {
		openEnterpriseEditCategoryDialog(categoryType);
	} else if (categoryType == 1) {
		openPersonalEditCategoryDialog(categoryType);
	}
}

function updateCategoryImage() {
	var imageIdVal = $("#imageId").val();

	$("#pathId").val("");
	$("#iconId").val(imageIdVal);

	if ($("#iconsTable").length > 0) {
		$("#iconsTable tr:last").append(
				"<td><img src=\"showImage?imageId=" + imageIdVal + "\" onclick=\"selectNewIcon('showImage?imageId=" + imageIdVal + "'," + imageIdVal
						+ ")\" /></td>");
	}

	var uploadType = $("#uploadType").val();
	if (uploadType == 'category') {
		$("#categoryImage").attr("src", "showImage?imageId=" + imageIdVal);
		$("#iconId").val(imageIdVal);
	} else if (uploadType == 'group') {
		$("#groupImage").attr("src", "showImage?imageId=" + imageIdVal);
		$("#groupIconId").val(imageIdVal);
	} else if (uploadType == 'location') {
		$("#updateLocationDetail_poi_iconName").attr("src", "showImage?imageId=" + imageIdVal);
		$("#poiIconId").val(imageIdVal);
	}

}

function initCroppedImage() {
	$(document).ready(function() {
		$("#btnCrop").val($.i18n.prop("buttons.crop"));

		$("#cropImage").ajaxForm({
			target :"#cropImageOutput",
			dataType :'json',
			success :function(json) {
				if (checkResponseSuccess(json)) {
					updateCategoryImage();
					$("#UploadFileDialog").dialog("close");
				}
			}
		});
	});
}
function initJcrop() {

	var api = $('#cropbox').Jcrop({
		onChange :setCoords,
		onSelect :setCoords,
		setSelect :[ 0, 0, 20, 20 ],
		minSize :[ 20, 20 ],
		aspectRatio :1
	});

}

function setCoords(c) {
	$("#x1").val(c.x);
	$("#y1").val(c.y);
	$("#x2").val(c.x2);
	$("#y2").val(c.y2);
	$("#w").val(c.w);
	$("#h").val(c.h);
	showPreview(c);
}

function showPreview(coords) {
	$("#previewDivId").css("display", "block");
	if (parseInt(coords.w) > 0) {
		var rx = 100 / coords.w;
		var ry = 100 / coords.h;

		var img_height = $("#cropbox").height();
		var img_width = $("#cropbox").width();

		$("#preview").css({
			width :Math.round(rx * img_width) + "px",
			height :Math.round(ry * img_height) + "px",
			marginLeft :"-" + Math.round(rx * coords.x) + "px",
			marginTop :"-" + Math.round(ry * coords.y) + "px"
		});
	}
}

function openEnterpriseEditCategoryDialog(categoryType, categoryId, categoryName, poiCount, editPermissionRight) {
	if (categoryName) {
		dialogTitle = $.i18n.prop('categoryDetail.editCategory') + ": " + categoryName + " (" + poiCount + ")";
	} else {
		dialogTitle = $.i18n.prop('categoryDetail.newCategory');
	}
	if (!categoryId) {
		categoryId = 0;
	}
	
	var confirm_btn_label;
	if (categoryId !== 0) {
		confirm_btn_label = $.i18n.prop('buttons.update');
	} else {
		confirm_btn_label = $.i18n.prop('buttons.save');
	}
	
	var btns = {};
	btns[confirm_btn_label] = function() {
		//if (lbasValidate('categoryDetailForm')) 
			AjxUpdateCategory(categoryId);
			/*$(this).dialog('close');*/
	};
	
	btns[$.i18n.prop('buttons.cancel')] = function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
	};
	
	var $div = $('<div></div>').load('pages/template/editPOIEnterprise.html?' + Math.floor(Math.random()*999), function(){
		$("#tabs_in_enterpriseCategoryDialog").tabs({
			show: function(event, ui){
				switch (ui.index) {
					case 1:
						if($.trim($(ui.panel).html()).length===0)
							openCategoryPermissionsTab(ui.panel);
						break;
					case 2:
						if($.trim($(ui.panel).html()).length===0)
							getAdminOfCategory(ui.panel);
						break;	
	
					default:
						if($.trim($(ui.panel).html()).length===0)
							openEditCatTab1(ui.panel, categoryType, categoryId);
						break;
				}
			}
		});
		localize.newEnterprisePlaceGroupDialog();
		/*
		$.ajax({
			type :'GET',
			url :'getCategoryDetail',
			data :{
				categoryType :categoryType,
				categoryId :categoryId
			},
			cache :false,
			success :function(data, textStatus) {
				if (checkResponseSuccess(data)) {
					$('#tabs-1').html(data);
				}
			}
		});
		*/
		if (categoryId === 0) 
		{
			$("#c").remove();
			$("#edit_ecat_tab3_list_item").remove();
			$("#tabs-3").remove();
		} else {
			if (!editPermissionRight || editPermissionRight === 'false') {
				$("#edit_ecat_tab2_list_item").remove();
				$("#tabs-3").remove();
			}
		}
	});
	
	utils && utils.dialog({
		'title': dialogTitle,
		'content': $div,
		'buttons': btns,
		'css': 'noClose newCategoryPopUp'
		});
	$(".newCategoryPopUp").css({
		'max-width':660,
		'width':660,
		'top':100,
		'margin-left':-330
	});
}

function openEditCatTab1(container, categoryType, categoryId){

	if (categoryId > 0)
	{
		$.ajax({
			type :'GET',
			url :'json/editPoiCategory.action',
			data :{
				categoryType :categoryType,
				categoryId :categoryId
			},
			cache :false,
			success :function(data, textStatus) {
				if (checkResponseSuccess(data)) 
				{
					$(container).load('pages/template/saveCategoryDialogTemplate_tab0.html', function(){
						
								$("#categoryDetailForm input[name='categoryType']").val(categoryType);
								$("#categoryDetailForm input[name='categoryId']").val(categoryId);
							}
						);	
						
				}
			}
		});
	}
	else
	{
		$(container).load('pages/template/saveCategoryDialogTemplate_tab0.html', function(){
						
				$("#categoryDetailForm input[name='categoryType']").val(categoryType);
				$("#categoryDetailForm input[name='categoryId']").val(categoryId);
			
			}
		);	
	}
	/*
	var options = {};
        
	options.data = {
		latitude: addr.latitude,
		longitude: addr.longitude
	};
	options.success = function(data){
		if (checkResponseSuccess(data)) {
			$(container).load('pages/template/savePlaceDialogTemplate_tab0.html', function(){
				var lbasGISConn = new NavteqGISManager();
				lbasGISConn.reverseGeocode(new OpenLayers.Geometry.Point(addr.longitude, addr.latitude), 
					function(json) {
						$("#updateLocationDetail input[name='poi.street']").val(json.street);
						$("#updateLocationDetail input[name='poi.city']").val(json.city);
						$("#updateLocationDetail input[name='poi.country']").val(json.country);
						$("#updateLocationDetail input[name='poi.address']").val(json.address);
						$("#updateLocationDetail input[name='poi.postcode']").val(json.postcode);
						$("#updateLocationDetail input[name='poi.houseNo']").val(json.houseNumber);
						$("#updateLocationDetail #poiDetailLatitude").text(json.latitude);
						$('#updateLocationDetail #updateLocationDetail_poi_latitude').val(json.latitude);
						$("#updateLocationDetail #poiDetailLongitude").text(json.longitude);
						$("#updateLocationDetail #updateLocationDetail_poi_longitude").val(json.longitude);
					
					}, function() {

					}
				);	
				
				$("#selectedLocationId").val('');
				$("#selectedLocationType").val(1);
				
				$("#edit_loc_tab4_list_item").hide();

				//$("#addLocationButton").show();
				//$("#updateLocationButton").hide();
				
				registerValidations("updateLocationDetail");
			});
		}
	};
	utils && utils.lbasDoGet('json/poiPreCreate.action', options);
	*/
}

function openPersonalEditCategoryDialog(categoryType, categoryId, categoryName, poiCount) {
	//clearCategoryDialogTabs();
	//poiCountInCategory = poiCount;
	
	var dialogTitle;
	if (categoryName) {
		dialogTitle = $.i18n.prop('categoryDetail.editCategory') + ": " + categoryName + " (" + poiCount + ")";
	} else {
		dialogTitle = $.i18n.prop('categoryDetail.newCategory');
	}
	
	if (!categoryId) {
		categoryId = 0;
	}
	
	var confirm_btn_label;
	if (categoryId != 0) {
		confirm_btn_label = $.i18n.prop('buttons.update');
	} else {
		confirm_btn_label = $.i18n.prop('buttons.save');
	}
	
	var btns = {};
	btns[confirm_btn_label] = function() {
		//if (lbasValidate('categoryDetailForm')) 
			AjxUpdateCategory(categoryId);
	};
	
	btns[$.i18n.prop('buttons.cancel')] = function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
	};
	
	var $div = $('<div></div>').load('pages/template/editPOIPersonal.html', function(){
		$("#tabs_in_personalCategoryDialog").tabs({
			show: function(event, ui){
				switch (ui.index) {
					case 1:
						if($.trim($(ui.panel).html()).length===0)
							//openCategoryPermissionsTab(ui.panel);
							getCategorySharing();
						break;	
					default:
						if($.trim($(ui.panel).html()).length===0)
							openEditCatTab1(ui.panel, categoryType, categoryId);
						break;
				}				
			}
		});

		var btnSet = $("#personalCategoryDialog").parent().parent().parent().find(".ui-dialog-buttonpane");

		btnSet.addClass("category-btns");
		btnSet.find(".ui-dialog-buttonset").find('.ui-button:first-child').addClass("send-button graphicBtn violet");
		btnSet.find(".ui-dialog-buttonset").find('.ui-button:last-child').addClass("cancel-button graphicBtn little");
		$("#personalCategoryDialog").addClass("tabs-wrapper");
		$("#personalCategoryDialog").find(".ui-tabs-nav").addClass("tabs");
		
		
		
			
		/*$.ajax({
			type :'GET',
			url :'getCategoryDetail',
			data :{
				categoryType :categoryType,
				categoryId :categoryId
			},
			cache :false,
			success :function(data, textStatus) {
				if (checkResponseSuccess(data)) {
					$('#tab-1').html(data);
				}
			}
		});*/
		localize.newPersonalPlaceGroupDialog();
	});
	
	utils && utils.dialog({
		title: dialogTitle, 
		content: $div, 
		buttons: btns,
		css :'newPersonalCategory'
		});
		rePlaceDialog('newPersonalCategory');
}

function AjxUpdateCategory(categoryId) {

	var serializedFormData = '';
	var categoryType = $("#categoryDetailForm input[name=categoryType]").val();
	//var categoryId = $("#categoryDetailForm input[name=categoryId]").val();
	//var admin = aPage;
	if (categoryType === '1')
		serializedFormData = $("#tab-1 #categoryDetailForm").serialize();
	else if (categoryType === '0')
		serializedFormData = $("#tabs-1 #categoryDetailForm").serialize();

	var share = false;
	var ShareSerializedFormData = "";
	var shareList = [];
	if ($("#navigationCatShareRight").length > 0) {
		var users = $("#navigationCatShareRight  li[id*='rightUser']");
		var j = 0;
		for ( var i = 0; i < users.length; i++) {
			if (users[i].style.display != "none") {
			  shareList.push(users[i].id.replace('rightUser', ''));
				ShareSerializedFormData += "&selectedUserIdList=" + users[i].id.replace('rightUser', '');
				j++;
			}
		}
		share = true;
	}
	
	if (permissionsObj) 
	{
		var permsX = new Array();
		$.each(permissionsObj, function(i, val)
		{
			var perms = new Object();
			
			/*
			perms.addPOI = val.substr(0, 1);
			//perms.delete = val.substr(1, 1);
			perms["delete"] = val.substr(1, 1);
			perms.deletePOI = val.substr(2, 1);
			perms.edit = val.substr(3, 1);
			perms.editPermission = val.substr(4, 1);
			perms.sharePOI = val.substr(5, 1);
			perms.view = val.substr(6, 1);
			*/

			/*

			perms.addPOI = true;
			perms["delete"] = false;
			perms.deletePOI = true;
			perms.edit = false;
			perms.editPermission = true;
			perms.sharePOI = false;
			perms.view = true;

			perms.userId = i;
*/
			
			permsX.push(val);
			
			
			//serializedFormData += "&permList=" + i + ":" + val;
			
		});
		/*PermsSerializedFormData = JSON.stringify(permsX);*/
		PermsSerializedFormData = permsX;
	}
        
    var validator=new Validator({
	 categoryName: {
        domElement: '#categoryDetailForm_categoryName',
         validate: 'presence'
      }
    });
    function errorsOnDialog(serverErrors) {
    
      console.log(serverErrors)
		  var el = validator.parseServerErrors(serverErrors);
		  console.log("server errors ---> poicategori");
		
		if ( $('#error-view-category').length > 0) {
  		$('#error-view-category > div.content-cell >span','#dialog').html($.i18n.prop('error.send.title'));
  		$('#error-view-category > div > ul','#dialog').empty().append(el);
      $('#error-view-category','#dialog').show();
    } 
	}
	var options = {};
	options.data = serializedFormData;
	options.success = function(data, textStatus) {
		if (checkResponseSuccess(data,errorsOnDialog)) {
			if (share)
			{

				var optionsS = {};
				optionsS.contentType='application/json';
				optionsS.data= {};
				optionsS.data.categoryId=data.categoryId;
				optionsS.data.selectedUserIdList =shareList;
				optionsS.data =JSON.stringify(optionsS.data);
				optionsS.success = function() {
           utils && utils.closeDialog();
        };
				//optionsS.data = "categoryId=" + data.categoryId + ShareSerializedFormData;	
				utils && utils.lbasDoPost('json/updateCategoryShare.action', optionsS);
				
			}
			else
			{
			  var optionsS = {};
        var formData={}
        console.log(data.categoryId);
        console.log(categoryId);
        
        formData.categoryId=data.categoryId;
        formData.userPermissions=PermsSerializedFormData;
        optionsS.data =JSON.stringify(formData);
        optionsS.contentType='application/json';
        
			  $.ajax({
          type :'POST',
          url :'updatePoiCategoryPermissions.action',
          async :false,
          contentType:'application/json',
          data : JSON.stringify(formData),
          dataType :'json',
          success :function(json) {
            utils && utils.closeDialog();
          }
        });
			  
			  /*
				var optionsS = {};
				optionsS.data = "categoryId=" + data.categoryId + "&userPermissions=" + PermsSerializedFormData;	
				utils && utils.lbasDoPost('updatePoiCategoryPermissions.action', optionsS);
				*/
				
			}
		
			var btns = {};
			btns[$.i18n.prop('buttons.ok')] = function() 
			{
				$('.dialog').dialog('close');
				if(categoryType==='1'){ //private
					places && places.getPrivate();
				}else{ //enterprise
					places && places.getEnterprise();
				}
				$(this).dialog('close');
			};
			utils && utils.dialog({title: $.i18n.prop('dialog.title.success'), content: $.i18n.prop('location.group.update.success'), buttons: btns});
		};
	};
        
        if (categoryId != undefined && categoryId === 0)
            utils && utils.lbasDoPost('addNewPoiCategory.action', options);
        else
            utils && utils.lbasDoPost('updatePoiCategory.action', options);
        
        
	//utils && utils.lbasDoPost('updateCategoryDetail', options);
}

function popupConfirmationDialog() {
	var btns = {};
	btns[$.i18n.prop('buttons.ok')] = function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
	};
	document.getElementById("selectConfirmation").style.display = "";

	$(function() {
		$("#selectConfirmation").dialog({
			bgiframe :true,
			resizable :false,
			height :140,
			modal :glbmodal,
			overlay :{
				backgroundColor :'#000',
				opacity :0.5
			},
			buttons :btns
		});
	});

	$("#selectConfirmation").dialog('open');

}

function deleteCategory(categoryId, type, admin, listIndex) {
	var btns = {};
	btns[$.i18n.prop('buttons.ok')] = function() {
		$.ajax({
			url :"deleteCategory.action",
			type :'POST',
			data :{
				categoryId :categoryId
			},
			dataType :'json',
			success :function(json) {
				if (json.errorText == null) {
					if (admin) {
						$("#list2").trigger("reloadGrid");
					} else {
						loadCategories(type, listIndex);
					}

				}
			}
		});

		$(this).dialog('close');
		$(this).dialog('destroy');
	};
	btns[$.i18n.prop('buttons.cancel')] = function() {
		$(this).dialog('close');
		$(this).dialog('destroy');
	};

	document.getElementById("deleteConfirmation").style.display = "";
	$(function() {
		$("#deleteConfirmation").dialog({
			bgiframe :true,
			resizable :false,
			height :140,
			modal :glbmodal,
			overlay :{
				backgroundColor :'#000',
				opacity :0.5
			},
			buttons :btns
		});
	});
	$("#deleteConfirmation").dialog('open');
}
function deleteMultipleCategories(selectedCategories, admin) {

	var filterSelectedCat = new Array;
	var showMessage = false;
	$.each(selectedCategories , function(i ,val){
		if(val !== -1){
			filterSelectedCat.push(val);
		}else{
			showMessage = true;
		}
	});
	if(showMessage){
/*
		utils && utils.dialog({
			title: $.i18n.prop('dialog.title.error'), 
			content: $.i18n.prop('category.not.be.deleted')
		});		
*/		
	    utils && utils.dialog({
            content : "<div class='notInWorkingHours'><img src='images/icon_notification.png' style='float:left;' alt='...' /> <div style='width:215px;float:left; margin-left:10px; '><p style='margin-top:5px;'>"+ $.i18n.prop('category.not.be.deleted') +"</p></div> </div>",
            css: 'noCloseNoOk'
        });
        $(".notInWorkingHours").css("width",260);   
        $(".noCloseNoOk").hide().fadeIn("slow");
        timeMsg();

		
	}
	if( filterSelectedCat.length === 0){
		return false;
	}
	
	var options = {};
	options.data = {
		selectedCategoryIds: filterSelectedCat
	};
	options.async = false;
	options.success = function(json) {
		if(checkResponseSuccess(json)){
			$('.dialog').dialog('close');
			var btns = {};
			btns[$.i18n.prop('buttons.ok')] = function(){
				places && places.reloadTabs();
				$(this).dialog('close');
			};
			
			if(json.authorizationMessage != undefined){
				utils && utils.dialog({
					title: $.i18n.prop('dialog.title.error'), 
					content: json.authorizationMessage,
					buttons: btns
				});				
			}else{
				utils && utils.dialog({
					title: $.i18n.prop('dialog.title.success'), 
					content: json.infoMessage,
					buttons: btns
				});				
			}
		}
	};
	
	utils && utils.lbasDoPost('deleteMultipleCategories.action', options);
}

function changeCategoryAdm() {
    $('#changeCategoryAdm').hide();
	$.ajax({
		type :'GET',
		url :'json/getUsersForPoiCategoryAdminChange.action',
		data :{
			categoryId :$('#categoryDetailForm input[name=categoryId]').val()
			},
		cache :false,
		success :function(data) {
			if (checkResponseSuccess(data)) {
			  console.log(data);
			  if(data.poiCategoryAdminsByGroups[0]) {
				var selectedChangeAdmin;
        var groupId=data.poiCategoryAdminsByGroups[0].groupId;
        $('#catadmintable tbody').append('<tr class="toChangeAdmin"><td><select id="changeCurAdmin"><option>Select Admin</option></select> <a href="#" id="changeCurAdminSave" class="purple_button"><span>save</span></a><a class="multi_user_button" href="#" id="changeCurAdminCancel"><span>Cancel</span></a></td></tr>');
        $.each(data.poiCategoryAdminsByGroups, function(index, value){
        	$.each(value.users, function(i, val){
          	var newOption ="<option value="+val.id+">"+val.name+"</option>";
          	$('#changeCurAdmin').append(newOption);
        	});
        });            
       $('#changeCurAdmin').selectmenu({
         change : function(){
        selectedChangeAdmin = $(this).selectmenu("value");
         }
       });	               
       $('#changeCurAdminSave').on('click', function(e){
					$.ajax({
						type :'GET',
						url :'json/updatePoiCategoryAdmin.action',
						data :{
		               		categoryId :$('#categoryDetailForm input[name=categoryId]').val() ,
		               		selectedAdminId : selectedChangeAdmin
							},
						cache :false,
						success :function(data) {
							if (checkResponseSuccess(data)) {
								$('#tabs-3').empty();
								getAdminOfCategory();
							}
						}
					});
					e.preventDefault();
               });
               $('#changeCurAdminCancel').on('click', function(e){   
	              $('#changeCategoryAdm').show();                        
	              $(this).parent().parent().remove(); 
	              e.preventDefault();
               });
			}
			}
		}
	});

	/*
$.post('changeCategoryAdm.action', function(data) {
		if (checkResponseSuccess(data)) {
			$('#tabs-3').html(data);
			userArray = new Array();

			var id;
			var name;

			$("#navigationCatAdmin li[id*='user']").each(function() {
				id = $(this).attr("id");
				id = id.replace("user", "u");
				name = $(this).text();
				var newelement = new uelement(id, name);
				userArray.push(newelement);
			});

			$("#navigationCatAdmin a[class*='head']").each(function() {
				id = $(this).parent().attr("id");
				id = id.replace("group", "g");
				name = $(this).text();
				name = name.substring(0, name.indexOf("("));
				var newelement = new uelement(id, name);
				userArray.push(newelement);
			});

			changeAdminTabReady('change');
		}
	});
*/
}

function getAdminOfCategory(container) {
	$('#changeCategoryAdm').show();
	$.ajax({
		type :'GET',
		url :'json/getCategoryAdmin.action',
		data :{
			categoryId :$('#categoryDetailForm input[name=categoryId]').val()
			},
		cache :false,
		success :function(data) {
			if (checkResponseSuccess(data)) {
        $('.newCategoryPopUp #tabs-3').html(parseTemplate("editCategoryAdminSection", {
          data :data
        }));
         /*add change button */
        $('#changeCategoryAdm').toggle((data.categoryAdmins.length > 0));
        localize && localize.adminPlaceManagement();
			}
		}
	});
}

function openCategoryPermissionsTab(container) {
	if ($(container).html().length == 0) {
		getCategoryPermissions("", container);
	}
}
function getCategoryPermissions(userID, container) {
	$(container).load('pages/template/saveCategoryDialogTemplate_tab2.html?' + Math.floor(Math.random()*82342), function(){
		permissionsObj = {};
		
		/*
		if (poiId <= 0 || poiId == undefined) {
			$("#addLocationButton").show();
			$("#updateLocationButton").hide();
		} else {
			$("#updateLocationButton").show();
			$("#addLocationButton").hide();
		}
		*/
		$("#cancelButton").show();
		categoryId=$('#categoryDetailForm input[name=categoryId]').val();
		addPermissionSearch();
		var options = {};
		options.data = {
			searchUserId :userID,
			categoryId :categoryId
		};
		options.async = false;
		options.success = function(data)
		{
			$.each(data.usersByGroups, function(j, h)
			{
				var $divOut = $('<div id="catPermGroup' + h.groupId + '"></div>');
				var $ul = $('<ul></ul>');
				var $li = $('<li class="wp-list-group"></li>').attr('id', 'group' + h.groupId);
			  var $divc = $('<div class="group accordionStyles"></div>');
			  var $input = $('<input type="checkbox" id="gCat' + h.groupId +'" value="' + h.groupId + '" class="groupIdCat check-box">')
			      .data('group', h)
			      .unbind('change')
			      .change(function(e)
			      {
			      	var id = $(this).attr('id').substring('gCat'.length);
				      clickGroup(this,id,'cat');
				      return false;
			      });
			
			    /*group count display options*/
			    var groupName = '<span class="groupName" id="groupName_' + h.groupId + '">' + h.groupName + '</span> <span class="groupUsercount"><span class="all_total_count">' + h.userCount + '</span></span>';
			    var $label = $('<span id="label_g' + h.groupId + '" class="groupNameContainerCat" />')
			      .html(groupName)                    
			      .click(function(){
                		var id = $(this).attr('id').substring('label_g'.length);
                        //checkUser(id);
                        var container = $('#userG_'+id);
                        var $subul = $(this).parent().parent().find('ul');
                        if(container.is(':visible')){
                            $(this).prev().attr('src', 'images/arrow_right.png');
                            $(this).prev().find('img').attr('src', 'images/arrow_right.png');
                            container.hide();
                            
                        }else{
    			      		$(this).prev().find('img').attr('src', 'images/arrow_down.png');
                            container.show();
                        }
                            
                    });

			   var $openclose = $('<span id="userG_details_' + h.groupId + '"></span>')
                    .addClass('openCloseCat')
                    .click(function(){
                		var id = $(this).attr('id').substring('userG_details_'.length);
                        //checkUser(id);
                        var container = $('#userG_'+id);
                        var $subul = $(this).parent().parent().find('ul');
                        if(container.is(':visible')){
                            $(this).attr('src', 'images/arrow_right.png');
                            $(this).find('img').attr('src', 'images/arrow_right.png');
                            container.hide();
                            
                        }else{
                            $(this).find('img').attr('src', 'images/arrow_down.png');
                            container.show();
                        }
                            
                    });
                    $('<img src="images/arrow_right.png" class="openCloseCat"/>')
                    .appendTo($openclose);
			   
			    $divc.append($input);
			    $divc.append($openclose);
			    $divc.append($label);
			    $li.append($divc);
				
				
				var $ulN = $('<ul id="userG_' + h.groupId + '" style="display:none;"></ul>');
				$.each(h.users, function(x, usr)
				{	
					var $liN = $("<li></li>");
				    var $div = $('<div id="item_' + usr.id + '"></div>').addClass('usersList').addClass('groupElement');
				    var $div1 = $('<div></div>').addClass('container');
				    var $checkbox = $('<input type="checkbox" data-cat="'+categoryId+'" id="catCheckUser' + usr.id + '" value="' + usr.id + '" class="cat check-box" name="user' + usr.id + '"><img class="openCloseCat" src="images/arrow_right.png">')
				      .unbind('change')
				      .change(function(e){
				        var attr_id=$(this).attr('id');
				        if (attr_id) {
  				      	var id = $(this).attr('id').substring('catCheckUser'.length);
  				      	clickUser('cat',this,id);
				      	}
				      	return false;
				      });
				    
				    
				    var $span1 = $('<span id="item_name_' + usr.id + '"></span>')
				      .text(Encoder.htmlDecode(usr.name) || ' ');
				    
				    $div1.append($checkbox);
				    $div1.append($span1);
				    $div.append($div1);
				    $liN.append($div);
				    $ulN.append($liN);

				});
				
				//$ulN.hide();
				$li.append($ulN);
				$ul.append($li);
				$divOut.append($ul);
				$('#navigationCat').append($divOut);
				
				/*
				var $li_user = $('<li></li>');
				var $i_user = $('<input id="locCheckUser'+h.id+'" type="checkbox" value="'+h.id+'" id="user'+h.id+'">')
					.data('u', h)
					.click(function(){
						var id = $(this).data('u').id;
						clickUser('loc', this, id);
					});
				var $l_user = $('<label for="user'+h.id+'">'+h.name+'</label>');
				$li_user.append($i_user).append($l_user);
				$ul.append($li_user);
				*/
			});
			
			
		
			/*$.each(data.usersByGroups[0].users, function(j, h){
				var $li_user = $('<li></li>');
				var $i_user = $('<input id="locCheckUser'+h.id+'" type="checkbox" value="'+h.id+'" id="user'+h.id+'">')
					.data('u', h)
					.click(function(){
						var id = $(this).data('u').id;
						clickUser('loc', this, id);
					});
				var $l_user = $('<label for="user'+h.id+'">'+h.name+'</label>');
				$li_user.append($i_user).append($l_user);
				ui.newContent.find('ul').append($li_user);
			});	*/
		};
		utils && utils.lbasDoGet('json/getUsersForPoiCategoryPermissions.action', options);
		
		
		//getLocationPermissions('', poiId);
		
		/*$('#navigationLoc').accordion({
			collapsible: true,
		    icons : {
		    	header: 'ui-icon-plus',
		        headerSelected: 'ui-icon-minus'
		    },
		    active: false,
		    fillSpace: true,
		    clearStyle: true,
		    changestart: function(event, ui){
		    	
		    	var isEmpty = ui.newContent.find('ul li').length===0;
		    	if(isEmpty){
					var data = ui.newHeader.find('input:checkbox').data('g');
					
					if(data){
					
						
					
						var options = {};
						options.data = {
							searchUserId :userID,
							categoryId :$('#categoryDetailForm input[name=categoryId]').val()
						};
						options.async = false;
						
						options.success = function(data){

							$.each(data.usersByGroups[0].users, function(j, h){
								var $li_user = $('<li></li>');
								var $i_user = $('<input id="locCheckUser'+h.id+'" type="checkbox" value="'+h.id+'" id="user'+h.id+'">')
									.data('u', h)
									.click(function(){
										var id = $(this).data('u').id;
										clickUser('loc', this, id);
									});
								var $l_user = $('<label for="user'+h.id+'">'+h.name+'</label>');
								$li_user.append($i_user).append($l_user);
								ui.newContent.find('ul').append($li_user);
							});	
						};
						utils && utils.lbasDoGet('json/getUsersForPoiCategoryPermissions.action', options);
					}
		    	}
			}
		});*/
	});
}

function showMultiplePoi(selectedCategories) {
	var element;
	var poiCount = 0;
	var totalPoiCount = 0;

	//var points = [];
	var poiArray = [];
	//var sumLat = 0;
	//var sumLon = 0;
        
        var poisX = [];
	for ( var x = 0; x < selectedCategories.length; x++) {
		// value=categoryId+type+listIndex+poicount
		element = selectedCategories[x];
		type = element.type;
		poiCount = element.poicount;
		totalPoiCount += parseInt(poiCount);
                poisX.push(element.id + ':' + element.type + ':' + element.poiCount);
	}
	
	$.post("listPoisForMultipleShow.action", {
		selectedCategoryList: poisX,
		type: type
	}, function(data) {
		for ( var x = 0; x < data.poiList.length; x++) {
			poiArray[x] = {
				id :data.poiList[x].id,
				lat :data.poiList[x].latitude,
				lon :data.poiList[x].longitude,
				radius :data.poiList[x].radius,
				micon :data.poiList[x].micon,
				name :data.poiList[x].name,
				address :data.poiList[x].address
			};
		}

		showPoiArrayOnMap(poiArray);

	}, "json");
	// }
}

function openRequestCategoryPermissionDialog(categoryId, categoryName) {
	$("#reqCPermMessageContent").val('');
	$("#requestedObjectId").val('');
	$("#requestedObjectId").val(categoryId);
	$("#requestCategoryPermissionDialog").dialog({
		title :categoryName + "<br/>" + $.i18n.prop('category.RequestPermission'),
		bgiframe :true,
		modal :glbmodal,
		resizable :false,
		close :function(event, ui) {
			$("#requestCategoryPermissionDialog").dialog('destroy');
		}
	}).height("auto");
	$('#reqCPermMessageContent').maxlength({
		'feedback' :'.charsLeft'
	});
	$('#reqCPermMessageContent').val($.i18n.prop('category.typeYourReason'));
	$('#reqCPermMessageContent').css('color', 'grey');
	$('#reqCPermMessageContent').blur();
}

function requestCategoryPermission2() {
	var serializedFormData = $('#requestCategoryPermission').serialize();
	$.ajax({
		type :'POST',
		url :'requestCategoryPermission',
		data :serializedFormData,
		success :function(ajaxCevap) {
			$("#requestCategoryPermissionDialog").dialog('close');
		}
	});
}

function clearCategoryDialogTabs() {
	$('#tabs-1').html("");
	$('#tabs-2').html("");
	$('#tabs-3').html("");
	$('#tab-1').html("");
	$('#tab-2').html("");
}

function getUsersForAdminChange(selected, method) {
/*
	$.post('getUsersForAdminChange.action', {
		categoryId :$('#categoryDetailForm input[name=categoryId]').val(),
		searchUserId :selected,
		method :method
	}, function(data) {
		if (checkResponseSuccess(data)) {
			$('#CategoryAdmin').append('<div id="possibleAdmins"></div>');
			$('#possibleAdmins').html(data);
			changeAdminTabReady(method);
			localize && localize.adminPlaceManagement();
			$('.categoryTable').parent().attr('id','categoryTableCover');
			$('.categoryTable').css('position','static');
		}
	});
*/
	
	/* editCategoryAdminSectionNewAdmin */
	$.ajax({
		type :'POST',
		url :'json/searchUsersForPoiCategoryAdminChange.action',
		data :{
			categoryId :$('#categoryDetailForm input[name=categoryId]').val(),
			searchId :selected,
			method :method
			},
		cache :false,
		success :function(json) {
			if (checkResponseSuccess(json)) {
				$('#CategoryAdmin').append('<div id="possibleAdmins"></div>');
          $('#possibleAdmins').html(parseTemplate("editCategoryAdminSectionNewAdmin", {
            json :json
          }));
          localize && localize.adminPlaceManagement();
          changeAdminTabReady(method);
          /*autoopen*/
          if(selected != "" && json.poiCategoryAdminsByGroups) {
            $('#group'+json.poiCategoryAdminsByGroups[0].groupId +'> a').trigger('click');
          }
          
          
			}
		}
	});
}

function changeAdminTabReady(method) { 
	if (method == 'add') {
	 $("#changeCategoryAdminUserSearch").autocomplete(
   {
     source: function (b, a) {
            $.getJSON("userSearchAutocomplete.action", {
                q: encodeURIComponent(b.term),
                  excludedUser :creatorId
            }, function (c) {
                a($.map(c.resultList, function (d) {
                    return {
                        label: Encoder.htmlDecode(d.name),
                        value: Encoder.htmlDecode(d.name),
                        id: d.id
                    }
                }))
            })
        },
        minLength: 1,
        maxLength:30,
        /*appendTo:"#wp_autocomplete",*/
     select :function(event, ui) {
       /*$('#changeCategoryAdminUserSearch').val(unEscapeHtmlEntity(ui.item.id));*/
       getUsersForAdminChange(unEscapeHtmlEntity(ui.item.id), method);
       /*findAndSelectUserOrGroupOnLocationPermission(ui.item.id);*/
       /*$(this).blur().val($.i18n.prop('general.Search'));*/
       return false;
     }
   })
	  
	  
	  
	  /*
		$("#changeCategoryAdminUserSearch").autocomplete("userSearchAutocompleteeee", {
			width :260,
			selectFirst :false,
			extraParams :{
				excludedUser :creatorId
			},
			parse :function(data) {
				var parsed = new Array();
				var json = data;
				var resultList = json.resultList;
				for ( var i = 0; i < resultList.length; i++) {
					parsed[i] = {
						data :new Array(resultList[i].value, resultList[i].key),
						value :resultList[i].value,
						result :resultList[i].value
					};
				}
				return parsed;
			}
		});*/

    /*
		$('#changeCategoryAdminUserSearch').result(function(event, data, formatted) {
			$('#changeCategoryAdminUserSearch').val(unEscapeHtmlEntity(data[0]));
			getUsersForAdminChange(unEscapeHtmlEntity(data[1]), method);
		});*/

	} else if (method == 'change') {
    /*
		$("#changeCategoryAdminUserSearch").autocomplete(userArray, {
			formatItem :function(uelement) {
				return uelement.name;
			},
			formatMatch :function(uelement) {
				return uelement.name;
			},
			formatResult :function(uelement) {
				return uelement.name;
			}
		});
		*/
    /*
		$('#changeCategoryAdminUserSearch').result(function(event, data, formatted) {
			getUsersForAdminChange(data.userid, method);
		});*/
	}

	jQuery('#navigationCatAdmin').accordion({
		active :false,
		header :'.head',
		navigation :true,
		autoHeight :false,
		animated :false,
		collapsible :true,
		icons :{
			'header' :'ui-icon-plus',
			'headerSelected' :'ui-icon-minus'
		}
	});
	$(".accordionCheckBox").click(function(e) {
		e.stopPropagation();
		e.preventDefault();
	});
}

function uelement(userid, name) {
	this.userid = userid;
	this.name = name;
}
