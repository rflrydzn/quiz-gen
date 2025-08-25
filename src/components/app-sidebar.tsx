import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  FileText,
  PlusCircle,
  Bookmark,
  User,
  HelpCircle,
} from "lucide-react";
import LoginButton from "./LoginLogoutButton";
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
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

const supabase = createClient();

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home, // Home icon
  },
  {
    title: "My Quizzes",
    url: "/my-quizzes",
    icon: FileText, // Document/quiz icon
  },
  {
    title: "Create Quiz",
    url: "/create-quiz",
    icon: PlusCircle, // Add new quiz
  },
  {
    title: "Saved Quizzes",
    url: "#",
    icon: Bookmark, // Saved/bookmarked quizzes
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings, // Settings gear
  },
  {
    title: "Profile",
    url: "#",
    icon: User, // User avatar
  },
  {
    title: "Help / Feedback",
    url: "#",
    icon: HelpCircle, // Question mark for help
  },
];

export function AppSidebar() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      console.log("Fetched user:", user);
    };
    fetchUser();
  }, []);

  const userData = {
    name: user?.user_metadata?.full_name,
    email: user?.email,
    avatar: "/avatars/shadcn.jpg",
  };
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>QuizMaster</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
