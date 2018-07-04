import * as _ from 'lodash';
import * as later from 'later';
import * as moment from 'moment';
import * as momentTZ from 'moment-timezone';
import * as orUi from 'or-ui';
import * as stepMessageBus from '../step_message_bus';
import * as timestring from 'timestring';
import * as uuid from 'uuid';
import * as validators from '../validators';
import * as Vue from 'vue';
import * as vuelidators from 'vuelidate/lib/validators';
import * as vueTemplateCompiler from 'vue-template-compiler';
import * as vuex from 'vuex';

import Cache from './cache';
import compiler from './compiler';
import Promise from 'bluebird';

const client = process.env.CLIENT;               // eslint-disable-line no-process-env
const env = process.env.ENV;                     // eslint-disable-line no-process-env
const pluginsUrl = process.env.PLUGINS_URL;      // eslint-disable-line no-process-env

const loader = {
    load (name, root) {
        const normName = this._normalize(name);
        return this._cache.get(normName, () => this._load(normName, root || name));
    },

    reset () {
        this._cache.reset();
        this._cache.set('bluebird', Promise);
        this._cache.set('later', later);
        this._cache.set('lodash', _);
        this._cache.set('moment', moment);
        this._cache.set('moment-timezone', momentTZ);
        this._cache.set('or-ui', orUi);
        this._cache.set('timestring', timestring);
        this._cache.set('vue', Vue);
        this._cache.set('vuex', vuex);
        this._cache.set('vuelidate/lib/validators', vuelidators);
        this._cache.set('vue-template-compiler', vueTemplateCompiler);
        this._cache.set('uuid', uuid);
        this._cache.set('_applyStyles', (...args) => this._applyStyles(...args));
        this._cache.set('_validators', validators);
        this._cache.set('_stepMessageBus', stepMessageBus);
    },

    async _applyStyles (ownerPath, wrapperId, vueStyles) {
        try {

            const sassOptions = {
                comments  : false,
                indent    : ' ',
                inputPath : ownerPath
            };

            const stylesMapped = await Promise.map(vueStyles, style => {
                const content = style.scoped ? `[data${wrapperId}] {${style.content}}` : style.content;
                return compiler.compileSass(wrapperId, content, sassOptions);
            });

            const styles = _.join(stylesMapped, '');
            let styleNode = document.getElementById(wrapperId);

            if (styleNode) {
                styleNode.innerHTML = styles || '';
            } else {
                await new Promise((resolve, reject) => {
                    styleNode = document.createElement('style');
                    styleNode.onload = resolve;
                    styleNode.onerror = reject;
                    styleNode.setAttribute('id', wrapperId);
                    document.head.appendChild(styleNode);
                    styleNode.innerHTML = styles || '';
                });
            }

        } catch (error) {
            console.warn('failed to compile', error, ownerPath, vueStyles);
        }

    },

    async _load (moduleName, root) {
        try {
            let moduleHref = moduleName;
            if (!_.includes(moduleName, '://')) {
                moduleHref = `https://unpkg.com/${moduleName}`;
            }

            const result = {};
            result.module = {
                exports : result,
                imports : {},
                root
            };

            const transpiled = await compiler.load(moduleName, root);
            moduleHref = transpiled.url;

            const moduleParent = moduleHref.substr(0, moduleHref.lastIndexOf('/') + 1);

            // eslint-disable-next-line no-unused-vars
            const define = (imports, fn) => {
                const importPromise = Promise.map(imports, name => {
                    if (name === 'exports') {
                        return result;
                    }

                    if (name === 'module') {
                        return result.module;
                    }

                    if (name.startsWith('./') || name.startsWith('../')) {
                        name = new URL(name, moduleParent).href;
                    }

                    return this.load(name, root);
                });

                return Promise.all(importPromise).then(imported => {
                    _.range(imports.length, index => {
                        result.imports[imports[index]] = imported[index];
                    });

                    return Promise.try(() => fn(...imported));
                });
            };

            const scope = {
                _,
                define,
                later,
                moment,
                Vue
            };

            // eslint-disable-next-line no-new-func
            const compiledCode = new Function(..._.keys(scope), `return ${transpiled.code}`);
            await compiledCode(..._.values(scope));
            if (transpiled.vue && result.default) {
                const vueSFC = transpiled.vue;
                const descriptor = result.default;
                descriptor.wrapperId = this._generateWrapperId();
                if (vueSFC.template) {
                    // adding data wrapper attribute to component tag
                    descriptor.template = `${vueSFC.template.content.replace(/(\s*<\s*[^/\s>]+)(\s|>)/g, `$1 data${descriptor.wrapperId}$2`)}`;
                }
                await this._applyStyles(moduleHref, descriptor.wrapperId, vueSFC.styles);
            }

            return result;
        } catch (error) {
            console.error('eval', error);
            this._cache.del(moduleName);
            throw new Error(`Failed to eval: ${moduleName}\n`);
        }
    },

    _hasExtension (name) {
        return (/(\/|[.[a-z]{1,4}|@\w+)$/).test(name);
    },

    _normalize (name) {
        const match = this._normalizer.exec(name);
        return match[1]
            .replace(/@default\b/g, pluginsUrl)
            .replace(/@env\b/g, `@${client}_${env}`);
    },

    _generateWrapperId () {
        const maxRadix = 36;
        this._nextWrapperId += 1;
        return `-vs-${this._nextWrapperId.toString(maxRadix)}`;
    },

    _cache         : new Cache(),
    _nextWrapperId : 0,
    _normalizer    : /^(?:https:\/\/unpkg.com\/)?(.*)$/
};

loader.reset();

/**
 * Import package asyncronyously
 * @param {String} moduleName name of the package to import
 * @returns {Promise} imported package
 */
export default function (moduleName) {
    return loader.load(moduleName);
}
