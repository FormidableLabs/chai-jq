Chai-jQ
=======

`chai-jq` is an alternate plugin for the [Chai](http://chaijs.com/) assertion
library to provide jQuery-specific assertions.

## Usage

You can install `chai-jq` via the following package managers:

* [NPM](https://npmjs.org/package/chai-jq): `npm install chai-jq`
* [Bower](http://bower.io/): `bower install chai-jq`

See the [integration notes](#integration) below to properly patch Chai with
the plugin's asserts in different environments (browser, AMD, Node.js).

To see a comprehensive collection of the plugin's assertions in action, see the
project's [test page](./test/test.html).

## Assertions

`chai-jq` adds assertions that work more or less like any other Chai assertion.

### Integration

`chai-jq` works in your browser, with AMD/RequireJS, and in Node.js with
JsDom.

**Standard Browser**: To use in a standard HTML page, include `chai-jq.js`
after Chai.

```html
<script src="chai.js"></script>
<script src="chai-jq.js"></script>
```

**AMD Browser**: To use in a RequireJS/AMD page, require in `chai-jq` and
inject it into Chai before your test imports / runners begin:

```js
require(["chai", "../chai-jq"], function (chai, plugin) {
  // Inject plugin.
  chai.use(plugin);

  // Rest of your test code here...
});
```

**Node.js / JsDom**: To use in Node.js/JsDom, require in `chai-jq` and
inject it into Chai before your test imports / runners begin:

```js
var chai    = require("chai");
var plugin  = require("chai-jq");

// Inject plugin.
chai.use(plugin);

// Rest of test code here...
```

### Object Context Changes

One slight difference from how assertions in `chai-jq` work from Chai and other
plugins is the switching of object context for certain assertions, currently:

* `$attr`
* `$prop`

In general usage, the object under test (e.g., the thing wrapped in an
`expect()`) remains the current context, so you can do something like:

```js
var $elem = $("<div id=\"hi\" foo=\"bar time\" />");

expect($elem)
  .to.have.$attr("id", "hi").and
  .to.contain.$attr("foo", "bar");
```

In the above example, the jQuery object `$elem` remains the object under
assertion for both `$attr` calls. However, in the special case for one of the
enumerated assertions above where:

* There is no **expected** assertion value given; **and**,
* There are no negations (e.g., `not`) used in a chain.

Then, the object under assertion switches to the **value** of the effective
method called. So, taking our example again, and calling `$attr()` without
an expected value, we would have:

```js
var $elem = $("<div id=\"hi\" foo=\"bar time\" />");

expect($elem).to.have.$attr("foo").and
  .to.equal("bar time").and
  .to.match(/^b/).and
  .to.not.have.length(2);
```

In the above example here, the object under assertion becomes the string
`"bar time"` immediately after the call to `$attr("foo")` with no expected
value.


## Plugin API

* [`$visible`](#-visible)
* [`$hidden`](#-hidden)
* [`$val(expected, [message])`](#-val-expected-message-)
* [`$class(expected, [message])`](#-class-expected-message-)
* [`$attr(name, expected, [message])`](#-attr-name-expected-message-)
* [`$prop(name, expected, [message])`](#-prop-name-expected-message-)
* [`$html(expected, [message])`](#-html-expected-message-)
* [`$text(expected, [message])`](#-text-expected-message-)
* [`$css(expected, [message])`](#-css-expected-message-)

### `$visible`


Asserts that the element is visible.

*Node.js/JsDom Note*: JsDom does not currently infer zero-sized or
hidden parent elements as hidden / visible appropriately.

```js
expect($("<div>&nbsp;</div>"))
  .to.be.$visible;
```

See: [http://api.jquery.com/visible-selector/](http://api.jquery.com/visible-selector/)

### `$hidden`


Asserts that the element is hidden.

*Node.js/JsDom Note*: JsDom does not currently infer zero-sized or
hidden parent elements as hidden / visible appropriately.

```js
expect($("<div style=\"display: none\" />"))
  .to.be.$hidden;
```

See: [http://api.jquery.com/hidden-selector/](http://api.jquery.com/hidden-selector/)

### `$val(expected, [message])`
* **expected** (`String|RegExp`) value
* **message** (`String`) _optional_


Asserts that the element value matches a string or regular expression.

```js
expect($("<input value='foo' />"))
  .to.have.$val("foo").and
  .to.have.$val(/^foo/);
```

See: [http://api.jquery.com/val/](http://api.jquery.com/val/)

### `$class(expected, [message])`
* **expected** (`String`) class name
* **message** (`String`) _optional_


Asserts that the element has a class match.

```js
expect($("<div class='foo bar' />"))
  .to.have.$class("foo").and
  .to.have.$class("bar");
```

See: [http://api.jquery.com/hasClass/](http://api.jquery.com/hasClass/)

### `$attr(name, expected, [message])`
* **name** (`String`) attribute name
* **expected** (`String`) attribute content
* **message** (`String`) _optional_


Asserts that the target has exactly the given named attribute, or
asserts the target contains a subset of the attribute when using the
`include` or `contain` modifiers.

```js
expect($("<div id=\"hi\" foo=\"bar time\" />"))
  .to.have.$attr("id", "hi").and
  .to.contain.$attr("foo", "bar");
```

See: [http://api.jquery.com/attr/](http://api.jquery.com/attr/)

### `$prop(name, expected, [message])`
* **name** (`String`) property name
* **expected** (`Object`) property value
* **message** (`String`) _optional_


Asserts that the target has exactly the given named property.

```js
expect($("<input type=\"checkbox\" checked=\"checked\" />"))
  .to.have.$prop("checked", true).and
  .to.have.$prop("type", "checkbox");
```

See: [http://api.jquery.com/prop/](http://api.jquery.com/prop/)

### `$html(expected, [message])`
* **expected** (`String`) HTML content
* **message** (`String`) _optional_


Asserts that the target has exactly the given HTML, or
asserts the target contains a subset of the HTML when using the
`include` or `contain` modifiers.

```js
expect($("<div><span>foo</span></div>"))
  .to.have.$html("<span>foo</span>").and
  .to.contain.$html("foo");
```

See: [http://api.jquery.com/html/](http://api.jquery.com/html/)

### `$text(expected, [message])`
* **expected** (`String`) text content
* **message** (`String`) _optional_


Asserts that the target has exactly the given text, or
asserts the target contains a subset of the text when using the
`include` or `contain` modifiers.

```js
expect($("<div><span>foo</span> bar</div>"))
  .to.have.$text("foo bar").and
  .to.contain.$text("foo");
```

See: [http://api.jquery.com/text/](http://api.jquery.com/text/)

### `$css(expected, [message])`
* **expected** (`String`) CSS property content
* **message** (`String`) _optional_


Asserts that the target has exactly the given CSS property, or
asserts the target contains a subset of the CSS when using the
`include` or `contain` modifiers.

*Node.js/JsDom Note*: Computed CSS properties are not correctly
inferred as of JsDom v0.8.8. Explicit ones should get matched exactly.

*Browser Note*: Explicit CSS properties are sometimes not matched
(in contrast to Node.js), so the plugin performs an extra check against
explicit `style` properties for a match. May still have other wonky
corner cases.

*PhantomJS Note*: PhantomJS also is fairly wonky and unpredictable with
respect to CSS / styles, especially those that come from CSS classes
and not explicity `style` attributes.

```js
expect($("<div style=\"width: 50px; border: 1px dotted black;\" />"))
  .to.have.$css("width", "50px").and
  .to.have.$css("border-top-style", "dotted");
```

See: [http://api.jquery.com/css/](http://api.jquery.com/css/)

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
