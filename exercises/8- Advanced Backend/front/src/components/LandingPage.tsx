export const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a UAP Web Development</h1>
      <p className="text-lg mb-8">Explora el TO-DO y sus funcionalidades avanzadas de backend.</p>
      <a
        href="/login"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Iniciar Sesión
      </a>
    </div>
  );
};