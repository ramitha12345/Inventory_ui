import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import Vuelidate from 'vuelidate';
// import { AngularFontAwesomeModule } from 'angular-font-awesome';

// @NgModule({
//   //...
//   imports: [
//     //...
//     AngularFontAwesomeModule
//   ]
//   //...
// })
// export class AppModule { }

Vue.prototype.$http = axios;
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

Vue.config.productionTip = false
Vue.use(Vuelidate);
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

