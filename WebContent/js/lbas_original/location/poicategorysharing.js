var selectedItem;
var selectedItem2;
var selectedItemType;

function getCategorySharing() {
	if ($('#tab-2').html().trim().length == 0) {
		getCategorySharingPage();
	}
}



function getCategorySharingPage() {
	$.post('json/getUsersForNewCategoryShare.action', {
		categoryId :$('#categoryDetailForm input[name=categoryId]').val()
	}, function(data) {
		if (checkResponseSuccess(data))
		{
			//$('#tab-2').html(data);
			var dt = data;
			$('#tab-2').load('pages/template/saveCategoryDialogTemplate_tab1.html?' + Math.floor(Math.random()*82342), function(){
				data.userMap=[];
				$.each(dt.usersByGroups, function(j, h)
				{
					
					// Left
				    var $divc = $('<div id="leftGroup' + h.groupId +'" class="group wp-sharing-group accordionStyles"></div>');
				    var groupName = '<span class="groupName" id="groupName_' + h.groupId + '" onclick="selectGroupCategorySharing(' + h.groupId + ')">' + h.groupName + '</span> <span class="groupUsercount"><span class="all_total_count">' + h.userCount + '</span></span>';
				    var $label = $('<span id="' + h.groupId + '" class="groupNameContainerCat" />').html(groupName);
				      /*
				      .click(function(){
				      	  var id = $(this).attr('id');
					      selectGroupCategorySharing(id);
				      });*/
				    
				    var $openclose = $('<span id="userG_details_' + h.groupId + '" class="openCloseCatx"><img src="images/arrow_right.png" class="openCloseCat"/></span>')
                	.click(function(){
                		var id = $(this).attr('id').substring('userG_details_'.length);
                		var container = $('#userG_'+id);
                    if(container.is(':visible')){
                        $(this).find('img').attr('src', 'images/arrow_right.png');
                        container.hide();
                    }else{
                        $(this).find('img').attr('src', 'images/arrow_down.png');
                        container.show();
                    }
                    });
                    
					var $ulN = $('<ul id="userG_' + h.groupId + '" style="display:none;" class="group-shared-list"></ul>');
					$.each(h.users, function(x, usr)
					{	
					  data.userMap.push({id:usr.id, name:Encoder.htmlDecode(usr.name), group:h.groupId, userCount:h.userCount });
				    var $span1 = $('<span id="item_name_' + usr.id + '"></span>').text('      ' + Encoder.htmlDecode(usr.name) || ' ');
				    var $liN = $('<li id="leftUser' + usr.id + '" grpId="' + h.groupId + '"></li>')
				    .html($span1)
				    .click(function(){
				    	var id = $(this).attr('id').substring('leftUser'.length);
				    	var grpId = $(this).attr('grpId');
					   selectUser(id, grpId,$(this).parent()); 
				    });
				    $ulN.append($liN);
					});
					$ulN.hide();
					$label.append($ulN);
					$divc.append($openclose);
					$divc.append($label);
					$('#navigationCatShareLeft').append($divc);
					
					// Right
					var $divc = $('<div id="rightGroup' + h.groupId +'" class="group wp-sharing-group accordionStyles" style="display:none;"></div>');
				  var groupName = '<span class="groupName" id="RgroupName_' + h.groupId + '" onclick="selectGroupCategorySharingRight(' + h.groupId + ')">' + h.groupName + '</span> <span class="groupUsercount"><span class="all_total_count">' + h.userCount + '</span></span>';
				  var $label = $('<span id="' + h.groupId + '" class="groupNameContainerCat" />').html(groupName);
				      /*
				      .click(function(){
				      	  var id = $(this).attr('id');
					      selectGroupCategorySharing(id);
				      });
				      */
				    
				    var $openclose = $('<span id="RuserG_details_' + h.groupId + '" class="openCloseCatx"><img src="images/arrow_right.png" class="openCloseCat"/></span>')
              	.click(function(){
              		var id = $(this).attr('id').substring('RuserG_details_'.length);
              		var container = $('#RuserG_'+id);
                      if(container.is(':visible')){
	                      $(this).find('img').attr('src', 'images/arrow_right.png');
                          container.hide();
                      }else{
                        $(this).find('img').attr('src', 'images/arrow_down.png');
                          container.show();
                      }
                  });

					var $ulN = $('<ul id="RuserG_' + h.groupId + '" style="display:none;background-color: white;" class="group-shared-list"></ul>');
					$.each(h.users, function(x, usr)
					{	
					    var $span1 = $('<span id="item_name_' + usr.id + '"></span>').text('      ' + Encoder.htmlDecode(usr.name) || ' ');
					    var $liN = $('<li id="rightUser' + usr.id + '" grpId="' + h.groupId + '" style="display:none;"></li>')
					    .html($span1)
					    .click(function(){
					    	var id = $(this).attr('id').substring('rightUser'.length);
					    	var grpId = $(this).attr('grpId');
						   selectUser(id, grpId,$(this).parent()); 
					    });
					    $ulN.append($liN);
					});
					$ulN.hide();
					$label.append($ulN);
					$divc.append($openclose);
					$divc.append($label);
					$('#navigationCatShareRight').append($divc);
					/* AUTO SEARCH */
					
					 $("#updateCategorySharing #groupMemberUserSearch").autocomplete({
			          minLength: 0,
			          autofocus: true,
			          source: function(request, response){
			            var $sel=$("#navigationCatShareLeft");
			            $sel.find("li").removeClass("selectedUser");
			            var term=request.term.toLowerCase();
			            $.each(data.userMap, function(i, obj){
			              var $e = $sel.find("#userG_"+obj.group+" #leftUser"+obj.id);
			              if(obj.name.toLowerCase().indexOf(term)===-1) {
			                 $e.hide();
			              } else {
			                if(!$e.hasClass("moved")) {
			                  $e.show();
			                  autoOpen($e);
			                }
			              }
			            });
			            
			            updateCount();
			          }
			        });
			        $("#updateCategorySharing #groupMemberUserSearch2").autocomplete({
				        minLength: 0,
				        autofocus: true,
				        source: function(request, response){
					        var $sel=$("#navigationCatShareRight");
					        $sel.find("li").removeClass("selectedUser");
					        var term=request.term.toLowerCase();
				            $.each(data.userMap, function(i, obj){
					            var $e = $sel.find("#RuserG_"+obj.group+" #rightUser"+obj.id);
					            if(obj.name.toLowerCase().indexOf(term)===-1) {
						            $e.hide();
						        } else {
							        if($e.hasClass("moved")) {
                       $e.show();
                       autoOpen($e);
                      }
							    }
				            });
				            updateCount();
				        }
			       });
				});
			});		
		}
	});
}

function autoOpen($e) {
  var grouplist= $e.parents('.group-shared-list');
  if (!grouplist.is(':visible')) {
    grouplist.parent().siblings('.openCloseCatx').trigger("click");
  }
  
}



function updateCount(groupId) {
  var filterfunction=function() { return ($(this).css('display') != 'none');};
  $("#navigationCatShareLeft").find('ul.group-shared-list').each(function() {
    $(this).siblings('span.groupUsercount').children('span.all_total_count').html($(this).find('> li').filter(filterfunction).length );
  });
  $("#navigationCatShareRight").find('ul.group-shared-list').each(function() {
    $(this).siblings('span.groupUsercount').children('span.all_total_count').html($(this).find('> li').filter(filterfunction).length );
  });
}

function unsectAllUsers() {
  selectedItemType = null;
  selectedItem = null;
  selectedItem2 = null;
  $('#updateCategorySharing li').removeClass('selectedUser');
  $(".accliselected").each( function() {
    $(this).removeClass("accliselected");
  });
  $('.selectedUser').each( function(){
    $(this).removeClass("selectedUser");
  });
}

function selectGroupCategorySharing(groupId) {
  unsectAllUsers();
	selectedItem = groupId;
	selectedItemType = 'G';
	$('#userG_'+selectedItem+ ' li').addClass('selectedUser');
	autoOpen($('#userG_'+selectedItem+ ' li').eq(0));
}
function selectGroupCategorySharingRight(groupId) {
  unsectAllUsers();
	selectedItem = groupId;
	selectedItemType = 'G';
	$('#RuserG_'+selectedItem+ ' li').addClass('selectedUser');
	$('#RuserG_'+selectedItem).show();
	autoOpen($('#RuserG_'+selectedItem+ ' li').eq(0));
}

function selectUser(userId, groupId, obj) {
  unsectAllUsers();
	selectedItem = userId;
	selectedItem2 = groupId;
	selectedItemType = 'U';

	$(obj).addClass("accliselected");
	$('#item_name_'+selectedItem).parent().addClass('selectedUser');
	if(!$('#item_name_'+selectedItem).parent().is(':visible')){
		$('#rightUser'+selectedItem).addClass('selectedUser');
	}
	// accliselected
	// $(obj).css({ "backgroundColor: #E8ECF7"});
}

function checkSharingGroupEmpty(groupId) {
  var groupli=$("#"+groupId);
	var groupUsers = groupli.find("li");
	var userCount = 0;
	groupUsers.each(function () {
	   if (!$(this).hasClass("moved")) {
       userCount++;
     }
	});
	if(groupId.indexOf('right') != -1) {
	  if (userCount == groupUsers.length) return true;
	} else {
	   if (userCount == 0) return true;
	}
	return false;
}

function leftGroupClicked(groupId) {
	// alert("leftGroupClicked")
	$('#rightGroup'+ groupId).show();
	var counter=0;
	$('#leftGroup'+ groupId).find('li').each(function() {
	  if($(this).css('display') != 'none') {
	    $(this).hide().addClass("moved");
	    var ref=$('#rightUser'+$(this).attr('id').substring(8)).addClass("moved").show();
	  }
	  if (counter == 0) autoOpen(ref);
	  counter++;
	});
  if (checkSharingGroupEmpty("leftGroup" + groupId)) $("#leftGroup" + groupId).hide();
  updateCount();
}

function rightGroupClicked(groupId) {
  $('#leftGroup'+ groupId).show();
  $('#rightGroup'+ groupId).find('li').each(function() {
    if($(this).css('display') != 'none') {
      $(this).hide().removeClass("moved");
      $('#leftUser'+$(this).attr('id').substring(9)).removeClass("moved").show();
    }
  });
  if (checkSharingGroupEmpty("rightGroup" + groupId)) $("#rightGroup" + groupId).hide();
  updateCount();
}

function leftUserClicked(userId, groupId)
{
	var temp = "rightUser" + userId;
	var groupli=$("#rightGroup" + groupId);
	if (!groupli.is(":visible") ) {
		groupli.show();
		var arr = groupli.find("li");
		arr.each(function() {
		  if($(this).attr("id")=== temp) 
		    $(this).show();
		  else 
		    $(this).hide();
		});
	} else {
  	$("#rightUser" + userId).addClass("moved").show();
	}
	$("#rightUser" + userId).addClass("moved").show();
	$("#leftUser" + userId).addClass("moved").hide();
	
  if (!groupli.find('.group-shared-list').is(':visible')) {
	  groupli.find('.openCloseCatx').trigger("click");
	}
  if (checkSharingGroupEmpty("leftGroup" + groupId)) $("#leftGroup" + groupId).hide();
	updateCount(groupId);
}

function rightUserClicked(userId, groupId) {
  var temp = "leftUser" + userId;
  var groupli=$("#leftGroup" + groupId);
  if (!groupli.is(":visible") ) {
    groupli.show();
    var arr = groupli.find("li");
    arr.each(function() {
      if($(this).attr("id")=== temp) 
        $(this).show();
      else 
        $(this).hide();
    });
  } else {
    $("#leftUser" + userId).removeClass("moved").show();
  }
  
  $("#leftUser" + userId).removeClass("moved").show();
  $("#rightUser" + userId).removeClass("moved").hide();
  if (checkSharingGroupEmpty("rightGroup" + groupId)) $("#rightGroup" + groupId).hide();
  updateCount(groupId);
}

function toRight() {
  if(selectedItemType == 'G') {
    leftGroupClicked(selectedItem);
  } else if(selectedItemType == 'U') {
    leftUserClicked(selectedItem, selectedItem2);
  }
  unsectAllUsers();
}

function toLeft() {
  if(selectedItemType == 'G') {
    rightGroupClicked(selectedItem);
  } else if(selectedItemType == 'U') {
    rightUserClicked(selectedItem, selectedItem2);
  }
  unsectAllUsers();
}
