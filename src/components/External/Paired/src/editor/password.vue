<template>
    <div class="password-wrapper">
        <div class="password-input-section">
            <or-textbox v-model="displayValue" class="password-input"
                        :label="label"
                        :placeholder="placeholder"
                        :disabled="readonly"
                        @input="$v.schema.password.$touch()"
                        :invalid="$v.schema.password.$error"
                        error="Password is required">
            </or-textbox>
        </div>
    </div>
</template>
<script>
    import * as _ from 'lodash'

    export default {
        props    : ['schema', 'label', 'placeholder', 'readonly', '$v'],
        computed : {
            displayValue : {
                get () {
                    return _.get(this.schema, 'password', '');
                },
                set (newValue) {
                    this.schema.password = newValue;
                }
            }
        }
    }
</script>


<style scoped lang="scss" rel="stylesheet/scss">
    @import '../scss/colors.scss';
    @import '../scss/fonts.scss';
    .password-wrapper {
        .password-input-section {
            .password-input {

            }
        }
    }

</style>

<style lang="scss" rel="stylesheet/scss">
    @import '../scss/colors.scss';

</style>
