import { useState } from "react";
import { Users, Briefcase, Settings, UserPlus, ShoppingBag, MailSearch, LogOut, Blocks } from "lucide-react"; // Lucide icons
import Services from './Tabs/Services'
import CreateAdmin from "./Tabs/CreateAdmin";
import Orders from "./Tabs/Orders";
import CampaignSubs from "./Tabs/CampainSubs";
import Artisan from "./Tabs/Artisans";
import Clients from "./Tabs/Clients";
import Overview from "./Tabs/Overview";
import { getIdentity } from "../../Auth/tokenStorage";
import useAuth from "../../Auth/useAuth";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const identity = getIdentity();
  const { logout } = useAuth();

  const tabs = [
    { label: "Overview", icon: Blocks },
    { label: "Client", icon: Users },
    { label: "Artisans", icon: Briefcase },
    { label: "Services", icon: Settings },
    { label: "Create Admin", icon: UserPlus },
    { label: "Orders", icon: ShoppingBag },
    { label: "Mail list", icon: MailSearch },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col mb-6">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1 flex justify-between gap-3">
            Welcome, {identity?.fullName}
            <button
              onClick={() => {
                logout()
                console.log("Logout clicked");
              }}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Logout</span>
          </button>
          </p>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full mt-4 rounded-lg overflow-hidden shadow-lg bg-white">
        
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-200 bg-gray-50">
          <nav className="flex flex-col gap-1 p-4">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200
                  ${activeTab === tab.label 
                    ? "bg-blue-500 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content area */}
        <main className="flex-1 p-6">
          {activeTab === "Overview" && <div className="text-gray-700">
            🗂 Overview content...
              <Overview />
            </div>
          }
          {activeTab === "Client" && <div className="text-gray-700">
              📋 Client content...
              <Clients />
            </div>
          }
          {activeTab === "Artisans" && <div className="text-gray-700">
              🛠 Artisans content...
              <Artisan />
            </div>
          }
          {activeTab === "Services" && <div className="text-gray-700">
              <Services />
            </div>
          }
          {activeTab === "Create Admin" && <div className="text-gray-700">👤 Create Admin form...
              <CreateAdmin />
            </div>
          }
          {activeTab === "Orders" && <div className="text-gray-700">📦 Orders list...
              <Orders />
            </div>
          }
          {activeTab === "Mail list" && <div className="text-gray-700">
              📨 Mail subscriber list...
              <CampaignSubs />
            </div>
          }
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
