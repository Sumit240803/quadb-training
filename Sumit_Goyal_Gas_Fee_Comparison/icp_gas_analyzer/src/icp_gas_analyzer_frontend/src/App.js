import { html, render } from 'lit-html';
import { icp_gas_analyzer_backend } from 'declarations/icp_gas_analyzer_backend';
import logo from './logo2.svg';
import { Principal } from '@dfinity/principal';

class App {
  result = '';

  constructor() {
    this.render();
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const input = document.getElementById('canister-id');
    if (!input) return;

    const idText = input.value.trim();
    try {
      const canisterId = Principal.fromText(idText);
      this.result = await icp_gas_analyzer_backend.simulate_transfer(
        Principal.fromText("cuj6u-c4aaa-aaaaa-qaajq-cai")
      );
    } catch (err) {
      this.result = `Error: ${err.message}`;
    }

    this.render();
  };

  render() {
    const body = html`
      <main>
        <img src="${logo}" alt="DFINITY logo" />
        <br /><br />
        <form>
          <label for="canister-id">Enter Canister ID: </label>
          <input id="canister-id" type="text" placeholder="aaaaa-aa" />
          <button type="submit">Simulate Transfer</button>
        </form>
        <section id="result">${this.result}</section>
      </main>
    `;

    render(body, document.getElementById('root'));

    const form = document.querySelector('form');
    if (form) form.addEventListener('submit', this.handleSubmit);
  }
}

export default App;
