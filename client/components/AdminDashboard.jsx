import { useState } from "react";
import { Users, BookOpen, TrendingUp, Clock, Star, BarChart } from "react-feather";
import { Link, useNavigate } from "react-router-dom";

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

function StatCard({ title, value, subtitle, icon: Icon, trend }) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon size={20} className="text-blue-600" />
        </div>
        {trend && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

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
                icon={Users}
                trend={5}
              />
              <StatCard
                title="全体完了率"
                value={`${mockData.overallStats.completionRate}%`}
                subtitle="前月比 +8%"
                icon={TrendingUp}
                trend={8}
              />
              <StatCard
                title="平均スコア"
                value={mockData.overallStats.averageScore}
                subtitle="10点満点中"
                icon={Star}
                trend={3}
              />
              <StatCard
                title="総学習時間"
                value={`${mockData.overallStats.totalLearningHours}h`}
                subtitle="今月累計"
                icon={Clock}
                trend={12}
              />
              <StatCard
                title="コース完了数"
                value={mockData.overallStats.coursesCompleted}
                subtitle="今月累計"
                icon={BookOpen}
                trend={15}
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">コース管理</h2>
              <Link
                to="/admin/courses"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <BookOpen size={16} />
                詳細コース管理
              </Link>
            </div>
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">コース効果測定</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "不動産営業の資産背景ヒアリング", completions: 67, satisfaction: 4.7, icon: "🏡" },
                  { name: "カスタマーサポートのクレーム対応強化", completions: 58, satisfaction: 4.3, icon: "📞" },
                  { name: "ウォーターサーバーの商品説明ロールプレイ", completions: 42, satisfaction: 4.5, icon: "💧" },
                ].map((course, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{course.icon}</span>
                      <h4 className="font-medium text-gray-900">{course.name}</h4>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>完了者数:</span>
                        <span className="font-medium">{course.completions}名</span>
                      </div>
                      <div className="flex justify-between">
                        <span>満足度:</span>
                        <span className="font-medium">{course.satisfaction}/5.0</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}