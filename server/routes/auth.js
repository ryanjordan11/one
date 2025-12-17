import express from 'express';
import { AuthService } from '../services/auth.js';

export const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await AuthService.register(email, password, name);
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

authRouter.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const decoded = AuthService.verifyToken(token);
    const user = AuthService.getUser(decoded.userId);
    res.json({ success: true, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});
