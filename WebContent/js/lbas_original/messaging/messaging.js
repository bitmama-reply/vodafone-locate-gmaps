var composeMessageDialogManager = {};
composeMessageDialogManager.isSendMessageFromInboxPage = false;
composeMessageDialogManager.characterLength = {
  sms: 480,
  system: 480,
  messageSubject: 150
};
composeMessageDialogManager.characterLimit = composeMessageDialogManager.characterLength.system;
composeMessageDialogManager.number_errors = 0;


/*********************************************************************/
/* GLOBAL OPEN FUNCTION */
/*********************************************************************/
function openComposeMessageDialogFromInbox(messageTo, messageSubject, messageBody, action) {
	if($('.userSendMessage').length > 0){
		return false;
	}

  isSendMessageFromInboxPage = true;
  var messageToEl = $('#sendMessage #messageTo');
  messageToEl.val('').html('');

  if (typeof messageTo == 'undefined' && typeof messageSubject == 'undefined') {
    $('#messageSubject').val('');
  } else {
    var userIdName = [];
    if (messageTo.length > 0) {
      var id = '';
      var toId = '';
      var userId = '';
      var selectedMenu = $('#inboxTabContent tr[class*="inboxMenuRowSelected"]').attr('id');
      var userFromToId = $('#messageUserFromToId').html();

      if (userFromToId !== null && userFromToId !== '') {
        var userFromId = userFromToId.substring(0, userFromToId.indexOf('-'));
        var userToId = userFromToId.substring(userFromToId.indexOf('-') + 1, userFromToId.length);
        if (selectedMenu == 'SENT_menuTr') {
          userId = userToId;
        } else {
          userId = userFromId;
        }
        if (userId != '') {
          id = 'u' + userId;
        }
        if (userToId != '') {
          toId = 'u' + userToId;
        }
      }

      var val_id;
      $.each(messageTo, function(i,v) {
        i === 0 ? val_id = id : val_id = toId;
        userIdName.push({
          id: val_id,
          name: jQuery.trim(messageTo[i])
        });
      });
    }
  }

  //Reply to message e Forward message
  var dialogTitle = $.i18n.prop('messages.send.message');
  if (action == 'reply') {
    dialogTitle = $.i18n.prop('message.reply');
  } else if (action == 'forward') {
    dialogTitle = $.i18n.prop('message.forward');
  }

  var btns = {};
  utils && utils.dialog({
    title: dialogTitle,
    content: parseTemplate('userSendMessage', {}),
    buttons: btns,
    css: 'noClose userSendMessage'
  });

  // POSITION DIALOG
  var dialogWidth = $('.ui-dialog').outerWidth();
  $('.ui-dialog').css({
    top: 50,
    marginLeft: -dialogWidth/2,
    width: 500,
    left: '50%'
  });

  if (typeof userIdName == 'undefined' || userIdName.length==0) {
    composeMessageDialogManager.initSendMessageForm([''], 'resultList', -1);
  } else {
    composeMessageDialogManager.initSendMessageForm(userIdName, 'resultList', -1);
  }

  
  // fill subject and body field
  $('#messageSubject').val($.trim(messageSubject));
  $('#messageContent').val('').val($.trim(messageBody));

  // Change Subject label
  if (action == 'reply')
    $('#messageSubject').val($.i18n.prop('messages.re') + ' ' + $.trim(messageSubject));
  else if (action == 'forward')
    $('#messageSubject').val($.i18n.prop('messages.fwd') + ' ' + $.trim(messageSubject));

  $('div.ui-dialog').addClass('overflow-not-hidden');
}

/*********************************************************************/
/* OPEN FUNCTION*/
/*********************************************************************/
function openSendMessageDialog(container, item) {
  var userIdName = [];
  var checkedGroupIds = [];
  var assetErrorText = '';
  var checked = item;
  if (!item) {
    checked = utils.getChecked(container + ' .contents ul input:checked');
  }

  if (checked.hasOwnProperty('length') && checked.length > 0) {
    $.each(checked, function() {
      if ($(this).hasClass('groupId')) {
        var groupId = $(this).attr('id');
        var usercount = $(this).data('group').userSize;
        if (usercount > 0) {
          checkedGroupIds.push(groupId);
          var to = $('#' + groupId).parent().parent().find('ul li input:checked');
          var users = $.grep(to, function(u) {
            return $(u).hasClass('user');
          });
          var data = $('#' + groupId).data('group');
          if (to.length === users.length) {
            userIdName.push({
              id: 'g'+data.id,
              name: data.name
            });
          }
        }
      } else if ($(this).hasClass('user')) {
        var data = $(this).data('user.data');
        var groupId = 'g' + data.group_id;
        if ($.inArray(groupId, checkedGroupIds) === -1) {
          userIdName.push({
            id: 'u' + data.user_id,
            name: data.fullName
          });
        }
      } else {
        assetErrorText += $.trim($(this).text()) + ',';
      }
    });
  } else if (!checked.hasOwnProperty('length') && typeof checked === 'object') {
    userIdName.push({
      id: 'u'+ checked.user_id,
      name: checked.fullName || checked.fullname
    });
  }
  if (userIdName.length > 0) {
    var content = parseTemplate('userSendMessage', {});
    var btns = {};
    utils && utils.dialog({
      title : $.i18n.prop('messages.send.message'),
      content : content,
      buttons : btns,
      css: 'noClose userSendMessage'
    });

    composeMessageDialogManager.initSendMessageForm(userIdName, 'resultList', -1);
  } else {
    utils && utils.dialog({
      title: $.i18n.prop('dialog.title.error'),
      content: $.i18n.prop('dialog.errormessage.user.noselected')
    });
  }

  var dialogWidth = $('.ui-dialog').outerWidth();
  $('.ui-dialog').css({
    top: 50,
    marginLeft: -dialogWidth/2,
    width: 500,
    left: '50%'
  });

  $('.ui-dialog-titlebar').mouseover(function() {
    $('#token-input-messageTo').blur();
  });

  $('div.ui-dialog').addClass('overflow-not-hidden');
}

/*********************************************************************/
/* OPEN FUNCTION*/
/*********************************************************************/

function openSendMessageDialogFromPrivacyPage(userFullName, userID) {
  var userIdName = [];
  var userFullNameStr = '' + unescape(userFullName);
  if (userFullNameStr && userID && userID > 0) {
    userIdName.push({
      id: 'u' + userID,
      name: $.trim(userFullNameStr)
    });
  }
  var content = parseTemplate('userSendMessage', {});
  var btns = {};
  composeMessageDialogManager.getSendButtons();
  
  utils && utils.dialog({
    title: $.i18n.prop('messages.send.message'),
    content: content,
    buttons: btns,
    css : 'fromEditGroup' 
  });
  composeMessageDialogManager.initSendMessageForm(userIdName, 'resultList', -1);
}


/*********************************************************************/
/* SEND FUNCTION composeMessageDialogManager composeMessageDialogManager*/
/*********************************************************************/
composeMessageDialogManager.initSendMessageForm = function(prepopulateingList, jsonContainerProperty, maxChars) {

  registerValidations('sendMessage');
  
  $('#sendMessage #messageTo').tokenInput('userSearchTokenAutocomplete.action', {
    type : 'POST',
    noResultsText : $.i18n.prop('no.results.text'),
    prePopulate : prepopulateingList,
    //prePopulate : pList,
    jsonContainer: jsonContainerProperty || 'resultList',
    //jsonContainer: jCProp || 'resultList',
    classes: {
      tokenList: 'token-input-list-facebook',
      token: 'token-input-token-facebook',
      tokenDelete: 'token-input-delete-token-facebook',
      selectedToken: 'token-input-selected-token-facebook',
      highlightedToken: 'token-input-highlighted-token-facebook',
      dropdown: 'token-input-dropdown-facebook',
      dropdownItem: 'token-input-dropdown-item-facebook',
      selectedDropdownItem: 'token-input-selected-dropdown-item-facebook',
      inputToken: 'token-input-input-token-facebook'
    }
  });

  if (prepopulateingList[0].length === 0) {
    $('#sendMessage #messageTo').tokenInput('clear');
  }

  $('button.send').bind('click', function() {
    if (lbasValidate('sendMessage')) {
      messagesent = composeMessageDialogManager.sendMessageToUsers('sendMessage');
    }
    return;
  })
  .mousedown(function(e) {
    e.preventDefault();
    $(this).addClass('purple_button_active');
  })
  .mouseup(function() {
    $(this).removeClass('purple_button_active');
  })
  .mouseenter(function() {
    $(this).addClass('purple_button_over');
  })
  .mouseleave(function() {
    $(this).removeClass('purple_button_over');
  });

  $('.text-area-m').bind('keyup', composeMessageDialogManager.countLeftChars);
  $('.cancel').bind('click', function() {
    $('.subject-m input').val('');
    $('.text-area-m').val('');
    composeMessageDialogManager.countLeftChars();
  })
  .mousedown(function(e) {
    e.preventDefault();
    $(this).addClass('cancelActive');
  })
  .mouseup(function() {
    $(this).removeClass('cancelActive');
  })
  .mouseenter(function() {
    $(this).addClass('cancelOver');
  })
  .mouseleave(function() {
    $(this).removeClass('cancelOver');
  });

  $('a.alert-charts').bind('mouseenter', function() {
    var tp = parseInt($('a.alert-charts').offset().top, 10) - 70;
    $('div.tooltip-icon-limit-message').css({
      display: 'block',
      top: tp
    });
  });

  $('a.alert-charts').bind('mouseleave', function() {
    $('div.tooltip-icon-limit-message').css({display: 'none'});
  });
  composeMessageDialogManager.sendSMSClicked($('#isSmsSend'), $('#messageContent'));
  composeMessageDialogManager.countLeftChars();
};

composeMessageDialogManager.sendMessageToUsers = function(formid) {
  var toUsers = $('#sendMessage #messageTo').val().replace('"', '');
  toUsers = toUsers.replace(/,/g, ';');
  composeMessageDialogManager.populateDefaultField();

  $('#selectedUserAndGroups').val(toUsers);
  var serializedFormData = $('#' + formid).serialize();

  var options = {};
  options.data = serializedFormData;
  options.success = function(ajaxCevap) {
    if (checkResponseSuccess(ajaxCevap)) {
      var btns = {};
      btns[$.i18n.prop('dialog.ok')] = function() {
        if (isSendMessageFromInboxPage) {
          loadInbox(messageBoxTypeName);
          isSendMessageFromInboxPage = false;
        }
        $(this).dialog('close').remove();
      };
      if($('.fromEditGroup').length === 1){
	      $('.fromEditGroup').remove();
      }else{
	      utils.closeDialog('#sendMessage');
      }
      
      utils && utils.dialog({
        content: '<div class="successMessageCheck">' + $.i18n.prop('message.sent') + '</div>',
        css: 'noCloseNoOk',
        modal: false
      });
      $('.noCloseNoOk').hide().fadeIn('slow');
      composeMessageDialogManager.timeMsg(); // fadeout for success message
    }
  };
  utils && utils.lbasDoPost('sendMessage', options);
};

function timeMsg() {
  setTimeout(alertMsg, 2000);
}
function alertMsg() {
  $('.noCloseNoOk').fadeOut(2000, function() {
    $('.noCloseNoOk .ui-dialog-buttonset button').click();
  });
}

composeMessageDialogManager.timeMsg = function () {
  setTimeout(composeMessageDialogManager.alertMsg, 2000);
};

composeMessageDialogManager.alertMsg = function() {
  $('.noCloseNoOk').fadeOut('slow', function() {
    $('.noCloseNoOk .ui-dialog-buttonset button').click();
  });
};

composeMessageDialogManager.sendSMSClicked = function(checkbox, textbox) {
  composeMessageDialogManager.characterLimit = (checkbox.attr('checked')) ? composeMessageDialogManager.characterLength.sms : composeMessageDialogManager.characterLength.system;
  composeMessageDialogManager.countLeftChars();
};

composeMessageDialogManager.getSendButtons = function() {
  var btns = {};
  btns[$.i18n.prop('buttons.cancel')] = function() {
    $(this).dialog('close');
    $(this).dialog('destroy');
  };

  btns[$.i18n.prop('messages.send')] = function() {
    if (lbasValidate('sendMessage')) {
      composeMessageDialogManager.sendMessageToUsers('sendMessage');
    }
  };
  return btns;
};

composeMessageDialogManager.countLeftChars = function() {
  var cl = composeMessageDialogManager.characterLimit;

  $('.wrapper-counter-message').show();
  var charactersUsed = $('.text-area-m').val().length;
  var counterEl = $('.counter-m');
  counterEl.text(charactersUsed);
  counterEl.next('span').text(' / ' + cl);
  if (charactersUsed > cl) {
    counterEl.css({color: 'red'});
    $('a.alert-charts').show();
  }
  else {
    counterEl.css({color: 'black'});
    $('a.alert-charts').hide();
  }
};

composeMessageDialogManager.populateDefaultField = function() {
    var messageSubject = $('#messageSubject');
    var messageContent = $('#messageContent');
    if (messageSubject.val().length === 0) {
      messageSubject.val($.i18n.prop('messages.noSubject'));
    }

    if (messageContent.val().length === 0) {
      messageContent.val($.i18n.prop('messages.noBody'));
    }
};

composeMessageDialogManager.resetDefaultField = function() {
  var messageSubject = $('#messageSubject');
  var messageContent = $('#messageContent');

  if (messageSubject.val() == $.i18n.prop('messages.noSubject')) {
    messageSubject.val('');
  }

  if (messageContent.val() == $.i18n.prop('messages.noBody')) {
    messageContent.val('');
  }
};

composeMessageDialogManager.showErrorCallback = function(serverErrors) {
  var el = composeMessageDialogManager.validator.parseServerErrors(serverErrors);
  $('#send-list-wrapper', '#sendMessage').empty().append(el);
  $('#error-view-sendmessage', '#sendMessage').show();
};

composeMessageDialogManager.init = function() {
  composeMessageDialogManager.validator = new Validator({
    selectedUserAndGroups: {
      domElement: function(type) {
        if (type == 'focus') {
          return $('#token-input-messageTo');
        }
        else {
          return $('#sendMessage #messageTo').parent().find('ul');
        }
      },
      tooltip: '.tooltip-alert-messageTo',
      validate: function() {
        var toUsers = $('#sendMessage #messageTo').val().replace('"', '');
        toUsers = toUsers.replace(/,/g, ';');

        return (toUsers.length > 0);
      }
    },
    messageContent: {
      domElement: '#messageContent',
      validate: DEFAULT_VALIDATIONS.limit({ max: 480, min: 0}),
      defaultMessage: $.i18n.prop('messages.noBody')
    },
    messageSubject: {
      domElement: '#messageSubject',
      defaultMessage: $.i18n.prop('messages.noSubject')
    }
  });
};

$(function(){
  composeMessageDialogManager.init();
});