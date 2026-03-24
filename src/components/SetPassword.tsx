import React, { useState } from 'react'
import { setPassword } from '../api/users'
import Modal from './ui/Modal'

export default function SetPassword() {
  const [password, setPasswordState] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Extract ID and Token from URL
  const queryParams = new URLSearchParams(window.location.search)
  const userId = queryParams.get('id')
  const token = queryParams.get('token')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !token) {
      setError('Invalid or missing user ID and token in URL.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await setPassword(userId, token, password)
      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set password.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f1115]">
        <Modal isOpen={true} onClose={() => window.location.href = window.location.origin} maxWidthClass="max-w-md" zIndex={10}>
          <div className="text-center px-2 py-4">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/20">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Success!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10 font-medium">Your password has been set successfully. You can now log in to your account.</p>
            <button 
              onClick={() => window.location.href = window.location.origin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all"
            >
              Go to Login
            </button>
          </div>
        </Modal>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1115]">
      <Modal isOpen={true} onClose={() => window.location.href = window.location.origin} maxWidthClass="max-w-[420px]" zIndex={10}>
        <div className="mb-10 text-center relative z-10 pt-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-xl shadow-blue-500/20 text-white mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2 className="text-[28px] font-extrabold text-gray-900 dark:text-white tracking-tight">Set Password</h2>
          <p className="mt-2 text-[14px] text-gray-500 dark:text-gray-400 font-medium">Secure your account by creating a new password.</p>
        </div>

        {(!userId || !token) && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-semibold text-center relative z-10">
            Invalid or missing user ID and token in URL. Please check your link.
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-semibold relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10 px-2 pb-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700/50 rounded-xl px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all custom-input shadow-sm dark:shadow-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPasswordState(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Confirm Password</label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700/50 rounded-xl px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all custom-input shadow-sm dark:shadow-none"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !userId || !token}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Set Password'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
