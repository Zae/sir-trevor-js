# Sir Trevor

[![Build Status](https://travis-ci.org/madebymany/sir-trevor-js.png?branch=master)](https://travis-ci.org/madebymany/sir-trevor-js/)

![Sir Trevor in action](https://raw.github.com/madebymany/sir-trevor-js/v3/examples/sir-trevor.gif)

Maintained by [Chris Bell](http://github.com/cjbell88) & [Andrew Walker](http://github.com/ninjabiscuit).

## Quick start

1. [Download the latest release](https://github.com/madebymany/sir-trevor-js/zipball/master)
2. Clone the repo: `git clone git://github.com/madebymany/sir-trevor-js.git`
3. Install with [Bower](http://bower.io/) ``bower install sir-trevor-js``

For Rails based installations, please see the [Sir Trevor Rails](http://github.com/madebymany/sir-trevor-rails) gem.

## Customising

We use [Sass](http://sass-lang.com/) for our styles, if you'd like to change the default styling please fork the repository and [make changes to the Sass](https://github.com/madebymany/sir-trevor-js/wiki/Customising-the-default-styling) before recompiling. Alternatively, you can override the base styles with your own CSS.

Block Types can also easily be added to the ``SirTrevor.Blocks`` object. You can also override the defaulty block types (Text, Image, Tweet, Video, Quote, Heading & List) at any time. Please see the Wiki article about [adding your own block types](https://github.com/madebymany/sir-trevor-js/wiki/Creating%20your%20own%20Block%20types) for more information.

## Dependencies

Sir Trevor requires [Underscore](http://underscorejs.org/) (or LoDash), [jQuery](http://jquery.com) (or Zepto) and [Eventable](https://github.com/madebymany/eventable).

## Compiling

We use the awesome [Grunt](http://gruntjs.com/) for our build process. Before getting started please be sure to install the necessary dependencies via npm:

``$ npm install``

When completed you'll be able to run the various grunt commands provided:

``$ grunt``

Concatenates scripts, compiles the Sass, runs the Jasmine tests and minifies the project.

``$ grunt watch``

Convienience method while developing to compile the Sass files and concatenate the Javascript on save of a file in the ``/src`` directory.

Please ensure any pull requests have relevant Jasmine tests (where applicable).

## Licence

Sir Trevor is released under the MIT license:
[opensource.org/licenses/MIT](http://opensource.org/licenses/MIT)
