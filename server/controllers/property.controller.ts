import { Request, Response, NextFunction } from "express";
import Property from "../models/property.model";
import { errorHandler } from "../utils/error";

export const addProperty = async (req: Request, res: Response, next: NextFunction) => {
  const {
    photoUrls,
    name,
    description,
    price,
    propertyType,
    propertyFor,
    bedrooms,
    bathrooms,
    essentials,
    features,
    safetyFeatures,
  } = req.body;
  try {
    const userId = req.user.id;
    const property = await Property.findOne({ name });
    if (property) {
      return next(errorHandler(401, "This property is already added for the listing."));
    }
    if (!property) {
      const newProperty = new Property({
        userId,
        photoUrls,
        name,
        description,
        price,
        propertyType,
        propertyFor,
        bedrooms,
        bathrooms,
        amenities: {
          essentials,
          features,
          safetyFeatures,
        },
      });
      await newProperty.save();
      return res.status(201).json({ message: "New property added successfully.", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
