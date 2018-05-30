<template>
    <div class="schedule-wrapper">
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

    export const label = 'Schedule v0.5.0';
    export const data = {
        scheduleEvents : [],
    };

    export const meta = {
        name    : 'schedule-component',
        type    : 'onereach-studio-form-input',
        version : '0.5.0'
    };
</script>