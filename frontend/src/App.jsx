import './App.css'

import MessageForm from "./components/MessageForm";
import MessageList from "./components/MessageList";

export default function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>💬 Social App</h1>
      <MessageForm />
      <MessageList />
    </div>
  );
}
