import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  game: a
    .model({
      gameId: a.id().required(),
      collectionId: a.id(),
      collection: a.belongsTo("gamelist", "collectionId"),
      name: a.string().required(),
      platform: a.string(),
      status: a.enum(["Not yet played", "Unfinished", "Completed", "100% Completed"]),
      notes: a.string(),
    })
    .identifier(["gameId"]),
  gamelist: a
    .model({
      games: a.hasMany("game", "collectionId"),
      tags: a.string().array(),
      gamelistId: a.id().required(),
    })
    .secondaryIndexes((index) => [index("gamelistId")]),
})
.authorization((allow) => [allow.publicApiKey()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});