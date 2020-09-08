import React from "react";
import { observer } from "mobx-react";

//Components
import DiscoverItem from "../DiscoverList/DiscoverItem";

//Styles
import {
  ListItem,
  Right,
  Left,
  List,
  Text,
  Button,
  Content,
  Thumbnail,
} from "native-base";

import defaultimage from "../../assets/defaultimage.png";

import { BlackTitle, TotalTrips, DTripTitle } from "./styles";

//Stores

import tripStore from "../../stores/TripStore";
import authStore from "../../stores/AuthStore";

const ProfileDetail = ({ route, navigation }) => {
  if (tripStore.loading) return <Spinner />;
  const { profile } = route.params;

  const profileTripList = tripStore.trips
    .filter((trip) => trip.userId === profile.userId)
    .map((trip) => (
      <DiscoverItem trip={trip} key={trip.id} navigation={navigation} />
    ));
  const favoriteTripList = tripStore.trips
    .filter((trip) => trip.userId === profile.userId)
    .filter((trip) => trip.favorite == true)
    .map((trip) => (
      <DiscoverItem trip={trip} key={trip.id} navigation={navigation} />
    ));
  console.log("check favorite value", favoriteTripList);
  return (
    <Content style={{ backgroundColor: "white", marginTop: 20 }}>
      <ListItem thumbnail>
        <BlackTitle>{profile.user.username}</BlackTitle>

        <Thumbnail
          style={{ marginBottom: 5, marginRight: 16 }}
          source={profile.image ? { uri: profile.image } : defaultimage}
        />
        <BlackTitle>{profile.user.firstName}</BlackTitle>
        <BlackTitle>{profile.bio}</BlackTitle>
      </ListItem>

      {profile.userId === authStore.user.id ? (
        <>
          <Button
            onPress={() =>
              navigation.navigate("EditProfileForm", { oldProfile: profile })
            }
          >
            <Text> Edit Profile</Text>
          </Button>

          <TotalTrips> Total Trips: {profileTripList.length}</TotalTrips>
        </>
      ) : (
        <TotalTrips> Total Trips: {profileTripList.length}</TotalTrips>
      )}

      <DTripTitle> My Trips</DTripTitle>

      <List>{profileTripList}</List>
      <DTripTitle> My favorite Trips</DTripTitle>

      <List>{favoriteTripList}</List>
    </Content>
  );
};

export default observer(ProfileDetail);
