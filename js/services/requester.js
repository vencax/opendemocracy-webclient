import axios from 'axios'
import { convertQuery, getTotalItems } from './api_flavor'
import DiscussRequesterInit from './discuss'

class DataRequester {
  //
  constructor (apiUrl, authHeaders, defaultHeaders) {
    this.apiUrl = apiUrl
    this.authHeaders = authHeaders
    for (let key in defaultHeaders) {
      axios.defaults.headers.common[key] = defaultHeaders[key]
    }
  }

  getEntries (url, params) {
    //
    let qParams = convertQuery(params)

    const req = axios({
      method: 'get',
      url: `${this.apiUrl}/${url}`,
      params: qParams,
      headers: this.authHeaders()
    })

    return req.then((response) => {
      return {
        data: response.data,
        totalItems: getTotalItems(response)
      }
    })
  }

  getEntry (entityName, id, params = {}) {
    return axios({
      method: 'get',
      url: `${this.apiUrl}/${entityName}/${id}`,
      headers: this.authHeaders(),
      params: params
    }).then((response) => {
      return response.data
    })
  }

  deleteEntry (entityName, id) {
    return axios({
      method: 'delete',
      url: `${this.apiUrl}/${entityName}/${id}`,
      headers: this.authHeaders()
    })
  }

  saveEntry (entityName, data, id = null) {
    const conf = {
      headers: this.authHeaders(),
      data: data
    }

    if (id) {
      conf.url = `${this.apiUrl}/${entityName}/${id}`
      conf.method = 'put'
    } else {
      conf.url = `${this.apiUrl}/${entityName}`
      conf.method = 'post'
    }
    return axios(conf).then((response) => {
      return response.data
    })
  }

  call (url, method = 'get', data) {   // call our API
    return axios({
      method: method,
      url: `${this.apiUrl}${url}`,
      headers: this.authHeaders(),
      data: data
    })
  }

  callExternalRes (conf) {   // just to be able to call external API
    return axios(conf)
  }
}

export default DiscussRequesterInit(DataRequester)
