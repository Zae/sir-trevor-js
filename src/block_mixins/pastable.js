"use strict";

import {template} from 'lodash';
import $ from 'jquery';
import config from '../config';
import utils from '../utils';

export default {

  mixinName: "Pastable",

  initializePastable() {
    utils.log("Adding pastable to block " + this.blockID);

    this.paste_options = Object.assign({}, config.defaults.Block.paste_options, this.paste_options);
    this.$inputs.append(template(this.paste_options.html)(this));

    this.$('.st-paste-block')
      .bind('click', function () {
        $(this).select();
      })
      .bind('paste', this._handleContentPaste)
      .bind('submit', this._handleContentPaste);
  }

};
