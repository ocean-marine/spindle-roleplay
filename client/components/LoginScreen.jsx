import { useState } from "react";
import logo from "../assets/openai-logomark.svg";

export default function LoginScreen({ onLogin }) {
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 固定認証情報（将来的にはAPIから取得可能な構造）
  const ACCOUNTS = [
    { name: "admin", password: "admin123" },
    { name: "user", password: "user123" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // 認証チェック
    const account = ACCOUNTS.find(acc => 
      acc.name === accountName && acc.password === password
    );

    if (account) {
      // 認証成功 - 簡易暗号化してlocalStorageに保存
      const authData = {
        accountName: account.name,
        timestamp: Date.now()
      };
      localStorage.setItem('auth_session', btoa(JSON.stringify(authData)));
      onLogin(account.name);
    } else {
      setError("アカウント名またはパスワードが正しくありません");
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <img 
              src={logo} 
              alt="OpenAI Logo" 
              className="w-12 h-12 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900">Realtime Console</h1>
            <p className="text-gray-600 mt-2">認証が必要です</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-2">
                アカウント名
              </label>
              <input
                id="accountName"
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="アカウント名を入力"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="パスワードを入力"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              ログイン
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}