
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Winnings = () => {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [venue, setVenue] = useState('');
  const [predictedWinner, setPredictedWinner] = useState<string | null>(null);
  const [winProbability, setWinProbability] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [tossWinner, setTossWinner] = useState('');
  const [tossDecision, setTossDecision] = useState('');

  // Add toss decisions array
  const tossDecisions = ['bat', 'field'];

  const teams = [
    "Chennai Super Kings",
    "Delhi Capitals",
    "Gujarat Titans",
    "Kolkata Knight Riders",
    "Lucknow Super Giants",
    "Mumbai Indians",
    "Kings XI Punjab",
    "Rajasthan Royals",
    "Royal Challengers Bengaluru",
    "Sunrisers Hyderabad"
  ];

  const venues = [
    'M Chinnaswamy Stadium',
    'Punjab Cricket Association IS Bindra Stadium',
    'Feroz Shah Kotla',
    'Wankhede Stadium',
    'Eden Gardens',
    'Sawai Mansingh Stadium',
    'Rajiv Gandhi International Stadium',
    'MA Chidambaram Stadium',
    'Dr DY Patil Sports Academy',
    'New Wanderers Stadium',
    'De Beers Diamond Oval',
    'OUTsurance Oval',
    'Brabourne Stadium',
    'Sardar Patel Stadium, Motera',
    'Barabati Stadium',
    'Vidarbha Cricket Association Stadium, Jamtha',
    'Himachal Pradesh Cricket Association Stadium',
    'Nehru Stadium',
    'Holkar Cricket Stadium',
    'Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium',
    'Subrata Roy Sahara Stadium',
    'Maharashtra Cricket Association Stadium',
    'Shaheed Veer Narayan Singh International Stadium',
    'JSCA International Stadium Complex',
    'Sheikh Zayed Stadium',
    'Saurashtra Cricket Association Stadium',
    'Green Park',
    'Arun Jaitley Stadium',
    'Narendra Modi Stadium, Ahmedabad',
    'Dubai International Cricket Stadium',
    'Zayed Cricket Stadium, Abu Dhabi',
    'Sharjah Cricket Stadium',
    'Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow',
    'Barsapara Cricket Stadium, Guwahati',
    'Maharaja Yadavindra Singh International Cricket Stadium, Mullanpur'
  ].filter(venue => venue.trim() !== ''); // Filter out any empty strings

  
  const predictMatch = async () => {
    // Validation
    if (!team1 || !team2 || !venue) {
      toast({
        title: "Incomplete selection",
        description: "Please select both teams and venue",
        variant: "destructive"
      });
      return;
    }

    if (team1 === team2) {
      toast({
        title: "Invalid selection",
        description: "Please select different teams",
        variant: "destructive"
      });
      return;
    }
    if (!tossWinner) {
      toast({
        title: "Toss Winner required",
        description: "Please select the toss winner",
        variant: "destructive"
      });
      return;
    }

    if (!tossDecision) {
      toast({
        title: "Toss Decision required",
        description: "Please select the toss decision",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const requestData = {
      team1,
      team2,
      venue,
      toss_winner: tossWinner,
      toss_decision: tossDecision.toLowerCase() 
    };

    console.log('Sending data:', requestData);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server error:', errorData);
        throw new Error(`Server error: ${errorData}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (!data.predicted_winner || !data.win_probability) {
        throw new Error('Invalid response format from server');
      }

      setPredictedWinner(data.predicted_winner);
      setWinProbability(data.win_probability);
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: "Prediction failed",
        description: error instanceof Error ? error.message : "Unable to get prediction at this time",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPrediction = () => {
    setPredictedWinner(null);
    setWinProbability(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-24 md:py-28">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 text-ipl-blue">Match Winner Prediction</h1>
          <p className="text-center text-gray-600 mb-10">
            Use our advanced AI model to predict the outcome of IPL matches
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">Select Teams</CardTitle>
                <CardDescription>Choose the teams and venue for prediction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Team 1</label>
                  <Select value={team1} onValueChange={setTeam1}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select team 1" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => (
                        <SelectItem key={team} value={team}>{team}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Team 2</label>
                  <Select value={team2} onValueChange={setTeam2}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select team 2" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => (
                        <SelectItem key={team} value={team}
                          disabled={team === team1}
                        >
                          {team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Venue</label>
                  <Select value={venue} onValueChange={setVenue}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map(venue => (
                        <SelectItem key={venue} value={venue}>{venue}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                <label className="text-sm font-medium">Toss Winner</label>
                  <Select value={tossWinner} onValueChange={setTossWinner}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select toss winner" />
                    </SelectTrigger>
                    <SelectContent>
                      {team1 && <SelectItem value={team1}>{team1}</SelectItem>}
                      {team2 && <SelectItem value={team2}>{team2}</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Toss Decision</label>
                  <Select value={tossDecision} onValueChange={setTossDecision}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select toss decision" />
                    </SelectTrigger>
                    <SelectContent>
                      {tossDecisions.map(decision => (
                        <SelectItem key={decision} value={decision}>
                          {decision}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full bg-ipl-orange hover:bg-ipl-orange/90"
                  onClick={predictMatch}
                  disabled={isLoading}
                >
                  {isLoading ? "Analyzing..." : "Predict Winner"}
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">Prediction Results</CardTitle>
                <CardDescription>Our AI model's match prediction</CardDescription>
              </CardHeader>
              <CardContent>
                {predictedWinner ? (
                  <div className="space-y-6 text-center">
                    <div className="py-6">
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Predicted Winner</h3>
                      <div className="text-3xl font-bold text-ipl-blue">{predictedWinner}</div>
                      <div className="mt-2 text-ipl-orange font-semibold">
                        {winProbability}% win probability
                      </div>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Match Details</h4>
                      <p className="text-gray-800">{team1} vs {team2}</p>
                      <p className="text-gray-600">Venue: {venue}</p>
                    </div>

                    <div className="text-sm text-gray-500 italic">
                      *Prediction based on historical data and team performance metrics
                    </div>

                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={resetPrediction}
                    >
                      Reset
                    </Button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10">
                    <div className="text-gray-400 mb-4 text-6xl">🏏</div>
                    <h3 className="text-lg font-medium text-gray-700">No Prediction Yet</h3>
                    <p className="text-gray-500 mt-2">
                      Select both teams and venue, then click "Predict Winner" to see results
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Winnings;
