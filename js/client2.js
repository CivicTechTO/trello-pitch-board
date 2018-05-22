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
    mydata: [],
  },
  created: function () {
    this.fetchData()
  },
  methods: {
    fetchData: function () {
      vm = this
      vm.$http.get('data/data.json')
      .then(response => {
        vm.mydata = response.data
      })
    },
    show: function () {
      this.showModal = true
    },
    hide: function () {
      this.showModal = false
    }
  },
})
