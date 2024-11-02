export class Spot {
    constructor(data = {}) {
        this.id = data.id || Date.now().toString();
        this.trickName = data.trickName || '';
        this.locationName = data.locationName || '';
        this.description = data.description || '';
        this.photoUrl = data.photoUrl || '';
        this.lat = data.lat || 0;
        this.lng = data.lng || 0;
        this.createdAt = data.createdAt || new Date();
    }
}