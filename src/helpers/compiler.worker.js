import * as _ from 'lodash';
import * as babel from 'babel-standalone';
import * as vueTemplateCompiler from 'vue-template-compiler';

import babelTransformAmd from './babel_plugin_transform_amd';
import Cache from './cache';
import Promise from 'bluebird';
import Sass from 'sass.js';
import WorkerHandler from './worker_handler';

babel.registerPlugin('transform-amd', babelTransformAmd);

const pluginsUrl = process.env.PLUGINS_URL; // eslint-disable-line no-process-env

const compiler = {
    async load (moduleName, root) {
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

        const fetchers = [];

        if (!this._hasExtension(moduleHref) && moduleName !== pluginsUrl) {
            fetchers.push(this._fetch(`${moduleHref}.js`));
            fetchers.push(this._fetch(`${moduleHref}.vue`));
        }

        fetchers.push(this._fetch(moduleHref));

        let vueSFC;
        const response = await Promise.any(fetchers);
        moduleHref = response.url;
        let code = await response.text();
        if (moduleHref.endsWith('.vue')) {
            vueSFC = await vueTemplateCompiler.parseComponent(code);
            code = vueSFC.script.content;
        }
        const transpiled = await babel.transform(code, {presets : ['stage-2'], plugins : ['transform-amd']});
        return {
            code : transpiled.code,
            url  : response.url,
            vue  : vueSFC
        };
    },

    async compileSass (wrapperId, content, sassOptions) {
        return new Promise(resolve =>
            Sass.compile(content, sassOptions, result => {
                if (result.status !== 0 || !result.text) {
                    return resolve('');
                }
                // remove spaces between data attr and selector (example: [data-<hash>]<class/id selector>)
                // in case of selector that contains only tag name - put tag at the beginning of line (example: <tag>[data-<hash>])
                return resolve(result.text.replace(new RegExp(`(\\[data${wrapperId}\\])\\s+(\\w*)`, 'g'), '$2$1'));
            })
        );
    },

    _fetch (url) {
        return Promise.try(() => fetch(url)).tap(response => {
            if (!response.ok) {
                throw new Error(`fetch failed: ${url}`);
            }
        });
    },

    _hasExtension (name) {
        return (/(\/|[.[a-z]{1,4}|@\w+)$/).test(name);
    }
};

const sassCache = new Cache();
Sass.importer((request, done) => {
    const url = new URL(request.current, request.previous).href;

    return sassCache
        .get(url, () => {
            const fetchers = [];
            if (!compiler._hasExtension(url)) {
                fetchers.push(compiler._fetch(`${url}.scss`));
                fetchers.push(compiler._fetch(`${url}.css`));
            }

            fetchers.push(compiler._fetch(url));

            return Promise.any(fetchers)
                .then(response => response.text())
                .then(content => ({content}))
                .tapCatch(error => console.warn('failed to import', request, error))
                .catch(() => ({content : ''}));
        })
        .then(done);
});

export default new WorkerHandler(self, compiler);
