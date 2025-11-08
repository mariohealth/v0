'use client'
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  ArrowLeft,
  Send,
  Paperclip,
  MoreVertical
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'concierge' | 'provider' | 'user';
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  title: string;
  participants: string[];
  messages: Message[];
}

interface InboxDetailProps {
  conversation: Conversation;
  onBack: () => void;
  onSendMessage: (message: string) => void;
}

export function MarioInboxDetail({ 
  conversation, 
  onBack, 
  onSendMessage 
}: InboxDetailProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const getSenderName = (sender: string) => {
    switch (sender) {
      case 'concierge': return 'Mario Concierge';
      case 'provider': return 'Provider';
      case 'user': return 'You';
      default: return sender;
    }
  };

  const getSenderAvatar = (sender: string) => {
    switch (sender) {
      case 'concierge': 
        return (
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0"
            style={{ backgroundColor: '#4DA1A9' }}
          >
            M
          </div>
        );
      case 'provider':
        return (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm flex-shrink-0">
            P
          </div>
        );
      case 'user':
        return (
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm flex-shrink-0">
            U
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm flex-shrink-0">
            ?
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card mario-shadow-card">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-semibold">{conversation.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {conversation.participants.join(', ')}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="p-2">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <div className="space-y-4">
          {conversation.messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {message.sender !== 'user' && getSenderAvatar(message.sender)}
              
              <Card 
                className={`p-3 max-w-xs ${
                  message.sender === 'user' 
                    ? 'ml-auto' 
                    : 'mr-auto'
                }`}
                style={{ 
                  backgroundColor: message.sender === 'user' ? '#2E5077' : '#FFFFFF',
                  color: message.sender === 'user' ? '#FFFFFF' : '#1A1A1A'
                }}
              >
                {message.sender !== 'user' && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">
                      {getSenderName(message.sender)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp}
                    </span>
                  </div>
                )}
                
                <p className="text-sm leading-relaxed">{message.content}</p>
                
                {message.sender === 'user' && (
                  <p 
                    className="text-xs mt-2 opacity-75"
                    style={{ color: message.sender === 'user' ? '#FFFFFF' : '#666666' }}
                  >
                    {message.timestamp}
                  </p>
                )}
              </Card>

              {message.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm flex-shrink-0">
                  U
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-card border-t border-border">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="text-white"
                style={{ backgroundColor: '#2E5077' }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}