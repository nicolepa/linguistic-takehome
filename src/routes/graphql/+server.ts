import { createYoga, createSchema } from 'graphql-yoga';
import { useGraphQlJit } from '@envelop/graphql-jit';

import type { RequestEvent } from '@sveltejs/kit';

import { users } from '$lib/data';

import schema from '$lib/schema.gql';

const yogaApp = createYoga<RequestEvent>({
	schema: createSchema({
		typeDefs: schema,
		resolvers: {
			Query: {
				users: (source, { query, offset, limit }, context, info) => {
					let searchResults = users;
					const sanitizedQuery = query.trim().toLowerCase();
					if (sanitizedQuery.length > 0) {
						searchResults = users.filter((user) => {
							return user.name.toLowerCase().includes(sanitizedQuery);
						});
					}
					return searchResults.slice(offset, offset + limit);
				}
			}
		}
	}),
	plugins: [useGraphQlJit()],
	fetchAPI: globalThis
});

export { yogaApp as GET, yogaApp as POST };
