// import Vue from 'vue';

import { storiesOf } from "@storybook/vue";
import { action } from "@storybook/addon-actions";
// import _ from 'lodash';

/* eslint-disable */

import TestEditor, { data as schemaData } from "./src/editor/editor.vue";
import { data as inputData } from "./src/input/input.vue";
import ValidationStep from "../../helpers/Validation.vue";
import Vue from "vue";
// Vue.localStorage.set('schema', JSON.stringify(schema()));

// console.log('data', schema());
/* eslint-enable */

storiesOf("Test", module).add("Default", () => ({
  data() {
    return {
      schema: JSON.parse(Vue.localStorage.get("schema")) || schemaData(),
      template: inputData,
      invalid: false
    };
  },
  watch: {
    schema: {
      handler(newSchema) {
        Vue.localStorage.set("schema", JSON.stringify(newSchema));
        action("schema")(newSchema);
      },
      deep: true
    }
  },
  methods: {
    stepValidation(newValue) {
      this.invalid = newValue.$invalid;
    }
  },
  components: { TestEditor, ValidationStep },
  template: `
    <div>
    <validation-step
      :invalid="invalid"
    >
      <test-editor
        :schema.sync="schema"
        :template.sync="template"
        @step-validation="stepValidation"
      ></test-editor>
    </validation-step>
    </div>
  `
}));
