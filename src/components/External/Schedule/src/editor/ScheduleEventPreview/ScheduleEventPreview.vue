<template>
  <div class="schedule-event-preview" @click="doEditable">
    <span 
      class="schedule-event-preview__circle"
      :style="{background: color}"
    ></span>
    <div class="schedule-event-preview__content">
      {{eventName}}
    </div>
    <div>
      <span
        :key="index"
        v-for="(date, index) in startsAt"
        :class="{'bold-text': index === 0}"
        v-if="index < countAtDates"
      >
      {{date}}<span v-if="index !== countAtDates - 2">,</span>
      </span>
    </div>
    <div>
      <div 
        :key="time.id" 
        v-for="time in startTimes"
      >
        <span v-html="`<span class='bold-text'>${time.start.HH}:${time.start.mm}</span>`"></span>
        <span v-html="time.endTime ? ` to  <span class='bold-text'>${time.end.HH}:${time.end.mm}</span> every <span class='bold-text'>${time.every.val} ${time.every.units === 'mm' ? 'min' : 'h'}</span>`: ''"></span>
      </div>
    </div>
    <div v-html="endDateComp"></div>
    <div  v-html="previewTexts.reccuring"></div>
  </div>
</template>

<script>
import moment from 'moment';
import later from "later";


export default {
  data() {
    return {
      countAtDates: 16
    }
  },
  props: {
    index: {
      type: Number,
    },
    color: {
      type: String,
      default: null,
    },
    eventName: {
      type: String,
      default: null
    },
    previewTexts: {
      type: Object,
      default: () => ({
        reccuring: ''
      })
    },
    startTimes: {
      type: Array,
      default: () => []
    },
    endDate: {
      type: Object,
      default: null
    },
    startDate: {
      type: String,
      default: '',
    },
    isReccuring: {
      type: Boolean,
      default: false
    },
    expressions: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    doEditable() {
      this.$emit('do-editable', this.index);
    },
  },
  computed: {
    endDateComp() {
      if (!this.isReccuring) return '';
      return this.endDate.noEnd ? 'Reccuring <span class="bold-text">no end</span>' : ` till <span class="bold-text">${moment(this.endDate.date).format('ll')}</span>`;
    },
    startsAt() {
      const startDate = new Date(moment(this.startDate).format('YYYY-MM-DD'));
      const endDate = this.endDate.noEnd ? undefined : new Date(moment(this.endDate.date).format('YYYY-MM-DD'));
      return [].concat(...this.expressions.map(item => later.schedule(later.parse.cron(item)).next(this.countAtDates + 1, startDate, endDate))).map(item => moment(item).format('L'));
    }
  }
};
</script>

<style lang="scss" scoped>
.schedule-event-preview {
  border-radius: 4px 0 4px 4px;
  background-color: #fafafa;
  width: 100%;
  padding: 32px 25px 32px 16px;
  display: flex;
  font-size: 14px;

  &__circle {
    content: '';
    width: 20px;
    height: 20px;
    display: inline-block;
    border-radius: 50%;
  }

  &__content {
    padding-left: 16px;
  }
}
</style>
