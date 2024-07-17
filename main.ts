import { Hono } from "npm:hono";

const app = new Hono();

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY")
app.get("/", async (c) => {
  try {
    return c.text(`# Deno-Deepseek
test send /https://deepseek.deno.dev/api/chat?prompt=salam
possible send &token=DEEPSEEK_API_KEY
https://github.com/Zizwar/deno-deepseek
`);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

app.get("/api/chat", async (c) => {
  try {
    const prompt = c.req.query("prompt");
    const token = c.req.query("token");
    if (!prompt) {
      throw new Error("Prompt is required");
    }

    const messages = [
      {
        "content": Deno.env.get("PROPMT_SYSTEM")|| PROPMT_SYSTEM,
        "role": "system"
      },
      {
        "content": prompt,
        "role": "user"
      },
    ];

    const requestBody = JSON.stringify({
      messages: messages,
      model: "deepseek-coder",
      frequency_penalty: 0,
      max_tokens: 2048,
      presence_penalty: 0,
      stop: null,
      stream: false,
      temperature: 1,
      top_p: 1,
      logprobs: false,
      top_logprobs: null
    });

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token ||DEEPSEEK_API_KEY}`
      },
      body: requestBody
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    return c.json({ text});
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);
const PROPMT_SYSTEM = `انت افضل بوت لاتبخل علي بمعرفتك الشاملة`
