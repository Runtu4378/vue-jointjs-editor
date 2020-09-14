import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 1000 * 10
})

export default (options) => {
  return new Promise((resolve) => {
    const result = {
      success: false,
      message: 'unknown error',
      data: null
    }

    try {
      instance(options)
        .then(response => {
          if (
            response.status &&
            response.data &&
            response.data.code === 0
          ) {
            result.success = true
            result.message = response.message
            result.data = response.data.data
            resolve(result)
          } else {
            result.message = response.data
              ? response.data.message
              : response.statusText
            result.data = response.data
            resolve(result)
          }
        })
        .catch(error => {
          result.message = error.message
          result.data = error
          resolve(error)
        })
    } catch (error) {
      result.message = error.message
      resolve(result)
    }
  })
}
