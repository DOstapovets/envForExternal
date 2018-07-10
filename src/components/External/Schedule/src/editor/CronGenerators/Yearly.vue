<template>
  <div class="recuring-configs__monthly-day_configs yearly">
    <!-- {{value}} -->
    <div v-if="isEditable">
      <div class="radio-custom__wr">
          Every
          <or-textbox
            :disabled="readonly"
            :class="['xs-input', /*{'text-box-error': !dailySchedule.isDailyDaysValid}*/]"
              label=""
              v-model="periodComp" 
              placeholder=""
              mask="##########"
              :invalid="validdationPeriod"
            >
          </or-textbox>
          <div class="">year(s) in:</div>
      </div>
      <div class="yearly__month-picker">
          <month-picker
            v-model="selectedMonthsComp"
            :disabled="readonly"
            :invalid="validdationSelectedMonths"
          ></month-picker>
      </div>
      <div class="monthly-periods monthly-periods__yearly">
        <!-- <or-checkbox class="yearly__onThe" v-model="onTheComp">on the</or-checkbox> -->
        <or-select
            :disabled="readonly" 
            :class="['config-line__select', {/*'select-box-error': !daysPeriodComp.period*/}]"
            label="" placeholder="" 
            @change="/*monthlyDaysPeriodChange*/"
            v-model="daysPeriodComp.period"
            :options="getDaysPeriod">
        </or-select>
        <or-select
            :disabled="readonly" 
            :class="['config-line__select', {/*'select-box-error': !daysPeriodComp.day*/}]" 
            label=""
            placeholder="" 
            @change="/*monthlyDaysPeriodChange*/"
            v-model="daysPeriodComp.day"
            :options="getWeekDays"
          >
        </or-select>
      </div>
    </div>
    <div v-else>
        <div 
          v-html="textWhenScheduled"
          v-if="!invalid"
        ></div>
        <div
          v-else
          class="cron-gen__error"
        >
          Please correct errors
        </div>
    </div>

  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment-timezone';

/* eslint-disable */
import MonthPicker from '../MonthPicker/MonthPicker.vue';
import savedState from './savedState.js';
/* eslint-enable */

export default {
  created() {
    this.$emit('input', this.cronExpression());
  },
  data() {
    return {
      getDaysPeriod: [
        { label: 'every', value: '' },
        { label: 'first', value: '#1' },
        { label: 'second', value: '#2' },
        { label: 'third', value: '#3' },
        { label: 'forth', value: '#4' },
        { label: 'fifth', value: '#5' },
        { label: 'last', value: 'L' },
      ],
      getWeekDays: [
        { label: 'day', value: '*' },
        { label: 'Sunday', value: 'SUN' },
        { label: 'Monday', value: 'MON' },
        { label: 'Tuesday', value: 'TUE' },
        { label: 'Wednesday', value: 'WED' },
        { label: 'Thursday', value: 'THU' },
        { label: 'Friday', value: 'FRI' },
        { label: 'Saturday', value: 'SAT' },
        // { label: 'Weekday', value: ['MON', 'TUE', 'WED', 'THU', 'FRI'] },
        // { label: 'Weekend', value: ['SAT', 'SUN'] },
      ],
    };
  },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    period: {
      type: String,
      default: '1',
    },
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    runAtTime: {
      type: Array,
      default() {
        return [];
      },
    },
    selectedMonths: {
      type: Array,
      default() {
        return [];
      },
    },
    daysPeriod: {
      type: Object,
      default() {
        return {
          day: '',
          period: '',
        };
      },
    },
    startYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    // onThe: {
    //   type: Boolean,
    //   default: false,
    // },
    index: {
      type: Number,
      default: -1,
    },
    previewTexts: {
      type: Object,
      default: null,
    },
    $v: null,
    invalid: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    periodComp: {
      get() {
        return this.period;
      },
      set(newPeriod) {
        this.$emit('update:period', newPeriod);
      },
    },
    selectedMonthsComp: {
      get() {
        return this.selectedMonths;
      },
      set(newValue) {
        this.$emit('update:selectedMonths', newValue);
      },
    },
    daysPeriodComp: {
      get() {
        return this.daysPeriod;
      },
      set(newValue) {
        this.$emit('update:daysPeriod', newValue);
      },
    },
    // onTheComp: {
    //   get() {
    //     return this.onThe;
    //   },
    //   set(newValue) {
    //     this.$emit('update:onThe', newValue);
    //   },
    // },
    textWhenScheduled() {
      let text = `Every <span class="bold-text">${this.period}</span> year on `;
      this.selectedMonthsComp.forEach((item, index) => {
        text += `<span class="bold-text">${moment(item, 'MM')
          .format('MMMM')
          .slice(0, 3)}</span>`;
        if (this.selectedMonthsComp.length - 1 !== index) {
          text += ', ';
        }
      });
      // if (this.onTheComp) {
      text += ` <br/>on the <span class="bold-text">${
        _.find(
          this.getDaysPeriod,
          item => item.value === this.daysPeriodComp.period,
        ).label
      }</span> 
        <span class="bold-text">${
          _.find(
            this.getWeekDays,
            item => item.value === this.daysPeriodComp.day,
          ).label
        }</span>`;
      // }
      this.previewTexts.reccuring = text;
      return text;
    },
    validdationPeriod() {
      return _.get(
        this.$v,
        'validationCopyScheduleEventData.yearly.period.$invalid',
        false,
      );
    },
    validdationSelectedMonths() {
      return _.get(
        this.$v,
        'validationCopyScheduleEventData.yearly.selectedMonths.$invalid',
        false,
      );
    },
  },
  watch: {
    runAtTime() {
      this.$emit('input', this.cronExpression());
    },
    periodComp() {
      this.$emit('input', this.cronExpression());
      this.$emit('change-saved-accordion-num-item', this.index);
    },
    selectedMonths() {
      this.$emit('input', this.cronExpression());
      this.$emit('change-saved-accordion-num-item', this.index);
    },
    // onThe() {
    //   this.$emit('input', this.cronExpression());
    //   this.$emit('change-saved-accordion-num-item', this.index);
    // },
    daysPeriodComp: {
      handler() {
        this.$emit('input', this.cronExpression());
        this.$emit('change-saved-accordion-num-item', this.index);
      },
      deep: true,
    },
  },
  methods: {
    cronExpression() {
      let exp = '';
      // if (!this.onThe) {
      //   exp = _.map(
      //     this.runAtTime,
      //     item =>
      //       `${item.mm} ${item.HH} ? ${this.selectedMonthsComp} ? 1/${
      //         this.periodComp
      //       }`,
      //   );
      // } else {
      exp = _.map(
        this.runAtTime,
        item =>
          `${item.mm} ${item.HH} ? ${this.selectedMonthsComp} ${
            this.daysPeriodComp.day
          }${this.daysPeriodComp.period} ${this.startYear}/${this.periodComp}`,
      );
      // }
      return exp;
    },
  },
  components: { MonthPicker },
  mixins: [savedState],
};
</script>

<style lang="scss">
.yearly {
  // &__onThe {
  //   margin-right: 5px;
  // }
  .radio-custom__wr {
    display: flex;
    align-items: center;
    margin-bottom: 5px;

    .xs-input {
      margin-bottom: 0;
      padding-right: 16px;
      padding-left: 16px;
    }

    .xs-input .ui-textbox__input {
      min-height: 26px;
      height: 26px;
      width: 41px;
      padding-top: 6px;
      padding-bottom: 6px;
    }
    .ui-radio__label-text {
      color: #0f232e;
      font-size: 14px;
      line-height: 16px;
    }

    .ui-radio {
      display: flex;
      align-items: center;
      padding-right: 16px;
    }
  }

  .monthly-periods {
    display: flex;
    align-items: center;
    .config-line__label {
      margin-right: 5px;
    }
    &__yearly {
      padding-top: 16px;

      .config-line__select:last-child {
        margin-right: 0;
      }
      // .ui-checkbox {
      //   margin-bottom: 0;
      // }

      // .ui-checkbox .ui-checkbox__label-text {
      //   color: #0f232e;
      //   font-size: 14px;
      // }
    }
  }

  .ui-select .ui-select__content .ui-select__label .ui-select__display {
    min-height: 26px;
    max-width: 120px;
    width: 100px;
  }

  .config-line__select.ui-select .ui-select__display .ui-select__display-value {
    max-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.recuring-configs__monthly-day_configs {
    margin-top: 0;
  }
  .cron-gen__error {
    color: #f95d5d;
  }
}
</style>

