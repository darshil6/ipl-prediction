
import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const Categories = () => {
  const categories: Category[] = [
    {
      id: 'ipl',
      name: 'IPL',
      icon: '🏆',
      description: 'Indian Premier League matches'
    },
    {
      id: 't20',
      name: 'T20',
      icon: '⚡',
      description: 'T20 International matches'
    },
    {
      id: 'odi',
      name: 'ODI',
      icon: '🏏',
      description: 'One Day International matches'
    },
    {
      id: 'test',
      name: 'Test',
      icon: '🧪',
      description: 'Test cricket matches'
    },
    {
      id: 'icc',
      name: 'ICC',
      icon: '🌍',
      description: 'ICC tournament matches'
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState('ipl');

  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-ipl-blue mb-4">Select Match Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose your preferred match format to make predictions across different cricket competitions
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`category-card rounded-xl p-6 text-center cursor-pointer border ${
                selectedCategory === category.id
                  ? 'border-ipl-orange bg-ipl-orange/5'
                  : 'border-gray-100 bg-white'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-4xl mb-3">{category.icon}</span>
                <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className={`w-4 h-4 rounded-full bg-ipl-orange mr-2`}></div>
            <h3 className="font-bold text-xl">
              {categories.find(c => c.id === selectedCategory)?.name} Matches
            </h3>
          </div>
          
          <p className="text-gray-600 mb-4">
            {selectedCategory === 'ipl' && 'Get predictions for all matches in the Indian Premier League. IPL is a professional Twenty20 cricket league in India contested by ten teams based out of ten Indian cities.'}
            {selectedCategory === 't20' && 'Twenty20 cricket or T20 is a shortened format of cricket. At the professional level, it was introduced by the England and Wales Cricket Board in 2003 for the inter-county competition.'}
            {selectedCategory === 'odi' && 'One Day International (ODI) is a form of limited overs cricket, played between two international teams, in which each team faces a fixed number of overs, usually 50.'}
            {selectedCategory === 'test' && 'Test cricket is the form of the sport of cricket with the longest match duration and is considered the game\'s highest standard.'}
            {selectedCategory === 'icc' && 'International Cricket Council (ICC) tournaments include the Cricket World Cup, T20 World Cup, and other major international cricket competitions.'}
          </p>
          
          <button className="bg-ipl-blue text-white py-2 px-6 rounded-lg hover:bg-ipl-blue/90 transition-colors">
            View {categories.find(c => c.id === selectedCategory)?.name} Matches
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;
