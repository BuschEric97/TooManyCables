import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  game: a
    .model({
      collectionId: a.id(),
      collection: a.belongsTo("gamelist", "collectionId"),
      name: a.string().required(),
      platform: a.string(),
      // NYP = Not Yet Played, UNF = Unfinished
      // CPL = Completed, FPL = Fully 100% Completed
      // NDL = Endless (Cannot be Finished)
      status: a.enum(["NYP", "UNF", "CPL", "FPL", "NDL"]),
      notes: a.string(),
    }),
  gamelist: a
    .model({
      games: a.hasMany("game", "collectionId"),
      tags: a.string().array(),
      ispublic: a.boolean(),
      listname: a.string().required(),
      userId: a.id().required(),
    }),
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