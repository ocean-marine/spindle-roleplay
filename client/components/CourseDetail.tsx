import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookOpen, Users, Star, Clock, TrendingUp, Play, Activity as ActivityIcon, Award, BarChart } from "react-feather";
import { getTopLevelPresets } from "../data/presets";
import type { Activity } from "../types";

// Interface for mock course progress data
interface MockCourseProgress {
  completed: number;
  inProgress: number;
  totalLearners: number;
  averageScore: number;
  completionRate: number;
  totalSessions: number;
  averageSessionTime: number;
  lastCompleted: string;
  activities: Activity[];
}

// コース進捗データ（モック）- CourseManagement.jsx と同じデータ
const mockCourseProgress: Record<string, MockCourseProgress> = {
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
      { id: 4, user: "鈴木美花", action: "セッション完了", score: 7.9, date: "2024-01-07T09:15:00" },
      { id: 5, user: "高田健", action: "コース完了", score: 9.0, date: "2024-01-06T14:30:00" },
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
      { id: 4, user: "松本麗子", action: "セッション完了", score: 8.7, date: "2024-01-07T11:00:00" },
      { id: 5, user: "前田雅人", action: "コース完了", score: 8.9, date: "2024-01-06T16:45:00" },
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
      { id: 4, user: "吉田光", action: "セッション完了", score: 7.6, date: "2024-01-07T08:45:00" },
      { id: 5, user: "小林優子", action: "コース完了", score: 8.4, date: "2024-01-06T13:20:00" },
    ]
  }
};

function StatCard({ title, value, subtitle, icon: Icon, trend, className = "" }: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<any>;
  trend?: number;
  className?: string;
}) {
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

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  // コースデータを取得
  const topLevelPresets = getTopLevelPresets();
  const course = topLevelPresets.find(c => c.id === courseId);
  const progress = courseId ? mockCourseProgress[courseId] : undefined;
  
  if (!course || !progress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">コースが見つかりません</h2>
          <button 
            onClick={() => navigate("/admin/courses")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            コース管理に戻る
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "概要", icon: BookOpen },
    { id: "analytics", label: "分析", icon: BarChart },
    { id: "activities", label: "アクティビティ", icon: ActivityIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/admin/courses")}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← コース管理に戻る
              </button>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{course.icon}</span>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{course.name}</h1>
                  <p className="text-sm text-gray-600">{course.description}</p>
                </div>
              </div>
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
            {/* 統計カード */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="受講者数"
                value={`${progress.totalLearners}名`}
                subtitle="総受講者数"
                icon={Users}
                trend={8}
              />
              <StatCard
                title="完了率"
                value={`${progress.completionRate}%`}
                subtitle="コース完了率"
                icon={TrendingUp}
                trend={5}
              />
              <StatCard
                title="平均スコア"
                value={progress.averageScore}
                subtitle="10点満点中"
                icon={Star}
                trend={3}
              />
              <StatCard
                title="総セッション数"
                value={progress.totalSessions}
                subtitle="累計実施回数"
                icon={Clock}
                trend={12}
              />
            </div>

            {/* 進捗状況 */}
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">進捗状況</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">完了済み</span>
                    <span className="text-sm font-medium text-gray-900">{progress.completed}名 ({Math.round(progress.completed / progress.totalLearners * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.round(progress.completed / progress.totalLearners * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">進行中</span>
                    <span className="text-sm font-medium text-gray-900">{progress.inProgress}名 ({Math.round(progress.inProgress / progress.totalLearners * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.round(progress.inProgress / progress.totalLearners * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* コース詳細情報 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">コース情報</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">コース名</label>
                    <p className="text-sm text-gray-900">{course.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">説明</label>
                    <p className="text-sm text-gray-900">{course.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">平均セッション時間</label>
                    <p className="text-sm text-gray-900">{progress.averageSessionTime}分</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">最終完了日時</label>
                    <p className="text-sm text-gray-900">
                      {new Date(progress.lastCompleted).toLocaleString('ja-JP')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">パフォーマンス</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-green-900">高スコア達成者</span>
                    </div>
                    <span className="text-sm font-bold text-green-900">
                      {progress.activities.filter((a: Activity) => a.score && a.score >= 9.0).length}名
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Play size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">アクティブユーザー</span>
                    </div>
                    <span className="text-sm font-bold text-blue-900">{progress.inProgress}名</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* スコア分布 */}
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">スコア分布</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {progress.activities.filter((a: Activity) => a.score && a.score >= 8.5).length}
                    </div>
                    <div className="text-sm text-green-700">優秀 (8.5点以上)</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {progress.activities.filter((a: Activity) => a.score && a.score >= 7.0 && a.score < 8.5).length}
                    </div>
                    <div className="text-sm text-blue-700">良好 (7.0-8.4点)</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">
                      {progress.activities.filter((a: Activity) => a.score && a.score < 7.0).length}
                    </div>
                    <div className="text-sm text-yellow-700">要改善 (7.0点未満)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 時系列データ */}
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">受講傾向</h3>
              <div className="text-sm text-gray-600 mb-4">
                最近の受講アクティビティをもとに分析したデータです
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {Math.round(progress.averageSessionTime * 1.1)}分
                  </div>
                  <div className="text-sm text-gray-600">推奨学習時間</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {Math.round(progress.completionRate / 10)}日
                  </div>
                  <div className="text-sm text-gray-600">平均完了期間</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activities" && (
          <div className="space-y-6">
            {/* 最新アクティビティ */}
            <div className="bg-white rounded-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">最新アクティビティ</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {progress.activities
                    .sort((a: Activity, b: Activity) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime())
                    .map((activity: Activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{activity.user}</span>が
                            <span className={`font-medium ml-1 ${
                              activity.action === 'コース完了' ? 'text-green-600' : 
                              activity.action === 'セッション開始' ? 'text-blue-600' : 
                              'text-gray-600'
                            }`}>
                              {activity.action}
                            </span>
                            {activity.score && (
                              <span className="text-gray-600 ml-1">
                                (スコア: <span className="font-medium">{activity.score}</span>)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.date || '').toLocaleString('ja-JP')}
                          </p>
                        </div>
                        {activity.score && (
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            activity.score >= 9.0 ? 'bg-green-100 text-green-700' :
                            activity.score >= 8.0 ? 'bg-blue-100 text-blue-700' :
                            activity.score >= 7.0 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {activity.score}
                          </div>
                        )}
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