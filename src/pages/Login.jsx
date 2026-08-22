import { useState } from 'react'
import { supabase } from '../services/supabase'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou mot de passe incorrect')
    } else {
      onLogin(data.user)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-gray-900">
            saddle<span className="text-emerald-600">hub</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">Espace Pro — Tammy</div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-1">Email</div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tammy@equinequilibre.com"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-1">Mot de passe</div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 outline-none focus:border-emerald-400"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {error && (
            <div className="text-xs text-red-500 bg-red-50 rounded-lg p-2.5">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
              loading || !email || !password
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          Accès réservé à Tammy · Équin'Equilibre
        </div>
      </div>
    </div>
  )
}