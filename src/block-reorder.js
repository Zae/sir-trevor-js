"use strict";

import { isUndefined, isEmpty } from 'lodash';
import $ from 'jquery';
import EventBus from './event-bus';

import FunctionBind from './function-bind';
import Renderable from './renderable';

const BlockReorder = function (block_element, mediator) {
  this.$block = block_element;
  this.blockID = this.$block.attr('id');
  this.mediator = mediator;

  this._ensureElement();
  this._bindFunctions();

  this.initialize();
};

Object.assign(BlockReorder.prototype, FunctionBind, Renderable, {

  bound: ['onMouseDown', 'onDragStart', 'onDragEnd', 'onDrop'],

  className: 'st-block-ui-btn st-block-ui-btn--reorder st-icon',
  tagName: 'a',

  attributes() {
    return {
      'html': 'reorder',
      'draggable': 'true',
      'data-icon': 'move'
    };
  },

  initialize() {
    this.$el.bind('mousedown touchstart', this.onMouseDown)
      .bind('dragstart', this.onDragStart)
      .bind('dragend touchend', this.onDragEnd);

    this.$block.dropArea()
      .bind('drop', this.onDrop);
  },

  blockId() {
    return this.$block.attr('id');
  },

  onMouseDown() {
    this.mediator.trigger("block-controls:hide");
    EventBus.trigger("block:reorder:down");
  },

  onDrop(ev) {
    ev.preventDefault();

    const dropped_on = this.$block,
      item_id = ev.originalEvent.dataTransfer.getData("text/plain"),
      block = $('#' + item_id);

    if (!isUndefined(item_id) && !isEmpty(block) &&
      dropped_on.attr('id') !== item_id &&
      dropped_on.attr('data-instance') === block.attr('data-instance')
    ) {
      dropped_on.after(block);
    }
    this.mediator.trigger("block:rerender", item_id);
    EventBus.trigger("block:reorder:dropped", item_id);
  },

  onDragStart(ev) {
    const btn = $(ev.currentTarget).parent();

    ev.originalEvent.dataTransfer.setDragImage(this.$block[0], btn.position().left, btn.position().top);
    ev.originalEvent.dataTransfer.setData('Text', this.blockId());

    EventBus.trigger("block:reorder:dragstart");
    this.$block.addClass('st-block--dragging');
  },

  onDragEnd() {
    EventBus.trigger("block:reorder:dragend");
    this.$block.removeClass('st-block--dragging');
  },

  render() {
    return this;
  }

});

export default BlockReorder;
