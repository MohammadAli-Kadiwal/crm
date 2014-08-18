define(['underscore', 'backbone', 'orotranslation/js/translator', 'routing', 'oro/dialog-widget'],
function (_, Backbone, __, routing, DialogWidget) {
    'use strict';

    var $ = Backbone.$;

    /**
     * @class   orocrmchannel.app.components.IntegrationWidgetView
     * @extends Backbone.View
     */
    var IntegrationWidgetView = Backbone.View.extend({
        /**
         * @type {jQuery}
         */
        $dataEl: null,

        /**
         * @type {jQuery}
         */
        $idEl: null,

        /**
         * @type {jQuery}
         */
        $typeEl: null,

        /**
         * @type {jQuery}
         */
        $nameEl: null,

        /**
         * @type {function(object):string} linkTemplate
         */
        linkTemplate: _.template(
            '<% if (name) {%>' +
                ' <%= name %> (<a href="javascript: void(0);" class="no-hash form-element-text" data-purpose="open-form-widget"><%= title %></a>)' +
                '<a href="javascript: void(0);" class="no-hash"><i class="icon-remove" data-purpose="remove-integration-data"></i></a>' +
            '<% } else { %>' +
                '<a href="javascript: void(0);" class="no-hash form-element-text" data-purpose="open-form-widget"><%= title %></a>' +
            '<% } %>'
        ),

        /**
         * @type {Object.<string, *>}
         */
        events: {
            'click [data-purpose="open-form-widget"]':          'openDialog',
            'click [data-purpose="remove-integration-data"]' :  'removeIntegrationData'
        },

        /**
         * Initialize.
         *
         * @param {Object} options
         */
        initialize: function (options) {
            if (!(options.dataEl && options.idEl && options.typeEl && options.nameEl)) {
                throw new TypeError('Missing required options for IntegrationWidgetHandlerView');
            }

            this.$dataEl        = $(options.dataEl);
            this.$idEl          = $(options.idEl);
            this.$typeEl        = $(options.typeEl);
            this.$nameEl        = $(options.nameEl);
            this.$channelNameEl = $(options.channelNameEl);
        },

        /**
         * @param {jQuery.Event} e
         */
        openDialog: function (e) {
            e.preventDefault();

            var formDialog = new DialogWidget({
                url: this._getUrl(),
                title: this._getTitle(),
                stateEnabled: false,
                incrementalPosition: false,
                dialogOptions: {
                    modal: true,
                    resizable: true,
                    autoResize: true,
                    width: 700,
                    height: 550
                }
            });

            var processFormSave = function (data) {
                data = _.omit(data, ['_token']);

                this._setValue('name', data.name || '');
                this._setValue('data', data);
                formDialog.remove();
                this.render();
            };

            formDialog.on('formSave', _.bind(processFormSave, this));
            formDialog.render();
        },

        /**
         * Clears storage elements and re-render widget link
         */
        removeIntegrationData: function () {
            this.$dataEl.val(null);
            this.$idEl.val(null);
            this.$nameEl.val(null);

            this.render();
        },

        /**
         * {@inheritDoc}
         */
        render: function () {
            var name = this._getValue('name'),
                templateContext = {
                name: name ,
                title: name ? __('configure') : __('Configure integration')
            };

            this.$el.html(this.linkTemplate(templateContext))
        },

        /**
         * Generates form widget URL based on current state
         *
         * @returns {string}
         * @private
         */
        _getUrl: function () {
            var entityId = this._getValue('id'),
                data = this._getValue('data'),
                route = entityId ? 'orocrm_channel_integration_update' : 'orocrm_channel_integration_create',
                type = this._getValue('type'),
                params = {};

            params.channelName = this._getValue('channelName');

            if (data) {
                params.data = data;
            }

            if (entityId) {
                params.id = entityId;
            } else if (type) {
                params.type = type;
            }

            return routing.generate(route, params);
        },

        /**
         * Returns title for window
         *
         * @returns {string}
         * @private
         */
        _getTitle: function () {
            var name = this._getValue('name');

            return name ? name : __('Configure integration');
        },

        /**
         * Get value by key
         *
         * @param {string?} key
         * @returns {*}
         * @private
         */
        _getValue: function (key) {
            this._assertAllowedValueKey(key);

            var preparedData,
                data =this[['$', key, 'El'].join('')].val();

            switch (key) {
                case 'data':
                    preparedData = data !== '' ? JSON.parse(data) : {};
                    break;
                default:
                    preparedData = data;
            }

            return preparedData;
        },

        /**
         * Set value by key
         *
         * @param {string}key
         * @param {*} data
         * @private
         */
        _setValue: function (key, data) {
            var preparedData;

            this._assertAllowedValueKey(key);
            switch (key) {
                case 'data':
                    preparedData = JSON.stringify(data);
                    break;
                default:
                    preparedData = data;
            }

            this[['$', key, 'El'].join('')].val(preparedData);
        },

        /**
         * Checks whether data key is supported
         *
         * @param {string}key
         * @private
         */
        _assertAllowedValueKey: function (key) {
            if (['id', 'data', 'type', 'name', 'channelName'].indexOf(key) === -1) {
                throw new TypeError('Unknown option: ' + key);
            }
        }
    });

    /**
     * Initialize widget component
     *
     * @param {Object} options
     */
    return function(options) {
        var view = new IntegrationWidgetView(options);
        view.render();

        options._sourceElement.html(view.$el);

        return view;
    }
});
