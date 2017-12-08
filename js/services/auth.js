/* global localStorage Conf md5 */
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
    return requester.call(`${Conf.authUrl}/login`, 'POST', {
      username: formdata.email,
      password: formdata.passwd
    })
    .then((res) => {
      localStorage.setItem(LSTORAGE_USER_KEY, JSON.stringify(res.data.user))
      localStorage.setItem(LSTORAGE_TOKEN_KEY, JSON.stringify(res.data.token))
      return res.data
    })
  }

  register (formdata, requester) {
    return requester.call(`${Conf.authUrl}/register`, 'POST', formdata)
    .then((res) => {
      return res.data
    })
  }

  requestPwdChange (email, requester) {
    return requester.call(`${Conf.authUrl}/forgotten`, 'PUT', {email})
    .then((res) => {
      return res.data
    })
  }

  setPwd (newPwd, token, requester) {
    const url = `${Conf.authUrl}/setpasswd?sptoken=${token}`
    return requester.call(url, 'PUT', {password: newPwd})
  }

  getUserInfos (uids, requester) {
    function _gravatarUrl (email) {
      const hash = md5(email)
      return `https://www.gravatar.com/avatar/${hash}`
    }
    return requester.call(`${Conf.authUrl}/api/user/info/${uids.join(',')}`)
    .then((res) => {
      return res.data.map(i => {
        return i.email ? Object.assign(i, {img: _gravatarUrl(i.email)}) : i
      })
    })
    .catch((_) => {}) // don't handle
  }
}
