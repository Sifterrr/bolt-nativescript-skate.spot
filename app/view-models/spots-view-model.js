import { Observable } from '@nativescript/core';
import { Spot } from '../models/spot';

export class SpotsViewModel extends Observable {
    constructor() {
        super();
        
        // Initialize default values
        this.latitude = 34.0522; // Los Angeles
        this.longitude = -118.2437;
        this.zoom = 12;
        
        // Initialize spots with some famous skateboarding locations
        this.spots = [
            new Spot({
                trickName: "360 Flip",
                locationName: "Venice Beach Skatepark",
                description: "Historic beachfront skatepark, smooth concrete",
                photoUrl: "~/images/placeholder.jpg",
                lat: 33.9850,
                lng: -118.4695
            }),
            new Spot({
                trickName: "Kickflip",
                locationName: "Stoner Skate Plaza",
                description: "Modern street plaza with perfect ledges",
                photoUrl: "~/images/placeholder.jpg",
                lat: 34.0369,
                lng: -118.4529
            })
        ];
    }
}