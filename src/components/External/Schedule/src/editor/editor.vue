<template>
  <div>
    31
      <schedule-events
        :schedule-events.sync="scheduleEventsComp"
        :step="step"
        :stepId="stepId"
        :$v="$v"
        @new-copy-schedule-event-data="newCopyScheduleEventData"
      ></schedule-events>
  </div>
</template>
<script>
import * as _ from 'lodash';

/* eslint-disable */
// if (process.env.NODE_ENV === 'development') {
// import { validators } from '../../../../../validators.js';
// } else {
import { validators } from '_validators';
// }

import ScheduleEvents from './ScheduleEvents/ScheduleEvents.vue';

import valdationsReccurin from './validation/validationReccuring.js';

import defaultValues from './Constants/DefaultValues.js';

/* eslint-enable */

const { required, generateValidators } = validators;
const schemaValidation = {
  required,
  custom(value) {
    console.log('valuevalue', value);
    let valid = true;
    if (value.isReccuring) {
      if (!value.isEndTime && !value.endExpression.date) {
        valid = false;
      }

      if (!value.savedAccordionSlotName) {
        valid = false;
      }

      if (!valdationsReccurin.daily(value)) {
        valid = false;
      }

      if (!valdationsReccurin.weekly(value)) {
        valid = false;
      }

      if (!valdationsReccurin.monthly(value)) {
        valid = false;
      }

      if (!valdationsReccurin.yearly(value)) {
        valid = false;
      }
    }

    return valid;
  },
  startExpression: {
    required,
    date: generateValidators('template.validateRequired', {
      required,
    }),
  },
  timeZone: {
    value: {
      required,
    },
  },
  times: {
    custom(value) {
      let valid = true;
      value.forEach(item => {
        if (!item.start.HH || !item.start.mm) {
          valid = false;
        }
        if (item.endTime && (!item.end.HH || !item.end.mm)) {
          valid = false;
        }
        if (item.endTime && (!item.every.val || item.every.val < 1)) {
          valid = false;
        }
      });
      return valid;
    },
  },
  daily: {
    period: {
      // validPeriod: (stateCurr, stateAbove) =>
      //   stateAbove.periodMode !== 'everyDay'
      //     ? true
      //     : stateCurr && stateCurr > 0,
    },
  },
  weekly: {
    period: {
      // required,
      // minValue: minValue(1),
    },
    weekDays: {
      // required
    },
  },
  monthly: {
    selectedMonths: {
      // required,
    },
    selectedDays: {
      // validSelectedDays: (stateCurr, stateAbove) =>
      //   stateAbove.mode === 'onThe' ? true : stateCurr.length,
    },
  },
  yearly: {
    period: {
      // required, minValue: minValue(1)
    },
    selectedMonths: {
      // required,
    },
  },
};

export const validator = template => {
  return {
    scheduleEventsValidation: {
      required,
      scheduleEvents: {
        required,
        $each: {
          scheduleEventData: _.cloneDeep(schemaValidation),
        },
      },
    },
    validationCopyScheduleEventData: _.cloneDeep(schemaValidation),
  };
};

export const data = template => ({
  scheduleEvents: _.get(this, 'schema.scheduleEvents', null) || [],
  // scheduleEventsValidation: _.get(this, 'schema.scheduleEvents', null) || [];
});

export default {
  props: ['template', 'schema', 'step', 'stepId', 'steps', 'readonly'],
  computed: {
    scheduleEventsComp: {
      get() {
        return _.get(this, 'schema.scheduleEvents', null) || [];
      },
      set(newValue) {
        if (_.get(this, 'schema.scheduleEvents', null)) {
          this.schema.scheduleEvents = newValue;
          // this.scheduleEventsValidation = newValue;
          // this.$set(this.scheduleEventsValidation, 'scheduleEvents', newValue);
        }
      },
    },
    // this.validationCopyScheduleEventDataComp() {
    //   return validationCopyScheduleEventData
    // }
  },
  watch: {
    schema: {
      handler(newValue) {
        this.scheduleEventsValidation.scheduleEvents = newValue.scheduleEvents;
      },
      deep: true,
    },
    // scheduleEventsComp(newValue) {
    //   // setTimeout(() => {
    //   this.scheduleEventsValidation = this.schema.scheduleEvents;
    //   // }, 2000);
    // },
  },
  methods: {
    newCopyScheduleEventData(newValue) {
      console.log(
        'validationCopyScheduleEventData',
        this.schema.validationCopyScheduleEventData,
      );
      if (this.validationCopyScheduleEventData) {
        this.validationCopyScheduleEventData = newValue;
      }
    },
  },
  components: { ScheduleEvents },
  // validations: {
  //   email: { required } // rules object
  // },
  validations() {
    return validator(this.template);
  },
  data() {
    console.log(this.schema);

    return {
      scheduleEventsValidation: { scheduleEvents: [] },
      // scheduleEvents: _.get(this, 'schema.scheduleEvents', null) || [],
      // scheduleEvents: this.schema.scheduleEvents,
      validationCopyScheduleEventData: {},
    };
  },
};

export const meta = {
  name: 'schedule-component',
  type: 'onereach-studio-form-editor',
  version: '0.5.0',
};
</script>