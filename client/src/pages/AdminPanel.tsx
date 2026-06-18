import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/_core/hooks/useAuth";
import { Lock } from "lucide-react";

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">You do not have permission to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your YZ Earn platform</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Stats Cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1,234</p>
              <p className="text-xs text-green-600">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Coins Distributed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">45.2K</p>
              <p className="text-xs text-green-600">+5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">23</p>
              <p className="text-xs text-gray-600">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">567</p>
              <p className="text-xs text-gray-600">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {[
                    { id: "users", label: "👥 Users", icon: "👥" },
                    { id: "withdrawals", label: "💰 Withdrawals", icon: "💰" },
                    { id: "tasks", label: "📋 Tasks", icon: "📋" },
                    { id: "channels", label: "📢 Channels", icon: "📢" },
                    { id: "settings", label: "⚙️ Settings", icon: "⚙️" },
                    { id: "broadcast", label: "📤 Broadcast", icon: "📤" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === item.id
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Users Tab */}
            {activeTab === "users" && (
              <Card>
                <CardHeader>
                  <CardTitle>Manage Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b">
                        <tr>
                          <th className="text-left py-2 px-4">User ID</th>
                          <th className="text-left py-2 px-4">Name</th>
                          <th className="text-left py-2 px-4">Balance</th>
                          <th className="text-left py-2 px-4">Level</th>
                          <th className="text-left py-2 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 1, name: "Ahmed Khan", balance: 1250, level: 5 },
                          { id: 2, name: "Fatima Ali", balance: 2100, level: 6 },
                          { id: 3, name: "Hassan Hasan", balance: 850, level: 3 },
                        ].map((user) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{user.id}</td>
                            <td className="py-3 px-4">{user.name}</td>
                            <td className="py-3 px-4">{user.balance} YZ</td>
                            <td className="py-3 px-4">{user.level}</td>
                            <td className="py-3 px-4">
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Withdrawals Tab */}
            {activeTab === "withdrawals" && (
              <Card>
                <CardHeader>
                  <CardTitle>Manage Withdrawals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 1, user: "Ahmed", amount: 500, method: "Bkash", status: "pending" },
                      { id: 2, user: "Fatima", amount: 1000, method: "Nagad", status: "approved" },
                      { id: 3, user: "Hassan", amount: 250, method: "Rocket", status: "completed" },
                    ].map((wd) => (
                      <div key={wd.id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">{wd.user}</p>
                          <p className="text-sm text-gray-600">{wd.amount} YZ via {wd.method}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              wd.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : wd.status === "approved"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {wd.status}
                          </span>
                          {wd.status === "pending" && (
                            <>
                              <Button size="sm">Approve</Button>
                              <Button size="sm" variant="outline">
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tasks Tab */}
            {activeTab === "tasks" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Manage Tasks</CardTitle>
                    <Button>+ Add Task</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 1, title: "Login Daily", reward: 50, type: "daily", active: true },
                      { id: 2, title: "Watch Video", reward: 100, type: "daily", active: true },
                      { id: 3, title: "Complete Survey", reward: 200, type: "one_time", active: false },
                    ].map((task) => (
                      <div key={task.id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-gray-600">
                            {task.reward} YZ • {task.type}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              task.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {task.active ? "Active" : "Inactive"}
                          </span>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Channels Tab */}
            {activeTab === "channels" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Manage Channels</CardTitle>
                    <Button>+ Add Channel</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 1, name: "YZ Earn News", username: "@yz_news", required: true, active: true },
                      { id: 2, name: "YZ Community", username: "@yz_community", required: false, active: true },
                    ].map((ch) => (
                      <div key={ch.id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">{ch.name}</p>
                          <p className="text-sm text-gray-600">{ch.username}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            {ch.required ? "Required" : "Optional"}
                          </span>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Bot Name</label>
                    <input type="text" defaultValue="YZ Earn" className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Referral Reward (YZ)</label>
                    <input type="number" defaultValue="100" className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Minimum Withdrawal (YZ)</label>
                    <input type="number" defaultValue="500" className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <Button>Save Settings</Button>
                </CardContent>
              </Card>
            )}

            {/* Broadcast Tab */}
            {activeTab === "broadcast" && (
              <Card>
                <CardHeader>
                  <CardTitle>Send Broadcast Message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      placeholder="Enter your message..."
                      rows={5}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-900">
                      This message will be sent to all <strong>1,234</strong> users
                    </p>
                  </div>
                  <Button className="w-full">Send Broadcast</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
