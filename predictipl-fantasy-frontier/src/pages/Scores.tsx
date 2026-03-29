import Plot from 'react-plotly.js';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDown, ArrowUp, Trophy, Award, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import playersData from '../all_players.json';

const Scores = () => {
  const [data, setData] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('Mumbai Indians');
  const [selectedPlayer, setSelectedPlayer] = useState('MS Dhoni');
  const [activeTab, setActiveTab] = useState('team');
  const [team_to_analysis, setTeamToAnalysis] = useState('');
  const [inningsDataScores, setInningsDataScores] = useState([]);
  const [overData, setOverData] = useState([]);
  const [venueData, setVenueData] = useState([]);
  const [lowestScores, setLowestScores] = useState([]);
  const [highScoreData, setHighScoreData] = useState([]);
  const [playerData, setPlayerData] = useState(['MS Dhoni']);
  const [players, setPlayers] = useState(['MS Dhoni']);
  const [searchTerm, setSearchTerm] = useState('');
  // const [showPlayerAnalysis, setShowPlayerAnalysis] = useState(false);
  const [playerDataBowler, setPlayerDataBowler] = useState([]);
  const [playerPartnerships, setPlayerPartnerships] = useState([]);
  const [playerInningsData, setPlayerInningsData] = useState([]);
  const [playerBowlingStats, setPlayerBowlingStats] = useState([]);
  const [playerBowlingOvers, setPlayerBowlingOvers] = useState([]);
  const [playerOverCount, setPlayerOverCount] = useState([]);
  const [playerBowlingTeams, setPlayerBowlingTeams] = useState([]);


  const [teams, setTeams] = useState([
    "Royal Challengers Bengaluru",
    "Mumbai Indians",
    "Chennai Super Kings",
    "Kolkata Knight Riders",
    "Delhi Capitals",
    "Kings XI Punjab",
    "Rajasthan Royals",
    "Sunrisers Hyderabad",
    "Gujarat Titans",
    "Lucknow Super Giants"
  ]);
  useEffect(() => {
    if (team_to_analysis) {  // Only fetch if team is selected
      fetchData();
      fetchTeamScore();
      fetchDataOver();
      fetchDataVenue();
      fetchLowestScores();
      fetchHighScores();

    }
  }, [team_to_analysis]);  // Dependency on team_to_analysis
  // useEffect(() => {
  //   fetchPlayers();
  //   fetchPlayerDataBowler();
  // }, []);

  useEffect(() => {
    if (selectedPlayer) {

      fetchPlayers();
      fetchPlayerData();
      fetchPlayerDataBowler();
      fetchPlayerPartnerships();
      fetchPlayerInningsData();
      fetchPlayerBowlingStats();
      fetchPlayerBowlingOvers();
      fetchPlayerOverCount();
      fetchPlayerBowlingTeams();
    }
  }, [selectedPlayer]);
  const fetchData = async () => {
    try {
      if (!team_to_analysis) return;  // Guard clause

      const response = await fetch(`http://localhost:5000/api/data/${encodeURIComponent(team_to_analysis)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      // console.log('response data:', result[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData(null);  // Reset data on error
    }
  };

  const fetchTeamScore = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/average_runs/${encodeURIComponent(team_to_analysis)}`);
      const data = await response.json();
      setInningsDataScores(data);
      // console.log("Data ", data[0]);
    } catch (error) {
      console.error('Error fetching data: in average_runs', error);
    }
  };
  const fetchDataOver = async () => {
    try {
      if (!team_to_analysis) return;


      const formattedTeam = team_to_analysis.trim();
      console.log('Fetching over data for team:', formattedTeam);

      const response = await fetch(`http://localhost:5000/api/over_score/${encodeURIComponent(formattedTeam)}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log('Over data received:', data);
      setOverData(data);
    } catch (error) {
      console.error('Error fetching over data:', error);
      setOverData([]);

    }
  };

  const fetchDataVenue = async () => {
    try {
      // const encodedTeam = encodeURIComponent(selectedTeam);
      const response = await fetch(`http://localhost:5000/api/venue_wise_win/${encodeURIComponent(team_to_analysis)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch data');
      }

      const data = await response.json();
      setVenueData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setVenueData([]);
    }
  };

  const fetchLowestScores = async () => {
    try {
      const encodedTeam = encodeURIComponent(selectedTeam);
      const response = await fetch(`http://localhost:5000/api/lowest_scores/${encodeURIComponent(team_to_analysis)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch data');
      }

      const data = await response.json();
      setLowestScores(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLowestScores([]);
    }
  };

  const fetchHighScores = async () => {
    try {
      const encodedTeam = encodeURIComponent(selectedTeam);
      const response = await fetch(`http://localhost:5000/api/high_scores/${encodedTeam}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch data');
      }

      const data = await response.json();
      setHighScoreData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setHighScoreData([]);
    }
  };
  // const downloadJSON = (data: any, filename: string) => {
  //   const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  //   const url = window.URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = filename;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   window.URL.revokeObjectURL(url);
  // };

  const fetchPlayers = () => {
    try {
      setPlayers(playersData.map(item => item.player_name));
      if (!selectedPlayer && playersData.length > 0) {
        setSelectedPlayer(playersData[0].player_name);
      }
    } catch (error) {
      console.error('Error loading players:', error);
      setPlayers([]);
    }
  };

  const fetchPlayerData = async () => {
    try {
      const encodedPlayer = encodeURIComponent(selectedPlayer);
      const response = await fetch(`http://localhost:5000/api/player_runs/${encodedPlayer}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch data');
      }

      const data = await response.json();
      setPlayerData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setPlayerData([]);
    }
  };

  const fetchPlayerDataBowler = async () => {
    try {
      const encodedPlayer = encodeURIComponent(selectedPlayer);
      const response = await fetch(`http://localhost:5000/api/player_vs_bowler/${encodedPlayer}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setPlayerDataBowler(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setPlayerDataBowler([]);
    }
  };

  const fetchPlayerPartnerships = async () => {
    try {
      const encodedPlayer = encodeURIComponent(selectedPlayer);
      const response = await fetch(`http://localhost:5000/api/player_partnerships/${encodedPlayer}`);

      if (!response.ok) {
        throw new Error('Failed to fetch partnership data');
      }

      const data = await response.json();
      setPlayerPartnerships(data);
    } catch (error) {
      console.error('Error fetching partnership data:', error);
      setPlayerPartnerships([]);
    }
  };

  const fetchPlayerInningsData = async () => {
    try {
      const encodedPlayer = encodeURIComponent(selectedPlayer);
      const response = await fetch(`http://localhost:5000/api/player_innings_runs/${encodedPlayer}`);

      if (!response.ok) {
        throw new Error('Failed to fetch innings data');
      }

      const data = await response.json();
      setPlayerInningsData(data);
    } catch (error) {
      console.error('Error fetching innings data:', error);
      setPlayerInningsData([]);
    }
  };

  const fetchPlayerBowlingStats = async () => {
    try {
      const encodedPlayer = encodeURIComponent(selectedPlayer);
      const response = await fetch(`http://localhost:5000/api/player_bowling_stats/${encodedPlayer}`);

      if (!response.ok) {
        throw new Error('Failed to fetch bowling stats');
      }

      const data = await response.json();
      setPlayerBowlingStats(data);
    } catch (error) {
      console.error('Error fetching bowling stats:', error);
      setPlayerBowlingStats([]);
    }
  };

  const fetchPlayerBowlingOvers = async () => {
    try {
      const encodedPlayer = encodeURIComponent(selectedPlayer);
      const response = await fetch(`http://localhost:5000/api/player_bowling_overs/${encodedPlayer}`);

      if (!response.ok) {
        throw new Error('Failed to fetch bowling overs data');
      }

      const data = await response.json();
      setPlayerBowlingOvers(data);
    } catch (error) {
      console.error('Error fetching bowling overs data:', error);
      setPlayerBowlingOvers([]);
    }
  };

  const fetchPlayerOverCount = async () => {
    try {
      const encodedPlayer = encodeURIComponent(selectedPlayer);
      const response = await fetch(`http://localhost:5000/api/player_over_count/${encodedPlayer}`);

      if (!response.ok) {
        throw new Error('Failed to fetch over count data');
      }

      const data = await response.json();
      setPlayerOverCount(data);
    } catch (error) {
      console.error('Error fetching over count data:', error);
      setPlayerOverCount([]);
    }
  };
  const fetchPlayerBowlingTeams = async () => {
    try {
      const encodedPlayer = encodeURIComponent(selectedPlayer);
      const response = await fetch(`http://localhost:5000/api/bowler_vs_teams/${encodedPlayer}`);

      if (!response.ok) {
        throw new Error('Failed to fetch bowling teams data');
      }

      const data = await response.json();
      setPlayerBowlingTeams(data);
    } catch (error) {
      console.error('Error fetching bowling teams data:', error);
      setPlayerBowlingTeams([]);
    }
  };

  // ----------------------------------------------------------------------------------------------------------
  const mainTrace = {
    x: inningsDataScores.map(item => item.bowling_team),
    y: inningsDataScores.map(item => item.total_runs),
    mode: 'lines+markers+text',
    text: inningsDataScores.map(item => item.total_runs),
    textposition: 'top center',
    marker: { color: 'purple', size: 10 },
    line: { color: 'purple', width: 2 }
  };

  const verticalLines = inningsDataScores.map((item, index) => ({
    x: [item.bowling_team, item.bowling_team],
    y: [0, item.total_runs],
    mode: 'lines',
    line: { color: 'purple', width: 1, dash: 'dot' },
    showlegend: false
  }));

  const layout = {
    xaxis: {
      title: 'Bowling Teams',
      tickmode: 'linear',
      tickangle: 45,
      tickfont: {
        size: 12,
        color: 'black'
      },
      automargin: true
    },
    yaxis: {
      title: 'Total Runs',
      tickfont: {
        color: 'black'
      },
      automargin: true
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    height: 450,
    width: null,
    margin: {
      l: 60,
      r: 30,
      t: 30,
      b: 150
    },
    autosize: true,
    bargap: 0.2,
    font: {
      color: 'black'
    }
  };

  // Update the Plot components to use full width
  <Plot
    data={[mainTrace, ...verticalLines]}
    layout={layout}
    config={{ responsive: true }}
    style={{ width: '100%', height: '400px' }}
  />

  // const mainTrace_over = {
  //   x: overData.map(item => item.over),
  //   y: overData.map(item => item.total_runs),
  //   type: 'scatter',
  //   mode: 'lines+markers+text',
  //   text: overData.map(item => item.total_runs),
  //   textposition: 'top center',
  //   marker: { color: 'purple', size: 8 },
  //   line: { color: 'purple', width: 2 }
  // };
  // const trace_venue = {
  //   x: venueData.map(item => item.venue),
  //   y: venueData.map(item => item.win_count),
  //   type: 'bar',
  //   marker: {
  //     color: 'purple',
  //     opacity: 0.7
  //   },
  //   text: venueData.map(item => item.win_count),
  //   textposition: 'outside',
  //   textfont: {
  //     size: 12,
  //     color: 'black'  // Changed to black
  //   }
  // };

  // const layout_venue = {
  //   title: {
  //     font: {
  //       size: 24,
  //       color: 'black'
  //     }
  //   },
  //   xaxis: {
  //     title: 'Venues',
  //     tickangle: 45,
  //     tickfont: {
  //       size: 12,
  //       color: 'black'
  //     },
  //     automargin: true
  //   },
  //   yaxis: {
  //     title: 'Wins',
  //     rangemode: 'tozero',
  //     tickfont: {
  //       color: 'black'
  //     },

  //   },
  //   plot_bgcolor: 'rgba(0,0,0,0)',
  //   paper_bgcolor: 'rgba(0,0,0,0)',
  //   height: 450,  // Reduced from 600
  //   width: null,  // Remove fixed width to make it responsive
  //   margin: {
  //     b: 150,    // Reduced from 200
  //     l: 60,
  //     r: 30,
  //     t: 30    // Reduced from 50
  //   },
  //   bargap: 0.2,
  //   font: {
  //     color: 'black'
  //   },
  //   autosize: true  // Added to make the plot responsive
  // };
  // const trace_lowestScores = {
  //   x: lowestScores.map(item => item.total_runs),
  //   y: lowestScores.map(item => item.data),
  //   type: 'bar',
  //   orientation: 'h',
  //   marker: {
  //     color: 'purple',
  //     opacity: 0.7
  //   },
  //   text: lowestScores.map(item => item.total_runs),
  //   textposition: 'outside',
  //   textfont: {
  //     size: 12,
  //     color: 'white'
  //   }
  // };

  // const layout_lowestScores = {
  //   // title: {
  //   //   text: `${selectedTeam} Top 10 Lowest Scores`,
  //   //   font: { size: 24 }
  //   // },
  //   xaxis: {
  //     title: 'Runs',
  //     tickfont: { size: 12 }
  //   },
  //   yaxis: {
  //     title: 'Match Details',
  //     tickfont: { size: 12 },
  //     automargin: true
  //   },
  //   plot_bgcolor: 'rgba(0,0,0,0)',
  //   paper_bgcolor: 'rgba(0,0,0,0)',
  //   height: 400,
  //   width: 1000,
  //   margin: {
  //     l: 200,
  //     r: 50,
  //     t: 50,
  //     // b: 50
  //   },
  //   bargap: 0.2
  // };

  // const trace_highsccore = {
  //   x: highScoreData.map(item => item.total_runs),
  //   y: highScoreData.map(item => item.data),
  //   type: 'bar',
  //   orientation: 'h',
  //   marker: {
  //     color: 'purple',
  //     opacity: 0.7
  //   },
  //   text: highScoreData.map(item => item.total_runs),
  //   textposition: 'outside',
  //   textfont: {
  //     size: 12,
  //     color: 'white'
  //   }
  // };

  // // Update the layout_highscore configuration
  // const layout_highscore = {
  //   xaxis: {
  //     title: 'Runs',
  //     tickfont: { size: 12 }
  //   },
  //   yaxis: {
  //     title: 'Opponents',
  //     tickfont: { size: 12 },
  //     automargin: true
  //   },
  //   plot_bgcolor: 'rgba(0,0,0,0)',
  //   paper_bgcolor: 'rgba(0,0,0,0)',
  //   height: 400,  // Reduced from 600
  //   width: null,  // Remove fixed width to make it responsive
  //   margin: {
  //     l: 200,
  //     r: 50,
  //     t: 30,  // Reduced from 50
  //     b: 50
  //   },
  //   bargap: 0.2,
  //   autosize: true  // Added to make the plot responsive
  // };
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '10%',
      right: '5%',
      bottom: '15%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: playerData.map(item => item.bowling_team),
      axisLabel: {
        color: '#000',
        rotate: 45,
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      name: 'Runs',
      nameTextStyle: { color: '#000' },
      axisLabel: { color: '#000' }
    },
    series: [{
      data: playerData.map(item => item.total_runs),
      type: 'bar',
      barWidth: '40%',
      itemStyle: {
        color: '#800080',
        opacity: 0.7
      },
      label: {
        show: true,
        position: 'top',
        color: '#000',
        fontSize: 12
      }
    }]
  };

  const option_bowler = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '10%',
      right: '5%',
      bottom: '15%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: playerDataBowler.map(item => item.bowler),
      axisLabel: {
        color: '#000',
        rotate: 45,
        fontSize: 12
      },

    },
    yAxis: {
      type: 'value',
      name: 'Runs',
      nameTextStyle: { color: '#000' },
      axisLabel: { color: '#000' },
    },
    series: [{
      data: playerDataBowler.map(item => item.total_runs),
      type: 'bar',
      barWidth: '40%',
      itemStyle: {
        color: 'purple',
        opacity: 0.7
      },
      label: {
        show: true,
        position: 'top',
        color: '#000',
        fontSize: 12
      }
    }]
  };

  const option_partnerships = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '10%',
      right: '5%',
      bottom: '20%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: playerPartnerships.map(item => item.non_striker),
      axisLabel: {
        rotate: 45,
        fontSize: 12,
        color: '#000'
      },
      axisLine: {
        lineStyle: { color: '#000' }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Total Runs Scored',
      nameTextStyle: { color: '#000' },
      axisLabel: { color: '#000' },
      splitLine: {
        lineStyle: { color: 'rgba(0,0,0,0.1)' }
      }
    },
    series: [{
      data: playerPartnerships.map(item => item.total_runs),
      type: 'bar',
      barWidth: '40%',
      itemStyle: {
        color: 'purple',
        opacity: 0.7
      },
      label: {
        show: true,
        position: 'top',
        color: '#000',
        fontSize: 12
      }
    }]
  };
  const option_innings = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '10%',
      right: '5%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      name: 'Innings',
      data: playerInningsData.map(item => `Inning ${item.inning}`),
      axisLabel: {
        fontSize: 12,
        color: '#000'
      }
    },
    yAxis: {
      type: 'value',
      name: 'Runs Scored',
      nameTextStyle: { color: '#000' },
      axisLabel: { color: '#000' }
    },
    series: [{
      data: playerInningsData.map(item => ({
        value: item.total_runs,
        itemStyle: {
          color: `rgba(128, 0, 128, ${0.5 + (item.total_runs / Math.max(...playerInningsData.map(d => d.total_runs))) * 0.5})`
        }
      })),
      type: 'bar',
      barWidth: '40%',
      label: {
        show: true,
        position: 'top',
        color: '#000',
        fontSize: 12
      }
    }]
  };
  const option_bowling = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '10%',
      right: '5%',
      bottom: '20%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: playerBowlingStats.map(item => item.batter),
      axisLabel: {
        rotate: 45,
        fontSize: 12,
        color: '#000'
      }
    },
    yAxis: {
      type: 'value',
      name: 'Runs',
      nameTextStyle: { color: '#000' },
      axisLabel: { color: '#000' }
    },
    series: [{
      data: playerBowlingStats.map(item => ({
        value: item.total_runs,
        itemStyle: {
          color: `rgba(128, 0, 128, ${0.5 + (item.total_runs / Math.max(...playerBowlingStats.map(d => d.total_runs))) * 0.5})`
        }
      })),
      type: 'bar',
      barWidth: '40%',
      label: {
        show: true,
        position: 'top',
        color: '#000',
        fontSize: 12
      }
    }]
  };
  const option_bowling_overs = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '10%',
      right: '5%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      name: 'Overs',
      data: playerBowlingOvers.map(item => item.over_number),
      axisLabel: {
        fontSize: 12,
        color: '#000'
      },
      min: 0,
      max: 20
    },
    yAxis: {
      type: 'value',
      name: 'Total Runs',
      nameTextStyle: { color: '#000' },
      axisLabel: { color: '#000' }
    },
    series: [
      {
        data: playerBowlingOvers.map(item => item.total_runs),
        type: 'line',
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: 'purple'
        },
        lineStyle: {
          color: 'purple',
          width: 2
        },
        label: {
          show: true,
          position: 'top',
          color: '#000',
          fontSize: 12
        },
        // markLine: {
        //   symbol: 'none',
        //   data: playerBowlingOvers.map(item => ({
        //     xAxis: item.over_number,
        //     yAxis: item.total_runs,
        //     lineStyle: {
        //       color: 'purple',
        //       type: 'dotted',
        //       width: 1
        //     }
        //   }))
        // }
      }
    ]
  };

  const option_over_count = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '10%',
      right: '5%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      name: 'Overs',
      data: playerOverCount.map(item => item.over_number),
      axisLabel: {
        fontSize: 12,
        color: '#000'
      },
      min: 0,
      max: 20
    },
    yAxis: {
      type: 'value',
      name: 'Count (Overs)',
      nameTextStyle: { color: '#000' },
      axisLabel: { color: '#000' }
    },
    series: [
      {
        data: playerOverCount.map(item => item.over_count),
        type: 'line',
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: 'purple'
        },
        lineStyle: {
          color: 'purple',
          width: 2
        },
        label: {
          show: true,
          position: 'top',
          color: '#000',
          fontSize: 12
        },
        // markLine: {
        //   symbol: 'none',
        //   data: playerOverCount.map(item => ({
        //     xAxis: item.over_number,
        //     yAxis: item.over_count,
        //     lineStyle: {
        //       color: 'white',
        //       type: 'dotted',
        //       width: 1
        //     }
        //   }))
        // }
      }
    ]
  };
  const option_bowling_teams = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '10%',
      right: '5%',
      bottom: '20%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: playerBowlingTeams.map(item => item.batting_team),
      axisLabel: {
        rotate: 45,
        fontSize: 12,
        color: '#000'
      }
    },
    yAxis: {
      type: 'value',
      name: 'Runs Conceded',
      nameTextStyle: { color: '#000' },
      axisLabel: { color: '#000' }
    },
    series: [{
      data: playerBowlingTeams.map(item => ({
        value: item.total_runs,
        itemStyle: {
          color: `rgba(128, 0, 128, ${0.5 + (item.total_runs / Math.max(...playerBowlingTeams.map(d => d.total_runs))) * 0.5})`
        }
      })),
      type: 'bar',
      barWidth: '40%',
      label: {
        show: true,
        position: 'top',
        color: '#000',
        fontSize: 12
      }
    }]
  };

  const option_toss = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '10%',
      right: '5%',
      bottom: '15%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data?.map(item => item.toss_decision) || [],
      axisLabel: {
        color: '#000',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      name: 'Count',
      nameTextStyle: { color: '#000' },
      axisLabel: { color: '#000' }
    },
    series: [{
      data: data?.map(item => ({
        value: item.count,
        itemStyle: {
          color: 'purple',
          opacity: 0.7
        }
      })) || [],
      type: 'bar',
      barWidth: '40%',
      label: {
        show: true,
        position: 'top',
        color: '#000',
        fontSize: 12
      }
    }]
  };

  const option_average_runs = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: inningsDataScores.map(item => item.bowling_team),
      axisLabel: {
        rotate: 45,
        color: '#000',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      name: 'Runs',
      nameTextStyle: { color: '#000' },
      axisLabel: { color: '#000' }
    },
    series: [{
      data: inningsDataScores.map(item => item.total_runs),
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        color: 'purple',
        width: 2
      },
      itemStyle: {
        color: 'purple'
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}',
        fontSize: 12,
        color: '#000'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(128, 0, 128, 0.3)'
          }, {
            offset: 1,
            color: 'rgba(128, 0, 128, 0.1)'
          }]
        }
      }
    }]
  };
  const option_over_runs = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      name: 'Overs',
      data: overData.map(item => item.over),
      axisLabel: {
        color: '#000',
        fontSize: 12
      },
      min: 0,
      max: 20
    },
    yAxis: {
      type: 'value',
      name: 'Runs',
      nameTextStyle: { color: '#000' },
      axisLabel: { color: '#000' }
    },
    series: [{
      data: overData.map(item => item.total_runs),
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        color: 'purple',
        width: 2
      },
      itemStyle: {
        color: 'purple'
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}',
        fontSize: 12,
        color: '#000'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(128, 0, 128, 0.3)'
          }, {
            offset: 1,
            color: 'rgba(128, 0, 128, 0.1)'
          }]
        }
      }
    }]
  };
  const option_venue = {
     tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: venueData.map(item => item.venue),
      axisLabel: {
        // interval: 0,
        rotate: 10,
        textStyle: {
          fontSize: 12,
          color: '#000'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Wins',
      // min: 0,
      // max: function(value) {
      //   return Math.ceil(value.max) + 1;
      // },
      // interval: 1,
      axisLabel: {
        color: '#000' 
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#ddd'
        }
      }
    },
    series: [{
      data: venueData.map(item => ({
        value: item.win_count,
        itemStyle: {
          color: '#8B5CF6'  // Purple color
        }
      })),
      type: 'bar',
      barWidth: '40%',
      label: {
        show: true,
        position: 'top',
        fontSize: 12,
        color: '#000'
      }
    }]
  };
  const option_lowest_runs = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '15%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: lowestScores.map(item => item.bowling_team),
      axisLabel: {
        rotate: 45,
        color: '#000',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      name: 'Runs',
      nameTextStyle: { color: '#000' },
      axisLabel: { color: '#000' }
    },
    series: [{
      data: lowestScores.map(item => item.total_runs),
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        color: 'purple',
        width: 2
      },
      itemStyle: {
        color: 'purple'
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}',
        fontSize: 12,
        color: '#000'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(128, 0, 128, 0.3)'
          }, {
            offset: 1,
            color: 'rgba(128, 0, 128, 0.1)'
          }]
        }
      }
    }]
  };
  const option_highscore = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '15%',
      right: '5%',
      bottom: '10%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: 'Runs',
      nameTextStyle: { color: '#000' },
      axisLabel: { color: '#000' }
    },
    yAxis: {
      type: 'category',
      data: highScoreData.map(item => item.data),
      axisLabel: {
        color: '#000',
        fontSize: 12,
        width: 120,
        overflow: 'break'
      }
    },
    series: [{
      data: highScoreData.map(item => ({
        value: item.total_runs,
        itemStyle: {
          color: 'purple',
          opacity: 0.7
        }
      })),
      type: 'bar',
      barWidth: '60%',
      label: {
        show: true,
        position: 'right',
        color: '#000',
        fontSize: 12
      }
    }]
  };

  // ------------------------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-24 md:py-28">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 text-ipl-blue">Match Analysis & Statistics</h1>
          <p className="text-center text-gray-600 mb-10">
            Comprehensive analytics for IPL teams and players
          </p>

          <Tabs defaultValue="team" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="team">Team Analysis</TabsTrigger>
              <TabsTrigger value="player">Player Statistics</TabsTrigger>
            </TabsList>

            {/* Team Analysis Tab */}
            <TabsContent value="team" className="space-y-8">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => (
                        <SelectItem key={team} value={team}>{team}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-ipl-blue hover:bg-ipl-blue/90" onClick={() => setTeamToAnalysis(selectedTeam)}>
                  Analyze
                </Button>
              </div>


              {/* Team Toss Decision Charts */}
              {/* <div className="grid md:grid-cols-2 gap-8"> */}
              <Card>
                <CardHeader>
                  <CardTitle>{team_to_analysis} Toss Decision</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      {data?.length > 0 ? (
                        <ReactECharts
                          option={option_toss}
                          style={{ height: '100%', width: '100%' }}
                        />
                      ) : (
                        <p>Loading data...</p>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <br />
              {/* Average Run Scored  Againts Different Team chart */}
              {/* <Card>
                  <CardHeader>
                    <CardTitle>Average Run Scored by {team_to_analysis} Againts Different Team</CardTitle>
                    <CardDescription></CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        {inningsDataScores.length > 0 ? (
                          <Plot
                            data={[mainTrace, ...verticalLines]}
                            layout={{
                              ...layout,
                              height: 380,
                              margin: { l: 50, r: 50, t: 50, b: 120 }
                            }}
                            config={{ responsive: true }}
                            style={{ width: '100%', height: '100%' }}
                          />
                        ) : (
                          <p>Loading data...</p>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div> */}

              {/* >Average Runs Scored in Different Overs */}
              <Card>
                <CardHeader>
                  <CardTitle>Average Runs Scored By {team_to_analysis} in Different Overs</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      {inningsDataScores.length > 0 ? (
                        <ReactECharts
                          option={option_average_runs}
                          style={{ height: '100%', width: '100%' }}
                        />
                      ) : (
                        <p>Loading data...</p>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              {/* ------------------------------- */}
              <Card>
                <CardHeader>
                  <CardTitle>Average Runs Scored By {team_to_analysis} in Different Overs</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      {overData.length > 0 ? (
                        <ReactECharts
                          option={option_over_runs}
                          style={{ height: '100%', width: '100%' }}
                        />
                      ) : (
                        <p>Loading data...</p>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Venue chart */}
              <Card>
                <CardHeader>
                  <CardTitle>{team_to_analysis} Match Wins Based On Venue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ReactECharts
                      option={option_venue}
                      style={{ height: '100%', width: '100%' }}
                    />
                  </div>
                </CardContent>
              </Card>
              <br /><br /><br />

              {/* Lowest Runs chart */}
              <Card>
                <CardHeader>
                  <CardTitle>{team_to_analysis} Top 10 Lowest Runs</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      {inningsDataScores.length > 0 ? (
                        <ReactECharts
                          option={option_lowest_runs}
                          style={{ height: '100%', width: '100%' }}
                        />
                      ) : (
                        <p>Loading data...</p>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* 200+ Runs  chart*/}
              <Card>
                <CardHeader>
                  <CardTitle>{team_to_analysis} 200+ Runs : Total({highScoreData.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      {highScoreData.length > 0 ? (
                        <ReactECharts
                          option={option_highscore}
                          style={{ height: '100%', width: '100%' }}
                        />
                      ) : (
                        <p>Loading data...</p>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>


            </TabsContent>

            {/* Player Statistics Tab */}
            <TabsContent value="player" className="space-y-8">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-3 grid md:grid-cols-2 gap-4">

                  <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select player" />
                    </SelectTrigger>
                    <SelectContent>
                      {players.map(player => (
                        <SelectItem key={player} value={player}>{player}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="bg-ipl-blue hover:bg-ipl-blue/90"

                  onClick={() => {
                    setTeamToAnalysis(selectedPlayer);
                    fetchPlayerData();
                  }}
                >
                  Analyze
                </Button>
              </div>


              {/* Player Performance Chart */}

              <Card>
                <CardHeader>
                  <CardTitle>{selectedPlayer}'s Batting Performance Against Other Teams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {playerData.length > 0 ? (
                        <ReactECharts
                          option={{
                            ...option,
                            grid: {
                              top: '8%',
                              right: '5%',
                              bottom: '20%',
                              left: '10%',
                              containLabel: true
                            }
                          }}
                          style={{ height: '100%', width: '100%' }}
                        />
                      ) : (
                        <p>No data available for this player</p>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>


              {/* Batting Performance Against Different Bowlers chart */}
              <Card>
                <CardHeader>
                  <CardTitle>{selectedPlayer}'s Batting Performance Against Different Bowlers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {playerDataBowler.length > 0 ? (
                        <ReactECharts
                          option={option_bowler}
                          style={{ height: '100%', width: '100%' }}
                        />
                      ) : (
                        <p className="text-center text-gray-500">No data available for this player</p>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Batting Runs With Partner At Non-striker chart */}
              <Card>
                <CardHeader>
                  <CardTitle>{selectedPlayer}'s Batting Runs With Partner At Non-striker</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {playerPartnerships.length > 0 ? (
                        <ReactECharts
                          option={option_partnerships}
                          style={{ height: '100%', width: '100%' }}
                        />
                      ) : (
                        <p className="text-center text-gray-500">No partnership data available</p>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Batting Runs In Different Innings chart */}
              <Card>
                <CardHeader>
                  <CardTitle>{selectedPlayer}'s Batting Runs In Different Innings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {playerInningsData.length > 0 ? (
                        <ReactECharts
                          option={option_innings}
                          style={{ height: '100%', width: '100%' }}
                        />
                      ) : (
                        <p className="text-center text-gray-500">No innings data available</p>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Runs Scored By Different Players Against chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Runs Scored By Different Players Against {selectedPlayer}'s Bowling (Top 15)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {playerBowlingStats.length > 0 ? (
                        <ReactECharts
                          option={option_bowling}
                          style={{ height: '100%', width: '100%' }}
                        />
                      ) : (
                        <p className="text-center text-gray-500">No bowling data available</p>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              {/* Total Runs Given By Player in Different Overs chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Total Runs Given By {selectedPlayer} in Different Overs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {playerBowlingOvers.length > 0 ? (
                        <ReactECharts
                          option={option_bowling_overs}
                          style={{ height: '100%', width: '100%' }}
                        />
                      ) : (
                        <p className="text-center text-gray-500">No bowling overs data available</p>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Number of Times an Over is Bowled By chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Number of Times an Over is Bowled By {selectedPlayer}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {playerOverCount.length > 0 ? (
                        <ReactECharts
                          option={option_over_count}
                          style={{ height: '100%', width: '100%' }}
                        />
                      ) : (
                        <p className="text-center text-gray-500">No over count data available</p>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Runs Scored By Different Teams Against chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Runs Scored By Different Teams Against {selectedPlayer}'s Bowling</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {playerBowlingTeams.length > 0 ? (
                        <ReactECharts
                          option={option_bowling_teams}
                          style={{ height: '100%', width: '100%' }}
                        />
                      ) : (
                        <p className="text-center text-gray-500">No bowling data available</p>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Scores;
