"use strict";

/* Our base formatters */

import Formatter from './formatter';

export class Bold extends Formatter {
  constructor() {
    super();

    this.title = "bold";
    this.cmd = "bold";
    this.keyCode = 66;
    this.text = "B";
  }
}

export class Italic extends Formatter {
  constructor() {
    super();

    this.title = "italic";
    this.cmd = "italic";
    this.keyCode = 73;
    this.text = "i";
  }
}

export class Link extends Formatter {
  constructor() {
    super();

    this.title = "link";
    this.iconName = "link";
    this.cmd = "CreateLink";
    this.text = "link";
  }

  onClick() {

    let link = window.prompt(i18n.t("general:link")),
      link_regex = /((ftp|http|https):\/\/.)|mailto(?=\:[-\.\w]+@)/;

    if (link && link.length > 0) {

      if (!link_regex.test(link)) {
        link = "http://" + link;
      }

      document.execCommand(this.cmd, false, link);
    }
  }

  isActive() {
    const selection = window.getSelection();
    let node;

    if (selection.rangeCount > 0) {
      node = selection.getRangeAt(0)
        .startContainer
        .parentNode;
    }

    return (node && node.nodeName === "A");
  }
}

export class UnLink extends Formatter {
  constructor() {
    super();

    this.title = "unlink";
    this.iconName = "link";
    this.cmd = "unlink";
    this.text = "link";
  }
}

export default {
  Bold: new Bold(),
  Italic: new Italic(),
  Link: new Link(),
  UnLink: new UnLink()
}
