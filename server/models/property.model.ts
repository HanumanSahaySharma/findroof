import mongoose, { Schema, Document } from "mongoose";

export interface IAmenities {
  essentials: string[];
  features: string[];
  safety: string[];
}

export interface IProperty extends Document {
  userId: string;
  images: string[];
  name: string;
  description: string;
  price: number;
  propertyType: string;
  propertyFor: string;
  bedrooms: number;
  bathrooms: number;
  amenities: IAmenities;
}

const amenitiesSchema = new Schema<IAmenities>({
  essentials: {
    type: [String],
    default: [],
  },
  features: {
    type: [String],
    default: [],
  },
  safety: {
    type: [String],
    default: [],
  },
});

const propertySchema = new Schema<IProperty>(
  {
    userId: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
    },
    propertyFor: {
      type: String,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    amenities: amenitiesSchema,
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.models.Property || mongoose.model<IProperty>("Property", propertySchema);

export default Property;
