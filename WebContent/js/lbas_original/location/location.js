(function($,undefined){
  '$:nomunge'; // Used by YUI compressor.
  
  $.fn.serializeObject = function(){
    var obj = {};
    $.each( this.serializeArray(), function(i,o){
      var n = o.name, v = o.value;
      if(n.indexOf(".") != -1) {
        var aw=n.split(".");
        var no=aw[0];
        if(obj[no]===undefined) obj[no]={};
         obj[no][aw[1]]=v;
         delete obj[n]
      } else {
       obj[n] = obj[n] === undefined ? v : $.isArray( obj[n] ) ? obj[n].concat( v ) : [ obj[n], v ];
      }
    });
    return obj;
  };
  
})(jQuery);

var currentPois = {};
var userArrayForSearch;
var poiCategActions;
var permissionsObj = {};
var storedPoiDetailEdit;

var lettersDEArr = [ "?", "?", "?", "?", "?", "?", "?", "?" ];
function isLetterExists(str,strArr) { 
  for ( var i = 0; i < str.length; i++) {
    if(strArr.indexOf(str.charAt(i)) > -1){
      return true;
    }
  }
  return false;
}

function attachEvent(obj, event, handler) {
  if (obj.addEventListener)
    obj.addEventListener(event, handler, false);
  else if (obj.attachEvent)
    obj.attachEvent("on" + event, handler);
  else
    obj["on" + event] = handler;
}

function clearPOIDialogTabs() {
  $('#edit_loc_tab1').html("");
  $('#edit_loc_tab2').html("");
  $('#edit_loc_tab3').html("");
  $('#edit_loc_tab4').html("");
}

function selectNewIcon(path,id){
  var splittedPath=path.split('/');
  var pathParam = splittedPath[splittedPath.length-1];
  if(selectedIconType == 'poi'){
    if(aPage) {
      $("img[name=poi.iconName]").attr({src: "../images/" + pathParam});
    }else {
      $("img[name=poi.iconName]").attr({src: "images/" + pathParam});
    }
      $("input[name=poi.iconId]").attr({value: id});
        
  }else if(selectedIconType == 'group'){
    if(aPage) {
      $('#groupImage').attr({src: "../images/" + pathParam});
    }else {
      $('#groupImage').attr({src: "images/" + pathParam});
    }
     $('#groupIconId').val(id);
  }
  else
  {
    var icon_path = path;
    if(catType == 1)
    {    
       $('#tab-1 #categoryImage').attr({src:icon_path});
       $('#tab-1 #pathId').val(pathParam);
       $('#tab-1 #iconId').val(id);
    }
    else if(catType == 0)
    {
       $('#tabs-1 #categoryImage').attr({src:icon_path});
       $('#tabs-1 #pathId').val(pathParam);
       $('#tabs-1 #iconId').val(id);
    }

  }
    $('span.ui-icon-closethick:last').click();
    $("#iconDialog").dialog('destroy') ;

}

function createWrapperTabsEditLocation() {
  /* check if container was deleted */
   utils.closeDialog(); 
   /*$("div.openDetailsPlaces").dialog('destroy'); 
   $("div.openDetailsPlaces").remove();*/
   $("#edit_loc_dialog").dialog('destroy');
   $("#edit_loc_dialog").remove();
   /*else {
    $("#edit_loc_dialog").dialog('destroy');
  }*/
  
   if( $("#tabs_in_edit_loc").length <1 ){
      var $cover = '<div id="tabs_in_edit_loc"></div>'; 
      var $ul = '<ul><li id ="edit_loc_tab1_list_item"><a id="edit_loc_tab1_link" href="#edit_loc_tab1" onclick="openEditLocTab1();">'+$.i18n.prop("editLocationDialog.Details")+'</a></li>  <li id ="edit_loc_tab2_list_item"><a id="edit_loc_tab2_link" href="#edit_loc_tab2" onclick ="openEditLocTab2();">'+$.i18n.prop("editLocationDialog.Categories")+'</a></li><li id ="edit_loc_tab3_list_item" ><a id="edit_loc_tab3_link" href="#edit_loc_tab3" onclick ="openEditLocTab3();">'+$.i18n.prop("editLocationDialog.Permissions")+'</a></li><li id ="edit_loc_tab4_list_item"><a id="edit_loc_tab4_link" href="#edit_loc_tab4" onclick ="openEditLocTab4();">'+$.i18n.prop("editLocationDialog.Admin")+'</a></li></ul>';
      var $error_div='<div id="error-view-sendmessage" class="box-error-message"><div class="content-cell"><span><#= $.i18n.prop("error.send.title") #></span><ul id="send-list-wrapper"></ul></div></div>';   
      var $tabs ='<div id="edit_loc_tab1"> </div> <div id="edit_loc_tab2"> </div><div id="edit_loc_tab3"> </div><div id="edit_loc_tab4"> </div><div class="buttons"><a id ="updateLocationButton" href="#" style="float:right; display:none;" class="purple_button" ><span class="lm" key="buttons.save" >Update</span></a><a id ="cancelButton" href="#"  class="multi_user_button"><span class="lm" key="buttons.update" >Cancel</span></a><a id ="addLocationButton" href="#" style="float:right;display:none;" class="purple_button"  onclick="if (lbasValidate(\'updateLocationDetail\')) { AjxSaveNewLocation(); } return false;" tabindex="20" ><span class="lm" key="buttons.save" >Saves</span></a></div>';
      
      
      if($("#edit_loc_dialog").length < 1) {
        $('body').append($('<div id="edit_loc_dialog" style="display:none;" title="" />'));
      }
       $("#edit_loc_dialog").append($cover);
      
      
      /*
      if($('. #dialog').length >0) {
         $('.openDetailsPlaces #dialog').append($cover);
      }*/
     
     //
      var html_append=$ul+$error_div+$tabs;
      
      $("#tabs_in_edit_loc").append(html_append);
     }
}




function openEditLocationDialog(locationId, name, locationType, modal, editPermissionRight,editRight,changeCategoryRight,data) {
  
  /*utils.closeDialog();*/

    /* utils.closeDialog();*/
      /* 
        $("#edit_loc_dialog").dialog( {
     title :name,
     bgiframe :true,
     width :650,
     modal :modal,
     resizable :false,
     close : function(event, ui) {
      $("#edit_loc_dialog").dialog('destroy');
     }
  }).height("auto");
    */
/*  clearPOIDialogTabs();    */
   createWrapperTabsEditLocation();
   $('html,body').animate({scrollTop: 0}, 1000);
   btns = {};
   utils && utils.dialog({
    title : name,
    content :$('#tabs_in_edit_loc'),
      css: 'openDetailsPlaces noClose',
      buttons: btns
    });    
     $('.openDetailsPlaces').css({
      'max-width':820,
      "width":665,
      'margin-left':-333,
      'left':'50%',
      'top':100
     });
    
    $("#tabs_in_edit_loc").tabs();
    var whichGroup = 0;
    if($('.openDetailsPlaces').length === 1){
      if($('#'+locationId).parent().parent().length >0) {
        whichGroup = $('#'+locationId).parent().parent().attr('id').split('_');
        whichGroup = whichGroup[1];
      }
    }
  $("#selectedLocationId").attr( {
    value :locationId
  });
  $("#selectedLocationType").attr( {
    value :locationType
  });
  $("#edit_loc_tab1_list_item").show();
  if (changeCategoryRight == false){
    // changeCategoryRight hakki yoksa tab cikmasin
    $("#edit_loc_tab2_list_item").hide();
  } else {
    $("#edit_loc_tab2_list_item").show();
  }
  $("#edit_loc_tab4_list_item").show();
    
  if (editPermissionRight == false){
    // edit permission hakki yoksa tab cikmasin
    $("#edit_loc_tab3_list_item").hide();
  } else {
    $("#edit_loc_tab3_list_item").show();
  }
  var whichFormToValidate = 'updateLocationDetail';   
  
        //$("#tabs_in_edit_loc").tabs('select', 0);
        //openEditLocTab1('#edit_loc_tab1', data);
        
  $("#addLocationButton").hide();
  $('#updateLocationButton').show().unbind().click(function(e) {           
    /* if (lbasValidate(whichFormToValidate)){ */
      AjxUpdateLocation();
      e.preventDefault();
    /*}*/     
  });

  $('#cancelButton').unbind().click(function(e) {           
    $('.openDetailsPlaces span.ui-icon-closethick:last').click();
    $(".ui-dialog-titlebar-close").click();
    utils.closeDialog();
    e.preventDefault();  
    e.stopPropagation();
  });
        $('#edit_loc_tab1').empty().load('pages/template/savePlaceDialogTemplate_tab0.html', function(){
            $.post('json/editPoi.action', {
                    'poiId' :locationId
            }, function(data) {
                if (checkResponseSuccess(data)) {
                  storedPoiDetailEdit=data;
                    $('#updateLocationDetail_categoryType').val(data.poi.type);
                    if (data.poi.categories) $('#updateLocationDetail_categoryIDs').val(data.poi.categories.join("_"));
                    $("#updateLocationDetail input[name='poi.id']").val(data.poi.id);
                    $("#updateLocationDetail input[name='poi.type']").val(data.poi.type);
                    $("#updateLocationDetail input[name='poi.name']").val(data.poi.name);
                    $("#updateLocationDetail input[name='poi.email']").val(data.poi.email);
                    $("#updateLocationDetail input[name='poi.street']").val(data.poi.street);
                    $("#updateLocationDetail input[name='poi.website']").val(data.poi.website);
                    $("#updateLocationDetail input[name='poi.shortDescription']").val(data.poi.shortDescription);
                    $("#updateLocationDetail input[name='poi.longDescription']").val(data.poi.longDescription);
                    $("#updateLocationDetail input[name='poi.phone']").val(data.poi.phone);
                    $("#updateLocationDetail input[name='poi.fax']").val(data.poi.fax);
                    $("#updateLocationDetail input[name='poi.language']").val(data.poi.language);
                    $("#updateLocationDetail input[name='poi.city']").val(data.poi.city);
                    $("#updateLocationDetail input[name='poi.country']").val(data.poi.country);
                    $("#updateLocationDetail input[name='poi.address']").val(data.poi.address);
                    $("#updateLocationDetail input[name='poi.postcode']").val(data.poi.postcode);
                    $("#updateLocationDetail input[name='poi.houseNo']").val(data.poi.houseNo);
                    $("#updateLocationDetail #poiDetailLatitude").text(data.poi.latitude);
                    $('#updateLocationDetail #updateLocationDetail_poi_latitude').val(data.poi.latitude);
                    $("#updateLocationDetail #poiDetailLongitude").text(data.poi.longitude);
                    $("#updateLocationDetail #updateLocationDetail_poi_longitude").val(data.poi.longitude);
                    
                    if(data.poi.openFrom) {
                      var ar=data.poi.openFrom.split(":");
                      $("#updateLocationDetail #updateLocationDetail_openFromHour").val(utils.formatMinuteDate(ar[0]));
                      $("#updateLocationDetail #updateLocationDetail_openFromMin").val(utils.formatMinuteDate(ar[1]));
                    }
                    if(data.poi.openTo) {
                      var ar=data.poi.openTo.split(":");
                      $("#updateLocationDetail #updateLocationDetail_openToHour").val(utils.formatMinuteDate(ar[0]));
                      $("#updateLocationDetail #updateLocationDetail_openToMin").val(utils.formatMinuteDate(ar[1]));
                      
                    }
    
                    
                    /*openFrom*/
                    /*openTo*/
                    
                    

                    $("#edit_loc_dialog").dialog( "option", "position", 'center' );
                    var radius = $("#editPoiRadius").val();
                    if (radius > 0) {
                            $("#editPoiRadiusCheckbox").attr("checked", true);
                            $("#editPoiRadius").css("display", "");
                    } else if (radius == 0) {
                            $("#editPoiRadiusCheckbox").attr("checked", false);
                            $("#editPoiRadius").css("display", "none");
                    }
                }
            });
        }); 
}
var selectedIconType;
var catType;

function openSelectIconDialog(categoryType, type, iconInputTagName) {
  selectedIconType = type;
  catType = categoryType;
  if ($('#iconDialog').length == 0) {
    var currentLocationIcon = $("input[name=" + iconInputTagName + " ]").attr('value');
    $('#iconsDiv').load('retrieveLocationIcons', {
      'currentLocationIcon' :currentLocationIcon
    }, openSelectIconDialog2);
  } else {
    openSelectIconDialog2();
  }
}

function openSelectIconDialog2() {
  $("#iconDialog").dialog( {
    bgiframe :true,
    width :450,
    height :500,
    modal :glbmodal,
    close : function(event, ui) {
      $("#iconDialog").dialog('destroy');
    }
  });

  // $("[aria-labelledby ='ui-dialog-title-iconDialog']").css("z-index", "5006");

}

function openSaveLocationDialog(name, data) {
  storedPoiDetailEdit=data;
  createWrapperTabsEditLocation();
  try {
  clearPOIDialogTabs();
  $("#edit_loc_dialog").dialog( {
    title :name,
    bgiframe :true,
    width :650,
    modal :true,
    resizable :false,
    close : function(event, ui) {
      $("#edit_loc_dialog").dialog('destroy');
    }
  }).height("auto").hide();
                
    //var templateName = "savePlaceDialogTemplate";
                
    
  utils && utils.dialog({
      title : name,
      content :$('#edit_loc_dialog'),
        css: 'openDetailsPlaces noClose',
        buttons: btns
    });    
    
     $('.openDetailsPlaces').css({
      'max-width':820,
      "width":690,
      'margin-left':-333,
      'left':'50%',
      'top':100
     });
     
      $('.ui-dialog').hide();
      $('.openDetailsPlaces').show();
      $("#edit_loc_dialog").show();
      $(".openDetailsPlaces #addLocationButton").show();
      $(".openDetailsPlaces #addLocationButton span").text($.i18n.prop("buttons.save"));
      $(".ui-dialog-buttonpane").hide();
      $('#cancelButton').unbind().click(function(e) {           
        utils.closeDialog();      
        e.preventDefault();
      });

    
    $("#tabs_in_edit_loc").tabs({
    cache: false,
    opacity: 'toggle'
  });

    
    /*var content = $('<div></div>').load('pages/template/' + templateName + '.html?_' + Math.floor(Math.random()*82342), function(){
      
      
      /*
      $.get("openSaveLocationDialog.action", {
        'latitude': addressObj.latitude,
        'longitude': addressObj.longitude
      }, function(data) {
        if (checkResponseSuccess(data)) {
          $('#edit_loc_tab1').html(data);
          $("#edit_loc_dialog").dialog( "option", "position", 'center' );
          $("#updateLocationDetail input[name='poi.street']").val(addressObj.street);
          $("#updateLocationDetail input[name='poi.city']").val(addressObj.city);
          $("#updateLocationDetail input[name='poi.country']").val(addressObj.country);
          $("#updateLocationDetail input[name='poi.address']").val(addressObj.address);
          $("#updateLocationDetail input[name='poi.postcode']").val(addressObj.postcode);
          $("#updateLocationDetail input[name='poi.houseNo']").val(addressObj.houseNumber);
          
          $("#selectedLocationId").val('');
          $("#selectedLocationType").val(1);

          $("#edit_loc_tab4_list_item").hide();

                                        $("#saveAsEnterpriseButton").hide();
          $("#addLocationButton").show();
          $("#updateLocationButton").hide();
            
        }
      });
      */
      
          openEditLocTab1('#edit_loc_tab1', data);
          openEditLocTab2('#edit_loc_tab2', data);
          openEditLocTab3('#edit_loc_tab3');
          openEditLocTab4('#edit_loc_tab4');
      
      localize && localize.newPlaceDialog();
    /*});*/
    
                /*
                $('#addLocationButton').click(function() {            
                        if(lbasValidate('updateLocationDetail')) 
        AjxSaveNewLocation();
                              
                });
                    */
                
    var btns = {};
    btns[$.i18n.prop('buttons.save')] = function() {
      if(lbasValidate('updateLocationDetail')) 
        AjxSaveNewLocation();
    };
    btns[$.i18n.prop('buttons.cancel')] = function() {
      $(this).dialog('close');
      $(this).dialog('destroy');
    };
                
    //utils && utils.dialog({title: $.i18n.prop('saveLocation.title'), content: content, buttons: btns});
  } catch (e) {
    
  }

}

function openShare3rdPartyDialog(poiDetail){
  shareListCounter = 0;
  shareList = new Array();
  
  var dialogTitle = $.i18n.prop('tooltipshare.title') + ' ' +poiDetail.name;    
  
/*
  $("#share3rdPartyDialog").html('');
  $("#share3rdPartyDialog").dialog( {
    modal :glbmodal,    
    bgiframe :true,
    resizable :false,
    close : function(event, ui) {
      $("#share3rdPartyDialog").dialog('destroy');
    }
  }).height("auto");
  $("#share3rdPartyDialog").dialog('option', 'title', dialogTitle);
  
  $('#share3rdPartyDialog').html(parseTemplate("shareGenericTemplate", {
    address :address,
    name: name,
    latitude: latitude,
    longitude: longitude,
    radius: radius
  }));
  $("#share3rdPartyDialog").dialog( "option", "position", 'center' );
  $("#share3rdPartyDialog").dialog('open'); 

*/

    var btns = {};
    var content = parseTemplate("shareGenericTemplate", {
        poiDetail:poiDetail
        });
        
    utils && utils.dialog({
        title : dialogTitle,
        content: content,
        buttons : btns,
        css: 'noClose shareWithMailPhone'
    });    

  $(".shareWithMailPhone").css({
    'width':420,
    'top': '270px',
        'margin-left': -210,
        'left':'50%'
  });
  
  
}
function openSaveLocationDialog2(name, latitude, longitude, street, city, country, address, postcode, houseNumber) {
  if (city == null || city.length<=0) {

    GMapsHelper.reverseGeocode( longitude, latitude, function( data ) {
        if (data.address != null) {
          openSaveLocationDialog(name, data);
        }
    }, function() {
      // failed
      var addressObj = {
        latitude :selectedLat,
        longitude :selectedLon
      };
      openSaveLocationDialog(name, addressObj);
    });

  } else {
    var addressObj = {
        address :address,
        lat :latitude,
        lng :longitude,
        country :country,
        city :city,
        street :street,
        postal_code : postcode,
        street_number : houseNumber
      };
    openSaveLocationDialog(name, addressObj);
  }
}

function deleteLocation(locationId, type, categoryId, poiCount, listIndex, admin) {

  var btns = {};
  btns[$.i18n.prop('buttons.ok')] =   function() {
    
    $.ajax({
      url :"deleteLocation.action",
      type :'POST',
      data :{
        locationId :locationId        
      },
      dataType :'json',
      success :function(json) {       
      if (checkResponseSuccess(json)) {
        if (admin) {
          $("#list2").trigger("reloadGrid");
          return;
        }

        if (poiCount == 1) {
          $("#" + locationId).hide();
          $("#selectMultiPoi").hide();
          $("#hideMultiPoi").hide();
          poiCount--;
          $("#searchPoiListSize").text(poiCount);

        } else {
          if (categoryId == 0) {
            searchWithCoordinates("delete",listIndex, locationId);
          } else {
            // loadPois(type, categoryId, listIndex,
            // poiCount);
            categoryType=0;
            if($('#personalTabContent').is(':visible')){
              categoryType=1; 
            }
            loadPoisUnderCategory(categoryType,categoryId,listIndex,poiCount,0,true);
            updatePoiCategoryCount(categoryId,1);
          }
        }
        if(type==0){
          updatePoiCount(-1, true);
        }else if(type==1){
          updatePoiCount(-1, false);
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
  $("#deleteConfirmation").show();
  $( function() {
    $("#deleteConfirmation").dialog( {
      bgiframe :true,
      resizable :false,
      height :140,
      modal :glbmodal,
      overlay : {
        backgroundColor :'#000',
        opacity :0.5
      },
      buttons : btns
    });
  });
  $("#deleteConfirmation").dialog('open');
}

function updatePoiCategoryCount(categoryId,count){
  var pcount,cname;
  try {
  if($('#enterpriseTabContent').is(':visible')){
    pcount =parseInt($('.locationCategory b',$('#'+categoryId,$('#enterpriseCtgList'))).html().split("(")[1].split(")")[0]);
    cname=$('.locationCategory b',$('#'+categoryId,$('#enterpriseCtgList'))).html().split("(")[0];
    if (pcount != null && pcount != '' && cname!= null) {
      $('.locationCategory b',$('#'+categoryId,$('#enterpriseCtgList'))).html(cname + "(" + (pcount - count) + ")");
    }
  }else if($('#personalTabContent').is(':visible')){
    pcount =parseInt($('.locationCategory b',$('#'+categoryId,$('#personalCtgList'))).html().split("(")[1].split(")")[0]);
    cname=$('.locationCategory b',$('#'+categoryId,$('#personalCtgList'))).html().split("(")[0];
    if (pcount != null && pcount != '' && cname!= null) {
      $('.locationCategory b',$('#'+categoryId,$('#personalCtgList'))).html(cname + "(" + (pcount - count) + ")");
    }
  }

  } catch (e) {
  }

}

function deleteMultipleLocations(selectedPoisArray, admin) {
  var options = {};
  options.data = {
      selectedPoiIds: selectedPoisArray     
  };
  options.async = false;
  options.success = function(json) {                
    if(checkResponseSuccess(json)) {
      $('.dialog').dialog('close');
      var btns = {};
      btns[$.i18n.prop('buttons.ok')] = function(){
        places && places.reloadTabs();
        $(this).dialog('close');
      };
      
      for(i=0; i<selectedPoisArray.length; i++){
        mainMarkerManager.removeMarker('p'+selectedPoisArray[i]);
      }
      utils && utils.dialog({title: $.i18n.prop('dialog.title.success'), content: json.infoMessage, buttons: btns});
    }
  };
  utils && utils.lbasDoPost('deleteMultiplePois.action', options);
  
  /*
  var btns = {};
  btns[$.i18n.prop('buttons.ok')] =   function() {
    var options = {};
    options.data = {
        selectedPoiIds: selectedPoisArray     
    };
    options.async = false;
    options.success = function(json) {                
      if(checkResponseSuccess(json)) {
        var btns = {};
        btns[$.i18n.prop('buttons.ok')] = function(){
          places && places.reloadTabs();
        };
        utils && utils.dialog({title: $.i18n.prop('dialog.title.success'), content: json.infoMessage, buttons: btns});
      }
    };
    
    utils && utils.lbasDoPost('deleteMultiplePois.action', options);
  };
  
  btns[$.i18n.prop('buttons.cancel')] = function() {
    $(this).dialog('close');
    $(this).dialog('destroy');
  };
  
  utils && utils.dialog({title:$.i18n.prop('confirmation.delete.title') , content: content, buttons: btns});
  */
}


function optionDataForUpdateAndSaveLocation() {
  var optionsS = {};
  optionsS=$('#updateLocationDetail').serializeObject();
  /*{0: Enterprise, 1: Personal}*/
  if ($("#selectLocationCategoryForm").length > 0) {
    optionsS.saveCategoryEnabled=true;
    categoryS=$("#selectLocationCategoryForm").serializeObject();
    for (var p in categoryS) {
      optionsS[p]=categoryS[p];
    }
    if(typeof optionsS.categoryIDs == 'string' &&  optionsS.categoryIDs.length > 1) {
     optionsS.categoryIDs=[optionsS.categoryIDs];
    } else {
      
    }
  } else {
    /*avoid missing param force data to save category if not tab category loaded*/
    var sel = $('#updateLocationDetail_categoryIDs');
    if (sel) {
      var val=sel.val();
      /* witch group used for type and category avoid to pass 0 or 1*/
      var list_id = (val != "-1" && val.length > 1) ? val.split("_") : [];
      optionsS.poi.categories=list_id;
      optionsS.categoryIDs=list_id;
      optionsS.saveCategoryEnabled=true;
    }
  }
  /* delete input form n ot necessary */
  delete optionsS.__checkbox_editPoiRadiusCheckbox;
  delete optionsS.poiId;
  delete optionsS.poiType;
  /* CHECK EVENTUALLY MISSING DATA */
  if(optionsS.categoryIDs  ==undefined || optionsS.categoryIDs ==null || optionsS.categoryIDs =="") {
    optionsS.categoryIDs=[];
    optionsS.categoryType="1";
  }
   //|| optionsS.categoryType=="" || optionsS.categoryType==null
  //optionsS.newCategoryType=-1;
  
  if (permissionsObj) {
    var permsX = new Array();
    $.each(permissionsObj, function(i, val){
      var perms = new Object();
      delete val['actionErrors'];
      delete val['fieldErrors'];
      permsX.push(val);
    });
    optionsS.userPermissions=permsX;
  }
  return optionsS;
}

function AjxUpdateLocation() {
  var shopOpen, shopClose;
  shopOpen = new Date();
  shopClose = new Date();
  shopOpen.setHours($('#updateLocationDetail_openFromHour').val());
  shopOpen.setMinutes($('#updateLocationDetail_openFromMin').val());
  shopOpen.setSeconds(0);
  shopClose.setHours($('#updateLocationDetail_openToHour').val());
  shopClose.setMinutes($('#updateLocationDetail_openToMin').val());
  shopClose.setSeconds(0);
  if (shopOpen.getTime() > shopClose.getTime() ){
    $('#error-view-sendmessage').show();
    $('.box-error-message .content-cell span').empty().text($.i18n.prop("error.send.title"));
      if(!$('#send-list-wrapper .js-error-message').hasClass('startEndTime')){
      $('#send-list-wrapper').append('<li><a  class="startEndTime js-error-message" href="#">'+$.i18n.prop("working.hours.error")+'</a></li>');
    }
    return false;
  }else{
    if($('#send-list-wrapper .js-error-message').hasClass('startEndTime')){
      $('.startEndTime').remove();
        $('#error-view-sendmessage').hide();
    }
  }

  var optionsS = optionDataForUpdateAndSaveLocation();
  var validator=new Validator({
    "poi.name": {
        domElement: '#editPoiName',
        validate: 'presence'
      }
    });
  
  function errorsOnDialog(serverErrors) {
    var el = validator.parseServerErrors(serverErrors);
    $('#error-view-sendmessage > div.content-cell >span',"#dialog").html($.i18n.prop('error.send.title'));
    $('#send-list-wrapper',"#dialog").empty().append(el);
      $('#error-view-sendmessage',"#dialog").show();
  }

  $.ajax( {
    type :'POST',
    url :'updatePoi.action',
    //data :serializedFormData,
    contentType:'application/json',
    data : JSON.stringify(optionsS),
    dataType :'json',
    cache :false,
    success : function(data, textStatus) {
      if (checkResponseSuccess(data,errorsOnDialog)) {
        if (!aPage) {
          var poiId = data.poi.id;
          var poiradius = data.poi.radius;
          var poiname = data.poi.name;
          var oldPoiCategories = data.oldCategoryIDs;
          var newPoiCategories = data.newCategoryIDs;
          var oldPoiCategoryMap = data.oldCategoryMap;
          var newPoiCategoryMap = data.newCategoryMap;
          var newCategoryType = data.poi.type;
          var oldCategoryType = data.oldCategoryType;

          //$("#updateLocationButton").hide();
          /** ********************************************** */
          changeRightNavigation('locationsRightNav', null);
          $('#findOnMapTabContent').hide();
          $('#locationsTabContent').show();// TODO

          var categoryId = -1;
          if ($("#selectLocationCategoryForm").length > 0) {
            if ($("#selectLocationCategoryForm input[name=categoryIDs]:checked").length > 0) {
              categoryId = $("#selectLocationCategoryForm input[name=categoryIDs]:checked:first").val();
            }
          } else if ($("#updateLocationDetail input[name=poiFirstCategory]").length > 0) {
            categoryId = $("#updateLocationDetail input[name=poiFirstCategory]").val();
          }
          // var searchResult = loadPois($("#updateLocationDetail
          // input[name=poi.type]").val(), categoryId, 0, 1, poiId);
          var poiForUpdate = getPoiFromCurrentPois(poiId);
          //var poiIconNameSrc = $('#updateLocationDetail img[name=poi.iconName]').attr("src");

          var poiMiconName;
          //if(poiIconNameSrc.indexOf("showImage?") > -1) {
            poiMiconName = "marker_cat_vf_uncategorized.png"; // simdilik manuel set ediyoruz, daha sonra kaldirilacak
          //} else {
          //  poiMiconName = "marker_" + poiIconNameSrc.substring(poiIconNameSrc.indexOf("images/") + 7,poiIconNameSrc.indexOf(".")) + ".png";
          //}

          poiForUpdate.radius = poiradius;
          poiForUpdate.name = poiname;
          poiForUpdate.micon = poiMiconName;

          $('#locName' + poiId).text($('#editPoiName').val());
          $('#locAddress' + poiId).text($('#editPoiStreet').val());
          //$('#locImage' + poiId).attr("src", poiIconNameSrc); 


          if(oldPoiCategories != null) {
            var categoryListId = "enterpriseCtgList";
            if(oldCategoryType == 1)
              categoryListId = "personalCtgList";
            for ( var i = 0; i < oldPoiCategories.length; i++) {
              $("#" + categoryListId).find("#"+oldPoiCategories[i]+" .locationCategory").html(oldPoiCategoryMap[oldPoiCategories[i]][0]);
              $("#" + poiId).empty().remove();        
            } 
          } 
          if(newPoiCategories != null) {
            var categoryListId = "enterpriseCtgList";
            if(newCategoryType == 1) 
              categoryListId = "personalCtgList";

            for ( var i = 0; i < newPoiCategories.length; i++) {
              $("#" + categoryListId).find("#"+newPoiCategories[i]+" .locationCategory").html(newPoiCategoryMap[newPoiCategories[i]][0]);       
              loadPoisUnderCategory(newCategoryType,categoryId,0,newPoiCategoryMap[newPoiCategories[i]][1],0,true);
            } 
          }
          //updateMoreInfo();
/*
          if(!$('#admin.admin').is(':visible')){
            showPoiDetailOnMap([data.poi]);            
          }
*/
/*           showPoiMarkerOnMap(poiForUpdate, 'update'); */
          /** ********************************************** */
          
        }
          $("#list2").trigger("reloadGrid");/* for admin gui */


        $('span.ui-icon-closethick:last').click();
        if( $("#tab-places #tab-places-enterprise:visible") ){
          var load = true;
          load && places && places.getEnterprise();
        }
        if( $("#tab-places #tab-places-personal:visible") ){
          var load = true;
          load && places && places.getPrivate();
        }
        utils.dialogSuccess($.i18n.prop('info.update'));
		mainMarkerManager.removeMarker('p' + poiId);
		showPoiMarkerOnMap(data.poi);
      }
    }

  });
}

function AjxSaveNewLocation() {
  var shopOpen, shopClose;
  shopOpen = new Date();
  shopClose = new Date();
  shopOpen.setHours($('#updateLocationDetail_openFromHour').val());
  shopOpen.setMinutes($('#updateLocationDetail_openFromMin').val());
  shopOpen.setSeconds(0);
  shopClose.setHours($('#updateLocationDetail_openToHour').val());
  shopClose.setMinutes($('#updateLocationDetail_openToMin').val());
  shopClose.setSeconds(0);
  if (shopOpen.getTime() > shopClose.getTime() ){
    $('#error-view-sendmessage').show();
    $('.box-error-message .content-cell span').empty().text($.i18n.prop("error.send.title"));
      if(!$('#send-list-wrapper .js-error-message').hasClass('startEndTime')){
      $('#send-list-wrapper').append('<li><a  class="startEndTime js-error-message" href="#">'+$.i18n.prop("working.hours.error")+'</a></li>');
    }
    return false;
  }else{
    if($('#send-list-wrapper .js-error-message').hasClass('startEndTime')){
      $('.startEndTime').remove();
        $('#error-view-sendmessage').hide();
    }
  }


  var optionsS = optionDataForUpdateAndSaveLocation();
  var catIDs = optionsS.categoryIDs;
  
  var validator=new Validator({
    "poi.name": {
        domElement: '#editPoiName',
        validate: 'presence'
      }
    });
  
  function errorsOnDialog(serverErrors) {
    var el = validator.parseServerErrors(serverErrors);
    $('#error-view-sendmessage > div.content-cell >span',"#dialog").html($.i18n.prop('error.send.title'));
    $('#send-list-wrapper',"#dialog").empty().append(el);
    $('#error-view-sendmessage',"#dialog").show();
    $("#tabs_in_edit_loc").tabs('select', 0);
  }
  
  
  $.ajax( {
    type :'POST',
    url :'addNewPoi.action',
    //data :serializedFormData,
    contentType:'application/json',
    data : JSON.stringify(optionsS),
    dataType :'json',
    cache :false,
    success : function(data, textStatus) {
  
  //var options = {};
  //options.data = serializedFormData;
    //success : function(data, textStatus) {
    if (checkResponseSuccess(data, errorsOnDialog)) {
      utils && utils.dialog({
        title: $.i18n.prop('dialog.title.success'),
        content: data.infoMessage || $.i18n.prop('location.save.success')
        });
        var categoryType = 1;
        if ($('#selectEntCategoriesCheckContainer input:checkbox').filter(':checked').length > 0) {
          categoryType = 0;
        }
        if(categoryType === 1 ) {
          $('#btn_tab-places').click();
          $('#btn_tab-places-personal').click().promise().done(function(){
              places && places.getPrivate();
           });
           showPoiDetailOnMap([data.poi]);
           if(catIDs) {
             openRelatedGroup(catIDs)
           }
        } else { //enterprise
          $('#btn_tab-places').click();
          $('#btn_tab-places-enterprise').click().promise().done(function(){
                places && places.getEnterprise();
              });
           showPoiDetailOnMap([data.poi]);
           if(catIDs) {
             openRelatedGroup(catIDs)
           }
        }
      updatePlacesNumberTab();
      utils.closeDialog();
    }
  }
  
  }); 
  //utils && utils.lbasDoPost('addNewPoi.action', options);
  //utils.closeDialog();
}

function openRelatedGroup(catIDs){
  $.each(catIDs, function(i, val){
    if(!$('#group'+val +' .places').is(':visible')){
      setTimeout(function(){
        $('#open_group_details_'+val).click()
        }, 1000) ;
    }
  });
}

function saveLocationAsEnterprise(locationId) {
  $.post('saveLocationAsEnterprise.action', {
    locationId :locationId
  }, function(data) {
    if (checkResponseSuccess(data)) {
      $("#updateLocationDetail input[name=poi.type]").val(data.poi.type);
      // $("#saveAsEnterpriseButton").hide();
      $("#updateLocationButton").show();
      /*$("#addLocationButton").hide();*/
      // elcin

      changeRightNavigation('locationsRightNav', null);
      $('#findOnMapTabContent').hide();
      $('#locationsTabContent').show();
      // var searchResult = loadPois($("#updateLocationDetail
      // input[name=poi.type]").val(), -1, 0, 1, data.poi.id);

      var fullcategoryId = $('#' + locationId).parents("[id^='catgPois']").attr("id"); // e.g:
      // "catgPois_53"
      var categoryId = fullcategoryId.substring(9,fullcategoryId.length);

      loadCategories4Search($("#updateLocationDetail input[name=poi.type]").val(), 0, categoryId, data.poi.id);

      showPoiDetailOnMap( [ data.poi.id ]);
      $('span.ui-icon-closethick:last').click();

      updatePoiCount(-1, false);
      updatePoiCount(1, true);
    }
  }, "json");
}

function showPoiDetailOnMap(poiIds ,lat , lon) {
  var poiIds = poiIds;
  var poiDetail;
  for ( var i = 0; i < poiIds.length; i++) {
    poiDetail = getPoiFromCurrentPois(poiIds[i]);
    if (poiDetail != "0") 
    {
        showPoiMarkerOnMap(poiDetail);
    }
    else
    {
        showPoiMarkerOnMap(poiIds[i]);
/*
        if( $('#tab-places-enterprise').is(':visible') || $('#tab-places-personal').is(':visible') ){
          $('.olPopup .savePlace a').css({'opacity':0.5, 'cursor':'default'}).addClass('block');
        }
*/
        
    }
  }
  if ( lat == undefined && lon == undefined && poiIds[0] !== undefined) {
    lat = poiIds[0].latitude;
    lon = poiIds[0].longitude;
  }
  if(poiIds.length==1){
      /* HACK to center map CenterMap */
      if(mainMarkerManager.getTotallMarkers() == 0 ) {
        if (lat && lon) {
          map.setCenter(new google.maps.LatLng(lat, lon));
        }
      /* HACK to center map CenterMap */  
      }else{
       adjustZoomLevelAndCenterMap(map, lat, lon);
      } 
    
  }else{
    adjustZoomLevelBoundsBox(mainMarkerManager);//adjustZoomLevel(map); 
  }
}

function showPoiArrayOnMap(poiArray) { 
  if(poiArray.length <= 0){
    return;
  }
  for ( var i = 0; i < poiArray.length; i++) {
    var poiDetail = poiArray[i];
    if (poiDetail != "0") {
      showPoiMarkerOnMap(poiDetail);
    }
  }
    if(poiArray.length==1){
      adjustZoomLevelAndCenterMap(map, poiArray[0].lat, poiArray[0].lon);
    }else{
      adjustZoomLevel(map); 
    }
}

function updateMoreInfo(poidata) {
   $('#extra #PhonePlace').html(poidata.phone != null ? poidata.phone : ' ');
    $('#extra #FaxPlace').text(poidata.fax != null ? poidata.fax : ' ');
    $('#extra #EmailPlace').text(poidata.email != null ? poidata.email : ' ');
    $('#extra #WebsitePlace').text(poidata.website != null ? poidata.website : ' ');
    $('#extra #OperhoursPlace ').text(utils.formatPoiOpenTime(poidata.openFrom) + " - " + utils.formatPoiOpenTime(poidata.openTo));
    $('#rate').text(poidata.totalRates != null ? poidata.totalRates : ' ');
    $('.starRating_' + poidata.id).html('');
    $('.starRating_' + poidata.id).rater('updatePoiRate.action?poiId=' + poidata.id, {
      style :'small',
            curvalue :poidata.rating
    });
}




function showPoiMarkerOnMap(poiDetail, method) {
  
  var detail = true;
      /*hack for the find on map part*/

  if ($("#tab-places-recents").is(":visible")){
    detail = false;  
  }
  if (poiDetail.id == undefined) {
    poiDetail.id = Math.floor(Math.random()*82342);
    detail = false;
  } 
  var markerOptions;
  if (method == 'update') {
    if (mainMarkerManager.markers['p' + poiDetail.id] != null) {
     mainMarkerManager.removeMarker('p' + poiDetail.id);
    }
  }
  
  if (mainMarkerManager.markers['p' + poiDetail.id] != null) {
    mainMarkerManager.removeMarker('p' + poiDetail.id);
    //mainMarkerManager.openTooltip('p' + poiDetail.id);
    //return "0";
    //return "0";
  }
  var radius;
  if(poiDetail.radius > 0){
    radius =poiDetail.radius; 
  }

  var tooltipContent = parseTemplate('placeTooltipTemplate', {
    place: poiDetail,
    latitude: GMapsHelper.deg2dms(poiDetail.latitude),
    longitude: GMapsHelper.deg2dms(poiDetail.longitude),
    radius: poiDetail.radius,
    locateLCS: false,
    address: poiDetail.address,
    markerId: 'r' + poiDetail.id,
    minSize: {w:450, h:450}
  });
                  
  markerOptions = {
      id :"p" + poiDetail.id,
      latitude :poiDetail.latitude,
      longitude :poiDetail.longitude,
      radius :radius,
      icon :'images/pin_place.png',/*'images/' + (poiDetail.iconName != null ? poiDetail.iconName : 'blue_circle.gif'),*/
      iconWidth :29,
      iconHeight :39,
      hasTooltip :true,
      staticContent :true,
      contentHtml :tooltipContent,
      /*actionPath :'getPoiDetails.action',
      actionParams : {
        poiIds : [ poiDetail.id ]
      },*/
      templateId :'placeTooltipTemplate',
      history :false,
      forceToOpen :true,
      minSize: {w:450, h:450}
  };
  
  /* mainMarkerManager.createMarker(markerOptions); */
  
  //window.setTimeout(function(){  
  //mainMarkerManager.createMarker(markerOptions);
     
  var featureId = mainMarkerManager.createMarker(markerOptions);
  adjustZoomLevelAndCenterMap(map, poiDetail.latitude, poiDetail.longitude);

  /*$('#btn_tooltip_close_'+poiDetail.id).click(function(e) {
    mainMarkerManager.closeTooltip('p' + poiDetail.id);
    //mainMarkerManager.removeMarker('p' + poiDetail.id);
    e.preventDefault();
  });*/
  
  	console.log(detail, poiDetail.credentials);
  	console.log(poiDetail);
  if (detail)
  {
    google.maps.event.addListener(mainMarkerManager.markers[featureId].feature.popup, 'domready', function() {
          $.ajax({
              url :'getPoiDetails.action',
              type :'POST',
              async :false,
              data :{
                  poiIds : poiDetail.id
              },
              dataType :'json',
              success :function(json)
              {
                
                  if (checkResponseSuccess(json)) 
                  {
                      var poidata = json.pois[0];
                      updateMoreInfo(poidata); 

                      //EDIT ARTERA:
                      //google.maps.event.addListener(mainMarkerManager.markers[featureId].feature.popup, 'domready', function() {
                        $('#btn_tooltip_share_' + poiDetail.id).off('click').on('click',function() {
                          if($('#btn_tooltip_share_' + poiDetail.id).hasClass('block')){
                            return false;
                          }
                            openShare3rdPartyDialog(json.pois[0]);
                           // mainMarkerManager.closeTooltip('p' + poiDetail.id);
                        });
                      //});
                      /*
                      $('#btn_tooltip_share_' + poiDetail.id).off('click').on('click',function(e) 
                      {
                        e.preventDefault();
                          openShare3rdPartyDialog(poidata.name, poidata.address, poidata.latitude, poidata.longitude, poidata.radius);
                          mainMarkerManager.closeTooltip('p' + poiDetail.id);

                      });*/
                   if($("#tab-places-enterprise:visible")){ }   
                      
                  } else {
                    
                    /* remove marker */
                    mainMarkerManager.removeMarker('p' + poiDetail.id);
                  }
              }
          });
    });
        }
  else
  {
    google.maps.event.addListener(mainMarkerManager.markers[featureId].feature.popup, 'domready', function() {
      // Se non ho il poidetail.id vuol dire che ho fatto una ricerfa sulla mappa, in questo caso aggiungo la funzione di share sul tasto
      $('#btn_tooltip_share_' + poiDetail.id).off('click').on('click',function() {
         openShare3rdPartyDialog(poiDetail);
          //mainMarkerManager.closeTooltip('p' + poiDetail.id);
      });
    });
    // Se non ho il poidetail.id vuol dire che ho fatto una ricerca sulla mappa, in questo caso aggiungo la funzione di share sul tasto   
    /*$('#btn_tooltip_share_' + poiDetail.id).off('click');
      $('#btn_tooltip_share_' + poiDetail.id).on('click',function(e) 
      {
          openShare3rdPartyDialog(poiDetail.address, poiDetail.address, poiDetail.latitude, poiDetail.longitude, poiDetail.radius);
          mainMarkerManager.closeTooltip('p' + poiDetail.id);
          e.preventDefault();
      }); */
  }
  
  google.maps.event.addListener(mainMarkerManager.markers[featureId].feature.popup, 'domready', function() {
    $('#btn_tooltip_moreInfo_'+poiDetail.id).off('click').on('click',function(e) {
      if ($('#extra').is(':visible'))
          $('#extra').hide();
      else
          $('#extra').show();
      mainMarkerManager.updateMarkerSize('p' + poiDetail.id);
      e.preventDefault();
    });
 
    $('#btn_tooltip_edit_' + poiDetail.id).off('click').on('click',function(e) {
      if($(this).hasClass('block')){
        return false;
      }
       
       openEditLocationDialog(poiDetail.id, poiDetail.name, poiDetail.type, true, poiDetail.credentials.editPermission, poiDetail.credentials.edit, poiDetail.credentials.changeCategory, poiDetail);
       
       e.preventDefault();
       e.stopImmediatePropagation();
       return false;         
    });
    
    if (!detail) {
      $('#btn_tooltip_moreInfo_' + poiDetail.id).hide();
      $('#btn_tooltip_edit_' + poiDetail.id).hide();
      $('.toolTipLeft li:first-child').css('visibility','hidden'); /* BUG 104 SOLVED*/
    }else{
      $('.toolTipContent .savePlace a').css({'opacity':0.5, 'cursor':'default'}).addClass('block');
    }


  if(userConf.rights.add_enterprise_location === false && poiDetail.type === 0 ){
    $('#btn_tooltip_edit_' + poiDetail.id).addClass('block').css({opacity:0.5, cursor:'default'});
  }
  
  if(poiDetail.credentials) {
    
    if( (poiDetail.credentials !== null || poiDetail.credentials !== undefined) && poiDetail.credentials.edit === false){
      if($('#btn_tooltip_edit_' + poiDetail.id).hasClass('block') === false){
        $('#btn_tooltip_edit_' + poiDetail.id).addClass('block').css({opacity:0.5, cursor:'default'});      
      }
    }
    if((poiDetail.credentials !== null || poiDetail.credentials !== undefined) && poiDetail.credentials.share === false){
      if($('#btn_tooltip_share_' + poiDetail.id).hasClass('block') === false){
        $('#btn_tooltip_share_' + poiDetail.id).addClass('block').css({opacity:0.5, cursor:'default'});     
      }
    }
  }


    // Get directions
    $("#btn_tooltip_getDirection_" + poiDetail.id).off("click");
    $("#btn_tooltip_getDirection_" + poiDetail.id).on('click',function(e){
        leftPanel.tabs.tabs('select', leftPanel.tabRoutes.id);

        var fnLoadedTab = function() {
          GMapsHelper.reverseGeocode( poiDetail.latitude, poiDetail.longitude, function( data ) {
            setRoutePoint(data.address, poiDetail.latitude, poiDetail.longitude, 1, false);
          });
        };

        if ( leftPanel.tabRoutes.loaded )
          fnLoadedTab();
        else {
          $('body').on('tabRoutedLoaded', function() {
            fnLoadedTab();
          });
        }
        
       e.preventDefault();
    });
/*
    $('.starRating_' + poiDetail.id).html('');
    $('.starRating_' + poiDetail.id).rater('updatePoiRate.action?poiId=' + poiDetail.id, {
            style :'small',
            curvalue :poiDetail.rating
    });*/
    $('.starRating_' + poiDetail.id + ' .star > a').click(function(ev){
      ev.preventDefault();
    });
    $("#btn_tooltip_savePlace_" + poiDetail.id).off("click");
    $("#btn_tooltip_savePlace_" + poiDetail.id).on('click',function(e){
      if($(this).hasClass('block')){
        return false;
      }
      openSaveLocationDialogFromLatLon($.i18n.prop('tooltipmain.SaveLocation'), poiDetail.latitude, poiDetail.longitude);
      e.preventDefault();
    });
  
 
    $("#btn_tooltip_setUpMeeting_" + poiDetail.id).off("click");
    $("#btn_tooltip_setUpMeeting_" + poiDetail.id).on('click',function(e){   
      var location = poiDetail.address;
      var attendee = null;

      var cm = new CalendarManager( $('#calendar-wrapper') );
      prepopulate = {};
      prepopulate.location = location;
      prepopulate.attendee = attendee;
      prepopulate.lat = poiDetail.latitude;
      prepopulate.lng = poiDetail.longitude;  
      /* cm.createEventPopup(new Date(),new Date(), location, attendee, poiDetail.latitude, poiDetail.longitude ); */
      cm.createEventPopup(new Date(),new Date(), prepopulate, true );
      e.preventDefault();
    });

    $("#btn_tooltip_showNearestUsers_" + poiDetail.id).off("click");
    $('#btn_tooltip_showNearestUsers_'+poiDetail.id).on('click',function(e) {
      showNearestUsers(poiDetail);
      e.preventDefault();
    });

    $('#btn_tooltip_close_'+poiDetail.id).click(function(e) {
      mainMarkerManager.closeTooltip('p' + poiDetail.id);
      //mainMarkerManager.removeMarker('p' + poiDetail.id);
      e.preventDefault();
    });
  });
  
  //window.setTimeout(function(){mainMarkerManager.createMarker(markerOptions)}, 10000)
  //mainMarkerManager.createMarker(markerOptions);
  //}, 1000)
  
  
  //createNewMeeting(loadEnabled, latitude, longitude, invitees, dateparam, endDate)
  // adjustZoomLevel(map);
  

}

// resend poi for rating
function resendForPoiRating(poiDetail) {
  $.ajax( {
    url : 'getPoiDetails.action',
    type : 'POST',
    async : false,
    data : {
      poiIds : [ poiDetail.id ]
    },
    dataType : 'json',
    success : function(json) {
      if (checkResponseSuccess(json)) {

        var ctHtml = parseTemplate('poiTooltipTemplate', {
          json : json,
          markerId : "p" + poiDetail.id,
          type : 0
        });
        popup.setContentHTML(ctHtml);
      }
    }
  });
}

function getPoiFromCurrentPois(poiId) {
      if (currentPois[poiId]) {
    return currentPois[poiId];
  }
  return "0";
}

function loadCategories(type, listIndex, firstCatId) {
  if (!firstCatId) {
    firstCatId = 0;
  }
  $.ajax( {
    url :'listcategories.action',
    type :'POST',
    async :false,
    data : {
      type :type,
      listIndex :listIndex,
      firstCatId :firstCatId
    },
    dataType :'json',
    success : function(json) {
      if (checkResponseSuccess(json)) {
        if (type == 1) {
          $('#personalCtgList').html('');
          $('#personalCtgList').html(parseTemplate("categoryListTemplate", {
            json :json
          }));
        } else if (type == 0) {
          $('#enterpriseCtgList').html('');
          $('#enterpriseCtgList').html(parseTemplate("categoryListTemplate", {
            json :json
          }));

        }

      }
    }
  });
}

function loadCategories4Search(type, listIndex, firstCatId, firstPoiId) {
  if (!firstCatId) {
    firstCatId = 0;
  }
  $.ajax( {
    url :'listcategories.action',
    type :'POST',
    async :false,
    data : {
      type :type,
      listIndex :listIndex,
      firstCatId :firstCatId
    },
    dataType :'json',
    success : function(json) {
      if (checkResponseSuccess(json)) {
        if (type == 1) {
          $('#personalCtgList').html('');
          $('#personalCtgList').html(parseTemplate("categoryListTemplate", {
            json :json
          }));

        } else if (type == 0) {
          $('#enterpriseCtgList').html('');
          $('#enterpriseCtgList').html(parseTemplate("categoryListTemplate", {
            json :json
          }));
        }
        loadPoisUnderCategory(type, firstCatId, 0, json.categoryArr[0].poiCount, firstPoiId, false);
      }
    }
  });
}

function loadPoisUnderCategory(type, categoryId, listIndex, poiCount, firstPoiId, nextPage) {

  if (!firstPoiId) {
    firstPoiId = 0;
  }

// var context;
// if($('#enterpriseTabContent').is(':visible')){
// context="enterpriseCtgList";
// }else if($('#personalTabContent').is(':visible')){
// context="personalCtgList";
// }
  var context="enterpriseCtgList";
  if(type == 1) {   
    context="personalCtgList";
  }
  
  if($.trim($("#" + context).html()) == "") {
    loadCategories(type, 0);
  }
  
  if (!nextPage) {

    if ($("#cacIcon" + categoryId,$('#'+context)).attr('src') == contextPath + '/images/expand_window.png'
        && $('#catgPois_' + categoryId,$('#'+context)).html().trim().length > 1) {

// comment these lines because we can select multiple categories
// $('.catgPois',$('#'+context)).each( function() {
//
// $("#cacIcon" + $(this).attr("id").split("_")[1],$('#'+context)).attr('src',
// contextPath + '/images/expand_window.png');
// $(this).hide();
//
// });
//
// $("input[id^='poicheckbox-id']:checked",$('#'+context)).each( function() {
// $(this).attr('checked', false);
// });

      $("#cacIcon" + categoryId,$('#'+context)).attr('src', contextPath + '/images/colapse_window.png');
      $('#catgPois_' + categoryId,$('#'+context)).show();
      return;

    }

    if ($("#cacIcon" + categoryId,$('#'+context)).attr('src') == contextPath + '/images/colapse_window.png'
        && $('#catgPois_' + categoryId,$('#'+context)).html().trim().length > 1) {

      $("#cacIcon" + categoryId,$('#'+context)).attr('src', contextPath + '/images/expand_window.png');
      $('#catgPois_' + categoryId,$('#'+context)).hide();
      return;

    }

  }

  $.ajax( {
    url :'listpois.action',
    type :'POST',
    async :false,
    data : {
      type :type,
      categoryId :categoryId,
      listIndex :listIndex,
      poiCount :poiCount,
      firstPoiId :firstPoiId
    },
    dataType :'json',
    success : function(json) {
      if (checkResponseSuccess(json)) {

        changeRightNavigation('locationsRightNav', null);
        $('#findOnMapTabContent').hide();
        $('#findOnMapTab').removeClass('selected');
        
        if (type == 1) {

          $('#personalTab').addClass('selected');
          $('#enterpriseTab').removeClass('selected');
          $('#enterpriseTabContent').hide();
          $('#personalTab').show();
          $('#personalTabContent').show();

          $('#catgPois_' + categoryId,$('#'+context)).html('');

          $('#catgPois_' + categoryId,$('#'+context)).html(parseTemplate("poiList2Template", {
            json :json,
            categoryId :json.selectedPoiCategory.id
          }));

        } else if (type == 0) {
          
          
          $('#enterpriseTab').addClass('selected');
          $('#personalTab').removeClass('selected');
          $('#personalTabContent').hide();
          $('#enterpriseTab').show();
          $('#enterpriseTabContent').show();
          
          $('#catgPois_' + categoryId,$('#'+context)).html('');

          $('#catgPois_' + categoryId,$('#'+context)).html(parseTemplate("poiList2Template", {
            json :json,
            categoryId :json.selectedPoiCategory.id
          }));
        }

        $('.catgPois').each( function() {
          if ($(this).attr("id") != 'catgPois_' + categoryId) {
            
// comment these lines because we can select multiple categories
// $("#cacIcon" + $(this).attr("id").split("_")[1],$('#'+context)).attr('src',
// contextPath + '/images/expand_window.png');
// $(this).hide();

          } else {
            $(this).show();
          }
        });

        if (!nextPage)
          $("#cacIcon" + categoryId,$('#'+context)).attr('src', contextPath + '/images/colapse_window.png');

      }
    }

  });

}



function exportPoisToPdf(selectedCategories) {
  var categoryIds = '';
  for ( var i = 0; i < selectedCategories.length; i++) {
    categoryIds += selectedCategories[i].id + ";";
  }
  window.location.href = 'exportCategories.action?type=pdf&categories=' + categoryIds;
}

function exportPoisToPdf2(selectedPois) {
  if (selectedPois.length < 1) {
    showErrorDialog($.i18n.prop('poi.selectAtleastOne'), true);
    return;
  }
  var poiIds = '';
  $.each(selectedPois, function(i ,val){
    poiIds +=val+';'
  });
  window.location.href='exportPois.action?type=pdf&pois='+poiIds;
/*
    for ( var i = 0; i < selectedPois.length; i++) {
      var element = selectedPois[i]; //.split(":");
        console.log(element)
      //poiIds = poiIds + element.address + ";" + element.latitude + ";" + element.longitude + ";" + element.name;
      //poiIds += 'genericPois['+i+'].name='+element.name+'&genericPois['+i+'].latitude='+element.latitude+'&genericPois['+i+'].longitude='+element.longitude+'&genericPois['+i+'].address='+element.address+'&genericPois['+i+'].city='+element.city+'&genericPois['+i+'].country='+element.country+'&';
    }
*/  
/*     window.location.href = 'exportGenericPois.action?type=pdf&'+poiIds; */
    //window.location.href = 'exportPois.action?type=pdf&'+poiIds;

  
}

function exportPoisGenericPdf(){

  var checkedLocations = utils && utils.getChecked('#tab-places-recents input:checked', 'place');
  if (checkedLocations.length < 1) {
    showErrorDialog($.i18n.prop('poi.selectAtleastOne'), true);
    return;
  }
  
  var poiIds = '';
  for ( var i = 0; i < checkedLocations.length; i++) {
    var element = $('#tab-places-recents .adressPlace').eq(i).data('place');/*  //checkedLocations[i]; //.split(":"); */

    //poiIds = poiIds + element.address + ";" + element.latitude + ";" + element.longitude + ";" + element.name;
    var name = element.name === null ? ' ' : element.name;
    var city = element.city === undefined ? ' ' : element.city;
    var country = element.country === undefined ? ' ' : element.country;
    poiIds += 'genericPois['+i+'].name='+ name +'&genericPois['+i+'].latitude='+element.latitude+'&genericPois['+i+'].longitude='+element.longitude+'&genericPois['+i+'].address='+element.address+'&genericPois['+i+'].city='+city+'&genericPois['+i+'].country='+country+'&';
  }
  window.location.href = "exportGenericPois.action?type=pdf&" + poiIds; 

}

function exportGenericPois() {
  var serializedData = "";
  $("input[id ^= poicheckbox-id]:checked").each(function(index) {
    serializedData += "genericPois["+index+"]="+$(this).val()+"&";
  });
  window.location.href = "exportGenericPois.action?type=pdf&" + serializedData; 
  
}

function goSelectedAction(action) {
  
  if($("input[id ^= poicheckbox-id]:checked").length <= 0){
    showErrorDialog($.i18n.prop('warning.select.location'), true);
  }
  else{
    switch (action) {
      // Delete recent location
      case "1": {       
        deleteMultipleRecentLocations();
        break;
      }
      // Export to pdf
      case "3": {       
        exportGenericPois();
        break;
      }
      // Show on map
      case "5": {         
        genericPoisShowOnMap();
        break;
      }
    }
  }
}


function showAllCategoryChecks(type) {
  for ( var i = 0; i < categorySize; i++) {
    $('#categoryCheck' + type + "_" + i).show();
  }
  $('#selectMulti' + type).hide();
  $('#selectBoxMulti' + type).show();
  $('#hideMulti' + type).show();
  $('#hideMultiActions' + type).show();
  $('#dropDown' + type).show();
}

function hideAllCategoryChecks(type) {
  for ( var i = 0; i < categorySize; i++) {
    $('#categoryCheck' + type + "_" + i).hide();
  }
  $('#selectMulti' + type).show();
  $('#hideMulti' + type).hide();
  $('#hideMultiActions' + type).hide();
  $('#selectBoxMulti' + type).hide();
}

function showSelectedCategory(action) {
  // categoryOrPoi.actionList
  var context;
  if($(places.subTabEnterprise).is(':visible')){
    context=places.subTabEnterprise;
  }else if($(places.subTabPersonal).is(':visible')){
    context=places.subTabPersonal;
  }else if($(places.subTabRecents).is(':visible')){
    context=places.subTabRecents;
  }else{
    utils && utils.dialog({title: $.i18n.prop('dialog.title.error'), content:$.i18n.prop('dialog.error')});
  }
  var checkedCategories = utils && utils.getChecked(context + ' input:checked', 'placeId');
  var anyCategorySelected = checkedCategories && checkedCategories.length>0;
  var checkedLocations;
  var anyLocationSelected;
    if( $(context+' .container input.place').is(':checked') ){
      checkedLocations = utils && utils.getChecked(context + ' input:checked', 'place');
      anyLocationSelected = checkedLocations && checkedLocations.length>0;
    }   
  /*
  $("input[id^='categorycheckbox-id']:checked",$('#'+context)).each( function() {
    var value = $(this,$('#'+context)).attr("value");// value=categoryId+type+listIndex+poicount
      selectedCategories.push(value);
      anyCategorySelected = true;
    });
  */
  
  var selectedCategories = [];
  var selectedCategoriesId = [];
  var selectedPois = [];
  var selectedPoiId = [];
  var selectedPoiIdsArray = [];


  if(checkedCategories && checkedCategories.length>0){
    $.each(checkedCategories, function(i, k) {
      var data = $(k).data('group');
      /* this is crazy!
       * <#= top.id #>:<#= top.type #>:<#= json.listIndex #>:<#= top.poiCount #>:'<#= category_name #>':<#= top.credentials.edit #>:<#= top.credentials.remove #>:<#= top.credentials.editPermission #>
       */
      selectedCategories.push(data);
      selectedCategoriesId.push(data.id);
    });
  }
  
  var pois ={};
  if( $(context+' .container input.place').is(':checked') ){
    $.each(checkedLocations, function(i, k) {
      var data = $(k).data('place');
      selectedPois.push(data);
      selectedPoiId.push(data.id);
      var _poi = new Object();       
      _poi.address = data.address;
      _poi.latitude = data.latitude;
      _poi.longitude = data.longitude;
      _poi.name = data.name;
      selectedPoiIdsArray.push(_poi);
    });
      }  
  switch (action) {
    // Delete
    case "1": {
      if (!anyCategorySelected && !anyLocationSelected) {
        utils && utils.dialog({title: $.i18n.prop('dialog.title.error'), content: $.i18n.prop('warning.select.categoryorlocation')});
      }else{
        
        var idsList = [];
        var content = $.i18n.prop('confirmation.delete');
        content += '<ul>';
        $.each(selectedCategories, function(i, k){
          content += '<li>'+k.name+'</li>';
        });
        content += '</ul>';
        content += '<ul style="max-height: 100px; overflow-y: scroll; margin: 10px 0px 0px;">';
        $.each(selectedPois, function(i, k){
          content += '<li>'+k.name+'</li>';
        });
        content += '</ul>';
        
        var btns = {};
        btns[$.i18n.prop('buttons.ok')] =   function() {
          
          if (anyCategorySelected){
            deleteMultipleCategories(selectedCategoriesId, false); //poicategory.js
          }

          if (anyLocationSelected) {
            deleteMultipleLocations(selectedPoiId, false);
          }
          $(this).dialog('close');
        };
        
        btns[$.i18n.prop('buttons.cancel')] = function() {
          $(this).dialog('close');
          $(this).dialog('destroy');
        };
        
        utils && utils.dialog({title:$.i18n.prop('dialog.delete'), content: content, buttons: btns});
      }
    };
    break;
    // Export To Pdf
    case "3": {
      if($('#tab-places-recents').is(':visible')){
        exportPoisGenericPdf(selectedPois);
        return false;
      }
      
      if (anyCategorySelected)
        exportPoisToPdf(selectedCategories);
      else if (anyLocationSelected) {
        exportPoisToPdf2(selectedPoiId);
      }
  
      break;
    }
    // Add new Category
    case "4" : {
      if(leftPanel.tabPlacesSubTabs.tabs('option', 'selected') == 2){ 
        // personal
        openCategoryDialog(1);
      } else {
        // enterprise
        openCategoryDialog(0);
      }
      break;
    } 
    case "5": {
      // show on map
      if($('#tab-places-recents').is(':visible')){
        var checkedLocations = utils && utils.getChecked('#tab-places-recents input:checked', 'place');
        if(checkedLocations.length > 0){
          $.each(checkedLocations, function(){
            $(this).next().click();
          });          
        }
        return false;
      }
      /*if (anyCategorySelected)
        showMultiplePoi(selectedCategories);*/
      if (anyLocationSelected)
      {
        showPoiDetailOnMap(selectedPois);
      }
  
      break;
    }
    case "7" : {
      // Edit
      
      /* this is crazy!
       * <#= top.id #>:
       * <#= top.type #>:
       * <#= json.listIndex #>:
       * <#= top.poiCount #>:
       * '<#= category_name #>':
       * <#= top.credentials.edit #>:
       * <#= top.credentials.remove #>:
       * <#= top.credentials.editPermission #>
       */
       
      if (anyCategorySelected && selectedCategories && selectedCategories.length===1) {
        var re = /'/g ; // / category name kesme isareti icinde geliyor temizlemek icin regex..

        
        var element = selectedCategories[0];
        var categoryId = element.id;
        var categoryType = element.type;
        var listIndex = element.listIndex;
        var categoryName = element.name;
        var poiCount = element.poiCount;
        var categoryeditpermissionright = element.credentials.editPermission;
        if (categoryType ==1) { 
          openPersonalEditCategoryDialog(categoryType,categoryId,categoryName,poiCount);
        } else {
          openEnterpriseEditCategoryDialog(categoryType,categoryId,categoryName,poiCount,categoryeditpermissionright);
        }
      } else if (anyLocationSelected && selectedPoisArray && selectedPoisArray.length > 0) {
        var element = selectedPoisArray[0].split(":");
        var poiId = element[0];
        var poiName = element[7];
        var poiType = element[3];
        var poieditpermissionright = element[8];
        var poieditright = element[9];
        var poichangecategoryright = element[10];     
        var modaltrue = true;
        var frommailfalse = false;
        openEditLocationDialog(poiId,poiName,poiType,modaltrue,poieditpermissionright,poieditright,poichangecategoryright);

      }else{
        utils && utils.dialog({title: $.i18n.prop('dialog.title.error'), content:$.i18n.prop('warning.select.location')});
      }
      break;
    }
  } 
}

function showAllPoiChecks(type) {
  for ( var i = 0; i < categorySize; i++) {
    $('#poiCheck' + type + '_' + i).show();
  }
  $('#selectMultiPoi' + type).hide();
  $('#hideMultiPoi' + type).show();
  $('#hideMultiPoiActions' + type).show();
  $('.poiItem').each( function() {
    $(this).css( {
      width :145
    });
  });
}

function hideAllPoiChecks(type) {
  for ( var i = 0; i < categorySize; i++) {
    $('#poiCheck' + type + '_' + i).hide();
  }
  $('#selectMultiPoi' + type).show();
  $('#hideMultiPoi' + type).hide();
  $('#hideMultiPoiActions' + type).hide();
  $('.poiItem').each( function() {
    $(this).css( {
      width :165
    });
  });
}

 $('#btn_tab-places-recents').trigger("click");


function populateFindOnMapTabAfterSearch(json, header) {
  $('#btn_tab-places-recents').trigger("click");
  var $ul= places.getRecentsListOnSuccess(json);
  $('#tab-places-recents >div.contents').html('').append($('<div class="search-result-header">'+header+'</div>')).append( $ul);
  
	$('#btn_places_search_reset').click(function(){
		$('#search_places').attr('value' , $.i18n.prop('general.Search') );
		refreshTabRecentPlaces();
  });
  
}

function populatePersonalTabAfterSearch(json, categoryId,type) {
  var $ul= (type=="category") ? places.getGroupsListOnSuccess(json) : places.getPlacesInGroupOnSuccess(json);
  $('#tab-places-personal >div.contents').html('').append( $ul);
  $('#btn_tab-places-personal').trigger("click");
  
  /*
  $('#tab-places-personal >div.contents').html('').html(parseTemplate("poiList2Template", {
              json :json,
              categoryId :categoryId
  }));*/
}

function populateEnterpriseTabAfterSearch(json, categoryId,type) {
  var $ul= (type=="category") ? places.getGroupsListOnSuccess(json): places.getPlacesInGroupOnSuccess(json);
  $('#tab-places-enterprise >div.contents').html('').append( $ul);
  $('#btn_tab-places-enterprise').trigger("click");

  
  
  /*$('#tab-places-enterprise >div.contents').html('').html(parseTemplate("poiList2Template", {
              json :json,
              categoryId :categoryId
  }));*/
}



function searchWithCoordinates(method, listIndx, poiId) {
var datasearch= {};
var url_search='';

  if(poiId) {
    
    url_search='getPOIById.action';
    datasearch.poiId=poiId
    
  } else {
      url_search='searchPOIs.action';
     datasearch.searchText=$('#search_places').val();
     datasearch.page=0;
    
  }
   //listIndex :listIndx,
  //if (listIndx) datasearch.listIndx=listIndx;
  //if (poiId) datasearch.poiId=poiId;
  var poiJson;
  $.ajax( {
    url :url_search,
    type :'POST',
    async :false,
    data :datasearch,
    dataType :'json',
    success : function(json) {
      if (checkResponseSuccess(json)) {
        if(method == "delete"){
          if ($('#personalTabContent').is(':visible')) {
            populatePersonalTabAfterSearch(json,0);
            /*
            $('#personalCtgList').html('');
            $('#personalCtgList').html(parseTemplate("poiList2Template", {
              json :json,
              categoryId :0
            }));*/
  
          } else if ($('#enterpriseTabContent').is(':visible')) {
            populateEnterpriseTabAfterSearch(json,0);
            /*
            $('#enterpriseCtgList').html('');
            $('#enterpriseCtgList').html(parseTemplate("poiList2Template", {
              json :json,
              categoryId :0
            }));*/
  
          }
        }else {
          
          //if i have poii omologate call
          if(json.poii) {json.poilist=[json.poii]; }
          var result_poilist=(json.poilist);
          if(result_poilist[0].type == 0){// enterprise
            /*$('#enterpriseTab').addClass('selected');
            $('#findOnMapTab').removeClass('selected');
            $('#findOnMapTabContent').hide();
            $('#personalTab').removeClass('selected');
            $('#personalTabContent').hide();
            $('#enterpriseTab').show();
            $('#enterpriseTabContent').show();
            
            $('#enterpriseCtgList').html('');
            
            tab-places-enterprise
            
            $('#enterpriseCtgList').html(parseTemplate("poiList2Template", {
              json :json,
              categoryId :0
            }));*/
           
           
           populateEnterpriseTabAfterSearch(json,0);
           /*$('#tab-places-enterprise >div.contents').html('').html(parseTemplate("poiList2Template", {
              json :json,
              categoryId :0
            }));*/
            showPoiMarkerOnMap(result_poilist[0], '');
          } else if(result_poilist[0].type == 1){// personal
            /*$('#personalTab').addClass('selected');
            $('#findOnMapTab').removeClass('selected');
            $('#findOnMapTabContent').hide();
            $('#enterpriseTab').removeClass('selected');
            $('#enterpriseTabContent').hide();
            $('#personalTab').show();
            $('#personalTabContent').show();
            $('#personalCtgList').html('');
            $('#personalCtgList').html(parseTemplate("poiList2Template", {
              json :json,
              categoryId :0
            }));*/
            populatePersonalTabAfterSearch(json,0);
           /*$('#tab-places-personal >div.contents').html('').html(parseTemplate("poiList2Template", {
              json :json,
              categoryId :0
            }));*/
            showPoiMarkerOnMap(result_poilist[0], '');

          }

          /*
          $('#tab-places-recents').hide();
          $('#tab-places-enterprise').hide();
          $('#tab-places-personal').hide();
          $('#idGenericPOIsearchResult').show();
          $('#idGenericPOIsearchResult').html(parseTemplate("findOnMapResultTemplate", {
            searchResult: [
              {
                address: json.poilist[0].name,
                city: json.poilist[0].address,
                latitude: json.poilist[0].latitude,
                longitude: json.poilist[0].longitude,
              }
            ],
            searchResultHeader :$.i18n.prop('poiList.SearchResultFor')+" '"+$('#search_places').val()+"' "+"(1)"
          }));
          */
          
          //fomGenericSearchObj = null;
        }
        poiJson = json;
      }
    }

  });
  return poiJson;
}

function appendNewCheckBox(newCategoryId, newCategoryName, newCategoryType) {
  var container;
  var name;
  if (newCategoryType == 0) {
    container = $('#selectEntCategoriesCheckContainer ul');
    name='enterprisePOI';
  } else {
    container = $('#selectPersCategoriesCheckContainer ul');
    name='personalPOI';
  }
  name="categoryIDs";
  var $li = $('<li></li>');
  var $newC = $('<input checked type="checkbox" value="'+newCategoryId+'" id="'+newCategoryId+'" name="'+name+'">');
  $newC.change(function() {
    deselectOtherCategory($(this));
  });
  var $newL = $('<label for="'+newCategoryId+'">' + newCategoryName + '</label>');
  $li.append($newC).append($newL);
  $(container).append($li);
}
function InsertNewCategory(categoryType) {
  var categoryName;
  var categoryDescription;
  if (categoryType == 0) {
    categoryName = $("#selectLocationCategoryForm input[id=poiCategoryNewEntCategoryName]").val();
    categoryDescription = $("#selectLocationCategoryForm input[id=poiCategoryNewEntCategoryDescription]").val();
  } else {
    categoryName = $("#selectLocationCategoryForm input[id=poiCategoryNewPersCategoryName]").val();
    categoryDescription = $("#selectLocationCategoryForm input[id=poiCategoryNewPersCategoryDescription]").val();
  }
  
  
  var default_permission =[{addPOI:true, deletePOI:true, edit:true, editPermission:true, sharePOI:true,userId:window.currentUser,view:true }];
  default_permission[0]["delete"] = true;
  //var encodedUserPermissions_string=window.currentUser+':1111111';
  
  var options = {};
  options.contentType='application/json';
  options.extra = {
      categoryType: categoryType,
      categoryName: categoryName,
      userPermissions:default_permission
      /*userPermissions:JSON.stringify([default_permission])*/
  };
  options.data = {
    categoryName: categoryName,
    categoryType: categoryType,
    userPermissions:default_permission
    /*,userPermissions:default_permission
    /*userPermissions:JSON.stringify([default_permission])*/
  };
   options.data=JSON.stringify(options.data);
   /*options.extra=JSON.stringify(options.extra);*/
  
  var validator=new Validator({
   categoryName: {
        domElement: '#categoryDetailForm_categoryName #dialog',
         validate: 'presence'
      }
    });
  function errorsOnDialog(serverErrors) {
    var el = validator.parseServerErrors(serverErrors);
    $('#error-view-category > div.content-cell >span','#dialog').html($.i18n.prop('error.send.title'));
    $('#error-view-category > div > ul','#dialog').empty().append(el);
    $('#error-view-category','#dialog').show();
  }
  options.success = function(data, textStatus, jqXHR, options) {
    if (checkResponseSuccess(data,errorsOnDialog)) {
      var message_result=data.message || data.successItemsMessage;
      var id_result=data.categoryId || data.successfullItems[0];
      
      var btns = {};
      if (options.categoryType == 0) {
        $('#newEntCategoryCreationRow').hide();
        $('#newEntCategoryCreationLink').show();
      } else if (options.categoryType == 1) {
        $('#newPersCategoryCreationRow').hide();
        $('#newPersCategoryCreationLink').show();
      }

      //Setto il category type
      $('#updateLocationDetail_categoryType').val(options.categoryType);
      
      btns[$.i18n.prop('buttons.ok')] = function(){
        appendNewCheckBox(id_result, options.categoryName, options.categoryType);
        $(this).dialog('close');
      };
      utils && utils.dialog({
        title: $.i18n.prop('dialog.title.success'),
        content: options.categoryName + ' ' + message_result,
        buttons: btns
      });
      
    }
  };
  utils && utils.lbasDoPost('addNewPoiCategory.action', options);
}
function toggleSingleAdvancedSearch(){
  if($("#fom_single_search:visible").length>0){
    $("#fom_single_search").hide();
  }else{
    $("#fom_single_search").show();
  }
  if($("#fom_advanced_search:visible").length>0){
    $("#fom_advanced_search").hide();
  }else{
    $("#fom_advanced_search").show();
  }
  
}

var fomGenericSearchObj ;


function genericSearch( genericSearchObj ,makeAddressSearch, makePoiSearch, callbackFunction){
  /*if(fomGenericSearchObj!=null){ Commented because it caused stopping of search again from #inpt_search
    return ;
  }*/
  
  fomGenericSearchObj = {address:genericSearchObj.address,      
              city :genericSearchObj.city,
              houseNumber :genericSearchObj.houseNumber,
              postcode :genericSearchObj.postcode,
              street :genericSearchObj.street,
              makeAddressSearch:makeAddressSearch,
              makePoiSearch:makePoiSearch,
              callbackFunction:callbackFunction};
  
  
  if(makeAddressSearch){
   /*if (lbasGISConn == undefined || lbasGISConn == null) {
     lbasGISConn = new NavteqGISManager();
   }*/

    geocoder.geocode({ 'address': genericSearchObj.address, region: genericSearchObj.region }, function( results, status ) {
        var lbasResults = [ GMapsHelper.addressToObj(results[0], null, null, encodeURIComponent(genericSearchObj.address)) ];  
        if ( typeof(lbasResults[0]) == 'undefined' ) {
          genericSearchCompleted();
        } else {
          lbasResults[0].index = null;
          geocodeComplete(lbasResults);
        }
    }, function(status) {
      geocodeFalied(status);
    });
   /*lbasGISConn.geocode({
      address:genericSearchObj.address,
      region:genericSearchObj.region,
      houseNumber :genericSearchObj.houseNumber,
      street:genericSearchObj.street,
      postcode:genericSearchObj.postcode,
      city:genericSearchObj.city
    }, geocodeComplete, geocodeFalied);*/

  }else if (makePoiSearch){
    startPoiSearch();
  }
  
}

function startPoiSearch(){
  GMapsHelper.poi(fomGenericSearchObj.address,null,poiSearchComplete,poiSearchComplete);
  fomGenericSearchObj.poiSearchCount=0;
}

function geocodeFalied(status){
  if(fomGenericSearchObj.makePoiSearch){
    startPoiSearch();
  }else{
    genericSearchCompleted();
  }
}
function geocodeComplete(json){
  if(fomGenericSearchObj) fomGenericSearchObj.geocodeResp=json;
  if(fomGenericSearchObj && fomGenericSearchObj.makePoiSearch){
    startPoiSearch();
  }else{
    genericSearchCompleted();
  } 
}

function poiSearchComplete(json){
  fomGenericSearchObj.poiSearchCount++; 
  if ($.isArray(json) ){
    fomGenericSearchObj.poiResp=json;
    genericSearchCompleted();
  }else if (fomGenericSearchObj.poiSearchCount<2){

    var leftBottom = new google.maps.LatLng(regionLowerLeftLat, regionLowerLeftLon);
    var rightTop = new google.maps.LatLng(regionUpperRightLat, regionUpperRightLon);

    GMapsHelper.poi(fomGenericSearchObj.address,{rightTop:rightTop,leftBottom:leftBottom},poiSearchComplete,poiSearchComplete);
  }else{
    genericSearchCompleted();
  }

}

function genericSearchCompleted(){
  
  var allResults =[];
  if(fomGenericSearchObj && fomGenericSearchObj.geocodeResp){
    allResults= allResults.concat(fomGenericSearchObj.geocodeResp);
  }
  if(fomGenericSearchObj && fomGenericSearchObj.poiResp){
   allResults= allResults.concat(fomGenericSearchObj.poiResp);
  }   
  
  if($("#fom_advanced_search").css("display") != "none"){
     if(allResults.length>0 && allResults[0] != "ZERO_RESULTS"){
       fomGenericSearchObj && fomGenericSearchObj.callbackFunction(allResults);
     }else{
       showErrorDialog($.i18n.prop('error.location.search.noresults'));
       $('#search span.searchLoading')
      .removeClass('searchLoading')
      .addClass('searchReset');
     }
     
     fomGenericSearchObj=null;
  }else{
    fomGenericSearchObj && fomGenericSearchObj.callbackFunction(allResults);
  }   
}

function genericPoisShowOnMap(){
  
  $("input[id ^= poicheckbox-id]:checked").each(function(index) {
    var element = $(this).val().split(":");
    var name = element[0];
    var address = element[1];
    var latitude = element[2];
    var longitude = element[3];
    showGenericPOIOnMap(name,address,latitude,longitude, index);
  });
}


function queryEventOnMap(id, time, creator, canEdit) {
  $('#btn_map').click();
  $.ajax({
    url :"showMeetingOnMap.action",
    type :'POST',
    data :{
      id : id,
      localeTime : time
    },
    dataType :'json',
    success :function(showOnMapJson) {
      if (checkResponseSuccess(showOnMapJson)) {
          setTimeout(function() {
              showEventOnMap(showOnMapJson, creator, canEdit);
            }, 500);
      }
    }
  });
}


function showEventOnMap(showOnMapJson, creator, canEdit/* subject, address, latitude, longitude, start, end, id, chair*/) {
  
  /*.meeting.message_subject,showOnMapJson.meeting.location_address,showOnMapJson.meeting.latitude,showOnMapJson.meeting.longitude, showOnMapJson.meeting.start_timestamp, showOnMapJson.meeting.end_timestamp, showOnMapJson.meeting.id*/
  
  
  console.log(showOnMapJson);
  
  var meeting=showOnMapJson.meeting;
  var subject=meeting.message_subject;
  var address=meeting.location_address;
  var latitude=meeting.latitude;
  var longitude=meeting.longitude;
  var start=meeting.start_timestamp;
  var end=meeting.end_timestamp;
  var id=meeting.id;
  var chair=meeting.chairId

  var currentTime = new Date().getTime();
  var str = currentTime.toString();
  var markerId = str.substring(str.length - 9, str.length);
  var show =(creator && canEdit);
  
  /*
  if(parseInt(chair) === parseInt(currentUser)){
	 show = true; 
  }*/
  
  var tooltipContent = parseTemplate('eventOnMapTemplate', {
    latitude :latitude,
    longitude :longitude,
    address :address,
    start_date: new Date(start).format('dd/mm/yyyy HH:mm'),//.customFormat( "#hh#:#mm# #DD#/#MM#/#YYYY#" ),
    end_date: new Date(end).format('dd/mm/yyyy HH:mm'),//.customFormat( "#hh#:#mm# #DD#/#MM#/#YYYY#" ),
    title : $.i18n.prop('meetings.meetingpoint'),
    subject: subject,
    markerId :'g'+markerId,
    id : id,
    show : show
  });

  var markerOptions = {
    id :'g'+markerId,
    icon :'images/pin_place.png',
    iconWidth :29,
    iconHeight :39,
    latitude :parseFloat(latitude),
    longitude :parseFloat(longitude),
    hasTooltip :true,
    staticContent :true,
    contentHtml :tooltipContent,
    forceToOpen :true,
    history :true
  };
  mainMarkerManager.createMarker(markerOptions, null, true);
  adjustZoomLevelAndCenterMap(map,latitude,longitude);
  createRouteAndShowAttendee(showOnMapJson);
}


function createRouteAndShowAttendee(json) {
   var meeting = json.meeting;
   var attendees = meeting.attendees;
   var meetingID=meeting.id;
   var tot_attendees=attendees.length;
      
   if(tot_attendees==0) return
  //crea markers attendee
   var directionService = new google.maps.DirectionsService;

    for ( var i = 0; i < tot_attendees; i++) {
       var attendeeModel = attendees[i];
        /*DEBUG */
        /*attendeeModel.latitude=48.956614+(i*.1);
        attendeeModel.longitude=2.45222190+(i*.1) ;*/
        
        
        //!attendeeModel.chairUser &&
        if ( !attendeeModel.chairUser && attendeeModel.latitude != null && attendeeModel.longitude) {
            /*create markers && tooltip */
            var etaCalculated = "";
            if (attendeeModel.eta != null && attendeeModel.eta != undefined) etaCalculated = attendeeModel.eta;
            
            var tooltipContentSingleAttendee = parseTemplate('genericTooltipTemplate', {
              header :attendeeModel.fullname,
              content :$.i18n.prop('meetings.eta2') + " " + (attendeeModel.showMyEta ? etaCalculated : ""),
              markerId :'u' + i + '_' + meetingID
            });
            
            var markerOptionsSingleAttendee = {
              id :'u' + i + '_' + meetingID,
              latitude :parseFloat(attendeeModel.latitude),
              longitude :parseFloat(attendeeModel.longitude),
              hasTooltip :true,
              staticContent :true,
              contentHtml :tooltipContentSingleAttendee,
              forceToOpen :true
            };
            mainMarkerManager.createMarker(markerOptionsSingleAttendee);
            
            
            /* DRAW ROUTE*/
           
            
            var points = [];
            var userid = attendeeModel.id;
            var fullname = attendeeModel.fullname;
            var updatedPoints = points;
            var atdLongitude = attendeeModel.longitude;
            var atdLatitude = attendeeModel.latitude;
            var metLongitude = meeting.longitude;
            var metLatitude = meeting.latitude;
            if (atdLongitude != undefined && atdLatitude != undefined) {
              updatedPoints.push(new google.maps.LatLng(atdLatitude, atdLongitude));
            }
            if (metLongitude != undefined && metLatitude != undefined) {
              updatedPoints.push(new google.maps.LatLng(metLatitude, metLongitude));// last element is the meeting point
            }
            if (updatedPoints.length > 1) {
              var request = {
                travelMode: google.maps.TravelMode.DRIVING,
                durationInTraffic: true
              };
              var waypoints = [];
              $(updatedPoints).each(function(i, pn) {
                if ( i == 0 )
                  request.origin = pn;
                else if ( i == updatedPoints.length - 1 )
                  request.destination = pn;
                else
                  waypoints.push({
                    location: pn,
                    stopover: true
                  });
              });
              
              if ( waypoints.length > 0 ) request.waypoints = waypoints;
              directionService.route(request, function(result, status) {
                if ( status == google.maps.DirectionsStatus.OK ) {
                   var directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers : true});
                    directionsRenderer.setMap(map);
                    directionsRenderer.setDirections(result);
                  /*GMapsHelper.routeMarkers(result.routes[0],true);*/
                }
              });
            }
      }
    }
}





function showGenericPOIOnMap(name, address, latitude, longitude, count) {
  var currentTime = new Date().getTime();
  var str = currentTime.toString();
  var markerId = str.substring(str.length - 9, str.length);
  
  var tooltipContent = parseTemplate('poiRecentTooltipTemplate', {
    latitude :latitude,
    longitude :longitude,
    address :address,
    name :$.i18n.prop('location.address'),
    markerId :'g'+markerId
  });

  var markerOptions = {
    id :'g'+markerId,
    icon :'images/marker_cat_vf_uncategorized.png',
    iconWidth :26,
    iconHeight :32,
    latitude :latitude,
    longitude :longitude,
    hasTooltip :true,
    staticContent :true,
    contentHtml :tooltipContent,
    forceToOpen :true,
    history :true
  };

  mainMarkerManager.createMarker(markerOptions);
  
  if(count > 0)
    adjustZoomLevel(map);
  else 
    adjustZoomLevelAndCenterMap(map,latitude,longitude);
  
}

function getAddressDetailForTooltip(adr) {
  var detail = '';
  if (adr.street != null && adr.street.length > 0) {
    detail = detail + '<p>' + adr.street + '</p>';
  }
  if (adr.municipal != null && adr.municipal.length > 0) {
    detail = detail + adr.municipal + ',';
  }
  if (adr.city != null && adr.city.length > 0) {
    detail = detail + adr.city;
  }
  if (adr.zipcode != null && adr.zipcode.length > 0) {
    detail = detail + ' ' + adr.zipcode;
  }
  return detail;
}

function isNumeric(sText) {
  var ValidChars = "0123456789.";
  var IsNumber = true;
  var Char;

  for (i = 0; i < sText.length && IsNumber == true; i++) {
    Char = sText.charAt(i);
    if (ValidChars.indexOf(Char) == -1) {
      IsNumber = false;
    }
  }
  return IsNumber;
}


function searchAddress2(){
  var region = $("#regionList option:selected").val();
  var number ;
  var street;
  var postcode;
  var city; 
  
  if($('#fom_advanced_search input[name=number]').val()!=''){
    number = $('#fom_advanced_search input[name=number]').val();
  } 
  if($('#fom_advanced_search input[name=street]').val()!=''){
    street = $('#fom_advanced_search input[name=street]').val();
  }
  if($('#fom_advanced_search input[name=postcode]').val()!=''){
    postcode = $('#fom_advanced_search input[name=postcode]').val();
  }
  if($('#fom_advanced_search input[name=city]').val()!=''){
    city = $('#fom_advanced_search input[name=city]').val();
  }
  
  
  genericSearch({region:region,houseNumber :number,street:street,postcode:postcode,city:city}, true, false,showFindOnMapResults);
}

function searchAddress() {

  var country = $("#regionList option:selected").text();
  var splitResult = $('#fom_complexAddress').val().split(",");

  var street;
  var city = '';
  var houseNumber = '';
  var str;
  if (splitResult.length > 1) {
    city = splitResult[1].trim();
  }
  splitResult = splitResult[0].split(" ");
  if (splitResult.length > 1) {
    str = splitResult[splitResult.length - 1].trim();
    street = splitResult[0];
    for ( var i = 1; i < splitResult.length - 2; i++) {
      street += splitResult[i];
    }
    if (!isNumeric(str)) {
      street += ' ' + str;
    } else {
      houseNumber = str;
    }
  } else {
    street = splitResult[0];
  }

  $.ajax({
    url :"searchAddress.action",
    type :'POST',
    data :{
      region :$('#regionList').val(),
      street :street,
      city :city,
      number :houseNumber
    },
    dataType :'json',
    success :function(json) { 
    if (json.errorText == null) {
      if (json.street != "") {
        map.setCenter(new google.maps.LatLng(json.address.latitude, json.address.longitude));//1000
      } else {
        map.setCenter(new google.maps.LatLng(json.address.latitude, json.address.longitude));//5000
      }

      var tooltipContent = parseTemplate('poiRecentTooltipTemplate', {
        latitude :json.address.latitude,
        longitude :json.address.longitude,
        address :getAddressDetailForTooltip(json.fullAddress),
        name :$.i18n.prop('location.address'),
        markerId :'a' + json.address.latitude + '_' + json.address.longitude
      });

      var markerOptions = {
        id :'a' + json.address.latitude + '_' + json.address.longitude,
        icon :'images/marker_cat_vf_uncategorized.png',
        iconWidth :26,
        iconHeight :32,
        latitude :json.address.latitude,
        longitude :json.address.longitude,
        hasTooltip :true,
        staticContent :true,
        contentHtml :tooltipContent,
        forceToOpen :true,
        history :true
      };

      mainMarkerManager.createMarker(markerOptions);

    }
    }
  });
}

function selectRadioCategory(value) {
  switch (value) {
  // enterprise
  case "0": {
    unselectPersonalCategories();
    $("#poiCategoryNewEntCategoryName").addClass("vldRequired").addClass("vldMaxLength50");
    $("#poiCategoryNewPersCategoryName").removeClass("vldRequired").removeClass("vldMaxLength50");    
    break;
  }
  // personal
  case "1": {   
    unselectEnterpriseCategories();
    $("#poiCategoryNewPersCategoryName").addClass("vldRequired").addClass("vldMaxLength50");
    $("#poiCategoryNewEntCategoryName").removeClass("vldRequired").removeClass("vldMaxLength50");
    break;
  }
  } 
  registerValidations("selectLocationCategoryForm");
}
function unselectPersonalCategories() {
  $("#selectEntCategoryDiv").show();
  $("#selectPersCategoryDiv").hide();
  var checkscount = $("#selectPersCategoryDiv input[name=categoryIDs]:checked").length;
  if (checkscount > 0) {
    var checkedUsers = $("#selectPersCategoryDiv input[name=categoryIDs]:checked");
    var i = 0;
    for (i = 0; i < checkedUsers.length; i++) {
      checkedUsers[i].checked = false;
    }
  }

}
function unselectEnterpriseCategories() {
  // alert('unselectEnterpriseCategories');
  $("#selectEntCategoryDiv").hide();
  $("#selectPersCategoryDiv").show();

  var checkscount = $("#selectEntCategoryDiv input[name=categoryIDs]:checked").length;
  if (checkscount > 0) {
    var checkedUsers = $("#selectEntCategoryDiv input[name=categoryIDs]:checked");
    var i = 0;
    for (i = 0; i < checkedUsers.length; i++) {
      checkedUsers[i].checked = false;
    }
  }
}
function toggleCategoriesDivs() {
  $("#entCategoryExpandCollapse").toggle( function() {
    unselectEnterpriseCategories();
  }, function() {
    unselectPersonalCategories();
  });

  $("#persCategoryExpandCollapse").toggle( function() {
    unselectPersonalCategories();
  }, function() {
    unselectEnterpriseCategories();
  });

}
// location.categories

/*
function openEditLocTab1() {

  var poiId = $('#updateLocationDetail input[name=poi.id]').val();
  var poiType = $("#updateLocationDetail input[name=poi.type]").val();
  
  if (poiId == undefined || poiId <= 0) {
    $("#addLocationButton").show();
    $("#updateLocationButton").hide();
  } else {
    if (poiType == 1)
      $("#saveAsEnterpriseButton").show();
    else
      $("#saveAsEnterpriseButton").hide();
    $("#updateLocationButton").show();
    $("#addLocationButton").hide();
  }
  $("#cancelButton").show();
}
*/

function openEditLocTab1(container, data){
  if(container == null){
    container = "#edit_loc_tab1";
  }
  if( $(container).find('.forScroll').length ===1 ){
    return false;
  }
  var options = {};
  if(data == undefined)
    return;
    
  var validator = new Validator();
  function errorsOnDialog(serverErrors) {
    var el = validator.parseServerErrors(serverErrors);
    $('#error-view-sendmessage > div.content-cell >span',"#dialog").html($.i18n.prop('error.send.title'));
    $('#send-list-wrapper',"#dialog").empty().append(el);
    $('#error-view-sendmessage',"#dialog").show();
  }
  
  $(container).load('pages/template/savePlaceDialogTemplate_tab0.html', function(){
    $("#updateLocationDetail input[name='poi.street']").val(data.street);
    $("#updateLocationDetail input[name='poi.city']").val(data.city);
    $("#updateLocationDetail input[name='poi.country']").val(data.country);
    $("#updateLocationDetail input[name='poi.address']").val(data.address);
    $("#updateLocationDetail input[name='poi.postcode']").val(data.postal_code);
    $("#updateLocationDetail input[name='poi.houseNo']").val(data.street_number);
    $("#updateLocationDetail #poiDetailLatitude").text(data.lat);
    $('#updateLocationDetail #updateLocationDetail_poi_latitude').val(data.lat);
    $("#updateLocationDetail #poiDetailLongitude").text(data.lng);
    $("#updateLocationDetail #updateLocationDetail_poi_longitude").val(data.lng);
  });  
        
  $("#selectedLocationId").val('');
  $("#selectedLocationType").val(1);
  $("#edit_loc_tab4_list_item").hide();

  //$("#addLocationButton").show();
  //$("#updateLocationButton").hide();
  
  registerValidations("updateLocationDetail");
}

function openEditLocTab2(container) {
  if(container == null){
    container = "#edit_loc_tab2";
  }

  if( $(container).find('#selectLocationCategoryForm').length ===1 ){
    return false;
  }

  var validator=new Validator();
  function errorsOnDialog(serverErrors) {
    var el = validator.parseServerErrors(serverErrors);
    $('#error-view-sendmessage > div.content-cell >span',"#dialog").html($.i18n.prop('error.send.title'));
    $('#send-list-wrapper',"#dialog").empty().append(el);
      $('#error-view-sendmessage',"#dialog").show();
  }

  var options = {};
  options.success = function(data) {
    if (checkResponseSuccess(data, errorsOnDialog)) {
      $(container).load('pages/template/savePlaceDialogTemplate_tab1.html?_' + Math.floor(Math.random()*100), function(){
        
        /*if($("#selectEntCategoriesCheckContainer input:checkbox:checked").length > 0) {
          $("#radioCategoryTypeId1").attr('checked', "checked");
          selectRadioCategory('0');
        }
        if($("#selectPersCategoriesCheckContainer input:checkbox:checked").length > 0) {
          $("#radioCategoryTypeId2").attr('checked', "checked");
          selectRadioCategory('1');
        }
        $('input[name=categoryType]').click(function(e){
          var value = $(this).attr('value');
          selectRadioCategory(value);
        });*/
        if($('#updateLocationDetail_categoryType').val() == 0){
          $('#enterprise').click();         
        }

        //check permission create_enterprise_categories
        if(userConf.rights.create_enterprise_categories) {
          $('#btn_newEntCategory').click(function(e){
            $('#newEntCategoryCreationRow').show(); 
            $('#newEntCategoryCreationLink').hide();
            e.preventDefault();
          }); 
        } else {
          $('#btn_newEntCategory').hide();
        }
        $('#btn_newPersCategory').click(function(e){
          $('#newPersCategoryCreationRow').show();
          $('#newPersCategoryCreationLink').hide();
          e.preventDefault();
        }); 
        
        $('#btn_createEntCategory, #btn_createPersCategory').click(function(e){
          var type =1;
          if ($('#btn_createEntCategory').is(':visible')){
            type =0;
          }
          if (lbasValidate('selectLocationCategoryForm')) 
            InsertNewCategory(type);
          e.preventDefault();
        });
        
        $('#btn_cancelEntCategory, #btn_cancelPersCategory').click(function(e){
          var type = 1;
          if($('#btn_cancelEntCategory').is(':visible')){
            type=0;
          }
          switch (type) {
            case 0:
              $('#newEntCategoryCreationRow').hide(); 
              $('#newEntCategoryCreationLink').show();
              break;
            case 1:
              $('#newPersCategoryCreationRow').hide(); 
              $('#newPersCategoryCreationLink').show();
              break;  
            }
          e.preventDefault();
        });
        
        //costruction categories
        
        var ulEnterprise = $('<ul></ul>');
        $.each(data.enterpriseCategoryList, function(i, k){
          if(k.credentials.addPOI==true) {
            var li = $('<li></li>');
            var tmpC = $('<input type="checkbox" name="categoryIDs" value="'+k.id+'" id="'+k.id+'">').data('poi', k);
            var tmpL = $('<label for="' + k.id + '">' + k.name + '</label>');
            li.append(tmpC);
            li.append(tmpL);
            ulEnterprise.append(li);
          }
        });
        $('#selectEntCategoriesCheckContainer').append(ulEnterprise);
        $('#selectEntCategoriesCheckContainer input:checkbox').change(function() {
          deselectOtherCategory($(this));
         });
        
        var ulPersonal = $('<ul></ul>');
        $.each(data.personalCategoryList, function(i, k){
          var li = $('<li></li>');
          var tmpC = $('<input type="checkbox" name="categoryIDs" value="'+k.id+'" id="'+k.id+'">')
            .data('poi', k);
          var tmpL = $('<label for="' + k.id + '">' + k.name + '</label>');
          li.append(tmpC);
          li.append(tmpL);
          ulPersonal.append(li);
        });
        $('#selectPersCategoriesCheckContainer').append(ulPersonal);
        $('#selectPersCategoriesCheckContainer input:checkbox').change(function() {
          deselectOtherCategory($(this));
         });
        var categories_selected=$('#updateLocationDetail_categoryIDs').val();
        $('#selectEntCategoriesCheckContainer input').each(function(){
          if ( categories_selected.indexOf($(this).attr('id')) != -1 ){
            $(this).attr('checked','checked');
          }
        });
        $('#selectPersCategoriesCheckContainer input').each(function(){
          if ( categories_selected.indexOf($(this).attr('id')) != -1 ){
            $(this).attr('checked','checked');
          }
        });
        localize && localize.newPlaceDialog_tab1();
        registerValidations("selectLocationCategoryForm");
      });
    }
  };  
  utils && utils.lbasDoGet('json/listPoiCategoriesForSelection.action', options);
}
function deselectOtherCategory($ck) {
  var pn_name=$ck.parents('div').attr('id');
  var pn_delete= pn_name==='selectEntCategoriesCheckContainer' ? 'selectPersCategoriesCheckContainer': 'selectEntCategoriesCheckContainer';
  var lck=$('#'+pn_delete+' input:checkbox');
  lck.unbind('change');
  lck.removeAttr('checked');
  lck.change(function() {
    deselectOtherCategory($(this));
  });
  var tck=$('#'+pn_name+' input:checkbox').filter(':checked').length;
  $('#updateLocationDetail_categoryType').val( (tck >0 && pn_name==='selectEntCategoriesCheckContainer') ? "0" : "1");
}

function openEditLocTab3(container) {
  if(container == null){
    container = "#edit_loc_tab3";
  }
  if( $(container).find('#updateLocPermission').length ===1 ){
    return false;
  }
  var poiId = $('#updateLocationDetail input[name="poi.id"]').val() || 0;
  $(container).load('pages/template/savePlaceDialogTemplate_tab2.html', function(){
    permissionsObj = {};
    if (poiId <= 0 || poiId == undefined) {
      //$("#addLocationButton").hide();
      //$("#updateLocationButton").hide();
    } else {
      $("#updateLocationButton").show();
      $("#addLocationButton").hide();
    }
    $("#cancelButton").show();
    getLocationPermissions('', poiId);
    addPermissionSearch();
    localize && localize.newPlaceDialog_tab2();
  
    /*
$('#navigationLoc').accordion({
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
              searchUserId: 'g' + data.groupId,
              poiId: options.poiId
            };
            options.async = false;
            
            options.success = function(data){
              $.each(data.usersByGroups[0].users, function(j, h){
                var $li_user = $('<li class="clearfix"></li>');
                var $i_user = $('<input class="checkB" id="locCheckUser'+h.id+'" type="checkbox" value="'+h.id+'" id="user'+h.id+'"><div class="iconArrow"><img src="images/arrow_right.png"></div>')
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
            utils && utils.lbasDoGet('json/getUsersForPoiPermissions.action', options);
          }
          }
      }
    });
*/
    
  }); 
}

function getLocationPermissions(userID, poiId) {
  var options = {};
  options.data = {
    searchUserId: userID,
    poiId: poiId
  };
  options.extra = {
    poiId: poiId
  };
  options.async = false;
  
/*
  options.success = function(data, textStatus, jqXHR, options) {
    $.each(data.usersByGroups, function(i, k){

      var $h3 = $('<div class="listH"></div>');
      var $arr = $('<div class="iconArrow"><img src="images/arrow_right.png" /></div>');
      var $div = $('<div id="poigroup'+k.groupId+'" class="poiGroup"></div>');
      var $a = $('<a class="selectableArea" href="#poigroup'+k.groupId+'"></a>')
        .click(function(e){
          e.preventDefault();
        });
      var $input = $('<input class="checkB" type="checkbox" value="updateLocPermission'+k.groupId+'" id="g'+k.groupId+'" onclick="clickGroup(this, ' + k.groupId + ', ' + String.fromCharCode(39) + 'loc' + String.fromCharCode(39) + ') "/>')
        .data('g', k);
        
      var $span = $('<span class="name">' + k.groupName + '</span>' + '<span class="groupUsercount">'+ k.userCount+'</span>');
      var $ul = $('<ul></ul>');
      
      $h3.append($input);
      $a.append($arr);
      $a.append($span);
      $h3.append($a);
      $('#navigationLoc').append($h3).append($div.append($ul));
    });
  };  
  
  utils && utils.lbasDoGet('json/getUsersForPoiPermissions.action', options);
*/

options.success = function(data)
    {
      $('#navigationLoc').empty();
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
              e.preventDefault();
            });
          /*group count display options*/
         var groupName = '<span class="groupName" id="groupName_' + h.groupId + '">' +  Encoder.htmlDecode(h.groupName) + '</span> <span class="groupUsercount"><span class="all_total_count">' + h.userCount + '</span></span>';
         var $label = $('<span id="label_g' + h.groupId + '" class="groupNameContainerCat" />').html(groupName);
         var $openclose = $('<span id="userG_details_' + h.groupId + '"></span>').addClass('openCloseCat');
         $label.add($openclose).click(function(e){
            var $li=$(this).parents('li');
            var container = $li.children('ul');
            var id = $li.attr('id').substring('group'.length);
            var $img=$li.find('.openCloseCat > img');
            if(container.is(':visible')){
                $img.attr('src', 'images/arrow_right.png');
                container.hide();
            }else{
                $img.attr('src', 'images/arrow_down.png');
                container.show();
            }
            e.preventDefault();
          });
          $('<img src="images/arrow_right.png" class="openCloseCat"/>').appendTo($openclose);
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
          var $checkbox = $('<input type="checkbox" data-cat="'+data.poiId+'" id="locCheckUser' + usr.id + '" value="' + usr.id + '" class="cat check-box" name="user' + usr.id + '"><img class="openCloseCat" src="images/arrow_right.png">')
              .unbind('change')
              .change(function(){
                var attr_id=$(this).attr('id');
                if (attr_id) {
                  var id = $(this).attr('id').substring('catCheckUser'.length);
                  //clickUser('cat',this,id);
                  clickUser('loc',this,id);
                }
              });
            var $span1 = $('<span id="item_name_' + usr.id + '"></span>').text(Encoder.htmlDecode(usr.name) || ' ');
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
        $('#navigationLoc').append($divOut);
      });
    };
    utils && utils.lbasDoGet('json/getUsersForPoiPermissions.action', options); 
}
function addPermissionSearch (){
   $("#permissionSearchInput").val($.i18n.prop('general.Search')).autocomplete(
   {
     source: function (b, a) {
            $.getJSON("userSearchAutocomplete.action", {
                q: encodeURIComponent(b.term),
                excludeGroups: true,
                retrieveAssets: false/*,
                excludedUser:currentUser*/
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
        appendTo:"#wp_autocomplete",
     select :function(event, ui) {
       findAndSelectUserOrGroupOnLocationPermission(ui.item.id);
       $(this).blur().val($.i18n.prop('general.Search'));
       return false;
     }
   })
}
function findAndSelectUserOrGroupOnLocationPermission(id) {
  var type=id.substring(0,1);
  var $ref;
  var cref;
  switch(type) {
    case "u":
      cref="CheckUser"+id.substring(1);
      break;
  }
  if (cref) $ref=$("[id*="+cref+"]");
  if( $ref.length >0) {
    var checked = $ref.is(":checked");
    if (!checked) {
      $ref.attr('checked', 'checked');
      $ref.trigger("change");
    }
     if(!$ref.parents(".wp-list-group").find(">ul").is(':visible')) {
        $ref.parents(".wp-list-group").find(">div.group >span.openCloseCat").trigger("click");
      }
  }
}
function openEditLocTab4() {
    if( $('#edit_loc_tab4').find('.container').length ===1 ){
      return false;
    }
    $('#edit_loc_tab4').empty(); 
    $('#edit_loc_tab4').append('<div class="container"><h1>'+ $.i18n.prop("categoryAdmin.CurrentAdmin") +'</h1><p class="text"></p></div>')
    var poiId = $('#updateLocationDetail input[name="poi.id"]').val();
    if(parseInt(poiId) > 1 ) {
      $('#edit_loc_tab4 .container .text').load('json/getPoiAdmins.action?poiId=' + poiId, function(){
        if($(this) != "" ){
          var name = $(this).text().split('"name":"');
            name1 = name[1];
            if(name1 == undefined){
              $(this).text("no user");
              return false;
            }
            name2 = name1.split('"');
            $(this).text(name2[0]);
          } 
      });
    }
    
  
  //$("#updateLocationButton").hide();
  //$("#cancelButton").hide();
}

function listLocation() {
  
  $.ajax( {
    url :'getlocationmain.action',
    type :'POST',
    async :false,
    dataType :'json',
    success : function(json) {
      if (checkResponseSuccess(json)) {
        $('#locations').html(parseTemplate("locationsTemplate", {
          json :json,
          searchText :null
        }));
        if (json.clist.length > 1) {
          $('#btn_tab-places-personal').html($.i18n.prop('category.personal') + " (" + json.clist[0].poiCount + ")");
          $('#btn_tab-places-enterprise').html($.i18n.prop('category.enterprise') + " (" + json.clist[1].poiCount + ")");
        }
      }
    }
  });
}

function listLocationNumber() {
  $.ajax( {
    url :'getlocationmain.action',
    type :'POST',
    async :false,
    dataType :'json',
    success : function(json) {
      $('#btn_tab-places-personal').html($.i18n.prop('category.personal') + " (" + json.clist[0].poiCount + ")");
      $('#btn_tab-places-enterprise').html($.i18n.prop('category.enterprise') + " (" + json.clist[1].poiCount + ")");
    }
  });
}

function populateRecentLocations(showHeader) {
  var str;
  $.ajax( {
    url :'getrecentlocationJs.action',
    type :'POST',
    async :false,
    dataType :'json',
    success : function(json) {
      if (checkResponseSuccess(json)) {
        if (showHeader) {
          str = parseTemplate("recentLocationsTemplate", {
            json :json
          });
        } else {
          str = parseTemplate("recentLocationsPanelTemplate", {
            json :json
          });
        }
        return str;
      }
    }
  });
  return str;
}

function openRequestPoiPermissionDialog(poiId, poiName) {
  $("#reqPPermMessageContent").val('');
  $("#requestedPoiId").val('').val(poiId);
  $("#requestPoiPermissionDialog").dialog( {
    title :poiName + "<br/>" + $.i18n.prop('category.RequestPermission'),
    bgiframe :true,
    modal :glbmodal,
    resizable :false,
    close : function(event, ui) {
      $("#requestPoiPermissionDialog").dialog('destroy');
    }
  }).height("auto");

  $('#reqPPermMessageContent').maxlength( {
    'feedback' :'.charsLeft'
  });
  $('#reqPPermMessageContent').val($.i18n.prop('category.typeYourReason')).css('color', 'grey').blur();
}

function requestPoiPermission2() {
  // if textarea has its default value 'Type in your reason' ; do not send
  // this text to server
  if($("#reqPPermMessageContent").css("color") == 'grey' && $("#reqPPermMessageContent").val() == $.i18n.prop('category.typeYourReason'))
    $("#reqPPermMessageContent").val("");
  
  var serializedFormData = $('#requestPoiPermission').serialize();
  $.ajax( {
    type :'POST',
    url :'requestPoiPermission',
    data :serializedFormData,
    success : function(ajaxCevap) {
      $("#requestPoiPermissionDialog").dialog('close');
    }
  });
}

function adjustAddress(address) {
  var poiaddress = '';
  var length = address.length;

  var lineCount = parseInt(length / 40) + 1;
  for ( var i = 0; i < lineCount; i++) {
    if (i == lineCount - 1) {
      poiaddress = poiaddress + address.substr(40 * i, length - (40 * i)) + ' ';
    } else {
      poiaddress = poiaddress + address.substr(40 * i, 40) + ' ';
    }
  }

  return poiaddress;
}
/*to be removed
function routeFromMenuClick() {
  lbasGISConn.reverseGeocode(new OpenLayers.Geometry.Point(selectedLon, selectedLat), function(json) {
    if (json.address != null) {
      routeFrom(json.address, json.latitude, json.longitude);
    }
  }, function() {
    // failed
    });
}*/


function showNearestUsersMenuClick() {
  showNearestUsers(selectedLat, selectedLon);
}

/*to be removed
function routeToMenuClick() {
  lbasGISConn.reverseGeocode(new OpenLayers.Geometry.Point(selectedLon, selectedLat), function(json) {
    if (json.address != null) {
      routeTo(json.address, json.latitude, json.longitude);
    }
  }, function() {
    // failed
    });
}

function addDestMenuClick() {
  lbasGISConn.reverseGeocode(new OpenLayers.Geometry.Point(selectedLon, selectedLat), function(json) {
    if (json.address != null) {
      addDestination({address:json.address, lat:json.latitude, lon:json.longitude});
    }
  }, function() {
    // failed
    });
}

function saveLocMenuClick() {
  lbasGISConn.reverseGeocode(new OpenLayers.Geometry.Point(selectedLon, selectedLat), function(json) {
    if (json.address != null) {
      var addressObj = {
        address :json.address,
        city :json.city,
        country :json.country,
        street :json.street,
        postcode : json.postcode,
        houseNumber : json.houseNumber,
        latitude :json.latitude,
        longitude :json.longitude
      };
      openSaveLocationDialog($.i18n.prop('tooltipmain.SaveLocation'), addressObj);
    }
  }, function() {
    // failed
      var addressObj = {
        latitude :selectedLat,
        longitude :selectedLon
      };
      openSaveLocationDialog($.i18n.prop('tooltipmain.SaveLocation'), addressObj);
    });
}

function planMeetingMenuClick() {
  lbasGISConn.reverseGeocode(new OpenLayers.Geometry.Point(selectedLon, selectedLat), function(json) {
    if (json.address != null) {
      
      setAsMeetingLocation(true, json.latitude, json.longitude, json.address, json.street);
    }
  }, function() {
    // failed
    });
}*/


function showUsersOnMap(userModel, locateLCS, assetRole) {


  mainMarkerManager.removeMarker('u' + userModel.user_id);
  var lastTrackTime = calculateElapsedTime(userModel.last_pos_date);
  var lastTrackTimeForUsersOffset = calculateElapsedTime(userModel.last_pos_date, userModel.timeZoneOffset);
  var address = "";
  if (userModel.last_pos_address != null && userModel.last_pos_address != 'null' && userModel.last_pos_address != '') {
    address = userModel.last_pos_address;
  }

  var tooltipContent = parseTemplate('userLocationTooltipTemplate', {
    user :userModel,
    latitude : GMapsHelper.deg2dms(userModel.latitude),
    longitude : GMapsHelper.deg2dms(userModel.longitude),
    radius : userModel.radius,
    lastTrackTime :lastTrackTime,
    lastTrackTimeForUsersOffset : lastTrackTimeForUsersOffset,
    locateLCS :locateLCS,
    address :address,
    markerId :'u' + userModel.user_id
  });
  
  if(userModel.iconName != null){
    var markerOptions = {
      id :'u' + userModel.user_id,
      latitude :userModel.latitude,
      longitude :userModel.longitude,
      hasTooltip :true,
      staticContent :true,
      contentHtml :tooltipContent,
      radius :userModel.radius,
      radiusColor :userModel.radiusColor,
      icon:userModel.iconName,
      forceToOpen :true,
      type:(assetRole) ? 'asset:' + userModel.fullName : ''
    };
  }else{
    var markerOptions = {
        id :'u' + userModel.user_id,
        latitude :userModel.latitude,
        longitude :userModel.longitude,
        hasTooltip :true,
        staticContent :true,
        contentHtml :tooltipContent,
        radius :userModel.radius,
        radiusColor :userModel.radiusColor,
        icon:(assetRole) ? 'images/pin_red.png' : 'images/pin_red.png',
        forceToOpen :true,
        type:(assetRole) ? 'asset:' + userModel.fullName : ''
      };
  }

  mainMarkerManager.createMarker(markerOptions);

   adjustZoomLevel(map);

  return 'u' + userModel.user_id;
}

function openSaveLocationDialogFromLatLon(title, lat, lon) {

  GMapsHelper.reverseGeocode( lat, lon, function( data ) {
    openSaveLocationDialog(title, data);
  });

}

function inviteLocateUserToMeeting(user_id, user_name) {
  var invitees = [ {
    id :user_id,
    name :user_name
  } ];
  createNewMeeting(true, 0.0, 0.0, invitees, new Date(),null);
  openCalendar();
}

function locateUser(userId, locateLCS, userRoleId) {

  if (!userId) {
    userId = 0;
  }
  if (!locateLCS) {
    locateLCS = false;
  }
  if (locateLCS) {
    $("#tooltipUpdateUserLoc_" + userId).show();
  }
  $('#map').block();
  
  $.ajax({
    url :"locateUser.action",
    type :'POST',
    data :{ 
      userId :userId,
      locateLCS :locateLCS
    },
    dataType :'json',
    success :function(data) {
      mainMarkerManager.createMarker();
      adjustZoomLevel(map);
      $('#map').unblock();
    },
    error: function(x, e) {
      //showGenericAjaxError(x,e)
    }
  });
}


function showGenericAjaxError(x,e) {
     //alert(e.message);
    if (x.status == 500) {
         
     }
}


function changePoiAdmin() {

  $.post('changeLocationAdmin.action', function(data) {
    if (checkResponseSuccess(data)) {
      $('#edit_loc_tab4').html(data);
      userArrayForSearch = new Array();

      var id;
      var name;

      $("#navigationLocAdmin li[id*='user']").each( function() {
        id = $(this).attr("id");
        id = id.replace("user", "u");
        name = $(this).text();
        var newelement = new uelement(id, name);
        userArrayForSearch.push(newelement);
      });

      $("#navigationLocAdmin a[class*='head']").each( function() {
        id = $(this).parent().attr("id");
        id = id.replace("group", "g");
        name = $(this).text();
        name = name.substring(0, name.indexOf("("));
        var newelement = new uelement(id, name);
        userArrayForSearch.push(newelement);
      });

      changePoiAdminTabReady();
    }
  });
}

function changePoiAdminTabReady() {

  $("#changePoiAdminUserSearch").autocomplete(userArrayForSearch, {
    formatItem : function(uelement) {
      return uelement.name;
    },
    formatMatch : function(uelement) {
      return uelement.name;
    },
    formatResult : function(uelement) {
      return uelement.name;
    }
  });

  $('#changePoiAdminUserSearch').result( function(event, data, formatted) {
    getUsersForPoiAdminChange(data.userid);
  });

  jQuery('#navigationLocAdmin').accordion( {
    active :false,
    header :'.head',
    navigation :true,
    autoHeight :false,
    animated :false,
    collapsible :true,
    icons : {
      'header' :'ui-icon-plus',
      'headerSelected' :'ui-icon-minus'
    }
  });

  $(".accordionCheckBox").click( function(e) {
    e.stopPropagation();
    e.preventDefault();
  });
}

function getUsersForPoiAdminChange(selected) {
  $.post('getUsersForPoiAdminChange.action', {
    searchUserId :selected
  }, function(data) {
    if (checkResponseSuccess(data)) {
      $('#edit_loc_tab4').html(data);
      changePoiAdminTabReady();
    }
  });
}

function radiusForPoiChecked(value) {
  if (value == 'true') {
    $("#editPoiRadius").css("display", "");
  } else if (value == 'false') {
    $("#editPoiRadius").css("display", "none");
  }
}

function updatePoiCount(val, enterprise) {
  
  if(enterprise) {
    
    var firstPart = $('#enterpriseTab').html().split("(")[1];
    if(firstPart != undefined) {
      
      var pcountEnterprise = parseInt(firstPart.split(")")[0]) + val;
      if(!isNaN(pcountEnterprise)) {
        
        $('#enterpriseTab').html($.i18n.prop('category.enterprise') + "<br>(" + pcountEnterprise + ")");
      }
    }
  } else {
    
    var firstPart = $('#personalTab').html().split("(")[1];
    if(firstPart != undefined) {

      var pcountPersonal = parseInt(firstPart.split(")")[0]) + val;
      if(!isNaN(pcountPersonal)) {
        
        $('#personalTab').html($.i18n.prop('category.personal') + "(" + pcountPersonal + ")");
      }
    }
  }
}

function clickPoiOrCatgCheckBox(checkedobj) {
  
  var isUncategorizedExists = false;
  
  $("input[id^='categorycheckbox-id']:checked").each(function() {
    if( $(this).val() != null || $(this).val() != undefined || $(this).val() != "") {
      var id = $(this).val().substring(0,$(this).val().indexOf(":"));
      if(id == -1) {
        isUncategorizedExists = true;
      }
    }
  });

  var context;
  var context1;
  if($('#enterpriseTabContent').is(':visible')){
    context="hideMultiActions0";
    context1="enterpriseTabContent";
  }else if($('#personalTabContent').is(':visible')){
    context="hideMultiActions1";
    context1="personalTabContent";
  }
  
  var selctedCatgLeng = $("input[id^='categorycheckbox-id']:checked",$('#'+context1)).length;
  var selctedPoiLeng = $("input[id^='poicheckbox-id']:checked",$('#'+context1)).length;
  var totalSelectedCount = selctedCatgLeng + selctedPoiLeng;
  if (totalSelectedCount == 0) {
    $("#catgAndPoiActions option",$('#'+context)).each( function() {
      if (($(this,$('#'+context)).attr('value') > -1)){
        $(this,$('#'+context)).remove();
      }
    });
    for ( var i = 0; i < poiCategActions.length; i++) {
      var action = poiCategActions[i];
      if (action.key == 4 || action.key == 6 ) {
        $("#catgAndPoiActions",$('#'+context)).append("<option value='" + action.key + "'  class='lm' key ='categoryOrPoi.actionList."+action.key+"' >" + action.value + "</option>");
      }
    }
  }
   else if (totalSelectedCount == 1) {// sadece bir tane checkbox check
                    // edilmiÅŸ ise

     var editEdilebilir = true;
     var silinebilir = true;
             
     if (selctedPoiLeng > 0){
        var element = $(checkedobj,$('#'+context1)).attr("value").split(":");
        var poiId = element[0];
        var poiName = element[7];
        var poiType = element[3];
        var poieditpermissionright = element[8];
        var poieditright = element[9];
        var poichangecategoryright = element[10];
        var poiremove = element[11];
        
       if (poieditright == "false"){
         editEdilebilir = false;         
       }
       
       if (poiremove == "false"){
         silinebilir = false;        
       }
      
     } else {
       
       var element = $(checkedobj,$('#'+context1)).attr("value").split(":");
       // var categoryId = element[0];
       // var categoryType = element[1];
       // var categoryListIndex = element[2];
       // var categoryPoiCount = element[3];
       // var categoryName = element[4];
       var categoryEditRight = element[5];
       var categoryDeleteRight = element[6];
       
       if (categoryEditRight == "true"){
         editEdilebilir = true;        
       } else {
         editEdilebilir = false;
       }
       
       if(categoryDeleteRight == "true") {
         silinebilir = true;
       } else {
         silinebilir = false;
       }
       
     }
     
    $("#catgAndPoiActions option",$('#'+context)).each( function() {
      if (($(this,$('#'+context)).attr('value') > -1)){
        $(this,$('#'+context)).remove();
      }
    });

    for ( var i = 0; i < poiCategActions.length; i++) {
      var action = poiCategActions[i];
      if (action.key == 5 || action.key == 3 ) {
        $("#catgAndPoiActions",$('#'+context)).append("<option value='" + action.key + "' class='lm' key ='categoryOrPoi.actionList."+action.key+"'>" + action.value + "</option>");
      } 
      // 7=edit
      if (editEdilebilir == true && action.key == 7 && !isUncategorizedExists) {
          $("#catgAndPoiActions",$('#'+context)).append("<option value='" + action.key + "' class='lm' key ='categoryOrPoi.actionList."+action.key+"'>" + action.value + "</option>");
      }
      
      // 2=share with 3rd party hakki not implemented yet.
      // if (editEdilebilir == true && action.key == 2 && !isUncategorizedExists) {
      // $("#catgAndPoiActions",$('#'+context)).append("<option value='" + action.key + "' class='lm' key
      // ='categoryOrPoi.actionList."+action.key+"'>" + action.value + "</option>");
      // }
      
      // 1=delete
      if (silinebilir == true &&  action.key == 1 && !isUncategorizedExists) {
          $("#catgAndPoiActions",$('#'+context)).append("<option value='" + action.key + "' class='lm' key ='categoryOrPoi.actionList."+action.key+"'>" + action.value + "</option>");
      }
      
      
    }

  } else {
    // category.actionList=Delete:1|Share with 3rd party:2|Export to
    // pdf:3|Add new Category:4|Show on Map:5|Add new Place:6|Edit:7
    $("#catgAndPoiActions option",$('#'+context)).each( function() {
      $(this,$('#'+context)).remove();
    });

    for ( var i = 0; i < poiCategActions.length; i++) {
      var action = poiCategActions[i];
      if (action.key == 5 ||  action.key == 3 || (action.key == 1 && !isUncategorizedExists)) {       
        $("#catgAndPoiActions",$('#'+context)).append("<option value=" + action.key + " class='lm' key ='categoryOrPoi.actionList."+action.key+"' > " + action.value + "</option>");
      }
    }

  }

}


function locateUserAndMeeting(meetingid, userid){
  if (!$('#lbasMainMap').is(':visible')) {
    $("#locationsRightNav").click();
  }
  
  if($('#meetingRequestAnswerStatusId').text()==$.i18n.prop('messageDetail.ACCEPTED')){
    return showMeetingAndAttendeePointsOnMap(meetingid);
  }
  var locateLCS = false;
  $.ajax({
    url :"showMeetingPointAndUserOnMap.action", 
    type :'POST',
    data :{
      userId :userid,
      locateLCS :locateLCS,
      meetingID : meetingid
    },
    dataType :'json',
    success :function(json) {  
      $('#btn_map').click();
        setTimeout(function() {
          showEventOnMap(json);
        }, 2000);
      //(subject, address, latitude, longitude, start, end, id) 
/*
    mainMarkerManager.updateMarkerSize("u" + userid);
    // meeting location - start
    var tooltipContent = parseTemplate('meetingTooltipTemplate', {
      meetingId : meetingid,
      changeMeeting : false,
      header : $.i18n.prop('meetings.meetingpoint'),
      content : '<p>' + json.meeting.location_address,
      markerId : 'm' + meetingid
    });
    
    var markerOptions = {
        id : 'm' + meetingid,
        icon : 'images/meeting_point.png',
        iconWidth : 29,
        iconHeight : 29,
        latitude : parseFloat(json.meeting.latitude),
        longitude : parseFloat(json.meeting.longitude),
        hasTooltip : true,
        staticContent : true,
        contentHtml : tooltipContent,
        forceToOpen : true
    };
    
    mainMarkerManager.createMarker(markerOptions);
    
    showUsersOnMap(json.userModel, true);
    adjustZoomLevel(map);
    
*/
    }
    
  });
}

function showFindOnMapResults(allResults){
  $("#lcRecentLcs").hide(); 
  
  if(allResults.length==1) 
  {
    var lat = allResults[0].latitude;
    var lon = allResults[0].longitude;
    
    var poiDetail = new Object();
    poiDetail.id = allResults[0].id;
    poiDetail.latitude = lat;
    poiDetail.longitude = lon;
    poiDetail.address = allResults[0].address;
    showPoiMarkerOnMap(poiDetail);
    
    /*var tooltipContent = parseTemplate('poiRecentTooltipTemplate', {
      latitude :lat,
      longitude :lon,
      address :allResults[0].address,
      name :$.i18n.prop('location.address'),
      markerId :'a' + lat + '_' + lon
    });

    var markerOptions = {
        id :'a' + lat + '_' + lon,
        icon :'images/marker_cat_vf_uncategorized.png',
        iconWidth :26,
        iconHeight :32,
        latitude :lat,
        longitude :lon,
        hasTooltip :true,
        staticContent :true,
        contentHtml :tooltipContent,
        forceToOpen :true,
        history :true
    };

    mainMarkerManager.createMarker(markerOptions);
    adjustZoomLevel(map);
    */
  }
  
  var address;
  if(fomGenericSearchObj != undefined && fomGenericSearchObj != null){     
     if(fomGenericSearchObj.address){
       address = fomGenericSearchObj.address;
     }else{
       address="";
       if(fomGenericSearchObj.street){
         address+=fomGenericSearchObj.street;
       if(fomGenericSearchObj.houseNumber){
         address+= " "+fomGenericSearchObj.houseNumber;
       }
        address+=",";
       }
       if(fomGenericSearchObj.postcode){
         address +=" "+fomGenericSearchObj.postcode;
       }
       if(fomGenericSearchObj.city){
         address +=" "+fomGenericSearchObj.city;
       }    
     }
  }else{
    address = allResults[0].address;
  }

  /*$('#tab-places-recents').hide();
  $('#tab-places-enterprise').hide();
  $('#tab-places-personal').hide();*/
 
  
  populateFindOnMapTabAfterSearch(allResults, $.i18n.prop('poiList.SearchResultFor')+" '"+address+"' "+"("+allResults.length+")");
  
  /*$('#btn_tab-places-recents').trigger("click");
  $('#idGenericPOIsearchResult').show();
  $('#idGenericPOIsearchResult').html(parseTemplate("findOnMapResultTemplate", {
    searchResult :allResults,
    searchResultHeader :$.i18n.prop('poiList.SearchResultFor')+" '"+address+"' "+"("+allResults.length+")"
  })); */ 
  
  
}


function openSaveLocationDialogForLocationReport(name, latitude, longitude, street, city, country, address) {

  
  try {
    clearPOIDialogTabs();
    $("#edit_loc_dialog").dialog( {
      modal :glbmodal,
      title :name,
      bgiframe :true,
      width :650,
      resizable :false,
      close : function(event, ui) {
        $("#edit_loc_dialog").dialog('destroy');
      }
    }).height("auto");

    $("#selectedLocationId").val("");
    $("#selectedLocationType").val(1);
    $("#edit_loc_tab4_list_item").hide();

    $("#tabs_in_edit_loc").tabs();
    $("#tabs_in_edit_loc").tabs('select', 0);

    $.post("openSaveLocationDialog.action", {
      'latitude' :latitude,
      'longitude' :longitude
    }, function(data) {
      if (checkResponseSuccess(data)) {
        $('#edit_loc_tab1').html(data);
        $("#edit_loc_dialog").dialog( "option", "position", 'center' );
        $("#updateLocationDetail input[name=poi.postcode]").val('');
        $("#updateLocationDetail input[name=poi.houseNo]").val('');
        
        if(street != null)
          $("#updateLocationDetail input[name=poi.street]").val(street);
        else
          $("#updateLocationDetail input[name=poi.street]").val('');
        if(city != null)
          $("#updateLocationDetail input[name=poi.city]").val(city);
        else
          $("#updateLocationDetail input[name=poi.city]").val('');
        if(country != null)
          $("#updateLocationDetail input[name=poi.country]").val(country);
        else
          $("#updateLocationDetail input[name=poi.country]").val('');
        if(address != null)
          $("#updateLocationDetail input[name=poi.address]").val(address);
        else
          $("#updateLocationDetail input[name=poi.address]").val('');

        $("#addLocationButton").show();
        //$("#updateLocationButton").hide();
          
      }
    });

  } catch (e) {
    alert(e.message);
  }

}


function openCloserUsersDialog(neighbourList, templateName){
  if(neighbourList){
    
    var content = '';
    if(templateName == 'closerUsersTemplate'){
      content = parseTemplate('closerUsersTemplate', {
         neighbourList :neighbourList
       });
    }else if(templateName == 'allCloserUsersTemplate'){
      var neighbourHash = {};
      for(var key in mainMarkerManager.neighbours){
        neighbourHash[key] = mainMarkerManager.neighbours[key];
      }
        
      for(var key in neighbourHash){
        var neighbourList = neighbourHash[key];
        if(neighbourList.length > 1){
          for(var x = 0; x < neighbourList.length; x++){
            var id = neighbourList[x].markerOpts.id;
            if(key != id && (neighbourHash[id] != null || neighbourHash[id] != undefined)){
              delete neighbourHash[id];
            }
          }
        }else{
          delete neighbourHash[key];
        }
      }
      
      var sizeOfHash = 0;
      for(var key in neighbourHash){
        sizeOfHash++;
      }
      
      if(sizeOfHash > 0){
        content = parseTemplate('allCloserUsersTemplate', {
           neighbours: neighbourHash,
           size: sizeOfHash
         });
      }
    }
    
    utils && utils.dialog({title:$.i18n.prop('closer.users.dialog.name'), content: content});
  }
}

function changeUserTooltip(markerId){
  
  if($("#" + markerId + "_popup").css("display") == "none") {
    mainMarkerManager.closeTooltip(markerId); // if tooltip is openede, then its display is block; do not process..
  }
}

function displayCategoryPanelLocations(){
  
  dashMap2MarkerManager.removeAllMarkers();
  dashMap2.updateSize();
  
  $.ajax( {
    url :'listCategoryPanelLocations',
    type :'POST',
    async :false,
    dataType :'json',
    success : function(json) {
      if (checkResponseSuccess(json)) {
        if(json.poiArray){
        if(json.poiArray!=null){
          for(var x = 0; x < json.poiArray.length; x++){                    
            
            var markerOptions = {
                id :"p" + json.poiArray[x].id,
                latitude :json.poiArray[x].latitude,
                longitude :json.poiArray[x].longitude,
                icon :'images/' + (json.poiArray[x].micon != null ? json.poiArray[x].micon : 'blue_circle.gif'),
                iconWidth :26,
                iconHeight :32,
                hasTooltip :true,
                staticContent :false,
                actionPath :'getLocationDetailJs.action',
                actionParams : {
                  locationIds : [ json.poiArray[x].id ],
                  type : 2
                },
                templateId :'poiTooltipTemplate'
            };
            
            
            dashMap2MarkerManager.createMarker(markerOptions);
          }
          
          if (json.poiArray.length > 0) {
            adjustZoomLevel(dashMap2);
          }
        }
      }
      }
    }
  });
}


 function listResults(allResults, responseArr, genericLocationSearchLimit){
   if(allResults != undefined && allResults != null){
     
     var resultCnt = allResults.length;
     if (genericLocationSearchLimit < resultCnt) {
       resultCnt = genericLocationSearchLimit;
     }
     for(var x = 0; x < resultCnt; x++){
       responseArr.push({label:allResults[x].address, value:allResults[x].address, type: 3, id: -1, latitude: allResults[x].latitude, longitude: allResults[x].longitude, city: allResults[x].city, country: allResults[x].country, distanceFromUser: allResults[x].distanceFromUser});
     }
   }
   
   $("#search_places").removeClass("ui-autocomplete-loading");
   return responseArr;
 }

 
 
 function prepareSearchLocationAutoCompleteOperations() {
   $("#search_places").autocomplete(
   {
     source :function(request, response) {
       if(fomGenericSearchObj != null)
         fomGenericSearchObj = null;
       
       var responseArr = [];
       $.ajax({
         url :"poiSearchAutocomplete",
         data :"q=" + request.term,
         success :function(data) {
           responseArr = $.map(data.searchList, function(item) {
             return {
               label :Encoder.htmlDecode(item.name),
               value :Encoder.htmlDecode(item.name),
               type :item.type,
               id :item.id
             };
           });
           genericSearch({address:request.term,region:regionCountryCode},true, true, function(allResults) {
                response(listResults(allResults, responseArr,locationSearchMaxLimit));
             });
             
           /*if ( leftPanel.tabPlacesSubTabs.tabs('option', 'selected') == 0 ) {
             genericSearch({address:request.term,region:regionCountryCode},true, true, function(allResults) {
                response(listResults(allResults, responseArr,locationSearchMaxLimit));
             });
           } else {
             response(listResults([], responseArr,locationSearchMaxLimit));
           }*/
         }
       });
     },
     width :260,
     minLength :1,
     select :function(event, ui) {
       this.value = unEscapeHtmlEntity(ui.item.label);
       
       if($('#tab-places-recents').is(':visible')){
         $.ajax({
          url:'saveToRecentHistory.action',
          type:'POST',
          data:{
            address : ui.item.label,
            latitude : ui.item.latitude,
            longitude : ui.item.longitude
          }
         });
   
       }
                        
       if(ui.item.type == 0){// poi
         searchWithCoordinates("list",0,ui.item.id);
       }else if(ui.item.type == 1){// poi category
         searchCategory(ui.item.id);
       }else if(ui.item.type == 2){// recent location
        if (! $('#findOnMapTabContent').is(':visible')){
          $("#lcRecentLcs").hide();
          $('#personalTabContent').hide();
          $('#enterpriseTabContent').hide();
          $('#personalTab').removeClass('selected');
          $('#enterpriseTab').removeClass('selected');
          $('#findOnMapTab').addClass('selected');
          $('#findOnMapTabContent').show();
        }
         searchRecentLocation(ui.item.id);
       }else if(ui.item.type == 3){// generic search
        var searchResults = []; 
        if (! $('#findOnMapTabContent').is(':visible')){
          $("#lcRecentLcs").hide();
          $('#personalTabContent').hide();
          $('#enterpriseTabContent').hide();
          $('#personalTab').removeClass('selected');
          $('#enterpriseTab').removeClass('selected');
          $('#findOnMapTab').addClass('selected');
          $('#findOnMapTabContent').show();
        }
        
        searchResults.push({address:ui.item.label, latitude: ui.item.latitude, longitude: ui.item.longitude, city: ui.item.city, country: ui.item.country, distanceFromUser: ui.item.distanceFromUser});
        showFindOnMapResults(searchResults);
        fomGenericSearchObj = null;
       }else if(ui.item.type == 4){// recent search
         // do nothing for now
       }
       
             
     },
     search: function(event, ui) {
       $('#tab-places .subtabsCover .searchReset').hide();
       $('#tab-places .subtabsCover .searchLoading').show();
     },
     open :function(event, ui) {
       $(this).removeClass("ui-corner-all").addClass("ui-corner-top");       
       $(".ui-autocomplete li.ui-menu-item:odd a").addClass("ui-menu-item-alternate");
       $('#tab-places .subtabsCover .searchReset').show();
       $('#tab-places .subtabsCover .searchLoading').hide();
     },
     close :function() {
       $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
     }
   });
 }
 
 function searchCategory(categoryId){
    $.ajax( {
      url :'getCategoryById.action',
      type :'POST',
      async :false,
      data : {
        categoryId :categoryId
      },
      dataType :'json',
      success : function(json) {
        if (checkResponseSuccess(json)) {
          var obj_category=json.category;
          if(obj_category[0]) {
            obj_category=json.category[0];
          }
          
          
          
          if (obj_category.type == 1) {
            /*
            $('#personalTab').addClass('selected');
            $('#findOnMapTab').removeClass('selected');
            $('#findOnMapTabContent').hide();
            $('#enterpriseTab').removeClass('selected');
            $('#enterpriseTabContent').hide();
            $('#personalTab').show();
            $('#personalTabContent').show();
            
            $('#personalCtgList').html('');
            $('#personalCtgList').html(parseTemplate("categoryListTemplate", {
              json :json
            }));*/
            populatePersonalTabAfterSearch(json,null,"category");
          } else if (obj_category.type == 0) {
            /*
            $('#enterpriseTab').addClass('selected');
            $('#findOnMapTab').removeClass('selected');
            $('#findOnMapTabContent').hide();
            $('#personalTab').removeClass('selected');
            $('#personalTabContent').hide();
            $('#enterpriseTab').show();
            $('#enterpriseTabContent').show();
            
            $('#enterpriseCtgList').html('');
            $('#enterpriseCtgList').html(parseTemplate("categoryListTemplate", {
              json :json
            }));*/
            populateEnterpriseTabAfterSearch(json,null,"category");
          }
        }
        fomGenericSearchObj = null;
      }
    });
 }
 
 
 function searchRecentLocation(id){
  $.ajax( {
    url :'getRecentLocationById.action',
    type :'POST',
    async :false,
    data : {
      id :id
    },
    dataType :'json',
    success : function(json) {
      if (checkResponseSuccess(json)) {
        var d_adress;
        var d_lat;
        var d_lon;
        if(json.locationList) {
          var obj_loc=json.locationList[0];
          d_adress=obj_loc.address;
          d_lat=obj_loc.latitude;
          d_lon=obj_loc.longitude;
        } else {
          var obj_loc=json.recentLocation;
          d_adress=obj_loc.address;
          d_lat=obj_loc.latitude;
          d_lon=obj_loc.longitude;
        }
        var searchResults = [];
        searchResults.push({address:d_adress, latitude: d_lat, longitude: d_lon, city: '', country: '', distanceFromUser: ''});
        showFindOnMapResults(searchResults);
      }
      fomGenericSearchObj = null;
    }
  });
 }
