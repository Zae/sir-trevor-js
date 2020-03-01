"use strict";

/*
*   Sir Trevor Uploader
*   Generic Upload implementation that can be extended for blocks
*/

import { isUndefined, isFunction } from 'lodash';
import $ from 'jquery';
import config from '../config';
import utils from '../utils';

import EventBus from '../event-bus';

export default function (block, file, success, error) {

  EventBus.trigger('onUploadStart');

  const uid = [block.blockID, (new Date()).getTime(), 'raw'].join('-');
  const data = new FormData();

  data.append('attachment[name]', file.name);
  data.append('attachment[file]', file);
  data.append('attachment[uid]', uid);

  block.resetMessages();

  const callbackSuccess = function (data) {
    utils.log('Upload callback called');
    EventBus.trigger('onUploadStop');

    if (!isUndefined(success) && isFunction(success)) {
      success.apply(block, arguments);
    }
  };

  const callbackError = function (jqXHR, status, errorThrown) {
    utils.log('Upload callback error called');
    EventBus.trigger('onUploadStop');

    if (!isUndefined(error) && isFunction(error)) {
      error.call(block, status);
    }
  };

  const xhr = $.ajax({
    url: config.defaults.uploadUrl,
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    dataType: 'json',
    type: 'POST'
  });

  block.addQueuedItem(uid, xhr);

  xhr.done(callbackSuccess)
    .fail(callbackError)
    .always(block.removeQueuedItem.bind(block, uid));

  return xhr;
}
