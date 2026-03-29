// import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMatchData } from '@/hooks/useMatchData';
// Remove this line
// import { teamMapping } from '@/utils/teamData';

interface Team {
  id: number;
  name: string;
  shortName: string;
  logo: string;
}

// Update the interfaces to match the API response
// First update the Match interface
interface Match {
  id: string;
  matchNumber: string;  // Add this field
  teams: {
    team1: string;
    team2: string;
  };
  date: string;
  time: string;
  venue: string;
  matchType: string;
  gmtTime?: string;  // Add this field
}

const teamMapping: { [key: string]: { shortName: string; logo: string } } = {
  'Mumbai Indians': { 
    shortName: 'MI', 
    logo: 'src/components/logos/MI.svg' 
  },
  'Chennai Super Kings': { 
    shortName: 'CSK', 
    logo: 'src/components/logos/CSK.svg' 
  },
  'Royal Challengers Bengaluru': {
    shortName: 'RCB',
    logo: `src/components/logos/RCB.svg`
  },
  'Kolkata Knight Riders': {
    shortName: 'KKR',
    logo: `src/components/logos/KKR.svg`
  },
  'Delhi Capitals': {
    shortName: 'DC',
    logo: 'src/components/logos/DC.svg'
  },
  'Punjab Kings': {
    shortName: 'PBKS',
    logo: 'src/components/logos/PBKS.svg'
  
  },
  'Rajasthan Royals': {
    shortName: 'RR',
    logo: 'src/components/logos/RR.svg'
  },
  'Sunrisers Hyderabad': {
    shortName: 'SRH',
    logo: 'src/components/logos/SRH.svg'
  },
  'Lucknow Super Giants': {
    shortName: 'LSG',
    logo: 'src/components/logos/LSG.svg'
  },
  'Gujarat Titans': {
    shortName: 'GT',
    logo: 'src/components/logos/GT.svg'
  }
};

const MatchSchedule = () => {
  const { data: matches, isLoading } = useMatchData();
  const navigate = useNavigate();

  // Modified filter to include today's matches that haven't finished
  const upcomingMatches = matches
    ? matches
        .filter(match => {
          const matchDate = new Date(match.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set to start of day
          return matchDate >= today;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3)
    : [];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handlePredictNow = () => {
    navigate('/winnings');
  };

  const handleViewAllMatches = () => {
    navigate('/matches');
  };

  return (
    <section className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-ipl-blue mb-4">Upcoming Matches</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest match schedule and make your predictions ahead of time
          </p>
        </div>

        {isLoading ? (
          // Skeleton loader
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-12 bg-gray-200 rounded-md mb-4"></div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mb-2"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded-md"></div>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mb-2"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded-md"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded-md mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-md w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingMatches.map((match) => (
              <div key={match.id} className="match-card bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg flex flex-col h-full">
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold text-ipl-orange">{formatDate(match.date)}</span>
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">{match.matchNumber} Match</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col items-center w-1/3">
                      <img 
                        src={teamMapping[match.teams.team1]?.logo || '/default-team-logo.png'}
                        alt={match.teams.team1}
                        className="team-logo w-16 h-16 object-contain mb-2"
                      />
                      <span className="font-bold text-ipl-blue">{teamMapping[match.teams.team1]?.shortName}</span>
                    </div>
                    
                    <div className="text-lg font-bold">
                      VS
                    </div>
                    
                    <div className="flex flex-col items-center w-1/3">
                      <img 
                        src={teamMapping[match.teams.team2]?.logo || '/default-team-logo.png'}
                        alt={match.teams.team2}
                        className="team-logo w-16 h-16 object-contain mb-2"
                      />
                      <span className="font-bold text-ipl-blue">{teamMapping[match.teams.team2]?.shortName}</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="font-semibold text-gray-800 mb-1">{match.time} IST</p>
                    <p className="text-sm text-gray-600">{match.venue}</p>
                  </div>
                </div>
                
                <button 
                  onClick={handlePredictNow}
                  className="w-full mt-6 py-2 bg-ipl-blue text-white rounded-lg hover:bg-ipl-blue/90 transition-colors font-medium text-sm"
                >
                  Predict Now
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <button 
            onClick={handleViewAllMatches}
            className="group inline-flex items-center text-ipl-blue font-medium"
          >
            View All Matches
            <svg 
              className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default MatchSchedule;