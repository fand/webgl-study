declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 10,
    date: 'Sat May 6 11:18:28 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
