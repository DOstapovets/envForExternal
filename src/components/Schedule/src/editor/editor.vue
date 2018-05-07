<template>
  <div>
    <or-list
      label="Basic List" 
      v-model="scheduleEventsLocal" 
      :steps="steps" 
      :step-id="stepId"
      add-button-label="Add Event"
      :new-item-method="listNewItemMethod">
      <template scope="item">
        <or-button @click="openModal('modal')">Basic Modal</or-button>
      </template>
    </or-list>
    <or-modal
      ref="modal"
      title="Set schedule"
    >
      <div class="schedule__wr-events-calendar">
        <div class="schedule__calendar">
          <calendar
            :month="1"
          >
          </calendar>
        </div>
        <div class="schedule__events">
          <or-list
            v-model="scheduleEventsLocal" 
            :steps="steps" 
            :step-id="stepId"
            add-button-label="Add Event"
            :new-item-method="listNewItemMethod">
            <template scope="item">
              <schedule-event
                :start-expression.sync="item.item.startExpression"
                :deactivate-after-last-run.sync="item.item.deactivateAfterLastRun"
                :is-reccuring.sync="item.item.isReccuring"
                :expressions.sync="item.item.expressions" 
                :is-end-time.sync="item.item.isEndTime" 
                :end-expression.sync="item.item.endExpression" 
                :include-end-time.sync="item.item.includeEndTime" 
                :time-zone.sync="item.item.timeZone"     
                :daily.sync="item.item.daily"   
                :weekly.sync="item.item.weekly"   
                :monthly.sync="item.item.monthly"
                :times.sync="item.item.times"
                :$v="$v"
                :readonly="readonly"  
                :step-id="stepId"
                :steps="steps"
              >
              </schedule-event>
            </template>
          </or-list>
        </div>
      </div>
    </or-modal>
  </div>
</template>
<script>
// import * as _ from 'lodash';
// import { validators } from '_validators';

// const { required, jsExpressionNonEmptyString, validateIf } = validators;

/* eslint-disable */
import ScheduleEvent from './ScheduleEvent.vue';
import Calendar from './Calendar/Calendar.vue';

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
  components: { ScheduleEvent, Calendar },
  computed: {},

  created() {
    // console.log('!!!!!!!!!!!!!!', this.$v);
  },

  data() {
    return { scheduleEventsLocal: this.scheduleEvents };
  },

  methods: {
    listNewItemMethod() {
      return {
        startExpression: {
          time: '00:00',
          date: '',
        },
        deactivateAfterLastRun: false,
        includeEndTime: false,
        isReccuring: false,
        expressions: [],
        isEndTime: false,
        endExpression: {
          time: '00:00',
          date: '',
        },
        timeZone: {},
        daily: {},
        weekly: {},
        monthly: {},
        times: [],
      };
    },
    openModal(ref) {
      this.$refs[ref].open();
    },
    closeModal(ref) {
      this.$refs[ref].close();
    },
  },

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

<style lang="scss" rel="stylesheet/scss">
.ui-modal__container {
  width: 100%;
}
</style>

<style scoped lang="scss" rel="stylesheet/scss">
.schedule {
  &__wr-events-calendar {
    display: flex;
  }
  &__calendar {
    min-width: 850px;
    padding-right: 30px;
  }
}
</style>
