import { Schema, model } from "mongoose";
const SchemaData = new Schema({
  _id: {
    type: String,
  },
  translations: {
      en: {
        type: Object,
      },
      es: {
        type: Object,
      },
      fr: {
        type: Object,
      }
  },
  published: {
    type: Boolean,
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
}, { 
  versionKey: false 
})

export const Retreat = model("Retreat", SchemaData);