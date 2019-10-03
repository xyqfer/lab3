import Kuroshiro = require('kuroshiro');
import KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');

const translate =  async (content) => {
    const kuroshiro = new Kuroshiro();
    await kuroshiro.init(new KuromojiAnalyzer());

    const result = await kuroshiro.convert(content, { 
        to: 'hiragana',
        mode: 'furigana',
    });

    return result;
};

export default translate;