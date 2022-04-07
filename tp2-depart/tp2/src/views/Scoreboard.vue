<template>
  <div class="content-container">
    <h1>ScoreBoard</h1>
    <ul>
      <li v-for="score in scores" v-bind:key="score.id">{{score.name}} - {{score.score}}</li>
    </ul>
  </div>
</template>

<script>
import { rankingService } from '../services/rankingService.js'
import { ui } from '../externalization/uiTextPlugin.js'

export default {
  data () {
    return {
      scores: []
    }
  },
  async created () {
    try {
      this.scores = await rankingService.getRanking()
    } catch (error) {
      this.makeToast(ui.Scoreboard.SERVER_ERROR, ui.SERVER_ERROR_TITLE)
    }
  },
  methods: {
    makeToast (msg, title) {
      console.log(msg)
      this.$bvToast.toast(msg, {
        title: title,
        autoHideDelay: 5000,
        appendToast: true
      })
    }
  }
}
</script>
