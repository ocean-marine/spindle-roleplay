// 認証ユーティリティ関数

// セッション有効期限（24時間）
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

/**
 * 現在の認証状態をチェック
 * @returns {Object|null} 認証されている場合はユーザー情報、そうでなければnull
 */
export function checkAuthStatus() {
  try {
    const authSession = localStorage.getItem('auth_session');
    if (!authSession) return null;

    const authData = JSON.parse(atob(authSession));
    
    // セッション有効期限チェック
    if (Date.now() - authData.timestamp > SESSION_TIMEOUT) {
      // 期限切れの場合は削除
      localStorage.removeItem('auth_session');
      return null;
    }

    return {
      accountName: authData.accountName,
      timestamp: authData.timestamp
    };
  } catch (error) {
    // 破損したデータの場合は削除
    localStorage.removeItem('auth_session');
    return null;
  }
}

/**
 * ログアウト処理
 */
export function logout() {
  localStorage.removeItem('auth_session');
}

/**
 * セッションを延長
 */
export function refreshSession() {
  const currentAuth = checkAuthStatus();
  if (currentAuth) {
    const authData = {
      accountName: currentAuth.accountName,
      timestamp: Date.now()
    };
    localStorage.setItem('auth_session', btoa(JSON.stringify(authData)));
  }
}