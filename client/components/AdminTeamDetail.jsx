import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { User, Clock, BookOpen, TrendingUp, Award, Calendar } from "react-feather";

// Mock team data
const teamData = {
  1: {
    name: "営業部",
    manager: "山田 部長",
    members: [
      { id: 1, name: "佐藤 花子", position: "主任", score: 9.6, hours: 42, courses: 11, progress: 85, lastActivity: "2時間前" },
      { id: 2, name: "田中 一郎", position: "係長", score: 8.9, hours: 38, courses: 9, progress: 72, lastActivity: "1日前" },
      { id: 3, name: "鈴木 美咲", position: "主任", score: 8.7, hours: 35, courses: 8, progress: 68, lastActivity: "3時間前" },
      { id: 4, name: "高橋 健太", position: "一般", score: 8.2, hours: 28, courses: 6, progress: 58, lastActivity: "5時間前" },
      { id: 5, name: "伊藤 恵", position: "一般", score: 7.9, hours: 25, courses: 5, progress: 45, lastActivity: "1日前" }
    ]
  },
  2: {
    name: "開発部",
    manager: "鈴木 部長",
    members: [
      { id: 6, name: "田中 太郎", position: "リーダー", score: 9.8, hours: 45, courses: 12, progress: 95, lastActivity: "30分前" },
      { id: 7, name: "山田 さくら", position: "シニア", score: 9.2, hours: 41, courses: 10, progress: 88, lastActivity: "1時間前" },
      { id: 8, name: "松本 大輔", position: "シニア", score: 8.8, hours: 37, courses: 9, progress: 76, lastActivity: "2時間前" },
      { id: 9, name: "中村 あやか", position: "一般", score: 8.4, hours: 33, courses: 7, progress: 64, lastActivity: "4時間前" }
    ]
  },
  3: {
    name: "マーケティング部",
    manager: "田中 部長",
    members: [
      { id: 10, name: "山田 次郎", position: "主任", score: 9.4, hours: 38, courses: 10, progress: 82, lastActivity: "1時間前" },
      { id: 11, name: "佐々木 美穂", position: "一般", score: 8.6, hours: 32, courses: 8, progress: 71, lastActivity: "3時間前" },
      { id: 12, name: "渡辺 翔太", position: "一般", score: 8.1, hours: 29, courses: 6, progress: 59, lastActivity: "6時間前" }
    ]
  }
};

export default function AdminTeamDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('teamId');
  const [team, setTeam] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    if (teamId && teamData[teamId]) {
      setTeam(teamData[teamId]);
    }
  }, [teamId]);

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">チームが見つかりません</h2>
          <button 
            onClick={() => navigate("/admin")}
            className="text-blue-600 hover:text-blue-700"
          >
            ← ダッシュボードに戻る
          </button>
        </div>
      </div>
    );
  }

  const teamAverage = {
    score: (team.members.reduce((sum, m) => sum + m.score, 0) / team.members.length).toFixed(1),
    hours: Math.round(team.members.reduce((sum, m) => sum + m.hours, 0) / team.members.length),
    courses: Math.round(team.members.reduce((sum, m) => sum + m.courses, 0) / team.members.length),
    progress: Math.round(team.members.reduce((sum, m) => sum + m.progress, 0) / team.members.length)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/admin")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← ダッシュボード
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{team.name} チーム詳細</h1>
                <p className="text-sm text-gray-600">管理者: {team.manager}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              メンバー数: {team.members.length}名
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Team Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp size={20} className="text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">平均スコア</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{teamAverage.score}</p>
            <p className="text-sm text-gray-600">10点満点中</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <Clock size={20} className="text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">平均学習時間</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{teamAverage.hours}h</p>
            <p className="text-sm text-gray-600">今月</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <BookOpen size={20} className="text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900">平均コース数</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{teamAverage.courses}</p>
            <p className="text-sm text-gray-600">完了済み</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Award size={20} className="text-orange-600" />
              </div>
              <h3 className="font-medium text-gray-900">平均進捗率</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{teamAverage.progress}%</p>
            <p className="text-sm text-gray-600">現在の進捗</p>
          </div>
        </div>

        {/* Member List */}
        <div className="bg-white rounded-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">メンバー一覧</h3>
          </div>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[800px] sm:min-w-0">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名前</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">役職</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">スコア</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学習時間</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">完了コース</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">進捗</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最終活動</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">詳細</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {team.members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <User size={16} className="text-gray-600" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        member.score >= 9 ? 'bg-green-100 text-green-800' :
                        member.score >= 8 ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {member.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.hours}h</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.courses}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              member.progress >= 80 ? 'bg-green-600' :
                              member.progress >= 60 ? 'bg-blue-600' :
                              'bg-yellow-600'
                            }`}
                            style={{ width: `${member.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{member.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.lastActivity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/admin/employee?employeeId=${member.id}&teamId=${teamId}`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        詳細表示
                      </Link>
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ⓘ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Items Section */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">要注意メンバー</h3>
            </div>
            <div className="p-6">
              {team.members.filter(m => m.progress < 60 || m.score < 8).map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg mb-3 last:mb-0">
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">
                      {member.progress < 60 && `進捗率低下 (${member.progress}%)`}
                      {member.progress < 60 && member.score < 8 && " • "}
                      {member.score < 8 && `スコア改善必要 (${member.score})`}
                    </p>
                  </div>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    要サポート
                  </span>
                </div>
              ))}
              {team.members.filter(m => m.progress >= 60 && m.score >= 8).length === team.members.length && (
                <div className="text-center py-4 text-gray-500">
                  <Award size={24} className="mx-auto mb-2 text-green-500" />
                  <p>全メンバーが良好なパフォーマンスです</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">推奨アクション</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">定期1on1面談の実施</p>
                    <p className="text-xs text-gray-600">進捗の遅いメンバーとの個別面談をスケジュール</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen size={16} className="text-green-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">追加学習コンテンツの提供</p>
                    <p className="text-xs text-gray-600">基礎スキル向上のための補助教材を案内</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award size={16} className="text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">優秀者による指導体制</p>
                    <p className="text-xs text-gray-600">高スコアメンバーをメンターとして活用</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{selectedMember.name} 詳細</h3>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">役職:</span>
                  <span className="font-medium">{selectedMember.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">現在のスコア:</span>
                  <span className="font-medium">{selectedMember.score}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">学習時間:</span>
                  <span className="font-medium">{selectedMember.hours}時間</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">完了コース:</span>
                  <span className="font-medium">{selectedMember.courses}コース</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">進捗率:</span>
                  <span className="font-medium">{selectedMember.progress}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">最終活動:</span>
                  <span className="font-medium">{selectedMember.lastActivity}</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 mb-3">推奨アクション</h4>
                <div className="space-y-2 text-sm">
                  {selectedMember.score < 8 && (
                    <div className="flex items-center gap-2 text-amber-700">
                      <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                      スキル向上のための追加トレーニングが推奨されます
                    </div>
                  )}
                  {selectedMember.progress < 60 && (
                    <div className="flex items-center gap-2 text-red-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      学習進捗について個別面談が必要です
                    </div>
                  )}
                  {selectedMember.score >= 9 && selectedMember.progress >= 80 && (
                    <div className="flex items-center gap-2 text-green-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      優秀なパフォーマンス。メンター候補として検討
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}