export const validateQuestion = (req, res, next) => {
  if (!req.body.title) {
    return res.status(400).json({
      message: "Missing or invalid request data.",
    });
  }
  if (!req.body.description) {
    return res.status(400).json({
      message: "Missing or invalid request data.",
    });
  }
  if (!req.body.category) {
    return res.status(400).json({
      message: "Missing or invalid request data.",
    });
  }
  next()
};
export const validateQuestionUpVote = (req,res,next) => {
    if (!req.body.vote) {
        return res.status(400).json({
            message: "Missing or invalid request data."
        })
    }
    if (req.body.vote !== "1") {
        return res.status(400).json({
            message: "Please enter only 1."
        })
    }
    next()
}
export const validateQuestionDownVote = (req,res,next) => {
    if (!req.body.vote) {
        return res.status(400).json({
            message: "Missing or invalid request data."
        })
    }
    if (req.body.vote !== "-1") {
        return res.status(400).json({
            message: "Please enter only -1."
        })
    }
    next()
}
export const validateQuery = (req,res,next) => {
  for (let key in req.query) {
    if (key !== "title" && key !== "category") {
      return res.status(400).json({
        message: "Please enter a correct query."
      })
    }
  }
  next()
}