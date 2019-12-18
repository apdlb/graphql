import CONSTANTS from '../utils/constants';

export const initialPaginationValues = {
  skip: 0,
  orderBy: `id_${CONSTANTS.ORDER_ASC}`,
  current: 1,
  pageSize: CONSTANTS.PAGE_SIZE_5,
  total: 0
};

export const paginationReducer = (state: any, action: any) => {
  switch (action.type) {
    case "total":
      return { ...state, total: action.payload };
    case "sort":
      if (action.payload) {
        return { ...state, orderBy: action.payload };
      } else {
        const { orderBy, ...rest } = state;
        return rest;
      }
    case "page":
      return {
        ...state,
        current: action.payload,
        skip: action.payload * state.pageSize - state.pageSize
      };
    case "deleteRecord":
      return {
        ...state,
        current: action.payload.current,
        skip: action.payload.skip,
        total: action.payload.total
      };
    case "reset": {
      return initialPaginationValues;
    }
    default:
      return state;
  }
};
