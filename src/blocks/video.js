"use strict";

import _ from 'lodash';
import utils from '../utils';
import Block from '../block';

export default Block.extend({

  // more providers at https://gist.github.com/jeffling/a9629ae28e076785a14f
  providers: {
    vimeo: {
      regex: /(?:http[s]?:\/\/)?(?:www.)?vimeo.com\/(.+)/,
      html: "<iframe src=\"<%= protocol %>//player.vimeo.com/video/<%= remote_id %>?title=0&byline=0\" width=\"580\" height=\"320\" frameborder=\"0\"></iframe>"
    },
    youtube: {
      regex: /(?:http[s]?:\/\/)?(?:www.)?(?:(?:youtube.com\/watch\?(?:.*)(?:v=))|(?:youtu.be\/))([^&].+)/,
      html: "<iframe src=\"<%= protocol %>//www.youtube.com/embed/<%= remote_id %>\" width=\"580\" height=\"320\" frameborder=\"0\" allowfullscreen></iframe>"
    }
  },

  type: 'video',
  droppable: true,
  pastable: true,
  icon_name: 'video',

  title: () => i18n.t('blocks:video:title'),

  loadData(data) {
    if (!this.providers.hasOwnProperty(data.source)) {
      return;
    }

    const source = this.providers[data.source];

    const protocol = window.location.protocol === "file:" ?
      "http:" : window.location.protocol;

    const aspectRatioClass = source.square ?
      'with-square-media' : 'with-sixteen-by-nine-media';

    this.$editor
      .addClass('st-block__editor--' + aspectRatioClass)
      .html(_.template(source.html)({
        protocol: protocol,
        remote_id: data.remote_id,
        width: this.$editor.width() // for videos like vine
      }));
  },

  onContentPasted(event) {
    this.handleDropPaste(event.target.value);
  },

  matchVideoProvider(provider, index, url) {
    const match = provider.regex.exec(url);
    if (match == null || _.isUndefined(match[1])) {
      return {};
    }

    return {
      source: index,
      remote_id: match[1]
    };
  },

  handleDropPaste(url) {
    if (!utils.isURI(url)) {
      return;
    }

    for (const key in this.providers) {
      if (!this.providers.hasOwnProperty(key)) {
        continue;
      }
      this.setAndLoadData(
        this.matchVideoProvider(this.providers[key], key, url)
      );
    }
  },

  onDrop(transferData) {
    const url = transferData.getData('text/plain');
    this.handleDropPaste(url);
  }
});

