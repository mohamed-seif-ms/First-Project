require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const metaTools = require('./tools');
const { executeTool } = require('./toolExecutor');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `أنت مساعد ذكي متخصص في إدارة Meta Business. تستطيع:

1. **إدارة الإعلانات**: إنشاء وتعديل الحملات الإعلانية، المجموعات الإعلانية، والإعلانات
2. **تحليل البيانات**: عرض إحصائيات الحملات، الصفحات، والجمهور
3. **نشر المحتوى**: نشر وجدولة المنشورات على Facebook وInstagram
4. **إدارة العملاء**: جلب وتصدير بيانات العملاء من نماذج Lead Generation

قواعد مهمة:
- دائماً أكّد مع المستخدم قبل إنشاء أو تعديل أو حذف أي شيء
- أعرض النتائج بشكل واضح ومنظم
- إذا طُلب منك عمل شيء قد يكلّف مال (إطلاق حملة إعلانية)، نبّه المستخدم
- تحدث بالعربية دائماً ما لم يطلب المستخدم غير ذلك`;

class MetaAgent {
  constructor() {
    this.conversationHistory = [];
  }

  async chat(userMessage) {
    this.conversationHistory.push({ role: 'user', content: userMessage });

    let response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: metaTools,
      messages: this.conversationHistory,
    });

    // Agentic loop: keep running until no more tool calls
    while (response.stop_reason === 'tool_use') {
      const assistantMessage = { role: 'assistant', content: response.content };
      this.conversationHistory.push(assistantMessage);

      // Execute all tool calls in parallel
      const toolResults = await Promise.all(
        response.content
          .filter((block) => block.type === 'tool_use')
          .map(async (toolUse) => {
            let result;
            let isError = false;

            try {
              result = await executeTool(toolUse.name, toolUse.input);
            } catch (err) {
              result = { error: err.message };
              isError = true;
            }

            return {
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: JSON.stringify(result),
              is_error: isError,
            };
          })
      );

      this.conversationHistory.push({ role: 'user', content: toolResults });

      response = await client.messages.create({
        model: 'claude-opus-4-7',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools: metaTools,
        messages: this.conversationHistory,
      });
    }

    // Extract final text response
    const finalText = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n');

    this.conversationHistory.push({ role: 'assistant', content: response.content });

    return finalText;
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

module.exports = MetaAgent;
