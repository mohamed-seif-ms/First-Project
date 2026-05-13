#!/usr/bin/env node
require('dotenv').config();
const readline = require('readline');
const MetaAgent = require('./agent');

const agent = new MetaAgent();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  Meta Business AI Agent — مدعوم بـ Claude');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('أمثلة على ما يمكنك قوله:');
console.log('  • "اعرض كل الحملات الإعلانية"');
console.log('  • "كام مرة اتعرض الإعلان الأسبوع ده؟"');
console.log('  • "انشر منشور على صفحتي يقول مرحبا"');
console.log('  • "اعرض العملاء اللي اشتركوا آخر أسبوع"');
console.log('  • "صدّر بيانات العملاء CSV"');
console.log('\nاكتب "خروج" أو "exit" للإنهاء.');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

function prompt() {
  rl.question('أنت: ', async (input) => {
    const trimmed = input.trim();

    if (!trimmed) {
      prompt();
      return;
    }

    if (['خروج', 'exit', 'quit', 'bye'].includes(trimmed.toLowerCase())) {
      console.log('\nمع السلامة!');
      rl.close();
      return;
    }

    if (trimmed.toLowerCase() === 'clear') {
      agent.clearHistory();
      console.log('تم مسح المحادثة.\n');
      prompt();
      return;
    }

    try {
      process.stdout.write('\nClaude: جاري التنفيذ...');
      const reply = await agent.chat(trimmed);
      process.stdout.write('\r' + ' '.repeat(30) + '\r');
      console.log(`Claude: ${reply}\n`);
    } catch (err) {
      process.stdout.write('\r' + ' '.repeat(30) + '\r');
      console.error(`خطأ: ${err.message}\n`);
    }

    prompt();
  });
}

prompt();
