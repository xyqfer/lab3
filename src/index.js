const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 首页仅起到响应健康检查的作用
app.get("/", (req, res) => {
  res.send(`
<p>这是 LeanCloud Client Engine 的服务端部分，客户端部分的示例代码在 https://github.com/leancloud/client-engine-demo-webapp
    `);
});

app.post('/furigana/translate-article', async (req, res) => {
  const Kuroshiro = require('kuroshiro');
  const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');

  const { content } = req.body;
  console.log(content);

  try {
    const kuroshiro = new Kuroshiro();
    await kuroshiro.init(new KuromojiAnalyzer());

    const result = await kuroshiro.convert(content, { 
        to: 'hiragana',
        mode: 'furigana',
    });

    res.json({
        success: true,
        data: {
            htmlContent: result,
        },
    });
  } catch (err) {
    console.error(err);
    res.json({
        success: false,
    });
  }
});
