<script setup>
import { ref } from 'vue';
import { project_backend } from '../../declarations/project_backend/index.js';
let greeting = ref('');

async function handleSubmit(e) {
  e.preventDefault();
  event.preventDefault();
  
  try {
    const name = event.target.elements.name.value;
    const backendActor = await project_backend();
    console.log("backendActor:", backendActor);

    const response = await backendActor?.greet(name);
    console.log("greeting:", response);

    greeting.value = response;
  } catch (error) {
    console.error("Error in handleSubmit:", error);
  }
}
</script>

<template>
  <main>
    <img src="/logo2.svg" alt="ICP-CLI logo" />
    <br />
    <br />
    <form action="#" @submit="handleSubmit">
      <label for="name">Enter your name: &nbsp;</label>
      <input id="name" alt="Name" type="text" />
      <button type="submit">Click Me!</button>
    </form>
    <section id="greeting">{{ greeting }}</section>
  </main>
</template>
