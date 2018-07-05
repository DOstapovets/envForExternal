<template>
  <div class="schedule-event">
    <!-- {{$v.schemaValidation.scheduleEvents.$each.$iter[index].scheduleEventData.startExpression.date}} -->
    <!-- <div class="date">
      <span v-if="!copyScheduleEventData.eventName">Choose date on calendar</span>
      <span v-else class="date__start-date">{{startDateUi}}</span>
    </div> -->
    <!-- <div class="date">
      <span v-if="!copyScheduleEventData.eventName">Choose date on calendar</span>
      <span v-else class="date__start-date">{{startDateUi}}</span>
    </div> -->
    <div class="schedule-event__title">
      <div 
        :style="{background: copyScheduleEventData.color}"
        class="schedule-event__circle"
      ></div>
      <or-textbox
        placeholder="Specify event name…"
        class="textbox-without-border"
        v-model="copyScheduleEventData.eventName"
      ></or-textbox>
    </div>
    <div class="wr-tizezone-start-date">
      <div class="wr-top-start-date">
        <div class="schedule-event__label">Date</div>
        <div class="recurring-controls__date">
          <or-icon class="recurring-controls__custom-icon-date" icon="view_comfy"></or-icon>
          <ui-datepicker :disabled="readonly" class="recurring-controls__calendar-picker-custom" iconPosition="right" placeholder="Select date"
              :custom-formatter="formatDate" v-model="startDate"
              :invalid="/*$v.schemaValidation.scheduleEvents.$each.$iter[index].scheduleEventData.startExpression.date.$invalid ||*/ $v.validationCopyScheduleEventData.startExpression.date.$invalid">
          </ui-datepicker>
        </div>
      </div>
      <label class="timezone timezone_top">
          <span class="schedule-event__label">Timezone</span>
          <or-select 
            :disabled="readonly" 
            placeholder="Select a time zone" 
            class="config-line__select" 
            :has-search="true" 
            :options="getRegions"
            v-model="timeZoneComp"
            :invalid="$v.validationCopyScheduleEventData.timeZone.value.$invalid"
          >
          </or-select>
      </label>
    </div>
    <div class="wr-time-period-list">
      <div class="schedule-event__label">Time</div>
      <time-period-list
        :times.sync="copyScheduleEventData.times"
        :readonly="readonly"
        :$v="$v"
      >
      </time-period-list>
    </div>
    <div class="recurring-controls">
        <or-checkbox v-model="copyScheduleEventData.isReccuring" :disabled="readonly">Recurring</or-checkbox>
        <span v-if="!copyScheduleEventData.isEndTime && copyScheduleEventData.isReccuring" class="recurring-controls__recuring-till">till</span>
        <div class="recurring-controls__wr-configs-time">
            <div class="" v-if="!copyScheduleEventData.isEndTime && copyScheduleEventData.isReccuring">
                <div class="">
                    <div class="">
                      <div class="recurring-controls__date">
                        <or-icon class="recurring-controls__custom-icon-date" icon="view_comfy"></or-icon>
                        <ui-datepicker 
                          :disabled="readonly"
                          class="recurring-controls__calendar-picker-custom"
                          iconPosition="right" placeholder="Select date"
                          :custom-formatter="formatDate" 
                          v-model="endDate"
                          :invalid="$v.validationCopyScheduleEventData.endExpression.date.$invalid"
                        >
                        </ui-datepicker>
                      </div>
                    </div>
                </div>
            </div>
            <div v-if="copyScheduleEventData.isReccuring" class="recurring-controls__wr-is-end">
                <or-checkbox v-model="copyScheduleEventData.isEndTime" :disabled="readonly">No end</or-checkbox>
            </div>
        </div>
    </div>
          <!-- :saved-accordion-slot-name="copyScheduleEventData.savedAccordionSlotName" -->
          <!-- {{copyScheduleEventData.savedAccordionSlotName}}
          {{savedAccordionNumItemComp}} -->
    <accordion
      :opened-item.sync="copyScheduleEventData.savedAccordionSlotName"
      v-if="copyScheduleEventData.isReccuring"
      :saved-accordion-num-item="scheduleEventData.savedAccordionSlotName"
      @close-item="closeAccordionItem"
      @opened-item="openedAccordionItem"
      @do-editable="doEditable"
    >
        <template  slot="item1">
            <div placeholderItem="Set recurring daily"  titleItem="Daily">
              <cron-generators-daily
                :period.sync="copyScheduleEventData.daily.period"
                :period-mode.sync="copyScheduleEventData.daily.periodMode"
                :runAtTime="runAtTimeLocal"
                :readonly="readonly"
                v-model="copyScheduleEventData.daily.cronExpressions"
                :index="0"
                :data-state="dataStateComp"
                :is-editable.sync="isEditable"
                :preview-texts.sync="previewTexts"
                @text-when-scheduled="/*textWhenScheduled*/"
                :$v="$v"
              ></cron-generators-daily>
            </div>
        </template>
        <template  slot="item2">
            <div placeholderItem="Set recurring weekly"  titleItem="Weekly">
              <cron-generators-weekly
                :week-days.sync="copyScheduleEventData.weekly.weekDays"
                :period.sync="copyScheduleEventData.weekly.period"
                :runAtTime="runAtTimeLocal"
                :readonly="readonly"
                v-model="copyScheduleEventData.weekly.cronExpressions"
                :index="1"
                :data-state="dataStateComp"
                :is-editable.sync="isEditable"
                :preview-texts.sync="previewTexts"
                :$v="$v"
              ></cron-generators-weekly>
            </div>
        </template>
        <template  slot="item3">
            <div placeholderItem="Set recurring monthly"  titleItem="Monthly">
              <cron-generators-monthly
                :runAtTime="runAtTimeLocal"
                :readonly="readonly"
                :selected-months.sync="copyScheduleEventData.monthly.selectedMonths"
                :selected-days.sync="copyScheduleEventData.monthly.selectedDays"
                :days-period.sync="copyScheduleEventData.monthly.daysPeriod"
                :mode.sync="copyScheduleEventData.monthly.mode"
                :period.sync="copyScheduleEventData.monthly.period"
                v-model="copyScheduleEventData.monthly.cronExpressions"
                :index="2"
                :data-state="dataStateComp"
                :is-editable.sync="isEditable"
                :preview-texts.sync="previewTexts"
                :$v="$v"
              ></cron-generators-monthly>
            </div>
        </template> 
        <template  slot="item4">
            <div placeholderItem="Set recurring yearly"  titleItem="Yearly">
              <cron-generators-yearly
                :runAtTime="runAtTimeLocal"
                :readonly="readonly"
                v-model="copyScheduleEventData.yearly.cronExpressions"
                :period.sync="copyScheduleEventData.yearly.period"
                :start-year.sync="copyScheduleEventData.yearly.startYear"
                :selected-months.sync="copyScheduleEventData.yearly.selectedMonths"
                :days-period.sync="copyScheduleEventData.yearly.daysPeriod"
                :index="3"
                :data-state="dataStateComp"
                :is-editable.sync="isEditable"
                :preview-texts.sync="previewTexts"
                :$v="$v"
              ></cron-generators-yearly>
            </div>
        </template>
    </accordion>
    <div class="schedule-event__wr-buttons">
      <or-button 
        @click="cancel" 
        class="schedule-event__bottom-button" 
        color="primary" 
        type="secondary"
      >
        Cancel
      </or-button>
      <or-button 
        :loading="loadingApply"
        :disabled="dataStateComp === 'saved' || dataStateComp === 'canceled'"
        @click="apply"
        class="schedule-event__bottom-button" 
        color="primary"
      >
        Apply
      </or-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment-timezone';
// import later from 'later';

/* eslint-disable */
import TimePeriodList from '../TimePeriodList/TimePeriodList.vue';
import Accordion from '../../../../../Ui/Accordion/Accordion.vue';
import CronGeneratorsDaily from '../CronGenerators/Daily.vue';
import CronGeneratorsWeekly from '../CronGenerators/Weekly.vue';
import CronGeneratorsMonthly from '../CronGenerators/Monthly.vue';
import CronGeneratorsYearly from '../CronGenerators/Yearly.vue';
import defaultValues from '../Constants/DefaultValues.js';
/* eslint-enable */

export default {
  props: {
    readonly: {
      type: Boolean,
      default: false,
      isEditable: false,
      // isValid: false
    },
    // dataStateGlobal: {
    //   type: Object,
    //   default: () => ({}),
    // },
    steps: null,
    stepId: null,
    $v: null,
    editableEventNum: {
      type: Number,
      default: null,
    },
    index: {
      type: Number,
      default: null,
    },
    copyScheduleEventData: {
      type: Object,
      default: () => ({}),
    },
    scheduleEventData: {
      type: Object,
      default: () => ({}),
    },
    dataState: {
      type: String,
      default: 'saved'
    },
    previewTexts: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      runAtTimeLocal: [],
      loadingApply: false,
      isEditable: false
    };
  },
  computed: {
    getRegions() {
      // return only canonical zones
      const timeZones = moment.tz._zones; // eslint-disable-line no-underscore-dangle

      return _.chain(timeZones)
        .keys()
        .map(key => {
          // due to mutation in moment we need check if it's object
          // mutation is caused when invoke moment.tz()
          const zone = timeZones[key];
          return _.isObject(zone) ? zone.name : zone.split('|')[0];
        })
        .filter(zone => zone.indexOf('/') >= 0)
        .sort()
        .map(value => ({ label: value, value }))
        .value();
    },
    timeZoneComp: {
      get() {
        const timeZone = moment.tz.guess();
        return _.isEmpty(this.copyScheduleEventData.timeZone)
          ? timeZone
          : _.get(this.copyScheduleEventData.timeZone, 'value', '');
      },
      set(newValue) {
        if (newValue) {
          this.copyScheduleEventData.timeZone = {
            value: newValue,
            label: newValue,
          };
          // this.$nextTick(this.getNextTimeRunUI); // update UI based on new regions
        }
      },
    },
    // startDateUi() {
    //   return moment(this.copyScheduleEventData.startExpression.date).format('LL');
    // },
    // copyData.isReccuringLocal: {
    //   get() {
    //     return this.isReccuring;
    //   },
    //   secopyScheduleEventData(newValue) {
    //     this.$emit('update:isReccuring', this.copyData.isReccuringLocal);
    //     // delete all setting if checkbox uncheked
    //     // if (!newValue) {
    //     //   this.resetRecurringData();
    //     // }
    //     // // update crons when data changed
    //     // this.$nextTick(this.generateCronExpression);
    //   },
    // },
    // isEndTimeLocal: {
    //   get() {
    //     return this.isEndTime;
    //   },
    //   set(newValue) {
    //     // if end day unchecked - clear date
    //     // if (!newValue) {
    //     //   // direct mutation
    //     //   _.set(this.endExpression, 'date', '');
    //     //   _.set(this.endExpression, 'time', '00:00');
    //     //   this.isIncludedEndTime = false;
    //     // }
    //     this.$emit('update:isEndTime', newValue);
    //     // this.generateCronExpression(); // update crons when data changed
    //   },
    // },
    endDate: {
      get() {
        const date = _.get(this.copyScheduleEventData.endExpression, 'date');
        return date ? new Date(date) : null;
      },
      set(newValue) {
        const date = new Date(newValue);
        this.copyScheduleEventData.endExpression.date = moment(date).format('YYYY-MM-DD');
        // this.generateCronExpression(); // update crons when data changed
      },
    },
    startDate: {
      get() {
        const date = _.get(this.copyScheduleEventData.startExpression, 'date');
        return date ? new Date(date) : null;
      },
      set(newValue) {
        const date = new Date(newValue);
        this.copyScheduleEventData.startExpression.date = moment(date).format('YYYY-MM-DD');
        // this.generateCronExpression(); // update crons when data changed
      },
    },
    dataStateComp: {
      get(){
        return this.dataState || 'saved';
      },
      set(newValue){
        // console.log('here', newValue);
        this.$emit('update:dataState', newValue);
      }
    },
    savedAccordionNumItemComp() {
        return this.copyScheduleEventData.savedAccordionSlotName ?
          parseInt(this.copyScheduleEventData.savedAccordionSlotName.split('').reverse().join(), 10) : -1;
    }
  },
  methods: {
    apply() {
      if (this.dataStateComp !== 'canceled' && this.dataStateComp !== 'saved') {
        this.$emit('apply-changes');

        this.loadingApply = true;
        setTimeout(() => {
          this.loadingApply = false;
        }, 200);

        this.dataStateComp = 'saved';
      }
    },

    cancel() {
      if (this.dataStateComp !== 'canceled' && this.dataStateComp !== 'saved') {
        this.$emit('cancel-changes');
        this.dataStateComp = 'canceled';
      }
    },

    // // methods generates next time that shown on UI
    // getNextTimeRunUI() {
    //   const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    //   let startTime = this._getStartTime();
    //   if (!startTime) {
    //     return;
    //   }
    //   if (this.isReccuring) {
    //     startTime =
    //       startTime.valueOf() > this._getNowInClientZone().valueOf()
    //         ? startTime
    //         : this._getNowInClientZone();
    //   }
    //   const crons = this.generateCronExpression(false);
    //   let cronExpressions = _.compact(this.expressions);
    //   if (!this.isReccuring) {
    //     // generte cron based on start date
    //     const month = startTime.format('M');
    //     const day = startTime.format('D');
    //     const hour = startTime.format('HH');
    //     const min = startTime.format('mm');
    //     const startExpression = `${min} ${hour} ${day} ${month} *`;
    //     cronExpressions =
    //       this._getNowInClientZone().valueOf() > startTime.valueOf()
    //         ? []
    //         : _.compact(_.concat(cronExpressions, startExpression));
    //   }
    //   let nextRuns = [];
    //   _.forEach(cronExpressions, expression => {
    //     later.date.UTC();
    //     const parsedCron = later.parse.cron(expression);
    //     const nextRunTimeString = later
    //       .schedule(parsedCron)
    //       .next(5, startTime.toDate());
    //     if (nextRunTimeString) {
    //       nextRuns = _.concat(nextRuns, nextRunTimeString);
    //     }
    //   });
    //   const numberOfRun = this.isReccuring ? 5 : 1;
    //   const firstFive = _.slice(
    //     this._getClosestTimeMs(nextRuns),
    //     0,
    //     numberOfRun,
    //   );
    //   this.nextRuns = _.map(firstFive, timeMs => {
    //     return moment(timeMs).format('YYYY-MM-DD, hh:mm A');
    //   });
    // },
    // _getStartTime() {
    //   if (this.startDate) {
    //     moment.tz.setDefault('Etc/UTC');
    //     const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    //     // const start = moment.utc(this.startDate).format('YYYY-MM-DD');
    //     const timeZone = moment.tz.guess();
    //     const start = moment(this.startDate)
    //       .tz(timeZone)
    //       .format('YYYY-MM-DD');
    //     var timeString = start;
    //     // validate entered time
    //     const _startTime = moment(this.startTime, 'HH:mm').format('HH:mm');
    //     if (this.startTime && _startTime !== 'Invalid date') {
    //       timeString = `${start} ${_startTime}`;
    //     }
    //     const years = moment(timeString).year();
    //     const months = moment(timeString).month();
    //     const dates = moment(timeString).date();
    //     const hours = moment(timeString).hour();
    //     const minutes = moment(timeString).minute();
    //     return this.startDate && !this.startTime
    //       ? moment(start, dateFormat)
    //       : moment([years, months, dates, hours, minutes]);
    //   }
    // },
    formatDate(date) {
      const timeZone = moment.tz.guess();
      return moment(date)
        .tz(timeZone)
        .format('YYYY-MM-DD');
    },

    doExpressions() {
      this.copyScheduleEventData.expressions = [].concat(
        this.copyScheduleEventData.daily.cronExpressions,
        this.copyScheduleEventData.weekly.cronExpressions,
        this.copyScheduleEventData.monthly.cronExpressions,
        this.copyScheduleEventData.yearly.cronExpressions,
      );
    },
    changeSavedAccordionSlotName(number) {
      // console.log(number);
      this.copyScheduleEventData.savedAccordionSlotName = number;
    },
    closeAccordionItem(item) {

      switch (item) {
        case 'item1':
            this.copyScheduleEventData.daily = _.cloneDeep(defaultValues.daily);
          break;
        case 'item2':
            this.copyScheduleEventData.weekly = _.cloneDeep(defaultValues.weekly);
          break;
        case 'item3':
            this.copyScheduleEventData.monthly = _.cloneDeep(defaultValues.monthly);
          break;
        case 'item4':
            this.copyScheduleEventData.yearly = _.cloneDeep(defaultValues.yearly);
          break;
        default:
            throw new Error('incorrect number of accordion item');
      }
      console.log(item);
      // this.copyScheduleEventData.savedAccordionSlotName = null;
    },
    openedAccordionItem(itemNum) {
      console.log(itemNum);
      // this.copyScheduleEventData.savedAccordionSlotName = itemNum;
    },
    doEditable(index) {
      if (this.copyScheduleEventData.savedAccordionSlotName === index || this.savedAccordionNumItemComp === -1) {
        this.isEditable = true;
      }
    },
    //TODO
    // textWhenScheduled(text) {
    //   console.log('textWhenScheduled', text);
    //   this.copyScheduleEventData.previewTexts.reccuring = text;
    // }
  },
  watch: {
    'copyScheduleEventData.times': {
      handler(newVal) {
        // this.$emit('update:times', newVal);
        this.runAtTimeLocal = [];
        _.forEach(newVal, item => {
          if (item.start.HH && item.start.mm && parseInt(item.every.val, 10)) {
            const units = item.every.units === 'hh' ? 'hours' : 'minutes';

            let nextRunAtTime = moment(`${item.start.HH}:${item.start.mm}`, [
              'HH:mm',
            ]);
            const endTimeHmmA = moment(`${item.end.HH}:${item.end.mm}`, [
              'HH:mm',
            ]);

            do {
              this.runAtTimeLocal.push({
                HH: nextRunAtTime.hours(),
                mm: nextRunAtTime.minutes(),
              });

              nextRunAtTime = nextRunAtTime.add(
                parseInt(item.every.val, 10),
                units,
              );
            } while (
              nextRunAtTime.isSameOrBefore(endTimeHmmA) &&
              item.end.HH &&
              item.end.mm
            );
          }
        });
        this.runAtTimeLocal = _.uniqWith(this.runAtTimeLocal, _.isEqual);
        // console.log('this.runAtTimeLocal', this.runAtTimeLocal);
      },
      deep: true,
    },

    copyScheduleEventData: {
      handler(newValue, oldValue) {
        // console.log(newValue.id)
        if (!_.isEqual(newValue, this.scheduleEventData) && newValue.id === oldValue.id) {
          this.dataStateComp = 'changed';
          // console.log(JSON.stringify(newValue));
          // console.log(JSON.stringify(this.scheduleEventData));
        } else if (this.dataStateComp !== 'new') {
          this.dataStateComp = 'canceled';
        }
      },
      deep: true,
    },

    'copyScheduleEventData.daily.cronExpressions': {
      handler() {
        this.doExpressions();
      },
      deep: true,
    },

    'copyScheduleEventData.weekly.cronExpressions': {
      handler() {
        this.doExpressions();
      },
      deep: true,
    },

    'copyScheduleEventData.monthly.cronExpressions': {
      handler() {
        this.doExpressions();
      },
      deep: true,
    },

    'copyScheduleEventData.yearly.cronExpressions': {
      handler() {
        this.doExpressions();
      },
      deep: true,
    },
    // dataState(newValue) {
    //   this.$emit('data-state', newValue);
    // },
    // dataStateGlobal(newValue) {
    //   console.log(this.index);
    //   if(newValue.index === this.index) {
    //     this.dataState = 'saved';
    //   }
    // }
  },
  components: {
    Accordion,
    TimePeriodList,
    CronGeneratorsDaily,
    CronGeneratorsWeekly,
    CronGeneratorsMonthly,
    CronGeneratorsYearly,
  },
};
</script>

<style lang="scss">
.schedule-event {
  min-width: 410px;
  padding-left: 16px;
  &__wr-buttons {
    padding-top: 25px;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 30px;
  }

  &__circle {
    width: 20px;
    min-width: 20px;
    height: 20px;
    display: inline-block;
    border-radius: 50%;
    margin-bottom: 25px;
    margin-right: 16px;
  }

  &__title {
    display: flex;
    align-items: center;
  }

  &__label {
    color: #91969D;
    font-size: 12px;
    line-height: 16px;
    padding-bottom: 8px;
  }

  &__bottom-button:not(:last-child) {
    margin-right: 12px;
  }

  .wr-tizezone-start-date {
    display: flex;
  }

  .wr-top-start-date {
    padding-right: 30px;
  }

  .ui-select .ui-select__content 
  .ui-select__label .ui-select__display {
    min-height: 32px;
  }

  .wr-time-period-list {
    padding-top: 16px;
  }

  .textbox-without-border {
    .ui-textbox__input {
      border: none;
      background: #fff;
      color: #0F232E;
      font-size: 17px;
      font-weight: bold;
      line-height: 23px;
      padding: 0;
      &::placeholder {
        font-size: 17px !important;
      }
    }
    &.ui-textbox {
      margin-bottom: 25px;
    }
  }
}

.config-line__select {
  height: 25px;
  white-space: nowrap;
  margin-right: 5px;
  &.ui-select {
    margin-bottom: 0;
    .ui-select__display {
      min-width: 80px;
      padding: 0 11px;
      height: 25px;
      border-radius: 3px;
      background-color: #fbfbfb;
      border: solid 1px #e7e7e7;
      .ui-select__display-value {
        font-size: 14px;
        color: #0f232e;
      }
    }
    &.is-active {
      .ui-select__display {
        border: 1px solid #64b2da;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
      .ui-select__dropdown {
        border: 1px solid #64b2da;
        min-width: 80px;
        padding: 0;
        .is-highlighted {
          color: #000000;
          background-color: #f9f9f9;
        }
      }
    }
  }
  &.select-box-error {
    .ui-select__content {
      .ui-select__label {
        .ui-select__display {
          border: 1px solid rgba(244, 67, 5, 0.46);
        }
      }
    }
  }
}

.timezone {
  display: flex;
  align-items: baseline;
  flex-direction: column;
  &_top {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  &__label {
    padding-right: 25px;
    color: #91969d;
    font-size: 14px;
    line-height: 16px;
  }

  .ui-select {
    width: 100%;
    margin-bottom: 0px;
  }
}

.date {
  color: rgba(15, 35, 46, 0.55);
  font-size: 17px;
  font-weight: bold;
  line-height: 23px;
  padding-top: 8px;
  padding-bottom: 6px;

  &_start {
    padding-right: 10px;
  }

  // &_end {
  //   max-width: 120px;
  //   display: flex;
  //   align-items: center;
  // }
}

.recurring-controls {
  display: flex;
  height: 70px;
  padding-top: 23px;
  padding-bottom: 15px;
  .ui-checkbox--color-primary {
    display: flex;
    align-self: center;
  }

  &__wr-is-end {
    padding-left: 30px;
  }

  &__calendar-picker-custom.ui-datepicker
    .ui-datepicker__content
    .ui-datepicker__display {
    padding-left: 35px;
    width: 140px;
    min-height: 30.8px;
    color: #0f232e;
    font-size: 12px;
    background: #fff;
    border-radius: 0;
  }

  &__calendar-picker-custom.ui-datepicker {
    margin-bottom: 0;
  }
  .ui-checkbox {
    margin-bottom: 0;
  }

  &__date {
    position: relative;
  }

  &__custom-icon-date {
    position: absolute;
    z-index: 1;
    font-size: 12px;
    color: #e1e1e1;
    top: 50%;
    margin-top: -6px;
    left: 8px;
  }

  &__recuring-till {
    padding: 0 16px;
    color: #0f232e;
    font-size: 14px;
    line-height: 19px;
    display: flex;
    align-items: center;
  }

  &__wr-configs-time {
    display: flex;
    align-items: center;
  }
}
</style>