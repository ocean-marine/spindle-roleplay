// 認証管理ユーティリティ

// 認証状態をチェック
export function isAuthenticated() {
  return sessionStorage.getItem("isAuthenticated") === "true";
}

// 現在のユーザー情報を取得
export function getCurrentUser() {
  return sessionStorage.getItem("currentUser");
}

// ログアウト処理
export function logout() {
  sessionStorage.removeItem("isAuthenticated");
  sessionStorage.removeItem("currentUser");
}

// セッション有効性チェック（オプション: 将来的にタイムアウト機能を追加する場合）
export function validateSession() {
  return isAuthenticated();
}