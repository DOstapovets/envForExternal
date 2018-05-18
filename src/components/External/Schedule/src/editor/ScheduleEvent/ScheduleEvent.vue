<template>
  <div class="schedule-event">
    <label class="timezone">
        <span class="timezone__label">Timezone</span>
        <or-select :disabled="readonly" placeholder="Select a time zone" class="config-line__select" :has-search="true" :options="getRegions"
            v-model="displayTimeZone">
        </or-select>
    </label>
    <div class="date">
      <span v-if="!startExpression.date">Choose date on calendar</span>
      <span v-else class="date__start-date">{{startDateUi}}</span>
    </div>
    <time-period-list
      :times.sync="times"
      :readonly="readonly"
    ></time-period-list>
    <div class="recurring-controls">
        <or-checkbox v-model="isReccuringChecked" :disabled="readonly">Recurring</or-checkbox>
        <span v-if="!isEndChecked" class="recurring-controls__recuring-till">till</span>
        <div class="recurring-controls__wr-configs-time">
            <div class="" v-if="!isEndChecked">
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
            <div class="recurring-controls__wr-is-end">
                <or-checkbox v-model="isEndChecked" :disabled="readonly">No end</or-checkbox>
            </div>
        </div>
    </div>
    <accordion>
        <template  slot="item1">
            <div placeholderItem="Set recurring daily"  titleItem="Daily">
              <cron-generators-daily
                :daily-data.sync="daily"
                :runAtTime="runAtTimeLocal"
                :readonly="readonly"
                v-model="daily.cronExpressions"
              ></cron-generators-daily>
            </div>
        </template>
        <template  slot="item2">
            <div placeholderItem="Set recurring weekly"  titleItem="Weekly">
              <cron-generators-weekly
                :week-days.sync="weekly.weekDays"
                :period.sync="weekly.period"
                :runAtTime="runAtTimeLocal"
                :readonly="readonly"
                v-model="weekly.cronExpressions"
              ></cron-generators-weekly>
            </div>
        </template>
        <template  slot="item3">
            <div placeholderItem="Set recurring monthly"  titleItem="Monthly">
              <cron-generators-monthly
                :selected-months.sync="monthly.selectedMonths"
                :readonly="readonly"
              ></cron-generators-monthly>
            </div>
        </template>
    </accordion>
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
    deactivateAfterLastRun: {
      type: Boolean,
      default: false,
    },
    isReccuring: {
      type: Boolean,
      default: false,
    },
    expressions: {
      type: Array,
      default: () => [],
    },

    isEndTime: {
      type: Boolean,
      default: false,
    },
    includeEndTime: {
      type: Boolean,
      default: false,
    },
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
  },
  data() {
    return {
      runAtTimeLocal: [],
    };
  },
  computed: {
    getRegions() {
      // return only canonical zones
      const timeZones = moment.tz._zones;

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
    displayTimeZone: {
      get() {
        const timeZone = moment.tz.guess();
        return _.isEmpty(this.timeZone)
          ? timeZone
          : _.get(this.timeZone, 'value', '');
      },
      set(newValue) {
        if (newValue) {
          this.$emit('update:timeZone', {
            value: newValue,
            label: newValue,
          });
          // this.$nextTick(this.getNextTimeRunUI); // update UI based on new regions
        }
      },
    },
    startDateUi() {
      return moment(this.startExpression.date).format('LL');
    },
    isReccuringChecked: {
      get() {
        return this.isReccuring;
      },
      set(newValue) {
        this.$emit('update:isReccuring', newValue);
        // delete all setting if checkbox uncheked
        // if (!newValue) {
        //   this.resetRecurringData();
        // }

        // // update crons when data changed
        // this.$nextTick(this.generateCronExpression);
      },
    },
    isEndChecked: {
      get() {
        return this.isEndTime;
      },
      set(newValue) {
        // if end day unchecked - clear date
        // if (!newValue) {
        //   // direct mutation
        //   _.set(this.endExpression, 'date', '');
        //   _.set(this.endExpression, 'time', '00:00');
        //   this.isIncludedEndTime = false;
        // }
        this.$emit('update:isEndTime', newValue);
        // this.generateCronExpression(); // update crons when data changed
      },
    },
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
  },
  components: {
    Accordion,
    TimePeriodList,
    CronGeneratorsDaily,
    CronGeneratorsWeekly,
    CronGeneratorsMonthly,
  },
};
</script>

<style lang="scss">
.schedule-event {
  min-width: 410px;
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