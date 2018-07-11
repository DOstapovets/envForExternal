<template>
  <div>
    33
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
    if (!value) {
      return false;
    }
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
      console.log('valuevalue', value);
      if (!value) {
        return false;
      }
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
    // validationCopyScheduleEventData: _.cloneDeep(schemaValidation),
  };
};

export const data = template => ({
  scheduleEvents: _.get(this, 'schema.scheduleEvents', null) || [],
  // scheduleEventsValidation: _.get(this, 'schema.scheduleEvents', null) || [];
});

export default {
  props: {
    template: null,
    schema: {
      type: Object,
      default: () => ({
        scheduleEvents: [
          {
            scheduleEventData: {
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
            previewTexts: {
              reccuring: '',
            },
          },
        ],
      }),
    },
    step: null,
    stepId: null,
    steps: null,
    readonly: null,
  },
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
          // if (newValue.scheduleEvents) {
          //   this.scheduleEventsValidation.scheduleEvents = this.schema.scheduleEvents;
          // }
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
        console.log('newValue234234234', JSON.stringify(newValue));
        if (newValue.scheduleEvents) {
          this.scheduleEventsValidation.scheduleEvents =
            newValue.scheduleEvents;
        }
      },
      deep: true,
    },
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
    console.log('this.schema', this.schema);

    return {
      scheduleEventsValidation: { scheduleEvents: this.schema.scheduleEvents },
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