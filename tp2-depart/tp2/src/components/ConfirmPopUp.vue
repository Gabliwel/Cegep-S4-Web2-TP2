<template>
  <div>
    <b-button v-b-modal.Confirm-Switch> Test Pop </b-button>
    <b-modal id="Confirm-Switch" ref="Confirm-Switch" hide-footer title="Confirmer">
      <p class="my-4">Confirmer le changement de page ? Vos données seront perdue</p>
      <b-button id="ChangePage" class="mt-3" @click="changePage()">Confirmer</b-button>
      <b-button id="Revenir" class="mt-3" @click="cancel()">Revenir</b-button>
    </b-modal>
    </div>
</template>

<script>
export default {
  methods: {
    changePage: function () {

    },
    cancel: function () {
      this.$refs['Confirm-Switch'].hide()
    }
  }
}
</script>
