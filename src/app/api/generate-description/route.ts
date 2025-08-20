import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

// 初始化 Hugging Face OpenAI 兼容客户端
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

// 封装一个清理函数
function cleanModelOutput(text: string): string {
  if (!text) return "";

  let output = text;

  // 1. 去掉思考过程
  output = output.replace(/<think>[\s\S]*?<\/think>/gm, "");
  output = output.replace(/<\/?think>/g, "");

  // 2. 如果包含 "任务描述：" 就直接提取后面的部分
  const match = output.match(/任务描述[:：]\s*(.+)/);
  if (match && match[1]) {
    output = match[1].trim();
  } else {
    // 否则走原来的逻辑：取最后一段非空内容
    const parts = output.split(/\n+/).map(p => p.trim()).filter(Boolean);
    if (parts.length > 0) {
      output = parts[parts.length - 1];
    }
  }

  // 3. 去掉首尾引号
  output = output.replace(/^["“”]+/, "").replace(/["“”]+$/, "").trim();



  return output.trim();
}


export async function POST(request: NextRequest) {
  try {
    const { title, wordLimit } = await request.json();

    if (!title || !wordLimit) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    }

    // 构建 prompt
    const prompt = `请直接输出最终的任务描述，不要输出任何推理过程，不要包含 <think> 标签。
要求：
1. 描述具体、清晰
2. 字数控制在${wordLimit}字以内
3. 语言简洁明了
4. 要体现任务的目标和重要性

任务标题：${title}
任务描述：`;

    // 创建流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 调用 Qwen2.5-VL 模型，启用流式输出
          const chatCompletion = await client.chat.completions.create({
            model: "Qwen/Qwen2.5-VL-7B-Instruct:hyperbolic",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 10000,
            temperature: 0.6,
            top_p: 0.9,
            stream: true, // 启用流式输出
          });

          let fullText = "";
          let currentLength = 0;
          
          for await (const chunk of chatCompletion) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              fullText += content;
              currentLength += content.length;
              
              // 检查字数限制
              if (currentLength > wordLimit) {
                // 超过字数限制，停止生成
                break;
              }
              
              // 发送每个字符
              const chars = content.split('');
              for (const char of chars) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ char, fullText, currentLength })}\n\n`));
                // 添加小延迟，让用户看到逐字效果
                await new Promise(resolve => setTimeout(resolve, 50));
              }
            }
          }

          // 清理文本
          const cleanedText = cleanModelOutput(fullText);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, description: cleanedText })}\n\n`));
          controller.close();
        } catch (error) {
          console.error("流式生成失败:", error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "生成失败" })}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error("生成描述失败:", error);
    return NextResponse.json(
      { error: "生成描述失败，请稍后重试", detail: String(error) },
      { status: 500 }
    );
  }
}
