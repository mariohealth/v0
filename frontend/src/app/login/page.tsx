'use client';

import { useAuth } from '@/lib/contexts/AuthContext';

export default function LoginPage() {
  const { user, loading, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        
        {user ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600">Signed in as:</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {user.displayName || user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-gray-600">Sign in to your account</p>
            <button
              onClick={handleLogin}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

