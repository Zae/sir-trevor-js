"use strict";

import _ from 'lodash';
import Extend from './helpers/extend';

const formatOptions = ["title", "className", "cmd", "keyCode", "param", "onClick", "toMarkdown", "toHTML"];

class Formatter {
  constructor(options) {
    this.formatId = _.uniqueId('format-');
    this._configure(options || {});
    this.initialize.apply(this, arguments);

    this.title = '';
    this.className = '';
    this.cmd = null;
    this.keyCode = null;
    this.param = null;
  }

  toMarkdown(markdown) {
    return markdown;
  }

  toHTML(html) {
    return html;
  }

  initialize(){}

  _configure(options) {
    if (this.options) {
      options = Object.assign({}, this.options, options);
    }

    for (let i = 0, l = formatOptions.length; i < l; i++) {
      const attr = formatOptions[i];
      if (options[attr]) {
        this[attr] = options[attr];
      }
    }
    this.options = options;
  }

  isActive() {
    return document.queryCommandState(this.cmd)
  }

  _bindToBlock(block) {
    const formatter = this;
    let ctrlDown = false;

    block
      .on('keyup', '.st-text-block', function (ev) {
        if (ev.which === 17 || ev.which === 224 || ev.which === 91) {
          ctrlDown = false;
        }
      })
      .on('keydown', '.st-text-block', {formatter: formatter}, function (ev) {
        if (ev.which === 17 || ev.which === 224 || ev.which === 91) {
          ctrlDown = true;
        }

        if (ev.which === ev.data.formatter.keyCode && ctrlDown === true) {
          document.execCommand(ev.data.formatter.cmd, false, true);
          ev.preventDefault();
          ctrlDown = false;
        }
      });
  }
}

// Allow our Formatters to be extended.
// Formatter.extend = Extend;

export default Formatter;
