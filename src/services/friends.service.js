import axios from 'axios'

const API_URL = import.meta.env.VITE_APP_API_URL

class FriendsService {

  getFriendsList (username) {
    return axios.get(API_URL + 'friends/' + username)
  }

  getFriendRequests (username) {
    return axios.get(API_URL + 'friends/requests/' + username)
  }

  sendFriendRequest (sender, receiver) {
    return axios.post(API_URL + 'friends/requests', {
      senderUsername: sender,
      receiverUsername: receiver
    })
  }

  rejectFriendRequest (sender, receiver) {
    return axios.post(API_URL + 'friends/requests/remove', {
      senderUsername: sender,
      receiverUsername: receiver
    })
  }

  acceptFriendRequest (sender, receiver) {
    return axios.post(API_URL + 'friends/accept', {
      senderUsername: sender,
      receiverUsername: receiver
    })
  }

  removeFriend (username1, username2) {
    return axios.post(API_URL + 'friends/remove', {
      firstUsername: username1,
      secondUsername: username2
    })
  }
}

export default new FriendsService()
