/* global localStorage */
const LSTORAGE_USER_KEY = 'opendemocracy_user'
const LSTORAGE_TOKEN_KEY = 'opendemocracy_token'

export default class AuthService {
  //
  getInfo () {
    const user = localStorage.getItem(LSTORAGE_USER_KEY)
    const token = localStorage.getItem(LSTORAGE_TOKEN_KEY)
    try {
      return {
        user: JSON.parse(user),
        token: JSON.parse(token)
      }
    } catch (e) {
      return null
    }
  }

  logout () {
    localStorage.removeItem(LSTORAGE_USER_KEY)
    localStorage.removeItem(LSTORAGE_TOKEN_KEY)
  }

  login (formdata, requester) {
    return requester.call('/login', 'POST', formdata)
    .then((res) => {
      localStorage.setItem(LSTORAGE_USER_KEY, JSON.stringify(res.data.user))
      localStorage.setItem(LSTORAGE_TOKEN_KEY, JSON.stringify(res.data.token))
      return {
        user: res.data.user,
        token: res.data.token
      }
    })
  }
}
