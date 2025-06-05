import axios from 'axios'
//import VueJwtDecode from 'vue-jwt-decode'

const API_URL = import.meta.env.VITE_APP_API_URL

console.log(API_URL)

class AuthService {
  login (user) {
    console.log(user)
    return axios.post(API_URL + 'login', {
        email: user.email,
        password: user.password
      }).then(response => {
        if (response) {
          
          localStorage.setItem('user', JSON.stringify(response.data))
        }
        return response.data
      })
      /*.then(response => {
        if (response.data.access_token) {
          localStorage.setItem('user', JSON.stringify(response.data))
          localStorage.setItem('user_data', JSON.stringify(user))
          console.log(response.data.access_token)
        }
        return response // response.data
      }) */  
  }

  logout () {
    localStorage.removeItem('user')
  }

  register (user) {
    return axios.post(API_URL + 'register', {
      fullname: user.fullname,
      email: user.email,
      password: user.password,
      username: user.username,
      imageUrl: user.imageUrl
    }).then(response => {
      if (response) {
        console.log(response)
        localStorage.setItem('user', JSON.stringify(response.data))
      }
      return response.data
    })
  }

/*
  renewToken () {
    const token = JSON.parse(localStorage.getItem('user')).access_token
    const exp = VueJwtDecode.decode(token).exp
    if (Date.now() >= exp * 1000) {
      const user = JSON.parse(localStorage.getItem('user_data'))
      axios
        .post(API_URL + 'tokens', {
          email: user.email,
          password: user.password
        })
        .then(response => {
          if (response.data.access_token) {
            localStorage.setItem('user', JSON.stringify(response.data))
          }
        })
    }
  }
*/
}

export default new AuthService()