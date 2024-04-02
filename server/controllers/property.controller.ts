import { Request, Response, NextFunction } from "express";
import Property from "../models/property.model";
import { errorHandler } from "../utils/error";

export const addProperty = async (req: Request, res: Response, next: NextFunction) => {
  const {
    photoUrls,
    name,
    description,
    address,
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
      const slug = name.split(" ").join("-").toLowerCase();
      const newProperty = new Property({
        userId,
        slug,
        photoUrls,
        name,
        description,
        address,
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

export const getProperties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const properties = await Property.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.propertyId && { _id: req.query.propertyId }),
      ...(req.query.slug && { slug: req.query.slug }),
    });
    return res.status(200).json({ properties, message: "Properties fetched successfully.", success: true });
  } catch (error) {
    next(error);
  }
};

export const editProperty = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user.id !== req.query.userId) {
    return next(errorHandler(401, "You are not allowed to edit this property"));
  }
  try {
    const {
      photoUrls,
      name,
      description,
      address,
      price,
      propertyType,
      propertyFor,
      bedrooms,
      bathrooms,
      essentials,
      features,
      safetyFeatures,
    } = req.body;
    const slug = name.split(" ").join("-").toLowerCase();
    const property = await Property.findByIdAndUpdate(
      req.params.propertyId,
      {
        $set: {
          slug,
          name,
          photoUrls,
          description,
          address,
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
        },
      },
      {
        new: true,
      }
    );
    return res.status(201).json(property);
  } catch (error) {
    next(error);
  }
};

export const removeDeletedPhotoUrl = async (req: Request, res: Response, next: NextFunction) => {
  const deletedUrl = req.body.url;
  try {
    let property = await Property.find({ _id: req.query.propertyId });
    if (!property) {
      return next(errorHandler(404, "Property not found"));
    }
    const { photoUrls } = property[0];
    const updatedPhotoUrls = photoUrls.filter((url: string) => url !== deletedUrl);
    property[0].photoUrls = updatedPhotoUrls;
    await property[0].save();
    return res.status(201).json({ message: "Photo removed.", success: true, property });
  } catch (error) {
    next(error);
  }
};
