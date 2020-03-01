"use strict";

import { isUndefined, isString } from 'lodash';

import config from './config';
import utils from './utils';
import Locales from './locales';
import Events from './events';
import EventBus from './event-bus';

import EditorStorage from './extensions/editor-store';
import Submittable from './extensions/submittable';
import FileUploader from './extensions/file-uploader';

import BlockMixins from './block_mixins';
import BlockPositioner from './block-positioner';
import BlockReorder from './block-reorder';
import BlockDeletion from './block-deletion';
import BlockValidations from './block-validations';
import BlockStore from './block-store';
import BlockManager from './block-manager';

import SimpleBlock from './simple-block';
import Block from './block';
import Formatter from './formatter';
import * as Formatters from './formatters';

import Blocks from './blocks';

import BlockControl from './block-control';
import BlockControls from './block-controls';
import FloatingBlockControls from './floating-block-controls';

import FormatBar from './format-bar';
import Editor from './editor';

import toMarkdown from './to-markdown';
import toHTML from './to-html';

import FormEvents from './form-events';

import './helpers/event'; // extends jQuery itself

class SirTrevorClass {
  constructor() {
    this.config = config;
    this.log = utils.log;
    this.Locales = Locales;

    this.Events = Events;
    this.EventBus = EventBus;

    this.EditorStore = EditorStorage;
    this.Submittable = Submittable;
    this.FileUploader = FileUploader;

    this.BlockMixins = BlockMixins;
    this.BlockPositioner = BlockPositioner;
    this.BlockReorder = BlockReorder;
    this.BlockDeletion = BlockDeletion;
    this.BlockValidations = BlockValidations;
    this.BlockStore = BlockStore;
    this.BlockManager = BlockManager;

    this.SimpleBlock = SimpleBlock;
    this.Block = Block;
    this.Formatter = Formatter;
    this.Formatters = Formatters;

    this.Blocks = Blocks;

    this.BlockControl = BlockControl;
    this.BlockControls = BlockControls;
    this.FloatingBlockControls = FloatingBlockControls;

    this.FormatBar = FormatBar;

    this.Editor = Editor;

    this.toMarkdown = toMarkdown;
    this.toHTML = toHTML;
  }

  setDefaults(options) {
    Object.assign(this.config.defaults, options || {});
  }

  getInstance(identifier) {
    if (isUndefined(identifier)) {
      return this.config.instances[0];
    }

    if (isString(identifier)) {
      return this.config.instances.find(editor => editor.ID === identifier);
    }

    return this.config.instances[identifier];
  }

  setBlockOptions(type, options) {
    const block = this.Blocks[type];

    if (isUndefined(block)) {
      return;
    }

    Object.assign(block.prototype, options || {});
  }

  runOnAllInstances(method) {
    if (this.Editor.prototype.hasOwnProperty(method)) {
      const methodArgs = Array.prototype.slice.call(arguments, 1);
      Array.prototype.forEach.call(this.config.instances, (i) => {
        i[method].apply(null, methodArgs);
      });
    } else {
      this.log("method doesn't exist");
    }
  }
}

const SirTrevor = new SirTrevorClass();

Object.assign(SirTrevor, FormEvents);

export default SirTrevor;
