import { Request, Response, NextFunction } from "express";
import Property from "../models/property.model";
import { errorHandler } from "../utils/error";

export const addProperty = async (req: Request, res: Response, next: NextFunction) => {
  const { images, name, description, price, propertyType, propertyFor, bedrooms, bathrooms, amenities } = req.body;
  try {
    const userId = req.user.id;
    const property = await Property.findOne({ name });
    if (property) {
      return next(errorHandler(401, "This property is already added for the listing."));
    }
    if (!property) {
      const newProperty = new Property({
        userId,
        images,
        name,
        description,
        price,
        propertyType,
        propertyFor,
        bedrooms,
        bathrooms,
        amenities: {
          essentials: amenities.essentials,
          features: amenities.features,
          safety: amenities.safety,
        },
      });
      await newProperty.save();
      return res.status(201).json({ message: "New property added successfully.", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
