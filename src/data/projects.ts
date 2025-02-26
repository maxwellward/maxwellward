interface Project {
	title: string;
	description: string;
	link: string;
	type: 'contribution' | 'own';
	details?: string;
}

export const projects: Project[] = [
	{
		title: 'Discord Package Explorer',
		description: 'Explore your Discord data package with a simple to use user interface.',
		link: 'https://github.com/peterhanania/Discord-Package',
		type: 'contribution'
	},
	{
		title: "Streamyfin",
		description: "Open source Jellyfin client for Android and iOS.",
		link: "https://github.com/streamyfin/streamyfin",
		type: 'contribution'
	},
	{
		title: 'Slothpixel API',
		description: 'A wrapper to simplify and clean up data returned by the official Hypixel Games API.',
		link: 'https://github.com/slothpixel/core',
		type: 'contribution'
	},
	// Own projects

	// THIS IS IN FIRESTORE NOW
	{
		title: 'Dogspotter',
		description: 'A mobile game based around taking photos of dogs in real life to gain points and climb the leaderboard.',
		link: 'https://github.com/maxwellward/dogspotter-mobile',
		type: 'own',
		details: "Dogspotter is a mobile-first game where players compete to spot and photograph the most dogs in the real world. Photos are submitted via a mobile app designed with Expo & React Native, and are reviewed on the web by the Dogspotter team on a reviewer panel designed with VueJS.\n\nDogspotter was initially a Discord game that used a bot to assign scores using a Google object-classifier model. But after hitting limitations with the platform and knowing that using Discord hurts the user experience and reachability (not everyone has Discord, i.e. my mother!), I created the mobile app and the infrastructure surrounding it.\n\nYou can find the original Discord bot [here](https://github.com/maxwellward/Dogspotter). You can also join the [Discord server](https://discord.gg/JFGsuaR3pG).\n\n![Example of the Dogspotter Discord bot](https://i.imgur.com/BAZltGp.png)\n\nThe original bot used Firebase as its backend, and while convienient, would eventually lead to challenges with storing a large amount of images (even if they're compressed). Due to this limitation, when creating the mobile app I hosted a [Pocketbase](https://pocketbase.io/) instance on my Homelab, as storage space is much less of a concern there."
	},
	{
		title: 'Pokémon GO Data Viewer',
		description: 'Data visualiser for Pokémon GO data packages.',
		link: 'https://github.com/maxwellward/pogo-dump-viewer',
		type: 'own'
	},
	{
		title: 'This website!',
		description: 'My portfolio, used to show off my projects and what I get up to.',
		link: 'https://github.com/maxwellward/maxwellward',
		type: 'own'
	},
	{
		title: 'Asteroids',
		description: 'A clone of the 1979 hit game "Asteroids" by Lyle Rains and Ed Logg (Atari). Built in Unity with C#.',
		link: 'https://github.com/maxwellward/Asteroids',
		type: 'own'
	},
	{
		title: 'Burnout Torches',
		description: 'A Minecraft Spigot/Paper plugin that causes torches to break and drop an item after a set time.',
		link: 'https://github.com/maxwellward/BurnoutTorches',
		type: 'own'
	}
];