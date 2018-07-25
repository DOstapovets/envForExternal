<template>
  <div class="variable">
    <or-code
    :fullScreen="false"
    class="variable__code"
    v-if="variableIsCodeLocal"
    @input="$v.$touch()"
    :invalid="$v.variableCode.$error"
    v-model="variableCodeLocal">
  </or-code>
    <div v-else class="variable__name">
     <or-text-expression
    class="or-text-expression__inline"
     v-model="variableNameLocal"
      :readonly="readonly"
      placeholder="Name"
      :invalid="$v.variableName.$error"
      @input="$v.$touch()"
      :steps="steps"
      :step-id="stepId"
      ></or-text-expression>
    </div>
    <div v-if="!variableIsCodeLocal" class="variable__value">
      <or-select
      :disabled="readonly"
      :options="variableTypeOptions"
      v-model="valueTypeLocal"
      ></or-select>
      <or-text-expression v-if="valueTypeLocal !== 'boolean'"
          class="or-text-expression__inline"
          v-model="variableValueLocal"
          :invalid="$v.variableValue.$error"
          @input="$v.$touch()"
          :readonly="readonly || isNull"
          placeholder="Value"
          :steps="steps"
          :step-id="stepId"
          ></or-text-expression>
      <or-radio-group v-else
        :disabled="readonly"
        :options="[true, false]"
        v-model="variableValueLocal"
      ></or-radio-group>
  </div>

  <or-icon-button :style="{'align-self':(variableIsCodeLocal)?'center':'flex-end'}" type="secondary" class="variable__btn" has-dropdown icon="more_vert" ref="dropdownButton" size="small">
        <or-menu
        contain-focus
        has-icons
        @select="selectOptions"
        slot="dropdown"
        :options="menuOptions"
        @close="$refs.dropdownButton.closeDropdown()"
        ></or-menu>
      </or-icon-button>
  <div class="variable_error">
    <div class="variable_error__name">
        <span v-if="!variableIsCodeLocal&&$v.variableName.$error">{{errorText}}</span>
        <span v-if="variableIsCodeLocal&&$v.variableName.$error">{{errorCodeReq}}</span>
    </div>
    <div class="variable_error__value">
        <span v-if="!variableIsCodeLocal&&$v.variableValue.$error">{{valueErrorText}}</span>
    </div>
  </div>
</div>
</template>

<script>
import * as _ from "lodash";

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
      defaut: "{}"
    },
    steps: "",
    stepId: "",
    readonly: {
      type: Boolean,
      default: false
    },
    $v:null
  },

  computed: {
    isNull() {
      return this.valueTypeLocal === "null";
    },
    menuOptions(){return [
        {
          label: (this.variableIsCodeLocal)?"UI mode":"Code mode",
          icon: "code",
          event: "code_mode"
        },
        {
          label: "Delete",
          icon: "delete_forever",
          event: "delete_item"
        }
      ]},
    variableCodeLocal: {
      get() {
        return this.variableCode;
      },
      set(newValue) {
        this.$emit("update:variableCode", newValue);
      }
    },
    variableIsCodeLocal: {
      get() {
        return this.variableIsCode;
      },
      set(newValue) {
        this.$emit("update:variableIsCode", newValue);
      }
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
      errorText: "The Name is required.",
      valueErrorText: "The Value is required.",
      errorCodeReq:"The Code is required.",
      isTextInput: true,
      optionsDataOut: [],
    };
  },

  methods: {
    selectOptions(value) {
      switch (value.event) {
        case "delete_item":
          this.$emit("remove-item");
          break;
        case "code_mode":
          this.variableIsCodeLocal=!this.variableIsCodeLocal;
          break;
      }
    }
  },

  mounted() {
    this.optionsDataOut = _.map(this.steps, step => step.data.dataOut);
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
