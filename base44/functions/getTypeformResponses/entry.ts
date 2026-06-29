import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { formId, limit = 100 } = body;

    if (!formId) {
      return Response.json({ error: 'formId required' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('typeform');

    // Get form responses from Typeform API
    const res = await fetch(`https://api.typeform.com/forms/${formId}/responses?page_size=${Math.min(limit, 1000)}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!res.ok) {
      return Response.json({ error: `Typeform API error: ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    const responses = (data.items || []).map(item => {
      const answers = {};
      (item.answers || []).forEach(ans => {
        if (ans.type === 'text') answers[ans.field.id] = ans.text;
        else if (ans.type === 'choice') answers[ans.field.id] = ans.choice.label;
        else if (ans.type === 'rating') answers[ans.field.id] = ans.number;
        else if (ans.type === 'email') answers[ans.field.id] = ans.email;
      });
      return {
        id: item.response_id,
        submitted_at: item.submitted_at,
        answers,
      };
    });

    return Response.json({ responses, total: data.total_items || responses.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});