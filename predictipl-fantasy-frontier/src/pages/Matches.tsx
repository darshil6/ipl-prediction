
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/components/ui/use-toast';
import { Trophy, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useMatchData } from '@/hooks/useMatchData';

interface Match {
  id: string;
  matchNumber: string;
  teams: {
    team1: string;
    team2: string;
  };
  date: string;
  time: string;
  venue: string;
  matchType: string;
  gmtTime: string;
  result?: string;  // For showing match results like "Chennai Super Kings won by 4 wkts"
  status?: string;  // For showing match status
}

// Add this function at the top of your file, after the imports
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const Matches = () => {
  const { data: matches, isLoading } = useMatchData();
  console.log('Matches data:', matches); // Add this to debug
  const [teamFilter, setTeamFilter] = useState('All Teams');
  const [venueFilter, setVenueFilter] = useState('All Venues');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  // Add these arrays back
  const teams = [
    'All Teams',
    'Mumbai Indians',
    'Chennai Super Kings',
    'Royal Challengers Bengaluru',
    'Kolkata Knight Riders',
    'Delhi Capitals',
    'Punjab Kings',
    'Rajasthan Royals',
    'Sunrisers Hyderabad',
    'Lucknow Super Giants',
    'Gujarat Titans'
  ];

  const venues = [
    'All Venues',
    'Mumbai',
    'Chennai',
    'Bengaluru',
    'Kolkata',
    'Delhi',
    'Ahmedabad',
    'Hyderabad',
    'Jaipur',
    'Lucknow',
    'Guwahati',
    'Chandigarh'
  ];

  const filteredMatches = matches?.filter(match => {
    if (!match) return false; // Add null check
    const teamMatches =
      teamFilter === 'All Teams' ||
      match.teams.team1.includes(teamFilter) ||
      match.teams.team2.includes(teamFilter);

    const venueMatches =
      venueFilter === 'All Venues' ||
      match.venue.includes(venueFilter);

    return teamMatches && venueMatches;
  }) || [];

  // Update the filter handlers
  const handleTeamFilter = (value: string) => {
    setTeamFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleVenueFilter = (value: string) => {
    setVenueFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);
  const paginatedMatches = filteredMatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setTeamFilter('All Teams');
    setVenueFilter('All Venues');
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-24 md:py-28">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 text-ipl-blue">IPL 2026 Match Schedule</h1>
          <p className="text-center text-gray-600 mb-10">
            View all upcoming and completed matches in IPL 2026
          </p>

          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full md:w-auto">
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={venueFilter} onValueChange={setVenueFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Venues" />
                </SelectTrigger>
                <SelectContent>
                  {venues.map(venue => (
                    <SelectItem key={venue} value={venue}>{venue}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={clearFilters}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                Clear Filter
              </Button>
            </div>
          </div>

          {/* Matches Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
            <div className="grid grid-cols-3 bg-gray-100 p-4 font-semibold text-ipl-blue border-b border-gray-200">
              <div>Date</div>
              <div>Match Details</div>
              <div>Time</div>
            </div>

            {isLoading ? (
              // Skeleton loader for matches
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="border-b border-gray-100 p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-12 w-32" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <Skeleton className="h-12 w-32" />
                  </div>
                </div>
              ))
            ) : (
              paginatedMatches.length > 0 ? (
                paginatedMatches.map((match) => (
                  <div
                    key={match.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 p-4">
                      <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <Calendar className="h-5 w-5 text-ipl-orange" />
                        <span className="font-medium">{match.date}</span>
                      </div>

                      <div className="space-y-2 mb-4 md:mb-0">
                        <div className="font-medium text-ipl-blue">{match.matchDetails}</div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{match.venue}</span>
                        </div>
                        {match.result && (
                          <div className="flex items-center space-x-2 text-sm font-medium text-ipl-orange">
                            <Trophy className="h-4 w-4" />
                            <span>{match.result}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-ipl-blue" />
                          <span className="font-medium">{match.time}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {match.gmtTime} / {match.localTime}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  {matches ? 'No matches found matching your filters' : 'No matches data available'}
                </div>
              )
            )}
          </div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(index + 1);
                      }}
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );

  // const renderMatchRow = (match: Match) => (
  //   <div className="match-row flex items-center justify-between p-4 border-b">
  //     <div className="flex-1">
  //       <div className="text-sm text-ipl-orange mb-1">
  //         {formatDate(match.date)}
  //       </div>
  //       <div className="text-lg font-semibold mb-2">
  //         {`${match.teams.team1} vs ${match.teams.team2}, ${match.matchNumber}`}
  //       </div>
  //       <div className="text-sm text-gray-600 mb-1">
  //         <span className="inline-flex items-center">
  //           <MapPin className="w-4 h-4 mr-1" />
  //           {match.venue}
  //         </span>
  //       </div>
  //       {match.result && (
  //         <div className="text-sm text-orange-500">
  //           {match.result}
  //         </div>
  //       )}
  //       {!match.result && (
  //         <div className="text-sm text-gray-600">
  //           {`${match.gmtTime} GMT / ${match.time} IST`}
  //         </div>
  //       )}
  //     </div>
  //     <div className="ml-4">
  //       <button className="px-4 py-2 bg-ipl-blue text-white rounded hover:bg-ipl-blue/90">
  //         Preview
  //       </button>
  //     </div>
  //   </div>
  // );
};

export default Matches;
