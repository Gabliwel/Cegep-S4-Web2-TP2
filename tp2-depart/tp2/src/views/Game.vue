<template>
  <div class="content-container">
     <h1>Game</h1>
      <div class="row mt-5 px-4">
        <div class="col-7">
          <div class="card h-100">
            <div class="card-header">
              Action
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col text-center">
                  <button style="max-height:65%;" class="btn btn-primary">Combattre</button>
                  <button style="max-height:65%;" class="btn btn-primary ml-3">Terminer</button>
                  <button style="max-height:65%;" class="btn btn-primary btn-sm ml-3"><pre class="text-white"> Terminer la mission et
réparer le vaisseau</pre></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card h-100">
              <div class="card-header">
                Mission en cours
              </div>
              <div class="card-body">
                [Mission Actuelle]/5
              </div>
            </div>
          </div>
        </div>
      <div class="row mt-5 px-4">
        <div class="col">
          <Joueur :name="this.$route.params.name" :ship="this.$route.params.ship"></Joueur>
        </div>
        <div class="col">
          <Enemy> </Enemy>
        </div>
      </div>
    </div>
</template>

<script>
import Joueur from '../components/Joueur.vue'
import Enemy from '../components/Enemy.vue'
export default {
  components: { Joueur, Enemy },
  async beforeRouteLeave (to, from, next) {
    if (this.avoidRouteLeave === false) {
      const confirmed = await this.$bvModal.msgBoxConfirm(
        'Confirmer le changement de page ? Vos données seront perdue.',
        { cancelTitle: 'Revenir', okTitle: 'Continuer' }
      )
      if (confirmed === true) {
        next()
      }
    } else {
      next()
    }
  }
}
</script>
