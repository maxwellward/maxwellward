---
title: "Dogspotter"
description: "A mobile game based around taking photos of dogs in real life to gain points and climb the leaderboard."
category: "personal"
featured: false
tags: ["Expo", "React Native"]
github: "https://github.com/maxwellward/dogspotter-mobile"
date: 2025-02-03
---

Dogspotter is a mobile-first game where players compete to spot and photograph the most dogs in the real world. Photos are submitted via a mobile app designed with Expo & React Native, and are reviewed on the web by the Dogspotter team on a reviewer panel designed with VueJS.

Dogspotter was initially a Discord game that used a bot to assign scores using a Google object-classifier model. But after hitting limitations with the platform and knowing that using Discord hurts the user experience and reachability (not everyone has Discord, i.e. my mother!), I created the mobile app and the infrastructure surrounding it.

You can find the original Discord bot [here](https://github.com/maxwellward/Dogspotter). You can also join the [Discord server](https://discord.gg/JFGsuaR3pG).

![Example of the Dogspotter Discord bot](https://i.imgur.com/BAZltGp.png) <sub>An example of the Dogspotter bot in action.</sub>

## Infrastructure

The original bot used Firebase as its backend storage solution, and while convenient (I actually use it for this site!), would eventually lead to cost-constraints with storing a large amount of images even though they're compressed. There's plenty of [horror stories](https://hackernoon.com/how-we-spent-30k-usd-in-firebase-in-less-than-72-hours-307490bd24d) of cost-runaway on Firebase, which I don't intend to add to.

Due to this limitation, when creating the mobile app I hosted a [Pocketbase](https://pocketbase.io/) instance on my Homelab, as storage space is much less of a concern there. Going this route is a little more tricky, and leaves more of the burden of data-safety on me, but it's also more fun. Because I'm not dealing with sensitive information such as billing data or addresses, this felt like a challenge worth taking on.

![An example of the Pocketbase dashboard](https://i.imgur.com/D2EKGin.png) <sub>An example of the Pocketbase dashboard. Under the hood, it exposes a simple REST API, along with a simple JS SDK.</sub>

## The Expo Experience

My first introduction to Expo was actually with the [Streamyfin](https://github.com/streamyfin/streamyfin) app, where I made some small fixes to issues that were annoying me as a user. Expo stood out to me over other cross-platform solutions as it felt a lot more natural and familiar to work with than other solutions such as Flutter or Ionic.

I have limited React Native experience even though React is something I've been interested in exploring for a while. Coming from Vue 3 as my main framework I was a little taken aback by the amount of boilerplate needed when working with React. For example, to define a reactive variable in Vue you can simply do `const name = ref<string>();`, compared to React with `const [name, setName] = useState<string>('');`

Starting small and building out from there turned out to be a valid strategy for working with Expo. It makes a lot of things easier, but at the same time has a lot of weird pitfalls that can be tough to debug. I'm working on a Mac, so I thankfully have access to both an iOS emulator and Android emulator, but it can still be tricky to verify that a change works on both platforms. This is most often apparant any time native code is changed (such as adding the Expo camera library) and a full rebuild of the app is needed, which can take upwards of 15 minutes on [EAS](https://expo.dev/) (Expo Application Services).

Overall my experience with Expo has been very positive, and I'd highly recommend it to anyone wanting to quickly get started with a cross-platform mobile app. If you're looking for the absolute best experience for your users then a native app on each platform (iOS with Swift + XCode and Android with Kotlin + Android Studio) will be better, but I think Expo is a great option for a lot of people.

## What's Next?

Dogspotter is still very much in early development. It hasn't been published to any stores yet, and the extent of my user testing is sending the Android APK to some of my friends to mess with.

I've gone through a couple of rewrites of the core structure of the app in the last few weeks while I'm learning. Which I see as a good thing, as it means I'm learning enough to look back and say "That's not a good way of doing that", and be able to fix it.

While the app isn't ready for publishing and won't be for a while, it's a super fun side-project to work on with a long list of "to-do" items to keep me busy for a long time.

The source is [available on Github](https://github.com/maxwellward/dogspotter-mobile) for anyone interested in taking a look.