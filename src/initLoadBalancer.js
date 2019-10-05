const { Game, GameManager, LoadBalancerFactory, } = require("@leancloud/client-engine");
const { APP_ID, APP_KEY, } = require("./configs");

const initLoadBalancer = () => {
  const reception = new GameManager(
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
    .bind(reception, [])
    .on("online", () => console.log("Load balancer online")).on("offline", () => {});

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