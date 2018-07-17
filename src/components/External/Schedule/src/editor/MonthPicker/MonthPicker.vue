<template>
  <div :class="['month-picker', {'month-picker_invalid': invalid}]">
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
    invalid: {
      type: Boolean,
      default: false,
    },
    $v: null,
  },
  methods: {
    onMonthClick(newMonth) {
      this.$emit('touch');
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
  margin: 10px 0 0 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  border-top: solid 1px #e3e3e3;
  border-left: solid 1px #e3e3e3;

  &_invalid {
    border: #f95d5d 1px solid;
  }
  .month-picker-item {
    height: 25px;
    width: 25%;
    padding: 0;
    border: none;
    border-right: solid 1px #e3e3e3;
    border-bottom: solid 1px #e3e3e3;
    background-color: #fafafa;
    color: #0f232e;
    font-size: 13px;

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
