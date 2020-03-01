"use strict";

/*
 * Sir Trevor Editor Store
 * By default we store the complete data on the instances $el
 * We can easily extend this and store it on some server or something
 */

import { isUndefined } from 'lodash';
import utils from '../utils';

export default class EditorStore {
  constructor(data, mediator) {
    this.mediator = mediator;
    this.initialize(data ? data.trim() : '');
  }

  initialize(data) {
    this.store = this._parseData(data) || { data: [] };
  }

  retrieve() {
    return this.store;
  }

  toString(space) {
    return JSON.stringify(this.store, undefined, space);
  }

  reset() {
    utils.log("Resetting the EditorStore");
    this.store = { data: [] };
  }

  addData(data) {
    this.store.data.push(data);
    return this.store;
  }

  _parseData(data) {
    let result;

    if (data.length === 0) { return result; }

    try {
      // Ensure the JSON string has a data element that's an array
      const jsonStr = JSON.parse(data);
      if (!isUndefined(jsonStr.data)) {
        result = jsonStr;
      }
    } catch(e) {
      this.mediator.trigger(
        'errors:add',
        { text: i18n.t("errors:load_fail") });

      this.mediator.trigger('errors:render');

      console.log('Sorry there has been a problem with parsing the JSON');
      console.log(e);
    }

    return result;
  }
}
