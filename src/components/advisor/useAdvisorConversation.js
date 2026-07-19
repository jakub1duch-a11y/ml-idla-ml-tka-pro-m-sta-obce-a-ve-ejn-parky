import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function useAdvisorConversation() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const unsubscribe = useRef(null);
  useEffect(() => () => unsubscribe.current?.(), []);
  const send = async (text) => {
    if (!text.trim() || loading) return;
    setLoading(true); setError('');
    try {
      let active = conversation;
      if (!active) {
        active = await base44.agents.createConversation({ agent_name: 'produktovy_poradce', metadata: { name: 'Webový poradce' } });
        setConversation(active);
        unsubscribe.current = base44.agents.subscribeToConversation(active.id, (data) => { setMessages(data.messages || []); setLoading(false); });
      }
      await base44.agents.addMessage(active, { role: 'user', content: text.trim() });
    } catch (err) { setError('Poradce se nyní nepodařilo spustit. Zkuste to prosím znovu.'); setLoading(false); }
  };
  return { messages, loading, error, send };
}