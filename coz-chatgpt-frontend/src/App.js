import React, { Component } from 'react';
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import axios from 'axios';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { Map, List, Record } from 'immutable';
import moment from 'moment';

const API_GATEWAY_ID = process.env.REACT_APP_API_PATH ? process.env.REACT_APP_API_PATH : "5yfk3miht8"
const SOCKET_API_GATEWAY_ID = process.env.REACT_APP_SOCKET_API_PATH ? process.env.REACT_APP_SOCKET_API_PATH : "test"
class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: Map(
        {
          messageList: [],
          messages: []
        })
    }
    this.websocket = undefined;
    this.timer = undefined;
  }
  closeWebSocket = () => {

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }
  connectToWebScoket = () => {
    const address = `wss://${SOCKET_API_GATEWAY_ID}.execute-api.ap-northeast-2.amazonaws.com/dev?user_id=test&room_id=test`
    this.websocket = new WebSocket(address);
    this.websocket.onopen = () => {
      this.timer = setInterval(() => {
        this.websocket.send(JSON.stringify({ message: 'ping' }));
      }, 60 * 1000);
    };
    this.websocket.onmessage = (message) => {
      let obj = JSON.parse(message.data);
      this.onMessageReceived(obj);
    };

    this.websocket.onclose = (event) => {
      console.log('onclose');
      if (this.timer || this.websocket) this.closeWebSocket();
    };

    this.websocket.onerror = (event) => {
      console.error('WebSocket error observed:', event);
      if (this.timer || this.websocket) this.closeWebSocket();
    };
  }
  componentDidMount = async () => {
    const { data } = this.state;
    const result = await axios({
      method: 'GET',
      url: `https://${API_GATEWAY_ID}.execute-api.ap-northeast-2.amazonaws.com/dev/chat`,
      params: {
        room_id: "test"
      }
    });;

    this.setState({
      data: data.set("messages", result.data).set("user_id", moment().valueOf())
    })

    this.connectToWebScoket();
  }
  onMessageReceived = async (message) => {
    console.log(message)
    if (message.timestamp) {
      const { data } = this.state;
      let list = data.get("messages");
      list.push(message)
      console.log(list);
      this.setState({
        data: data.set("messages", list)
      })
    }
  }
  onSend = async (message) => {
    const { data } = this.state;
    const result = await axios({
      method: 'PUT',
      url: `https://${API_GATEWAY_ID}.execute-api.ap-northeast-2.amazonaws.com/dev/chat`,
      data: {
        room_id: "test",
        text: message,
        user_id: data.get("user_id"),
        name: "name_test"

      }
    });;
  }
  getMessageList = () => {
    const { data } = this.state;
    const userId = data.get("user_id");
    let messageList = [];
    const dt = data.get("messages");
    if (dt) {
      dt.forEach((message) => {
        messageList.push(<Message
          key={message.timestamp}
          model={{
            message: message.message,
            sentTime: "just now",
            sender: "Joe",
            direction: (userId == message.user_id) ? "outgoing" : "not",
          }}
        />
        );
      })
    }
    return messageList;
  }

  render() {
    return (
      <div style={{ position: "relative", height: "500px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList>
              {this.getMessageList()}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={this.onSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    )
  }
}
export default App;
