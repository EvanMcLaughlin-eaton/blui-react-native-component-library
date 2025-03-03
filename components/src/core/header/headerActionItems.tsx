import React from 'react';
import { StyleSheet, TouchableOpacity, View, StyleProp, ViewStyle, PixelRatio } from 'react-native';
import { HeaderIcon } from './headerIcon';
import { useSearch } from './contexts/SearchContextProvider';
import { HeaderActionComponent, HeaderIcon as HeaderIconType, IconFamily } from '../__types__';
import { useFontScale } from '..';

const ClearIcon: IconFamily = { name: 'clear' };
const SearchIcon: IconFamily = { name: 'search' };

const makeStyles = (
    maxScale: number,
    disableScaling?: boolean
): StyleSheet.NamedStyles<{
    root: ViewStyle;
    actionItem: ViewStyle;
    component: ViewStyle;
}> => {
    const fontScale = !disableScaling
        ? PixelRatio.getFontScale() < maxScale
            ? PixelRatio.getFontScale()
            : maxScale
        : 1;
    return StyleSheet.create({
        root: {
            flexDirection: 'row',
            alignItems: 'center',
            position: 'absolute',
            right: 8,
            height: 56 * fontScale,
        },
        actionItem: {
            height: 40 * fontScale,
            width: 24 * fontScale + 16,
            paddingVertical: 8 * fontScale,
            paddingHorizontal: 8,
        },
        component: {
            height: 40 * fontScale,
            width: 40 * fontScale,
            justifyContent: 'center',
        },
    });
};

type ActionItemProps = {
    /** Array of up to three action items on the right of the header */
    actionItems?: Array<HeaderIconType | HeaderActionComponent>;

    /** Style overrides for internal elements. The styles you provide will be combined with the default styles. */
    styles?: {
        root?: StyleProp<ViewStyle>;
        actionItem?: StyleProp<ViewStyle>;
        component?: StyleProp<ViewStyle>;
    };
};

/**
 * HeaderActionItems component
 *
 * The HeaderActionItems is a helper component for organizing the contents in the Header. It is
 * used for displaying all of the action item icons and components.
 */
export const HeaderActionItems: React.FC<ActionItemProps> = (props) => {
    const { actionItems, styles = {} } = props;
    const { searchConfig, searching, query, onClear, onSearch } = useSearch();
    const { maxScale } = useFontScale();
    const defaultStyles = makeStyles(maxScale);

    let items: Array<HeaderIconType | HeaderActionComponent> = actionItems || [];

    if (searching) {
        if (query) {
            items = [
                {
                    icon: ClearIcon,
                    onPress: onClear,
                },
            ];
        } else {
            items = [];
        }
    } else if (searchConfig) {
        items = [
            {
                icon: SearchIcon,
                onPress: onSearch,
            },
        ];
        if (actionItems) {
            items = items.concat(actionItems);
        }
    }

    if (items) {
        return (
            <View style={[defaultStyles.root, styles.root]}>
                {items.map((actionItem: HeaderIconType | HeaderActionComponent, index) => {
                    if ('component' in actionItem) {
                        return (
                            <View
                                key={`action_${index}`}
                                testID={`header-action-item${index}`}
                                accessibilityLabel={`header-action-item${index}`}
                                style={[
                                    defaultStyles.component,
                                    actionItem.width ? { width: actionItem.width } : {},
                                    styles.component,
                                ]}
                            >
                                {actionItem.component}
                            </View>
                        );
                    }
                    return (
                        <TouchableOpacity
                            key={`action_${index}`}
                            testID={`header-action-item${index}`}
                            accessibilityLabel={`header-action-item${index}`}
                            onPress={actionItem.onPress}
                            style={[defaultStyles.actionItem, styles.actionItem]}
                        >
                            <HeaderIcon icon={actionItem.icon} />
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }
    return null;
};
