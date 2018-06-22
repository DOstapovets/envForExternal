<template>
  <div class="schedule-event-preview" @click="doEditable">
    <span 
      class="schedule-event-preview__circle"
      :style="{background: color}"
    ></span>
    <div class="schedule-event-preview__content">
      {{eventName}}
    </div>
  </div>
</template>

<script>
export default {
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
    }
  },
  methods: {
    doEditable() {
      this.$emit('do-editable', this.index);
    },
  },
};
</script>

<style lang="scss" scoped>
.schedule-event-preview {
  border-radius: 4px 0 4px 4px;
  background-color: #fafafa;
  width: 100%;
  padding: 32px 25px 32px 16px;
  display: flex;

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
