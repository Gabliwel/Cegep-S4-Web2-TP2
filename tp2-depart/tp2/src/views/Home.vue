<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <div class="col d-flex justify-content-center">
      <div class="card w-75">
        <div class="card-header">
          Game Name
        </div>
        <div class="card-body">
          <h5 class="card-title">JSP</h5>
          <select class="form-control form-control-sm">
            <option v-for="test in testSelect" v-bind:key="test.id">{{ test }}</option>
          </select>
          <br>
          <router-link v-bind:to="{ name: 'Game' }" type="button" class="btn btn-primary">Change page</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      testSelect: ['allo', 'jsp', 'test']
    }
  }
}
</script>
