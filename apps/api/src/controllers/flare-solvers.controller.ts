import asyncHandler from 'express-async-handler'

const index = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: 'OK',
  })
})

export default { index }
