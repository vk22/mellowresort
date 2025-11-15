import { Home } from "~~/server/models/home-model";

export default defineEventHandler( async (event) => {
    const body = await readBody(event)
    const itemNew = await Home.create(body)
    return {
      itemNew
    }

})