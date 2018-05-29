<template>
  <div>
    1
    <!-- {{scheduleEventsComp}} -->
  </div>
</template>
<script>
import * as _ from 'lodash';
import {validators} from '_validators';

/* eslint-disable */
import ScheduleEvents from './ScheduleEvents/ScheduleEvents.vue';
/* eslint-enable */


export default {
  name: 'editor-schedule',
  props :   {
      template : {
          type : Object,
          default () {
              return {}
          }
      },
      schema : {
          type : Object,
          default () {
              return {}
          }
      },
      stepId : '',
      steps  : {
          type : Array,
          default () {
              return []
          }
      },
      readonly : {
          type : Boolean,
          default : false
      },
  },
  components: { ScheduleEvents },
  data() {
    return {
    };
  },
  computed: {
    scheduleEventsComp: {
      get() {
          return this.schema.scheduleEvents || [];
      },
      set(newValue) {
        this.schema.scheduleEvents = newValue;
      }
    },
  },

  methods: {},

  validations() {
    return {
      schema: validator(this.template),
    };
  },
};

export const data = template => ({
  scheduleEvents: [],
});

export const validator = template => {
  return {};
};

export const meta = {
  name: 'Shcedule',
  type: 'onereach-studio-form-editor',
  version: '1.0',
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
</style>