declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 2,
    date: 'Wed May 3 15:14:00 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
