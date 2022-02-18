import JSSlider from './JSSlider.js';

const init = () => {
    const imagesList = document.querySelectorAll('.gallery__item');

    imagesList.forEach( img => {
        img.dataset.sliderGroupName = Math.random() > 0.5 ? 'nice' : 'good';
    });

    const jsSlider = new JSSlider('.gallery__item' , '.js-slider');
    jsSlider.run();
}

document.addEventListener('DOMContentLoaded', init);
