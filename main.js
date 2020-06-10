Vue.component('card',{
  props:['selectinfo'],
  template:'#cardTemplate',
  methods:{
    addFocus:function(){
      this.$emit('addtofocus')
    }
  },
  computed:{
    checkStateColor:function(){
      if(this.selectinfo.Status === "普通"){
        return "status-aqi2";
      }else if(this.selectinfo.Status=== "對敏感族群不健康"){
        return "status-aqi3";
      }else if(this.selectinfo.Status=== "對所有族群不健康"){
        return "status-aqi4";
      }else if(this.selectinfo.Status=== "非常不健康"){
        return "status-aqi5";
      }else if(this.selectinfo.Status=== "危害"){
        return "status-aqi6";
      }
  } 
  }
});


var app = new Vue({
  el: '#app',
  data: {
    data: [],
    location: [],
    stared: JSON.parse(localStorage.getItem('stared')) || [],
    filter: ''
  },
  created() {
    this.getData();
  },
  // 請在此撰寫 JavaScript
  methods: {
    getData() {
      const vm = this;
      const api = 'https://opendata.epa.gov.tw/api/v1/AQI?%24skip=0&%24top=1000&%24format=json';

      // 使用 jQuery ajax
      $.get(api).then(function( response ) {
        vm.data = response;
        //過濾出縣市陣列
        let County = vm.data.map((item) => item.County);
        //過濾重複資料
        vm.location = County.filter(function(item,index,arr){
        return arr.indexOf(item) === index; 
        });
      });
    },
    changeStar(cardinfo){
      let vm = this;
      //確認有無在關注，有則顯示stared中index，沒有則顯示-1
      let index = vm.stared.findIndex(item =>{
        return cardinfo.SiteName === item;
      });
      console.log(index);
      if(index == -1){
        vm.stared.push(cardinfo.SiteName);
      }else{
        vm.stared.splice(index,1);
      }
      console.log(vm.stared);
      localStorage.setItem('stared',JSON.stringify(vm.stared));
    }
  },
  computed:{
    filterData:function(){
      let vm =this;
      if(vm.filter == ''){
        //return all data
        return vm.data.filter(function(item,key,arr){
          return vm.stared.indexOf(item.SiteName) === -1;
        })
      }else{
        return vm.data.filter(item =>{
          if(vm.filter == item.County){
            return vm.stared.indexOf(item.SiteName) === -1;
          }
        });
      }
      
    },
    staredData:function(){
      let vm =this;
      return vm.data.filter(function(item,index,arr){
        if(vm.stared.indexOf(item.SiteName) !== -1){
          return true;
        }else{
          return false;
        }
      });
    }
    
  }
});
