import { OurPlace } from "~~/server/models/our-place-model";

export default defineEventHandler( async (event) => {
    const body = await readBody(event)
    const itemNew = await OurPlace.create(body)
    return {
      itemNew
    }

})