// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  RadioButtonIcon,
  RadioButtonSelectedIcon,
} from '@vidstack/react/icons';

import useSkipButtons from '@/hooks/use-skip-buttons';

export function SkipButtonsSubMenu(): JSX.Element {
  const [isEnabled, setIsEnabled] = useSkipButtons();

  const handleToggle = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <div className="skip-buttons-toggle">
      <button
        type="button"
        aria-label="Toggle Skip Buttons"
        className="toggle-button"
        onClick={handleToggle}
      >
        {isEnabled ? (
          <RadioButtonSelectedIcon className="vds-icon" />
        ) : (
          <RadioButtonIcon className="vds-icon" />
        )}
        <span className="vds-radio-label">
          {isEnabled ? 'Hide Skip Buttons' : 'Show Skip Buttons'}
        </span>
      </button>
    </div>
  );
}
