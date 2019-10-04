const { GameManager, } = require("@leancloud/client-engine");

class Reception extends GameManager {
  /**
   * 为指定玩家预约游戏，如果没有可用的游戏会创建一个新的游戏。
   * @param playerId 预约的玩家 ID
   * @return 预约成功的游戏的房间 name
   */
  async makeReservation(playerId) {
    let game;
    const availableGames = this.getAvailableGames();
    if (availableGames.length > 0) {
      game = availableGames[0];
      this.reserveSeats(game, playerId);
    } else {
      game = await this.createGame(playerId);
    }
    return game.room.name;
  }

  /**
   * 创建一个新的游戏。
   * @param playerId 预约的玩家 ID
   * @param options 创建新游戏时可以指定的一些配置项
   * @return 创建的游戏的房间 name
   */
  async createGameAndGetName(playerId, options) {
    const game = await this.createGame(playerId, options);
    return game.room.name;
  }
}

module.exports = Reception;
