import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader
        className={`flex flex-row items-center justify-between space-y-0 pb-2 ${color}`}
      >
        <CardTitle className="text-sm font-medium text-white">{title}</CardTitle>
        <div className="rounded-full p-2">{icon}</div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-3xl font-bold text-white">{value}</div>
      </CardContent>
    </Card>
  );
};