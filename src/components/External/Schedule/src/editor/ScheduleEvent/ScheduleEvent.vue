<template>
  <div class="schedule-event">
    <label class="timezone">
        <span class="timezone__label">Timezone</span>
        <or-select :disabled="readonly" placeholder="Select a time zone" class="config-line__select" :has-search="true" :options="getRegions"
            v-model="timeZoneComp">
        </or-select>
    </label>
    <div class="date">
      <span v-if="!startExpression.date">Choose date on calendar</span>
      <span v-else class="date__start-date">{{startDateUi}}</span>
    </div>
    <time-period-list
      :times.sync="copyData.timesLocal"
      :readonly="readonly"
    ></time-period-list>
    <div class="recurring-controls">
        <or-checkbox v-model="copyData.isReccuringLocal" :disabled="readonly">Recurring</or-checkbox>
        <span v-if="!copyData.isEndTimeLocal && copyData.isReccuringLocal" class="recurring-controls__recuring-till">till</span>
        <div class="recurring-controls__wr-configs-time">
            <div class="" v-if="!copyData.isEndTimeLocal && copyData.isReccuringLocal">
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
            <div v-if="copyData.isReccuringLocal" class="recurring-controls__wr-is-end">
                <or-checkbox v-model="copyData.isEndTimeLocal" :disabled="readonly">No end</or-checkbox>
            </div>
        </div>
    </div>
    <accordion v-if="copyData.isReccuringLocal">
        <template  slot="item1">
            <div placeholderItem="Set recurring daily"  titleItem="Daily">
              <cron-generators-daily
                :daily-data.sync="copyData.dailyLocal"
                :runAtTime="runAtTimeLocal"
                :readonly="readonly"
                v-model="copyData.dailyCronExpressionsLocal"
              ></cron-generators-daily>
            </div>
        </template>
        <template  slot="item2">
            <div placeholderItem="Set recurring weekly"  titleItem="Weekly">
              <cron-generators-weekly
                :week-days.sync="copyData.weeklyWeekDaysLocal"
                :period.sync="copyData.weeklyPeriodLocal"
                :runAtTime="runAtTimeLocal"
                :readonly="readonly"
                v-model="weekly.cronExpressions"
              ></cron-generators-weekly>
            </div>
        </template>
        <template  slot="item3">
            <div placeholderItem="Set recurring monthly"  titleItem="Monthly">
              <cron-generators-monthly
                :runAtTime="runAtTimeLocal"
                :readonly="readonly"
                :selected-months.sync="copyData.monthlySelectedMonthsLocal"
                :selected-days.sync="copyData.monthlySelectedDaysLocal"
                :days-period.sync="copyData.monthlyDaysPeriodLocal"
                :mode.sync="copyData.monthlyModeLocal"
                :period.sync="copyData.monthlyPeriodLocal"
                v-model="monthly.cronExpressions"
              ></cron-generators-monthly>
            </div>
        </template>
        <template  slot="item4">
            <div placeholderItem="Set recurring yearly"  titleItem="Yearly">
              <cron-generators-yearly
                :runAtTime="runAtTimeLocal"
                :readonly="readonly"
                v-model="yearly.cronExpressions"
                :period.sync="copyData.yearlyPeriodLocal"
                :selected-months.sync="copyData.yearlySelectedMonthsLocal"
                :days-period.sync="copyData.yearlyDaysPeriodLocal"
                :on-the.sync="copyData.yearlyOnTheLocal"
              ></cron-generators-yearly>
            </div>
        </template>
    </accordion>
    <div class="schedule-event__wr-buttons">
      <or-button @click="cancel" class="schedule-event__bottom-button" color="primary" type="secondary">Cancel</or-button>
      <or-button :loading="loadingApply" :disabled="!isDataChanged" @click="apply" class="schedule-event__bottom-button" color="primary">Apply</or-button>
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
    startExpression: {
      type: Object,
      default: () => ({
        time: '00:00',
        date: '',
      }),
    },
    // deactivateAfterLastRun: {
    //   type: Boolean,
    //   default: false,
    // },
    isReccuring: {
      type: Boolean,
      default: false,
    },
    // expressions: {
    //   type: Array,
    //   default: () => [],
    // },
    isEndTime: {
      type: Boolean,
      default: false,
    },
    // includeEndTime: {
    //   type: Boolean,
    //   default: false,
    // },
    endExpression: {
      time: '00:00',
      date: '',
    },
    timeZone: {
      type: Object,
      default: () => ({}),
    },
    daily: {
      type: Object,
      default: () => ({}),
    },
    weekly: {
      type: Object,
      default: () => ({}),
    },
    monthly: {
      type: Object,
      default: () => ({}),
    },
    yearly: {
      type: Object,
      default: () => ({}),
    },
    steps: null,
    stepId: null,
    $v: null,
    times: {
      type: Array,
      default: () => [],
    },
    // runAtTime: {
    //   type: Array,
    //   default: () => [],
    // },
    // startDay: {
    //   type: String,
    //   default: null,
    // },
    editableEventNum: {
      type: Number,
      default: null,
    },
    index: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      runAtTimeLocal: [],
      isDataChanged: false,
      loadingApply: false,

      copyData: {
        isEndTimeLocal: this.isEndTime,
        isReccuringLocal: this.isReccuring,
        timeZoneLocal: this.timeZone,
        timesLocal: _.cloneDeep(this.times),

        dailyLocal: _.cloneDeep(this.daily),
        dailyCronExpressionsLocal: this.daily.cronExpressions,

        weeklyWeekDaysLocal: _.cloneDeep(this.weekly.weekDays),
        weeklyPeriodLocal: _.cloneDeep(this.weekly.period),

        monthlySelectedMonthsLocal: _.cloneDeep(this.monthly.selectedMonths),
        monthlySelectedDaysLocal: _.cloneDeep(this.monthly.selectedDays),
        monthlyDaysPeriodLocal: _.cloneDeep(this.monthly.daysPeriod),
        monthlyModeLocal: _.cloneDeep(this.monthly.mode),
        monthlyPeriodLocal: _.cloneDeep(this.monthly.period),

        yearlyPeriodLocal: _.cloneDeep(this.yearly.period),
        yearlySelectedMonthsLocal: _.cloneDeep(this.yearly.selectedMonths),
        yearlyDaysPeriodLocal: _.cloneDeep(this.yearly.daysPeriod),
        yearlyOnTheLocal: _.cloneDeep(this.yearly.onThe),
      },

      currData: {
        isEndTimeLocal: this.isEndTime,
        isReccuringLocal: this.isReccuring,
        timeZoneLocal: this.timeZone,
        timesLocal: this.times,

        dailyLocal: this.daily,
        dailyCronExpressionsLocal: this.daily.cronExpressions,

        weeklyWeekDaysLocal: this.weekly.weekDays,
        weeklyPeriodLocal: this.weekly.period,

        monthlySelectedMonthsLocal: this.monthly.selectedMonths,
        monthlySelectedDaysLocal: this.monthly.selectedDays,
        monthlyDaysPeriodLocal: this.monthly.daysPeriod,
        monthlyModeLocal: this.monthly.mode,
        monthlyPeriodLocal: this.monthly.period,

        yearlyPeriodLocal: this.yearly.period,
        yearlySelectedMonthsLocal: this.yearly.selectedMonths,
        yearlyDaysPeriodLocal: this.yearly.daysPeriod,
        yearlyOnTheLocal: this.yearly.onThe,
      },
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
        return _.isEmpty(this.copyData.timeZoneLocal)
          ? timeZone
          : _.get(this.copyData.timeZoneLocal, 'value', '');
      },
      set(newValue) {
        if (newValue) {
          this.copyData.timeZoneLocal = {
            value: newValue,
            label: newValue,
          };
          // this.$nextTick(this.getNextTimeRunUI); // update UI based on new regions
        }
      },
    },
    startDateUi() {
      return moment(this.startExpression.date).format('LL');
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
        const date = _.get(this.endExpression, 'date');
        return date ? new Date(date) : null;
      },
      set(newValue) {
        const date = new Date(newValue);
        this.endExpression.date = moment(date).format('YYYY-MM-DD');
        // this.generateCronExpression(); // update crons when data changed
      },
    },
  },
  methods: {
    apply() {
      this.$emit('update:isEndTime', this.copyData.isEndTimeLocal);
      this.$emit('update:isReccuring', this.copyData.isReccuringLocal);
      this.$emit('update:timeZone', this.copyData.timeZoneLocal);
      this.$emit('update:times', this.copyData.timesLocal);
      this.$emit('update:daily', this.copyData.dailyLocal);
      this.$emit(
        'update:weekly',
        Object.assign({}, this.weekly, {
          weekDays: this.copyData.weeklyWeekDaysLocal,
          period: this.copyData.weeklyPeriodLocal,
        }),
      );
      this.$emit(
        'update:monthly',
        Object.assign({}, this.monthly, {
          selectedMonths: this.copyData.monthlySelectedMonthsLocal,
          selectedDays: this.copyData.monthlySelectedDaysLocal,
          mode: this.copyData.monthlyModeLocal,
          daysPeriod: this.copyData.monthlyDaysPeriodLocal,
          period: this.copyData.monthlyPeriodLocal,
        }),
      );
      this.$emit(
        'update:yearly',
        Object.assign({}, this.yearly, {
          period: this.copyData.yearlyPeriodLocal,
          selectedMonths: this.copyData.yearlySelectedMonthsLocal,
          daysPeriod: this.copyData.yearlyDaysPeriodLocal,
          onThe: this.copyData.yearlyOnTheLocal,
        }),
      );

      this.loadingApply = true;
      setTimeout(() => {
        this.loadingApply = false;
      }, 200);
      this.isDataChanged = false;
    },
    cancel() {
      if (this.isDataChanged) {
        this.copyData.isEndTimeLocal = this.isEndTime;
        this.copyData.isReccuringLocal = this.isReccuring;
        this.copyData.timeZoneLocal = this.timeZone;
        this.copyData.dailyLocal = _.cloneDeep(this.daily);
        this.copyData.weeklyWeekDaysLocal = _.cloneDeep(this.weekly.weekDays);
        this.copyData.weeklyPeriodLocal = _.cloneDeep(this.weekly.period);
        this.copyData.timesLocal = _.cloneDeep(this.times);
        this.copyData.monthlySelectedMonthsLocal = _.cloneDeep(
          this.monthly.selectedMonths,
        );
        this.copyData.monthlySelectedDaysLocal = _.cloneDeep(
          this.monthly.selectedDays,
        );
        this.copyData.monthlyDaysPeriodLocal = _.cloneDeep(
          this.monthly.daysPeriod,
        );
        this.copyData.monthlyModeLocal = _.cloneDeep(this.monthly.mode);
        this.copyData.monthlyPeriodLocal = _.cloneDeep(this.monthly.period);

        this.copyData.yearlyPeriodLocal = _.cloneDeep(this.yearly.period);
        this.copyData.yearlySelectedMonthsLocal = _.cloneDeep(
          this.yearly.selectedMonths,
        );
        this.copyData.yearlyDaysPeriodLocal = _.cloneDeep(
          this.yearly.daysPeriod,
        );
        this.copyData.yearlyOnTheLocal = _.cloneDeep(this.yearly.onThe);

        this.isDataChanged = false;
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
  },
  watch: {
    times: {
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
        console.log('this.runAtTimeLocal', this.runAtTimeLocal);
      },
      deep: true,
    },
    copyData: {
      handler() {
        if (!_.isEqual(this.copyData, this.currData)) {
          this.isDataChanged = true;
          console.log(1);
        }
      },
      deep: true,
    },
    // editableEventNum(newValue, oldValue) {
    //   this.isEditable = newValue === this.index;
    //   if (newValue === this.index) {
    //     this.$emit('save-copy', this.index);
    //   } else if (oldValue === this.index) {
    //     this.$emit('return-state', this.index);
    //   } else {
    //     console.log(3);
    //   }
    // },
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