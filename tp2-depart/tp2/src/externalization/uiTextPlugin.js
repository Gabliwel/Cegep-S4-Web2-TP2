export const uiTextPlugin = {
  welcomeMessage: 'Allo tout le monde !'
}

export const ui = {
  CONTINUE: 'Continuer',
  SERVER_ERROR_TITLE: 'Une erreur serveur est survenue!',
  CLIENT_ERROR_TITLE: 'Une erreur côté client est survenue!',
  IMPOSSIBLE_ACTION_ERROR_TITLE: 'Action Impossible',
  Home: {
    SERVER_ERROR: 'Impossible de trouver les vaisseaux...',
    FORM_ERROR: 'Veuillez choisir un nom et un vaisseau...'
  },
  Scoreboard: {
    SERVER_ERROR: 'Impossible de trouver les scores...'
  },
  Game: {
    LEAVING_MSG: 'Confirmer le changement de page ? Vos données seront perdue.',
    REPAIR_SHIP_ALREADY_MAXED: 'La vie de votre vaisseau est déjà au max',
    REPAIR_SHIP_MISSING_CG: 'Il faut au moins 5 crédit pour réaliser cette action',
    SCORE_SAVED: 'Score bien sauvegardé!',
    SCORE_NOT_SAVED: 'Impossbile de sauvegarder le score!',
    CANT_FIND_ENEMY: "Impossible de trouvez des ennemies, redirection vers l'accueil",
    GAME_OVER_TITLE (credit) {
      return 'Défaite... (Score final: ' + credit + ')'
    },
    GAME_OVER_CONTENT (enemy) {
      return 'Vous avez été tué par ' + enemy
    },
    WINNING_TITLE (credit) {
      return 'Victoire! (Score final: ' + credit + 'CG)'
    }
  },
  Entity: {
    NAME1: 'Débutant',
    NAME2: 'Confirmé',
    NAME3: 'Expert',
    NAME4: 'Maitre',
    HIT_CHANCE_ERROR: 0.0,
    HIT_CHANCE1: 0.2,
    HIT_CHANCE2: 0.35,
    HIT_CHANCE3: 0.5,
    HIT_CHANCE4: 0.7
  }
}

// Plugin pour VueJs
// https://coderethinked.com/3-different-ways-to-access-constants-in-a-vue-template/
uiTextPlugin.install = function (Vue) {
  Vue.prototype.$getUiText = key => {
    return uiTextPlugin[key]
  }
}

export default uiTextPlugin
