import axios from 'axios'

const API_URL = import.meta.env.VITE_APP_API_URL

class UserService {

  getUserList () {
    return axios.get(API_URL + 'users/')
  }

  getCurrentUserInfo () {
    const user = JSON.parse(localStorage.getItem('user'))
    console.log(user)
    return axios.get(API_URL + 'users/' + user.username)
  }

  editCurrentUserInfo (user) {
    return axios.put(API_URL + 'users/' + user.username, user)
  }

  getUserInfoByUsername (username) {
    return axios.get(API_URL + 'users/' + username)
  }

  addUserDietProfile(dietProfileName, userId) {
    return axios.post(API_URL + 'diet/', {
      dietProfileName,
      userId
    })
  }

  getAvailableDietProfiles() {
    return axios.get(API_URL + 'diet/')
  }

  getUserDietProfiles(userId) {
    return axios.get(`${API_URL}diet/${userId}`)
  }

}

export default new UserService()
