"use strict";

/*
 * SirTrevor.Submittable
 * --
 * We need a global way of setting if the editor can and can't be submitted,
 * and a way to disable the submit button and add messages (when appropriate)
 * We also need this to be highly extensible so it can be overridden.
 * This will be triggered *by anything* so it needs to subscribe to events.
 */

import $ from 'jquery';
import utils from '../utils';

import EventBus from '../event-bus';

export default class Submittable {
  constructor($form) {
    this.$form = $form;

    this._events = {
      "disableSubmitButton": "_disableSubmitButton",
      "enableSubmitButton": "_enableSubmitButton",
      "setSubmitButton": "setSubmitButton",
      "resetSubmitButton": "resetSubmitButton",
      "onError": "onError",
      "onUploadStart": "onUploadStart",
      "onUploadStop": "onUploadStop"
    }

    this.intialize();
  }

  intialize() {
    this.submitBtn = this.$form.find("input[type='submit']");

    const btnTitles = [];

    this.submitBtn.each(function (i, btn) {
      btnTitles.push($(btn).attr('value'));
    });

    this.submitBtnTitles = btnTitles;
    this.canSubmit = true;
    this.globalUploadCount = 0;
    this._bindEvents();
  }

  setSubmitButton(e, message) {
    this.submitBtn.attr('value', message);
  }

  resetSubmitButton() {
    const titles = this.submitBtnTitles;
    this.submitBtn.each(function (index, item) {
      $(item).attr('value', titles[index]);
    });
  }

  onUploadStart() {
    this.globalUploadCount++;
    utils.log('onUploadStart called ' + this.globalUploadCount);

    if (this.globalUploadCount === 1) {
      this._disableSubmitButton();
    }
  }

  onUploadStop() {
    this.globalUploadCount = (this.globalUploadCount <= 0) ? 0 : this.globalUploadCount - 1;

    utils.log('onUploadStop called ' + this.globalUploadCount);

    if (this.globalUploadCount === 0) {
      this._enableSubmitButton();
    }
  }

  onError() {
    utils.log('onError called');
    this.canSubmit = false;
  }

  _disableSubmitButton(message) {
    this.setSubmitButton(null, message || i18n.t("general:wait"));
    this.submitBtn
      .attr('disabled', 'disabled')
      .addClass('disabled');
  }

  _enableSubmitButton() {
    this.resetSubmitButton();
    this.submitBtn
      .removeAttr('disabled')
      .removeClass('disabled');
  }

  _bindEvents() {
    Object.keys(this._events).forEach(function (type) {
      EventBus.on(type, this[this._events[type]], this);
    }, this);
  }
}
