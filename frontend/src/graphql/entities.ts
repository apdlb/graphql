import gql from 'graphql-tag';

export const ENTITIES_CONNECTION_QUERY = gql`
  query EntitiesConnection(
    $skip: Int
    $pageSize: Int
    $orderBy: EntityOrderByInput
  ) {
    entitiesConnection(skip: $skip, first: $pageSize, orderBy: $orderBy) {
      edges {
        node {
          id
          field1
          field2
          field3
        }
      }
      aggregate {
        count
      }
    }
  }
`;
