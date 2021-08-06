function t(t,e,n,o,i,a,r,s){var c,l="function"==typeof t?t.options:t;if(e&&(l.render=e,l.staticRenderFns=n,l._compiled=!0),o&&(l.functional=!0),a&&(l._scopeId="data-v-"+a),r?(c=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),i&&i.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(r)},l._ssrRegister=c):i&&(c=s?function(){i.call(this,(l.functional?this.parent:this).$root.$options.shadowRoot)}:i),c)if(l.functional){l._injectStyles=c;var u=l.render;l.render=function(t,e){return c.call(e),u(t,e)}}else{var d=l.beforeCreate;l.beforeCreate=d?[].concat(d,c):[c]}return{exports:t,options:l}}const e={};var n=t({name:"Navbar",methods:{handlePrimaryAction(){this.$emit("click")}}},(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("nav",{staticClass:"beam__navbar"},[t._t("icon",[n("span",{staticClass:"home-icon"},[t._v("⬣")])]),t._v(" "),t._t("title",[n("h1",{staticClass:"nav-title"},[t._v("TITLE")])]),t._v(" "),n("div",{staticClass:"navbar-action-wrapper"},[n("button",{staticClass:"navbar-action",on:{click:t.handlePrimaryAction}},[t._t("navbaraction",[t._v("Action")])],2)])],2)}),[],!1,(function(t){for(let n in e)this[n]=e[n]}),null,null,null).exports;const o={};var i=t({name:"ListAnchor",props:{to:{type:String,required:!1,default:""}}},(function(){var t=this,e=t.$createElement;return(t._self._c||e)("a",{staticClass:"beam__listanchor",attrs:{href:t.to}},[t._t("default")],2)}),[],!1,(function(t){for(let e in o)this[e]=o[e]}),"42112fee",null,null).exports;const a={name:"ItemCount",props:{value:{type:Number,required:!1,default:0},denominator:{type:Number,required:!0},uom:{type:String,required:!1,default:null},editable:{type:Boolean,required:!1,default:!1}},data(){return{count:this.value}},methods:{handleInput(t){t.preventDefault(),t.stopPropagation(),this.count=Number(t.target.innerHTML.replace(/[^0-9]/g,"")),this.$emit("input",this.count)}},computed:{countColor(){return this.count===this.denominator}},watch:{value(){this.count=this.value}}},r={};var s=t(a,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"beam__itemcount"},[n("span",{style:{color:!0===t.countColor?"#3c5014":"#e63c28"},attrs:{contenteditable:t.editable},on:{input:function(e){return t.handleInput(e)},click:function(e){return t.handleInput(e)}}},[t._v(t._s(t.count))]),t._v(" "),n("span",[t._v("/"+t._s(t.denominator))]),t.uom?n("span",[t._v("  "+t._s(t.uom))]):t._e()])}),[],!1,(function(t){for(let e in r)this[e]=r[e]}),null,null,null).exports;const c={name:"ItemCheck",props:{value:{type:Boolean,required:!1,default:!1}},data(){return{checked:this.value}},methods:{handleInput(t){this.$emit("input",this.checked)}}},l={};var u=t(c,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("label",{staticClass:"container"},[n("input",{attrs:{type:"checkbox",tabindex:"-1"},domProps:{checked:t.value},on:{input:t.handleInput}}),t._v(" "),n("span",{staticClass:"checkmark",attrs:{tabindex:"0"}})])}),[],!1,(function(t){for(let e in l)this[e]=l[e]}),"2ef8a7b8",null,null).exports;const d={};var m=t({name:"ListItem",components:{ItemCount:s,ItemCheck:u},props:{item:{type:Object,required:!0}}},(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"beam__listitem",attrs:{tabindex:"0"}},[n("span",[n("label",[t._v(t._s(t.item.label))]),t._v(" "),n("p",[t._v(t._s(t.item.description))])]),t._v(" "),t.item.count?n("ItemCount",{attrs:{denominator:t.item.count.of,uom:t.item.count.uom,editable:!0},model:{value:t.item.count.count,callback:function(e){t.$set(t.item.count,"count",e)},expression:"item.count.count"}}):t._e(),t._v(" "),t.item.hasOwnProperty("checked")?n("ItemCheck",{model:{value:t.item.checked,callback:function(e){t.$set(t.item,"checked",e)},expression:"item.checked"}}):t._e()],1)}),[],!1,(function(t){for(let e in d)this[e]=d[e]}),null,null,null).exports;const h={};var p=t({name:"ListView",components:{ListItem:m,ListAnchor:i},props:{items:{type:Array,required:!0}},created(){window.addEventListener("scroll",this.handleScroll)},destroyed(){window.removeEventListener("scroll",this.handleScroll)},methods:{handleScroll(){document.documentElement.scrollHeight-window.innerHeight-document.documentElement.scrollTop<=2&&this.$emit("scrollbottom")}}},(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("ul",{staticClass:"beam__listview"},t._l(t.items,(function(t,e){return n("li",{key:e},[t.linkComponent?[n(t.linkComponent,{tag:"component",attrs:{to:t.route,tabindex:"-1"}},[n("ListItem",{attrs:{item:t}})],1)]:[n("ListItem",{attrs:{item:t}})]],2)})),0)}),[],!1,(function(t){for(let e in h)this[e]=h[e]}),null,null,null).exports;const _={};var f=t({name:"ScanInput",data:()=>({barcode:""}),methods:{handleScanInput(t){"INPUT"!==t.target.tagName&&("Enter"!==t.key?this.barcode+=`${t.key}`:(this.$emit("scaninput",this.barcode),this.barcode=""))}},mounted(){document.addEventListener("keypress",(t=>{this.handleScanInput(t)}))},destroyed(){window.removeEventListener("keypress",(t=>{this.handleScanInput(t)}))}},(function(){var t=this.$createElement;return(this._self._c||t)("div",{attrs:{id:"scan_input"}})}),[],!1,(function(t){for(let e in _)this[e]=_[e]}),"3c9499ea",null,null).exports;const v={};var b=t({name:"ActionFooter",methods:{handleFooterAction(){this.$emit("click")}}},(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("footer",{staticClass:"beam__actionfooter"},[n("span",{staticClass:"footer-action-wrapper"},[n("button",{staticClass:"footer-action",on:{click:t.handleFooterAction}},[t._t("default")],2)])])}),[],!1,(function(t){for(let e in v)this[e]=v[e]}),null,null,null).exports;const C=[n,p],k=function(t,e={}){C.forEach((e=>{t.component(e.name,e)}))};"undefined"!=typeof window&&window.Vue&&k(window.Vue);var y={version:"0.1.0",install:k};export default y;export{b as ActionFooter,u as ItemCheck,s as ItemCount,i as ListAnchor,m as ListItem,p as ListView,n as Navbar,f as ScanInput};
