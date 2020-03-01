"use strict";

import { template } from 'lodash';
import config from '../config';
import utils from '../utils';
import fileUploader from '../extensions/file-uploader';

import Ajaxable from './ajaxable';

export default {

  mixinName: "Uploadable",
  uploadsCount: 0,

  initializeUploadable() {
    utils.log("Adding uploadable to block " + this.blockID);
    this.withMixin(Ajaxable);

    this.upload_options = Object.assign({}, config.defaults.Block.upload_options, this.upload_options);
    this.$inputs.append(template(this.upload_options.html, this));
  },

  uploader(file, success, failure) {
    fileUploader(this, file, success, failure)
  },
};
