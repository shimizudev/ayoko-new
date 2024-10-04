import { Menu } from '@vidstack/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@vidstack/react/icons';

export interface SubmenuButtonProps {
  label: string;
  hint: string;
  disabled?: boolean;
  icon: React.ReactElement;
}

export function SubmenuButton({
  label,
  hint,
  icon: Icon,
  disabled,
}: Readonly<SubmenuButtonProps>): JSX.Element {
  return (
    <Menu.Button className="vds-menu-item" disabled={disabled}>
      <ChevronLeftIcon className="vds-menu-close-icon" />
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Icon className="vds-icon" />
      <span className="vds-menu-item-label">{label}</span>
      <span className="vds-menu-item-hint">{hint}</span>
      <ChevronRightIcon className="vds-menu-open-icon" />
    </Menu.Button>
  );
}
