# LogsHub.com Search Service JavaScript Client

To get our search box working on your website, you must integrate it using Javascript language and CSS on your frontend. We provide example integration below.

Contact us if you would like to hire us to make the whole integration!

## Installation

Dependencies:

* https://github.com/jquery/jquery
* https://github.com/corejavascript/typeahead.js/
* http://handlebarsjs.com/

Include files in your HTML. The minimum required for this plugin are:

    <link href="/css/sdk.min.css" rel="stylesheet" />

    <script src="/js/typeahead.jquery.min.js" type="text/javascript"></script>
    <script src="/js/sdk.js" type="text/javascript"></script>

## Basic usage

To create a simple search service instance pass domain, application key and ID of an existing DOM element:

```
const example = new LogsHubAutoComplete({
    domain: 'uk01.apisearch.logshub.com',
    pubKey: 'your_pub_key',
    container: '#search-box-1'
});
example.init();
```

## Advanced usage

HTML markup

```
<div id="search-box-6"></div>

<script id="template-categories-demo-6" type="text/x-handlebars-template">
    <div class="lh-result-row">
      {{name}}
    </div>
</script>
<script id="template-products-demo-6" type="text/x-handlebars-template">
    <div class="lh-result-row">
      {{#if url_image}}
      <div class="image-container"><img class="image image--big" src="{{url_image}}" alt=""/></div>
      {{/if}}

      <div class="details details--big">
        <span class="name">{{name}}</span>

        {{#each categories}}
        <span class="category">{{this}}</span>
        {{/each}}
      </div>
    </div>
</script>
```

JavaScript code

```
const fullScreenDemo = new LogsHubAutoComplete({
    domain: "uk01.apisearch.logshub.com",
    pubKey: 'NdsaVNi',
    container: '#search-box-6',
    classNames: {
        dataset: 'tt-dataset tt-dataset--aside',
        menu: 'tt-menu tt-menu--aside',
        suggestion: 'tt-suggestion--aside'
    },
    fullscreen: true,
    limit: 18,
    categoryLimit: 10,
    features: 'products,categories,fullresponse',
    onSubmit: function(event){
        var query = (event.currentTarget.getElementsByClassName('tt-input')[0] || {}).value;
        window.location.href = "/search/q=" + query;
    },
    onSelect: function(event, suggestion, dataset){
        window.location.href = suggestion.url;
    },
    datasets: [{
        features: 'categories',
        templates: {
            suggestion: Handlebars.compile($('#template-categories-demo-6').html()),
            notFound: ''
        }
        }, {
            features: 'products',
            templates: {
            suggestion: Handlebars.compile($('#template-products-demo-6').html()),
            notFound: ''
        }
    }]
});
fullScreenDemo.init();
```

For more advanced examples, please visit our example page: https://www.logshub.com/en/demo

## Browser support

- Chrome
- Firefox 3.5+
- Safari 4+
- Internet Explorer 8+
- Opera 11+

## Configuration

When initializing a component, you can specify a number of options:

- `limit` (number) - The max number of results to be displayed. Defaults to 8.
- `features` (string) - Available features. Defaults to "products,categories".
- `categoryLimit` (number) - The max number of categories to be displayed.
- `redirectUri` (string) - The URL to which the user will be redirected after clicking on the result. Defaults to current location.
- `classNames` (string) - For overriding the default class names used.
- `backdrop` (boolean) - If true, backdrop will be shown.
- `fullscreen` (boolean) - If true, search component will take whole browser window.
- `categories` (Object[]) - Allows you to display a list of categories. It should contain array of objects with properties: value and label.
- `transform` (function) - Allows you to modify the results before displaying.
- `onSelect` (function) - Fired when a option is selected. The event handler will be invoked with 3 arguments: the jQuery event object, the suggestion object that was selected, and the name of the dataset the suggestion belongs to.
- `onSubmit` (function) - Fired when form is submitted. The event handler will be invoked with one argument: the jQuery event object.

Templates can be overwritten by the option "datasources" and "templates" key:

- templates - One of "suggestion" or "notFound". Can be either a HTML string or a precompiled template.
