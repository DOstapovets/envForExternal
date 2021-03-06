import { configure } from '@storybook/vue';
import Vue from 'vue';
import orUi from 'or-ui';
import VueLocalStorage from 'vue-localstorage';
import Vuelidate from 'vuelidate';

import 'normalize.css/normalize.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'keen-ui/dist/keen-ui.css';
import 'or-ui/dist/or-ui.css';
import '!style-loader!css-loader!sass-loader!./styles.scss';

Vue.use(orUi);
Vue.use(VueLocalStorage);

// initialize Vuelidate
Vue.use(Vuelidate);

function loadStories() {
  // You can require as many stories as you need.
  //require('../src/components/Ui/Calendar/Calendar.stories.js');
  //require('../src/components/Ui/Accordion/Accordion.stories.js');
  //require('../src/components/External/Schedule/Schedule.stories.js');
  //require('../src/components/External/Paired/Paired.stories.js')
  require('../src/components/External/Test/Test.stories');
}

configure(loadStories, module);
