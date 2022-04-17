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
          <Entity v-bind:info="this.player" v-bind:health="this.playerHealth" />
        </div>
        <div class="col">
          <Entity v-bind:info="this.enemy" v-bind:health="this.enemyHealth" />
        </div>
      </div>
    </div>
  </template>

<script>
import { rankingService } from '../services/rankingService.js'
import { charactersService } from '../services/charactersService.js'
import Entity from '../components/Entity.vue'

export default {
  components: { Entity },
  mounted () {
    if (this.$route.params.name === undefined || this.$route.params.ship === undefined) {
      this.gameEnded = true
      this.$router.push({ name: 'Home' })
    } else {
      this.player = {
        name: this.$route.params.name,
        credit: 0,
        experience: 4,
        ship: {
          name: this.$route.params.ship
        }
      }
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
      player: {
        name: '',
        credit: 0,
        experience: 4,
        ship: {
          name: ''
        }
      },
      enemy: {
        name: '',
        credit: 0,
        experience: 4,
        ship: {
          name: ''
        }
      },
      playerHealth: 100,
      enemyHealth: 100,
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
        this.winGame()
      } else {
        this.nbFight++
        await this.selectRandomEnemy()
      }
    },
    figth () {
      const playerAttack = (Math.random() < this.getHitChance(this.player.experience))
      const enemyAttack = (Math.random() < this.getHitChance(this.enemy.experience))
      if (playerAttack === true) {
        this.enemyHealth -= Math.floor(Math.random() * 6) + 3
      }
      if (enemyAttack === true) {
        this.playerHealth -= Math.floor(Math.random() * 6) + 3
      }
      if (this.playerHealth <= 0) {
        this.loseGame()
      } else if (this.enemyHealth <= 0) {
        this.player.credit += this.enemy.credit
        this.nbFight++
        this.selectRandomEnemy()
        if (this.nbFight === 5) {
          this.winGame()
        }
      }
    },
    async loseGame () {
      this.gameEnded = true
      await this.makeEndingBox('Défaite... (Score final: ' + this.player.credit + ')', 'Vous avez été tué par ' + this.enemy.name)
      this.$router.push({ name: 'Home' })
    },
    async winGame () {
      this.gameEnded = true
      let postMsg
      try {
        await rankingService.postRanking({ name: this.player.name, score: this.player.credit })
        postMsg = 'Score bien sauvegardé!'
      } catch (error) {
        postMsg = 'Impossbile de sauvegarder le score!'
      }
      await this.makeEndingBox('Victoire! (Score final: ' + this.player.credit + ')', postMsg)
      this.$router.push({ name: 'Scoreboard' })
    },
    async makeEndingBox (title, msg) {
      let confirmed = false
      while (confirmed !== true) {
        confirmed = await this.$bvModal.msgBoxOk(msg,
          {
            title: title,
            okTitle: 'Continuer',
            noCloseOnBackdrop: true,
            noCloseOnEsc: true
          }
        )
      }
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
        this.enemy = enemy[0]
        this.enemyHealth = 100
      } catch (error) {
        this.gameEnded = true
        await this.makeEndingBox('Erreur serveur', "Impossible de trouvez des ennemies, redirection vers l'accueil")
        this.$router.push({ name: 'Home' })
      }
    },
    getHitChance (exp) {
      if (exp === 1) {
        return 0.2
      } else if (exp === 2) {
        return 0.35
      } else if (exp === 3) {
        return 0.5
      } else if (exp === 4) {
        return 0.7
      }
    }
  }
}
</script>
