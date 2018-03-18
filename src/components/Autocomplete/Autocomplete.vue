<template>
  <div class="autocomplete" v-click-outside="blurAutocompleteValue">
    <input @input="inputSoughtValue" class="autocomplete__input" type="text"  v-model="soughtValue" @keydown.enter="selectElemByEnter()" @keydown.38.40="focusingElement"/>
    <ul ref="wrItems" class="autocomplete__result" v-show="items && items.length > 0 && isShowItems">
      <li :class="{'autocomplete__result-item_highlight': focusElemIndex === index}"  @click="selectElemByClick($event, item)" :key="item.id" v-for="(item, index) in items">
        <slot name="listItem" :item="item"></slot>
      </li>
    </ul>
    <template-emitter v-if="templateEmitterData" v-model="templateEmitterValue" :render-function="$scopedSlots.listItem" :data="templateEmitterData ? {'item': templateEmitterData} : null"></template-emitter>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside';
import TemplateEmitter from '../TemplateEmitter/TemplateEmitter';

export default {
  name: 'Autocomplete',
  data() {
    return {
      items: null,
      soughtValue: '',
      isShowItems: false,
      selectedValue: '',
      focusElemIndex: 0,
      templateEmitterData: this.defaultValue,
      templateEmitterValue: '',
    };
  },
  props: {
    getItems: Function,
    value: null,
    defaultValue: null,
    customizationInput: Function,
  },
  methods: {
    updateItems(text) {
      if (this.prevCallUpdateItems && this.prevCallUpdateItems.abort) {
        this.prevCallUpdateItems.abort();
      }
      this.prevCallUpdateItems = this.getItems(text);
      return this.prevCallUpdateItems.then(res => {
        this.items = res;
      });
    },
    blurAutocompleteValue() {
      if (this.selectedValue !== this.soughtValue) {
        this.soughtValue = '';
        this.$emit('input', null);
      }
      this.isShowItems = false;
    },
    inputSoughtValue() {
      this.updateItems(this.soughtValue).then(() => {
        this.isShowItems = true;
        this.focusElemIndex = 0;
      });
    },
    customizationInputLocal(choseItem, innerText) {
      const innerTextLoc = innerText || '';
      return this.customizationInput
        ? this.customizationInput(choseItem).toString()
        : innerTextLoc;
    },
    selectElem(item, itemText) {
      this.$emit('input', item);
      this.soughtValue = this.customizationInputLocal(item, itemText);
      this.isShowItems = false;
      this.selectedValue = this.soughtValue;
    },
    genTextDefValue() {
      if (this.defaultValue) {
        this.selectElem(
          this.defaultValue,
          this.templateEmitterValue.innerText.trim(),
        );
      }
    },
    selectElemByClick(e, selectedItem) {
      const itemTxt = e.target.innerText;
      this.selectElem(selectedItem, itemTxt);
    },
    selectElemByEnter() {
      this.templateEmitterData = this.items[this.focusElemIndex];
      const selectedItem = this.items[this.focusElemIndex];
      setTimeout(() => {
        this.selectElem(
          selectedItem,
          this.templateEmitterValue.innerText.trim(),
        );
      }, 0);
    },
    scrollForElems(key) {
      const itemsLen = this.items.length;
      if (!itemsLen) {
        return;
      }
      const wrItems = this.$refs.wrItems;
      const heightWrItems = parseInt(
        window.getComputedStyle(wrItems, null).height,
        10,
      );

      const heightOneElem =
        parseInt(
          window.getComputedStyle(wrItems.children[0], null).height,
          10,
        ) +
        parseInt(
          window.getComputedStyle(wrItems.children[0], null).paddingTop,
          10,
        ) +
        parseInt(
          window.getComputedStyle(wrItems.children[0], null).paddingBottom,
          10,
        );
      const heightAllElems = itemsLen * heightOneElem;
      const currHeight = (this.focusElemIndex + 1) * heightOneElem;

      if (this.focusElemIndex === itemsLen - 1) {
        wrItems.scrollTop = heightAllElems;
      } else if (this.focusElemIndex === 0) {
        wrItems.scrollTop = 0;
      } else if (
        currHeight < wrItems.scrollTop + heightOneElem ||
        currHeight > wrItems.scrollTop + heightWrItems
      ) {
        if (key === 'ArrowDown') {
          wrItems.scrollTop = currHeight - heightWrItems;
        } else if (key === 'ArrowUp') {
          wrItems.scrollTop = currHeight - heightOneElem;
        }
      }
    },

    focusingElement(e) {
      const itemsLen = this.items.length;
      if (e.key === 'ArrowDown') {
        this.focusElemIndex += 1;
        if (this.focusElemIndex >= itemsLen) {
          this.focusElemIndex = 0;
        }
      } else if (e.key === 'ArrowUp') {
        this.focusElemIndex -= 1;
        if (this.focusElemIndex < 0) {
          this.focusElemIndex = itemsLen - 1;
        }
      }
      this.scrollForElems(e.key);
    },
  },
  directives: {
    ClickOutside,
  },
  components: {
    TemplateEmitter,
  },
  created() {
    this.updateItems(this.soughtValue);
  },
  mounted() {
    this.genTextDefValue();
  },
};
</script>

<style scoped>
* {
  font-family: Arial;
  font-size: 12px;
}
.autocomplete {
  display: inline-block;
}
.autocomplete__input {
  border: 1px solid silver;
  outline: none;
  margin: 0;
  background: #fff;
}

.autocomplete__result {
  border: 1px solid silver;
  border-top: 0;
  position: absolute;
  overflow: auto;
  max-height: 93px;
  background: #fff;
  list-style: none;
  padding: 0;
  margin: 0;
}

.autocomplete__result-item_highlight {
  background: rgba(0, 0, 0, 0.3);
}

.autocomplete__result > * {
  padding: 3px 3px 0 3px;
}

.autocomplete__result li {
  cursor: pointer;
}
.autocomplete__input,
.autocomplete__result {
  width: 200px;
  box-sizing: border-box;
}

.autocomplete__input,
.autocomplete__result p {
  padding: 4px;
  margin: 0;
  color: #000;
}

.autocomplete__result p:nth-child(2n + 1) {
  background: #f6f6f6;
}

.autocomplete__result p:hover {
  background: #e5e5e5;
}
</style>
