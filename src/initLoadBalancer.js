const { LoadBalancerFactory, } = require("@leancloud/client-engine");
const Reception = require("./reception");
// const PRSGame = require("./rps-game");
const { Game, } = require("@leancloud/client-engine");
const { APP_ID, APP_KEY, MASTER_KEY } = require("./configs");

const initLoadBalancer = () => {
  const reception = new Reception(
    Game,
    APP_ID,
    APP_KEY,
    {
      concurrency: 2,
    },
  );
  
  const loadBalancerFactory = new LoadBalancerFactory({
    poolId: `${APP_ID.slice(0, 5)}-${process.env.LEANCLOUD_APP_ENV || "development"}`,
    redisUrl: process.env.REDIS_URL__CLIENT_ENGINE,
  });
  
  const loadBalancer = loadBalancerFactory
    .bind(reception, ["makeReservation", "createGameAndGetName"])
    .on("online", () => console.log("Load balancer online")).on("offline", () => {
      console.warn(
  `The load balancer can not connect to Redis server. Client Engine will keep running in standalone mode.
  It's probably fine if you are running it locally without a Redis server. Otherwise, check project configs.`,
      );
    });

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    try {
      await loadBalancer.close();
      setTimeout(() => {
        process.exit(0);
      }, 100);
    } catch (error) {
      // 如果发生了异常，什么都不做，Client Engine 在超时后会 SIGKILL 掉进程
      console.error("Closing LB failed:");
      console.error(error);
    }
  });
};

module.exports = initLoadBalancer;