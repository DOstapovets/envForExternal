<template>
  <div>
    {{scheduleEventsComp}}
      <schedule-events 
        :schedule-events.sync="scheduleEventsComp"
        :step="step"
        :stepId="stepId"
      ></schedule-events>
  </div>
</template>
<script>
import _ from 'lodash';
/* eslint-disable */
import ScheduleEvents from './ScheduleEvents/ScheduleEvents.vue';
/* eslint-enable */

export default {
  name: 'editor-schedule',
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
  components: { ScheduleEvents },
  data() {
    return {};
  },
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

  methods: {},

  validations() {
    return {
      // schema: validator(this.template),
    };
  },
};

export const data = template => ({
  scheduleEvents: [],
  // email: '',
  // emailPlaceholder: template.emailPlaceholder,
  // emailLabel: template.emailLabel,
  // password: '',
  // passwordPlaceholder: template.passwordPlaceholder,
  // passwordLabel: template.passwordLabel,
});

// export const validator = template => {
// return {};
// };

export const meta = {
  name: 'Shcedule',
  type: 'onereach-studio-form-editor',
  version: '1.0',
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
</style>