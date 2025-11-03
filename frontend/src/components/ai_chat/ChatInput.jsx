import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <Form onSubmit={handleSubmit} className="border-top p-3 bg-transparent">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Ask about volunteer opportunities..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          type="submit"
          style={{ backgroundColor: '#7494ec', borderColor: '#7494ec', color: '#fff' }}
          onMouseOver={(e) => (e.currentTarget.style.filter = 'brightness(0.96)')}
          onMouseOut={(e) => (e.currentTarget.style.filter = 'none')}
        >
          <i className="bi bi-send-fill"></i>
        </Button>
      </InputGroup>
    </Form>
  );
}
