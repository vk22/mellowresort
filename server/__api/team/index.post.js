import { Team } from "~~/server/models/team-model";

export default defineEventHandler( async (event) => {
    const body = await readBody(event)
    const itemNew = await Team.create(body)
    return {
      itemNew
    }

})