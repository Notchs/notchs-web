import type { StaticImageData } from "next/image";

import bowlingBalls from "./assets/photos/bowling-balls.jpg";
import bowling from "./assets/photos/bowling.jpg";
import cafeDessert from "./assets/photos/cafe-dessert.jpg";
import cafeLatte from "./assets/photos/cafe-latte.jpg";
import cafeLights from "./assets/photos/cafe-lights.jpg";
import cafeModern from "./assets/photos/cafe-modern.jpg";
import cafeWarm from "./assets/photos/cafe-warm.jpg";
import cafe from "./assets/photos/cafe.jpg";
import courtBasketball from "./assets/photos/court-basketball.jpg";
import courtOutdoor from "./assets/photos/court-outdoor.jpg";
import courtTennis from "./assets/photos/court-tennis.jpg";
import gymCardio from "./assets/photos/gym-cardio.jpg";
import gym from "./assets/photos/gym.jpg";
import peopleCafePhone from "./assets/photos/people-cafe-phone.jpg";
import peopleFriends from "./assets/photos/people-friends.jpg";
import peopleHangout from "./assets/photos/people-hangout.jpg";
import peoplePhone from "./assets/photos/people-phone.jpg";
import peopleSelfieGroup from "./assets/photos/people-selfie-group.jpg";
import peopleSelfie from "./assets/photos/people-selfie.jpg";
import peopleSunset from "./assets/photos/people-sunset.jpg";
import peopleTablePhones from "./assets/photos/people-table-phones.jpg";
import pickleballBalls from "./assets/photos/pickleball-balls.jpg";
import pickleballCourts from "./assets/photos/pickleball-courts.jpg";
import pickleball from "./assets/photos/pickleball.jpg";
import snookerIndoor from "./assets/photos/snooker-indoor.jpg";
import snooker from "./assets/photos/snooker.jpg";
import turfCricket from "./assets/photos/turf-cricket.jpg";
import turfFutsal from "./assets/photos/turf-futsal.jpg";
import turf from "./assets/photos/turf.jpg";

/**
 * Landing photos as static imports, so Next knows their size, gives each a
 * blur placeholder and serves them from hashed, long-cached URLs.
 */
export const photoFiles = {
  "bowling-balls.jpg": bowlingBalls,
  "bowling.jpg": bowling,
  "cafe-dessert.jpg": cafeDessert,
  "cafe-latte.jpg": cafeLatte,
  "cafe-lights.jpg": cafeLights,
  "cafe-modern.jpg": cafeModern,
  "cafe-warm.jpg": cafeWarm,
  "cafe.jpg": cafe,
  "court-basketball.jpg": courtBasketball,
  "court-outdoor.jpg": courtOutdoor,
  "court-tennis.jpg": courtTennis,
  "gym-cardio.jpg": gymCardio,
  "gym.jpg": gym,
  "people-cafe-phone.jpg": peopleCafePhone,
  "people-friends.jpg": peopleFriends,
  "people-hangout.jpg": peopleHangout,
  "people-phone.jpg": peoplePhone,
  "people-selfie-group.jpg": peopleSelfieGroup,
  "people-selfie.jpg": peopleSelfie,
  "people-sunset.jpg": peopleSunset,
  "people-table-phones.jpg": peopleTablePhones,
  "pickleball-balls.jpg": pickleballBalls,
  "pickleball-courts.jpg": pickleballCourts,
  "pickleball.jpg": pickleball,
  "snooker-indoor.jpg": snookerIndoor,
  "snooker.jpg": snooker,
  "turf-cricket.jpg": turfCricket,
  "turf-futsal.jpg": turfFutsal,
  "turf.jpg": turf,
} satisfies Record<string, StaticImageData>;

export type PhotoFile = keyof typeof photoFiles;
