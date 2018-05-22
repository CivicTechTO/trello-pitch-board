Vue.prototype.$http = axios
// register modal component
Vue.component('modal', {
  template: '#modal-template'
})

// start app
new Vue({
  el: '#app',
  data: {
    showModal: false,
    pitchDetails: {},
    pitchList: [],
  },
  created: function () {
    this.fetchData()
  },
  methods: {
    fetchData: function () {
      vm = this
      vm.$http.get('data/data.json')
      .then(response => {
        vm.pitchList = response.data
      })
    },
    updateModal: function (index) {
      vm = this
      vm.pitchDetails = vm.pitchList[index]
      console.log(this.pitchDetails)
    },
    show: function (index) {
      this.updateModal(index)
      this.showModal = true
    },
    hide: function () {
      this.showModal = false
    }
  },
})
