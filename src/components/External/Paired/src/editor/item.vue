<template>
    <div class="variable">
  <div class="variable__name">
    <or-select-expression v-model="variableNameLocal"
      :readonly="readonly"
      placeholder="Name"
      hasSearch
      extendableOptions
      :steps="steps" 
      :step-id="stepId"
      :options.sync="optionsDataOut"
      ></or-select-expression>
  </div>
  <div class="variable__value">
    <or-select
      v-if="isTextInput"
      ref="valueTypeSelect"
      :disabled="readonly"
      :options="variableTypeOptions"
      v-model="valueTypeLocal"
    ></or-select>
    <or-text-expression v-if="valueTypeLocal !== 'boolean'"
        ref="variableValueInput"
        class="or-text-expression__inline"
        v-model="variableValueLocal"
        :readonly="readonly || isNull"
        placeholder="Value"
        :steps="steps" 
        :step-id="stepId"
        ></or-text-expression>
    <or-radio-group v-else
      name="Value bool radio"
      :disabled="readonly"
      :options="[true, false]"
      v-model="variableValueLocal"
    ></or-radio-group>
  </div>
  <div class="variable_error">
    <div class="variable_error__name">
        <!-- <span v-if="isInvalidVariableName">{{errorText}}</span> -->
    </div>
    <div class="variable_error__value">
        <!-- <span v-if="isInvalidVariableValue">{{valueErrorText}}</span> -->
    </div>
  </div>
</div>
</template>

<script>
import * as _ from "lodash";
import { validators } from '../../../../../validators.js';
//import { validators } from "_validators";

export default {
  props: {
    variableName: {
      type: String,
      default: ""
    },
    variableValue: {
      default: "``"
    },
    valueType: {
      type: String,
      default: "string"
    },
    variableIsCode: {
      type: Boolean,
      defaut: false
    },
    variableCode: {
      type: String,
      defaut: "``"
    },
    variables: {
      type: Array,
      default() {
        return [];
      }
    },
    steps: "",
    stepId: "",
    readonly: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    isNull() {
      return this.valueTypeLocal === "null";
    },
    variableNameLocal: {
      get() {
        return this.variableName;
      },
      set(newValue) {
        this.$emit("update:variableName", newValue);
      }
    },
    variableValueLocal: {
      get() {
        return this.variableValue;
      },
      set(newValue) {
        this.$emit("update:variableValue", newValue);
      }
    },
    valueTypeLocal: {
      get() {
        return this.valueType;
      },

      set(newValue) {
        switch (newValue) {
          case "string":
          case "number":
            this.variableValueLocal = "``";
            break;
          case "boolean":
            this.variableValueLocal = true;
            break;
          case "null":
            this.variableValueLocal = "`null`";
            break;
        }
        this.$emit("update:valueType", newValue);
      }
    }
  },

  data() {
    return {
      variableTypeOptions: ["string", "number", "boolean", "null"],
      isInvalidVariableName: false,
      isInvalidVariableValue: false,
      errorText: "Use another variable name.",
      valueErrorText: "The value is required.",
      isTextInput: true,
      optionsDataOut: []
    };
  },

  methods: {},

  mounted() {
    this.optionsDataOut= _.map(this.steps,step=>step.data.dataOut);
  }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "../scss/colors.scss";
@import "../scss/fonts.scss";
</style>

<style lang="scss" rel="stylesheet/scss">
@import "../scss/colors.scss";
</style>
