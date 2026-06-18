import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">YZ Earn</h1>
            <p className="text-gray-600">Telegram Mini App Platform</p>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700">Welcome, {user?.name || "User"}!</span>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => window.location.href = getLoginUrl()}>
                Login with Manus
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {isAuthenticated ? (
          <div className="space-y-8">
            {/* Welcome Section */}
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Welcome to YZ Earn!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6">
                  Start earning coins by completing tasks, inviting friends, and spinning the wheel. 
                  Withdraw your earnings through multiple payment methods.
                </p>
                <div className="flex gap-4">
                  <Button 
                    className="bg-white text-blue-600 hover:bg-gray-100"
                    onClick={() => navigate("/app")}
                  >
                    Open Mini App
                  </Button>
                  {user?.role === "admin" && (
                    <Button 
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                      onClick={() => navigate("/admin")}
                    >
                      Admin Panel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">💰</span>
                    Earn Coins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Complete daily tasks, watch videos, and participate in surveys to earn YZ coins.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">👥</span>
                    Referral Program
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Invite friends and earn rewards for each successful referral.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🎡</span>
                    Spin Wheel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Try your luck with the daily spin wheel and win instant rewards.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Compete with other users and climb the leaderboard to earn more rewards.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">💳</span>
                    Multiple Withdrawals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Withdraw your earnings via Bkash, Nagad, Rocket, Bank Transfer, or PayPal.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">📱</span>
                    Mobile First
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Fully responsive design optimized for Telegram Mini App experience.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* How to Get Started */}
            <Card>
              <CardHeader>
                <CardTitle>How to Get Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Open the Mini App</h3>
                    <p className="text-gray-600">Click "Open Mini App" button above to start using the platform.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Complete Tasks</h3>
                    <p className="text-gray-600">Earn coins by completing daily tasks and challenges.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Invite Friends</h3>
                    <p className="text-gray-600">Share your referral link and earn rewards for each friend who joins.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold">Withdraw Earnings</h3>
                    <p className="text-gray-600">Once you reach the minimum withdrawal amount, request a withdrawal.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <div className="text-center py-8">
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate("/app")}
              >
                Start Earning Now
              </Button>
            </div>
          </div>
        ) : (
          /* Not Authenticated */
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Welcome to YZ Earn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-gray-600">
                  Please login to access the platform and start earning coins.
                </p>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.location.href = getLoginUrl()}
                >
                  Login with Manus
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>© 2026 YZ Earn. All rights reserved. Built with Manus.</p>
        </div>
      </footer>
    </div>
  );
}
