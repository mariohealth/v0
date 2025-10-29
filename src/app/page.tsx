'use client';

import { CategoryList } from '../components/CategoryList';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mario Health
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse healthcare categories and find the services you need
          </p>
        </div>
        
        <CategoryList />
      </div>
    </div>
  );
}

