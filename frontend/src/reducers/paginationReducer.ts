import CONSTANTS from '../utils/constants';

export const initialPaginationValues = {
  skip: 0,
  current: 1,
  pageSize: CONSTANTS.PAGE_SIZE_2
};

export const paginationReducer = (state: any, action: any) => {
  switch (action.type) {
    case "page":
      const newState = {
        ...state,
        current: action.payload.current,
        skip: (action.payload.current - 1) * state.pageSize
      };
      if (action.payload.orderBy) {
        return newState.orderBy;
      } else {
        delete newState.orderBy;
      }
      return newState;
    case "deleteRecord":
      return {
        ...state,
        current: action.payload.current,
        skip: action.payload.skip,
        total: action.payload.total
      };
    case "reset":
      return initialPaginationValues;

    default:
      return state;
  }
};
