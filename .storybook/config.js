import { configure } from '@storybook/vue';
import Vue from 'vue';
import orUi from 'or-ui';
import VueLocalStorage from 'vue-localstorage';

import 'normalize.css/normalize.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'keen-ui/dist/keen-ui.css';
import 'or-ui/dist/or-ui.css';
import '!style-loader!css-loader!sass-loader!./styles.scss';

Vue.use(orUi);
Vue.use(VueLocalStorage);

function loadStories() {
  // You can require as many stories as you need.
  require('../src/components/Autocomplete/Autocomplete.stories.js');
  require('../src/components/Calendar/Calendar.stories.js');
  require('../src/components/Accordion/Accordion.stories.js');
  require('../src/components/Schedule/Schedule.stories.js');
}

configure(loadStories, module);
