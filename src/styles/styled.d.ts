// styled.d.ts
import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        name: string;
        colors: {
            primary: string;
            secondary: string;
            gray: {
                Light: string;
            };
            background: string;
            text: string;
            title: string;
            button: string;
            success: string;
            error: string;
            warning: string;
            sidebar: string;
            border: string;
            tableHeader: string;
            tableHeaderText: string;
            tableRowEven: string;
            tableHover: string;
            muted: string;
        };
        colorsButton: {
            primary: string;
            secondary: string;
            alert: string;
        };
        colorsSelect: {
            label: string;
            backgroundColor: string;
        };
        selectPosition: {
            top: string;
            topFloat: string;
            marginTop?: string;
        };
    }
}
