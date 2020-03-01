"use strict";

/*
   Format Bar
   --
   Displayed on focus on a text area.
   Renders with all available options for the editor instance
   */

import {isUndefined, isFunction} from 'lodash';
import $ from 'jquery';

import config from './config';
import Formatters from './formatters';

import FunctionBind from './function-bind';
import MediatedEvents from './mediated-events';
import Events from './events';
import Renderable from './renderable';

const FormatBar = function (options, mediator) {
  this.options = Object.assign({}, config.defaults.formatBar, options || {});
  this.mediator = mediator;

  this._ensureElement();
  this._bindFunctions();
  this._bindMediatedEvents();

  this.initialize.apply(this, arguments);
};

Object.assign(FormatBar.prototype, FunctionBind, MediatedEvents, Events, Renderable, {

  className: 'st-format-bar',

  bound: ["onFormatButtonClick", "renderBySelection", "hide"],

  eventNamespace: 'formatter',

  mediatedEvents: {
    'position': 'renderBySelection',
    'show': 'show',
    'hide': 'hide'
  },

  initialize() {
    this.$btns = [];

    for (const formatName in Formatters) {
      if (Formatters.hasOwnProperty(formatName)) {
        const format = Formatters[formatName];
        const btn = $("<button>", {
          'class': 'st-format-btn st-format-btn--' + formatName + ' ' + (format.iconName ? 'st-icon' : ''),
          'text': format.text,
          'data-type': formatName,
          'data-cmd': format.cmd
        });

        this.$btns.push(btn);
        btn.appendTo(this.$el);
      }
    }

    this.$b = $(document);
    this.$el.bind('click', '.st-format-btn', this.onFormatButtonClick);
  },

  hide() {
    this.$el.removeClass('st-format-bar--is-ready');
  },

  show() {
    this.$el.addClass('st-format-bar--is-ready');
  },

  remove() {
    this.$el.remove();
  },

  renderBySelection() {
    const selection = window.getSelection(),
      range = selection.getRangeAt(0),
      boundary = range.getBoundingClientRect(),
      coords = {};

    coords.top = boundary.top + 20 + window.pageYOffset - this.$el.height() + 'px';
    coords.left = ((boundary.left + boundary.right) / 2) - (this.$el.width() / 2) + 'px';

    this.highlightSelectedButtons();
    this.show();

    this.$el.css(coords);
  },

  highlightSelectedButtons() {
    this.$btns.forEach(function ($btn) {
      const formatter = Formatters[$btn.attr('data-type')];

      $btn.toggleClass("st-format-btn--is-active",
        formatter.isActive());
    }, this);
  },

  onFormatButtonClick(ev) {
    ev.stopPropagation();

    const btn = $(ev.target),
      format = Formatters[btn.attr('data-type')];

    if (isUndefined(format)) {
      return false;
    }

    // Do we have a click function defined on this formatter?
    if (!isUndefined(format.onClick) && isFunction(format.onClick)) {
      format.onClick(); // Delegate
    } else {
      // Call default
      document.execCommand(btn.attr('data-cmd'), false, format.param);
    }

    this.highlightSelectedButtons();
    return false;
  }

});

export default FormatBar;
