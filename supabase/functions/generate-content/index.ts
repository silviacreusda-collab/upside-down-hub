import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Generate news and theories with AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Eres un periodista experto en Stranger Things. Genera contenido original y creativo para una comunidad de fans en España. 
Responde SOLO con JSON puro, sin markdown ni backticks.`,
          },
          {
            role: "user",
            content: `Genera exactamente 3 artículos nuevos sobre Stranger Things. Mezcla noticias inventadas pero realistas, teorías de fans y curiosidades.
Responde SOLO con este formato JSON (sin markdown):
[
  {
    "content_type": "news",
    "title": "título atractivo",
    "excerpt": "resumen de 1-2 frases",
    "content": "artículo completo de 3-4 párrafos separados por \\n\\n",
    "category": "una de: Exclusiva, Teoría, Curiosidad, Análisis, Comunidad",
    "trending": true o false (solo 1 puede ser true)
  }
]`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("AI error:", response.status, text);
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    
    if (!content) throw new Error("No content from AI");

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const articles = JSON.parse(jsonMatch[0]);

    // Insert into database
    const { error: insertError } = await supabase
      .from("ai_generated_content")
      .insert(articles);

    if (insertError) throw insertError;

    // Keep only latest 20 articles to avoid bloat
    const { data: allArticles } = await supabase
      .from("ai_generated_content")
      .select("id")
      .order("created_at", { ascending: false });

    if (allArticles && allArticles.length > 20) {
      const idsToDelete = allArticles.slice(20).map((a: any) => a.id);
      await supabase
        .from("ai_generated_content")
        .delete()
        .in("id", idsToDelete);
    }

    return new Response(JSON.stringify({ success: true, count: articles.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-content error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
