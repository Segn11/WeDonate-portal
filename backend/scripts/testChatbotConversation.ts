import { ChatBotService } from '../src/services/chatbot.service';

async function testConversationRecording() {
  console.log('Testing chatbot conversation recording...');
  
  try {
    // Test 1: Ask a question with session ID
    const sessionId = 'test-session-123';
    const query = 'How do I donate?';
    
    console.log(`\nTest 1: Asking question with session ID`);
    const answer1 = await ChatBotService.askWithAI(query, sessionId);
    console.log(`Question: ${query}`);
    console.log(`Answer: ${answer1}`);
    console.log(`Session ID: ${sessionId}`);
    
    // Test 2: Get conversation history
    console.log(`\nTest 2: Getting conversation history for session ${sessionId}`);
    const history = await ChatBotService.getConversationHistory(sessionId);
    console.log(`Conversation history:`, JSON.stringify(history, null, 2));
    
    // Test 3: Ask another question in same session
    const query2 = 'What documents are needed?';
    console.log(`\nTest 3: Asking another question in same session`);
    const answer2 = await ChatBotService.askWithAI(query2, sessionId);
    console.log(`Question: ${query2}`);
    console.log(`Answer: ${answer2}`);
    
    // Test 4: Get updated conversation history
    console.log(`\nTest 4: Getting updated conversation history`);
    const updatedHistory = await ChatBotService.getConversationHistory(sessionId);
    console.log(`Updated conversation history:`, JSON.stringify(updatedHistory, null, 2));
    
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testConversationRecording();
