import { Ellipsis, ShieldUser } from "lucide-react"

import { useTranslations } from "next-intl"
import { ThemeToggle } from "../lib/theme"
import { Footer } from "./footer"
import LanguageSwitcher from "./language-switch"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "./ui/sidebar"

export function AppSidebar() {
  const t = useTranslations("sidebar")
  // Menu items.
  const items = [
    {
      title: t("navigation.admin"),
      url: "/admin",
      icon: ShieldUser,
    },
    {
      title: t("navigation.about"),
      url: "/about",
      icon: Ellipsis,
    },

  ]
  return (
    <Sidebar>
      <SidebarContent className=" mt-20 ml-10">
        <SidebarGroup>
          <SidebarGroupLabel> {t("settings")} </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-col gap-2">
              <ThemeToggle></ThemeToggle>
              <LanguageSwitcher></LanguageSwitcher>

            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel> {t("navigation.title")} </SidebarGroupLabel>
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
        <Footer />
      </SidebarFooter>

    </Sidebar>
  )
}