import { ActionIcon, Group, Paper, Stack, Text } from "@mantine/core";
import { useFetch } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Message, MessageStatus } from "common";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

export const MessageCard = ({
    value,
}: {
    value: Message,
}) => {
    const location = useLocation();
    const ADMIN_KEY = new URLSearchParams(location.search).get("admin_key");

    const [loading, setLoading] = useState<boolean | null>(false);
    const [deleted, setDeleted] = useState<boolean>(false);

    const updateStatus = async (status: MessageStatus) => {
        setLoading(true);
        let res = await fetch("/api/admin?admin_key=" + ADMIN_KEY, {
            body: JSON.stringify({
                id: value.id,
                action: status,
            }),
            method: "POST",
            headers: [["Content-Type", "application/json"]],
        });
        if (status == "deleted") setDeleted(true);
        setLoading(null);
    };

    if (deleted) return <Text>Silindi</Text>;

    return (
        <Paper
            withBorder
            p="xs"
        >
            <Stack justify="space-between">
                <Stack>
                    <Text fw="bold">
                        {value.author}
                    </Text>
                    <Text fz="sm">
                        {value.content}
                    </Text>
                </Stack>

                {!!ADMIN_KEY && loading !== null && (
                    <Stack>
                        <Group gap={4} justify="end">
                            <ActionIcon
                                loading={loading}
                                onClick={() => updateStatus("deleted")}
                                color="red"
                                variant="light"
                            >
                                <IconX />
                            </ActionIcon>
                            <ActionIcon
                                loading={loading}
                                onClick={() => updateStatus("approved")}
                                color="green"
                                variant="light"
                            >
                                <IconCheck />
                            </ActionIcon>
                        </Group>
                    </Stack>
                )}
            </Stack>
        </Paper>
    );
};
