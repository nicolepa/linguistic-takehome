### Instructions
No additional instructions are needed to run this modified app. As before:
- First, ensure you are using a recent version of Node and have Git installed
- Next, clone this repo
- Then navigate to the repo and install dependencies
- Finally, run the app: run `npm run dev` and open http://localhost:5173/

### Implementation
I initially approached the challenge by implementing the infinite scroll feature. Using an observer on an element at the bottom of the page (`infinite-scroll-end`), I trigger a request to load and display more users whenever that observer is triggered, meaning that the user has scrolled to the bottom of the current page.

I start at page 0, which is the initial 10 users that we load by default. Then, whenever the user hits the bottom of the page, we make a call to the GraphQL server to give us an additional 10 users, and accordingly increment the page by 1. We do this for every scroll to the bottom, until there are no more users that can be retrieved. We use the `page`,`offset`, and `limit` variables to implement this logic.

I then started thinking about how to extend this by adding search functionality.

I added a search bar to capture the user's search input, and modified the GraphQL query to pass the search query to the server as well. On the server side, instead of returning all users, if we detect that there is a search query, we will filter users' names based on the search query if it is passed, to only return users whose names partially match that of the query. To make sure this does not collide with the infinite scroll logic when we are searching for a name, we reset the page to 0 whenever we detect that a search query has changed, to make sure we return the initial 10 search matches, and clear any results from the previous search.

There are some things I would add if I had more time and could better familiarize myself with Svelte and GraphQL: extract the limit (default is 10) to a config, so that we could more easily change it if needed; make searching more user-friendly, by maybe implementing search-as-we-type and by improving styling on the search input box; and implement full test coverage.
