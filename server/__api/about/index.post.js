import { About } from "~~/server/models/about-model";

export default defineEventHandler( async (event) => {
    const body = await readBody(event)
    const itemNew = await About.create(body)
    return {
      itemNew
    }

})