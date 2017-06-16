declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 43,
    date: 'Fri Jun 16 14:50:45 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
    categories: ['fractal'],
});
