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
    localStorage.deleteItem(LSTORAGE_USER_KEY)
    localStorage.deleteItem(LSTORAGE_TOKEN_KEY)
  }

  login (formdata, requester) {
    return requester.call('/login', 'POST', {
      username: formdata.username,
      password: formdata.password,
      email: `${formdata.username}@test.mordor`,
      id: 123
    })
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
