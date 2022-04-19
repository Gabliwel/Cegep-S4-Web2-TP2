<template>
  <div class="card">
    <div class="card-header">
      {{ this.info.name }}
    </div>
    <div class="card-body">
      <div class="bg-light d-flex justify-content-between">
        <div>Expérience: {{ this.getExperience() }}</div>
        <div>Crédit: {{ this.info.credit }}</div>
      </div>
      Vaisseau: {{ this.info.ship.name }}
      <div class="progress" style="height: 50px;">
        <div
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
        return 'Débutant'
      } else if (this.info.experience === 2) {
        return 'Confirmé'
      } else if (this.info.experience === 3) {
        return 'Expert'
      } else if (this.info.experience === 4) {
        return 'Maitre'
      }
    }
  }
}
</script>
