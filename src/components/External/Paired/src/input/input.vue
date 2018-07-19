<template>
    <div class="example-input-component-wrapper">
        <div class="wrapper" @click="$refs.configModal.open()">
            <editor :template="input.data"
                    :schema="defaultStep.data"
                    :step="defaultStep"
                    :steps="[defaultStep]"
                    :readonly="true">
            </editor>
        </div>
        <or-modal ref="configModal" :remove-close-button="true"
                  title="Configure component"
                  class="input-message-settings"
                  :contain-focus="false">
            <or-textbox name="label" label="OrCollapsible Label" placeholder="label text"
                        v-model="input.data.emailLabel"
                        help="input label text">
            </or-textbox>

            <or-textbox name="label" label="Email placeholder" placeholder="placeholder text"
                        v-model="input.data.emailPlaceholder"
                        help="input label text">
            </or-textbox>

            <div slot="footer">
                <or-button color="primary"
                           type="secondary"
                           @click.prevent="$refs.configModal.close()">
                    Close
                </or-button>
            </div>
        </or-modal>
    </div>
</template>

<script>
    import _ from 'lodash';
    import base from '@default/src/inputs/_design_base.vue';
    import editor from '../editor/editor.vue';

    export default {
        extends    : base,
        components : {
            editor
        },
        defaultValue () {
            return _.cloneDeep(data);
        }
    };

    export const label = 'Test example';
    export const data = {
        email               : '',
        emailPlaceholder    : 'Test email placeholder',
        emailLabel          : '',
        password            : '',
        passwordPlaceholder : 'Test password placeholder',
        passwordLabel       : '',
        validateRequired    : true
    };

    export const meta = {
        name    : 'test-external-component',
        type    : 'onereach-studio-form-input',
        version : '1.0'
    };
</script>
