<template>
  <div class="schedule-event-preview" @click="doEditable">preview</div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
    },
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
}
</style>
