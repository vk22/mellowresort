import { Surfing } from "~~/server/models/surfing-model";

export default defineEventHandler( async (event) => {
    const body = await readBody(event)
    const itemNew = await Surfing.create(body)
    return {
      itemNew
    }

})