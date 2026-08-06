import useGraph from './src/services/graph.ai.service.js';

const result = await useGraph('write a factorial function in javascript');
console.log('=== FINAL MESSAGES ===');
console.log(JSON.stringify(result, null, 2));
