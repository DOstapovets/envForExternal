// import Vue from 'vue';

import { storiesOf } from '@storybook/vue';
// import { action } from '@storybook/addon-actions';
// import _ from 'lodash';

/* eslint-disable */

import PairedEditor, { data as schemaData } from './src/editor/editor.vue';
import ValidationStep from '../../helpers/Validation.vue';
import Vue from 'vue';
// Vue.localStorage.set('schema', JSON.stringify(schema()));

// console.log('data', schema());

/* eslint-enable */

storiesOf('Paired', module)
  .add('Default', () => ({
    data() {
      return {
        schema: JSON.parse(Vue.localStorage.get('schema')) || schemaData(),
        invalid: false,
      };
    },
    created() {
      console.log('this.schema', this.schema);
    },
    watch: {
      schema: {
        handler(newSchema) {
          Vue.localStorage.set('schema', JSON.stringify(newSchema));
          console.log('newSchema', newSchema);
        },
        deep: true,
      },
    },
    methods: {
      stepValidation(newValue) {
        this.invalid = newValue.$invalid;
        // console.log('$v$v$v', newValue);
      }
    },
    components: { PairedEditor, ValidationStep },
    template: `
    <div>
    <validation-step
      :invalid="invalid"
    >
      <paired-editor
        :schema.sync="schema"
        @step-validation="stepValidation"
      ></paired-editor>
    </validation-step>
    </div>
  `,
  }));