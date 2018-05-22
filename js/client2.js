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
      console.log(vm.pitchList[index])
      vm.pitchDetails = vm.pitchList[index]
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
