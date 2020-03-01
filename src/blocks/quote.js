"use strict";

/*
  Block Quote
*/

import { template } from 'lodash';

import Block from '../block';
import stToHTML from '../to-html';

const t = template([
  '<blockquote class="st-required st-text-block" contenteditable="true"></blockquote>',
  '<label class="st-input-label"> <%= i18n.t("blocks:quote:credit_field") %></label>',
  '<input maxlength="140" name="cite" placeholder="<%= i18n.t("blocks:quote:credit_field") %>"',
  ' class="st-input-string st-required js-cite-input" type="text" />'
].join("\n"));

export default Block.extend({

  type: "quote",
  icon_name: 'quote',

  title: () => i18n.t('blocks:quote:title'),

  editorHTML() {
    return t(this)
  },

  loadData(data){
    this.getTextBlock().html(stToHTML(data.text, this.type));
    this.$('.js-cite-input').val(data.cite);
  },

  toMarkdown(markdown) {
    return markdown.replace(/^(.+)$/mg,"> $1");
  }

});
