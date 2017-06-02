declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 6,
    date: 'Thu May 4 09:06:53 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag')
});
