<template>
  <div class="schedule-event">
    {{copyScheduleEventData.daily.cronExpressions}}
    {{copyScheduleEventData.weekly.cronExpressions}}
    {{copyScheduleEventData.monthly.cronExpressions}}
    {{copyScheduleEventData.yearly.cronExpressions}}

    sdf
    {{copyScheduleEventData.expressions}}
    <label class="timezone">
        <span class="timezone__label">Timezone</span>
        <or-select :disabled="readonly" placeholder="Select a time zone" class="config-line__select" :has-search="true" :options="getRegions"
            v-model="timeZoneComp">
        </or-select>
    </label>
    <div class="date">
      <span v-if="!copyScheduleEventData.startExpression.date">Choose date on calendar</span>
      <span v-else class="date__start-date">{{startDateUi}}</span>
    </div>
    <time-period-list
      :times.sync="copyScheduleEventData.times"
      :readonly="readonly"
    ></time-period-list>
    <div class="recurring-controls">
        <or-checkbox v-model="copyScheduleEventData.isReccuring" :disabled="readonly">Recurring</or-checkbox>
        <span v-if="!copyScheduleEventData.isEndTime && copyScheduleEventData.isReccuring" class="recurring-controls__recuring-till">till</span>
        <div class="recurring-controls__wr-configs-time">
            <div class="" v-if="!copyScheduleEventData.isEndTime && copyScheduleEventData.isReccuring">
                <div class="">
                    <div class="">
                      <div class="recurring-controls__date">
                        <or-icon class="recurring-controls__custom-icon-date" icon="view_comfy"></or-icon>
                        <ui-datepicker :disabled="readonly" class="recurring-controls__calendar-picker-custom" iconPosition="right" placeholder="Select date"
                            :custom-formatter="formatDate" v-model="endDate">
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
    <accordion v-if="copyScheduleEventData.isReccuring">
        <template  slot="item1">
            <div placeholderItem="Set recurring daily"  titleItem="Daily">
              <cron-generators-daily
                :period.sync="copyScheduleEventData.daily.period"
                :period-mode.sync="copyScheduleEventData.daily.periodMode"
                :runAtTime="runAtTimeLocal"
                :readonly="readonly"
                v-model="copyScheduleEventData.daily.cronExpressions"
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
                :selected-months.sync="copyScheduleEventData.yearly.selectedMonths"
                :days-period.sync="copyScheduleEventData.yearly.daysPeriod"
                :on-the.sync="copyScheduleEventData.yearly.onThe"
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
        :disabled="dataState === 'saved' || dataState === 'canceled'"
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
/* eslint-enable */

export default {
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
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
  },
  data() {
    return {
      runAtTimeLocal: [],
      loadingApply: false,
      dataState: 'saved',
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
    startDateUi() {
      return moment(this.copyScheduleEventData.startExpression.date).format('LL');
    },
    // copyData.isReccuringLocal: {
    //   get() {
    //     return this.isReccuring;
    //   },
    //   set(newValue) {
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
  },
  methods: {
    apply() {
      if (this.dataState !== 'canceled' && this.dataState !== 'saved') {
        this.$emit('apply-changes');

        this.loadingApply = true;
        setTimeout(() => {
          this.loadingApply = false;
        }, 200);

        this.dataState = 'saved';
      }
    },

    cancel() {
      if (this.dataState !== 'canceled' && this.dataState !== 'saved') {
        this.$emit('cancel-changes');
        this.dataState = 'canceled';
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
    }
  },
  watch: {
    'copyScheduleEventData.times': {
      handler(newVal) {
        // this.$emit('update:times', newVal);
        this.runAtTimeLocal = [];
        _.forEach(newVal, item => {
          if (item.start.HH && item.start.mm) {
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
      handler() {
        if (!_.isEqual(this.copyScheduleEventData, this.scheduleEventData)) {
          this.dataState = 'changed';
          // console.log('changed');
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
    }
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
  &__wr-buttons {
    padding-top: 25px;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 30px;
  }
  &__bottom-button:not(:last-child) {
    margin-right: 12px;
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