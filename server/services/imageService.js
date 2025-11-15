import { put, del } from '@vercel/blob';
//import sharp from 'sharp';
//import { handleUpload } from '@vercel/blob/client';

class ImagesService {
  constructor() {
  }
//   async geneatePreviewBuffer(file) {
//     const buffer = Buffer.from(await file.arrayBuffer());
//     return await sharp(buffer).resize({ width: 1200, height: 630 }).toBuffer();
//   }
  checkFileExtention(mime) {
    const types = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png'
    }
    return types[mime];
  }
  async uploadBuffer(buffer, type, filename) {
    // console.log('upload file ', file)
    try {
      // const blob = new Blob([file], { type: file.type });
      const data = await put(`${type}/${filename}`, buffer, { access: 'public', addRandomSuffix: true });
      // console.log('uploadBuffer data ', data)
      return {
        success: true,
        url: data.url,
        type: data.contentType,
        section: type
      }

    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
  async upload(file, page) {
    // console.log('upload file ', file)
    try {
      const blob = new Blob([file], { type: file.type });
      const data = await put(`${page}/${file.name}`, blob, { access: 'public', addRandomSuffix: true });
      return {
        success: true,
        data: data
      }

    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
  async uploadMany(files, page) {
    let uploadedData = [];
    let success = true;
    for (let file of files) {
      const uploadOne = await this.upload(file, page);
      // console.log('uploadMany upload one ', uploadOne)
      if (uploadOne.success) {
        uploadedData.push({
          success: true,
          url: uploadOne.data.url,
          type: file.type,
          page: page
        })
      } else {
        success = false
        uploadedData.push({
          success: false,
          file: file.name
        })
      }
    }

    return {
      uploadedData: uploadedData
    }

  }
  async delete(url) {
    try {
      const data = await del(url);
      console.log('Image delete ', data);
      return {
        success: true,
        data: data,
        message: "Image deleted"
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }

  }

}
export default new ImagesService();