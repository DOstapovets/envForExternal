<template>
    <div class="example-input-component-wrapper">
        <div class="wrapper" @click="$refs.configModal.open()">
            <editor :template="defaultValue"
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

            <or-textbox name="label" label="Title" placeholder="Title text"
                        v-model="input.data.title">
            </or-textbox>
            <or-switch label="Use header" v-model="input.data.isHeader"></or-switch>
            <or-textbox name="name" label="Button label" placeholder="Enter button label"
                        v-model="input.data.btn_label">
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
        validateRequired    : true,
        title               : 'Variables',
        isHeader            : true,
        btn_label           : 'Add new variable'
    };

    export const meta = {
        name    : 'test-external-component',
        type    : 'onereach-studio-form-input',
        version : '1.0'
    };
</script>

<style>
    .example-input-component-wrapper{
        width: 100%;
    }
</style>
