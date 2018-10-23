<template>
  <div :class="['variable',(template.isIndicator)?'modern':'']" :style="{'border-color':($v.$error)?'#f95d5d':''}">
  <div class="flex-box" >
    <div class="variable__name">
      <div class="variable__header">
        <div class="label">{{template.nameLabel}}</div>
      </div>
      <!-- 'or-merge-tag-input' -->
      <component :is="template.nameType"
      class="or-text-expression__inline"
      v-model="variableNameLocal"
      :readonly="readonly"
      :placeholder="template.namePlaceholder"
      disable-code-mode
      :invalid="$v.name.$error"
      @input="$v.$touch()"
      :steps="steps"
      :step-id="stepId"></component>
      <div class="variable_error">
        <span v-if="$v.name.$error">{{errorText}}</span>
      </div>
    </div>
    <div v-html="template.delimiter" class="variable__delimiter">
    </div>
    <div v-if="variableIsCodeLocal&&template.codeMode" class="variable__value">
      <or-code
        adjustToHeight
        :steps="steps"
        :step-id="stepId"
        :readonly="readonly"
        :label="template.valueLabel"
        class="variable__code"
        @input="$v.$touch()"
        :invalid="$v.code.$error"
        v-model="variableCodeLocal">
      </or-code>
      <div class="variable_error">
        <span v-if="variableIsCodeLocal&&$v.code.$error">{{errorCodeReq}}</span>
      </div>
    </div>
    <div v-if="!variableIsCodeLocal" class="variable__value">
      <div class="variable__header">
        <div class="label">{{template.valueLabel}}</div>
        <or-select v-if="template.types"
        :disabled="readonly"
        :options="variableTypeOptions"
        v-model="valueTypeLocal"
        ></or-select>
      </div>
      <or-text-expression v-if="valueTypeLocal !== 'boolean'"
          class="or-text-expression__inline"
          v-model="variableValueLocal"
          disable-code-mode
          :invalid="$v.value.$error"
          @input="$v.$touch()"
          :readonly="readonly || isNull"
          :placeholder="template.valuePlaceholder"
          :steps="steps"
          :step-id="stepId"
          ></or-text-expression>
      <or-radio-group v-else
        :disabled="readonly"
        :options="[true, false]"
        v-model="variableValueLocal"
      ></or-radio-group>
      <div class="variable_error">
        <span v-if="!variableIsCodeLocal&&$v.value.$error">{{valueErrorText}}</span>
      </div>
  </div>

  <or-icon-button disableRipple type="secondary" class="variable__btn flat  " has-dropdown icon="more_vert" ref="dropdownButton" size="small">
        <or-menu
        contain-focus
        has-icons
        @select="selectOptions"
        slot="dropdown"
        :options="menuOptions"
        @close="$refs.dropdownButton.closeDropdown()"
        ></or-menu>
      </or-icon-button>
  </div>
</div>
</template>

<script>
import * as _ from "lodash";

export default {
  props: {
    variables: {
      type: Array,
      default: () => []
    },
    template: {
      type: Object,
      default: () => ({})
    },
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
    $v: {}
  },

  computed: {
    isNull() {
      return this.valueTypeLocal === "null";
    },
    menuOptions() {
      let menu = [
        {
          label: this.variableIsCodeLocal ? "UI mode" : "Code mode",
          icon: "code",
          event: "code_mode"
        },
        {
          label: "Delete",
          icon: "delete_forever",
          event: "delete_item",
          disabled: !(this.variables.length - 1)
        }
      ];
      if (!this.template.codeMode) menu.shift();
      return menu;
    },
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
      errorText: `The ${this.template.nameLabel} is required.`,
      valueErrorText: `The ${this.template.valueLabel} is required.`,
      errorCodeReq: "The Code is required."
    };
  },

  methods: {
    selectOptions(value) {
      switch (value.event) {
        case "delete_item":
          this.$emit("remove-item");
          break;
        case "code_mode":
          this.variableIsCodeLocal = !this.variableIsCodeLocal;
          break;
      }
      this.$nextTick(() => {
        this.$v.$touch();
      });
    }
  },

  mounted() {
    this.$v.$touch();
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
