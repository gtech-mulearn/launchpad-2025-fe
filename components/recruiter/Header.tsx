import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface HeaderProps {
  userEmail: string;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userEmail, onLogout }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Recruiter Dashboard
        </h1>
        <p className="text-gray-400">Welcome back, {userEmail}</p>
      </div>
      <Button
        onClick={onLogout}
        variant="outline"
        className="bg-button-secondary-500/30 border-primary-500/30 text-white hover:bg-primary-500/10"
        aria-label="Logout"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};