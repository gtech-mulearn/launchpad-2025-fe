import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export const AnalyticsTab: React.FC = () => {
  return (
    <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20">
      <CardHeader>
        <CardTitle className="text-white">Recruitment Analytics</CardTitle>
        <CardDescription className="text-gray-400">
          Track your recruitment performance
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 text-primary-500 mx-auto mb-4" />
          <p className="text-gray-400">Analytics dashboard coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
};