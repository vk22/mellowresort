import { put } from '@vercel/blob';
import ImagesService from "~~/server/services/imageService.js"
export default defineEventHandler(async (event) => {
  try {
    /// vercel blob
    const formData = await readFormData(event);
    //console.log('formData ', formData);
    const page = formData.get('page');
    const section = formData.get('section');
    const needPreview = formData.get('needPreview');
    const files = formData.getAll('file');
    console.log('section ', section);
    // console.log('files ', files);
    let uploadedPreview = false;
    // if (needPreview) {
    //   const previewBuffer = await ImagesService.geneatePreviewBuffer(files[0]);
    //   const previewFileExtantion = ImagesService.checkFileExtention(files[0].type)
    //   const filename = `${files[0].name.split('.')[0]}-prev.${previewFileExtantion}`
    //   const uploadedPreviewResponse = await ImagesService.uploadBuffer(previewBuffer, page, filename);
    //   console.log('uploadedPreviewResponse ', uploadedPreviewResponse.success)
    //   if (uploadedPreviewResponse.success) {
    //     uploadedPreview = uploadedPreviewResponse
    //   }
    // }
    const { uploadedData } = await ImagesService.uploadMany(files, page)

    // console.log('uploadedData ', uploadedData)
    // console.log('uploadedPreview ', uploadedPreview)
    console.log('section 2', section);
    return {
      success: true,
      message: 'Files uploaded',
      data: uploadedData,
      section: section,
      preview: uploadedPreview
    };

  } catch (error) {
    console.log(error);

    return {
      success: true,
      message: error.message
    };

  }

})