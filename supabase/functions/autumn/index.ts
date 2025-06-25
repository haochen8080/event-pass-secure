
import { autumnHandler } from "npm:autumn-js/supabase";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.9";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization") },
      },
    }
  );

  const { data, error } = await supabaseClient.auth.getUser();

  const handler = autumnHandler({
    corsHeaders,
    identify: async () => {
      return {
        customerId: data.user?.id,
        customerData: {
          email: data.user?.email,
        },
      };
    },
  });

  return handler(req);
});
