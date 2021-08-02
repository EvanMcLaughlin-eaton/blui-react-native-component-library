import React, { ComponentType } from 'react';
import { WrapIconProps } from '../icon-wrapper';
import { ICON_SIZE } from './constants';
import { useColor } from './contexts/ColorContextProvider';

type HeaderIconProps = {
    /** A component to render for the icon  */
    icon?: ComponentType<WrapIconProps>;
};
/**
 * HeaderIcon component
 *
 * The HeaderIcon is a helper component that is used to properly size and space icons in the Header component.
 */
export const HeaderIcon: React.FC<HeaderIconProps> = (props) => {
    const { icon: Icon } = props;
    const { color } = useColor();
    if (Icon) {
        return <Icon size={ICON_SIZE} color={color} allowFontScaling />;
    }
    return null;
};
