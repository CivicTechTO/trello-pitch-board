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

var loadedCards = function (response) {
  this.pitchList = response;
}

var VueTruncate = require('vue-truncate-filter')
Vue.use(VueTruncate)

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
            vm.pitchList = cards.map(card => _.extend(card, {attachments: []}))
            vm.pitchList = cards.map(card => _.extend(card, {image: 'https://trello-attachments.s3.amazonaws.com/58e158d86835ad6514fa6be3/59ffd9fd175e135b4cf5cabb/ad907c5b81371304d14434348ed14837/3YbiY6Mf_400x400.png'}))
            var cardIds = cards.map(card => card.id)
            cardIds.forEach((cardId, i) => {
                            Trello.get('/cards/'+cardId+'/attachments')
                            .then(attachments => {
                                  console.log(attachments)
                                  attachments.forEach(attachment => {
                                    if(attachment.name.startsWith('Cover Image:')) {
                                      vm.pitchList[i].image = attachment.url
                                    }
                                  })
                                  vm.pitchList[i].attachments = attachments
                            })
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
