"use strict";

import _ from 'lodash';
import utils from './utils';
import $ from 'jquery';

import BlockReorder from './block-reorder';
import FunctionBind from './function-bind';
import Events from './events';
import Renderable from './renderable';
import BlockStore from './block-store';

import Extend from './helpers/extend';

const SimpleBlock = function (data, instance_id, mediator) {
  this.createStore(data);
  this.blockID = _.uniqueId('st-block-');
  this.instanceID = instance_id;
  this.mediator = mediator;

  this._ensureElement();
  this._bindFunctions();

  this.initialize.apply(this, arguments);
};

Object.assign(SimpleBlock.prototype, FunctionBind, Events, Renderable, BlockStore, {

  className: 'st-block',
  type: '',
  editorHTML: '',
  block_template: _.template(
    "<div class='st-block__inner'><%= editor_html %></div>"
  ),
  focus() {},

  valid: () => true,

  attributes() {
    return {
      'id': this.blockID,
      'data-type': this.type,
      'data-instance': this.instanceID
    };
  },

  title() {
    return utils.titleize(this.type.replace(/[\W_]/g, ' '));
  },

  blockCSSClass() {
    this.blockCSSClass = utils.toSlug(this.type);
    return this.blockCSSClass;
  },

  class() {
    return utils.classify(this.type);
  },

  initialize() {},

  onBlockRender() {},
  beforeBlockRender() {},

  _setBlockInner() {
    const editor_html = _.result(this, 'editorHTML');

    this.$el.append(
      this.block_template({editor_html: editor_html})
    );

    this.$inner = this.$el.find('.st-block__inner');
    this.$inner.bind('click mouseover', function (e) {
      e.stopPropagation();
    });
  },

  render() {
    this.beforeBlockRender();

    this._setBlockInner();
    this._blockPrepare();

    return this;
  },

  _blockPrepare() {
    this._initUI();
    this._initMessages();

    this.checkAndLoadData();

    this.$el.addClass('st-item-ready');
    this.on("onRender", this.onBlockRender);
    this.save();
  },

  _withUIComponent(component, className, callback) {
    this.$ui.append(component.render().$el);
    if (className && callback) {
      this.$ui.on('click', className, callback);
    }
  },

  _initUI() {
    const ui_element = $("<div>", {'class': 'st-block__ui'});
    this.$inner.append(ui_element);
    this.$ui = ui_element;
    this._initUIComponents();
  },

  _initMessages() {
    const msgs_element = $("<div>", {'class': 'st-block__messages'});
    this.$inner.prepend(msgs_element);
    this.$messages = msgs_element;
  },

  addMessage(msg, additionalClass) {
    const $msg = $("<span>", {html: msg, class: "st-msg " + additionalClass});
    this.$messages.append($msg)
      .addClass('st-block__messages--is-visible');
    return $msg;
  },

  resetMessages() {
    this.$messages.html('')
      .removeClass('st-block__messages--is-visible');
  },

  _initUIComponents() {
    this._withUIComponent(new BlockReorder(this.$el));
  }

});

SimpleBlock.fn = SimpleBlock.prototype;

// Allow our Block to be extended.
SimpleBlock.extend = Extend;

export default SimpleBlock;
