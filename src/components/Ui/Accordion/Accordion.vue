<template>
    <div>
        <div >
            <ul class="accordion" >
                <li class="accordion__item"  :key="index" v-for="(slot, index) in slots">
                    <div class="accordion__wr-content" @click="openItem(index)">
                        <span class="accordion__title" :class="{'active' : openedItemComp === index, 'disabled': openedItemComp && openedItemComp !== index}">
                            {{slot[0].data.attrs.titleItem}}
                        </span>
                        <div v-if="openedItemComp === index" class="accordion__slot">
                            <slot :name="index"></slot>
                        </div>
                        <span v-if="!openedItemComp" class="accordion__placeholder">
                            {{slot[0].data.attrs.placeholderItem}}
                        </span>
                    </div>
                    <div v-if="openedItemComp === index" class="accordion__close-item" @click="deleteItem">
                        <or-icon  icon="clear"></or-icon>
                    </div>
                </li>
            </ul>
        </div>
        <or-modal  :contain-focus="false" ref="deleteSettingsInAccordionItemConfirmation" title="Delete settings">
          Do you really want to delete the settings?
          <div slot="footer">
              <or-button color="red" @click="deleteSettingsInAccordionItem">Delete</or-button>
              <or-button color="primary" type="secondary" @click="closeModal('deleteSettingsInAccordionItemConfirmation')">Cancel</or-button>
          </div>
        </or-modal>
    </div>
</template>

<script>
/* eslint-disable */
/* eslint-enable */

export default {
  data() {
    return {
      slots: this.$slots,
    };
  },
  props: {
    openedItem: null,
    savedAccordionNumItem: {
      type: String,
      default: null,
    } 
  },
  methods: {
    openModal(ref) {
      this.$refs[ref].open();
    },
    closeModal(ref) {
      this.$refs[ref].close();
    },
    deleteItem() {
      if (this.savedAccordionNumItem) {
        this.openModal('deleteSettingsInAccordionItemConfirmation');
      } else {
        this.$emit('close-item', this.openedItemComp);
        this.openedItemComp = null;
      }

    },
    openItem(index) {
      this.$emit('do-editable', index);
      if (this.openedItemComp) return;
      this.$emit('opened-item', index);
      this.openedItemComp = index;
    },
    deleteSettingsInAccordionItem() {
      this.$emit('close-item', this.openedItemComp);
      this.openedItemComp = null;
      this.closeModal('deleteSettingsInAccordionItemConfirmation');
    }
  },
  computed: {
    openedItemComp: {
      get() {
        return this.openedItem;
      },
      set(newValue) {
        this.$emit('update:openedItem', newValue);
      }
    }
  }
  // created() {
  //   console.log(this.slots);
  // },
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
ul {
  list-style: none;
}

.accordion__item:not(:last-child) {
  border-bottom: #dfdfdf 1px solid;
}

.accordion__item {
  display: flex;
  justify-content: space-between;
}

.accordion__wr-content {
  padding: 12px 0;
  cursor: pointer;
  width: 100%;
}

.accordion__slot {
  display: inline-block;
  max-width: 276px;
}

.accordion__title {
  color: #0f232e;
  font-size: 14px;
  line-height: 16px;
  min-width: 100px;
  padding-right: 5px;
  display: inline-block;
  vertical-align: top;
}

.accordion__title.active {
  font-weight: bold;
}

.accordion__title.disabled {
  color: rgba(15, 35, 46, 0.55);
}

.accordion__placeholder {
  color: rgba(15, 35, 46, 0.55);
  font-size: 14px;
  line-height: 16px;
}

.accordion__close-item {
  padding-top: 12px;
}

.ui-icon {
  font-size: 12px;
  color: #8c9492;
  cursor: pointer;
}
</style>
