// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { SettingsIcon } from '@vidstack/react/icons';
import { Menu } from '@vidstack/react';

import { SubmenuButton } from './sub-menu-button';
import { SkipButtonsSubMenu } from './show-skip-buttons';
import { AutoSkipSubMenu } from './auto-skip';

export function SkipConfigurationSubMenu(): JSX.Element {
  return (
    <Menu.Root>
      <SubmenuButton hint="" icon={SettingsIcon} label="Skip Configuration" />
      <Menu.Content className="vds-menu-items">
        <Menu.RadioGroup className="vds-radio-group">
          <Menu.Radio key="skip_buttons" className="vds-radio">
            <SkipButtonsSubMenu />
          </Menu.Radio>
          <Menu.Radio key="skip_buttons" className="vds-radio">
            <AutoSkipSubMenu />
          </Menu.Radio>
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}
