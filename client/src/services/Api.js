import axios from 'axios'

export default () => {

  const data = { baseURL: 'http://localhost:3000' }


  return axios.create(data)
}
