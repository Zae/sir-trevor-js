"use strict";

/*
  Heading Block
*/

import Block from '../block';
import stToHTML from '../to-html';

export default Block.extend({

  type: 'Heading',
  icon_name: 'heading',
  editorHTML: '<div class="st-required st-text-block st-text-block--heading" contenteditable="true"></div>',

  title: () => i18n.t('blocks:heading:title'),

  loadData(data) {
    this.getTextBlock().html(stToHTML(data.text, this.type));
  }
});
