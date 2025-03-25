import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CounterApp } from "../target/types/counter_app";
import { assert } from "chai";

describe("counter_app", () => {
  // Set up the provider and program
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.CounterApp as Program<CounterApp>;

  let counterAccount = anchor.web3.Keypair.generate();

  it("Initializes the counter", async () => {
    await program.rpc.initialize({
      accounts: {
        counter: counterAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [counterAccount],
    });

    const counter = await program.account.counter.fetch(counterAccount.publicKey);
    assert.equal(counter.count.toNumber(), 0, "Counter should be initialized to 0");
  });

  it("Increments the counter", async () => {
    await program.rpc.increment({
      accounts: {
        counter: counterAccount.publicKey,
      },
    });

    const counter = await program.account.counter.fetch(counterAccount.publicKey);
    assert.equal(counter.count.toNumber(), 1, "Counter should increment to 1");
  });
});
