(this["webpackJsonpecommerce-front"]=this["webpackJsonpecommerce-front"]||[]).push([[0],{31:function(e,t,a){e.exports=a(71)},40:function(e,t,a){},71:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),c=a(19),r=a.n(c),o=a(3),s=a(10),i=(a(5),a(2),a(1)),m="http://localhost:8000/api",u=function(){return void 0!=typeof window&&(!!localStorage.getItem("jwt")&&JSON.parse(localStorage.getItem("jwt")))},f=function(){if("undefined"!==typeof window&&localStorage.getItem("cart"))return JSON.parse(localStorage.getItem("cart")).reduce((function(e,t){return e+Number(t.count)}),0);return 0},d=function(e,t){return e.location.pathname===t?{color:"#ff9900"}:{color:"#ffffff"}},g=(Object(s.g)((function(e){var t=e.history,a=Object(n.useState)(!1),c=Object(i.a)(a,2),r=c[0],s=c[1];return Object(n.useEffect)((function(){s(!r)}),[f]),l.a.createElement("div",null,l.a.createElement("ul",{className:"nav nav-tabs bg-primary"},l.a.createElement("li",{className:"nav-item"},l.a.createElement(o.b,{to:"/",className:"nav-link",style:d(t,"/")},"Home")),l.a.createElement("li",{className:"nav-item"},l.a.createElement(o.b,{to:"/shop",className:"nav-link",style:d(t,"/shop")},"Shop")),l.a.createElement("li",{className:"nav-item"},l.a.createElement(o.b,{to:"/cart",className:"nav-link",style:d(t,"/cart")},"Cart"," ",l.a.createElement("sup",null,l.a.createElement("small",{className:"cart-badge"},f())))),u()&&0===u().user.role&&l.a.createElement("li",{className:"nav-item"},l.a.createElement(o.b,{to:"/user/dashboard",className:"nav-link",style:d(t,"/user/dashboard")},"Dashboard")),u()&&1===u().user.role&&l.a.createElement("li",{className:"nav-item"},l.a.createElement(o.b,{to:"/admin/dashboard",className:"nav-link",style:d(t,"/admin/dashboard")},"Dashboard")),!u()&&l.a.createElement(n.Fragment,null,l.a.createElement("li",{className:"nav-item"},l.a.createElement(o.b,{to:"/signin",className:"nav-link",style:d(t,"/signin")},"Signin")),l.a.createElement("li",{className:"nav-item"},l.a.createElement(o.b,{to:"/signup",className:"nav-link",style:d(t,"/signup")},"Signup"))),u()&&l.a.createElement(n.Fragment,null,l.a.createElement("li",{className:"nav-item"},l.a.createElement("span",{onClick:function(){return function(e){if("undefined"!==typeof window)return localStorage.removeItem("jwt"),e(),fetch("".concat(m,"/signout"),{method:"GET"}).then((function(e){console.log(e)})).catch((function(e){return console.log(e)}))}((function(){t.push("/signin")}))},className:"nav-link",style:{cursor:"pointer",color:"#ffffff"}},"Signout")))))})),a(40),a(29),a(11),a(16),a(14),a(54),a(30),function(){});r.a.render(l.a.createElement(g,null),document.getElementById("root"))}},[[31,1,2]]]);
//# sourceMappingURL=main.4c66e0da.chunk.js.map