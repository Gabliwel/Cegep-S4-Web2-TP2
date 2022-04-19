<template>
  <div class="card">
    <div class="card-header">
      {{this.getName()}}
    </div>
    <div class="card-body">
      <div class="bg-light d-flex justify-content-between">
        <div>{{this.getMaitriseText()}}</div>
        <div>{{this.getCreditGalactique()}}</div>
        </div>
        {{this.getShip()}}
        <div class="progress position-relative">
        <div id="life-bar-e" class="progress-bar" role="progressbar" style="width: 33%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
          <small class="justify-content-center d-flex position-absolute text-dark w-100">{{this.getLife()}}%</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { charactersService } from '../services/charactersService.js'
import { ui } from '../externalization/uiTextPlugin.js'
export default {
  async created () {
    try {
      this.enemiesArray = await charactersService.getCharacters()
    } catch (error) {
      this.makeToast(ui.Scoreboard.SERVER_ERROR, ui.SERVER_ERROR_TITLE)
    }
    this.enemiesNumber = this.enemiesArray.length
    this.generateNewEnemy()
    this.setupEnemy()
    this.updateBar()
    this.setMaitriseTextAndChances(this.getMaitrise())
  },
  data () {
    return {
      enemyName: null,
      enemyShip: null,
      enemyCreditGalactique: null,
      enemyMaitrise: null,
      enemyMaitriseText: 'ND',
      enemyHitChance: 0,
      enemyLife: 0,
      lifeBar: null,
      actualEnemy: null,
      enemiesArray: [],
      enemiesAmount: 0,
      nextEnemy: 0
    }
  },
  methods: {
    getName: function () {
      return this.enemyName
    },
    getShip: function () {
      return this.enemyShip
    },
    getCreditGalactique: function () {
      return this.enemyCreditGalactique
    },
    getMaitrise: function () {
      return this.enemyMaitrise
    },
    getMaitriseText: function () {
      return this.enemyMaitriseText
    },
    getLife: function () {
      return this.enemyLife
    },
    setMaitriseTextAndChances: function (maitrise) {
      if (maitrise === 1) {
        this.enemyMaitriseText = 'Debutant'
        this.enemyHitChance = 20
      } else if (maitrise === 2) {
        this.enemyMaitriseText = 'Confirme'
        this.enemyHitChance = 35
      } else if (maitrise === 3) {
        this.enemyMaitriseText = 'Expert'
        this.enemyHitChance = 50
      } else if (maitrise === 4) {
        this.enemyMaitriseText = 'Maitre'
        this.enemyHitChance = 70
      } else {
        this.enemyMaitriseText = 'OOB'
        this.enemyHitChance = 0
      }
    },
    setName: function (name) {
      this.enemyName = name
    },
    setShip: function (ship) {
      this.enemyShip = ship
    },
    setMaitrise: function (maitrise) {
      this.enemyMaitrise = maitrise
    },
    setCreditGalactique: function (creditGalactique) {
      this.enemyCreditGalactique = creditGalactique
    },
    setLife: function (newLife) {
      this.enemyLife = newLife
      this.updateBar()
    },
    takeDamage: function (dmg) {
      this.enemyLife -= dmg
      this.updateBar()
    },
    addCreditGalactique: function (creditSupplémentaire) {
      this.creditGalactique += creditSupplémentaire
    },
    updateBar: function () {
      this.lifeBar = document.getElementById('life-bar-e')
      this.lifeBar.style.width = this.getLife() + '%'
    },
    setupEnemy: function () {
      this.enemyName = this.actualEnemy.name
      this.enemyShip = this.actualEnemy.ship.name
      this.enemyMaitrise = this.actualEnemy.experience
      this.enemyCreditGalactique = this.actualEnemy.credit
    },
    generateNewEnemy: function () {
      this.enemyLife = 100
      this.nextEnemy = Math.floor(Math.random() * this.enemiesNumber)
      this.actualEnemy = this.enemiesArray[this.nextEnemy]
    },
    makeToast (msg, title) {
      this.$bvToast.toast(msg, {
        title: title,
        autoHideDelay: 5000,
        appendToast: true
      })
    }
  }
}
</script>
