(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.LogsHubAutoComplete = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LogsHubAutoComplete =
/*#__PURE__*/
function () {
  function LogsHubAutoComplete(settings) {
    _classCallCheck(this, LogsHubAutoComplete);

    this.$container = $(settings.container);
    this.name = settings.name || '';
    this.pubKey = settings.pubKey;
    this.domain = settings.domain;
    this.redirectUri = settings.redirectUri;
    this.backdrop = settings.fullscreen ? true : settings.backdrop || false;
    this.fullscreen = settings.fullscreen || false;
    this.classNames = settings.classNames;
    this.minLength = settings.minLength || 1;
    this.startupQuery = settings.startupQuery || '';

    if (this.startupQuery !== '') {
      // if startup query exists, then min length must be 0
      this.minLength = 0;
    }

    this.labels = _objectSpread({
      placeholder: 'Start typing...',
      button: 'Search',
      resultNotFound: 'Hit enter to search: '
    }, settings.labels);
    this.features = settings.features || 'categories,products';
    this.limit = settings.limit || 8;
    this.categoryLimit = settings.categoryLimit;
    this.defaultCurrency = settings.defaultCurrency;
    this.defaultImages = settings.defaultImages;
    this.categories = settings.categories;
    this.datasets = (settings.datasets || [{}]).map(function (source) {
      return {
        features: source.features,
        templates: source.templates || {}
      };
    });
    this.onSelect = settings.onSelect;
    this.onSubmit = settings.onSubmit;
    this.transform = settings.transform;
    this.cache = {};
  }

  _createClass(LogsHubAutoComplete, [{
    key: "init",
    value: function init() {
      this.render();
      this.initSearch();
      this.initSubmit();
    }
  }, {
    key: "render",
    value: function render() {
      this.$container.html("<form class=\"lh-form ".concat(this.categories ? 'lh-form--categories' : '', "\">\n              <div class=\"lh-form__row\">\n                <div class=\"lh-form__input\">\n                  <input class=\"form-control\" placeholder=\"").concat(this.labels.placeholder, "\" />\n                </div>") + (this.categories ? "<div class=\"lh-form__select\">\n                    <select class=\"form-control tt-select\">".concat(this.buildOptions(this.categories), "</select></div>") : '') + "<div class=\"lh-form__button\">\n                  <button type=\"submit\" class=\"btn\">".concat(this.labels.button, "</button>\n                </div>\n              </div>") + (this.fullscreen ? '<a href="#" class="lh-close"></a>' : '') + '</form>');
    }
  }, {
    key: "initSearch",
    value: function initSearch() {
      var _this$$container$find;

      (_this$$container$find = this.$container.find('input')).typeahead.apply(_this$$container$find, [{
        hint: true,
        highlight: true,
        minLength: this.minLength,
        classNames: this.classNames
      }].concat(_toConsumableArray(this.getDataSources()))).on('typeahead:select', this.handleSelect.bind(this)).on('typeahead:open', this.handleOpen.bind(this)).on('typeahead:close', this.handleClose.bind(this));
    }
  }, {
    key: "initSubmit",
    value: function initSubmit() {
      var _this = this;

      this.$container.find('form').on('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (typeof _this.onSubmit === 'function') {
          return _this.onSubmit(event);
        }

        var query = (event.currentTarget.getElementsByClassName('tt-input')[0] || {}).value;

        _this.searchRedirect(query || '');
      });
    }
  }, {
    key: "buildOptions",
    value: function buildOptions(options) {
      var _this2 = this;

      var $categories = '';
      options.forEach(function (option) {
        if (!option.categories) {
          $categories += "<option value=\"".concat(option.value, "\">").concat(option.label, "</option>");
        } else {
          $categories += "<optgroup label=\"".concat(option.label, "\">").concat(_this2.buildOptions(option.categories), "</optgroup>");
        }
      });
      return $categories;
    }
  }, {
    key: "getDataSources",
    value: function getDataSources() {
      var _this3 = this;

      return this.datasets.map(function (_source) {
        return {
          name: _this3.name,
          limit: _this3.limit + 2,
          autoSelect: true,
          source: function source(query, callbackSync, callback) {
            var transformer = function transformer(data, callback) {
              _this3.cache[query].data = data;
              var categories = data.categories.docs,
                  products = data.products.docs;
              var categoryResults = Object.keys(categories).map(function (key) {
                return _objectSpread({}, categories[key], {
                  is_category: true
                });
              });
              var productResults = Object.keys(products).map(function (key) {
                return _objectSpread({}, products[key], {
                  currency: products[key].currency || _this3.defaultCurrency,
                  url_image: products[key].url_image || _this3.getRandomImage(_this3.defaultImages),
                  is_category: false
                });
              });
              var rows = categoryResults.concat(productResults);

              switch (_source.features) {
                case 'products':
                  rows = productResults;
                  break;

                case 'categories':
                  rows = categoryResults;
                  break;
              }

              if (typeof _this3.transform === 'function') {
                return callback(_this3.transform(rows));
              }

              return callback(rows);
            };

            if (query === '') {
              query = _this3.startupQuery;
            }

            if (typeof _this3.cache[query] !== 'undefined') {
              if (_this3.cache[query].data) {
                return transformer(_this3.cache[query].data, callbackSync);
              }

              return _this3.cache[query].then(function (data) {
                return transformer(data, callback);
              });
            }

            _this3.cache[query] = _this3.searchRequest(query);
            return _this3.cache[query].then(function (data) {
              return transformer(data, callback);
            });
          },
          displayKey: 'name',
          templates: {
            suggestion: function suggestion(data) {
              if (typeof _source.templates.suggestion === 'function') {
                return _source.templates.suggestion(data);
              }

              if (typeof _source.templates.suggestion === 'string') {
                return _source.templates.suggestion;
              }

              return "<div class=\"lh-result__row\">".concat(data.name, "</div>");
            },
            notFound: function notFound(data) {
              if (typeof _source.templates.notFound === 'function') {
                return _source.templates.notFound(data);
              }

              if (typeof _source.templates.notFound === 'string') {
                return _source.templates.notFound;
              }

              return "<div class=\"lh-result__not-found\"><span class=\"label\">".concat(_this3.labels.resultNotFound, "</span><span class=\"value\">").concat(data.query, "</span></div>");
            }
          }
        };
      });
    }
  }, {
    key: "searchRequest",
    value: function searchRequest(query) {
      return $.ajax({
        url: "https://".concat(this.domain, "/v1/products/search"),
        data: {
          pub_key: this.pubKey,
          q: query,
          features: this.features,
          limit: this.limit,
          category: this.$container.find('.tt-select').val(),
          limit_cat: this.categoryLimit
        },
        dataType: 'jsonp'
      });
    }
  }, {
    key: "getRandomImage",
    value: function getRandomImage(images) {
      return images ? images[Math.floor(Math.random() * images.length)] : null;
    }
  }, {
    key: "buildBackdropLayout",
    value: function buildBackdropLayout() {
      if (!this.backdrop) {
        return;
      }

      var customClass = this.fullscreen ? 'lh-fullscreen' : this.backdrop ? 'lh-backdrop' : '';

      if (!this.$backdropOverlay) {
        this.backdropCss = {
          'z-index': 1040
        };
        this.$backdropOverlay = $('<div/>', {
          class: "".concat(customClass, "-overlay"),
          css: this.backdropCss
        }).insertAfter(this.$container);
      }

      this.$backdropOverlay.css('display', 'block');
      this.$container.addClass(customClass).css({
        'z-index': this.backdropCss['z-index'] + 1,
        position: this.fullscreen ? 'fixed' : 'relative'
      });
    }
  }, {
    key: "handleSelect",
    value: function handleSelect(event, suggestion, dataset) {
      if (typeof this.onSelect === 'function') {
        return this.onSelect(event, suggestion, dataset);
      }

      this.searchRedirect(suggestion.name);
    }
  }, {
    key: "searchRedirect",
    value: function searchRedirect(query) {
      window.location.href = this.createUrl("q=".concat(query));
    }
  }, {
    key: "createUrl",
    value: function createUrl(param) {
      var url = this.redirectUri || location.href;
      url += (url.split('?')[1] ? '&' : '?') + param;
      return url;
    }
  }, {
    key: "handleOpen",
    value: function handleOpen() {
      this.buildBackdropLayout();
    }
  }, {
    key: "handleClose",
    value: function handleClose() {
      if (this.backdrop) {
        var type = this.fullscreen ? 'fullscreen' : this.backdrop ? 'backdrop' : '';
        this.$container.removeClass("lh-".concat(type)).css({
          'z-index': 'initial',
          position: 'relative'
        });
        this.$backdropOverlay.css('display', 'none');
      }
    }
  }]);

  return LogsHubAutoComplete;
}();

module.exports = LogsHubAutoComplete;

},{}]},{},[1])(1)
});
