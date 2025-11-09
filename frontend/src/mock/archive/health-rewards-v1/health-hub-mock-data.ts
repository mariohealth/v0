// Mock data archived from mario-health-hub-refined.tsx
// Archive Date: November 10, 2024
// Context: Mock data used in Health Hub before migrating to live API calls

export const mockUpcomingAppointments = [
  {
    id: '1',
    provider: 'Dr. Sarah Johnson',
    specialty: 'Orthopedic Surgery',
    date: 'Tomorrow',
    time: '2:30 PM',
    status: 'confirmed' as const,
    marioPoints: 150
  },
  {
    id: '2',
    provider: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    date: 'Oct 18',
    time: '10:00 AM',
    status: 'pending' as const,
    marioPoints: 120
  }
];

export const mockPastAppointments = [
  {
    id: '3',
    provider: 'Dr. Emily Wong',
    specialty: 'Primary Care',
    date: 'Sep 28',
    time: '9:00 AM',
    status: 'confirmed' as const,
    marioPoints: 100,
    isPast: true
  }
];

export const mockConciergeRequests = [
  {
    id: 'REQ001',
    type: 'MRI Knee Scheduling',
    status: 'in-progress' as const,
    requestDate: 'Oct 3',
    expectedDate: 'Oct 10'
  }
];

export const mockRecentClaims = [
  {
    id: 'CLM001',
    service: 'Annual Physical Exam',
    provider: 'Dr. Sarah Johnson',
    amount: '$220',
    youOwe: '$25',
    date: 'Sep 28',
    status: 'paid' as const
  },
  {
    id: 'CLM002',
    service: 'Blood Work Panel',
    provider: 'City Lab Services',
    amount: '$150',
    youOwe: '$40',
    date: 'Sep 20',
    status: 'pending' as const
  }
];

export const mockMessages = [
  {
    id: 'MSG001',
    sender: 'Mario Concierge',
    message: 'Your MRI appointment has been scheduled for Oct 18.',
    time: '2 h ago',
    isNew: true
  }
];

export const mockDeductibleProgress = {
  current: 850,
  total: 2000,
  percentage: (850 / 2000) * 100
};

