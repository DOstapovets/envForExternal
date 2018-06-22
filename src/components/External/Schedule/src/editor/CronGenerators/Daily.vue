<template>
  <div class="daily">
      {{value}}
      <div v-if="isEditable">
        <div class="radio-custom__wr">
              <or-radio v-model="periodModeLocal" true-value="everyDay" class="" :disabled="readonly">
                  Every:
              </or-radio>
              <or-textbox :disabled="readonly || periodModeLocal !== 'everyDay'" :class="['xs-input', /*{'text-box-error': !dailySchedule.isDailyDaysValid}*/]"
                  label="" v-model="periodLocal" placeholder="">
              </or-textbox>
              <div class="">day(s)</div>
          </div>
          <div class="radio-custom__wr">
              <or-radio v-model="periodModeLocal" true-value="evenDay" class="" :disabled="readonly">
                  Every:
              </or-radio>
              <div class="">even day</div>
          </div>
          <div class="radio-custom__wr">
              <or-radio v-model="periodModeLocal" true-value="oddDay" class="" :disabled="readonly">
                  Every:
              </or-radio>
              <div class="">odd day</div>
          </div>
      </div>
      <div v-else>
        <div v-html="textWhenScheduled"></div>
      </div>
  </div>
</template>

<script>
import _ from 'lodash';
/* eslint-disable */
import savedState from './savedState.js';
/* eslint-enable */
// import later from 'later';

export default {
  created() {
    this.$emit('input', this.cronExpression());
  },
  data() {
    return {};
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
    periodMode: {
      type: String,
      default: 'everyDay',
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
    index: {
      type: Number,
      default: -1,
    },
  },
  computed: {
    periodLocal: {
      get() {
        return this.period;
      },
      set(newValue) {
        this.$emit('update:period', newValue);
      },
    },
    periodModeLocal: {
      get() {
        return this.periodMode;
      },
      set(newValue) {
        this.$emit('update:periodMode', newValue);
      },
    },
    dailyValue() {
      switch (this.periodModeLocal) {
        case 'everyDay':
          return `1/${this.periodLocal}`;
        case 'oddDay':
          return '1-31/2';
        case 'evenDay':
          return '2-30/2';
        default:
          return '1/1';
      }
    },
    textWhenScheduled() {
      let text = '';
      switch (this.periodModeLocal) {
        case 'everyDay':
          text =  `Every <span class="bold-text">${this.periodLocal}</span> day`;
          break;
        case 'oddDay':
          text =  'Every <span class="bold-text">odd</span> days';
          break;
        case 'evenDay':
          text =  'Every <span class="bold-text">even</span> days';
          break;
        default:
          text =  '';
          break;
      }
      return text;
    }
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
      this.$emit('change-saved-accordion-num-item', this.index);
    }
  },
  mixins: [savedState],
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
  .bold-text {
    	color: #0F232E;
      font-size: 14px;
      font-weight: bold;
      line-height: 21px;
  }
}
</style>

