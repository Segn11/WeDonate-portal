import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  ChevronDown,
  ChevronUp,
  Heart,
  ShieldCheck,
  Building2,
  FileText,
  Phone,
  Mail,
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const FAQ_RESPONSES: Record<string, string> = {
  // General System Questions
  'what is this system': 'The Adama Support Portal is an official municipal charity management system for Adama City Administration. It digitizes compassion and ensures transparent support distribution through a 3-tier government verification system (Kebele → Woreda → Direct Delivery).',
  
  'how does it work': 'The system works through a transparent 3-tier verification process:\n\n1. **Kebele Verification**: Citizens submit requests with National/Kebele IDs. Local administrators verify household income.\n2. **Woreda Endorsement**: Sub-city supervisors conduct second-tier audit checks and approve campaigns.\n3. **Direct Delivery**: Donations are assigned directly to approved requests with digital receipt confirmation.',
  
  'who can use': 'The system is designed for:\n- **Donors**: Individuals, NGOs, Companies, and Diaspora who want to contribute\n- **Beneficiaries**: Citizens in need of support who can apply with proper documentation\n- **Administrators**: Kebele, Woreda, and City officials who verify and approve requests',
  
  // Donation Questions
  'how to donate': 'You can donate in two ways:\n\n1. **As a Guest**: Click the "Donate Now" button on the landing page - no registration required!\n2. **As a Registered Donor**: Log in to your donor portal for tracking and receipt management\n\nPayment methods include Telebirr and CBE Bank transfer.',
  
  'what can i donate': 'You can donate:\n- **Money**: Financial contributions via Telebirr or CBE Bank\n- **Items**: Physical goods like food supplies, clothing, medical supplies, school kits, etc.',
  
  'minimum donation': 'The minimum monetary donation is 100 ETB. For items, there is no minimum - any contribution helps!',
  
  'is it safe': 'Yes! The system is 100% verified through:\n- Government ID poverty audit\n- Kebele resident verification\n- Woreda supervisor approval\n- Digital receipt tracking\n- Transparent distribution logging',
  
  // Beneficiary Questions
  'how to apply': 'To apply for support:\n\n1. Click "Apply for Support" on the landing page\n2. Register as a beneficiary with your Kebele ID\n3. Submit your support request with required documents\n4. Wait for Kebele verification (typically 1-3 days)\n5. Track your request status in your dashboard',
  
  'what documents needed': 'Required documents include:\n- National ID or Kebele Resident ID\n- Proof of income or financial hardship\n- Support request details\n- Any relevant medical or emergency documentation',
  
  'how long approval': 'Approval timeline:\n- Kebele verification: 1-3 days\n- Woreda review: 2-5 days\n- Total: Typically 3-8 days for full approval and publishing',
  
  // Transparency Questions
  'how is it transparent': 'Transparency features include:\n- Real-time donation tracking\n- Public transparency portal\n- Digital receipt verification codes\n- Distribution photo documentation\n- Beneficiary signature confirmation\n- Audit trail for all transactions',
  
  'can i track my donation': 'Yes! As a registered donor, you can:\n- Track all your donations in real-time\n- View distribution status\n- Download digital receipts\n- See beneficiary impact stories',
  
  // Contact Questions
  'contact support': 'For support:\n\n📞 Phone: +251 22 111 0000 / +251 22 112 0011\n📧 Email: support@adama.gov.et\n📍 Address: Adama Mayor Cabinet Office, Bole Road',
  
  'office hours': 'Office hours:\n- Monday to Friday: 8:00 AM - 5:00 PM\n- Saturday: 9:00 AM - 1:00 PM\n- Sunday: Closed',
  
  // Technical Questions
  'technical support': 'For technical issues:\n- Email: tech@adama.gov.et\n- Phone: +251 22 111 0000 (ext. 5)\n- Response time: Within 24 hours',
  
  'default': 'I can help you with information about the Adama Support Portal. Try asking about:\n\n- How the system works\n- How to donate or apply for support\n- Verification process\n- Transparency features\n- Contact information\n\nOr type "help" for more options.',
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 Welcome to Adama Support Portal! I\'m here to help you with any questions about our system. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase().trim();
    
    // Direct keyword matching
    for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
      if (key === 'default') continue;
      
      const keywords = key.split(' ');
      const matchCount = keywords.filter(keyword => 
        lowerQuery.includes(keyword) || lowerQuery.includes(keyword.replace(' ', ''))
      ).length;
      
      if (matchCount >= keywords.length * 0.5) {
        return response;
      }
    }
    
    // Fallback responses for common intents
    if (lowerQuery.includes('donate') || lowerQuery.includes('give') || lowerQuery.includes('contribute')) {
      return FAQ_RESPONSES['how to donate'];
    }
    if (lowerQuery.includes('apply') || lowerQuery.includes('request') || lowerQuery.includes('beneficiary')) {
      return FAQ_RESPONSES['how to apply'];
    }
    if (lowerQuery.includes('safe') || lowerQuery.includes('secure') || lowerQuery.includes('trust')) {
      return FAQ_RESPONSES['is it safe'];
    }
    if (lowerQuery.includes('contact') || lowerQuery.includes('phone') || lowerQuery.includes('email') || lowerQuery.includes('address')) {
      return FAQ_RESPONSES['contact support'];
    }
    if (lowerQuery.includes('transparent') || lowerQuery.includes('track') || lowerQuery.includes('receipt')) {
      return FAQ_RESPONSES['how is it transparent'];
    }
    if (lowerQuery.includes('work') || lowerQuery.includes('process') || lowerQuery.includes('system')) {
      return FAQ_RESPONSES['how does it work'];
    }
    if (lowerQuery.includes('who') || lowerQuery.includes('use') || lowerQuery.includes('access')) {
      return FAQ_RESPONSES['who can use'];
    }
    
    return FAQ_RESPONSES['default'];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = findBestResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'How to donate?',
    'How to apply for support?',
    'How does the system work?',
    'Is it safe to donate?',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
          title="Chat with us"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-96 max-w-[calc(100vw-2rem)] overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Adama Support Assistant</h3>
                  <p className="text-xs text-emerald-100">Online • Ready to help</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isMinimized ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <>
              <div className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-emerald-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-emerald-600 text-white rounded-br-md'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line leading-relaxed">
                        {message.text}
                      </p>
                      <p className="text-[10px] mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-slate-600" />
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length <= 2 && (
                <div className="px-4 py-2 border-t border-slate-200 bg-white">
                  <p className="text-xs font-bold text-slate-600 mb-2">Quick Questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question) => (
                      <button
                        key={question}
                        onClick={() => {
                          setInputText(question);
                          handleSendMessage();
                        }}
                        className="text-xs bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 px-3 py-1.5 rounded-full transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-slate-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your question..."
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
