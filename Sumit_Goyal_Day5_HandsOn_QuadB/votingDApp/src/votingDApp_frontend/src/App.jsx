import { useEffect, useState } from "react";
import { createActor } from "./icp";

function App() {
  const [actor, setActor] = useState(null);
  const [option, setOption] = useState("");
  const [votes, setVotes] = useState([]); // ✅ FIXED: Store as an array

  async function fetchResults() {
    const instance = await createActor();
    console.log(instance);

    if (instance) {
      setActor(instance);
      const results = await instance.get_results();
      console.log("results", results);

      if (!Array.isArray(results)) {
        console.error("Invalid results format:", results);
        return;
      }

      const formattedResults = results.map(([name, voteCount]) => ({
        name,
        votes: Number(voteCount.toString()), // ✅ FIXED: BigInt to Number
      }));

      setVotes(formattedResults);
    }
  }

  useEffect(() => {
    fetchResults();
  }, []);

  async function castVotes() {
    if (option.trim()) {
      await actor.vote(option);
      setOption("");
      fetchResults();
    }
  }

  return (
    <div className="container">
      <h1>Voting DApp</h1>

      <input
        type="text"
        placeholder="Enter Option"
        value={option}
        onChange={(e) => setOption(e.target.value)}
      />
      <button onClick={castVotes}>Vote</button>

      <h2>Results</h2>
      <ul>
        {votes.length > 0 ? (
          votes.map((res, index) => (
            <li key={index}>
              {res.name}: {res.votes} votes
            </li>
          ))
        ) : (
          <p>No votes yet.</p>
        )}
      </ul>
    </div>
  );
}

export default App;
