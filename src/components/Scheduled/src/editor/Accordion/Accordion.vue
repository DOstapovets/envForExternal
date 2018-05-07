<template>
    <div>
        <div >
            <ul class="accordion" >
                <li class="accordion__item"  :key="index" v-for="(slot, index) in slots">
                    <div class="accordion__wr-content" @click="openItem(index)">
                        <span class="accordion__title" :class="{'active' : openedItem === index, 'disabled': openedItem && openedItem !== index}">
                            {{slot[0].data.attrs.titleItem}}
                        </span>
                        <div v-if="openedItem === index" class="accordion__slot">
                            <slot :name="index"></slot>
                        </div>
                        <span v-if="!openedItem" class="accordion__placeholder">
                            {{slot[0].data.attrs.placeholderItem}}
                        </span>
                    </div>
                    <div v-if="openedItem === index" class="accordion__close-item" @click="deleteItem">
                        <or-icon  icon="clear"></or-icon>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
/* eslint-enable */

export default {
  data() {
    return {
      slots: this.$slots,
      openedItem: null,
    };
  },
  props: {},
  methods: {
    deleteItem() {
      this.openedItem = null;
    },
    openItem(index) {
      if (this.openedItem) return;
      this.openedItem = index;
    },
  },
  created() {
    console.log(this.slots);
  },
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
}

.accordion__title {
  color: #0f232e;
  font-size: 14px;
  line-height: 16px;
  width: 115px;
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
