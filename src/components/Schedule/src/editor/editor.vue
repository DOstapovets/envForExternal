<template>
  <div>
    <or-list
      label="Basic List" 
      v-model="scheduleEvents" 
      :steps="steps" 
      :step-id="stepId"
      add-button-label="Add Event"
      :new-item-method="listNewItemMethod">
      <template scope="item">
        <or-button @click="openModal('modal'), doEditable(item.index)">Basic Modal</or-button>
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
            @selected-date="selectedDate"
            :selected-days="startDays"
          >
          </calendar>
        </div>
        <div class="schedule__events">
          <or-list
            v-model="scheduleEvents" 
            :steps="steps" 
            :step-id="stepId"
            add-button-label="Add Event"
            :new-item-method="listNewItemMethod">
            <template scope="item">
              <schedule-event
                v-if="editableEventNum === item.index"
                :editable-event-num="editableEventNum"
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
              <schedule-event-preview
                v-if="editableEventNum !== item.index"
                @do-editable="doEditable" :index="item.index"
              >
              </schedule-event-preview>
            </template>
          </or-list>
        </div>
      </div>
    </or-modal>
  </div>
</template>
<script>
import _ from 'lodash';

// import * as _ from 'lodash';
// import { validators } from '_validators';
// const { required, jsExpressionNonEmptyString, validateIf } = validators;
const randomColor = require('randomcolor').randomColor;
/* eslint-disable */
import ScheduleEvent from './ScheduleEvent.vue';
import ScheduleEventPreview from './ScheduleEventPreview/ScheduleEventPreview.vue';
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
  components: { ScheduleEvent, Calendar, ScheduleEventPreview },

  created() {
    // console.log('!!!!!!!!!!!!!!', this.$v);
  },

  data() {
    return {
      // scheduleEventsLocal: this.scheduleEvents,
      editableEventNum: null,
    };
  },
  computed: {
    startDays() {
      return this.scheduleEvents.map(item => {
        const dateSplice = item.startExpression.date.split('-');
        return {
          color: item.color,
          date: {
            day: dateSplice[2],
            month: dateSplice[1],
            year: dateSplice[0],
          },
        };
      });
    },
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
        color: randomColor(),
      };
    },
    openModal(ref) {
      this.$refs[ref].open();
    },
    closeModal(ref) {
      this.$refs[ref].close();
    },
    selectedDate(day, month, year) {
      // this.startDay = `${year}-${month}-${day}`;
      this.scheduleEvents[
        this.editableEventNum
      ].startExpression.date = `${year}-${month}-${day}`;
    },
    doEditable(index) {
      this.editableEventNum = index;
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
