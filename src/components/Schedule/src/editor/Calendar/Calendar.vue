
<template>
  <div>
    <div class="nav">
        <div>
            <span class="nav__interval">
                {{state === 'month' ? interval : year}}
            </span>
        </div>
        <div class="nav__wr-right">
            <span 
                class="nav__month"
                :class="{active: state === 'month'}"
                @click="doStateMonth"
            >
                Month
            </span>
            <span 
                class="nav__year"
                :class="{active: state === 'year'}"
                 @click="doStateYear"
            >
                Year
            </span>
            <div class="nav__wr-arrows">
                <span
                    @click="back"
                >
                    <or-icon
                        class="nav__back"
                        icon="arrow_back_ios"
                    >
                    </or-icon>
                </span>
                <span
                    @click="forward"
                >
                    <or-icon
                        class="nav__forward"
                        icon="arrow_forward_ios"
                    >
                    </or-icon>
                </span>

            </div>

        </div>
    </div>
    <one-month-calendar
        :year="year"
        :month="month"
        v-model="interval"
        v-if="state === 'month'"
    >
    </one-month-calendar>
    <one-year-calendar
        :year="year"
        v-if="state === 'year'"
    >
    </one-year-calendar>
  </div>
</template>

<script>
/* eslint-disable */
import OneMonthCalendar from './OneMonthCalendar.vue';
import OneYearCalendar from './OneYearCalendar.vue';
/* eslint-enable */

export default {
  data() {
    return {
      interval: '',
      state: 'month',
      year: parseInt(this.startYear, 10),
      month: parseInt(this.startMonth, 10),
    };
  },
  props: {
    startYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    startMonth: {
      type: Number,
      default: new Date().getMonth() + 1,
    },
  },
  components: { OneMonthCalendar, OneYearCalendar },
  methods: {
    forward() {
      console.log(this.month);
      switch (this.state) {
        case 'year':
          this.year += 1;
          this.month = 1;
          break;
        case 'month':
          if (this.month === 12) {
            this.month = 1;
            this.year += 1;
          } else {
            this.month += 1;
          }

          break;

        default:
          break;
      }
    },
    back() {
      console.log(this.month);
      switch (this.state) {
        case 'year':
          this.year -= 1;
          this.month = 1;
          break;
        case 'month':
          if (this.month === 1) {
            this.month = 12;
            this.year -= 1;
          } else {
            this.month -= 1;
          }

          break;

        default:
          break;
      }
    },
    doStateMonth() {
      console.log(2);
      this.state = 'month';
    },
    doStateYear() {
      console.log(1);
      this.state = 'year';
    },
  },
};
</script>

<style>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.nav__forward,
.nav__back {
  color: #979797;
  font-size: 10px;
}

.nav__back {
}

.nav__forward {
}

.nav__month .nav__year {
  color: rgba(15, 35, 46, 0.55);
  font-size: 14px;
  line-height: 16px;
}

.nav__month.active,
.nav__year.active {
  color: #0f232e;
  font-weight: bold;
  cursor: pointer;
}

.nav__wr-right {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.nav__wr-right {
  margin-right: 35px;
}

.nav__month {
  margin-right: 43px;
}

.nav__year {
  margin-right: 40px;
}

.nav__interval {
  color: #000;
  font-size: 17px;
  font-weight: bold;
  line-height: 23px;
}
</style>
