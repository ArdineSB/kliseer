'use client';

import { useState } from 'react';
import { Icon } from './Icon';

export function SidebarToggle() {
  const [collapsed, setCollapsed] = useState(false);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    document.querySelector('.shell')?.classList.toggle('shell--collapsed', next);
  }

  return (
    <button
      type="button"
      className="sidebar-toggle"
      onClick={toggle}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      aria-expanded={!collapsed}
      title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      <Icon name="sidebar" />
    </button>
  );
}
