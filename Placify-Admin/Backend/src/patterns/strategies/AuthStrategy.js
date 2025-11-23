/**
 * Strategy Pattern Implementation for Authentication
 * Interchangeable authentication methods
 */

class AuthStrategy {
  authenticate(credentials, request) {
    throw new Error('authenticate method must be implemented');
  }

  validateToken(token) {
    throw new Error('validateToken method must be implemented');
  }
}

class JWTAuthStrategy extends AuthStrategy {
  constructor() {
    super();
    this.jwt = require('jsonwebtoken');
    this.bcrypt = require('bcryptjs');
  }

  async authenticate(credentials, request) {
    const { email, password } = credentials;
    const Admin = require('../../models/Admin');

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await this.bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '1h' }
    );

    return {
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    };
  }

  async validateToken(token) {
    try {
      const decoded = this.jwt.verify(token, process.env.JWT_SECRET);
      const Admin = require('../../models/Admin');
      
      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) {
        throw new Error('Admin not found');
      }

      return admin;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

class APIKeyAuthStrategy extends AuthStrategy {
  constructor() {
    super();
    this.validApiKeys = process.env.VALID_API_KEYS ? 
                       process.env.VALID_API_KEYS.split(',') : [];
  }

  async authenticate(credentials, request) {
    const { apiKey } = credentials;
    
    if (!this.validApiKeys.includes(apiKey)) {
      throw new Error('Invalid API key');
    }

    // For API key auth, return a system admin profile
    return {
      token: apiKey,
      admin: {
        id: 'system',
        email: 'system@placify.com',
        name: 'System Admin',
        role: 'system'
      }
    };
  }

  async validateToken(token) {
    if (!this.validApiKeys.includes(token)) {
      throw new Error('Invalid API key');
    }

    return {
      _id: 'system',
      email: 'system@placify.com',
      name: 'System Admin',
      role: 'system'
    };
  }
}

class SessionAuthStrategy extends AuthStrategy {
  constructor() {
    super();
    this.sessions = new Map(); // In production, use Redis or database
  }

  async authenticate(credentials, request) {
    const { email, password } = credentials;
    const Admin = require('../../models/Admin');
    const bcrypt = require('bcryptjs');

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate session ID
    const sessionId = require('crypto').randomBytes(32).toString('hex');
    
    // Store session
    this.sessions.set(sessionId, {
      adminId: admin._id,
      email: admin.email,
      role: admin.role,
      createdAt: new Date(),
      lastAccessed: new Date()
    });

    return {
      token: sessionId,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    };
  }

  async validateToken(token) {
    const session = this.sessions.get(token);
    if (!session) {
      throw new Error('Invalid session');
    }

    // Update last accessed time
    session.lastAccessed = new Date();

    const Admin = require('../../models/Admin');
    const admin = await Admin.findById(session.adminId).select('-password');
    if (!admin) {
      this.sessions.delete(token);
      throw new Error('Admin not found');
    }

    return admin;
  }
}

// Authentication Service using Strategy Pattern
class AuthenticationService {
  constructor(strategy = null) {
    this.strategy = strategy || new JWTAuthStrategy();
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  async login(credentials, request) {
    return await this.strategy.authenticate(credentials, request);
  }

  async validateToken(token) {
    return await this.strategy.validateToken(token);
  }

  // Factory method to create strategy based on type
  static createStrategy(type) {
    switch (type) {
      case 'jwt':
        return new JWTAuthStrategy();
      case 'apikey':
        return new APIKeyAuthStrategy();
      case 'session':
        return new SessionAuthStrategy();
      default:
        return new JWTAuthStrategy();
    }
  }
}

// Context class for different auth environments
class AuthContext {
  constructor() {
    this.strategies = {
      development: new JWTAuthStrategy(),
      production: new JWTAuthStrategy(),
      testing: new SessionAuthStrategy(),
      api: new APIKeyAuthStrategy()
    };
  }

  getStrategy(environment = process.env.NODE_ENV || 'development') {
    return this.strategies[environment] || this.strategies.development;
  }

  setStrategy(environment, strategy) {
    this.strategies[environment] = strategy;
  }
}

module.exports = {
  AuthStrategy,
  JWTAuthStrategy,
  APIKeyAuthStrategy,
  SessionAuthStrategy,
  AuthenticationService,
  AuthContext
};