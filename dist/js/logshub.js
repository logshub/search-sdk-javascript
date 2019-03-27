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
        minLength: 1,
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDQU0sbUI7OztBQUNGLCtCQUFZLFFBQVosRUFBc0I7QUFBQTs7QUFDbEIsU0FBSyxVQUFMLEdBQWtCLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBVixDQUFuQjtBQUNBLFNBQUssSUFBTCxHQUFZLFFBQVEsQ0FBQyxJQUFULElBQWlCLEVBQTdCO0FBQ0EsU0FBSyxNQUFMLEdBQWMsUUFBUSxDQUFDLE1BQXZCO0FBQ0EsU0FBSyxNQUFMLEdBQWMsUUFBUSxDQUFDLE1BQXZCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLFFBQVEsQ0FBQyxXQUE1QjtBQUNBLFNBQUssUUFBTCxHQUFnQixRQUFRLENBQUMsVUFBVCxHQUFzQixJQUF0QixHQUE4QixRQUFRLENBQUMsUUFBVCxJQUFxQixLQUFuRTtBQUNBLFNBQUssVUFBTCxHQUFrQixRQUFRLENBQUMsVUFBVCxJQUF1QixLQUF6QztBQUNBLFNBQUssVUFBTCxHQUFrQixRQUFRLENBQUMsVUFBM0I7QUFFQSxTQUFLLE1BQUw7QUFDSSxNQUFBLFdBQVcsRUFBRSxpQkFEakI7QUFFSSxNQUFBLE1BQU0sRUFBRSxRQUZaO0FBR0ksTUFBQSxjQUFjLEVBQUU7QUFIcEIsT0FJTyxRQUFRLENBQUMsTUFKaEI7QUFPQSxTQUFLLFFBQUwsR0FBZ0IsUUFBUSxDQUFDLFFBQVQsSUFBcUIscUJBQXJDO0FBQ0EsU0FBSyxLQUFMLEdBQWEsUUFBUSxDQUFDLEtBQVQsSUFBa0IsQ0FBL0I7QUFDQSxTQUFLLGFBQUwsR0FBcUIsUUFBUSxDQUFDLGFBQTlCO0FBQ0EsU0FBSyxlQUFMLEdBQXVCLFFBQVEsQ0FBQyxlQUFoQztBQUNBLFNBQUssYUFBTCxHQUFxQixRQUFRLENBQUMsYUFBOUI7QUFFQSxTQUFLLFVBQUwsR0FBa0IsUUFBUSxDQUFDLFVBQTNC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c291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjbGFzcyBMb2dzSHViQXV0b0NvbXBsZXRlIHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzKSB7XHJcbiAgICAgICAgdGhpcy4kY29udGFpbmVyID0gJChzZXR0aW5ncy5jb250YWluZXIpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IHNldHRpbmdzLm5hbWUgfHwgJyc7XHJcbiAgICAgICAgdGhpcy5wdWJLZXkgPSBzZXR0aW5ncy5wdWJLZXk7XHJcbiAgICAgICAgdGhpcy5kb21haW4gPSBzZXR0aW5ncy5kb21haW47XHJcbiAgICAgICAgdGhpcy5yZWRpcmVjdFVyaSA9IHNldHRpbmdzLnJlZGlyZWN0VXJpO1xyXG4gICAgICAgIHRoaXMuYmFja2Ryb3AgPSBzZXR0aW5ncy5mdWxsc2NyZWVuID8gdHJ1ZSA6IChzZXR0aW5ncy5iYWNrZHJvcCB8fCBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5mdWxsc2NyZWVuID0gc2V0dGluZ3MuZnVsbHNjcmVlbiB8fCBmYWxzZTtcclxuICAgICAgICB0aGlzLmNsYXNzTmFtZXMgPSBzZXR0aW5ncy5jbGFzc05hbWVzO1xyXG5cclxuICAgICAgICB0aGlzLmxhYmVscyA9IHtcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6ICdTdGFydCB0eXBpbmcuLi4nLFxyXG4gICAgICAgICAgICBidXR0b246ICdTZWFyY2gnLFxyXG4gICAgICAgICAgICByZXN1bHROb3RGb3VuZDogJ0hpdCBlbnRlciB0byBzZWFyY2g6ICcsXHJcbiAgICAgICAgICAgIC4uLnNldHRpbmdzLmxhYmVsc1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZmVhdHVyZXMgPSBzZXR0aW5ncy5mZWF0dXJlcyB8fCAnY2F0ZWdvcmllcyxwcm9kdWN0cyc7XHJcbiAgICAgICAgdGhpcy5saW1pdCA9IHNldHRpbmdzLmxpbWl0IHx8IDg7XHJcbiAgICAgICAgdGhpcy5jYXRlZ29yeUxpbWl0ID0gc2V0dGluZ3MuY2F0ZWdvcnlMaW1pdDtcclxuICAgICAgICB0aGlzLmRlZmF1bHRDdXJyZW5jeSA9IHNldHRpbmdzLmRlZmF1bHRDdXJyZW5jeTtcclxuICAgICAgICB0aGlzLmRlZmF1bHRJbWFnZXMgPSBzZXR0aW5ncy5kZWZhdWx0SW1hZ2VzO1xyXG5cclxuICAgICAgICB0aGlzLmNhdGVnb3JpZXMgPSBzZXR0aW5ncy5jYXRlZ29yaWVzO1xyXG5cclxuICAgICAgICB0aGlzLmRhdGFzZXRzID0gKHNldHRpbmdzLmRhdGFzZXRzIHx8IFt7fV0pLm1hcCgoc291cmNlKSA9PiAoe1xyXG4gICAgICAgICAgICBmZWF0dXJlczogc291cmNlLmZlYXR1cmVzLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZXM6IHNvdXJjZS50ZW1wbGF0ZXMgfHwge31cclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIHRoaXMub25TZWxlY3QgPSBzZXR0aW5ncy5vblNlbGVjdDtcclxuICAgICAgICB0aGlzLm9uU3VibWl0ID0gc2V0dGluZ3Mub25TdWJtaXQ7XHJcblxyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtID0gc2V0dGluZ3MudHJhbnNmb3JtO1xyXG5cclxuICAgICAgICB0aGlzLmNhY2hlID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIHRoaXMuaW5pdFNlYXJjaCgpO1xyXG4gICAgICAgIHRoaXMuaW5pdFN1Ym1pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLiRjb250YWluZXIuaHRtbChcclxuICAgICAgICAgICAgYDxmb3JtIGNsYXNzPVwibGgtZm9ybSAke3RoaXMuY2F0ZWdvcmllcyA/ICdsaC1mb3JtLS1jYXRlZ29yaWVzJyA6ICcnfVwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaC1mb3JtX19yb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaC1mb3JtX19pbnB1dFwiPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBwbGFjZWhvbGRlcj1cIiR7dGhpcy5sYWJlbHMucGxhY2Vob2xkZXJ9XCIgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PmAgK1xyXG4gICAgICAgICAgICAgICAgKHRoaXMuY2F0ZWdvcmllcyA/IGA8ZGl2IGNsYXNzPVwibGgtZm9ybV9fc2VsZWN0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cImZvcm0tY29udHJvbCB0dC1zZWxlY3RcIj4ke3RoaXMuYnVpbGRPcHRpb25zKHRoaXMuY2F0ZWdvcmllcyl9PC9zZWxlY3Q+PC9kaXY+YCA6ICcnKSArXHJcbiAgICAgICAgICAgICAgICBgPGRpdiBjbGFzcz1cImxoLWZvcm1fX2J1dHRvblwiPlxyXG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0blwiPiR7dGhpcy5sYWJlbHMuYnV0dG9ufTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+YCArXHJcbiAgICAgICAgICAgICh0aGlzLmZ1bGxzY3JlZW4gPyAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImxoLWNsb3NlXCI+PC9hPicgOiAnJykgK1xyXG4gICAgICAgICAgICAnPC9mb3JtPidcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRTZWFyY2goKSB7XHJcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLmZpbmQoJ2lucHV0JykudHlwZWFoZWFkKHtcclxuICAgICAgICAgICAgaGludDogdHJ1ZSxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0OiB0cnVlLFxyXG4gICAgICAgICAgICBtaW5MZW5ndGg6IDEsXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZXM6IHRoaXMuY2xhc3NOYW1lc1xyXG4gICAgICAgIH0sIC4uLnRoaXMuZ2V0RGF0YVNvdXJjZXMoKSlcclxuICAgICAgICAgICAgLm9uKCd0eXBlYWhlYWQ6c2VsZWN0JywgdGhpcy5oYW5kbGVTZWxlY3QuYmluZCh0aGlzKSlcclxuICAgICAgICAgICAgLm9uKCd0eXBlYWhlYWQ6b3BlbicsIHRoaXMuaGFuZGxlT3Blbi5iaW5kKHRoaXMpKVxyXG4gICAgICAgICAgICAub24oJ3R5cGVhaGVhZDpjbG9zZScsIHRoaXMuaGFuZGxlQ2xvc2UuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFN1Ym1pdCgpIHtcclxuICAgICAgICB0aGlzLiRjb250YWluZXIuZmluZCgnZm9ybScpLm9uKCdzdWJtaXQnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub25TdWJtaXQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm9uU3VibWl0KGV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgcXVlcnkgPSAoZXZlbnQuY3VycmVudFRhcmdldC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0dC1pbnB1dCcpWzBdIHx8IHt9KS52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoUmVkaXJlY3QocXVlcnkgfHwgJycpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGJ1aWxkT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICAgICAgbGV0ICRjYXRlZ29yaWVzID0gJyc7XHJcblxyXG4gICAgICAgIG9wdGlvbnMuZm9yRWFjaCgob3B0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghb3B0aW9uLmNhdGVnb3JpZXMpIHtcclxuICAgICAgICAgICAgICAgICRjYXRlZ29yaWVzICs9IGA8b3B0aW9uIHZhbHVlPVwiJHtvcHRpb24udmFsdWV9XCI+JHtvcHRpb24ubGFiZWx9PC9vcHRpb24+YDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRjYXRlZ29yaWVzICs9IGA8b3B0Z3JvdXAgbGFiZWw9XCIke29wdGlvbi5sYWJlbH1cIj4ke3RoaXMuYnVpbGRPcHRpb25zKG9wdGlvbi5jYXRlZ29yaWVzKX08L29wdGdyb3VwPmBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gJGNhdGVnb3JpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGF0YVNvdXJjZXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YXNldHMubWFwKChzb3VyY2UpID0+ICh7XHJcbiAgICAgICAgICAgIG5hbWU6IHRoaXMubmFtZSxcclxuICAgICAgICAgICAgbGltaXQ6IHRoaXMubGltaXQgKyAyLFxyXG4gICAgICAgICAgICBhdXRvU2VsZWN0OiB0cnVlLFxyXG4gICAgICAgICAgICBzb3VyY2U6IChxdWVyeSwgY2FsbGJhY2tTeW5jLCBjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtZXIgPSAoZGF0YSwgY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlW3F1ZXJ5XS5kYXRhID0gZGF0YTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBjYXRlZ29yaWVzOiB7IGRvY3M6IGNhdGVnb3JpZXMgfSwgcHJvZHVjdHM6IHsgZG9jczogcHJvZHVjdHMgfSB9ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYXRlZ29yeVJlc3VsdHMgPSBPYmplY3Qua2V5cyhjYXRlZ29yaWVzKS5tYXAoKGtleSkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uY2F0ZWdvcmllc1trZXldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc19jYXRlZ29yeTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvZHVjdFJlc3VsdHMgPSBPYmplY3Qua2V5cyhwcm9kdWN0cykubWFwKChrZXkpID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnByb2R1Y3RzW2tleV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbmN5OiBwcm9kdWN0c1trZXldLmN1cnJlbmN5IHx8IHRoaXMuZGVmYXVsdEN1cnJlbmN5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmxfaW1hZ2U6IHByb2R1Y3RzW2tleV0udXJsX2ltYWdlIHx8IHRoaXMuZ2V0UmFuZG9tSW1hZ2UodGhpcy5kZWZhdWx0SW1hZ2VzKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNfY2F0ZWdvcnk6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgcm93cyA9IGNhdGVnb3J5UmVzdWx0cy5jb25jYXQocHJvZHVjdFJlc3VsdHMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHNvdXJjZS5mZWF0dXJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdwcm9kdWN0cyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gcHJvZHVjdFJlc3VsdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY2F0ZWdvcmllcyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dzID0gY2F0ZWdvcnlSZXN1bHRzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMudHJhbnNmb3JtID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayh0aGlzLnRyYW5zZm9ybShyb3dzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2socm93cyk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5jYWNoZVtxdWVyeV0gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2FjaGVbcXVlcnldLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRyYW5zZm9ybWVyKHRoaXMuY2FjaGVbcXVlcnldLmRhdGEsIGNhbGxiYWNrU3luYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVtxdWVyeV0udGhlbigoZGF0YSkgPT4gdHJhbnNmb3JtZXIoZGF0YSwgY2FsbGJhY2spKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlW3F1ZXJ5XSA9IHRoaXMuc2VhcmNoUmVxdWVzdChxdWVyeSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVtxdWVyeV0udGhlbigoZGF0YSkgPT4gdHJhbnNmb3JtZXIoZGF0YSwgY2FsbGJhY2spKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGlzcGxheUtleTogJ25hbWUnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZXM6IHtcclxuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb246IChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzb3VyY2UudGVtcGxhdGVzLnN1Z2dlc3Rpb24gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS50ZW1wbGF0ZXMuc3VnZ2VzdGlvbihkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc291cmNlLnRlbXBsYXRlcy5zdWdnZXN0aW9uID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlLnRlbXBsYXRlcy5zdWdnZXN0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwibGgtcmVzdWx0X19yb3dcIj4ke2RhdGEubmFtZX08L2Rpdj5gO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG5vdEZvdW5kOiAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc291cmNlLnRlbXBsYXRlcy5ub3RGb3VuZCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlLnRlbXBsYXRlcy5ub3RGb3VuZChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc291cmNlLnRlbXBsYXRlcy5ub3RGb3VuZCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS50ZW1wbGF0ZXMubm90Rm91bmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJsaC1yZXN1bHRfX25vdC1mb3VuZFwiPjxzcGFuIGNsYXNzPVwibGFiZWxcIj4ke3RoaXMubGFiZWxzLnJlc3VsdE5vdEZvdW5kfTwvc3Bhbj48c3BhbiBjbGFzcz1cInZhbHVlXCI+JHtkYXRhLnF1ZXJ5fTwvc3Bhbj48L2Rpdj5gO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkpXHJcbiAgICB9XHJcblxyXG4gICAgc2VhcmNoUmVxdWVzdChxdWVyeSkge1xyXG4gICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IGBodHRwczovLyR7dGhpcy5kb21haW59L3YxL3Byb2R1Y3RzL3NlYXJjaGAsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIHB1Yl9rZXk6IHRoaXMucHViS2V5LFxyXG4gICAgICAgICAgICAgICAgcTogcXVlcnksXHJcbiAgICAgICAgICAgICAgICBmZWF0dXJlczogdGhpcy5mZWF0dXJlcyxcclxuICAgICAgICAgICAgICAgIGxpbWl0OiB0aGlzLmxpbWl0LFxyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IHRoaXMuJGNvbnRhaW5lci5maW5kKCcudHQtc2VsZWN0JykudmFsKCksXHJcbiAgICAgICAgICAgICAgICBsaW1pdF9jYXQ6IHRoaXMuY2F0ZWdvcnlMaW1pdFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb25wJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJhbmRvbUltYWdlKGltYWdlcykge1xyXG4gICAgICAgIHJldHVybiBpbWFnZXMgPyBpbWFnZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaW1hZ2VzLmxlbmd0aCldIDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBidWlsZEJhY2tkcm9wTGF5b3V0KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5iYWNrZHJvcCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjdXN0b21DbGFzcyA9IHRoaXMuZnVsbHNjcmVlbiA/ICdsaC1mdWxsc2NyZWVuJyA6ICh0aGlzLmJhY2tkcm9wID8gJ2xoLWJhY2tkcm9wJyA6ICcnKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLiRiYWNrZHJvcE92ZXJsYXkpIHtcclxuICAgICAgICAgICAgdGhpcy5iYWNrZHJvcENzcyA9IHtcclxuICAgICAgICAgICAgICAgICd6LWluZGV4JzogMTA0MFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kYmFja2Ryb3BPdmVybGF5ID0gJCgnPGRpdi8+Jywge1xyXG4gICAgICAgICAgICAgICAgY2xhc3M6IGAke2N1c3RvbUNsYXNzfS1vdmVybGF5YCxcclxuICAgICAgICAgICAgICAgIGNzczogdGhpcy5iYWNrZHJvcENzc1xyXG4gICAgICAgICAgICB9KS5pbnNlcnRBZnRlcih0aGlzLiRjb250YWluZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy4kYmFja2Ryb3BPdmVybGF5LmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG5cclxuICAgICAgICB0aGlzLiRjb250YWluZXIuYWRkQ2xhc3MoY3VzdG9tQ2xhc3MpLmNzcyh7XHJcbiAgICAgICAgICAgICd6LWluZGV4JzogdGhpcy5iYWNrZHJvcENzc1snei1pbmRleCddICsgMSxcclxuICAgICAgICAgICAgcG9zaXRpb246IHRoaXMuZnVsbHNjcmVlbiA/ICdmaXhlZCcgOiAncmVsYXRpdmUnXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlU2VsZWN0KGV2ZW50LCBzdWdnZXN0aW9uLCBkYXRhc2V0KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9uU2VsZWN0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9uU2VsZWN0KGV2ZW50LCBzdWdnZXN0aW9uLCBkYXRhc2V0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2VhcmNoUmVkaXJlY3Qoc3VnZ2VzdGlvbi5uYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWFyY2hSZWRpcmVjdChxdWVyeSkge1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdGhpcy5jcmVhdGVVcmwoYHE9JHtxdWVyeX1gKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVVcmwocGFyYW0pIHtcclxuICAgICAgICBsZXQgdXJsID0gdGhpcy5yZWRpcmVjdFVyaSB8fCBsb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgIHVybCArPSAodXJsLnNwbGl0KCc/JylbMV0gPyAnJic6Jz8nKSArIHBhcmFtO1xyXG4gICAgICAgIHJldHVybiB1cmw7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlT3BlbigpIHtcclxuICAgICAgICB0aGlzLmJ1aWxkQmFja2Ryb3BMYXlvdXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVDbG9zZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5iYWNrZHJvcCkge1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlID0gdGhpcy5mdWxsc2NyZWVuID8gJ2Z1bGxzY3JlZW4nIDogKHRoaXMuYmFja2Ryb3AgPyAnYmFja2Ryb3AnIDogJycpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kY29udGFpbmVyLnJlbW92ZUNsYXNzKGBsaC0ke3R5cGV9YCkuY3NzKHtcclxuICAgICAgICAgICAgICAgICd6LWluZGV4JzogJ2luaXRpYWwnLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuJGJhY2tkcm9wT3ZlcmxheS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMb2dzSHViQXV0b0NvbXBsZXRlO1xyXG4iXX0=
