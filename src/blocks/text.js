"use strict";

/*
  Text Block
*/

import Block from '../block';
import stToHTML from '../to-html'

export default Block.extend({

  type: "text",
  editorHTML: '<div class="st-required st-text-block" contenteditable="true"></div>',
  icon_name: 'text',

  title: () => i18n.t('blocks:text:title'),

  loadData(data){
    this.getTextBlock().html(stToHTML(data.text, this.type));
  }
});
