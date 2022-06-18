const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { PubSub } = require("graphql-subscriptions");
const orders = require("./mocks/orders.json");
const pizzas = require("./mocks/pizzas.json");
const modifications = require("./mocks/modifications.json");

let amount = 1000;

const pubsub = new PubSub();

const resolvers = {
  Query: {
    orders: () => orders,
    pizzas: () => pizzas,
    amount: () => amount,
  },
  Pizza: {
    modifications(parent, args, ctx, info) {
      const id = parent.id;
      return modifications.reduce((prev, current) => {
        if (current.pizzasIds.includes(id))
          prev.push({
            id: current.id,
            dough: current.dough,
            price: current.price,
            size: current.size,
          });
        return prev;
      }, []);
    },
  },
  Mutation: {
    createOrder(_, { order: { totalPrice, totalAmount, orderedPizzas } }) {
      const newOrder = {
        id: uuidv4(),
        totalAmount,
        totalPrice,
        orderedPizzas,
      };

      orders.push(newOrder);

      fs.readFile("mocks/orders.json", "utf-8", function callback(err, data) {
        if (err) console.error(err);
        else {
          const ordersArr = JSON.parse(data);
          ordersArr.push(newOrder);
          const json = JSON.stringify(ordersArr);
          fs.writeFile("mocks/orders.json", json, "utf-8", () => newOrder);
        }
      });
      return newOrder;
    },
    updateAmount(_, { amount: newAmount = 0 }) {
      amount += newAmount;

      pubsub.publish("AMOUNT_UPDATED", { amountUpdated: amount });
      return amount;
    },
  },
  Subscription: {
    amountUpdated: {
      subscribe: () => pubsub.asyncIterator("AMOUNT_UPDATED"),
    },
  },
};

module.exports = resolvers;
