import { useState } from "react";
import { BookOpen, Clock, Users, TrendingUp, Star, Play, BarChart } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import { getTopLevelPresets } from "../data/presets";

// コース進捗データ（モック）
const mockCourseProgress = {
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

function StatCard({ title, value, subtitle, icon: Icon, trend, className = "" }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon size={20} className="text-blue-600" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            trend > 0 ? 'bg-green-100 text-green-700' : 
            trend < 0 ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
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

function CourseCard({ course, progress }) {
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
          {progress.activities.slice(0, 2).map((activity) => (
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

export default function CourseManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  // トップレベル（営業ロールプレイ）のプリセットを取得
  const topLevelPresets = getTopLevelPresets();
  
  // 統計データを計算
  const overallStats = {
    totalCourses: topLevelPresets.length,
    totalLearners: Object.values(mockCourseProgress).reduce((sum, progress) => sum + progress.totalLearners, 0),
    averageCompletionRate: Math.round(Object.values(mockCourseProgress).reduce((sum, progress) => sum + progress.completionRate, 0) / Object.keys(mockCourseProgress).length),
    totalSessions: Object.values(mockCourseProgress).reduce((sum, progress) => sum + progress.totalSessions, 0),
    averageScore: Math.round(Object.values(mockCourseProgress).reduce((sum, progress) => sum + progress.averageScore, 0) / Object.keys(mockCourseProgress).length * 10) / 10
  };

  const tabs = [
    { id: "overview", label: "コース概要", icon: BookOpen },
    { id: "analytics", label: "分析・統計", icon: BarChart }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/admin")}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← 管理ダッシュボードに戻る
              </button>
              <h1 className="text-xl font-semibold text-gray-900">コース管理</h1>
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
            {/* コース一覧 */}
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

        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* 全体統計 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">全体統計</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <StatCard
                  title="コース総数"
                  value={overallStats.totalCourses}
                  subtitle="営業ロールプレイコース"
                  icon={BookOpen}
                />
                <StatCard
                  title="総受講者数"
                  value={`${overallStats.totalLearners}名`}
                  subtitle="全コース合計"
                  icon={Users}
                  trend={8}
                />
                <StatCard
                  title="平均完了率"
                  value={`${overallStats.averageCompletionRate}%`}
                  subtitle="全コース平均"
                  icon={TrendingUp}
                  trend={5}
                />
                <StatCard
                  title="総セッション数"
                  value={overallStats.totalSessions}
                  subtitle="累計実施回数"
                  icon={Clock}
                  trend={12}
                />
                <StatCard
                  title="平均スコア"
                  value={overallStats.averageScore}
                  subtitle="10点満点中"
                  icon={Star}
                  trend={3}
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
    </div>
  );
}