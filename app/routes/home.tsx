import { ActionIcon, Button, Divider, Group, Pagination, Paper, SimpleGrid, Stack, Text, Textarea, TextInput, Title } from "@mantine/core";
import type { Route } from "./+types/home";
import { CONFIG } from "~/config";
import { useFetch } from "@mantine/hooks";
import { IconReload } from "@tabler/icons-react";
import { useState } from "react";
import { Message } from "common";
import { MessageCard } from "~/components/MessageCard";
import { MessagesList } from "~/components/MessagesList";
import { notifications } from "@mantine/notifications";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: CONFIG.title },
		{ name: "description", content: CONFIG.desc },
	];
}

export default function Home() {
	return (
		<Stack align="center">
			<Stack px="xs" py="xl" gap="xl" w={{ base: "100%", sm: "80%", md: "50%" }}>
				<Stack gap={0} align="center" ta="center">
					<Title>
						{CONFIG.title}
					</Title>
					<Text>
						{CONFIG.desc}
					</Text>
				</Stack>

				<MessageSender />

				<MessagesList />
			</Stack>
		</Stack>
	);
}

export const MessageSender = () => {
	const [author, setAuthor] = useState("");
	const [content, setContent] = useState("");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const submit = async () => {
		setError(null);
		setLoading(true);
		try {
			const res = await fetch("/api/post", {
				body: JSON.stringify({ content, author }),
				method: "POST",
				headers: [["Content-Type", "application/json"]],
			});
		} catch(e: any) {
			setError(e);
			notifications.show({
				message: e.toString(),
				color: "red",
			});
		}
		setLoading(false);
	};

	return (
		<Stack gap="xs">
			<TextInput
				placeholder="Adın (opsiyonel)"
				value={author}
				onChange={e => setAuthor(e.currentTarget.value)}
			/>
			<Textarea
				autosize
				minRows={2}
				placeholder="Mesajın..."
				value={content}
				onChange={e => setContent(e.currentTarget.value)}
			/>
			<Group justify="space-between">
				<Text c="red">
					{error?.message}
				</Text>
				<Button
					variant="light"
					loading={loading}
					onClick={() => {
						submit()?.catch((e) => {
							console.log(e);
						}).then(() => {
							// setAuthor("");
							// setContent("");
							notifications.show({
								message: "Gönderildi! Onaylanınca gösterilecek",
							});
						})
					}}
				>
					Gönder
				</Button>
			</Group>
		</Stack>
	);
};



