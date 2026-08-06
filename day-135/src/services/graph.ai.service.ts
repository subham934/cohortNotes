import {
  StateSchema,
  MessagesValue, // ak node se dusre node kya message jayenge , usko hum MessagesValue bolte hain . basically it is a schema of the messages that will be passed between the nodes.
  StateGraph, // we use this to create a graph of nodes . 
  START, // it is a starting point of the graph . 
  END, // it is a ending point of the graph . 
} from '@langchain/langgraph';

type JUDGEMENT = {
  winner: 'solution_1' | 'solution_2';
  solution_1_score: number;
  solution_2_score: number;
};

type AIBATTLESTATE = {
  messages: typeof MessagesValue;
  solution_1: string;
  solution_2: string;
  judgement: JUDGEMENT;
};

const state: AIBATTLESTATE = {
  messages: MessagesValue,
  solution_1: '',
  solution_2: '',
  judgement: { winner: 'solution_1', solution_1_score: 0, solution_2_score: 0 },
};
