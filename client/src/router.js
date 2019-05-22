import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue'),
    },
    {
      path: '/user/questions',
      name: 'myQuestions',
      component: () => import(/* webpackChunkName: "myQuestions" */ './views/MyQuestions.vue'),
    },
    {
      path: '/questions/:id',
      name: 'question',
      component: () => import(/* webpackChunkName: "question" */ './views/Question.vue'),
    },
  ],
});
