export const getSocialAuthSuccessHtml = (providerName: string) => `
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#fff;color:#18181b;text-align:center;padding:24px;box-sizing:border-box;">
    <!-- Nature Theme Glow Effect -->
    <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg, #57934a 0%, #346739 100%);"></div>

    <!-- Animated Brand Green Check Circle -->
    <div style="width:72px;height:72px;background:#346739;border-radius:24px;display:flex;align-items:center;justify-content:center;margin-bottom:32px;box-shadow:0 12px 30px -8px rgba(52,103,57,0.4);animation:natureSpring 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>

    <h2 style="margin:0;font-size:24px;font-weight:800;letter-spacing:-0.03em;color:#142816;">Authenticated!</h2>
    <p style="margin:16px 0 0;font-size:16px;color:#526052;font-weight:600;line-height:1.5;">Your sign-in via <strong>${providerName}</strong> was successful.</p>
    <p style="margin:12px 0 0;font-size:14px;color:#a1b0a1;font-weight:500;">Returning you to BikDocs now...</p>

    <div style="margin-top:40px;display:flex;gap:4px;">
      <div style="width:6px;height:6px;border-radius:50%;background:#346739;opacity:0.2;animation:dotWave 1.4s infinite ease-in-out both;"></div>
      <div style="width:6px;height:6px;border-radius:50%;background:#346739;opacity:0.2;animation:dotWave 1.4s infinite ease-in-out both;animation-delay:0.16s;"></div>
      <div style="width:6px;height:6px;border-radius:50%;background:#346739;opacity:0.2;animation:dotWave 1.4s infinite ease-in-out both;animation-delay:0.32s;"></div>
    </div>

    <style>
      @keyframes natureSpring { 
        0% { transform: scale(0.6); opacity: 0; } 
        100% { transform: scale(1); opacity: 1; } 
      }
      @keyframes dotWave {
        0%, 80%, 100% { transform: scale(0); } 
        40% { transform: scale(1); opacity: 1; }
      }
      body { margin: 0; overflow: hidden; background: #fdfdfd; }
    </style>
  </div>
`;
