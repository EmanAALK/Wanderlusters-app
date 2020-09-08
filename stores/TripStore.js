import { decorate, observable } from "mobx";
import instance from "./instance";
import authStore from "./AuthStore";

class TripStore {
  trips = [];
  loading = true;

  fetchTrips = async () => {
    //error handler
    try {
      const response = await instance.get("/trips");
      // console.log("NailStore -> fetchItems -> error", response); // test to see where data come from
      this.trips = response.data;
      this.loading = false;
    } catch (error) {
      console.log("TripStore -> fetchTrips -> error", error);
    }
  };

  updateTrip = async (updatedTrip) => {
    try {
      const formData = new FormData();
      for (const key in updatedTrip) formData.append(key, updatedTrip[key]);
      await instance.put(`/trips/${updatedTrip.id}`, formData);
      const trip = this.trips.find((trip) => trip.id === updatedTrip.id);

      for (const key in updatedTrip) trip[key] = updatedTrip[key];
      // trip.image = URL.createObjectURL(updatedTrip.image);
    } catch (error) {
      console.log("TripStore -> updatedTrip -> error", error);
    }
  };

  createTrip = async (newTrip) => {
    try {
      const formData = new FormData();
      for (const key in newTrip) formData.append(key, newTrip[key]);
      const res = await instance.post(`/${newTrip.userId}/trips`, formData);
      this.trips.push({
        ...res.data,
        user: { username: authStore.user.username },
      });
    } catch (error) {
      console.log("TripStore -> createTrip -> error ", error);
    }
  };

  deleteTrip = async (tripId) => {
    try {
      await instance.delete(`/trips/${tripId}`);
      this.trips = this.trips.filter((trip) => trip.id !== tripId);
    } catch (error) {
      console.log("TripStore -> deleteTrip -> error ", error);
    }
  };
}

decorate(TripStore, {
  trips: observable,
  loading: observable,
});

const tripStore = new TripStore();
tripStore.fetchTrips();
export default tripStore;
