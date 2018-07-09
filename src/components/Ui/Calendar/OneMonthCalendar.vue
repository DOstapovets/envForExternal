<template>
  <div class="wr-calendar">
    <!-- {{isHighlightedItem({day: 31, month: 2, year: 2018}, 'prevMonth')}} -->
    <div class="calendar">
      <!-- {{currDays}}<br>
      {{highlightedCurrDays}}<br>
      12131231
      {{highlightedPreviousMonthDays}}<br> -->
      <!-- {{highlightedDNextDays}} -->
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
          v-for="(monthDays, index) in highlightedCurrDays"
          :key="index"
          v-if="dPrevDays.length || monthDays.length || dNextDays.length"
        >
          <div
              class="calendar__item calendar__item_not-curr"
              v-if="!index"
              v-for="(previousMonthDaysValue, previousMonthDaysKey) in highlightedPreviousMonthDays"
              :key="previousMonthDaysKey"
              @click="sendChosenDate(previousMonthDaysKey, month - 1, year)"
          >
              <div>
                <span 
                  class="calendar__item_event calendar__item_event-recurring"
                >
                  <div
                    class="calendar__events-names"
                    v-if="previousMonthDaysValue.length"
                  >
                    <div>
                      <span
                        class="calendar__event"
                        :key="key"
                        v-if="key < 3 && previousMonthDaysValue.length"
                        v-for="(value, key) in previousMonthDaysValue"
                        :style="{color : value.lighter ? '#0F232E' : ''}"
                      >
                        <span 
                          class="calendar__event-background"
                          :style="{background: value.color, opacity : value.lighter ? '0.3' : ''}"
                        ></span>
                        {{value.eventName}}
                      </span>
                    </div>
                    <span
                      class="calendar__event calendar__event_more"
                      v-if="!yearsCalendar && previousMonthDaysValue.length > 3"
                    >
                      <span 
                        class="calendar__event-background calendar__event-background_more"
                      ></span>
                      More
                    </span>
                    <div 
                      class="calendar__event-more-items"
                      :class="{'calendar__event-more-items_year': yearsCalendar}"
                      v-if="Object.keys(previousMonthDaysValue).length > 3"
                    >
                      <span
                        class="calendar__event"
                        :key="key"
                        v-if="key >= 3"
                        v-for="(value, key) in previousMonthDaysValue"
                        :style="{color : value.lighter ? '#0F232E' : ''}"
                      >
                        <span 
                          class="calendar__event-background"
                          :style="{background: value.color, opacity : value.lighter ? '0.3' : ''}"
                        ></span>
                        {{value.eventName}}
                      </span>
                    </div>
                  </div>
                  <div class="calendar__day-num">
                    <span></span>
                    <div
                      class="stroke__wr"
                      v-if="yearsCalendar && previousMonthDaysValue.length > 0" 
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="34" width="34">
                        <circle 
                          v-for="(value, key) in previousMonthDaysValue"
                          :key="key"
                          :style="{stroke: value.color, 'stroke-dasharray': key !== 0 ? 
                          `${(previousMonthDaysValue.length - parseInt(key)) * 2 * 15 * Math.PI / previousMonthDaysValue.length},
                          ${2 * 15 * Math.PI / previousMonthDaysValue.length * parseInt(key)}`
                          : ''}"
                          class="stroke" 
                          cy="17" cx="17" 
                          r="15"
                        ></circle>
                      </svg>
                    </div>
                    <div class="calendar__day-num-text">
                      {{previousMonthDaysKey}}
                    </div>
                  </div>
                </span>
              </div>
          </div>
          <div
              class="calendar__item"
              v-for="(dayValue, dayKey) in monthDays"
              :key="dayKey"
              @click="sendChosenDate(dayKey, month, year)"
          >
              <div>
                <span 
                  class="calendar__item_event calendar__item_event-actice calendar__item_event-recurring"  
                > 
                  <div 
                    v-if="dayValue.length"
                    class="calendar__events-names"
                  >
                    <div>
                      <span
                        class="calendar__event"
                        :key="key"
                        v-if="key < 3"
                        v-for="(value, key) in dayValue"
                        :style="{color : value.lighter ? '#0F232E' : ''}"
                      >
                        <span 
                          class="calendar__event-background"
                          :style="{background: value.color, opacity : value.lighter ? '0.3' : ''}"
                        ></span>
                        {{value.eventName}}
                      </span>
                    </div>
                    <span
                      class="calendar__event calendar__event_more"
                      v-if="!yearsCalendar && dayValue.length > 3"
                    >
                      <span 
                        class="calendar__event-background calendar__event-background_more"
                      ></span>
                      More
                    </span>
                    <div 
                      class="calendar__event-more-items"
                      :class="{'calendar__event-more-items_year': yearsCalendar}"
                      v-if="Object.keys(dayValue).length > 3"
                    >
                      <span
                        class="calendar__event"
                        :key="key"
                        v-if="key >= 3"
                        v-for="(value, key) in dayValue"
                        :style="{color : value.lighter ? '#0F232E' : ''}"
                      >
                        <span 
                          class="calendar__event-background"
                          :style="{background: value.color, opacity : value.lighter ? '0.3' : ''}"
                        ></span>
                        {{value.eventName}}
                      </span>
                    </div>
                  </div>
                  <div class="calendar__day-num">
                    <span></span>
                    <div
                      class="stroke__wr"
                      v-if="yearsCalendar && dayValue.length > 0" 
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="34" width="34">
                        <circle 
                          v-for="(value, key) in dayValue"
                          :key="key"
                          :style="{stroke: value.color, 'stroke-dasharray': key !== 0 ? 
                          `${(dayValue.length - parseInt(key)) * 2 * 15 * Math.PI / dayValue.length},
                          ${2 * 15 * Math.PI / dayValue.length * parseInt(key)}`
                          : ''}"
                          class="stroke" 
                          cy="17" cx="17" 
                          r="15"
                        ></circle>
                      </svg>
                    </div>
                    <div class="calendar__day-num-text">{{dayKey}}</div>
                  </div>
                </span>
               </div>
          </div>
          <div
              class="calendar__item calendar__item_not-curr"
              v-if="index === currDays.length - 1"
              v-for="(nextMonthDayValue, nextMonthDayKey) in highlightedDNextDays"
              :key="nextMonthDayKey"
              @click="sendChosenDate(nextMonthDayKey, month + 1, year)"
          >
            <div>
              <span 
                class="calendar__item_event calendar__item_event-recurring"
              >
              <div
                class="calendar__events-names"
                v-if="nextMonthDayValue.length"
              >
                <div>
                  <span
                    class="calendar__event"
                    :key="key"
                    v-if="key < 3"
                    v-for="(value, key) in nextMonthDayValue"
                    :style="{color : value.lighter ? '#0F232E' : ''}"
                  >
                    <span 
                      class="calendar__event-background"
                      :style="{background: value.color, opacity : value.lighter ? '0.3' : ''}"
                    ></span>
                    {{value.eventName}}
                  </span>
                </div>
                <span
                  class="calendar__event calendar__event_more"
                  v-if="nextMonthDayValue.length > 3 && !yearsCalendar"
                >
                  <span 
                    class="calendar__event-background calendar__event-background_more"
                  ></span>
                  More
                </span>
                <div
                  class="calendar__event-more-items"
                  :class="{'calendar__event-more-items_year': yearsCalendar}"
                  v-if="Object.keys(nextMonthDayValue).length > 3"
                >
                  <span
                    class="calendar__event"
                    v-if="key >= 3"
                    :key="key"
                    v-for="(value, key) in nextMonthDayValue"
                    :style="{color : value.lighter ? '#0F232E' : ''}"
                  >
                    <span 
                      class="calendar__event-background"
                      :style="{background: value.color, opacity : value.lighter ? '0.3' : ''}"
                    ></span>
                    {{value.eventName}}
                  </span>
                </div>
              </div>
              <div class="calendar__day-num">
                <span></span>
                <div
                  class="stroke__wr"
                  v-if="nextMonthDayValue.length > 0 && yearsCalendar" 
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="34" width="34">
                    <circle 
                      v-for="(value, key) in nextMonthDayValue"
                      :key="key"
                      :style="{stroke: value.color, 'stroke-dasharray': key !== 0 ? 
                      `${(nextMonthDayValue.length - parseInt(key)) * 2 * 15 * Math.PI / nextMonthDayValue.length},
                      ${2 * 15 * Math.PI / nextMonthDayValue.length * parseInt(key)}`
                      : ''}"
                      class="stroke" 
                      cy="17" cx="17" 
                      r="15"
                    ></circle>
                  </svg>
                </div>
                <span class="calendar__day-num-text">{{nextMonthDayKey}}</span>
              </div>
              </span>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
// import _  'lodash';
import _ from 'lodash';
// import moment from 'moment';

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
    // selectedDays: {
    //   type: Array,
    //   default() {
    //     return [];
    //   },
    // },
    highlightedDates: {
      type: Object,
      default() {
        return {};
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
      this.$emit('input', {
        start,
        end,
        year: this.year,
      });
      return {
        start,
        end,
        year: this.year,
      };
    },
    highlightedPreviousMonthDays() {
      if (this.dPrevDays) {
        return this.dPrevDays.reduce((accumulator, currentValue) => {
          const resLocal = accumulator;
          resLocal[currentValue] = this.isHighlightedItem({day: currentValue, month: this.month, year: this.year}, 'prevMonth');
          return resLocal;
        }, {});
      }
      return null;
    },
    highlightedCurrDays() {
      if (this.currDays) {
        return this.currDays.map(item => item.reduce((accumulator, currentValue) => {
          const resLocal = accumulator;
          resLocal[currentValue] = this.isHighlightedItem({day: currentValue, month: this.month, year: this.year});
          return resLocal;
        }, {}));
      }
      return null;
    },
    highlightedDNextDays() {
      if (this.dNextDays) {
        return this.dNextDays.reduce((accumulator, currentValue) => {
          const resLocal = accumulator;
          resLocal[currentValue] = this.isHighlightedItem({day: currentValue, month: this.month, year: this.year}, 'nextMonth');
          return resLocal;
        }, {});
      }
      return null;
    }
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
    // isHighlightingDate(date, nexOrPrevMonth ) {
    //   let month = date.month;
    //   let year = date.year;
    //   return false;
    //   if (nexOrPrevMonth === 'nextMonth') {
    //     month = month + 1 === 13 ? 1 : month + 1;
    //     year = month + 1 === 13 ? year + 1 : year;
    //   } else if (nexOrPrevMonth === 'prevMonth') {
    //     month = month - 1 === 0 ? 12 : month - 1;
    //     year = month - 1 === 0 ? year - 1 : year;
    //   }
    //   let res = null;
    //   _.forEach(this.highlightedDates, item => {
    //     if(!item) return false;

    //     if (_.isArray(item.dates) &&
    //         item.dates.length > 0 &&
    //         item.dates.filter(
    //           ArrItem => ArrItem.day === date.day &&
    //           ArrItem.month === month &&
    //           ArrItem.year === year
    //         ).length > 0) {
    //           res = item;
    //           return false;
    //     }
    //     if (
    //       !_.isArray(item.dates) &&
    //       item.dates &&
    //       item.dates.day === date.day &&
    //       item.dates.month === month &&
    //       item.dates.year === year
    //     ) {
    //       res = item;
    //       return false;
    //     }
    //     return true;
    //   });
    //   return res;
    // },
    isHighlightedItem(date, nexOrPrevMonthFlag) {
      let month = date.month;
      let year = date.year;
      // let ItemDate = moment(`${date.year}-${date.month}-${date.day}`);
      let res = {};
    // if (`${year}-${month}-${date.day}` === '2018-2-31')
        // // console.log(`${year}-${month}-${date.day}`);

      if (nexOrPrevMonthFlag === 'nextMonth') {
        month += 1;
        if (month  === 13) {
          month = 1;
          year += 1;
        }

      } else if (nexOrPrevMonthFlag === 'prevMonth') {
        month -= 1;
        if (month  === 0) {
          month = 12;
          year -= 1;
        }
      }
      // ItemDate = ItemDate.format('YYYY-MM-DD');

      // console.log('this.highlightedDates',this.highlightedDates);
      // if (`${year}-${month}-${date.day}` === '2018-1-31')
        // console.log(`${year}-${month}-${date.day}`);
      _.forIn(this.highlightedDates, (value, key) => {
        if (key === `${year}-${month}-${date.day}`) {
          res = value;
          // return false;
        }
      });
      return res;

      // _.forEach(this.highlightedDates, item => {
      //   if(!item || !item.dates) return false;

      //   if (_.isArray(item.dates) &&
      //       item.dates.length > 0 &&
      //       item.dates.filter(
      //         ArrItem => ArrItem.day === date.day &&
      //         ArrItem.month === month &&
      //         ArrItem.year === year
      //       ).length > 0) {
      //         res = item;
      //         return false;
      //   }
      //   if (
      //     !_.isArray(item.dates) &&
      //     item.dates &&
      //     item.dates.day === date.day &&
      //     item.dates.month === month &&
      //     item.dates.year === year
      //   ) {
      //     res = item;
      //     return false;
      //   }
      //   return true;
      // });
      // return res;
    },
  },
  watch: {
    interval: {
      handler(newInterval) {
        this.$emit('input', newInterval);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
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

.wr-calendar:not(.calendar_years) .calendar {
   min-height: 820px;
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
  /* width: 50px; */
  /* display: inline-block; */
  /* line-height: 50px; */
  position: relative;
  /* background-color: #42c3f8; */
  /* border-radius: 50%; */
  /* color: #fff; */
  width: 100%;
  display: block;
}

.calendar__events-names {
  position: absolute;
	color: #FFFFFF;
	font-size: 10px;
	line-height: 20px;
  width: calc(100% - 10px);
  left: 50%;
  top: 35px;
  transform: translateX(-50%);

  &:hover {
    z-index: 1;
  }
}

.calendar__event {
  display: block;
  margin-bottom: 4px;
  border-radius: 2px;
  text-align: left;
  padding: 0px 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  position: relative;
  z-index: 1;
  white-space: nowrap;
  min-height: 20px;
  
  &_more {
    color: #0F232E;
    text-align: center;
    margin-bottom: 0;
    &:hover + .calendar__event-more-items {
      opacity: 1;
    }
  }
}

.calendar__event-more-items {
  opacity: 0;
  padding-top: 4px;
  background: #fff;
  padding-bottom: 4px;
  box-shadow: rgba(0, 0, 0, 0.3) 0 2px 10px;
  width: calc(100% + 4px);
  margin-left: -2px;
  
  .calendar__event {
    width: calc(100% - 4px);
    margin-left: auto;
    margin-right: auto;
  }

  &.calendar__event-more-items_year {
    opacity: 1;
  }

  &:hover {
    opacity: 1;
  }
}

.calendar__event-background {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%; 
  height: 100%;
  z-index: -1;

  &_more {
    font-size: 10px;
    line-height: 12px;
    text-align: center;
    background-color: #DFDFDF;
  }
}

.calendar__day-num {
  display: flex;
  justify-content: space-between;
  width: calc(100% - 15px);
  margin: auto;
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
  /* align-content: center; */
  display: grid;
  cursor: pointer;
  /* min-height: 120px; */
}

.calendar__item_not-curr {
  color: rgba(15, 35, 46, 0.55);
}

.calendar__item:not(:last-child) {
  border-right: 1px solid #dfdfdf;
}

.calendar_years {
  .calendar__events-names {
    width: 100px;
    top: 34px;
    display: none;
    background: #fff;
    padding: 4px 4px 0 4px;
    z-index: 9999999;
    box-shadow: rgba(0, 0, 0, 0.3) 0 2px 10px;
  }

  .calendar__item:hover {
    .calendar__events-names {
      display: block;
    }
  }

  .stroke {
    stroke-width: 3.5;
    stroke-opacity: 1;
    fill: transparent;
    stroke: #fff;
    // transition: stroke 1s ease-in-out;

    &__wr {
      height: 30px;
      width: 30px;
      position: absolute;
      left: 50%;
      top: 50%;
    margin-top: -17.5px;
    margin-left: -17.75px;
    }
  }
  .calendar__items {
    // position: relative;
  }

  .calendar__day-num {
    justify-content: flex-start;
  }
  
  .calendar__day-num-text {
    width: 100%;
  }

  .calendar__event-more-items {
    padding-top: 0;
    padding-bottom: 0;
    box-shadow: none;
  }
}


</style>
