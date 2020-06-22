import React, { useCallback } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { InfoListItem } from '../info-list-item';
import { InfoListItemProps } from '../info-list-item/info-list-item';
import { DrawerInheritableProps } from './inheritable-types';
import { DrawerNavGroupProps } from './drawer-nav-group';
// import { $DeepPartial } from '@callstack/react-theme-provider';

export type NestedNavItem = Omit<NavItem, 'icon'>;

export type NavItem = {
    icon?: any;
    itemID: string;
    items?: NestedNavItem[];
} & DrawerInheritableProps &
    // IconClass is replaced by the 'icon' property.
    Omit<InfoListItemProps, 'IconClass'>;

export type DrawerNavItemProps = Omit<Omit<InfoListItemProps, 'styles'>, 'title'> & {
    depth: number;
    expanded: boolean;
    expandHandler?: Function;
    navGroupProps: DrawerNavGroupProps;
    navItem: NavItem | NestedNavItem;
    /** Style Overrides */
    styles?: {
        root?: StyleProp<ViewStyle>;
        activeBackground?: StyleProp<ViewStyle>;
        infoListItem?: InfoListItemProps['styles'];
    };
    /** Overrides for theme */
    // theme?: $DeepPartial<Theme>; // Uncomment if we need to style anything based on the theme
};

const makeStyles = (props: DrawerNavItemProps): any =>
    StyleSheet.create({
        root: {},
        activeBackground: {
            backgroundColor: props.navItem.activeItemBackgroundColor,
            zIndex: 0,
            position: 'absolute',
            height: '100%',
            width: props.navItem.activeItemBackgroundShape === 'square' ? '100%' : '97%',
            left: 0,
            top: 0,
            borderTopRightRadius: props.navItem.activeItemBackgroundShape === 'square' ? 0 : 24,
            borderBottomRightRadius: props.navItem.activeItemBackgroundShape === 'square' ? 0 : 24,
            opacity: 0.9,
        },
    });

export const DrawerNavItem: React.FC<DrawerNavItemProps> = (props) => {
    const defaultStyles = makeStyles(props);
    const { depth, expanded, expandHandler, navGroupProps, navItem, styles = {}, ...infoListItemProps } = props;

    const icon = !depth ? (navItem as NavItem).icon : undefined;
    const active = navGroupProps.activeItem === navItem.itemID;
    const rightIcon = navItem.items ? (expanded ? navItem.collapseIcon : navItem.expandIcon) : undefined;

    const infoListItemStyles = styles.infoListItem || {};
    const { root: iliRoot, title: iliTitle, ...otherILI } = infoListItemStyles;

    const onPressAction = useCallback(
        (id: string): void => {
            if (navItem.onItemSelect) {
                navItem.onItemSelect(id);
            }
            if (navItem.onPress) {
                navItem.onPress();
            } else if (expandHandler) {
                expandHandler();
            }
        },
        [navItem, expandHandler]
    );

    return (
        <View style={[defaultStyles.root, styles.root]}>
            {active && <View style={[defaultStyles.activeBackground, styles.activeBackground]} />}
            <InfoListItem
                dense
                {...navItem}
                rightComponent={rightIcon}
                backgroundColor={'transparent'}
                iconColor={active ? navItem.activeItemIconColor : navItem.iconColor || navItem.itemIconColor}
                fontColor={active ? navItem.activeItemFontColor : navItem.fontColor || navItem.itemFontColor}
                onPress={(): void => onPressAction(navItem.itemID)}
                IconClass={icon}
                styles={{
                    root: Object.assign(
                        {
                            paddingLeft: 32 * (depth > 1 ? depth - 1 : 0),
                        },
                        iliRoot
                    ),
                    title: Object.assign(
                        depth > 0
                            ? {
                                  fontWeight: '400',
                              }
                            : {},
                        iliTitle
                    ),
                    ...otherILI,
                }}
                {...infoListItemProps}
            />
        </View>
    );
};

DrawerNavItem.displayName = 'DrawerNavItem';
