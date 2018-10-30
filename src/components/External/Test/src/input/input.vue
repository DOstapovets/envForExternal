<template>
    <div class="paired-value-component-wrapper">
        <span class="label">{{label}} component</span>
        <div class="wrapper" @click="openEditor">
            <editor :template="input.data"
                    :schema="defaultStep.data"
                    :step="defaultStep"
                    :steps="[defaultStep]"
                    :readonly="true">
            </editor>
        </div>
        <or-button disableRipple color="primary" @click="$refs.configModal.open()" type="secondary" class="flat">Settings</or-button>

        <or-modal ref="configName" :remove-close-button="true"
                  title="Configure component"
                  class="input-message-settings"
                  :contain-focus="false">
          <or-textbox name="name" label="Label" placeholder="Enter name label"
            v-model="input.data.nameLabel">
          </or-textbox>
          <or-textbox name="name" label="Placeholder" placeholder="Enter value placeholder"
            v-model="input.data.namePlaceholder">
          </or-textbox>
          <or-select label="Field component" :options="types" v-model="input.data.nameType"></or-select>
          <div slot="footer">
            <or-button color="primary"
              type="secondary"
              @click.prevent="$refs.configName.close()">
              Close
            </or-button>
          </div>
        </or-modal>
        <or-modal ref="configValue" :remove-close-button="true"
                  title="Configure component"
                  class="input-message-settings"
                  :contain-focus="false">
             <or-textbox name="name" label="Label" placeholder="Enter name label"
                v-model="input.data.valueLabel">
              </or-textbox>
              <or-textbox name="name" label="Placeholder" placeholder="Enter value placeholder"
                v-model="input.data.valuePlaceholder">
              </or-textbox>
              <or-switch label="Enable Code Mode" v-model="input.data.codeMode"></or-switch>
              <or-switch label="Enable Types" v-model="input.data.types"></or-switch>
          <div slot="footer">
                <or-button color="primary"
                           type="secondary"
                           @click.prevent="$refs.configValue.close()">
                    Close
                </or-button>
            </div>
        </or-modal>

        <or-modal ref="configModal" :remove-close-button="true"
                  title="Configure Paired value component"
                  class="input-message-settings"
                  :contain-focus="false">

            <or-textbox name="label" label="Title" placeholder="Title text"
                        v-model="input.data.title">
            </or-textbox>
            <or-textbox name="label" label="variable" placeholder="List variable"
                        v-model="input.data.variable">
            </or-textbox>

            <div class="flex-box">
              <or-switch label="Use Collabsible" v-model="input.data.isCollabsible"></or-switch>
              <or-switch v-if="input.data.isCollabsible" label="Collabsible open by default" v-model="input.data.collapsibleOpen"></or-switch>
            </div>

            <or-textbox multi-line name="label" label="Delimiter" placeholder="Enter delimiter"
                        v-model="input.data.delimiter">
            </or-textbox>
            <or-switch label="Use Indicator" v-model="input.data.isIndicator"></or-switch>

            <or-textbox name="label" label="Button label" placeholder="Enter button label"
                        v-model="input.data.btn_label">
            </or-textbox>


            <div slot="footer">
                <or-button color="primary"
                           type="secondary"
                           @click.prevent="$refs.configModal.close()">
                    Close
                </or-button>
            </div>
        </or-modal>
    </div>
</template>

<script>
import _ from "lodash";
import base from "@default/src/inputs/_design_base.vue";
import editor from "../editor/editor.vue";

export default {
  extends: base,
  data() {
    return {
      label,
      types: [
        {
          label: "Textbox",
          value: "or-textbox"
        },
        {
          label: "Text Expression",
          value: "or-text-expression"
        },
        {
          label: "MergeTag Input",
          value: "or-merge-tag-input"
        }
      ]
    };
  },
  components: {
    editor
  },
  methods: {
    openEditor(event) {
      if (event.target.closest("div.variable__name"))
        this.$refs.configName.open();
      if (event.target.closest("div.variable__value"))
        this.$refs.configValue.open();
    }
  },
  defaultValue() {
    return _.cloneDeep(data);
  }
};

export const label = "Paired value";
export const data = {
  title: "Variables",
  nameLabel: "Name",
  namePlaceholder: "Name",
  nameType: "or-text-expression",
  valueLabel: "Value",
  valuePlaceholder: "Value",
  isCollabsible: true,
  codeMode: true,
  types: true,
  btn_label: "Add new variable",
  collapsibleOpen: false,
  isIndicator: true,
  variable: "variables",
  delimiter: ""
};

export const meta = {
  name: "test-external-component",
  type: "onereach-studio-form-input",
  version: "1.0"
};
</script>

<style lang="scss">
.paired-value-component-wrapper {
  span.label {
    padding: 10px;
  }
  padding: 20px;
  width: 100%;
  .flex-box {
    width: 100%;
    display: flex;
    & > * {
      flex-grow: 1;
    }
  }
  .variable__name,
  .variable__value {
    border: 1px dashed #aaa;
  }
  .variable__btn {
    display: none;
  }
}
</style>
