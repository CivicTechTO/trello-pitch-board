!function(){function e(t,r,n){function a(o,i){if(!r[o]){if(!t[o]){var c="function"==typeof require&&require;if(!i&&c)return c(o,!0);if(s)return s(o,!0);var l=new Error("Cannot find module '"+o+"'");throw l.code="MODULE_NOT_FOUND",l}var u=r[o]={exports:{}};t[o][0].call(u.exports,function(e){return a(t[o][1][e]||e)},u,u.exports,e,t,r,n)}return r[o].exports}for(var s="function"==typeof require&&require,o=0;o<n.length;o++)a(n[o]);return a}return e}()({1:[function(e,t,r){t.exports=function(e,t){t=t||{},t.listUnicodeChar=!!t.hasOwnProperty("listUnicodeChar")&&t.listUnicodeChar,t.stripListLeaders=!t.hasOwnProperty("stripListLeaders")||t.stripListLeaders,t.gfm=!t.hasOwnProperty("gfm")||t.gfm,t.useImgAltText=!t.hasOwnProperty("useImgAltText")||t.useImgAltText;var r=e||"";r=r.replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*$/gm,"");try{t.stripListLeaders&&(r=t.listUnicodeChar?r.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm,t.listUnicodeChar+" $1"):r.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm,"$1")),t.gfm&&(r=r.replace(/\n={2,}/g,"\n").replace(/~{3}.*\n/g,"").replace(/~~/g,"").replace(/`{3}.*\n/g,"")),r=r.replace(/<[^>]*>/g,"").replace(/^[=\-]{2,}\s*$/g,"").replace(/\[\^.+?\](\: .*?$)?/g,"").replace(/\s{0,2}\[.*?\]: .*?$/g,"").replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g,t.useImgAltText?"$1":"").replace(/\[(.*?)\][\[\(].*?[\]\)]/g,"$1").replace(/^\s{0,3}>\s?/g,"").replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g,"").replace(/^(\n)?\s{0,}#{1,6}\s+| {0,}(\n)?\s{0,}#{0,} {0,}(\n)?\s{0,}$/gm,"$1$2$3").replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g,"$2").replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g,"$2").replace(/(`{3,})(.*?)\1/gm,"$2").replace(/`(.+?)`/g,"$1").replace(/\n{2,}/g,"\n\n")}catch(t){return console.error(t),e}return r}},{}],2:[function(e,t,r){!function(){var e={};e.install=function(e){e.filter("truncate",function(e,t,r){if(r=r||"...",t=t||30,e.length<=t)return e;for(var n=e.slice(0,t-r.length),a=n.length-1;a>0&&" "!==n[a]&&n[a]!==r[0];)a-=1;return a=a||t-r.length,(n=n.slice(0,a))+r})},"object"==typeof r?t.exports=e:"function"==typeof define&&define.amd?define([],function(){return e}):window.Vue&&(window.VueTruncate=e,Vue.use(VueTruncate))}()},{}],3:[function(e,t,r){"use strict";Vue.prototype.$http=axios,Vue.prototype.$last=function(e,t){return e==t[t.length-1]};Trello.authorize({type:"popup",name:"Trello dashboard",scope:{read:!0,write:!1},expiration:"never",success:function(){console.log("Success!")},error:function(){console.log("Failed authentication")}});var n=function(e){e.asks=[],e.tools=[],e.attachments=[],e.image="https://trello-attachments.s3.amazonaws.com/58e158d86835ad6514fa6be3/59ffd9fd175e135b4cf5cabb/ad907c5b81371304d14434348ed14837/3YbiY6Mf_400x400.png",e.labels.forEach(function(t){if(t.name.startsWith("Asks -")){var r=t.name.substring(7);e.asks.push(r)}if(t.name.startsWith("Tool -")){var n=t.name.substring(7);e.tools.push(n)}}),Trello.get("/cards/"+e.id+"/attachments").then(function(t){t.forEach(function(t){t.name.startsWith("Cover Image:")&&(e.image=t.url)}),e.attachments=t})},a=e("vue-truncate-filter");Vue.use(a),Vue.filter("firstParagraph",function(e){return e.split("\n")[0]});var s=e("remove-markdown");Vue.filter("removeMd",function(e){return s(e)});new Vue({el:"#app",data:{pitchList:[],showModal:!1,pitchDetails:{}},created:function(){this.fetchData()},methods:{fetchData:function(){var e=this;Trello.get("/lists/58e158f29b0ae02ab71b9a87/cards").then(function(t){t.forEach(function(t){n(t),e.pitchList.push(t)})}).error(function(){console.log("Failed to load cards")})},updateModal:function(e){var t=this;t.pitchDetails=t.pitchList[e],console.log(this.pitchDetails)},show:function(e){this.updateModal(e),this.showModal=!0},hide:function(){this.showModal=!1}}})},{"remove-markdown":1,"vue-truncate-filter":2}]},{},[3]);
