import Vue from 'vue';
import Vuex from 'vuex';
import axios from '@/api/server';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    notification: {
      message: '',
      type: 'success',
      status: false,
    },
    search: '',
    isLogin: false,
    questions: [],
    myQuestions: [],
  },
  mutations: {
    notify(state, payload) {
      const { message, type, status } = payload;
      // eslint-disable-next-line
      state.notification.message = message;
      // eslint-disable-next-line
      state.notification.type = type;
      // eslint-disable-next-line
      state.notification.status = status;
    },
    loading(state, payload) {
      // eslint-disable-next-line
      state.loading = payload;
    },
    logout(state) {
      this.dispatch('notify', {
        message: 'logged out',
        type: 'success',
      });
      // eslint-disable-next-line
      state.isLogin = false;
      localStorage.removeItem('token');
    },
    login(state, payload) {
      const { message, token } = payload;

      this.dispatch('notify', {
        message, type: 'success',
      });
      // eslint-disable-next-line
      state.isLogin = true;
      localStorage.setItem('token', token);
    },
    addQuestion(state, payload) {
      // eslint-disable-next-line
      state.questions.unshift(payload);
      state.myQuestions.unshift(payload);
    },
    setIsLogin(state, payload) {
      // eslint-disable-next-line
      state.isLogin = payload;
    },
    setQuestions(state, payload) {
      // eslint-disable-next-line
      state.questions = payload;      
    },
    setMyQuestions(state, payload) {
      // eslint-disable-next-line
      state.myQuestions = payload;      
    },
  },
  actions: {
    notify(context, payload) {
      // eslint-disable-next-line
      payload.status = true;
      context.commit('notify', payload);
      setTimeout(() => {
        // eslint-disable-next-line
        payload.status = false;
        context.commit('notify', payload);
      }, 3000);
    },
    login(context, payload) {
      context.commit('loading', true);
      axios
        .post('/login', payload)
        .then(({ data }) => {
          context.commit('loading', false);
          context.commit('login', data);
        })
        .catch((err) => {
          context.commit('loading', false);
          const { message } = err.response.data;

          this.dispatch('notify', {
            message, type: 'error',
          });
        });
    },
    register(context, payload) {
      context.commit('loading', true);
      axios
        .post('/register', payload)
        .then(({ data }) => {
          context.commit('loading', false);
          const { message } = data;

          this.dispatch('notify', {
            message, type: 'success',
          });
        })
        .catch((err) => {
          context.commit('loading', false);
          const { message } = err.response.data;

          this.dispatch('notify', {
            message, type: 'error',
          });
        });
    },
    upload(context, payload) {
      const { formData, token } = payload;

      context.commit('loading', true);
      axios
        .post('/questions', formData, { headers: { token } })
        .then(({ data }) => {
          context.commit('loading', false);
          const { message, newQuestion } = data;

          this.dispatch('notify', {
            message, type: 'success',
          });
          context.commit('addQuestion', newQuestion);
        })
        .catch((err) => {
          context.commit('loading', false);
          const { message } = err.response.data;

          this.dispatch('notify', {
            message, type: 'error',
          });
        });
    },
    fetchQuestions(context) {
      context.commit('loading', true);
      axios
        .get('/questions')
        .then(({ data }) => {
          context.commit('loading', false);
          const { questions } = data;

          context.commit('setQuestions', questions);
        })
        .catch((err) => {
          context.commit('loading', false);
          const { status } = err.response;

          if (status === 404) {
            context.commit('setQuestions', []);
          } else {
            const { message } = err.response.data;

            this.dispatch('notify', {
              message, type: 'error',
            });
          }
        });
    },
    fetchMyQuestions(context, payload) {
      context.commit('loading', true);
      axios
        .get('/user/questions', { headers: { token: payload } })
        .then(({ data }) => {
          context.commit('loading', false);
          const { questions } = data;

          context.commit('setMyQuestions', questions);
        })
        .catch((err) => {
          context.commit('loading', false);
          const { status } = err.response;

          if (status === 404) {
            context.commit('setMyQuestions', []);
          } else {
            const { message } = err.response.data;

            this.dispatch('notify', {
              message, type: 'error',
            });
          }
        });
    },
  },
});
