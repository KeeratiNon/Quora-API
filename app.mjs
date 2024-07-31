import express from "express";
import { questionRouter } from "./routes/questions.mjs";
import { answerRouter } from "./routes/answers.mjs"
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"

const app = express();
const port = 4000;
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Question API',
      version: '1.0.0',
      description: 'API for managing questions and answers',
    },
    servers: [
      {
        url: 'http://localhost:4000',
      },
    ],
  },
  apis: ['./routes/*.mjs'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use("/questions",questionRouter)
app.use("/answers",answerRouter)

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
