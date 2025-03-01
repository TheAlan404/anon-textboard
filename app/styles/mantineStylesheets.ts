import { LinkDescriptor } from "react-router";

import css_mantine_core from "@mantine/core/styles.css?url";
import css_mantine_notifications from "@mantine/notifications/styles.css?url";
import css_custom_styles from "./style.css?url";

export const mantineStylesheets: LinkDescriptor[] = [
    { rel: "stylesheet", href: css_mantine_core },
    { rel: "stylesheet", href: css_mantine_notifications },
    { rel: "stylesheet", href: css_custom_styles },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap",
        crossOrigin: "anonymous",
    },
];
