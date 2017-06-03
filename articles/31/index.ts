declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 31,
    date: 'Sat May 27 17:29:48 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
    texture: require('./ginza.jpg'),
});
