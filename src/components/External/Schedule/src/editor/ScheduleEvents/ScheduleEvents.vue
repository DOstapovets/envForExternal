<template>
  <div>
    <!-- {{scheduleEvents[0].daily}} -->
    <or-list
      label="Basic List" 
      v-model="scheduleEvents" 
      :steps="steps" 
      :step-id="stepId"
      add-button-label="Add Event"
      :new-item-method="listNewItemMethod"
      :drag-handle-right="true"
    >
      <template scope="item">
        <div class="schedule__wr-event-preview" @click="openModal('modal'), doEditable(item.index)">
          <schedule-event-preview
            :color="item.item.scheduleEventData.color"
          >
          </schedule-event-preview>
        </div>
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
            @selected-date="changeSelectedDate"
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
            :new-item-method="listNewItemMethod"
            :drag-handle-right="true"
          >
            <template scope="item">
              <!-- <schedule-event
                v-if="editableEventNum == item.index"
                :schedule-event-data.sync="item.item.scheduleEventData"
                :selected-date="selectedDateLocal"
                :$v="$v"
                :readonly="readonly"  
                :step-id="stepId"
                :steps="steps"
                @save-copy="/*saveCopy*/"
                @return-state="/*returnState*/"
              >
              </schedule-event> -->
              <schedule-event
                v-if="editableEventNum == item.index && copyScheduleEventData"
                :copy-schedule-event-data.sync="copyScheduleEventData"
                :schedule-event-data.sync="scheduleEvents[editableEventNum].scheduleEventData"
                :$v="$v"
                :readonly="readonly"
                :step-id="stepId"
                :steps="steps"
                @save-copy="/*saveCopy*/"
                @return-state="/*returnState*/"
                @apply-changes="applyChanges"
                @cancel-changes="cancelChanges"
              >
              </schedule-event>
              <schedule-event-preview
                v-if="editableEventNum !== item.index"
                :color="item.item.scheduleEventData.color"
                @do-editable="doEditable"
                :index="item.index"
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
import moment from 'moment';

// import * as _ from 'lodash';
// import { validators } from '_validators';
// const { required, jsExpressionNonEmptyString, validateIf } = validators;
import randomMC from 'random-material-color';

/* eslint-disable */
import ScheduleEvent from '../ScheduleEvent/ScheduleEvent.vue';
import ScheduleEventPreview from '../ScheduleEventPreview/ScheduleEventPreview.vue';
import Calendar from '../../../../../Ui/Calendar/Calendar.vue';
/* eslint-enable */

const randomColor = _.get(randomMC, 'module.exports.getColor', randomMC.getColor);

export default {
  name: 'schedule-events',
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
      copyScheduleEventData: null
      // editableCopy: [],
    };
  },
  computed: {
    startDays() {
      const dates = this.scheduleEvents.map(item => {
        const dateSplice = item.scheduleEventData.startExpression.date.split('-');
        
        return {
          color: item.scheduleEventData.color,
          date: {
            day: parseInt(dateSplice[2], 10),
            month: parseInt(dateSplice[1], 10),
            year: parseInt(dateSplice[0], 10),
          },
        };

      })
      .filter((item, index) => index !== this.editableEventNum);

      if (this.copyScheduleEventData) {
        const copyScheduleEventDataSplice = this.copyScheduleEventData.startExpression.date.split('-');
        dates.push({
            color: this.scheduleEvents[this.editableEventNum].scheduleEventData.color,
            date: {
              day: parseInt(copyScheduleEventDataSplice[2], 10),
              month: parseInt(copyScheduleEventDataSplice[1], 10),
              year: parseInt(copyScheduleEventDataSplice[0], 10),
            },
          }
        );
      }
      return dates;
    },
  },

  methods: {
    listNewItemMethod() {
      return {
        scheduleEventData: {
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
          timeZone: {
            label: '',
            value: ''
          },
          daily: {
            periodMode: 'everyDay',
            period: '1',
            cronExpressions: [],
          },
          weekly: {
            period: '1',
            cronExpressions: [],
            weekDays: [],
          },
          monthly: {
            selectedMonths: [],
            selectedDays: [],
            mode: 'each',
            daysPeriod: { day: '', period: '' },
            period: '1',
            cronExpressions: [],
          },
          yearly: {
            selectedMonths: [],
            period: '1',
            cronExpressions: [],
            selectedDays: [],
            daysPeriod: { day: '', period: '' },
            onThe: false,
          },
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
          color: randomColor(),
        },
      };
    },
    openModal(ref) {
      this.$refs[ref].open();
    },
    closeModal(ref) {
      this.$refs[ref].close();
    },
    changeSelectedDate(day, month, year) {
      this.copyScheduleEventData.startExpression.date = moment(`${year}-${month}-${day}`).format('YYYY-MM-DD');
      // this.selectedDateLocal = `${year}-${month}-${day}`;
    },
    doEditable(index) {
      this.editableEventNum = index;
      // this.copyScheduleEventData = _.cloneDeep(this.scheduleEvents[index].scheduleEventData);
      this.$set(this, 'copyScheduleEventData', _.cloneDeep(this.scheduleEvents[index].scheduleEventData));
    },
    // saveCopy(index) {
    //   this.editableCopy[index] = this.scheduleEvents[index];
    //   console.log('this.editableCopy',this.editableCopy);
    // },
    // returnState(index) {
    //   this.scheduleEvents[index] = this.editableCopy[index];
    //   console.log('this.scheduleEvents[index]', this.scheduleEvents[index]);
    // },
    applyChanges() {
      this.scheduleEvents[this.editableEventNum].scheduleEventData = _.cloneDeep(this.copyScheduleEventData);
    },
    cancelChanges() {
      this.copyScheduleEventData = _.cloneDeep(this.scheduleEvents[this.editableEventNum].scheduleEventData);
    }
  },
};

</script>

<style lang="scss" rel="stylesheet/scss">
.ui-modal__container {
  width: 100%;
}
.schedule-event-preview {
  margin-bottom: 20px;
}
</style>

<style scoped lang="scss" rel="stylesheet/scss">
.schedule {
  &__wr-events-calendar {
    display: flex;
  }
  &__calendar {
    min-width: 800px;
    width: 100%;
    padding-right: 30px;
  }
  &__wr-event-preview {
    width: 100%;
  }
}
</style>