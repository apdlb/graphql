import gql from 'graphql-tag';

export const ENTITIES_CONNECTION_QUERY = gql`
  query EntitiesConnection(
    $first: Int
    $skip: Int
    $after: String
    $orderBy: EntityOrderByInput
  ) {
    entities: entitiesConnection(
      first: $first
      skip: $skip
      after: $after
      orderBy: $orderBy
    ) {
      pageInfo {
        startCursor
        endCursor
      }
      edges {
        node {
          id
          field1
          field2
          field3
        }
      }
    }
    entitiesConnection {
      aggregate {
        count
      }
    }
  }
`;

export const DELETE_ENTITY_MUTATION = gql`
  mutation DeleteEntity($id: ID) {
    deleteEntity(where: { id: $id }) {
      id
    }
  }
`;
