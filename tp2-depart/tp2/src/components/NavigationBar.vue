<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <a class="navbar-brand">TP2</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse">
        <router-link class="nav-link active" v-bind:to="{ name: 'Home' }">Home</router-link>
        <router-link class="nav-link active" v-bind:to="{ name: 'Scoreboard' }">Scoreboard</router-link>
    </div>
  </nav>
</template>

<script>
export default {}
</script>
