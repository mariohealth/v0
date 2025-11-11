// Conversation scripts archived from mario-ai-chat-enhanced.tsx
// Archive Date: November 10, 2024
// Context: Mock conversation scripts used in MarioAI chat before migrating to live API calls

export const conversationScripts = {
  chest_tightness: {
    keywords: ['chest', 'tightness', 'shortness', 'breath', 'breathing', 'cardiac', 'heart'],
    script: [
      {
        trigger: 'initial',
        response: "That sounds uncomfortable. Are you experiencing this pain right now or mainly with activity?",
        speaker: 'mario'
      },
      {
        trigger: 'activity',
        response: "Thanks for clarifying. While this can have several causes, it's safest to have a medical evaluation. I can help you compare nearby cardiologists or urgent-care options.",
        speaker: 'mario',
        type: 'suggestion',
        options: [
          "View cardiologists near me",
          "Book urgent-care visit",
          "Learn about chest pain causes"
        ]
      }
    ],
    doctor: {
      name: 'Dr. Fatima Khan',
      specialty: 'Cardiology',
      distance: '4.1 mi',
      price: '$280',
      rating: '4.89',
      network: 'In-Network',
      points: 150
    }
  },
  knee_pain: {
    keywords: ['knee', 'joint', 'jogging', 'running', 'exercise', 'orthopedic', 'pain'],
    script: [
      {
        trigger: 'initial',
        response: "Got it. Knee pain after exercise could be from joint strain or inflammation. How long has it been bothering you?",
        speaker: 'mario'
      },
      {
        trigger: 'duration',
        response: "Thanks. I can help you find an orthopedic specialist or physical therapist nearby, and show typical MRI or consultation costs.",
        speaker: 'mario',
        type: 'suggestion',
        options: [
          "Compare Orthopedic doctors",
          "View MRI knee pricing",
          "Chat with a physical therapist"
        ]
      }
    ],
    doctor: {
      name: 'Dr. Sarah Johnson',
      specialty: 'Orthopedic Surgery',
      distance: '2.1 mi',
      price: '$425',
      rating: '4.90',
      network: 'In-Network',
      points: 150
    }
  },
  headache: {
    keywords: ['headache', 'migraine', 'head', 'pain', 'recurring'],
    script: [
      {
        trigger: 'initial',
        response: "I'm sorry to hear that. Are they constant or do they come and go?",
        speaker: 'mario'
      },
      {
        trigger: 'pattern',
        response: "Okay. Stress, dehydration, or eye strain can contribute — but it's best to rule out other causes. Would you like to connect with a primary-care or neurology provider?",
        speaker: 'mario',
        type: 'suggestion',
        options: [
          "Find Neurology doctors",
          "Book Primary Care visit",
          "See home remedies"
        ]
      }
    ],
    doctor: {
      name: 'Dr. Marcus Nguyen',
      specialty: 'Neurology',
      distance: '2.9 mi',
      price: '$320',
      rating: '4.81',
      network: 'In-Network',
      points: 140
    }
  },
  diabetes_medication: {
    keywords: ['diabetes', 'metformin', 'medication', 'refill', 'prescription'],
    script: [
      {
        trigger: 'initial',
        response: "Sure thing. I can show current cash and insurance prices for Metformin 500 mg near you.",
        speaker: 'mario',
        type: 'dataDisplay',
        data: {
          marioPick: "Cost Plus Drugs — $9.90",
          alternatives: [
            { pharmacy: "Walgreens", price: "$10.50", source: "GoodRx" },
            { pharmacy: "Walmart", price: "$9.90", source: "SingleCare" },
            { pharmacy: "CVS Pharmacy", price: "$10.20", source: "GoodRx" }
          ]
        }
      }
    ]
  },
  allergies: {
    keywords: ['allergy', 'allergies', 'seasonal', 'sneezing', 'itching'],
    script: [
      {
        trigger: 'initial',
        response: "That's tough — seasonal allergies can be rough. Do you want to see over-the-counter relief options or nearby allergy specialists?",
        speaker: 'mario',
        type: 'suggestion',
        options: [
          "Compare allergy meds",
          "Find allergy doctors",
          "View symptom tips"
        ]
      }
    ],
    doctor: {
      name: 'Dr. Jason Patel',
      specialty: 'Allergy & Immunology',
      distance: '2.4 mi',
      price: '$170',
      rating: '4.82',
      network: 'In-Network',
      points: 100
    }
  },
  sleep_issues: {
    keywords: ['sleep', 'insomnia', 'sleeping', 'tired', 'fatigue'],
    script: [
      {
        trigger: 'initial',
        response: "I'm sorry to hear that. Would you like to review lifestyle tips, or speak to a sleep specialist or mental-health provider?",
        speaker: 'mario',
        type: 'suggestion',
        options: [
          "Book Sleep Specialist",
          "Chat with Mental-Health Provider",
          "View sleep hygiene tips"
        ]
      }
    ],
    doctor: {
      name: 'Dr. Kevin Park',
      specialty: 'Psychiatry',
      distance: '1.7 mi',
      price: '$210',
      rating: '4.93',
      network: 'In-Network',
      points: 125
    }
  }
};

// Detect conversation topic from user message
export const detectTopic = (message: string): keyof typeof conversationScripts | null => {
  const lowerMessage = message.toLowerCase();
  
  for (const [topic, data] of Object.entries(conversationScripts)) {
    if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return topic as keyof typeof conversationScripts;
    }
  }
  
  return null;
};

