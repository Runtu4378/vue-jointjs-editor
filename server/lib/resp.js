module.exports = (err, data, successExtraMessage = 'success') => {
  if (err) {
    return {
      code: err.code,
      message: err.message,
      data
    }
  } else {
    return {
      code: 0,
      message: successExtraMessage,
      data
    }
  }
}
