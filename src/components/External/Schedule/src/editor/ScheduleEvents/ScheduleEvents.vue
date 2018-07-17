<template>
  <div class="schedule-events">
    <!-- {{editableEventNum}} -->
    <!-- {{scheduleEvents}} -->
    <!-- {{scheduleEvents[0].daily}} -->
    <!-- {{dataStates}} -->
    <or-list
      v-model="scheduleEventsLocal" 
      :steps="steps" 
      :step-id="stepId"
      add-button-label="Add Event"
      :new-item-method="listNewItemMethod"
      :drag-handle-right="true"
      @item-added="eventAdded"
      prettifyDrag
    >
      <template scope="item">
        <div class="schedule__wr-event-preview" @click="doEditable(item.index)">
          <!-- {{$v.schemaValidation.scheduleEvents.$each.$iter[item.index].scheduleEventData.$invalid}} -->
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
      size="large"
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
            v-model="scheduleEventsLocal" 
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
                :schedule-event-data.sync="scheduleEventsLocal[editableEventNum].scheduleEventData"
                :$v="$v"
                :readonly="readonly"
                :step-id="stepId"
                :steps="steps"
                :data-state.sync="dataStates[item.index]"
                :preview-texts="item.item.previewTexts"
                :editable-event-num.sync="editableEventNum"
                @save-copy="/*saveCopy*/"
                @return-state="/*returnState*/"
                @apply-changes="applyChanges"
                @cancel-changes="cancelChanges"
                @data-state="/*changeDataState*/"
                @delete-event="deleteEvent"
                @cancel-event="cancelEvent"
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
    <or-modal  :contain-focus="false" ref="deleteEvent" title="Сonfirmation of delete">
        Are you sure want delete event?

        <div slot="footer">
            <or-button color="red" @click="deleteСonfirmation()">Delete</or-button>
            <or-button color="primary" type="secondary" @click="closeModal('deleteEvent')">Cancel</or-button>
        </div>
    </or-modal>
    <or-modal  :contain-focus="false" ref="dataNotSave" title="Discard unsaved changes">
        You have unsaved changes. Are you sure you want to discard them?

        <div slot="footer">
            <or-button color="red" @click="discard">Discard</or-button>
            <or-button color="primary" type="secondary" @click="closeModal('dataNotSave')">Cancel</or-button>
        </div>
    </or-modal>
    <or-modal  :contain-focus="false" ref="dataNotSaveEndSwitchToOtherEvent" title="Discard unsaved changes">
        You have unsaved changes. Are you sure you want to discard them?

        <div slot="footer">
            <or-button color="red" @click="discardSwitchToOtherEvent">Discard</or-button>
            <or-button color="primary" type="secondary" @click="closeModal('dataNotSaveEndSwitchToOtherEvent')">Cancel</or-button>
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

const randomColor = _.get(
  randomMC,
  'module.exports.getColor',
  randomMC.getColor,
);

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
      itemIndexForDelete: null,
      scheduleEventsLocal: _.cloneDeep(this.scheduleEvents),
      editableEventNum: null,
      copyScheduleEventData: null,
      dataStates: [],
      numOfTryEdit: null,
      // editableCopy: [],
    };
  },
  computed: {
    startDays() {
      const dates = this.scheduleEventsLocal
        .map(item => {
          const dateSplice = item.scheduleEventData.startExpression.date.split(
            '-',
          );

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
        const copyScheduleEventDataSplice = this.copyScheduleEventData.startExpression.date.split(
          '-',
        );
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
        });
      }
      return dates;
    },
    changedNumber() {
      return this.dataStates.indexOf('changed');
    },
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
              vforkey: uuid.v4(),
            },
          ],
          color: randomColor(),
          savedAccordionSlotName: null,
        },
        previewTexts: {
          reccuring: '',
        },
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
      } else {
        this.deleteNotSaved();
      }
    },
    changeSelectedDate(day, month, year) {
      this.copyScheduleEventData.startExpression.date = moment(
        `${year}-${month}-${day}`,
      ).format('YYYY-MM-DD');
      // this.copyScheduleEventData.startExpression.date = new Date(`${year}-${month}-${day}`);
      // this.selectedDateLocal = `${year}-${month}-${day}`;
    },
    doEditable(index, isNewItem) {
      this.numOfTryEdit = index;

      if (this.changedNumber !== -1) {
        this.openModal('dataNotSaveEndSwitchToOtherEvent');
      } else {
        if (!this.$refs.modal.isOpen) {
          this.openModal('modal');
        }
        this.editableEventNum = index;
        // this.copyScheduleEventData = _.cloneDeep(this.scheduleEventsLocal[index].scheduleEventData);
        this.$set(
          this,
          'copyScheduleEventData',
          _.cloneDeep(this.scheduleEventsLocal[index].scheduleEventData),
        );
        this.deleteNotSaved(true, isNewItem);

        // this.copyScheduleEventData = Object.assign({}, this.scheduleEventsLocal[index].scheduleEventData, {id: uuidv4()});
        // console.log('this.copyScheduleEventData', this.copyScheduleEventData);
      }
    },
    // saveCopy(index) {
    //   this.editableCopy[index] = this.scheduleEventsLocal[index];
    //   console.log('this.editableCopy',this.editableCopy);
    // },
    // returnState(index) {
    //   this.scheduleEventsLocal[index] = this.editableCopy[index];
    //   console.log('this.scheduleEventsLocal[index]', this.scheduleEventsLocal[index]);
    // },
    applyChanges() {
      this.scheduleEventsLocal[
        this.editableEventNum
      ].scheduleEventData = _.cloneDeep(this.copyScheduleEventData);
      this.$emit('update:scheduleEvents', this.scheduleEventsLocal);
    },
    cancelChanges() {
      this.copyScheduleEventData = _.cloneDeep(
        this.scheduleEventsLocal[this.editableEventNum].scheduleEventData,
      );
    },
    changeDataState(newDataState) {
      this.dataState = newDataState;
    },
    discard() {
      this.$set(this.dataStates, this.changedNumber, 'canceled');
      this.closeModal('dataNotSave');
      this.closeModal('modal');
    },
    discardSwitchToOtherEvent() {
      this.$set(this.dataStates, this.changedNumber, 'canceled');
      this.closeModal('dataNotSaveEndSwitchToOtherEvent');
      this.doEditable(this.numOfTryEdit);
    },
    copyEvent(index) {
      const copyOfEvent = _.cloneDeep(this.scheduleEventsLocal[index]);
      copyOfEvent.vforkey = uuid.v4();
      copyOfEvent.scheduleEventData.id = uuid.v4();
      copyOfEvent.scheduleEventData.eventName = `Copy of ${
        copyOfEvent.scheduleEventData.eventName
      }`;
      copyOfEvent.scheduleEventData.color = randomColor();
      this.scheduleEventsLocal.push(copyOfEvent);
    },
    deleteEvent(index) {
      this.itemIndexForDelete = index;
      this.openModal('deleteEvent');
    },
    eventAdded() {
      // this.$set(this.dataStates, this.scheduleEventsLocal.length - 1, 'new');
      this.doEditable(this.scheduleEventsLocal.length - 1, true);
    },
    // validdationScheduleEventData(index) {
    //   console.log(
    //     'this.$v.scheduleEventsValidation',
    //     JSON.stringify(this.$v.scheduleEventsValidation),
    //   );
    //   // return this.$v.scheduleEventsValidation.scheduleEvents.$each.$iter[index]
    //   //   .scheduleEventData.$invalid;
    //   return _.get(
    //     this.$v,
    //     `scheduleEventsValidation.scheduleEvents.$each.$iter[${index}].scheduleEventData.$invalid`,
    //     false,
    //   );
    // },
    // savedEvent() {
    //   this.$emit(
    //     'update:scheduleEvents',
    //     _.cloneDeep(this.scheduleEventsLocal),
    //   );
    // },
    deleteNotSaved(isDelCurrEditable = false, isNewItem = false) {
      this.dataStates[this.itemIndexForDelete] = 'canceled';
      this.scheduleEventsLocal = this.scheduleEventsLocal.filter(
        (item, index) => {
          let res;
          if (this.editableEventNum === index && isDelCurrEditable) {
            res = true;
          } else {
            res = _.get(item, 'scheduleEventData.saved');
          }
          return res;
        },
      );
      if (!isNewItem) {
        this.$emit(
          'update:scheduleEvents',
          _.cloneDeep(this.scheduleEventsLocal),
        );
      } else {
        this.editableEventNum = this.scheduleEventsLocal.length - 1;
      }
      this.$v.validationCopyScheduleEventData.$reset();
    },
    cancelEvent() {
      this.editableEventNum = null;
      this.deleteNotSaved();
    },
    deleteСonfirmation() {
      this.editableEventNum = null;
      this.dataStates[this.itemIndexForDelete] = 'canceled';
      this.scheduleEventsLocal.splice(this.itemIndexForDelete, 1);
      this.$emit('update:scheduleEvents', this.scheduleEventsLocal);
      this.closeModal('deleteEvent');
      this.$v.validationCopyScheduleEventData.$reset();
    },
  },
  watch: {
    copyScheduleEventData: {
      handler(newValue) {
        this.$emit('new-copy-schedule-event-data', newValue);
      },
      deep: true,
    },
    scheduleEventsLocal(newValue) {
      console.log('newValuenewValue', newValue);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
.schedule-events {
  min-width: 410px;
  -webkit-transform: translateZ(0);
  // div.ui-modal.ui-modal__mask.big-modal.ui-modal--size-normal.is-open {
  //   -webkit-backface-visibility: hidden;
  //   -webkit-perspective: 1000;
  //   transform: translate3d(0, 0, 0);
  //   background-attachment: fixed;
  //   background-size: cover;
  //   will-change: transform;
  //   // z-index: -1;
  // }

  .big-modal > .ui-modal__wrapper > .ui-modal__container {
    width: 100%;
  }
  // .ui-modal__mask {
  //   -webkit-transform: translateZ(0);
  // }
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
    &__events {
      min-width: 410px;
    }
  }

  .bold-text {
    color: #0f232e;
    font-size: 14px;
    font-weight: bold;
    line-height: 21px;
  }
}
</style>