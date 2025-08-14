// 認証ユーティリティ関数
import type { LoginResult, AuthStatus } from "../types";

const API_BASE_URL = '/api';

/**
 * ログイン処理
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

    const data: any = await response.json();

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
  } catch (error: any) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'ネットワークエラーが発生しました'
    };
  }
}

/**
 * 現在の認証状態をチェック
 */
export async function checkAuthStatus(): Promise<AuthStatus | null> {
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

    const data: any = await response.json();

    if (response.ok && data.success) {
      return {
        isAuthenticated: true,
        accountName: data.accountName
      };
    } else {
      // トークンが無効な場合は削除
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_account');
      return null;
    }
  } catch (error: any) {
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
  } catch (error: any) {
    console.warn('Logout request failed:', error);
  } finally {
    // ローカルストレージをクリア
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_account');
  }
}