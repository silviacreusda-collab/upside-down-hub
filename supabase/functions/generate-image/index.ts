import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, userPhoto, userName, birthDate, recipientName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build messages based on type and whether user photo is provided
    let messages: { role: string; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }[] = [];
    
    switch (type) {
      case "foto":
        if (userPhoto) {
          // Edit mode: use user's photo
          messages = [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Transform this photo to place the person in a scene with Eleven from Stranger Things. Create an 1980s style photo composition with dark supernatural atmosphere, neon red and cyan lighting, Hawkins Indiana vibes. The person in the original photo should appear standing next to Eleven who has her iconic look. Make it look like a real photo from the show. Keep the person's face recognizable but stylize the overall image to match Stranger Things aesthetic.`
                },
                {
                  type: "image_url",
                  image_url: { url: userPhoto }
                }
              ]
            }
          ];
        } else {
          messages = [
            {
              role: "user",
              content: "Generate a dramatic photo composition showing a person posing with Eleven from Stranger Things in 1980s style, dark supernatural atmosphere with neon red and cyan lighting, cinematic composition like a movie still, Hawkins Indiana setting, high quality portrait"
            }
          ];
        }
        break;
        
      case "poster":
        const posterName = userName || "FAN";
        if (userPhoto) {
          messages = [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Create a Stranger Things style movie poster featuring the person from this photo. The poster should have:
- The text "${posterName}" in large bold red neon glowing letters at the top in the iconic Stranger Things font style
- Dark forest background with floating particles and mist
- 1980s retro horror aesthetic
- Red and cyan neon color scheme
- The person from the photo as the main character, heroically posed
- Supernatural elements like the Upside Down dimension visible
- Movie poster composition, ultra high quality`
                },
                {
                  type: "image_url",
                  image_url: { url: userPhoto }
                }
              ]
            }
          ];
        } else {
          messages = [
            {
              role: "user",
              content: `Generate a Stranger Things style movie poster with the text "${posterName}" prominently displayed in large bold red neon glowing letters at the top in the iconic Stranger Things font style. Include dark forest background with floating particles, 1980s retro aesthetic, supernatural horror vibes, silhouettes of characters, red and cyan neon color scheme, high quality movie poster artwork`
            }
          ];
        }
        break;
        
      case "tarjeta":
        const cardRecipient = recipientName || userName || "AMIGO/A";
        const cardDate = birthDate || "¡PRONTO!";
        if (userPhoto) {
          messages = [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Create a Stranger Things themed birthday invitation card featuring the person from this photo. The card should include:
- Text "¡FELIZ CUMPLEAÑOS ${cardRecipient}!" in neon red glowing letters
- The date "${cardDate}" displayed prominently
- The person from the photo styled as a Stranger Things character
- Hawkins Indiana theme with 1980s retro design
- Neon lights, dark mysterious atmosphere
- Party decorations mixed with supernatural elements
- Arcade game aesthetics
- High quality printable design, 4:3 aspect ratio`
                },
                {
                  type: "image_url",
                  image_url: { url: userPhoto }
                }
              ]
            }
          ];
        } else {
          messages = [
            {
              role: "user",
              content: `Generate a Stranger Things themed birthday invitation card with text "¡FELIZ CUMPLEAÑOS ${cardRecipient}!" in neon red glowing letters and the date "${cardDate}" displayed. Include Hawkins Indiana theme, 1980s retro design, neon lights, dark mysterious atmosphere, party decorations with supernatural elements, arcade game aesthetics, high quality printable design`
            }
          ];
        }
        break;
        
      default:
        messages = [
          {
            role: "user",
            content: "Generate artwork in Stranger Things style with 1980s retro aesthetic, neon red and cyan colors, dark supernatural atmosphere, high quality"
          }
        ];
    }

    console.log("Generating image for type:", type, "with user photo:", !!userPhoto);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages,
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de generaciones alcanzado. Espera un momento e intenta de nuevo." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos agotados. Por favor contacta al administrador." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received successfully");

    // Extract the image from the response
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textContent = data.choices?.[0]?.message?.content || "Tu creación está lista";

    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data).substring(0, 500));
      throw new Error("No se pudo generar la imagen. Intenta de nuevo.");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl,
        message: textContent 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
