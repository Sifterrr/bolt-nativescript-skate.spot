import { Geolocation } from '@nativescript/geolocation';
import { Camera } from '@nativescript/camera';
import { request, hasPermission } from '@nativescript/core/permissions';

export async function requestPermissions() {
    try {
        // Check and request location permissions
        const hasLocation = await hasPermission('android.permission.ACCESS_FINE_LOCATION');
        if (!hasLocation) {
            await request('android.permission.ACCESS_FINE_LOCATION');
        }

        // Check and request camera permissions
        const hasCamera = await hasPermission('android.permission.CAMERA');
        if (!hasCamera) {
            await request('android.permission.CAMERA');
        }

        // Enable location
        await Geolocation.enableLocationRequest(true);
        
        return true;
    } catch (err) {
        console.error('Error requesting permissions:', err);
        return false;
    }
}