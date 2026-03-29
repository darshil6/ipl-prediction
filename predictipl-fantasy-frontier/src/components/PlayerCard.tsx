
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface PlayerCardProps {
  name: string;
  team: string;
  role: 'wk' | 'bat' | 'bowl' | 'all';
}

const PlayerCard: React.FC<PlayerCardProps> = ({ name, team, role }) => {
  // Determine card styling based on team
  const isRajasthan = team === "Rajasthan Royals";
  const bgColor = isRajasthan ? "bg-white" : "bg-black";
  const textColor = isRajasthan ? "text-black" : "text-white";

  // Determine if the player has a protective icon (just for demonstration)
  const hasProtection = Math.random() > 0.7;

  // Split name into first and last name for layout
  const nameParts = name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  return (
    <div className="relative">
      {hasProtection && (
        <div className="absolute -top-1 -right-1 z-10">
          <Shield className="h-4 w-4 text-green-500 fill-green-500" />
        </div>
      )}
      <Card className={`w-[80px] h-[100px] ${bgColor} ${textColor} border-0 shadow-md overflow-hidden`}>
        <CardContent className="p-2 flex flex-col items-center justify-between h-full">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-1">
            <span className="text-gray-500 text-lg">👤</span>
          </div>
          <div className="text-center w-full">
            <p className="text-xs font-medium leading-tight truncate">{firstName}</p>
            <p className="text-xs font-medium leading-tight truncate">{lastName}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerCard;
