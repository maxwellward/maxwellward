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