import './App.css';
import logo from './logo.svg';
import {Input, Button} from 'antd'
import { useState, useEffect } from 'react';
const {TextArea} = Input

function App() {
  const [username, setUsername] = useState('')
  const [textAreaValue, setTextAreaValue] = useState('')
  useEffect(() => {
    console.log(username)
  }, [username])
  const handleSubmit = () => {
    const ws = new WebSocket('ws://0.0.0.0:3003')
    ws.onopen = () => {
      console.log('Connected to API websocket')
      setTextAreaValue('Connected to API websocket')
    }
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message)
      setTextAreaValue(message)
    };
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Input placeholder='Nhập tên đăng nhập' onChange={(e) => setUsername(e.target.value)} style={{ width: 'fit-content' }} />
        <br />
        <Button onClick={handleSubmit} type='primary'>Lấy tin nhắn</Button>
        <br />
        <TextArea rows={8} style={{ width: '40%' }} value={textAreaValue} />
      </header>
    </div>
  );
}

export default App;
