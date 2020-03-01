"use strict";

import _, { uniqueId, isUndefined } from 'lodash';
import $ from 'jquery';
import Ajaxable from './ajaxable';

export default {

  mixinName: "Fetchable",

  initializeFetchable(){
    this.withMixin(Ajaxable);
  },

  fetch(options, success, failure){
    const uid = uniqueId(this.blockID + "_fetch"),
        xhr = $.ajax(options);

    this.resetMessages();
    this.addQueuedItem(uid, xhr);

    if(!isUndefined(success)) {
      xhr.done(success.bind(this));
    }

    if(!isUndefined(failure)) {
      xhr.fail(failure.bind(this));
    }

    xhr.always(this.removeQueuedItem.bind(this, uid));

    return xhr;
  }

};
