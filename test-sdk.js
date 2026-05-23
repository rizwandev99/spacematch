import { convertToModelMessages } from "ai";

try {
  const messages = [{"role": "user", "parts": [{"type": "text", "text": "Hi"}]}];
  console.log(convertToModelMessages(messages));
} catch (e) {
  console.error(e.message);
}
