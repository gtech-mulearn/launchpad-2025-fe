"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Medal, Award, MapPin, Building, Target, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { LeaderboardStudent } from "@/types/recruiter";
import { LoadingSpinner } from "@/components/loading-spinner";

interface LeaderboardTabProps {
  students: LeaderboardStudent[];
  isLoading?: boolean;
  error?: Error | null;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  perPage?: number;
  searchQuery?: string;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onSearchSubmit?: (search: string) => void;
  onSearchClear?: () => void;
}

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({
  students,
  isLoading = false,
  error,
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  hasNext = false,
  hasPrev = false,
  perPage = 10,
  searchQuery = "",
  onPageChange,
  onPerPageChange,
  onSearchSubmit,
  onSearchClear,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Update local search when searchQuery prop changes (e.g., when cleared externally)
  useState(() => {
    setLocalSearchQuery(searchQuery);
  });

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (localSearchQuery.trim().length >= 3 || localSearchQuery.trim().length === 0) {
      onSearchSubmit?.(localSearchQuery.trim());
    }
  };

  const handleSearchClear = () => {
    setLocalSearchQuery("");
    onSearchClear?.();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-secondary-800/50 backdrop-blur-sm border-red-500/30">
        <CardContent className="p-6">
          <div className="text-center text-red-400">
            <p className="text-lg font-semibold mb-2">Error Loading Leaderboard</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // if (!students || students.length === 0) {
  //   return (
  //     <Card className="bg-secondary-800/50 backdrop-blur-sm border-primary-500/20">
  //       <CardContent className="p-8">
  //         <div className="text-center text-gray-400">
  //           <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
  //           <p className="text-lg">No leaderboard data available</p>
  //         </div>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-semibold text-gray-400">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank <= 3) return "bg-gradient-to-r from-primary-500 to-primary-600";
    if (rank <= 10) return "bg-gradient-to-r from-blue-500 to-blue-600";
    return "bg-secondary-600";
  };

  return (
    <div className="space-y-4">
      <Card className="bg-secondary-800/50 backdrop-blur-sm border-primary-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary-500" />
              Launchpad Leaderboard
            </div>
            {totalCount > 0 && (
              <div className="text-sm text-gray-400">
                {totalCount.toLocaleString()} total participants
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls - Always Visible */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <form 
                className="flex-1 flex gap-2" 
                onSubmit={handleSearchSubmit}
              >
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, organization, or Launchpad ID (min 3 characters)..."
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary-700/50 border-secondary-600 text-white placeholder:text-gray-400 focus:border-primary-500"
                  />
                  {localSearchQuery && localSearchQuery.length < 3 && localSearchQuery.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 text-xs text-yellow-400">
                      Type at least 3 characters to search
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  variant="outline"
                  size="default"
                  disabled={localSearchQuery.length > 0 && localSearchQuery.length < 3}
                  className="bg-primary-600 hover:bg-primary-700 border-primary-600 text-white px-4"
                >
                  Search
                </Button>
                {searchQuery && (
                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={handleSearchClear}
                    className="bg-secondary-600 hover:bg-secondary-700 border-secondary-600 text-white px-4"
                  >
                    Clear
                  </Button>
                )}
              </form>
              
              {/* Per Page */}
              <div className="w-full sm:w-32">
                <Select value={perPage.toString()} onValueChange={(value) => onPerPageChange?.(parseInt(value))}>
                  <SelectTrigger className="bg-secondary-700/50 border-secondary-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary-700 border-secondary-600">
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="25">25 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Active filters display */}
            {searchQuery && (
              <div className="flex items-center justify-between flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-400">Active search:</span>
                  <Badge variant="secondary" className="bg-primary-500/20 text-primary-400 border-primary-500/30">
                    "{searchQuery}"
                    <button
                      onClick={handleSearchClear}
                      className="ml-2 hover:text-primary-300"
                    >
                      ×
                    </button>
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleSearchClear();
                    onPageChange?.(1);
                  }}
                  className="bg-secondary-700/50 border-secondary-600 text-white hover:bg-secondary-600 text-xs"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Section - Separate Card */}
      <Card className="bg-secondary-800/50 backdrop-blur-sm border-primary-500/20">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <LoadingSpinner />
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-400" />
              {searchQuery ? (
                <div>
                  <p className="text-lg text-gray-400 mb-2">No students found</p>
                  <p className="text-sm text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : (
                <p className="text-lg text-gray-400">No leaderboard data available</p>
              )}
            </div>
          ) : (
            <div className="grid gap-3">
              {students.map((student) => (
                <Card
                  key={student.launchpad_id}
                  className={`bg-secondary-700/50 border-secondary-600/50 hover:border-primary-500/40 transition-colors duration-200 ${
                    student.rank <= 3 ? 'ring-1 ring-primary-500/30' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadgeColor(student.rank)}`}>
                          {getRankIcon(student.rank)}
                        </div>
                        
                        {/* Student Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary-500/20 text-primary-400 text-sm font-semibold">
                                {student.full_name
                                    .split(' ')
                                    .map((n: string) => n[0])
                                    .join('')
                                    .toUpperCase()
                                    .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-white font-semibold text-lg">
                                {student.full_name}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                ID: {student.launchpad_id}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-300">
                              <Building className="h-4 w-4 text-gray-500" />
                              <span className="truncate">{student.org}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>{student.district_name}, {student.state}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Karma Stats */}
                      <div className="text-right space-y-2">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary-500" />
                          <div>
                            <p className="text-primary-400 font-bold text-xl">
                              {student.karma.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">Launchpad Karma</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">
                            Total: {student.actual_karma.toLocaleString()}
                          </p>
                        </div>
                        
                        <Badge 
                          variant="secondary" 
                          className={`${getRankBadgeColor(student.rank)} text-white border-0`}
                        >
                          Rank #{student.rank}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination - Always Visible */}
      {(students.length > 0 || (totalPages > 1 && !isLoading)) && (
        <Card className="bg-secondary-800/50 backdrop-blur-sm border-primary-500/20">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-400">
                {totalCount > 0 && (
                  <>
                    Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalCount)} of {totalCount.toLocaleString()} results
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(currentPage - 1)}
                  disabled={!hasPrev || isLoading}
                  className="bg-secondary-700 border-secondary-600 text-white hover:bg-secondary-600"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange?.(pageNum)}
                        disabled={isLoading}
                        className={`w-8 h-8 p-0 ${
                          currentPage === pageNum
                            ? 'bg-primary-500 hover:bg-primary-600'
                            : 'bg-secondary-700 border-secondary-600 text-white hover:bg-secondary-600'
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(currentPage + 1)}
                  disabled={!hasNext || isLoading}
                  className="bg-secondary-700 border-secondary-600 text-white hover:bg-secondary-600"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
