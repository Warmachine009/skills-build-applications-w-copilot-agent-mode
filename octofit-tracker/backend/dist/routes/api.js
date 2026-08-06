"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
router.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: 'OctoFit Tracker API is running' });
});
router.get('/users', async (_req, res) => {
    const users = await User_1.default.find();
    res.json(users);
});
router.post('/users', async (req, res) => {
    const user = new User_1.default(req.body);
    await user.save();
    res.status(201).json(user);
});
exports.default = router;
