import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const users = new Map();

// Initialize admin user
const adminId = uuidv4();
const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
users.set(process.env.ADMIN_EMAIL || 'admin@example.com', {
  id: adminId,
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  password: adminPassword,
  role: 'admin',
  createdAt: new Date().toISOString()
});

class AuthServiceClass {
  async register(email, password, name) {
    if (users.has(email)) {
      throw new Error('User already exists');
    }

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: userId,
      email,
      name,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    users.set(email, user);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
  }

  async login(email, password) {
    const user = users.get(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  getUser(userId) {
    for (const user of users.values()) {
      if (user.id === userId) {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    }
    return null;
  }
}

export const AuthService = new AuthServiceClass();
