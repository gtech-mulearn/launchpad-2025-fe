import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const TabsNavigation: React.FC<TabsNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList className="bg-secondary-800/50 backdrop-blur-sm border border-primary-500/20">
        {/* <TabsTrigger
          value="candidates"
          className="text-white data-[state=active]:bg-primary-500"
          aria-label="Candidates Tab"
        >
          Candidates
        </TabsTrigger> */}
        <TabsTrigger
          value="job-offers"
          className="text-white data-[state=active]:bg-primary-500"
          aria-label="Job Offers Tab"
        >
          Job Offers
        </TabsTrigger>
        {/* <TabsTrigger
          value="requests"
          className="text-white data-[state=active]:bg-primary-500"
          aria-label="Hire Requests Tab"
        >
          Hire Requests
        </TabsTrigger> */}
        <TabsTrigger
          value="analytics"
          className="text-white data-[state=active]:bg-primary-500"
          aria-label="Analytics Tab"
        >
          Analytics
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};