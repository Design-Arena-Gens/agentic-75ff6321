'use client';

import { useMemo, useState } from 'react';
import {
  agentFunctions,
  createInitialState,
  runAgent,
  type AgentFunction,
  type AgentResponse,
  type AgentState
} from '@/lib/agent';

interface ChatMessage {
  id: string;
  author: 'user' | 'agent';
  content: string;
  timestamp: number;
  executedFunction: AgentResponse['executedFunction'];
}

const newId = () => crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const AgentConsole = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: newId(),
      author: 'agent',
      content:
        "Hey there! I\'m primed to capture todos, notes, and automations for you. Ask for 'help' anytime to see what\'s possible.",
      timestamp: Date.now(),
      executedFunction: null
    }
  ]);
  const [agentState, setAgentState] = useState<AgentState>(() => createInitialState());
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || isProcessing) {
      return;
    }

    const userMessage: ChatMessage = {
      id: newId(),
      author: 'user',
      content: input.trim(),
      timestamp: Date.now(),
      executedFunction: null
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    const response = await simulateLatency(() => runAgent(userMessage.content, agentState));

    const agentMessage: ChatMessage = {
      id: newId(),
      author: 'agent',
      content: response.reply,
      timestamp: Date.now(),
      executedFunction: response.executedFunction
    };

    setMessages((prev) => [...prev, agentMessage]);
    setAgentState(response.state);
    setIsProcessing(false);
  };

  const activeTodos = useMemo(
    () => agentState.todos.filter((todo) => !todo.done),
    [agentState.todos]
  );
  const completedTodos = useMemo(
    () => agentState.todos.filter((todo) => todo.done),
    [agentState.todos]
  );

  return (
    <div className="console-grid">
      <section className="chat-panel">
        <header>
          <div className="indicator" />
          <div>
            <h2>Agent Link</h2>
            <p>Your private operations hub</p>
          </div>
        </header>
        <div className="messages" aria-live="polite">
          {messages.map((message) => (
            <article key={message.id} className={`message ${message.author}`}>
              <div className="meta">
                <span className="author">{message.author === 'user' ? 'You' : 'Agent'}</span>
                <span className="time">{formatTime(message.timestamp)}</span>
              </div>
              <p>{message.content}</p>
              {message.executedFunction && (
                <span className="function-tag">{labelForFunction(message.executedFunction)}</span>
              )}
            </article>
          ))}
        </div>
        <form className="composer" onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Tell your agent what needs to happen…"
            disabled={isProcessing}
            aria-label="Message the agent"
          />
          <button type="submit" disabled={isProcessing || !input.trim()}>
            {isProcessing ? 'Thinking…' : 'Send'}
          </button>
        </form>
      </section>
      <aside className="context-panel">
        <section>
          <h3>Available Functions</h3>
          <ul>
            {agentFunctions.map((fn) => (
              <li key={fn.key}>
                <span className="icon" aria-hidden>{fn.icon}</span>
                <div>
                  <p className="fn-name">{fn.name}</p>
                  <p className="fn-desc">{fn.description}</p>
                  <p className="fn-sample">Try: {fn.samplePhrases[0]}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Open Tasks</h3>
          {activeTodos.length === 0 ? (
            <p className="empty">Nothing queued — add a new task.</p>
          ) : (
            <ul className="pill-list">
              {activeTodos.map((todo) => (
                <li key={todo.id}>{todo.title}</li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h3>Completed</h3>
          {completedTodos.length === 0 ? (
            <p className="empty">No finished tasks yet.</p>
          ) : (
            <ul className="pill-list muted">
              {completedTodos.map((todo) => (
                <li key={todo.id}>{todo.title}</li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h3>Notes</h3>
          {agentState.notes.length === 0 ? (
            <p className="empty">Bring ideas here for later.</p>
          ) : (
            <ul className="note-list">
              {agentState.notes.map((note) => (
                <li key={note.id}>
                  <p>{note.content}</p>
                  <small>{new Date(note.createdAt).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h3>Automations</h3>
          {agentState.automations.length === 0 ? (
            <p className="empty">Sketch trigger/action pairs to operationalize later.</p>
          ) : (
            <ul className="automation-list">
              {agentState.automations.map((automation) => (
                <li key={automation.id}>
                  <strong>{automation.name}</strong>
                  <p>
                    <span>When:</span> {automation.trigger}
                  </p>
                  <p>
                    <span>Then:</span> {automation.action}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
    </div>
  );
};

const labelForFunction = (key: AgentFunction['key']) => {
  const match = agentFunctions.find((fn) => fn.key === key);
  return match ? `${match.icon} ${match.name}` : 'Custom Action';
};

const simulateLatency = async (callback: () => AgentResponse) => {
  await new Promise((resolve) => setTimeout(resolve, 350));
  return callback();
};

export default AgentConsole;
