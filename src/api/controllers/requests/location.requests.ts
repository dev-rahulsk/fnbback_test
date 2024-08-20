import { Request, Response } from "express";
import { ILocation } from "../../types/location.type";
import Location from "../../models/location.model";
import User from "../../models/user.model";

// Location Controller Class
class LocationControllers {
  // Method to create a new location
  async add(req: Request, res: Response) {
    try {
      const { type, address, coordinates }: ILocation = req.body;
      const user = req.user as any;
      const defaultLocation = await Location.findOne({
        userId: user._id,
        type: "Default",
      });

      if (defaultLocation && !type) {
        return res.status(400).send("type is Required");
      }

      if (type) {
        const location = new Location({
          userId: user._id,
          type,
          address,
          coordinates,
        });
        await location.save();
      } else {
        const location = new Location({
          userId: user._id,
          type: "Default",
          address,
          coordinates,
        });
        await location.save();
      }

      res.status(201).json({
        message: "Location Added successfully",
        location,
      });
    } catch (error) {
        console.log("error",error)
      res.status(500).json({
        message: "Error creating location",
      });
    }
  }
}

const LocationController = new LocationControllers();
export default LocationController;
