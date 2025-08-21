// examples/chapter-2-basics/01-functional-component.jsx
import React from 'react';

// Basic functional component
function Greeting({ name, age }) {
  return (
    <div className="greeting">
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

// Component with default props
function Welcome({ name = 'Guest', isLoggedIn = false }) {
  return (
    <div className="welcome">
      {isLoggedIn ? (
        <h2>Welcome back, {name}!</h2>
      ) : (
        <h2>Welcome, {name}! Please log in.</h2>
      )}
    </div>
  );
}

// Component with children
function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

// Usage example
function App() {
  return (
    <div className="app">
      <Greeting name="John" age={25} />
      <Welcome name="Alice" isLoggedIn={true} />
      <Welcome isLoggedIn={false} />
      
      <Card title="User Information">
        <p>This is the card content.</p>
        <button>Click me</button>
      </Card>
    </div>
  );
}

export default App;
