import { Retreat } from "~~/server/models/retreat-model";

export default defineEventHandler( async (event) => {
    const body = await readBody(event)
    const itemNew = await Retreat.create(body)
    return {
      itemNew
    }

})