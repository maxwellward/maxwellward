---
title: "Shockbyte Control Panel"
description: "The control panel for Shockbyte customers to interact with their servers in an intuitive but powerful way."
category: "professional"
featured: true
tags: ["TypeScript", "Vue"]
website: "https://shockbyte.com"
date: 2024-01-01
---

One of my key projects while working at Shockbyte (2020-2024) was the new [Shockbyte control panel](https://shockbyte.com/panel). Shockbyte used to use Multicraft as their user-facing panel, but it was quickly becoming antiquated, expensive, and lacking features provided by many competitors.

The choice of what to upgrade to was not a simple one. While there's realistically only two options - Pterodactyl, or a custom panel -, once we commit to one, it would be very hard to later switch to the other.

Ultimately the decision was made to build our own control panel from scratch. From the backend server provisioning tools to the frontend control panel, everything was written and designed by us to be an industry-standard in whats possible for game server hosting.

## My Contributions

While I was mainly working on the frontend, I dabbled in the backend from time to time. As for the frontend, I had a hand in almost everything you can see, with my key contributions being the file manager, console optimizations, authentication flow, settings page, and modpack/plugin installers.

![Example of the Shockbyte control panel](https://i.imgur.com/zkVyNab.png) <sub>The Shockbyte control panel main screen, an overview of your server.</sub>

Other notable frontend parts of the panel that I had a major hand in are:
- Instances
- Sharing & Collaboration Controls
- Audit Logs
- Port Management
- Backup Management
- Database Management
- Plan Management
- Shockbyte Staff Tools & Customer Support Portal

I was also the frontend architect for the staff-only dashboard for managing available games, versions, and server types. This was a completely separate site to the customer-facing dashboard, and involved complex design requirements to allow the game version management teams to add support for virtually any game that supported dedicated servers (and some that don't!) with minimal to no developer involvement or manually written code.

I was also involved in training new staff to work with our codebase, and acting as a mentor to junior developers who joined our team. I'm very thankful to have had the opportunity to work with and mentor some of the most amazing junior developers one could ask for, along with the rest of my team at Shockbyte who were always going above and beyond to do the best work they could, and having a great time doing it.

![The Control Panel team in 2023](https://i.imgur.com/Yheq4ny.jpeg)<sub>The Control Panel team as we were in 2023, during the company 10th anniversary meetup in London, England.</sub>