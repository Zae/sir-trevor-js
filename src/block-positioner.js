"use strict";

import FunctionBind from './function-bind';
import Renderable from './renderable';

const template = [
  "<div class='st-block-positioner__inner'>",
  "<span class='st-block-positioner__selected-value'></span>",
  "<select class='st-block-positioner__select'></select>",
  "</div>"
].join("\n");

const BlockPositioner = function (block_element, mediator) {
  this.mediator = mediator;
  this.$block = block_element;

  this._ensureElement();
  this._bindFunctions();

  this.initialize();
};

Object.assign(BlockPositioner.prototype, FunctionBind, Renderable, {

  total_blocks: 0,

  bound: ['onBlockCountChange', 'onSelectChange', 'toggle', 'show', 'hide'],

  className: 'st-block-positioner',
  visibleClass: 'st-block-positioner--is-visible',

  initialize() {
    this.$el.append(template);
    this.$select = this.$('.st-block-positioner__select');

    this.$select.on('change', this.onSelectChange);

    this.mediator.on("block:countUpdate", this.onBlockCountChange);
  },

  onBlockCountChange(new_count) {
    if (new_count !== this.total_blocks) {
      this.total_blocks = new_count;
      this.renderPositionList();
    }
  },

  onSelectChange() {
    const val = this.$select.val();
    if (val !== 0) {
      this.mediator.trigger(
        "block:changePosition", this.$block, val,
        (val === 1 ? 'before' : 'after'));
      this.toggle();
    }
  },

  renderPositionList() {
    let inner = "<option value='0'>" + i18n.t("general:position") + "</option>";
    for (let i = 1; i <= this.total_blocks; i++) {
      inner += "<option value=" + i + ">" + i + "</option>";
    }
    this.$select.html(inner);
  },

  toggle() {
    this.$select.val(0);
    this.$el.toggleClass(this.visibleClass);
  },

  show() {
    this.$el.addClass(this.visibleClass);
  },

  hide() {
    this.$el.removeClass(this.visibleClass);
  }

});

export default BlockPositioner;
