import { Router } from 'express';
import User from '../models/User';
import Team from '../models/Team';
import Activity from '../models/Activity';
import Leaderboard from '../models/Leaderboard';
import Workout from '../models/Workout';

const router = Router();
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'OctoFit Tracker API is running',
    apiBaseUrl,
  });
});

router.get('/users', async (_req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get('/teams', async (_req, res) => {
  const teams = await Team.find().populate('members');
  res.json(teams);
});

router.get('/activities', async (_req, res) => {
  const activities = await Activity.find().populate('user team');
  res.json(activities);
});

router.get('/leaderboard', async (_req, res) => {
  const entries = await Leaderboard.find().populate('team');
  res.json(entries);
});

router.get('/workouts', async (_req, res) => {
  const workouts = await Workout.find();
  res.json(workouts);
});

export default router;
