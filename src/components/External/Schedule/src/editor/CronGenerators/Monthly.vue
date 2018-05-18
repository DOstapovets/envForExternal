<template>
<div class="tab-wrapper section-border">
    <div class="schedule-step__month-picker-wrapper">
        <!-- <div class="schedule-step__month-picker-active">
            <or-checkbox v-model="isEveryMonth" :disabled="readonly">every month</or-checkbox>
        </div> -->
        {{selectedMonthsComp}}
        <month-picker v-model="selectedMonthsComp" :disabled="readonly"></month-picker>
    </div>
    <div class="recuring-configs__monthly-day_configs">
        <div class="config-line">
            <!-- <or-radio v-model="isMonthlyDays" true-value="true" :disabled="!monthlySelectedMonths.length || readonly" class="config-line__radio">On the following days
            </or-radio> -->
            <!-- <div class="recuring-configs__monthly-day_configs-calendar" v-if="isMonthlyDays === 'true'"> -->
                <div :class="['month-calendar', {'month-calendar-invalid' : !monthlySchedule.isMonthlyDaysValid}]">
                    <div 
                      v-for="day in getMonthDays"
                      class="month-calendar__day"
                    >
                    <button
                      :class="['month-calendar__day-value', {'is-active': isMonthBtnActive(day)}]" :disabled="readonly"
                      @click="toggleMonthDays(day)">
                        {{day}}
                    </button>
                    </div>
                </div>
            <!-- </div> -->
        </div>
        <!-- <div class="config-line">
            <or-radio v-model="isMonthlyDays" true-value="false" :disabled="!monthlySelectedMonths.length || readonly" class="config-line__radio">Day periods
            </or-radio>
            <div class="monthly-periods" v-if="isMonthlyDays === 'false'">
                <div class="config-line__label">one the:</div>
                <or-select :disabled="readonly" :class="['config-line__select', {'select-box-error': !monthlySchedule.daysPeriod.period}]"
                    label="" placeholder="" @change="monthlyDaysPeriodChange" v-model="monthlySchedule.daysPeriod.period"
                    :options="getDaysPeriod">
                </or-select>
                <or-select :disabled="readonly" :class="['config-line__select', {'select-box-error': !monthlySchedule.daysPeriod.day}]" label=""
                    placeholder="" @change="monthlyDaysPeriodChange" v-model="monthlySchedule.daysPeriod.day"
                    :options="getWeekDays">
                </or-select>
            </div>
        </div> -->
    </div>
</div>
</template>

<script>
/* eslint-disable */
import _ from 'lodash';
import MonthPicker from '../MonthPicker/MonthPicker.vue';
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
  },
  data() {
    return {};
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
  },
  components: { MonthPicker },
};
</script>

<style lang="scss" scoped>
</style>

