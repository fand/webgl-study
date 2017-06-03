declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 33,
    date: 'Thu Jun 1 07:00:54 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
    texture: require('./ginza.jpg'),
    sound: require('./bass.mp3'),
});
