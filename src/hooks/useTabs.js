import { useState } from 'react';

export const useTabs = (defaultTab = null) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const switchTab = (tabId) => {
    setActiveTab(tabId);
  };

  const isActive = (tabId) => activeTab === tabId;

  return {
    activeTab,
    switchTab,
    isActive,
  };
};