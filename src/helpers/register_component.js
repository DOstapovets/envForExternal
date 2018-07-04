import * as _ from 'lodash';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import Promise from 'bluebird';
import Sass from 'sass.js';
import Vue from 'vue';

export default {
    registry : {},

    isRegistered (name) {
        return Boolean(this.registry[name]);
    },

    unregister (name) {
        if (name) {
            delete this.registry[name];
            // vue 2.0 does not have a component un-registering mechanics,
            // even Vue.component(name, null); does not do the trick
            this._removeStyles(name);
        } else {
            _.forEach(_.keys(this.registry), componentName => this.unregister(componentName));
        }
    },

    register ({name, template, code, style, args, noWrapStyle}) {
        return Promise.try(() => {
            const componentCode = _.startsWith(code, 'return') ? code : `return ${code}`;
            // eslint-disable-next-line no-new-func
            const descriptor = new Function(..._.keys(args), componentCode)(..._.values(args));
            descriptor.styles = descriptor.styles || [];
            if (template) {
                descriptor.template = template;
            }
            if (noWrapStyle) {
                descriptor.styles.push({content : noWrapStyle});
            }
            if (style) {
                descriptor.styles.push({scoped : true, content : style});
            }

            return this._registerComponent(name, descriptor);
        });
    },

    registerInput (input) {
        return Promise.all([
            this._registerComponent(`design-${input.component}`, input.default || {template : `<h4>?DESIGN ${input.component}<h4>`}),
            this._registerComponent(`edit-${input.component}`, input.default.components.editor || {template : `<h4>?EDIT ${input.component}<h4>`})
        ]);
    },

    async _registerComponent (name, descriptor) {
        console.log('registering component', name, descriptor);
        const styles = _.groupBy(descriptor.styles, style => style.scoped ? 'local' : 'global');
        const style = _.chain(styles.local).map('content').join('\n').value();
        const noWrapStyle = _.chain(styles.global).map('content').join('\n').value();
        const css = await this._compileStyles({wrapperClass : name, style, noWrapStyle});
        await this._appendStyles(name, css);
        const component = Vue.component(name, descriptor);
        this.registry[name] = descriptor;
        return component;
    },

    async _appendStyles (name, styles) {

        let styleNode = document.querySelector(`style[ref="${name}"]`);

        if (styleNode) {
            styleNode.innerHTML = styles || '';
        } else {
            styleNode = document.createElement('style');
            styleNode.setAttribute('ref', name);
            document.head.appendChild(styleNode);
            styleNode.innerHTML = styles || '';
            await new Promise((resolve, reject) => {
                styleNode.onload = resolve;
                styleNode.onerror = reject;
            });
        }

    },

    async _compileStyles ({style, wrapperClass, noWrapStyle}) {
        if (!noWrapStyle && !style) {
            return Promise.resolve('');
        }
        const styles = style ? `${noWrapStyle || ''} .${wrapperClass}{${style}}` : noWrapStyle;

        const resultText = await new Promise((resolve, reject) => Sass.compile(styles, result => {
            if (result.status !== 0) {
                return reject(new Error(result.message));
            }
            resolve(result.text);
        }));

        return new Promise(resolve => {
            Promise.resolve(resultText)
                .then(css => postcss([autoprefixer]).process(css))
                .tap(result => {
                    _.forEach(result.warnings(), warning => console.warn(warning));
                })
                .get('css')
                .then(css => {
                    resolve(css);
                })
                .catch(error => {
                    console.info('styles:', wrapperClass, style, noWrapStyle);
                    console.warn('failed to compile styles', error);
                    return '';
                });
        });
    },

    _removeStyles (name) {
        const styleNode = document.querySelector(`style[ref="${name}"]`);
        if (styleNode) {
            styleNode.remove();
        }
    }
};
