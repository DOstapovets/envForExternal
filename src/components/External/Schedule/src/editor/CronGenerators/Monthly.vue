<template>
<div class="monthly">
    <div class="monthly__month-picker">
        <month-picker v-model="selectedMonthsComp" :disabled="readonly"></month-picker>
    </div>
    <div class="recuring-configs__monthly-day_configs">
        <div class="config-line monthly__each" v-if="selectedMonths.length">
            <or-radio 
              v-model="modeComp"
              true-value="each"
              :disabled="!selectedMonthsComp.length 
                || readonly" 
                class="config-line__radio"
              >
                each
            </or-radio>
            <days-picker
              :months="selectedMonthsComp"
              :selected-days.sync="selectedDaysComp"
              :readonly="readonly || modeComp === 'onThe'"
            ></days-picker>
        </div>
        <div class="config-line" v-if="selectedMonths.length">
            <or-radio
             v-model="modeComp" 
             true-value="onThe" 
             :disabled="!selectedMonthsComp.length || readonly" 
             class="config-line__radio">
             on the
            </or-radio>
            <div class="monthly-periods">
                <or-select
                    :disabled="readonly || modeComp === 'each'" 
                    :class="['config-line__select', {'select-box-error': !daysPeriodComp.period}]"
                    label="" placeholder="" 
                    @change="/*monthlyDaysPeriodChange*/"
                     v-model="daysPeriodComp.period"
                    :options="getDaysPeriod">
                </or-select>
                <or-select
                    :disabled="readonly || modeComp === 'each'" 
                    :class="['config-line__select', {'select-box-error': !daysPeriodComp.day}]" 
                    label=""
                    placeholder="" 
                    @change="/*monthlyDaysPeriodChange*/"
                     v-model="daysPeriodComp.day"
                    :options="getWeekDays">
                </or-select>
            </div>
        </div>
    </div>
</div>
</template>

<script>
/* eslint-disable */
import _ from 'lodash';
import MonthPicker from '../MonthPicker/MonthPicker.vue';
import DaysPicker from '../DaysPicker/DaysPicker.vue';
import moment from 'moment-timezone';
/* eslint-enable */

export default {
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    selectedMonths: {
      type: Array,
      default() {
        return [];
      },
    },
    selectedDays: {
      type: Array,
      default() {
        return [];
      },
    },
    mode: {
      type: String,
      default: '',
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
  },
  data() {
    return {
      getDaysPeriod: [
        { label: 'first', value: '#1' },
        { label: 'second', value: '#2' },
        { label: 'third', value: '#3' },
        { label: 'forth', value: '#4' },
        { label: 'fifth', value: '#5' },
        { label: 'last', value: 'L' },
      ],
      getWeekDays: [
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
      modeComp: this.mode,
    };
  },
  computed: {
    selectedMonthsComp: {
      get() {
        return this.selectedMonths;
      },
      set(newValue) {
        this.$emit('update:selectedMonths', newValue);
      },
    },
    selectedDaysComp: {
      get() {
        return this.selectedDays;
      },
      set(newValue) {
        this.$emit('update:selectedDays', newValue);
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
    periodComp: {
      get() {
        return this.period;
      },
      set(newValue) {
        this.$emit('update:period', newValue);
      },
    },
  },
  watch: {
    modeComp(newValue) {
      this.$emit('update:mode', newValue);
    },

    runAtTime() {
      this.$emit('input', this.cronExpression());
    },
    selectedDays() {
      this.$emit('input', this.cronExpression());
    },
    selectedMonths() {
      this.$emit('input', this.cronExpression());
    },
    mode() {
      this.$emit('input', this.cronExpression());
    },
    daysPeriodComp: {
      handler() {
        this.$emit('input', this.cronExpression());
      },
      deep: true,
    },
  },

  methods: {
    cronExpression() {
      let exp = '';
      if (this.modeComp === 'each') {
        exp = _.map(
          this.runAtTime,
          item =>
            `${item.mm} ${item.HH} ${this.selectedDaysComp} ${
              this.selectedMonthsComp
            } ? *`,
        );
      } else if (this.modeComp === 'onThe') {
        exp = _.map(
          this.runAtTime,
          item =>
            `${item.mm} ${item.HH} ? ${this.selectedMonthsComp} ${
              this.daysPeriodComp.day
            }${this.daysPeriodComp.period} *`,
        );
      }
      return exp;
    },
  },
  components: { MonthPicker, DaysPicker },
};
</script>

<style lang="scss">
.monthly {
  &__month-picker {
    // padding-left: 85px;
    width: 262px;
  }
  &__each {
    margin-bottom: 10px;
  }
  .recuring-configs__monthly-day_configs div.config-line {
    flex-direction: row;
    display: flex;
    max-width: 294px;
  }
  .config-line__radio {
    padding-right: 10px;
    width: 85px;
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
}
</style>

