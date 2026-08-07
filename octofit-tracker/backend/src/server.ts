import express from 'express';
import mongoose from 'mongoose';
import apiRouter from './routes/api';

const app = express();
const port = Number(process.env.PORT) || 8000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

app.set('apiBaseUrl', apiBaseUrl);
app.use(express.json());
app.use('/api', apiRouter);

async function startServer() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    app.listen(port, '0.0.0.0', () => {
      console.log(`Backend listening on ${apiBaseUrl}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
