const { MongoClient } = require('mongodb');

// Mock de GitHub Strategy
jest.mock('passport-github2', () => {
    return {
        Strategy: class MockGitHubStrategy {
            constructor(options, callback) {
                this.options = options;
                this.callback = callback;
            }
        }
    };
});

// Mock de autenticación
jest.mock('../middleware/auth', () => require('../middleware/mockAuth'));

// Mock de passport
jest.mock('passport', () => {
    return {
        authenticate: () => (req, res, next) => next(),
        initialize: () => (req, res, next) => next(),
        session: () => (req, res, next) => next(),
        use: () => {},
        serializeUser: () => {},
        deserializeUser: () => {}
    };
});

// Variable global para controlar el estado de autenticación en pruebas
global.mockAuthenticatedState = false;

// Mock de session y configuración de prueba
jest.mock('express-session', () => () => (req, res, next) => {
    req.session = {
        save: (callback) => callback && callback(),
        destroy: (callback) => callback && callback()
    };
    // Usar la variable global para el estado de autenticación
    req.isAuthenticated = () => global.mockAuthenticatedState;
    next();
});

describe('Test Setup Configuration', () => {
    it('should have GitHub Strategy properly mocked', () => {
        const { Strategy } = require('passport-github2');
        const mockStrategy = new Strategy({}, () => {});
        expect(mockStrategy).toBeDefined();
        expect(mockStrategy.options).toBeDefined();
        expect(mockStrategy.callback).toBeDefined();
    });

    it('should handle authentication state correctly', () => {
        const req = { };
        const res = { };
        const next = jest.fn();
        
        const session = require('express-session')();
        session(req, res, next);
        
        expect(req.isAuthenticated()).toBe(false);
        global.mockAuthenticatedState = true;
        expect(req.isAuthenticated()).toBe(true);
        global.mockAuthenticatedState = false;
    });
});