<template>
  <div class="time-period-list">
    <or-list 
      class="list-time"
      drag-handle-right 
      v-model="times" 
      add-button-label="Add Time" 
      :new-item-method="listNewItemTime"
      :can-remove-last-item="false"
    >
        <template scope="item">
            <time-period-item
                :readonly="readonly"
                :start.sync="item.item.start"
                :endTime.sync="item.item.endTime"
                :every.sync="item.item.every"
                :end.sync="item.item.end"
            ></time-period-item>
        </template>
    </or-list>
  </div>
</template>

<script>
// import uuidv4 from 'uuid/v4';
/* eslint-disable */
import TimePeriodItem from '../TimePeriodItem/TimePeriodItem.vue';
/* eslint-enable */

export default {
  props: {
    times: {
      type: Array,
      default() {
        return [];
      },
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    listNewItemTime() {
      return {
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
        vforkey: uuid.v4(),
      };
    },
  },
  components: {
    TimePeriodItem,
  },
};
</script>

<style lang="scss" scoped>
.time-period-list {
 margin-top: -12px; 
}
</style>
