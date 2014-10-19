History
=======

## 0.0.8

* Add name of `<EMPTY OBJECT>` for zero-length selectors.
* Add coverage enforcement and get to 100% coverage.
* Add coverage, static analysis integrations.
* Add Sauce Labs integration.

## 0.0.7

* API: Add `$data`. [*[@niki4810][]*]

## 0.0.6

* Switch over to Gulp, removing Grunt.

## 0.0.5

* Add property presence detection and object under assertion context changing
  for `$prop`, `$attr`.
* Separate out document generation to Grunt task file and add more JsDoc-style
  params in Markdown output.

## 0.0.4

* Remove NPM `postinstall` script in normal deployment.

## 0.0.3

* Switch to manual plugin injection for AMD (matches Node.js method).
* Add fallback to "style" property for `$css`.
* Add `contains` support for `$css` assert.
* Add support for Node.js with JsDom.

## 0.0.2

* Extension of API with: `$css`, `$visible`, `$hidden`. [*[@atimb][]*]

## 0.0.1

* Initial release with API: `$val`, `$class`, `$attr`, `$prop`, `$html`,
  `$text`.

[@atimb]: https://github.com/atimb
[@niki4810]: https://github.com/niki4810
[@ryan-roemer]: https://github.com/ryan-roemer
