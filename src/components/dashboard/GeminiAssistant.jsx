import React, { useState } from 'react';

function GeminiAssistant() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!prompt) return;
        setLoading(true);
        setError('');
        setResponse('');

        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };

        try {
            const res = await fetch(apiUrl, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(payload) 
            });

            if (!res.ok) { 
                throw new Error(`Error en la API: ${res.status} ${res.statusText}`); 
            }

            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (text) { 
                setResponse(text); 
            } else { 
                throw new Error("No se recibió una respuesta válida del modelo."); 
            }
        } catch (err) { 
            setError(err.message); 
            console.error("Error al llamar a la API de Gemini:", err); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow mt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Asistente de IA</h3>
            <p className="text-gray-600 mb-4">Usa esta herramienta para redactar comunicados, resumir textos o generar ideas.</p>
            
            <textarea 
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]" 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="Ej: Redacta un email para notificar al equipo sobre la reunión de planificación trimestral..." 
                disabled={loading} 
            />
            
            <button 
                onClick={handleSubmit} 
                disabled={loading || !prompt} 
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-300 flex items-center justify-center"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                    </>
                ) : 'Generar Respuesta'}
            </button>
            
            {error && <p className="mt-4 bg-red-100 text-red-700 p-3 rounded">{error}</p>}
            
            {response && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold text-gray-700 mb-2">Respuesta del Asistente:</h4>
                    <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
                </div>
            )}
        </div>
    );
}

export default GeminiAssistant;
