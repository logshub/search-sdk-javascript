class LogsHubAutoComplete {
    constructor(settings) {
        this.$container = $(settings.container);
        this.name = settings.name || '';
        this.pubKey = settings.pubKey;
        this.domain = settings.domain;
        this.redirectUri = settings.redirectUri;
        this.backdrop = settings.fullscreen ? true : (settings.backdrop || false);
        this.fullscreen = settings.fullscreen || false;
        this.classNames = settings.classNames;

        this.labels = {
            placeholder: 'Start typing...',
            button: 'Search',
            resultNotFound: 'Hit enter to search: ',
            ...settings.labels
        };

        this.features = settings.features || 'categories,products';
        this.limit = settings.limit || 8;
        this.categoryLimit = settings.categoryLimit;
        this.defaultCurrency = settings.defaultCurrency;
        this.defaultImages = settings.defaultImages;

        this.categories = settings.categories;

        this.datasets = (settings.datasets || [{}]).map((source) => ({
            features: source.features,
            templates: source.templates || {}
        }));

        this.onSelect = settings.onSelect;
        this.onSubmit = settings.onSubmit;

        this.transform = settings.transform;

        this.cache = {};
    }

    init() {
        this.render();
        this.initSearch();
        this.initSubmit();
    }

    render() {
        this.$container.html(
            `<form class="lh-form ${this.categories ? 'lh-form--categories' : ''}">
              <div class="lh-form__row">
                <div class="lh-form__input">
                  <input class="form-control" placeholder="${this.labels.placeholder}" />
                </div>` +
                (this.categories ? `<div class="lh-form__select">
                    <select class="form-control tt-select">${this.buildOptions(this.categories)}</select></div>` : '') +
                `<div class="lh-form__button">
                  <button type="submit" class="btn">${this.labels.button}</button>
                </div>
              </div>` +
            (this.fullscreen ? '<a href="#" class="lh-close"></a>' : '') +
            '</form>'
        );
    }

    initSearch() {
        this.$container.find('input').typeahead({
            hint: true,
            highlight: true,
            minLength: 1,
            classNames: this.classNames
        }, ...this.getDataSources())
            .on('typeahead:select', this.handleSelect.bind(this))
            .on('typeahead:open', this.handleOpen.bind(this))
            .on('typeahead:close', this.handleClose.bind(this));
    }

    initSubmit() {
        this.$container.find('form').on('submit', (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (typeof this.onSubmit === 'function') {
                return this.onSubmit(event);
            }

            const query = (event.currentTarget.getElementsByClassName('tt-input')[0] || {}).value;

            this.searchRedirect(query || '');
        });
    }

    buildOptions(options) {
        let $categories = '';

        options.forEach((option) => {
            if (!option.categories) {
                $categories += `<option value="${option.value}">${option.label}</option>`;
            } else {
                $categories += `<optgroup label="${option.label}">${this.buildOptions(option.categories)}</optgroup>`
            }
        });

        return $categories;
    }

    getDataSources() {
        return this.datasets.map((source) => ({
            name: this.name,
            limit: this.limit + 2,
            autoSelect: true,
            source: (query, callbackSync, callback) => {
                const transformer = (data, callback) => {
                    this.cache[query].data = data;

                    const { categories: { docs: categories }, products: { docs: products } } = data;
                    const categoryResults = Object.keys(categories).map((key) => ({
                        ...categories[key],
                        is_category: true
                    }));

                    const productResults = Object.keys(products).map((key) => ({
                        ...products[key],
                        currency: products[key].currency || this.defaultCurrency,
                        url_image: products[key].url_image || this.getRandomImage(this.defaultImages),
                        is_category: false
                    }));

                    let rows = categoryResults.concat(productResults);

                    switch (source.features) {
                        case 'products':
                            rows = productResults;
                            break;
                        case 'categories':
                            rows = categoryResults;
                            break;
                    }

                    if (typeof this.transform === 'function') {
                        return callback(this.transform(rows));
                    }

                    return callback(rows);
                };

                if (typeof this.cache[query] !== 'undefined') {
                    if (this.cache[query].data) {
                        return transformer(this.cache[query].data, callbackSync);
                    }

                    return this.cache[query].then((data) => transformer(data, callback));
                }

                this.cache[query] = this.searchRequest(query);
                return this.cache[query].then((data) => transformer(data, callback));
            },
            displayKey: 'name',
            templates: {
                suggestion: (data) => {
                    if (typeof source.templates.suggestion === 'function') {
                        return source.templates.suggestion(data);
                    }

                    if (typeof source.templates.suggestion === 'string') {
                        return source.templates.suggestion;
                    }

                    return `<div class="lh-result__row">${data.name}</div>`;
                },
                notFound: (data) => {
                    if (typeof source.templates.notFound === 'function') {
                        return source.templates.notFound(data);
                    }

                    if (typeof source.templates.notFound === 'string') {
                        return source.templates.notFound;
                    }

                    return `<div class="lh-result__not-found"><span class="label">${this.labels.resultNotFound}</span><span class="value">${data.query}</span></div>`;
                }
            }
        }))
    }

    searchRequest(query) {
        return $.ajax({
            url: `https://${this.domain}/v1/products/search`,
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

    getRandomImage(images) {
        return images ? images[Math.floor(Math.random() * images.length)] : null;
    }

    buildBackdropLayout() {
        if (!this.backdrop) {
            return;
        }

        const customClass = this.fullscreen ? 'lh-fullscreen' : (this.backdrop ? 'lh-backdrop' : '');

        if (!this.$backdropOverlay) {
            this.backdropCss = {
                'z-index': 1040
            };

            this.$backdropOverlay = $('<div/>', {
                class: `${customClass}-overlay`,
                css: this.backdropCss
            }).insertAfter(this.$container);
        }

        this.$backdropOverlay.css('display', 'block');

        this.$container.addClass(customClass).css({
            'z-index': this.backdropCss['z-index'] + 1,
            position: this.fullscreen ? 'fixed' : 'relative'
        });
    }

    handleSelect(event, suggestion, dataset) {
        if (typeof this.onSelect === 'function') {
            return this.onSelect(event, suggestion, dataset);
        }

        this.searchRedirect(suggestion.name);
    }

    searchRedirect(query) {
        window.location.href = this.createUrl(`q=${query}`);
    }

    createUrl(param) {
        let url = this.redirectUri || location.href;
        url += (url.split('?')[1] ? '&':'?') + param;
        return url;
    }

    handleOpen() {
        this.buildBackdropLayout();
    }

    handleClose() {
        if (this.backdrop) {
            const type = this.fullscreen ? 'fullscreen' : (this.backdrop ? 'backdrop' : '');

            this.$container.removeClass(`lh-${type}`).css({
                'z-index': 'initial',
                position: 'relative'
            });
            this.$backdropOverlay.css('display', 'none');
        }
    }
}

module.exports = LogsHubAutoComplete;
