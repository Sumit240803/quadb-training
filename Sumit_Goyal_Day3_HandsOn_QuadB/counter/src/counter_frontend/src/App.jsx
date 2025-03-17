import { useEffect, useState } from "react";
import { createActor } from "./icp"; // Import function, not the actor

function App() {
  const [count, setCount] = useState(0);
  const [actor, setActor] = useState(null);

  useEffect(() => {
    let isMounted = true;
  
    async function init() {
      const instance = await createActor();
      if (isMounted) {
        setActor(instance);
        const result = await instance.get_count();
        console.log(result);
        setCount(Number(result));
      }
    }
  
    init();
  
    return () => { isMounted = false; };
  }, []);
  

  const increment = async () => {
    if (!actor) return;
    await actor.increment();
    const updatedCount = await actor.get_count();
    console.log(Number(updatedCount));
    setCount(Number(updatedCount));
  };

  return (
    <>
      <h1>ICP Counter</h1>
      {count ? 
      <p>Current Count: {count}</p>
     :"" }
      <button onClick={increment} disabled={!actor}>Increment</button>
    </>
  );
}

export default App;
