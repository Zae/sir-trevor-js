"use strict";

/* Adds drop functionality to this block */

import $ from 'jquery';
import config from '../config';
import utils from '../utils';
import EventBus from '../event-bus';

const _ = require('../lodash');

export default {

  mixinName: "Droppable",
  valid_drop_file_types: ['File', 'Files', 'text/plain', 'text/uri-list'],

  initializeDroppable() {
    utils.log("Adding droppable to block " + this.blockID);

    this.drop_options = Object.assign({}, config.defaults.Block.drop_options, this.drop_options);

    const drop_html = $(_.template(this.drop_options.html)({block: this, _: _}));

    this.$editor.hide();
    this.$inputs.append(drop_html);
    this.$dropzone = drop_html;

    // Bind our drop event
    this.$dropzone.dropArea()
      .bind('drop', this._handleDrop.bind(this));

    this.$inner.addClass('st-block__inner--droppable');
  },

  _handleDrop(e) {
    e.preventDefault();

    e = e.originalEvent;

    const el = $(e.target),
      types = e.dataTransfer.types;

    el.removeClass('st-dropzone--dragover');

    /*
      Check the type we just received,
      delegate it away to our blockTypes to process
    */

    if (types &&
      types.some(function (type) {
        return this.valid_drop_file_types.includes(type);
      }, this)) {
      this.onDrop(e.dataTransfer);
    }

    EventBus.trigger('block:content:dropped', this.blockID);
  }

}
