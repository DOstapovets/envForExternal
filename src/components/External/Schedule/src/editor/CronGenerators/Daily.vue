<template>
  <div class="daily">
      <div class="radio-custom__wr">
          <or-radio v-model="dailyDataLocal.dailyPeriodMode" true-value="everyDay" class="" :disabled="readonly">
              Every:
          </or-radio>
          <or-textbox :disabled="readonly || dailyDataLocal.dailyPeriodMode !== 'everyDay'" :class="['xs-input', /*{'text-box-error': !dailySchedule.isDailyDaysValid}*/]"
              label="" v-model="dailyDataLocal.periodDays" placeholder="">
          </or-textbox>
          <div class="">day(s)</div>
      </div>
      <div class="radio-custom__wr">
          <or-radio v-model="dailyDataLocal.dailyPeriodMode" true-value="evenDay" class="" :disabled="readonly">
              Every:
          </or-radio>
          <div class="">even day</div>
      </div>
      <div class="radio-custom__wr">
          <or-radio v-model="dailyDataLocal.dailyPeriodMode" true-value="oddDay" class="" :disabled="readonly">
              Every:
          </or-radio>
          <div class="">odd day</div>
      </div>
  </div>
</template>

<script>
import _ from 'lodash';
// import later from 'later';

export default {
  data() {
    return {};
  },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    dailyData: {
      type: Object,
      default() {
        return {
          dailyPeriodMode: 'everyDay',
          periodDays: 1,
          cronExpressions: [],
        };
      },
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
  computed: {
    dailyDataLocal: {
      get() {
        return this.dailyData;
      },
      set(newDailyData) {
        this.$emit('update:dailyData', newDailyData);
      },
    },
    dailyValue() {
      switch (this.dailyDataLocal.dailyPeriodMode) {
        case 'everyDay':
          return `1/${this.dailyDataLocal.periodDays}`;
        case 'evenDay':
          return '1-31/2';
        case 'oddDay':
          return '2-30/2';
        default:
          return '1/1';
      }
    },
  },
  methods: {
    cronExpression() {
      return _.map(
        this.runAtTime,
        item => `${item.mm} ${item.HH} ${this.dailyValue}  * ? *`,
      );
    },
  },
  watch: {
    runAtTime() {
      this.$emit('input', this.cronExpression());
    },
    dailyValue() {
      this.$emit('input', this.cronExpression());
    },
  },
};
</script>

<style lang="scss">
.daily {
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
}
</style>

