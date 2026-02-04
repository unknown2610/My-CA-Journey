import React, { useState } from 'react';
import { UserCircle, Lock, UserPlus, LogIn, GraduationCap, Loader2 } from 'lucide-react';
import { loginUser, signupUser, setCurrentUserLocal } from '../utils/userStorage';

interface AuthProps {
    onLogin: (username: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!username || !password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                const result = await loginUser({ username, passwordHash: password });
                if (result.success) {
                    setCurrentUserLocal(username);
                    onLogin(username);
                } else {
                    setError(result.error || 'Invalid username or password');
                }
            } else {
                const result = await signupUser({ username, passwordHash: password });
                if (result.success) {
                    setCurrentUserLocal(username);
                    onLogin(username);
                } else {
                    setError(result.error || 'Failed to create account');
                }
            }
        } catch (err) {
            setError('Server error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700 transition-all duration-500">
                <div className="text-center mb-8">
                    <div className="bg-icai-blue w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <GraduationCap className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My CA Journey</h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {isLogin ? 'Welcome back, Future CA!' : 'Start your professional path today'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30 animate-shake">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Username</label>
                        <div className="relative">
                            <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-icai-blue outline-none transition-all disabled:opacity-50"
                                placeholder="Enter your username"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-icai-blue outline-none transition-all disabled:opacity-50"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-icai-blue text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-900 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : isLogin ? (
                            <LogIn className="w-5 h-5" />
                        ) : (
                            <UserPlus className="w-5 h-5" />
                        )}
                        {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>


                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 font-bold text-icai-blue hover:underline underline-offset-4"
                        >
                            {isLogin ? 'Create one now' : 'Sign in instead'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
