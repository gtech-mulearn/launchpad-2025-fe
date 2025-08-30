"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCompanyData } from "@/hooks/api";

export default function OpeningsPage() {
  const { data, isLoading } = useGetCompanyData();
  return (
    <Card className="min-h-screen bg-secondary-900 border-none rounded-none">
      <CardHeader>
        <CardTitle className="text-white">Openings</CardTitle>
        <CardDescription>List of current job openings</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array(12)
                .fill(0)
                .map((_, i) => <OpeningsSkeleton key={i} />)
            : data?.map((item, index) => (
                <div
                  key={item.company_name}
                  className="border border-primary-500/20 hover:border-primary-500  flex flex-col space-y-2 p-3"
                  //   style={{ animationDelay: `${index * 20}ms` }}
                >
                  <h3 className="text-white font-semibold text-lg">
                    {item.company_name}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {item.ig &&
                      item.ig
                        .split(",")
                        .map((ig) => ig && <Badge key={ig}>{ig}</Badge>)}
                  </div>

                  <ul className="list-disc list-inside text-white text-sm space-y-1">
                    {item.roles &&
                      item.roles.split(",").map(
                        (role) =>
                          role && (
                            <li
                              key={role}
                              className="font-medium uppercase tracking-wider"
                            >
                              {role}
                            </li>
                          )
                      )}
                  </ul>
                </div>
              ))}
        </div>
      </CardContent>

      <CardFooter />
    </Card>
  );
}

function OpeningsSkeleton() {
  return (
    <div className="border border-primary-500/20 flex flex-col space-y-2 p-3">
      <Skeleton className="h-6 w-2/3" />
      <div className="flex flex-wrap gap-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-5 w-12 rounded-full" />
        ))}
      </div>
      <ul className="list-disc list-inside text-sm space-y-1">
        {[...Array(3)].map((_, i) => (
          <li key={i}>
            <Skeleton className="h-4 w-24" />
          </li>
        ))}
      </ul>
    </div>
  );
}
