at first we install @langchain/langgraph package

npm install @langchain/langgraph @langchain/core

we will create the graph once again.

->state ak object hoti hai, usme by default ak property hoti hai jiska naam hai, 'messages'.
->"messages" ak array hoti hai, jo user aur AI ka conversation store karti hai .
->state ak object hoti hai, jiske andar hum data store karte hai, is data ko nodes ke beech pass kiya jata hai.
-> state main aur properties hai,
-> eg: solution_1: "string",
-> solution_2: "string",
-> judge_recommendation: {
solution_1_score: number,
solution_2_score: number,
}
-> judge humko final output dega ki kaunsi AI ka score better hai.

-> user jab pehla message karega, toh wo message ak problem statement hogi. uss message ko hum start node ke andar push karenge. start node main "messages" property ke andar ak ak array hoti hai, uss array ke andar hum user ka message push karenge. uss tarah state mein data store ho jayega.

->graph humesha start node se start hoga.

we will rewrite the graph.ai.service.ts file.

```ts
-------------------
graph.ai.service.ts
-------------------
import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, ReducedValue, StateGraph, START, END } from "@langchain/langgraph";


import type { GraphNode } from "@langchain/langgraph";

const State = new StateSchema({
  messages: MessagesValue,

})


const solutionNode: GraphNode<typeof State> = async(state:typeof State) => {
  console.log(state.messages);
  return{
    messages: "This is the solution.",
  }
}

const graph = new StateGraph(State)
    .addNode("solution", solutionNode)
    .addEdge(START, "solution")
    .compile()


export default async function(userMessage:string){
  const result = await graph.invoke({
    messages:[
      new HumanMessage(userMessage)
    ]
  })
  return result.messages;
};
```

📦 Block 1: Imports (Zaroori Saaman Mangwana)

import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, ReducedValue, StateGraph, START, END } from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";

HumanMessage: LangChain me har ek message ek object hota hai. Jab ek user, AI se baat karta hai, toh uske text ko hum HumanMessage ke dibbe me band karte hain taaki AI samajh sake ki yeh user ne pucha hai.

StateSchema aur MessagesValue: Yeh dono cheezein graph ki memory (bahi-khata) ka dacha banane ke liye hain.

StateGraph, START, END: Yeh graph ki machine aur uske entry/exit gates banane ke liye hain.

type { GraphNode }: Yeh sirf TypeScript ko batane ke liye hai ki hum ek LangGraph waala node (worker function) banane ja rahe hain (yeh sirf type-checking ke liye hai, runtime par iska koi kaam nahi hota).

🧠 Block 2: State Define Karna (Memory Ka Dacha)

const State = new StateSchema({
messages: MessagesValue,
})

Yahan kya ho raha hai? Hum computer ko bata rahe hain ki jab hamara graph chalega, toh uski memory ke andar kis tarah ka data rahega.

messages: MessagesValue: Humne bola ki memory me ek key hogi jiska naam hoga messages. Aur uski value MessagesValue hogi. LangGraph me MessagesValue ka ek bohot bada fada hota hai—yeh ek array/list hoti hai jo chat history ko sambhalti hai. Jab bhi koi naya message aayega, yeh use purane messages me append (jodti) chali jayegi, use delete nahi karegi.

🛠️ Block 3: Node Banana (The Worker Function)
    
const solutionNode: GraphNode<typeof State> = async(state: typeof State) => {
console.log(state.messages);
return {
messages: "This is the solution.",
}
}

Yahan kya ho raha hai? Yeh hamara akela worker function hai jiska naam humne rakha hai solutionNode.

async(state: typeof State): Jab graph is node par pahunchega, toh woh isko abhi tak ki poori memory (state) laakar dega.

console.log(state.messages): Yeh worker sabse pehle terminal me print karega ki abhi tak memory me kya-kya messages hain (jaise user ka sawal).

return { messages: "This is the solution." }: Apna kaam khatam karne ke baad, yeh worker wapas kuch data bhej raha hai. Yeh jo bhi return karega, woh sidhe jaakar main State (Memory) me update ho jayega.
(Note: Jaise maine pehle bataya tha, TypeScript me isko exact object new AIMessage(...) return karna chahiye, par abhi concept ke liye samjho ki yeh ek reply return kar raha hai).

🗺️ Block 4: Graph Assemble Karna (Blueprint)

const graph = new StateGraph(State)
.addNode("solution", solutionNode)
.addEdge(START, "solution")
.compile()

new StateGraph(State): Humne ek naya khali naqsha banaya aur bola ki is naqshe ka bahi-khata State rahega.

.addNode("solution", solutionNode): Humne naqshe par ek station/stop banaya jiska naam rakha "solution" (kuch bhi naam rakh sakte hain) aur usme upar waale solutionNode function ko fit kar diya.

.addEdge(START, "solution"): Humne ek teer (arrow) lagaya aur bola ki jaise hi graph shuru ho (START), toh sabse pehle sidhe "solution" naam ke station par jana.

.compile(): Humne is poore naqshe ko lock karke ek chalti-phirti executable machine (graph variable) me convert kar diya.

🏃‍♂️ Block 5: Exported Function (The Main Trigger)

export default async function(userMessage: string){
const result = await graph.invoke({
messages: [
new HumanMessage(userMessage)
]
})
return result.messages;
};

Yeh is file ka main gate hai jise app.ts call karega.

userMessage: string: app.ts se is function ko ek text milega, jaise: "What is the capital of France?".

new HumanMessage(userMessage): Humne us normal text ko LangChain ke HumanMessage format me convert kiya (yaani uspar "User ka Message" ka thappa laga diya).

graph.invoke({ messages: [...] }): Humne apni bani hui machine (graph) ka start button daba diya (invoke) aur uski memory (State) me shuruati input ke taur par woh HumanMessage bhej diya.

Machine ka chalna:

Data START gate se andar gaya.

START ka arrow use "solution" node ke paas le gaya.

solutionNode function chala. Usne console.log kiya aur apna response return kiya.

Kyunki aage koi edge (arrow) nahi hai, machine samajh gayi ki ab kaam khatam ho gaya hai (END).

const result = await ...: Machine rukne ke baad, jo final updated State bacha, woh is result variable me aa gaya.

return result.messages: Is function ne poori chat history (user ka sawal + AI ka jawab) wapas app.ts ko bhej di.

🔥 Real-Life Flow Simulation (Mental Run)

Socho aapne is function ko call kiya: useGraph("Hello")

State ban gayi: { messages: [ HumanMessage("Hello") ] }

Graph START hua: Arrow gaya solution node par.

solutionNode active hua:

Usne terminal me print kiya: [ HumanMessage("Hello") ]

Usne return kiya: { messages: "This is the solution." }

State update hui: Kyunki MessagesValue append karta hai, ab state ban gayi:
{ messages: [ HumanMessage("Hello"), "This is the solution." ] }

Graph END hua: result variable me poori state aa gayi.

Return hua: result.messages (yaani dono messages ki list).


//=======================================


1. Aapne function chalaya aur graph ko bola: "Hey, what is the capital of France?"

2. LangChain ne uspar thappa lagaya: [ HumanMessage("What is the capital...") ]

3. Yeh message aapke State (memory) me chala gaya.

4. Graph START hua aur arrow use sidhe aapke solutionNode ke paas le gaya.

5. solutionNode ne dekha memory me ek sawal aaya hai. Usne apna jawab ("This is the solution.") return kar diya.

6. LangGraph ne is jawab ko purane message ke sath jod diya. Ab memory me dono baatein hain.

7. Graph khatam ho gaya, aur aapko final result mil gaya.


//=========================================

