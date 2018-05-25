<template>
<div class="weekly">
  {{value}}
    <div class="radio-custom__wr">
        <or-radio v-model="periodMode" true-value="everyWeek" :disabled="readonly">
            Every:
        </or-radio>
        <or-textbox :disabled="readonly" :class="['xs-input', /*{'text-box-error': !dailySchedule.isDailyDaysValid}*/]"
            label="" v-model="periodLocal" placeholder="">
        </or-textbox>
        <div class="">week(s) on:</div>
    </div>
    <div class="weekly-days">
        <button 
            :class="['btn-group', {'is-active': isWeekBtnActive(day), 'is-disabled': readonly }]" 
            v-for="day in getWeekDays"
            :key="day.value"
            :disabled="readonly" 
            @click="toggleWeeklyDays(day)">
            {{day.label}}
        </button>
    </div>
</div>
</template>

<script>
import _ from 'lodash';

export default {
  data() {
    return {
      periodMode: 'everyWeek',
      getWeekDays: [
        { label: 'Mon', value: '1' },
        { label: 'Tue', value: '2' },
        { label: 'Wed', value: '3' },
        { label: 'Thu', value: '4' },
        { label: 'Fri', value: '5' },
        { label: 'Sat', value: '6' },
        { label: 'Sun', value: '0' },
      ],
      //   weekDaysLocal: this.weekDays,
      //   periodLocal: this.period,
    };
  },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    weekDays: {
      type: Array,
      default() {
        return [];
      },
    },
    period: {
      type: String,
      default: '',
    },
    runAtTime: {
      type: Array,
      default() {
        return [];
      },
    },
    value: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    isWeekBtnActive(day) {
      return _.find(this.weekDaysLocal, weekDay => weekDay.value === day.value);
    },
    toggleWeeklyDays(day) {
      if (_.some(this.weekDaysLocal, day)) {
        this.weekDaysLocal = this.weekDaysLocal.filter(
          item => item.value !== day.value,
        );
      } else {
        this.weekDaysLocal.push(day);
      }
    },
    cronExpression() {
      console.log(this.runAtTime);
      return _.map(
        this.runAtTime,
        item =>
          `${item.mm} ${item.HH} ${_.map(
            this.weekDaysLocal,
            weekDay =>
              `${weekDay.label.toUpperCase()}${
                this.periodLocal ? `#${this.periodLocal}` : ''
              }`,
          )}  * ? *`,
      );
    },
  },
  computed: {
    dataLocal: {
      get() {
        return this.weeklyData;
      },
      set(newWeeklyData) {
        this.$emit('update:weeklyData', newWeeklyData);
      },
    },
    weekDaysLocal: {
      get() {
        return this.weekDays;
      },
      set(newWeekDays) {
        this.$emit('update:weekDays', newWeekDays);
      },
    },
    periodLocal: {
      get() {
        return this.period;
      },
      set(newPeriod) {
        this.$emit('update:period', newPeriod);
      },
    },
  },
  watch: {
    runAtTime() {
      this.$emit('input', this.cronExpression());
    },
    weekDaysLocal() {
      this.$emit('input', this.cronExpression());
    },
    periodLocal() {
      this.$emit('input', this.cronExpression());
    },
  },
};
</script>

<style lang="scss">
.weekly {
  .radio-custom__wr {
    display: flex;
    align-items: center;
    margin-bottom: 5px;

    .xs-input {
      margin-bottom: 0;
      padding-right: 16px;
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

  .weekly-days {
    margin: 10px 0 0 30px;
    .btn-group {
      font-size: 14px;
      color: #0f232e;
      width: 35px;
      height: 25px;
      border: solid 1px #e7e7e7;
      background-color: #fbfbfb;
      padding: 0;
      font-size: 12px;
      cursor: pointer;
      &:hover {
        color: #59a9d5;
        border: solid 1px #59a9d5;
        background-color: #fbfbfb;
      }
      &.is-disabled:hover {
        color: #0f232e;
        border: solid 1px #e7e7e7;
        background-color: #fbfbfb;
        cursor: default;
      }
      &.is-active,
      &.is-active:hover {
        background-color: #59a9d5;
        // border-color: #59a9d5;
        color: #ffffff;
      }
    }
  }
}
</style>

