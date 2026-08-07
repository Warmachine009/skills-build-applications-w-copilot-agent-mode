"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const Team_1 = __importDefault(require("../models/Team"));
const Activity_1 = __importDefault(require("../models/Activity"));
const Leaderboard_1 = __importDefault(require("../models/Leaderboard"));
const Workout_1 = __importDefault(require("../models/Workout"));
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
    try {
        await mongoose_1.default.connect(connectionString);
        console.log('Connected to octofit_db');
        await Promise.all([
            User_1.default.deleteMany({}),
            Team_1.default.deleteMany({}),
            Activity_1.default.deleteMany({}),
            Leaderboard_1.default.deleteMany({}),
            Workout_1.default.deleteMany({}),
        ]);
        const users = await User_1.default.create([
            { name: 'Avery Brooks', email: 'avery@octofit.com', role: 'member' },
            { name: 'Jordan Vale', email: 'jordan@octofit.com', role: 'member' },
            { name: 'Maya Chen', email: 'maya@octofit.com', role: 'coach' },
        ]);
        const teams = await Team_1.default.create([
            {
                name: 'Morning Movers',
                description: 'Early risers focused on consistency and recovery.',
                members: [users[0]._id, users[1]._id],
            },
            {
                name: 'Strength Squad',
                description: 'Power athletes competing for the leaderboard.',
                members: [users[2]._id],
            },
        ]);
        await Workout_1.default.create([
            {
                title: 'Full Body Circuit',
                description: 'A fast-paced circuit to build strength and endurance.',
                difficulty: 'intermediate',
                suggestedDuration: 45,
                muscleGroups: ['legs', 'core', 'upper body'],
            },
            {
                title: 'Recovery Flow',
                description: 'Light mobility and stretching to support recovery.',
                difficulty: 'beginner',
                suggestedDuration: 30,
                muscleGroups: ['mobility', 'core'],
            },
            {
                title: 'HIIT Burn',
                description: 'High intensity interval training for maximum calorie burn.',
                difficulty: 'advanced',
                suggestedDuration: 25,
                muscleGroups: ['cardio', 'core'],
            },
        ]);
        await Activity_1.default.create([
            {
                user: users[0]._id,
                type: 'Running',
                durationMinutes: 35,
                caloriesBurned: 420,
                date: new Date(Date.now() - 1000 * 60 * 60 * 24),
                team: teams[0]._id,
            },
            {
                user: users[1]._id,
                type: 'Cycling',
                durationMinutes: 52,
                caloriesBurned: 560,
                date: new Date(Date.now() - 1000 * 60 * 60 * 48),
                team: teams[0]._id,
            },
            {
                user: users[2]._id,
                type: 'Strength Training',
                durationMinutes: 60,
                caloriesBurned: 650,
                date: new Date(Date.now() - 1000 * 60 * 60 * 12),
                team: teams[1]._id,
            },
        ]);
        await Leaderboard_1.default.create([
            { team: teams[0]._id, points: 860, rank: 1 },
            { team: teams[1]._id, points: 730, rank: 2 },
        ]);
        console.log('Database seeding complete');
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
