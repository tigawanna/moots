import "dotenv/config";
import Pocketbase from "pocketbase";
import fs from "fs/promises";
import { Schema, UsersCreate, WatchlistItemsCreate, WatchlistsCreate } from "../types/pb-types";
import { TypedPocketBase } from "@tigawanna/typed-pocketbase";
import { faker } from "@faker-js/faker";


const url = process.env.EXPO_PUBLIC_PB_URL;
const email = process.env.PB_TYPEGEN_EMAIL;
const password = process.env.PB_TYPEGEN_PASSWORD;

async function seedDatabase() {
  if (!url) {
    throw new Error("Missing required environment variables: PB_URL, PB_EMAIL, PB_PASSWORD");
  }
  const pb = new TypedPocketBase<Schema>(url);
  if (!email || !password) {
    throw new Error("Missing required environment variables: PB_URL, PB_EMAIL, PB_PASSWORD");
  }
  await pb.from("_superusers").authWithPassword(email, password);
  // seeding users
  await seedUsers(pb);
  const users = await pb.from("users").getFullList();
}

export async function seedUsers(pb: TypedPocketBase<Schema>) {
  const batch = pb.fromBatch();
  await batch.send();
  for (let i = 0; i < 10; i++) {
    const dummyUserEmail = faker.internet.email();
    const user: UsersCreate = {
      email: dummyUserEmail,
      password: dummyUserEmail,
      passwordConfirm: dummyUserEmail,
      username: faker.person.firstName(),
      avatarUrl: faker.image.avatar(),
      name: faker.person.fullName(),
    };
    batch.from("users").create(user);
  }
  await batch.send();
}


async function seedWatchList(pb: TypedPocketBase<Schema>, userId: string) {
  const batch = pb.fromBatch();
  await batch.send();

 const watchlistItem: WatchlistItemsCreate = {
    mediaType: faker.helpers.arrayElement(['movie', 'tv_show']),
    traktId: faker.number.int({ min: 1000, max: 9999 }),
    title: faker.lorem.sentence(),
    year: faker.date.past().getFullYear(),
    slug: faker.lorem.slug(),
    personalNote: faker.lorem.sentence(),
    status: ['plan_to_watch'],
    rating: faker.number.float({ min: 1, max: 10, }),
  };
  const watchlist: WatchlistsCreate = {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    owner: userId,
    isPublic: faker.datatype.boolean(),
    category: faker.helpers.arrayElement(['movies', 'tv_shows', 'mixed']),
    coverImage: [faker.image.avatar()],
    tags: [faker.lorem.word(), faker.lorem.word()],   
  };

  const createdWatchlist = await pb.from("watchlists").create(watchlist);
  console.log("Created Watchlist:", createdWatchlist);
}
