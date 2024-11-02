import { SpotsViewModel } from './view-models/spots-view-model';
import { Geolocation } from '@nativescript/geolocation';
import { Camera } from '@nativescript/camera';
import { Spot } from './models/spot';

export function onNavigatingTo(args) {
    const page = args.object;
    const vm = new SpotsViewModel();

    vm.onMapReady = (args) => {
        const mapView = args.object;
        
        // Add markers for each spot
        vm.spots.forEach(spot => {
            mapView.addMarkers([{
                lat: spot.lat,
                lng: spot.lng,
                title: spot.trickName,
                subtitle: spot.description,
                onCalloutTap: () => {
                    console.log('Marker tapped:', spot.trickName);
                }
            }]);
        });
    };

    vm.onAddSpot = async () => {
        try {
            const location = await Geolocation.getCurrentLocation({
                desiredAccuracy: 3,
                maximumAge: 5000,
                timeout: 10000
            });

            const image = await Camera.takePicture({
                width: 300,
                height: 300,
                keepAspectRatio: true,
                saveToGallery: true
            });

            const newSpot = new Spot({
                trickName: "New Trick",
                locationName: "Current Location",
                description: "Added just now",
                photoUrl: image.android || image.ios,
                lat: location.latitude,
                lng: location.longitude
            });

            vm.spots.unshift(newSpot);
            vm.notifyPropertyChange('spots', vm.spots);
        } catch (err) {
            console.error('Error adding spot:', err);
        }
    };

    vm.onSpotTap = (args) => {
        const spot = vm.spots[args.index];
        vm.set('latitude', spot.lat);
        vm.set('longitude', spot.lng);
        vm.set('zoom', 18);
    };

    page.bindingContext = vm;
}