<template>
  <div>
 123
  </div>
</template>
<script>
import _ from 'lodash';

// import * as _ from 'lodash';
// import { validators } from '_validators';
// const { required, jsExpressionNonEmptyString, validateIf } = validators;
const randomColor = require('randomcolor').randomColor;
/* eslint-disable */
import ScheduleEvent from '../ScheduleEvent/ScheduleEvent.vue';
import ScheduleEventPreview from '../ScheduleEventPreview/ScheduleEventPreview.vue';
import Calendar from '../../../../../Ui/Calendar/Calendar.vue';
/* eslint-enable */

export default {
  name: 'schedule-events',
  props: [
    'scheduleEvents',
    '$v',
    'template',
    'schema',
    'step',
    'stepId',
    'steps',
    'readonly',
  ],
  components: { ScheduleEvent, Calendar, ScheduleEventPreview },

  created() {
    // console.log('!!!!!!!!!!!!!!', this.$v);
  },

  data() {
    return {
      // scheduleEventsLocal: this.scheduleEvents,
      editableEventNum: null,
      copyScheduleEventData: null
      // editableCopy: [],
    };
  },
  computed: {
    startDays() {
      const dates = this.scheduleEvents.map(item => {
        const dateSplice = item.scheduleEventData.startExpression.date.split('-');
        
        return {
          color: item.scheduleEventData.color,
          date: {
            day: parseInt(dateSplice[2], 10),
            month: parseInt(dateSplice[1], 10),
            year: parseInt(dateSplice[0], 10),
          },
        };

      })
      .filter((item, index) => index !== this.editableEventNum);

      if (this.copyScheduleEventData) {
        const copyScheduleEventDataSplice = this.copyScheduleEventData.startExpression.date.split('-');
        dates.push({
            color: this.scheduleEvents[this.editableEventNum].scheduleEventData.color,
            date: {
              day: parseInt(copyScheduleEventDataSplice[2], 10),
              month: parseInt(copyScheduleEventDataSplice[1], 10),
              year: parseInt(copyScheduleEventDataSplice[0], 10),
            },
          }
        );
      }
      return dates;
    },
  },

  methods: {
    listNewItemMethod() {
      return {
        scheduleEventData: {
          startExpression: {
            time: '00:00',
            date: '',
          },
          deactivateAfterLastRun: false,
          includeEndTime: false,
          isReccuring: false,
          expressions: [],
          isEndTime: false,
          endExpression: {
            time: '00:00',
            date: '',
          },
          timeZone: {
            label: '',
            value: ''
          },
          daily: {
            periodMode: 'everyDay',
            period: '1',
            cronExpressions: [],
          },
          weekly: {
            period: '1',
            cronExpressions: [],
            weekDays: [],
          },
          monthly: {
            selectedMonths: [],
            selectedDays: [],
            mode: 'each',
            daysPeriod: { day: '', period: '' },
            period: '1',
            cronExpressions: [],
          },
          yearly: {
            selectedMonths: [],
            period: '1',
            cronExpressions: [],
            selectedDays: [],
            daysPeriod: { day: '', period: '' },
            onThe: false,
          },
          times: [
            {
              start: {
                HH: '',
                mm: '',
              },
              end: {
                HH: '',
                mm: '',
              },
              every: {
                val: 10,
                units: 'mm',
              },
              endTime: false,
            },
          ],
          color: randomColor(),
        },
      };
    },
    openModal(ref) {
      this.$refs[ref].open();
    },
    closeModal(ref) {
      this.$refs[ref].close();
    },
    changeSelectedDate(day, month, year) {
      this.copyScheduleEventData.startExpression.date = `${year}-${month}-${day}`;
      // this.selectedDateLocal = `${year}-${month}-${day}`;
    },
    doEditable(index) {
      this.editableEventNum = index;
      // this.copyScheduleEventData = _.cloneDeep(this.scheduleEvents[index].scheduleEventData);
      this.$set(this, 'copyScheduleEventData', _.cloneDeep(this.scheduleEvents[index].scheduleEventData));
    },
    // saveCopy(index) {
    //   this.editableCopy[index] = this.scheduleEvents[index];
    //   console.log('this.editableCopy',this.editableCopy);
    // },
    // returnState(index) {
    //   this.scheduleEvents[index] = this.editableCopy[index];
    //   console.log('this.scheduleEvents[index]', this.scheduleEvents[index]);
    // },
    applyChanges() {
      this.scheduleEvents[this.editableEventNum].scheduleEventData = _.cloneDeep(this.copyScheduleEventData);
    },
    cancelChanges() {
      this.copyScheduleEventData = _.cloneDeep(this.scheduleEvents[this.editableEventNum].scheduleEventData);
    }
  },
};

</script>

<style lang="scss" rel="stylesheet/scss">
.ui-modal__container {
  width: 100%;
}
.schedule-event-preview {
  margin-bottom: 20px;
}
</style>

<style scoped lang="scss" rel="stylesheet/scss">
.schedule {
  &__wr-events-calendar {
    display: flex;
  }
  &__calendar {
    min-width: 800px;
    width: 100%;
    padding-right: 30px;
  }
  &__wr-event-preview {
    width: 100%;
  }
}
</style>