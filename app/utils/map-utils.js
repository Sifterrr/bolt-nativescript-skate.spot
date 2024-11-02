import { Utils } from '@nativescript/core';

// Initialize map module for Android
if (global.isAndroid) {
    // Request required permissions on app startup
    const REQUEST_REQUIRED_PERMISSIONS = 'android.permission.ACCESS_FINE_LOCATION';
    
    const context = Utils.android.getApplicationContext();
    const launchIntent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
    const componentName = launchIntent.getComponent();
    
    // Clear the task
    launchIntent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK | android.content.Intent.FLAG_ACTIVITY_CLEAR_TASK);
    launchIntent.setComponent(componentName);
}