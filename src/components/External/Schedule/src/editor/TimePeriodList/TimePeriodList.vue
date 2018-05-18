<template>
  <div>
    <or-list class="list-time" drag-handle-right v-model="times" add-button-label="Add Time" :new-item-method="listNewItemTime">
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
      };
    },
  },
  components: {
    TimePeriodItem,
  },
};
</script>

<style lang="scss" scoped>

</style>
