import React from 'react';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';

function Icon(props: any) {
    const { name, size, color, strokeWidth, className, ...rest } = props as any;
    const IconComponent = LucideIcons?.[name as any];

    if (!IconComponent) {
        return <HelpCircle size={size as any} color="gray" strokeWidth={strokeWidth as any} className={className} {...rest} />;
    }

    return <IconComponent
        size={size as any}
        color={color}
        strokeWidth={strokeWidth as any}
        className={className}
        {...rest}
    />;
}
export default Icon;