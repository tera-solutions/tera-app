import { useMemo, useState } from "react";
import classNames from "classnames";

import Card from "_common/components/Card";
import { ProfileService } from "@tera/modules/system";

import AccountInfoCard from "pages/MyInfo/components/AccountInfoCard";
import ChangePasswordForm from "pages/MyInfo/components/ChangePasswordForm";
import { toProfileData } from "pages/MyInfo/_utils";

import type { SettingsTabKey } from "./_interface";
import { SETTINGS_TABS } from "./constants";
import NotificationSettingsTab from "./components/NotificationSettingsTab";
import GeneralSettingsTab from "./components/GeneralSettingsTab";
import AppearanceCard from "./components/AppearanceCard";
import BankAccountSettingsTab from "./components/BankAccountSettingsTab";
import RecurringInvoiceSettingsTab from "./components/RecurringInvoiceSettingsTab";
import EvaluationCriteriaSettingsTab from "./components/EvaluationCriteriaSettingsTab";

const Settings = () => {
  const [tab, setTab] = useState<SettingsTabKey>("profile");
  const [passwordFormOpen, setPasswordFormOpen] = useState(false);

  const profileQuery = ProfileService.useProfile();
  const profile = useMemo(() => toProfileData(profileQuery.data?.data), [profileQuery.data]);

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-800">Cài đặt</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Quản lý thông tin cá nhân, tùy chỉnh hệ thống và cài đặt tài khoản.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
        <Card animated={false}>
          <div className="flex flex-col gap-1">
            {SETTINGS_TABS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  if (item.key === "password") {
                    setPasswordFormOpen(true);
                    return;
                  }
                  setTab(item.key);
                }}
                className={classNames(
                  "rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                  tab === item.key
                    ? "bg-sky-50 text-brand"
                    : "text-slate-600 hover:bg-slate-50",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </Card>

        <div>
          {tab === "profile" && (
            <div className="max-w-md">
              <AccountInfoCard profile={profile} loading={profileQuery.isLoading} />
            </div>
          )}
          {tab === "notification" && <NotificationSettingsTab />}
          {tab === "general" && <GeneralSettingsTab />}
          {tab === "appearance" && <AppearanceCard />}
          {tab === "bank_account" && <BankAccountSettingsTab />}
          {tab === "recurring_invoice" && <RecurringInvoiceSettingsTab />}
          {tab === "evaluation_criteria" && <EvaluationCriteriaSettingsTab />}
        </div>
      </div>

      <ChangePasswordForm open={passwordFormOpen} onClose={() => setPasswordFormOpen(false)} />
    </div>
  );
};

export default Settings;
