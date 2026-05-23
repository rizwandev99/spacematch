const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { useChat } = require('@ai-sdk/react');

function MockApp() {
  const chatObj = useChat({ api: '/api/chat' });
  console.log(Object.keys(chatObj));
  return React.createElement("div");
}

try {
  renderToStaticMarkup(React.createElement(MockApp));
} catch(e) {
  console.log(e);
}
