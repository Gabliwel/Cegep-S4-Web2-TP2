<template>
  <div class="card">
    <div class="card-header">
      <p id="name">{{ this.info.name }}</p>
    </div>
    <div class="card-body">
      <div class="bg-light d-flex justify-content-between">
        <p id="xp">Expérience: {{ this.getExperience() }}</p>
        <p id="cg">Crédit: {{ this.info.credit }}</p>
      </div>
    <p id="ship">Vaisseau: {{ this.info.ship.name }}</p>
      <div class="progress" style="height: 50px;">
        <div
          id="hp"
          class="progress-bar"
          role="progressbar"
          v-bind:style="{ width: health + '%'}"
          v-bind:aria-valuenow="health"
          aria-valuemin="0"
          aria-valuemax="100"
        >{{ this.health }}%</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ui } from '../externalization/uiTextPlugin.js'
export default {
  props: {
    info: {
      type: Object,
      default: () => ({
        name: '',
        credit: 0,
        experience: 4,
        ship: {
          name: ''
        }
      })
    },
    health: {
      type: Number,
      default: 100
    }
  },
  methods: {
    getExperience () {
      if (this.info.experience === 1) {
        return ui.Entity.NAME1
      } else if (this.info.experience === 2) {
        return ui.Entity.NAME2
      } else if (this.info.experience === 3) {
        return ui.Entity.NAME3
      } else if (this.info.experience === 4) {
        return ui.Entity.NAME4
      }
    }
  }
}
</script>
