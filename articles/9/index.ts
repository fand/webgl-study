declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 9,
    date: 'Sat May 6 09:55:34 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
