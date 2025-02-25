import mongoose, { Document, Schema } from "mongoose";

export interface Concept extends Document {
  name: string;
  slug: string;
  description: string;
  category: "fundamentals" | "intermediate" | "advanced";
  language: "typescript" | "javascript" | "all";
  order: number;
  dependencies?: string[]; // concepts that should be learned first
  resources: {
    title: string;
    url: string;
    type: "article" | "video" | "documentation";
  }[];
}

const ConceptSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["fundamentals", "intermediate", "advanced"],
      required: true,
    },
    language: {
      type: String,
      enum: ["typescript", "javascript", "all"],
      required: true,
    },
    order: { type: Number, required: true },
    dependencies: [String],
    resources: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        type: {
          type: String,
          enum: ["article", "video", "documentation"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

export const ConceptModel = mongoose.model<Concept>("Concept", ConceptSchema);
