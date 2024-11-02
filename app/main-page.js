import { Observable } from '@nativescript/core';
import { Geolocation } from '@nativescript/geolocation';
import { Camera } from '@nativescript/camera';
import { request, hasPermission } from '@nativescript/core/permissions';

export function onNavigatingTo(args) {
    const page = args.object;
    const vm = new Observable();

    // Initialize with sample data
    vm.spots = [
        {
            id: '1',
            trickName: '360 Flip',
            locationName: 'Venice Beach Skatepark',
            coordinates: '33.9850°N, 118.4695°W',
            photoUrl: '~/images/placeholder.png',
            lat: 33.9850,
            lng: -118.4695
        }
    ];

    vm.onAddSpot = async () => {
        try {
            // Request permissions
            const hasLocationPerm = await hasPermission('android.permission.ACCESS_FINE_LOCATION');
            const hasCameraPerm = await hasPermission('android.permission.CAMERA');

            if (!hasLocationPerm) {
                await request('android.permission.ACCESS_FINE_LOCATION');
            }
            if (!hasCameraPerm) {
                await request('android.permission.CAMERA');
            }

            // Get location
            const location = await Geolocation.getCurrentLocation({
                desiredAccuracy: 3,
                maximumAge: 5000,
                timeout: 10000
            });

            // Take photo
            const image = await Camera.takePicture({
                width: 300,
                height: 300,
                keepAspectRatio: true,
                saveToGallery: true
            });

            // Add new spot
            const newSpot = {
                id: Date.now().toString(),
                trickName: 'New Trick',
                locationName: 'New Spot',
                coordinates: `${location.latitude.toFixed(4)}°N, ${location.longitude.toFixed(4)}°W`,
                photoUrl: image.android || image.ios,
                lat: location.latitude,
                lng: location.longitude
            };

            vm.spots.unshift(newSpot);
            vm.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: 'spots' });
        } catch (err) {
            console.error('Error adding spot:', err);
        }
    };

    vm.onSpotTap = (args) => {
        const spot = vm.spots[args.index];
        console.log('Spot tapped:', spot.trickName);
    };

    page.bindingContext = vm;
}