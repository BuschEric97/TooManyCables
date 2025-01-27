import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  game: a
    .model({
      gameId: a.id().required(),
      collectionId: a.id(),
      collection: a.belongsTo("gamelist", "collectionId"),
      name: a.string().required(),
      platform: a.string(),
      status: a.enum(["Unplayed", "Unfinished", "Completed", "FullyCompleted"]),
      notes: a.string(),
    })
    .identifier(["gameId"]),
  gamelist: a
    .model({
      games: a.hasMany("game", "collectionId"),
      tags: a.string().array(),
      gamelistId: a.id().required(),
      collectionId: a.id(),
      collection: a.belongsTo("usergamelists", "collectionId"),
    })
    .secondaryIndexes((index) => [index("gamelistId")]),
  usergamelists: a
    .model({
      gamelists: a.hasMany("gamelist", "collectionId"),
      listname: a.string().required(),
      listId: a.id().required(),
      userId: a.id().required(),
    })
    .identifier(["listId"]),
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