
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
import battersData from '../data/batters.json';
import bowlersData from '../data/bowlers.json';

const Nscores = () => {
  const [selectedBatter, setSelectedBatter] = useState('');
  const [selectedBowler, setSelectedBowler] = useState('');
  const [batters, setBatters] = useState(battersData);
  const [bowlers, setBowlers] = useState(bowlersData);
  const [matchData, setMatchData] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [summaryData, setSummaryData] = useState([]);
  useEffect(() => {
    if (selectedBatter && selectedBowler) {
      analyzeBattervsBowler();
      fetchBatterBowlerStats();
      fetchSummaryData();
    }
  }, [selectedBatter, selectedBowler]);
  const analyzeBattervsBowler = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/batter-vs-bowler?batter=${selectedBatter}&bowler=${selectedBowler}`
      );
      const data = await response.json();
      setMatchData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchBatterBowlerStats = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/batter-vs-bowler-stats?batter=${selectedBatter}&bowler=${selectedBowler}`
      );
      const data = await response.json();
      console.log(data)
      setStatsData(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const transformStatsForChart = (stats) => {
    if (!stats) return {};

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        // max: 50,
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: [
          'Total Balls',
          'Total Runs',
          'Sixes',
          'Fours',
          'Dot Balls',
          'Wide Balls',
          'Leg Byes',
          'Byes',
          'No Balls',
          'Penalties'
        ],
        axisLabel: {
          fontSize: 12
        }
      },
      series: [{
        name: 'Value',
        type: 'bar',
        data: [
          { value: stats.total_balls_bowled, itemStyle: { color: '#0088FE' } },
          { value: stats.total_runs, itemStyle: { color: '#ff7300' } },
          { value: stats.sixes || 0, itemStyle: { color: '#00C49F' } },
          { value: stats.fours || 0, itemStyle: { color: '#FF0000' } },
          { value: stats.dot_balls || 0, itemStyle: { color: '#9B59B6' } },
          { value: stats.wide_balls || 0, itemStyle: { color: '#8B4513' } },
          { value: stats.leg_byes || 0, itemStyle: { color: '#D3D3D3' } },
          { value: stats.byes || 0, itemStyle: { color: '#D3D3D3' } },
          { value: stats.no_balls || 0, itemStyle: { color: '#D3D3D3' } },
          { value: stats.penalties || 0, itemStyle: { color: '#D3D3D3' } }
        ],
        label: {
          show: true,
          position: 'right',
          fontSize: 12
        }
      }]
    };
  };

  const fetchSummaryData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/batter-vs-bowler-summary?batter=${selectedBatter}&bowler=${selectedBowler}`
      );
      const data = await response.json();
      setSummaryData(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-24 md:py-28">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 text-ipl-blue">🏏 BATTER V/S BOWLER ANALYSIS ⚽</h1>
          <br />

          <Tabs defaultValue="team" className="w-full">
            <TabsContent value="team" className="space-y-8">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-3 grid grid-cols-2 gap-4">
                  <Select value={selectedBatter} onValueChange={setSelectedBatter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Batter" />
                    </SelectTrigger>
                    <SelectContent>
                      {batters.map((batter, index) => (
                        <SelectItem key={`batter-${index}`} value={batter.name}>
                          {batter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedBowler} onValueChange={setSelectedBowler}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Bowler" />
                    </SelectTrigger>
                    <SelectContent>
                      {bowlers.map((bowler, index) => (
                        <SelectItem key={`bowler-${index}`} value={bowler.name}>
                          {bowler.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-ipl-blue hover:bg-ipl-blue/90">
                  Analyze
                </Button>
              </div>

              {matchData.length > 0 && (
                <div className="mt-8 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Match ID</TableHead>
                        <TableHead>Batting Team</TableHead>
                        <TableHead>Bowling Team</TableHead>
                        <TableHead>Over</TableHead>
                        <TableHead>Ball</TableHead>
                        <TableHead>Batter</TableHead>
                        <TableHead>Bowler</TableHead>
                        <TableHead>Total Runs</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matchData.map((row, index) => (
                        <TableRow key={`${row.match_id}-${row.over_}-${row.ball}`}>
                          <TableCell>{row.match_id}</TableCell>
                          <TableCell>{row.batting_team}</TableCell>
                          <TableCell>{row.bowling_team}</TableCell>
                          <TableCell>{row.over_}</TableCell>
                          <TableCell>{row.ball}</TableCell>
                          <TableCell>{row.batter}</TableCell>
                          <TableCell>{row.bowler}</TableCell>
                          <TableCell>{row.total_runs}</TableCell>
                          {/* <TableCell>{`${row.batting_team} vs ${row.bowling_team}`}</TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {statsData && (
                <div className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribution of {selectedBatter} vs {selectedBowler}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[600px] w-full">
                        <ReactECharts
                          option={transformStatsForChart(statsData)}
                          style={{ height: '100%', width: '100%' }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {statsData && (
                <div className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Summary of Analysis</CardTitle>
                      <CardDescription>{selectedBatter} vs {selectedBowler}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-100">
                            <TableHead className="w-[100px]">Index</TableHead>
                            <TableHead>Statistic</TableHead>
                            <TableHead className="text-right">{selectedBatter} vs {selectedBowler}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {summaryData.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{index}</TableCell>
                              <TableCell>{row.statistic}</TableCell>
                              <TableCell className="text-right">{row.value || 0}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
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