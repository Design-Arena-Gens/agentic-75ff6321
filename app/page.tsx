import AgentConsole from '@/components/AgentConsole';

const HomePage = () => (
  <main className="page">
    <section className="hero">
      <p className="badge">Personal Ops Agent</p>
      <h1>Delegate the busywork.</h1>
      <p className="lead">
        Give your agent natural instructions. It will structure todos, capture notes, and map automations so
        you can ship faster.
      </p>
      <div className="cta-row">
        <span className="cta-primary">Ready for your next move</span>
        <span className="cta-secondary">Type a request to get started →</span>
      </div>
    </section>
    <AgentConsole />
  </main>
);

export default HomePage;
