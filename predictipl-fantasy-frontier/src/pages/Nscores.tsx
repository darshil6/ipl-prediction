
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDown, ArrowUp, Trophy, Award, TrendingUp } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const Nscores = () => {
  const [selectedTeam, setSelectedTeam] = useState('Mumbai Indians');
  const [selectedTeam1, setSelectedTeam1] = useState('Mumbai Indians');
  const [matchStats, setMatchStats] = useState(null);
  const [error, setError] = useState('');
  const [tossStats, setTossStats] = useState(null);
  const [seasonRunsStats, setSeasonRunsStats] = useState([]);
  const [cityWiseStats, setCityWiseStats] = useState([]);
  const [headToHeadStats, setHeadToHeadStats] = useState(null);
  const [sixHittersStats, setSixHittersStats] = useState([]);
  const [sixHittersTeamStats, setSixHitterTeamsStats] = useState([]);
  const [foursHittersStats, setFoursHittersStats] = useState([]);
  const [foursHittersStats1, setFoursHittersStats1] = useState([]);

  useEffect(() => {
    if (selectedTeam1 && selectedTeam) {
      fetchTeamStats();
      fetchTeamStats_toss();
      fetchSeasonRunsStats();
      fetchCityWiseStats();
      fetchHeadToHeadStats();
      fetchSixHittersStats();
      fetchSixHitterTeam1sStats();
      fetchFoursHittersStats();
    }
  }, [selectedTeam1, selectedTeam]);

  const fetchTeamStats = async () => {
    try {
      setError('');
      const response = await fetch(`http://localhost:5000/api/team_head_to_head/${encodeURIComponent(selectedTeam)}/${encodeURIComponent(selectedTeam1)}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setMatchStats(null);
        return;
      }

      setMatchStats({
        totalMatches: data.totalMatches,
        team1Wins: data.team1Wins,
        team2Wins: data.team2Wins
      });

    } catch (error) {
      console.error('Error fetching team stats:', error);
      setError('Failed to fetch team statistics');
      setMatchStats(null);
    }
  };

  const fetchTeamStats_toss = async () => {
    try {
      setError('');
      const response = await fetch(`http://localhost:5000/api/team_head_to_head_toss/${encodeURIComponent(selectedTeam)}/${encodeURIComponent(selectedTeam1)}`);
      const data = await response.json();
      // console.log(data);

      if (!response.ok) {
        setError(data.message);
        setMatchStats(null);
        setTossStats(null);
        return;
      }

      // setMatchStats({
      //   totalMatches: data.totalMatches,
      //   team1Wins: data.team1Wins,
      //   team2Wins: data.team2Wins
      // });

      setTossStats({
        team1TossWins: data.team1TossWins,
        team2TossWins: data.team2TossWins
      });

    } catch (error) {
      console.error('Error fetching team stats:', error);
      setError('Failed to fetch team statistics');
      setMatchStats(null);
      setTossStats(null);
    }
  };

  const fetchSeasonRunsStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/team_season_runs/${encodeURIComponent(selectedTeam)}/${encodeURIComponent(selectedTeam1)}`);
      const data = await response.json();
      // console.log(data)
      setSeasonRunsStats(data);
    } catch (error) {
      console.error('Error fetching season runs stats:', error);
    }
  };

  const fetchCityWiseStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/city_wise_wins/${encodeURIComponent(selectedTeam)}/${encodeURIComponent(selectedTeam1)}`);
      const data = await response.json();
      setCityWiseStats(data);
    } catch (error) {
      console.error('Error fetching city-wise stats:', error);
    }
  };
  const fetchHeadToHeadStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/team_head_to_head_stats/${encodeURIComponent(selectedTeam)}/${encodeURIComponent(selectedTeam1)}`);
      const data = await response.json();
      setHeadToHeadStats(data);
    } catch (error) {
      console.error('Error fetching head to head stats:', error);
    }
  };

  const fetchSixHitterTeam1sStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/team1_sixes_batters/${encodeURIComponent(selectedTeam1)}/${encodeURIComponent(selectedTeam)}`);
      const data = await response.json();
      console.log(data)
      setSixHitterTeamsStats(data);
    } catch (error) {
      console.error('Error fetching six hitters stats:', error);
    }
  };
  const fetchSixHittersStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/team_sixes_batters/${encodeURIComponent(selectedTeam)}/${encodeURIComponent(selectedTeam1)}`);
      const data = await response.json();
      console.log(data)
      setSixHittersStats(data);
    } catch (error) {
      console.error('Error fetching six hitters stats:', error);
    }
  };

  const fetchFoursHittersStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/team_fours_batters/${encodeURIComponent(selectedTeam)}/${encodeURIComponent(selectedTeam1)}`);
      const response1 = await fetch(`http://localhost:5000/api/team1_fours_batters/${encodeURIComponent(selectedTeam)}/${encodeURIComponent(selectedTeam1)}`);
      const data = await response.json();
      const data1 = await response1.json();
      setFoursHittersStats(data);
      setFoursHittersStats1(data1);
    } catch (error) {
      console.error('Error fetching fours hitters stats:', error);
    }
  };

  // Add the chart options
  const getWinnerChartOption = () => ({
    title: {
      text: `${selectedTeam} vs ${selectedTeam1} : Match Winners`,
      textStyle: {
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: [selectedTeam, selectedTeam1],
      name: 'Teams',
      nameLocation: 'middle',
      nameGap: 30
    },
    yAxis: {
      type: 'value',
      name: 'Winning Count',
      nameLocation: 'middle',
      nameGap: 40
    },
    series: [{
      data: [
        {
          value: matchStats?.team1Wins || 0,
          itemStyle: { color: '#1e88e5' }
        },
        {
          value: matchStats?.team2Wins || 0,
          itemStyle: { color: '#43a047' }
        }
      ],
      type: 'bar',
      label: {
        show: true,
        position: 'top'
      }
    }]
  });
  const getTossWinnerChartOption = () => ({
    title: {
      text: `${selectedTeam} vs ${selectedTeam1} : Toss Winners`,
      textStyle: {
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: [selectedTeam, selectedTeam1],
      name: 'Teams',
      nameLocation: 'middle',
      nameGap: 30
    },
    yAxis: {
      type: 'value',
      name: 'Toss Winning Count',
      nameLocation: 'middle',
      nameGap: 40
    },
    series: [{
      data: [
        {
          value: tossStats?.team1TossWins || 0,
          itemStyle: { color: '#2196f3' }
        },
        {
          value: tossStats?.team2TossWins || 0,
          itemStyle: { color: '#4caf50' }
        }
      ],
      type: 'bar',
      label: {
        show: true,
        position: 'top'
      }
    }]
  });

  const getSeasonRunsChartOption = () => ({
    title: {
      text: `${selectedTeam} vs ${selectedTeam1} Average Runs Per Season`,
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      top: '2%',
      right: '2%',
      data: [selectedTeam, selectedTeam1]
    },
    xAxis: {
      type: 'category',
      data: [...new Set(seasonRunsStats.map(item => item.season))],
      name: 'Season'
    },
    yAxis: {
      type: 'value',
      name: 'Average Runs'
    },
    series: [
      {
        name: selectedTeam,
        type: 'line',
        data: seasonRunsStats
          .filter(item => item.batting_team === selectedTeam)
          .map(item => item.average_runs),
        smooth: true
      },
      {
        name: selectedTeam1,
        type: 'line',
        data: seasonRunsStats
          .filter(item => item.batting_team === selectedTeam1)
          .map(item => item.average_runs),
        smooth: true
      }
    ]
  });
  const getCityWiseChartOption = () => ({
    title: {
      text: `${selectedTeam} vs ${selectedTeam1} City-wise Match Results`,
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      top: '2%',
      right: '2%',
      data: [selectedTeam, selectedTeam1]
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: cityWiseStats.map(item => item.city),
      axisLabel: {
        interval: 0,
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: 'Number of Wins'
    },
    series: [
      {
        name: selectedTeam,
        type: 'bar',
        stack: 'total',
        data: cityWiseStats.map(item => ({
          value: item.team1_wins,
          itemStyle: { color: '#1e88e5' }
        }))
      },
      {
        name: selectedTeam1,
        type: 'bar',
        stack: 'total',
        data: cityWiseStats.map(item => ({
          value: item.team2_wins,
          itemStyle: { color: '#43a047' }
        }))
      }
    ]
  });

  const getSixHittersChartOption = () => ({
    title: {
      text: `Top 10 Six Hitters - ${selectedTeam}`,
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '15%',
      right: '5%',
      bottom: '8%'
    },
    xAxis: {
      type: 'value',
      name: 'Number of Sixes'
    },
    yAxis: {
      type: 'category',
      data: sixHittersStats
        .slice(0, 10)
        .sort((a, b) => a.sixes_count - b.sixes_count)
        .map(item => item.batter),
      axisLabel: {
        interval: 0,
        width: 100,
        overflow: 'truncate'
      }
    },
    series: [
      {
        type: 'bar',
        data: sixHittersStats
          .slice(0, 10)
          .sort((a, b) => a.sixes_count - b.sixes_count)
          .map(item => ({
            value: item.sixes_count,
            itemStyle: { color: '#1e88e5' }
          })),
        label: {
          show: true,
          position: 'right',
          formatter: '{c}'
        }
      }
    ]
  });
  const getSixHittersTeamChartOption = () => ({
    title: {
      text: `Top 10 Six Hitters - ${selectedTeam1}`,
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '15%',
      right: '5%',
      bottom: '8%'
    },
    xAxis: {
      type: 'value',
      name: 'Number of Sixes'
    },
    yAxis: {
      type: 'category',
      data: sixHittersTeamStats
        .slice(0, 10)
        .sort((a, b) => a.sixes_count - b.sixes_count)
        .map(item => item.batter),
      axisLabel: {
        interval: 0,
        width: 100,
        overflow: 'truncate'
      }
    },
    series: [
      {
        type: 'bar',
        data: sixHittersTeamStats
          .slice(0, 10)
          .sort((a, b) => a.sixes_count - b.sixes_count)
          .map(item => ({
            value: item.sixes_count,
            itemStyle: { color: '#1e88e5' }
          })),
        label: {
          show: true,
          position: 'right',
          formatter: '{c}'
        }
      }
    ]
  });

  const getFoursHittersChartOption = () => ({
    title: {
      text: `Top 10 Four Hitters - ${selectedTeam}`,
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '15%',
      right: '5%',
      bottom: '8%'
    },
    xAxis: {
      type: 'value',
      name: 'Number of Fours'
    },
    yAxis: {
      type: 'category',
      data: foursHittersStats
        .slice(0, 10)
        .sort((a, b) => a.fours_count - b.fours_count)
        .map(item => item.batter),
      axisLabel: {
        interval: 0,
        width: 100,
        overflow: 'truncate'
      }
    },
    series: [
      {
        type: 'bar',
        data: foursHittersStats
          .slice(0, 10)
          .sort((a, b) => a.fours_count - b.fours_count)
          .map(item => ({
            value: item.fours_count,
            itemStyle: { color: '#1e88e5' }
          })),
        label: {
          show: true,
          position: 'right',
          formatter: '{c}'
        }
      }
    ]
  });

  const getFoursHittersTeamChartOption = () => ({
    title: {
      text: `Top 10 Four Hitters - ${selectedTeam1}`,
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '15%',
      right: '5%',
      bottom: '8%'
    },
    xAxis: {
      type: 'value',
      name: 'Number of Fours'
    },
    yAxis: {
      type: 'category',
      data: foursHittersStats1
        .slice(0, 10)
        .sort((a, b) => a.fours_count - b.fours_count)
        .map(item => item.batter),
      axisLabel: {
        interval: 0,
        width: 100,
        overflow: 'truncate'
      }
    },
    series: [
      {
        type: 'bar',
        data: foursHittersStats1
          .slice(0, 10)
          .sort((a, b) => a.fours_count - b.fours_count)
          .map(item => ({
            value: item.fours_count,
            itemStyle: { color: '#43a047' }
          })),
        label: {
          show: true,
          position: 'right',
          formatter: '{c}'
        }
      }
    ]
  });
  // Add this in your JSX after the Button component

  // Demo teams
  const teams = [
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
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-24 md:py-28">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 text-ipl-blue">Team vs Team Analysis</h1>
          <br />


          <Tabs defaultValue="team" className="w-full"  >


            {/* Team Analysis Tab */}
            <TabsContent value="team" className="space-y-8">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-3 grid grid-cols-2 gap-4">
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team 1" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => (
                        <SelectItem key={team} value={team}>{team}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedTeam1} onValueChange={setSelectedTeam1}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team 2" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => (
                        <SelectItem key={team} value={team}>{team}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-ipl-blue hover:bg-ipl-blue/90">
                  Analyze
                </Button>
              </div>

              {matchStats && (
                <Card>
                  <CardHeader>
                    <CardTitle>Match Winners Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReactECharts
                          option={getWinnerChartOption()}
                          style={{ height: '100%' }}
                        />
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {tossStats && (
                <Card>
                  <CardHeader>
                    <CardTitle>Toss Winners Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReactECharts
                          option={getTossWinnerChartOption()}
                          style={{ height: '100%' }}
                        />
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {seasonRunsStats.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Season-wise Average Runs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReactECharts
                          option={getSeasonRunsChartOption()}
                          style={{ height: '100%' }}
                        />
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {cityWiseStats.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>City-wise Match Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReactECharts
                          option={getCityWiseChartOption()}
                          style={{ height: '100%' }}
                        />
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {headToHeadStats && (
                <Card>
                  <CardHeader>
                    <CardTitle>HEAD TO HEAD INFO</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Info</TableHead>
                          <TableHead>{selectedTeam}</TableHead>
                          <TableHead>{selectedTeam1}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Extra Runs</TableCell>
                          <TableCell>{headToHeadStats.team1_extras}</TableCell>
                          <TableCell>{headToHeadStats.team2_extras}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Sixes</TableCell>
                          <TableCell>{headToHeadStats.team1_sixes}</TableCell>
                          <TableCell>{headToHeadStats.team2_sixes}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Fours</TableCell>
                          <TableCell>{headToHeadStats.team1_fours}</TableCell>
                          <TableCell>{headToHeadStats.team2_fours}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Doubles</TableCell>
                          <TableCell>{headToHeadStats.team1_doubles}</TableCell>
                          <TableCell>{headToHeadStats.team2_doubles}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Singles</TableCell>
                          <TableCell>{headToHeadStats.team1_singles}</TableCell>
                          <TableCell>{headToHeadStats.team2_singles}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Total Runs</TableCell>
                          <TableCell>{headToHeadStats.team1_total_runs}</TableCell>
                          <TableCell>{headToHeadStats.team2_total_runs}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {sixHittersStats.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Top Six Hitters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReactECharts
                          option={getSixHittersChartOption()}
                          style={{ height: '100%' }}
                        />
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
              {sixHittersTeamStats.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Top Six Hitters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReactECharts
                          option={getSixHittersTeamChartOption()}
                          style={{ height: '100%' }}
                        />
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
              {foursHittersStats.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Top Four Hitters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReactECharts
                          option={getFoursHittersChartOption()}
                          style={{ height: '100%' }}
                        />
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
              {foursHittersStats1.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Top Four Hitters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReactECharts
                          option={getFoursHittersTeamChartOption()}
                          style={{ height: '100%' }}
                        />
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Nscores;





