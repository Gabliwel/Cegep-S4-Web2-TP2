export const uiTextPlugin = {
  welcomeMessage: 'Allo tout le monde !'
}

export const ui = {
  SERVER_ERROR_TITLE: 'Une erreur serveur est survenue!',
  Home: {
    SERVER_ERROR: 'Impossible de trouver les vaisseaux...'
  },
  Scoreboard: {
    SERVER_ERROR: 'Impossible de trouver les scores...'
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
