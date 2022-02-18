export default class JSSLider {
    constructor( imageSelector , sliderRootSelector ) {
        this.imagesSelector = imageSelector;
        this.sliderRootSelector = sliderRootSelector;
    }

    run = () => {
        this.imagesList = document.querySelectorAll(this.imagesSelector);
        this.sliderRootElement = document.querySelector(this.sliderRootSelector);

        this.initEvents();
        this.initCustomEvents();

        this.interval;
    }

    initEvents = () => {
        this.imageEvent()
        this.navNextEvents()
        this.navPrevEvents()
        this.zoomEvents()
    }

    imageEvent = () => {
        this.imagesList.forEach( (item) =>  {
            item.addEventListener('click', (e) => {
                this.fireCustomEvent(e.currentTarget, 'js-slider-img-click');
                this.fireCustomEvent(this.sliderRootElement, 'js-slider-start');
            });
        });
    }

    navNextEvents = () => {
        const navNext = this.sliderRootElement.querySelector('.js-slider__nav--next');
        if(navNext) {
            navNext.addEventListener('click', () => {
                this.fireCustomEvent(this.sliderRootElement, 'js-slider-img-next')
            });

            navNext.addEventListener('mouseleave', () => {
                this.fireCustomEvent(this.sliderRootElement, 'js-slider-start')
            });

            navNext.addEventListener('mouseenter', () => {
                this.fireCustomEvent(this.sliderRootElement, 'js-slider-stop')
            });
        }
    }

    navPrevEvents = () => {
        const navPrev = this.sliderRootElement.querySelector('.js-slider__nav--prev');
        if(navPrev) {
            navPrev.addEventListener('click', () => {
                this.fireCustomEvent(this.sliderRootElement, 'js-slider-img-prev')
            });

             navPrev.addEventListener('mouseleave', () => {
                this.fireCustomEvent(this.sliderRootElement, 'js-slider-start')
            });

            navPrev.addEventListener('mouseenter', () => {
                this.fireCustomEvent(this.sliderRootElement, 'js-slider-stop')
            });
        }
    }

    zoomEvents = () => {
        const zoom = this.sliderRootElement.querySelector('.js-slider__zoom');
        if(zoom) {
            zoom.addEventListener('click', (e) => {
                if(e.target === e.currentTarget) {
                    this.fireCustomEvent(this.sliderRootElement, 'js-slider-close');
                    this.fireCustomEvent(this.sliderRootElement, 'js-slider-stop');
                }
            })
        }
    }

    fireCustomEvent = (element, name) => {
        console.log(element.className, '=>', name);

        const event = new CustomEvent(name, {
            bubbles: true,
        });

        element.dispatchEvent( event );
    }

    initCustomEvents = () => {
        this.imagesList.forEach( img => {
            img.addEventListener('js-slider-img-click', (event) => {
                this.onImageClick(event);
            });
        });

        this.sliderRootElement.addEventListener('js-slider-img-next', this.onImageNext);
        this.sliderRootElement.addEventListener('js-slider-img-prev', this.onImagePrev);
        this.sliderRootElement.addEventListener('js-slider-close', this.onClose);
        this.sliderRootElement.addEventListener('js-slider-start', this.startSlideShow);
        this.sliderRootElement.addEventListener('js-slider-stop', this.stopSlideShow);
    }


   onImageClick = (event) => {
       this.showSlider();
       this.setSliderImg(event.currentTarget);
       this.setSliderThumb(event);
    }

    onImageNext = (event) => {
        const currentImg = this.getCurrentImg();
        const nextElement = this.getNextElement(currentImg);

        nextElement === null ? this.setFirstImgSrc() : this.setNextImgSrc(nextElement);
        this.toggleCurrentClass();
    }

    onImagePrev = (event) => {
        const currentImg = this.getCurrentImg();
        const prevElement = this.getPrevElement(currentImg);

        prevElement.classList.contains('js-slider__thumbs-item--prototype') ? this.setLastImgSrc() : this.setPrevImgSrc(prevElement);
        this.toggleCurrentClass();
    }

    onClose = (event) => {
        this.closeSlider()
        this.clearSliderThumb()
    }

    showSlider = () => {
        this.sliderRootElement.classList.add('js-slider--active');
    }

    closeSlider = () => {
        this.sliderRootElement.classList.remove('js-slider--active');
    }

    setSliderImg = (selectedImg) => {
        const selectedImgSrc = selectedImg.querySelector('img').src;
        this.getSliderImg().src = selectedImgSrc;
    }

    setSliderThumb = (event) => {
        const thumbImagesList = this.getThumbImagesByGroupName(event);

        thumbImagesList.forEach( (item) => {
            const thumbItem = this.createThumbItem();
            this.setThumbItemImgSrc(thumbItem, item);
            this.toggleCurrentClass();
            this.getSliderThumb().appendChild(thumbItem);
        } )
    }

    clearSliderThumb = () => {
        const sliderThumb = this.getSliderThumb()
        const sliderThumbImgList = this.getSliderThumbImgList();
        sliderThumbImgList.forEach( item => sliderThumb.removeChild(item.parentElement) );
    }

    toggleCurrentClass = () => {
        const sliderImgSrc = this.getSliderImg().src;
        const sliderThumbImgList = this.getSliderThumbImgList()

        sliderThumbImgList.forEach( (img) => {
            img.src === sliderImgSrc ? img.classList.add('js-slider__thumbs-image--current') : img.classList.remove('js-slider__thumbs-image--current');
        })
    }

    getSliderThumbImgList = () => {
        return this.getSliderThumb().querySelectorAll('.js-slider__thumbs-item:not(.js-slider__thumbs-item--prototype) img');
    }

    getSliderThumb = () => {
        return this.sliderRootElement.querySelector('.js-slider__thumbs');
    }

    getThumbImagesByGroupName = (event) => {
        const groupName = event.currentTarget.dataset.sliderGroupName;
        return document.querySelectorAll(this.imagesSelector+'[data-slider-group-name='+ groupName +']');
    }

    setThumbItemImgSrc = (thumbItem, item) => {
        this.getThumbItemImg(thumbItem).src = item.querySelector('img').src;
    }

    getThumbItemImg = (thumbItem) => {
        return thumbItem.querySelector('img');
    }

    createThumbItem = () => {
        const thumbItem = this.getThumbItemPrototype().cloneNode(true);
        thumbItem.classList.remove('js-slider__thumbs-item--prototype');
        return thumbItem;
    }

    getThumbItemPrototype = () => {
        return this.sliderRootElement.querySelector('.js-slider__thumbs-item--prototype');
    }

    setNextImgSrc = (nextElement) => {
        const nextElementImgSrc = nextElement.querySelector('img').src;
        this.getSliderImg().src = nextElementImgSrc;
    }

    setFirstImgSrc = () => {
        const firstImgSrc = this.sliderRootElement.querySelector('.js-slider__thumbs-item:nth-child(2) img').src;
        this.getSliderImg().src = firstImgSrc;
    }

    setPrevImgSrc = (prevElement) => {
        const prevElementImgSrc = prevElement.querySelector('img').src;
        this.getSliderImg().src = prevElementImgSrc;
    }

    setLastImgSrc = () => {
        const lastImgSrc = this.sliderRootElement.querySelector('.js-slider__thumbs-item:last-child img').src;
        this.getSliderImg().src = lastImgSrc;
    }

    getNextElement = (currentImg) => {
        return currentImg.parentElement.nextElementSibling;
    }

    getPrevElement = (currentImg) => {
        return currentImg.parentElement.previousElementSibling;
    }

    getCurrentImg = () => {
        return this.sliderRootElement.querySelector('.js-slider__thumbs-image--current');
    }

    getSliderImg = () => {
        return this.sliderRootElement.querySelector('.js-slider__image');
    }

    startSlideShow = () => {
        this.interval = setInterval( () =>
            this.onImageNext(), 2000
        );
    }

    stopSlideShow = () => {
        clearInterval(this.interval)
    }

}