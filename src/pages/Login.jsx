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
    <div className="min-h-screen flex">

      {/* GAUCHE — visuel */}
      <div className="hidden md:flex w-1/2 bg-emerald-600 flex-col justify-between p-12">
        <div className="text-white">
          <div className="text-3xl font-bold">
            saddle<span className="text-emerald-200">hub</span>
          </div>
          <div className="text-emerald-200 text-sm mt-1">Espace Pro</div>
        </div>

        <div>
          <div className="text-white text-2xl font-bold leading-snug mb-4">
            Planifie tes tournées.<br />
            Optimise tes trajets.<br />
            Gère ton activité.
          </div>
          <div className="flex flex-col gap-3 mt-6">
            {[
              { icon: '🗺', text: 'Optimisation de tournée via Google Maps' },
              { icon: '📅', text: 'Synchronisation Google Calendar' },
              { icon: '🔗', text: 'Connexion Odoo — Équin\'Equilibre' },
              { icon: '⛽', text: 'Calcul automatique du coût carburant' },
            ].map(f => (
              <div key={f.text} className="flex items-center gap-3 text-emerald-100 text-sm">
                <span className="text-lg">{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>
        </div>

        <div className="text-emerald-300 text-xs">
          © 2026 SaddleHub · Équin'Equilibre
        </div>
      </div>

      {/* DROITE — formulaire */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 bg-gray-50">
        <div className="w-full max-w-sm">

          {/* Logo mobile */}
          <div className="text-center mb-8 md:hidden">
            <div className="text-2xl font-bold text-gray-900">
              saddle<span className="text-emerald-600">hub</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="text-2xl font-bold text-gray-900">Bonjour Tammy 👋</div>
            <div className="text-sm text-gray-400 mt-1">Connecte-toi pour accéder à ton espace pro.</div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <div className="text-xs text-gray-500 font-semibold mb-1.5">Email</div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>

            <div>
              <div className="text-xs text-gray-500 font-semibold mb-1.5">Mot de passe</div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all mt-2 ${
                loading || !email || !password
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Connexion...
                </span>
              ) : 'Se connecter →'}
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-gray-400">
            Accès réservé · Équin'Equilibre
          </div>
        </div>
      </div>

    </div>
  )
}