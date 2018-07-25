<template>
  <div>
    <div class="paired-component-wrapper">
        <div v-if="template.isHeader">
          <h3 style="padding-left: 10px;">{{template.title}}</h3>
          <div v-if="!variables||!variables.length" class="empty-list">Your variables list is empty.</div>
          <or-list style="margin: 10px;" v-model="variables"
            ref="variablesOrList"
            :steps="steps"
            :step-id="stepId"
            :readonly="readonly"
            :new-item-method="newVariable"
            :add-button-label="template.btn_label"
            class="variables-list"
            dragMode="false"
            :can-remove-last-item="false"
            >
            <template slot-scope="item">
                <item @remove-item="removeItem(item.index)" :variable-name.sync="item.item.variableName"
                :variable-value.sync="item.item.variableValue"
                :value-type.sync="item.item.valueType"
                :variable-code.sync="item.item.variableCode"
                :variable-is-code.sync="item.item.isCode"
                :steps="item.steps"
                :step-id="item.stepId"
                :readonly="item.readonly"
                :$v="$v.schema.variables.$each[item.index]"
                ></item>
            </template>
            </or-list>
        </div>

        <or-collapsible v-else :title="template.title||'Header'">
            <div v-if="!variables||!variables.length" class="empty-list">Your variables list is empty.</div>
              <or-list v-model="variables"
              ref="variablesOrList"
              :steps="steps"
              :step-id="stepId"
              :readonly="readonly"
              :new-item-method="newVariable"
              :add-button-label="template.btn_label"
              class="variables-list"
              dragMode="false"
              :can-remove-last-item="false"
              >
            <template slot-scope="item">
                <item @remove-item="removeItem(item.index)" :variable-name.sync="item.item.variableName"
                :variable-value.sync="item.item.variableValue"
                :value-type.sync="item.item.valueType"
                :variable-code.sync="item.item.variableCode"
                :variable-is-code.sync="item.item.isCode"
                :steps="item.steps"
                :step-id="item.stepId"
                :readonly="item.readonly"
                :$v="$v.schema.variables.$each[item.index]"
                ></item>
            </template>
            </or-list>
        </or-collapsible>
    </div>
  </div>

</template>
<script>
import * as _ from "lodash";

//import { validators } from "../../../../../validators.js";
import { validators } from "_validators";
import email from "./email.vue";
import password from "./password.vue";
import item from "./item.vue";

const { required, generateValidators, minValue } = validators;

export const validator = template => {
  return {
    variables: {
      $each: {
        variableName: {
          custom(value) {
            return validators.jsExpressionNonEmptyString(value);
          }
        },
        variableValue: {
          custom(value) {
            return validators.jsExpressionNonEmptyString(value);
          }
        },
        variableCode: {
          custom(value){
            return validators.jsExpression(value);
          }
        }
      }
    }
  };
};
export const data = template => ({
  variables: [],
  title: template.title,
  isHeader: template.isHeader,
  btn_label:template.btn_label
});

export default {
  props: {
    template: {
      type: Object,
      default: () => ({})
    },
    schema: {
      type: Object,
      default: () => ({})
    },
    step: null,
    stepId: null,
    steps: null,
    readonly: null
  },
  computed: {},
  watch: {
    variables: {
      handler(newValue) {
        //_.map(newValue,(el)=>(el.isCode)?`${el.variableCode}`||`{}`:{[`[${el.variableName}]`]:`${el.variableValue}`})
        this.schema.variables = newValue;
      },
      deep: true
    }
    // $v: {
    //   handler(newValue) {
    //     this.$emit("step-validation", newValue);
    //   },
    //   deep: true
    // }
  },
  methods: {
    removeItem(index) {
      this.$refs.variablesOrList.removeItem(index);
    },
    newVariable() {
      return {
        variableName: "``",
        variableValue: "``",
        valueType: "string",
        isCode: false,
        variableCode: "{}"
      };
    }
  },
  components: { email, password, item },
  validations() {
    return { schema: validator(this.template) };
  },
  mounted() {
    this.variables = _.cloneDeep(this.schema.variables);
  },
  data() {
    return {
      variables: []
    };
  }
};

export const meta = {
  name: "test-external-component",
  type: "onereach-studio-form-editor",
  version: "1.0"
};
</script>
<style lang="scss" rel="stylesheet/scss">
@import "../scss/colors.scss";

.paired-component-wrapper {
  background-color: #f6f6f6;
  .empty-list {
    color: #91969d;
    font-size: 12px;
    line-height: 18px;
    padding-left: 20px;
  }

  .variables-list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    .or-list-items {
      width: 100%;
    }

    > button.ui-button.ui-button--type-secondary.ui-button--color-primary {
      height: 30px;
      margin: 30px auto 0;
      border-radius: 6px;
      background-color: #64b2da;
      color: #ffffff;
      font-size: 14px;
      line-height: 14px;
    }

    &.or-list {
      .list-item {
        position: relative;
        margin-bottom: 10px;
        border-radius: 3px;
        padding: 10px;
        padding-top: 0px;
        background-color: #fff;

        > .remove-button {
          display: none;
        }

        .handle,
        .sortable-handle {
          //display: none;
          align-self: flex-start;
          margin-top: 2.6rem;
        }
      }
    }
  }
  .or-text-expression__inline {
      display: flex;
      flex-direction: row-reverse;
      border-radius: 3px;
      border: 1px solid #dfdfdf;
      .header {
        background-color: #f6f6f6;
        width: 30px;

        .ui-icon-button.add-variable {
          display: block;
          width: 30px;
          filter: grayscale(1) opacity(100%) saturate(250%);
        }
        .ui-icon-button.js-mode-btn {
          display: none;
        }
      }

      .input-wrapper {
        width: calc(100% - 30px);

        .or-editable-wrapper {
          border: none;
        }
      }
      &.invalid,
      &.invalid-char-length {
        border-color: #f95d5d;
      }
    }
  .variable {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    &_error {
      display: flex;
      color: #f95d5d;
      font-size: 12px;
      width: 100%;

      &__name {
        width: calc(50% - 16px);
        padding-right: 3px;
      }
      &__value {
        width: calc(50% - 16px);
      }
    }
    &__code {
      margin: 20px 0px 0px 0px;
      width: calc(100% - 32px);
    }
    &__btn {
      margin-bottom: 3px;
    }
    &__name {
      width: calc(50% - 16px);
      padding-right: 3px;
      display: flex;
      align-items: flex-end;
      .or-text-expression {
        width: 100%;
      }
    }

    .ui-select,
    .or-text-expression,
    .ui-textbox {
      margin-bottom: 0;
    }



    &__value {
      width: calc(50% - 16px);

      .input-wrapper {
        position: relative;
        display: flex;

        .or-editable-wrapper {
          display: flex;
          width: 1px;
          flex-grow: 1;

          .placeholder {
            position: absolute;
            margin-top: 0;
          }

          .editable {
            width: 100%;
          }

          .merge-tag input {
            text-overflow: ellipsis;
          }
        }

        .or-code {
          width: 100%;
        }
      }

      .ui-select {
        &__dropdown {
          top: 100%;
          right: 0;
          width: auto;
          min-width: auto;
        }

        &__options {
          min-width: auto;
        }
      }

      .or-text-expression.invalid .or-code .ace-wrapper {
        border-color: #f95d5d;
      }

      .ui-select__label {
        display: flex;
        justify-content: flex-end;
      }

      .ui-select .ui-select__content .ui-select__label .ui-select__display {
        width: auto;
        padding: 2px 0 2px 10px;
        border: 0;
        background: transparent;
        color: #64b2da;
      }

      .ui-select__display-value {
        flex-grow: 0;
      }

      .ui-select .ui-select__content .ui-select__label .ui-select__label-text {
        white-space: nowrap;
        font-size: 14px;
      }

      .ui-select.has-label .ui-select__dropdown-button {
        top: 0px;
        font-size: 20px;
        margin-top: 2px;
      }

      .ui-radio-group {
        &__label-text {
          display: flex;
          align-items: center;
          flex-grow: 1;
          font-size: 12px;
          line-height: 36px;
          color: rgb(145, 150, 157);
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        &__radio {
          &:not(:first-child) {
            margin-left: 10px;
          }
        }

        &__radios {
          position: relative;
        }

        &:not(.is-disabled):not(.is-invalid):hover .ui-radio-group__label-text,
        &:not(.is-disabled):not(.is-invalid).is-active
          .ui-radio-group__label-text {
          color: #91969d;
        }
      }

      .ui-radio .ui-radio__label-text {
        font-size: 14px;
        line-height: 24px;
      }

      .ui-radio-group__radios {
        display: flex; /*  */
        justify-content: left;
        height: 38px;
        font-size: 14px;
        border-radius: 3px;
        padding: 7px 10px;
        background: #f6f6f6;
      }
    }
  }

  .value-type-helper {
    display: block;
    color: rgba(0, 0, 0, 0.38);
    line-height: 1.2;
    font-size: 12px;
  }
}
</style>
