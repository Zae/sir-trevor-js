"use strict";

import _ from 'lodash';
import $ from 'jquery';
import utils from './utils';

const bestNameFromField = function (field) {
  let msg = field.attr("data-st-name") || field.attr("name");

  if (!msg) {
    msg = 'Field';
  }

  return utils.capitalize(msg);
};

export default {

  errors: [],

  valid() {
    this.performValidations();
    return this.errors.length === 0;
  },

  // This method actually does the leg work
  // of running our validators and custom validators
  performValidations() {
    this.resetErrors();

    const required_fields = this.$('.st-required');
    required_fields.each(function (i, f) {
      this.validateField(f);
    }.bind(this));
    this.validations.forEach(this.runValidator, this);

    this.$el.toggleClass('st-block--with-errors', this.errors.length > 0);
  },

  // Everything in here should be a function that returns true or false
  validations: [],

  validateField(field) {
    field = $(field);

    const content = field.attr('contenteditable') ? field.text() : field.val();

    if (content.length === 0) {
      this.setError(field, i18n.t("errors:block_empty",
        {name: bestNameFromField(field)}));
    }
  },

  runValidator(validator) {
    if (!_.isUndefined(this[validator])) {
      this[validator].call(this);
    }
  },

  setError(field, reason) {
    const $msg = this.addMessage(reason, "st-msg--error");
    field.addClass('st-error');

    this.errors.push({field: field, reason: reason, msg: $msg});
  },

  resetErrors() {
    this.errors.forEach(function (error) {
      error.field.removeClass('st-error');
      error.msg.remove();
    });

    this.$messages.removeClass("st-block__messages--is-visible");
    this.errors = [];
  }

};
