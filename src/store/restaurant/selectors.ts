import { selectReviewByIds } from "../review/selectors";
import { createSelector } from "reselect";
import {RootState} from "../store";
import {Restaurant, RestaurantState} from "./index";

type RestaurantByIdProps = {
  state: RootState;
  id: Record<string, Restaurant>;
};
type RestaurantReviewProps = {
  state: RootState;
  restaurantId: string;
};

export const selectRestaurantState = (state: RootState) => state.restaurant;

export const selectRestaurantIds = (state: RootState) => selectRestaurantState(state).ids;
export const selectIsLoading = (state: RootState) =>
  selectRestaurantState(state).status === "loading";
export const selectIsFailed = (state: RootState) =>
  selectRestaurantState(state).status === "failed";
export const selectRestaurantById = ({state, id}: RestaurantByIdProps) =>
  selectRestaurantState(state).entities[id];
export const selectRestaurants = (state: RootState) =>
  Object.values(selectRestaurantState(state).entities);

const selectRestaurantReviewIds = ({state, restaurantId}: RestaurantReviewProps) => {
  // console.log(restaurantId);
  return selectRestaurantById({state, restaurantId}).reviews;
};

export const selectRestaurantRating = createSelector(
  [
    (state) => state,
    (_, restaurantId) => restaurantId,
    selectRestaurantReviewIds,
  ],
  (state, restaurantId, reviewIds) => {
    const reviews = selectReviewByIds(state, reviewIds);

    if (!reviews?.filter(Boolean).length) {
      return 0;
    }

    return Math.ceil(
      reviews.reduce((prev, curr) => prev + curr.rating, 0) / reviews.length
    );
  }
);

export const selectRestaurantReviewsById = (state: RootState, payload: Restaurant) =>
  selectRestaurantState(state)?.entities[payload.restaurantId]?.reviews || [];

export const selectRestaurantProductsById = (state, payload) =>
  selectRestaurantState(state)?.entities[payload.restaurantId]?.menu || [];

export const selectAllRestaurantProducts = (state) => {
  let arrays = Object.values(selectRestaurantState(state).entities).map(
    (id) => id.menu || []
  );
  let newArr = [];
  for (let i = 0; i < arrays.length; i++) {
    for (let j = 0; j < arrays[i].length; j++) {
      newArr.push(arrays[i][j]);
    }
  }
  return newArr;
};
export const selectRestaurantIdsFilteredByName = (state) =>
  selectRestaurantState(state).ids;
export const selectRestaurantNameById = (state, restaurantId) =>
  selectRestaurantById(state, restaurantId).name;

// const selectorTest = () => {
//   const result1 = selectResult1();
//   const result2 = selectResult2();
//
//   return result1 * result2;
// };
//
// const selectorTest = createSelector(
//   [selectResult1, selectResult2],
//   (result1, result2) => [result1 * result2]
// );
