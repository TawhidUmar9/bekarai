const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
// loading API documentation
const swaggerDocument = yaml.load('./docs/api-docs.yml');
// serving Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cookieParser());

const allowedOrigins = ['http://localhost:5173'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

const registerRouter = require('./route/register');
const loginRouter = require('./route/login');
const profileRouter = require('./route/profile');
const summarizeRouter = require('./route/summerize');
const fetchskillRouter = require('./route/fetchskill');

// const versionHistoryRouter= require('./route/projectversioning');
// const surveyversionHistoryRouter= require('./route/surveyversioning');

// const question_import_from_question_bank_Router= require('./route/question_import_from_question_bank')

//project
// const UserprojectRouter = require('./route/projectviewUser');
// const CollaboratorprojectRouter = require('./route/collaboratorView');


//connect db
const supabase = require('./db');
require('dotenv').config();
const port = process.env.PORT || 2000;
(async () => {
  const { data, error } = await supabase.from('user').select('*').limit(1);
  // const { data, error } = await supabase.from('skill_list').select('*').limit(1);
  if (error) {
    console.error('Database connection failed:', error.message);
}
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();

app.use(express.json());
// Routes
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/profile', profileRouter);
app.use('/api/summerize', summarizeRouter);
app.use('/api/fetchskill', fetchskillRouter);

// app.use('/api', versionHistoryRouter);
// app.use('/api', surveyversionHistoryRouter);

// app.use('/api', question_import_from_question_bank_Router);

// //project
// app.use('/api/project', UserprojectRouter);
// app.use('/api/collaborator', CollaboratorprojectRouter);

// app.use('/api/signin', signinRouter);
// Other routes and middleware...