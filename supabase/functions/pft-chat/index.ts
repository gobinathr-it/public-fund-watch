import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch live scheme data from database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [schemesRes, expensesRes, allocationsRes] = await Promise.all([
      supabase.from("schemes").select("*").order("total_budget", { ascending: false }),
      supabase.from("expenses").select("*").order("expense_date", { ascending: false }).limit(50),
      supabase.from("district_allocations").select("*"),
    ]);

    const schemes = schemesRes.data || [];
    const expenses = expensesRes.data || [];
    const allocations = allocationsRes.data || [];

    // Build dynamic context
    const formatCr = (amt: number) => `₹${(amt / 10000000).toFixed(0)} Cr`;
    const totalBudget = schemes.reduce((s: number, sc: any) => s + sc.total_budget, 0);
    const totalSpent = schemes.reduce((s: number, sc: any) => s + sc.spent, 0);

    let schemeContext = schemes.map((s: any) => {
      const pct = Math.round((s.spent / s.total_budget) * 100);
      const dists = allocations.filter((a: any) => a.scheme_id === s.id);
      const exps = expenses.filter((e: any) => e.scheme_id === s.id);
      const distStr = dists.map((d: any) => `${d.district}: Allocated ${formatCr(d.allocated)}, Spent ${formatCr(d.spent)}`).join("; ");
      const expStr = exps.slice(0, 5).map((e: any) => `${e.title} (${formatCr(e.amount)}, ${e.status}, ${e.district}, ${e.expense_date})`).join("; ");

      return `**${s.name}** (${s.name_ta || ""})
  - ID: ${s.id} | Category: ${s.category} | Status: ${s.status}
  - Department: ${s.department}
  - Budget: ${formatCr(s.total_budget)} | Spent: ${formatCr(s.spent)} (${pct}%) | Remaining: ${formatCr(s.total_budget - s.spent)}
  - Beneficiaries: ${s.target_beneficiaries || "N/A"}
  - Description: ${s.description}
  ${distStr ? `- Districts: ${distStr}` : ""}
  ${expStr ? `- Recent Expenses: ${expStr}` : ""}`;
    }).join("\n\n");

    const systemPrompt = `You are the Tamil Nadu Fund Tracker AI Assistant — a helpful, multilingual chatbot for Tamil Nadu's Public Fund & Scheme Transparency platform.

LIVE DATABASE DATA (Total: ${formatCr(totalBudget)} budget, ${formatCr(totalSpent)} spent, ${Math.round(totalSpent / totalBudget * 100)}% utilized):

${schemeContext}

Your role:
- Help citizens understand Tamil Nadu government schemes, budgets, and spending
- Answer accurately using ONLY the data above
- Respond in the SAME LANGUAGE the user writes in (Tamil, Hindi, Telugu, Malayalam, Kannada, Bengali, Marathi, English)
- Use ₹ currency and Indian formatting (Crore, Lakh)
- Use markdown: tables, bold, bullet points
- When referencing a scheme, include navigation link: [View Details](/schemes/{scheme_id})
- Suggest follow-up questions
- If asked about data not available, say so honestly
- Explain complex financial data simply for citizens`;

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
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
