<template>
    <div class="condition-builder-component-wrapper">
        <div class="wrapper" @click="$refs.configModal.open()">
            <editor>
            </editor>
        </div>

        <or-modal ref="configModal" :remove-close-button="true"
                  title="Configure component"
                  class="input-message-settings"
                  :contain-focus="false">
                  fsdfsdfsdfsdfs
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

    export const label = 'Conditon builder v0.5.0';
    export const data = {
        // isSingleExit : true,
        // conditionRuleHasDataOut : true,
        // conditionExits : [],
        // singleExitRules : {
        //     rules : []
        // }
    };

    export const meta = {
      name: 'test-external-component',
      type: 'onereach-studio-form-input',
      version: '1.0',
    };
</script>