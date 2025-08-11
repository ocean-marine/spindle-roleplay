import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User, Clock, BookOpen, TrendingUp, Award, Calendar, BarChart, ArrowLeft } from "react-feather";

// Mock employee data - extend existing team data with individual details
const employeeData = {
  1: { id: 1, name: "佐藤 花子", department: "営業部", position: "主任", score: 9.6, hours: 42, courses: 11, progress: 85, lastActivity: "2時間前", email: "sato.hanako@company.com", joinDate: "2021-04-01", completedCourses: ["顧客対応スキル向上", "プレゼンテーション技法", "営業基礎", "リーダーシップ入門"], currentCourses: ["チームマネジメント", "データ分析入門"], monthlyProgress: [65, 72, 78, 85], recentActivities: [
    { date: "2024-01-15", activity: "プレゼンテーション技法", type: "完了", score: 9.2 },
    { date: "2024-01-10", activity: "チームマネジメント", type: "進行中", progress: 60 },
    { date: "2024-01-08", activity: "データ分析入門", type: "開始", progress: 15 }
  ]},
  2: { id: 2, name: "田中 一郎", department: "営業部", position: "係長", score: 8.9, hours: 38, courses: 9, progress: 72, lastActivity: "1日前", email: "tanaka.ichiro@company.com", joinDate: "2020-08-15", completedCourses: ["顧客対応スキル向上", "営業基礎", "リーダーシップ入門"], currentCourses: ["プレゼンテーション技法", "チームマネジメント"], monthlyProgress: [58, 65, 68, 72], recentActivities: [
    { date: "2024-01-14", activity: "リーダーシップ入門", type: "完了", score: 8.7 },
    { date: "2024-01-12", activity: "プレゼンテーション技法", type: "進行中", progress: 45 }
  ]},
  6: { id: 6, name: "田中 太郎", department: "開発部", position: "リーダー", score: 9.8, hours: 45, courses: 12, progress: 95, lastActivity: "30分前", email: "tanaka.taro@company.com", joinDate: "2019-04-01", completedCourses: ["データ分析入門", "リーダーシップ基礎", "チームマネジメント", "デジタル変革基礎"], currentCourses: ["上級データ分析"], monthlyProgress: [88, 91, 93, 95], recentActivities: [
    { date: "2024-01-15", activity: "チームマネジメント", type: "完了", score: 9.8 },
    { date: "2024-01-13", activity: "上級データ分析", type: "進行中", progress: 80 }
  ]},
  10: { id: 10, name: "山田 次郎", department: "マーケティング部", position: "主任", score: 9.4, hours: 38, courses: 10, progress: 82, lastActivity: "1時間前", email: "yamada.jiro@company.com", joinDate: "2020-06-01", completedCourses: ["デジタル変革基礎", "データ分析入門", "プレゼンテーション技法"], currentCourses: ["上級マーケティング戦略"], monthlyProgress: [75, 78, 80, 82], recentActivities: [
    { date: "2024-01-15", activity: "プレゼンテーション技法", type: "完了", score: 9.1 },
    { date: "2024-01-14", activity: "上級マーケティング戦略", type: "進行中", progress: 35 }
  ]}
};

function StatCard({ title, value, subtitle, icon: Icon, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600", 
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600"
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </div>
  );
}

export default function AdminEmployeeDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get('employeeId');
  const teamId = searchParams.get('teamId');
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    if (employeeId && employeeData[employeeId]) {
      setEmployee(employeeData[employeeId]);
    }
  }, [employeeId]);

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">社員が見つかりません</h2>
          <button 
            onClick={() => navigate(teamId ? `/admin/team?teamId=${teamId}` : "/admin")}
            className="text-blue-600 hover:text-blue-700"
          >
            ← 戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(teamId ? `/admin/team?teamId=${teamId}` : "/admin")}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <ArrowLeft size={14} />
                {teamId ? "チーム詳細" : "ダッシュボード"}
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{employee.name} 社員詳細</h1>
                <p className="text-sm text-gray-600">{employee.department} • {employee.position}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              入社日: {new Date(employee.joinDate).toLocaleDateString('ja-JP')}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Performance Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="現在のスコア"
            value={employee.score}
            subtitle="10点満点中"
            icon={TrendingUp}
            color="blue"
          />
          <StatCard
            title="学習時間"
            value={`${employee.hours}h`}
            subtitle="今月累計"
            icon={Clock}
            color="green"
          />
          <StatCard
            title="完了コース数"
            value={employee.courses}
            subtitle="総コース数"
            icon={BookOpen}
            color="purple"
          />
          <StatCard
            title="現在の進捗"
            value={`${employee.progress}%`}
            subtitle="全体進捗率"
            icon={Award}
            color="orange"
          />
        </div>

        {/* Progress Chart and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Progress */}
          <div className="bg-white rounded-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">月別進捗推移</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {employee.monthlyProgress.map((progress, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{index + 1}月</span>
                    <div className="flex items-center flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 ml-2 w-12">
                        {progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">最近のアクティビティ</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {employee.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === '完了' ? 'bg-green-500' :
                      activity.type === '進行中' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.activity}</span> を
                        <span className={`font-medium ${
                          activity.type === '完了' ? 'text-green-600' :
                          activity.type === '進行中' ? 'text-blue-600' : 'text-gray-600'
                        }`}> {activity.type}</span>
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString('ja-JP')}
                        </p>
                        {activity.score && (
                          <p className="text-xs font-medium text-gray-700">
                            スコア: {activity.score}
                          </p>
                        )}
                        {activity.progress && (
                          <p className="text-xs font-medium text-gray-700">
                            進捗: {activity.progress}%
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Course Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Completed Courses */}
          <div className="bg-white rounded-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">完了コース</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {employee.completedCourses.map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-gray-900">{course}</span>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      完了
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Courses */}
          <div className="bg-white rounded-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">受講中コース</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {employee.currentCourses.length > 0 ? (
                  employee.currentCourses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">{course}</span>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        進行中
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <BookOpen size={24} className="mx-auto mb-2 text-gray-400" />
                    <p>現在受講中のコースはありません</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Recommendations */}
        <div className="bg-white rounded-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">パフォーマンス分析と推奨アクション</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Performance Analysis */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">現在の状況</h4>
                <div className="space-y-2">
                  {employee.score >= 9 && (
                    <div className="flex items-center gap-2 text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">優秀なパフォーマンスを維持</span>
                    </div>
                  )}
                  {employee.progress >= 80 && (
                    <div className="flex items-center gap-2 text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">学習進捗が順調</span>
                    </div>
                  )}
                  {employee.score < 8 && (
                    <div className="flex items-center gap-2 text-amber-700">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-sm">スキル向上の余地あり</span>
                    </div>
                  )}
                  {employee.progress < 60 && (
                    <div className="flex items-center gap-2 text-red-700">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm">学習進捗の改善が必要</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">推奨アクション</h4>
                <div className="space-y-2">
                  {employee.score >= 9 && employee.progress >= 80 && (
                    <div className="flex items-center gap-2 text-purple-700">
                      <Calendar size={12} />
                      <span className="text-sm">メンター候補として活用を検討</span>
                    </div>
                  )}
                  {employee.score < 8 && (
                    <div className="flex items-center gap-2 text-blue-700">
                      <BookOpen size={12} />
                      <span className="text-sm">基礎スキル向上のための補助教材を提供</span>
                    </div>
                  )}
                  {employee.progress < 60 && (
                    <div className="flex items-center gap-2 text-orange-700">
                      <Calendar size={12} />
                      <span className="text-sm">個別面談で学習サポートを実施</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-700">
                    <BarChart size={12} />
                    <span className="text-sm">定期的な進捗確認を継続</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}