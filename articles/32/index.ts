declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 32,
    date: 'Tue May 30 16:32:50 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
    sound: require('./bass.mp3'),
});
