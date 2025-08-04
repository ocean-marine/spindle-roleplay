// 認証ユーティリティ関数

const API_BASE_URL = '/api';

/**
 * ログイン処理
 * @param {string} accountName アカウント名
 * @param {string} password パスワード
 * @returns {Promise<Object>} ログイン結果
 */
export async function login(accountName, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'login',
        accountName,
        password
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // トークンをlocalStorageに保存
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_account', data.accountName);
      
      return {
        success: true,
        accountName: data.accountName
      };
    } else {
      return {
        success: false,
        error: data.error || 'ログインに失敗しました'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'ネットワークエラーが発生しました'
    };
  }
}

/**
 * 現在の認証状態をチェック
 * @returns {Promise<Object|null>} 認証されている場合はユーザー情報、そうでなければnull
 */
export async function checkAuthStatus() {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        action: 'verify'
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        accountName: data.accountName
      };
    } else {
      // トークンが無効な場合は削除
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_account');
      return null;
    }
  } catch (error) {
    // エラーの場合は認証情報を削除
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_account');
    return null;
  }
}

/**
 * ログアウト処理
 */
export async function logout() {
  try {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // サーバーにログアウト通知（オプション）
      await fetch(`${API_BASE_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'logout'
        })
      });
    }
  } catch (error) {
    console.warn('Logout request failed:', error);
  } finally {
    // ローカルストレージをクリア
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_account');
  }
}