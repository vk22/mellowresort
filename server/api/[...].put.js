import AdminService from "~~/server/services/adminService.js"

const routeHandler = (string) => {
  return {
    route: string.split('/')[0],
    id: string.split('/')[1]
  }
}

export default defineEventHandler( async (event) => {
  try {
    // console.log('event.context ', event.context)
    const body = await readBody(event);
    if (!body) return false;
    const routeRaw = event.context ? event.context.params._ : undefined;
    const { route, id } = routeHandler(routeRaw)
    const lang = getQuery(event).lang;
    const response  = await AdminService.update(route, id, lang, body);
    return response;

  } catch (error) {
    console.log('error ', error)
    return {
      success: false,
      message: error
    }
  }
})