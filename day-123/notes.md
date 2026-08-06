=> last classs we have seen that the chat histroy in not maintained by AI, rather , we need to maintain it in server side, we created an array and store previous messages in it(wrong process), and pass that to the ai model. by it is a wrong process and might cost hugh amount and also the response time of AI will also increase.

=> we will solve the above issue later, today , we will see tolls.

//====================================
if we ask AI to "send an email to xyz@test.com, the subject is IRAN war and compose the rest of the body by yourself", the AI would respond back as ::


**Subject:** Iran War – Urgent Update & Analysis

**To:** xyz@test.com

**Body:**

Dear [Recipient's Name],

I hope this email finds you well.

I wanted to bring to your attention the recent developments regarding the escalating tensions in Iran. The situation remains fluid, with [briefly mention key events, e.g., "recent military strikes," "diplomatic negotiations," or "regional alliances shifting"]. Given the potential global implications, I believe it’s critical to monitor these developments closely.

Attached, you’ll find a report summarizing the latest geopolitical analysis, including potential risks and opportunities. I’d appreciate your thoughts on how this might impact [mention relevant sectors, e.g., "energy markets," "regional stability," or "trade policies"].

Please let me know if you’d like to discuss further or need additional insights.

Best regards,
[Your Full Name]
[Your Position]
[Your Contact Information]

<!-- ========================= -->

                    
=> we see that AI has created a template, but did not send it to anyone. because it didnot have any capability to send it. now, let's see how can we provide that capability to AI or perform some other actions based on our input.

=> for this , we will use "tools". Generative AI generates the text , but we need to perform some actions. for that we use tools. tools are the functions that we provide to the AI model. with the function , AI can perform actions based on our input.

=> lets create a tool to send an email.

- we will use google_client_id, google_client_secret, google_refresh_token, google_user from .env file.
- we will use @google-auth/oauth2 library to authenticate with google.

-lets install nodemailer, dotenv

from the previous project lets import mail.service.js file.

//======================================
// mail.service.js 
//======================================
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        clientId: process.env.GOOGLE_CLIENT_ID
    }
})


transporter.verify()
    .then(() => { console.log("Email transporter is ready to send emails"); })
    .catch((err) => { console.error("Email transporter verification failed:", err); });


export async function sendEmail({ to, subject, html, text }) {

    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text
    };

    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent:", details);
}




=> the sendEmail function has a power to send email to any email-address. 

=> Now ,we will import the sendEmail function in our index.js file.


//===============================
// index.js
//===============================


import "dotenv/config"
import readline from 'readline/promises';
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage } from "langchain";
import { sendEmail } from "./mail.service";


// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const model = new ChatMistralAI({
    modelName: "mistral-small-latest",
});

const messages = [];

while(true){
    const userInput = await rl.question("\x1b[1;36mYou: \x1b[0m");
    messages.push(new HumanMessage(userInput));
    const response = await model.invoke(messages);
    messages.push(response.text)
    console.log("\x1b[1;32mMistral:\x1b[0m", response.content);
    console.log("\x1b[2m" + "─".repeat(50) + "\x1b[0m");
}


rl.close();


=> sendEmail has the power to send email to any user. 



// ============================
// 1. The Tool 
// ============================

to use tools , we need to install zod
"npm i zod"

Tools extend what agents can do—letting them fetch real-time data, execute code, query external databases, and take actions in the world.

Under the hood, tools are callable functions with well-defined inputs and outputs that get passed to a chat model. The model decides when to invoke a tool based on the conversation context, and what input arguments to provide.


=> yaha pe mail.service.js file ak tool hai jo AI model ko email bhej ne ki power deta hai. but we have to tell the AI model how to use it.

=> to create a tool function in langchain , we need to import tool from langchain and install zod.

npm i zod

// after importing tool , we create a tool called emailTool, this tool requires some arguments to be passed, as it requires object with to, subject, html, text properties, so we use zod to define the schema for the arguments.

//this sendEmail function always returns a string, which confirms the email sent successfully


=> By default, AI can't perform anything , we have to force AI to perform an action, and the action is to send email. to send email we have a function called sendEmail. but AI can't access the code of sendEmail directly. so we have to provide the tool to AI. in the tool we pass the function(the main action). and then we provide description about the tool like , what is the name of the tool, what the tool does, and what are its parameters and how will the format of the parameters be. after creating a tool, we have to pass it to the AI model. For that we create an agent for using tools. agents have a basic job - LLM + tools => LLM decide when to use tools + Tools helps LLM to perform actions

```javascript
const agent = createAgent({
  model,
  tools: [emailTool],
})
```
=> now , we will invoke the tool

```javascript

const response = await agent.invoke({
      messages
});

```


// the entire index.js file with tools ::

```javascript


import "dotenv/config"
import readline from 'readline/promises';
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage , tool, createAgent} from "langchain";
import { sendEmail } from "./mail.service.js";
import * as z from "zod";

// after importing tool , we create a tool called emailTool, this tool requires some arguments to be passed, as it requires object with to, subject, html, text properties, so we use zod to define the schema for the arguments.

//this sendEmail function always returns a string, which confirms the email sent successfully.

const emailTool = tool(sendEmail,{
    name: "emailTool",
    description: "use this tool to send an email",
    schema: z.object({
        to: z.string().describe("the receiver's email address"),
        html: z.string().describe("the html content of the email"),
        subject: z.string().describe("the subject of the email"),
    })
})




const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const model = new ChatMistralAI({
    modelName: "mistral-small-latest",
});

const agent = createAgent({
  model,
  tools: [emailTool],
  
})


const messages = [];


// while (true) {
//   const userInput = await rl.question("\x1b[1;36mYou: \x1b[0m");
//   messages.push(new HumanMessage(userInput));
//   const response = await agent.invoke({
//     messages,
//   });
//   // get the AI's latest message
//   const aiMessage = response.messages[response.messages.length - 1];

//   messages.push(aiMessage);

//   console.log("\x1b[1;32mAI:\x1b[0m", aiMessage.content);
// }
// with the help of above code, we only get the final output, not the entire code histroy, but its opposite with the below while loop.

while (true) {
  const userInput = await rl.question("\x1b[1;36mYou: \x1b[0m");
  messages.push(new HumanMessage(userInput));
  const response = await agent.invoke({
    messages,
  });
  // get the AI's latest message

  messages.push(response.messages[response.messages.length - 1]);

  // console.log("\x1b[1;32mAI:\x1b[0m", messages);
  console.log("\x1b[1;32mAI:\x1b[0m", response);
}




```


=>now, we can tell AI to send mail to user 'dharsubham32@gmail.com" and it will send it, just mention the subject and content of the mail

=> jab hum model ko invoke kar rahe the, wo final output provide kar raha tha, but yaha hum agent ko invoke kar rahe hai, toh, woh  humko pura histroy provide karta hai.
You: hello
Email transporter is ready to send emails
AI: {
  messages: [
    HumanMessage {
      "id": "0cdaea8b-0065-43f8-a602-cba556001625",
      "content": "hello",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessageChunk {
      "id": "8ab233c6-be61-45e0-9a4e-0d84249a0432",
      "content": "Hello! How can I assist you today? 😊",
      "name": "model",
      "additional_kwargs": {},
      "response_metadata": {
        "estimatedTokenUsage": {},
        "prompt": 0,
        "completion": 0
      },
      "tool_calls": [],
      "tool_call_chunks": [],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 160,
        "output_tokens": 13,
        "total_tokens": 173,
        "input_token_details": {},
        "output_token_details": {}
      }
    }
  ]
}
You: send an email to dharsubham32@gmail.com, subject : role of UN in the recent Iran-US war and how is UN helping in keeping peace, body: compose body by your self it contains the big steps taken in UN
Email sent: {
  accepted: [ 'dharsubham32@gmail.com' ],
  rejected: [],
  ehlo: [
    'SIZE 35882577',
    '8BITMIME',
    'AUTH LOGIN PLAIN XOAUTH2 PLAIN-CLIENTTOKEN OAUTHBEARER XOAUTH',
    'ENHANCEDSTATUSCODES',
    'PIPELINING',
    'CHUNKING',
    'SMTPUTF8'
  ],
  envelopeTime: 972,
  messageTime: 1005,
  messageSize: 5979,
  response: '250 2.0.0 OK  1779272843 d2e1a72fcca58-83f1977c494sm20150323b3a.21 - gsmtp',
  envelope: { from: 'siddy934@gmail.com', to: [ 'dharsubham32@gmail.com' ] },
  messageId: '<66a30f3d-d71f-666b-0821-24fb7d1142bb@gmail.com>'
}
AI: {
  messages: [
    HumanMessage {
      "id": "0cdaea8b-0065-43f8-a602-cba556001625",
      "content": "hello",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessageChunk {
      "id": "8ab233c6-be61-45e0-9a4e-0d84249a0432",
      "content": "Hello! How can I assist you today? 😊",
      "name": "model",
      "additional_kwargs": {},
      "response_metadata": {
        "estimatedTokenUsage": {},
        "prompt": 0,
        "completion": 0
      },
      "tool_calls": [],
      "tool_call_chunks": [],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 160,
        "output_tokens": 13,
        "total_tokens": 173,
        "input_token_details": {},
        "output_token_details": {}
      }
    },
    HumanMessage {
      "id": "07e40d9a-0eff-45c4-8416-bcd1553350f8",
      "content": "send an email to dharsubham32@gmail.com, subject : role of UN in the recent Iran-US war and how is UN helping in keeping peace, body: compose body by your self it contains the big steps taken in UN",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessageChunk {
      "id": "94f02ef2-dc40-4b08-b82a-c7880810b2c7",
      "content": "",
      "name": "model",
      "additional_kwargs": {},
      "response_metadata": {
        "estimatedTokenUsage": {},
        "prompt": 0,
        "completion": 0
      },
      "tool_calls": [
        {
          "name": "emailTool",
          "args": {
            "to": "dharsubham32@gmail.com",
            "subject": "Role of UN in the Recent Iran-US War and Peacekeeping Efforts",
            "html": "<html><body><p>Dear Recipient,</p><p>Greetings!</p><p>The United Nations (UN) has played a <strong>critical and multifaceted role</strong> in addressing the recent tensions and escalations between Iran and the United States. Below is an overview of the UN’s involvement and the significant steps it has taken to promote peace and prevent further conflict:</p><br/><h3>1. Diplomatic Intervention and Mediation</h3><ul><li><strong>UN Secretary-General’s Role:</strong> The UN Secretary-General, António Guterres, has consistently called for <strong>restraint, dialogue, and diplomatic solutions</strong> to de-escalate tensions. He has emphasized the importance of adhering to international law and avoiding actions that could lead to a full-scale war.</li><li><strong>Backchannel Diplomacy:</strong> The UN has facilitated <strong>backchannel communications</strong> between Iranian and US officials, often through intermediaries, to explore potential avenues for negotiation and conflict resolution.</li></ul><br/><h3>2. Resolutions and Condemnation</h3><ul><li><strong>UN Security Council Resolutions:</strong> The UN Security Council has issued statements and, in some cases, resolutions condemning military escalations, such as missile strikes or attacks on critical infrastructure (e.g., oil tankers, diplomatic missions). These resolutions aim to <strong>deter further aggression</strong> and uphold the principles of the UN Charter.</li><li><strong>General Assembly Statements:</strong> The UN General Assembly has passed resolutions calling for <strong>peaceful coexistence</strong> and respect for sovereignty, emphasizing that military solutions are not viable for long-term stability.</li></ul><br/><h3>3. Humanitarian Assistance and Protection</h3><ul><li><strong>UN Agencies’ Role:</strong> Agencies like <strong>UNOCHA (UN Office for the Coordination of Humanitarian Affairs), UNHCR, and WHO</strong> have been actively involved in providing humanitarian aid to affected populations, including refugees and displaced persons in the region.</li><li><strong>Protection of Civilians:</strong> The UN has stressed the need to protect civilians and ensure that <strong>human rights violations</strong> are addressed. Reports from UN human rights experts have documented civilian casualties and called for accountability.</li></ul><br/><h3>4. Nuclear Non-Proliferation and IAEA Oversight</h3><ul><li><strong>IAEA Safeguards:</strong> The International Atomic Energy Agency (IAEA), a UN-affiliated body, has continued to monitor Iran’s nuclear program to ensure compliance with the <strong>Joint Comprehensive Plan of Action (JCPOA)</strong>. The UN has urged all parties to return to the JCPOA framework to prevent nuclear proliferation in the region.</li><li><strong>Preventing Escalation to Nuclear Conflict:</strong> The UN has warned against any actions that could lead to a nuclear crisis, emphasizing the importance of the <strong>Non-Proliferation Treaty (NPT)</strong>.</li></ul><br/><h3>5. Regional Stability and Long-Term Peacebuilding</h3><ul><li><strong>Regional Dialogue Initiatives:</strong> The UN has supported initiatives like the <strong>Neighbouring Countries’ Dialogue</strong> to bring together regional stakeholders (e.g., Iraq, Gulf states, and European nations) to discuss ways to reduce tensions and foster economic cooperation.</li><li><strong>Economic Incentives:</strong> The UN has encouraged the lifting of sanctions and the resumption of trade to alleviate economic hardships in Iran and neighboring countries, which could otherwise fuel further instability.</li></ul><br/><h3>6. Peacekeeping and Conflict Prevention</h3><ul><li><strong>UN Peacekeeping Operations:</strong> While no new peacekeeping missions have been deployed specifically for the Iran-US conflict, existing missions in the <strong>Middle East (e.g., UNIFIL in Lebanon)</strong> have been reinforced to monitor ceasefires and prevent spillover effects.</li><li><strong>Early Warning Systems:</strong> The UN has strengthened its early warning mechanisms to detect and address potential flashpoints, such as proxy conflicts or attacks on shipping lanes in the Strait of Hormuz.</li></ul><br/><h3>7. Legal and Accountability Mechanisms</h3><ul><li><strong>International Court of Justice (ICJ):</strong> Iran has filed cases at the ICJ alleging violations of the 1955 Treaty of Amity with the US. The UN has supported these legal avenues as a means to resolve disputes peacefully.</li><li><strong>Sanctions and Compliance:</strong> The UN has reiterated the importance of adhering to sanctions regimes (e.g., those imposed by the UN Security Council) to avoid unintended consequences that could exacerbate the conflict.</li></ul><br/><p><strong>Conclusion:</strong><br/>The UN’s role in the Iran-US conflict has been <strong>proactive, diplomatic, and humanitarian</strong>. While challenges remain, the organization continues to serve as a vital platform for dialogue, accountability, and peacebuilding. Its efforts underscore the need for <strong>multilateral cooperation</strong> to address complex geopolitical crises.</p><p>For further details, you can refer to official UN statements, reports from UN agencies, and resolutions passed by the Security Council and General Assembly.</p><p>Best regards,<br/><strong>The UN Team</strong></p></body></html>"
          },
          "id": "jBGjeGEfS",
          "type": "tool_call"
        }
      ],
      "tool_call_chunks": [
        {
          "name": "emailTool",
          "args": "{\"to\": \"dharsubham32@gmail.com\", \"subject\": \"Role of UN in the Recent Iran-US War and Peacekeeping Efforts\", \"html\": \"<html><body><p>Dear Recipient,</p><p>Greetings!</p><p>The United Nations (UN) has played a <strong>critical and multifaceted role</strong> in addressing the recent tensions and escalations between Iran and the United States. Below is an overview of the UN’s involvement and the significant steps it has taken to promote peace and prevent further conflict:</p><br/><h3>1. Diplomatic Intervention and Mediation</h3><ul><li><strong>UN Secretary-General’s Role:</strong> The UN Secretary-General, António Guterres, has consistently called for <strong>restraint, dialogue, and diplomatic solutions</strong> to de-escalate tensions. He has emphasized the importance of adhering to international law and avoiding actions that could lead to a full-scale war.</li><li><strong>Backchannel Diplomacy:</strong> The UN has facilitated <strong>backchannel communications</strong> between Iranian and US officials, often through intermediaries, to explore potential avenues for negotiation and conflict resolution.</li></ul><br/><h3>2. Resolutions and Condemnation</h3><ul><li><strong>UN Security Council Resolutions:</strong> The UN Security Council has issued statements and, in some cases, resolutions condemning military escalations, such as missile strikes or attacks on critical infrastructure (e.g., oil tankers, diplomatic missions). These resolutions aim to <strong>deter further aggression</strong> and uphold the principles of the UN Charter.</li><li><strong>General Assembly Statements:</strong> The UN General Assembly has passed resolutions calling for <strong>peaceful coexistence</strong> and respect for sovereignty, emphasizing that military solutions are not viable for long-term stability.</li></ul><br/><h3>3. Humanitarian Assistance and Protection</h3><ul><li><strong>UN Agencies’ Role:</strong> Agencies like <strong>UNOCHA (UN Office for the Coordination of Humanitarian Affairs), UNHCR, and WHO</strong> have been actively involved in providing humanitarian aid to affected populations, including refugees and displaced persons in the region.</li><li><strong>Protection of Civilians:</strong> The UN has stressed the need to protect civilians and ensure that <strong>human rights violations</strong> are addressed. Reports from UN human rights experts have documented civilian casualties and called for accountability.</li></ul><br/><h3>4. Nuclear Non-Proliferation and IAEA Oversight</h3><ul><li><strong>IAEA Safeguards:</strong> The International Atomic Energy Agency (IAEA), a UN-affiliated body, has continued to monitor Iran’s nuclear program to ensure compliance with the <strong>Joint Comprehensive Plan of Action (JCPOA)</strong>. The UN has urged all parties to return to the JCPOA framework to prevent nuclear proliferation in the region.</li><li><strong>Preventing Escalation to Nuclear Conflict:</strong> The UN has warned against any actions that could lead to a nuclear crisis, emphasizing the importance of the <strong>Non-Proliferation Treaty (NPT)</strong>.</li></ul><br/><h3>5. Regional Stability and Long-Term Peacebuilding</h3><ul><li><strong>Regional Dialogue Initiatives:</strong> The UN has supported initiatives like the <strong>Neighbouring Countries’ Dialogue</strong> to bring together regional stakeholders (e.g., Iraq, Gulf states, and European nations) to discuss ways to reduce tensions and foster economic cooperation.</li><li><strong>Economic Incentives:</strong> The UN has encouraged the lifting of sanctions and the resumption of trade to alleviate economic hardships in Iran and neighboring countries, which could otherwise fuel further instability.</li></ul><br/><h3>6. Peacekeeping and Conflict Prevention</h3><ul><li><strong>UN Peacekeeping Operations:</strong> While no new peacekeeping missions have been deployed specifically for the Iran-US conflict, existing missions in the <strong>Middle East (e.g., UNIFIL in Lebanon)</strong> have been reinforced to monitor ceasefires and prevent spillover effects.</li><li><strong>Early Warning Systems:</strong> The UN has strengthened its early warning mechanisms to detect and address potential flashpoints, such as proxy conflicts or attacks on shipping lanes in the Strait of Hormuz.</li></ul><br/><h3>7. Legal and Accountability Mechanisms</h3><ul><li><strong>International Court of Justice (ICJ):</strong> Iran has filed cases at the ICJ alleging violations of the 1955 Treaty of Amity with the US. The UN has supported these legal avenues as a means to resolve disputes peacefully.</li><li><strong>Sanctions and Compliance:</strong> The UN has reiterated the importance of adhering to sanctions regimes (e.g., those imposed by the UN Security Council) to avoid unintended consequences that could exacerbate the conflict.</li></ul><br/><p><strong>Conclusion:</strong><br/>The UN’s role in the Iran-US conflict has been <strong>proactive, diplomatic, and humanitarian</strong>. While challenges remain, the organization continues to serve as a vital platform for dialogue, accountability, and peacebuilding. Its efforts underscore the need for <strong>multilateral cooperation</strong> to address complex geopolitical crises.</p><p>For further details, you can refer to official UN statements, reports from UN agencies, and resolutions passed by the Security Council and General Assembly.</p><p>Best regards,<br/><strong>The UN Team</strong></p></body></html>\"}",
          "id": "jBGjeGEfS",
          "index": 0,
          "type": "tool_call_chunk"
        }
      ],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 223,
        "output_tokens": 1243,
        "total_tokens": 1466
      }
    },
    ToolMessage {
      "id": "4a1b6e0d-a072-4b0b-8bbb-adc579fee4e2",
      "content": "email sent successfully to dharsubham32@gmail.com",
      "name": "emailTool",
      "additional_kwargs": {},
      "response_metadata": {},
      "tool_call_id": "jBGjeGEfS"
    },
    AIMessageChunk {
      "id": "85f81598-f65b-4771-8696-8aad7082a335",
      "content": "The email has been successfully sent to **dharsubham32@gmail.com** with the subject:\n\n**\"Role of UN in the Recent Iran-US War and Peacekeeping Efforts\"**\n\nThe email includes a detailed breakdown of the UN's actions, including:\n- Diplomatic intervention and mediation\n- Resolutions and condemnation\n- Humanitarian assistance\n- Nuclear non-proliferation efforts\n- Regional stability initiatives\n- Peacekeeping and conflict prevention\n- Legal and accountability mechanisms",
      "name": "model",
      "additional_kwargs": {},
      "response_metadata": {
        "estimatedTokenUsage": {},
        "prompt": 0,
        "completion": 0
      },
      "tool_calls": [],
      "tool_call_chunks": [],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 1480,
        "output_tokens": 99,
        "total_tokens": 1579,
        "input_token_details": {},
        "output_token_details": {}
      }
    }
  ]
}
You: 
=> let me explain whats happening here, human texted hello, AI replied "how can i help ? " or whatever, when i ask to send an email to dharsubham32@gmail.com, mensioning the subject and the content of the body, AI uses emailTool which passes 3 arguements, to, html, subject and performs our operation


//==================================

=> AI kabhi bhi directly tool ko call nahi kar sakta, createAgent method tool ko call karke unka result pass kar deti hai AI k pass

//==================================
Task::
use tavily to search from internet and report the data to AI