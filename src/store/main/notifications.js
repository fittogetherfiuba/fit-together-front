const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];

export default {
  namespaced: true,
  state: () => ({
    notifications: storedNotifications
  }),
  mutations: {
    ADD_NOTIFICATION(state, notification) {
      state.notifications.unshift(notification);
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    },
    CLEAR_NOTIFICATIONS(state) {
      state.notifications = [];
      localStorage.removeItem('notifications');
    }
  },
  actions: {
    addNotification({ commit }, notification) {
      commit('ADD_NOTIFICATION', notification);
    },
    clearNotifications({ commit }) {
      commit('CLEAR_NOTIFICATIONS');
    }
  },
  getters: {
    notifications: (state) => state.notifications
  }
};

