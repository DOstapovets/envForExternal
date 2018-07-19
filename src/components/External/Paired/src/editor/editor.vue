<template>
    <div class="paired-component-wrapper">
        <or-collapsible title="Variables">
            <div v-if="!variables.length" class="empty-list">Your variables list is empty.</div>
            <or-list v-model="variables" 
            ref="variablesOrList"
            :steps="steps" 
            :step-id="stepId" 
            :readonly="readonly"
            :new-item-method="newVariable"
            :add-button-label="'Add new variable'"
            class="variables-list"
            prettifyDrag
            :can-remove-last-item="false"
            >
            <template scope="item">
                <item :variable-name.sync="item.item.variableName"
                :variable-value.sync="item.item.variableValue"
                :value-type.sync="item.item.valueType"
                :variables="variables"
                :steps="item.steps" 
                :step-id="item.stepId"
                :readonly="item.readonly"
                ></item>
            </template>
            </or-list>
        </or-collapsible>    
    </div>
</template>
<script>
import * as _ from "lodash";
import { validators } from '../../../../../validators.js';

//import { validators } from "_validators";
import email from "./email.vue";
import password from "./password.vue";
import item from "./item.vue";

const { required, jsExpressionNonEmptyString, generateValidators } = validators;

export default {
  name: "editor-test-example",
  props: ["template", "schema", "step", "stepId", "steps", "readonly"],
  components: { email, password, item },
  watch: {
    variables: {
      handler(newValue) {
        this.$emit("input", newValue);
      },
      deep: true
    }
  },

  data() {
    return {
      variables: this.schema.value || [],
      oldVariables: [],
      newVariable() {
        return {
          variableName: "",
          variableValue: "``",
          valueType: "string"
        };
      }
    };
  },

  mounted() {
    if (this.variables && this.$refs.variablesOrList && !this.variables.length)
      this.$refs.variablesOrList.addItem();

    this.oldVariables = _.cloneDeep(this.variables);
  }
};

export const data = template => ({
  value: template.value
});

export const validator = template => {
  return {
    email: generateValidators(template.validateRequired, { required }),
    password: generateValidators(template.validateRequired, { required })
  };
};

export const meta = {
  name: "test-external-component",
  type: "onereach-studio-form-editor",
  version: "1.0"
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "../scss/colors.scss";
</style>


<style lang="scss" rel="stylesheet/scss">
@import "../scss/colors.scss";

.paired-component-wrapper {
  background-color: #f6f6f6;
  .empty-list {
    color: #91969d;
    font-size: 12px;
    line-height: 18px;
  }

  .variables-list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 30px;

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
        width: 50%;
        padding-right: 3px;
      }
      &__value {
        width: 50%;
      }
    }
    &__name {
      width: 50%;
      padding-right: 3px;
      display: flex;
      align-items: flex-end;
      .or-select-expression {
        width: 100%;
        .ui-select__content .ui-select__label .ui-select__display {
          min-height: 38px;
        }
      }
    }

    .ui-select,
    .or-text-expression,
    .ui-textbox {
      margin-bottom: 0;
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

    &__value {
      width: 50%;

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
