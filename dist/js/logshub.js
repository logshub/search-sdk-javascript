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
      this.$container.html("<form class=\"lh-form\">\n              <div class=\"lh-form__row\">\n                <div class=\"lh-form__input\">\n                  <input class=\"form-control\" placeholder=\"".concat(this.labels.placeholder, "\" />\n                </div>\n                <div class=\"lh-form__button\">\n                  <button type=\"submit\" class=\"btn\">").concat(this.labels.button, "</button>\n                </div>\n              </div>\n              <a href=\"#\" class=\"lh-close\"></a>\n            </form>"));
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
    key: "getDataSources",
    value: function getDataSources() {
      var _this2 = this;

      return this.datasets.map(function (_source) {
        return {
          name: _this2.name,
          limit: _this2.limit + 2,
          autoSelect: true,
          source: function source(query, callbackSync, callback) {
            var transformer = function transformer(data, callback) {
              _this2.cache[query].data = data;
              var categories = data.categories.docs,
                  products = data.products.docs;
              var categoryResults = Object.keys(categories).map(function (key) {
                return _objectSpread({}, categories[key], {
                  is_category: true
                });
              });
              var productResults = Object.keys(products).map(function (key) {
                return _objectSpread({}, products[key], {
                  currency: products[key].currency || _this2.defaultCurrency,
                  url_image: products[key].url_image || _this2.getRandomImage(_this2.defaultImages),
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

              if (typeof _this2.transform === 'function') {
                return callback(_this2.transform(rows));
              }

              return callback(rows);
            };

            if (typeof _this2.cache[query] !== 'undefined') {
              if (_this2.cache[query].data) {
                return transformer(_this2.cache[query].data, callbackSync);
              }

              return _this2.cache[query].then(function (data) {
                return transformer(data, callback);
              });
            }

            _this2.cache[query] = _this2.searchRequest(query);
            return _this2.cache[query].then(function (data) {
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

              return "<div class=\"lh-result__not-found\"><span class=\"label\">".concat(_this2.labels.resultNotFound, "</span><span class=\"value\">").concat(data.query, "</span></div>");
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDQU0sbUI7OztBQUNGLCtCQUFZLFFBQVosRUFBc0I7QUFBQTs7QUFDbEIsU0FBSyxVQUFMLEdBQWtCLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBVixDQUFuQjtBQUNBLFNBQUssSUFBTCxHQUFZLFFBQVEsQ0FBQyxJQUFULElBQWlCLEVBQTdCO0FBQ0EsU0FBSyxNQUFMLEdBQWMsUUFBUSxDQUFDLE1BQXZCO0FBQ0EsU0FBSyxNQUFMLEdBQWMsUUFBUSxDQUFDLE1BQXZCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLFFBQVEsQ0FBQyxXQUE1QjtBQUNBLFNBQUssUUFBTCxHQUFnQixRQUFRLENBQUMsVUFBVCxHQUFzQixJQUF0QixHQUE4QixRQUFRLENBQUMsUUFBVCxJQUFxQixLQUFuRTtBQUNBLFNBQUssVUFBTCxHQUFrQixRQUFRLENBQUMsVUFBVCxJQUF1QixLQUF6QztBQUNBLFNBQUssVUFBTCxHQUFrQixRQUFRLENBQUMsVUFBM0I7QUFFQSxTQUFLLE1BQUw7QUFDSSxNQUFBLFdBQVcsRUFBRSxpQkFEakI7QUFFSSxNQUFBLE1BQU0sRUFBRSxRQUZaO0FBR0ksTUFBQSxjQUFjLEVBQUU7QUFIcEIsT0FJTyxRQUFRLENBQUMsTUFKaEI7QUFPQSxTQUFLLFFBQUwsR0FBZ0IsUUFBUSxDQUFDLFFBQVQsSUFBcUIscUJBQXJDO0FBQ0EsU0FBSyxLQUFMLEdBQWEsUUFBUSxDQUFDLEtBQVQsSUFBa0IsQ0FBL0I7QUFDQSxTQUFLLGFBQUwsR0FBcUIsUUFBUSxDQUFDLGFBQTlCO0FBQ0EsU0FBSyxlQUFMLEdBQXVCLFFBQVEsQ0FBQyxlQUFoQztBQUNBLFNBQUssYUFBTCxHQUFxQixRQUFRLENBQUMsYUFBOUI7QUFFQSxTQUFLLFFBQUwsR0FBZ0IsQ0FBQyxRQUFRLENBQUMsUUFBVCxJQUFxQixDQUFDLEVBQUQsQ0FBdEIsRUFBNEIsR0FBNUIsQ0FBZ0MsVUFBQyxNQUFEO0FBQUEsYUFBYTtBQUN6RCxRQUFBLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFEd0M7QUFFekQsUUFBQSxTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVAsSUFBb0I7QUFGMEIsT0FBYjtBQUFBLEtBQWhDLENBQWhCO0FBS0EsU0FBSyxRQUFMLEdBQWdCLFFBQVEsQ0FBQyxRQUF6QjtBQUNBLFNBQUssUUFBTCxHQUFnQixRQUFRLENBQUMsUUFBekI7QUFFQSxTQUFLLFNBQUwsR0FBaUIsUUFBUSxDQUFDLFNBQTFCO0FBRUEsU0FBSyxLQUFMLEdBQWEsRUFBYjtBQUNIOzs7OzJCQUVNO0FBQ0gsV0FBSyxNQUFMO0FBQ0EsV0FBSyxVQUFMO0FBQ0EsV0FBSyxVQUFMO0FBQ0g7Ozs2QkFFUTtBQUNMLFdBQUssVUFBTCxDQUFnQixJQUFoQiwrTEFJcUQsS0FBSyxNQUFMLENBQVksV0FKakUscUpBTzhDLEtBQUssTUFBTCxDQUFZLE1BUDFEO0FBYUg7OztpQ0FFWTtBQUFBOztBQUNULG9DQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsT0FBckIsR0FBOEIsU0FBOUIsK0JBQXdDO0FBQ3BDLFFBQUEsSUFBSSxFQUFFLElBRDhCO0FBRXBDLFFBQUEsU0FBUyxFQUFFLElBRnlCO0FBR3BDLFFBQUEsU0FBUyxFQUFFLENBSHlCO0FBSXBDLFFBQUEsVUFBVSxFQUFFLEtBQUs7QUFKbUIsT0FBeEMsNEJBS00sS0FBSyxjQUFMLEVBTE4sSUFNSyxFQU5MLENBTVEsa0JBTlIsRUFNNEIsS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLElBQXZCLENBTjVCLEVBT0ssRUFQTCxDQU9RLGdCQVBSLEVBTzBCLEtBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixJQUFyQixDQVAxQixFQVFLLEVBUkwsQ0FRUSxpQkFSUixFQVEyQixLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FSM0I7QUFTSDs7O2lDQUVZO0FBQUE7O0FBQ1QsV0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLE1BQXJCLEVBQTZCLEVBQTdCLENBQWdDLFFBQWhDLEVBQTBDLFVBQUMsS0FBRCxFQUFXO0FBQ2pELFFBQUEsS0FBSyxDQUFDLGNBQU47QUFDQSxRQUFBLEtBQUssQ0FBQyxlQUFOOztBQUVBLFlBQUksT0FBTyxLQUFJLENBQUMsUUFBWixLQUF5QixVQUE3QixFQUF5QztBQUNyQyxpQkFBTyxLQUFJLENBQUMsUUFBTCxDQUFjLEtBQWQsQ0FBUDtBQUNIOztBQUVELFlBQU0sS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLGFBQU4sQ0FBb0Isc0JBQXBCLENBQTJDLFVBQTNDLEVBQXVELENBQXZELEtBQTZELEVBQTlELEVBQWtFLEtBQWhGOztBQUVBLFFBQUEsS0FBSSxDQUFDLGNBQUwsQ0FBb0IsS0FBSyxJQUFJLEVBQTdCO0FBQ0gsT0FYRDtBQVlIOzs7cUNBRWdCO0FBQUE7O0FBQ2IsYUFBTyxLQUFLLFFBQUwsQ0FBYyxHQUFkLENBQWtCLFVBQUMsT0FBRDtBQUFBLGVBQWE7QUFDbEMsVUFBQSxJQUFJLEVBQUUsTUFBSSxDQUFDLElBRHVCO0FBRWxDLFVBQUEsS0FBSyxFQUFFLE1BQUksQ0FBQyxLQUFMLEdBQWEsQ0FGYztBQUdsQyxVQUFBLFVBQVUsRUFBRSxJQUhzQjtBQUlsQyxVQUFBLE1BQU0sRUFBRSxnQkFBQyxLQUFELEVBQVEsWUFBUixFQUFzQixRQUF0QixFQUFtQztBQUN2QyxnQkFBTSxXQUFXLEdBQUcsU0FBZCxXQUFjLENBQUMsSUFBRCxFQUFPLFFBQVAsRUFBb0I7QUFDcEMsY0FBQSxNQUFJLENBQUMsS0FBTCxDQUFXLEtBQVgsRUFBa0IsSUFBbEIsR0FBeUIsSUFBekI7QUFEb0Msa0JBR1IsVUFIUSxHQUd1QyxJQUh2QyxDQUc1QixVQUg0QixDQUdkLElBSGM7QUFBQSxrQkFHd0IsUUFIeEIsR0FHdUMsSUFIdkMsQ0FHTSxRQUhOLENBR2tCLElBSGxCO0FBSXBDLGtCQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsSUFBUCxDQUFZLFVBQVosRUFBd0IsR0FBeEIsQ0FBNEIsVUFBQyxHQUFEO0FBQUEseUNBQzdDLFVBQVUsQ0FBQyxHQUFELENBRG1DO0FBRWhELGtCQUFBLFdBQVcsRUFBRTtBQUZtQztBQUFBLGVBQTVCLENBQXhCO0FBS0Esa0JBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxJQUFQLENBQVksUUFBWixFQUFzQixHQUF0QixDQUEwQixVQUFDLEdBQUQ7QUFBQSx5Q0FDMUMsUUFBUSxDQUFDLEdBQUQsQ0FEa0M7QUFFN0Msa0JBQUEsUUFBUSxFQUFFLFFBQVEsQ0FBQyxHQUFELENBQVIsQ0FBYyxRQUFkLElBQTBCLE1BQUksQ0FBQyxlQUZJO0FBRzdDLGtCQUFBLFNBQVMsRUFBRSxRQUFRLENBQUMsR0FBRCxDQUFSLENBQWMsU0FBZCxJQUEyQixNQUFJLENBQUMsY0FBTCxDQUFvQixNQUFJLENBQUMsYUFBekIsQ0FITztBQUk3QyxrQkFBQSxXQUFXLEVBQUU7QUFKZ0M7QUFBQSxlQUExQixDQUF2QjtBQU9BLGtCQUFJLElBQUksR0FBRyxlQUFlLENBQUMsTUFBaEIsQ0FBdUIsY0FBdkIsQ0FBWDs7QUFFQSxzQkFBUSxPQUFNLENBQUMsUUFBZjtBQUNJLHFCQUFLLFVBQUw7QUFDSSxrQkFBQSxJQUFJLEdBQUcsY0FBUDtBQUNBOztBQUNKLHFCQUFLLFlBQUw7QUFDSSxrQkFBQSxJQUFJLEdBQUcsZUFBUDtBQUNBO0FBTlI7O0FBU0Esa0JBQUksT0FBTyxNQUFJLENBQUMsU0FBWixLQUEwQixVQUE5QixFQUEwQztBQUN0Qyx1QkFBTyxRQUFRLENBQUMsTUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFmLENBQUQsQ0FBZjtBQUNIOztBQUVELHFCQUFPLFFBQVEsQ0FBQyxJQUFELENBQWY7QUFDSCxhQWhDRDs7QUFrQ0EsZ0JBQUksT0FBTyxNQUFJLENBQUMsS0FBTCxDQUFXLEtBQVgsQ0FBUCxLQUE2QixXQUFqQyxFQUE4QztBQUMxQyxrQkFBSSxNQUFJLENBQUMsS0FBTCxDQUFXLEtBQVgsRUFBa0IsSUFBdEIsRUFBNEI7QUFDeEIsdUJBQU8sV0FBVyxDQUFDLE1BQUksQ0FBQyxLQUFMLENBQVcsS0FBWCxFQUFrQixJQUFuQixFQUF5QixZQUF6QixDQUFsQjtBQUNIOztBQUVELHFCQUFPLE1BQUksQ0FBQyxLQUFMLENBQVcsS0FBWCxFQUFrQixJQUFsQixDQUF1QixVQUFDLElBQUQ7QUFBQSx1QkFBVSxXQUFXLENBQUMsSUFBRCxFQUFPLFFBQVAsQ0FBckI7QUFBQSxlQUF2QixDQUFQO0FBQ0g7O0FBRUQsWUFBQSxNQUFJLENBQUMsS0FBTCxDQUFXLEtBQVgsSUFBb0IsTUFBSSxDQUFDLGFBQUwsQ0FBbUIsS0FBbkIsQ0FBcEI7QUFDQSxtQkFBTyxNQUFJLENBQUMsS0FBTCxDQUFXLEtBQVgsRUFBa0IsSUFBbEIsQ0FBdUIsVUFBQyxJQUFEO0FBQUEscUJBQVUsV0FBVyxDQUFDLElBQUQsRUFBTyxRQUFQLENBQXJCO0FBQUEsYUFBdkIsQ0FBUDtBQUNILFdBakRpQztBQWtEbEMsVUFBQSxVQUFVLEVBQUUsTUFsRHNCO0FBbURsQyxVQUFBLFNBQVMsRUFBRTtBQUNQLFlBQUEsVUFBVSxFQUFFLG9CQUFDLElBQUQsRUFBVTtBQUNsQixrQkFBSSxPQUFPLE9BQU0sQ0FBQyxTQUFQLENBQWlCLFVBQXhCLEtBQXVDLFVBQTNDLEVBQXVEO0FBQ25ELHVCQUFPLE9BQU0sQ0FBQyxTQUFQLENBQWlCLFVBQWpCLENBQTRCLElBQTVCLENBQVA7QUFDSDs7QUFFRCxrQkFBSSxPQUFPLE9BQU0sQ0FBQyxTQUFQLENBQWlCLFVBQXhCLEtBQXVDLFFBQTNDLEVBQXFEO0FBQ2pELHVCQUFPLE9BQU0sQ0FBQyxTQUFQLENBQWlCLFVBQXhCO0FBQ0g7O0FBRUQsNkRBQXNDLElBQUksQ0FBQyxJQUEzQztBQUNILGFBWE07QUFZUCxZQUFBLFFBQVEsRUFBRSxrQkFBQyxJQUFELEVBQVU7QUFDaEIsa0JBQUksT0FBTyxPQUFNLENBQUMsU0FBUCxDQUFpQixRQUF4QixLQUFxQyxVQUF6QyxFQUFxRDtBQUNqRCx1QkFBTyxPQUFNLENBQUMsU0FBUCxDQUFpQixRQUFqQixDQUEwQixJQUExQixDQUFQO0FBQ0g7O0FBRUQsa0JBQUksT0FBTyxPQUFNLENBQUMsU0FBUCxDQUFpQixRQUF4QixLQUFxQyxRQUF6QyxFQUFtRDtBQUMvQyx1QkFBTyxPQUFNLENBQUMsU0FBUCxDQUFpQixRQUF4QjtBQUNIOztBQUVELHlGQUFnRSxNQUFJLENBQUMsTUFBTCxDQUFZLGNBQTVFLDBDQUF3SCxJQUFJLENBQUMsS0FBN0g7QUFDSDtBQXRCTTtBQW5EdUIsU0FBYjtBQUFBLE9BQWxCLENBQVA7QUE0RUg7OztrQ0FFYSxLLEVBQU87QUFDakIsYUFBTyxDQUFDLENBQUMsSUFBRixDQUFPO0FBQ1YsUUFBQSxHQUFHLG9CQUFhLEtBQUssTUFBbEIsd0JBRE87QUFFVixRQUFBLElBQUksRUFBRTtBQUNGLFVBQUEsT0FBTyxFQUFFLEtBQUssTUFEWjtBQUVGLFVBQUEsQ0FBQyxFQUFFLEtBRkQ7QUFHRixVQUFBLFFBQVEsRUFBRSxLQUFLLFFBSGI7QUFJRixVQUFBLEtBQUssRUFBRSxLQUFLLEtBSlY7QUFLRixVQUFBLFNBQVMsRUFBRSxLQUFLO0FBTGQsU0FGSTtBQVNWLFFBQUEsUUFBUSxFQUFFO0FBVEEsT0FBUCxDQUFQO0FBV0g7OzttQ0FFYyxNLEVBQVE7QUFDbkIsYUFBTyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLE1BQUwsS0FBZ0IsTUFBTSxDQUFDLE1BQWxDLENBQUQsQ0FBVCxHQUF1RCxJQUFwRTtBQUNIOzs7MENBRXFCO0FBQ2xCLFVBQUksQ0FBQyxLQUFLLFFBQVYsRUFBb0I7QUFDaEI7QUFDSDs7QUFFRCxVQUFNLFdBQVcsR0FBRyxLQUFLLFVBQUwsR0FBa0IsZUFBbEIsR0FBcUMsS0FBSyxRQUFMLEdBQWdCLGFBQWhCLEdBQWdDLEVBQXpGOztBQUVBLFVBQUksQ0FBQyxLQUFLLGdCQUFWLEVBQTRCO0FBQ3hCLGFBQUssV0FBTCxHQUFtQjtBQUNmLHFCQUFXO0FBREksU0FBbkI7QUFJQSxhQUFLLGdCQUFMLEdBQXdCLENBQUMsQ0FBQyxRQUFELEVBQVc7QUFDaEMsVUFBQSxLQUFLLFlBQUssV0FBTCxhQUQyQjtBQUVoQyxVQUFBLEdBQUcsRUFBRSxLQUFLO0FBRnNCLFNBQVgsQ0FBRCxDQUdyQixXQUhxQixDQUdULEtBQUssVUFISSxDQUF4QjtBQUlIOztBQUVELFdBQUssZ0JBQUwsQ0FBc0IsR0FBdEIsQ0FBMEIsU0FBMUIsRUFBcUMsT0FBckM7QUFFQSxXQUFLLFVBQUwsQ0FBZ0IsUUFBaEIsQ0FBeUIsV0FBekIsRUFBc0MsR0FBdEMsQ0FBMEM7QUFDdEMsbUJBQVcsS0FBSyxXQUFMLENBQWlCLFNBQWpCLElBQThCLENBREg7QUFFdEMsUUFBQSxRQUFRLEVBQUUsS0FBSyxVQUFMLEdBQWtCLE9BQWxCLEdBQTRCO0FBRkEsT0FBMUM7QUFJSDs7O2lDQUVZLEssRUFBTyxVLEVBQVksTyxFQUFTO0FBQ3JDLFVBQUksT0FBTyxLQUFLLFFBQVosS0FBeUIsVUFBN0IsRUFBeUM7QUFDckMsZUFBTyxLQUFLLFFBQUwsQ0FBYyxLQUFkLEVBQXFCLFVBQXJCLEVBQWlDLE9BQWpDLENBQVA7QUFDSDs7QUFFRCxXQUFLLGNBQUwsQ0FBb0IsVUFBVSxDQUFDLElBQS9CO0FBQ0g7OzttQ0FFYyxLLEVBQU87QUFDbEIsTUFBQSxNQUFNLENBQUMsUUFBUCxDQUFnQixJQUFoQixHQUF1QixLQUFLLFNBQUwsYUFBb0IsS0FBcEIsRUFBdkI7QUFDSDs7OzhCQUVTLEssRUFBTztBQUNiLFVBQUksR0FBRyxHQUFHLEtBQUssV0FBTCxJQUFvQixRQUFRLENBQUMsSUFBdkM7QUFDQSxNQUFBLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFKLENBQVUsR0FBVixFQUFlLENBQWYsSUFBb0IsR0FBcEIsR0FBd0IsR0FBekIsSUFBZ0MsS0FBdkM7QUFDQSxhQUFPLEdBQVA7QUFDSDs7O2lDQUVZO0FBQ1QsV0FBSyxtQkFBTDtBQUNIOzs7a0NBRWE7QUFDVixVQUFJLEtBQUssUUFBVCxFQUFtQjtBQUNmLFlBQU0sSUFBSSxHQUFHLEtBQUssVUFBTCxHQUFrQixZQUFsQixHQUFrQyxLQUFLLFFBQUwsR0FBZ0IsVUFBaEIsR0FBNkIsRUFBNUU7QUFFQSxhQUFLLFVBQUwsQ0FBZ0IsV0FBaEIsY0FBa0MsSUFBbEMsR0FBMEMsR0FBMUMsQ0FBOEM7QUFDMUMscUJBQVcsU0FEK0I7QUFFMUMsVUFBQSxRQUFRLEVBQUU7QUFGZ0MsU0FBOUM7QUFJQSxhQUFLLGdCQUFMLENBQXNCLEdBQXRCLENBQTBCLFNBQTFCLEVBQXFDLE1BQXJDO0FBQ0g7QUFDSjs7Ozs7O0FBR0wsTUFBTSxDQUFDLE9BQVAsR0FBaUIsbUJBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY2xhc3MgTG9nc0h1YkF1dG9Db21wbGV0ZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xyXG4gICAgICAgIHRoaXMuJGNvbnRhaW5lciA9ICQoc2V0dGluZ3MuY29udGFpbmVyKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBzZXR0aW5ncy5uYW1lIHx8ICcnO1xyXG4gICAgICAgIHRoaXMucHViS2V5ID0gc2V0dGluZ3MucHViS2V5O1xyXG4gICAgICAgIHRoaXMuZG9tYWluID0gc2V0dGluZ3MuZG9tYWluO1xyXG4gICAgICAgIHRoaXMucmVkaXJlY3RVcmkgPSBzZXR0aW5ncy5yZWRpcmVjdFVyaTtcclxuICAgICAgICB0aGlzLmJhY2tkcm9wID0gc2V0dGluZ3MuZnVsbHNjcmVlbiA/IHRydWUgOiAoc2V0dGluZ3MuYmFja2Ryb3AgfHwgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuZnVsbHNjcmVlbiA9IHNldHRpbmdzLmZ1bGxzY3JlZW4gfHwgZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jbGFzc05hbWVzID0gc2V0dGluZ3MuY2xhc3NOYW1lcztcclxuXHJcbiAgICAgICAgdGhpcy5sYWJlbHMgPSB7XHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAnU3RhcnQgdHlwaW5nLi4uJyxcclxuICAgICAgICAgICAgYnV0dG9uOiAnU2VhcmNoJyxcclxuICAgICAgICAgICAgcmVzdWx0Tm90Rm91bmQ6ICdIaXQgZW50ZXIgdG8gc2VhcmNoOiAnLFxyXG4gICAgICAgICAgICAuLi5zZXR0aW5ncy5sYWJlbHNcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmZlYXR1cmVzID0gc2V0dGluZ3MuZmVhdHVyZXMgfHwgJ2NhdGVnb3JpZXMscHJvZHVjdHMnO1xyXG4gICAgICAgIHRoaXMubGltaXQgPSBzZXR0aW5ncy5saW1pdCB8fCA4O1xyXG4gICAgICAgIHRoaXMuY2F0ZWdvcnlMaW1pdCA9IHNldHRpbmdzLmNhdGVnb3J5TGltaXQ7XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0Q3VycmVuY3kgPSBzZXR0aW5ncy5kZWZhdWx0Q3VycmVuY3k7XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0SW1hZ2VzID0gc2V0dGluZ3MuZGVmYXVsdEltYWdlcztcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhc2V0cyA9IChzZXR0aW5ncy5kYXRhc2V0cyB8fCBbe31dKS5tYXAoKHNvdXJjZSkgPT4gKHtcclxuICAgICAgICAgICAgZmVhdHVyZXM6IHNvdXJjZS5mZWF0dXJlcyxcclxuICAgICAgICAgICAgdGVtcGxhdGVzOiBzb3VyY2UudGVtcGxhdGVzIHx8IHt9XHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICB0aGlzLm9uU2VsZWN0ID0gc2V0dGluZ3Mub25TZWxlY3Q7XHJcbiAgICAgICAgdGhpcy5vblN1Ym1pdCA9IHNldHRpbmdzLm9uU3VibWl0O1xyXG5cclxuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IHNldHRpbmdzLnRyYW5zZm9ybTtcclxuXHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmluaXRTZWFyY2goKTtcclxuICAgICAgICB0aGlzLmluaXRTdWJtaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLmh0bWwoXHJcbiAgICAgICAgICAgIGA8Zm9ybSBjbGFzcz1cImxoLWZvcm1cIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGgtZm9ybV9fcm93XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGgtZm9ybV9faW5wdXRcIj5cclxuICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcGxhY2Vob2xkZXI9XCIke3RoaXMubGFiZWxzLnBsYWNlaG9sZGVyfVwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaC1mb3JtX19idXR0b25cIj5cclxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG5cIj4ke3RoaXMubGFiZWxzLmJ1dHRvbn08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJsaC1jbG9zZVwiPjwvYT5cclxuICAgICAgICAgICAgPC9mb3JtPmBcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRTZWFyY2goKSB7XHJcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLmZpbmQoJ2lucHV0JykudHlwZWFoZWFkKHtcclxuICAgICAgICAgICAgaGludDogdHJ1ZSxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0OiB0cnVlLFxyXG4gICAgICAgICAgICBtaW5MZW5ndGg6IDEsXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZXM6IHRoaXMuY2xhc3NOYW1lc1xyXG4gICAgICAgIH0sIC4uLnRoaXMuZ2V0RGF0YVNvdXJjZXMoKSlcclxuICAgICAgICAgICAgLm9uKCd0eXBlYWhlYWQ6c2VsZWN0JywgdGhpcy5oYW5kbGVTZWxlY3QuYmluZCh0aGlzKSlcclxuICAgICAgICAgICAgLm9uKCd0eXBlYWhlYWQ6b3BlbicsIHRoaXMuaGFuZGxlT3Blbi5iaW5kKHRoaXMpKVxyXG4gICAgICAgICAgICAub24oJ3R5cGVhaGVhZDpjbG9zZScsIHRoaXMuaGFuZGxlQ2xvc2UuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFN1Ym1pdCgpIHtcclxuICAgICAgICB0aGlzLiRjb250YWluZXIuZmluZCgnZm9ybScpLm9uKCdzdWJtaXQnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub25TdWJtaXQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm9uU3VibWl0KGV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgcXVlcnkgPSAoZXZlbnQuY3VycmVudFRhcmdldC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0dC1pbnB1dCcpWzBdIHx8IHt9KS52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoUmVkaXJlY3QocXVlcnkgfHwgJycpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGFTb3VyY2VzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFzZXRzLm1hcCgoc291cmNlKSA9PiAoe1xyXG4gICAgICAgICAgICBuYW1lOiB0aGlzLm5hbWUsXHJcbiAgICAgICAgICAgIGxpbWl0OiB0aGlzLmxpbWl0ICsgMixcclxuICAgICAgICAgICAgYXV0b1NlbGVjdDogdHJ1ZSxcclxuICAgICAgICAgICAgc291cmNlOiAocXVlcnksIGNhbGxiYWNrU3luYywgY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybWVyID0gKGRhdGEsIGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZVtxdWVyeV0uZGF0YSA9IGRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgY2F0ZWdvcmllczogeyBkb2NzOiBjYXRlZ29yaWVzIH0sIHByb2R1Y3RzOiB7IGRvY3M6IHByb2R1Y3RzIH0gfSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnlSZXN1bHRzID0gT2JqZWN0LmtleXMoY2F0ZWdvcmllcykubWFwKChrZXkpID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLmNhdGVnb3JpZXNba2V5XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNfY2F0ZWdvcnk6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2R1Y3RSZXN1bHRzID0gT2JqZWN0LmtleXMocHJvZHVjdHMpLm1hcCgoa2V5KSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5wcm9kdWN0c1trZXldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW5jeTogcHJvZHVjdHNba2V5XS5jdXJyZW5jeSB8fCB0aGlzLmRlZmF1bHRDdXJyZW5jeSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsX2ltYWdlOiBwcm9kdWN0c1trZXldLnVybF9pbWFnZSB8fCB0aGlzLmdldFJhbmRvbUltYWdlKHRoaXMuZGVmYXVsdEltYWdlcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzX2NhdGVnb3J5OiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvd3MgPSBjYXRlZ29yeVJlc3VsdHMuY29uY2F0KHByb2R1Y3RSZXN1bHRzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChzb3VyY2UuZmVhdHVyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncHJvZHVjdHMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IHByb2R1Y3RSZXN1bHRzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NhdGVnb3JpZXMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93cyA9IGNhdGVnb3J5UmVzdWx0cztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnRyYW5zZm9ybSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sodGhpcy50cmFuc2Zvcm0ocm93cykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHJvd3MpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuY2FjaGVbcXVlcnldICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNhY2hlW3F1ZXJ5XS5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cmFuc2Zvcm1lcih0aGlzLmNhY2hlW3F1ZXJ5XS5kYXRhLCBjYWxsYmFja1N5bmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVbcXVlcnldLnRoZW4oKGRhdGEpID0+IHRyYW5zZm9ybWVyKGRhdGEsIGNhbGxiYWNrKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZVtxdWVyeV0gPSB0aGlzLnNlYXJjaFJlcXVlc3QocXVlcnkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVbcXVlcnldLnRoZW4oKGRhdGEpID0+IHRyYW5zZm9ybWVyKGRhdGEsIGNhbGxiYWNrKSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRpc3BsYXlLZXk6ICduYW1lJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVzOiB7XHJcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uOiAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc291cmNlLnRlbXBsYXRlcy5zdWdnZXN0aW9uID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2UudGVtcGxhdGVzLnN1Z2dlc3Rpb24oZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNvdXJjZS50ZW1wbGF0ZXMuc3VnZ2VzdGlvbiA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS50ZW1wbGF0ZXMuc3VnZ2VzdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cImxoLXJlc3VsdF9fcm93XCI+JHtkYXRhLm5hbWV9PC9kaXY+YDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBub3RGb3VuZDogKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNvdXJjZS50ZW1wbGF0ZXMubm90Rm91bmQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS50ZW1wbGF0ZXMubm90Rm91bmQoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNvdXJjZS50ZW1wbGF0ZXMubm90Rm91bmQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2UudGVtcGxhdGVzLm5vdEZvdW5kO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwibGgtcmVzdWx0X19ub3QtZm91bmRcIj48c3BhbiBjbGFzcz1cImxhYmVsXCI+JHt0aGlzLmxhYmVscy5yZXN1bHROb3RGb3VuZH08L3NwYW4+PHNwYW4gY2xhc3M9XCJ2YWx1ZVwiPiR7ZGF0YS5xdWVyeX08L3NwYW4+PC9kaXY+YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKVxyXG4gICAgfVxyXG5cclxuICAgIHNlYXJjaFJlcXVlc3QocXVlcnkpIHtcclxuICAgICAgICByZXR1cm4gJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiBgaHR0cHM6Ly8ke3RoaXMuZG9tYWlufS92MS9wcm9kdWN0cy9zZWFyY2hgLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBwdWJfa2V5OiB0aGlzLnB1YktleSxcclxuICAgICAgICAgICAgICAgIHE6IHF1ZXJ5LFxyXG4gICAgICAgICAgICAgICAgZmVhdHVyZXM6IHRoaXMuZmVhdHVyZXMsXHJcbiAgICAgICAgICAgICAgICBsaW1pdDogdGhpcy5saW1pdCxcclxuICAgICAgICAgICAgICAgIGxpbWl0X2NhdDogdGhpcy5jYXRlZ29yeUxpbWl0XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbnAnXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UmFuZG9tSW1hZ2UoaW1hZ2VzKSB7XHJcbiAgICAgICAgcmV0dXJuIGltYWdlcyA/IGltYWdlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBpbWFnZXMubGVuZ3RoKV0gOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGJ1aWxkQmFja2Ryb3BMYXlvdXQoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmJhY2tkcm9wKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGN1c3RvbUNsYXNzID0gdGhpcy5mdWxsc2NyZWVuID8gJ2xoLWZ1bGxzY3JlZW4nIDogKHRoaXMuYmFja2Ryb3AgPyAnbGgtYmFja2Ryb3AnIDogJycpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuJGJhY2tkcm9wT3ZlcmxheSkge1xyXG4gICAgICAgICAgICB0aGlzLmJhY2tkcm9wQ3NzID0ge1xyXG4gICAgICAgICAgICAgICAgJ3otaW5kZXgnOiAxMDQwXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRiYWNrZHJvcE92ZXJsYXkgPSAkKCc8ZGl2Lz4nLCB7XHJcbiAgICAgICAgICAgICAgICBjbGFzczogYCR7Y3VzdG9tQ2xhc3N9LW92ZXJsYXlgLFxyXG4gICAgICAgICAgICAgICAgY3NzOiB0aGlzLmJhY2tkcm9wQ3NzXHJcbiAgICAgICAgICAgIH0pLmluc2VydEFmdGVyKHRoaXMuJGNvbnRhaW5lcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRiYWNrZHJvcE92ZXJsYXkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XHJcblxyXG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5hZGRDbGFzcyhjdXN0b21DbGFzcykuY3NzKHtcclxuICAgICAgICAgICAgJ3otaW5kZXgnOiB0aGlzLmJhY2tkcm9wQ3NzWyd6LWluZGV4J10gKyAxLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5mdWxsc2NyZWVuID8gJ2ZpeGVkJyA6ICdyZWxhdGl2ZSdcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVTZWxlY3QoZXZlbnQsIHN1Z2dlc3Rpb24sIGRhdGFzZXQpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMub25TZWxlY3QgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub25TZWxlY3QoZXZlbnQsIHN1Z2dlc3Rpb24sIGRhdGFzZXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZWFyY2hSZWRpcmVjdChzdWdnZXN0aW9uLm5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlYXJjaFJlZGlyZWN0KHF1ZXJ5KSB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB0aGlzLmNyZWF0ZVVybChgcT0ke3F1ZXJ5fWApO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVVybChwYXJhbSkge1xyXG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnJlZGlyZWN0VXJpIHx8IGxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgdXJsICs9ICh1cmwuc3BsaXQoJz8nKVsxXSA/ICcmJzonPycpICsgcGFyYW07XHJcbiAgICAgICAgcmV0dXJuIHVybDtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVPcGVuKCkge1xyXG4gICAgICAgIHRoaXMuYnVpbGRCYWNrZHJvcExheW91dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUNsb3NlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmJhY2tkcm9wKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB0aGlzLmZ1bGxzY3JlZW4gPyAnZnVsbHNjcmVlbicgOiAodGhpcy5iYWNrZHJvcCA/ICdiYWNrZHJvcCcgOiAnJyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRjb250YWluZXIucmVtb3ZlQ2xhc3MoYGxoLSR7dHlwZX1gKS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgJ3otaW5kZXgnOiAnaW5pdGlhbCcsXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy4kYmFja2Ryb3BPdmVybGF5LmNzcygnZGlzcGxheScsICdub25lJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExvZ3NIdWJBdXRvQ29tcGxldGU7XHJcbiJdfQ==
