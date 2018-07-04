<template>
  <div class="schedule-events">
    <!-- {{scheduleEvents}} -->
    <!-- {{scheduleEvents[0].daily}} -->
    <or-list
      label="Basic List" 
      v-model="scheduleEvents" 
      :steps="steps" 
      :step-id="stepId"
      add-button-label="Add Event"
      :new-item-method="listNewItemMethod"
      :drag-handle-right="true"
      @item-added="eventAdded"
    >
      <template scope="item">
        <div class="schedule__wr-event-preview" @click="doEditable(item.index)">
          <schedule-event-preview
            :color="item.item.scheduleEventData.color"
            :event-name="item.item.scheduleEventData.eventName"
            :preview-texts="item.item.previewTexts"
            :is-reccuring="item.item.scheduleEventData.isReccuring"
            :startTimes="item.item.scheduleEventData.times"
            :end-date="{ noEnd: item.item.scheduleEventData.isEndTime, date: item.item.scheduleEventData.endExpression.date}"
            :start-date="item.item.scheduleEventData.startExpression.date"
            :expressions="item.item.scheduleEventData.expressions"
            :index="item.index"
            @do-editable="doEditable"
            @copy-event="copyEvent"
            @delete-event="deleteEvent"
          >
          </schedule-event-preview>
        </div>
      </template>
    </or-list>
    <or-modal
      :contain-focus="false"
      class="big-modal"
      ref="modal"
      title="Set schedule"
      @close="closeModalEvent('modal')"
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
            @item-added="eventAdded"
          >
            <template scope="item">
              <schedule-event
                v-if="editableEventNum == item.index && copyScheduleEventData"
                :index="item.index"
                :copy-schedule-event-data.sync="copyScheduleEventData"
                :schedule-event-data.sync="scheduleEvents[editableEventNum].scheduleEventData"
                :$v="$v"
                :readonly="readonly"
                :step-id="stepId"
                :steps="steps"
                :data-state.sync="dataStates[item.index]"
                :preview-texts="item.item.previewTexts"
                @save-copy="/*saveCopy*/"
                @return-state="/*returnState*/"
                @apply-changes="applyChanges"
                @cancel-changes="cancelChanges"
                @data-state="/*changeDataState*/"
              >
              </schedule-event>
              <schedule-event-preview
                v-if="editableEventNum !== item.index"
                :color="item.item.scheduleEventData.color"
                :index="item.index"
                :event-name="item.item.scheduleEventData.eventName"
                :preview-texts="item.item.previewTexts"
                :is-reccuring="item.item.scheduleEventData.isReccuring"
                :startTimes="item.item.scheduleEventData.times"
                :end-date="{ noEnd: item.item.scheduleEventData.isEndTime, date: item.item.scheduleEventData.endExpression.date}"
                :start-date="item.item.scheduleEventData.startExpression.date"
                :expressions="item.item.scheduleEventData.expressions"
                @do-editable="doEditable"
                @copy-event="copyEvent"
                @delete-event="deleteEvent"
              >
              </schedule-event-preview>
            </template>
          </or-list>
        </div>
      </div>
    </or-modal>
    <or-modal  :contain-focus="false" ref="dataNotSave" title="Discard unsaved changes">
        You have unsaved changes. Are you sure you want to discard them?

        <div slot="footer">
            <or-button color="red" @click="discard">Discard</or-button>
            <or-button color="primary" type="secondary" @click="closeModal('dataNotSave')">Cancel</or-button>
        </div>
    </or-modal>
  </div>
</template>
<script>
import _ from 'lodash';
import moment from 'moment';
import uuid from 'uuid';
import randomMC from 'random-material-color';
/* eslint-disable */
import defaultValues from '../Constants/DefaultValues.js';
/* eslint-enable */

// import * as _ from 'lodash';
// import { validators } from '_validators';
// const { required, jsExpressionNonEmptyString, validateIf } = validators;


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
      copyScheduleEventData: null,
      dataStates: [],
      // editableCopy: [],
    };
  },
  computed: {
    startDays() {
      const dates = this.scheduleEvents.map(item => {
        const dateSplice = item.scheduleEventData.startExpression.date.split('-');
        
        return {
          color: item.scheduleEventData.color,
          expressions: item.scheduleEventData.expressions,
          isReccuring: item.scheduleEventData.isReccuring,
          endExpression: item.scheduleEventData.endExpression,
          startExpression: item.scheduleEventData.startExpression,
          isEndTime: item.scheduleEventData.isEndTime,
          eventName: item.scheduleEventData.eventName,
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
            color: this.copyScheduleEventData.color,
            expressions: this.copyScheduleEventData.expressions,
            isReccuring: this.copyScheduleEventData.isReccuring,
            endExpression: this.copyScheduleEventData.endExpression,
            startExpression: this.copyScheduleEventData.startExpression,
            isEndTime: this.copyScheduleEventData.isEndTime,
            eventName: this.copyScheduleEventData.eventName,
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
    changedNumber() {
      return this.dataStates.indexOf('changed');
    }
  },

  methods: {
    listNewItemMethod() {
      return {
        scheduleEventData: {
          id: uuid.v4(),
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
            value: ''
          },
          daily: defaultValues.daily,
          weekly: defaultValues.weekly,
          monthly: defaultValues.monthly,
          yearly: defaultValues.yearly,
          times: [
            {
              start: {
                HH: '00',
                mm: '00',
              },
              end: {
                HH: '00',
                mm: '00',
              },
              every: {
                val: 10,
                units: 'mm',
              },
              endTime: false,
              vforkey: uuid.v4(),
            },
          ],
          color: randomColor(),
          savedAccordionSlotName: null,
        },
        previewTexts: {
          reccuring: ''
        }
      };
    },
    openModal(ref) {
      this.$refs[ref].open();
    },
    closeModal(ref) {
      this.$refs[ref].close();
    },
    closeModalEvent(ref) {
      if (this.changedNumber !== -1) {
        this.$refs[ref].open();
        this.openModal('dataNotSave');
      }
    },
    changeSelectedDate(day, month, year) {
      this.copyScheduleEventData.startExpression.date = moment(`${year}-${month}-${day}`).format('YYYY-MM-DD');
      // this.copyScheduleEventData.startExpression.date = new Date(`${year}-${month}-${day}`);
      // this.selectedDateLocal = `${year}-${month}-${day}`;
    },
    doEditable(index) {
      if (!this.$refs.modal.isOpen) {
        this.openModal('modal');
      }
      this.editableEventNum = index;
      // this.copyScheduleEventData = _.cloneDeep(this.scheduleEvents[index].scheduleEventData);
      this.$set(this, 'copyScheduleEventData',  _.cloneDeep(this.scheduleEvents[index].scheduleEventData));

      // this.copyScheduleEventData = Object.assign({}, this.scheduleEvents[index].scheduleEventData, {id: uuidv4()});
      console.log('this.copyScheduleEventData', this.copyScheduleEventData);
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
    },
    changeDataState(newDataState) {
      this.dataState = newDataState;
    },
    discard() {
      this.$set(this.dataStates, this.changedNumber, 'canceled');
      this.closeModal('dataNotSave');
      this.closeModal('modal');
    },
    copyEvent(index) {
      const  copyOfEvent = _.cloneDeep(this.scheduleEvents[index]);
      copyOfEvent.vforkey = uuid.v4();
      copyOfEvent.scheduleEventData.id = uuid.v4();
      copyOfEvent.scheduleEventData.eventName = `Copy of ${copyOfEvent.scheduleEventData.eventName}`;
      copyOfEvent.scheduleEventData.color = randomColor();
      this.scheduleEvents.push(copyOfEvent);
    },
    deleteEvent(index) {
      this.scheduleEvents.splice(index, 1);
    },
    eventAdded() {
      this.$set(this.dataStates, this.scheduleEvents.length - 1, 'new');
      this.doEditable(this.scheduleEvents.length - 1);
    },
  },
  watch: {
    copyScheduleEventData: {
      handler(newValue) {
        this.$emit('new-copy-schedule-event-data', newValue);
      },
      deep: true
    }
  }
};

</script>

<style lang="scss" rel="stylesheet/scss">
.schedule-events {
  .big-modal > .ui-modal__wrapper > .ui-modal__container {
    width: 100%;
  }

  .schedule-event-preview {
    margin-bottom: 20px;
  }

  .schedule {
    &__wr-events-calendar {
      display: flex;
    }
    &__calendar {
      min-width: 930px;
      width: 100%;
      padding-right: 30px;
    }
    &__wr-event-preview {
      width: 100%;
    }
  }

  .bold-text {
    color: #0F232E;
    font-size: 14px;
    font-weight: bold;
    line-height: 21px;
  }
}
</style>