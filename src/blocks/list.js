"use strict";

import { template, isEmpty } from 'lodash';

import Block from '../block';
import stToHTML from '../to-html';

const t = '<div class="st-text-block st-required" contenteditable="true"><ul><li></li></ul></div>';

export default Block.extend({

  type: 'list',
  icon_name: 'list',

  title: () => i18n.t('blocks:list:title'),
  editorHTML: () => template(t)(this),

  loadData(data) {
    this.getTextBlock().html("<ul>" + stToHTML(data.text, this.type) + "</ul>");
  },

  onBlockRender() {
    this.checkForList = this.checkForList.bind(this);
    this.getTextBlock().on('click keyup', this.checkForList);
    this.focus();
  },

  checkForList() {
    if (this.$('ul').length === 0) {
      document.execCommand("insertUnorderedList", false, false);
    }
  },

  toMarkdown(markdown) {
    return markdown.replace(/<\/li>/mg, "\n")
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/^(.+)$/mg, " - $1");
  },

  toHTML(html) {
    return html.replace(/^ - (.+)$/mg, "<li>$1</li>")
      .replace(/\n/mg, "");
  },

  onContentPasted(event, target) {
    this.$('ul').html(
      this.pastedMarkdownToHTML(target[0].innerHTML));
    this.getTextBlock().caretToEnd();
  },

  isEmpty() {
    return isEmpty(this.getBlockData().text);
  },

});
