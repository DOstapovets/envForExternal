<template>
  <div class="wr-calendar">
    <div class="calendar">
      <div class="calendar__items" v-if="yearsCalendar">
        <div class="calendar__item">
          <div><span class="calendar__title">{{monthNames[month - 1]}} {{year}}</span></div>
        </div>
      </div>
        <div class="calendar__items calendar__items_title">
          <div class="calendar__item_title"><span>Sun</span></div>
          <div class="calendar__item_title"><span>Mon</span></div>
          <div class="calendar__item_title"><span>Tue</span></div>
          <div class="calendar__item_title"><span>Wed</span></div>
          <div class="calendar__item_title"><span>Thu</span></div>
          <div class="calendar__item_title"><span>Fri</span></div>
          <div class="calendar__item_title"><span>Sat</span></div>
        </div>
        <div
          class="calendar__items"
          v-for="(monthDays, index) in currDays"
          :key="monthDays.toString()"
          v-if="dPrevDays.length || monthDays.length || dNextDays.length"
        >
          <div
              class="calendar__item calendar__item_not-curr"
              v-if="!index"
              v-for="previousMonthDays in dPrevDays"
              :key="previousMonthDays.toString()"
              @click="sendChosenDate(previousMonthDays, month - 1, year)"
          >
              <div>
                <!-- <span 
                  class="calendar__item_event calendar__item_event-recurring"
                  :class="{'calendar__iselected-item':
                    selectedDate.day === previousMonthDays
                    && selectedDate.month === (month - 1 === 0 ? 12 : month - 1)
                    && selectedDate.year === (month - 1 === 0 ? year - 1 : year)
                    && !notShowSelectedOnPrevNextDays}"
                >
                  {{previousMonthDays}}
                </span> -->
              </div>
          </div>
          <div
              class="calendar__item"
              v-for="day in monthDays"
              :key="day.toString()"
              @click="sendChosenDate(day, month, year)"
          >
              <div>
                <span 
                  class="calendar__item_event calendar__item_event-actice calendar__item_event-recurring"
                  :class="{'calendar__iselected-item': 
                 isHighlightingDate({day, month, year})}"
                    
                >
                    {{day}}
                </span>
               </div>
          </div>
          <div
              class="calendar__item calendar__item_not-curr"
              v-if="index === currDays.length - 1"
              v-for="nextMonthDays in dNextDays"
              :key="nextMonthDays.toString()"
              @click="sendChosenDate(nextMonthDays, month + 1, year)"
          >
              <div>
                <!-- <span 
                  class="calendar__item_event calendar__item_event-recurring"
                  :class="{'calendar__iselected-item':
                    selectedDate.day === nextMonthDays
                    && selectedDate.month === (month + 1 === 13 ? 1 : month + 1)
                    && selectedDate.year === (month + 1 === 13 ? year + 1 : year)
                    && !notShowSelectedOnPrevNextDays}"
                >
                  {{nextMonthDays}}
                </span> -->
                </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
// import _  'lodash';
// import _  from 'lodash';

// console.log('____', _);

export default {
  beforeUpdate() {
    this.mon = this.month - 1;
  },
  data() {
    return {
      mon: this.month - 1,
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    };
  },
  props: {
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
    month: {
      type: Number,
      default: new Date().getMonth() + 1,
    },
    yearsCalendar: {
      type: Boolean,
      default: false,
    },
    selectedDays: {
      type: Array,
      default() {
        return [];
      },
    },
    notShowSelectedOnPrevNextDays: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    dPrevDays() {
      const d = new Date(this.year, this.mon);
      const dPrev = new Date(this.year, this.mon);
      dPrev.setDate(dPrev.getDate() - this.getDay(d));
      const data = [];
      for (let i = 0; i < this.getDay(d); i += 1) {
        data.push(dPrev.getDate());
        dPrev.setDate(dPrev.getDate() + 1);
      }
      return data;
    },
    currDays() {
      const d = new Date(this.year, this.mon);
      const data = [];
      data[0] = [];
      while (d.getMonth() === this.mon) {
        data[data.length - 1].push(d.getDate());

        if (this.getDay(d) % 7 === 6) {
          data[data.length] = [];
        }

        d.setDate(d.getDate() + 1);
      }
      return data;
    },
    dNextDays() {
      const data = [];
      const d = new Date(this.year, this.month);
      // if (this.getDay(d) !== 0) {
      for (let i = this.getDay(d); i < 7; i += 1) {
        data.push(d.getDate());
        d.setDate(d.getDate() + 1);
      }
      // }
      return data;
    },
    interval() {
      const currDaysLast = this.currDays[this.dNextDays.length - 1];
      const start = this.dPrevDays.length
        ? `${this.dPrevDays[0]} ${
            this.monthNames[this.month === 1 ? 11 : this.month - 2]
          }`
        : `${this.currDays[0][0]} ${this.monthNames[this.month - 1]}`;
      const end = this.dNextDays.length
        ? `${this.dNextDays[this.dNextDays.length - 1]} ${
            this.monthNames[this.month === 12 ? 0 : this.month]
          }`
        : `${currDaysLast[currDaysLast.length - 1]} ${
            this.monthNames[this.month - 1]
          }`;
      this.$emit('input', `${start} - ${end}, ${this.year}`);
      return `${start} - ${end}, ${this.year}`;
    },
  },
  methods: {
    getDay(date) {
      //   let day = date.getDay();
      //   if (day === 0) day = 7;
      //   return day - 1;
      return date.getDay();
    },
    sendChosenDate(day, month, year) {
      let localMonth = month;
      let localYear = year;
      if (localMonth === 0) {
        localMonth = 12;
        localYear -= 1;
      } else if (localMonth === 13) {
        localMonth = 1;
        localYear += 1;
      }

      // console.log(day, localMonth, localYear);
      this.$emit('selected-date', day, localMonth, localYear);
    },
    isHighlightingDate(day) {
      // return _.some(this.selectedDays, day);
      return true;
    },
  },
  watch: {
    interval(newInterval) {
      this.$emit('input', newInterval);
    },
  },
};
</script>

<style>
.wr-calendar {
  position: relative;
  width: 100%;
  /* display: grid;
  grid-template-columns: 1fr; */
}

.wr-calendar:before {
  content: '';
  display: block;
  padding-top: 75%;
}

.calendar {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  text-align: center;
  display: grid;
  grid-template-rows: 30px;
  border: 1px solid #dfdfdf;
  border-radius: 5px;
}

.calendar__title {
  white-space: nowrap;
  width: 11px;
  color: #0f232e;
  font-size: 14px;
  font-weight: bold;
  line-height: 16px;
  padding-bottom: 20px;
  display: inline-block;
}

.calendar__items {
  display: grid;
  vertical-align: 100%;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  line-height: 30px;
}

.calendar__items:not(.calendar__items_title) {
  background-color: #fafafa;
}

.calendar__item_event {
  width: 50px;
  display: inline-block;
  line-height: 50px;
  /* background-color: #42c3f8; */
  /* border-radius: 50%; */
  /* color: #fff; */
}

/* .calendar__item_event-recurring {
  background-color: rgba(66, 195, 248, 0.4);
  color: #0f232e;
} */

.calendar__iselected-item {
  background-color: #42c3f8;
  border-radius: 50%;
  color: #fff;
}

.calendar__items_title {
  color: rgba(94, 101, 109, 0.55);
  font-size: 14px;
  font-weight: bold;
}

.calendar__items:not(:last-child) {
  border-bottom: 1px solid #dfdfdf;
}

.calendar__item {
  align-content: center;
  display: grid;
  cursor: pointer;
}

.calendar__item_not-curr {
  color: rgba(15, 35, 46, 0.55);
}

.calendar__item:not(:last-child) {
  border-right: 1px solid #dfdfdf;
}
</style>
