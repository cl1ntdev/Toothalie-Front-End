import React, { useEffect, useState, useCallback } from "react";
import { getActivityLogs, type ActivityLogFilters } from "@/API/Authenticated/admin/ActivityLogs";
import { Filter, User, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ActivityLog {
  id: number;
  user_id: number | null;
  username: string;
  role: string;
  action: string;
  target_data: string;
  created_at: string;
}

interface FilterState {
  userId: string;
  action: string;
  dateFrom: string;
  dateTo: string;
}

export default function Logs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    userId: "",
    action: "",
    dateFrom: "",
    dateTo: "",
  });

  // Filter Options Data
  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<{ user_id: number; username: string }[]>([]);
  
  // Pagination State
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 50;

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);

      const queryParams: ActivityLogFilters = {
        limit: pageSize,
        offset: currentPage * pageSize,
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.action && { action: filters.action }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
      };

      const response = await getActivityLogs(queryParams);

      setLogs(response.logs ?? []);
      setTotal(response.total ?? 0);
      
      // Update filter options if available
      if (response.filters) {
        setAvailableActions(response.filters.actions ?? []);
        setAvailableUsers(response.filters.users ?? []);
      }
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, pageSize]); // Dependencies are clean

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(0); // Reset to page 1 on filter change
  };

  const clearFilters = () => {
    setFilters({
      userId: "",
      action: "",
      dateFrom: "",
      dateTo: "",
    });
    setCurrentPage(0);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionBadgeColor = (action: string) => {
    const actionColors: Record<string, string> = {
      USER_LOGIN: "bg-green-100 text-green-800 border-green-200",
      USER_LOGOUT: "bg-gray-100 text-gray-800 border-gray-200",
      USER_CREATED: "bg-blue-100 text-blue-800 border-blue-200",
      USER_UPDATED: "bg-yellow-100 text-yellow-800 border-yellow-200",
      USER_DELETED: "bg-red-100 text-red-800 border-red-200",
      RECORD_CREATED: "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
    return actionColors[action] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Activity Logs</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor system actions, security events, and user modifications.
        </p>
      </div>

      {/* Filters Container */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <h2 className="text-sm font-medium text-gray-700">Filter Records</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* User Select */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">User</label>
            <Select
              value={filters.userId}
              onValueChange={(val) => handleFilterChange("userId", val === "ALL" ? "" : val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Users</SelectItem>
                {availableUsers.map((user) => (
                  <SelectItem key={user.user_id} value={user.user_id.toString()}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Select */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Action Type</label>
            <Select
              value={filters.action}
              onValueChange={(val) => handleFilterChange("action", val === "ALL" ? "" : val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Actions</SelectItem>
                {availableActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date From */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Date From</label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              className="block w-full"
            />
          </div>

          {/* Date To */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Date To</label>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              className="block w-full"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {(filters.userId || filters.action || filters.dateFrom || filters.dateTo) && (
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-sm font-semibold text-gray-700">
            Records Found: {total}
          </h2>
          {loading && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
        </div>

        <div className="relative">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[200px]">User</TableHead>
                <TableHead className="w-[120px]">Role</TableHead>
                <TableHead className="w-[180px]">Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Skeleton Loader
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 w-24 bg-gray-100 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-32 bg-gray-100 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-16 bg-gray-100 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-20 bg-gray-100 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-48 bg-gray-100 rounded animate-pulse" /></TableCell>
                  </TableRow>
                ))
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <FileText className="h-12 w-12 mb-2 opacity-50" />
                      <p>No activity logs found matching your criteria.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-xs text-gray-500">
                      {formatDate(log.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{log.username || "Unknown"}</span>
                        {log.user_id && <span className="text-[10px] text-gray-400">ID: {log.user_id}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {log.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActionBadgeColor(log.action)}`}>
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 line-clamp-2" title={log.target_data}>
                        {log.target_data}
                      </p>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="text-xs text-gray-500">
              Page {currentPage + 1} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0 || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage >= totalPages - 1 || loading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}