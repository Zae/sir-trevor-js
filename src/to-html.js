"use strict";

import { isUndefined, isFunction } from 'lodash';
import utils from './utils';

import Blocks from './blocks';
import Formatters from './formatters';

export default function (markdown, type) {

  // MD -> HTML
  type = utils.classify(type);

  let html = markdown,
    shouldWrap = type === "Text";

  if (isUndefined(shouldWrap)) {
    shouldWrap = false;
  }

  if (shouldWrap) {
    html = "<div>" + html;
  }

  html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/gm, function (match, p1, p2) {
    return "<a href='" + p2 + "'>" + p1.replace(/\n/g, '') + "</a>";
  });

  // This may seem crazy, but because JS doesn't have a look behind,
  // we reverse the string to regex out the italic items (and bold)
  // and look for something that doesn't start (or end in the reversed strings case)
  // with a slash.
  html = utils.reverse(
    utils.reverse(html)
      .replace(/_(?!\\)((_\\|[^_])*)_(?=$|[^\\])/gm, function (match, p1) {
        return ">i/<" + p1.replace(/\n/g, '').replace(/[\s]+$/, '') + ">i<";
      })
      .replace(/\*\*(?!\\)((\*\*\\|[^\*\*])*)\*\*(?=$|[^\\])/gm, function (match, p1) {
        return ">b/<" + p1.replace(/\n/g, '').replace(/[\s]+$/, '') + ">b<";
      })
  );

  html = html.replace(/^\> (.+)$/mg, "$1");

  // Use custom formatters toHTML functions (if any exist)
  let formatName, format;
  for (formatName in Formatters) {
    if (Formatters.hasOwnProperty(formatName)) {
      format = Formatters[formatName];
      // Do we have a toHTML function?
      if (!isUndefined(format.toHTML) && isFunction(format.toHTML)) {
        html = format.toHTML(html);
      }
    }
  }

  // Use custom block toHTML functions (if any exist)
  let block;
  if (Blocks.hasOwnProperty(type)) {
    block = Blocks[type];
    // Do we have a toHTML function?
    if (!isUndefined(block.prototype.toHTML) && isFunction(block.prototype.toHTML)) {
      html = block.prototype.toHTML(html);
    }
  }

  if (shouldWrap) {
    html = html.replace(/\n\n/gm, "</div><div><br></div><div>");
    html = html.replace(/\n/gm, "</div><div>");
  }

  html = html.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
    .replace(/\n/g, "<br>")
    .replace(/\*\*/, "")
    .replace(/__/, "");  // Cleanup any markdown characters left

  // Replace escaped
  html = html.replace(/\\\*/g, "*")
    .replace(/\\\[/g, "[")
    .replace(/\\\]/g, "]")
    .replace(/\\\_/g, "_")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\-/g, "-");

  if (shouldWrap) {
    html += "</div>";
  }

  return html;
}
