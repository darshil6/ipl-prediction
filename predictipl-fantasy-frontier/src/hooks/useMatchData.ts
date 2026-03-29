// import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_CONFIG, getApiOptions } from '../config/api';

export interface Match {
  id: string;
  teams: {
    team1: string;
    team2: string;
  };
  date: string;
  time: string;
  venue: string;
  matchType: string;
}

export interface PointsTableEntry {
  teamName: string;
  matches: number;
  won: number;
  lost: number;
  tied: number;
  points: number;
  nrr: number;
}

const fetchMatchData = async () => {
  const response = await fetch(
    `https://${API_CONFIG.RAPIDAPI_HOST}/series/v1/${API_CONFIG.IPL_SERIES_ID}`,
    getApiOptions()
  );
  if (!response.ok) throw new Error('Failed to fetch match data');
  return response.json();
};

const fetchPointsTable = async () => {
  const response = await fetch(
    `https://${API_CONFIG.RAPIDAPI_HOST}/stats/v1/series/${API_CONFIG.IPL_SERIES_ID}/points-table`,
    getApiOptions()
  );
  const data = await response.json();
  console.log('IPL 2026 API Response:', JSON.stringify(data, null, 2));
  return data;
};

export const usePointsTable = () => {
  return useQuery({
    queryKey: ['pointsTable'],
    queryFn: fetchPointsTable,
    staleTime: 30 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: () => shouldRefreshData('pointsTable') ? 0 : 30 * 60 * 1000,
    select: (data) => {
      if (!data || !data.pointsTable) return [];

      const ipl_teams = data.pointsTable[0]?.pointsTableInfo || [];

      return ipl_teams.map((team: any) => ({
        teamName: team.teamFullName || team.teamName,
        matches: team.matchesPlayed || 0,
        won: team.matchesWon || 0,
        lost: team.matchesLost || 0,
        tied: team.matchesTied || 0,
        points: team.points || 0,
        nrr: parseFloat(team.nrr?.replace('+', '') || '0').toFixed(3)
      }));
    }
  });
};

const shouldRefreshData = (queryKey: string) => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST offset from UTC in milliseconds
  const istTime = new Date(now.getTime() + istOffset);

  if (queryKey === 'pointsTable') {
    // Refresh points table at 12:00 AM IST
    const lastRefresh = localStorage.getItem('lastPointsTableRefresh');
    const today = istTime.toDateString();

    if (lastRefresh !== today) {
      localStorage.setItem('lastPointsTableRefresh', today);
      return true;
    }
    return false;
  }

  if (queryKey === 'matches') {
    const hours = istTime.getUTCHours();
    const minutes = istTime.getUTCMinutes();
    const currentTime = hours * 60 + minutes;

    // Refresh at 3:30 PM (930 minutes) and 7:30 PM (1170 minutes) IST
    return currentTime === 930 || currentTime === 1170;
  }

  return false;
};

export const useMatchData = () => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatchData,
    staleTime: 30 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: () => shouldRefreshData('matches') ? 0 : 30 * 60 * 1000,
    select: (data) => {
      const processedMatches: Match[] = [];
      if (data && data.matchDetails) {
        Object.values(data.matchDetails).forEach((dateData: any) => {
          if (dateData.matchDetailsMap && dateData.matchDetailsMap.match) {
            dateData.matchDetailsMap.match.forEach((match: any) => {
              const matchInfo = match.matchInfo;
              processedMatches.push({
                id: matchInfo.matchId.toString(),
                matchDetails: `${matchInfo.team1.teamName} vs ${matchInfo.team2.teamName}`,
                teams: {
                  team1: matchInfo.team1.teamName,
                  team2: matchInfo.team2.teamName
                },
                venue: `${matchInfo.venueInfo.ground}, ${matchInfo.venueInfo.city}`,
                date: new Date(parseInt(matchInfo.startDate)).toLocaleDateString(),
                time: new Date(parseInt(matchInfo.startDate)).toLocaleTimeString(),
                gmtTime: new Date(parseInt(matchInfo.startDate)).toUTCString(),
                localTime: new Date(parseInt(matchInfo.startDate)).toLocaleString()
              });
            });
          }
        });
      }
      return processedMatches;
    }
  });
};