"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Plus } from "lucide-react";

// Mock task data
const initialTasks = [
  {
    id: "1",
    name: "Resume Screening",
    recruiter: "Alice Brown",
    company: "TechCorp Solutions",
    category: "Regular",
    status: "Active",
    needApproval: false,
  },
  {
    id: "2",
    name: "Discord Coding Challenge",
    recruiter: "Bob Wilson",
    company: "InnovateLabs",
    category: "Discord",
    status: "Pending",
    needApproval: true,
  },
  {
    id: "3",
    name: "Technical Interview",
    recruiter: "Sarah Johnson",
    company: "EduTech Kerala",
    category: "Regular",
    status: "Active",
    needApproval: false,
  },
  {
    id: "4",
    name: "Discord Hackathon",
    recruiter: "Priya Menon",
    company: "TechCorp Solutions",
    category: "Discord",
    status: "Pending",
    needApproval: true,
  },
];

export default function TaskListPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Sort: tasks needing approval first
  const sortedTasks = [
    ...tasks.filter((t) => t.needApproval),
    ...tasks.filter((t) => !t.needApproval),
  ];

  const handleApprove = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: "Active", needApproval: false }
          : t
      )
    );
  };

  const handleCloseModal = () => setSelectedTask(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-3xl font-bold">Tasks</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage tasks
                </CardDescription>
              </div>
              
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white w-1/4">Task Name</TableHead>
                  <TableHead className="text-white w-1/5">Recruiter</TableHead>
                  <TableHead className="text-white w-1/5">Company</TableHead>
                  <TableHead className="text-white w-1/8">Category</TableHead>
                  <TableHead className="text-white w-1/8">Status</TableHead>
                  <TableHead className="text-white w-1/8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTasks.map((task) => (
                  <TableRow key={task.id} className="border-gray-700">
                    <TableCell>
                      <div className="font-bold text-white">{task.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-white">{task.recruiter}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-white">{task.company}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          task.category === "Discord"
                            ? "border-blue-500 text-blue-400 px-3 py-1"
                            : "border-orange-500 text-orange-400 px-3 py-1"
                        }
                        variant="outline"
                      >
                        {task.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {task.status === "Active" ? (
                        <Badge className="border-green-600 text-green-400 px-4 py-1" variant="outline">
                          Active
                        </Badge>
                      ) : (
                        <Badge className="border-yellow-600 text-yellow-400 px-4 py-1" variant="outline">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="border border-orange-500 text-orange-500 hover:bg-orange-500/10 bg-transparent"
                          onClick={() => setSelectedTask(task)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="border border-blue-500 text-blue-400 hover:bg-blue-500/10 bg-transparent"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="border border-red-500 text-red-500 hover:bg-red-500/10 bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        {task.needApproval && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white ml-2"
                            onClick={() => handleApprove(task.id)}
                          >
                            Approve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* Modal for task details */}
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-secondary-900 rounded-lg p-8 min-w-[320px] max-w-md shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={handleCloseModal}
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-white mb-4">Task Details</h2>
              <div className="mb-2">
                <span className="font-semibold text-gray-300">Task Name: </span>
                <span className="text-white">{selectedTask.name}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-300">Recruiter: </span>
                <span className="text-white">{selectedTask.recruiter}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-300">Company: </span>
                <span className="text-white">{selectedTask.company}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-300">Category: </span>
                <span className="text-white">{selectedTask.category}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-300">Status: </span>
                <span className="text-white">{selectedTask.status}</span>
              </div>
              <div className="flex justify-end mt-4">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleCloseModal}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}