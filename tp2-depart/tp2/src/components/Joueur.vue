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
        <div id="life-bar" class="progress-bar" role="progressbar" style="width: 33%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
          <small class="justify-content-center d-flex position-absolute text-dark w-100">{{this.getLife()}}%</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
    this.CheckData()
    this.updateBar()
    this.setMaitriseTextAndChances(this.getMaitrise())
  },
  props: {
    name: {
      type: String,
      default: null
    },
    ship: {
      type: String,
      default: null
    },
    credit: {
      type: Number,
      default: 0
    },
    mastery: {
      type: Number,
      default: 4
    },
    vie: {
      type: Number,
      default: 100
    }
  },
  data () {
    return {
      playerName: this.name,
      playerShip: this.ship,
      playerCreditGalactique: this.credit,
      playerMaitrise: this.mastery,
      playerMaitriseText: 'ND',
      playerHitChance: 0,
      playerLife: this.vie,
      lifeBar: null,
      avoidRouteLeave: false
    }
  },
  methods: {
    getName: function () {
      return this.playerName
    },
    getShip: function () {
      return this.playerShip
    },
    getCreditGalactique: function () {
      return this.playerCreditGalactique
    },
    getMaitrise: function () {
      return this.playerMaitrise
    },
    getMaitriseText: function () {
      return this.playerMaitriseText
    },
    getLife: function () {
      return this.playerLife
    },
    setMaitriseTextAndChances: function (maitrise) {
      if (maitrise === 1) {
        this.playerMaitriseText = 'Debutant'
        this.playerHitChance = 20
      } else if (maitrise === 2) {
        this.playerMaitriseText = 'Confirme'
        this.playerHitChance = 35
      } else if (maitrise === 3) {
        this.playerMaitriseText = 'Expert'
        this.playerHitChance = 50
      } else if (maitrise === 4) {
        this.playerMaitriseText = 'Maitre'
        this.playerHitChance = 70
      } else {
        this.playerMaitriseText = 'OOB'
        this.playerHitChance = 0
      }
    },
    setName: function (name) {
      this.playerName = name
    },
    setShip: function (ship) {
      this.playerShip = ship
    },
    setMaitrise: function (maitrise) {
      this.playerMaitrise = maitrise
    },
    setCreditGalactique: function (creditGalactique) {
      this.playerCreditGalactique = creditGalactique
    },
    setLife: function (newLife) {
      this.playerLife = newLife
      this.updateBar()
    },
    takeDamage: function (dmg) {
      this.playerLife -= dmg
      this.updateBar()
    },
    addCreditGalactique: function (creditSupplémentaire) {
      this.playerCreditGalactique += creditSupplémentaire
    },
    updateBar: function () {
      this.lifeBar = document.getElementById('life-bar')
      this.lifeBar.style.width = this.getLife() + '%'
    },
    CheckData () {
      if (this.playerName == null || !this.playerShip == null) {
        this.avoidRouteLeave = true
        this.$router.push({ name: 'Home' })
      }
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
