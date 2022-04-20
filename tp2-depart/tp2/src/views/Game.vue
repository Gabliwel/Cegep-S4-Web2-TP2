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
                  <button id="fight" style="max-height:65%;" class="btn btn-primary" @click="fight()">Combattre</button>
                  <button id="end" style="max-height:65%;" class="btn btn-primary ml-3" @click="endFight()">Terminer</button>
                  <button id="repair" style="max-height:65%;" class="btn btn-primary btn-sm ml-3" @click="repairShip()"><pre class="text-white"> Terminer la mission et
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
                <h2 id="nbFight">{{ nbFight }}/5</h2>
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
import { ui } from '../externalization/uiTextPlugin.js'

export default {
  components: { Entity },
  mounted () {
    // if pour si on arrive sur game sans passer par home
    // donc, aussi pour les refresh sur home
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
    // if pour si on arrive sur game sans passer par home
    if (this.gameEnded === false) {
      const confirmed = await this.$bvModal.msgBoxConfirm(
        ui.Game.LEAVING_MSG,
        { okTitle: 'Continuer', cancelTitle: 'Annuler' }
      )
      if (confirmed === true) {
        next()
      }
    } else {
      next()
    }
  },
  methods: {
    async endFight () {
      if (this.nbFight === 5) {
        this.winGame()
      } else {
        this.nbFight++
        await this.selectRandomEnemy()
      }
    },
    fight () {
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
        if (this.nbFight === 5) {
          this.winGame()
        } else {
          this.selectRandomEnemy()
        }
      }
    },
    async repairShip () {
      if (this.playerHealth === 100) {
        this.makeToast(ui.Game.REPAIR_SHIP_ALREADY_MAXED, ui.IMPOSSIBLE_ACTION_ERROR_TITLE)
      } else if (this.player.credit < 5) {
        this.makeToast(ui.Game.RAPAIR_SHIP_MISSING_CG, ui.IMPOSSIBLE_ACTION_ERROR_TITLE)
      } else {
        while (this.playerHealth < 100 && this.player.credit - 5 >= 0) {
          this.player.credit -= 5
          this.playerHealth += 1
        }
        this.nbFight++
        if (this.nbFight === 5) {
          this.winGame()
        } else {
          this.selectRandomEnemy()
        }
      }
    },
    async loseGame () {
      this.gameEnded = true
      await this.makeEndingBox(ui.Game.GAME_OVER_TITLE(this.player.credit), ui.Game.GAME_OVER_CONTENT(this.enemy.name))
      this.$router.push({ name: 'Home' })
    },
    async winGame () {
      this.gameEnded = true
      let postMsg
      try {
        await rankingService.postRanking({ name: this.player.name, score: this.player.credit })
        postMsg = ui.Game.SCORE_SAVED
      } catch (error) {
        postMsg = ui.Game.SCORE_NOT_SAVED
      }
      await this.makeEndingBox(ui.Game.WINNING_TITLE(this.player.credit), postMsg)
      this.$router.push({ name: 'Scoreboard' })
    },
    async makeEndingBox (title, msg) {
      let confirmed = false
      while (confirmed !== true) {
        confirmed = await this.$bvModal.msgBoxOk(msg,
          {
            title: title,
            okTitle: ui.CONTINUE,
            noCloseOnBackdrop: true,
            noCloseOnEsc: true
          }
        )
      }
    },
    // mets un alerte sur action de refresh
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
        await this.makeEndingBox(ui.SERVER_ERROR_TITLE, ui.Game.CANT_FIND_ENEMY)
        this.$router.push({ name: 'Home' })
      }
    },
    getHitChance (exp) {
      if (exp === 1) {
        return ui.Entity.HIT_CHANCE1
      } else if (exp === 2) {
        return ui.Entity.HIT_CHANCE2
      } else if (exp === 3) {
        return ui.Entity.HIT_CHANCE3
      } else if (exp === 4) {
        return ui.Entity.HIT_CHANCE4
      }
    },
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
