<template>
  <div 
      class="recuring-configs__monthly-day_configs-calendar"
      v-if="months.length"
  >
      <div :class="['month-calendar', {'month-calendar-invalid' : invalid}]">
          <div 
              v-for="day in getMonthDays"
              :key="day"
              class="month-calendar__day"
          >
          <button
              :class="['month-calendar__day-value', {'is-active': isMonthBtnActive(day)}]" :disabled="readonly"
              @click="toggleMonthDays(day)">
              {{day}}
          </button>
          </div>
      </div>
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment-timezone';

export default {
  props: {
    months: {
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
    readonly: {
      type: Boolean,
      default: false,
    },
    invalid: {
      type: Boolean,
      default: false,
    },
    $v: null,
  },
  computed: {
    selectedDaysComp: {
      get() {
        return this.selectedDays;
      },
      set(newValue) {
        this.$emit('update:selectedDays', newValue);
      },
    },
    getMonthDays() {
      return _.range(
        1,
        _.reduce(
          this.months,
          (prev, curr) => {
            let lastDate = moment()
              .month(curr - 1)
              .endOf('month')
              .date();

            if (curr === 2) {
              lastDate = 29;
            }

            return lastDate > prev ? lastDate : prev;
          },
          0,
        ) + 1,
      );
    },
  },
  methods: {
    isMonthBtnActive(day) {
      return _.find(this.selectedDaysComp, monthDay => monthDay === day);
    },
    toggleMonthDays(day) {
      if (_.includes(this.selectedDaysComp, day)) {
        this.selectedDaysComp = this.selectedDaysComp.filter(
          item => item !== day,
        );
      } else {
        this.selectedDaysComp.push(day);
      }
    },
  },
  watch: {
    months(newValue) {
      if (!newValue.length) {
        this.selectedDaysComp = [];
      }
    },
  },
};
</script>

<style lang="scss">
.recuring-configs__monthly-day_configs {
  margin-top: 10px;
  .config-line {
    flex-direction: column;
    align-items: start;
    .recuring-configs__monthly-day_configs-calendar {
      .month-calendar {
        display: flex;
        flex-wrap: wrap;
        width: 177px;
        // background-color: #fafafa;
        border-left: solid 1px #e3e3e3;
        border-top: solid 1px #e3e3e3;
        &-invalid {
          border: 1px solid #f95d5d;
        }
        .month-calendar__day {
          .month-calendar__day-value {
            width: 25px;
            height: 25px;
            padding: 0;
            background-color: transparent;
            border: none;
            border-right: 1px solid #dfdfdf;
            border-bottom: 1px solid #dfdfdf;
            &[disabled='disabled']:hover {
              background-color: transparent;
              color: graytext;
              cursor: default;
            }
            &:hover {
              color: #000000;
              border-radius: 1px;
              background-color: #e1e1e1;
              cursor: pointer;
            }
            &.is-active {
              color: #ffffff !important;
              background-color: #64b2da !important;
            }
          }
        }
      }
    }
  }

  .monthly-periods {
    display: flex;
    align-items: center;
    .config-line__label {
      margin-right: 5px;
    }
  }
}
</style>
