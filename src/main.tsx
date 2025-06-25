
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AutumnProvider } from 'autumn-js/react'
import { supabase } from '@/integrations/supabase/client'

createRoot(document.getElementById("root")!).render(
  <AutumnProvider
    backendUrl={`https://gufhkckyeislippjubob.supabase.co/functions/v1/autumn`}
    includeCredentials={false}
    getBearerToken={async () => {
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token;
    }}
  >
    <App />
  </AutumnProvider>
);
