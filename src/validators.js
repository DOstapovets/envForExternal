import * as _ from 'lodash';
import * as vuelidators from 'vuelidate/lib/validators';
import jsParser from './helpers/js_parser.js';
import {Util} from 'or-ui';

/* eslint-disable */
export const validateBySchema = function (data, schema, siblings) {

    return !_.some(schema, function (validator, key) {
        if (_.isFunction(validator)) {
            return !validator.call(this, data, siblings);

        } else if (_.isObject(validator)) {
            switch (key) {
                case '$each':
                    return _.some(data, item => !validateBySchema.call(this, item, validator, item));

                default:
                    return !validateBySchema.call(this, _.get(data, key), validator, siblings);
            }
        }

        return false;
    }.bind(this));
};
/* eslint-enable */

export const validateReportingTag = function (tag) {
    return _.trim(Util.getReadableTextExpression(tag.category))
        && _.trim(Util.getReadableTextExpression(tag.label))
        && _.trim(Util.getReadableTextExpression(tag.value));
};

export const validators = _.assign({}, vuelidators, {
    jsCode (value) {
        const body = `return async function(){${value}\n}`;
        try {
            jsParser(body);
            return true;
        } catch (e) {
            return false;
        }
    },

    jsExpression (value) {
        const body = `const _dummy_ = (${value}\n);`;
        try {
            jsParser(body, {expression : true});
            return true;
        } catch (e) {
            return false;
        }
    },

    jsExpressionNonEmptyString (value) {
        return !(/^(``|''|"")$/).test(value);
    },

    each (schema) {
        return function (items) {
            return !_.some(items, function (item) { //eslint-disable-line
                return !validateBySchema.call(this, item, schema, item);  //eslint-disable-line
            }.bind(this)); //eslint-disable-line
        };
    },

    mergeFieldName () {
        // TODO describe a valid merge field name
        return true;
    },

    stepReporting (value) {
        return !_.find(value, event => _.find(event.tags, tag => !validateReportingTag(tag)));
    },

    validateIf (renderCondition, validator) {
        if (_.isString(renderCondition) && _.isEmpty(renderCondition)) {
            renderCondition = true;
        }

        let renderConditionFn;
        if (_.isBoolean(renderCondition)) {
            renderConditionFn = renderCondition ? () => true : () => false;
        }

        if (_.isString(renderCondition)) {
            try {
                // eslint-disable-next-line no-new-func,no-new
                renderConditionFn = new Function('schema', `return ${renderCondition};`);
            } catch (e) {
                renderConditionFn = () => true;
            }
        }

        if (!renderConditionFn) {
            renderConditionFn = renderCondition;
        }

        return (value, schema) => {
            try {
                if (!renderConditionFn.bind(this)(schema)) { return true; }
            } catch (e) { /* renderCondition variable does not exists error handler */ }
            return validateBySchema.call(this, value, validator, schema);
        };
    },

    // eslint-disable-next-line
    generateValidators (condition, validators) {
        if (condition) {
            return validators;
        } else {
            return {};
        }
    },

    validateInput (template, validatorsObj) {
        return {
            [template.variable] : _.mapValues(validatorsObj, (validatorF, key) => validators.validateIf(template.renderCondition, {[key]: validatorF}))
        };
    }
});
