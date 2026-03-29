import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import PlayerCard from '@/components/PlayerCard';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

const Fantasy = () => {
  const [activeTeam, setActiveTeam] = useState('team1');
  const { toast } = useToast();
  
  const handleShareTeam = (team: string) => {
    toast({
      title: "Team Shared!",
      description: `Your ${team === 'team1' ? 'Team 1' : 'Team 2'} has been shared.`,
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-24 md:py-28">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 text-ipl-blue">Fantasy Team Builder</h1>
          <p className="text-center text-gray-600 mb-10">
            Create your dream IPL team and compete with other fans
          </p>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <Tabs defaultValue="team1" className="w-full" onValueChange={setActiveTeam}>
              <div className="bg-gray-50 p-4 border-b">
                <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                  <TabsTrigger value="team1">Team 1</TabsTrigger>
                  <TabsTrigger value="team2">Team 2</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="team1" className="p-0">
                <div className="relative">
                  <div className="absolute top-4 right-4 flex space-x-2 z-10">
                    <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm"
                      onClick={() => handleShareTeam('team1')}>
                      Share Team
                    </Button>
                  </div>
                  <TeamBuilder teamId="team1" />
                </div>
              </TabsContent>

              <TabsContent value="team2" className="p-0">
                <div className="relative">
                  <div className="absolute top-4 right-4 flex space-x-2 z-10">
                    <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm"
                      onClick={() => handleShareTeam('team2')}>
                      Share Team
                    </Button>
                  </div>
                  <TeamBuilder teamId="team2" isAlternateTeam />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

interface TeamBuilderProps {
  teamId: string;
  isAlternateTeam?: boolean;
}

const TeamBuilder = ({ teamId, isAlternateTeam = false }: TeamBuilderProps) => {
  // Demo player data - in a real app, this would come from an API
  const team1Players = {
    wicketkeepers: [{ name: "Sanju Samson", team: "Rajasthan Royals", isSelected: true }],
    batters: [
      { name: "Ajinkya Rahane", team: "Kolkata Knight Riders", isSelected: true },
      { name: "Venkatesh Iyer", team: "Kolkata Knight Riders", isSelected: true },
      { name: "Yashasvi Jaiswal", team: "Rajasthan Royals", isSelected: true }
    ],
    allrounders: [
      { name: "Sunil Narine", team: "Kolkata Knight Riders", isSelected: true },
      { name: "Andre Russell", team: "Kolkata Knight Riders", isSelected: true },
      { name: "Riyan Parag", team: "Rajasthan Royals", isSelected: true }
    ],
    bowlers: [
      { name: "Jofra Archer", team: "Rajasthan Royals", isSelected: true },
      { name: "Tushar Deshpande", team: "Rajasthan Royals", isSelected: true },
      { name: "Varun Chakravarthy", team: "Kolkata Knight Riders", isSelected: true },
      { name: "Harshit Rana", team: "Kolkata Knight Riders", isSelected: true }
    ]
  };

  const team2Players = {
    wicketkeepers: [
      { name: "Sanju Samson", team: "Rajasthan Royals", isSelected: true },
      { name: "Quinton de Kock", team: "Kolkata Knight Riders", isSelected: true }
    ],
    batters: [
      { name: "Ajinkya Rahane", team: "Kolkata Knight Riders", isSelected: true },
      { name: "Venkatesh Iyer", team: "Kolkata Knight Riders", isSelected: true },
      { name: "Rinku Singh", team: "Kolkata Knight Riders", isSelected: true },
      { name: "Yashasvi Jaiswal", team: "Rajasthan Royals", isSelected: true }
    ],
    allrounders: [
      { name: "Sunil Narine", team: "Kolkata Knight Riders", isSelected: true },
      { name: "Andre Russell", team: "Kolkata Knight Riders", isSelected: true }
    ],
    bowlers: [
      { name: "Sandeep Sharma", team: "Rajasthan Royals", isSelected: true },
      { name: "Varun Chakravarthy", team: "Kolkata Knight Riders", isSelected: true },
      { name: "Mahesh Theekshana", team: "Rajasthan Royals", isSelected: true }
    ]
  };

  const players = isAlternateTeam ? team2Players : team1Players;

  return (
    <div className="relative">
      {/* Cricket field background */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-green-600 to-green-700 overflow-hidden">
        {/* Field markings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[80%] h-[80%] border-[15px] border-green-600/50 rounded-full"></div>
          <div className="absolute w-[40%] h-1 bg-white/30"></div>
          <div className="absolute h-[40%] w-1 bg-white/30"></div>
        </div>

        {/* Team legend */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-400 rounded-sm"></div>
            <span className="text-white text-xs font-medium">Rajasthan Royals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
            <span className="text-white text-xs font-medium">Kolkata Knight Riders</span>
          </div>
        </div>
        
        {/* Share button */}
        <div className="absolute top-4 right-4 text-white text-sm font-medium">
          Team {isAlternateTeam ? '2' : '1'} <span className="ml-1">🔗</span>
        </div>

        {/* Wicket Keeper Section */}
        <div className="absolute top-[15%] left-0 right-0 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="text-white font-semibold text-sm mb-2 bg-black/30 px-3 py-1 rounded-full">WICKET KEEPER</div>
            <div className="flex gap-2">
              {players.wicketkeepers.map((player, index) => (
                <PlayerCard 
                  key={index}
                  name={player.name}
                  team={player.team}
                  role="wk"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Batters Section */}
        <div className="absolute top-[35%] left-0 right-0 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="text-white font-semibold text-sm mb-2 bg-black/30 px-3 py-1 rounded-full">BATTER</div>
            <div className="flex gap-2">
              {players.batters.map((player, index) => (
                <PlayerCard 
                  key={index}
                  name={player.name}
                  team={player.team}
                  role="bat"
                />
              ))}
            </div>
          </div>
        </div>

        {/* All Rounders Section */}
        <div className="absolute top-[55%] left-0 right-0 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="text-white font-semibold text-sm mb-2 bg-black/30 px-3 py-1 rounded-full">ALL ROUNDER</div>
            <div className="flex gap-2">
              {players.allrounders.map((player, index) => (
                <PlayerCard 
                  key={index}
                  name={player.name}
                  team={player.team}
                  role="all"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bowlers Section */}
        <div className="absolute top-[75%] left-0 right-0 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="text-white font-semibold text-sm mb-2 bg-black/30 px-3 py-1 rounded-full">BOWLER</div>
            <div className="flex gap-2">
              {players.bowlers.map((player, index) => (
                <PlayerCard 
                  key={index}
                  name={player.name}
                  team={player.team}
                  role="bowl"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Management Panel */}
      <div className="p-6 bg-white border-t">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Team Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Players</span>
                  <span className="text-sm">
                    {players.wicketkeepers.length + players.batters.length + 
                     players.allrounders.length + players.bowlers.length}/11
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Rajasthan Royals</span>
                  <span className="text-sm">
                    {[...players.wicketkeepers, ...players.batters, ...players.allrounders, ...players.bowlers]
                     .filter(p => p.team === "Rajasthan Royals").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Kolkata Knight Riders</span>
                  <span className="text-sm">
                    {[...players.wicketkeepers, ...players.batters, ...players.allrounders, ...players.bowlers]
                     .filter(p => p.team === "Kolkata Knight Riders").length}
                  </span>
                </div>
                <Separator />
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="text-xs text-gray-500">WK</div>
                    <div className="font-semibold">{players.wicketkeepers.length}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">BAT</div>
                    <div className="font-semibold">{players.batters.length}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">ALL</div>
                    <div className="font-semibold">{players.allrounders.length}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">BOWL</div>
                    <div className="font-semibold">{players.bowlers.length}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <Button className="w-full bg-ipl-blue hover:bg-ipl-blue/90">Save Team</Button>
            <Button variant="outline" className="w-full">Download Team Image</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fantasy;
