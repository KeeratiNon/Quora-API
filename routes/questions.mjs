import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import {
  validateQuestion,
  validateQuestionUpVote,
  validateQuestionDownVote,
  validateQuery,
} from "../Middlewares/validateQuestion.mjs";
import { validateAnswer } from "../Middlewares/validateAnswer.mjs";
export const questionRouter = Router();
/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Get questions
 *     description: Retrieve a list of questions based on optional filters.
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter questions by title.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter questions by category.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully retrieved the list of questions.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                         description: ID of the question
 *                       title:
 *                         type: string
 *                         example: "How to use Swagger with Node.js?"
 *                         description: Title of the question
 *                       category:
 *                         type: string
 *                         example: "Technology"
 *                         description: Category of the question
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-07-02T12:00:00Z"
 *                         description: Date and time when the question was created
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-07-02T12:30:00Z"
 *                         description: Date and time when the question was last updated
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question not found.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server could not read question because database connection.
 */
questionRouter.get("/", [validateQuery], async (req, res) => {
  const title = req.query.title;
  const category = req.query.category;
  let results;
  try {
    results = await connectionPool.query(
      `
        select * from questions 
        where (title = $1 or $1 is null or $1 = '') 
        and (category = $2 or $2 is null or $2 = '')`,
      [title, category]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not read question because database connection.",
    });
  }
  if (results.rowCount === 0) {
    return res.status(404).json({
      message: "Question not found.",
    });
  }
  return res.status(200).json({
    message: "Successfully retrieved the list of questions.",
    data: results.rows,
  });
});
/**
 * @swagger
 * /questions/{id}:
 *   get:
 *     summary: Get a question by ID
 *     description: Retrieve a specific question by its ID.
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the question to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully retrieved the question.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                       description: ID of the question
 *                     title:
 *                       type: string
 *                       example: "How to use Swagger with Node.js?"
 *                       description: Title of the question
 *                     category:
 *                       type: string
 *                       example: "Technology"
 *                       description: Category of the question
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-02T12:00:00Z"
 *                       description: Date and time when the question was created
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-02T12:30:00Z"
 *                       description: Date and time when the question was last updated
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question not found.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server could not read question because database connection.
 */
questionRouter.get("/:id", async (req, res) => {
  const questionFromId = req.params.id;
  let results;
  try {
    results = await connectionPool.query(
      `
        select * from questions where id = $1`,
      [questionFromId]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not read question because database connection.",
    });
  }
  if (results.rowCount === 0) {
    return res.status(404).json({
      message: "Question not found.",
    });
  }
  return res.status(200).json({
    message: "Successfully retrieved the list of questions.",
    data: results.rows[0],
  });
});
/**
 * @swagger
 * /questions/{id}/answers:
 *   get:
 *     summary: Get answers for a question
 *     description: Retrieve answers associated with a specific question ID.
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the question to retrieve answers for
 *     responses:
 *       200:
 *         description: Successfully retrieved the answers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully retrieved the answers.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                         description: ID of the answer
 *                       question_id:
 *                         type: integer
 *                         example: 1
 *                         description: ID of the question to which the answer belongs
 *                       content:
 *                         type: string
 *                         example: "This is the answer content."
 *                         description: Content of the answer
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-07-02T12:00:00Z"
 *                         description: Date and time when the answer was created
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-07-02T12:30:00Z"
 *                         description: Date and time when the answer was last updated
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server could not read answer because database connection.
 */
questionRouter.get("/:id/answers", async (req, res) => {
  const questionFromId = req.params.id;
  let results;
  try {
    results = await connectionPool.query(
      `
            select * from answers where question_id = $1`,
      [questionFromId]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not read answer because database connection.",
    });
  }
  return res.status(200).json({
    message: "Successfully retrieved the answers.",
    data: results.rows,
  });
});
/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Create a new question
 *     description: Create a new question with title, description, and category.
 *     tags:
 *       - Questions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "How to use Swagger with Node.js?"
 *                 description: Title of the question
 *               description:
 *                 type: string
 *                 example: "I am trying to integrate Swagger with my Node.js application..."
 *                 description: Description of the question
 *               category:
 *                 type: string
 *                 example: "Technology"
 *                 description: Category of the question
 *     responses:
 *       201:
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question created successfully.
 *                 newQuestion:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                       description: ID of the newly created question
 *                     title:
 *                       type: string
 *                       example: "How to use Swagger with Node.js?"
 *                       description: Title of the question
 *                     description:
 *                       type: string
 *                       example: "I am trying to integrate Swagger with my Node.js application..."
 *                       description: Description of the question
 *                     category:
 *                       type: string
 *                       example: "Technology"
 *                       description: Category of the question
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-02T12:00:00Z"
 *                       description: Date and time when the question was created
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-02T12:00:00Z"
 *                       description: Date and time when the question was last updated
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server could not create question because database connection.
 */
questionRouter.post("/", [validateQuestion], async (req, res) => {
  const newQuestion = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  };
  let results;
  try {
    results = await connectionPool.query(
      `
        insert into questions (title,description,category,created_at,updated_at)
        values ($1,$2,$3,$4,$5) returning *`,
      [
        newQuestion.title,
        newQuestion.description,
        newQuestion.category,
        newQuestion.created_at,
        newQuestion.updated_at,
      ]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not create question because database connection.",
    });
  }
  return res.status(201).json({
    message: "Question created successfully.",
    newQuestion: results.rows[0],
  });
});
/**
 * @swagger
 * /questions/{id}/answers:
 *   post:
 *     summary: Create a new answer for a question
 *     description: Create a new answer for a specific question ID.
 *     tags:
 *       - Answers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the question to which the answer belongs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is the answer content."
 *                 description: Content of the answer
 *     responses:
 *       201:
 *         description: Answer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Answer created successfully.
 *                 answer:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                       description: ID of the newly created answer
 *                     question_id:
 *                       type: integer
 *                       example: 1
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
 *                       example: "2024-07-02T12:00:00Z"
 *                       description: Date and time when the answer was last updated
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server could not create answer because database connection.
 */
questionRouter.post("/:id/answers", [validateAnswer], async (req, res) => {
  const questionFromId = req.params.id;
  const answer = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  };
  let results;
  try {
    results = await connectionPool.query(
      `
          insert into answers (question_id,content,created_at,updated_at)
          values ($1,$2,$3,$4) returning *`,
      [questionFromId, answer.content, answer.created_at, answer.updated_at]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not create answer because database connection.",
    });
  }
  return res.status(201).json({
    message: "Answer created successfully.",
    answer: results.rows[0],
  });
});
/**
 * @swagger
 * /questions/{id}/upvote:
 *   post:
 *     summary: Upvote a question
 *     description: Upvote a question by its ID.
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the question to upvote
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vote:
 *                 type: integer
 *                 example: 1
 *                 description: Vote value (+1 for upvote, -1 for downvote)
 *     responses:
 *       200:
 *         description: Successfully upvoted the question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully upvoted the question.
 *                 questionVote:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                       description: ID of the question
 *                     title:
 *                       type: string
 *                       example: "How to use Swagger with Node.js?"
 *                       description: Title of the question
 *                     description:
 *                       type: string
 *                       example: "I am trying to integrate Swagger with my Node.js application..."
 *                       description: Description of the question
 *                     category:
 *                       type: string
 *                       example: "Technology"
 *                       description: Category of the question
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-02T12:00:00Z"
 *                       description: Date and time when the question was created
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-02T12:30:00Z"
 *                       description: Date and time when the question was last updated
 *                     upvote:
 *                       type: integer
 *                       example: 5
 *                       description: Total number of upvotes for the question
 *                     downvote:
 *                       type: integer
 *                       example: 2
 *                       description: Total number of downvotes for the question
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question not found.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server could not vote question because database connection.
 */
questionRouter.post(
  "/:id/upvote",
  [validateQuestionUpVote],
  async (req, res) => {
    const questionFromId = req.params.id;
    const questionVote = {
      ...req.body,
      created_at: new Date(),
      updated_at: new Date(),
    };
    let results;
    try {
      results = await connectionPool.query(
        `
            with newField as (insert into question_votes (question_id,vote,created_at,updated_at)
            values ($1,$2,$3,$4) returning *) select questions.id, questions.title, questions.description, questions.category, questions.created_at, questions.updated_at
            ,count(case when question_votes.vote = 1 then question_votes end) as upvote
            ,count(case when question_votes.vote = -1 then question_votes end) as downvote
            from questions inner join question_votes
            on questions.id = question_votes.question_id
            inner join newField
            on newField.question_id = question_votes.question_id
            where questions.id = $1
            group by questions.id`,
        [
          questionFromId,
          questionVote.vote,
          questionVote.created_at,
          questionVote.updated_at,
        ]
      );
    } catch {
      return res.status(500).json({
        message: "Server could not vote question because database connection.",
      });
    }
    if (results.rowCount === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }
    return res.status(200).json({
      message: "Successfully upvoted the question.",
      questionVote: results.rows[0],
    });
  }
);
/**
 * @swagger
 * /questions/{id}/downvote:
 *   post:
 *     summary: Downvote a question
 *     description: Downvote a question by its ID.
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the question to downvote
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vote:
 *                 type: integer
 *                 example: -1
 *                 description: Vote value (+1 for upvote, -1 for downvote)
 *     responses:
 *       200:
 *         description: Successfully downvoted the question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully downvoted the question.
 *                 questionVote:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                       description: ID of the question
 *                     title:
 *                       type: string
 *                       example: "How to use Swagger with Node.js?"
 *                       description: Title of the question
 *                     description:
 *                       type: string
 *                       example: "I am trying to integrate Swagger with my Node.js application..."
 *                       description: Description of the question
 *                     category:
 *                       type: string
 *                       example: "Technology"
 *                       description: Category of the question
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-02T12:00:00Z"
 *                       description: Date and time when the question was created
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-02T12:30:00Z"
 *                       description: Date and time when the question was last updated
 *                     upvote:
 *                       type: integer
 *                       example: 5
 *                       description: Total number of upvotes for the question
 *                     downvote:
 *                       type: integer
 *                       example: 2
 *                       description: Total number of downvotes for the question
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question not found.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server could not vote question because database connection.
 */
questionRouter.post(
  "/:id/downvote",
  [validateQuestionDownVote],
  async (req, res) => {
    const questionFromId = req.params.id;
    const questionVote = {
      ...req.body,
      created_at: new Date(),
      updated_at: new Date(),
    };
    let results;
    try {
      results = await connectionPool.query(
        `with newField as (insert into question_votes (question_id,vote,created_at,updated_at)
            values ($1,$2,$3,$4) returning *) select questions.id, questions.title, questions.description, questions.category, questions.created_at, questions.updated_at
            ,count(case when question_votes.vote = 1 then question_votes end) as upvote
            ,count(case when question_votes.vote = -1 then question_votes end) as downvote
            from questions inner join question_votes
            on questions.id = question_votes.question_id
            inner join newField
            on newField.question_id = question_votes.question_id
            where questions.id = $1
            group by questions.id`,
        [
          questionFromId,
          questionVote.vote,
          questionVote.created_at,
          questionVote.updated_at,
        ]
      );
    } catch {
      return res.status(500).json({
        message: "Server could not vote question because database connection.",
      });
    }
    if (results.rowCount === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }
    return res.status(200).json({
      message: "Successfully downvoted the question.",
      questionVote: results.rows[0],
    });
  }
);
/**
 * @swagger
 * /questions/{id}:
 *   put:
 *     summary: Update a question
 *     description: Update a question by its ID.
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the question to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "How to use Swagger with Node.js?"
 *                 description: New title of the question
 *               description:
 *                 type: string
 *                 example: "I am trying to integrate Swagger with my Node.js application..."
 *                 description: New description of the question
 *               category:
 *                 type: string
 *                 example: "Technology"
 *                 description: New category of the question
 *     responses:
 *       200:
 *         description: Successfully updated the question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully updated the question.
 *                 updatedQuestion:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                       description: ID of the updated question
 *                     title:
 *                       type: string
 *                       example: "How to use Swagger with Node.js?"
 *                       description: Updated title of the question
 *                     description:
 *                       type: string
 *                       example: "I am trying to integrate Swagger with my Node.js application..."
 *                       description: Updated description of the question
 *                     category:
 *                       type: string
 *                       example: "Technology"
 *                       description: Updated category of the question
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-02T12:00:00Z"
 *                       description: Date and time when the question was created
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-02T12:30:00Z"
 *                       description: Date and time when the question was last updated
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question not found.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server could not update question because database connection.
 */
questionRouter.put("/:id", [validateQuestion], async (req, res) => {
  const questionFromId = req.params.id;
  const updateQuestion = {
    ...req.body,
    updated_at: new Date(),
  };
  let results;
  try {
    results = await connectionPool.query(
      `
        update questions
        set title = $2,
            description = $3,
            category = $4,
            updated_at = $5
        where id = $1
        returning *
      `,
      [
        questionFromId,
        updateQuestion.title,
        updateQuestion.description,
        updateQuestion.category,
        updateQuestion.updated_at,
      ]
    );
  } catch (error) {
    return res.status(500).json({
      message: "Server could not update question because database connection.",
    });
  }
  if (results.rowCount === 0) {
    return res.status(404).json({
      message: "Question not found.",
    });
  }
  return res.status(200).json({
    message: "Successfully updated the question.",
    updatedQuestion: results.rows[0],
  });
});
/**
 * @swagger
 * /questions/{id}:
 *   delete:
 *     summary: Delete a question
 *     description: Delete a question by its ID.
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the question to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully deleted the question.
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question not found.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server could not delete question because database connection.
 */
questionRouter.delete("/:id", async (req, res) => {
  const questionFromId = req.params.id;
  let results;
  try {
    results = await connectionPool.query(
      `
        delete from questions where id = $1`,
      [questionFromId]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not delete question because database connection.",
    });
  }
  if (results.rowCount === 0) {
    return res.status(404).json({
      message: "Question not found.",
    });
  }
  return res.status(200).json({
    message: "Successfully deleted the question and answer.",
  });
});
