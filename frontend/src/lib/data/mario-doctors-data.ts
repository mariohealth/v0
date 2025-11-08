export interface MarioDoctor {
    id: string;
    name: string;
    specialty: string;
    location: string;
    rating: string;
    price: string;
    distance: string;
}

export const marioDoctorsData: MarioDoctor[] = [
    {
        id: 'dr-sarah-johnson',
        name: 'Dr. Sarah Johnson',
        specialty: 'Orthopedic Surgery',
        location: 'San Francisco, CA',
        rating: '4.9',
        price: '$425',
        distance: '2.1 mi',
    },
    {
        id: 'dr-angela-patel',
        name: 'Dr. Angela Patel',
        specialty: 'Internal Medicine',
        location: 'San Francisco, CA',
        rating: '4.8',
        price: '$160',
        distance: '1.9 mi',
    },
    {
        id: 'dr-lee-chen',
        name: 'Dr. Lee Chen',
        specialty: 'Cardiology',
        location: 'Oakland, CA',
        rating: '4.7',
        price: '$240',
        distance: '3.0 mi',
    },
    {
        id: 'dr-michael-ortiz',
        name: 'Dr. Michael Ortiz',
        specialty: 'Dermatology',
        location: 'San Francisco, CA',
        rating: '4.9',
        price: '$180',
        distance: '2.4 mi',
    },
    {
        id: 'dr-emily-rivera',
        name: 'Dr. Emily Rivera',
        specialty: 'Pediatrics',
        location: 'Berkeley, CA',
        rating: '4.8',
        price: '$130',
        distance: '1.7 mi',
    },
    {
        id: 'dr-james-wilson',
        name: 'Dr. James Wilson',
        specialty: 'Primary Care',
        location: 'San Francisco, CA',
        rating: '4.6',
        price: '$150',
        distance: '2.8 mi',
    },
];
