"use strict";

import { result } from 'lodash';
import Blocks from './blocks';

import FunctionBind from './function-bind';
import Renderable from './renderable';
import Events from './events';

const BlockControl = function(type) {
  this.type = type;
  this.block_type = Blocks[this.type].prototype;
  this.can_be_rendered = this.block_type.toolbarEnabled;

  this._ensureElement();
};

Object.assign(BlockControl.prototype, FunctionBind, Renderable, Events, {

  tagName: 'a',
  className: "st-block-control",

  attributes() {
    return {
      'data-type': this.block_type.type
    };
  },

  render() {
    this.$el.html('<span class="st-icon">'+ result(this.block_type, 'icon_name') +'</span>' + result(this.block_type, 'title'));
    return this;
  }
});

export default BlockControl;
