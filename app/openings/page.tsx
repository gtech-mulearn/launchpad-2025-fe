"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCompanyData } from "@/hooks/api";

type Company = {
  company_name: string;
  roles: string;
  ig: string;
};

function csvToArray(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.replace(/[()]/g, "").trim())
    .filter(Boolean);
}

function normalize(str: string | null | undefined) {
  return (str ?? "").replace(/\s+/g, " ").trim();
}

export default function CompanyDirectory() {
  const [query, setQuery] = useState("");
  const [igFilter, setIgFilter] = useState<string>("all");
  const { data: companies } = useGetCompanyData();

  const normalized = useMemo(() => {
    return (companies ?? []).map((c) => {
      const name = normalize(c.company_name);
      const roles = csvToArray(c.roles);
      const igs = csvToArray(c.ig);
      return { name, roles, igs };
    });
  }, [companies]);

  const igOptions = useMemo(() => {
    const opts = new Set<string>();
    normalized.forEach((c) => c.igs.forEach((ig) => opts.add(ig)));
    return Array.from(opts).sort((a, b) => a.localeCompare(b));
  }, [normalized]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return normalized
      .filter((c) => {
        const matchesQuery =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.roles.some((r) => r.toLowerCase().includes(q)) ||
          c.igs.some((i) => i.toLowerCase().includes(q));
        const matchesIg = igFilter === "all" || c.igs.includes(igFilter);
        return matchesQuery && matchesIg;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [normalized, query, igFilter]);

  const total = normalized.length;
  const count = filtered.length;

  return (
    <section className="w-full min-h-screen px-4 py-12 bg-secondary-900 text-white relative z-10">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] mask-radial-faded opacity-20" />
      <div className="absolute top-1/2 left-0 w-full h-px bg-primary-500/20" />
      <div className="absolute top-0 left-1/2 w-px h-full bg-primary-500/20" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        <header className="space-y-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight uppercase">
            Explore <span className="text-primary-500">Opportunities</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Filter by company, role, or interest group to discover your next
            career move.
          </p>
        </header>

        <Card className="bg-secondary-800 border border-primary-500/20 backdrop-blur-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-white uppercase tracking-widest text-sm font-semibold">
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="q" className="text-white">
                  Search
                </Label>
                <Input
                  id="q"
                  placeholder="Search company, role or IG"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-secondary-900 text-white border border-white/10 focus:border-primary-500"
                />
              </div>
              <div>
                <Label className="text-white">Interest Group</Label>
                <Select value={igFilter} onValueChange={setIgFilter}>
                  <SelectTrigger className="bg-secondary-900 text-white border border-white/10 focus:border-primary-500">
                    <SelectValue placeholder="All interest groups" />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary-800 text-white border border-white/10">
                    <SelectItem value="all">All</SelectItem>
                    {igOptions.map((ig) => (
                      <SelectItem key={ig} value={ig}>
                        {ig}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <p className="text-sm text-gray-400">
                  Showing {count} of {total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary-800 border border-primary-500/20 backdrop-blur-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-white uppercase tracking-widest text-sm font-semibold">
              Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.length === 0 ? (
                <p className="text-center text-gray-400 py-6">
                  No results found.
                </p>
              ) : (
                filtered.map((c) => (
                  <Card
                    key={`${c.name}-${c.roles.join("|")}`}
                    className="bg-secondary-900 border border-primary-500/10 p-4 transition-transform hover:scale-105"
                  >
                    <h3 className="text-lg font-semibold text-primary-500">
                      {c.name}
                    </h3>
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 uppercase mb-1">
                        Roles
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {c.roles.length > 0 ? (
                          c.roles.map((r) => (
                            <Badge
                              key={r}
                              variant="secondary"
                              className="rounded-md"
                            >
                              {r}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 uppercase mb-1">
                        Interest Groups
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {c.igs.length > 0 ? (
                          c.igs.map((ig) => (
                            <Badge
                              key={ig}
                              variant="default"
                              className="rounded-md"
                            >
                              {ig}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            <div className="hidden md:block overflow-x-auto mt-4">
              <Table className="text-white">
                <TableCaption className="text-xs text-gray-500">
                  Showing available roles from registered companies.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white/70 w-[40%]">
                      Company
                    </TableHead>
                    <TableHead className="text-white/70 w-[35%]">
                      Roles
                    </TableHead>
                    <TableHead className="text-white/70 w-[25%]">
                      Interest Groups
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-gray-400"
                      >
                        No results found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((c) => (
                      <TableRow key={`${c.name}-${c.roles.join("|")}`}>
                        <TableCell className="font-semibold text-primary-500">
                          {c.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {c.roles.map((r) => (
                              <Badge key={r} variant="secondary">
                                {r}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {c.igs.map((ig) => (
                              <Badge key={ig} variant="default">
                                {ig}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
