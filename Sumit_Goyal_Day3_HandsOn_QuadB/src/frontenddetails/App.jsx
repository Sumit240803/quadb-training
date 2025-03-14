import { useState } from 'react';
import { project_backend } from '../../declarations/project_backend/index.js';

function App() {
  const [greeting, setGreeting] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const backendActor = await project_backend();
    console.log("backendActors",backendActor);

    const greeting = await backendActor.greet(name);
    console.log("greeting:", greeting);
    setGreeting(greeting);
    return false;
  }

  return (
    <main>
      <img src="/logo2.svg" alt="ICP-CLI logo" />
      <br />
      <br />
      <form action="#" onSubmit={handleSubmit}>
        <label htmlFor="name">Enter your name: &nbsp;</label>
        <input id="name" alt="Name" type="text" />
        <button type="submit">Click Me!</button>
      </form>
      <section id="greeting">{greeting}</section>
    </main>
  );
}

export default App;
