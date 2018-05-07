// import Vue from 'vue';

import { storiesOf } from '@storybook/vue';
// import { action } from '@storybook/addon-actions';
// import _ from 'lodash';

/* eslint-disable */
import OneMonthCalendar from './OneMonthCalendar.vue';
import OneYearCalendar from './OneYearCalendar.vue';
import Calendar from './Calendar.vue';
/* eslint-enable */

storiesOf('OneMonthCalendar', module)
  .add('One month component', () => ({
    data() {
      return {
        value: '',
      };
    },
    methods: {},
    components: {
      OneMonthCalendar,
    },
    template: `
    <div>
        <one-month-calendar
            :year="2018"
            :month="1" 
        >
        </one-month-calendar>
    </div>
  `,
  }))
  .add('One year component', () => ({
    data() {
      return {
        value: '',
      };
    },
    methods: {},
    components: { OneYearCalendar },
    template: `
    <div>
        <one-year-calendar
        :year="2017"
        >
        </one-year-calendar>
    </div>
  `,
  }))
  .add('Calendar with controls', () => ({
    data() {
      return {
        value: '',
      };
    },
    methods: {},
    components: { Calendar },
    template: `
    <div>
        <calendar
          :month="1"
        >
        </calendar>
    </div>
  `,
  }))
  .add('Calendar with events', () => ({
    data() {
      return {
        value: '',
      };
    },
    methods: {},
    components: { Calendar },
    template: `
    <div>
        <calendar
        >
        </calendar>
    </div>
  `,
  }));
