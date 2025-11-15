import { Schema, model } from "mongoose";
const SchemaData = new Schema({
  id: {
    type: String,
  },
  uid: {
    type: String,
  },
  url: {
    type: String,
  },
  type: {
    type: String,
  },
  href: {
    type: String
  },
  tags: {
    type: Array
  },
  first_publication_date: {
    type: Date
  },
  last_publication_date: {
    type: Date
  },
  slugs: {
    type: Array
  },
  lang: {
    type: String
  },
  data: {
    type: Object
  },
  
}, { 
  versionKey: false 
})

export const JournalPost = model("JournalPost", SchemaData);