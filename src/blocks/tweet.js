"use strict";

import _, { template, isUndefined, isEmpty } from 'lodash';
import $ from 'jquery';
import utils from '../utils';
import Block from '../block';

const tweet_template = template([
  "<blockquote class='twitter-tweet' align='center'>",
  "<p><%= text %></p>",
  "&mdash; <%= user.name %> (@<%= user.screen_name %>)",
  "<a href='<%= status_url %>' data-datetime='<%= created_at %>'><%= created_at %></a>",
  "</blockquote>",
  '<script src="//platform.twitter.com/widgets.js" charset="utf-8"></script>'
].join("\n"));

export default Block.extend({

  type: "tweet",
  droppable: true,
  pastable: true,
  fetchable: true,
  icon_name: 'twitter',
  drop_options: {
    re_render_on_reorder: true
  },

  title: () => i18n.t('blocks:tweet:title'),
  fetchUrl: (tweetID) => "/tweets/?tweet_id=" + tweetID,

  loadData(data) {
    if (isUndefined(data.status_url)) { data.status_url = ''; }
    this.$inner.find('iframe').remove();
    this.$inner.prepend(tweet_template(data));
  },

  onContentPasted(event){
    // Content pasted. Delegate to the drop parse method
    const input = $(event.target),
      val = input.val();

    // Pass this to the same handler as onDrop
    this.handleTwitterDropPaste(val);
  },

  handleTwitterDropPaste(url){
    if (!this.validTweetUrl(url)) {
      utils.log("Invalid Tweet URL");
      return;
    }

    // Twitter status
    let tweetID = url.match(/[^\/]+$/);
    if (!isEmpty(tweetID)) {
      this.loading();
      tweetID = tweetID[0];

      const ajaxOptions = {
        url: this.fetchUrl(tweetID),
        dataType: "json"
      };

      this.fetch(ajaxOptions, this.onTweetSuccess, this.onTweetFail);
    }
  },

  validTweetUrl(url) {
    return (utils.isURI(url) &&
            url.indexOf("twitter") !== -1 &&
            url.indexOf("status") !== -1);
  },

  onTweetSuccess(data) {
    // Parse the twitter object into something a bit slimmer..
    const obj = {
      user: {
        profile_image_url: data.user.profile_image_url,
        profile_image_url_https: data.user.profile_image_url_https,
        screen_name: data.user.screen_name,
        name: data.user.name
      },
      id: data.id_str,
      text: data.text,
      created_at: data.created_at,
      entities: data.entities,
      status_url: "https://twitter.com/" + data.user.screen_name + "/status/" + data.id_str
    };

    this.setAndLoadData(obj);
    this.ready();
  },

  onTweetFail() {
    this.addMessage(i18n.t("blocks:tweet:fetch_error"));
    this.ready();
  },

  onDrop(transferData){
    const url = transferData.getData('text/plain');
    this.handleTwitterDropPaste(url);
  }
});
