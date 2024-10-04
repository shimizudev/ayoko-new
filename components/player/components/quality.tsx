import { Menu, useVideoQualityOptions } from '@vidstack/react';
import { CheckIcon, SettingsMenuIcon } from '@vidstack/react/icons';

import { SubmenuButton } from './sub-menu-button';

export function QualitySubmenu(): JSX.Element {
  const options = useVideoQualityOptions();
  const currentQuality = options.selectedQuality?.height;

  let hint = '';

  if (options.selectedValue !== 'auto' && currentQuality) {
    hint = `${currentQuality}p`;
  } else {
    hint = 'Auto';
    if (currentQuality) {
      hint += `(${currentQuality}p)`;
    }
  }

  return (
    <Menu.Root>
      <SubmenuButton
        disabled={options.disabled}
        hint={hint}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        icon={SettingsMenuIcon}
        label="Quality"
      />
      <Menu.Content className="vds-menu-items">
        <Menu.RadioGroup
          className="vds-radio-group"
          value={options.selectedValue}
        >
          {options.map(({ label, value, bitrateText, select }) => (
            <Menu.Radio
              key={value}
              className="vds-radio"
              value={value}
              onSelect={select}
            >
              <CheckIcon className="vds-icon" />
              <span className="vds-radio-label">{label}</span>
              {bitrateText ? (
                <span className="vds-radio-hint">{bitrateText}</span>
              ) : null}
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}
