export const getSocialAuthSuccessHtml = (providerName: string) => `
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#fff;color:#18181b;text-align:center;padding:20px;box-sizing:border-box;">
    <div style="width:64px;height:64px;background:#10b981;border-radius:20px;display:flex;align-items:center;justify-content:center;margin-bottom:24px;box-shadow:0 10px 25px -5px rgba(16,185,129,0.3);animation:scaleIn 0.5s cubic-bezier(0.16,1,0.3,1);">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    </div>
    <h2 style="margin:0;font-size:22px;font-weight:700;letter-spacing:-0.02em;">Welcome back!</h2>
    <p style="margin:12px 0 0;font-size:15px;color:#71717a;font-weight:500;">Your sign-in via ${providerName} was successful.</p>
    <p style="margin:8px 0 0;font-size:13px;color:#a1a1aa;">This window will close automatically.</p>
    <style>
      @keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      body { margin: 0; overflow: hidden; }
    </style>
  </div>
`;
