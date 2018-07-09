Vue.prototype.$http = axios
Vue.prototype.$last = function (item, list) {
  return item == list[list.length - 1]
}

var pitchListId = '58e158f29b0ae02ab71b9a87';
Trello.authorize({
  type: "popup",
  name: "Trello dashboard",
  scope: {
    read: true,
    write: false },
  expiration: "never",
  success: function() { console.log("Success!"); },
  error: function() { console.log("Failed authentication"); }
});

var loadCards = function(listId) {
  //Get the users boards
  Trello.get(
    '/lists/' + listId + '/cards',
    loadedCards,
    function() { console.log("Failed to load cards"); }
  );
};

var DEFAULT_IMAGE = 'https://trello-attachments.s3.amazonaws.com/58e158d86835ad6514fa6be3/59ffd9fd175e135b4cf5cabb/ad907c5b81371304d14434348ed14837/3YbiY6Mf_400x400.png';

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

var loadedCards = function (response) {
  this.pitchList = response;
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

var app = new Vue({
  el: '#app',
  data: {
    pitchList: [],
    showModal: false,
    pitchDetails: {},
  },
  created: function () {
    this.fetchData()
  },
  methods: {
    fetchData: function () {
      var vm = this
      var pitchListId = '58e158f29b0ae02ab71b9a87';
      Trello.get('/lists/' + pitchListId + '/cards')
      .then(cards => {
        cards.forEach(card => {
          processCard(card)
          vm.pitchList.push(card)
        })
      })
      .error(function () {
        console.log("Failed to load cards");
      });
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
  }
})
