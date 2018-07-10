Vue.prototype.$http = axios
Vue.prototype.$last = function (item, list) {
  return item == list[list.length - 1]
}

var pitchListId = '58e158f29b0ae02ab71b9a87';

var DEFAULT_IMAGE = 'https://trello-attachments.s3.amazonaws.com/58e158d86835ad6514fa6be3/59ffd9fd175e135b4cf5cabb/ad907c5b81371304d14434348ed14837/3YbiY6Mf_400x400.png';

var authTrello = function () {
}

var processCard = function(card) {
  card.asks = []
  card.tools = []
  card.attachments = []
  card.image = DEFAULT_IMAGE
  card.labels.forEach(label => {
    if (label.name.startsWith('Asks -')) {
      var ask = label.name.substring(7)
      card.asks.push(ask)
    }
    if (label.name.startsWith('Tool -')) {
      var tool = label.name.substring(7)
      card.tools.push(tool)
    }
  })
  Trello.get('/cards/'+card.id+'/attachments')
  .then(attachments => {
    attachments.forEach(attachment => {
      if(attachment.name.startsWith('Cover Image:')) {
        card.image = attachment.url
      }
    })
    card.attachments = attachments
  })
}

var VueTruncate = require('vue-truncate-filter')
Vue.use(VueTruncate)

Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.event = function (event) {
      // here I check that click was outside the el and his childrens
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.event)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.event)
  },
});

Vue.filter('firstParagraph', function (value) {
  return value.split("\n")[0]
});

const removeMd = require('remove-markdown')

Vue.filter('removeMd', function(value) {
  return removeMd(value)
});

const markdown = require( "markdown" ).markdown
Vue.filter('parseMd', function(value) {
  return markdown.toHTML(value)
})

window.app = new Vue({
  el: '#app',
  data: {
    pitchList: [],
    recentPitches: [],
    showModal: false,
    isLoggedIn: false,
    pitchDetails: {},
  },
  created: function () {
    this.fetchData()
    this.checkAuthenticated()
  },
  methods: {
    parseMd: function (value) {
      return markdown.toHTML(value)
    },
    promoteCard: function(index) {
      var vm = this
      var card = vm.recentPitches[index]
      Trello
        .put('/cards/'+card.id, {idList: '58e158f29b0ae02ab71b9a87', pos: 'top'})
        .then(res => {
          vm.recentPitches.splice(index, 1)
          vm.pitchList.unshift(card)
        })
    },
    demoteCard: function (index) {
      var vm = this
      var card = vm.pitchList[index]
      var recentPitchesId = '58e158eba6846a4fb012404c'
      Trello
        .put('/cards/'+card.id, {idList: recentPitchesId, pos: 'bottom'})
        .then(res => {
          vm.pitchList.splice(index, 1)
          vm.recentPitches.push(card)
        })
    },
    fetchData: function () {
      var vm = this
      var pitchListId = '58e158f29b0ae02ab71b9a87'
      Trello
        .get('/lists/' + pitchListId + '/cards')
        .then(cards => {
          cards.forEach(card => {
            processCard(card)
            vm.pitchList.push(card)
          })
        })

      var recentPitchesId = '58e158eba6846a4fb012404c'
      Trello
        .get('/lists/' + recentPitchesId + '/cards')
        .then(cards => {
          cards.forEach(card => {
            vm.recentPitches.push(card)
          })
        })
    },
    updateModal: function (index) {
      var vm = this
      vm.pitchDetails = vm.pitchList[index]
      console.log(this.pitchDetails)
    },
    show: function (index) {
      this.updateModal(index)
      this.showModal = true
    },
    hide: function () {
      this.showModal = false
    },
    checkAuthenticated: function () {
      var vm = this
      if (window.localStorage.trello_token) {
        vm.authTrello()
      }
    },
    authTrello: function () {
      var vm = this
      Trello.authorize({
        type: "popup",
        name: "CivicTechTO Pitch Board",
        scope: {
          read: true,
          write: true },
        expiration: "never",
        success: function() {
          vm.isLoggedIn = true
          console.log("Success!");
        },
        error: function() { console.log("Failed authentication"); }
      })
    },
  }
})
