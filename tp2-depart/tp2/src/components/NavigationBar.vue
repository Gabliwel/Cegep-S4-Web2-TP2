<template>
  <nav class="navbar navbar-light" style="background-color: #e3f2fd;">
    <router-link v-bind:to="{ name: 'Home' }">Home</router-link>
    <router-link v-bind:to="{ name: 'Scoreboard' }">Scoreboard</router-link>
  </nav>
</template>

<script>
export default {}
</script>
