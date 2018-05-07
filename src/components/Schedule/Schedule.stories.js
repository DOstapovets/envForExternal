// import Vue from 'vue';

import { storiesOf } from '@storybook/vue';
// import { action } from '@storybook/addon-actions';
// import _ from 'lodash';

/* eslint-disable */
import MonthPicker from './src/editor/MonthPicker.vue';
import ScheduleEvent from './src/editor/ScheduleEvent.vue';
import ScheduleEvents, { data as schemaData } from './src/editor/editor.vue';
import Vue from 'vue';
// Vue.localStorage.set('schema', JSON.stringify(schema()));

// console.log('data', schema());

/* eslint-enable */

storiesOf('Schedule', module)
    .add('MonthPicker', () => ({
        data() {
            return { monthlySelectedMonths: [] };
        },
        methods: {},
        components: { MonthPicker },
        template: `
    <div>
        <month-picker v-model="monthlySelectedMonths" :disabled="readonly"></month-picker>
    </div>
  `,
    }))
    .add('ScheduleEvent', () => ({
        data() {
            return {
                startExpression: { time: '00:00', date: '' },
                deactivateAfterLastRun: false,
                includeEndTime: false,
                isReccuring: false,
                expressions: [],
                isEndTime: false,
                endExpression: { time: '00:00', date: '' },
                timeZone: {},
                daily: {},
                weekly: {},
                monthly: {},
                times: [],
                // $v: null,
                readonly: false,
                stepId: {},
                steps: {},
            };
        },
        methods: {},
        components: { ScheduleEvent },
        template: `
        <div>
            <schedule-event
                :start-expression.sync="startExpression"
                :deactivate-after-last-run.sync="deactivateAfterLastRun"
                :is-reccuring.sync="isReccuring"
                :expressions.sync="expressions" 
                :is-end-time.sync="isEndTime" 
                :end-expression.sync="endExpression" 
                :include-end-time.sync="includeEndTime" 
                :time-zone.sync="timeZone"     
                :daily.sync="daily"   
                :weekly.sync="weekly"   
                :monthly.sync="monthly"
                :times.sync="times"
                
                :readonly="readonly"  
                :step-id="stepId"
                :steps="steps"
            ></schedule-event>
        </div>
      `,
    }))
    .add('Schedule', () => ({
        data() {
            return {
                schema:
                    JSON.parse(Vue.localStorage.get('schema')) || schemaData(),
            };
        },
        created() {
            console.log('this.schema', this.schema);
        },
        watch: {
            schema: {
                handler(newSchema) {
                    Vue.localStorage.set('schema', JSON.stringify(newSchema));
                    // console.log(newSchema);
                },
                deep: true,
            },
        },
        methods: {},
        components: { ScheduleEvents },
        template: `
    <div>
        <schedule-events :schedule-events.sync="schema.scheduleEvents"></schedule-events>
    </div>
  `,
    }));
