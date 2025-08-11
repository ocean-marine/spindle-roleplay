// 認証ユーティリティ関数

const API_BASE_URL = '/api';

interface LoginResponse {
  success: boolean;
  token?: string;
  accountName?: string;
  error?: string;
}

interface AuthUser {
  accountName: string;
}

interface LoginResult {
  success: boolean;
  accountName?: string;
  error?: string;
}

/**
 * ログイン処理
 * @param accountName アカウント名
 * @param password パスワード
 * @returns ログイン結果
 */
export async function login(accountName: string, password: string): Promise<LoginResult> {
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

    const data: LoginResponse = await response.json();

    if (response.ok && data.success) {
      // トークンをlocalStorageに保存
      localStorage.setItem('auth_token', data.token!);
      localStorage.setItem('auth_account', data.accountName!);
      
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
 * @returns 認証されている場合はユーザー情報、そうでなければnull
 */
export async function checkAuthStatus(): Promise<AuthUser | null> {
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

    const data: LoginResponse = await response.json();

    if (response.ok && data.success) {
      return {
        accountName: data.accountName!
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
export async function logout(): Promise<void> {
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