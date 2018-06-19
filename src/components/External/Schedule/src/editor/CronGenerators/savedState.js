export default {
    props: {
        isEditable: {
            type: Boolean,
            default: false
        },
        dataState: {
            type: String,
            default: '',
        },
    },
    watch: {
        dataState(newValue) {
            if (newValue === 'saved') {
                this.$emit('update:isEditable', false);
            }
        }
    },
}