<template>
  <div>
    6
    {{scheduleEvents}}
    <!-- {{schema}} -->
     <!-- {{$v}}
     <br/>
     <br/>
     <br/> -->
     <!-- {{schemaValidation}} -->
      <schedule-events
        :schedule-events.sync="scheduleEvents"
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
  // required,
  // custom(value) {
  //   console.log('valuevalue', value);
  //   let valid = true;
  //   if (value.isReccuring) {
  //     if (!value.isEndTime && !value.endExpression.date) {
  //       valid = false;
  //     }

  //     if (!value.savedAccordionSlotName) {
  //       valid = false;
  //     }

  //     if (!valdationsReccurin.daily(value)) {
  //       valid = false;
  //     }

  //     if (!valdationsReccurin.weekly(value)) {
  //       valid = false;
  //     }

  //     if (!valdationsReccurin.monthly(value)) {
  //       valid = false;
  //     }

  //     if (!valdationsReccurin.yearly(value)) {
  //       valid = false;
  //     }
  //   }

  //   return valid;
  // },
  startExpression: {
    // required,
    date: generateValidators('template.validateRequired', {
      // required
    }),
  },
  timeZone: {
    value: {
      // required
    },
  },
  times: {
    // custom(value) {
    //   let valid = true;
    //   value.forEach(item => {
    //     if (!item.start.HH || !item.start.mm) {
    //       valid = false;
    //     }
    //     if (item.endTime && (!item.end.HH || !item.end.mm)) {
    //       valid = false;
    //     }
    //     if (item.endTime && (!item.every.val || item.every.val < 1)) {
    //       valid = false;
    //     }
    //   });
    //   return valid;
    // },
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
      // required,
      $each: {
        scheduleEventData: _.cloneDeep(schemaValidation),
      },
    },
    validationCopyScheduleEventData: _.cloneDeep(schemaValidation),
  };
};

export const data = template => ({
  // scheduleEvents: [],
  // validationCopyScheduleEventData: {
  // startExpression: {
  //   time: '00:00',
  //   date: '',
  // },
  // deactivateAfterLastRun: false,
  // includeEndTime: false,
  // isReccuring: false,
  // expressions: [],
  // isEndTime: false,
  // eventName: '',
  // endExpression: {
  //   time: '00:00',
  //   date: '',
  // },
  // timeZone: {
  //   label: '',
  //   value: '',
  // },
  // daily: defaultValues.daily,
  // weekly: defaultValues.weekly,
  // monthly: defaultValues.monthly,
  // yearly: defaultValues.yearly,
  // times: [
  //   {
  //     start: {
  //       HH: '',
  //       mm: '',
  //     },
  //     end: {
  //       HH: '',
  //       mm: '',
  //     },
  //     every: {
  //       val: 10,
  //       units: 'mm',
  //     },
  //     endTime: false,
  //   },
  // ],
  // color: '',
  // savedAccordionSlotName: null,
  // previewTexts: {
  //   reccuring: '',
  // },
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
    return {
      // scheduleEvents: this.schema.scheduleEvents,
      scheduleEvents: [
        {
          vforkey: '1d9c97fe-b53d-4df1-a090-0e10bd324e9c',
          scheduleEventData: {
            id: '1b2b80d3-5173-407d-80ba-00cdd460b8ca',
            startExpression: { time: '00:00', date: '2018-07-04' },
            deactivateAfterLastRun: false,
            includeEndTime: false,
            isReccuring: false,
            expressions: [],
            isEndTime: false,
            eventName: '',
            endExpression: { time: '00:00', date: '' },
            timeZone: { label: '', value: '' },
            daily: { periodMode: 'everyDay', period: '1', cronExpressions: [] },
            weekly: { period: '1', cronExpressions: [], weekDays: [] },
            monthly: {
              selectedMonths: [],
              selectedDays: [],
              mode: 'each',
              daysPeriod: { day: 'SUN', period: '' },
              cronExpressions: [],
            },
            yearly: {
              selectedMonths: [],
              period: '1',
              cronExpressions: [],
              selectedDays: [],
              daysPeriod: { day: 'SUN', period: '' },
              startYear: 2018,
            },
            times: [
              {
                start: { HH: '', mm: '' },
                end: { HH: '', mm: '' },
                every: { val: 10, units: 'mm' },
                endTime: false,
                vforkey: '2380fd05-59ea-4839-8788-b88b6847ea20',
              },
            ],
            color: '#E91E63',
            savedAccordionSlotName: null,
          },
          previewTexts: { reccuring: '' },
        },
      ],
      validationCopyScheduleEventData: {
        id: '',
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
            vforkey: '',
          },
        ],
        color: '',
        savedAccordionSlotName: null,
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