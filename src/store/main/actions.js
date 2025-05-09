import AuthService from '../../services/auth.service'

let actions = {
    login ({ commit }, user) {
      return AuthService.login(user).then(
        user => {
          /*if (!VueJwtDecode.decode(user.access_token).admin) {
            AuthService.logout()
            return Promise.reject(Error())
          }*/
          commit('loginSuccess', user)
          return Promise.resolve(user)
        },
        error => {
          commit('loginFailure')
          return Promise.reject(error)
        }
      )
    },

    logout ({ commit }) {
        AuthService.logout()
        commit('logout')
    },

    register ({ commit }, user) {
      return AuthService.register(user).then(
        user => {
          /*if (!VueJwtDecode.decode(user.access_token).admin) {
            AuthService.logout()
            return Promise.reject(Error())
          }*/
          commit('loginSuccess', user)
          return Promise.resolve(user)
        },
        error => {
          commit('loginFailure')
          return Promise.reject(error)
        }
      )
    },     
    
    toggleSideBar({ commit }) {
      commit('toggleSideBar')
    }
};

export default actions;