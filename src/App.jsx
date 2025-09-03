import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import DepartmentManager from './components/DepartmentManager.jsx';
// --- Configuración de Axios para hablar con el Proxy de Vite ---
const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000', // <-- RESTAURA LA URL COMPLETA
    withCredentials: true,
    withXSRFToken: true,
});

// --- Contexto de Autenticación (sin cambios) ---
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    // ... (El resto del componente AuthProvider no necesita cambios)
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            apiClient.get('/api/user')
                .then(response => setUser(response.data))
                .catch(() => {
                    localStorage.removeItem('token'); setToken(null); setUser(null);
                    delete apiClient.defaults.headers.common['Authorization'];
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        await apiClient.get('/sanctum/csrf-cookie'); // Esto ahora va a /sanctum, y Vite lo redirige
        const response = await apiClient.post('/api/login', { email, password }); // Esto va a /api/login, y Vite lo redirige
        const newToken = response.data.access_token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(response.data.user);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    };

    const logout = async () => {
        if (user) {
            await apiClient.post('/api/logout');
            localStorage.removeItem('token'); setToken(null); setUser(null);
            delete apiClient.defaults.headers.common['Authorization'];
        }
    };

    const authValue = { user, login, logout, isLoggedIn: !!user };

    return (
        <AuthContext.Provider value={authValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};


// --- Componentes (sin cambios) ---

function LoginPage() {
    // ... (El código de LoginPage se mantiene igual)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await auth.login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Error al iniciar sesión. Verifica tus credenciales.');
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Intranet Clínica Támara</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Contraseña</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">Entrar</button>
                </form>
            </div>
        </div>
    );
}

function GeminiAssistant() { /* ... (El componente se mantiene igual) ... */ 
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = async () => {
        if (!prompt) return;
        setLoading(true); setError(''); setResponse('');
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const payload = { contents: [{ parts: [{ text: prompt }] }], };
        try {
            const res = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!res.ok) { throw new Error(`Error en la API: ${res.status} ${res.statusText}`); }
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) { setResponse(text); } else { throw new Error("No se recibió una respuesta válida del modelo."); }
        } catch (err) { setError(err.message); console.error("Error al llamar a la API de Gemini:", err); } finally { setLoading(false); }
    };
    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow mt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Asistente de IA</h3>
            <p className="text-gray-600 mb-4">Usa esta herramienta para redactar comunicados, resumir textos o generar ideas.</p>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ej: Redacta un email para notificar al equipo sobre la reunión de planificación trimestral..." disabled={loading} />
            <button onClick={handleSubmit} disabled={loading || !prompt} className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-300 flex items-center justify-center">
                {loading ? ( <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Procesando...</> ) : 'Generar Respuesta'}
            </button>
            {error && <p className="mt-4 bg-red-100 text-red-700 p-3 rounded">{error}</p>}
            {response && ( <div className="mt-6 p-4 border rounded-lg bg-gray-50"><h4 className="font-semibold text-gray-700 mb-2">Respuesta del Asistente:</h4><p className="text-gray-800 whitespace-pre-wrap">{response}</p></div> )}
        </div>
    );
}

function Dashboard() {
    // Obtiene los datos de autenticación del contexto global
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    // Función para manejar el cierre de sesión
    const handleLogout = async () => {
        await auth.logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <h1 className="text-lg sm:text-xl font-bold text-gray-800">Intranet Clínica Támara</h1>
                    <div>
                        <span className="text-gray-700 mr-2 sm:mr-4 hidden md:inline">Holi, {auth.user?.name}</span>
                        <button onClick={handleLogout} className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 text-sm sm:text-base">
                            Cerrar Sesión
                        </button>
                    </div>
                </nav>
            </header>
            
            <main className="container mx-auto p-4 sm:p-6">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow">
                    <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
                    <p className="text-gray-600">¡Bienvenido a la intranet, {auth.user?.name}!</p>
                </div>

                {/* --- ESTA ES LA LÍNEA MÁS IMPORTANTE --- */}
                {/* Renderizamos el panel de admin SÓLO si el role_id del usuario es 1 (Admin Global).
                  La interrogación (?.) es "optional chaining", previene errores si 'auth.user' es nulo.
                  La comparación '===' es estricta, por eso era importante que 'role_id' fuera un número.
                */}
                {auth.user?.role_id === 1 && <DepartmentManager apiClient={apiClient} />}

                <GeminiAssistant />
            </main>
        </div>
    );
}

function ProtectedRoute({ children }) { /* ... (El componente se mantiene igual) ... */ 
    const auth = useContext(AuthContext);
    return auth.isLoggedIn ? children : <Navigate to="/login" />;
}

// --- App Principal (sin cambios) ---
export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={ <ProtectedRoute><Dashboard /></ProtectedRoute> } />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}