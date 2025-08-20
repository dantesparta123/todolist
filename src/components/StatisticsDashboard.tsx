'use client';

import { useState, useMemo } from 'react';
import { Todo } from '@/types/todo';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { X, TrendingUp, CheckCircle, Clock, Calendar } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface StatisticsDashboardProps {
  todos: Todo[];
}

export default function StatisticsDashboard({ todos }: StatisticsDashboardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 计算统计数据
  const statistics = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // 按状态分类
    const statusData = [
      { name: '已完成', value: completed, color: '#10B981' },
      { name: '未完成', value: pending, color: '#F59E0B' }
    ];

    // 本周任务趋势
    const now = new Date();
    const weekStart = startOfWeek(now, { locale: zhCN });
    const weekEnd = endOfWeek(now, { locale: zhCN });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const weeklyData = weekDays.map(day => {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      const dayTodos = todos.filter(todo => {
        const todoDate = new Date(todo.created_at);
        return todoDate >= dayStart && todoDate <= dayEnd;
      });

      return {
        date: format(day, 'MM/dd', { locale: zhCN }),
        total: dayTodos.length,
        completed: dayTodos.filter(todo => todo.completed).length,
        pending: dayTodos.filter(todo => !todo.completed).length
      };
    });

    // 本月任务趋势
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const monthWeeks = eachWeekOfInterval({ start: monthStart, end: monthEnd });

    const monthlyData = monthWeeks.map(week => {
      const weekStart = startOfWeek(week, { locale: zhCN });
      const weekEnd = endOfWeek(week, { locale: zhCN });

      const weekTodos = todos.filter(todo => {
        const todoDate = new Date(todo.created_at);
        return todoDate >= weekStart && todoDate <= weekEnd;
      });

      return {
        week: `第${Math.ceil((week.getTime() - monthStart.getTime()) / (7 * 24 * 60 * 60 * 1000))}周`,
        total: weekTodos.length,
        completed: weekTodos.filter(todo => todo.completed).length,
        pending: weekTodos.filter(todo => !todo.completed).length
      };
    });

    return {
      total,
      completed,
      pending,
      completionRate,
      statusData,
      weeklyData,
      monthlyData
    };
  }, [todos]);

  return (
    <>
      {/* 浮动按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 sm:bottom-20 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-all duration-200 flex items-center justify-center z-50"
        title="数据统计看板"
      >
        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* 模态框 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* 模态框头部 */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">数据统计看板</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 模态框内容 */}
            <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
              {/* 概览统计 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                    <span className="text-xs sm:text-sm text-blue-600">总任务数</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-blue-900 mt-2">{statistics.total}</p>
                </div>
                
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <span className="text-xs sm:text-sm text-green-600">已完成</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-green-900 mt-2">{statistics.completed}</p>
                </div>
                
                <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                    <span className="text-xs sm:text-sm text-yellow-600">未完成</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-900 mt-2">{statistics.pending}</p>
                </div>
                
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                    <span className="text-xs sm:text-sm text-purple-600">完成率</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-purple-900 mt-2">{statistics.completionRate}%</p>
                </div>
              </div>

              {/* 任务状态分布 */}
              <div className="bg-white border rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">任务状态分布</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statistics.statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statistics.statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statistics.statusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* 本周任务趋势 */}
              <div className="bg-white border rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">本周任务趋势</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={statistics.weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="total" stroke="#8884d8" name="总任务" />
                      <Line type="monotone" dataKey="completed" stroke="#10B981" name="已完成" />
                      <Line type="monotone" dataKey="pending" stroke="#F59E0B" name="未完成" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 本月任务趋势 */}
              <div className="bg-white border rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">本月任务趋势</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statistics.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" fill="#8884d8" name="总任务" />
                      <Bar dataKey="completed" fill="#10B981" name="已完成" />
                      <Bar dataKey="pending" fill="#F59E0B" name="未完成" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
