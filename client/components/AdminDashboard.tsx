import { useState } from "react";
import { Users, BookOpen, TrendingUp, Clock, Star, BarChart, Play, Award, Activity, Target, Calendar } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import { getTopLevelPresets } from "../data/presets";
import type { CourseData, StatCardProps, CourseCardProps } from "../types";

// Mock data for dashboard
const mockData = {
  overallStats: {
    totalEmployees: 57,
    activeUsers: 50,
    completionRate: 74,
    averageScore: 8.2,
    totalLearningHours: 1256,
    coursesCompleted: 342
  },
  departmentStats: [
    { id: 1, name: "営業部", members: 15, completionRate: 82, avgScore: 8.7, activeLearners: 13 },
    { id: 2, name: "開発部", members: 12, completionRate: 91, avgScore: 9.1, activeLearners: 12 },
    { id: 3, name: "マーケティング部", members: 12, completionRate: 76, avgScore: 8.3, activeLearners: 10 },
    { id: 4, name: "人事部", members: 9, completionRate: 68, avgScore: 7.9, activeLearners: 8 },
    { id: 5, name: "総務部", members: 9, completionRate: 59, avgScore: 7.4, activeLearners: 7 }
  ],
  topPerformers: [
    { id: 1, name: "田中 太郎", department: "開発部", score: 9.8, hours: 45, courses: 12 },
    { id: 2, name: "佐藤 花子", department: "営業部", score: 9.6, hours: 42, courses: 11 },
    { id: 3, name: "山田 次郎", department: "マーケティング部", score: 9.4, hours: 38, courses: 10 }
  ],
  recentActivity: [
    { id: 1, user: "鈴木 一郎", action: "コース完了", course: "顧客対応スキル向上", time: "2時間前" },
    { id: 2, user: "高橋 美咲", action: "認定取得", course: "プレゼンテーション技法", time: "4時間前" },
    { id: 3, user: "伊藤 健太", action: "学習開始", course: "リーダーシップ基礎", time: "6時間前" }
  ]
};

// コース進捗データ（モック）- CourseManagement.jsxから移植
const mockCourseProgress: Record<string, CourseData> = {
  "real_estate_asset_hearing": {
    completed: 45,
    inProgress: 12,
    totalLearners: 67,
    averageScore: 8.7,
    completionRate: 67,
    totalSessions: 234,
    averageSessionTime: 18,
    lastCompleted: "2024-01-08T14:30:00",
    activities: [
      { id: 1, user: "田中太郎", action: "コース完了", score: 9.2, date: "2024-01-08T14:30:00" },
      { id: 2, user: "山田花子", action: "セッション開始", score: null, date: "2024-01-08T10:15:00" },
      { id: 3, user: "佐藤次郎", action: "コース完了", score: 8.5, date: "2024-01-07T16:45:00" },
    ]
  },
  "customer_support_complaint_training": {
    completed: 38,
    inProgress: 15,
    totalLearners: 58,
    averageScore: 8.3,
    completionRate: 66,
    totalSessions: 187,
    averageSessionTime: 22,
    lastCompleted: "2024-01-08T11:20:00",
    activities: [
      { id: 1, user: "高橋美咲", action: "コース完了", score: 9.0, date: "2024-01-08T11:20:00" },
      { id: 2, user: "鈴木一郎", action: "セッション開始", score: null, date: "2024-01-08T09:30:00" },
      { id: 3, user: "伊藤健太", action: "コース完了", score: 7.8, date: "2024-01-07T13:15:00" },
    ]
  },
  "water_server_sales_training": {
    completed: 29,
    inProgress: 8,
    totalLearners: 42,
    averageScore: 8.1,
    completionRate: 69,
    totalSessions: 156,
    averageSessionTime: 16,
    lastCompleted: "2024-01-08T15:45:00",
    activities: [
      { id: 1, user: "木村あゆみ", action: "コース完了", score: 8.7, date: "2024-01-08T15:45:00" },
      { id: 2, user: "渡辺健二", action: "セッション開始", score: null, date: "2024-01-08T14:20:00" },
      { id: 3, user: "中村さくら", action: "コース完了", score: 9.1, date: "2024-01-07T11:30:00" },
    ]
  }
};

import { StatCardProps } from '../types';

function StatCard({ title, value, subtitle, Icon, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon size={20} className="text-blue-600" />
        </div>
        {trend && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            trend.value > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

import { CourseCardProps } from '../types';

function CourseCard({ course, progress }: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{course.icon}</div>
          <div>
            <Link 
              to={`/admin/courses/${course.id}`}
              className="block"
            >
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                {course.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-600">{course.description}</p>
          </div>
        </div>
        <Link
          to="/setup"
          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          <Play size={14} />
          開始
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">受講者数</p>
          <p className="text-lg font-bold text-gray-900">{progress.totalLearners}名</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">完了率</p>
          <p className="text-lg font-bold text-gray-900">{progress.completionRate}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">平均スコア</p>
          <p className="text-lg font-bold text-gray-900">{progress.averageScore}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">総セッション</p>
          <p className="text-lg font-bold text-gray-900">{progress.totalSessions}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">進捗状況</span>
          <span className="text-sm text-gray-600">{progress.completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress.completionRate}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>完了: {progress.completed}名</span>
          <span>進行中: {progress.inProgress}名</span>
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">最近のアクティビティ</h4>
        <div className="space-y-2">
          {progress.activities.slice(0, 2).map((activity: any) => (
            <div key={activity.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-900">{activity.user}</span>
                <span className="text-gray-500">{activity.action}</span>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(activity.date).toLocaleString('ja-JP', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [coursesActiveTab, setCoursesActiveTab] = useState("overview");
  const navigate = useNavigate();

  // トップレベル（営業ロールプレイ）のプリセットを取得
  const topLevelPresets = getTopLevelPresets();
  
  // コース統計データを計算
  const overallCourseStats = {
    totalCourses: topLevelPresets.length,
    totalLearners: Object.values(mockCourseProgress).reduce((sum, progress) => sum + progress.totalLearners, 0),
    averageCompletionRate: Math.round(Object.values(mockCourseProgress).reduce((sum, progress) => sum + progress.completionRate, 0) / Object.keys(mockCourseProgress).length),
    totalSessions: Object.values(mockCourseProgress).reduce((sum, progress) => sum + progress.totalSessions, 0),
    averageScore: Math.round(Object.values(mockCourseProgress).reduce((sum, progress) => sum + progress.averageScore, 0) / Object.keys(mockCourseProgress).length * 10) / 10
  };

  const tabs = [
    { id: "overview", label: "組織全体俯瞰", icon: BarChart },
    { id: "departments", label: "部門別分析", icon: Users },
    { id: "courses", label: "コース管理", icon: BookOpen }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/setup")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← 戻る
              </button>
              <h1 className="text-xl font-semibold text-gray-900">管理職ダッシュボード</h1>
            </div>
            <div className="text-sm text-gray-500">
              最終更新: {new Date().toLocaleDateString('ja-JP')} {new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <StatCard
                title="総従業員数"
                value={mockData.overallStats.totalEmployees}
                subtitle="アクティブユーザー: 50名"
                Icon={Users}
                trend={{ value: 5, isPositive: true }}
              />
              <StatCard
                title="全体完了率"
                value={`${mockData.overallStats.completionRate}%`}
                subtitle="前月比 +8%"
                Icon={TrendingUp}
                trend={{ value: 8, isPositive: true }}
              />
              <StatCard
                title="平均スコア"
                value={mockData.overallStats.averageScore}
                subtitle="10点満点中"
                Icon={Star}
                trend={{ value: 3, isPositive: true }}
              />
              <StatCard
                title="総学習時間"
                value={`${mockData.overallStats.totalLearningHours}h`}
                subtitle="今月累計"
                Icon={Clock}
                trend={{ value: 12, isPositive: true }}
              />
              <StatCard
                title="コース完了数"
                value={mockData.overallStats.coursesCompleted}
                subtitle="今月累計"
                Icon={BookOpen}
                trend={{ value: 15, isPositive: true }}
              />
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Top Performers */}
              <div className="bg-white rounded-lg border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">トップパフォーマー</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {mockData.topPerformers.map((performer, index) => (
                      <div key={performer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <Link 
                              to={`/admin/employee?employeeId=${performer.id}`}
                              className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                            >
                              {performer.name}
                            </Link>
                            <p className="text-sm text-gray-600">{performer.department}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{performer.score}</p>
                          <p className="text-xs text-gray-500">{performer.hours}h • {performer.courses}コース</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">最近のアクティビティ</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {mockData.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <Link 
                              to={`/admin/employee?employeeId=${activity.id}`}
                              className="font-medium hover:text-blue-600 transition-colors"
                            >
                              {activity.user}
                            </Link>が
                            <span className="font-medium text-blue-600"> {activity.action}</span>
                          </p>
                          <p className="text-sm text-gray-600">{activity.course}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "departments" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">部門別パフォーマンス</h3>
              </div>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-[600px] sm:min-w-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部門名</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メンバー数</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">完了率</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">平均スコア</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アクティブユーザー</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">詳細</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockData.departmentStats.map((dept) => (
                      <tr key={dept.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link 
                            to={`/admin/team?teamId=${dept.id}`}
                            className="text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {dept.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.members}名</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${dept.completionRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{dept.completionRate}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.avgScore}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.activeLearners}名</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link 
                            to={`/admin/team?teamId=${dept.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            チーム詳細 →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-6">
            {/* Course Management Sub-tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto bg-white rounded-t-lg">
              <button
                onClick={() => setCoursesActiveTab("overview")}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  coursesActiveTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <BookOpen size={16} />
                コース概要
              </button>
              <button
                onClick={() => setCoursesActiveTab("analytics")}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  coursesActiveTab === "analytics"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <BarChart size={16} />
                分析・統計
              </button>
            </div>

            {/* Course Overview Tab */}
            {coursesActiveTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">営業ロールプレイコース</h2>
                  <div className="space-y-6">
                    {topLevelPresets.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        progress={mockCourseProgress[course.id] || {
                          completed: 0,
                          inProgress: 0,
                          totalLearners: 0,
                          averageScore: 0,
                          completionRate: 0,
                          totalSessions: 0,
                          averageSessionTime: 0,
                          activities: []
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Course Analytics Tab */}
            {coursesActiveTab === "analytics" && (
              <div className="space-y-6">
                {/* 全体統計 */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">全体統計</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    <StatCard
                      title="コース総数"
                      value={overallCourseStats.totalCourses}
                      subtitle="営業ロールプレイコース"
                      Icon={BookOpen}
                    />
                    <StatCard
                      title="総受講者数"
                      value={`${overallCourseStats.totalLearners}名`}
                      subtitle="全コース合計"
                      icon={Users}
                      trend={8}
                    />
                    <StatCard
                      title="平均完了率"
                      value={`${overallCourseStats.averageCompletionRate}%`}
                      subtitle="全コース平均"
                      Icon={TrendingUp}
                      trend={{ value: 5, isPositive: true }}
                    />
                    <StatCard
                      title="総セッション数"
                      value={overallCourseStats.totalSessions}
                      subtitle="累計実施回数"
                      Icon={Clock}
                      trend={{ value: 12, isPositive: true }}
                    />
                    <StatCard
                      title="平均スコア"
                      value={overallCourseStats.averageScore}
                      subtitle="10点満点中"
                      Icon={Star}
                      trend={{ value: 3, isPositive: true }}
                    />
                  </div>
                </div>

                {/* コース別パフォーマンス比較 */}
                <div className="bg-white rounded-lg border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">コース別パフォーマンス</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">コース名</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">受講者数</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">完了率</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">平均スコア</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">総セッション</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">平均時間</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {topLevelPresets.map((course) => {
                          const progress = mockCourseProgress[course.id];
                          if (!progress) return null;
                          
                          return (
                            <tr key={course.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">{course.icon}</span>
                                  <div>
                                    <Link 
                                      to={`/admin/courses/${course.id}`}
                                      className="block"
                                    >
                                      <div className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                                        {course.name}
                                      </div>
                                    </Link>
                                    <div className="text-sm text-gray-500">{course.description}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {progress.totalLearners}名
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ width: `${progress.completionRate}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-900">{progress.completionRate}%</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {progress.averageScore}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {progress.totalSessions}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {progress.averageSessionTime}分
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 最新アクティビティ */}
                <div className="bg-white rounded-lg border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">最新アクティビティ</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {topLevelPresets.flatMap(course => {
                        const progress = mockCourseProgress[course.id];
                        if (!progress) return [];
                        return progress.activities.map(activity => ({
                          ...activity,
                          courseName: course.name,
                          courseIcon: course.icon
                        }));
                      })
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .slice(0, 8)
                      .map((activity) => (
                        <div key={`${activity.courseName}-${activity.id}`} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">{activity.user}</span>が
                              <span className="font-medium text-blue-600"> {activity.action}</span>
                              {activity.score && (
                                <span className="text-gray-600"> (スコア: {activity.score})</span>
                              )}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <span>{activity.courseIcon}</span>
                              {activity.courseName}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(activity.date).toLocaleString('ja-JP')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}