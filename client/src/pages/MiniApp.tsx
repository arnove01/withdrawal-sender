import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/_core/hooks/useAuth";

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export default function MiniApp() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [, navigate] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Initialize Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      setUserData(tg.initDataUnsafe.user);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold">YZ Earn</h1>
        <p className="text-sm opacity-90">Welcome, {userData?.first_name || "User"}!</p>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Balance Card */}
        <Card className="bg-white shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
            <CardTitle>Your Balance</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-gray-600 text-sm">Available</p>
                <p className="text-3xl font-bold text-blue-600">1,250</p>
                <p className="text-xs text-gray-500">YZ Coins</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Total Earned</p>
                <p className="text-3xl font-bold text-green-600">5,800</p>
                <p className="text-xs text-gray-500">YZ Coins</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Level & Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Level 5</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Level 6</span>
                <span>750 / 1000 XP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="earn" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border">
            <TabsTrigger value="earn">Earn</TabsTrigger>
            <TabsTrigger value="spin">Spin</TabsTrigger>
            <TabsTrigger value="refer">Refer</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>

          {/* Earn Tab */}
          <TabsContent value="earn" className="space-y-3 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Daily Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: "Login Daily", reward: 50, completed: true },
                  { title: "Watch Video", reward: 100, completed: false },
                  { title: "Complete Survey", reward: 200, completed: false },
                ].map((task, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-gray-500">+{task.reward} YZ</p>
                    </div>
                    <Button size="sm" variant={task.completed ? "outline" : "default"} disabled={task.completed}>
                      {task.completed ? "✓" : "Claim"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Promo Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                  <Button size="sm">Apply</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spin Tab */}
          <TabsContent value="spin" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Spin Wheel</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center mb-4">
                  <div className="text-center">
                    <p className="text-sm font-semibold">Spin Daily</p>
                    <p className="text-2xl font-bold">🎡</p>
                  </div>
                </div>
                <Button className="w-full">Spin Now</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Refer Tab */}
          <TabsContent value="refer" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Invite Friends</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Your Referral Link:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value="https://t.me/yzbot?start=ABC123"
                      readOnly
                      className="flex-1 px-3 py-2 border rounded-lg text-xs bg-gray-50"
                    />
                    <Button size="sm">Copy</Button>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900">Referrals: 12</p>
                  <p className="text-xs text-blue-700">Earned: 1,200 YZ</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdraw Tab */}
          <TabsContent value="withdraw" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Withdraw</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Payment Method</label>
                  <select className="w-full px-3 py-2 border rounded-lg text-sm mt-2">
                    <option>Bkash</option>
                    <option>Nagad</option>
                    <option>Rocket</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Amount (YZ)</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border rounded-lg text-sm mt-2"
                  />
                </div>
                <Button className="w-full">Request Withdrawal</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Leaderboard Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Earners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { rank: 1, name: "Ahmed", coins: 10000 },
                { rank: 2, name: "Fatima", coins: 8500 },
                { rank: 3, name: "Hassan", coins: 7200 },
              ].map((entry) => (
                <div key={entry.rank} className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-gray-400">#{entry.rank}</span>
                    <span className="font-medium">{entry.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{entry.coins} YZ</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
