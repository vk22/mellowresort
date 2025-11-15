import { Retreat } from "~~/server/models/retreat-model";

export default defineEventHandler(async (event) => {
  try {
    // const id = getRouterParam(event, "id");
    const query = getQuery(event);
    const lang = query.lang // "en" / "es" / "fr"
    // console.log('retreat api GET id', id)
    console.log('retreat api GET query', query)
    const document = await Retreat.findById(id);
    const pageData = document.translations[lang];
    return {
      success: true,
      data: pageData
    }
  } catch (error) {
    return {
      success: false,
      message: error
    }
  }

})
