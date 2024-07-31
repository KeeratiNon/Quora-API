import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateAnswerDownVote, validateAnswerUpVote } from "../Middlewares/validateAnswer.mjs";

export const answerRouter = Router()
/**
 * @swagger
 * /answer/{id}/downvote:
 *   post:
 *     summary: Downvote an answer
 *     description: Downvotes an answer by its ID.
 *     tags:
 *       - Answers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the answer to downvote
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             vote:
 *               type: integer
 *               example: -1
 *               description: The vote value (-1 for downvote, 1 for upvote)
 *     responses:
 *       200:
 *         description: Successfully downvoted the answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully downvoted the answer.
 *                 answerVote:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                       description: ID of the answer
 *                     question_id:
 *                       type: integer
 *                       example: 10
 *                       description: ID of the question to which the answer belongs
 *                     content:
 *                       type: string
 *                       example: "This is the answer content."
 *                       description: Content of the answer
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-02T12:00:00Z"
 *                       description: Date and time when the answer was created
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-02T12:30:00Z"
 *                       description: Date and time when the answer was last updated
 *                     upvote:
 *                       type: integer
 *                       example: 3
 *                       description: Number of upvotes for the answer
 *                     downvote:
 *                       type: integer
 *                       example: 1
 *                       description: Number of downvotes for the answer
 *       404:
 *         description: Answer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Answer not found.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server could not vote answer because database connection.
 */
answerRouter.post("/:id/downvote",[validateAnswerDownVote], async (req,res)=>{
    const answerFromId = req.params.id
    const answerVote = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
    }
    let results
    try {
        results = await connectionPool.query(`with newField as (insert into answer_votes (answer_id,vote,created_at,updated_at)
        values ($1,$2,$3,$4) returning *) select answers.id, answers.question_id, answers.content, answers.created_at, answers.updated_at
        ,count(case when answer_votes.vote = 1 then answer_votes end) as upvote
        ,count(case when answer_votes.vote = -1 then answer_votes end) as downvote
        from answers inner join answer_votes
        on answers.id = answer_votes.answer_id
        inner join newField
        on newField.answer_id = answer_votes.answer_id
        where answers.id = $1
        group by answers.id`,[
                answerFromId,
                answerVote.vote,
                answerVote.created_at,
                answerVote.updated_at
            ])
    }catch (err) {
        console.log(err)
        return res.status(500).json({
            message:
              "Server could not vote answer because database connection.",
          });
    }
    if (results.rowCount === 0) {
        return res.status(404).json({
          message: "Answer not found.",
        });
    }
    return res.status(200).json({
        message: "Successfully downvoted the answer.",
        answerVote: results.rows[0]
    })
})
/**
 * @swagger
 * /answer/{id}/upvote:
 *   post:
 *     summary: Upvote an answer
 *     description: Upvotes an answer by its ID.
 *     tags:
 *       - Answers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the answer to upvote
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             vote:
 *               type: integer
 *               example: 1
 *               description: The vote value (-1 for downvote, 1 for upvote)
 *     responses:
 *       200:
 *         description: Successfully upvoted the answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully upvoted the answer.
 *                 answerVote:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                       description: ID of the answer
 *                     question_id:
 *                       type: integer
 *                       example: 10
 *                       description: ID of the question to which the answer belongs
 *                     content:
 *                       type: string
 *                       example: "This is the answer content."
 *                       description: Content of the answer
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-02T12:00:00Z"
 *                       description: Date and time when the answer was created
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-02T12:30:00Z"
 *                       description: Date and time when the answer was last updated
 *                     upvote:
 *                       type: integer
 *                       example: 4
 *                       description: Number of upvotes for the answer
 *                     downvote:
 *                       type: integer
 *                       example: 1
 *                       description: Number of downvotes for the answer
 *       404:
 *         description: Answer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Answer not found.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server could not vote answer because database connection.
 */
answerRouter.post("/:id/upvote",[validateAnswerUpVote], async (req,res)=>{
    const answerFromId = req.params.id
    const answerVote = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
    }
    let results
    try {
        results = await connectionPool.query(`with newField as (insert into answer_votes (answer_id,vote,created_at,updated_at)
        values ($1,$2,$3,$4) returning *) select answers.id, answers.question_id, answers.content, answers.created_at, answers.updated_at
        ,count(case when answer_votes.vote = 1 then answer_votes end) as upvote
        ,count(case when answer_votes.vote = -1 then answer_votes end) as downvote
        from answers inner join answer_votes
        on answers.id = answer_votes.answer_id
        inner join newField
        on newField.answer_id = answer_votes.answer_id
        where answers.id = $1
        group by answers.id`,[
                answerFromId,
                answerVote.vote,
                answerVote.created_at,
                answerVote.updated_at
            ])
    }catch {
        return res.status(500).json({
            message:
              "Server could not vote answer because database connection.",
          });
    }
    if (results.rowCount === 0) {
        return res.status(404).json({
          message: "Answer not found.",
        });
    }
    return res.status(200).json({
        message: "Successfully upvoted the answer.",
        answerVote: results.rows[0]
    })
})