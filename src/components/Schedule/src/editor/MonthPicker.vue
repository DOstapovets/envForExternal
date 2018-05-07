<template>
  <div class="month-picker">
    <button
      :disabled="disabled"
      v-for="month in months"
      :key="month.label"
      :class="['month-picker-item', { 'is-active': value.includes(month.index), 'disabled': disabled }]"
      v-on:click="onMonthClick(month)"
    >
      {{ month.label }}
    </button>
  </div>
</template>


<script>
export default {
  data() {
    return {
      months: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ].map((label, index) => ({ label, index: index + 1 })),
    };
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onMonthClick(newMonth) {
      this.$emit('input', this.getNewValue(newMonth));
    },

    getNewValue(newMonth) {
      const newArray = this.value.slice();
      const arrIndex = newArray.indexOf(newMonth.index);

      if (arrIndex === -1) {
        newArray.push(newMonth.index);
      } else {
        newArray.splice(arrIndex, 1);
      }

      return newArray;
    },
  },
};
</script>

<style lang="scss">
.month-picker {
  width: 201px;
  height: 136px;
  margin: 10px 0 0 0;
  padding-top: 1px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  background-color: #e3e3e3;
  border-radius: 4px;

  .month-picker-item {
    height: 44px;
    width: 49px;
    padding: 0;
    border: none;
    background-color: #fafafa;
    color: #0f232e;
    font-size: 13px;

    &:nth-child(1) {
      border-top-left-radius: 3px;
    }

    &:nth-child(4) {
      border-top-right-radius: 3px;
    }

    &:nth-child(9) {
      border-bottom-left-radius: 3px;
    }

    &:nth-child(12) {
      border-bottom-right-radius: 3px;
    }

    &:hover {
      background-color: #e3e3e3;
    }

    &.disabled:hover {
      background-color: #fafafa;
    }

    &.is-active {
      background-color: #64b2da !important;
      color: white !important;
    }
  }
}
</style>
