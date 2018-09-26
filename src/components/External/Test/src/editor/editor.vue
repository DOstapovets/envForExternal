<template>
  <div>
    <div class="paired-component-wrapper">
        <div v-if="!template.isCollabsible">
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
                <item @remove-item="removeItem(item.index)"
                :template.sync="template"
                :variable-name.sync="item.item.name"
                :variable-value.sync="item.item.value"
                :value-type.sync="item.item.type"
                :variable-code.sync="item.item.code"
                :variable-is-code.sync="item.item.isCode"
                :steps="item.steps"
                :step-id="item.stepId"
                :readonly="item.readonly"
                :$v="$v.schema.variables.$each[item.index]"
                ></item>
            </template>
            </or-list>
        </div>

        <or-collapsible :open="template.collapsibleOpen" invalid="$v.schema.variables.$error" v-else :title="template.title||'Header'">
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
                <item @remove-item="removeItem(item.index)"
                :variable-name.sync="item.item.name"
                :variable-value.sync="item.item.value"
                :value-type.sync="item.item.type"
                :variable-code.sync="item.item.code"
                :variable-is-code.sync="item.item.isCode"
                :template.sync="template"
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
import item from "./item.vue";

const { required, generateValidators, minValue } = validators;

export const validator = template => {
  return {
    variables: {
      $each: {
        name: {
          custom(value, ctx) {
            return (
              value != "this.get('')" ||
              validators.jsExpressionNonEmptyString(value)
            );
          }
        },
        value: {
          custom(value, ctx) {
            return ctx.isCode || validators.jsExpressionNonEmptyString(value);
          }
        },
        code: {
          custom(value, ctx) {
            return !ctx.isCode || validators.jsExpression(value);
          }
        }
      }
    }
  };
};
export const data = template => ({
  variables: []
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
  computed: {
    variableComp() {
      return this.variables;
    }
  },
  watch: {
    variables: {
      handler(newValue) {
        newValue.forEach(el => {
          delete el.vforkey;
          if (!this.template.types) delete el.type;
          if (!this.template.types) {
            delete el.isCode;
            delete el.code;
          }
        });
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
        name: this.template.nameType == "or-text-expression" ? "``" : "",
        value: "``",
        type: "string",
        isCode: false,
        code: "{}"
      };
    }
  },
  components: { item },
  validations() {
    return { schema: validator(this.template) };
  },
  mounted() {
    if (this.schema.variables.length) {
      this.variables = _.cloneDeep(this.schema.variables);
    } else {
      this.variables.push(this.newVariable());
    }
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
  //
  .empty-list {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #91969d;
    font-size: 14px;
    height: 75px;
    padding-left: 20px;
  }
  .or-collapsible__description {
    display: none;
  }

  .variables-list {
    display: flex;
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
        padding: 0;
        > .remove-button {
          display: none;
        }
      }
    }
  }
  .or-text-expression__inline {
    width: 100%;
    position: relative;
    margin: 0;
    flex-direction: row-reverse;

    .header {
      position: absolute;
      right: 0;
      z-index: 2;
    }
    .input-wrapper {
      width: 100%;
    }
    .or-editable-wrapper {
      height: 37px;
    }
  }
  .modern {
    background-color: #f6f6f6;
    border-left: 3px solid #7ed321;
    border-radius: 3px;
    margin-bottom: 10px;
    padding-bottom: 15px;
    padding-left: 10px;
  }
  .variable {
    display: flex;
    flex-direction: column;
    width: 100%;

    &_error {
      display: flex;
      color: #f95d5d;
      font-size: 12px;
      width: 100%;
    }
    &__header {
      display: flex;
      min-height: 36px;
      justify-content: space-between;
      .label {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        -ms-flex-positive: 1;
        flex-grow: 1;
        font-size: 12px;
        line-height: 1.3;
        color: #91969d;
        -webkit-transition: color 0.1s ease;
        -o-transition: color 0.1s ease;
        transition: color 0.1s ease;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }

    &__code {
      margin: 0;
    }
    &__btn {
      width: 24px;
      align-self: center;
    }
    &__name {
      width: calc(50% - 16px);
      padding-right: 3px;
      .or-text-expression {
        width: 100%;
      }
    }

    .ui-select,
    .or-text-expression,
    .ui-textbox {
      margin-bottom: 0;
    }

    &__delimiter {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 2.5px;
      margin-top: 25px;
    }

    &__value {
      width: calc(50% - 12px);

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
          justify-content: space-evenly !important;
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
  .flex-box {
    display: flex;
    width: 100%;
  }

  .value-type-helper {
    display: block;
    color: rgba(0, 0, 0, 0.38);
    line-height: 1.2;
    font-size: 12px;
  }
  .or-collapsible > .body-wrapper > .body {
    padding: 0 16px;
  }
}
</style>
