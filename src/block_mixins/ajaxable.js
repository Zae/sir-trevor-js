"use strict";

import utils from '../utils';

export default {

  mixinName: "Ajaxable",
  ajaxable: true,

  initializeAjaxable() {
    this._queued = [];
  },

  addQueuedItem(name, deferred) {
    utils.log("Adding queued item for " + this.blockID + " called " + name);

    this._queued.push({name: name, deferred: deferred});
  },

  removeQueuedItem(name) {
    utils.log("Removing queued item for " + this.blockID + " called " + name);

    this._queued = this._queued.filter(function (queued) {
      return queued.name !== name;
    });
  },

  hasItemsInQueue() {
    return this._queued.length > 0;
  },

  resolveAllInQueue() {
    this._queued.forEach(function (item) {
      utils.log("Aborting queued request: " + item.name);
      item.deferred.abort();
    }, this);
  }

};
