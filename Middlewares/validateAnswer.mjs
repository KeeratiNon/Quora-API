export const validateAnswer = (req,res,next) => {
    if (!req.body.content) {
        return res.status(400).json({
            message: "Missing or invalid request data."
        })
    }
    if (req.body.content.length>300) {
        return res.status(400).json({
            message: "Textlength is over 300."
        })
    }
    next()
}
export const validateAnswerDownVote = (req,res,next) => {
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
export const validateAnswerUpVote = (req,res,next) => {
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