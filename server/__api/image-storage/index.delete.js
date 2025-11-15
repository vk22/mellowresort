import { del } from '@vercel/blob';
import ImagesService from "~~/server/services/imageService.js"
export default defineEventHandler(async (event) => {
  try {
    /// vercel blob
    const body = await readBody(event)
    console.log('body ', body);
    const urlToDelete = body.url;
    // const result = await del(urlToDelete);
    // console.log('result ', result);
    const deleteResult = ImagesService.delete(urlToDelete);

    return deleteResult;

  } catch (error) {
    console.log(error);
    return createError({
      statusCode: 500,
      statusMessage: 'Something went wrong.',
    });
  }

})