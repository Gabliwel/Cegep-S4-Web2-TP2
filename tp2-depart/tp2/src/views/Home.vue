<template>
  <div class="home">
    <br>
    <div class="col d-flex justify-content-center">
      <div class="card w-75">
        <div class="card-header">
          Game Name
        </div>
        <div class="card-body">
          <h5 class="card-title">JSP</h5>
          <select class="form-control form-control-sm">
            <option v-for="ship in ships" v-bind:key="ship.id">{{ ship.name }}</option>
          </select>
          <br>
          <router-link v-bind:to="{ name: 'Game' }" type="button" class="btn btn-primary" :class="{ disabled: hasError }">Change page</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { shipsService } from '../services/shipsService.js'
import { ui } from '../externalization/uiTextPlugin.js'

export default {
  data () {
    return {
      ships: [],
      hasError: false
    }
  },
  async created () {
    try {
      this.ships = await shipsService.getShips()
    } catch (error) {
      this.hasError = true
      this.makeToast(ui.Home.SERVER_ERROR, ui.SERVER_ERROR_TITLE)
    }
  },
  methods: {
    makeToast (msg, title) {
      this.$bvToast.toast(msg, {
        title: title,
        autoHideDelay: 5000,
        appendToast: true,
        style: 'b-toaster-bottom-right'
      })
    }
  }
}
</script>
