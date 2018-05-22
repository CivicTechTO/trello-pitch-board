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

var app = new Vue({
  el: '#app',
  data: {
    pitchList: [
      {
        name: 'BikeSpace',
        desc: 'This is a description',
        image: 'https://trello-attachments.s3.amazonaws.com/58e158d86835ad6514fa6be3/59ffd419d3228ba3b9eabf79/e3d4f86220e50b79e04bdec32ae8298b/BikeSpace_badge_black.jpg',
        alt: 'The BikeSpace logo',
      }
    ],
  },
  created: function () {
    this.fetchData()
  },
  methods: {
    fetchData: function () {
      vm = this
      var pitchListId = '58e158f29b0ae02ab71b9a87';
      Trello.get('/lists/' + pitchListId + '/cards')
      .then(cards => {
            vm.pitchList = cards.map(card => _.extend(card, {attachments: []}))
            cardIds = cards.map(card => card.id)
            cardIds.forEach((cardId, i) => {
                            Trello.get('/cards/'+cardId+'/attachments')
                            .then(attachments => {
                                  console.log(attachments)
                                  vm.pitchList[i].attachments = attachments
                            })
            })
      })
      .error(function () {
        console.log("Failed to load cards");
      });
    },
  }
})
