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
    const routeRaw = event.context ? event.context.params._ : undefined;
    const { route, id } = routeHandler(routeRaw)
    const lang = getQuery(event).lang;
    const document = await AdminService.get(route, id);
    console.log('document ', document)
    const pageData = (route !== 'journal' && route !== 'menu') ? document.translations[lang] : document; 
    // console.log('pageData ', pageData)
    return {
      success: true,
      data: pageData
    }
  } catch (error) {
    console.log('error ', error)
    return {
      success: false,
      message: error
    }
  }


})