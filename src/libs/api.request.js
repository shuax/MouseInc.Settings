import HttpRequest from '@/libs/axios'
// import config from '@/config'
import { getParams } from '@/libs/util'
let port = getParams(location.search || '?')['port']
port = port || 1234
const axios = new HttpRequest('http://127.0.0.1:' + port)
export default axios
