Chai-jQ
=======

`chai-jq` is an alternate plugin for the [Chai](http://chaijs.com/) assertion
library to provide jQuery-specific assertions.

## Usage

Add `chai-jq.js` after your Chai script include.

    <script src="chai.js"></script>
    <script src="chai-jq.js"></script>

You can install `chai-jq` via the following package managers:

* [NPM](https://npmjs.org/package/chai-jq): `npm install chai-jq`
* [Bower](http://bower.io/): `bower install chai-jq`

To see some of the plugin's assertions in action, see the
[test page](./test/test.html) for the project.

## Plugin API
### `.$val(string|regexp)`

Asserts that the element value matches a string or regular expression.

```js
expect($("<input value='foo' />"))
  .to.have.$val("foo").and
  .to.have.$val(/^foo/);
```

See: [http://api.jquery.com/val/]()

### `.$class(string)`

Asserts that the element has a class match.

```js
expect($("<div class='foo bar' />"))
  .to.have.$class("foo").and
  .to.have.$class("bar");
```

See: [http://api.jquery.com/hasClass/]()

### `.$visible`

Asserts that the element is visible.

```js
expect($("<div>&nbsp;</div>"))
  .to.be.$visible;
```

See: [http://api.jquery.com/visible-selector/]()

### `.$hidden`

Asserts that the element is hidden.

```js
expect($("<div style=\"display: none\" />"))
  .to.be.$hidden;
```

See: [http://api.jquery.com/hidden-selector/]()

### `.$attr(name, string)`

Asserts that the target has exactly the given named attribute, or
asserts the target contains a subset of the attribute when using the
`include` or `contain` modifiers.

```js
expect($("<div id=\"hi\" foo=\"bar time\" />"))
  .to.have.$attr("id", "hi").and
  .to.contain.$attr("foo", "bar");
```

See: [http://api.jquery.com/attr/]()

### `.$prop(name, value)`

Asserts that the target has exactly the given named property.

```js
expect($("<input type=\"checkbox\" checked=\"checked\" />"))
  .to.have.$prop("checked", true).and
  .to.have.$prop("type", "checkbox");
```

See: [http://api.jquery.com/prop/]()

### `.$html(string)`

Asserts that the target has exactly the given HTML, or
asserts the target contains a subset of the HTML when using the
`include` or `contain` modifiers.

```js
expect($("<div><span>foo</span></div>"))
  .to.have.$html("<span>foo</span>").and
  .to.contain.$html("foo");
```

See: [http://api.jquery.com/html/]()

### `.$text(string)`

Asserts that the target has exactly the given text, or
asserts the target contains a subset of the text when using the
`include` or `contain` modifiers.

```js
expect($("<div><span>foo</span> bar</div>"))
  .to.have.$text("foo bar").and
  .to.contain.$text("foo");
```

See: [http://api.jquery.com/text/]()

### `.$css(name, string)`

Asserts that the target has exactly the given CSS property.

```js
expect($("<div style=\"width: 50px; border: 1px dotted black;\" />"))
  .to.have.$css("width", "50px").and
  .to.have.$css("border-top-style", "dotted");
```

See: [http://api.jquery.com/css/]()

## Contributions

Please see the [Contributions Guide](./CONTRIBUTING.md) for how to help out
with the plugin.

We test all changes with [Travis CI][trav]. Here's our current
[build status][trav_site]:

[![Build Status][trav_img]][trav_site]

[trav]: https://travis-ci.org/
[trav_img]: https://api.travis-ci.org/FormidableLabs/chai-jq.png
[trav_site]: https://travis-ci.org/FormidableLabs/chai-jq

## Licenses
All code not otherwise specified is Copyright 2013 Ryan Roemer.
Released under the [MIT](./LICENSE.txt) License.

This repository contains various libraries from other folks, and are licensed
as follows:

* [jQuery][jquery] is Copyright jQuery Foundation and licensed under the
  [MIT](https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt) license.

* [Mocha][mocha] is Copyright TJ Holowaychuk and licensed under the
  [MIT](https://github.com/visionmedia/mocha/blob/master/LICENSE) license.

* [Chai][chai] is Copyright Jake Luer and licensed under the
  [BSD](https://github.com/cjohansen/Sinon.JS/blob/master/LICENSE) license.

* [Sinon.JS][sinon] is Copyright Christian Johansen and licensed under the
  [BSD](https://github.com/cjohansen/Sinon.JS/blob/master/LICENSE) license.

* [Mocha-PhantomJS][mocha-phantom] is Copyright Ken Collins and licensed under the
  [MIT](https://github.com/metaskills/mocha-phantomjs/blob/master/MIT-LICENSE)
  license.

* [Pure][pure] is Copyright Yahoo! and licensed under the
  [MIT](https://github.com/yui/pure/blob/master/LICENSE.md)
  license.

[jquery]: https://github.com/jquery/jquery
[mocha]: https://github.com/visionmedia/mocha
[mocha-phantom]: https://github.com/metaskills/mocha-phantomjs
[phantom]: http://phantomjs.org/
[phantom-install]: http://phantomjs.org/download.html
[chai]: https://github.com/chaijs/chai
[sinon]: https://github.com/cjohansen/Sinon.JS
[pure]: https://github.com/yui/pure/
