(this["webpackJsonpserverless-chat-app"]=this["webpackJsonpserverless-chat-app"]||[]).push([[0],{49:function(e,t,s){},75:function(e,t,s){"use strict";s.r(t);var n=s(0),a=s.n(n),o=s(24),c=s.n(o),r=(s(49),s(6)),i=s(10),u=s(25),d=s(43),b=s(44),p=s(42),l=(s(50),s(14)),m=s.n(l),g=s(7),h=s(41),f=s(40),v=s.n(f),j=s(4),w="ppvglrxzlg",k="bsq7i57393",O=function(e){Object(b.a)(s,e);var t=Object(p.a)(s);function s(e){var n;return Object(u.a)(this,s),(n=t.call(this,e)).closeWebSocket=function(){n.timer&&(clearInterval(n.timer),n.timer=null),n.websocket&&(n.websocket.close(),n.websocket=null)},n.connectToWebScoket=function(){var e="wss://".concat(k,".execute-api.ap-northeast-2.amazonaws.com/dev?user_id=test&room_id=test");n.websocket=new WebSocket(e),n.websocket.onopen=function(){n.timer=setInterval((function(){n.websocket.send(JSON.stringify({message:"ping"}))}),6e4)},n.websocket.onmessage=function(e){var t=JSON.parse(e.data);n.onMessageReceived(t)},n.websocket.onclose=function(e){console.log("onclose"),(n.timer||n.websocket)&&n.closeWebSocket()},n.websocket.onerror=function(e){console.error("WebSocket error observed:",e),(n.timer||n.websocket)&&n.closeWebSocket()}},n.componentDidMount=Object(i.a)(Object(r.a)().mark((function e(){var t,s;return Object(r.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=n.state.data,e.next=3,m()({method:"GET",url:"https://".concat(w,".execute-api.ap-northeast-2.amazonaws.com/dev/chat"),params:{room_id:"test"}});case 3:s=e.sent,n.setState({data:t.set("messages",s.data).set("user_id",v()().valueOf())}),n.connectToWebScoket();case 7:case"end":return e.stop()}}),e)}))),n.onMessageReceived=function(){var e=Object(i.a)(Object(r.a)().mark((function e(t){var s,a;return Object(r.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log(t),t.timestamp&&(s=n.state.data,(a=s.get("messages")).push(t),console.log(a),n.setState({data:s.set("messages",a)}));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),n.onSend=function(){var e=Object(i.a)(Object(r.a)().mark((function e(t){var s;return Object(r.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return s=n.state.data,e.next=3,m()({method:"PUT",url:"https://".concat(w,".execute-api.ap-northeast-2.amazonaws.com/dev/chat"),data:{room_id:"test",text:t,user_id:s.get("user_id"),name:"name_test"}});case 3:e.sent;case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),n.getMessageList=function(){var e=n.state.data,t=e.get("user_id"),s=[],a=e.get("messages");return a&&a.forEach((function(e){s.push(Object(j.jsx)(g.c,{model:{message:e.message,sentTime:"just now",sender:"Joe",direction:t==e.user_id?"outgoing":"not"}},e.timestamp))})),s},n.state={data:Object(h.a)({messageList:[],messages:[]})},n.websocket=void 0,n.timer=void 0,n}return Object(d.a)(s,[{key:"render",value:function(){return Object(j.jsx)("div",{style:{position:"relative",height:"500px"},children:Object(j.jsx)(g.b,{children:Object(j.jsxs)(g.a,{children:[Object(j.jsx)(g.e,{children:this.getMessageList()}),Object(j.jsx)(g.d,{placeholder:"Type message here",onSend:this.onSend})]})})})}}]),s}(n.Component),x=O,S=function(e){e&&e instanceof Function&&s.e(3).then(s.bind(null,76)).then((function(t){var s=t.getCLS,n=t.getFID,a=t.getFCP,o=t.getLCP,c=t.getTTFB;s(e),n(e),a(e),o(e),c(e)}))};c.a.render(Object(j.jsx)(a.a.StrictMode,{children:Object(j.jsx)(x,{})}),document.getElementById("root")),S()}},[[75,1,2]]]);
//# sourceMappingURL=main.2a1015a8.chunk.js.map