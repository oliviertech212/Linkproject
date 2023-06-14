

import { makeSchema } from 'nexus'
import { join } from 'path'

import * as types from"./graphql"

export const schema = makeSchema({
//   types: [],many types we can pass
// makeSchema to use all the imports coming in from the src/graphql module.
types,
  outputs: {
    schema: join(process.cwd(), "schema.graphql"), 
    typegen: join(process.cwd(), "nexus-typegen.ts"), 
  },
})