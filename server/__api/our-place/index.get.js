import { OurPlace } from "~~/server/models/our-place-model";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const lang = query.lang // "en" / "es" / "fr"
    // console.log('home api GET', lang)
    const document = await OurPlace.findById('our-place');
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
