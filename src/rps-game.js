const { AutomaticGameEvent, Game, listen, } = requier("@leancloud/client-engine");
const { Event, } = require("@leancloud/play");
const _ = require("lodash");
const { tap } = require("rxjs/operators");

// [✊, ✌️, ✋] wins [✌️, ✋, ✊]
const wins = [1, 2, 0];

/**
 * 石头剪刀布游戏
 */
class RPSGame extends Game {
  static defaultSeatCount = 2;

  constructor(room, masterClient) {
    super(room, masterClient);
    // 游戏创建后立刻执行的逻辑
    this.once(AutomaticGameEvent.ROOM_FULL, this.start);
  }

  terminate() {
    // 将游戏 Room 的 open 属性标记为 false，不再允许用户加入了。
    // 客户端可以按照业务需求响应该属性的变化（例如对于还未开始的游戏，客户端可以重新发起加入新游戏请求）。
    this.masterClient.setRoomOpened(false);
    return super.terminate();
  }

  start = async () => {
    // 标记房间不再可加入
    this.masterClient.setRoomOpened(false);
    // 向客户端广播游戏开始事件
    this.broadcast("game-start");
    // 等待所有玩家都已做出选择的时刻
    const playPromise = Promise.all(this.players.map((player) =>
        this.takeFirst("play", player)
          // 向其他玩家转发出牌动作，但是隐藏具体的 choice
          .pipe(tap(_.bind(this.forwardToTheRests, this, _, () => ({}))))
          .toPromise(),
      ));
    // 监听 player 离开游戏事件
    const playerLeftPromise = listen(this.masterClient, Event.PLAYER_ROOM_LEFT);
    // 取上面两个事件先发生的那个作为结果
    const result = await Promise.race([playPromise, playerLeftPromise]);
    debug(result);
    let choices;
    let winner;
    if (Array.isArray(result)) {
      // 如果都已做出选择，比较得到赢家
      choices = result.map(({ eventData }) => eventData.index);
      winner = this.getWinner(choices);
    } else {
      // 如果某玩家离开了游戏，另一位玩家胜利
      winner = this.players.find((player) => player !== result.leftPlayer);
    }
    // 游戏结束
    // 向客户端广播游戏结果
    this.broadcast("game-over", {
      choices,
      winnerId: winner ? winner.userId : null,
    });
    debug("RPS end");
  }

  /**
   * 根据玩家的选择计算赢家
   * @return 返回胜利的 Player，或者 null 表示平局
   */
  getWinner([player1Choice, player2Choice]) {
    if (player1Choice === player2Choice) { return null; }
    if (wins[player1Choice] === player2Choice) { return this.players[0]; }
    return this.players[1];
  }
}
