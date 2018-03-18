export default {
  name: 'TemplateEmitter',
  props: {
    value: null,
    renderFunction: Function,
    data: Object,
  },
  render(h) {
    return h(
      'div',
      { attrs: { style: 'display: none' }, ref: 'root' },
      this.renderFunction(this.data),
    );
  },
  watch: {
    data: {
      handler(newDate) {
        if (newDate) {
          this.$emit('input', this.$refs.root);
        } else {
          this.$emit('input', '');
        }
      },
    },
  },
  mounted() {
    if (this.data) {
      this.$emit('input', this.$refs.root);
    } else {
      this.$emit('input', '');
    }
  },
};
