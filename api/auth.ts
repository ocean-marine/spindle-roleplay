// 認証API - Vercel Functions
import crypto from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface AuthRequest {
  accountName?: string;
  password?: string;
  action?: 'login' | 'verify' | 'logout';
}

interface TokenData {
  accountName: string;
  timestamp: number;
  expires: number;
}

// 環境変数から認証情報を取得（セキュア）
const ACCOUNTS = [
  { 
    name: process.env.AUTH_ADMIN_USER || "admin", 
    password: process.env.AUTH_ADMIN_PASS || "admin123" 
  },
  { 
    name: process.env.AUTH_USER_USER || "user1", 
    password: process.env.AUTH_USER_PASS || "dummy" 
  },  
  { 
    name: process.env.AUTH_USER1_USER || "user1", 
    password: process.env.AUTH_USER1_PASS || "dummy" 
  },
  { 
    name: process.env.AUTH_USER2_USER || "user2", 
    password: process.env.AUTH_USER2_PASS || "dummy" 
  },
  { 
    name: process.env.AUTH_USER3_USER || "user3", 
    password: process.env.AUTH_USER3_PASS || "dummy" 
  },
  { 
    name: process.env.AUTH_USER4_USER || "user4", 
    password: process.env.AUTH_USER4_PASS || "dummy" 
  }
];

// トークン秘密鍵
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'your-secret-key-here';

// セッション有効期限（24時間）
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // milliseconds

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORSヘッダー設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { accountName, password, action } = req.body as AuthRequest;

  try {
    switch (action) {
      case 'login':
        return handleLogin(req, res, accountName, password);
      
      case 'verify':
        return handleVerify(req, res);
      
      case 'logout':
        return handleLogout(req, res);
      
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function handleLogin(_req: VercelRequest, res: VercelResponse, accountName?: string, password?: string) {
  if (!accountName || !password) {
    return res.status(400).json({ error: 'アカウント名とパスワードが必要です' });
  }

  // 認証チェック
  const account = ACCOUNTS.find(acc => 
    acc.name === accountName && acc.password === password
  );

  if (!account) {
    return res.status(401).json({ error: 'アカウント名またはパスワードが正しくありません' });
  }

  // セキュアトークン生成
  const tokenData = {
    accountName: account.name,
    timestamp: Date.now(),
    expires: Date.now() + SESSION_TIMEOUT
  };
  
  const token = generateSecureToken(tokenData);

  return res.status(200).json({
    success: true,
    token,
    accountName: account.name,
    expiresIn: SESSION_TIMEOUT
  });
}

function handleVerify(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'トークンが必要です' });
  }

  const token = authHeader.substring(7);

  try {
    const tokenData = verifySecureToken(token);
    if (!tokenData || tokenData.expires < Date.now()) {
      return res.status(401).json({ error: 'トークンが期限切れです' });
    }
    
    return res.status(200).json({
      success: true,
      accountName: tokenData.accountName
    });
  } catch (error) {
    return res.status(401).json({ error: 'トークンが無効です' });
  }
}

function handleLogout(_req: VercelRequest, res: VercelResponse) {
  // ステートレスなので、クライアント側でトークンを削除するだけ
  return res.status(200).json({ success: true });
}

// セキュアトークン生成関数
function generateSecureToken(data: TokenData): string {
  const payload = JSON.stringify(data);
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(payload)
    .digest('hex');
  
  return Buffer.from(payload + '.' + signature).toString('base64');
}

// セキュアトークン検証関数
function verifySecureToken(token: string): TokenData {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [payload, signature] = decoded.split('.');
    
    // 署名検証
    const expectedSignature = crypto
      .createHmac('sha256', TOKEN_SECRET)
      .update(payload)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }
    
    return JSON.parse(payload);
  } catch (error) {
    throw new Error('Invalid token');
  }
}
