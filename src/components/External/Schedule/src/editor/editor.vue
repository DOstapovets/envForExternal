<template>
  <div>
      <schedule-events 
        :schedule-events.sync="scheduleEventsComp"
        :step="step"
        :stepId="stepId"
      ></schedule-events>
  </div>
</template>

<script>
    import * as _ from 'lodash';
    /* eslint-disable */
    import ScheduleEvents from './ScheduleEvents/ScheduleEvents.vue';
    /* eslint-enable */

    // import {validators} from '_validators';
    // const {required, jsExpressionNonEmptyString, validateIf} = validators;

    export default {
      props: [
        'scheduleEvents',
        '$v',
        'template',
        'schema',
        'step',
        'stepId',
        'steps',
        'readonly',
      ],
      computed: {
        scheduleEventsComp: {
            get() {
              return this.schema.scheduleEvents || [];
            },
            set(newValue) {
              this.schema.scheduleEvents = newValue;
            }
          }
        },
    };

    export const data = (template) => ({
        scheduleEvents  : [],
    });

    export const validator = (template) => {
        return {};
    };

    export const meta = {
        name    : 'condition-builder-component',
        type    : 'onereach-studio-form-editor',
        version : '0.5.0'
    };
</script>