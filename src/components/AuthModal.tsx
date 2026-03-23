import React, { useState, useEffect } from 'react'
import { createUser, loginUser, User } from '../api/users'
import Modal from './ui/Modal'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode: 'signin' | 'signup'
  onAuthSuccess: (user: User) => void
}

export default function AuthModal({ isOpen, onClose, initialMode, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setEmail('')
      setName('')
      setPassword('')
    }
  }, [isOpen, initialMode])

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-[380px]" zIndex={10000}>
      {/* Header */}
          <div className="text-center mb-8 relative z-10 mt-6">
            <h2 className="text-[26px] tracking-tight mb-1.5">
              <span className="font-semibold text-zinc-900 dark:text-white">
                {mode === 'signin' ? 'Welcome ' : 'Create '}
              </span>
              <span className="font-normal text-zinc-500 dark:text-zinc-400">
                {mode === 'signin' ? 'back' : 'account'}
              </span>
            </h2>
            <p className="text-[14px] text-zinc-500 font-medium">
              {mode === 'signin' ? 'Sign in to your account' : 'Start syncing your documents'}
            </p>
          </div>

          <form 
            className="space-y-4 relative z-10" 
            onSubmit={async (e) => { 
              e.preventDefault(); 
              if (mode === 'signup') {
                try {
                  await createUser({ name, email });
                  alert(`A set-password link has been sent to ${email}.`);
                  onClose();
                } catch (error) {
                  alert(`Error: ${error instanceof Error ? error.message : 'Signup failed'}`);
                }
              } else {
                try {
                  const response = await loginUser({ email, password });
                  const data = response as any;
                  if (data.token) {
                    localStorage.setItem('token', data.token);
                    onAuthSuccess({ id: data.userId || 'unknown', name: email.split('@')[0], email });
                    onClose();
                  } else throw new Error('No token received');
                } catch (error) {
                  alert(`Error: ${error instanceof Error ? error.message : 'Invalid credentials'}`);
                }
              }
            }}
          >
            {mode === 'signup' && (
              <div className="relative group">
                <input
                  type="text"
                  required
                  className="w-full bg-white dark:bg-[#181A1F] border border-zinc-200/80 dark:border-zinc-800/50 outline-none text-zinc-900 dark:text-white text-[14px] font-medium placeholder-zinc-400 dark:placeholder-zinc-500 rounded-2xl h-[56px] px-5 focus:border-blue-500/50 dark:focus:border-blue-500/50 transition-colors shadow-sm dark:shadow-none"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="relative group mt-2">
              <div className="absolute top-2 left-5 text-[10px] font-medium text-zinc-400 dark:text-zinc-500 pointer-events-none z-10">Email</div>
              <input
                type="email"
                required
                className="w-full bg-white dark:bg-[#181A1F] border border-zinc-200/80 dark:border-zinc-800/50 outline-none text-zinc-900 dark:text-white text-[14px] font-medium placeholder-zinc-400 dark:placeholder-zinc-500 rounded-full h-[60px] pt-4 px-5 focus:border-blue-500/50 dark:focus:border-blue-500/50 transition-colors custom-input shadow-sm dark:shadow-none"
                placeholder="username@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {mode === 'signup' && (
                <button type="submit" className="absolute right-[6px] top-[6px] bottom-[6px] w-[48px] rounded-full bg-blue-500 hover:bg-blue-400 transition-colors flex items-center justify-center text-white shadow-[0_4px_14px_rgba(59,130,246,0.3)]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              )}
            </div>

            {mode === 'signin' && (
              <div className="relative group">
                <div className="absolute top-2 left-5 text-[10px] font-medium text-zinc-400 dark:text-zinc-500 pointer-events-none z-10">Password</div>
                <input
                  type="password"
                  required
                  className="w-full bg-white dark:bg-[#181A1F] border border-zinc-200/80 dark:border-zinc-800/50 outline-none text-zinc-900 dark:text-white text-[14px] font-medium placeholder-zinc-400 dark:placeholder-zinc-500 rounded-full h-[60px] pt-4 px-5 focus:border-blue-500/50 dark:focus:border-blue-500/50 transition-colors custom-input shadow-sm dark:shadow-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="absolute right-[6px] top-[6px] bottom-[6px] w-[48px] rounded-full bg-blue-500 hover:bg-blue-400 transition-colors flex items-center justify-center text-white shadow-[0_4px_14px_rgba(59,130,246,0.3)]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="flex items-center my-6 relative z-10 opacity-40">
            <div className="flex-1 border-t border-zinc-300 dark:border-zinc-700"></div>
            <span className="px-3 text-[10px] font-medium text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">Or</span>
            <div className="flex-1 border-t border-zinc-300 dark:border-zinc-700"></div>
          </div>

          {/* Social Logins */}
          <div className="space-y-3 relative z-10 mb-8">
            <button type="button" className="w-full h-[52px] rounded-[16px] bg-white dark:bg-[#14161A] hover:bg-zinc-50 dark:hover:bg-[#1A1C20] border border-zinc-200 dark:border-zinc-800/80 shadow-sm dark:shadow-none transition-colors flex items-center justify-between px-5 group">
              <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">Continue with Google</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800/40 flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
            </button>

            <button type="button" className="w-full h-[52px] rounded-[16px] bg-white dark:bg-[#14161A] hover:bg-zinc-50 dark:hover:bg-[#1A1C20] border border-zinc-200 dark:border-zinc-800/80 shadow-sm dark:shadow-none transition-colors flex items-center justify-between px-5 group">
              <div className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-900 dark:text-white">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                </svg>
                <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">Continue with X</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800/40 flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
            </button>
          </div>

          {/* Footer Text */}
          <div className="text-center relative z-10 pb-2">
            <p className="text-[12px] text-zinc-500 dark:text-zinc-400 font-medium">
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                className="text-blue-500 dark:text-blue-400 font-semibold hover:text-blue-400 transition-colors"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
    </Modal>
  )
}
