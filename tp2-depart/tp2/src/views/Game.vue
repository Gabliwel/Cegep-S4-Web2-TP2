<template>
  <div class="content-container">
     <h1>Game</h1>
    <div class="float-left">
      <div class="card w-100">
        <div class="card-header">
         Action
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col text-center">
                <button style="max-height:65%;" class="btn btn-primary">Combattre</button>
                <button style="max-height:65%;" class="btn btn-primary ml-3">Terminer</button>
                <button style="max-height:65%;" class="btn btn-primary btn-sm ml-3"><pre class="text-white"> Terminer la mission et réparer le vaisseau</pre></button>
            </div>
          </div>
        </div>
      </div>
      <div class="card w-100">
        <div class="card-header">
        Nom: {{name}}
        </div>
        <div class="card-body">
          <div class="bg-light d-flex justify-content-between">
            <div>[Experience Joueur Here]</div>
              <div>[Credit Galactique Here]</div>
            </div>
            Vaisseau: {{ship}}
            <div class="progress position-relative">
              <div class="progress-bar" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                <small class="justify-content-center d-flex position-absolute text-dark w-100">50%</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class=float-right>
        <div class="card w-100">
          <div class="card-header">
           Mission en cours
          </div>
          <div class="card-body">
            [Mission Actuelle]/5
          </div>
        </div>
         <div class="card w-100">
        <div class="card-header">
        [Nom Enemy Here]
        </div>
        <div class="card-body">
          <div class="bg-light d-flex justify-content-between">
            <div>[Experience Enemy Here]</div>
              <div>[Credit Galactique Here]</div>
            </div>
            [Nom Vaisseau Here]
            <div class="progress position-relative">
              <div class="progress-bar" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                <small class="justify-content-center d-flex position-absolute text-dark w-100">50%</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>

export default {
  mounted () {
    this.name = this.$route.params.name
    this.ship = this.$route.params.ship
  },
  data () {
    return {
      name: '',
      ship: ''
    }
  }
}

</script>
