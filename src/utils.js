"use strict";

import _ from 'lodash';
import config from './config';

const urlRegex = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

export default {
  log() {
    if (!_.isUndefined(console) && config.debug) {
      console.log.apply(console, arguments);
    }
  },

  isURI(string) {
    return (urlRegex.test(string));
  },

  titleize(str) {
    if (str === null) {
      return '';
    }
    str = String(str).toLowerCase();
    return str.replace(/(?:^|\s|-)\S/g, function (c) {
      return c.toUpperCase();
    });
  },

  classify(str) {
    return this.titleize(String(str).replace(/[\W_]/g, ' ')).replace(/\s/g, '');
  },

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  },

  flatten(obj) {
    const x = {};
    (Array.isArray(obj) ? obj : Object.keys(obj)).forEach(function (i) {
      x[i] = true;
    });
    return x;
  },

  underscored(str) {
    return str.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2')
      .replace(/[-\s]+/g, '_').toLowerCase();
  },

  reverse(str) {
    return str.split("").reverse().join("");
  },

  toSlug(str) {
    return str
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }

}
