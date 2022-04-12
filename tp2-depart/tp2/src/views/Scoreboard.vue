<template>
  <div class="content-container">
    <h1>ScoreBoard</h1>
    <table class="table table-striped table-dark col-md-6 offset-md-3">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Player name</th>
          <th scope="col">Score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="score in scores" v-bind:key="score.id">
          <th scope="row">{{score.id}}</th>
          <td>{{score.name}}</td>
          <td>{{score.score}}</td>
        </tr>
      </tbody>
    </table>
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
      this.$bvToast.toast(msg, {
        title: title,
        autoHideDelay: 5000,
        appendToast: true
      })
    }
  }
}
</script>
