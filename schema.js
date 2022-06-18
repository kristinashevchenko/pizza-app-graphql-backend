const { gql } = require("apollo-server");

const typeDefs = gql`
  type Modification {
    id: ID!
    dough: String!
    size: Int!
    price: Float!
    pizzasIds: [ID]!
  }

  type Pizza {
    id: ID!
    name: String!
    image: String!
    popularity: Int!
    kind: [String]
    modifications: [Modification!]
  }

  type Order {
    id: ID!
    totalPrice: Float!
    totalAmount: Int!
    orderedPizzas: [PizzaOrder!]
  }

  type PizzaOrder {
    dough: String!
    size: Int!
    price: Float!
    amount: Int!
    pizzaName: String!
  }

  type Query {
    pizzas: [Pizza]
    orders: [Order]
    amount: Int
  }

  type Mutation {
    createOrder(order: OrderInput!): Order
    updateAmount(amount: Int!): Int
  }

  input OrderInput {
    totalPrice: Float
    totalAmount: Int
    orderedPizzas: [PizzaOrderInput]
  }

  input PizzaOrderInput {
    dough: String
    size: Int
    price: Float
    amount: Int
    pizzaName: String
  }

  type Subscription {
    amountUpdated: Int
  }
`;

module.exports = typeDefs;
