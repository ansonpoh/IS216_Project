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
        <Button variant="primary" type="submit">
          <i className="bi bi-send-fill"></i>
        </Button>
      </InputGroup>
    </Form>
  );
}
