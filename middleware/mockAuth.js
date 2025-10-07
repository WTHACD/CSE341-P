// Mock del middleware de autenticación para pruebas
const mockAuth = {
    isAuthenticated: (req, res, next) => {
        // Si la ruta requiere autenticación y el usuario no está autenticado
        if (!req.isAuthenticated()) {
            return res.status(401).json({ 
                isAuthenticated: false,
                message: 'Not authenticated'
            });
        }
        next();
    }
};

module.exports = mockAuth;