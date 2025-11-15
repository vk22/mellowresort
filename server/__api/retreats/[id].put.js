import { Retreat } from "~~/server/models/retreat-model";

export default defineEventHandler( async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    console.log(' retreat api put --- body ', body);
    if (!body) return false;
    const query = getQuery(event);
    const lang = query.lang 
    console.log('retreat api PUT --- lang ', lang);
    const document = await Retreat.findById(id);
    console.log('document ', document.translations['en'].title[0])
    if (!document) return false;
    //document.translations[lang] = body;
    document.translations[lang] = body;
    const saveDoc = await document.save();
    console.log('saveDoc ', saveDoc)
    return {
      success: true,
      message: 'Data successfully saved!',
      data: saveDoc
    }
  } catch (error) {
    return {
      success: false,
      message: error
    }
  }


})