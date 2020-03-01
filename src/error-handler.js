"use strict";

import _ from 'lodash';
import $ from 'jquery';

import FunctionBind from './function-bind';
import MediatedEvents from './mediated-events';
import Renderable from './renderable';

const ErrorHandler = function ($wrapper, mediator, container) {
  this.$wrapper = $wrapper;
  this.mediator = mediator;
  this.$el = container;

  if (_.isUndefined(this.$el)) {
    this._ensureElement();
    this.$wrapper.prepend(this.$el);
  }

  this.$el.hide();
  this._bindFunctions();
  this._bindMediatedEvents();

  this.initialize();
};

Object.assign(ErrorHandler.prototype, FunctionBind, MediatedEvents, Renderable, {

  errors: [],
  className: "st-errors",
  eventNamespace: 'errors',

  mediatedEvents: {
    'reset': 'reset',
    'add': 'addMessage',
    'render': 'render'
  },

  initialize() {
    const $list = $("<ul>");
    this.$el.append("<p>" + i18n.t("errors:title") + "</p>")
      .append($list);
    this.$list = $list;
  },

  render() {
    if (this.errors.length === 0) {
      return false;
    }
    this.errors.forEach(this.createErrorItem, this);
    this.$el.show();
  },

  createErrorItem(error) {
    const $error = $("<li>", {class: "st-errors__msg", html: error.text});
    this.$list.append($error);
  },

  addMessage(error) {
    this.errors.push(error);
  },

  reset() {
    if (this.errors.length === 0) {
      return false;
    }
    this.errors = [];
    this.$list.html('');
    this.$el.hide();
  }

});

export default ErrorHandler;
