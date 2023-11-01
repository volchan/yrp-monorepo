import asyncHandler from 'express-async-handler'

const health = asyncHandler(async (req, res) => {  
  res.status(200).json({
    message: 'OK'
  })
})

export default { health }
