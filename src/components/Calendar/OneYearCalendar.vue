
<template>
  <div>
    <div class="months">
      <one-month-calendar
          v-for="month in months"
          :key="month"
          :year="year"
          :month="month"
          :years-calendar="true"
          class="calendar_years"
      >
      </one-month-calendar>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import OneMonthCalendar from './OneMonthCalendar.vue';
/* eslint-enable */

export default {
  data() {
    return {
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    };
  },
  props: {
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
  },

  components: { OneMonthCalendar },
};
</script>

<style>
.months {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  /* min-width: 900px; */
  min-height: 1070px;
  grid-row-gap: 1px;
  grid-column-gap: 1px;
  background-color: #dfdfdf;
  border: 1px solid #dfdfdf;
  border-radius: 5px;
}

.calendar_years {
  background-color: #fafafa;
}

.calendar_years .calendar__item_event {
  width: 30px;
  line-height: 30px;
}

.calendar_years .calendar__items_title {
  padding-bottom: 10px;
}

.calendar_years .calendar__items:not(.calendar__items_title) {
  background-color: inherit;
}

.calendar_years .calendar__items:not(:last-child) {
  border-bottom: none;
}

.calendar_years .calendar__items {
  line-height: normal;
}

.calendar_years .calendar__item:not(:last-child) {
  border-right: none;
}

.calendar_years .calendar__item {
  font-size: 11.18px;
  /* background: red;
  border-radius: 50%; */
}

.calendar_years .calendar__item_title {
  font-size: 0;
}

.calendar_years .calendar__item_title::first-letter {
  font-size: 12px;
}

.calendar_years .calendar {
  border: none;
  padding: 20px 25px 38px;
  grid-template-rows: 35px;
}
</style>
