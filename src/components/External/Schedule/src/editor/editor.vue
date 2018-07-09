<template>
  <div>
    <!-- {{schema}} -->
     <!-- {{$v}}
     <br/>
     <br/>
     <br/> -->
     <!-- {{schemaValidation}} -->
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
import ScheduleEvents from './ScheduleEvents/ScheduleEvents.vue';
// import { validators } from '../../../../../validators.js';
import { validators } from '_validators';
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
    date: generateValidators('template.validateRequired', { required }),
  },
  timeZone: {
    value: { required },
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
    scheduleEvents: {
      required,
      $each: {
        scheduleEventData: schemaValidation,
      },
    },
    validationCopyScheduleEventData: schemaValidation,
  };
};

export const data = template => ({
  scheduleEvents: [],
  // validationCopyScheduleEventData: {
  //   // startExpression: {
  //   //   time: '00:00',
  //   //   date: '',
  //   // },
  //   // deactivateAfterLastRun: false,
  //   // includeEndTime: false,
  //   // isReccuring: false,
  //   // expressions: [],
  //   // isEndTime: false,
  //   // eventName: '',
  //   // endExpression: {
  //   //   time: '00:00',
  //   //   date: '',
  //   // },
  //   // timeZone: {
  //   //   label: '',
  //   //   value: '',
  //   // },
  //   // daily: defaultValues.daily,
  //   // weekly: defaultValues.weekly,
  //   // monthly: defaultValues.monthly,
  //   // yearly: defaultValues.yearly,
  //   // times: [
  //   //   {
  //   //     start: {
  //   //       HH: '',
  //   //       mm: '',
  //   //     },
  //   //     end: {
  //   //       HH: '',
  //   //       mm: '',
  //   //     },
  //   //     every: {
  //   //       val: 10,
  //   //       units: 'mm',
  //   //     },
  //   //     endTime: false,
  //   //   },
  //   // ],
  //   // color: '',
  //   // savedAccordionSlotName: null,
  //   // previewTexts: {
  //   //   reccuring: '',
  //   // },
  // },
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
        }
      },
    },
    // this.validationCopyScheduleEventDataComp() {
    //   return validationCopyScheduleEventData
    // }
  },
  methods: {
    newCopyScheduleEventData(newValue) {
      console.log(
        'validationCopyScheduleEventData',
        this.validationCopyScheduleEventData,
      );
      if (this.schema && this.validationCopyScheduleEventData) {
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
    return {
      // scheduleEvents: this.schema.scheduleEvents,
      validationCopyScheduleEventData: {
        startExpression: {
          time: '00:00',
          date: '',
        },
        deactivateAfterLastRun: false,
        includeEndTime: false,
        isReccuring: false,
        expressions: [],
        isEndTime: false,
        eventName: '',
        endExpression: {
          time: '00:00',
          date: '',
        },
        timeZone: {
          label: '',
          value: '',
        },
        daily: defaultValues.daily,
        weekly: defaultValues.weekly,
        monthly: defaultValues.monthly,
        yearly: defaultValues.yearly,
        times: [
          {
            start: {
              HH: '',
              mm: '',
            },
            end: {
              HH: '',
              mm: '',
            },
            every: {
              val: 10,
              units: 'mm',
            },
            endTime: false,
          },
        ],
        color: '',
        savedAccordionSlotName: null,
        previewTexts: {
          reccuring: '',
        },
      },
    };
  },
};

export const meta = {
  name: 'schedule-component',
  type: 'onereach-studio-form-editor',
  version: '0.5.0',
};
</script>