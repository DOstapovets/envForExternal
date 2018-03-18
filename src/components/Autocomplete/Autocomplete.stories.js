// import Vue from 'vue';

import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import _ from 'lodash';

/* eslint-disable */
import Autocomplete from './Autocomplete.vue';
/* eslint-enable */

function getItems(abort) {
  return text => {
    const elems = fetch('http://www.floatrates.com/daily/usd.json')
      .then(response => response.json())
      .then(res => {
        const items = _.values(res);
        return items.filter(item => {
          const textLower = text.toLowerCase();
          const nameLover = item.code.toLowerCase();
          return nameLover.indexOf(textLower) !== -1;
        });
      });
    if (abort) {
      elems.abort = () => {
        abort('aborted');
      };
    }
    return elems;
  };
}

storiesOf('Autocomplete', module)
  .add('Base, custom input from innerText', () => ({
    data() {
      return {
        value: '',
      };
    },
    methods: {
      getItems: getItems(),
    },
    components: { Autocomplete },
    template: `
    <div>
      <autocomplete 
        :getItems="getItems"
        v-model="value"
      >
      <template
        slot="listItem"
        slot-scope="props"
      >
        <b>{{props.item.code}}.</b> {{props.item.rate}}
      </template>
      </autocomplete>
    </div>
  `,
  }))
  .add('Customization input from function', () => ({
    data() {
      return {
        value: '',
      };
    },
    methods: {
      getItems: getItems(),
      customizationInput: choseItem => `${choseItem.code}`,
    },
    components: { Autocomplete },
    template: `
    <div>
      <autocomplete 
        :getItems="getItems"
        v-model="value"
        :customization-input="customizationInput"
      >
      <template
        slot="listItem"
        slot-scope="props"
      >
        <b>{{props.item.code}}.</b> {{props.item.rate}}
      </template>
      </autocomplete>
    </div>
  `,
  }))
  .add('Check abort', () => ({
    data() {
      return {
        value: '',
      };
    },
    methods: {
      getItems: getItems(action('abort')),
    },
    components: { Autocomplete },
    template: `
    <div>
      <autocomplete 
        :getItems="getItems"
        v-model="value"
      >
      <template
        slot="listItem"
        slot-scope="props"
      >
        <b>{{props.item.code}}.</b> {{props.item.rate}}
      </template>
      </autocomplete>
    </div>
  `,
  }))
  .add('Default value', () => ({
    data() {
      return {
        value: '',
        defaultValue: {
          code: 'EUR',
          alphaCode: 'EUR',
          numericCode: '978',
          name: 'Euro',
          rate: 0.81260295810407,
          date: 'Sun, 18 Mar 2018 12:00:01 GMT',
        },
      };
    },
    methods: {
      getItems: getItems(),
      customizationInput: choseItem => `${choseItem.code}`,
    },
    components: { Autocomplete },
    template: `
    <div>
      <autocomplete 
        :getItems="getItems"
        v-model="value"
        :customization-input="customizationInput"
        :default-value="defaultValue"
      >
      <template
        slot="listItem"
        slot-scope="props"
      >
        <b>{{props.item.code}}.</b> {{props.item.rate}}
      </template>
      </autocomplete>
    </div>
  `,
  }))
  .add('Check  selected value', () => ({
    data() {
      return {
        value: '',
        defaultValue: {
          code: 'EUR',
          alphaCode: 'EUR',
          numericCode: '978',
          name: 'Euro',
          rate: 0.81260295810407,
          date: 'Sun, 18 Mar 2018 12:00:01 GMT',
        },
      };
    },
    methods: {
      getItems: getItems(),
      customizationInput: choseItem => `${choseItem.code}`,
      checkSelected: action('selected'),
    },
    components: { Autocomplete },
    template: `
    <div>
      <autocomplete 
        :getItems="getItems"
        v-model="value"
        :customization-input="customizationInput"
        :default-value="defaultValue"
        @input="checkSelected"
      >
      <template
        slot="listItem"
        slot-scope="props"
      >
        <b>{{props.item.code}}.</b> {{props.item.rate}}
      </template>
      </autocomplete>
      <br />
      <b>Selected value</b>: {{value}}
    </div>
  `,
  }));
