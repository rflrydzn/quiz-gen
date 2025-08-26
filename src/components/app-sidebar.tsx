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
  SidebarTrigger,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/lib/auth-actions";
import { useState, useEffect } from "react";

const supabase = createClient();

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
  },
  {
    title: "My Quizzes",
    url: "/my-quizzes",
    icon: FileText,
  },
  {
    title: "Create Quiz",
    url: "/create-quiz",
    icon: PlusCircle,
  },
  {
    title: "Saved Quizzes",
    url: "#",
    icon: Bookmark,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Profile",
    url: "#",
    icon: User,
  },
  {
    title: "Help / Feedback",
    url: "#",
    icon: HelpCircle,
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
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <SidebarTrigger />
          <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">
            QuizMaster
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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
