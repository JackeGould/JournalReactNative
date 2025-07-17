import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true
});

const TestAI = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const msg = await anthropic.messages.create({
          model: 'claude-opus-4-20250514',
          max_tokens: 1000,
          temperature: 1,
          system: 'Respond only with short poems.',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Why is the ocean salty?'
                }
              ]
            }
          ]
        });
        
        const textContent = msg.content.find(block => block.type === 'text');
        setResponse(textContent?.text || 'No response received');
      } catch (error) {
        console.error('Error fetching AI response:', error);
        setResponse('Error loading response');
      } finally {
        setLoading(false);
      }
    };

    fetchResponse();
  }, []);

  return (
    <View>
      <Text>
        {loading ? 'Loading...' : response}
      </Text>
    </View>
  );
};

export default TestAI;