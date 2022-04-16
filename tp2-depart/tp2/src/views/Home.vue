<template>
  <div class="home">
    <br>
    <div class="col d-flex justify-content-center">
      <div class="card w-75">
        <div class="card-header bg-dark text-light">
          Choose your character
        </div>
        <div class="card-body" v-if="isLoaded === false">
          <img src="@/assets/loadingWaiting.gif" alt="Chargement..." width="20"/>
        </div>
        <div class="card-body" v-if="isLoaded">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">@</span>
            </div>
            <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" v-model="name" v-bind:disabled="hasError">
          </div>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">Ship</label>
            </div>
            <select class="custom-select" v-bind:disabled="hasError" v-model="selectedShip">
              <option v-for="ship in ships" v-bind:key="ship.id">{{ ship.name }}</option>
            </select>
          </div>
          <button @click="changePage()" type="button" class="btn btn-primary" v-bind:disabled="hasError">Play</button>
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
      name: '',
      selectedShip: '',
      ships: [],
      hasError: false,
      isLoaded: false
    }
  },
  async created () {
    try {
      this.ships = await shipsService.getShips()
    } catch (error) {
      this.hasError = true
      this.makeToast(ui.Home.SERVER_ERROR, ui.SERVER_ERROR_TITLE)
    }
    this.isLoaded = true
  },
  methods: {
    makeToast (msg, title) {
      this.$bvToast.toast(msg, {
        title: title,
        autoHideDelay: 5000,
        appendToast: true,
        style: 'b-toaster-bottom-right'
      })
    },
    changePage () {
      if (this.name !== '' && this.selectedShip !== '') {
        this.$router.push({ name: 'Game', params: { name: this.name, ship: this.selectedShip } })
      } else {
        this.makeToast(ui.Home.FORM_ERROR, ui.CLIENT_ERROR_TITLE)
      }
    }
  }
}
</script>
