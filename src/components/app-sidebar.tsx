import {
  Home,
  Settings,
  FileText,
  PlusCircle,
  Bookmark,
  UserIcon,
  HelpCircle,
  Archive,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
  SidebarTrigger,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/lib/auth-actions";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

// Separate items into two groups
const activeItems = [
  {
    title: "My Quizzes",
    url: "/",
    icon: FileText,
  },
  {
    title: "Create Quiz",
    url: "/create-quiz",
    icon: PlusCircle,
  },
];

const comingSoonItems = [
  {
    title: "Dashboard",
    url: "/coming-soon",
    icon: Home,
  },
  {
    title: "Saved Quizzes",
    url: "/coming-soon",
    icon: Bookmark,
  },
  {
    title: "Uploads",
    url: "/coming-soon",
    icon: Archive,
  },
  {
    title: "Settings",
    url: "/coming-soon",
    icon: Settings,
  },
  {
    title: "Profile",
    url: "/coming-soon",
    icon: UserIcon,
  },
  {
    title: "Help / Feedback",
    url: "/coming-soon",
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const userData = {
    name: user?.user_metadata?.full_name ?? "Unknown",
    email: user?.email ?? "unknown@example.com",
    avatar:
      user?.user_metadata?.avatar_url ??
      "https://scontent.fcrk1-3.fna.fbcdn.net/v/t39.30808-6/500025423_1041108257991591_2936135239989154890_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=gOhwoTh3DbQQ7kNvwHclKPd&_nc_oc=AdlENBT0dHdzf9CZWBf0K8H-zHym5uR-iqNYtMKWj-QDjUAw6ayvbMeabVgs5xVc-Zw&_nc_zt=23&_nc_ht=scontent.fcrk1-3.fna&_nc_gid=HQeIYbRlPYn5Tb1dTn2k8g&oh=00_AfUsTcNUmoVzwwXumyTxL38aRdtHtTIgPXoKcCOqMB1Fsw&oe=68B9F328",
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <SidebarTrigger className="-ml-1" />
          <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">
            QuizMaster
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Active links */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activeItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Coming Soon links */}
        <SidebarGroup>
          <SidebarGroupLabel>Coming Soon</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {comingSoonItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip="Coming Soon">
                    <a href={item.url} className="text-gray-400">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={userData}
          onSignout={() => {
            signout();
            setUser(null);
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
