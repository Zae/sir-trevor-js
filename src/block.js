"use strict";

import _, {isObject, isUndefined, template, isEmpty} from 'lodash';
import $ from 'jquery';

import config from './config';
import utils from './utils';
import stToHTML from './to-html';
import stToMarkdown from './to-markdown';
import BlockMixins from './block_mixins';

import SimpleBlock from './simple-block';
import BlockReorder from './block-reorder';
import BlockDeletion from './block-deletion';
import BlockPositioner from './block-positioner';
import Formatters from './formatters';
import EventBus from './event-bus';

import Spinner from 'spin.js';

import BlockValidations from './block-validations';
import Extend from './helpers/extend';

const Block = function (data, instance_id, mediator) {
  SimpleBlock.apply(this, arguments);
};

Block.prototype = Object.create(SimpleBlock.prototype);
Block.prototype.constructor = Block;

const delete_template = [
  "<div class='st-block__ui-delete-controls'>",
  "<label class='st-block__delete-label'>",
  "<%= i18n.t('general:delete') %>",
  "</label>",
  "<a class='st-block-ui-btn st-block-ui-btn--confirm-delete st-icon' data-icon='tick'></a>",
  "<a class='st-block-ui-btn st-block-ui-btn--deny-delete st-icon' data-icon='close'></a>",
  "</div>"
].join("\n");

const drop_options = {
  html: ['<div class="st-block__dropzone">',
    '<span class="st-icon"><%= _.result(block, "icon_name") %></span>',
    '<p><%= i18n.t("general:drop", { block: "<span>" + _.result(block, "title") + "</span>" }) %>',
    '</p></div>'].join('\n'),
  re_render_on_reorder: false
};

const paste_options = {
  html: ['<input type="text" placeholder="<%= i18n.t("general:paste") %>"',
    ' class="st-block__paste-input st-paste-block">'].join('')
};

const upload_options = {
  html: [
    '<div class="st-block__upload-container">',
    '<input type="file" type="st-file-upload">',
    '<button class="st-upload-btn"><%= i18n.t("general:upload") %></button>',
    '</div>'
  ].join('\n')
};

config.defaults.Block = {
  drop_options,
  paste_options,
  upload_options
};

Object.assign(Block.prototype, SimpleBlock.fn, BlockValidations, {

  bound: [
    "_handleContentPaste", "_onFocus", "_onBlur", "onDrop", "onDeleteClick",
    "clearInsertedStyles", "getSelectionForFormatter", "onBlockRender",
  ],

  icon_name: 'default',
  className: 'st-block st-icon--add',
  editorHTML: '<div class="st-block__editor"></div>',
  toolbarEnabled: true,
  availableMixins: ['droppable', 'pastable', 'uploadable', 'fetchable',
    'ajaxable', 'controllable'],

  droppable: false,
  pastable: false,
  uploadable: false,
  fetchable: false,
  ajaxable: false,

  drop_options: {},
  paste_options: {},
  upload_options: {},

  formattable: true,
  _previousSelection: '',

  initialize() {},

  attributes() {
    return Object.assign(SimpleBlock.fn.attributes.call(this), {
      'data-icon-after': "add"
    });
  },

  validationFailMsg() {
    return i18n.t('errors:validation_fail', {type: this.title()});
  },

  toMarkdown: (markdown) => markdown,
  toHTML: (html) => html,

  withMixin(mixin) {
    if (!isObject(mixin)) {
      return;
    }

    const initializeMethod = `initialize${mixin.mixinName}`;

    if (isUndefined(this[initializeMethod])) {
      Object.assign(this, mixin);
      this[initializeMethod]();
    }
  },

  render() {
    this.beforeBlockRender();
    this._setBlockInner();

    this.$editor = this.$inner.children().first();

    if (this.droppable || this.pastable || this.uploadable) {
      const input_html = $("<div>", {'class': 'st-block__inputs'});

      this.$inner.append(input_html);
      this.$inputs = input_html;
    }

    if (this.hasTextBlock) {
      this._initTextBlocks();
    }

    this.availableMixins.forEach(function (mixin) {
      if (this[mixin]) {
        this.withMixin(BlockMixins[utils.classify(mixin)]);
      }
    }, this);

    if (this.formattable) {
      this._initFormatting();
    }

    this._blockPrepare();

    return this;
  },

  remove() {
    if (this.ajaxable) {
      this.resolveAllInQueue();
    }

    this.$el.remove();
  },

  loading() {
    if (!isUndefined(this.spinner)) {
      this.ready();
    }

    this.spinner = new Spinner(config.defaults.spinner);
    this.spinner.spin(this.$el[0]);

    this.$el.addClass('st--is-loading');
  },

  ready() {
    this.$el.removeClass('st--is-loading');
    if (!isUndefined(this.spinner)) {
      this.spinner.stop();
      delete this.spinner;
    }
  },

  /* Generic _serializeData implementation to serialize the block into a plain object.
   * Can be overwritten, although hopefully this will cover most situations.
   * If you want to get the data of your block use block.getBlockData()
   */
  _serializeData() {
    utils.log("toData for " + this.blockID);

    const data = {};

    /* Simple to start. Add conditions later */
    if (this.hasTextBlock()) {
      const content = this.getTextBlock().html();
      if (content.length > 0) {
        data.text = stToMarkdown(content, this.type);
      }
    }

    // Add any inputs to the data attr
    if (this.$(':input').not('.st-paste-block').length > 0) {
      this.$(':input').each(function (index, input) {
        if (input.getAttribute('name')) {
          data[input.getAttribute('name')] = input.value;
        }
      });
    }

    return data;
  },

  /* Generic implementation to tell us when the block is active */
  focus() {
    this.getTextBlock().focus();
  },

  blur() {
    this.getTextBlock().blur();
  },

  onFocus() {
    this.getTextBlock().bind('focus', this._onFocus);
  },

  onBlur() {
    this.getTextBlock().bind('blur', this._onBlur);
  },

  /*
   * Event handlers
   */

  _onFocus() {
    this.trigger('blockFocus', this.$el);
  },

  _onBlur() {
  },

  onBlockRender() {
    this.focus();
  },

  onDrop(dataTransferObj) {
  },

  onDeleteClick(ev) {
    ev.preventDefault();

    const onDeleteConfirm = function (e) {
      e.preventDefault();
      this.mediator.trigger('block:remove', this.blockID);
      this.remove();
    };

    const onDeleteDeny = function (e) {
      e.preventDefault();
      this.$el.removeClass('st-block--delete-active');
      $delete_el.remove();
    };

    if (this.isEmpty()) {
      onDeleteConfirm.call(this, new Event('click'));
      return;
    }

    this.$inner.append(template(delete_template)());
    this.$el.addClass('st-block--delete-active');

    const $delete_el = this.$inner.find('.st-block__ui-delete-controls');

    this.$inner.on('click', '.st-block-ui-btn--confirm-delete',
      onDeleteConfirm.bind(this))
      .on('click', '.st-block-ui-btn--deny-delete',
        onDeleteDeny.bind(this));
  },

  pastedMarkdownToHTML(content) {
    return stToHTML(stToMarkdown(content, this.type), this.type);
  },

  onContentPasted(event, target) {
    target.html(this.pastedMarkdownToHTML(target[0].innerHTML));
    this.getTextBlock().caretToEnd();
  },

  beforeLoadingData() {
    this.loading();

    if (this.droppable || this.uploadable || this.pastable) {
      this.$editor.show();
      this.$inputs.hide();
    }

    SimpleBlock.fn.beforeLoadingData.call(this);

    this.ready();
  },

  _handleContentPaste(ev) {
    setTimeout(this.onContentPasted.bind(this, ev, $(ev.currentTarget)), 0);
  },

  _getBlockClass() {
    return 'st-block--' + this.className;
  },

  /*
   * Init functions for adding functionality
   */

  _initUIComponents() {

    const positioner = new BlockPositioner(this.$el, this.mediator);

    this._withUIComponent(positioner, '.st-block-ui-btn--reorder',
      positioner.toggle);

    this._withUIComponent(new BlockReorder(this.$el, this.mediator));

    this._withUIComponent(new BlockDeletion(), '.st-block-ui-btn--delete',
      this.onDeleteClick);

    this.onFocus();
    this.onBlur();
  },

  _initFormatting() {
    // Enable formatting keyboard input
    let formatter;
    for (const name in Formatters) {
      if (Formatters.hasOwnProperty(name)) {
        formatter = Formatters[name];
        if (!isUndefined(formatter.keyCode)) {
          formatter._bindToBlock(this.$el);
        }
      }
    }
  },

  _initTextBlocks() {
    this.getTextBlock()
      .bind('paste', this._handleContentPaste)
      .bind('keyup', this.getSelectionForFormatter)
      .bind('mouseup', this.getSelectionForFormatter)
      .bind('DOMNodeInserted', this.clearInsertedStyles);
  },

  getSelectionForFormatter() {
    const block = this;
    setTimeout(function () {
      const selection = window.getSelection(),
        selectionStr = selection.toString().trim(),
        en = 'formatter:' + ((selectionStr === '') ? 'hide' : 'position');

      block.mediator.trigger(en, block);
      EventBus.trigger(en, block);
    }, 1);
  },

  clearInsertedStyles(e) {
    const target = e.target;
    target.removeAttribute('style'); // Hacky fix for Chrome.
  },

  hasTextBlock() {
    return this.getTextBlock().length > 0;
  },

  getTextBlock() {
    if (isUndefined(this.text_block)) {
      this.text_block = this.$('.st-text-block');
    }

    return this.text_block;
  },

  isEmpty() {
    return isEmpty(this.getBlockData());
  }

});

Block.extend = Extend; // Allow our Block to be extended.

export default Block;
