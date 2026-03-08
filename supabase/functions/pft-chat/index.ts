import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SCHEME_DATA = `
You have access to the following government scheme data for India's Public Fund Transparency platform:

## Active Schemes (FY 2024-26)

1. **Pradhan Mantri Gram Sadak Yojana** (Infrastructure)
   - Department: Ministry of Rural Development | State: Maharashtra
   - Budget: ₹10,000 Cr | Spent: ₹6,500 Cr (65%) | Remaining: ₹3,500 Cr
   - Districts: Pune (₹1,500Cr/₹1,100Cr), Nagpur (₹1,200Cr/₹800Cr), Nashik (₹1,000Cr/₹720Cr), Aurangabad (₹900Cr/₹650Cr), Thane (₹800Cr/₹600Cr)
   - Key expenses: Road construction Phase 1 (₹250Cr, Verified), Bridge construction Nashik (₹180Cr, Verified), Material procurement (₹95Cr, Pending)

2. **National Health Mission** (Healthcare)
   - Department: Ministry of Health | State: Karnataka
   - Budget: ₹8,000 Cr | Spent: ₹4,200 Cr (52.5%) | Remaining: ₹3,800 Cr
   - Districts: Bengaluru (₹2,000Cr/₹1,200Cr), Mysuru (₹1,200Cr/₹700Cr), Hubli (₹800Cr/₹500Cr)
   - Key expenses: Hospital equipment (₹320Cr, Verified), Staff training (₹45Cr, Flagged)

3. **Samagra Shiksha Abhiyan** (Education)
   - Department: Ministry of Education | State: Tamil Nadu
   - Budget: ₹5,000 Cr | Spent: ₹1,800 Cr (36%) | Remaining: ₹3,200 Cr
   - Districts: Chennai (₹1,200Cr/₹500Cr), Coimbatore (₹800Cr/₹350Cr), Madurai (₹600Cr/₹280Cr)

4. **PM Kisan Samman Nidhi** (Agriculture)
   - Department: Ministry of Agriculture | State: Uttar Pradesh
   - Budget: ₹12,000 Cr | Spent: ₹9,800 Cr (81.7%) | Remaining: ₹2,200 Cr
   - Districts: Lucknow (₹2,500Cr/₹2,100Cr), Varanasi (₹2,000Cr/₹1,800Cr), Agra (₹1,500Cr/₹1,300Cr)

5. **Swachh Bharat Mission** (Welfare)
   - Department: Ministry of Housing | State: Gujarat
   - Budget: ₹6,000 Cr | Spent: ₹3,100 Cr (51.7%) | Remaining: ₹2,900 Cr
   - Districts: Ahmedabad (₹1,200Cr/₹700Cr), Surat (₹1,000Cr/₹600Cr), Vadodara (₹800Cr/₹450Cr)

**Total across all schemes: ₹41,000 Cr budget, ~₹25,400 Cr spent (62%)**

## Department Spending Summary (₹ Crore)
- Rural Development: Allocated 15,000 / Spent 9,800
- Health & Family Welfare: Allocated 12,000 / Spent 7,200
- Education: Allocated 10,000 / Spent 5,800
- Agriculture: Allocated 18,000 / Spent 14,200
- Housing & Urban Affairs: Allocated 8,000 / Spent 4,500
- Social Justice: Allocated 6,000 / Spent 3,200
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are the PFT India AI Assistant — a helpful, multilingual chatbot for India's Public Fund Transparency platform.

Your role:
- Help citizens understand how government funds are allocated and spent
- Answer questions about schemes, budgets, expenses, districts, and departments
- Explain complex financial data in simple, citizen-friendly language
- Respond in the SAME LANGUAGE the user writes in (Tamil, Hindi, Telugu, Malayalam, Kannada, Bengali, Marathi, English, or any other language)
- Use ₹ currency symbol and Indian number formatting (Crore, Lakh)
- When showing financial data, use markdown tables and bullet points for clarity
- Suggest relevant follow-up questions
- When a scheme or page exists on the platform, suggest navigation links like: [View Scheme Details](/schemes/1)

${SCHEME_DATA}

Guidelines:
- Be concise but thorough
- Use markdown formatting for readability
- Include specific numbers and percentages when available
- If asked about something not in your data, say so honestly
- Always maintain a helpful, transparent tone befitting a government transparency platform`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
