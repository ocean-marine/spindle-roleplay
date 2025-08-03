import { useState } from "react";
import logo from "../assets/openai-logomark.svg";

export default function AuthScreen({ onAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 認証情報（将来の拡張を考慮した配列形式）
  const USERS = [
    { username: "admin", password: "password123" },
    { username: "user", password: "user123" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // 簡単な遅延を追加してローディング状態を表示
    await new Promise(resolve => setTimeout(resolve, 500));

    // 認証チェック
    const user = USERS.find(u => u.username === username && u.password === password);
    
    if (user) {
      // セッションストレージに認証状態を保存
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("currentUser", username);
      onAuthenticated(user);
    } else {
      setError("アカウント名またはパスワードが正しくありません");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{overflow: 'auto'}}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img className="h-12 w-auto" src={logo} alt="OpenAI Logo" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Realtime Console
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          アカウント認証が必要です
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                アカウント名
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="アカウント名を入力"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="パスワードを入力"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "認証中..." : "ログイン"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">テスト用アカウント</span>
              </div>
            </div>
            <div className="mt-3 text-center text-xs text-gray-500 space-y-1">
              <div>admin / password123</div>
              <div>user / user123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}