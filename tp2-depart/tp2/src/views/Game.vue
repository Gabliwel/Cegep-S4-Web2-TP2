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
                  <button style="max-height:65%;" class="btn btn-primary" @click="figth()">Combattre</button>
                  <button style="max-height:65%;" class="btn btn-primary ml-3" @click="endFigth()">Terminer</button>
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
                {{ nbFight }}/5
              </div>
            </div>
          </div>
        </div>
      <div class="row mt-5 px-4">
        <div class="col">
          <div class="card">
            <div class="card-header">
            Nom: {{name}}
            </div>
            <div class="card-body">
              <div class="bg-light d-flex justify-content-between">
                <div>[Experience Joueur Here]</div>
                <div>Credit Galactique: {{ score }}</div>
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
        <div class="col">
          <div class="card">
            <div class="card-header">
              Nom Enemy: {{ enemyName }}
            </div>
            <div class="card-body">
              <div class="bg-light d-flex justify-content-between">
                <div>Experience Enemy: {{ enemyExp }}</div>
                <div>Credit Galactique: {{ enemyCredit }}</div>
              </div>
                Nom Vaisseau: {{ enemyShip }}
              <div class="progress position-relative">
                <div class="progress-bar" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                  <small class="justify-content-center d-flex position-absolute text-dark w-100">50%</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
import { rankingService } from '../services/rankingService.js'
import { charactersService } from '../services/charactersService.js'

export default {
  mounted () {
    this.name = this.$route.params.name
    this.ship = this.$route.params.ship
    if (this.name === undefined || this.ship === undefined) {
      this.gameEnded = true
      this.$router.push({ name: 'Home' })
    }
  },
  beforeMount () {
    // mets un alerte sur action de refresh
    window.addEventListener('beforeunload', this.preventNav)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('beforeunload', this.preventNav)
    })
  },
  async created () {
    await this.selectRandomEnemy()
  },
  data () {
    return {
      name: '',
      ship: '',
      enemyName: '',
      enemyShip: '',
      enemyCredit: '',
      enemyExp: '',
      score: 0,
      nbFight: 1,
      gameEnded: false
    }
  },
  async beforeRouteLeave (to, from, next) {
    if (this.gameEnded === false) {
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
  },
  methods: {
    async endFigth () {
      if (this.nbFight === 5) {
        this.gameEnded = true
        let postMsg
        try {
          await rankingService.postRanking({ name: this.name, score: this.score })
          postMsg = 'Score bien sauvegardé!'
        } catch (error) {
          postMsg = 'Impossbile de sauvegarder le score!'
        }
        let confirmed = false
        while (confirmed !== true) {
          confirmed = await this.$bvModal.msgBoxOk(postMsg,
            {
              title: 'Victoire! (Score final: ' + this.score + ')',
              okTitle: 'Continuer',
              noCloseOnBackdrop: true,
              noCloseOnEsc: true
            }
          )
        }
        this.$router.push({ name: 'Scoreboard' })
      } else {
        this.nbFight++
        await this.selectRandomEnemy()
      }
    },
    figth () {
      console.log('fight')
    },
    preventNav (event) {
      event.preventDefault()
      event.returnValue = ''
    },
    async selectRandomEnemy () {
      try {
        const nbEnnemy = await charactersService.getNbCharacters()
        const rand = Math.floor(Math.random() * (nbEnnemy - 1 + 1) + 1)
        const enemy = await charactersService.getCharacter(rand)
        this.enemyName = enemy[0].name
        this.enemyShip = enemy[0].ship.name
        this.enemyExp = this.getExperience(enemy[0].experience)
        this.enemyCredit = enemy[0].credit
      } catch (error) {
        console.log('error')
      }
    },
    getExperience (experienceValue) {
      if (experienceValue === 1) {
        return 'Débutant'
      } else if (experienceValue === 2) {
        return 'Confirmé'
      } else if (experienceValue === 3) {
        return 'Expert'
      } else if (experienceValue === 4) {
        return 'Maitre '
      } else {
        console.log('error')
      }
    }
  }
}
</script>
