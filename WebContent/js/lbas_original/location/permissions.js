var permissionsObj;
var type;

function initializePermissions() {
}

function clickUser(typeOfVal, checkboxObj, userId) {
  type = typeOfVal;
  if (checkboxObj.checked) {
    checkUser(userId);
  } else {
    /*unCheckUser(userId);*/
    updateCheckUser(userId);
  }
}

function clickGroup(groupCheck, groupId, type) {
  /* creatingNewCategoryGetPermissions (groupId); */
  var chk = groupCheck.checked;
  //var usersOfGroup = $("#" + type + "PermGroup" + groupId + " ul input:checkbox");
  var usersOfGroup = $("#" + type + "PermGroup" + groupId + " > ul > li > ul > li input:checkbox");
  for (var i = 0; i < usersOfGroup.length; i++) {
    var $ref=$(usersOfGroup[i]);
    if(chk) $ref.attr('checked', 'checked')
    else $ref.removeAttr('checked');
    $ref.trigger("change");
    //$ref.trigger("change");
    //userchk.checked = chk;
    
    
    /*if (chk) {
      usersOfGroup[i].checked = true;
    } else {
      usersOfGroup[i].checked = false;
    }*/
    //usersOfGroup[i].click();
  }

/*
  if ( $.browser.msie ) {
      groupCheck.checked = false;
  }
*/
  groupCheck.checked = chk;
  
  
}

function Permissions() {

}

function checkUser(userId) 
{
  //var andAllUsersPerms =[]; //new Array(1, 1, 1, 1, 1, 1, 1);
  //var orAllUsersPerms =[]; //new Array(0, 0, 0, 0, 0, 0, 0);
  var userPermissions;
  var x;
  if (permissionsObj[userId] == undefined) {
    userPermissions = getPermissionsFromServer(userId);
    permissionsObj[userId] = userPermissions;
  } else {
    userPermissions = permissionsObj[userId];
  }
  permissionsObj[userId].userId=userId;
  var checkCount = 0;
  var selectedOne;
  updateCheckUser();
  $("#" + type + "PermissionChk").css("opacity", 1);
/*
  $.each(permissionsObj, function(ind ,val){
    
    if ($("#" + type + "CheckUser" + ind).attr("checked")) {
      checkCount++;
      selectedOne = ind;
      $.each(val, function(i,v){
        if (i != 'userId'){
          if (v == false){
            v = 0;
          }else{
            v = 1;
          }
          andAllUsersPerms.push(v);
          orAllUsersPerms.push(v)       
        }
      });
    }

  });
  */

/*
  for (x in permissionsObj) {
    if ($("#" + type + "CheckUser" + x).attr("checked")) {
      checkCount++;
      selectedOne = x;
      for ( var i = 0; i < andAllUsersPerms.length; i++) {
        andAllUsersPerms[i] = (andAllUsersPerms[i] && parseInt(permissionsObj[x].charAt(i)));
        orAllUsersPerms[i] = (orAllUsersPerms[i] || parseInt(permissionsObj[x].charAt(i)));
      }
    }
  }
*/
  
  //setPermissionsStyle(type, checkCount);
  //loadPermissionCheckboxes(andAllUsersPerms, orAllUsersPerms);
  
}

function updateCheckUser(userId) {
  var andAllUsersPerms = new Array(1, 1, 1, 1, 1, 1, 1);
  var orAllUsersPerms = new Array(0, 0, 0, 0, 0, 0, 0);
  var orderProperties;
   
  if(type=="loc") {
    /*orderProperties = new Array('changeCategory','delete', 'editDetails', 'editPermission', 'rate', 'share', 'view');*/
    orderProperties = new Array('view', 'rate','editPermission', 'editDetails', 'delete',  'share', 'changeCategory');
  } else if (type=="cat") {
    orderProperties = new Array('addPOI','delete', 'deletePOI', 'edit', 'editPermission', 'sharePOI', 'view');
  }
  
  //var userPermissions = permissionsObj[userId];
  var noneSelected = true;
  var checkCount = 0;
  var selectedOne;
  var tot_property=orderProperties.length;
  
  for (x in permissionsObj) {
    if ($("#" + type + "CheckUser" + x).attr("checked")) {
      checkCount++;
      selectedOne = x;
      for ( var i = 0; i < andAllUsersPerms.length; i++) {
        var pos_property=i % tot_property;
        //andAllUsersPerms[i] = (andAllUsersPerms[i] && parseInt(permissionsObj[x].charAt(i)));
        //orAllUsersPerms[i] = (orAllUsersPerms[i] || parseInt(permissionsObj[x].charAt(i)));
        var p_value=(permissionsObj[x][orderProperties[pos_property]]) ? 1:0;
        andAllUsersPerms[i] = (andAllUsersPerms[i] && p_value);
        orAllUsersPerms[i] = (orAllUsersPerms[i] || p_value);
      }
      noneSelected = false;
    }
  }
  setPermissionsStyle(type, checkCount);
  if (noneSelected)  andAllUsersPerms = new Array(0, 0, 0, 0, 0, 0, 0);
  loadPermissionCheckboxes(andAllUsersPerms, orAllUsersPerms);
}

function loadPermissionCheckboxes(andAllUsersPerms, orAllUsersPerms) {  
  var permCheckBoxes = $("#" + type + "PermissionChk img ");
  for ( var i = 0; i < permCheckBoxes.length; i++) {
    if (andAllUsersPerms[i] == 1) { // make it checked
      permCheckBoxes[i].src = contextPath + "/images/ch_chd_a.png";
    } else {
      if (orAllUsersPerms[i] == 1) {// make it semichecked
        permCheckBoxes[i].src = contextPath + "/images/ch_chd_g.png";
      } else {// make it unchecked
        permCheckBoxes[i].src = contextPath + "/images/ch_un_g.png";
      }
    }
  }
}


function changePermissions(permissionCheck, permissionId, keyId) 
{
  var checkedUsers = $("#" + type + "PermissionUsers input[id*='CheckUser']:checked");
  var imgSrcStr = '';
  var thereisundefined = false;
  
  if(permissionCheck instanceof jQuery) {
    imgSrcStr = permissionCheck.attr('src');
    thereisundefined=true;
  } else {
    if (permissionCheck.src == undefined) {
      imgSrcStr = $('#' + permissionCheck.id).attr('src');
      thereisundefined = true;
    } else {
      imgSrcStr = permissionCheck.src;
    }
  }
  //imgSrcStr = $('#' + permissionCheck.id).attr('src');
  if(imgSrcStr==undefined) imgSrcStr='';
  if (imgSrcStr.indexOf("ch_un_g.png") > 0 || imgSrcStr.indexOf("ch_chd_g.png") > 0) { 
    /***************************************/
    // unchecked or semichecked
    /***************************************/
    if (thereisundefined) {
      imgSrcStr = contextPath + "/images/ch_chd_a.png";
      permissionCheck.attr('src', imgSrcStr);
    } else {
      permissionCheck.src = contextPath + "/images/ch_chd_a.png";
    }
  var i = 0;
    for (i = 0; i < checkedUsers.length; i++) {
      var userId = checkedUsers[i].id;
      userId = userId.replace(type + "CheckUser", "");
      
      //permissionsObj[userId] = permissionsObj[userId].setCharAt(permissionId, "1");
      if (keyId) permissionsObj[userId][keyId]=true;
      
      /* COMMENTED FORCE */
      /*
      if (keyId == 'view' || keyId == 'deletePOI') {
        var simg;
        // check LBAS-1243
        if (permissionsObj[userId]['edit'] == false) {
          simg = $("#changePermissions3");
          changePermissions(simg, 3,'edit');
        }
      }*/
      
      
      
      
      /*
      if (permissionId == 6 || permissionId == 2) {
        var simg;
        // check LBAS-1243
        if (permissionsObj[userId].charAt(3) == "0") {
          simg = $("#changePermissions_this_3");
          changePermissions(simg, 3);
        }
      }*/

    }



    /*
var i = 0;
    for (i = 0; i < checkedUsers.length; i++) {
      var userId = checkedUsers[i].id;
      userId = userId.replace(type + "CheckUser", "");
      permissionsObj[userId] = permissionsObj[userId].setCharAt(permissionId, "1");

      if (permissionId == 6 || permissionId == 2) {
        var simg;
        // check LBAS-1243
        if (permissionsObj[userId].charAt(3) == "0") {
          simg = $("#changePermissions_this_3");
          changePermissions(simg, 3);
        }
      }

    }
*/
  } else if (imgSrcStr.indexOf("ch_chd_a.png") > 0) {
    /***************************************/
    // checked checked checked 
    /***************************************/
    if (thereisundefined) {
      imgSrcStr = contextPath + "/images/ch_un_g.png";
      permissionCheck.attr('src', imgSrcStr);
    } else {
      permissionCheck.src = contextPath + "/images/ch_un_g.png";
    }

    for ( var i = 0; i < checkedUsers.length; i++) {
      var userId = checkedUsers[i].id;
      userId = userId.replace(type + "CheckUser", "");
      //permissionsObj[userId] = permissionsObj[userId].setCharAt(permissionId, "0");
      if (keyId) permissionsObj[userId][keyId]=false;
      if (keyId == 'edit') {
        var simg;
        // uncheck LBAS-1243
        /* UNCHECK THE FORCED ACTION */
        /*
        if (permissionsObj[userId]['deletePOI'] == true) {
          simg = $("#changePermissions2");
          changePermissions(simg, 2,'deletePOI');
        }
        if (permissionsObj[userId]['view'] == true) {
          simg = $("#changePermissions6");
          changePermissions(simg, 6,'view');
        }
        */
      }
     


      /*if (permissionId == 3) {
        var simg;
        // uncheck LBAS-1243
        if (permissionsObj[userId].charAt(2) == "1") {
          simg = $("#changePermissions_this_2");
          changePermissions(simg, 2);
        }
        if (permissionsObj[userId].charAt(6) == "1") {
          simg = $("#changePermissions_this_6");
          changePermissions(simg, 6);
        }
      }*/
    }
  }
}
function getPermissionsFromServer(userId) {
  var result;
  var url;
  var getFromServer = true; // if new poi or category, we set this false.
  var catID;
  if (type == 'cat') {
    url = 'getUserPermissionsOfPoiCategory.action';
    if ($('#categoryDetailForm input[name=categoryId]').val() == '0') {
      getFromServer = false;
    }
  } else if (type == 'loc') {
    getFromServer = false;/*enis*/
    //url = 'getLocPermission.action';
    url = 'getUserPermissionsOfPoi.action';   
    if ($('#updateLocationDetail_poi_id').val() == '0') {
      getFromServer = false;
    }
  }
  
  if($('.openDetailsPlaces').length === 1){
    getFromServer = false
  }
  
  if (getFromServer == false) {
    var el;
    if($('.openDetailsPlaces').length === 1){
      el = $("#locCheckUser"+userId);
    }else{
      el = $("#catCheckUser"+userId);  
    }
    catID = el.parent().parent().parent().parent().attr('id').substring(6);  
  } else {
    catID = $("#catCheckUser"+userId).attr("data-cat");
  }

  
  $.ajax({
    type :'GET',
    url :url,
    async :false,
    data :{
      userId :userId,
      poiId : $("#updateLocationDetail input[name='poi.id']").val(),
      categoryId :catID
      /*categoryId :catID//$('#categoryDetailForm input[name=categoryId]').val() */
      /*categoryId:$("#catCheckUser"+userId).parent().parent().parent().parent().attr('id').substring(6)*/
    },
    dataType :'json',
    success :function(json) {
      if (json.errorText == null)
        result = json;
    }
  });

  return result;
}

function updatePermissions() {
  var permList = [];
  jQuery.each(permissionsObj, function(i, val) {
    var perm = i + ":" + val;
    permList.push(perm);
  });
  if (type == 'cat') {
    $.post('updateCatPermission.action', {
      permList :permList
    });
  } else if (type == 'loc') {
    $.post('updateLocPermission.action', {
      permList :permList
    });
  }
  $('span.ui-icon-closethick:last').click();
}

function setPermissionsStyle(type, checkCount) { 
  if (checkCount == 0) {
    $("#" + type + "PermissionChk").css("opacity","0.5");
  } else {
    $("#" + type + "PermissionChk").css("opacity", "1");
  }
}

function creatingNewCategoryGetPermissions (groupId){
  var userId =$('#userG_'+groupId+' .container input').attr('value');
  $.ajax({
    type :'GET',
    url :'getUserPermissionsOfPoiCategory.action',
    async :false,
    data :{
      userId :userId,
      categoryId :groupId
    },
    dataType :'json',
    success :function(json) {
    }
  });

}