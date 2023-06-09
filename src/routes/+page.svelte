<script lang="ts">
	import { cacheExchange, createClient, fetchExchange, gql } from '@urql/svelte';
	import Loader from 'components/Loader.svelte';
	import User from 'components/User.svelte';
	import type { UserType } from 'lib/types';
	import { onDestroy, onMount } from 'svelte';

	const client = createClient({
		url: '/graphql',
		exchanges: [cacheExchange, fetchExchange]
	});

	const limit = 10;
	let page = 0;
	let infiniteScrollUsersArr: UserType[] = [];
	let fetching = false;
	let searchTerm = '';
	let prevSearch = '';

	const loadUsers = () => {
		if (fetching) return;

		if (prevSearch !== searchTerm) {
			page = 0;
			infiniteScrollUsersArr = [];
		}
		prevSearch = searchTerm;

		fetching = true;
		client
			.executeQuery({
				query: gql`
					query ($query: String, $offset: Int, $limit: Int) {
						users(query: $query, offset: $offset, limit: $limit) {
							id
							name
							avatar
							email
						}
					}
				`,
				variables: {
					offset: page * limit,
					limit: limit,
					query: searchTerm
				},
				key: `users-page-${searchTerm}-${page}`
			})
			.toPromise()
			.then((result) => {
				const data = result.data;
				if (data && data.users && data.users.length > 0) {
					infiniteScrollUsersArr = [...infiniteScrollUsersArr, ...data.users];
					page++;
				}
			})
			.finally(() => {
				fetching = false;
			});
	};

	let observer: IntersectionObserver;

	onMount(() => {
		observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				loadUsers();
			}
		});

		observer.observe(document.querySelector('#infinite-scroll-end')!);
	});

	onDestroy(() => {
		if (observer) {
			observer.disconnect();
		}
	});
</script>

<div class="w-full h-full overflow-scroll">
	<div class="flex flex-col gap-4 items-center p-4">
		<div>
			<input type="text" bind:value={searchTerm} placeholder="Search users" />
			<button on:click={loadUsers}>Search</button>
		</div>
		{#each infiniteScrollUsersArr as user}
			<User {user} />
		{/each}
		{#if fetching}
			<Loader />
		{/if}
	</div>
	<div id="infinite-scroll-end" />
</div>
