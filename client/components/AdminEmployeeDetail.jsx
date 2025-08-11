import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { User, Clock, BookOpen, TrendingUp, Award, Calendar, BarChart, ArrowLeft } from "react-feather";
import { getTopLevelPresets } from "../data/presets";

// コース名からコースIDへのマッピング（従業員データとプリセットデータの紐付け）
const courseNameToId = {
  // 実際のプリセットコース
  "不動産営業の資産背景ヒアリング": "real_estate_asset_hearing",
  "カスタマーサポートのクレーム対応強化": "customer_support_complaint_training", 
  "ウォーターサーバーの商品説明ロールプレイ": "water_server_sales_training",
  // 他のコース名（将来追加予定のコース）
  "顧客対応スキル向上": null,
  "プレゼンテーション技法": null,
  "営業基礎": null,
  "リーダーシップ入門": null,
  "チームマネジメント": null,
  "データ分析入門": null,
  "デジタル変革基礎": null,
  "上級データ分析": null,
  "上級マーケティング戦略": null,
  "マーケティング戦略": null,
  "人事基礎": null,
  "労務管理": null,
  "総務基礎": null,
  "事務効率化": null,
  "コンプライアンス": null
};

// コース名からコースIDを取得する関数
const getCourseIdFromName = (courseName) => {
  return courseNameToId[courseName] || null;
};

// Mock employee data - comprehensive data for all team members
const employeeData = {
  // 営業部
  1: { id: 1, name: "佐藤 花子", department: "営業部", position: "主任", score: 9.6, hours: 42, courses: 11, progress: 85, lastActivity: "2時間前", email: "sato.hanako@company.com", joinDate: "2021-04-01", completedCourses: ["顧客対応スキル向上", "プレゼンテーション技法", "営業基礎", "リーダーシップ入門"], currentCourses: ["チームマネジメント", "データ分析入門"], monthlyProgress: [65, 72, 78, 85], recentActivities: [
    { date: "2024-01-15", activity: "プレゼンテーション技法", type: "完了", score: 9.2 },
    { date: "2024-01-10", activity: "チームマネジメント", type: "進行中", progress: 60 },
    { date: "2024-01-08", activity: "データ分析入門", type: "開始", progress: 15 }
  ]},
  2: { id: 2, name: "田中 一郎", department: "営業部", position: "係長", score: 8.9, hours: 38, courses: 9, progress: 72, lastActivity: "1日前", email: "tanaka.ichiro@company.com", joinDate: "2020-08-15", completedCourses: ["顧客対応スキル向上", "営業基礎", "リーダーシップ入門"], currentCourses: ["プレゼンテーション技法", "チームマネジメント"], monthlyProgress: [58, 65, 68, 72], recentActivities: [
    { date: "2024-01-14", activity: "リーダーシップ入門", type: "完了", score: 8.7 },
    { date: "2024-01-12", activity: "プレゼンテーション技法", type: "進行中", progress: 45 }
  ]},
  3: { id: 3, name: "鈴木 美咲", department: "営業部", position: "主任", score: 8.7, hours: 35, courses: 8, progress: 68, lastActivity: "3時間前", email: "suzuki.misaki@company.com", joinDate: "2021-09-01", completedCourses: ["営業基礎", "顧客対応スキル向上", "プレゼンテーション技法"], currentCourses: ["リーダーシップ入門", "チームマネジメント"], monthlyProgress: [52, 60, 64, 68], recentActivities: [
    { date: "2024-01-14", activity: "プレゼンテーション技法", type: "完了", score: 8.9 },
    { date: "2024-01-11", activity: "リーダーシップ入門", type: "進行中", progress: 70 }
  ]},
  4: { id: 4, name: "高橋 健太", department: "営業部", position: "一般", score: 8.2, hours: 28, courses: 6, progress: 58, lastActivity: "5時間前", email: "takahashi.kenta@company.com", joinDate: "2022-04-01", completedCourses: ["営業基礎", "顧客対応スキル向上"], currentCourses: ["プレゼンテーション技法"], monthlyProgress: [35, 45, 52, 58], recentActivities: [
    { date: "2024-01-13", activity: "顧客対応スキル向上", type: "完了", score: 8.4 },
    { date: "2024-01-10", activity: "プレゼンテーション技法", type: "進行中", progress: 30 }
  ]},
  5: { id: 5, name: "伊藤 恵", department: "営業部", position: "一般", score: 7.9, hours: 25, courses: 5, progress: 45, lastActivity: "1日前", email: "itou.megumi@company.com", joinDate: "2022-10-01", completedCourses: ["営業基礎"], currentCourses: ["顧客対応スキル向上"], monthlyProgress: [25, 32, 38, 45], recentActivities: [
    { date: "2024-01-12", activity: "営業基礎", type: "完了", score: 7.8 },
    { date: "2024-01-08", activity: "顧客対応スキル向上", type: "進行中", progress: 25 }
  ]},
  13: { id: 13, name: "小林 修", department: "営業部", position: "主任", score: 9.1, hours: 40, courses: 10, progress: 78, lastActivity: "4時間前", email: "kobayashi.osamu@company.com", joinDate: "2020-12-01", completedCourses: ["営業基礎", "顧客対応スキル向上", "プレゼンテーション技法", "リーダーシップ入門"], currentCourses: ["チームマネジメント", "データ分析入門"], monthlyProgress: [68, 72, 75, 78], recentActivities: [
    { date: "2024-01-15", activity: "リーダーシップ入門", type: "完了", score: 9.3 },
    { date: "2024-01-12", activity: "チームマネジメント", type: "進行中", progress: 55 }
  ]},
  14: { id: 14, name: "森田 里美", department: "営業部", position: "一般", score: 8.5, hours: 31, courses: 7, progress: 65, lastActivity: "6時間前", email: "morita.satomi@company.com", joinDate: "2021-07-01", completedCourses: ["営業基礎", "顧客対応スキル向上", "プレゼンテーション技法"], currentCourses: ["リーダーシップ入門"], monthlyProgress: [48, 55, 60, 65], recentActivities: [
    { date: "2024-01-13", activity: "プレゼンテーション技法", type: "完了", score: 8.6 },
    { date: "2024-01-09", activity: "リーダーシップ入門", type: "進行中", progress: 40 }
  ]},
  15: { id: 15, name: "加藤 雅人", department: "営業部", position: "一般", score: 8.0, hours: 26, courses: 5, progress: 52, lastActivity: "8時間前", email: "katou.masato@company.com", joinDate: "2022-05-15", completedCourses: ["営業基礎", "顧客対応スキル向上"], currentCourses: ["プレゼンテーション技法"], monthlyProgress: [30, 38, 45, 52], recentActivities: [
    { date: "2024-01-11", activity: "顧客対応スキル向上", type: "完了", score: 8.1 },
    { date: "2024-01-07", activity: "プレゼンテーション技法", type: "進行中", progress: 20 }
  ]},
  16: { id: 16, name: "藤田 由美", department: "営業部", position: "一般", score: 7.8, hours: 23, courses: 4, progress: 48, lastActivity: "1日前", email: "fujita.yumi@company.com", joinDate: "2023-01-10", completedCourses: ["営業基礎"], currentCourses: ["顧客対応スキル向上"], monthlyProgress: [20, 28, 35, 48], recentActivities: [
    { date: "2024-01-10", activity: "営業基礎", type: "完了", score: 7.9 },
    { date: "2024-01-06", activity: "顧客対応スキル向上", type: "進行中", progress: 30 }
  ]},
  17: { id: 17, name: "井上 拓也", department: "営業部", position: "一般", score: 8.3, hours: 29, courses: 6, progress: 62, lastActivity: "3時間前", email: "inoue.takuya@company.com", joinDate: "2022-03-01", completedCourses: ["営業基礎", "顧客対応スキル向上"], currentCourses: ["プレゼンテーション技法"], monthlyProgress: [40, 48, 55, 62], recentActivities: [
    { date: "2024-01-14", activity: "顧客対応スキル向上", type: "完了", score: 8.4 },
    { date: "2024-01-11", activity: "プレゼンテーション技法", type: "進行中", progress: 35 }
  ]},
  18: { id: 18, name: "石川 麻衣", department: "営業部", position: "係長", score: 9.0, hours: 36, courses: 9, progress: 74, lastActivity: "2時間前", email: "ishikawa.mai@company.com", joinDate: "2020-06-01", completedCourses: ["営業基礎", "顧客対応スキル向上", "プレゼンテーション技法", "リーダーシップ入門"], currentCourses: ["チームマネジメント"], monthlyProgress: [62, 67, 71, 74], recentActivities: [
    { date: "2024-01-15", activity: "リーダーシップ入門", type: "完了", score: 9.1 },
    { date: "2024-01-12", activity: "チームマネジメント", type: "進行中", progress: 50 }
  ]},
  19: { id: 19, name: "村上 健二", department: "営業部", position: "一般", score: 7.6, hours: 22, courses: 4, progress: 41, lastActivity: "12時間前", email: "murakami.kenji@company.com", joinDate: "2023-04-01", completedCourses: ["営業基礎"], currentCourses: ["顧客対応スキル向上"], monthlyProgress: [15, 25, 33, 41], recentActivities: [
    { date: "2024-01-09", activity: "営業基礎", type: "完了", score: 7.7 },
    { date: "2024-01-05", activity: "顧客対応スキル向上", type: "進行中", progress: 20 }
  ]},
  20: { id: 20, name: "岡田 純子", department: "営業部", position: "一般", score: 8.4, hours: 30, courses: 7, progress: 63, lastActivity: "5時間前", email: "okada.junko@company.com", joinDate: "2021-11-01", completedCourses: ["営業基礎", "顧客対応スキル向上", "プレゼンテーション技法"], currentCourses: ["リーダーシップ入門"], monthlyProgress: [45, 52, 58, 63], recentActivities: [
    { date: "2024-01-13", activity: "プレゼンテーション技法", type: "完了", score: 8.5 },
    { date: "2024-01-10", activity: "リーダーシップ入門", type: "進行中", progress: 45 }
  ]},
  21: { id: 21, name: "木村 博", department: "営業部", position: "主任", score: 8.8, hours: 34, courses: 8, progress: 70, lastActivity: "1時間前", email: "kimura.hiroshi@company.com", joinDate: "2020-10-01", completedCourses: ["営業基礎", "顧客対応スキル向上", "プレゼンテーション技法", "リーダーシップ入門"], currentCourses: ["チームマネジメント"], monthlyProgress: [58, 63, 67, 70], recentActivities: [
    { date: "2024-01-14", activity: "リーダーシップ入門", type: "完了", score: 8.9 },
    { date: "2024-01-11", activity: "チームマネジメント", type: "進行中", progress: 40 }
  ]},
  22: { id: 22, name: "橋本 美香", department: "営業部", position: "一般", score: 8.1, hours: 27, courses: 6, progress: 56, lastActivity: "7時間前", email: "hashimoto.mika@company.com", joinDate: "2022-08-01", completedCourses: ["営業基礎", "顧客対応スキル向上"], currentCourses: ["プレゼンテーション技法"], monthlyProgress: [32, 42, 49, 56], recentActivities: [
    { date: "2024-01-12", activity: "顧客対応スキル向上", type: "完了", score: 8.2 },
    { date: "2024-01-08", activity: "プレゼンテーション技法", type: "進行中", progress: 30 }
  ]},
  
  // 開発部
  6: { id: 6, name: "田中 太郎", department: "開発部", position: "リーダー", score: 9.8, hours: 45, courses: 12, progress: 95, lastActivity: "30分前", email: "tanaka.taro@company.com", joinDate: "2019-04-01", completedCourses: ["データ分析入門", "リーダーシップ基礎", "チームマネジメント", "デジタル変革基礎"], currentCourses: ["上級データ分析"], monthlyProgress: [88, 91, 93, 95], recentActivities: [
    { date: "2024-01-15", activity: "チームマネジメント", type: "完了", score: 9.8 },
    { date: "2024-01-13", activity: "上級データ分析", type: "進行中", progress: 80 }
  ]},
  7: { id: 7, name: "山田 さくら", department: "開発部", position: "シニア", score: 9.2, hours: 41, courses: 10, progress: 88, lastActivity: "1時間前", email: "yamada.sakura@company.com", joinDate: "2019-08-01", completedCourses: ["データ分析入門", "デジタル変革基礎", "リーダーシップ基礎"], currentCourses: ["チームマネジメント"], monthlyProgress: [78, 82, 85, 88], recentActivities: [
    { date: "2024-01-14", activity: "リーダーシップ基礎", type: "完了", score: 9.3 },
    { date: "2024-01-12", activity: "チームマネジメント", type: "進行中", progress: 65 }
  ]},
  8: { id: 8, name: "松本 大輔", department: "開発部", position: "シニア", score: 8.8, hours: 37, courses: 9, progress: 76, lastActivity: "2時間前", email: "matsumoto.daisuke@company.com", joinDate: "2020-02-01", completedCourses: ["データ分析入門", "デジタル変革基礎"], currentCourses: ["リーダーシップ基礎"], monthlyProgress: [65, 69, 73, 76], recentActivities: [
    { date: "2024-01-13", activity: "デジタル変革基礎", type: "完了", score: 8.9 },
    { date: "2024-01-10", activity: "リーダーシップ基礎", type: "進行中", progress: 40 }
  ]},
  9: { id: 9, name: "中村 あやか", department: "開発部", position: "一般", score: 8.4, hours: 33, courses: 7, progress: 64, lastActivity: "4時間前", email: "nakamura.ayaka@company.com", joinDate: "2021-03-01", completedCourses: ["データ分析入門"], currentCourses: ["デジタル変革基礎"], monthlyProgress: [45, 52, 58, 64], recentActivities: [
    { date: "2024-01-11", activity: "データ分析入門", type: "完了", score: 8.5 },
    { date: "2024-01-08", activity: "デジタル変革基礎", type: "進行中", progress: 35 }
  ]},
  23: { id: 23, name: "長谷川 勇", department: "開発部", position: "シニア", score: 9.5, hours: 43, courses: 11, progress: 91, lastActivity: "1時間前", email: "hasegawa.isamu@company.com", joinDate: "2019-06-01", completedCourses: ["データ分析入門", "デジタル変革基礎", "リーダーシップ基礎", "チームマネジメント"], currentCourses: ["上級データ分析"], monthlyProgress: [82, 86, 89, 91], recentActivities: [
    { date: "2024-01-15", activity: "チームマネジメント", type: "完了", score: 9.6 },
    { date: "2024-01-13", activity: "上級データ分析", type: "進行中", progress: 70 }
  ]},
  24: { id: 24, name: "斎藤 真理", department: "開発部", position: "一般", score: 8.9, hours: 35, courses: 8, progress: 73, lastActivity: "3時間前", email: "saito.mari@company.com", joinDate: "2020-09-01", completedCourses: ["データ分析入門", "デジタル変革基礎"], currentCourses: ["リーダーシップ基礎"], monthlyProgress: [58, 64, 68, 73], recentActivities: [
    { date: "2024-01-14", activity: "デジタル変革基礎", type: "完了", score: 9.0 },
    { date: "2024-01-11", activity: "リーダーシップ基礎", type: "進行中", progress: 50 }
  ]},
  25: { id: 25, name: "青木 慎一", department: "開発部", position: "一般", score: 8.6, hours: 32, courses: 7, progress: 68, lastActivity: "2時間前", email: "aoki.shinichi@company.com", joinDate: "2021-01-15", completedCourses: ["データ分析入門"], currentCourses: ["デジタル変革基礎"], monthlyProgress: [48, 55, 62, 68], recentActivities: [
    { date: "2024-01-12", activity: "データ分析入門", type: "完了", score: 8.7 },
    { date: "2024-01-09", activity: "デジタル変革基礎", type: "進行中", progress: 45 }
  ]},
  26: { id: 26, name: "山口 恵子", department: "開発部", position: "一般", score: 8.2, hours: 29, courses: 6, progress: 61, lastActivity: "5時間前", email: "yamaguchi.keiko@company.com", joinDate: "2021-07-01", completedCourses: ["データ分析入門"], currentCourses: ["デジタル変革基礎"], monthlyProgress: [40, 47, 54, 61], recentActivities: [
    { date: "2024-01-10", activity: "データ分析入門", type: "完了", score: 8.3 },
    { date: "2024-01-07", activity: "デジタル変革基礎", type: "進行中", progress: 30 }
  ]},
  27: { id: 27, name: "清水 隆", department: "開発部", position: "シニア", score: 9.3, hours: 42, courses: 10, progress: 86, lastActivity: "45分前", email: "shimizu.takashi@company.com", joinDate: "2019-11-01", completedCourses: ["データ分析入門", "デジタル変革基礎", "リーダーシップ基礎"], currentCourses: ["チームマネジメント"], monthlyProgress: [75, 79, 83, 86], recentActivities: [
    { date: "2024-01-15", activity: "リーダーシップ基礎", type: "完了", score: 9.4 },
    { date: "2024-01-12", activity: "チームマネジメント", type: "進行中", progress: 60 }
  ]},
  28: { id: 28, name: "吉田 美奈", department: "開発部", position: "一般", score: 8.7, hours: 34, courses: 8, progress: 71, lastActivity: "4時間前", email: "yoshida.mina@company.com", joinDate: "2020-12-01", completedCourses: ["データ分析入門", "デジタル変革基礎"], currentCourses: ["リーダーシップ基礎"], monthlyProgress: [55, 61, 66, 71], recentActivities: [
    { date: "2024-01-13", activity: "デジタル変革基礎", type: "完了", score: 8.8 },
    { date: "2024-01-10", activity: "リーダーシップ基礎", type: "進行中", progress: 40 }
  ]},
  29: { id: 29, name: "大野 洋一", department: "開発部", position: "一般", score: 8.0, hours: 26, courses: 5, progress: 54, lastActivity: "6時間前", email: "oono.youichi@company.com", joinDate: "2022-02-01", completedCourses: ["データ分析入門"], currentCourses: ["デジタル変革基礎"], monthlyProgress: [30, 38, 46, 54], recentActivities: [
    { date: "2024-01-11", activity: "データ分析入門", type: "完了", score: 8.1 },
    { date: "2024-01-07", activity: "デジタル変革基礎", type: "進行中", progress: 25 }
  ]},
  30: { id: 30, name: "福田 香織", department: "開発部", position: "リーダー", score: 9.6, hours: 44, courses: 11, progress: 92, lastActivity: "2時間前", email: "fukuda.kaori@company.com", joinDate: "2018-10-01", completedCourses: ["データ分析入門", "デジタル変革基礎", "リーダーシップ基礎", "チームマネジメント"], currentCourses: ["上級データ分析"], monthlyProgress: [85, 88, 90, 92], recentActivities: [
    { date: "2024-01-15", activity: "チームマネジメント", type: "完了", score: 9.7 },
    { date: "2024-01-13", activity: "上級データ分析", type: "進行中", progress: 75 }
  ]},

  // マーケティング部
  10: { id: 10, name: "山田 次郎", department: "マーケティング部", position: "主任", score: 9.4, hours: 38, courses: 10, progress: 82, lastActivity: "1時間前", email: "yamada.jiro@company.com", joinDate: "2020-06-01", completedCourses: ["デジタル変革基礎", "データ分析入門", "プレゼンテーション技法"], currentCourses: ["上級マーケティング戦略"], monthlyProgress: [75, 78, 80, 82], recentActivities: [
    { date: "2024-01-15", activity: "プレゼンテーション技法", type: "完了", score: 9.1 },
    { date: "2024-01-14", activity: "上級マーケティング戦略", type: "進行中", progress: 35 }
  ]},
  11: { id: 11, name: "佐々木 美穂", department: "マーケティング部", position: "一般", score: 8.6, hours: 32, courses: 8, progress: 71, lastActivity: "3時間前", email: "sasaki.miho@company.com", joinDate: "2021-05-01", completedCourses: ["デジタル変革基礎", "データ分析入門"], currentCourses: ["プレゼンテーション技法"], monthlyProgress: [55, 62, 67, 71], recentActivities: [
    { date: "2024-01-13", activity: "データ分析入門", type: "完了", score: 8.7 },
    { date: "2024-01-10", activity: "プレゼンテーション技法", type: "進行中", progress: 50 }
  ]},
  12: { id: 12, name: "渡辺 翔太", department: "マーケティング部", position: "一般", score: 8.1, hours: 29, courses: 6, progress: 59, lastActivity: "6時間前", email: "watanabe.shouta@company.com", joinDate: "2021-12-01", completedCourses: ["デジタル変革基礎"], currentCourses: ["データ分析入門"], monthlyProgress: [38, 45, 52, 59], recentActivities: [
    { date: "2024-01-12", activity: "デジタル変革基礎", type: "完了", score: 8.2 },
    { date: "2024-01-08", activity: "データ分析入門", type: "進行中", progress: 30 }
  ]},
  31: { id: 31, name: "三浦 康子", department: "マーケティング部", position: "主任", score: 9.0, hours: 36, courses: 9, progress: 76, lastActivity: "2時間前", email: "miura.yasuko@company.com", joinDate: "2020-08-01", completedCourses: ["デジタル変革基礎", "データ分析入門", "プレゼンテーション技法"], currentCourses: ["マーケティング戦略"], monthlyProgress: [65, 69, 73, 76], recentActivities: [
    { date: "2024-01-14", activity: "プレゼンテーション技法", type: "完了", score: 9.1 },
    { date: "2024-01-11", activity: "マーケティング戦略", type: "進行中", progress: 45 }
  ]},
  32: { id: 32, name: "野村 直人", department: "マーケティング部", position: "一般", score: 8.4, hours: 30, courses: 7, progress: 65, lastActivity: "4時間前", email: "nomura.naoto@company.com", joinDate: "2021-03-15", completedCourses: ["デジタル変革基礎", "データ分析入門"], currentCourses: ["プレゼンテーション技法"], monthlyProgress: [48, 55, 60, 65], recentActivities: [
    { date: "2024-01-13", activity: "データ分析入門", type: "完了", score: 8.5 },
    { date: "2024-01-09", activity: "プレゼンテーション技法", type: "進行中", progress: 40 }
  ]},
  33: { id: 33, name: "原田 理恵", department: "マーケティング部", position: "一般", score: 8.8, hours: 35, courses: 8, progress: 72, lastActivity: "1時間前", email: "harada.rie@company.com", joinDate: "2020-11-01", completedCourses: ["デジタル変革基礎", "データ分析入門", "プレゼンテーション技法"], currentCourses: ["マーケティング戦略"], monthlyProgress: [58, 63, 68, 72], recentActivities: [
    { date: "2024-01-15", activity: "プレゼンテーション技法", type: "完了", score: 8.9 },
    { date: "2024-01-12", activity: "マーケティング戦略", type: "進行中", progress: 35 }
  ]},
  34: { id: 34, name: "平田 雅之", department: "マーケティング部", position: "係長", score: 8.9, hours: 37, courses: 9, progress: 75, lastActivity: "3時間前", email: "hirata.masayuki@company.com", joinDate: "2019-12-01", completedCourses: ["デジタル変革基礎", "データ分析入門", "プレゼンテーション技法", "リーダーシップ入門"], currentCourses: ["チームマネジメント"], monthlyProgress: [68, 71, 73, 75], recentActivities: [
    { date: "2024-01-14", activity: "リーダーシップ入門", type: "完了", score: 9.0 },
    { date: "2024-01-11", activity: "チームマネジメント", type: "進行中", progress: 50 }
  ]},
  35: { id: 35, name: "竹内 友子", department: "マーケティング部", position: "一般", score: 8.2, hours: 28, courses: 6, progress: 58, lastActivity: "5時間前", email: "takeuchi.tomoko@company.com", joinDate: "2022-01-15", completedCourses: ["デジタル変革基礎"], currentCourses: ["データ分析入門"], monthlyProgress: [35, 42, 50, 58], recentActivities: [
    { date: "2024-01-11", activity: "デジタル変革基礎", type: "完了", score: 8.3 },
    { date: "2024-01-07", activity: "データ分析入門", type: "進行中", progress: 25 }
  ]},
  36: { id: 36, name: "西田 浩司", department: "マーケティング部", position: "一般", score: 7.9, hours: 25, courses: 5, progress: 49, lastActivity: "8時間前", email: "nishida.koji@company.com", joinDate: "2022-06-01", completedCourses: ["デジタル変革基礎"], currentCourses: ["データ分析入門"], monthlyProgress: [28, 35, 42, 49], recentActivities: [
    { date: "2024-01-10", activity: "デジタル変革基礎", type: "完了", score: 8.0 },
    { date: "2024-01-06", activity: "データ分析入門", type: "進行中", progress: 20 }
  ]},
  37: { id: 37, name: "池田 智子", department: "マーケティング部", position: "主任", score: 8.7, hours: 33, courses: 8, progress: 69, lastActivity: "2時間前", email: "ikeda.tomoko@company.com", joinDate: "2020-07-01", completedCourses: ["デジタル変革基礎", "データ分析入門", "プレゼンテーション技法"], currentCourses: ["リーダーシップ入門"], monthlyProgress: [55, 60, 65, 69], recentActivities: [
    { date: "2024-01-14", activity: "プレゼンテーション技法", type: "完了", score: 8.8 },
    { date: "2024-01-11", activity: "リーダーシップ入門", type: "進行中", progress: 40 }
  ]},
  38: { id: 38, name: "前田 光一", department: "マーケティング部", position: "一般", score: 8.0, hours: 27, courses: 6, progress: 55, lastActivity: "6時間前", email: "maeda.koichi@company.com", joinDate: "2021-10-01", completedCourses: ["デジタル変革基礎"], currentCourses: ["データ分析入門"], monthlyProgress: [32, 40, 47, 55], recentActivities: [
    { date: "2024-01-12", activity: "デジタル変革基礎", type: "完了", score: 8.1 },
    { date: "2024-01-08", activity: "データ分析入門", type: "進行中", progress: 30 }
  ]},
  39: { id: 39, name: "中川 まゆみ", department: "マーケティング部", position: "一般", score: 8.3, hours: 31, courses: 7, progress: 63, lastActivity: "4時間前", email: "nakagawa.mayumi@company.com", joinDate: "2021-08-01", completedCourses: ["デジタル変革基礎", "データ分析入門"], currentCourses: ["プレゼンテーション技法"], monthlyProgress: [45, 52, 58, 63], recentActivities: [
    { date: "2024-01-13", activity: "データ分析入門", type: "完了", score: 8.4 },
    { date: "2024-01-09", activity: "プレゼンテーション技法", type: "進行中", progress: 35 }
  ]},

  // 人事部
  40: { id: 40, name: "坂本 誠", department: "人事部", position: "主任", score: 8.5, hours: 32, courses: 7, progress: 68, lastActivity: "3時間前", email: "sakamoto.makoto@company.com", joinDate: "2020-04-01", completedCourses: ["人事基礎", "労務管理", "リーダーシップ入門"], currentCourses: ["チームマネジメント"], monthlyProgress: [55, 60, 64, 68], recentActivities: [
    { date: "2024-01-14", activity: "リーダーシップ入門", type: "完了", score: 8.6 },
    { date: "2024-01-11", activity: "チームマネジメント", type: "進行中", progress: 40 }
  ]},
  41: { id: 41, name: "内田 春香", department: "人事部", position: "一般", score: 8.1, hours: 28, courses: 6, progress: 61, lastActivity: "4時間前", email: "uchida.haruka@company.com", joinDate: "2021-06-01", completedCourses: ["人事基礎", "労務管理"], currentCourses: ["リーダーシップ入門"], monthlyProgress: [42, 48, 55, 61], recentActivities: [
    { date: "2024-01-13", activity: "労務管理", type: "完了", score: 8.2 },
    { date: "2024-01-09", activity: "リーダーシップ入門", type: "進行中", progress: 35 }
  ]},
  42: { id: 42, name: "松田 亮", department: "人事部", position: "係長", score: 8.7, hours: 34, courses: 8, progress: 71, lastActivity: "2時間前", email: "matsuda.ryo@company.com", joinDate: "2019-09-01", completedCourses: ["人事基礎", "労務管理", "リーダーシップ入門"], currentCourses: ["チームマネジメント"], monthlyProgress: [60, 64, 68, 71], recentActivities: [
    { date: "2024-01-15", activity: "リーダーシップ入門", type: "完了", score: 8.8 },
    { date: "2024-01-12", activity: "チームマネジメント", type: "進行中", progress: 45 }
  ]},
  43: { id: 43, name: "田村 彩", department: "人事部", position: "一般", score: 7.8, hours: 24, courses: 5, progress: 52, lastActivity: "6時間前", email: "tamura.aya@company.com", joinDate: "2022-03-01", completedCourses: ["人事基礎"], currentCourses: ["労務管理"], monthlyProgress: [30, 38, 45, 52], recentActivities: [
    { date: "2024-01-11", activity: "人事基礎", type: "完了", score: 7.9 },
    { date: "2024-01-07", activity: "労務管理", type: "進行中", progress: 25 }
  ]},
  44: { id: 44, name: "河野 宏", department: "人事部", position: "一般", score: 8.0, hours: 26, courses: 6, progress: 58, lastActivity: "5時間前", email: "kouno.hiroshi@company.com", joinDate: "2021-11-01", completedCourses: ["人事基礎", "労務管理"], currentCourses: ["リーダーシップ入門"], monthlyProgress: [38, 45, 52, 58], recentActivities: [
    { date: "2024-01-12", activity: "労務管理", type: "完了", score: 8.1 },
    { date: "2024-01-08", activity: "リーダーシップ入門", type: "進行中", progress: 30 }
  ]},
  45: { id: 45, name: "古川 優子", department: "人事部", position: "主任", score: 8.4, hours: 30, courses: 7, progress: 64, lastActivity: "1時間前", email: "furukawa.yuko@company.com", joinDate: "2020-12-01", completedCourses: ["人事基礎", "労務管理", "リーダーシップ入門"], currentCourses: ["チームマネジメント"], monthlyProgress: [50, 55, 60, 64], recentActivities: [
    { date: "2024-01-14", activity: "リーダーシップ入門", type: "完了", score: 8.5 },
    { date: "2024-01-10", activity: "チームマネジメント", type: "進行中", progress: 35 }
  ]},
  46: { id: 46, name: "横山 正樹", department: "人事部", position: "一般", score: 7.6, hours: 22, courses: 4, progress: 47, lastActivity: "8時間前", email: "yokoyama.masaki@company.com", joinDate: "2022-07-01", completedCourses: ["人事基礎"], currentCourses: ["労務管理"], monthlyProgress: [25, 32, 40, 47], recentActivities: [
    { date: "2024-01-10", activity: "人事基礎", type: "完了", score: 7.7 },
    { date: "2024-01-06", activity: "労務管理", type: "進行中", progress: 20 }
  ]},
  47: { id: 47, name: "宮本 直美", department: "人事部", position: "一般", score: 8.2, hours: 29, courses: 6, progress: 60, lastActivity: "3時間前", email: "miyamoto.naomi@company.com", joinDate: "2021-08-15", completedCourses: ["人事基礎", "労務管理"], currentCourses: ["リーダーシップ入門"], monthlyProgress: [40, 47, 54, 60], recentActivities: [
    { date: "2024-01-13", activity: "労務管理", type: "完了", score: 8.3 },
    { date: "2024-01-09", activity: "リーダーシップ入門", type: "進行中", progress: 40 }
  ]},
  48: { id: 48, name: "五十嵐 健", department: "人事部", position: "一般", score: 7.9, hours: 25, courses: 5, progress: 54, lastActivity: "7時間前", email: "igarashi.ken@company.com", joinDate: "2022-01-01", completedCourses: ["人事基礎"], currentCourses: ["労務管理"], monthlyProgress: [32, 40, 47, 54], recentActivities: [
    { date: "2024-01-11", activity: "人事基礎", type: "完了", score: 8.0 },
    { date: "2024-01-07", activity: "労務管理", type: "進行中", progress: 30 }
  ]},

  // 総務部
  49: { id: 49, name: "小山 貴子", department: "総務部", position: "主任", score: 8.0, hours: 27, courses: 6, progress: 59, lastActivity: "2時間前", email: "koyama.takako@company.com", joinDate: "2020-05-01", completedCourses: ["総務基礎", "事務効率化", "コンプライアンス"], currentCourses: ["リーダーシップ入門"], monthlyProgress: [45, 50, 55, 59], recentActivities: [
    { date: "2024-01-13", activity: "コンプライアンス", type: "完了", score: 8.1 },
    { date: "2024-01-10", activity: "リーダーシップ入門", type: "進行中", progress: 30 }
  ]},
  50: { id: 50, name: "岩崎 伸二", department: "総務部", position: "係長", score: 8.3, hours: 30, courses: 7, progress: 63, lastActivity: "4時間前", email: "iwasaki.shinji@company.com", joinDate: "2019-07-01", completedCourses: ["総務基礎", "事務効率化", "コンプライアンス", "リーダーシップ入門"], currentCourses: ["チームマネジメント"], monthlyProgress: [52, 56, 60, 63], recentActivities: [
    { date: "2024-01-14", activity: "リーダーシップ入門", type: "完了", score: 8.4 },
    { date: "2024-01-11", activity: "チームマネジメント", type: "進行中", progress: 35 }
  ]},
  51: { id: 51, name: "菊地 恵", department: "総務部", position: "一般", score: 7.7, hours: 23, courses: 5, progress: 50, lastActivity: "5時間前", email: "kikuchi.megumi@company.com", joinDate: "2021-12-01", completedCourses: ["総務基礎", "事務効率化"], currentCourses: ["コンプライアンス"], monthlyProgress: [32, 38, 44, 50], recentActivities: [
    { date: "2024-01-12", activity: "事務効率化", type: "完了", score: 7.8 },
    { date: "2024-01-08", activity: "コンプライアンス", type: "進行中", progress: 25 }
  ]},
  52: { id: 52, name: "安田 武", department: "総務部", position: "一般", score: 7.4, hours: 21, courses: 4, progress: 43, lastActivity: "9時間前", email: "yasuda.takeshi@company.com", joinDate: "2022-09-01", completedCourses: ["総務基礎"], currentCourses: ["事務効率化"], monthlyProgress: [22, 28, 36, 43], recentActivities: [
    { date: "2024-01-09", activity: "総務基礎", type: "完了", score: 7.5 },
    { date: "2024-01-05", activity: "事務効率化", type: "進行中", progress: 20 }
  ]},
  53: { id: 53, name: "谷口 美和", department: "総務部", position: "一般", score: 7.8, hours: 24, courses: 5, progress: 51, lastActivity: "6時間前", email: "taniguchi.miwa@company.com", joinDate: "2022-02-15", completedCourses: ["総務基礎", "事務効率化"], currentCourses: ["コンプライアンス"], monthlyProgress: [30, 36, 44, 51], recentActivities: [
    { date: "2024-01-11", activity: "事務効率化", type: "完了", score: 7.9 },
    { date: "2024-01-07", activity: "コンプライアンス", type: "進行中", progress: 30 }
  ]},
  54: { id: 54, name: "秋山 順一", department: "総務部", position: "一般", score: 7.5, hours: 22, courses: 4, progress: 45, lastActivity: "8時間前", email: "akiyama.junichi@company.com", joinDate: "2022-05-01", completedCourses: ["総務基礎"], currentCourses: ["事務効率化"], monthlyProgress: [25, 31, 38, 45], recentActivities: [
    { date: "2024-01-10", activity: "総務基礎", type: "完了", score: 7.6 },
    { date: "2024-01-06", activity: "事務効率化", type: "進行中", progress: 25 }
  ]},
  55: { id: 55, name: "今井 千春", department: "総務部", position: "主任", score: 8.1, hours: 28, courses: 6, progress: 57, lastActivity: "3時間前", email: "imai.chiharu@company.com", joinDate: "2020-10-01", completedCourses: ["総務基礎", "事務効率化", "コンプライアンス"], currentCourses: ["リーダーシップ入門"], monthlyProgress: [42, 47, 52, 57], recentActivities: [
    { date: "2024-01-13", activity: "コンプライアンス", type: "完了", score: 8.2 },
    { date: "2024-01-09", activity: "リーダーシップ入門", type: "進行中", progress: 35 }
  ]},
  56: { id: 56, name: "柴田 康雄", department: "総務部", position: "一般", score: 7.2, hours: 19, courses: 3, progress: 38, lastActivity: "12時間前", email: "shibata.yasuo@company.com", joinDate: "2023-01-15", completedCourses: ["総務基礎"], currentCourses: ["事務効率化"], monthlyProgress: [18, 24, 31, 38], recentActivities: [
    { date: "2024-01-08", activity: "総務基礎", type: "完了", score: 7.3 },
    { date: "2024-01-04", activity: "事務効率化", type: "進行中", progress: 15 }
  ]},
  57: { id: 57, name: "上野 留美", department: "総務部", position: "一般", score: 7.6, hours: 23, courses: 4, progress: 48, lastActivity: "7時間前", email: "ueno.rumi@company.com", joinDate: "2022-08-15", completedCourses: ["総務基礎"], currentCourses: ["事務効率化"], monthlyProgress: [28, 34, 41, 48], recentActivities: [
    { date: "2024-01-10", activity: "総務基礎", type: "完了", score: 7.7 },
    { date: "2024-01-06", activity: "事務効率化", type: "進行中", progress: 20 }
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
                {employee.recentActivities.map((activity, index) => {
                  const courseId = getCourseIdFromName(activity.activity);
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === '完了' ? 'bg-green-500' :
                        activity.type === '進行中' ? 'bg-blue-500' : 'bg-gray-400'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          {courseId ? (
                            <Link 
                              to={`/admin/courses/${courseId}`}
                              className="font-medium hover:text-blue-600 transition-colors cursor-pointer"
                            >
                              {activity.activity}
                            </Link>
                          ) : (
                            <span className="font-medium">{activity.activity}</span>
                          )} を
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
                  );
                })}
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
                {employee.completedCourses.map((course, index) => {
                  const courseId = getCourseIdFromName(course);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-green-600" />
                        {courseId ? (
                          <Link 
                            to={`/admin/courses/${courseId}`}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            {course}
                          </Link>
                        ) : (
                          <span className="text-sm font-medium text-gray-900">{course}</span>
                        )}
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        完了
                      </span>
                    </div>
                  );
                })}
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
                  employee.currentCourses.map((course, index) => {
                    const courseId = getCourseIdFromName(course);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <BookOpen size={16} className="text-blue-600" />
                          {courseId ? (
                            <Link 
                              to={`/admin/courses/${courseId}`}
                              className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                            >
                              {course}
                            </Link>
                          ) : (
                            <span className="text-sm font-medium text-gray-900">{course}</span>
                          )}
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          進行中
                        </span>
                      </div>
                    );
                  })
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