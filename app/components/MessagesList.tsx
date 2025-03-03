import { ActionIcon, Divider, Group, Pagination, SimpleGrid, Stack } from "@mantine/core";
import { useFetch } from "@mantine/hooks";
import { IconReload } from "@tabler/icons-react";
import { Message } from "common";
import { useState } from "react";
import { MessageCard } from "./MessageCard";
import { useLocation } from "react-router";

export const MessagesList = () => {
    const location = useLocation();
    const ADMIN_KEY = new URLSearchParams(location.search).get("admin_key");

	const [page, setPage] = useState(1);

	const { loading, data, error, refetch } = useFetch<{
		count: number;
		pageCount: number;
		messages: Message[];
	}>("/api/messages?" + new URLSearchParams([
        ["page", page.toString()],
        ["admin_key", ADMIN_KEY || ""],
    ]));

	return (
		<Stack w="100%" px="sm">
			<Group>
				<Pagination
					total={data?.pageCount || 1}
					value={page}
					onChange={setPage}
					withPages={false}
					hideWithOnePage
				/>

				<Divider
					flex="1"
				/>

				<ActionIcon
					variant="light"
					color="gray"
					onClick={refetch}
				>
					<IconReload />
				</ActionIcon>
			</Group>

			<Stack>
				<SimpleGrid cols={{ base: 1, xs: 2, md: 3 }}>
					{data?.messages.map(message => (
						<MessageCard
							key={message.id}
							value={message}
						/>
					))}
				</SimpleGrid>
			</Stack>
		</Stack>
	);
};
