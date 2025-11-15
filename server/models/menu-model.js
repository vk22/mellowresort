import { Schema, model } from "mongoose";
const SchemaData = new Schema({
  _id: {
    type: String,
  },
  data: {
    type: Object,
  },
}, { 
  versionKey: false 
})

export const Menu = model("Menu", SchemaData);