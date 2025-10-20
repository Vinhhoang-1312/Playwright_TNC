// Test script để kiểm tra AI suggestion độc lập
require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
});

async function testAI() {
  console.log("🤖 Testing AI connection...");
  console.log("Base URL:", process.env.OPENAI_API_BASE_URL);
  console.log("Model:", process.env.OPENAI_MODEL);

  const testPrompt = `Tôi đang chạy test tự động Playwright, gặp lỗi locator: "Timeout waiting for selector: //input[@id='js-login-email-xyz']".
  
HTML DOM snippet:
<input type="email" id="js-login-email" name="email" placeholder="Email" class="form-control">

Hãy đề xuất một locator mới phù hợp. Chỉ trả về đúng chuỗi selector mới, không giải thích.`;

  try {
    console.log("\n📤 Sending request to AI...");
    const start = Date.now();

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Bạn là chuyên gia kiểm thử tự động, giúp đề xuất locator chính xác cho Playwright. Chỉ trả về selector, không giải thích thêm.",
        },
        { role: "user", content: testPrompt },
      ],
      max_tokens: 100,
      temperature: 0.3,
    });

    const duration = Date.now() - start;
    const suggestion = response.choices?.[0]?.message?.content?.trim();

    console.log(`\n✅ AI Response (took ${duration}ms):`);
    console.log("Suggestion:", suggestion);
    console.log("\n📊 Full response:", JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.response) {
      console.error("Response:", error.response.data);
    }
  }
}

testAI();
