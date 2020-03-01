"use strict";

import _ from 'lodash';
import utils from './utils';
import EventBus from './event-bus';

export default {

  /**
   * Internal storage object for the block
   */
  blockStorage: {},

  /**
   * Initialize the store, including the block type
   */
  createStore(blockData) {
    this.blockStorage = {
      type: utils.underscored(this.type),
      data: blockData || {}
    };
  },

  /**
   * Serialize the block and save the data into the store
   */
  save() {
    const data = this._serializeData();

    if (!_.isEmpty(data)) {
      this.setData(data);
    }
  },

  getData() {
    this.save();
    return this.blockStorage;
  },

  getBlockData() {
    this.save();
    return this.blockStorage.data;
  },

  _getData() {
    return this.blockStorage.data;
  },

  /**
   * Set the block data.
   * This is used by the save() method.
   */
  setData(blockData) {
    utils.log("Setting data for block " + this.blockID);
    Object.assign(this.blockStorage.data, blockData || {});
  },

  setAndLoadData(blockData) {
    this.setData(blockData);
    this.beforeLoadingData();
  },

  _serializeData() {},
  loadData() {},

  beforeLoadingData() {
    utils.log("loadData for " + this.blockID);
    EventBus.trigger("editor/block/loadData");
    this.loadData(this._getData());
  },

  _loadData() {
    utils.log("_loadData is deprecated and will be removed in the future. Please use beforeLoadingData instead.");
    this.beforeLoadingData();
  },

  checkAndLoadData() {
    if (!_.isEmpty(this._getData())) {
      this.beforeLoadingData();
    }
  }

};
